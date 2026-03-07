import { useState } from 'react';
import { Calculator, CheckCircle, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';

const situations = [
    { id: 'bike', label: 'Buy a Bike', icon: '🏍️', defaultPrice: 150000 },
    { id: 'phone', label: 'Buy a Phone', icon: '📱', defaultPrice: 50000 },
    { id: 'laptop', label: 'Buy a Laptop', icon: '💻', defaultPrice: 80000 },
    { id: 'trip', label: 'Go on a Trip', icon: '✈️', defaultPrice: 60000 },
    { id: 'car', label: 'Buy a Car', icon: '🚗', defaultPrice: 800000 },
    { id: 'course', label: 'Education/Course', icon: '🎓', defaultPrice: 100000 },
];

function ScenarioCard({ title, icon, description, pros, cons, savings, isRecommended, delay }) {
    return (
        <div className={`glass-card p-6 animate-slide-up ${isRecommended ? 'ring-2 ring-accent-500' : ''}`} style={{ animationDelay: `${delay}s` }}>
            {isRecommended && (
                <div className="flex items-center gap-1 text-accent-500 text-xs font-bold mb-3 uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" /> Recommended
                </div>
            )}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-heading font-bold text-dark-900 dark:text-white">{title}</h3>
            </div>
            <p className="text-sm text-dark-600 dark:text-dark-300 mb-4">{description}</p>
            <div className="space-y-3">
                {savings !== undefined && (
                    <div className="p-3 rounded-xl bg-primary-50/50 dark:bg-primary-500/10">
                        <p className="text-xs text-dark-400">Impact on Savings</p>
                        <p className={`font-bold ${savings >= 0 ? 'text-accent-500' : 'text-red-500'}`}>
                            {savings >= 0 ? '+' : ''}₹{savings.toLocaleString('en-IN')}
                        </p>
                    </div>
                )}
                <div>
                    <p className="text-xs font-semibold text-accent-600 dark:text-accent-400 mb-1">✅ Pros</p>
                    {pros.map((p, i) => <p key={i} className="text-xs text-dark-500 dark:text-dark-400">• {p}</p>)}
                </div>
                <div>
                    <p className="text-xs font-semibold text-red-500 dark:text-red-400 mb-1">⚠️ Cons</p>
                    {cons.map((c, i) => <p key={i} className="text-xs text-dark-500 dark:text-dark-400">• {c}</p>)}
                </div>
            </div>
        </div>
    );
}

export default function LifeSimulator() {
    const [selectedSituation, setSelectedSituation] = useState(null);
    const [inputs, setInputs] = useState({ income: 85000, savings: 340000, price: 150000, duration: 12 });
    const [showResults, setShowResults] = useState(false);

    const handleSituationSelect = (sit) => {
        setSelectedSituation(sit);
        setInputs(prev => ({ ...prev, price: sit.defaultPrice }));
        setShowResults(false);
    };

    const handleSimulate = (e) => {
        e.preventDefault();
        setShowResults(true);
    };

    // Scenario calculations
    const canAffordCash = inputs.savings >= inputs.price;
    const savingsAfterCash = inputs.savings - inputs.price;
    const emergencyFund = inputs.income * 6 * 0.6; // rough monthly expenses * 6
    const cashDrains = savingsAfterCash < emergencyFund;

    const loanEMI = Math.round((inputs.price * 1.12) / inputs.duration); // 12% interest approx
    const loanTotal = loanEMI * inputs.duration;
    const loanInterest = loanTotal - inputs.price;

    const monthlySave = Math.round(inputs.price / inputs.duration);
    const monthsToSave = Math.ceil(inputs.price / (inputs.income * 0.3));

    const scenarios = [
        {
            title: 'Buy with Cash',
            icon: '💵',
            description: canAffordCash ?
                `Pay ₹${inputs.price.toLocaleString('en-IN')} upfront from your savings of ₹${inputs.savings.toLocaleString('en-IN')}.` :
                'You don\'t have enough savings for an outright purchase.',
            pros: canAffordCash ? ['No interest payments', 'Immediate ownership', 'No debt burden'] : ['Immediate ownership if you had enough'],
            cons: canAffordCash ? (cashDrains ? ['Dangerously depletes emergency fund', `Savings drop to ₹${savingsAfterCash.toLocaleString('en-IN')}`] : [`Savings drop to ₹${savingsAfterCash.toLocaleString('en-IN')}`]) : ['Insufficient savings', 'Would need to borrow the difference'],
            savings: canAffordCash ? -inputs.price : undefined,
            isRecommended: canAffordCash && !cashDrains,
        },
        {
            title: 'Take a Loan',
            icon: '🏦',
            description: `EMI of ₹${loanEMI.toLocaleString('en-IN')}/month for ${inputs.duration} months at ~12% interest. Total cost: ₹${loanTotal.toLocaleString('en-IN')}.`,
            pros: ['Keep savings intact', 'Spread payments over time', 'Build credit history'],
            cons: [`Pay ₹${loanInterest.toLocaleString('en-IN')} extra in interest`, `${Math.round(loanEMI / inputs.income * 100)}% of income goes to EMI`, 'Adds debt obligation'],
            savings: -loanInterest,
            isRecommended: !canAffordCash && loanEMI < inputs.income * 0.3,
        },
        {
            title: 'Save Monthly & Buy Later',
            icon: '📅',
            description: `Save ₹${monthlySave.toLocaleString('en-IN')}/month and buy in ${inputs.duration} months. Zero interest cost.`,
            pros: ['No interest paid', 'No debt', 'Builds saving discipline', 'Can invest while saving'],
            cons: [`Wait ${inputs.duration} months`, 'Price may increase', 'Requires discipline'],
            savings: 0,
            isRecommended: canAffordCash && cashDrains,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="animate-fade-in">
                <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-primary-500" /> Life Decision Simulator
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Simulate financial outcomes before making big decisions</p>
            </div>

            {/* Situation selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-slide-up">
                {situations.map(sit => (
                    <button
                        key={sit.id}
                        onClick={() => handleSituationSelect(sit)}
                        className={`glass-card p-4 text-center transition-all ${selectedSituation?.id === sit.id ? 'ring-2 ring-primary-500 bg-primary-50/50 dark:bg-primary-500/15' : ''
                            }`}
                    >
                        <span className="text-3xl block mb-2">{sit.icon}</span>
                        <span className="text-xs font-medium text-dark-700 dark:text-dark-300">{sit.label}</span>
                    </button>
                ))}
            </div>

            {/* Input form */}
            {selectedSituation && (
                <form onSubmit={handleSimulate} className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="font-heading font-bold text-dark-900 dark:text-white mb-4">
                        {selectedSituation.icon} Configure {selectedSituation.label} Scenario
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">Monthly Income (₹)</label>
                            <input type="number" value={inputs.income} onChange={e => setInputs({ ...inputs, income: Number(e.target.value) })} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">Current Savings (₹)</label>
                            <input type="number" value={inputs.savings} onChange={e => setInputs({ ...inputs, savings: Number(e.target.value) })} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">Item Price (₹)</label>
                            <input type="number" value={inputs.price} onChange={e => setInputs({ ...inputs, price: Number(e.target.value) })} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">Duration (Months)</label>
                            <input type="number" value={inputs.duration} onChange={e => setInputs({ ...inputs, duration: Number(e.target.value) })} className="input-field" />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary mt-4 flex items-center gap-2" id="simulate-btn">
                        <TrendingUp className="w-4 h-4" /> Simulate Scenarios
                    </button>
                </form>
            )}

            {/* Results */}
            {showResults && (
                <div className="space-y-4">
                    <h3 className="text-xl font-heading font-bold text-dark-900 dark:text-white">Simulation Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {scenarios.map((scenario, i) => (
                            <ScenarioCard key={i} {...scenario} delay={0.2 + i * 0.1} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
