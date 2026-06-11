from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.database import engine, Base, get_db
from app.api import auth, agents_routes
from app.models import models
from app.schemas import schemas
from app.services import crud, osint
from app.services.osint_real import osint_real_service

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SafeGuard OSINT API",
    description="API para monitoramento de exposição de dados e inteligência de código aberto.",
    version="0.1.0",
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(agents_routes.router)

@app.get("/", tags=["Status"])
async def read_root():
    return {
        "message": "SafeGuard OSINT API está online!",
        "version": "0.2.0",
        "features": ["OSINT Real", "IA Generativa", "Dark Web Monitoring"]
    }

# Rotas para Monitored Items
@app.post("/users/{user_id}/monitored_items/", response_model=schemas.MonitoredItem, tags=["Monitored Items"])
def create_monitored_item_for_user(
    user_id: int, item: schemas.MonitoredItemCreate, db: Session = Depends(get_db)
):
    # Aqui você adicionaria a lógica de autenticação para garantir que o usuário_id seja o usuário logado
    return crud.create_monitored_item(db=db, item=item, user_id=user_id)

@app.get("/users/{user_id}/monitored_items/", response_model=List[schemas.MonitoredItem], tags=["Monitored Items"])
def read_monitored_items(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Aqui você adicionaria a lógica de autenticação para garantir que o usuário_id seja o usuário logado
    items = crud.get_monitored_items(db, user_id=user_id, skip=skip, limit=limit)
    return items

# Rotas para Discoveries
@app.post("/users/{user_id}/discoveries/", response_model=schemas.Discovery, tags=["Discoveries"])
def create_discovery_for_user(
    user_id: int, discovery: schemas.DiscoveryCreate, db: Session = Depends(get_db)
):
    # Aqui você adicionaria a lógica de autenticação para garantir que o usuário_id seja o usuário logado
    return crud.create_discovery(db=db, discovery=discovery, user_id=user_id)

@app.get("/users/{user_id}/discoveries/", response_model=List[schemas.Discovery], tags=["Discoveries"])
def read_discoveries(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Aqui você adicionaria a lógica de autenticação para garantir que o usuário_id seja o usuário logado
    discoveries = crud.get_discoveries(db, user_id=user_id, skip=skip, limit=limit)
    return discoveries

# Rotas para Alerts
@app.post("/users/{user_id}/alerts/", response_model=schemas.Alert, tags=["Alerts"])
def create_alert_for_user(
    user_id: int, alert: schemas.AlertCreate, db: Session = Depends(get_db)
):
    # Aqui você adicionaria a lógica de autenticação para garantir que o usuário_id seja o usuário logado
    return crud.create_alert(db=db, alert=alert, user_id=user_id)

@app.get("/users/{user_id}/alerts/", response_model=List[schemas.Alert], tags=["Alerts"])
def read_alerts(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Aqui você adicionaria a lógica de autenticação para garantir que o usuário_id seja o usuário logado
    alerts = crud.get_alerts(db, user_id=user_id, skip=skip, limit=limit)
    return alerts

# Endpoint para disparar scan OSINT REAL
@app.post("/users/{user_id}/scan/{item_id}", tags=["OSINT"])
async def trigger_scan(user_id: int, item_id: int, db: Session = Depends(get_db)):
    """
    Dispara uma varredura OSINT real em múltiplas fontes.
    Busca em HaveIBeenPwned, BreachDirectory e Dark Web.
    """
    # Obtém o item monitorado
    item = crud.get_monitored_item(db, item_id)
    if not item or item.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    
    # Executa varredura real
    result = await osint_real_service.run_scan(
        db, user_id, item_id, item.value, item.item_type
    )
    return result
