import React from 'react';
import { Theme } from '../utils/theme';

export const ModelSignals: React.FC = () => {
  const signals = [
    { name: "GNN Cluster Score", value: 0.91, color: Theme.RISK_CRITICAL },
    { name: "Velocity Anomaly", value: 0.78, color: Theme.RISK_HIGH },
    { name: "KYC Pattern Match", value: 0.85, color: Theme.RISK_CRITICAL },
    { name: "Device Correlation", value: 0.53, color: Theme.RISK_MEDIUM },
    { name: "Temporal Pattern", value: 0.72, color: Theme.RISK_HIGH },
    { name: "Network Centrality", value: 0.88, color: Theme.RISK_CRITICAL },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      {signals.map((sig, i) => {
        const pct = Math.floor(sig.value * 100);
        return (
          <div key={i} className="rounded-xl border border-border-subtle bg-bg-card px-4 py-3.5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[0.78rem] font-semibold text-text-primary">{sig.name}</div>
              <div className="text-[0.9rem] font-bold" style={{ color: sig.color }}>{sig.value.toFixed(2)}</div>
            </div>
            <div className="h-[3px] overflow-hidden rounded-sm bg-border-subtle">
              <div className="h-full rounded-sm transition-all duration-1000 ease-in-out" style={{ width: `${pct}%`, backgroundColor: sig.color }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
