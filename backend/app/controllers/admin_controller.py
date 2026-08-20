import json
from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.controllers.auditoria_controller import auditoria_controller
from app.models.denuncia import Denuncia, DenunciaContacto, DenunciaHistorialEstado, DenunciaPersona, DenunciaTipo
from app.schemas.admin import CasoDetalle, CasoLista


class AdminController:
    def listar_casos(self, db: Session, usuario_id: UUID) -> list[CasoLista]:
        denuncias = db.scalars(select(Denuncia).order_by(Denuncia.CreadaEn.desc())).all()
        tipos_por_denuncia: dict[UUID, list[str]] = {}
        for tipo in db.scalars(select(DenunciaTipo)).all():
            tipos_por_denuncia.setdefault(tipo.DenunciaId, []).append(tipo.Tipo)
        auditoria_controller.registrar(db, "LISTAR_DENUNCIAS", True, usuario_id=usuario_id)
        db.commit()
        return [CasoLista(id=d.DenunciaId, clave=d.ClaveSeguimiento, estado=d.EstadoActual, anonimo=d.EsAnonima, resumen=d.Resumen, creadaEn=d.CreadaEn, tipos=tipos_por_denuncia.get(d.DenunciaId, [])) for d in denuncias]

    def obtener_caso(self, db: Session, denuncia_id: UUID, usuario_id: UUID) -> CasoDetalle:
        denuncia = db.get(Denuncia, denuncia_id)
        if denuncia is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado.")
        contacto = db.get(DenunciaContacto, denuncia_id)
        personas = db.scalars(select(DenunciaPersona).where(DenunciaPersona.DenunciaId == denuncia_id)).all()
        tipos = db.scalars(select(DenunciaTipo.Tipo).where(DenunciaTipo.DenunciaId == denuncia_id)).all()
        auditoria_controller.registrar(db, "VER_DENUNCIA", True, denuncia_id=denuncia_id, usuario_id=usuario_id)
        db.commit()
        try:
            respuestas = json.loads(denuncia.DatosFormulario)
        except json.JSONDecodeError:
            respuestas = {}
        return CasoDetalle(id=denuncia.DenunciaId, clave=denuncia.ClaveSeguimiento, estado=denuncia.EstadoActual, anonimo=denuncia.EsAnonima, resumen=denuncia.Resumen, creadaEn=denuncia.CreadaEn, tipos=list(tipos), respuestas=respuestas, contacto={"nombres": contacto.Nombres, "correo": contacto.Correo, "telefono": contacto.Telefono} if contacto else None, personas=[{"rol": p.Rol, "nombre": p.Nombre, "documento": p.DocumentoIdentidad, "cargo": p.Cargo, "correo": p.Correo, "telefono": p.Telefono} for p in personas])

    def cambiar_estado(self, db: Session, denuncia_id: UUID, estado: str, comentario: str | None, usuario_id: UUID) -> None:
        denuncia = db.get(Denuncia, denuncia_id)
        if denuncia is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado.")
        anterior = denuncia.EstadoActual
        denuncia.EstadoActual = estado
        denuncia.ActualizadaEn = datetime.now(timezone.utc)
        denuncia.CerradaEn = datetime.now(timezone.utc) if estado == "CERRADA" else None
        db.add(DenunciaHistorialEstado(DenunciaId=denuncia_id, EstadoAnterior=anterior, EstadoNuevo=estado, Comentario=comentario.strip() if comentario else None, CambiadoPorUsuarioId=usuario_id, CreadoEn=datetime.now(timezone.utc)))
        auditoria_controller.registrar(db, "CAMBIAR_ESTADO_DENUNCIA", True, denuncia_id=denuncia_id, usuario_id=usuario_id)
        db.commit()


admin_controller = AdminController()
