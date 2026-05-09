const db = require("../models");
const MESSAGE = db.getModel("message");
class Message {
    async createMessage(req, res) {
        const { chat_id, message } = req.body;
        if (!chat_id || !message) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "Debes enviar un chat_id y un message"
                })
        }
        try {
            const message = await MESSAGE.create({
                chat_id,
                message
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
}
module.exports=Message;