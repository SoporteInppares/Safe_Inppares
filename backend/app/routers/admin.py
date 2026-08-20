from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.controllers.admin_controller import admin_controller
from app.controllers.auditoria_controller import auditoria_controller
from app.core.database import get_db
from app.core.security import crear_token, validar_token
from app.models.usuario import Rol, Usuario, UsuarioRol
from app.schemas.admin import CasoDetalle, CasoLista, EstadoEntrada, LoginEntrada, SesionRespuesta

router = APIRouter(prefix="/api/admin", tags=["administración"])
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def sesion_actual(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Debe iniciar sesión.")
    return validar_token(authorization[7:])


def requiere_roles(*roles_permitidos: str):
    def validar(sesion: dict = Depends(sesion_actual)) -> dict:
        if not set(sesion["roles"]).intersection(roles_permitidos):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tiene permisos para esta operación.")
        return sesion
    return validar


@router.post("/sesion", response_model=SesionRespuesta)
def iniciar_sesion(entrada: LoginEntrada, db: Session = Depends(get_db)):
    usuario = db.scalar(select(Usuario).where(Usuario.NombreUsuario == entrada.nombreUsuario.lower().strip(), Usuario.Activo == True))  # noqa: E712
    if usuario is None or not usuario.Contrasena or not password_context.verify(entrada.password, usuario.Contrasena):
        auditoria_controller.registrar(db, "INICIO_SESION", False)
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario o contraseña incorrectos.")
    roles = list(db.scalars(select(Rol.Nombre).join(UsuarioRol, UsuarioRol.RolId == Rol.RolId).where(UsuarioRol.UsuarioId == usuario.UsuarioId)).all())
    if not roles:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="El usuario no tiene un rol asignado.")
    auditoria_controller.registrar(db, "INICIO_SESION", True, usuario_id=usuario.UsuarioId)
    db.commit()
    return SesionRespuesta(token=crear_token(str(usuario.UsuarioId), roles), nombre=usuario.NombreCompleto, nombreUsuario=usuario.NombreUsuario, roles=roles)


@router.get("/casos", response_model=list[CasoLista])
def listar_casos(db: Session = Depends(get_db), sesion: dict = Depends(requiere_roles("ADMINISTRADOR", "COMITE_ETICA", "AUDITOR"))):
    return admin_controller.listar_casos(db, UUID(sesion["sub"]))


@router.get("/casos/{denuncia_id}", response_model=CasoDetalle)
def obtener_caso(denuncia_id: UUID, db: Session = Depends(get_db), sesion: dict = Depends(requiere_roles("ADMINISTRADOR", "COMITE_ETICA", "AUDITOR"))):
    return admin_controller.obtener_caso(db, denuncia_id, UUID(sesion["sub"]))


@router.patch("/casos/{denuncia_id}/estado", status_code=status.HTTP_204_NO_CONTENT)
def cambiar_estado(denuncia_id: UUID, entrada: EstadoEntrada, db: Session = Depends(get_db), sesion: dict = Depends(requiere_roles("ADMINISTRADOR", "COMITE_ETICA"))):
    admin_controller.cambiar_estado(db, denuncia_id, entrada.estado, entrada.comentario, UUID(sesion["sub"]))
