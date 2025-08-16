// Import features.js
const pages = ['home', 'login', 'profile', 'history', 'report', 'predict'];

function loadPage(page) {
    fetch(`pages/${page}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById('app').innerHTML = html;
            setTimeout(() => {
                if (page === 'home') renderDashboard();
                if (page === 'report') renderReport('monthly');
                if (page === 'history') renderHistory();
                if (page === 'predict') renderPrediction();
            }, 0);
        });
}

function renderNavbar() {
    if (document.querySelector('.navbar')) return;
    const nav = `<nav class="navbar">
        <span style="font-weight:bold; color:#25d366;">Expense Tracker</span>
        <div>
            <a href="#home">Home</a>
            <a href="#history">History</a>
            <a href="#report">Reports</a>
            <a href="#predict">Prediction</a>
            <a href="#profile">Profile</a>
            <a href="#login">Login</a>
        </div>
    </nav>`;
    document.body.insertAdjacentHTML('afterbegin', nav);
}

window.addEventListener('hashchange', () => {
    const page = location.hash.replace('#', '') || 'home';
    if (pages.includes(page)) loadPage(page);
});

window.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    const page = location.hash.replace('#', '') || 'home';
    if (pages.includes(page)) loadPage(page);
    else loadPage('home');
});

// Dashboard summary
function formatINR(amount) {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
}

function renderDashboard() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const monthly = window.ExpenseFeatures.getMonthlyExpenses(month, year);
    const total = monthly.reduce((sum, e) => sum + e.amount, 0);
    document.getElementById('dashboard-summary').innerHTML = `
        <h3>This Month's Expenses: ${formatINR(total)}</h3>
        <ul>
            ${monthly.map(e => `<li>${e.date}: ${formatINR(e.amount)} (${e.category})</li>`).join('')}
        </ul>
    `;
}

// History page
function renderHistory() {
    const years = [...new Set(window.ExpenseFeatures.expenses.map(e => (new Date(e.date)).getFullYear()))];
    let html = '';
    years.forEach(y => {
        html += `<h4>${y}</h4><ul>`;
        for (let m = 1; m <= 12; m++) {
            const monthExp = window.ExpenseFeatures.getMonthlyExpenses(m, y);
            if (monthExp.length) {
                html += `<li><b>${y}-${String(m).padStart(2, '0')}</b>: ${formatINR(monthExp.reduce((s, e) => s + e.amount, 0))}</li>`;
            }
        }
        html += '</ul>';
    });
    document.getElementById('history-list').innerHTML = html;
}

// Report page
function renderReport(type) {
    let data = [];
    const now = new Date();
    const year = now.getFullYear();
    if (type === 'monthly') data = window.ExpenseFeatures.getMonthlyExpenses(now.getMonth() + 1, year);
    if (type === 'quarterly') data = window.ExpenseFeatures.getQuarterlyExpenses(Math.floor(now.getMonth() / 3) + 1, year);
    if (type === 'yearly') data = window.ExpenseFeatures.getYearlyExpenses(year);
    const totals = window.ExpenseFeatures.getCategoryTotals(data);
    document.getElementById('report-content').innerHTML = `<h4>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h4>
        <ul>${Object.entries(totals).map(([cat, amt]) => `<li>${cat}: ${formatINR(amt)}</li>`).join('')}</ul>`;
    renderPieChart(totals);
}

window.showReport = renderReport;

// Pie chart using Chart.js CDN
function renderPieChart(totals) {
    if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => renderPieChart(totals);
        document.body.appendChild(script);
        return;
    }
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (window.pieChartInstance) window.pieChartInstance.destroy();
    window.pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(totals),
            datasets: [{
                data: Object.values(totals),
                backgroundColor: ['#075e54', '#25d366', '#128c7e', '#34b7f1', '#222'],
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: '#e0ffe0' } }
            }
        }
    });
}

// Prediction page
function renderPrediction() {
    document.getElementById('predictForm').onsubmit = function(e) {
        e.preventDefault();
        const income = Number(document.getElementById('expectedIncome').value);
        const result = window.ExpenseFeatures.predictBudget(income);
        document.getElementById('prediction-result').innerHTML = `
            <h4>Recommended Budget</h4>
            <ul>
                <li>Needs: ${formatINR(result.needs)}</li>
                <li>Wants: ${formatINR(result.wants)}</li>
                <li>Savings: ${formatINR(result.savings)}</li>
            </ul>
        `;
    };
}
