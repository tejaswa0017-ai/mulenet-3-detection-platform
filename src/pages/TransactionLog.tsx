import React, { useState, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Transaction, TransactionPattern, RiskLevel } from '../types';
import { useTransactions } from '../hooks/useApi';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, Filter, Eye, ArrowUpDown, Clock, DollarSign, AlertTriangle } from 'lucide-react';

const riskConfig: Record<RiskLevel, { color: string; label: string }> = {
    critical: { color: '#EF4444', label: 'Critical' },
    high: { color: '#F97316', label: 'High' },
    medium: { color: '#EAB308', label: 'Medium' },
    low: { color: '#22C55E', label: 'Low' },
};

const patternIcons: Record<TransactionPattern, string> = {
    'Fan-out': '⇉',
    'Fan-in': '⇇',
    'Structuring': '▣',
    'Smurfing': '⚡',
    'Layering': '≋',
    'Rapid Move': '⚡',
    'Normal': '—',
};

export const TransactionLog: React.FC = () => {
    const txnApi = useTransactions();
    const transactions = txnApi.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
    const [filterPattern, setFilterPattern] = useState<TransactionPattern | 'all'>('all');
    const [sortField, setSortField] = useState<'timestamp' | 'amount' | 'risk_score'>('timestamp');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;

    const filteredTxns = useMemo(() => {
        let result = [...transactions];
        if (filterRisk !== 'all') result = result.filter(t => t.risk_level === filterRisk);
        if (filterPattern !== 'all') result = result.filter(t => t.pattern === filterPattern);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(t => t.id.toLowerCase().includes(q) || t.counterparty.toLowerCase().includes(q));
        }
        result.sort((a, b) => {
            const mul = sortDir === 'desc' ? -1 : 1;
            if (sortField === 'timestamp') return mul * a.timestamp.localeCompare(b.timestamp);
            return mul * ((a as any)[sortField] - (b as any)[sortField]);
        });
        return result;
    }, [transactions, filterRisk, filterPattern, searchQuery, sortField, sortDir]);

    const totalPages = Math.ceil(filteredTxns.length / perPage);
    const paginated = filteredTxns.slice((currentPage - 1) * perPage, currentPage * perPage);

    const toggleSort = (field: typeof sortField) => {
        if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortField(field); setSortDir('desc'); }
    };

    const criticalCount = transactions.filter(t => t.risk_level === 'critical').length;
    const flaggedCount = transactions.filter(t => t.flagged).length;
    const totalVolume = transactions.reduce((s, t) => s + t.amount, 0);

    return (
        <div className="min-h-screen bg-bg-main p-4 text-text-primary">
            <Navbar />
            <div className="mx-auto max-w-[1400px]">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-primary border border-primary/20">Live Monitoring</span>
                            <span className="text-[0.6rem] font-mono text-text-muted">WS-CONNECTED</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white md:text-3xl">Transaction Log Analysis</h1>
                        <p className="mt-1 text-sm text-text-secondary">Real-time cyber-financial crime detection & pattern recognition</p>
                    </div>
                    <button className="flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30">
                        <Download size={16} /> Export Report
                    </button>
                </div>

                {/* Filters Panel */}
                <div className="mb-6 rounded-xl border border-border-subtle bg-bg-card p-5">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                        {/* Risk Filters */}
                        <div className="lg:col-span-4">
                            <label className="mb-2 block text-[0.62rem] font-bold uppercase tracking-widest text-text-muted">Risk Level Filter</label>
                            <div className="flex flex-wrap gap-2">
                                {(['all', 'critical', 'high', 'medium', 'low'] as const).map(risk => {
                                    const config = risk === 'all' ? { color: '#64748B', label: 'All' } : riskConfig[risk];
                                    const isActive = filterRisk === risk;
                                    return (
                                        <button
                                            key={risk}
                                            onClick={() => { setFilterRisk(risk); setCurrentPage(1); }}
                                            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.72rem] font-medium transition-all"
                                            style={{
                                                borderColor: isActive ? `${config.color}60` : 'var(--color-border-subtle)',
                                                backgroundColor: isActive ? `${config.color}15` : 'transparent',
                                                color: isActive ? config.color : 'var(--color-text-muted)',
                                            }}
                                        >
                                            {risk !== 'all' && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.color, boxShadow: isActive ? `0 0 6px ${config.color}` : 'none' }}></span>}
                                            {config.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Search */}
                        <div className="lg:col-span-4 lg:border-l lg:border-border-subtle lg:pl-5">
                            <label className="mb-2 block text-[0.62rem] font-bold uppercase tracking-widest text-text-muted">Search Transactions</label>
                            <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-main px-3 py-2 focus-within:border-primary transition-colors">
                                <Search size={14} className="text-text-muted" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    placeholder="Search TXN ID or counterparty..."
                                    className="w-full border-none bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Pattern Filter */}
                        <div className="lg:col-span-4 lg:border-l lg:border-border-subtle lg:pl-5">
                            <label className="mb-2 block text-[0.62rem] font-bold uppercase tracking-widest text-text-muted">Pattern Type</label>
                            <select
                                value={filterPattern}
                                onChange={e => { setFilterPattern(e.target.value as any); setCurrentPage(1); }}
                                className="w-full rounded-lg border border-border-subtle bg-bg-main px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                            >
                                <option value="all">All Patterns</option>
                                {(['Fan-out', 'Fan-in', 'Structuring', 'Smurfing', 'Layering', 'Rapid Move', 'Normal'] as const).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-bg-main sticky top-0 z-10">
                                <tr>
                                    <th className="px-5 py-3.5 text-[0.62rem] font-bold uppercase tracking-widest text-text-muted">
                                        <button onClick={() => toggleSort('timestamp')} className="flex items-center gap-1 hover:text-text-primary transition-colors">
                                            Timestamp {sortField === 'timestamp' && <ArrowUpDown size={10} />}
                                        </button>
                                    </th>
                                    <th className="px-5 py-3.5 text-[0.62rem] font-bold uppercase tracking-widest text-text-muted">Transaction ID</th>
                                    <th className="px-5 py-3.5 text-[0.62rem] font-bold uppercase tracking-widest text-text-muted">Counterparty</th>
                                    <th className="px-5 py-3.5 text-[0.62rem] font-bold uppercase tracking-widest text-text-muted text-right">
                                        <button onClick={() => toggleSort('amount')} className="flex items-center gap-1 ml-auto hover:text-text-primary transition-colors">
                                            Amount {sortField === 'amount' && <ArrowUpDown size={10} />}
                                        </button>
                                    </th>
                                    <th className="px-5 py-3.5 text-[0.62rem] font-bold uppercase tracking-widest text-text-muted text-center">
                                        <button onClick={() => toggleSort('risk_score')} className="flex items-center gap-1 mx-auto hover:text-text-primary transition-colors">
                                            Risk {sortField === 'risk_score' && <ArrowUpDown size={10} />}
                                        </button>
                                    </th>
                                    <th className="px-5 py-3.5 text-[0.62rem] font-bold uppercase tracking-widest text-text-muted">Pattern</th>
                                    <th className="px-5 py-3.5 text-[0.62rem] font-bold uppercase tracking-widest text-text-muted text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle text-sm">
                                <AnimatePresence mode="popLayout">
                                    {paginated.map((txn, i) => {
                                        const config = riskConfig[txn.risk_level];
                                        const ts = txn.timestamp.replace('T', ' ').substring(0, 16);
                                        return (
                                            <motion.tr
                                                key={txn.id}
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                transition={{ delay: i * 0.03, duration: 0.2 }}
                                                className="group cursor-pointer transition-colors hover:bg-bg-card-hover"
                                            >
                                                <td className="px-5 py-3.5 font-mono text-[0.72rem] text-text-muted whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {txn.flagged && <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: config.color }}></span>}
                                                        {ts}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 font-mono text-[0.72rem] text-text-muted">{txn.id}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-bg-main text-[0.55rem] font-bold text-text-secondary">{txn.counterparty_initials}</div>
                                                        <span className="text-[0.78rem] font-medium text-text-primary">{txn.counterparty}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <span className={`font-mono text-[0.78rem] ${txn.risk_level === 'critical' ? 'font-bold text-white' : 'font-medium text-text-primary'}`}>
                                                        ${txn.amount.toLocaleString()} {txn.currency}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex justify-center">
                                                        <div className="relative h-7 w-full max-w-[100px] overflow-hidden rounded bg-bg-main flex items-center justify-center">
                                                            <div className="absolute inset-0 rounded" style={{
                                                                background: `linear-gradient(90deg, transparent, ${config.color}30, ${config.color}60)`,
                                                                width: `${txn.risk_score}%`,
                                                            }}></div>
                                                            <span className="relative z-10 text-[0.68rem] font-bold text-white drop-shadow-md">{txn.risk_score}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span
                                                        className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[0.68rem] font-medium"
                                                        style={{
                                                            backgroundColor: txn.pattern !== 'Normal' ? `${config.color}10` : 'var(--color-bg-main)',
                                                            color: txn.pattern !== 'Normal' ? config.color : 'var(--color-text-muted)',
                                                            borderColor: txn.pattern !== 'Normal' ? `${config.color}25` : 'var(--color-border-subtle)',
                                                        }}
                                                    >
                                                        {patternIcons[txn.pattern]} {txn.pattern}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <button className="rounded-lg p-1.5 text-text-muted transition-all hover:bg-primary/10 hover:text-primary">
                                                        {txn.flagged ? <Search size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-border-subtle bg-bg-main px-5 py-3 text-sm sm:flex-row">
                        <span className="text-[0.75rem] text-text-muted">
                            Showing <span className="font-bold text-text-primary">{(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredTxns.length)}</span> of <span className="font-bold text-text-primary">{filteredTxns.length}</span> transactions
                        </span>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="rounded-lg border border-border-subtle px-3 py-1 text-[0.72rem] text-text-muted transition-all hover:bg-bg-card-hover disabled:opacity-40"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`rounded-lg px-3 py-1 text-[0.72rem] font-medium transition-all ${currentPage === i + 1
                                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                                        : 'border border-border-subtle text-text-muted hover:bg-bg-card-hover'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="rounded-lg border border-border-subtle px-3 py-1 text-[0.72rem] text-text-muted transition-all hover:bg-bg-card-hover disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};
