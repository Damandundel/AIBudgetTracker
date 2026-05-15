const { readData, writeData } = require("./fileService");
const { v4: uuidv4 } = require("uuid");

function generateSavingSuggestions(userId) {
    const transactions = readData("transactions.json")
        .filter(x => x.userId === userId && x.type === "expense");

    const suggestions = readData("suggestions.json");

    const categoryTotals = {};

    transactions.forEach(x => {
        if (!categoryTotals[x.category]) {
            categoryTotals[x.category] = 0;
        }

        categoryTotals[x.category] += Number(x.amount);
    });

    const generatedSuggestions = [];

    Object.entries(categoryTotals).forEach(([category, amount]) => {
        let text = "";

        const lowerCategory = category.toLowerCase();

        if (lowerCategory.includes("food") && amount > 300) {
            text = "You spend a lot on food. Try cooking at home more often or setting a weekly food limit.";
        } else if (lowerCategory.includes("transport") && amount > 200) {
            text = "Your transport spending is high. Consider using public transport more often instead of taxis.";
        } else if (lowerCategory.includes("subscription") && amount > 100) {
            text = "You have high subscription expenses. Check if you use all paid services and cancel unnecessary ones.";
        } else if (amount > 500) {
            text = `Your spending in ${category} is high. Try setting a smaller monthly limit for this category.`;
        }

        if (text) {
            generatedSuggestions.push({
                id: uuidv4(),
                userId,
                category,
                amount,
                text,
                createdAt: new Date().toISOString()
            });
        }
    });

    const allSuggestions = [...suggestions, ...generatedSuggestions];
    writeData("suggestions.json", allSuggestions);

    return generatedSuggestions;
}

module.exports = {
    generateSavingSuggestions
};