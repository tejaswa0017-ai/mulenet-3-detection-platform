import React from 'react';
import { DataGenerator } from '../data';
import { motion } from 'motion/react';
import { Brain, Wifi, Shield } from 'lucide-react';

interface RiskDecompositionProps {
    accountIndex?: number;
}

export const RiskDecomposition: React.FC<RiskDecompositionProps> = ({ accountIndex = 0 }) => {
    const riskScores = DataGenerator.generateRiskScores();
    const account = riskScores[accountIndex] || riskScores[0];

    const components = [
        { key: 'tgn_anomaly' as const, label: 'TGN Anomaly', icon: <Brain size={12} />, color: '#7C3AED', weight: 'α', weightVal: account.weights.alpha },
        { key: 'graph_proximity' as const, label: 'Graph Proximity', icon: <Wifi size={12} />, color: '#2563EB', weight: 'β', weightVal: account.weights.beta },
        { key: 'cyber_ioc' as const, label: 'Cyber IOC', icon: <Shield size={12} />, color: '#06B6D4', weight: 'γ', weightVal: account.weights.gamma },
    ];

    const riskColor = account.risk_score > 0.8 ? '#EF4444' : account.risk_score > 0.6 ? '#F97316' : '#F59E0B';

    return (
        <div className="rounded-[18px] border border-border-subtle bg-bg-card p-5">
            {/* Overall Score */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">Risk Score</div>
                    <div className="text-[0.72rem] text-text-secondary">{account.account_label}</div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-extrabold" style={{ color: riskColor }}>
                        {(account.risk_score * 100).toFixed(0)}%
                    </div>
                    <div className="text-[0.55rem] text-text-muted">R = α·A + β·B + γ·C</div>
                </div>
            </div>

            {/* Component Bars */}
            <div className="space-y-3">
                {components.map((comp, i) => {
                    const score = account.components[comp.key];
                    return (
                        <div key={comp.key}>
                            <div className="mb-1 flex items-center justify-between text-[0.65rem]">
                                <div className="flex items-center gap-1.5">
                                    <span style={{ color: comp.color }}>{comp.icon}</span>
                                    <span className="text-text-secondary">{comp.weight} · {comp.label}</span>
                                </div>
                                <span className="font-bold text-text-primary">{(score * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-bg-main">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: comp.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${score * 100}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
                                ></motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confidence */}
            <div className="mt-4 flex items-center justify-between rounded-lg bg-bg-main px-3 py-2 text-[0.65rem]">
                <span className="text-text-muted">Confidence</span>
                <span className="font-bold text-success">{(account.confidence * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
};
