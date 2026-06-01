const { readData } = require("../services/fileService");
const { generateSavingSuggestions } = require("../services/aiService");
const { sendRealTimeMessage } = require("../websocket/socketManager");

function createSuggestions(req, res) {
    sendRealTimeMessage(req.user.id, {
        type: "ai_status",
        message: "AI is analyzing your spending habits."
    });

    const suggestions = generateSavingSuggestions(req.user.id);

    sendRealTimeMessage(req.user.id, {
        type: "ai_suggestions_ready",
        message: "AI suggestions are ready.",
        suggestions
    });

    res.json({
        message: "AI suggestions generated successfully.",
        suggestions
    });
}

function getSuggestions(req, res) {
    const suggestions = readData("suggestions.json")
        .filter(x => x.userId === req.user.id);

    res.json(suggestions);
}

module.exports = {
    createSuggestions,
    getSuggestions
};