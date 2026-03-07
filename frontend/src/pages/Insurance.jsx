import { useState } from 'react';
import { Umbrella, Shield, Heart, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const providers = [
    { name: 'LIC', fullName: 'Life Insurance Corporation of India', color: '#1e40af' },
    { name: 'HDFC Life', fullName: 'HDFC Life Insurance', color: '#0d9488' },
    { name: 'ICICI Prudential', fullName: 'ICICI Prudential Life Insurance', color: '#dc2626' },
    { name: 'SBI Life', fullName: 'SBI Life Insurance', color: '#2563eb' },
];

export default function Insurance() {
    const [inputs, setInputs] = useState({ age: 28, income: 85000, familySize: 3, hasInsurance: 'no' });
    const [showRecommendations, setShowRecommendations] = useState(false);

    const annualIncome = inputs.income * 12;
    const recommendedCover = Math.round(annualIncome * (inputs.age < 35 ? 15 : inputs.age < 45 ? 12 : 8));
    const healthCover = inputs.familySize <= 2 ? 500000 : inputs.familySize <= 4 ? 1000000 : 1500000;

    const recommendations = [
        {
            type: 'Term Life Insurance',
            icon: '🛡️',
            cover: recommendedCover,
            premium: Math.round(recommendedCover * 0.003 / 12),
            reason: `For your income level (₹${annualIncome.toLocaleString('en-IN')}/year) and family of ${inputs.familySize}, a term plan of ₹${(recommendedCover / 100000).toFixed(0)} Lakh is recommended.`,
            providers: ['LIC', 'HDFC Life', 'ICICI Prudential'],
            priority: 'High',
        },
        {
            type: 'Health Insurance',
            icon: '🏥',
            cover: healthCover,
            premium: Math.round(healthCover * 0.02 / 12),
            reason: `A family floater plan of ₹${(healthCover / 100000).toFixed(0)} Lakh will cover medical emergencies for your family of ${inputs.familySize}.`,
            providers: ['HDFC Life', 'SBI Life'],
            priority: 'High',
        },
        {
            type: 'Personal Accident Cover',
            icon: '🚑',
            cover: 2500000,
            premium: Math.round(2500000 * 0.001 / 12),
            reason: 'Provides coverage for accidental injuries and disabilities, keeping your family financially secure.',
            providers: ['LIC', 'ICICI Prudential'],
            priority: 'Medium',
        },
        {
            type: 'Critical Illness Cover',
            icon: '💊',
            cover: 1000000,
            premium: Math.round(1000000 * 0.015 / 12),
            reason: 'Lump-sum payout on diagnosis of critical illnesses helps cover treatment costs without depleting savings.',
            providers: ['HDFC Life', 'SBI Life'],
            priority: inputs.age >= 35 ? 'High' : 'Medium',
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowRecommendations(true);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="animate-fade-in">
                <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                    <Umbrella className="w-8 h-8 text-primary-500" /> Insurance Recommendations
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Get personalized insurance guidance based on your profile</p>
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="glass-card p-6 animate-slide-up">
                <h3 className="font-heading font-bold text-dark-900 dark:text-white mb-4">Your Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">Age</label>
                        <input type="number" value={inputs.age} onChange={e => setInputs({ ...inputs, age: Number(e.target.value) })} className="input-field" min="18" max="65" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">Monthly Income (₹)</label>
                        <input type="number" value={inputs.income} onChange={e => setInputs({ ...inputs, income: Number(e.target.value) })} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">Family Size</label>
                        <input type="number" value={inputs.familySize} onChange={e => setInputs({ ...inputs, familySize: Number(e.target.value) })} className="input-field" min="1" max="10" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">Current Insurance?</label>
                        <select value={inputs.hasInsurance} onChange={e => setInputs({ ...inputs, hasInsurance: e.target.value })} className="input-field">
                            <option value="no">No Insurance</option>
                            <option value="basic">Basic Coverage</option>
                            <option value="comprehensive">Comprehensive</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn-primary mt-4 flex items-center gap-2" id="get-insurance-btn">
                    <Shield className="w-4 h-4" /> Get Recommendations
                </button>
            </form>

            {/* Recommendations */}
            {showRecommendations && (
                <div className="space-y-4">
                    {inputs.hasInsurance === 'no' && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-start gap-3 animate-slide-up">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300">
                                <strong>Warning:</strong> Having no insurance puts your family at significant financial risk. Getting at least a term life and health insurance should be your top priority.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.map((rec, i) => (
                            <div key={i} className={`glass-card p-6 animate-slide-up border-l-4 ${rec.priority === 'High' ? 'border-l-red-500' : 'border-l-amber-500'
                                }`} style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{rec.icon}</span>
                                        <h3 className="font-heading font-bold text-dark-900 dark:text-white">{rec.type}</h3>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${rec.priority === 'High' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                        }`}>
                                        {rec.priority} Priority
                                    </span>
                                </div>

                                <p className="text-sm text-dark-600 dark:text-dark-300 mb-4">{rec.reason}</p>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 rounded-xl bg-primary-50/50 dark:bg-primary-500/10">
                                        <p className="text-xs text-dark-400">Recommended Cover</p>
                                        <p className="font-bold text-dark-900 dark:text-white">₹{(rec.cover / 100000).toFixed(0)} Lakh</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-accent-50/50 dark:bg-accent-500/10">
                                        <p className="text-xs text-dark-400">Est. Monthly Premium</p>
                                        <p className="font-bold text-accent-600 dark:text-accent-400">~₹{rec.premium.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-dark-400 mb-2">Suggested Providers</p>
                                    <div className="flex flex-wrap gap-2">
                                        {rec.providers.map(p => (
                                            <span key={p} className="text-xs px-3 py-1 rounded-full bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
