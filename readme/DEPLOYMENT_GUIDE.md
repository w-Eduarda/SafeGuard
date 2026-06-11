# SafeGuard OSINT - Guia de Deployment

## 🚀 Deployment Local (Desenvolvimento)

### Pré-requisitos
- Python 3.9+
- Node.js 16+
- npm ou yarn
- SQLite (incluído no Python)

### Backend

1. **Instalar dependências**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Criar arquivo `.env`**:
```bash
cat > .env << EOF
DATABASE_URL=sqlite:///./safeguard.db
OPENAI_API_KEY=sk-your-key-here
ENVIRONMENT=development
DEBUG=true
EOF
```

3. **Iniciar servidor**:
```bash
uvicorn app.main:app --reload --port 8000
```

O servidor estará disponível em: `http://localhost:8000`

Documentação interativa: `http://localhost:8000/docs`

### Frontend

1. **Instalar dependências**:
```bash
cd frontend
npm install
```

2. **Criar arquivo `.env.local`**:
```bash
cat > .env.local << EOF
VITE_API_URL=http://localhost:8000
EOF
```

3. **Iniciar servidor de desenvolvimento**:
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

## 🌐 Deployment em Produção

### Opção 1: Docker (Recomendado)

1. **Criar Dockerfile para Backend**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Criar Dockerfile para Frontend**:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **Docker Compose**:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/safeguard
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - db
    volumes:
      - ./backend:/app

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://localhost:8000

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: safeguard
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Opção 2: Railway, Render ou Heroku

#### Railway

1. **Conectar repositório**:
```bash
railway link
```

2. **Configurar variáveis de ambiente**:
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

3. **Deploy automático**:
```bash
railway up
```

#### Render

1. **Criar `render.yaml`**:
```yaml
services:
  - type: web
    name: safeguard-backend
    runtime: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
    envVars:
      - key: DATABASE_URL
        scope: build,runtime
      - key: OPENAI_API_KEY
        scope: build,runtime

  - type: web
    name: safeguard-frontend
    runtime: node
    buildCommand: cd frontend && npm install && npm run build
    startCommand: npm run preview
```

2. **Deploy**:
```bash
git push origin main
```

---

## 📊 Configuração de Banco de Dados

### SQLite (Desenvolvimento)
Automático, nenhuma configuração necessária.

### PostgreSQL (Produção)

1. **Criar banco de dados**:
```sql
CREATE DATABASE safeguard;
CREATE USER safeguard_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE safeguard TO safeguard_user;
```

2. **Configurar variável de ambiente**:
```
DATABASE_URL=postgresql://safeguard_user:secure_password@localhost:5432/safeguard
```

3. **Executar migrations**:
```bash
cd backend
alembic upgrade head
```

---

## 🔐 Configuração de Segurança

### HTTPS
```bash
# Gerar certificado SSL
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Usar com uvicorn
uvicorn app.main:app --ssl-keyfile=key.pem --ssl-certfile=cert.pem
```

### CORS
Configurar em `backend/app/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://seu-dominio.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/users/{user_id}/scan/{item_id}")
@limiter.limit("10/minute")
async def trigger_scan(request: Request, ...):
    ...
```

---

## 📈 Monitoramento

### Logs
```bash
# Backend
tail -f backend/logs/app.log

# Frontend
browser console (F12)
```

### Métricas
Integrar com Prometheus/Grafana:
```python
from prometheus_client import Counter, Histogram

scan_counter = Counter('osint_scans_total', 'Total OSINT scans')
scan_duration = Histogram('osint_scan_duration_seconds', 'OSINT scan duration')
```

### Health Check
```bash
curl http://localhost:8000/health
```

---

## 🚨 Troubleshooting

### Erro: "Connection refused"
- Verificar se backend está rodando
- Verificar porta 8000
- Verificar firewall

### Erro: "Database connection failed"
- Verificar DATABASE_URL
- Verificar credenciais do banco
- Verificar se banco está rodando

### Erro: "CORS error"
- Verificar configuração de CORS
- Verificar origem da requisição
- Verificar headers

### Erro: "API key inválida"
- Verificar OPENAI_API_KEY
- Verificar limite de requisições
- Verificar saldo da conta

---

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado e migrado
- [ ] SSL/HTTPS configurado
- [ ] CORS configurado
- [ ] Rate limiting ativado
- [ ] Logs configurados
- [ ] Backup automático ativado
- [ ] Monitoramento ativado
- [ ] Testes executados
- [ ] Documentação atualizada

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: docker build -t safeguard-backend .
      - run: docker push your-registry/safeguard-backend:latest
```

---

## 📞 Suporte

Para problemas de deployment, consulte:
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Deployment](https://vitejs.dev/guide/ssr.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
