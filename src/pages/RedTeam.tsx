import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useRedTeam } from '../hooks/useApi';
import { TTPSophistication } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Shield, Crosshair, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Swords, Flame, Zap, Crown } from 'lucide-react';

const sophConfig: Record<TTPSophistication, { color: string; icon: React.ReactNode; label: string }> = {
    'BASIC': { color: '#3B82F6', icon: <Shield size={16} />, label: 'Basic' },
    'MODERATE': { color: '#F59E0B', icon: <Zap size={16} />, label: 'Moderate' },
    'ADVANCED': { color: '#F97316', icon: <Flame size={16} />, label: 'Advanced' },
    'EXPERT': { color: '#EF4444', icon: <Crown size={16} />, label: 'Expert' },
};

export const RedTeam: React.FC = () => {
    const redTeamApi = useRedTeam();
    const ttpLibrary = redTeamApi.data?.ttp_library || [];
    const scenarios = redTeamApi.data?.scenarios || [];
    const kpis = redTeamApi.data?.kpis || [];
    const [expandedTTP, setExpandedTTP] = useState<string | null>(null);
    const [filterSoph, setFilterSoph] = useState<string>('ALL');

    const filteredTTPs = filterSoph === 'ALL' ? ttpLibrary : ttpLibrary.filter((t: any) => t.sophistication === filterSoph);
    const totalDetected = scenarios.filter((s: any) => s.detected).length;
    const avgLatency = scenarios.length > 0 ? (scenarios.reduce((s: number, sc: any) => s + sc.detection_latency_seconds, 0) / scenarios.length).toFixed(1) : '0';

    return (
        <div className="min-h-screen bg-bg-main p-4 text-text-primary">
            <Navbar />
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Adversarial Red Team Engine</h1>
                    <p className="mt-1 text-sm text-text-secondary">Continuous testing against 47+ evasion TTPs mapped to MITRE ATT&CK for Financial Services</p>
                </div>

                {/* KPI Gauges */}
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {kpis.map((kpi, i) => {
                        const config = sophConfig[kpi.level];
                        return (
                            <motion.div
                                key={kpi.level}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="relative overflow-hidden rounded-xl border border-border-subtle bg-bg-card p-5"
                            >
                                <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: config.color }}></div>
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                                        {config.icon}
                                    </div>
                                    <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">{config.label}</div>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="text-3xl font-extrabold text-white">{(kpi.achieved * 100).toFixed(0)}%</div>
                                    <div className="mb-1 text-[0.62rem] text-text-muted">/ {(kpi.target * 100).toFixed(0)}% target</div>
                                </div>
                                <div className="mt-2 h-2 w-full rounded-full bg-bg-main">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: kpi.passed ? '#10B981' : '#EF4444' }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(kpi.achieved / kpi.target * 100, 100)}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                    ></motion.div>
                                </div>
                                <div className="mt-2 flex items-center gap-1.5">
                                    {kpi.passed ? (
                                        <><CheckCircle size={12} className="text-success" /><span className="text-[0.62rem] font-semibold text-success">PASSED</span></>
                                    ) : (
                                        <><XCircle size={12} className="text-risk-critical" /><span className="text-[0.62rem] font-semibold text-risk-critical">FAILED — Retraining Triggered</span></>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-10">
                    {/* TTP Library */}
                    <div className="lg:col-span-6">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-0.5 w-6 rounded-sm bg-risk-critical"></div>
                                <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">TTP Library ({ttpLibrary.length} TTPs)</div>
                            </div>
                            <div className="flex gap-1">
                                {['ALL', 'BASIC', 'MODERATE', 'ADVANCED', 'EXPERT'].map(soph => (
                                    <button
                                        key={soph}
                                        onClick={() => setFilterSoph(soph)}
                                        className={`rounded-lg px-2.5 py-1 text-[0.62rem] font-semibold transition-all ${filterSoph === soph
                                            ? 'bg-primary/15 text-primary'
                                            : 'text-text-muted hover:bg-bg-card-hover hover:text-text-primary'
                                            }`}
                                    >
                                        {soph === 'ALL' ? 'All' : soph}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            {filteredTTPs.map((ttp, i) => {
                                const config = sophConfig[ttp.sophistication];
                                const isExpanded = expandedTTP === ttp.id;
                                return (
                                    <motion.div
                                        key={ttp.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="rounded-xl border border-border-subtle bg-bg-card transition-all hover:border-border"
                                    >
                                        <div
                                            className="flex cursor-pointer items-center justify-between p-3.5 transition-colors hover:bg-bg-card-hover"
                                            onClick={() => setExpandedTTP(isExpanded ? null : ttp.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                                                    {config.icon}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[0.78rem] font-bold text-white">{ttp.name}</span>
                                                        <span className="rounded bg-bg-main px-1.5 py-0.5 text-[0.55rem] font-mono text-text-muted">{ttp.id}</span>
                                                    </div>
                                                    <div className="text-[0.62rem] text-text-muted">MITRE: {ttp.mitre_id} • {config.label} Sophistication</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className="text-sm font-bold" style={{ color: ttp.detection_rate > 0.9 ? '#10B981' : ttp.detection_rate > 0.7 ? '#F59E0B' : '#EF4444' }}>
                                                        {(ttp.detection_rate * 100).toFixed(0)}%
                                                    </div>
                                                    <div className="text-[0.55rem] text-text-muted">detection</div>
                                                </div>
                                                {isExpanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden border-t border-border-subtle"
                                                >
                                                    <div className="p-4 text-[0.78rem] leading-relaxed text-text-secondary">
                                                        {ttp.description}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Simulation Results */}
                    <div className="lg:col-span-4">
                        <div className="mb-3 flex items-center gap-2.5">
                            <div className="h-0.5 w-6 rounded-sm bg-ai"></div>
                            <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">Nightly Simulation Results</div>
                        </div>

                        {/* Summary */}
                        <div className="mb-4 grid grid-cols-3 gap-3">
                            <div className="rounded-xl border border-border-subtle bg-bg-card p-3 text-center">
                                <div className="text-xl font-extrabold text-white">{scenarios.length}</div>
                                <div className="text-[0.55rem] text-text-muted">Scenarios</div>
                            </div>
                            <div className="rounded-xl border border-border-subtle bg-bg-card p-3 text-center">
                                <div className="text-xl font-extrabold text-success">{totalDetected}/{scenarios.length}</div>
                                <div className="text-[0.55rem] text-text-muted">Detected</div>
                            </div>
                            <div className="rounded-xl border border-border-subtle bg-bg-card p-3 text-center">
                                <div className="text-xl font-extrabold text-flow">{avgLatency}s</div>
                                <div className="text-[0.55rem] text-text-muted">Avg Latency</div>
                            </div>
                        </div>

                        {/* Scenario Cards */}
                        <div className="space-y-2">
                            {scenarios.map((sc, i) => {
                                const config = sophConfig[sc.sophistication];
                                return (
                                    <motion.div
                                        key={sc.id}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        className="relative overflow-hidden rounded-xl border border-border-subtle bg-bg-card p-4"
                                    >
                                        <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: sc.detected ? '#10B981' : '#EF4444' }}></div>
                                        <div className="flex items-center justify-between pl-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[0.72rem] font-bold text-white">{sc.id}</span>
                                                    <span className="rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <div className="mt-0.5 text-[0.6rem] text-text-muted">
                                                    {sc.ttps_applied.length} TTPs • {sc.network_size} nodes • {sc.detection_latency_seconds.toFixed(1)}s
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {sc.detected ? (
                                                    <div className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-[0.6rem] font-bold text-success">
                                                        <CheckCircle size={10} /> Detected
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 rounded-full bg-risk-critical/15 px-2.5 py-0.5 text-[0.6rem] font-bold text-risk-critical">
                                                        <XCircle size={10} /> Missed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {sc.false_negatives > 0 && (
                                            <div className="mt-2 pl-2 flex items-center gap-1.5 text-[0.6rem] text-risk-medium">
                                                <AlertTriangle size={10} /> {sc.false_negatives} false negatives
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Retraining Status */}
                        <div className="mt-4 rounded-xl border border-risk-critical/30 bg-risk-critical/5 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-risk-critical">
                                <AlertTriangle size={16} /> Adversarial Retraining Active
                            </div>
                            <p className="text-[0.72rem] text-text-secondary">
                                2 KPI failures detected (ADVANCED, EXPERT). Generating 5x augmented training data from failed scenarios. TGN and risk scorer retraining in progress.
                            </p>
                            <div className="mt-3 h-1.5 w-full rounded-full bg-bg-main">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-risk-critical to-risk-medium"
                                    initial={{ width: 0 }}
                                    animate={{ width: '68%' }}
                                    transition={{ duration: 1.5 }}
                                ></motion.div>
                            </div>
                            <div className="mt-1 text-[0.6rem] text-text-muted">Retraining progress: 68%</div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};
