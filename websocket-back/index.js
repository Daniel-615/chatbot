const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");

const db = require("./src/models");
const Routes = require("./src/routes/routes.js");
const SocketServer = require("./src/controllers/websocket.js");

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

new Routes(app);

const socketServer = new SocketServer(server);

app.set("ws", socketServer);

async function connectDB() {
    try {
        await db.sequelize.sync();
        console.log("✅ DB conectada");
    } catch (err) {
        console.error(err);
    }
}

server.listen(PORT, async () => {
    console.log(`🚀 Server running on ${PORT}`);
    await connectDB();
});