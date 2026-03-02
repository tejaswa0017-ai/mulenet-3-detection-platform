import React from 'react';
import { Theme } from '../utils/theme';

export const Timeline: React.FC = () => {
  const events = [
    { time: "14:23:11", text: "Rapid layering detected — ₹4.2L across 3 mule accounts", color: Theme.RISK_CRITICAL },
    { time: "13:45:02", text: "Phishing domain flagged by threat intelligence feed", color: Theme.RISK_HIGH },
    { time: "12:18:44", text: "New mule account cluster identified via KYC pattern match", color: Theme.RISK_HIGH },
    { time: "11:02:17", text: "Velocity anomaly on Victim C account — 15 transactions in 4hrs", color: Theme.RISK_MEDIUM },
    { time: "09:31:55", text: "Shell company aggregation alert — Nova Global Trading FZE", color: Theme.RISK_CRITICAL },
    { time: "08:14:33", text: "Device fingerprint match across 3 mule accounts", color: Theme.RISK_MEDIUM },
    { time: "07:00:00", text: "System startup — all models loaded, graph initialized", color: Theme.SUCCESS },
  ];

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card px-5 py-4.5">
      <div className="mb-3.5 flex items-center gap-2 text-[0.78rem] font-semibold text-text-primary">
        📋 Event Timeline — Today
      </div>
      <div className="flex flex-col">
        {events.map((e, i) => (
          <div key={i} className="relative flex gap-3.5 border-b border-border-subtle py-2.5 last:border-none">
            <div className="relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: e.color }}>
              {i < events.length - 1 && (
                <div className="absolute left-1 top-2.5 h-[calc(100%+10px)] w-[1px] bg-border-subtle"></div>
              )}
            </div>
            <div>
              <div className="font-mono text-[0.65rem] tracking-wider text-text-muted">{e.time} IST</div>
              <div className="mt-1 text-[0.78rem] leading-relaxed text-text-secondary">{e.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
