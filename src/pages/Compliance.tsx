import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DataGenerator } from '../data';
import { ComplianceJurisdiction } from '../types';
import { motion } from 'motion/react';
import { Scale, Shield, Globe, CheckCircle, AlertTriangle, Clock, FileText, Lock, Users, Database } from 'lucide-react';

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    'compliant': { color: '#10B981', icon: <CheckCircle size={14} />, label: 'Compliant' },
    'partial': { color: '#F59E0B', icon: <AlertTriangle size={14} />, label: 'Partial' },
    'non_compliant': { color: '#EF4444', icon: <AlertTriangle size={14} />, label: 'Non-Compliant' },
};

const dpiaConfig: Record<string, { color: string; label: string }> = {
    'completed': { color: '#10B981', label: 'Completed' },
    'in_progress': { color: '#F59E0B', label: 'In Progress' },
    'not_started': { color: '#EF4444', label: 'Not Started' },
};

export const Compliance: React.FC = () => {
    const jurisdictions = DataGenerator.generateComplianceStatus();
    const compliantCount = jurisdictions.filter(j => j.status === 'compliant').length;
    const partialCount = jurisdictions.filter(j => j.status === 'partial').length;
    const dpiaComplete = jurisdictions.filter(j => j.dpia_status === 'completed').length;

    return (
        <div className="min-h-screen bg-bg-main p-4 text-text-primary">
            <Navbar />
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Compliance Center</h1>
                    <p className="mt-1 text-sm text-text-secondary">Multi-jurisdictional regulatory compliance with GDPR, DPDP Act, GLBA, and UK MLR</p>
                </div>

                {/* Summary Stats */}
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                        { label: 'Jurisdictions', value: jurisdictions.length.toString(), sub: 'active regions', icon: <Globe size={16} />, color: '#2563EB' },
                        { label: 'Fully Compliant', value: `${compliantCount}/${jurisdictions.length}`, sub: 'frameworks', icon: <CheckCircle size={16} />, color: '#10B981' },
                        { label: 'DPIAs Complete', value: `${dpiaComplete}/${jurisdictions.length}`, sub: 'assessments', icon: <FileText size={16} />, color: '#7C3AED' },
                        { label: 'Action Required', value: String(partialCount), sub: 'partial compliance', icon: <AlertTriangle size={16} />, color: '#F59E0B' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="rounded-xl border border-border-subtle bg-bg-card p-5"
                        >
                            <div className="mb-2 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">
                                <span style={{ color: stat.color }}>{stat.icon}</span>
                                {stat.label}
                            </div>
                            <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                            <div className="mt-0.5 text-[0.62rem] text-text-muted">{stat.sub}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Jurisdiction Cards */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-2.5">
                        <div className="h-0.5 w-6 rounded-sm bg-success"></div>
                        <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">Jurisdiction Compliance Matrix</div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {jurisdictions.map((jur, i) => {
                            const status = statusConfig[jur.status];
                            const dpia = dpiaConfig[jur.dpia_status];
                            return (
                                <motion.div
                                    key={jur.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative overflow-hidden rounded-xl border border-border-subtle bg-bg-card transition-all hover:border-border hover:shadow-lg"
                                >
                                    <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: status.color }}></div>

                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${status.color}10` }}>
                                                <Globe size={18} style={{ color: status.color }} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{jur.region}</div>
                                                <div className="text-[0.68rem] font-medium text-text-muted">{jur.framework}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-widest"
                                            style={{ backgroundColor: `${status.color}15`, color: status.color }}>
                                            {status.icon} {status.label}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-5 space-y-3">
                                        {/* Lawful Basis */}
                                        <div>
                                            <div className="text-[0.6rem] font-semibold uppercase tracking-widest text-text-muted mb-1">Lawful Basis</div>
                                            <div className="text-[0.72rem] text-text-secondary leading-relaxed">{jur.lawful_basis}</div>
                                        </div>

                                        {/* Key Info Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-lg bg-bg-main px-3 py-2">
                                                <div className="flex items-center gap-1.5 text-[0.6rem] text-text-muted"><Database size={10} /> Data Retention</div>
                                                <div className="mt-0.5 text-[0.75rem] font-bold text-white">{jur.data_retention_years} years</div>
                                            </div>
                                            <div className="rounded-lg bg-bg-main px-3 py-2">
                                                <div className="flex items-center gap-1.5 text-[0.6rem] text-text-muted"><FileText size={10} /> DPIA Status</div>
                                                <div className="mt-0.5 text-[0.75rem] font-bold" style={{ color: dpia.color }}>{dpia.label}</div>
                                            </div>
                                        </div>

                                        {/* Cross-Border */}
                                        <div className="rounded-lg bg-bg-main px-3 py-2">
                                            <div className="flex items-center gap-1.5 text-[0.6rem] text-text-muted"><Lock size={10} /> Cross-Border Mechanism</div>
                                            <div className="mt-0.5 text-[0.72rem] text-text-primary">{jur.cross_border_mechanism}</div>
                                        </div>

                                        {/* Data Subject Rights */}
                                        <div>
                                            <div className="text-[0.6rem] font-semibold uppercase tracking-widest text-text-muted mb-1.5"><Users size={10} className="inline mr-1" />Data Subject Rights</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {jur.rights.map(right => (
                                                    <span key={right} className="rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[0.6rem] font-medium text-success">
                                                        {right}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Special Notes */}
                                        <div className="rounded-lg border border-border-subtle bg-bg-main px-3 py-2">
                                            <div className="text-[0.6rem] font-semibold uppercase tracking-widest text-text-muted mb-1">Notes</div>
                                            <div className="text-[0.68rem] text-text-secondary leading-relaxed">{jur.special_notes}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Privacy Controls Summary */}
                <div className="mb-8 rounded-xl border border-border-subtle bg-bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-primary" />
                        <div className="text-sm font-bold text-white">Platform Privacy Controls</div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            { label: 'Differential Privacy', value: 'ε = 0.5', desc: 'Per federated round', status: 'Active', color: '#10B981' },
                            { label: 'Data Anonymization', value: 'k-Anonymity (k=5)', desc: 'Before cross-bank sharing', status: 'Active', color: '#10B981' },
                            { label: 'Consent Management', value: 'Integrated', desc: 'DPDP Act compliant', status: 'Active', color: '#10B981' },
                            { label: 'Right to Erasure', value: 'Automated', desc: 'GDPR Art. 17 workflows', status: 'Active', color: '#10B981' },
                            { label: 'Audit Logging', value: 'Immutable', desc: 'AWS QLDB ledger-backed', status: 'Active', color: '#10B981' },
                            { label: 'SAR Exemption', value: 'UK MLR', desc: 'Subject access exempt during SAR', status: 'Configured', color: '#F59E0B' },
                        ].map((ctrl, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.06 }}
                                className="flex items-center justify-between rounded-lg bg-bg-main px-4 py-3"
                            >
                                <div>
                                    <div className="text-[0.75rem] font-semibold text-text-primary">{ctrl.label}</div>
                                    <div className="text-[0.62rem] text-text-muted">{ctrl.desc}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[0.75rem] font-bold text-white">{ctrl.value}</div>
                                    <div className="text-[0.55rem] font-semibold uppercase tracking-widest" style={{ color: ctrl.color }}>{ctrl.status}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};
