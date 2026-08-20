from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class LoginEntrada(BaseModel):
    nombreUsuario: str = Field(min_length=3, max_length=80)
    # La longitud se exige al crear usuarios; al iniciar sesión validamos la
    # contraseña en el controlador para responder 401, no un 422 técnico.
    password: str = Field(min_length=1, max_length=128)


class SesionRespuesta(BaseModel):
    token: str
    nombre: str
    nombreUsuario: str
    roles: list[str]


class CasoLista(BaseModel):
    id: UUID
    clave: str
    estado: str
    anonimo: bool
    resumen: str
    creadaEn: datetime
    tipos: list[str]


class CasoDetalle(CasoLista):
    respuestas: dict[str, Any]
    contacto: dict[str, str | None] | None
    personas: list[dict[str, Any]]


class EstadoEntrada(BaseModel):
    estado: str = Field(pattern="^(RECIBIDA|EVALUACION|INVESTIGACION|CERRADA)$")
    comentario: str | None = Field(default=None, max_length=1000)
