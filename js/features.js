// Expense Tracker Core Features
// Dummy data for demonstration
const categories = ['Groceries', 'Food', 'Education', 'Business', 'Other'];
let expenses = [
    { date: '2025-08-01', category: 'Groceries', amount: 120 },
    { date: '2025-08-02', category: 'Food', amount: 60 },
    { date: '2025-08-03', category: 'Education', amount: 200 },
    { date: '2025-08-04', category: 'Business', amount: 350 },
    { date: '2025-07-15', category: 'Groceries', amount: 90 },
    { date: '2025-07-20', category: 'Food', amount: 40 },
    { date: '2025-06-10', category: 'Education', amount: 150 },
    { date: '2025-06-12', category: 'Business', amount: 300 },
];

function getMonthlyExpenses(month, year) {
    return expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
    });
}

function getQuarterlyExpenses(q, year) {
    const startMonth = (q - 1) * 3 + 1;
    return expenses.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() + 1 >= startMonth && d.getMonth() + 1 < startMonth + 3;
    });
}

function getYearlyExpenses(year) {
    return expenses.filter(e => (new Date(e.date)).getFullYear() === year);
}

function getCategoryTotals(expensesList) {
    const totals = {};
    categories.forEach(cat => totals[cat] = 0);
    expensesList.forEach(e => {
        if (totals[e.category] !== undefined) totals[e.category] += e.amount;
        else totals['Other'] += e.amount;
    });
    return totals;
}

function predictBudget(income) {
    // Simple prediction: 50% needs, 30% wants, 20% savings
    return {
        needs: income * 0.5,
        wants: income * 0.3,
        savings: income * 0.2
    };
}

// Expose for app.js
window.ExpenseFeatures = {
    getMonthlyExpenses,
    getQuarterlyExpenses,
    getYearlyExpenses,
    getCategoryTotals,
    predictBudget,
    categories,
    expenses
};
