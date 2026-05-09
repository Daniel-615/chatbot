const db = require("../models");

const USER = db.getModel("user");

class UserController {

    async createUser(req, res) {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                ok: false,
                message: "Debes enviar 'username'"
            });
        }

        try {

            const existingUser = await USER.findOne({
                where: {
                    username
                }
            });

            if (existingUser) {
                return res.status(409).json({
                    ok: false,
                    message: "El usuario ya existe"
                });
            }

            const user = await USER.create({
                username
            });
            return res.status(201).json({
                ok: true,
                message: "Usuario creado",
                user
            });

        } catch (err) {

            console.error(err);

            return res.status(500).json({
                ok: false,
                message: "Error del servidor"
            });
        }
    }
}

module.exports = new UserController();