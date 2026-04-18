const db = require("../models");
const N8N = db.getModel("n8n");

class Controller {
    async receiveN8nMessage(req, res) {
        try {
            const { message, sessionId } = req.body;

            if (!message || !sessionId) {
                return res.status(400).json({
                    ok: false,
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

            let data;
            const rawText = await responseFromN8n.text();

            try {
                data = JSON.parse(rawText);
            } catch (e) {
                data = rawText;
            }

            const isN8nError =
                !responseFromN8n.ok ||
                (typeof data === "string" &&
                    (
                        data.toLowerCase().includes("webhook") ||
                        data.toLowerCase().includes("not registered") ||
                        data.toLowerCase().includes("404") ||
                        data.toLowerCase().includes("error")
                    )) ||
                (typeof data === "object" &&
                    data?.message &&
                    data.message.toLowerCase().includes("webhook"));

            if (isN8nError) {
                const wsServer = req.app.get("ws");

                if (wsServer) {
                    wsServer.sendToClient(sessionId, {
                        text: "Lo siento, estamos teniendo dificultades técnicas en este momento. Intenta nuevamente más tarde.",
                        id: null
                    });
                }

                return res.status(500).json({
                    ok: false,
                    message: "Error en webhook de n8n",
                    raw: data
                });
            }

            const cleanResponse =
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
            console.error("Controller error:", error);

            const wsServer = req.app.get("ws");

            if (wsServer) {
                wsServer.sendToClient(req.body.sessionId, {
                    text: "Error interno del servidor. Intenta nuevamente.",
                    id: null
                });
            }

            return res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }
}

module.exports = Controller;