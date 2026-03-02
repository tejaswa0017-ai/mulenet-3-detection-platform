import React from 'react';
import { Investigation } from '../types';
import { riskColor, riskLabel, Theme } from '../utils/theme';
import Markdown from 'react-markdown';

export const InvestigationReport: React.FC<{ inv: Investigation }> = ({ inv }) => {
  const color = riskColor(inv.risk_score);
  const label = riskLabel(inv.risk_score);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const colors = [Theme.RISK_CRITICAL, Theme.RISK_HIGH, Theme.RISK_HIGH, Theme.ACCENT_ROSE, Theme.AI, Theme.RISK_CRITICAL, Theme.ACCENT_AMBER];

  return (
    <div className="overflow-hidden rounded-[18px] border border-border-subtle bg-bg-card">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4.5">
        <div>
          <div className="text-[0.88rem] font-bold text-text-primary">🧠 {inv.title}</div>
          <div className="mt-1 text-[0.68rem] text-text-muted">
            Case {inv.id} · Opened {inv.created.split('T')[0]}
          </div>
        </div>
        <div 
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest"
          style={{ backgroundColor: hexToRgba(color, 0.15), color }}
        >
          <span className="animate-risk-pulse h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }}></span>
          {label} · {(inv.risk_score * 100).toFixed(0)}%
        </div>
      </div>
      <div className="px-5 py-4.5 text-[0.82rem] leading-relaxed text-text-secondary">
        <div className="prose prose-sm prose-invert max-w-none">
          <Markdown>{inv.ai_summary}</Markdown>
        </div>
      </div>
      <div className="border-t border-border-subtle px-5 py-4.5">
        <div className="mb-2.5 text-[0.78rem] font-semibold text-text-primary">
          🔑 Key Findings
        </div>
        {inv.findings.map((f, i) => {
          const c = colors[i % colors.length];
          return (
            <div key={i} className="flex items-start gap-2.5 border-b border-border-subtle py-2 text-[0.8rem] leading-relaxed text-text-secondary last:border-none">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: c }}></div>
              <div>{f}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
