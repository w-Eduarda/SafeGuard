# SafeGuard OSINT - Backend

Este é o backend da plataforma SafeGuard OSINT, desenvolvido com **FastAPI**, **PostgreSQL** e **Redis**.

## Estrutura do Projeto

- `app/main.py`: Ponto de entrada da aplicação e definição de rotas.
- `app/api/`: Rotas da API (autenticação, etc).
- `app/core/`: Configurações globais e conexão com banco de dados.
- `app/models/`: Modelos do banco de dados (SQLAlchemy).
- `app/schemas/`: Esquemas de validação de dados (Pydantic).
- `app/services/`: Lógica de negócio (CRUD e serviços OSINT).

## Como Executar

### Usando Docker (Recomendado)

Na raiz do projeto (onde está o `docker-compose.yml`), execute:

```bash
docker-compose up --build
```

### Manualmente (Desenvolvimento)

1. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

2. Configure as variáveis de ambiente no arquivo `.env`.

3. Execute o servidor:
   ```bash
   uvicorn app.main:app --reload
   ```

## Endpoints Principais

- `GET /`: Status da API.
- `POST /auth/register`: Registro de novos usuários.
- `POST /auth/token`: Login e obtenção de token.
- `POST /users/{user_id}/monitored_items/`: Cadastrar itens para monitoramento (email, nome, CPF).
- `POST /users/{user_id}/scan/{item_id}`: Disparar scan OSINT (Simulado).
- `GET /users/{user_id}/discoveries/`: Listar descobertas de vazamentos.
- `GET /users/{user_id}/alerts/`: Listar alertas gerados.

## Integração OSINT

O serviço OSINT está localizado em `app/services/osint.py`. Ele foi projetado para ser facilmente estendido com scripts reais de ferramentas como Sherlock, SpiderFoot ou Google Dorking.
