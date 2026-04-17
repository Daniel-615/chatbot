const db = require("../models");
const N8N = db.getModel("N8N");

class Controller {
    async receiveN8nMessage(req, res) {
        try {
            const { message, sessionId } = req.body;

            if (!message || !sessionId) {
                return res.status(400).json({
                    message: "Debes enviar message y sessionId"
                });
            }

            const responseFromN8n = await fetch(
                "http://localhost:5678/webhook-test/chatbot-sat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message,
                        sessionId
                    })
                }
            );

            const data = await responseFromN8n.json();

            const saved = await N8N.create({
                message,
                response: data
            });
            const wsServer = req.app.get("ws");

            if (wsServer) {
                wsServer.sendToClient(sessionId, {
                    message,
                    response: data,
                    id: saved.id
                });
            }

            return res.json({
                ok: true,
                data: saved
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }
}

module.exports = Controller;