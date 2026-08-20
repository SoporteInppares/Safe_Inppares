from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.controllers.denuncia_controller import denuncia_controller
from app.core.database import get_db
from app.schemas.denuncia import CredencialesSeguimiento, DenunciaCreada, DenunciaCrear, DenunciaSeguimiento

router = APIRouter(prefix="/api/denuncias", tags=["denuncias"])


@router.post("", response_model=DenunciaCreada, status_code=201)
def crear_denuncia(entrada: DenunciaCrear, db: Session = Depends(get_db)):
    return DenunciaCreada(clave=denuncia_controller.crear(db, entrada))


@router.post("/{clave}/seguimiento", response_model=DenunciaSeguimiento)
def consultar_seguimiento(clave: str, entrada: CredencialesSeguimiento, db: Session = Depends(get_db)):
    return denuncia_controller.consultar(db, clave, entrada.password)
