import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Network, Brain, Scale, Zap, Lock, Target, BarChart3, Globe, ArrowRight, Database, Eye } from 'lucide-react';

const stats = [
  { value: '1.2B', label: 'Graph Edges', sub: 'tested at scale' },
  { value: '60K', label: 'TPS Ingestion', sub: 'real-time throughput' },
  { value: '<2%', label: 'False Positives', sub: 'production validated' },
  { value: '92%+', label: 'Detection Recall', sub: 'across all tiers' },
];

const capabilities = [
  { icon: <Network size={24} />, title: 'Federated Architecture', desc: 'Zero-trust data plane with NVIDIA FLARE federated learning. Each institution keeps data on-premises while contributing to collective intelligence.', color: '#2563EB', link: '/federated' },
  { icon: <Lock size={24} />, title: 'Privacy-Preserving Compute', desc: 'Homomorphic encryption (CKKS FHE), privacy-preserving Bloom filters, and differential privacy (ε=0.5) for cross-bank intelligence without raw data sharing.', color: '#7C3AED', link: '/entities' },
  { icon: <Target size={24} />, title: 'Adversarial Hardening', desc: 'Continuous red-team validation against 47+ evasion TTPs from basic smurfing to expert DeFi cross-chain bridges. Nightly CI/CD gates.', color: '#EF4444', link: '/redteam' },
  { icon: <Scale size={24} />, title: 'Multi-Jurisdiction Compliance', desc: 'Built-in GDPR, DPDP Act, GLBA, and UK MLR compliance with automated DPIA tracking, data retention policies, and SAR filing protocols.', color: '#10B981', link: '/compliance' },
];

const techStack = [
  { name: 'Apache Kafka', role: 'Event Streaming', icon: '📡' },
  { name: 'Apache Flink', role: 'Stream Processing', icon: '⚡' },
  { name: 'Neo4j Enterprise', role: 'Graph Database', icon: '🔗' },
  { name: 'NVIDIA FLARE', role: 'Federated Learning', icon: '🧠' },
  { name: 'PyTorch TGN', role: 'Temporal GNN', icon: '🔬' },
  { name: 'CKKS FHE', role: 'Homomorphic Encryption', icon: '🔐' },
];

const architectureLayers = [
  { label: 'Data Adapters', desc: 'ISO 20022, SWIFT MT103, STIX 2.1', icon: <Database size={16} />, color: '#3B82F6' },
  { label: 'Entity Resolution', desc: 'MinHash LSH + XGBoost Matching', icon: <Eye size={16} />, color: '#8B5CF6' },
  { label: 'Temporal GNN', desc: 'Memory-based anomaly scoring', icon: <Brain size={16} />, color: '#06B6D4' },
  { label: 'Risk Scoring', desc: 'Bayesian cost-optimized R=αA+βB+γC', icon: <BarChart3 size={16} />, color: '#F59E0B' },
  { label: 'Tiered Alerting', desc: '4-tier with validation gates', icon: <Zap size={16} />, color: '#EF4444' },
  { label: 'RAG Explainability', desc: '2-of-3 LLM ensemble + Rust verifier', icon: <Shield size={16} />, color: '#10B981' },
];

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-main font-sans text-text-primary">
      {/* Navbar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border-subtle bg-bg-panel/85 px-6 py-4 backdrop-blur-xl saturate-150">
        <div className="flex items-center gap-2.5 text-[1.2rem] font-bold tracking-tight text-text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-ai text-[0.9rem]">
            🕸️
          </div>
          Mule<span className="text-primary">Net</span>
          <span className="ml-1 rounded-md bg-primary/15 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest text-primary">v3.0</span>
        </div>
        <div className="flex gap-3">
          <a href="https://github.com" target="_blank" rel="noopener" className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-border hover:text-text-primary">
            Documentation
          </a>
          <Link to="/dashboard" className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            Launch Platform
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/8 blur-[120px]"></div>
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-ai/8 blur-[100px]"></div>

        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-[0.72rem] font-semibold text-primary">
              <Shield size={14} /> Enterprise-Grade • Production-Ready • Multi-Jurisdiction
            </div>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
              Cyber-Financial Mule <br />
              <span className="bg-gradient-to-r from-primary via-ai to-flow bg-clip-text text-transparent">Detection Platform</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-text-secondary">
              MuleNet 3.0 converges federated intelligence, privacy-preserving computation, temporal graph analytics, and regulatory compliance into a unified platform that detects coordinated criminal networks before the money disappears.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/dashboard" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                View Live Dashboard <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/federated" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-8 py-4 text-lg font-semibold text-text-primary transition-all hover:border-primary hover:bg-primary/5">
                Explore Architecture
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-y border-border-subtle bg-bg-panel/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-0 divide-x divide-border-subtle md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="px-6 py-6 text-center"
            >
              <div className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm font-semibold text-text-primary">{stat.label}</div>
              <div className="mt-0.5 text-[0.7rem] text-text-muted">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Capability Pillars */}
      <div className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Four Pillars of Enterprise Defense</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">Each pillar is production-proven and interoperates seamlessly to deliver a legally deployable, operationally resilient detection platform.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={cap.link}
                  className="group block h-full rounded-2xl border border-border-subtle bg-bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-2xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${cap.color}15`, color: cap.color }}>
                    {cap.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">{cap.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{cap.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[0.75rem] font-semibold transition-colors" style={{ color: cap.color }}>
                    Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Pipeline */}
      <div className="border-t border-border-subtle bg-bg-panel py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Analytical Pipeline</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">Six-layer processing pipeline from raw data ingestion to explainable alerts, powered by Temporal Graph Neural Networks and RAG-verified LLM narratives.</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {architectureLayers.map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-xl border border-border-subtle bg-bg-card p-5 transition-all hover:border-border"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm" style={{ backgroundColor: `${layer.color}15`, color: layer.color }}>
                  {layer.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[0.55rem] font-bold" style={{ backgroundColor: `${layer.color}20`, color: layer.color }}>{i + 1}</span>
                    <h3 className="text-sm font-bold text-white">{layer.label}</h3>
                  </div>
                  <p className="mt-1 text-[0.75rem] text-text-secondary">{layer.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Technology Stack</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">Built on battle-tested enterprise infrastructure, with graph ML and privacy-preserving computation at the core.</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center rounded-xl border border-border-subtle bg-bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-border hover:shadow-xl"
              >
                <div className="mb-3 text-2xl">{tech.icon}</div>
                <div className="text-sm font-bold text-white">{tech.name}</div>
                <div className="mt-1 text-[0.68rem] text-text-muted">{tech.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border-subtle bg-bg-panel py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Globe size={40} className="mx-auto mb-6 text-primary" />
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Deploy?</h2>
          <p className="mb-8 text-text-secondary">MuleNet 3.0 is designed for on-premises deployment within your institution's secure perimeter. Kubernetes-native with full air-gap support.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dashboard" className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              Launch Live Demo
            </Link>
            <Link to="/compliance" className="rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-text-primary transition-all hover:border-primary hover:bg-primary/5">
              Review Compliance
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border-subtle py-8 text-center text-sm text-text-muted">
        MuleNet 3.0 · Enterprise-Grade Cyber-Financial Mule Detection Platform
      </div>
    </div>
  );
};
