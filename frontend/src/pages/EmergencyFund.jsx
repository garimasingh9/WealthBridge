import { useAuth } from '../context/AuthContext';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, PiggyBank } from 'lucide-react';

export default function EmergencyFund() {
    const { financialData } = useAuth();
    const monthlyExpenses = financialData.monthlyExpenses;
    const recommended = monthlyExpenses * 6;
    const current = financialData.emergencyFund;
    const progress = Math.min(100, Math.round((current / recommended) * 100));
    const deficit = Math.max(0, recommended - current);
    const monthlySavingsNeeded = deficit > 0 ? Math.round(deficit / 12) : 0;
    const monthsToGoal = deficit > 0 ? Math.ceil(deficit / financialData.monthlySavings) : 0;

    const isHealthy = progress >= 100;
    const isCritical = progress < 30;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-fade-in">
                <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary-500" /> Emergency Fund Calculator
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Your financial safety net analysis</p>
            </div>

            {/* Main card */}
            <div className="glass-card p-8 animate-slide-up">
                <div className="text-center space-y-2 mb-8">
                    <p className="text-sm text-dark-400 dark:text-dark-500 uppercase tracking-wider">Recommended Emergency Fund</p>
                    <h2 className="text-4xl lg:text-5xl font-heading font-bold gradient-text">
                        ₹{recommended.toLocaleString('en-IN')}
                    </h2>
                    <p className="text-dark-500 dark:text-dark-400 text-sm">
                        Based on 6 × ₹{monthlyExpenses.toLocaleString('en-IN')} monthly expenses
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-dark-500 dark:text-dark-400">Current: ₹{current.toLocaleString('en-IN')}</span>
                        <span className={`font-bold ${isHealthy ? 'text-accent-500' : isCritical ? 'text-red-500' : 'text-amber-500'}`}>
                            {progress}%
                        </span>
                    </div>
                    <div className="w-full h-4 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1500 ease-out ${isHealthy ? 'bg-gradient-to-r from-accent-500 to-accent-400' :
                                    isCritical ? 'bg-gradient-to-r from-red-500 to-red-400' :
                                        'bg-gradient-to-r from-amber-500 to-amber-400'
                                }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Status message */}
                <div className={`p-4 rounded-xl flex items-start gap-3 ${isHealthy ? 'bg-accent-50 dark:bg-accent-500/10 border border-accent-200 dark:border-accent-500/30' :
                        isCritical ? 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30' :
                            'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30'
                    }`}>
                    {isHealthy ? (
                        <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                    ) : isCritical ? (
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm">
                        {isHealthy ? (
                            <p className="text-accent-700 dark:text-accent-300">Your emergency fund is fully built! You have a solid financial safety net.</p>
                        ) : (
                            <p className={isCritical ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'}>
                                You need ₹{deficit.toLocaleString('en-IN')} more to reach the recommended amount.
                                {isCritical && ' This should be your top financial priority!'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <PiggyBank className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                    <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-wider">Monthly Contribution Needed</p>
                    <p className="text-2xl font-heading font-bold text-dark-900 dark:text-white mt-2">
                        ₹{monthlySavingsNeeded.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-dark-400 mt-1">to build in 12 months</p>
                </div>
                <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <TrendingUp className="w-8 h-8 text-accent-500 mx-auto mb-2" />
                    <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-wider">Months to Goal</p>
                    <p className="text-2xl font-heading font-bold text-dark-900 dark:text-white mt-2">
                        {isHealthy ? '✅ Done' : `${monthsToGoal} months`}
                    </p>
                    <p className="text-xs text-dark-400 mt-1">at current savings rate</p>
                </div>
                <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <Shield className="w-8 h-8 text-violet-500 mx-auto mb-2" />
                    <p className="text-xs text-dark-400 dark:text-dark-500 uppercase tracking-wider">Months of Coverage</p>
                    <p className="text-2xl font-heading font-bold text-dark-900 dark:text-white mt-2">
                        {(current / monthlyExpenses).toFixed(1)} months
                    </p>
                    <p className="text-xs text-dark-400 mt-1">if income stops today</p>
                </div>
            </div>

            {/* Tips */}
            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <h3 className="font-heading font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                    💡 Smart Tips for Building Your Emergency Fund
                </h3>
                <div className="space-y-3 text-sm text-dark-600 dark:text-dark-300">
                    <p>• Keep your emergency fund in a <strong>high-yield savings account</strong> or <strong>liquid fund</strong> for easy access</p>
                    <p>• Set up an <strong>auto-debit</strong> on payday so you save before you spend</p>
                    <p>• Start with a target of <strong>3 months</strong> of expenses, then gradually build to 6 months</p>
                    <p>• Any windfalls (bonuses, tax refunds) should go straight to your emergency fund until it's full</p>
                </div>
            </div>
        </div>
    );
}
