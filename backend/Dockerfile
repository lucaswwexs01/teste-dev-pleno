# Dockerfile para o backend
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para migrations)
RUN npm ci

# Copiar código fonte
COPY . .

# Criar diretório de logs
RUN mkdir -p logs

# Expor porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]

