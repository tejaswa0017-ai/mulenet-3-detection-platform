import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EntityResolutionMatch } from '../types';
import { useEntityMatches } from '../hooks/useApi';
import { motion, AnimatePresence } from 'motion/react';
import { GitMerge, Search, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, Users } from 'lucide-react';

const actionConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    'AUTO_MERGE': { color: '#10B981', icon: <CheckCircle size={14} />, label: 'Auto-Merged' },
    'HUMAN_REVIEW': { color: '#F59E0B', icon: <AlertTriangle size={14} />, label: 'Needs Review' },
    'NON_MATCH': { color: '#64748B', icon: <XCircle size={14} />, label: 'Non-Match' },
};

const FeatureBar: React.FC<{ label: string; value: number; isBool?: boolean; boolVal?: boolean }> = ({ label, value, isBool, boolVal }) => (
    <div className="flex items-center justify-between py-1">
        <span className="text-[0.68rem] text-text-muted">{label}</span>
        {isBool !== undefined ? (
            <span className={`text-[0.68rem] font-bold ${boolVal ? 'text-success' : 'text-text-muted'}`}>
                {boolVal ? '✓ Match' : '✗ No'}
            </span>
        ) : (
            <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 rounded-full bg-bg-main">
                    <div
                        className="h-full rounded-full transition-all"
                        style={{
                            width: `${Math.min(value * 100, 100)}%`,
                            backgroundColor: value > 0.8 ? '#10B981' : value > 0.5 ? '#F59E0B' : '#EF4444'
                        }}
                    ></div>
                </div>
                <span className="w-10 text-right text-[0.68rem] font-bold text-text-primary">{(value * 100).toFixed(0)}%</span>
            </div>
        )}
    </div>
);

export const EntityResolution: React.FC = () => {
    const entityApi = useEntityMatches();
    const matches = (entityApi.data || []) as EntityResolutionMatch[];
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterAction, setFilterAction] = useState<string>('ALL');

    const filteredMatches = filterAction === 'ALL' ? matches : matches.filter(m => m.action === filterAction);
    const autoMerged = matches.filter(m => m.action === 'AUTO_MERGE').length;
    const needsReview = matches.filter(m => m.action === 'HUMAN_REVIEW').length;
    const nonMatches = matches.filter(m => m.action === 'NON_MATCH').length;
    const totalComparisons = 24500;
    const candidatePairs = matches.length * 12;

    return (
        <div className="min-h-screen bg-bg-main p-4 text-text-primary">
            <Navbar />
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Entity Resolution</h1>
                    <p className="mt-1 text-sm text-text-secondary">MinHash LSH blocking with XGBoost Fellegi-Sunter matching</p>
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
                    {[
                        { label: 'Total Entities', value: totalComparisons.toLocaleString(), color: '#3B82F6' },
                        { label: 'Candidate Pairs', value: candidatePairs.toLocaleString(), color: '#8B5CF6' },
                        { label: 'Auto-Merged', value: String(autoMerged), color: '#10B981' },
                        { label: 'Needs Review', value: String(needsReview), color: '#F59E0B' },
                        { label: 'LSH Reduction', value: '99.2%', color: '#06B6D4' },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="rounded-xl border border-border-subtle bg-bg-card p-4"
                        >
                            <div className="text-[0.62rem] font-semibold uppercase tracking-widest text-text-muted">{s.label}</div>
                            <div className="mt-1 text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="mb-4 flex items-center gap-2">
                    {['ALL', 'AUTO_MERGE', 'HUMAN_REVIEW', 'NON_MATCH'].map(action => (
                        <button
                            key={action}
                            onClick={() => setFilterAction(action)}
                            className={`rounded-lg px-3 py-1.5 text-[0.7rem] font-semibold transition-all ${filterAction === action
                                ? 'bg-primary/15 text-primary'
                                : 'text-text-muted hover:bg-bg-card-hover hover:text-text-primary'
                                }`}
                        >
                            {action === 'ALL' ? `All (${matches.length})` :
                                action === 'AUTO_MERGE' ? `Auto-Merged (${autoMerged})` :
                                    action === 'HUMAN_REVIEW' ? `Review Queue (${needsReview})` :
                                        `Non-Match (${nonMatches})`}
                        </button>
                    ))}
                </div>

                {/* Match Cards */}
                <div className="space-y-3">
                    {filteredMatches.map((match, i) => {
                        const config = actionConfig[match.action];
                        const isExpanded = expandedId === match.id;

                        return (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="overflow-hidden rounded-xl border border-border-subtle bg-bg-card transition-all hover:border-border"
                            >
                                {/* Header */}
                                <div
                                    className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-bg-card-hover"
                                    onClick={() => setExpandedId(isExpanded ? null : match.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ai/10 text-ai">
                                            <GitMerge size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">
                                                {match.entity_a.name} ↔ {match.entity_b.name}
                                            </div>
                                            <div className="text-[0.68rem] text-text-muted">
                                                {match.entity_a.bank} ↔ {match.entity_b.bank} • ID: {match.id}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-lg font-extrabold text-white">{(match.confidence * 100).toFixed(0)}%</div>
                                            <div className="text-[0.6rem] text-text-muted">confidence</div>
                                        </div>
                                        <div
                                            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-widest"
                                            style={{ backgroundColor: `${config.color}15`, color: config.color }}
                                        >
                                            {config.icon} {config.label}
                                        </div>
                                        {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-border-subtle p-5">
                                                <div className="grid gap-6 lg:grid-cols-3">
                                                    {/* Entity A */}
                                                    <div className="rounded-xl border border-border-subtle bg-bg-main p-4">
                                                        <div className="mb-3 text-[0.62rem] font-bold uppercase tracking-widest text-primary">Entity A — {match.entity_a.bank}</div>
                                                        {Object.entries(match.entity_a).filter(([k]) => k !== 'id' && k !== 'bank').map(([key, val]) => (
                                                            <div key={key} className="flex justify-between border-b border-border-subtle py-1.5 last:border-none">
                                                                <span className="text-[0.68rem] capitalize text-text-muted">{key}</span>
                                                                <span className="text-[0.68rem] font-medium text-text-primary">{val}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Features */}
                                                    <div className="rounded-xl border border-border-subtle bg-bg-main p-4">
                                                        <div className="mb-3 text-[0.62rem] font-bold uppercase tracking-widest text-ai">Match Features</div>
                                                        <FeatureBar label="Name Jaro-Winkler" value={match.features.name_jaro_winkler} />
                                                        <FeatureBar label="Name Phonetic" value={0} isBool boolVal={match.features.name_phonetic_match} />
                                                        <FeatureBar label="DOB Difference" value={Math.max(0, 1 - match.features.dob_days_diff / 365)} />
                                                        <FeatureBar label="Address Token Set" value={match.features.address_token_set_ratio} />
                                                        <FeatureBar label="Phone Overlap" value={match.features.phone_digit_overlap} />
                                                        <FeatureBar label="Email Match" value={0} isBool boolVal={match.features.email_exact_match} />
                                                        <FeatureBar label="Device FP Jaccard" value={match.features.device_fingerprint_jaccard} />
                                                        <FeatureBar label="IP CIDR Overlap" value={match.features.ip_cidr_overlap} />
                                                    </div>

                                                    {/* Entity B */}
                                                    <div className="rounded-xl border border-border-subtle bg-bg-main p-4">
                                                        <div className="mb-3 text-[0.62rem] font-bold uppercase tracking-widest text-flow">Entity B — {match.entity_b.bank}</div>
                                                        {Object.entries(match.entity_b).filter(([k]) => k !== 'id' && k !== 'bank').map(([key, val]) => (
                                                            <div key={key} className="flex justify-between border-b border-border-subtle py-1.5 last:border-none">
                                                                <span className="text-[0.68rem] capitalize text-text-muted">{key}</span>
                                                                <span className="text-[0.68rem] font-medium text-text-primary">{val}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                {match.action === 'HUMAN_REVIEW' && !match.reviewed && (
                                                    <div className="mt-4 flex gap-3 border-t border-border-subtle pt-4">
                                                        <button className="rounded-lg bg-success/15 px-4 py-2 text-[0.75rem] font-bold text-success transition-all hover:bg-success/25">
                                                            ✓ Confirm Merge
                                                        </button>
                                                        <button className="rounded-lg bg-risk-critical/15 px-4 py-2 text-[0.75rem] font-bold text-risk-critical transition-all hover:bg-risk-critical/25">
                                                            ✗ Reject Match
                                                        </button>
                                                        <button className="rounded-lg bg-primary/15 px-4 py-2 text-[0.75rem] font-bold text-primary transition-all hover:bg-primary/25">
                                                            ⟳ Request More Data
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                <Footer />
            </div>
        </div>
    );
};
