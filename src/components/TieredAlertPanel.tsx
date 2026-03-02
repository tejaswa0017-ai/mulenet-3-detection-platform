import React, { useState } from 'react';
import { DataGenerator } from '../data';
import { TieredAlert, AlertTier } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Eye, Search, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const tierConfig: Record<AlertTier, { color: string; icon: React.ReactNode; label: string; short: string }> = {
    'TIER_1_INFORMATIONAL': { color: '#3B82F6', icon: <Eye size={14} />, label: 'Informational', short: 'T1' },
    'TIER_2_MONITORING': { color: '#F59E0B', icon: <Search size={14} />, label: 'Monitoring', short: 'T2' },
    'TIER_3_INVESTIGATION': { color: '#F97316', icon: <AlertTriangle size={14} />, label: 'Investigation', short: 'T3' },
    'TIER_4_CRITICAL': { color: '#EF4444', icon: <Shield size={14} />, label: 'Critical', short: 'T4' },
};

interface TieredAlertPanelProps {
    maxAlerts?: number;
}

export const TieredAlertPanel: React.FC<TieredAlertPanelProps> = ({ maxAlerts = 6 }) => {
    const allAlerts = DataGenerator.generateTieredAlerts();
    const [activeTier, setActiveTier] = useState<AlertTier | 'ALL'>('ALL');

    const filteredAlerts = activeTier === 'ALL' ? allAlerts.slice(0, maxAlerts) : allAlerts.filter(a => a.tier === activeTier).slice(0, maxAlerts);

    const tierCounts: Record<string, number> = {
        'ALL': allAlerts.length,
        'TIER_4_CRITICAL': allAlerts.filter(a => a.tier === 'TIER_4_CRITICAL').length,
        'TIER_3_INVESTIGATION': allAlerts.filter(a => a.tier === 'TIER_3_INVESTIGATION').length,
        'TIER_2_MONITORING': allAlerts.filter(a => a.tier === 'TIER_2_MONITORING').length,
        'TIER_1_INFORMATIONAL': allAlerts.filter(a => a.tier === 'TIER_1_INFORMATIONAL').length,
    };

    return (
        <div className="rounded-[18px] border border-border-subtle bg-bg-card">
            {/* Tier Tabs */}
            <div className="flex items-center gap-1 border-b border-border-subtle px-4 py-2.5 overflow-x-auto">
                <button
                    onClick={() => setActiveTier('ALL')}
                    className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[0.62rem] font-semibold transition-all ${activeTier === 'ALL' ? 'bg-primary/15 text-primary' : 'text-text-muted hover:text-text-primary'
                        }`}
                >
                    All ({tierCounts['ALL']})
                </button>
                {(Object.entries(tierConfig) as [AlertTier, typeof tierConfig[AlertTier]][]).reverse().map(([tier, config]) => (
                    <button
                        key={tier}
                        onClick={() => setActiveTier(tier)}
                        className={`flex whitespace-nowrap items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.62rem] font-semibold transition-all ${activeTier === tier ? `text-white` : 'text-text-muted hover:text-text-primary'
                            }`}
                        style={activeTier === tier ? { backgroundColor: `${config.color}20`, color: config.color } : {}}
                    >
                        {config.icon}
                        {config.short} ({tierCounts[tier]})
                    </button>
                ))}
            </div>

            {/* Alert List */}
            <div className="divide-y divide-border-subtle">
                <AnimatePresence mode="popLayout">
                    {filteredAlerts.map((alert, i) => {
                        const config = tierConfig[alert.tier];
                        const ts = alert.timestamp.includes('T') ? alert.timestamp.split('T')[1].substring(0, 5) : alert.timestamp;

                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ delay: i * 0.04, duration: 0.2 }}
                                className="relative px-4 py-3 transition-colors hover:bg-bg-card-hover"
                            >
                                <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: config.color }}></div>
                                <div className="flex items-start justify-between pl-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="rounded px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-widest"
                                                style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                                                {config.short}
                                            </span>
                                            <span className="truncate text-[0.78rem] font-semibold text-text-primary">{alert.title}</span>
                                        </div>
                                        <div className="text-[0.68rem] text-text-secondary line-clamp-2">{alert.summary}</div>
                                        <div className="mt-1.5 flex items-center gap-3 text-[0.6rem] text-text-muted">
                                            <span>{ts} IST</span>
                                            {alert.assigned_to && <span>→ {alert.assigned_to}</span>}
                                            {alert.tier === 'TIER_4_CRITICAL' && alert.validation_passed !== undefined && (
                                                <span className="flex items-center gap-1">
                                                    {alert.validation_passed ? (
                                                        <><CheckCircle size={9} className="text-success" /> Validated</>
                                                    ) : (
                                                        <><XCircle size={9} className="text-risk-critical" /> Failed Gate</>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-3 text-right shrink-0">
                                        <div className="text-sm font-extrabold" style={{ color: config.color }}>
                                            {(alert.risk_score * 100).toFixed(0)}%
                                        </div>
                                        <div className="flex items-center gap-1 text-[0.55rem] text-text-muted">
                                            <Clock size={8} /> {alert.sla_hours}h SLA
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
