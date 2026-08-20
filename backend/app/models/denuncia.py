"""Mapeo SQLAlchemy de las tablas creadas en sql/001_initial_schema.sql."""
from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Denuncia(Base):
    __tablename__ = "Denuncia"
    DenunciaId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, primary_key=True, default=uuid4)
    ClaveSeguimiento: Mapped[str] = mapped_column(String(40), unique=True)
    ContrasenaHash: Mapped[str] = mapped_column(String(255))
    EsAnonima: Mapped[bool] = mapped_column(Boolean)
    EstadoActual: Mapped[str] = mapped_column(String(30), default="RECIBIDA")
    Resumen: Mapped[str] = mapped_column(Text)
    DatosFormulario: Mapped[str] = mapped_column(Text, default="{}")
    CreadaEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ActualizadaEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    CerradaEn: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class DenunciaContacto(Base):
    __tablename__ = "DenunciaContacto"
    DenunciaId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Denuncia.DenunciaId"), primary_key=True)
    Nombres: Mapped[str | None] = mapped_column(String(250))
    Telefono: Mapped[str | None] = mapped_column(String(50))
    Correo: Mapped[str | None] = mapped_column(String(320))
    CreadoEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ActualizadoEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class DenunciaPersona(Base):
    __tablename__ = "DenunciaPersona"
    DenunciaPersonaId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, primary_key=True, default=uuid4)
    DenunciaId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Denuncia.DenunciaId"))
    Rol: Mapped[str] = mapped_column(String(20))
    Nombre: Mapped[str | None] = mapped_column(String(250))
    DocumentoIdentidad: Mapped[str | None] = mapped_column(String(50))
    Cargo: Mapped[str | None] = mapped_column(String(200))
    Correo: Mapped[str | None] = mapped_column(String(320))
    Telefono: Mapped[str | None] = mapped_column(String(50))
    CreadoEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class DenunciaTipo(Base):
    __tablename__ = "DenunciaTipo"
    DenunciaId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Denuncia.DenunciaId"), primary_key=True)
    Tipo: Mapped[str] = mapped_column(String(150), primary_key=True)
    EsOtro: Mapped[bool] = mapped_column(Boolean, default=False)
    DetalleOtro: Mapped[str | None] = mapped_column(String(500))


class DenunciaAdjunto(Base):
    __tablename__ = "DenunciaAdjunto"
    AdjuntoId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, primary_key=True, default=uuid4)
    DenunciaId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Denuncia.DenunciaId"))
    NombreOriginal: Mapped[str] = mapped_column(String(260))
    TipoContenido: Mapped[str] = mapped_column(String(150))
    TamanoBytes: Mapped[int] = mapped_column(BigInteger)
    ReferenciaAlmacenamiento: Mapped[str] = mapped_column(String(500), unique=True)
    HashSha256: Mapped[str | None] = mapped_column(String(64))
    CargadoEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    EliminadoEn: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class DenunciaMensaje(Base):
    __tablename__ = "DenunciaMensaje"
    MensajeId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, primary_key=True, default=uuid4)
    DenunciaId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Denuncia.DenunciaId"))
    AutorTipo: Mapped[str] = mapped_column(String(20))
    UsuarioId: Mapped[UUID | None] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Usuario.UsuarioId"))
    Texto: Mapped[str] = mapped_column(String(4000))
    CreadoEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    LeidoPorDenuncianteEn: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class DenunciaHistorialEstado(Base):
    __tablename__ = "DenunciaHistorialEstado"
    HistorialEstadoId: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    DenunciaId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Denuncia.DenunciaId"))
    EstadoAnterior: Mapped[str | None] = mapped_column(String(30))
    EstadoNuevo: Mapped[str] = mapped_column(String(30))
    Comentario: Mapped[str | None] = mapped_column(String(1000))
    CambiadoPorUsuarioId: Mapped[UUID | None] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Usuario.UsuarioId"))
    CreadoEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))

