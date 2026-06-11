"""
Agentes Inteligentes para Automação de OSINT
Realiza varreduras automáticas, análise de risco e recomendações
"""

from sqlalchemy.orm import Session
from app.models import models
from app.services.osint_real import osint_real_service
from app.services import crud
from typing import List, Dict
import asyncio
from datetime import datetime, timedelta

class OSINTAgent:
    """
    Agente inteligente que automatiza varreduras OSINT
    e gera recomendações baseadas em risco
    """
    
    @staticmethod
    async def auto_scan_monitored_items(db: Session, user_id: int):
        """
        Executa varredura automática em todos os itens monitorados do usuário
        """
        print(f"[AGENT] Iniciando varredura automática para usuário {user_id}...")
        
        try:
            # Obtém todos os itens monitorados
            items = crud.get_monitored_items(db, user_id)
            
            results = []
            for item in items:
                print(f"[AGENT] Varredura: {item.item_type} - {item.value}")
                
                result = await osint_real_service.run_scan(
                    db, user_id, item.id, item.value, item.item_type
                )
                
                results.append({
                    "item_id": item.id,
                    "item_value": item.value,
                    "discoveries": result.get("discoveries_count", 0),
                    "status": result.get("status")
                })
            
            print(f"[AGENT] Varredura automática concluída. {len(results)} itens processados.")
            
            return {
                "status": "completed",
                "items_scanned": len(results),
                "results": results
            }
        
        except Exception as e:
            print(f"[AGENT] Erro na varredura automática: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    @staticmethod
    def analyze_risk_level(db: Session, user_id: int) -> Dict:
        """
        Analisa o nível de risco geral do usuário
        baseado em descobertas
        """
        try:
            discoveries = crud.get_discoveries(db, user_id, limit=1000)
            
            if not discoveries:
                return {
                    "risk_level": "low",
                    "score": 0,
                    "critical": 0,
                    "high": 0,
                    "medium": 0,
                    "low": 0,
                    "resolved": 0
                }
            
            # Conta por severidade
            critical = sum(1 for d in discoveries if d.severity == "critical")
            high = sum(1 for d in discoveries if d.severity == "high")
            medium = sum(1 for d in discoveries if d.severity == "medium")
            low = sum(1 for d in discoveries if d.severity == "low")
            resolved = sum(1 for d in discoveries if d.resolved)
            
            # Calcula score de risco (0-100)
            total = len(discoveries)
            risk_score = (
                (critical * 25 + high * 15 + medium * 8 + low * 2) / max(1, total)
            ) * 2
            risk_score = min(100, risk_score)
            
            # Determina nível de risco
            if risk_score >= 75:
                risk_level = "critical"
            elif risk_score >= 50:
                risk_level = "high"
            elif risk_score >= 25:
                risk_level = "medium"
            else:
                risk_level = "low"
            
            return {
                "risk_level": risk_level,
                "score": round(risk_score, 2),
                "critical": critical,
                "high": high,
                "medium": medium,
                "low": low,
                "resolved": resolved,
                "total_discoveries": total,
                "unresolved": total - resolved
            }
        
        except Exception as e:
            print(f"[AGENT] Erro ao analisar risco: {str(e)}")
            return {"risk_level": "unknown", "error": str(e)}
    
    @staticmethod
    def generate_recommendations(db: Session, user_id: int) -> List[str]:
        """
        Gera recomendações personalizadas baseadas em descobertas
        """
        try:
            risk_analysis = OSINTAgent.analyze_risk_level(db, user_id)
            recommendations = []
            
            # Recomendações baseadas no nível de risco
            if risk_analysis["risk_level"] == "critical":
                recommendations.append("⚠️ CRÍTICO: Você tem descobertas críticas. Tome ação imediata!")
                recommendations.append("🔐 Altere todas as suas senhas imediatamente")
                recommendations.append("📞 Considere congelar seu crédito")
            
            if risk_analysis["critical"] > 0:
                recommendations.append(f"🚨 Você tem {risk_analysis['critical']} descoberta(s) crítica(s)")
            
            if risk_analysis["high"] > 0:
                recommendations.append(f"⚠️ Você tem {risk_analysis['high']} descoberta(s) de alto risco")
            
            if risk_analysis["unresolved"] > 5:
                recommendations.append("📋 Você tem muitas descobertas não resolvidas. Priorize as críticas")
            
            if risk_analysis["resolved"] == 0 and risk_analysis["total_discoveries"] > 0:
                recommendations.append("✅ Comece a resolver as descobertas para reduzir seu risco")
            
            # Recomendações de monitoramento
            items = crud.get_monitored_items(db, user_id)
            if len(items) < 3:
                recommendations.append("📧 Adicione mais itens para monitorar (email, CPF, telefone)")
            
            # Recomendações de segurança geral
            if risk_analysis["score"] > 0:
                recommendations.append("🔒 Ative autenticação de dois fatores em suas contas principais")
                recommendations.append("🛡️ Use um gerenciador de senhas para manter senhas únicas")
            
            return recommendations if recommendations else ["✅ Sua segurança está em bom estado"]
        
        except Exception as e:
            print(f"[AGENT] Erro ao gerar recomendações: {str(e)}")
            return ["Erro ao gerar recomendações"]
    
    @staticmethod
    def get_priority_actions(db: Session, user_id: int) -> List[Dict]:
        """
        Retorna ações prioritárias para o usuário
        """
        try:
            discoveries = crud.get_discoveries(db, user_id, limit=1000)
            
            # Filtra descobertas não resolvidas, ordenadas por severidade
            unresolved = [d for d in discoveries if not d.resolved]
            unresolved.sort(
                key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(x.severity, 4)
            )
            
            actions = []
            for discovery in unresolved[:5]:  # Top 5 ações prioritárias
                actions.append({
                    "discovery_id": discovery.id,
                    "severity": discovery.severity,
                    "description": discovery.description,
                    "url": discovery.url,
                    "data_type": discovery.data_type,
                    "priority": "URGENT" if discovery.severity == "critical" else "HIGH" if discovery.severity == "high" else "MEDIUM"
                })
            
            return actions
        
        except Exception as e:
            print(f"[AGENT] Erro ao obter ações prioritárias: {str(e)}")
            return []
    
    @staticmethod
    def should_trigger_scan(db: Session, user_id: int, hours: int = 24) -> bool:
        """
        Determina se uma nova varredura deve ser disparada
        baseada na última varredura
        """
        try:
            items = crud.get_monitored_items(db, user_id)
            
            if not items:
                return True
            
            # Verifica se algum item não foi varredido nos últimas N horas
            now = datetime.utcnow()
            threshold = now - timedelta(hours=hours)
            
            for item in items:
                if not item.updated_at or item.updated_at < threshold:
                    return True
            
            return False
        
        except Exception as e:
            print(f"[AGENT] Erro ao verificar necessidade de scan: {str(e)}")
            return False

# Instância global do agente
osint_agent = OSINTAgent()
