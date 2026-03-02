export const Theme = {
  BG_MAIN: "#020617",
  BG_PANEL: "#0F172A",
  BG_CARD: "#111827",
  BG_CARD_HOVER: "#1E293B",
  BORDER: "#334155",
  BORDER_SUBTLE: "#1E293B",

  PRIMARY: "#2563EB",
  AI: "#7C3AED",
  FLOW: "#06B6D4",
  SUCCESS: "#10B981",

  RISK_LOW: "#10B981",
  RISK_MEDIUM: "#F59E0B",
  RISK_HIGH: "#F97316",
  RISK_CRITICAL: "#EF4444",

  TEXT_PRIMARY: "#E5E7EB",
  TEXT_SECONDARY: "#94A3B8",
  TEXT_MUTED: "#64748B",

  ACCENT_VIOLET: "#8B5CF6",
  ACCENT_CYAN: "#06B6D4",
  ACCENT_ROSE: "#F43F5E",
  ACCENT_AMBER: "#F59E0B",
};

export function riskColor(score: number): string {
  if (score < 0.25) return Theme.RISK_LOW;
  if (score < 0.5) return Theme.RISK_MEDIUM;
  if (score < 0.75) return Theme.RISK_HIGH;
  return Theme.RISK_CRITICAL;
}

export function riskLabel(score: number): string {
  if (score < 0.25) return "LOW";
  if (score < 0.5) return "ELEVATED";
  if (score < 0.75) return "HIGH";
  return "CRITICAL";
}

export function riskIcon(score: number): string {
  if (score < 0.25) return "✅";
  if (score < 0.5) return "⚠️";
  if (score < 0.75) return "🔶";
  return "🔴";
}

export const NODE_STYLE: Record<string, any> = {
  account: { color: "#3B82F6", size: 20, icon: "🏦", border: "#60A5FA" },
  device: { color: "#94A3B8", size: 14, icon: "📱", border: "#CBD5E1" },
  ip: { color: "#94A3B8", size: 14, icon: "🌐", border: "#CBD5E1" },
  phishing_domain: { color: "#EF4444", size: 22, icon: "🎣", border: "#FCA5A5" },
  mule_account: { color: "#F97316", size: 24, icon: "🐴", border: "#FDBA74" },
  investigator_focus: { color: "#06B6D4", size: 26, icon: "🔍", border: "#67E8F9" },
  beneficiary: { color: "#8B5CF6", size: 18, icon: "💰", border: "#A78BFA" },
  shell_company: { color: "#F43F5E", size: 20, icon: "🏢", border: "#FB7185" },
};

export const EDGE_STYLE: Record<string, any> = {
  transaction: { color: "#06B6D4", width: 2, dashed: false },
  suspicious_transaction: { color: "#F97316", width: 3, dashed: false },
  attack_link: { color: "#EF4444", width: 2, dashed: true },
  device_link: { color: "#64748B", width: 1, dashed: true },
  rapid_transfer: { color: "#F59E0B", width: 3, dashed: false },
  layering: { color: "#8B5CF6", width: 2, dashed: true },
};
