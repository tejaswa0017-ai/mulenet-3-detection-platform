import React from 'react';
import { Theme } from '../utils/theme';
import { motion } from 'motion/react';
import { ShieldAlert, Fingerprint, Key, Zap, Network, Repeat, Building2, ArrowRight } from 'lucide-react';

export const AttackChain: React.FC = () => {
  const stages = [
    { 
      icon: <ShieldAlert size={18} />, 
      label: "Phishing Domain", 
      color: Theme.RISK_CRITICAL, 
      bg: "rgba(239,68,68,0.1)", 
      desc: "Initial vector via SMS",
      time: "T-00:00:00",
      technique: "T1566.002",
      status: "Detected"
    },
    { 
      icon: <Fingerprint size={18} />, 
      label: "Credential Harvest", 
      color: Theme.RISK_HIGH, 
      bg: "rgba(249,115,22,0.1)", 
      desc: "Fake banking portal login",
      time: "T+00:04:12",
      technique: "T1056.002",
      status: "Compromised"
    },
    { 
      icon: <Key size={18} />, 
      label: "Account Access", 
      color: Theme.RISK_HIGH, 
      bg: "rgba(249,115,22,0.1)", 
      desc: "Session token hijacked",
      time: "T+00:05:30",
      technique: "T1531",
      status: "Active"
    },
    { 
      icon: <Zap size={18} />, 
      label: "Rapid Extraction", 
      color: Theme.ACCENT_AMBER, 
      bg: "rgba(245,158,11,0.1)", 
      desc: "IMPS transfer initiated",
      time: "T+00:06:15",
      technique: "T1567",
      status: "In Progress"
    },
    { 
      icon: <Network size={18} />, 
      label: "Mule Layer 1", 
      color: Theme.RISK_HIGH, 
      bg: "rgba(249,115,22,0.1)", 
      desc: "Split into 5 accounts",
      time: "T+00:12:00",
      technique: "T1565.002",
      status: "Tracking"
    },
    { 
      icon: <Repeat size={18} />, 
      label: "Mule Layer 2", 
      color: Theme.AI, 
      bg: "rgba(139,92,246,0.1)", 
      desc: "Cross-border routing",
      time: "T+00:45:00",
      technique: "T1090.003",
      status: "Analyzing"
    },
    { 
      icon: <Building2 size={18} />, 
      label: "Shell Company", 
      color: Theme.ACCENT_ROSE, 
      bg: "rgba(244,63,94,0.1)", 
      desc: "Final aggregation point",
      time: "T+04:30:00",
      technique: "T1483",
      status: "Identified"
    },
  ];

  return (
    <div className="relative w-full overflow-x-auto pb-4 pt-2">
      <div className="flex min-w-max items-center gap-3 px-1">
        {stages.map((s, i) => (
          <React.Fragment key={i}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative flex w-[220px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-bg-card shadow-lg transition-all hover:border-border-hover hover:shadow-xl"
            >
              {/* Top Accent Line */}
              <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: s.color }}></div>
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-border-subtle p-3" style={{ backgroundColor: s.bg }}>
                <div 
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm"
                  style={{ backgroundColor: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}
                >
                  {s.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">{s.label}</span>
                  <span className="font-mono text-[0.65rem] text-text-muted">{s.time}</span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-2 p-3">
                <p className="text-[0.7rem] text-text-secondary h-8">{s.desc}</p>
                
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 rounded bg-bg-main px-1.5 py-0.5 border border-border-subtle">
                    <span className="text-[0.55rem] font-semibold text-text-muted uppercase tracking-wider">MITRE:</span>
                    <span className="font-mono text-[0.6rem] text-primary">{s.technique}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }}></div>
                    <span className="text-[0.6rem] font-medium text-text-secondary">{s.status}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Connecting Arrow */}
            {i < stages.length - 1 && (
              <div className="relative flex w-8 shrink-0 items-center justify-center">
                <div className="absolute h-[2px] w-full bg-border-subtle"></div>
                <motion.div 
                  className="absolute h-[2px] w-full origin-left"
                  style={{ background: `linear-gradient(90deg, ${s.color}, ${stages[i+1].color})` }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                />
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="z-10 flex h-4 w-4 items-center justify-center rounded-full bg-bg-main border border-border shadow-sm"
                >
                  <ArrowRight size={10} className="text-text-muted" />
                </motion.div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
