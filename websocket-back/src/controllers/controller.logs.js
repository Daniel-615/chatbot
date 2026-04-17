const db = require("../models");
const N8N = db.getModel("n8n");

class ControllerLogs {
    async getLogs(req, res) {
        try {
            const logs = await N8N.findAll({
                order: [["createdAt", "DESC"]],
                limit: 50
            });

            return res.json({
                ok: true,
                data: logs
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

module.exports = ControllerLogs;