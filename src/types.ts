export interface GraphNode {
  id: string;
  node_type: string;
  label: string;
  risk_score: number;
  metadata: Record<string, any>;
  x: number;
  y: number;
  flagged?: boolean;
  frozen?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  edge_type: string;
  amount?: number;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface Alert {
  id: string;
  title: string;
  risk_score: number;
  summary: string;
  timestamp: string;
  entities: string[];
  alert_type: string;
  acknowledged?: boolean;
}

export interface Investigation {
  id: string;
  title: string;
  status: string;
  risk_score: number;
  entities: string[];
  ai_summary: string;
  created: string;
  findings: string[];
}

// ─── MuleNet 3.0 Types ───────────────────────────────

export type AlertTier = 'TIER_1_INFORMATIONAL' | 'TIER_2_MONITORING' | 'TIER_3_INVESTIGATION' | 'TIER_4_CRITICAL';

export interface TieredAlert {
  id: string;
  title: string;
  tier: AlertTier;
  risk_score: number;
  summary: string;
  timestamp: string;
  entities: string[];
  alert_type: string;
  sla_hours: number;
  sla_deadline: string;
  assigned_to: string | null;
  analyst_review: boolean;
  validation_passed?: boolean;
  validation_checks?: Record<string, boolean>;
  action: string;
}

export interface RiskScoreResult {
  account_id: string;
  account_label: string;
  risk_score: number;
  components: {
    tgn_anomaly: number;
    graph_proximity: number;
    cyber_ioc: number;
  };
  weights: { alpha: number; beta: number; gamma: number };
  confidence: number;
  recommendation: string;
}

export interface CostMatrix {
  false_positive: number;
  false_negative: number;
  true_positive: number;
  true_negative: number;
}

export interface EdgeNodeStatus {
  id: string;
  institution: string;
  region: string;
  status: 'online' | 'degraded' | 'offline';
  throughput_tps: number;
  latency_ms: number;
  memory_used_pct: number;
  cpu_used_pct: number;
  kafka_lag: number;
  neo4j_nodes: number;
  flink_jobs_running: number;
  last_heartbeat: string;
  federated_round: number;
  dp_epsilon_consumed: number;
}

export interface EntityResolutionMatch {
  id: string;
  entity_a: { id: string; name: string; dob: string; address: string; phone: string; email: string; bank: string };
  entity_b: { id: string; name: string; dob: string; address: string; phone: string; email: string; bank: string };
  confidence: number;
  action: 'AUTO_MERGE' | 'HUMAN_REVIEW' | 'NON_MATCH';
  features: {
    name_jaro_winkler: number;
    name_phonetic_match: boolean;
    dob_days_diff: number;
    address_token_set_ratio: number;
    phone_digit_overlap: number;
    email_exact_match: boolean;
    device_fingerprint_jaccard: number;
    ip_cidr_overlap: number;
  };
  reviewed?: boolean;
  merged?: boolean;
}

export type TTPSophistication = 'BASIC' | 'MODERATE' | 'ADVANCED' | 'EXPERT';

export interface TTPEntry {
  id: string;
  name: string;
  sophistication: TTPSophistication;
  description: string;
  mitre_id: string;
  detection_rate: number;
}

export interface RedTeamScenario {
  id: string;
  sophistication: TTPSophistication;
  ttps_applied: string[];
  network_size: number;
  detected: boolean;
  detection_latency_seconds: number;
  risk_score: number;
  false_negatives: number;
  timestamp: string;
}

export interface RedTeamKPI {
  level: TTPSophistication;
  target: number;
  achieved: number;
  passed: boolean;
}

export interface ComplianceJurisdiction {
  id: string;
  region: string;
  framework: string;
  lawful_basis: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  data_retention_years: number;
  cross_border_mechanism: string;
  dpia_status: 'completed' | 'in_progress' | 'not_started';
  rights: string[];
  special_notes: string;
}

export interface FederatedRound {
  round: number;
  timestamp: string;
  participants: number;
  dp_epsilon: number;
  model_improvement_pct: number;
  aggregation_method: string;
}

export type TransactionPattern = 'Fan-out' | 'Fan-in' | 'Structuring' | 'Smurfing' | 'Layering' | 'Rapid Move' | 'Normal';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Transaction {
  id: string;
  timestamp: string;
  counterparty: string;
  counterparty_initials: string;
  amount: number;
  currency: string;
  risk_score: number;
  risk_level: RiskLevel;
  pattern: TransactionPattern;
  flagged: boolean;
}

export interface CaseFile {
  id: string;
  title: string;
  status: 'investigating' | 'escalated' | 'resolved' | 'dismissed';
  severity: 'critical' | 'high' | 'medium' | 'low';
  assigned_to: string;
  created: string;
  entities_count: number;
  transactions_count: number;
  summary: string;
}
