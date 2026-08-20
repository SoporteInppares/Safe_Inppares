"""Autenticación interna mediante tokens firmados sin dependencias adicionales."""
import base64
import hashlib
import hmac
import json
import time
from typing import Any

from fastapi import HTTPException, status

from app.core.database import settings


def _secret() -> bytes:
    if not settings.admin_session_secret or len(settings.admin_session_secret) < 15:
        raise RuntimeError("Configure ADMIN_SESSION_SECRET (mínimo 32 caracteres) en backend/.env.")
    return settings.admin_session_secret.encode("utf-8")


def crear_token(usuario_id: str, roles: list[str]) -> str:
    payload = {"sub": usuario_id, "roles": roles, "exp": int(time.time()) + 8 * 60 * 60}
    encoded = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).rstrip(b"=")
    firma = hmac.new(_secret(), encoded, hashlib.sha256).digest()
    return f"{encoded.decode()}.{base64.urlsafe_b64encode(firma).rstrip(b'=').decode()}"


def validar_token(token: str) -> dict[str, Any]:
    try:
        contenido, firma = token.split(".", 1)
        esperado = hmac.new(_secret(), contenido.encode(), hashlib.sha256).digest()
        firma_bytes = base64.urlsafe_b64decode(firma + "=" * (-len(firma) % 4))
        if not hmac.compare_digest(esperado, firma_bytes):
            raise ValueError("firma")
        datos = json.loads(base64.urlsafe_b64decode(contenido + "=" * (-len(contenido) % 4)))
        if not isinstance(datos.get("roles"), list) or int(datos["exp"]) < time.time():
            raise ValueError("vencido")
        return datos
    except (ValueError, KeyError, TypeError, json.JSONDecodeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sesión inválida o vencida.")
