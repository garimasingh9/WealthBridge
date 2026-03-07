import { useAuth } from '../context/AuthContext';
import { FileText, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Download, Lightbulb, Star, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function MonthlyReport() {
    const { user, financialData } = useAuth();
    const { monthlyIncome, monthlyExpenses, monthlySavings, savingsRate, expenseBreakdown, healthScore } = financialData;

    const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    const mistakes = [
        { text: 'Food spending exceeded budget by ₹2,000', severity: 'medium' },
        { text: 'Shopping impulse buys totaled ₹2,000 over recommended', severity: 'medium' },
        { text: 'Emergency fund is below the recommended 6-month coverage', severity: 'high' },
        { text: 'No investment contribution made this month', severity: 'low' },
    ];

    const improvements = [
        { text: 'Reduce dining out to save ₹2,000/month (₹24,000/year)', impact: 'high' },
        { text: 'Set up auto-invest SIP of ₹5,000/month in index fund', impact: 'high' },
        { text: 'Cancel unused subscriptions to save ₹500/month', impact: 'low' },
        { text: 'Use 50-30-20 budgeting rule for better allocation', impact: 'medium' },
        { text: 'Increase emergency fund contribution by ₹3,000/month', impact: 'high' },
    ];

    const grades = [
        { label: 'Savings Rate', value: savingsRate >= 30 ? 'A' : savingsRate >= 20 ? 'B' : 'C', color: savingsRate >= 30 ? 'text-accent-500' : 'text-amber-500' },
        { label: 'Expense Control', value: 'B+', color: 'text-primary-500' },
        { label: 'Goal Progress', value: 'B', color: 'text-primary-500' },
        { label: 'Emergency Fund', value: 'C+', color: 'text-amber-500' },
        { label: 'Investment Activity', value: 'C', color: 'text-amber-500' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary-500" /> Monthly Report
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">{month} Financial Summary</p>
                </div>
                <button className="btn-secondary flex items-center gap-2" id="download-report-btn">
                    <Download className="w-4 h-4" /> Download PDF
                </button>
            </div>

            {/* Report header card */}
            <div className="glass-card p-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10 dark:from-primary-500/5 dark:to-accent-500/5 animate-slide-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-sm text-dark-400 uppercase tracking-wider">Report For</p>
                        <h2 className="text-2xl font-heading font-bold text-dark-900 dark:text-white">{user?.name || 'User'}</h2>
                        <p className="text-sm text-dark-400 mt-1">{month}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-xs text-dark-400">Health Score</p>
                            <p className="text-3xl font-heading font-bold gradient-text">{healthScore}/100</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-dark-400">Overall Grade</p>
                            <p className="text-3xl font-heading font-bold text-primary-500">B+</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Numbers */}
                <div className="lg:col-span-2 glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-lg font-heading font-bold text-dark-900 dark:text-white mb-4">Financial Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-accent-50/50 dark:bg-accent-500/10">
                            <TrendingUp className="w-5 h-5 text-accent-500 mb-1" />
                            <p className="text-xs text-dark-400">Total Income</p>
                            <p className="text-xl font-bold text-dark-900 dark:text-white">₹{monthlyIncome.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-500/10">
                            <TrendingDown className="w-5 h-5 text-red-500 mb-1" />
                            <p className="text-xs text-dark-400">Total Expenses</p>
                            <p className="text-xl font-bold text-dark-900 dark:text-white">₹{monthlyExpenses.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-primary-50/50 dark:bg-primary-500/10">
                            <Star className="w-5 h-5 text-primary-500 mb-1" />
                            <p className="text-xs text-dark-400">Net Savings</p>
                            <p className="text-xl font-bold text-accent-500">₹{monthlySavings.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-500/10">
                            <TrendingUp className="w-5 h-5 text-violet-500 mb-1" />
                            <p className="text-xs text-dark-400">Savings Rate</p>
                            <p className="text-xl font-bold text-dark-900 dark:text-white">{savingsRate}%</p>
                        </div>
                    </div>
                </div>

                {/* Expense pie */}
                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-lg font-heading font-bold text-dark-900 dark:text-white mb-2">Spending Split</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                                {expenseBreakdown.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Grades */}
            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-heading font-bold text-dark-900 dark:text-white mb-4">Performance Grades</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {grades.map((grade, i) => (
                        <div key={i} className="text-center p-4 rounded-xl bg-dark-50 dark:bg-dark-800">
                            <p className={`text-3xl font-heading font-bold ${grade.color}`}>{grade.value}</p>
                            <p className="text-xs text-dark-400 mt-1">{grade.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mistakes & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-lg font-heading font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" /> Financial Mistakes
                    </h3>
                    <div className="space-y-3">
                        {mistakes.map((mistake, i) => (
                            <div key={i} className={`p-3 rounded-xl flex items-start gap-2 ${mistake.severity === 'high' ? 'bg-red-50/50 dark:bg-red-500/10' :
                                    mistake.severity === 'medium' ? 'bg-amber-50/50 dark:bg-amber-500/10' :
                                        'bg-dark-50 dark:bg-dark-800'
                                }`}>
                                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${mistake.severity === 'high' ? 'text-red-500' : 'text-amber-500'
                                    }`} />
                                <p className="text-sm text-dark-600 dark:text-dark-300">{mistake.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <h3 className="text-lg font-heading font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-accent-500" /> Improvement Suggestions
                    </h3>
                    <div className="space-y-3">
                        {improvements.map((imp, i) => (
                            <div key={i} className={`p-3 rounded-xl flex items-start gap-2 ${imp.impact === 'high' ? 'bg-accent-50/50 dark:bg-accent-500/10' :
                                    imp.impact === 'medium' ? 'bg-primary-50/50 dark:bg-primary-500/10' :
                                        'bg-dark-50 dark:bg-dark-800'
                                }`}>
                                <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${imp.impact === 'high' ? 'text-accent-500' : 'text-primary-500'
                                    }`} />
                                <p className="text-sm text-dark-600 dark:text-dark-300">{imp.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
