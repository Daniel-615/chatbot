const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const rateLimit = require("express-rate-limit");

const db = require("./src/models");
const Routes = require("./src/routes/routes.js");
const chatRoute= require("./src/routes/chat.route.js")
const SocketServer = require("./src/controllers/websocket.js");

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Configuración de Rate Limiting para seguridad
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita cada IP a 100 solicitudes por ventana de tiempo
    message: {
        ok: false,
        message: "Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde."
    }
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/api", limiter); // Aplica el límite a las rutas de la API

new Routes(app);
new chatRoute(app);
const socketServer = new SocketServer(server);

app.set("ws", socketServer);
async function showTables() {
    try {
        const tables = await db.sequelize.getQueryInterface().showAllTables();
        console.log("Tablas en la base de datos:");
        console.log(tables);
    } catch (err) {
        console.error(err);
    }
}
async function connectDB() {
    try {
        await db.sequelize.sync();
        console.log("DB conectada");
        showTables();
    } catch (err) {
        console.error(err);
    }
}

server.listen(PORT, async () => {
    console.log(`Server running on ${PORT}`);
    await connectDB();
});