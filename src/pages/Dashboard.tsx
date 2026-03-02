import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MetricCard } from '../components/MetricCard';
import { AttackChain } from '../components/AttackChain';
import { GraphSVG } from '../components/GraphSVG';
import { InvestigationReport } from '../components/InvestigationReport';
import { EntityPanel } from '../components/EntityPanel';
import { ModelSignals } from '../components/ModelSignals';
import { Timeline } from '../components/Timeline';
import { QuickActions } from '../components/QuickActions';
import { AiraAssistant } from '../components/AiraAssistant';
import { TieredAlertPanel } from '../components/TieredAlertPanel';
import { RiskDecomposition } from '../components/RiskDecomposition';
import { FederatedStatus } from '../components/FederatedStatus';
import { DataGenerator } from '../data';
import { GraphNode, GraphEdge, Alert, Investigation } from '../types';

export const Dashboard: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      const { nodes: n, edges: e } = DataGenerator.generateNetwork();
      setNodes(n);
      setEdges(e);
      setAlerts(DataGenerator.generateAlerts());
      setInvestigation(DataGenerator.generateInvestigation());
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      // Simulate processing the uploaded dataset
      setTimeout(() => {
        const { nodes: n, edges: e } = DataGenerator.generateNetwork();
        setNodes(n);
        setEdges(e);
        setAlerts(DataGenerator.generateAlerts());
        setInvestigation(DataGenerator.generateInvestigation());
        setSelectedNode(null);
        setIsLoading(false);
      }, 2000);
    }
  };

  const SectionHeader = ({ title, color, children }: { title: string, color: string, children?: React.ReactNode }) => (
    <div className="mb-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="h-0.5 w-6 rounded-sm" style={{ backgroundColor: color }}></div>
        <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted">{title}</div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main p-4 text-text-primary relative">
      <Navbar />

      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex items-center justify-between">
          <SectionHeader title="System Status — Live" color="var(--color-risk-critical)" />
          <div className="flex items-center gap-4">
            <label className="cursor-pointer rounded-lg border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-primary transition-all hover:bg-bg-card-hover">
              Upload Dataset (CSV/JSON)
              <input type="file" accept=".csv,.json" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-border-subtle border-t-primary"></div>
            <div className="text-sm font-medium text-text-secondary">Processing dataset and running models...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <MetricCard label="Active Threats" value="6" subText="alerts requiring action" cardClass="metric-card-red" change="2" changeDir="up" />
              <MetricCard label="Funds at Risk" value="₹24.5L" subText="across all active cases" cardClass="metric-card-red" change="₹3.2L" changeDir="up" />
              <MetricCard label="Prevented Loss" value="₹18.7L" subText="frozen in last 72 hrs" cardClass="metric-card-green" change="₹5.1L" changeDir="up" />
              <MetricCard label="Detection Latency" value="4.2m" subText="avg time to first alert" cardClass="metric-card-amber" change="1.3m" changeDir="down" />
              <MetricCard label="Mule Networks" value="3" subText="active clusters tracked" cardClass="metric-card-violet" change="1" changeDir="up" />
              <MetricCard label="Network Nodes" value="24" subText="entities under monitoring" cardClass="metric-card-cyan" change="7" changeDir="up" />
            </div>

            <div className="h-6"></div>

            <SectionHeader title="Attack Chain — Operation Phantom Funnel" color="var(--color-flow)" />
            <AttackChain />

            <div className="h-6"></div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
              <div className="lg:col-span-7">
                <SectionHeader title="Knowledge Graph" color="var(--color-primary)" />
                <GraphSVG nodes={nodes} edges={edges} onNodeClick={setSelectedNode} />
              </div>
              <div className="lg:col-span-3">
                <SectionHeader title="Tiered Alert Stream" color="var(--color-risk-critical)" />
                <TieredAlertPanel maxAlerts={5} />
              </div>
            </div>

            <div className="h-6"></div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
              <div className="lg:col-span-5">
                <SectionHeader title="Gemini Investigation Report" color="var(--color-ai)" />
                {investigation && <InvestigationReport inv={investigation} />}
              </div>
              <div className="lg:col-span-3">
                <SectionHeader title="Entity Risk Panel" color="var(--color-risk-high)">
                  {selectedNode && (
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-[0.65rem] text-text-muted transition-colors hover:text-text-primary"
                    >
                      Clear Selection ✕
                    </button>
                  )}
                </SectionHeader>
                <div className="flex flex-col gap-2">
                  {selectedNode ? (
                    <EntityPanel key={selectedNode.id} node={selectedNode} />
                  ) : (
                    nodes.filter(n => n.risk_score >= 0.65).sort((a, b) => b.risk_score - a.risk_score).slice(0, 6).map(node => (
                      <EntityPanel key={node.id} node={node} />
                    ))
                  )}
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <SectionHeader title="Risk Score" color="var(--color-ai)" />
                  <RiskDecomposition />
                </div>
                <div>
                  <SectionHeader title="Federated Cluster" color="var(--color-primary)" />
                  <FederatedStatus />
                </div>
              </div>
            </div>

            <div className="h-6"></div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
              <div className="lg:col-span-4">
                <SectionHeader title="Model Signals" color="var(--color-ai)" />
                <ModelSignals />
              </div>
              <div className="lg:col-span-4">
                <SectionHeader title="Timeline View" color="var(--color-flow)" />
                <Timeline />
              </div>
              <div className="lg:col-span-2">
                <SectionHeader title="Quick Actions" color="var(--color-success)" />
                <QuickActions />
              </div>
            </div>
          </>
        )}

        <Footer />
      </div>

      <AiraAssistant />
    </div>
  );
};
