const db = require("../models");

const MESSAGE = db.getModel("message");

class Message {

    async createMessage(req, res) {

        const {
            chat_id,
            message,
            sender
        } = req.body;

        if (
            !chat_id ||
            !message ||
            !sender
        ) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "Debes enviar chat_id, message y sender"
                });
        }

        try {

            const newMessage =
                await MESSAGE.create({
                    chat_id,
                    message,
                    sender
                });

            return res
                .status(201)
                .json({
                    ok: true,
                    message: "Mensaje creado",
                    data: newMessage
                });

        } catch (err) {


            return res
                .status(500)
                .json({
                    ok: false,
                    message: "Error interno del servidor"
                });
        }
    }
}

module.exports = Message;