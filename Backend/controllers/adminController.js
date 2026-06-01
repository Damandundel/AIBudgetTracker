const { readData } = require("../services/fileService");

function getAdminStats(req, res) {
    const users = readData("users.json");
    const transactions = readData("transactions.json");
    const suggestions = readData("suggestions.json");

    const categoryCounter = {};

    transactions.forEach(x => {
        if (!categoryCounter[x.category]) {
            categoryCounter[x.category] = 0;
        }

        categoryCounter[x.category]++;
    });

    let mostUsedCategory = null;
    let highestCount = 0;

    Object.entries(categoryCounter).forEach(([category, count]) => {
        if (count > highestCount) {
            mostUsedCategory = category;
            highestCount = count;
        }
    });

    res.json({
        totalUsers: users.length,
        totalTransactions: transactions.length,
        totalSuggestions: suggestions.length,
        mostUsedCategory
    });
}

module.exports = {
    getAdminStats
};