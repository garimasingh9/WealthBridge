import { useState } from 'react';
import { Map, ArrowRight, Target, Sparkles, CheckCircle, RefreshCw, BookOpen, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Roadmap() {
    const { user, financialData } = useAuth();
    const [activeTab, setActiveTab] = useState('personalized');
    const [isRegenerating, setIsRegenerating] = useState(false);

    const {
        monthlyIncome = 0,
        monthlyExpenses = 0,
        monthlySavings = 0,
        emergencyFund = 0,
        savingsRate = 0,
        goals = []
    } = financialData;

    const age = user?.age || 28;

    // Personalized roadmap logic
    const emergencyTarget = monthlyExpenses * 6;
    const isEmergencyComplete = emergencyFund >= emergencyTarget && emergencyTarget > 0;
    const needsSavingsRateBoost = savingsRate < 20;
    const monthsForEmergency = !isEmergencyComplete && monthlySavings > 0
        ? Math.ceil((emergencyTarget - emergencyFund) / monthlySavings) : 0;

    const personalizedPhases = [];

    // Phase 1: Foundation
    if (!isEmergencyComplete || needsSavingsRateBoost) {
        personalizedPhases.push({
            years: `Year 1${monthsForEmergency > 12 ? '-2' : ''}`,
            title: '🛡️ Build Financial Safety Net',
            color: 'from-amber-500 to-orange-500',
            status: 'active',
            tasks: [
                !isEmergencyComplete ? `Build emergency fund to ₹${emergencyTarget.toLocaleString('en-IN')} (6 months expenses)` : 'Emergency fund is healthy!',
                needsSavingsRateBoost ? `Increase savings rate from ${savingsRate}% to at least 20%` : 'Maintain current excellent savings rate',
                'Get term life insurance',
                'Get health insurance for family',
                'Pay off any high-interest consumer debt',
            ],
            milestone: !isEmergencyComplete ? `Emergency Fund: ₹${emergencyTarget.toLocaleString('en-IN')}` : 'Strong Financial Foundation Built ✅',
        });
    } else {
        personalizedPhases.push({
            years: 'Year 1',
            title: '🛡️ Financial Safety Net',
            color: 'from-accent-500 to-emerald-500',
            status: 'completed',
            tasks: [
                `Emergency fund of ₹${emergencyFund.toLocaleString('en-IN')} is fully funded!`,
                `Savings rate is healthy at ${savingsRate}%`,
                'Insurance coverage maintained',
            ],
            milestone: 'Strong Financial Foundation Built ✅',
        });
    }

    // Phase 2: Short Term / Investing
    personalizedPhases.push({
        years: isEmergencyComplete ? 'Year 1-3' : 'Year 2-3',
        title: '📈 Accelerate Investments & Short-Term Goals',
        color: 'from-primary-500 to-primary-600',
        status: isEmergencyComplete ? 'active' : 'upcoming',
        tasks: [
            goals.length > 0 ? `Focus on saving for: ${goals.map(g => g.name).join(', ')}` : 'Set short-term financial goals',
            `Start or increase SIPs (Aim for ₹${(monthlyIncome * 0.15).toLocaleString('en-IN')}/month)`,
            'Build a diverse mutual fund portfolio',
            'Maximize tax-saving investments (Section 80C)',
        ],
        milestone: 'Investment portfolio started + Goals funded',
    });

    // Phase 3: Wealth Building
    personalizedPhases.push({
        years: 'Year 3-5',
        title: '💼 Wealth Expansion',
        color: 'from-violet-500 to-violet-600',
        status: 'upcoming',
        tasks: [
            'Increase SIP amounts automatically with annual income hikes (Step-up SIP)',
            'Build total investment corpus to ₹25 Lakh',
            'Explore real estate or other asset classes if appropriate',
            'Get a professional financial advisor for tax planning',
        ],
        milestone: 'Net Worth: ₹25+ Lakh 🎯',
    });

    // Phase 4: Long term
    personalizedPhases.push({
        years: 'Year 5-10',
        title: '🏠 Major Life Goals & Independence',
        color: 'from-pink-500 to-rose-500',
        status: 'upcoming',
        tasks: [
            'House down payment or major property investment',
            'Keep EMI < 30% of income',
            'Investment corpus: ₹1 Crore+',
            'Start planning for children\'s education / retirement',
            'Review and rebalance entire portfolio',
        ],
        milestone: 'Major goals achieved + ₹1 Cr corpus 🚀',
    });

    // Universal Guide logic
    const generalPhases = [
        {
            years: 'Phase 1',
            title: '🛡️ Financial Foundation',
            description: 'The first steps everyone should take before investing heavily.',
            color: 'from-slate-500 to-slate-600',
            status: 'guide',
            tasks: [
                'Clear high-interest debt (credit cards, personal loans)',
                'Build 3-6 months of emergency fund',
                'Buy Term Life Insurance (10x-20x annual income)',
                'Buy comprehensive Health Insurance',
            ],
            milestone: 'Zero bad debt & fully insured',
        },
        {
            years: 'Phase 2',
            title: '🌱 Early Investing',
            description: 'Planting the seeds for future wealth.',
            color: 'from-slate-500 to-slate-600',
            status: 'guide',
            tasks: [
                'Save at least 20% of income',
                'Start SIPs in Index Funds or Flexi-cap Mutual Funds',
                'Utilize tax saving options (PPF, ELSS)',
                'Automate all savings and investments on payday',
            ],
            milestone: 'First ₹5 Lakh invested',
        },
        {
            years: 'Phase 3',
            title: '📈 Wealth Building',
            description: 'Accelerating growth through discipline.',
            color: 'from-slate-500 to-slate-600',
            status: 'guide',
            tasks: [
                'Increase SIPs by 10% every year (Step-up)',
                'Diversify across equity, debt, and gold',
                'Save for specific mid-term goals (car, wedding, travel)',
                'Avoid lifestyle inflation when income increases',
            ],
            milestone: 'Significant compounding effect starts',
        },
        {
            years: 'Phase 4',
            title: '👑 Financial Independence',
            description: 'Securing long-term freedom and major lifegoals.',
            color: 'from-slate-500 to-slate-600',
            status: 'guide',
            tasks: [
                'Plan for major purchases like a home (EMI < 30% income)',
                'Build retirement corpus (target 30x annual expenses)',
                'Plan for children’s education',
                'Regular portfolio rebalancing and risk reduction',
            ],
            milestone: 'Work becomes optional (FIRE)',
        },
    ];

    const handleRegenerate = () => {
        setIsRegenerating(true);
        setTimeout(() => setIsRegenerating(false), 800);
    };

    const displayPhases = activeTab === 'personalized' ? personalizedPhases : generalPhases;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-fade-in flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                        <Map className="w-8 h-8 text-primary-500" /> Financial Roadmap
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">
                        {activeTab === 'personalized'
                            ? 'Your dynamically generated 10-year financial journey'
                            : 'Universal guide for building wealth and stability'}
                    </p>
                </div>
                {activeTab === 'personalized' && (
                    <button
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                        className="btn-secondary flex items-center gap-2 px-4 py-2 border border-primary-200 dark:border-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl font-medium transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                        {isRegenerating ? 'Calculating...' : 'Regenerate Roadmap'}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-dark-100 dark:bg-dark-800 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('personalized')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'personalized'
                            ? 'bg-white dark:bg-dark-700 text-primary-500 shadow-sm'
                            : 'text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
                        }`}
                >
                    <Compass className="w-4 h-4" /> Personalized Roadmap
                </button>
                <button
                    onClick={() => setActiveTab('general')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'general'
                            ? 'bg-white dark:bg-dark-700 text-primary-500 shadow-sm'
                            : 'text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
                        }`}
                >
                    <BookOpen className="w-4 h-4" /> Journey Guide
                </button>
            </div>

            {/* Summary card (Only for personalized) */}
            {activeTab === 'personalized' && (
                <div className={`glass-card p-6 border-l-4 border-l-primary-500 transition-all ${isRegenerating ? 'opacity-50 scale-95' : 'animate-slide-up opacity-100 scale-100'}`}>
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-heading font-bold text-dark-900 dark:text-white mb-2">Personalized Recommendation</h3>
                            <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
                                {isEmergencyComplete && !needsSavingsRateBoost
                                    ? `Great progress! With an emergency fund of ₹${emergencyFund.toLocaleString('en-IN')} and a strong savings rate of ${savingsRate}%, you should focus entirely on accelerating your wealth through diversified investments and achieving your major life goals.`
                                    : `Based on your income of ₹${monthlyIncome.toLocaleString('en-IN')} and current savings of ₹${emergencyFund.toLocaleString('en-IN')}, you should ${!isEmergencyComplete ? `first complete your emergency fund of ₹${emergencyTarget.toLocaleString('en-IN')}` : `first work on increasing your savings rate from ${savingsRate}% to 20%+`} before significantly increasing volatile investments.`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className={`relative space-y-0 transition-opacity duration-300 ${isRegenerating ? 'opacity-50' : 'opacity-100'}`}>
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-200 dark:bg-dark-700" />

                {displayPhases.map((phase, i) => (
                    <div key={i} className="relative pl-16 pb-8 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        {/* Timeline dot */}
                        <div className={`absolute left-4 w-5 h-5 rounded-full bg-gradient-to-br ${phase.color} ring-4 ring-white dark:ring-dark-950 z-10 ${phase.status === 'active' ? 'animate-pulse-slow' : ''}`} />

                        {/* Phase card */}
                        <div className={`glass-card p-6 ${phase.status === 'active' ? 'ring-2 ring-primary-500' : ''}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${activeTab === 'general' ? 'bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300' : `bg-gradient-to-r ${phase.color} text-white`}`}>
                                    {phase.years}
                                </span>
                                {phase.status === 'completed' && (
                                    <span className="text-xs font-bold text-accent-500 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> Completed
                                    </span>
                                )}
                                {phase.status === 'active' && (
                                    <span className="text-xs font-bold text-primary-500 flex items-center gap-1">
                                        <Target className="w-4 h-4" /> In Progress
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-heading font-bold text-dark-900 dark:text-white mb-1">{phase.title}</h3>
                            {phase.description && <p className="text-sm text-dark-500 dark:text-dark-400 mb-4">{phase.description}</p>}
                            {!phase.description && <div className="h-2"></div>}

                            <ul className="space-y-2 mb-4">
                                {phase.tasks.map((task, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm text-dark-600 dark:text-dark-300">
                                        <ArrowRight className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                        {task}
                                    </li>
                                ))}
                            </ul>

                            <div className={`p-3 rounded-xl ${activeTab === 'general' ? 'bg-dark-50 dark:bg-dark-800/50' : 'bg-primary-50/50 dark:bg-primary-500/10'}`}>
                                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Milestone</p>
                                <p className="text-sm font-semibold text-dark-900 dark:text-white">{phase.milestone}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
