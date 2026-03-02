import React from 'react';
import { DataGenerator } from '../data';
import { motion } from 'motion/react';
import { Server, Zap, Shield, Brain } from 'lucide-react';

export const FederatedStatus: React.FC = () => {
    const edgeNodes = DataGenerator.generateEdgeNodes();
    const fedRounds = DataGenerator.generateFederatedRounds();

    const onlineCount = edgeNodes.filter(n => n.status === 'online').length;
    const totalTps = edgeNodes.reduce((s, n) => s + n.throughput_tps, 0);
    const currentRound = fedRounds[0];
    const avgEpsilon = (edgeNodes.reduce((s, n) => s + n.dp_epsilon_consumed, 0) / edgeNodes.length).toFixed(2);

    return (
        <div className="rounded-[18px] border border-border-subtle bg-bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Server size={14} />
                </div>
                <div className="text-[0.78rem] font-bold text-white">Federated Cluster</div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-bg-main px-3 py-2.5">
                    <div className="flex items-center gap-2 text-[0.68rem] text-text-secondary">
                        <Server size={12} className="text-success" /> Active Nodes
                    </div>
                    <div className="text-sm font-bold text-white">{onlineCount}/{edgeNodes.length}</div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-bg-main px-3 py-2.5">
                    <div className="flex items-center gap-2 text-[0.68rem] text-text-secondary">
                        <Brain size={12} className="text-ai" /> Current Round
                    </div>
                    <div className="text-sm font-bold text-white">R{currentRound.round}</div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-bg-main px-3 py-2.5">
                    <div className="flex items-center gap-2 text-[0.68rem] text-text-secondary">
                        <Zap size={12} className="text-flow" /> Total Throughput
                    </div>
                    <div className="text-sm font-bold text-white">{(totalTps / 1000).toFixed(1)}K TPS</div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-bg-main px-3 py-2.5">
                    <div className="flex items-center gap-2 text-[0.68rem] text-text-secondary">
                        <Shield size={12} className="text-risk-medium" /> Privacy Budget (ε)
                    </div>
                    <div className="text-sm font-bold text-white">{avgEpsilon} / 0.50</div>
                </div>
            </div>

            {/* Node Status Dots */}
            <div className="mt-4 flex items-center gap-1.5">
                {edgeNodes.map(node => (
                    <div
                        key={node.id}
                        title={`${node.institution} — ${node.status}`}
                        className="h-2.5 w-2.5 rounded-full transition-all hover:scale-150"
                        style={{
                            backgroundColor: node.status === 'online' ? '#10B981' : node.status === 'degraded' ? '#F59E0B' : '#EF4444',
                            boxShadow: node.status !== 'online' ? `0 0 6px ${node.status === 'degraded' ? '#F59E0B' : '#EF4444'}` : 'none'
                        }}
                    ></div>
                ))}
                <span className="ml-1 text-[0.55rem] text-text-muted">nodes</span>
            </div>
        </div>
    );
};
