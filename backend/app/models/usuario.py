from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Rol(Base):
    __tablename__ = "Rol"
    RolId: Mapped[int] = mapped_column(Integer, primary_key=True)
    Nombre: Mapped[str] = mapped_column(String(50), unique=True)
    Descripcion: Mapped[str | None] = mapped_column(String(250))


class Usuario(Base):
    __tablename__ = "Usuario"
    UsuarioId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, primary_key=True, default=uuid4)
    NombreCompleto: Mapped[str] = mapped_column(String(200))
    NombreUsuario: Mapped[str] = mapped_column(String(80), unique=True)
    # El nombre de columna es simple, pero su contenido siempre es un hash bcrypt.
    Contrasena: Mapped[str] = mapped_column(String(255))
    Activo: Mapped[bool] = mapped_column(Boolean, default=True)
    CreadoEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    DesactivadoEn: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class UsuarioRol(Base):
    __tablename__ = "UsuarioRol"
    UsuarioId: Mapped[UUID] = mapped_column(UNIQUEIDENTIFIER, ForeignKey("Usuario.UsuarioId"), primary_key=True)
    RolId: Mapped[int] = mapped_column(Integer, ForeignKey("Rol.RolId"), primary_key=True)
    AsignadoEn: Mapped[datetime] = mapped_column(DateTime(timezone=True))
