const { v4: uuidv4 } = require("uuid");
const { readData, writeData } = require("../services/fileService");
const { getCurrentMonth, calculateBudgetStatus } = require("../services/budgetService");

function setBudget(req, res) {
    const { limit } = req.body;

    if (!limit || Number(limit) <= 0) {
        return res.status(400).json({
            message: "Budget limit must be greater than 0."
        });
    }

    const budgets = readData("budgets.json");
    const currentMonth = getCurrentMonth();

    const existingBudget = budgets.find(x =>
        x.userId === req.user.id &&
        x.month === currentMonth
    );

    if (existingBudget) {
        existingBudget.limit = Number(limit);
    } else {
        budgets.push({
            id: uuidv4(),
            userId: req.user.id,
            month: currentMonth,
            limit: Number(limit),
            createdAt: new Date().toISOString()
        });
    }

    writeData("budgets.json", budgets);

    res.json({
        message: "Monthly budget saved successfully.",
        budgetStatus: calculateBudgetStatus(req.user.id)
    });
}

function getBudget(req, res) {
    res.json(calculateBudgetStatus(req.user.id));
}

module.exports = {
    setBudget,
    getBudget
};