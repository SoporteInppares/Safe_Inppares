"""Casos de uso de usuarios y roles; se ampliará con autenticación del personal."""
from sqlalchemy.orm import Session
from app.models.usuario import Usuario


class UsuarioController:
    def buscar_activo_por_nombre_usuario(self, db: Session, nombre_usuario: str) -> Usuario | None:
        return db.query(Usuario).filter(Usuario.NombreUsuario == nombre_usuario.lower(), Usuario.Activo == True).one_or_none()  # noqa: E712


usuario_controller = UsuarioController()
