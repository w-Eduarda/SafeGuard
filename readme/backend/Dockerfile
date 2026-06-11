FROM python:3.11-slim

WORKDIR /app

# Instala dependências do sistema necessárias para OSINT (ex: git, curl)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copia os requisitos e instala as dependências do Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY . .

# Expõe a porta que o FastAPI usará
EXPOSE 8000

# Comando para rodar a aplicação com hot-reload (ambiente de dev)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
