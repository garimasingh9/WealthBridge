import { useAuth } from '../context/AuthContext';
import { BarChart3, TrendingDown, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HabitAnalyzer() {
    const { financialData } = useAuth();
    const habits = financialData.spendingHabits;

    const categories = [
        { key: 'food', label: 'Food & Dining', icon: '🍔', color: '#f59e0b' },
        { key: 'transport', label: 'Transport', icon: '🚗', color: '#10b981' },
        { key: 'shopping', label: 'Shopping', icon: '🛍️', color: '#ec4899' },
        { key: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
    ];

    const chartData = categories.map(cat => ({
        name: cat.label,
        current: habits[cat.key].current,
        recommended: habits[cat.key].recommended,
        color: cat.color,
    }));

    const totalOverspend = categories.reduce((sum, cat) => {
        return sum + Math.max(0, habits[cat.key].current - habits[cat.key].recommended);
    }, 0);

    const yearlyImpact = totalOverspend * 12;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="animate-fade-in">
                <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-primary-500" /> Money Habit Analyzer
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Understand and optimize your spending patterns</p>
            </div>

            {/* Overview card */}
            <div className="glass-card p-6 border-l-4 border-l-amber-500 animate-slide-up">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-heading font-bold text-dark-900 dark:text-white mb-1">Spending Alert</h3>
                        <p className="text-sm text-dark-600 dark:text-dark-300">
                            You're overspending <strong className="text-amber-500">₹{totalOverspend.toLocaleString('en-IN')}/month</strong> across
                            categories compared to recommended budgets. This means{' '}
                            <strong className="text-red-500">₹{yearlyImpact.toLocaleString('en-IN')}/year</strong> in
                            potential savings you're missing out on!
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-heading font-bold text-dark-900 dark:text-white mb-4">Current vs Recommended Spending</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                            formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                            contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                        />
                        <Bar dataKey="current" name="Current" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="recommended" name="Recommended" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Category breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat, i) => {
                    const current = habits[cat.key].current;
                    const recommended = habits[cat.key].recommended;
                    const overspend = current - recommended;
                    const isOver = overspend > 0;

                    return (
                        <div key={cat.key} className="glass-card p-6 animate-slide-up" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{cat.icon}</span>
                                <div className="flex-1">
                                    <h3 className="font-heading font-bold text-dark-900 dark:text-white">{cat.label}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {isOver ? (
                                            <TrendingDown className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <TrendingUp className="w-4 h-4 text-accent-500" />
                                        )}
                                        <span className={`text-xs font-semibold ${isOver ? 'text-red-500' : 'text-accent-500'}`}>
                                            {isOver ? `₹${overspend.toLocaleString('en-IN')} over budget` : 'Within budget ✓'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-500/10">
                                    <p className="text-xs text-dark-400">Current</p>
                                    <p className="font-bold text-dark-900 dark:text-white">₹{current.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-accent-50/50 dark:bg-accent-500/10">
                                    <p className="text-xs text-dark-400">Recommended</p>
                                    <p className="font-bold text-accent-600 dark:text-accent-400">₹{recommended.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            {isOver && (
                                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/10 flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-dark-600 dark:text-dark-300">
                                        Reducing {cat.label.toLowerCase()} by ₹{overspend.toLocaleString('en-IN')} can increase yearly savings by{' '}
                                        <strong>₹{(overspend * 12).toLocaleString('en-IN')}</strong>.
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
