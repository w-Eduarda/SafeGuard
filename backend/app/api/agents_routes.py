"""
Rotas para Agentes Inteligentes e Análise de Risco
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.agents import osint_agent
from typing import List

router = APIRouter(prefix="/agents", tags=["Agents"])

@router.post("/scan-all/{user_id}")
async def trigger_auto_scan(user_id: int, db: Session = Depends(get_db)):
    """
    Dispara varredura automática em todos os itens monitorados
    """
    try:
        result = await osint_agent.auto_scan_monitored_items(db, user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/risk-analysis/{user_id}")
def get_risk_analysis(user_id: int, db: Session = Depends(get_db)):
    """
    Retorna análise de risco do usuário
    """
    try:
        analysis = osint_agent.analyze_risk_level(db, user_id)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    """
    Retorna recomendações personalizadas para o usuário
    """
    try:
        recommendations = osint_agent.generate_recommendations(db, user_id)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/priority-actions/{user_id}")
def get_priority_actions(user_id: int, db: Session = Depends(get_db)):
    """
    Retorna ações prioritárias para o usuário
    """
    try:
        actions = osint_agent.get_priority_actions(db, user_id)
        return {"actions": actions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/should-scan/{user_id}")
def check_scan_needed(user_id: int, hours: int = 24, db: Session = Depends(get_db)):
    """
    Verifica se uma nova varredura deve ser disparada
    """
    try:
        should_scan = osint_agent.should_trigger_scan(db, user_id, hours)
        return {"should_scan": should_scan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
