const express = require("express");
const { readData } = require("../services/fileService");
const { generateSavingSuggestions } = require("../services/aiService");
const realtimeService = require("../services/realtimeService");

function createAiRouter(authMiddleware) {
    const router = express.Router();

    router.post("/suggestions", authMiddleware, (req, res) => {
        realtimeService.sendToUser(req.user.id, {
            type: "ai_status",
            message: "AI is analyzing your spending habits."
        });

        const suggestions = generateSavingSuggestions(req.user.id);

        realtimeService.sendToUser(req.user.id, {
            type: "ai_suggestions_ready",
            message: "AI suggestions are ready.",
            suggestions
        });

        res.json({
            message: "AI suggestions generated successfully.",
            suggestions
        });
    });

    router.get("/suggestions", authMiddleware, (req, res) => {
        const suggestions = readData("suggestions.json")
            .filter(x => x.userId === req.user.id);

        res.json(suggestions);
    });

    router.get("/realtime-status", authMiddleware, (req, res) => {
        res.json({
            onlineUsers: realtimeService.getOnlineUsersCount()
        });
    });

    return router;
}

module.exports = {
    createAiRouter
};