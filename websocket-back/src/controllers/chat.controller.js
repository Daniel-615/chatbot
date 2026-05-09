const db = require("../models");
const CHAT = db.getModel("chat");
const MESSAGE = db.getModel("message")
class Chat {
    async getChatUser(req,res) {
        const { user_id } = req.body;
        if (!user_id) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "Debes enviar un user_id"
                });
        }
        try {
            const chat = await CHAT.finOne({
                where: {
                    user_id
                },
                include: [
                    {
                        model: MESSAGE
                    }
                ]
            })
            if (!chat) {
                return res.
                    status(404)
                    .json({
                        ok: false,
                        message: "Chat no encontrado"
                    })
            }
            return res
                .status(200)
                .json({
                    ok: true,
                    message: "Chat encontrado",
                    chat
                })
        } catch (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    message: "Error interno del servidor"
                })
        }

    }
    async createChatUser(req, res) {
        const { user_id, message } = req.body;
        if (!user_id || !message) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "Debes enviar un user_id y un message"
                })
        }
        const chat = await CHAT.create({
            user_id,
        });
        return res
            .status(200)
            .json({
                ok: true,
                message: "Mensaje asociado al chat"
            })
    }
}
module.exports = Chat;