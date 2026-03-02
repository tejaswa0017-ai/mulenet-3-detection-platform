import React from 'react';
import { GraphNode } from '../types';
import { riskColor, riskLabel, NODE_STYLE } from '../utils/theme';

export const EntityPanel: React.FC<{ node: GraphNode }> = ({ node }) => {
  const style = NODE_STYLE[node.node_type] || NODE_STYLE["account"];
  const color = riskColor(node.risk_score);
  const label = riskLabel(node.risk_score);
  const pct = Math.floor(node.risk_score * 100);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="mb-2 rounded-xl border border-border-subtle bg-bg-card p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <div>
          <div className="text-[0.85rem] font-semibold text-text-primary">
            {style.icon} {node.label}
          </div>
          <div className="text-[0.62rem] uppercase tracking-widest text-text-muted">
            {node.node_type.replace('_', ' ')}
          </div>
        </div>
        <div 
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest"
          style={{ backgroundColor: hexToRgba(color, 0.15), color }}
        >
          <span className="animate-risk-pulse h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }}></span>
          {label}
        </div>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-sm bg-border-subtle">
        <div 
          className="h-full rounded-sm transition-all duration-1000 ease-in-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        {Object.entries(node.metadata).slice(0, 4).map(([k, v]) => (
          <div key={k} className="text-[0.7rem] text-text-muted">
            <div className="capitalize text-text-muted">{k.replace('_', ' ')}</div>
            <strong className="font-medium text-text-secondary">{v}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
