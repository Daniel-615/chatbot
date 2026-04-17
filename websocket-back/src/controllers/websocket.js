const { WebSocketServer } = require("ws");

class SocketServer {
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.clients = new Map();

        this.init();
    }

    init() {
        this.wss.on("connection", (ws) => {
            console.log("🔌 Cliente conectado");

            ws.on("message", (data) => {
                const msg = JSON.parse(data);

                if (msg.type === "init") {
                    this.clients.set(msg.sessionId, ws);
                    ws.sessionId = msg.sessionId;
                }
            });

            ws.on("close", () => {
                if (ws.sessionId) {
                    this.clients.delete(ws.sessionId);
                }
            });
        });
    }

    sendToClient(sessionId, data) {
        const client = this.clients.get(sessionId);

        if (client) {
            client.send(JSON.stringify({
                type: "n8n-response",
                data
            }));
        }
    }
}

module.exports = SocketServer;