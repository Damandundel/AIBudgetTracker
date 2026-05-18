function calculateTotalExpenses(transactions) {
    return transactions
        .filter(x => x.type === "expense")
        .reduce((sum, x) => sum + Number(x.amount), 0);
}

function calculateCategoryTotals(transactions) {
    const categoryTotals = {};

    transactions
        .filter(x => x.type === "expense")
        .forEach(x => {
            if (!categoryTotals[x.category]) {
                categoryTotals[x.category] = 0;
            }

            categoryTotals[x.category] += Number(x.amount);
        });

    return categoryTotals;
}

function findBiggestSpendingCategory(transactions) {
    const categoryTotals = calculateCategoryTotals(transactions);

    let biggestCategory = null;
    let biggestAmount = 0;

    Object.entries(categoryTotals).forEach(([category, amount]) => {
        if (amount > biggestAmount) {
            biggestCategory = category;
            biggestAmount = amount;
        }
    });

    return {
        category: biggestCategory,
        amount: biggestAmount
    };
}

function detectUnusualSpending(userId, newTransaction, allTransactions) {
    if (newTransaction.type !== "expense") {
        return null;
    }

    const previousTransactions = allTransactions.filter(x =>
        x.userId === userId &&
        x.type === "expense" &&
        x.category === newTransaction.category &&
        x.id !== newTransaction.id
    );

    if (previousTransactions.length < 3) {
        return null;
    }

    const average = previousTransactions.reduce((sum, x) => {
        return sum + Number(x.amount);
    }, 0) / previousTransactions.length;

    const currentAmount = Number(newTransaction.amount);

    if (currentAmount >= average * 2) {
        return {
            type: "unusual_spending_alert",
            message: `Unusual spending detected in ${newTransaction.category}. This expense is much higher than your average.`,
            category: newTransaction.category,
            amount: currentAmount,
            average: Math.round(average)
        };
    }

    return null;
}

module.exports = {
    calculateTotalExpenses,
    calculateCategoryTotals,
    findBiggestSpendingCategory,
    detectUnusualSpending
};