import React from 'react';
import { Theme } from '../utils/theme';

export const QuickActions: React.FC = () => {
  return (
    <div className="rounded-[14px] border border-border-subtle bg-bg-card px-5 py-4.5">
      <div className="mb-3.5 text-[0.82rem] font-semibold text-text-primary">
        ⚡ Recommended Actions
      </div>
      <div className="flex flex-col gap-2">
        <div className="rounded-[10px] border border-risk-critical/20 bg-risk-critical/10 px-3.5 py-3 text-[0.8rem] text-text-secondary">
          🔴 <strong className="text-risk-critical">FREEZE</strong> — All identified mule accounts (8 accounts)
        </div>
        <div className="rounded-[10px] border border-risk-high/20 bg-risk-high/10 px-3.5 py-3 text-[0.8rem] text-text-secondary">
          🟠 <strong className="text-risk-high">ALERT</strong> — HDFC/SBI fraud teams for compromised accounts
        </div>
        <div className="rounded-[10px] border border-risk-medium/20 bg-risk-medium/10 px-3.5 py-3 text-[0.8rem] text-text-secondary">
          🟡 <strong className="text-risk-medium">TAKEDOWN</strong> — Domain: secure-login-verify.com
        </div>
        <div className="rounded-[10px] border border-ai/20 bg-ai/10 px-3.5 py-3 text-[0.8rem] text-text-secondary">
          🟣 <strong className="text-ai">FILE SAR</strong> — Nova Global Trading FZE (UAE jurisdiction)
        </div>
        <div className="rounded-[10px] border border-flow/20 bg-flow/10 px-3.5 py-3 text-[0.8rem] text-text-secondary">
          🔵 <strong className="text-flow">CROSS-REF</strong> — Device fingerprints vs known mule operator DB
        </div>
      </div>
    </div>
  );
};
