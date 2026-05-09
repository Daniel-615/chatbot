const express = require("express");

const ChatController = require("../controllers/chat.controller.js");
const MessageController = require("../controllers/message.controller.js");
const UserController = require("../controllers/user.controller.js");

class ChatRoute {

    constructor(app) {

        this.router = express.Router();

        this.chatController = new ChatController();
        this.messageController = new MessageController();
        this.userController = new UserController();

        this.registerRoutes();

        app.use("/api/chat", this.router);
    }

    registerRoutes() {

        this.router.get(
            "/",
            this.chatController.getChatUser.bind(this.chatController)
        );

        this.router.post(
            "/create",
            this.chatController.createChatUser.bind(this.chatController)
        );

        this.router.post(
            "/message",
            this.messageController.createMessage.bind(this.messageController)
        );

        this.router.post(
            "/user",
            this.userController.createUser.bind(this.userController)
        );
    }
}

module.exports = ChatRoute;