# =================================================================
# ETAPA 1: BUILDER - Instala dependencias y prepara el código
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

# Establece el entorno a 'production' para optimizar la app
ENV NODE_ENV=production

# Copia el package.json para instalar solo las dependencias de producción
COPY package.json ./

# Instala únicamente las dependencias necesarias para producción
RUN npm install --omit=dev

# --- SOLUCIÓN AL ERROR ---
# Creamos los directorios 'public' y 'logs' explícitamente.
# La aplicación los necesita para funcionar, pero no existen en el código fuente.
# No intentamos copiarlos porque se crean en tiempo de ejecución.
RUN mkdir public logs

# Copiamos el código fuente de la aplicación desde la etapa 'builder'
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js

# La aplicación escucha en este puerto DENTRO del contenedor.
EXPOSE 8080

# Por seguridad, no ejecutamos como usuario root.
# Le damos la propiedad de las carpetas de la app al usuario 'node'
# para que pueda escribir en ellas (ej: logs o archivos subidos).
RUN chown -R node:node /app

# Cambiamos al usuario no-root para ejecutar la aplicación.
USER node

# Comando para iniciar la aplicación en modo producción.
CMD ["node", "server.js", "--mode", "prod"]```

**Cambios Clave en este Dockerfile (y por qué funcionan):**

1.  **SE ELIMINÓ LA LÍNEA DEL ERROR:** La línea `COPY --from=builder /app/public ./public` ha sido **completamente eliminada**. Ya no existe.
2.  **SE AÑADIÓ `RUN mkdir public logs`:** Esta línea **crea las carpetas vacías** que tu aplicación necesita para empezar a trabajar.
3.  **SE AÑADIÓ `RUN chown -R node:node /app`:** Este es un paso de seguridad y robustez. Le da permiso al usuario `node` (con el que se ejecuta la app) para que pueda escribir archivos dentro de `public` y `logs`.

---

### Paso 2: Reconstruye la Imagen (Forzando la actualización)

A veces Docker guarda en caché los pasos anteriores y puede no detectar el cambio correctamente. Para estar 100% seguros de que está usando tu `Dockerfile` nuevo y corregido, vamos a construir la imagen con la opción `--no-cache`.

Abre tu terminal en la raíz del proyecto y ejecuta:

```bash
docker build --no-cache -t nanimartinez-restaurant-app .