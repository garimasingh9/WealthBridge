import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PiggyBank, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const strategies = [
    { id: 'savings', name: 'Savings Account', rate: 3.5, icon: '🏦', color: '#6366f1', description: 'Regular bank savings with minimal risk' },
    { id: 'fd', name: 'Fixed Deposit', rate: 7.0, icon: '🔒', color: '#10b981', description: 'Locked investment with guaranteed returns' },
    { id: 'rd', name: 'Recurring Deposit', rate: 6.5, icon: '📅', color: '#f59e0b', description: 'Monthly deposits with compound interest' },
    { id: 'manual', name: 'Manual Savings', rate: 0, icon: '💰', color: '#ef4444', description: 'Cash savings with no interest earned' },
];

function calculateReturns(monthly, years, rate) {
    if (rate === 0) return monthly * 12 * years;
    const months = years * 12;
    const r = rate / 100 / 12;
    return Math.round(monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r));
}

export default function SavingStrategy() {
    const { financialData } = useAuth();
    const [monthly, setMonthly] = useState(financialData?.monthlySavings > 0 ? financialData.monthlySavings : 10000);
    const [years, setYears] = useState(5);

    const results = strategies.map(s => ({
        ...s,
        total: calculateReturns(monthly, years, s.rate),
        invested: monthly * 12 * years,
        interest: calculateReturns(monthly, years, s.rate) - monthly * 12 * years,
    }));

    const bestOption = results.reduce((a, b) => a.total > b.total ? a : b);

    const chartData = results.map(r => ({
        name: r.name,
        invested: r.invested,
        interest: r.interest,
        color: r.color,
    }));

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="animate-fade-in">
                <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                    <PiggyBank className="w-8 h-8 text-primary-500" /> Smart Saving Strategy
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Compare saving methods and find the best option for you</p>
            </div>

            {/* Inputs */}
            <div className="glass-card p-6 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Monthly Savings (₹)</label>
                        <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={monthly}
                            onChange={e => setMonthly(Number(e.target.value))}
                            className="w-full accent-primary-500"
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-dark-400">₹1,000</span>
                            <span className="text-lg font-bold gradient-text">₹{monthly.toLocaleString('en-IN')}/mo</span>
                            <span className="text-xs text-dark-400">₹1,00,000</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Duration (Years)</label>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            value={years}
                            onChange={e => setYears(Number(e.target.value))}
                            className="w-full accent-primary-500"
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-dark-400">1 yr</span>
                            <span className="text-lg font-bold gradient-text">{years} years</span>
                            <span className="text-xs text-dark-400">30 yrs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison chart */}
            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-heading font-bold text-dark-900 dark:text-white mb-4">Returns Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
                        <Tooltip
                            formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name === 'invested' ? 'Amount Invested' : 'Interest Earned']}
                            contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                        />
                        <Bar dataKey="invested" stackId="a" fill="#94a3b8" name="invested" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="interest" stackId="a" name="interest" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Strategy cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((strategy, i) => (
                    <div
                        key={strategy.id}
                        className={`glass-card p-6 animate-slide-up ${strategy.id === bestOption.id ? 'ring-2 ring-accent-500 dark:ring-accent-400' : ''}`}
                        style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                    >
                        {strategy.id === bestOption.id && (
                            <div className="flex items-center gap-1 text-accent-500 text-xs font-bold mb-3 uppercase tracking-wider">
                                <CheckCircle className="w-4 h-4" /> Best Option
                            </div>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{strategy.icon}</span>
                            <div>
                                <h3 className="font-heading font-bold text-dark-900 dark:text-white">{strategy.name}</h3>
                                <p className="text-xs text-dark-400">{strategy.description}</p>
                            </div>
                            <span className="ml-auto text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${strategy.color}20`, color: strategy.color }}>
                                {strategy.rate}% p.a.
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <p className="text-xs text-dark-400">Invested</p>
                                <p className="font-semibold text-dark-900 dark:text-white">₹{strategy.invested.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-dark-400">Interest</p>
                                <p className="font-semibold text-accent-500">₹{strategy.interest.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-dark-400">Total</p>
                                <p className="font-bold gradient-text">₹{strategy.total.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommendation */}
            <div className="glass-card p-6 border-l-4 border-l-accent-500 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-heading font-bold text-dark-900 dark:text-white mb-1">Our Recommendation</h3>
                        <p className="text-sm text-dark-600 dark:text-dark-300">
                            If you save <strong>₹{monthly.toLocaleString('en-IN')}/month</strong> in a <strong>{bestOption.name}</strong> at{' '}
                            <strong>{bestOption.rate}% interest</strong>, you will earn <strong>₹{bestOption.interest.toLocaleString('en-IN')}</strong> more
                            compared to manual savings over {years} years. Your total corpus will be{' '}
                            <strong className="gradient-text">₹{bestOption.total.toLocaleString('en-IN')}</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
