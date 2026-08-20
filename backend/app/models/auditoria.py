from datetime import datetime
from uuid import UUID
from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, String
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class AuditoriaAcceso(Base):
    __tablename__ = "AuditoriaAcceso"
    AuditoriaAccesoId: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    DenunciaId: Mapped[UUID | None] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Denuncia.DenunciaId"))
    UsuarioId: Mapped[UUID | None] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Usuario.UsuarioId"))
    Accion: Mapped[str] = mapped_column(String(50))
    Exitoso: Mapped[bool] = mapped_column(Boolean)
    DireccionIp: Mapped[str | None] = mapped_column(String(45))
    Detalle: Mapped[str | None] = mapped_column(String(1000))
    CreadoEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))
