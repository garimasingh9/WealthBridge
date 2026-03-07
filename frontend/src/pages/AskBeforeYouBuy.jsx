import { useState } from 'react';
import { ShoppingBag, AlertTriangle, CheckCircle, Clock, TrendingDown, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AskBeforeYouBuy() {
    const { financialData } = useAuth();
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('electronics');
    const [result, setResult] = useState(null);

    const income = financialData.monthlyIncome;
    const savings = financialData.emergencyFund + 220000; // total savings
    const monthlyExpenses = financialData.monthlyExpenses;
    const emergencyFundRecommended = monthlyExpenses * 6;

    const categories = [
        { id: 'electronics', label: 'Electronics', icon: '📱' },
        { id: 'vehicle', label: 'Vehicle', icon: '🏍️' },
        { id: 'fashion', label: 'Fashion', icon: '👗' },
        { id: 'travel', label: 'Travel', icon: '✈️' },
        { id: 'gadget', label: 'Gadget', icon: '💻' },
        { id: 'furniture', label: 'Furniture', icon: '🪑' },
    ];

    const analyze = (e) => {
        e.preventDefault();
        const itemPrice = Number(price);
        if (!itemPrice) return;

        const savingsAfterPurchase = savings - itemPrice;
        const emergencyFundAfter = savingsAfterPurchase;
        const percentOfIncome = (itemPrice / income * 100).toFixed(1);
        const percentOfSavings = (itemPrice / savings * 100).toFixed(1);
        const isAffordable = savingsAfterPurchase > emergencyFundRecommended;
        const dropsEmergency = savingsAfterPurchase < emergencyFundRecommended;
        const monthsToSave = Math.ceil(itemPrice / financialData.monthlySavings);

        let verdict, verdictType, suggestion;

        if (isAffordable && itemPrice < income * 0.5) {
            verdict = 'You can afford this purchase!';
            verdictType = 'success';
            suggestion = 'Your savings remain healthy after this purchase. Go ahead if you need it!';
        } else if (dropsEmergency) {
            verdict = 'This purchase will hurt your financial safety!';
            verdictType = 'danger';
            suggestion = `Wait ${monthsToSave} month${monthsToSave > 1 ? 's' : ''} and save specifically for this. Your emergency fund will drop below the recommended ₹${emergencyFundRecommended.toLocaleString('en-IN')}.`;
        } else {
            verdict = 'You can afford it, but consider waiting.';
            verdictType = 'warning';
            suggestion = `This is ${percentOfSavings}% of your total savings. Consider saving for ${monthsToSave} month${monthsToSave > 1 ? 's' : ''} to buy without impacting savings.`;
        }

        setResult({
            itemPrice,
            savingsAfterPurchase,
            percentOfIncome,
            percentOfSavings,
            dropsEmergency,
            monthsToSave,
            verdict,
            verdictType,
            suggestion,
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-fade-in">
                <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-primary-500" /> Ask Before You Buy
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Check if you can really afford that purchase</p>
            </div>

            {/* Input */}
            <form onSubmit={analyze} className="glass-card p-6 animate-slide-up">
                <h3 className="font-heading font-bold text-dark-900 dark:text-white mb-4">What are you thinking of buying?</h3>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`p-3 rounded-xl text-center transition-all ${category === cat.id ? 'bg-primary-100 dark:bg-primary-500/20 ring-2 ring-primary-500' :
                                    'bg-dark-50 dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-700'
                                }`}
                        >
                            <span className="text-2xl block">{cat.icon}</span>
                            <span className="text-xs text-dark-600 dark:text-dark-400 mt-1 block">{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">Product Price (₹)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="Enter the price"
                            className="input-field"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary self-end" id="check-affordability-btn">
                        Check
                    </button>
                </div>
            </form>

            {/* Result */}
            {result && (
                <div className="space-y-4 animate-slide-up">
                    {/* Verdict */}
                    <div className={`glass-card p-6 border-l-4 ${result.verdictType === 'success' ? 'border-l-accent-500' :
                            result.verdictType === 'danger' ? 'border-l-red-500' : 'border-l-amber-500'
                        }`}>
                        <div className="flex items-start gap-3">
                            {result.verdictType === 'success' ? (
                                <CheckCircle className="w-6 h-6 text-accent-500 flex-shrink-0" />
                            ) : result.verdictType === 'danger' ? (
                                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                            ) : (
                                <Clock className="w-6 h-6 text-amber-500 flex-shrink-0" />
                            )}
                            <div>
                                <h3 className={`text-lg font-heading font-bold ${result.verdictType === 'success' ? 'text-accent-500' :
                                        result.verdictType === 'danger' ? 'text-red-500' : 'text-amber-500'
                                    }`}>
                                    {result.verdict}
                                </h3>
                                <p className="text-sm text-dark-600 dark:text-dark-300 mt-2">{result.suggestion}</p>
                            </div>
                        </div>
                    </div>

                    {/* Impact stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-card p-4 text-center">
                            <TrendingDown className="w-6 h-6 text-primary-500 mx-auto mb-1" />
                            <p className="text-xs text-dark-400">% of Income</p>
                            <p className="text-xl font-bold text-dark-900 dark:text-white">{result.percentOfIncome}%</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <TrendingDown className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                            <p className="text-xs text-dark-400">% of Savings</p>
                            <p className="text-xl font-bold text-dark-900 dark:text-white">{result.percentOfSavings}%</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <Shield className={`w-6 h-6 mx-auto mb-1 ${result.dropsEmergency ? 'text-red-500' : 'text-accent-500'}`} />
                            <p className="text-xs text-dark-400">Savings After</p>
                            <p className={`text-xl font-bold ${result.dropsEmergency ? 'text-red-500' : 'text-dark-900 dark:text-white'}`}>
                                ₹{result.savingsAfterPurchase.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <Clock className="w-6 h-6 text-violet-500 mx-auto mb-1" />
                            <p className="text-xs text-dark-400">Save & Buy In</p>
                            <p className="text-xl font-bold text-dark-900 dark:text-white">{result.monthsToSave} months</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
