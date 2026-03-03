import React, { useState } from 'react';
import { DataGenerator } from '../data';
import { CaseFile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, AlertTriangle, Search, ArrowUpRight, CheckCircle, Clock, ChevronRight, ChevronDown, Sparkles, X, Shield, Activity, Users } from 'lucide-react';

const severityConfig = {
    critical: { color: '#EF4444', label: 'Critical', glow: '0 0 12px rgba(239,68,68,0.3)' },
    high: { color: '#F97316', label: 'High', glow: '0 0 12px rgba(249,115,22,0.2)' },
    medium: { color: '#EAB308', label: 'Medium', glow: 'none' },
    low: { color: '#22C55E', label: 'Low', glow: 'none' },
};

const statusConfig = {
    investigating: { color: '#3B82F6', label: 'Investigating', icon: <Search size={10} /> },
    escalated: { color: '#EF4444', label: 'Escalated', icon: <ArrowUpRight size={10} /> },
    resolved: { color: '#22C55E', label: 'Resolved', icon: <CheckCircle size={10} /> },
    dismissed: { color: '#64748B', label: 'Dismissed', icon: <Clock size={10} /> },
};

// Mock findings per case
const caseFindings: Record<string, { findings: string[]; indicators: { label: string; confidence: number; color: string }[]; recommendation: string }> = {
    'INV-2025-0342': {
        findings: [
            'Fan-out pattern: 12 newly created accounts received funds within 90 minutes',
            'Device fingerprint match: 8 accounts share identical browser UA + subnet 192.168.44.0/24',
            'Synthetic identity score: 0.95 — exceeds threshold',
            'Root account opened 14 days ago with minimal KYC documentation',
        ],
        indicators: [
            { label: 'Fan-out Pattern', confidence: 98, color: '#EF4444' },
            { label: 'Synthetic Identity', confidence: 95, color: '#F97316' },
            { label: 'Device Overlap', confidence: 92, color: '#EAB308' },
        ],
        recommendation: 'Immediate temporary freeze on root account ACC-7741. Escalate to L2 for downstream node investigation.',
    },
    'INV-2025-0341': {
        findings: [
            'Multi-layered smurfing through 3 gaming platforms and 2 crypto exchanges',
            'Total volume: ₹45L moved in 72-hour window across 45 transactions',
            'IP geolocation mismatch: account holder in Mumbai, logins from 5 countries',
            'Linked to known hawala broker network via graph proximity (2 hops)',
        ],
        indicators: [
            { label: 'Smurfing', confidence: 96, color: '#EF4444' },
            { label: 'Velocity Anomaly', confidence: 88, color: '#F97316' },
            { label: 'Geo Mismatch', confidence: 82, color: '#EAB308' },
        ],
        recommendation: 'File SAR immediately. Coordinate with gaming platform compliance teams for account suspension.',
    },
    'INV-2025-0340': {
        findings: [
            'Multiple cash deposits: $9,200, $9,500, $9,800 across 3 consecutive days',
            'All deposits at different branch locations within 50km radius',
            'Account holder has no prior transaction history above $2,000',
        ],
        indicators: [
            { label: 'Structuring', confidence: 91, color: '#F97316' },
            { label: 'Threshold Evasion', confidence: 87, color: '#EAB308' },
        ],
        recommendation: 'Place enhanced monitoring on the account. Request source of funds documentation from the account holder.',
    },
    'INV-2025-0339': {
        findings: [
            'Wire transfers routed through 2 shell companies in UAE and Cyprus',
            'Beneficial ownership obscured — nominee directors in both entities',
            'Accounts frozen after detection. Total intercepted: ₹7.2L',
        ],
        indicators: [
            { label: 'Layering', confidence: 78, color: '#EAB308' },
            { label: 'Shell Company', confidence: 72, color: '#64748B' },
        ],
        recommendation: 'Case resolved — accounts frozen. Submit STR to FIU-IND. Archive for pattern library.',
    },
};

export const InvestigationReportCards: React.FC = () => {
    const cases = DataGenerator.generateCases();
    const [expandedCase, setExpandedCase] = useState<string | null>(null);

    const stats = {
        total: cases.length,
        investigating: cases.filter(c => c.status === 'investigating').length,
        escalated: cases.filter(c => c.status === 'escalated').length,
        resolved: cases.filter(c => c.status === 'resolved').length,
        critical: cases.filter(c => c.severity === 'critical').length,
    };

    const toggleExpand = (id: string) => {
        setExpandedCase(prev => prev === id ? null : id);
    };

    return (
        <div className="space-y-3">
            {/* Reports Summary Bar */}
            <div className="rounded-xl border border-border-subtle bg-bg-card p-3.5">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-ai" />
                    <span className="text-[0.68rem] font-bold uppercase tracking-widest text-text-muted">Gemini Report Overview</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {[
                        { label: 'Total', value: stats.total, color: '#7C3AED' },
                        { label: 'Active', value: stats.investigating, color: '#3B82F6' },
                        { label: 'Escalated', value: stats.escalated, color: '#EF4444' },
                        { label: 'Critical', value: stats.critical, color: '#F97316' },
                        { label: 'Resolved', value: stats.resolved, color: '#22C55E' },
                    ].map((s, i) => (
                        <div key={i} className="text-center rounded-lg bg-bg-main px-2 py-2">
                            <div className="text-lg font-extrabold text-white">{s.value}</div>
                            <div className="text-[0.55rem] font-semibold uppercase tracking-widest" style={{ color: s.color }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Case Report Cards */}
            {cases.map((caseFile, i) => {
                const sev = severityConfig[caseFile.severity];
                const stat = statusConfig[caseFile.status];
                const isExpanded = expandedCase === caseFile.id;
                const details = caseFindings[caseFile.id];

                return (
                    <motion.div
                        key={caseFile.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.25 }}
                        className={`rounded-xl border transition-all duration-200 ${isExpanded
                                ? 'border-primary/40 bg-bg-card shadow-lg'
                                : 'border-border-subtle bg-bg-card hover:border-primary/30 hover:shadow-lg'
                            }`}
                    >
                        {/* Card Header — always visible */}
                        <div
                            className="relative overflow-hidden p-4 cursor-pointer group"
                            onClick={() => toggleExpand(caseFile.id)}
                        >
                            <div className="absolute left-0 top-0 h-full w-[3px] rounded-l-xl" style={{ backgroundColor: sev.color }}></div>

                            <div className="pl-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <FileText size={13} className="text-ai" />
                                        <span className="text-[0.62rem] font-mono text-text-muted">{caseFile.id}</span>
                                        <span
                                            className="rounded-full px-1.5 py-0.5 text-[0.5rem] font-bold uppercase"
                                            style={{ backgroundColor: `${sev.color}15`, color: sev.color }}
                                        >
                                            {sev.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.5rem] font-semibold uppercase"
                                            style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                                        >
                                            {stat.icon} {stat.label}
                                        </span>
                                        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                            <ChevronRight size={14} className="text-text-muted" />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className={`text-[0.82rem] font-bold mb-1 transition-colors ${isExpanded ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                                    🧠 {caseFile.title}
                                </div>

                                <div className="text-[0.68rem] text-text-secondary leading-relaxed line-clamp-2 mb-2">
                                    {caseFile.summary}
                                </div>

                                <div className="flex items-center gap-3 text-[0.58rem] text-text-muted">
                                    <span>{caseFile.assigned_to}</span>
                                    <span>• {caseFile.entities_count} entities</span>
                                    <span>• {caseFile.transactions_count} txns</span>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Detail Panel */}
                        <AnimatePresence>
                            {isExpanded && details && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-border-subtle px-5 py-4 space-y-4">
                                        {/* Key Findings */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-2 text-[0.68rem] font-bold text-white">
                                                <Shield size={12} className="text-primary" /> Key Findings
                                            </div>
                                            <div className="space-y-1.5">
                                                {details.findings.map((f, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-[0.72rem] text-text-secondary leading-relaxed">
                                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: sev.color }}></span>
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Indicators */}
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-2 text-[0.68rem] font-bold text-white">
                                                <Activity size={12} className="text-ai" /> Detection Indicators
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {details.indicators.map((ind, idx) => (
                                                    <div key={idx} className="rounded-lg border border-border-subtle bg-bg-main p-2.5">
                                                        <div className="text-[0.6rem] font-semibold text-text-muted mb-1">{ind.label}</div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 flex-1 rounded-full bg-bg-card overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${ind.confidence}%` }}
                                                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                                                    className="h-full rounded-full"
                                                                    style={{ backgroundColor: ind.color }}
                                                                />
                                                            </div>
                                                            <span className="text-[0.65rem] font-bold" style={{ color: ind.color }}>{ind.confidence}%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* AI Recommendation */}
                                        <div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-3">
                                            <div className="flex items-center gap-1.5 mb-1 text-[0.68rem] font-bold text-primary">
                                                💡 AI Recommendation
                                            </div>
                                            <p className="text-[0.72rem] text-text-secondary leading-relaxed">{details.recommendation}</p>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-2">
                                            <button className="flex-1 rounded-lg border border-primary/30 bg-primary/10 py-2 text-[0.68rem] font-bold text-primary transition-all hover:bg-primary/20">
                                                View Full Case →
                                            </button>
                                            <button className="flex-1 rounded-lg border border-border-subtle bg-bg-main py-2 text-[0.68rem] font-semibold text-text-secondary transition-all hover:bg-bg-card-hover hover:text-text-primary">
                                                Generate SAR
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
};
