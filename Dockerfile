# =================================================================
# ETAPA 1: BUILDER - Instala dependencias
# =================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia los archivos de manifiesto del paquete
COPY package.json ./

# Instala todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# =================================================================
# ETAPA 2: PRODUCTION - Crea la imagen final y ligera
# =================================================================
FROM node:20-alpine

WORKDIR /app

# Establece el entorno a 'production'
ENV NODE_ENV=production

# Copia el package.json para instalar solo las dependencias de producción
COPY package.json ./

# Instala únicamente las dependencias necesarias para producción
RUN npm install --omit=dev

# === CORRECCIÓN AQUÍ ===
# Creamos el directorio 'public' explícitamente porque la app lo necesita
# para guardar archivos subidos, pero no existe en el código fuente inicial.
# También creamos 'logs' por la misma razón, para nuestro logger.
RUN mkdir public logs

# Copia el código fuente de la aplicación desde la etapa 'builder'
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js
# La siguiente línea ya no es necesaria porque creamos la carpeta arriba
# y los volúmenes la gestionarán en tiempo de ejecución.
# COPY --from=builder /app/public ./public 

# La aplicación escucha en un puerto definido por variable de entorno.
EXPOSE 8080

# Por seguridad, no ejecutamos como usuario root.
USER node

# Comando para iniciar la aplicación en modo producción.
CMD ["node", "server.js", "--mode", "prod"]