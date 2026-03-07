import { useAuth } from '../context/AuthContext';
import { Heart, TrendingUp, Shield, Wallet, BarChart3, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

function ScoreRing({ score, size = 200 }) {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    let color = '#ef4444';
    let status = 'Needs Improvement';
    let statusColor = 'text-red-500';
    if (score >= 80) { color = '#10b981'; status = 'Excellent Financial Health'; statusColor = 'text-accent-500'; }
    else if (score >= 60) { color = '#6366f1'; status = 'Good Financial Stability'; statusColor = 'text-primary-500'; }
    else if (score >= 40) { color = '#f59e0b'; status = 'Fair – Room for Growth'; statusColor = 'text-amber-500'; }

    return (
        <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke="currentColor"
                        className="text-dark-100 dark:text-dark-700"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="score-ring"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-5xl font-heading font-bold text-dark-900 dark:text-white">{score}</span>
                    <span className="text-sm text-dark-400 dark:text-dark-500">out of 100</span>
                </div>
            </div>
            <p className={`text-lg font-heading font-bold mt-4 ${statusColor}`}>{status}</p>
        </div>
    );
}

function FactorCard({ icon: Icon, label, value, maxValue, description, color }) {
    const percentage = Math.round((value / maxValue) * 100);
    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="font-semibold text-dark-900 dark:text-white text-sm">{label}</h4>
                    <p className="text-xs text-dark-400">{description}</p>
                </div>
                <span className="ml-auto text-lg font-bold text-dark-900 dark:text-white">{value}/{maxValue}</span>
            </div>
            <div className="w-full h-2 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${color.includes('primary') ? '#6366f1' : color.includes('accent') ? '#10b981' : color.includes('amber') ? '#f59e0b' : '#8b5cf6'}, ${color.includes('primary') ? '#818cf8' : color.includes('accent') ? '#34d399' : color.includes('amber') ? '#fbbf24' : '#a78bfa'})`
                }} />
            </div>
        </div>
    );
}

export default function HealthScore() {
    const { financialData } = useAuth();
    const { monthlyIncome, monthlyExpenses, emergencyFund, savingsRate, investments, healthScore } = financialData;
    const score = healthScore || 0;

    // dynamic factor calculation
    const savingsScore = Math.min(25, Math.floor((savingsRate / 30) * 25));
    const efRatio = emergencyFund / (monthlyExpenses * 6 || 1);
    const emergencyScore = Math.min(25, Math.floor(efRatio * 25));
    const expenseRatio = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) : 0;
    const expenseScore = Math.min(25, Math.max(0, Math.floor((1 - expenseRatio) * 25)));
    const investRatio = monthlyIncome > 0 ? (investments / monthlyIncome) : 0;
    const investScore = Math.min(25, Math.floor((investRatio / 2) * 25));

    const factors = [
        { icon: Wallet, label: 'Savings Rate', value: savingsScore || 0, maxValue: 25, description: `${savingsRate}% of income saved`, color: 'from-primary-500 to-primary-600' },
        { icon: Shield, label: 'Emergency Fund', value: emergencyScore || 0, maxValue: 25, description: `${Math.round(efRatio * 100)}% of recommended 6mo fund built`, color: 'from-accent-500 to-accent-600' },
        { icon: BarChart3, label: 'Expense Ratio', value: expenseScore || 0, maxValue: 25, description: `Expenses are ${Math.round(expenseRatio * 100)}% of income`, color: 'from-amber-500 to-amber-600' },
        { icon: TrendingUp, label: 'Investment Activity', value: investScore || 0, maxValue: 25, description: `Simulated portfolio score`, color: 'from-violet-500 to-violet-600' },
    ];

    const suggestions = [
        { text: 'Build your emergency fund to ₹3,12,000 (6 months of expenses) to gain 13 more points.', icon: Shield, priority: 'high' },
        { text: 'Increase your savings rate to 45% by reducing discretionary spending to gain 5 more points.', icon: Wallet, priority: 'medium' },
        { text: 'Start a SIP of ₹5,000/month in an index fund to boost your investment score by 7 points.', icon: TrendingUp, priority: 'medium' },
        { text: 'Track and categorize all expenses to identify hidden spending leaks.', icon: BarChart3, priority: 'low' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="animate-fade-in">
                <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                    <Heart className="w-8 h-8 text-primary-500" /> Financial Health Score
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">A comprehensive view of your financial wellness</p>
            </div>

            {/* Score display */}
            <div className="glass-card p-8 flex flex-col items-center relative animate-slide-up">
                <ScoreRing score={score} />
            </div>

            {/* Score factors */}
            <div>
                <h2 className="text-xl font-heading font-bold text-dark-900 dark:text-white mb-4">Score Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {factors.map((factor, i) => (
                        <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                            <FactorCard {...factor} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Improvement suggestions */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-heading font-bold text-dark-900 dark:text-white">How to Improve</h2>
                </div>
                <div className="space-y-3">
                    {suggestions.map((sug, i) => (
                        <div key={i} className={`glass-card p-4 flex items-start gap-3 animate-slide-up border-l-4 ${sug.priority === 'high' ? 'border-l-red-500' : sug.priority === 'medium' ? 'border-l-amber-500' : 'border-l-accent-500'
                            }`} style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                            <sug.icon className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-dark-700 dark:text-dark-300">{sug.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
