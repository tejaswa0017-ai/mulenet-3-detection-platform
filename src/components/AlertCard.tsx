import React from 'react';
import { Alert } from '../types';
import { riskColor, riskLabel } from '../utils/theme';

export const AlertCard: React.FC<{ alert: Alert }> = ({ alert }) => {
  const color = riskColor(alert.risk_score);
  const label = riskLabel(alert.risk_score);
  
  // Convert hex to rgba for background
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const badgeBg = hexToRgba(color, 0.15);
  const ts = alert.timestamp.includes('T') ? alert.timestamp.split('T')[1].substring(0, 5) : alert.timestamp;

  return (
    <div className="relative mb-2 overflow-hidden rounded-xl border border-border-subtle bg-bg-card p-4 transition-all duration-300 hover:border-border hover:bg-bg-card-hover">
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ backgroundColor: color }}></div>
      <div className="mb-2 flex items-start justify-between pl-2.5">
        <div className="text-[0.88rem] font-semibold leading-snug text-text-primary">
          {alert.title}
        </div>
        <div 
          className="whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest"
          style={{ backgroundColor: badgeBg, color }}
        >
          {label} · {(alert.risk_score * 100).toFixed(0)}%
        </div>
      </div>
      <div className="pl-2.5 text-[0.78rem] leading-relaxed text-text-secondary">
        {alert.summary}
      </div>
      <div className="mt-2.5 flex items-center justify-between pl-2.5 text-[0.68rem] text-text-muted">
        <div className="flex flex-wrap gap-1">
          {alert.entities.slice(0, 3).map(entity => (
            <span key={entity} className="rounded-full border border-primary/25 bg-primary/15 px-2 py-0.5 text-[0.62rem] text-primary">
              {entity}
            </span>
          ))}
        </div>
        <span>{ts} IST</span>
      </div>
    </div>
  );
};
