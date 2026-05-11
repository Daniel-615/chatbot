const db = require("../models");
const MESSAGE = db.getModel("message");
const CHAT = db.getModel("chat");
const USER = db.getModel("user");
class Chat {

    async getChatUser(req, res) {

        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({
                ok: false,
                message: "Debes enviar user_id"
            });
        }

        try {

            const user = await USER.findOne({
                where: {
                    username: user_id
                }
            });

            if (!user) {
                return res.status(404).json({
                    ok: false,
                    message: "Usuario no encontrado"
                });
            }

            const chat = await CHAT.findOne({
                where: {
                    user_id: user.id
                },
                include: [
                    {
                        model: MESSAGE,
                        as: "messages"
                    }
                ],
                order: [
                    [{ model: MESSAGE, as: "messages" }, "createdAt", "ASC"]
                ]
            });

            if (!chat) {
                return res.status(404).json({
                    ok: false,
                    message: "Chat no encontrado"
                });
            }

            return res.status(200).json({
                ok: true,
                chat
            });

        } catch (err) {


            return res.status(500).json({
                ok: false,
                message: "Error interno"
            });
        }
    }

    async createChatUser(req, res) {

        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({
                ok: false,
                message: "Debes enviar user_id"
            });
        }

        try {

            let user = await USER.findOne({
                where: {
                    username: user_id
                }
            });

            if (!user) {

                user = await USER.create({
                    username: user_id
                });
            }

            let chat = await CHAT.findOne({
                where: {
                    user_id: user.id
                }
            });

            if (!chat) {

                chat = await CHAT.create({
                    user_id: user.id
                });
            }

            return res.status(200).json({
                ok: true,
                user,
                chat
            });

        } catch (err) {



            return res.status(500).json({
                ok: false,
                message: "Error interno"
            });
        }
    }
}
module.exports = Chat;