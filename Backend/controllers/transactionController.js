const { v4: uuidv4 } = require("uuid");
const { readData, writeData } = require("../services/fileService");
const { calculateBudgetStatus, getBudgetWarning } = require("../services/budgetService");
const { sendRealTimeMessage } = require("../websocket/socketManager");

function createTransaction(req, res) {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category || !date) {
        return res.status(400).json({
            message: "Type, amount, category and date are required."
        });
    }

    if (type !== "income" && type !== "expense") {
        return res.status(400).json({
            message: "Type must be income or expense."
        });
    }

    if (Number(amount) <= 0) {
        return res.status(400).json({
            message: "Amount must be greater than 0."
        });
    }

    const transactions = readData("transactions.json");

    const newTransaction = {
        id: uuidv4(),
        userId: req.user.id,
        type,
        amount: Number(amount),
        category,
        description: description || "",
        date,
        createdAt: new Date().toISOString()
    };

    transactions.push(newTransaction);
    writeData("transactions.json", transactions);

    let budgetWarning = null;

    if (type === "expense") {
        const budgetStatus = calculateBudgetStatus(req.user.id);
        budgetWarning = getBudgetWarning(budgetStatus);

        if (budgetWarning) {
            sendRealTimeMessage(req.user.id, {
                type: "budget_alert",
                data: budgetWarning
            });
        }
    }

    sendRealTimeMessage(req.user.id, {
        type: "transaction_created",
        message: "New transaction added.",
        transaction: newTransaction
    });

    res.status(201).json({
        message: "Transaction created successfully.",
        transaction: newTransaction,
        budgetWarning
    });
}

function getTransactions(req, res) {
    const { category, type, sortBy, order } = req.query;

    let transactions = readData("transactions.json")
        .filter(x => x.userId === req.user.id);

    if (category) {
        transactions = transactions.filter(x =>
            x.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (type) {
        transactions = transactions.filter(x => x.type === type);
    }

    if (sortBy === "date") {
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (sortBy === "amount") {
        transactions.sort((a, b) => a.amount - b.amount);
    }

    if (order === "desc") {
        transactions.reverse();
    }

    res.json(transactions);
}

function updateTransaction(req, res) {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    const transactions = readData("transactions.json");

    const transaction = transactions.find(x =>
        x.id === id &&
        x.userId === req.user.id
    );

    if (!transaction) {
        return res.status(404).json({
            message: "Transaction not found."
        });
    }

    if (type && type !== "income" && type !== "expense") {
        return res.status(400).json({
            message: "Type must be income or expense."
        });
    }

    if (amount !== undefined && Number(amount) <= 0) {
        return res.status(400).json({
            message: "Amount must be greater than 0."
        });
    }

    transaction.type = type || transaction.type;
    transaction.amount = amount !== undefined ? Number(amount) : transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description !== undefined ? description : transaction.description;
    transaction.date = date || transaction.date;
    transaction.updatedAt = new Date().toISOString();

    writeData("transactions.json", transactions);

    const budgetStatus = calculateBudgetStatus(req.user.id);
    const budgetWarning = getBudgetWarning(budgetStatus);

    if (budgetWarning) {
        sendRealTimeMessage(req.user.id, {
            type: "budget_alert",
            data: budgetWarning
        });
    }

    sendRealTimeMessage(req.user.id, {
        type: "transaction_updated",
        message: "Transaction updated.",
        transaction
    });

    res.json({
        message: "Transaction updated successfully.",
        transaction,
        budgetWarning
    });
}

function deleteTransaction(req, res) {
    const { id } = req.params;

    const transactions = readData("transactions.json");

    const transactionExists = transactions.some(x =>
        x.id === id &&
        x.userId === req.user.id
    );

    if (!transactionExists) {
        return res.status(404).json({
            message: "Transaction not found."
        });
    }

    const filteredTransactions = transactions.filter(x =>
        !(x.id === id && x.userId === req.user.id)
    );

    writeData("transactions.json", filteredTransactions);

    sendRealTimeMessage(req.user.id, {
        type: "transaction_deleted",
        message: "Transaction deleted.",
        transactionId: id
    });

    res.json({
        message: "Transaction deleted successfully."
    });
}

module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
};