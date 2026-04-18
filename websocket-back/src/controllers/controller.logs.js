const db = require("../models");
const N8N = db.getModel("n8n");
class ControllerLogs {

    async getLogsIA(req, res) {
        try {
            const [logs] = await db.sequelize.query(
                "SELECT * FROM n8n_chat_histories LIMIT 1000"
            );
            if (!logs) {
                return
                res.json({
                    ok: false,
                    data: null,
                })
            }
            const cleaned = logs.map(log => ({
                ...log,
                response:
                    log.response?.content ||
                    log.response?.text ||
                    log.response ||
                    null
            }));
            return res.json({
                ok: true,
                data: cleaned
            });

        } catch (error) {
            return res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }
    async getLogs(req, res) {
        try {
            const logs = await N8N.findAll({
                order: [["createdAt", "DESC"]],
                limit: 1000
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