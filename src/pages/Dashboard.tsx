import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MetricCard } from '../components/MetricCard';
import { AttackChain } from '../components/AttackChain';
import { GraphSVG } from '../components/GraphSVG';
import { InvestigationReportCards } from '../components/InvestigationReportCards';
import { EntityPanel } from '../components/EntityPanel';
import { ModelSignals } from '../components/ModelSignals';
import { Timeline } from '../components/Timeline';
import { QuickActions } from '../components/QuickActions';
import { TieredAlertPanel } from '../components/TieredAlertPanel';
import { RiskDecomposition } from '../components/RiskDecomposition';
import { FederatedStatus } from '../components/FederatedStatus';
import { DataGenerator } from '../data';
import { GraphNode, GraphEdge } from '../types';
import { useNetwork } from '../hooks/useApi';

// Reusable scroll-reveal wrapper
const ScrollReveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const network = useNetwork();
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!network.loading && network.data) {
      setNodes(network.data.nodes);
      setEdges(network.data.edges);
      DataGenerator.generateAlerts();
      setIsLoading(false);
    }
  }, [network.loading, network.data]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      network.reload();
    }
  };

  const SectionHeader = ({ title, color, children }: { title: string, color: string, children?: React.ReactNode }) => (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="h-0.5 w-5 rounded-sm" style={{ backgroundColor: color }}></div>
        <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">{title}</div>
      </div>
      {children}
    </div>
  );

  const healthMetrics = [
    { label: 'CPU', value: '34%', ok: true },
    { label: 'Memory', value: '62%', ok: true },
    { label: 'API Latency', value: '12ms', ok: true },
    { label: 'Kafka Lag', value: '2.1K', ok: false },
    { label: 'Neo4j Nodes', value: '48.2K', ok: true },
    { label: 'Model Inf.', value: '89ms', ok: true },
  ];

  const threatRegions = [
    { region: 'South Asia', count: 12, pct: 100 },
    { region: 'E. Europe', count: 8, pct: 67 },
    { region: 'West Africa', count: 5, pct: 42 },
    { region: 'SE Asia', count: 3, pct: 25 },
  ];

  return (
    <div className="min-h-screen bg-bg-main p-4 text-text-primary relative">
      <Navbar />

      <div className="mx-auto max-w-[1400px]">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SectionHeader title="System Status — Live" color="var(--color-risk-critical)" />
            <span className={`rounded-full px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-wider ${network.isLive
              ? 'bg-green-500/15 text-green-400 border border-green-500/30'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}>
              {network.isLive ? '● ML Backend Live' : '● Mock Data'}
            </span>
          </div>
          <label className="cursor-pointer rounded-lg border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-primary transition-all hover:bg-bg-card-hover">
            Upload Dataset (CSV/JSON)
            <input type="file" accept=".csv,.json" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {isLoading ? (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-border-subtle border-t-primary"></div>
            <div className="text-sm font-medium text-text-secondary">Processing dataset and running models...</div>
          </div>
        ) : (
          <>
            {/* Metrics Row — staggered entrance */}
            <ScrollReveal>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                <MetricCard label="Active Threats" value="6" subText="alerts requiring action" cardClass="metric-card-red" change="2" changeDir="up" />
                <MetricCard label="Funds at Risk" value="₹24.5L" subText="across all active cases" cardClass="metric-card-red" change="₹3.2L" changeDir="up" />
                <MetricCard label="Prevented Loss" value="₹18.7L" subText="frozen in last 72 hrs" cardClass="metric-card-green" change="₹5.1L" changeDir="up" />
                <MetricCard label="Detection Latency" value="4.2m" subText="avg time to first alert" cardClass="metric-card-amber" change="1.3m" changeDir="down" />
                <MetricCard label="Mule Networks" value="3" subText="active clusters tracked" cardClass="metric-card-violet" change="1" changeDir="up" />
                <MetricCard label="Network Nodes" value="24" subText="entities under monitoring" cardClass="metric-card-cyan" change="7" changeDir="up" />
              </div>
            </ScrollReveal>

            {/* System Health Bar */}
            <ScrollReveal delay={0.1}>
              <div className="mt-3 rounded-xl border border-border-subtle bg-bg-card px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-text-muted">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: 'var(--color-success)' }}></span> Infrastructure
                </div>
                <div className="flex items-center gap-5">
                  {healthMetrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[0.65rem]">
                      <span className="text-text-muted">{m.label}:</span>
                      <span className="font-bold" style={{ color: m.ok ? 'var(--color-success)' : 'var(--color-risk-medium)' }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Attack Chain */}
            <ScrollReveal className="mt-5">
              <SectionHeader title="Attack Chain — Operation Phantom Funnel" color="var(--color-flow)" />
              <AttackChain />
            </ScrollReveal>

            {/* Knowledge Graph + Alerts */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-10">
              <ScrollReveal className="lg:col-span-7">
                <SectionHeader title="Knowledge Graph" color="var(--color-primary)" />
                <GraphSVG nodes={nodes} edges={edges} onNodeClick={setSelectedNode} />
              </ScrollReveal>
              <ScrollReveal delay={0.15} className="lg:col-span-3">
                <SectionHeader title="Tiered Alert Stream" color="var(--color-risk-critical)" />
                <TieredAlertPanel maxAlerts={5} />
              </ScrollReveal>
            </div>

            {/* Investigation Reports + Side panels */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-10">
              <ScrollReveal className="lg:col-span-6">
                <SectionHeader title="Gemini Investigation Reports" color="var(--color-ai)" />
                <InvestigationReportCards />
              </ScrollReveal>
              <ScrollReveal delay={0.1} className="lg:col-span-2 space-y-4">
                <div>
                  <SectionHeader title="Risk Score" color="var(--color-ai)" />
                  <RiskDecomposition />
                </div>
                <div>
                  <SectionHeader title="Federated Cluster" color="var(--color-primary)" />
                  <FederatedStatus />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2} className="lg:col-span-2 space-y-4">
                <div>
                  <SectionHeader title="Quick Actions" color="var(--color-success)" />
                  <QuickActions />
                </div>
                <div>
                  <SectionHeader title="Threat Origins" color="var(--color-risk-high)" />
                  <div className="rounded-xl border border-border-subtle bg-bg-card p-3.5 space-y-2.5">
                    {threatRegions.map((r, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <span className="text-[0.62rem] text-text-secondary w-20 shrink-0">{r.region}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-bg-main overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${r.pct}%`, background: 'linear-gradient(to right, var(--color-risk-medium), var(--color-risk-critical))' }}></div>
                        </div>
                        <span className="text-[0.58rem] font-bold text-text-muted w-5 text-right">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Bottom row: Signals + Timeline + Entity Panel */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
              <ScrollReveal className="lg:col-span-4">
                <SectionHeader title="Model Signals" color="var(--color-ai)" />
                <ModelSignals />
              </ScrollReveal>
              <ScrollReveal delay={0.1} className="lg:col-span-4">
                <SectionHeader title="Timeline View" color="var(--color-flow)" />
                <Timeline />
              </ScrollReveal>
              <ScrollReveal delay={0.2} className="lg:col-span-4">
                <SectionHeader title="Entity Risk Panel" color="var(--color-risk-high)">
                  {selectedNode && (
                    <button onClick={() => setSelectedNode(null)} className="text-[0.65rem] text-text-muted transition-colors hover:text-text-primary">
                      Clear ✕
                    </button>
                  )}
                </SectionHeader>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                  {selectedNode ? (
                    <EntityPanel key={selectedNode.id} node={selectedNode} />
                  ) : (
                    nodes.filter(n => n.risk_score >= 0.65).sort((a, b) => b.risk_score - a.risk_score).slice(0, 4).map(node => (
                      <EntityPanel key={node.id} node={node} />
                    ))
                  )}
                </div>
              </ScrollReveal>
            </div>
          </>
        )}

        <Footer />
      </div>

    </div>
  );
};
