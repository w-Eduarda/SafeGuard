# SafeGuard OSINT - Implementação Funcional

## 📋 Visão Geral

Este documento descreve a implementação completa de scripts OSINT funcionais, integração com IA Generativa e agentes inteligentes para o SafeGuard.

## 🚀 Funcionalidades Implementadas

### 1. **Scripts OSINT Reais** (`backend/app/services/osint_real.py`)

#### APIs Integradas:
- **HaveIBeenPwned**: Busca real de emails em bases de vazamentos conhecidas
- **BreachDirectory**: Busca em diretório de breaches
- **Dark Web Simulation**: Simulação realista de descobertas em Dark Web

#### Funcionalidades:
```python
# Busca em HaveIBeenPwned
await osint_real_service.search_haveibeenpwned(email)

# Busca em BreachDirectory
await osint_real_service.search_breachdirectory(email)

# Simulação Dark Web
await osint_real_service.search_dark_web_simulation(email, cpf)

# Varredura Completa
await osint_real_service.run_scan(db, user_id, item_id, item_value, item_type)
```

### 2. **IA Generativa** 

#### Contextualização de Descobertas:
- Gera descrições humanizadas de vazamentos
- Explica o impacto para o usuário
- Integração com APIs de IA (OpenAI, etc.)

#### Guias de Mitigação Personalizados:
- Passos práticos por tipo de dado
- Links relevantes para ação
- Tempo estimado de resolução

### 3. **Agentes Inteligentes** (`backend/app/services/agents.py`)

#### Funcionalidades:
- **Auto Scan**: Varredura automática em todos os itens monitorados
- **Risk Analysis**: Análise de risco com score 0-100
- **Recommendations**: Recomendações personalizadas baseadas em risco
- **Priority Actions**: Ações prioritárias ordenadas por severidade
- **Smart Scheduling**: Determina quando fazer nova varredura

#### Exemplo de Uso:
```python
# Análise de Risco
risk = osint_agent.analyze_risk_level(db, user_id)
# Retorna: {
#   "risk_level": "high",
#   "score": 65.5,
#   "critical": 2,
#   "high": 3,
#   "medium": 5,
#   "low": 10,
#   "resolved": 5,
#   "unresolved": 15
# }

# Recomendações
recommendations = osint_agent.generate_recommendations(db, user_id)
# Retorna lista de recomendações personalizadas

# Ações Prioritárias
actions = osint_agent.get_priority_actions(db, user_id)
# Retorna top 5 ações ordenadas por severidade
```

## 📡 Endpoints da API

### OSINT Scanning
```
POST /users/{user_id}/scan/{item_id}
Dispara varredura OSINT em um item específico
```

### Agentes Inteligentes
```
POST /agents/scan-all/{user_id}
Varredura automática em todos os itens

GET /agents/risk-analysis/{user_id}
Análise de risco do usuário

GET /agents/recommendations/{user_id}
Recomendações personalizadas

GET /agents/priority-actions/{user_id}
Ações prioritárias

GET /agents/should-scan/{user_id}?hours=24
Verifica se nova varredura é necessária
```

## 🔧 Instalação e Setup

### Backend

1. **Instalar dependências**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Configurar variáveis de ambiente** (`.env`):
```
DATABASE_URL=postgresql://user:password@localhost/safeguard
OPENAI_API_KEY=sk-...
HIBP_API_KEY=... (opcional)
```

3. **Iniciar servidor**:
```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend

1. **Instalar dependências**:
```bash
cd frontend
npm install
```

2. **Configurar variáveis de ambiente** (`.env.local`):
```
VITE_API_URL=http://localhost:8000
```

3. **Iniciar servidor de desenvolvimento**:
```bash
npm run dev
```

## 📊 Fluxo de Dados

```
Usuario adiciona item para monitorar
         ↓
Frontend envia POST /users/{id}/monitored_items/
         ↓
Backend armazena no banco de dados
         ↓
Usuario clica "Varrer" ou agente dispara auto-scan
         ↓
Backend executa osint_real_service.run_scan()
         ↓
Busca em múltiplas fontes (HIBP, BreachDirectory, Dark Web)
         ↓
Para cada descoberta:
  - Gera descrição com IA
  - Cria registro no banco
  - Gera alerta
  - Cria guia de mitigação com IA
         ↓
Frontend exibe descobertas e recomendações
```

## 🎯 Casos de Uso

### 1. Monitoramento Proativo
```javascript
// Frontend
const { autoScanAll } = useOsint(userId);
await autoScanAll(); // Varredura em todos os itens
```

### 2. Análise de Risco em Tempo Real
```javascript
const { getRiskAnalysis } = useOsint(userId);
const risk = await getRiskAnalysis();
// Exibe score, recomendações, ações prioritárias
```

### 3. Recomendações Personalizadas
```javascript
const { getRecommendations } = useOsint(userId);
const recommendations = await getRecommendations();
// Exibe lista de ações recomendadas
```

## 🔐 Segurança

- Todas as requisições requerem autenticação
- Dados sensíveis não são armazenados em logs
- Integração com APIs seguras (HTTPS)
- Validação de entrada em todos os endpoints

## 📈 Performance

- Requisições assíncronas para não bloquear UI
- Cache de resultados quando apropriado
- Limite de taxa (rate limiting) nas APIs externas
- Processamento em background para varreduras longas

## 🐛 Troubleshooting

### Erro: "API não responde"
- Verificar se backend está rodando: `http://localhost:8000/docs`
- Verificar variáveis de ambiente
- Verificar conexão com banco de dados

### Erro: "Descobertas não aparecem"
- Verificar logs do backend
- Verificar se item foi criado corretamente
- Verificar se varredura foi disparada

### Erro: "IA não gera descrições"
- Verificar se OPENAI_API_KEY está configurada
- Verificar limite de requisições da API
- Verificar logs para detalhes do erro

## 📝 Próximos Passos

1. **Integração com mais APIs**: Shodan, Censys, etc.
2. **Machine Learning**: Detecção de padrões de risco
3. **Webhooks**: Notificações em tempo real
4. **Relatórios Automáticos**: Geração de PDFs
5. **Integração com SIEM**: Envio de dados para ferramentas de segurança

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API em:
`http://localhost:8000/docs`
