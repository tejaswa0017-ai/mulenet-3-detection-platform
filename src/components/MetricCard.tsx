import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subText: string;
  cardClass: string;
  change?: string;
  changeDir?: 'up' | 'down';
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subText, cardClass, change, changeDir }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border-subtle bg-bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-2xl ${cardClass}`}>
      <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-widest text-text-muted">
        {label}
      </div>
      <div className="text-3xl font-extrabold leading-none tracking-tight text-text-primary">
        {value}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[0.72rem] text-text-muted">
        {change && (
          <span className={changeDir === 'up' ? 'text-risk-critical' : 'text-success'}>
            {changeDir === 'up' ? '↑' : '↓'} {change}
          </span>
        )}
        {change && <span>·</span>}
        <span>{subText}</span>
      </div>
    </div>
  );
};
