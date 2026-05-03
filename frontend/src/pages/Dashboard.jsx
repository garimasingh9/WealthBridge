import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import {
    TrendingUp, TrendingDown, Wallet, PiggyBank, Percent,
    Lightbulb, ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

function KPICard({ title, value, icon: Icon, trend, trendValue, color, delay }) {
    return (
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: `${delay}s` }}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-dark-500 dark:text-dark-400 font-medium">{title}</p>
                    <h3 className="text-2xl lg:text-3xl font-heading font-bold text-dark-900 dark:text-white mt-2">
                        {value}
                    </h3>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend === 'up' ? 'text-accent-500' : 'text-red-400'
                            }`}>
                            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {trendValue}
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}

function InsightCard({ text, type = 'info', delay }) {
    const colors = {
        info: 'border-primary-500 bg-primary-50/50 dark:bg-primary-500/10',
        success: 'border-accent-500 bg-accent-50/50 dark:bg-accent-500/10',
        warning: 'border-amber-500 bg-amber-50/50 dark:bg-amber-500/10',
    };
    const iconColors = {
        info: 'text-primary-500',
        success: 'text-accent-500',
        warning: 'text-amber-500',
    };

    return (
        <div className={`insight-card ${colors[type]} animate-slide-up`} style={{ animationDelay: `${delay}s` }}>
            <div className="flex gap-3">
                <Lightbulb className={`w-5 h-5 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
                <p className="text-sm text-dark-700 dark:text-dark-200 leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-xl border border-dark-100 dark:border-dark-700">
                <p className="font-semibold text-dark-900 dark:text-white mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Dashboard() {
    const { user, financialData, updateFinancialData } = useAuth();
    const { monthlyIncome, monthlyExpenses, monthlySavings, savingsRate, monthlyTrend, expenseBreakdown } = financialData;
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [setupData, setSetupData] = useState({ income: '', expenses: '', savings: '' });

    const hasData = monthlyIncome > 0 || monthlyExpenses > 0;

    const handleSetupSubmit = (e) => {
        e.preventDefault();
        updateFinancialData({
            monthlyIncome: Number(setupData.income),
            monthlyExpenses: Number(setupData.expenses),
            emergencyFund: Number(setupData.savings)
        });
        setShowSetupModal(false);
    };

    const insights = hasData ? [
        { text: `Your savings rate is ${savingsRate}%, which is considered financially healthy. Aim for 40%+ for accelerated growth.`, type: 'success' },
        { text: `You can build ₹10,00,000 in 5 years if you save ₹15,000 monthly with smart investments at 12% returns.`, type: 'info' },
    ] : [];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome */}
            <div className="animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white">
                        Welcome back, <span className="gradient-text">{user?.displayName?.split(' ')[0] || 'User'}</span> 👋
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">Here's your financial overview for this month</p>
                </div>
                {!hasData ? (
                    <button className="btn-primary" onClick={() => setShowSetupModal(true)}>
                        Add Income Data
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <button className="btn-secondary px-4 py-2 border border-dark-200 dark:border-dark-700 rounded-xl text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors"
                            onClick={() => {
                                setSetupData({ income: monthlyIncome, expenses: monthlyExpenses, savings: financialData.emergencyFund });
                                setShowSetupModal(true);
                            }}>
                            Edit Plan
                        </button>
                        <button className="btn-secondary px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to reset your financial data?')) {
                                    updateFinancialData({ monthlyIncome: 0, monthlyExpenses: 0, emergencyFund: 0 });
                                }
                            }}>
                            Reset Data
                        </button>
                    </div>
                )}
            </div>

            {!hasData && (
                <div className="glass-card p-8 border-l-4 border-l-primary-500 animate-slide-up text-center bg-primary-50/50 dark:bg-primary-900/10">
                    <Wallet className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-bold text-dark-900 dark:text-white mb-2">You haven't added any financial data yet</h3>
                    <p className="text-dark-600 dark:text-dark-400 mb-6 max-w-md mx-auto">Start by adding your income and expenses to unlock insights, track your savings, and build a personalized financial roadmap.</p>
                    <button className="btn-primary inline-flex items-center gap-2" onClick={() => setShowSetupModal(true)}>
                        <TrendingUp className="w-4 h-4" /> Start Financial Plan
                    </button>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <KPICard
                    title="Monthly Income"
                    value={`₹${monthlyIncome.toLocaleString('en-IN')}`}
                    icon={Wallet}
                    trend={hasData ? "up" : null}
                    trendValue={hasData ? "+0.0% from last month" : ""}
                    color="from-primary-500 to-primary-600"
                    delay={0}
                />
                <KPICard
                    title="Monthly Expenses"
                    value={`₹${monthlyExpenses.toLocaleString('en-IN')}`}
                    icon={TrendingDown}
                    trend={hasData ? "down" : null}
                    trendValue={hasData ? "-0.0% from last month" : ""}
                    color="from-rose-500 to-rose-600"
                    delay={0.1}
                />
                <KPICard
                    title="Monthly Savings"
                    value={`₹${monthlySavings.toLocaleString('en-IN')}`}
                    icon={PiggyBank}
                    trend={hasData ? "up" : null}
                    trendValue={hasData ? "+₹0 vs last month" : ""}
                    color="from-accent-500 to-accent-600"
                    delay={0.2}
                />
                <KPICard
                    title="Savings Rate"
                    value={`${savingsRate}%`}
                    icon={Percent}
                    trend={hasData ? "up" : null}
                    trendValue={hasData ? (savingsRate >= 30 ? "Above 30% target" : "Below target") : ""}
                    color="from-violet-500 to-violet-600"
                    delay={0.3}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart */}
                <div className="lg:col-span-2 glass-card p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-heading font-bold text-dark-900 dark:text-white">Income vs Expenses</h2>
                            <p className="text-sm text-dark-400 dark:text-dark-500">Last 6 months trend</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                    </div>
                    {monthlyTrend && monthlyTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${(v / 1000)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ fill: '#6366f1', r: 5 }}
                                    activeDot={{ r: 7, stroke: '#6366f1', strokeWidth: 2 }}
                                    name="Income"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="#f43f5e"
                                    strokeWidth={3}
                                    dot={{ fill: '#f43f5e', r: 5 }}
                                    activeDot={{ r: 7, stroke: '#f43f5e', strokeWidth: 2 }}
                                    name="Expenses"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="savings"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 5 }}
                                    activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 2 }}
                                    name="Savings"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 bg-dark-50/50 dark:bg-dark-800/50 rounded-xl border border-dashed border-dark-200 dark:border-dark-700">
                            <TrendingUp className="w-8 h-8 text-dark-400 mb-3 opacity-50" />
                            <p className="text-dark-600 dark:text-dark-300 font-medium">No financial activity yet.</p>
                            <p className="text-sm text-dark-400 mt-1">Add income and expenses to see analytics.</p>
                        </div>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <div className="mb-6">
                        <h2 className="text-lg font-heading font-bold text-dark-900 dark:text-white">Expense Breakdown</h2>
                        <p className="text-sm text-dark-400 dark:text-dark-500">Category distribution</p>
                    </div>
                    {expenseBreakdown && expenseBreakdown.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={expenseBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {expenseBreakdown.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            color: 'white',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {expenseBreakdown.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-dark-600 dark:text-dark-400 truncate">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[250px] flex flex-col items-center justify-center text-center p-6 bg-dark-50/50 dark:bg-dark-800/50 rounded-xl border border-dashed border-dark-200 dark:border-dark-700">
                            <PieChart className="w-8 h-8 text-dark-400 mb-3 opacity-50" />
                            <p className="text-dark-600 dark:text-dark-300 font-medium tracking-tight">No expense data.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Financial Insights */}
            {hasData && insights.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary-500" />
                        <h2 className="text-lg font-heading font-bold text-dark-900 dark:text-white">Financial Insights</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight, i) => (
                            <InsightCard key={i} {...insight} delay={0.7 + i * 0.1} />
                        ))}
                    </div>
                </div>
            )}

            {/* Setup Modal */}
            {showSetupModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-heading font-bold text-dark-900 dark:text-white">{hasData ? 'Update Financial Plan' : "Let's Get Started"}</h2>
                            <button onClick={() => setShowSetupModal(false)} className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700">
                                <X className="w-5 h-5 text-dark-400" />
                            </button>
                        </div>
                        <p className="text-sm text-dark-500 dark:text-dark-400 mb-6">Enter your basic financial details to unlock personalized insights and tracking.</p>
                        <form onSubmit={handleSetupSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Monthly Income (₹)</label>
                                <input
                                    type="number"
                                    value={setupData.income}
                                    onChange={e => setSetupData({ ...setupData, income: e.target.value })}
                                    placeholder="85000"
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Monthly Expenses (₹)</label>
                                <input
                                    type="number"
                                    value={setupData.expenses}
                                    onChange={e => setSetupData({ ...setupData, expenses: e.target.value })}
                                    placeholder="40000"
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Current Total Savings (₹)</label>
                                <input
                                    type="number"
                                    value={setupData.savings}
                                    onChange={e => setSetupData({ ...setupData, savings: e.target.value })}
                                    placeholder="100000"
                                    className="input-field"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600">
                                Save Profile
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
