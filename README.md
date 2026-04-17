# Proyecto WebSocket

Este proyecto consta de un backend (websocket-back) y un frontend (websocket-front) que utilizan WebSockets para comunicación en tiempo real.

## Instalación

Para instalar las dependencias tanto en el backend como en el frontend, ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install
```

Esto instalará las dependencias en ambas carpetas.

## Configuración del Entorno

Debes crear un archivo `.env` dentro de la carpeta `websocket-back` con la siguiente configuración:

```
DB=YOUR_DB
USER=YOUR_USER
PASSWORD=YOUR_PASSWORD
HOST=YOUR_HOST
DB_PORT=5432
DIALECT=postgres
PORT=3000
```

Reemplaza `YOUR_DB`, `YOUR_USER`, `YOUR_PASSWORD` y `YOUR_HOST` con tus propias credenciales de base de datos.

## Ejecutar el Proyecto

### Frontend

Para levantar el frontend, ejecuta:

```bash
npm run dev
```
Asegúrate de estar en la carpeta `websocket-front/sat-chat` al ejecutar el comando del backend.

### Backend

Para levantar el backend, ejecuta:

```bash
node index.js
```

Asegúrate de estar en la carpeta `websocket-back` al ejecutar el comando del backend.