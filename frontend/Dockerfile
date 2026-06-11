FROM node:20-slim

WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Copia os arquivos de dependências
COPY package.json pnpm-lock.yaml* ./

# Instala as dependências
RUN pnpm install

# Copia o restante do código
COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# Comando para rodar em modo de desenvolvimento
CMD ["pnpm", "dev"]
