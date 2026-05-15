const { readData } = require("./fileService");

function getDashboardData(userId) {
    const transactions = readData("transactions.json")
        .filter(x => x.userId === userId);

    const totalIncome = transactions
        .filter(x => x.type === "income")
        .reduce((sum, x) => sum + Number(x.amount), 0);

    const totalExpenses = transactions
        .filter(x => x.type === "expense")
        .reduce((sum, x) => sum + Number(x.amount), 0);

    const expensesByCategory = {};

    transactions
        .filter(x => x.type === "expense")
        .forEach(x => {
            if (!expensesByCategory[x.category]) {
                expensesByCategory[x.category] = 0;
            }

            expensesByCategory[x.category] += Number(x.amount);
        });

    let biggestSpendingCategory = null;
    let biggestAmount = 0;

    Object.entries(expensesByCategory).forEach(([category, amount]) => {
        if (amount > biggestAmount) {
            biggestSpendingCategory = category;
            biggestAmount = amount;
        }
    });

    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        biggestSpendingCategory,
        biggestCategoryAmount: biggestAmount,
        expensesByCategory,
        recentTransactions
    };
}

module.exports = {
    getDashboardData
};