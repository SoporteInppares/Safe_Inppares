import json
import secrets
from datetime import datetime, timezone
from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.denuncia import Denuncia, DenunciaContacto, DenunciaMensaje, DenunciaPersona, DenunciaTipo
from app.schemas.denuncia import DenunciaCrear, DenunciaSeguimiento, MensajeRespuesta

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class DenunciaController:
    def _nueva_clave(self, db: Session) -> str:
        while True:
            clave = f"INP-{secrets.token_hex(2).upper()}-{secrets.token_hex(2).upper()}"
            if db.scalar(select(Denuncia.DenunciaId).where(Denuncia.ClaveSeguimiento == clave)) is None:
                return clave

    def crear(self, db: Session, entrada: DenunciaCrear) -> str:
        ahora = datetime.now(timezone.utc)
        datos = entrada.data
        denuncia = Denuncia(ClaveSeguimiento=self._nueva_clave(db), ContrasenaHash=password_context.hash(entrada.password), EsAnonima=entrada.anonimo, EstadoActual="RECIBIDA", Resumen=entrada.resumen.strip(), DatosFormulario=json.dumps(datos, ensure_ascii=False), CreadaEn=ahora, ActualizadaEn=ahora)
        db.add(denuncia)
        db.flush()
        if not entrada.anonimo:
            nombres, correo, telefono = (str(datos.get(campo, "")).strip() or None for campo in ("nombres", "correo", "telefono"))
            if nombres or correo or telefono:
                db.add(DenunciaContacto(DenunciaId=denuncia.DenunciaId, Nombres=nombres, Correo=correo, Telefono=telefono, CreadoEn=ahora, ActualizadoEn=ahora))
        for tipo in datos.get("tipos", []):
            if isinstance(tipo, str) and tipo.strip():
                es_otro = tipo.startswith("Otro")
                detalle_otro = str(datos.get("tipoOtro", "")).strip() or None
                if es_otro and detalle_otro is None:
                    raise HTTPException(status_code=422, detail="Debe detallar el tipo de denuncia 'Otro'.")
                db.add(DenunciaTipo(DenunciaId=denuncia.DenunciaId, Tipo=tipo.strip(), EsOtro=es_otro, DetalleOtro=detalle_otro if es_otro else None))
        for persona in datos.get("grupo", []):
            if isinstance(persona, dict):
                db.add(DenunciaPersona(DenunciaId=denuncia.DenunciaId, Rol="DENUNCIANTE", Nombre=str(persona.get("nombre", "")).strip() or None, DocumentoIdentidad=str(persona.get("dni", "")).strip() or None, Correo=str(persona.get("correo", "")).strip() or None, Telefono=str(persona.get("telefono", "")).strip() or None, CreadoEn=ahora))
        for persona in datos.get("involucrados", []):
            if isinstance(persona, dict):
                db.add(DenunciaPersona(DenunciaId=denuncia.DenunciaId, Rol="INVOLUCRADO", Nombre=str(persona.get("nombre", "")).strip() or None, DocumentoIdentidad=str(persona.get("dni", "")).strip() or None, Cargo=str(persona.get("cargo", "")).strip() or None, CreadoEn=ahora))
        db.commit()
        return denuncia.ClaveSeguimiento

    def consultar(self, db: Session, clave: str, password: str) -> DenunciaSeguimiento:
        denuncia = db.scalar(select(Denuncia).where(Denuncia.ClaveSeguimiento == clave.strip().upper()))
        if denuncia is None or not password_context.verify(password, denuncia.ContrasenaHash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales de seguimiento inválidas.")
        mensajes = db.scalars(select(DenunciaMensaje).where(DenunciaMensaje.DenunciaId == denuncia.DenunciaId).order_by(DenunciaMensaje.CreadoEn)).all()
        return DenunciaSeguimiento(clave=denuncia.ClaveSeguimiento, createdAt=denuncia.CreadaEn, estado=denuncia.EstadoActual.title(), anonimo=denuncia.EsAnonima, resumen=denuncia.Resumen, archivos=[], mensajes=[MensajeRespuesta(autor="Comité de Ética — INPPARES" if m.AutorTipo == "COMITE" else "Denunciante", fecha=m.CreadoEn, texto=m.Texto) for m in mensajes])


denuncia_controller = DenunciaController()
