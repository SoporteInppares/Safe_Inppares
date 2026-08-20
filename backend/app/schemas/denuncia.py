from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class DenunciaCrear(BaseModel):
    password: str = Field(min_length=4, max_length=64)
    anonimo: bool
    resumen: str = Field(min_length=30, max_length=5000)
    data: dict[str, Any]


class CredencialesSeguimiento(BaseModel):
    password: str = Field(min_length=1, max_length=64)


class DenunciaCreada(BaseModel):
    clave: str


class MensajeRespuesta(BaseModel):
    autor: str
    fecha: datetime
    texto: str


class DenunciaSeguimiento(BaseModel):
    clave: str
    createdAt: datetime
    estado: str
    anonimo: bool
    resumen: str
    archivos: list[str]
    mensajes: list[MensajeRespuesta]
