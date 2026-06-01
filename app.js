:root {
    --bg: #080d1b;
    --bg-2: #0d1326;
    --surface: rgba(18, 27, 51, 0.82);
    --surface-strong: rgba(27, 38, 68, 0.94);
    --surface-soft: rgba(255, 255, 255, 0.055);
    --line: rgba(255, 255, 255, 0.10);
    --line-strong: rgba(139, 92, 246, 0.42);
    --text: #f8fafc;
    --muted: #aeb8cf;
    --muted-2: #74819c;
    --primary: #8b5cf6;
    --primary-2: #38bdf8;
    --success: #4ade80;
    --danger: #fb7185;
    --warning: #f59e0b;
    --shadow: 0 28px 90px rgba(0, 0, 0, 0.42);
    --radius: 24px;
}

* {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    margin: 0;
    min-height: 100vh;
    background:
        radial-gradient(circle at 18% 8%, rgba(79, 70, 229, 0.26), transparent 34%),
        radial-gradient(circle at 92% 12%, rgba(14, 165, 233, 0.14), transparent 26%),
        radial-gradient(circle at 70% 88%, rgba(168, 85, 247, 0.16), transparent 28%),
        linear-gradient(135deg, var(--bg), var(--bg-2));
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 58px 58px;
    mask-image: linear-gradient(to bottom, black, transparent 82%);
}

button,
input,
select {
    font: inherit;
}

button {
    cursor: pointer;
}

.hidden {
    display: none !important;
}

.app-shell {
    display: grid;
    grid-template-columns: 292px minmax(0, 1fr);
    min-height: 100vh;
}

.sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    padding: 28px 22px;
    background: rgba(8, 13, 27, 0.78);
    border-right: 1px solid var(--line);
    backdrop-filter: blur(22px);
    display: flex;
    flex-direction: column;
    gap: 34px;
    z-index: 2;
}

.brand {
    display: flex;
    align-items: center;
    gap: 14px;
}

.brand-mark {
    width: 48px;
    height: 48px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #7c3aed, #38bdf8);
    color: #ffffff;
    font-weight: 950;
    font-size: 20px;
    box-shadow: 0 18px 40px rgba(124, 58, 237, 0.36);
}

.brand h1 {
    margin: 0;
    font-size: 19px;
    letter-spacing: -0.03em;
}

.brand p,
.connection-card p,
.panel-header p,
.stat-card small {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 13px;
}

.nav-list {
    display: grid;
    gap: 11px;
}

.nav-item,
.side-link {
    border: 1px solid transparent;
    border-radius: 17px;
    padding: 15px 16px;
    background: transparent;
    color: #dbe4f7;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 13px;
    font-weight: 750;
    transition: 0.18s ease;
}

.nav-item span,
.side-link span {
    width: 26px;
    color: #b7c5dd;
    font-size: 20px;
}

.nav-item:hover,
.nav-item.active {
    border-color: rgba(139, 92, 246, 0.46);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.82), rgba(124, 58, 237, 0.58));
    color: #ffffff;
    box-shadow: 0 18px 42px rgba(88, 80, 236, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.16);
    transform: translateX(2px);
}

.nav-item.active span,
.nav-item:hover span {
    color: #ffffff;
}

.sidebar-bottom {
    margin-top: auto;
    display: grid;
    gap: 14px;
}

.side-link {
    width: 100%;
    color: var(--muted);
}

.side-link:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
    border-color: var(--line);
}

.connection-card,
.premium-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 1px solid var(--line);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.055);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.premium-card {
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.20), rgba(15, 23, 42, 0.42));
}

.premium-card p {
    margin: 6px 0 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.45;
}

.premium-card > span {
    width: 44px;
    height: 44px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(139, 92, 246, 0.24);
    color: #d8b4fe;
}

.status-dot {
    width: 12px;
    height: 12px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: var(--danger);
    box-shadow: 0 0 0 7px rgba(251, 113, 133, 0.14);
}

.status-dot.connected {
    background: var(--success);
    box-shadow: 0 0 0 7px rgba(74, 222, 128, 0.14);
}

.main-content {
    padding: 34px 38px 42px;
    position: relative;
    z-index: 1;
}

.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    margin-bottom: 28px;
}

.eyebrow {
    margin: 0 0 6px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 12px;
    color: #93c5fd;
    font-weight: 850;
}

.topbar h2,
.auth-copy h2 {
    margin: 0;
    font-size: clamp(30px, 4vw, 46px);
    letter-spacing: -0.05em;
    line-height: 1;
}

.topbar-actions,
.user-area {
    display: flex;
    align-items: center;
    gap: 12px;
}

.date-chip,
.notification-dot,
.user-badge,
.pill,
.panel-badge {
    border: 1px solid var(--line);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.065);
    color: #dce7ff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.date-chip,
.notification-dot,
.user-badge,
.pill,
.panel-badge {
    padding: 10px 14px;
    font-weight: 800;
    font-size: 13px;
}

.notification-dot {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    padding: 0;
}

.auth-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.16fr) 430px;
    gap: 24px;
    align-items: stretch;
}

.auth-copy,
.auth-card,
.panel,
.stat-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.055);
    backdrop-filter: blur(18px);
}

.auth-copy {
    min-height: 560px;
    padding: 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
    overflow: hidden;
    position: relative;
}

.auth-copy::after {
    content: "";
    position: absolute;
    width: 420px;
    height: 420px;
    right: -160px;
    bottom: -170px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.34), transparent 68%);
}

.auth-copy p {
    max-width: 760px;
    margin: 0;
    color: var(--muted);
    font-size: 18px;
    line-height: 1.7;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
}

.feature-grid div {
    padding: 16px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.055);
    font-weight: 850;
}

.feature-grid span {
    display: block;
    margin-bottom: 10px;
    color: #93c5fd;
    font-size: 12px;
}

.auth-card {
    padding: 28px;
}

.tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 6px;
    margin-bottom: 22px;
}

.tab-btn {
    border: 0;
    border-radius: 14px;
    padding: 12px;
    background: transparent;
    color: var(--muted);
    font-weight: 850;
}

.tab-btn.active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.90), rgba(139, 92, 246, 0.76));
    color: #ffffff;
    box-shadow: 0 12px 28px rgba(124, 58, 237, 0.20);
}

.form-stack {
    display: grid;
    gap: 15px;
}

label {
    display: grid;
    gap: 8px;
    color: #c6d1e8;
    font-size: 14px;
    font-weight: 750;
}

input,
select {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: 15px;
    padding: 13px 14px;
    background: rgba(5, 10, 24, 0.58);
    color: var(--text);
    outline: 0;
}

select option {
    background: #0f172a;
    color: var(--text);
}

input::placeholder {
    color: #64748b;
}

input:focus,
select:focus {
    border-color: rgba(56, 189, 248, 0.72);
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.12);
}

.primary-btn,
.ghost-btn,
.delete-btn {
    border: 1px solid transparent;
    border-radius: 15px;
    padding: 12px 16px;
    font-weight: 900;
    transition: 0.18s ease;
}

.primary-btn {
    background: linear-gradient(135deg, #7c3aed, #38bdf8);
    color: #ffffff;
    box-shadow: 0 16px 38px rgba(99, 102, 241, 0.22);
}

.primary-btn:hover,
.ghost-btn:hover,
.delete-btn:hover {
    transform: translateY(-1px);
}

.ghost-btn {
    background: rgba(255, 255, 255, 0.07);
    border-color: var(--line);
    color: #e2e8f0;
}

.delete-btn {
    background: rgba(251, 113, 133, 0.10);
    border-color: rgba(251, 113, 133, 0.18);
    color: var(--danger);
}

.content-section {
    display: none;
}

.active-section {
    display: block;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin-bottom: 20px;
}

.stat-card {
    min-height: 150px;
    padding: 22px;
    position: relative;
    overflow: hidden;
}

.stat-card::after {
    content: "";
    position: absolute;
    right: -42px;
    bottom: -52px;
    width: 160px;
    height: 120px;
    border-radius: 50%;
    opacity: 0.24;
    filter: blur(1px);
}

.income-card::after { background: #22c55e; }
.expense-card::after { background: #f43f5e; }
.balance-card::after { background: #38bdf8; }
.budget-summary-card::after { background: #a855f7; }

.stat-icon {
    width: 45px;
    height: 45px;
    border-radius: 17px;
    display: grid;
    place-items: center;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid var(--line);
}

.stat-card span {
    color: var(--muted);
    font-weight: 850;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.stat-card strong {
    display: block;
    margin-top: 8px;
    font-size: clamp(22px, 2.5vw, 31px);
    letter-spacing: -0.05em;
    position: relative;
    z-index: 1;
}

.dashboard-grid,
.layout-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: 20px;
}

.layout-grid.compact {
    grid-template-columns: 430px 1fr;
}

.panel {
    padding: 24px;
}

.ai-panel {
    border-color: var(--line-strong);
    box-shadow: var(--shadow), 0 0 0 1px rgba(139, 92, 246, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.055);
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
}

.panel-header h3 {
    margin: 0;
    font-size: 21px;
    letter-spacing: -0.03em;
}

.chart-panel {
    min-height: 430px;
}

.chart-panel canvas {
    max-height: 330px;
}

.transaction-list,
.suggestions-grid {
    display: grid;
    gap: 12px;
}

.empty-state {
    color: var(--muted);
    padding: 18px;
    border: 1px dashed rgba(255, 255, 255, 0.16);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
}

.transaction-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 15px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.045);
}

.transaction-main {
    display: flex;
    align-items: center;
    gap: 12px;
}

.transaction-icon {
    width: 38px;
    height: 38px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: rgba(56, 189, 248, 0.14);
    color: #7dd3fc;
}

.transaction-title {
    display: block;
    margin-bottom: 4px;
}

.transaction-meta {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
}

.transaction-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.transaction-amount {
    font-weight: 950;
    white-space: nowrap;
}

.transaction-amount.income {
    color: var(--success);
}

.transaction-amount.expense {
    color: var(--danger);
}

.filters {
    display: grid;
    grid-template-columns: 1.2fr repeat(3, minmax(130px, 0.7fr)) auto;
    gap: 10px;
    margin-bottom: 14px;
}

.budget-meter {
    height: 18px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
    margin-bottom: 22px;
}

.budget-meter div {
    width: 0;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #22c55e, #8b5cf6, #38bdf8);
    box-shadow: 0 0 26px rgba(139, 92, 246, 0.38);
    transition: width 0.3s ease;
}

.budget-numbers {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
}

.budget-numbers div,
.suggestion-card {
    padding: 16px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.05);
}

.budget-numbers span,
.suggestion-card span {
    display: block;
    margin-bottom: 8px;
    color: var(--muted);
    font-size: 13px;
    font-weight: 850;
}

.budget-numbers strong {
    font-size: 20px;
}

.suggestions-grid:not(.empty-state) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.suggestion-card {
    position: relative;
    overflow: hidden;
}

.suggestion-card::before {
    content: "✦";
    position: absolute;
    right: 16px;
    top: 12px;
    color: #c084fc;
}

.suggestion-card p {
    margin: 0;
    line-height: 1.6;
    color: #e5e7eb;
}

.toast-container {
    position: fixed;
    right: 22px;
    bottom: 22px;
    display: grid;
    gap: 12px;
    z-index: 20;
}

.toast {
    width: min(370px, calc(100vw - 44px));
    padding: 16px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.94);
    color: #ffffff;
    box-shadow: var(--shadow);
    backdrop-filter: blur(16px);
}

.toast strong {
    display: block;
    margin-bottom: 4px;
}

@media (max-width: 1180px) {
    .app-shell {
        grid-template-columns: 1fr;
    }

    .sidebar {
        position: static;
        height: auto;
    }

    .nav-list {
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    .sidebar-bottom {
        grid-template-columns: 1fr 1fr;
    }

    .auth-grid,
    .dashboard-grid,
    .layout-grid,
    .layout-grid.compact {
        grid-template-columns: 1fr;
    }

    .stats-grid,
    .feature-grid,
    .budget-numbers {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .filters {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 760px) {
    .main-content,
    .sidebar,
    .auth-copy,
    .auth-card,
    .panel {
        padding: 18px;
    }

    .topbar,
    .panel-header,
    .transaction-item {
        align-items: stretch;
        flex-direction: column;
    }

    .topbar-actions,
    .user-area {
        align-items: stretch;
        flex-direction: column;
    }

    .nav-list,
    .sidebar-bottom,
    .stats-grid,
    .feature-grid,
    .budget-numbers,
    .filters {
        grid-template-columns: 1fr;
    }

    .transaction-actions {
        justify-content: space-between;
    }
}
