"""Registro de accesos sin incluir el contenido sensible de una denuncia."""
from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.auditoria import AuditoriaAcceso


class AuditoriaController:
    def registrar(self, db: Session, accion: str, exitoso: bool, denuncia_id: UUID | None = None, usuario_id: UUID | None = None) -> None:
        db.add(AuditoriaAcceso(DenunciaId=denuncia_id, UsuarioId=usuario_id, Accion=accion, Exitoso=exitoso, CreadoEn=datetime.now(timezone.utc)))


auditoria_controller = AuditoriaController()
