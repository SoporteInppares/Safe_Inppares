"""Crea o actualiza un usuario interno. Ejecute desde backend con el entorno virtual activo."""
import getpass
import sys
from datetime import datetime, timezone
from pathlib import Path

from passlib.context import CryptContext
from sqlalchemy import select

# Al ejecutar `python scripts/crear_usuario_admin.py`, Python toma `scripts/`
# como directorio inicial. Añadimos `backend/` para resolver el paquete `app`.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.database import SessionLocal
from app.models.usuario import Rol, Usuario, UsuarioRol

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

nombre = input("Nombre completo: ").strip()
nombre_usuario = input("Nombre de usuario: ").strip().lower()
password = getpass.getpass("Contraseña (mínimo 8 caracteres): ")
if not nombre or len(nombre_usuario) < 3 or len(password) < 8:
    raise SystemExit("Ingrese nombre, usuario de al menos 3 caracteres y una contraseña de al menos 8 caracteres.")

with SessionLocal() as db:
    usuario = db.scalar(select(Usuario).where(Usuario.NombreUsuario == nombre_usuario))
    if usuario is None:
        usuario = Usuario(NombreCompleto=nombre, NombreUsuario=nombre_usuario, Contrasena=password_context.hash(password), Activo=True, CreadoEn=datetime.now(timezone.utc))
        db.add(usuario)
        db.flush()
    else:
        usuario.NombreCompleto = nombre
        usuario.Contrasena = password_context.hash(password)
        usuario.Activo = True
    rol = db.scalar(select(Rol).where(Rol.Nombre == "ADMINISTRADOR"))
    if rol is None:
        raise SystemExit("No existe el rol ADMINISTRADOR. Ejecute primero 001_initial_schema.sql.")
    if db.get(UsuarioRol, (usuario.UsuarioId, rol.RolId)) is None:
        db.add(UsuarioRol(UsuarioId=usuario.UsuarioId, RolId=rol.RolId, AsignadoEn=datetime.now(timezone.utc)))
    db.commit()
print("Usuario administrador creado o actualizado correctamente.")
