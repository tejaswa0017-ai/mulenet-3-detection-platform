import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DataGenerator } from '../data';
import { CaseFile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { FolderOpen, AlertTriangle, CheckCircle, Clock, ArrowUpRight, Users, DollarSign, ChevronDown, ChevronUp, Search, Gavel } from 'lucide-react';

const severityConfig = {
    critical: { color: '#EF4444', label: 'Critical' },
    high: { color: '#F97316', label: 'High' },
    medium: { color: '#EAB308', label: 'Medium' },
    low: { color: '#22C55E', label: 'Low' },
};

const statusConfig = {
    investigating: { color: '#3B82F6', label: 'Investigating', icon: <Search size={12} /> },
    escalated: { color: '#EF4444', label: 'Escalated', icon: <ArrowUpRight size={12} /> },
    resolved: { color: '#22C55E', label: 'Resolved', icon: <CheckCircle size={12} /> },
    dismissed: { color: '#64748B', label: 'Dismissed', icon: <Clock size={12} /> },
};

export const CaseManagement: React.FC = () => {
    const cases = DataGenerator.generateCases();
    const [expandedCase, setExpandedCase] = useState<string | null>(cases[0]?.id || null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredCases = filterStatus === 'all' ? cases : cases.filter(c => c.status === filterStatus);
    const activeCount = cases.filter(c => c.status === 'investigating' || c.status === 'escalated').length;
    const totalEntities = cases.reduce((s, c) => s + c.entities_count, 0);

    // Mock verified facts for the selected case
    const verifiedFacts = [
        { time: 'Oct 27, 09:42 AM', text: 'Rapid dispersion of funds (fan-out pattern) detected across 12 newly created accounts.', type: 'fact' },
        { time: 'Oct 27, 09:45 AM', text: 'Device fingerprint overlap: 8 accounts accessed from same user-agent string and subnet.', detail: 'Subnet: 192.168.44.0/24', type: 'evidence' },
        { time: 'Oct 27, 10:02 AM', text: 'Cross-referenced with sanction list "SDN-OFAC".', status: 'Negative Match', statusColor: '#22C55E', type: 'check' },
        { time: 'Oct 27, 10:15 AM', text: 'Synthetic Identity likelihood score exceeds 0.95 threshold.', type: 'alert' },
    ];

    return (
        <div className="min-h-screen bg-bg-main p-4 text-text-primary">
            <Navbar />
            <div className="mx-auto max-w-[1400px]">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white md:text-3xl">Case Management</h1>
                        <p className="mt-1 text-sm text-text-secondary">Investigation tracking with AI explainability & evidence chain</p>
                    </div>
                    <button className="flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover">
                        <Gavel size={16} /> Generate SAR
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                        { label: 'Active Cases', value: String(activeCount), icon: <FolderOpen size={16} />, color: '#3B82F6' },
                        { label: 'Total Cases', value: String(cases.length), icon: <Clock size={16} />, color: '#7C3AED' },
                        { label: 'Entities Tracked', value: String(totalEntities), icon: <Users size={16} />, color: '#F97316' },
                        { label: 'Escalated', value: String(cases.filter(c => c.status === 'escalated').length), icon: <AlertTriangle size={16} />, color: '#EF4444' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="rounded-xl border border-border-subtle bg-bg-card p-4"
                        >
                            <div className="mb-1 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-widest text-text-muted">
                                <span style={{ color: stat.color }}>{stat.icon}</span> {stat.label}
                            </div>
                            <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <div className="mb-4 flex items-center gap-2">
                    {['all', 'investigating', 'escalated', 'resolved', 'dismissed'].map(status => {
                        const config = status === 'all' ? { color: '#64748B', label: 'All', icon: null } : statusConfig[status as keyof typeof statusConfig];
                        return (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.68rem] font-semibold transition-all ${filterStatus === status ? 'text-white' : 'text-text-muted hover:text-text-primary'
                                    }`}
                                style={filterStatus === status ? { backgroundColor: `${config.color}20`, color: config.color } : {}}
                            >
                                {config.label}
                            </button>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-10">
                    {/* Case List */}
                    <div className="lg:col-span-4 space-y-2">
                        {filteredCases.map((caseFile, i) => {
                            const sev = severityConfig[caseFile.severity];
                            const stat = statusConfig[caseFile.status];
                            const isExpanded = expandedCase === caseFile.id;

                            return (
                                <motion.div
                                    key={caseFile.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    onClick={() => setExpandedCase(caseFile.id)}
                                    className={`cursor-pointer rounded-xl border transition-all ${isExpanded
                                            ? 'border-primary/40 bg-primary/5 shadow-lg'
                                            : 'border-border-subtle bg-bg-card hover:border-border hover:bg-bg-card-hover'
                                        }`}
                                >
                                    <div className="relative overflow-hidden p-4">
                                        <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: sev.color }}></div>
                                        <div className="pl-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[0.62rem] font-mono text-text-muted">{caseFile.id}</span>
                                                    <span
                                                        className="rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase"
                                                        style={{ backgroundColor: `${sev.color}15`, color: sev.color }}
                                                    >
                                                        {sev.label}
                                                    </span>
                                                </div>
                                                <span
                                                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.55rem] font-semibold uppercase"
                                                    style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                                                >
                                                    {stat.icon} {stat.label}
                                                </span>
                                            </div>
                                            <div className="text-sm font-bold text-white mb-1">{caseFile.title}</div>
                                            <div className="text-[0.68rem] text-text-secondary line-clamp-2">{caseFile.summary}</div>
                                            <div className="mt-2 flex items-center gap-4 text-[0.6rem] text-text-muted">
                                                <span>{caseFile.assigned_to}</span>
                                                <span>{caseFile.entities_count} entities • {caseFile.transactions_count} txns</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Investigation Detail — Verified Facts Timeline (from design 3) */}
                    <div className="lg:col-span-6">
                        {expandedCase && (() => {
                            const selected = cases.find(c => c.id === expandedCase);
                            if (!selected) return null;
                            const sev = severityConfig[selected.severity];

                            return (
                                <motion.div
                                    key={selected.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Case Header */}
                                    <div className="rounded-xl border border-border-subtle bg-bg-card p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                                                    <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-bg-main px-2.5 py-0.5 text-[0.55rem] font-bold text-primary">
                                                        🛡️ Rust-Verified
                                                    </div>
                                                </div>
                                                <div className="text-[0.72rem] text-text-muted">{selected.id} • Detected via Temporal GNN</div>
                                            </div>
                                            <span
                                                className="rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase"
                                                style={{ backgroundColor: `${sev.color}15`, color: sev.color }}
                                            >
                                                {sev.label} Severity
                                            </span>
                                        </div>
                                        <p className="text-[0.78rem] text-text-secondary leading-relaxed">{selected.summary}</p>
                                    </div>

                                    {/* Verified Facts Timeline */}
                                    <div className="rounded-xl border border-border-subtle bg-bg-card p-5">
                                        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                                            <CheckCircle size={16} className="text-primary" /> Verified Facts
                                        </div>
                                        <div className="relative space-y-5 pl-6">
                                            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-primary/20"></div>
                                            {verifiedFacts.map((fact, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + i * 0.1 }}
                                                    className="relative"
                                                >
                                                    <div className="absolute -left-6 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-primary bg-bg-card">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                                    </div>
                                                    <div className="text-[0.6rem] font-mono text-text-muted mb-1">{fact.time}</div>
                                                    <div className="text-[0.78rem] text-text-secondary leading-relaxed">{fact.text}</div>
                                                    {fact.detail && (
                                                        <div className="mt-1.5 rounded-lg border border-primary/15 bg-primary/5 px-3 py-1.5 text-[0.68rem] font-mono text-primary">
                                                            {fact.detail}
                                                        </div>
                                                    )}
                                                    {fact.status && (
                                                        <span
                                                            className="mt-1.5 inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[0.6rem] font-semibold"
                                                            style={{ backgroundColor: `${fact.statusColor}10`, color: fact.statusColor, borderColor: `${fact.statusColor}25` }}
                                                        >
                                                            <CheckCircle size={9} /> {fact.status}
                                                        </span>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AI Recommendation (from design 3) */}
                                    <div className="rounded-xl border border-border-subtle bg-bg-card p-5">
                                        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                                            <span className="text-ai">💡</span> AI Recommendation
                                        </div>
                                        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4">
                                            <div className="mb-1 text-[0.78rem] font-semibold text-white">Immediate Freeze Recommended</div>
                                            <p className="text-[0.72rem] text-text-secondary leading-relaxed mb-3">
                                                Given the high correlation with known mule patterns and the rapid dispersion of funds, the model recommends an immediate temporary freeze on the root account and investigation of 2 downstream nodes.
                                            </p>
                                            <button className="w-full rounded-lg border border-primary/30 bg-primary/10 py-2 text-[0.75rem] font-bold text-primary transition-all hover:bg-primary/20">
                                                Apply Recommended Actions
                                            </button>
                                        </div>
                                    </div>

                                    {/* Key Indicators (from design 3) */}
                                    <div className="rounded-xl border border-border-subtle bg-bg-card p-5">
                                        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                                            <AlertTriangle size={16} className="text-risk-medium" /> Key Indicators
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { label: 'Structuring (Smurfing)', conf: '98%', desc: 'Multiple cash deposits just under reporting threshold ($9,000 - $9,900) across 3 days.', color: '#F97316' },
                                                { label: 'Dormancy Wake-up', conf: '85%', desc: 'Account inactive for 180+ days suddenly received $45k wire transfer.', color: 'var(--color-primary)' },
                                                { label: 'Velocity Check', conf: '72%', desc: 'High frequency of login attempts from disparate geolocations within 1 hour.', color: 'var(--color-text-secondary)' },
                                            ].map((indicator, i) => (
                                                <div key={i} className="rounded-lg border border-border-subtle bg-bg-main p-3">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <span className="text-[0.78rem] font-bold" style={{ color: indicator.color }}>{indicator.label}</span>
                                                        <span className="text-[0.68rem] font-mono" style={{ color: indicator.color }}>{indicator.conf} Conf.</span>
                                                    </div>
                                                    <p className="text-[0.68rem] text-text-muted leading-relaxed">{indicator.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};
