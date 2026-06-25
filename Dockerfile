# Etapa 1: Construcción
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Usar npm install para evitar problemas de sincronización en el servidor
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación (genera la carpeta .output)
RUN npm run build

# Etapa 2: Ejecución
FROM node:22-alpine

WORKDIR /app

# Copiar solo el output generado desde la etapa de construcción
COPY --from=builder /app/.output ./.output

# Configurar variables de entorno para el puerto y el host
ENV PORT=3000
ENV NUXT_HOST=0.0.0.0
ENV HOST=0.0.0.0

EXPOSE 3000

# Ejecutar el servidor Node.js
CMD ["node", ".output/server/index.mjs"]