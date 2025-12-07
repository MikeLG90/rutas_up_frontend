# Etapa 1: Build de Angular
FROM node:18 AS build

WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install

# Copiar el código fuente
COPY . .

# Construir Angular (genera dist/browser)
RUN ng build --configuration production

# Etapa 2: Servir Angular con Express (HTTP sin HSTS)
FROM node:18

WORKDIR /app

# Copiar solo los archivos del build final
COPY --from=build /app/dist/browser ./dist/browser

# Copiar el servidor Express (lo generaré abajo)
COPY server.js .

# Instalar Express
RUN npm install express

EXPOSE 10000
CMD ["node", "server.js"]
