import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Target, Plus, Trash2, TrendingUp, Calendar, X } from 'lucide-react';

function GoalCard({ goal, onDelete }) {
    const progress = Math.round((goal.saved / goal.target) * 100);
    const remaining = goal.target - goal.saved;
    const deadline = new Date(goal.deadline);
    const now = new Date();
    const monthsLeft = Math.max(1, Math.round((deadline - now) / (30 * 24 * 60 * 60 * 1000)));
    const monthlyRequired = Math.round(remaining / monthsLeft);

    return (
        <div className="glass-card p-6 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <div>
                        <h3 className="font-heading font-bold text-dark-900 dark:text-white">{goal.name}</h3>
                        <p className="text-xs text-dark-400">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Deadline: {deadline.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(goal.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-500 dark:text-dark-400">Progress</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-primary-50/50 dark:bg-primary-500/10">
                    <p className="text-xs text-dark-400 dark:text-dark-500">Target</p>
                    <p className="font-semibold text-dark-900 dark:text-white">₹{goal.target.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent-50/50 dark:bg-accent-500/10">
                    <p className="text-xs text-dark-400 dark:text-dark-500">Saved</p>
                    <p className="font-semibold text-accent-600 dark:text-accent-400">₹{goal.saved.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/10">
                    <p className="text-xs text-dark-400 dark:text-dark-500">Remaining</p>
                    <p className="font-semibold text-dark-900 dark:text-white">₹{remaining.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 rounded-xl bg-violet-50/50 dark:bg-violet-500/10">
                    <p className="text-xs text-dark-400 dark:text-dark-500">Save/Month</p>
                    <p className="font-semibold text-violet-600 dark:text-violet-400">₹{monthlyRequired.toLocaleString('en-IN')}</p>
                </div>
            </div>
        </div>
    );
}

export default function Goals() {
    const { financialData, addGoal, deleteGoal } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', target: '', saved: '', deadline: '', icon: '🎯' });

    const icons = ['🎯', '🏍️', '🚗', '🏠', '✈️', '🛡️', '📱', '💻', '🎓', '💰'];

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newGoal.name || !newGoal.target || !newGoal.deadline) return;
        addGoal({
            name: newGoal.name,
            target: Number(newGoal.target),
            saved: Number(newGoal.saved) || 0,
            deadline: newGoal.deadline,
            icon: newGoal.icon,
        });
        setNewGoal({ name: '', target: '', saved: '', deadline: '', icon: '🎯' });
        setShowModal(false);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark-900 dark:text-white flex items-center gap-3">
                        <Target className="w-8 h-8 text-primary-500" /> Financial Goals
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">Track and achieve your financial dreams</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2" id="add-goal-btn">
                    <Plus className="w-5 h-5" /> Add New Goal
                </button>
            </div>

            {/* Goals grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {financialData.goals.map((goal, i) => (
                    <div key={goal.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <GoalCard goal={goal} onDelete={deleteGoal} />
                    </div>
                ))}
            </div>

            {financialData.goals.length === 0 && (
                <div className="text-center py-16 glass-card border-2 border-dashed border-dark-200 dark:border-dark-700">
                    <Target className="w-16 h-16 text-dark-300 dark:text-dark-600 mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-bold text-dark-900 dark:text-white">No Goals Yet</h3>
                    <p className="text-dark-500 dark:text-dark-400 mt-2 mb-6">Create your first financial goal to begin planning your future.</p>
                    <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Create Goal
                    </button>
                </div>
            )}

            {/* Add Goal Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-heading font-bold text-dark-900 dark:text-white">Create New Goal</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700">
                                <X className="w-5 h-5 text-dark-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            {/* Icon selector */}
                            <div>
                                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Choose Icon</label>
                                <div className="flex flex-wrap gap-2">
                                    {icons.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setNewGoal({ ...newGoal, icon })}
                                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${newGoal.icon === icon
                                                ? 'bg-primary-100 dark:bg-primary-500/20 ring-2 ring-primary-500'
                                                : 'bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600'
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Goal Name</label>
                                <input
                                    type="text"
                                    value={newGoal.name}
                                    onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                                    placeholder="e.g., Buy a Bike"
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Target Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={newGoal.target}
                                        onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                                        placeholder="1,50,000"
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Already Saved (₹)</label>
                                    <input
                                        type="number"
                                        value={newGoal.saved}
                                        onChange={e => setNewGoal({ ...newGoal, saved: e.target.value })}
                                        placeholder="0"
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Target Date</label>
                                <input
                                    type="date"
                                    value={newGoal.deadline}
                                    onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary" id="submit-goal-btn">
                                <TrendingUp className="w-4 h-4 inline mr-2" /> Create Goal
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
