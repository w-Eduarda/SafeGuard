# SafeGuard OSINT — Monitoramento de Exposição Digital

O **SafeGuard OSINT** é uma plataforma moderna de monitoramento de exposição digital, projetada para identificar vazamentos de dados pessoais (e-mails, telefones, documentos) em bases de dados públicas e na Dark Web.

Este repositório foi revisado e corrigido para garantir o funcionamento pleno das funcionalidades de autenticação e integração com APIs de OSINT.

---

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos
*   Python 3.10+
*   Node.js 18+ (pnpm recomendado)

### 2. Configuração do Backend
```bash
cd backend
pip install -r requirements.txt
# O arquivo .env já está pré-configurado para SQLite
uvicorn app.main:app --reload --port 8000
```

### 3. Configuração do Frontend
```bash
cd frontend
pnpm install  # ou npm install
pnpm dev
```
O sistema estará acessível em `http://localhost:5173`.

---

## 🔑 Configuração de APIs e Custos

Para ativar a busca real de dados, você deve inserir suas chaves de API no arquivo `backend/.env`:

### **1. HaveIBeenPwned & BreachDirectory**
*   **Finalidade**: Identificar e-mails e senhas vazadas em grandes bases de dados.
*   **Custo**: 
    *   *HaveIBeenPwned*: Requer uma chave paga (aproximadamente $3.50/mês).
    *   *BreachDirectory*: Possui planos gratuitos e pagos dependendo do volume.
*   **Nota**: Sem essas chaves, o sistema operará em modo de simulação/demonstração para os scans externos.

### **2. OpenAI (IA Generativa)**
*   **Finalidade**: Gerar as descrições de risco e os guias de mitigação passo a passo.
*   **Custo**: Pago por uso (Pay-as-you-go). Para monitoramento pessoal, o custo é negligenciável (centavos de dólar por mês).
*   **Configuração**: `OPENAI_API_KEY=sk-xxxx...`

---

## 🛡️ Inteligência de Mitigação
O sistema utiliza IA para transformar uma descoberta técnica em uma ação prática:
*   **Análise**: Determina se o vazamento é Crítico (ex: senhas) ou Médio (ex: apenas e-mail).
*   **Ação**: Gera um guia personalizado (ex: "Trocar senha do Outlook", "Ativar 2FA via App").

---

## 📄 Licença
Este projeto é destinado a fins educacionais e monitoramento de segurança pessoal.
