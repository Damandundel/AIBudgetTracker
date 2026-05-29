const { getDashboardData } = require("../services/dashboardService");
const { calculateBudgetStatus } = require("../services/budgetService");

function getDashboard(req, res) {
    const dashboard = getDashboardData(req.user.id);
    const budgetStatus = calculateBudgetStatus(req.user.id);

    res.json({
        dashboard,
        budgetStatus
    });
}

module.exports = {
    getDashboard
};