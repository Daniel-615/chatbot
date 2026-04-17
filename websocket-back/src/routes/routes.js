const express = require("express");
const Controller = require("../controllers/controller.js");

class Routes {
    constructor(app) {
        this.router = express.Router();
        this.controller = new Controller();

        this.registerRoutes();
        app.use("/api", this.router);
    }

    registerRoutes() {
        this.router.post(
            "/n8n/message",
            this.controller.receiveN8nMessage.bind(this.controller)
        );
    }
}

module.exports = Routes;