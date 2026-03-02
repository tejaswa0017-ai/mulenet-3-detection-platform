import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DataGenerator } from '../data';
import { motion } from 'motion/react';
import { Server, Activity, Database, Cpu, HardDrive, Wifi, Shield, Zap, GitBranch, ArrowRight } from 'lucide-react';

const pipelineLayers = [
    { label: 'Layer 1: Data Adapters', desc: 'FIBO + STIX canonical model. Parsers for ISO 20022, SWIFT MT103, STIX 2.1 indicators.', icon: <Database size={18} />, color: '#3B82F6', details: ['ISO 20022 pain.001', 'SWIFT MT103/MT202', 'STIX 2.1 IOC feeds', 'Core Banking API'] },
    { label: 'Layer 2: Entity Resolution', desc: 'MinHash LSH blocking with XGBoost matching. 99% comparison reduction.', icon: <GitBranch size={18} />, color: '#8B5CF6', details: ['MinHash LSH (128 perm)', 'XGBoost v3.2 matcher', 'Phonetic encoding', 'Auto-merge >90%'] },
    { label: 'Layer 3: Temporal Alignment', desc: 'Event sourcing with immutable ledger. Handles late-arriving data with retroactive recomputation.', icon: <Activity size={18} />, color: '#06B6D4', details: ['QLDB immutable ledger', '3 watermark tiers', 'Retroactive analysis', 'Source latency SLAs'] },
    { label: 'Layer 4: Schema Registry', desc: 'FIBO ontology versioning with backward compatibility. Confluent Schema Registry integration.', icon: <Shield size={18} />, color: '#10B981', details: ['Avro schemas', 'BACKWARD compat', 'Auto-transform', 'Provenance tracking'] },
];

export const FederatedIntelligence: React.FC = () => {
    const edgeNodes = DataGenerator.generateEdgeNodes();
    const fedRounds = DataGenerator.generateFederatedRounds();
    const totalThroughput = edgeNodes.reduce((s, n) => s + n.throughput_tps, 0);
    const avgLatency = (edgeNodes.reduce((s, n) => s + n.latency_ms, 0) / edgeNodes.length).toFixed(1);
    const totalGraphNodes = edgeNodes.reduce((s, n) => s + n.neo4j_nodes, 0);

    const statusColor = (status: string) => {
        if (status === 'online') return '#10B981';
        if (status === 'degraded') return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div className="min-h-screen bg-bg-main p-4 text-text-primary">
            <Navbar />
            <div className="mx-auto max-w-[1400px]">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Federated Intelligence</h1>
                    <p className="mt-1 text-sm text-text-secondary">Zero-trust data plane with privacy-preserving cross-bank intelligence</p>
                </div>

                {/* Summary Stats */}
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                        { label: 'Active Nodes', value: edgeNodes.filter(n => n.status === 'online').length + '/' + edgeNodes.length, icon: <Server size={16} />, color: '#10B981' },
                        { label: 'Total Throughput', value: totalThroughput.toLocaleString() + ' TPS', icon: <Zap size={16} />, color: '#2563EB' },
                        { label: 'Avg Latency', value: avgLatency + ' ms', icon: <Activity size={16} />, color: '#06B6D4' },
                        { label: 'Graph Nodes', value: (totalGraphNodes / 1e6).toFixed(1) + 'M', icon: <Database size={16} />, color: '#7C3AED' },
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
                        </motion.div>
                    ))}
                </div>

                {/* Edge Node Grid */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-2.5">
                        <div className="h-0.5 w-6 rounded-sm bg-primary"></div>
                        <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">Edge Node Topology</div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {edgeNodes.map((node, i) => (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="relative overflow-hidden rounded-xl border border-border-subtle bg-bg-card transition-all hover:border-border hover:shadow-lg"
                            >
                                <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: statusColor(node.status) }}></div>
                                <div className="p-5 pl-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-white">{node.institution}</div>
                                            <div className="text-[0.68rem] text-text-muted">{node.region}</div>
                                        </div>
                                        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest"
                                            style={{ backgroundColor: `${statusColor(node.status)}15`, color: statusColor(node.status) }}>
                                            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusColor(node.status) }}></div>
                                            {node.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <div className="text-[0.6rem] text-text-muted">Throughput</div>
                                            <div className="text-sm font-bold text-text-primary">{node.throughput_tps.toLocaleString()} TPS</div>
                                        </div>
                                        <div>
                                            <div className="text-[0.6rem] text-text-muted">Latency</div>
                                            <div className="text-sm font-bold text-text-primary">{node.latency_ms} ms</div>
                                        </div>
                                        <div>
                                            <div className="text-[0.6rem] text-text-muted">CPU</div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 flex-1 rounded-full bg-bg-main">
                                                    <div className="h-full rounded-full transition-all" style={{ width: `${node.cpu_used_pct}%`, backgroundColor: node.cpu_used_pct > 80 ? '#EF4444' : node.cpu_used_pct > 60 ? '#F59E0B' : '#10B981' }}></div>
                                                </div>
                                                <span className="text-[0.62rem] text-text-muted">{node.cpu_used_pct}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[0.6rem] text-text-muted">Memory</div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 flex-1 rounded-full bg-bg-main">
                                                    <div className="h-full rounded-full transition-all" style={{ width: `${node.memory_used_pct}%`, backgroundColor: node.memory_used_pct > 80 ? '#EF4444' : node.memory_used_pct > 60 ? '#F59E0B' : '#10B981' }}></div>
                                                </div>
                                                <span className="text-[0.62rem] text-text-muted">{node.memory_used_pct}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3 text-[0.62rem] text-text-muted">
                                        <span>Kafka Lag: {node.kafka_lag.toLocaleString()}</span>
                                        <span>Flink Jobs: {node.flink_jobs_running}</span>
                                        <span>Neo4j: {(node.neo4j_nodes / 1e6).toFixed(1)}M</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Data Pipeline */}
                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                    <div>
                        <div className="mb-4 flex items-center gap-2.5">
                            <div className="h-0.5 w-6 rounded-sm bg-ai"></div>
                            <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">Integration Pipeline</div>
                        </div>
                        <div className="space-y-3">
                            {pipelineLayers.map((layer, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="overflow-hidden rounded-xl border border-border-subtle bg-bg-card p-5 transition-all hover:border-border"
                                >
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${layer.color}15`, color: layer.color }}>
                                            {layer.icon}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{layer.label}</div>
                                            <div className="text-[0.7rem] text-text-secondary">{layer.desc}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {layer.details.map((d, j) => (
                                            <span key={j} className="rounded-full border border-border-subtle bg-bg-main px-2.5 py-0.5 text-[0.62rem] text-text-muted">{d}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Federated Rounds */}
                    <div>
                        <div className="mb-4 flex items-center gap-2.5">
                            <div className="h-0.5 w-6 rounded-sm bg-flow"></div>
                            <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">Federated Learning Rounds</div>
                        </div>
                        <div className="rounded-xl border border-border-subtle bg-bg-card">
                            <div className="border-b border-border-subtle px-5 py-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-bold text-white">Model Convergence Timeline</div>
                                    <div className="text-[0.65rem] text-text-muted">DP Budget: ε = 0.5 per round</div>
                                </div>
                            </div>
                            <div className="divide-y divide-border-subtle">
                                {fedRounds.map((round, i) => (
                                    <motion.div
                                        key={round.round}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 + i * 0.08 }}
                                        className="flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-bg-card-hover"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-flow/10 text-[0.7rem] font-bold text-flow">
                                                R{round.round}
                                            </div>
                                            <div>
                                                <div className="text-[0.78rem] font-semibold text-text-primary">{round.timestamp.split('T')[0]} {round.timestamp.split('T')[1].substring(0, 5)}</div>
                                                <div className="text-[0.62rem] text-text-muted">{round.participants} participants • {round.aggregation_method}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold" style={{ color: round.model_improvement_pct > 2 ? '#10B981' : '#F59E0B' }}>
                                                +{round.model_improvement_pct}%
                                            </div>
                                            <div className="text-[0.6rem] text-text-muted">improvement</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Privacy Controls */}
                        <div className="mt-4 rounded-xl border border-border-subtle bg-bg-card p-5">
                            <div className="mb-3 text-sm font-bold text-white">🔐 Privacy Controls</div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Differential Privacy (ε)', value: '0.5', status: 'Active', desc: 'Gaussian noise injection per round' },
                                    { label: 'Bloom Filter Error Rate', value: '0.1%', status: 'Active', desc: 'Privacy-preserving set membership' },
                                    { label: 'FHE Scheme', value: 'CKKS', status: 'Active', desc: 'Fully homomorphic encryption for PSI' },
                                    { label: 'Secure Aggregation', value: 'Enabled', status: 'Active', desc: 'NVIDIA FLARE SecAgg protocol' },
                                ].map((ctrl, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg bg-bg-main px-3 py-2">
                                        <div>
                                            <div className="text-[0.75rem] font-semibold text-text-primary">{ctrl.label}</div>
                                            <div className="text-[0.62rem] text-text-muted">{ctrl.desc}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-flow">{ctrl.value}</div>
                                            <div className="text-[0.55rem] font-semibold uppercase tracking-widest text-success">{ctrl.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};
