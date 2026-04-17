const express = require("express");
const Controller = require("../controllers/controller.js");
const ControllerLogs= require("../controllers/controller.logs.js")
class Routes {
    constructor(app) {
        this.router = express.Router();
        this.controller = new Controller();
        this.controller_logs =new ControllerLogs();
        this.registerRoutes();
        app.use("/api", this.router);
    }

    registerRoutes() {
        this.router.post(
            "/n8n/message",
            this.controller.receiveN8nMessage.bind(this.controller)
        );
        this.router.get(
            "/logs",
            this.controller_logs.getLogs.bind(this.controller)
        )
    }
}

module.exports = Routes;