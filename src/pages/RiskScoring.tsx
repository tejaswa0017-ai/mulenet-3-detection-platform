import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { RiskScoreResult } from '../types';
import { useRiskScores } from '../hooks/useApi';
import { motion } from 'motion/react';
import { BarChart3, Target, Brain, Shield, Wifi, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

const recConfig: Record<string, { color: string; label: string }> = {
    'IMMEDIATE_FREEZE': { color: '#EF4444', label: 'Freeze' },
    'INVESTIGATION': { color: '#F97316', label: 'Investigate' },
    'ENHANCED_MONITORING': { color: '#F59E0B', label: 'Monitor' },
    'LOG_ONLY': { color: '#64748B', label: 'Log' },
};

export const RiskScoring: React.FC = () => {
    const riskApi = useRiskScores();
    const riskScores = riskApi.data || [];
    const [selectedAccount, setSelectedAccount] = useState<RiskScoreResult | null>(null);

    // Set default selection when data loads
    React.useEffect(() => {
        if (riskScores.length > 0 && !selectedAccount) {
            setSelectedAccount(riskScores[0]);
        }
    }, [riskScores]);

    const costMatrix = {
        false_positive: 350,
        false_negative: 15000,
        true_positive: -1000,
        true_negative: 0,
    };

    if (!selectedAccount) {
        return (
            <div className="min-h-screen bg-bg-main p-4 text-text-primary">
                <Navbar />
                <div className="mx-auto max-w-[1400px] flex h-[60vh] items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-border-subtle border-t-primary"></div>
                </div>
            </div>
        );
    }

    const componentConfig = [
        { key: 'tgn_anomaly' as const, label: 'TGN Temporal Anomaly', icon: <Brain size={14} />, color: '#7C3AED', weight: 'α', weightVal: selectedAccount.weights.alpha },
        { key: 'graph_proximity' as const, label: 'Graph Proximity to Mules', icon: <Wifi size={14} />, color: '#2563EB', weight: 'β', weightVal: selectedAccount.weights.beta },
        { key: 'cyber_ioc' as const, label: 'Cyber IOC Overlap', icon: <Shield size={14} />, color: '#06B6D4', weight: 'γ', weightVal: selectedAccount.weights.gamma },
    ];

    return (
        <div className="min-h-screen bg-bg-main p-4 text-text-primary">
            <Navbar />
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Bayesian Risk Scoring</h1>
                    <p className="mt-1 text-sm text-text-secondary">Cost-optimized R = α·A + β·B + γ·C multi-dimensional risk decomposition</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-10">
                    {/* Left: Account List */}
                    <div className="lg:col-span-3">
                        <div className="mb-3 text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">Account Risk Rankings</div>
                        <div className="space-y-2">
                            {riskScores.map((rs, i) => {
                                const rec = recConfig[rs.recommendation] || recConfig['LOG_ONLY'];
                                const isSelected = selectedAccount.account_id === rs.account_id;
                                return (
                                    <motion.div
                                        key={rs.account_id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        onClick={() => setSelectedAccount(rs)}
                                        className={`cursor-pointer rounded-xl border p-4 transition-all ${isSelected
                                            ? 'border-primary bg-primary/5 shadow-lg'
                                            : 'border-border-subtle bg-bg-card hover:border-border hover:bg-bg-card-hover'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-bold text-white">{rs.account_label}</div>
                                                <div className="text-[0.62rem] text-text-muted">Confidence: {(rs.confidence * 100).toFixed(0)}%</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-extrabold" style={{ color: rs.risk_score > 0.8 ? '#EF4444' : rs.risk_score > 0.6 ? '#F97316' : '#F59E0B' }}>
                                                    {(rs.risk_score * 100).toFixed(0)}%
                                                </div>
                                                <div className="rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase" style={{ backgroundColor: `${rec.color}15`, color: rec.color }}>
                                                    {rec.label}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Risk Decomposition */}
                    <div className="lg:col-span-7">
                        {/* Overall Score */}
                        <div className="mb-6 rounded-xl border border-border-subtle bg-bg-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">Overall Risk Score</div>
                                    <div className="mt-1 text-sm text-text-secondary">{selectedAccount.account_label}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-4xl font-extrabold" style={{ color: selectedAccount.risk_score > 0.8 ? '#EF4444' : selectedAccount.risk_score > 0.6 ? '#F97316' : '#F59E0B' }}>
                                            {(selectedAccount.risk_score * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-[0.62rem] text-text-muted">R = α·A + β·B + γ·C</div>
                                    </div>
                                    <div className="rounded-full px-4 py-1.5 text-[0.7rem] font-bold uppercase"
                                        style={{ backgroundColor: `${(recConfig[selectedAccount.recommendation] || recConfig['LOG_ONLY']).color}15`, color: (recConfig[selectedAccount.recommendation] || recConfig['LOG_ONLY']).color }}>
                                        {selectedAccount.recommendation.replace('_', ' ')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Component Breakdown */}
                        <div className="mb-6">
                            <div className="mb-3 text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">Score Decomposition</div>
                            <div className="space-y-3">
                                {componentConfig.map((comp, i) => {
                                    const score = selectedAccount.components[comp.key];
                                    const weighted = score * comp.weightVal;
                                    return (
                                        <motion.div
                                            key={`${comp.key}-${selectedAccount.account_id}`}
                                            initial={false}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="rounded-xl border border-border-subtle bg-bg-card p-4"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${comp.color}15`, color: comp.color }}>
                                                        {comp.icon}
                                                    </div>
                                                    <div>
                                                        <div className="text-[0.78rem] font-bold text-white">{comp.label}</div>
                                                        <div className="text-[0.6rem] text-text-muted">Weight {comp.weight} = {comp.weightVal}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-extrabold text-white">{(score * 100).toFixed(0)}%</div>
                                                    <div className="text-[0.6rem] text-text-muted">
                                                        Contribution: {(weighted * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-2.5 w-full rounded-full bg-bg-main">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: comp.color }}
                                                    initial={false}
                                                    animate={{ width: `${score * 100}%` }}
                                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                                ></motion.div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Cost Matrix & Weight Optimizer */}
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Cost Matrix */}
                            <div className="rounded-xl border border-border-subtle bg-bg-card p-5">
                                <div className="mb-4 flex items-center gap-2">
                                    <DollarSign size={16} className="text-risk-medium" />
                                    <div className="text-sm font-bold text-white">Cost Matrix</div>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { label: 'False Positive', value: `$${costMatrix.false_positive}`, desc: 'Analyst time + customer friction', color: '#F59E0B' },
                                        { label: 'False Negative', value: `$${costMatrix.false_negative.toLocaleString()}`, desc: 'Regulatory fine + reputation', color: '#EF4444' },
                                        { label: 'True Positive', value: `-$${Math.abs(costMatrix.true_positive).toLocaleString()}`, desc: 'Disrupted criminal activity', color: '#10B981' },
                                        { label: 'True Negative', value: `$${costMatrix.true_negative}`, desc: 'No cost', color: '#64748B' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between rounded-lg bg-bg-main px-3 py-2">
                                            <div>
                                                <div className="text-[0.72rem] font-semibold text-text-primary">{item.label}</div>
                                                <div className="text-[0.6rem] text-text-muted">{item.desc}</div>
                                            </div>
                                            <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weight Optimizer */}
                            <div className="rounded-xl border border-border-subtle bg-bg-card p-5">
                                <div className="mb-4 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-primary" />
                                    <div className="text-sm font-bold text-white">Bayesian Weight Optimizer</div>
                                </div>
                                <div className="mb-4 space-y-3">
                                    {componentConfig.map((comp, i) => (
                                        <div key={i}>
                                            <div className="mb-1 flex items-center justify-between text-[0.7rem]">
                                                <span className="text-text-secondary">{comp.weight} — {comp.label.split(' ')[0]}</span>
                                                <span className="font-bold text-white">{(comp.weightVal * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-bg-main">
                                                <div className="h-full rounded-full" style={{ width: `${comp.weightVal * 100}%`, backgroundColor: comp.color }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="rounded-lg border border-border-subtle bg-bg-main p-3">
                                    <div className="text-[0.62rem] font-semibold uppercase tracking-widest text-text-muted">Optimization Status</div>
                                    <div className="mt-1 flex items-center gap-2">
                                        <div className="animate-nav-pulse h-2 w-2 rounded-full bg-success"></div>
                                        <span className="text-[0.72rem] text-text-primary">30 iterations completed</span>
                                    </div>
                                    <div className="mt-1 text-[0.62rem] text-text-muted">Expected cost reduction: $4,280/month</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};
