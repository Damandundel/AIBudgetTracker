const API_URL = "http://localhost:5000/api";
const WS_URL = "ws://localhost:5000";

const state = {
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "null"),
    socket: null,
    chart: null
};

const elements = {
    authView: document.getElementById("authView"),
    appView: document.getElementById("appView"),
    pageTitle: document.getElementById("pageTitle"),
    userBadge: document.getElementById("userBadge"),
    logoutBtn: document.getElementById("logoutBtn"),
    socketStatus: document.getElementById("socketStatus"),
    socketText: document.getElementById("socketText"),
    loginForm: document.getElementById("loginForm"),
    registerForm: document.getElementById("registerForm"),
    showLogin: document.getElementById("showLogin"),
    showRegister: document.getElementById("showRegister"),
    transactionForm: document.getElementById("transactionForm"),
    budgetForm: document.getElementById("budgetForm"),
    transactionsList: document.getElementById("transactionsList"),
    recentTransactions: document.getElementById("recentTransactions"),
    suggestionsList: document.getElementById("suggestionsList"),
    toastContainer: document.getElementById("toastContainer")
};

function formatMoney(value) {
    return `${Number(value || 0).toFixed(2)} BGN`;
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

function showToast(title, message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
}

async function request(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (state.token) {
        headers.Authorization = `Bearer ${state.token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Request failed.");
    }

    return data;
}

function saveSession(token, user) {
    state.token = token;
    state.user = user;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}

function clearSession() {
    state.token = null;
    state.user = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (state.socket) {
        state.socket.close();
        state.socket = null;
    }
}

function setAuthenticatedView() {
    const loggedIn = Boolean(state.token && state.user);
    elements.authView.classList.toggle("hidden", loggedIn);
    elements.appView.classList.toggle("hidden", !loggedIn);
    elements.userBadge.classList.toggle("hidden", !loggedIn);
    elements.logoutBtn.classList.toggle("hidden", !loggedIn);
    document.querySelectorAll(".admin-only").forEach(x => x.classList.toggle("hidden", state.user?.role !== "admin"));

    if (loggedIn) {
        elements.userBadge.textContent = `${state.user.username} · ${state.user.role}`;
        connectSocket();
        loadAllData();
    }
}

function connectSocket() {
    if (!state.user || state.socket) {
        return;
    }

    state.socket = new WebSocket(WS_URL);

    state.socket.addEventListener("open", () => {
        elements.socketStatus.classList.add("connected");
        elements.socketText.textContent = "Connected";
        state.socket.send(JSON.stringify({ type: "connect_user", userId: state.user.id }));
    });

    state.socket.addEventListener("message", event => {
        const data = JSON.parse(event.data);

        if (data.type === "budget_alert") {
            showToast("Budget alert", data.data.message);
            loadBudget();
        }

        if (data.type === "transaction_created") {
            showToast("Transaction added", data.message);
            loadAllData();
        }

        if (data.type === "ai_status" || data.type === "ai_suggestions_ready") {
            showToast("AI assistant", data.message);
        }
    });

    state.socket.addEventListener("close", () => {
        elements.socketStatus.classList.remove("connected");
        elements.socketText.textContent = "Disconnected";
        state.socket = null;
    });
}

function switchAuthMode(mode) {
    const login = mode === "login";
    elements.loginForm.classList.toggle("hidden", !login);
    elements.registerForm.classList.toggle("hidden", login);
    elements.showLogin.classList.toggle("active", login);
    elements.showRegister.classList.toggle("active", !login);
}

function switchSection(section) {
    document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.section === section));
    document.querySelectorAll(".content-section").forEach(panel => panel.classList.remove("active-section"));
    document.getElementById(`${section}Section`).classList.add("active-section");
    elements.pageTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);

    if (section === "admin") {
        loadAdminStats();
    }
}

function renderTransactions(container, transactions, compact = false) {
    container.className = "transaction-list";
    container.innerHTML = "";

    if (!transactions.length) {
        container.className = "transaction-list empty-state";
        container.textContent = compact ? "No recent transactions yet." : "No transactions found.";
        return;
    }

    const template = document.getElementById("transactionTemplate");

    transactions.forEach(transaction => {
        const node = template.content.cloneNode(true);
        const title = node.querySelector(".transaction-title");
        const meta = node.querySelector(".transaction-meta");
        const amount = node.querySelector(".transaction-amount");
        const deleteBtn = node.querySelector(".delete-btn");

        title.textContent = `${transaction.category} · ${transaction.type}`;
        meta.textContent = `${transaction.date} · ${transaction.description || "No description"}`;
        amount.textContent = `${transaction.type === "income" ? "+" : "-"}${formatMoney(transaction.amount)}`;
        amount.classList.add(transaction.type);
        deleteBtn.classList.toggle("hidden", compact);
        deleteBtn.addEventListener("click", () => deleteTransaction(transaction.id));
        container.appendChild(node);
    });
}

function renderDashboard(data) {
    const dashboard = data.dashboard;
    document.getElementById("totalIncome").textContent = formatMoney(dashboard.totalIncome);
    document.getElementById("totalExpenses").textContent = formatMoney(dashboard.totalExpenses);
    document.getElementById("balance").textContent = formatMoney(dashboard.balance);
    document.getElementById("biggestCategory").textContent = dashboard.biggestSpendingCategory || "None";
    renderTransactions(elements.recentTransactions, dashboard.recentTransactions, true);
    renderChart(dashboard.expensesByCategory || {});
    renderBudget(data.budgetStatus);
}

function renderChart(expensesByCategory) {
    const labels = Object.keys(expensesByCategory);
    const values = Object.values(expensesByCategory);
    const context = document.getElementById("categoryChart");

    if (state.chart) {
        state.chart.destroy();
    }

    state.chart = new Chart(context, {
        type: "doughnut",
        data: {
            labels: labels.length ? labels : ["No expenses"],
            datasets: [{
                data: values.length ? values : [1],
                backgroundColor: ["#8b5cf6", "#38bdf8", "#4ade80", "#f59e0b", "#fb7185", "#22d3ee"],
                borderColor: "rgba(255, 255, 255, 0.10)",
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { color: "#aeb8cf", boxWidth: 14, padding: 18 }
                }
            },
            maintainAspectRatio: false,
            cutout: "68%"
        }
    });
}

function renderBudget(status) {
    const percentage = Math.min(Number(status.percentageUsed || 0), 100);
    document.getElementById("budgetMonth").textContent = status.month || "Current month";
    document.getElementById("budgetProgress").style.width = `${percentage}%`;
    document.getElementById("budgetLimitText").textContent = formatMoney(status.limit);
    document.getElementById("budgetSpentText").textContent = formatMoney(status.spent);
    document.getElementById("budgetRemainingText").textContent = formatMoney(status.remaining);
    document.getElementById("budgetPercentageText").textContent = `${status.percentageUsed || 0}%`;
}

function renderSuggestions(suggestions) {
    elements.suggestionsList.innerHTML = "";

    if (!suggestions.length) {
        elements.suggestionsList.className = "suggestions-grid empty-state";
        elements.suggestionsList.textContent = "No AI suggestions yet.";
        return;
    }

    elements.suggestionsList.className = "suggestions-grid";

    suggestions.slice().reverse().forEach(suggestion => {
        const card = document.createElement("article");
        card.className = "suggestion-card";
        card.innerHTML = `<span>${suggestion.category} · ${formatMoney(suggestion.amount)}</span><p>${suggestion.text}</p>`;
        elements.suggestionsList.appendChild(card);
    });
}

async function loadDashboard() {
    const data = await request("/dashboard");
    renderDashboard(data);
}

async function loadTransactions() {
    const category = document.getElementById("filterCategory").value.trim();
    const type = document.getElementById("filterType").value;
    const sortBy = document.getElementById("sortBy").value;
    const order = document.getElementById("sortOrder").value;
    const params = new URLSearchParams({ sortBy, order });

    if (category) {
        params.set("category", category);
    }

    if (type) {
        params.set("type", type);
    }

    const transactions = await request(`/transactions?${params.toString()}`);
    renderTransactions(elements.transactionsList, transactions);
}

async function loadBudget() {
    const budget = await request("/budget");
    renderBudget(budget);
}

async function loadSuggestions() {
    const suggestions = await request("/ai/suggestions");
    renderSuggestions(suggestions);
}

async function loadAdminStats() {
    if (state.user?.role !== "admin") {
        return;
    }

    const stats = await request("/admin/stats");
    document.getElementById("adminUsers").textContent = stats.totalUsers;
    document.getElementById("adminTransactions").textContent = stats.totalTransactions;
    document.getElementById("adminSuggestions").textContent = stats.totalSuggestions;
    document.getElementById("adminCategory").textContent = stats.mostUsedCategory || "None";
}

async function loadAllData() {
    try {
        await Promise.all([loadDashboard(), loadTransactions(), loadBudget(), loadSuggestions(), loadAdminStats()]);
    } catch (error) {
        showToast("Loading error", error.message);
    }
}

async function deleteTransaction(id) {
    try {
        await request(`/transactions/${id}`, { method: "DELETE" });
        showToast("Deleted", "Transaction removed successfully.");
        await loadAllData();
    } catch (error) {
        showToast("Delete failed", error.message);
    }
}

elements.showLogin.addEventListener("click", () => switchAuthMode("login"));
elements.showRegister.addEventListener("click", () => switchAuthMode("register"));

elements.loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    try {
        const data = await request("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: document.getElementById("loginEmail").value.trim(),
                password: document.getElementById("loginPassword").value
            })
        });

        saveSession(data.token, data.user);
        setAuthenticatedView();
        showToast("Logged in", data.message);
    } catch (error) {
        showToast("Login failed", error.message);
    }
});

elements.registerForm.addEventListener("submit", async event => {
    event.preventDefault();

    try {
        const data = await request("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                username: document.getElementById("registerUsername").value.trim(),
                email: document.getElementById("registerEmail").value.trim(),
                password: document.getElementById("registerPassword").value
            })
        });

        showToast("Account created", data.message);
        switchAuthMode("login");
        document.getElementById("loginEmail").value = document.getElementById("registerEmail").value.trim();
    } catch (error) {
        showToast("Register failed", error.message);
    }
});

elements.logoutBtn.addEventListener("click", () => {
    clearSession();
    setAuthenticatedView();
    elements.pageTitle.textContent = "Dashboard";
});

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => switchSection(button.dataset.section));
});

elements.transactionForm.addEventListener("submit", async event => {
    event.preventDefault();

    try {
        await request("/transactions", {
            method: "POST",
            body: JSON.stringify({
                type: document.getElementById("transactionType").value,
                amount: Number(document.getElementById("transactionAmount").value),
                category: document.getElementById("transactionCategory").value.trim(),
                description: document.getElementById("transactionDescription").value.trim(),
                date: document.getElementById("transactionDate").value
            })
        });

        elements.transactionForm.reset();
        document.getElementById("transactionDate").value = today();
        await loadAllData();
    } catch (error) {
        showToast("Save failed", error.message);
    }
});

elements.budgetForm.addEventListener("submit", async event => {
    event.preventDefault();

    try {
        const data = await request("/budget", {
            method: "POST",
            body: JSON.stringify({ limit: Number(document.getElementById("budgetLimit").value) })
        });

        renderBudget(data.budgetStatus);
        showToast("Budget saved", data.message);
        await loadDashboard();
    } catch (error) {
        showToast("Budget failed", error.message);
    }
});

document.getElementById("applyFiltersBtn").addEventListener("click", loadTransactions);
document.getElementById("refreshDashboardBtn").addEventListener("click", loadDashboard);

document.getElementById("generateSuggestionsBtn").addEventListener("click", async () => {
    try {
        const data = await request("/ai/suggestions", { method: "POST" });
        renderSuggestions(data.suggestions);
        await loadSuggestions();
    } catch (error) {
        showToast("AI failed", error.message);
    }
});

document.getElementById("transactionDate").value = today();
setAuthenticatedView();
