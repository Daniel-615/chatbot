const db = require("../models");
const N8N = db.getModel("n8n");

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
                "http://localhost:5678/webhook/chatbot-sat",
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

            let cleanResponse =
                data?.data?.message ||
                data?.message ||
                data?.output ||
                data?.answer ||
                data?.text ||
                (Array.isArray(data)
                    ? data[0]?.output || data[0]?.text
                    : null) ||
                "No se obtuvo respuesta";
            const saved = await N8N.create({
                message,
                response: { text: cleanResponse }
            });

            const wsServer = req.app.get("ws");

            if (wsServer) {
                wsServer.sendToClient(sessionId, {
                    text: cleanResponse,
                    id: saved.id
                });
            }

            return res.json({
                ok: true,
                data: {
                    id: saved.id,
                    message,
                    response: cleanResponse
                }
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