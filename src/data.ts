import { GraphNode, GraphEdge, Alert, Investigation, TieredAlert, AlertTier, RiskScoreResult, EdgeNodeStatus, EntityResolutionMatch, TTPEntry, RedTeamScenario, RedTeamKPI, ComplianceJurisdiction, FederatedRound, Transaction, TransactionPattern, RiskLevel, CaseFile } from './types';

export class DataGenerator {
  static DEVICES = ["iPhone-A3F2", "Android-7B1C", "Desktop-Win-9E4D", "MacBook-2F8A", "Pixel-6C3B"];
  static IPS = ["185.234.72.x", "91.215.44.x", "45.133.1.x", "193.142.146.x", "5.188.62.x", "195.54.160.x"];

  static generateNetwork(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    let seed = 42;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    const randInt = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;
    const randChoice = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

    nodes.push({
      id: "phish_1", node_type: "phishing_domain",
      label: "secure-login-verify.com", risk_score: 0.95,
      metadata: { registered: "2025-01-15", registrar: "Namecheap", country: "RU" },
      x: 600, y: 100
    });

    const compromised: string[] = [];
    for (let i = 0; i < 4; i++) {
      const nid = `comp_${i}`;
      compromised.push(nid);
      nodes.push({
        id: nid, node_type: "account",
        label: `Victim ${String.fromCharCode(65 + i)} (****${randInt(1000, 9999)})`,
        risk_score: 0.5 + random() * 0.35,
        metadata: { bank: randChoice(["HDFC", "SBI", "ICICI", "Axis"]), compromised_date: `2025-02-${randInt(10, 25)}` },
        x: 200 + i * 260, y: 300
      });
      edges.push({
        source: "phish_1", target: nid, edge_type: "attack_link",
        metadata: { method: "credential_harvest" }
      });
    }

    const mules_l1: string[] = [];
    for (let i = 0; i < 5; i++) {
      const nid = `mule_l1_${i}`;
      mules_l1.push(nid);
      nodes.push({
        id: nid, node_type: "mule_account",
        label: `Mule L1-${String.fromCharCode(65 + i)} (****${randInt(1000, 9999)})`,
        risk_score: 0.65 + random() * 0.27,
        metadata: { account_age_days: randInt(5, 45), kyc_status: randChoice(["minimal", "unverified"]), total_received: `₹${randInt(80000, 500000).toLocaleString()}` },
        x: 100 + i * 250, y: 550, flagged: true
      });
      const numComps = randInt(1, 2);
      for (let j = 0; j < numComps; j++) {
        const comp = randChoice(compromised);
        edges.push({
          source: comp, target: nid,
          edge_type: "suspicious_transaction",
          amount: randInt(15000, 120000),
          timestamp: `2025-02-${randInt(20, 28)}T${randInt(0, 23).toString().padStart(2, '0')}:${randInt(0, 59).toString().padStart(2, '0')}`,
          metadata: { speed: "rapid", pattern: "round_amount" }
        });
      }
    }

    const mules_l2: string[] = [];
    for (let i = 0; i < 3; i++) {
      const nid = `mule_l2_${i}`;
      mules_l2.push(nid);
      nodes.push({
        id: nid, node_type: "mule_account",
        label: `Mule L2-${String.fromCharCode(65 + i)} (****${randInt(1000, 9999)})`,
        risk_score: 0.7 + random() * 0.25,
        metadata: { account_age_days: randInt(2, 20), kyc_status: "unverified", total_received: `₹${randInt(200000, 800000).toLocaleString()}` },
        x: 300 + i * 300, y: 800, flagged: true
      });
      const numM1s = randInt(1, 3);
      for (let j = 0; j < numM1s; j++) {
        const m1 = randChoice(mules_l1);
        edges.push({
          source: m1, target: nid,
          edge_type: "rapid_transfer", amount: randInt(40000, 250000),
          timestamp: `2025-02-${randInt(20, 28)}T${randInt(0, 23).toString().padStart(2, '0')}:${randInt(0, 59).toString().padStart(2, '0')}`,
          metadata: { pattern: "layering", time_gap_min: randInt(2, 30) }
        });
      }
    }

    nodes.push({
      id: "shell_1", node_type: "shell_company",
      label: "Nova Global Trading FZE",
      risk_score: 0.88,
      metadata: { jurisdiction: "UAE", incorporated: "2024-11", director: "Unknown", total_received: "₹24,50,000" },
      x: 600, y: 1050
    });
    for (const m2 of mules_l2) {
      edges.push({
        source: m2, target: "shell_1", edge_type: "layering",
        amount: randInt(100000, 400000),
        metadata: { method: "RTGS", pattern: "aggregation" }
      });
    }

    for (let i = 0; i < 3; i++) {
      const comp = compromised[i];
      const did = `dev_${i}`;
      nodes.push({
        id: did, node_type: "device",
        label: DataGenerator.DEVICES[i],
        risk_score: 0.2 + random() * 0.3,
        x: 100 + i * 300, y: 150, metadata: {}
      });
      edges.push({ source: did, target: comp, edge_type: "device_link" });
    }

    for (let i = 0; i < 3; i++) {
      const mule = mules_l1[i];
      const iid = `ip_${i}`;
      nodes.push({
        id: iid, node_type: "ip",
        label: DataGenerator.IPS[i],
        risk_score: 0.3 + random() * 0.4,
        x: 50 + i * 320, y: 450, metadata: {}
      });
      edges.push({ source: iid, target: mule, edge_type: "device_link" });
    }

    nodes.push({
      id: "focus_1", node_type: "investigator_focus",
      label: "🔍 Active Investigation",
      risk_score: 0.82,
      metadata: { investigator: "Agent Sharma", case_id: "MN-2025-0847" },
      x: 600, y: 680
    });

    return { nodes, edges };
  }

  static generateAlerts(): Alert[] {
    return [
      { id: "ALT-001", title: "Rapid Fund Layering Detected", risk_score: 0.91, summary: "₹4.2L moved through 3 mule accounts in under 18 minutes. Pattern consistent with organized layering operation.", timestamp: "2025-02-27T14:23:11", entities: ["mule_l1_0", "mule_l1_2", "mule_l2_1"], alert_type: "layering" },
      { id: "ALT-002", title: "New Phishing Domain Active", risk_score: 0.87, summary: "Domain secure-login-verify.com registered 12 days ago, now sending credential harvest emails targeting HDFC customers.", timestamp: "2025-02-27T13:45:02", entities: ["phish_1"], alert_type: "phishing" },
      { id: "ALT-003", title: "Mule Network Expansion", risk_score: 0.78, summary: "3 new accounts with matching KYC patterns opened across 2 banks. Likely new mule recruitment wave.", timestamp: "2025-02-27T12:18:44", entities: ["mule_l1_3", "mule_l1_4"], alert_type: "network" },
      { id: "ALT-004", title: "Unusual Velocity — Account Comp_2", risk_score: 0.72, summary: "15 outbound transactions in 4 hours from compromised account, each just below ₹50K reporting threshold.", timestamp: "2025-02-27T11:02:17", entities: ["comp_2"], alert_type: "velocity" },
      { id: "ALT-005", title: "Shell Company Fund Aggregation", risk_score: 0.85, summary: "Nova Global Trading FZE received ₹24.5L from 3 distinct mule chains. Entity incorporated 3 months ago with no visible operations.", timestamp: "2025-02-27T09:31:55", entities: ["shell_1", "mule_l2_0", "mule_l2_1"], alert_type: "aggregation" },
      { id: "ALT-006", title: "Device Fingerprint Anomaly", risk_score: 0.53, summary: "Same device fingerprint used across 3 distinct mule accounts. Suggests single operator controlling multiple mules.", timestamp: "2025-02-27T08:14:33", entities: ["dev_0", "mule_l1_0", "mule_l1_1"], alert_type: "device" },
    ];
  }

  static generateInvestigation(): Investigation {
    return {
      id: "INV-2025-0847",
      title: "Operation Phantom Funnel",
      status: "active",
      risk_score: 0.89,
      entities: ["phish_1", "comp_0", "comp_1", "mule_l1_0", "mule_l1_2", "mule_l2_1", "shell_1"],
      created: "2025-02-26T09:00:00",
      ai_summary: `**Gemini Analysis — Operation Phantom Funnel**\n\nThis investigation tracks a coordinated financial crime operation with the following structure:\n\n**Origin:** A phishing campaign targeting HDFC and SBI customers via the domain \`secure-login-verify.com\` (registered 2025-01-15, Namecheap, Russian registrar).\n\n**Stage 1 — Credential Harvest:** At least 4 customer accounts were compromised through credential phishing. Victims received SMS/email lures mimicking bank security alerts.\n\n**Stage 2 — Rapid Extraction:** Funds were immediately transferred from compromised accounts to Layer-1 mule accounts. Transactions were deliberately structured below ₹50K to avoid automated reporting thresholds.\n\n**Stage 3 — Layering:** Layer-1 mules forwarded funds to Layer-2 mules within 2–30 minutes. The speed and pattern suggest automated or coordinated scheduling.\n\n**Stage 4 — Aggregation:** All fund streams converge at **Nova Global Trading FZE**, a shell company in UAE incorporated November 2024 with no visible commercial operations.\n\n**Key Signals:**\n- 87% of mule accounts were opened within the last 45 days\n- KYC documents across mule accounts show pattern similarities (likely synthetic/forged)\n- Same device fingerprint detected across 3 mule accounts\n- Total estimated exposure: **₹24,50,000**\n\n**Recommended Actions:**\n1. Immediate freeze on all identified mule accounts\n2. Alert HDFC/SBI fraud teams for compromised account remediation\n3. Domain takedown request for secure-login-verify.com\n4. SAR filing for Nova Global Trading FZE\n5. Cross-reference device fingerprints with known mule operator database`,
      findings: [
        "Phishing domain active for 43 days before detection",
        "4 compromised customer accounts identified",
        "5 Layer-1 + 3 Layer-2 mule accounts mapped",
        "Shell company in UAE as final aggregation point",
        "Single device fingerprint links 3 mule accounts",
        "Total funds at risk: ₹24,50,000",
        "Estimated 18-minute average layering cycle time"
      ]
    };
  }

  // ─── MuleNet 3.0 Data Generators ───────────────────────

  static generateTieredAlerts(): TieredAlert[] {
    return [
      { id: "TA-001", title: "Critical: Multi-Layer Mule Network — Immediate Freeze Required", tier: "TIER_4_CRITICAL", risk_score: 0.96, summary: "Highly coordinated 8-account mule network detected with ₹18.7L in transit. 5 validation gates passed. Automated freeze initiated.", timestamp: "2025-02-27T14:23:11", entities: ["mule_l1_0", "mule_l1_2", "mule_l2_1"], alert_type: "network", sla_hours: 4, sla_deadline: "2025-02-27T18:23:11", assigned_to: "Sr. Analyst Kapoor", analyst_review: true, validation_passed: true, validation_checks: { minimum_evidence_threshold: true, cross_reference_confirmed_cases: true, behavioral_consistency: true, false_positive_pattern_match: true, regulatory_threshold_met: true }, action: "IMMEDIATE_ACTION" },
      { id: "TA-002", title: "Critical: Synthetic Identity Cluster Detected", tier: "TIER_4_CRITICAL", risk_score: 0.94, summary: "4 accounts opened with synthetic identities sharing similar KYC patterns. All opened within 7-day window.", timestamp: "2025-02-27T13:10:05", entities: ["mule_l1_3", "mule_l1_4"], alert_type: "identity", sla_hours: 4, sla_deadline: "2025-02-27T17:10:05", assigned_to: "Sr. Analyst Mehta", analyst_review: true, validation_passed: false, validation_checks: { minimum_evidence_threshold: true, cross_reference_confirmed_cases: false, behavioral_consistency: true, false_positive_pattern_match: true, regulatory_threshold_met: true }, action: "IMMEDIATE_ACTION" },
      { id: "TA-003", title: "Investigation: Unusual Cross-Border Transfer Pattern", tier: "TIER_3_INVESTIGATION", risk_score: 0.82, summary: "Account shows rapid cross-border transfers to 3 jurisdictions with no prior international activity. Total ₹6.2L in 48 hours.", timestamp: "2025-02-27T12:18:44", entities: ["comp_1"], alert_type: "cross_border", sla_hours: 48, sla_deadline: "2025-03-01T12:18:44", assigned_to: "Analyst Sharma", analyst_review: true, action: "ANALYST_REVIEW" },
      { id: "TA-004", title: "Investigation: Dormant Account Reactivation", tier: "TIER_3_INVESTIGATION", risk_score: 0.78, summary: "Account dormant for 14 months suddenly received ₹3.8L in 6 transactions from unknown sources. KYC last updated 2 years ago.", timestamp: "2025-02-27T11:45:22", entities: ["comp_2"], alert_type: "dormant", sla_hours: 48, sla_deadline: "2025-03-01T11:45:22", assigned_to: "Analyst Patel", analyst_review: true, action: "ANALYST_REVIEW" },
      { id: "TA-005", title: "Monitoring: Elevated Transaction Velocity", tier: "TIER_2_MONITORING", risk_score: 0.62, summary: "Account transaction frequency increased 4x compared to 90-day baseline. Monitoring for further escalation.", timestamp: "2025-02-27T10:30:00", entities: ["comp_0"], alert_type: "velocity", sla_hours: 720, sla_deadline: "2025-03-29T10:30:00", assigned_to: null, analyst_review: false, action: "ENHANCED_MONITORING" },
      { id: "TA-006", title: "Monitoring: New Device from High-Risk Geo", tier: "TIER_2_MONITORING", risk_score: 0.58, summary: "Login from new device geolocated to a jurisdiction flagged for elevated money laundering risk.", timestamp: "2025-02-27T09:15:33", entities: ["dev_0"], alert_type: "device", sla_hours: 720, sla_deadline: "2025-03-29T09:15:33", assigned_to: null, analyst_review: false, action: "ENHANCED_MONITORING" },
      { id: "TA-007", title: "Monitoring: Slight Threshold Proximity", tier: "TIER_2_MONITORING", risk_score: 0.54, summary: "Multiple transactions structured just below ₹50K reporting threshold. 3 occurrences in 24 hours.", timestamp: "2025-02-27T08:40:11", entities: ["mule_l1_1"], alert_type: "structuring", sla_hours: 720, sla_deadline: "2025-03-29T08:40:11", assigned_to: null, analyst_review: false, action: "ENHANCED_MONITORING" },
      { id: "TA-008", title: "Info: Minor Address Discrepancy", tier: "TIER_1_INFORMATIONAL", risk_score: 0.38, summary: "KYC address does not match utility bill address. Likely a recent move. No other risk indicators.", timestamp: "2025-02-27T07:20:00", entities: ["comp_3"], alert_type: "kyc", sla_hours: 2160, sla_deadline: "2025-06-27T07:20:00", assigned_to: null, analyst_review: false, action: "LOG_ONLY" },
      { id: "TA-009", title: "Info: Low-Risk IP Range Flagged", tier: "TIER_1_INFORMATIONAL", risk_score: 0.33, summary: "Login from shared corporate IP range. Previously seen across 120+ accounts with no correlation to fraud.", timestamp: "2025-02-27T06:45:00", entities: ["ip_2"], alert_type: "ip", sla_hours: 2160, sla_deadline: "2025-06-27T06:45:00", assigned_to: null, analyst_review: false, action: "LOG_ONLY" },
    ];
  }

  static generateRiskScores(): RiskScoreResult[] {
    return [
      { account_id: "mule_l1_0", account_label: "Mule L1-A (****4721)", risk_score: 0.91, components: { tgn_anomaly: 0.88, graph_proximity: 0.95, cyber_ioc: 0.82 }, weights: { alpha: 0.45, beta: 0.35, gamma: 0.20 }, confidence: 0.94, recommendation: "IMMEDIATE_FREEZE" },
      { account_id: "mule_l2_1", account_label: "Mule L2-B (****8832)", risk_score: 0.87, components: { tgn_anomaly: 0.82, graph_proximity: 0.91, cyber_ioc: 0.78 }, weights: { alpha: 0.45, beta: 0.35, gamma: 0.20 }, confidence: 0.91, recommendation: "IMMEDIATE_FREEZE" },
      { account_id: "comp_1", account_label: "Victim B (****3456)", risk_score: 0.72, components: { tgn_anomaly: 0.65, graph_proximity: 0.80, cyber_ioc: 0.55 }, weights: { alpha: 0.45, beta: 0.35, gamma: 0.20 }, confidence: 0.82, recommendation: "INVESTIGATION" },
      { account_id: "shell_1", account_label: "Nova Global Trading FZE", risk_score: 0.88, components: { tgn_anomaly: 0.78, graph_proximity: 0.98, cyber_ioc: 0.72 }, weights: { alpha: 0.45, beta: 0.35, gamma: 0.20 }, confidence: 0.89, recommendation: "IMMEDIATE_FREEZE" },
      { account_id: "comp_0", account_label: "Victim A (****2341)", risk_score: 0.55, components: { tgn_anomaly: 0.52, graph_proximity: 0.60, cyber_ioc: 0.40 }, weights: { alpha: 0.45, beta: 0.35, gamma: 0.20 }, confidence: 0.75, recommendation: "ENHANCED_MONITORING" },
      { account_id: "mule_l1_3", account_label: "Mule L1-D (****6190)", risk_score: 0.79, components: { tgn_anomaly: 0.74, graph_proximity: 0.85, cyber_ioc: 0.68 }, weights: { alpha: 0.45, beta: 0.35, gamma: 0.20 }, confidence: 0.86, recommendation: "INVESTIGATION" },
    ];
  }

  static generateEdgeNodes(): EdgeNodeStatus[] {
    return [
      { id: "edge-01", institution: "HDFC Bank", region: "India — Mumbai", status: "online", throughput_tps: 12400, latency_ms: 3.2, memory_used_pct: 67, cpu_used_pct: 42, kafka_lag: 120, neo4j_nodes: 2400000, flink_jobs_running: 8, last_heartbeat: "2025-02-27T14:23:00", federated_round: 147, dp_epsilon_consumed: 0.23 },
      { id: "edge-02", institution: "State Bank of India", region: "India — Delhi", status: "online", throughput_tps: 15200, latency_ms: 4.1, memory_used_pct: 72, cpu_used_pct: 58, kafka_lag: 340, neo4j_nodes: 3100000, flink_jobs_running: 12, last_heartbeat: "2025-02-27T14:23:01", federated_round: 147, dp_epsilon_consumed: 0.19 },
      { id: "edge-03", institution: "ICICI Bank", region: "India — Hyderabad", status: "online", throughput_tps: 9800, latency_ms: 2.8, memory_used_pct: 54, cpu_used_pct: 35, kafka_lag: 85, neo4j_nodes: 1800000, flink_jobs_running: 6, last_heartbeat: "2025-02-27T14:23:02", federated_round: 147, dp_epsilon_consumed: 0.21 },
      { id: "edge-04", institution: "Axis Bank", region: "India — Bangalore", status: "degraded", throughput_tps: 4200, latency_ms: 12.5, memory_used_pct: 89, cpu_used_pct: 91, kafka_lag: 15200, neo4j_nodes: 1200000, flink_jobs_running: 4, last_heartbeat: "2025-02-27T14:22:45", federated_round: 146, dp_epsilon_consumed: 0.27 },
      { id: "edge-05", institution: "Barclays UK", region: "UK — London", status: "online", throughput_tps: 8900, latency_ms: 5.4, memory_used_pct: 61, cpu_used_pct: 47, kafka_lag: 210, neo4j_nodes: 2900000, flink_jobs_running: 10, last_heartbeat: "2025-02-27T14:23:00", federated_round: 147, dp_epsilon_consumed: 0.15 },
      { id: "edge-06", institution: "Deutsche Bank", region: "EU — Frankfurt", status: "online", throughput_tps: 11300, latency_ms: 3.9, memory_used_pct: 58, cpu_used_pct: 39, kafka_lag: 160, neo4j_nodes: 2600000, flink_jobs_running: 9, last_heartbeat: "2025-02-27T14:23:01", federated_round: 147, dp_epsilon_consumed: 0.18 },
    ];
  }

  static generateEntityMatches(): EntityResolutionMatch[] {
    return [
      { id: "ER-001", entity_a: { id: "ENT-4821", name: "Rajesh Kumar Singh", dob: "1988-03-15", address: "42, MG Road, Mumbai 400001", phone: "+91-98765-43210", email: "rajesh.ks@gmail.com", bank: "HDFC" }, entity_b: { id: "ENT-7392", name: "Rajesh K. Singh", dob: "1988-03-15", address: "42 M.G. Rd, Mumbai", phone: "+91-98765-43210", email: "rajesh.ks@gmail.com", bank: "SBI" }, confidence: 0.96, action: "AUTO_MERGE", features: { name_jaro_winkler: 0.94, name_phonetic_match: true, dob_days_diff: 0, address_token_set_ratio: 0.88, phone_digit_overlap: 1.0, email_exact_match: true, device_fingerprint_jaccard: 0.72, ip_cidr_overlap: 0.85 }, merged: true },
      { id: "ER-002", entity_a: { id: "ENT-5102", name: "Priya Sharma", dob: "1992-07-22", address: "15, Nehru Place, Delhi 110019", phone: "+91-87654-32109", email: "priya.s92@yahoo.com", bank: "ICICI" }, entity_b: { id: "ENT-8834", name: "Priya Shrama", dob: "1992-07-22", address: "15 Nehru Pl, New Delhi", phone: "+91-87654-32190", email: "priya.sharma92@yahoo.com", bank: "Axis" }, confidence: 0.82, action: "HUMAN_REVIEW", features: { name_jaro_winkler: 0.89, name_phonetic_match: true, dob_days_diff: 0, address_token_set_ratio: 0.75, phone_digit_overlap: 0.90, email_exact_match: false, device_fingerprint_jaccard: 0.45, ip_cidr_overlap: 0.60 }, reviewed: false },
      { id: "ER-003", entity_a: { id: "ENT-6290", name: "Mohammed Ali Khan", dob: "1985-11-03", address: "78, Jubilee Hills, Hyderabad", phone: "+91-76543-21098", email: "m.ali.khan@outlook.com", bank: "SBI" }, entity_b: { id: "ENT-9201", name: "Mohd Ali Khan", dob: "1985-11-05", address: "78 Jubilee Hills, Hyd", phone: "+91-76543-21098", email: "m.ali.khan@outlook.com", bank: "HDFC" }, confidence: 0.91, action: "AUTO_MERGE", features: { name_jaro_winkler: 0.91, name_phonetic_match: true, dob_days_diff: 2, address_token_set_ratio: 0.82, phone_digit_overlap: 1.0, email_exact_match: true, device_fingerprint_jaccard: 0.68, ip_cidr_overlap: 0.90 }, merged: true },
      { id: "ER-004", entity_a: { id: "ENT-3847", name: "Ananya Patel", dob: "1995-05-18", address: "201, Whitefield, Bangalore 560066", phone: "+91-65432-10987", email: "ananya.p@gmail.com", bank: "Axis" }, entity_b: { id: "ENT-7756", name: "Ananya R. Patel", dob: "1995-05-18", address: "201/A Whitefield Main, Bengaluru", phone: "+91-65432-10987", email: "ananya.rpatel@gmail.com", bank: "ICICI" }, confidence: 0.77, action: "HUMAN_REVIEW", features: { name_jaro_winkler: 0.86, name_phonetic_match: true, dob_days_diff: 0, address_token_set_ratio: 0.71, phone_digit_overlap: 1.0, email_exact_match: false, device_fingerprint_jaccard: 0.38, ip_cidr_overlap: 0.55 }, reviewed: false },
      { id: "ER-005", entity_a: { id: "ENT-2910", name: "Vikram Reddy", dob: "1978-09-30", address: "5, Banjara Hills, Hyderabad", phone: "+91-54321-09876", email: "vikr@protonmail.com", bank: "HDFC" }, entity_b: { id: "ENT-6645", name: "Victor Rodriguez", dob: "1982-04-12", address: "12 Oak Lane, London SW1", phone: "+44-20-7946-0958", email: "v.rodriguez@gmail.com", bank: "Barclays" }, confidence: 0.18, action: "NON_MATCH", features: { name_jaro_winkler: 0.42, name_phonetic_match: false, dob_days_diff: 1290, address_token_set_ratio: 0.12, phone_digit_overlap: 0.10, email_exact_match: false, device_fingerprint_jaccard: 0.02, ip_cidr_overlap: 0.0 } },
    ];
  }

  static generateTTPLibrary(): TTPEntry[] {
    return [
      { id: "TTP-001", name: "Amount Smurfing", sophistication: "BASIC", description: "Breaking large transactions into amounts below reporting thresholds (₹50K/€10K/$10K).", mitre_id: "T1565.001", detection_rate: 0.99 },
      { id: "TTP-002", name: "Temporal Dispersion", sophistication: "BASIC", description: "Spreading transactions over extended time windows to avoid velocity triggers.", mitre_id: "T1029", detection_rate: 0.98 },
      { id: "TTP-003", name: "Round Amount Avoidance", sophistication: "BASIC", description: "Using non-round amounts (e.g., ₹49,873 instead of ₹50,000) to appear organic.", mitre_id: "T1565.002", detection_rate: 0.97 },
      { id: "TTP-004", name: "Multiple Small Deposits", sophistication: "BASIC", description: "Cash deposits at multiple ATMs/branches below CTR thresholds.", mitre_id: "T1074.001", detection_rate: 0.99 },
      { id: "TTP-005", name: "Peer-to-Peer Transfer Chains", sophistication: "BASIC", description: "Using consumer P2P platforms (UPI, PayTM) for fund movement.", mitre_id: "T1071.001", detection_rate: 0.96 },
      { id: "TTP-012", name: "Device Fingerprint Rotation", sophistication: "MODERATE", description: "Using anti-detect browsers (Multilogin, GoLogin) to generate unique fingerprints per session.", mitre_id: "T1036.005", detection_rate: 0.89 },
      { id: "TTP-013", name: "Residential Proxy Tunneling", sophistication: "MODERATE", description: "Routing traffic through residential proxy networks to mask true origin.", mitre_id: "T1090.002", detection_rate: 0.85 },
      { id: "TTP-014", name: "Synthetic Identity KYC", sophistication: "MODERATE", description: "Creating fabricated identities with thin credit files and no digital footprint.", mitre_id: "T1566.003", detection_rate: 0.87 },
      { id: "TTP-015", name: "Multi-Bank Splitting", sophistication: "MODERATE", description: "Distributing funds across 5+ banks to reduce per-institution visibility.", mitre_id: "T1027.001", detection_rate: 0.91 },
      { id: "TTP-016", name: "Gift Card Conversion", sophistication: "MODERATE", description: "Converting funds to prepaid gift cards for value extraction.", mitre_id: "T1074.002", detection_rate: 0.93 },
      { id: "TTP-028", name: "Behavioral Biometric Mimicry", sophistication: "ADVANCED", description: "Mimicking legitimate user typing patterns and mouse movements.", mitre_id: "T1036.004", detection_rate: 0.76 },
      { id: "TTP-029", name: "Graph Obfuscation via Noise", sophistication: "ADVANCED", description: "Injecting legitimate-appearing transactions to dilute suspicious graph patterns.", mitre_id: "T1001.001", detection_rate: 0.72 },
      { id: "TTP-030", name: "Dormant Mule Sleeper Activation", sophistication: "ADVANCED", description: "Opening accounts months in advance and building legitimate history before activation.", mitre_id: "T1036.003", detection_rate: 0.78 },
      { id: "TTP-031", name: "Crypto Mixer Layering", sophistication: "ADVANCED", description: "Converting to crypto, mixing via Tornado Cash/CoinJoin, converting back.", mitre_id: "T1027.005", detection_rate: 0.69 },
      { id: "TTP-032", name: "Social Engineering Accomplices", sophistication: "ADVANCED", description: "Recruiting unaware accomplices via romance scams or job offers.", mitre_id: "T1566.001", detection_rate: 0.81 },
      { id: "TTP-043", name: "Nested PSP Exploitation", sophistication: "EXPERT", description: "Exploiting layered Payment Service Providers to obscure transaction origins.", mitre_id: "T1583.003", detection_rate: 0.62 },
      { id: "TTP-044", name: "Trade-Based Value Transfer", sophistication: "EXPERT", description: "Using over/under-invoiced trade transactions to move value across borders.", mitre_id: "T1567.002", detection_rate: 0.58 },
      { id: "TTP-045", name: "DeFi Cross-Chain Bridges", sophistication: "EXPERT", description: "Using DeFi protocols and cross-chain bridges to fragment and reassemble value.", mitre_id: "T1583.004", detection_rate: 0.55 },
      { id: "TTP-046", name: "NFT Wash Trading", sophistication: "EXPERT", description: "Self-trading NFTs at inflated prices to launder funds with apparent legitimacy.", mitre_id: "T1583.005", detection_rate: 0.61 },
      { id: "TTP-047", name: "Hawala Network Exploitation", sophistication: "EXPERT", description: "Using informal value transfer systems with no digital trail.", mitre_id: "T1583.006", detection_rate: 0.48 },
    ];
  }

  static generateRedTeamResults(): { scenarios: RedTeamScenario[]; kpis: RedTeamKPI[] } {
    const scenarios: RedTeamScenario[] = [
      { id: "SIM-001", sophistication: "BASIC", ttps_applied: ["TTP-001", "TTP-002", "TTP-003", "TTP-004", "TTP-005"], network_size: 15, detected: true, detection_latency_seconds: 2.3, risk_score: 0.94, false_negatives: 0, timestamp: "2025-02-27T02:00:00" },
      { id: "SIM-002", sophistication: "BASIC", ttps_applied: ["TTP-001", "TTP-003", "TTP-005"], network_size: 28, detected: true, detection_latency_seconds: 1.8, risk_score: 0.97, false_negatives: 0, timestamp: "2025-02-27T02:05:00" },
      { id: "SIM-003", sophistication: "MODERATE", ttps_applied: ["TTP-012", "TTP-013", "TTP-014", "TTP-015", "TTP-016"], network_size: 22, detected: true, detection_latency_seconds: 8.4, risk_score: 0.81, false_negatives: 2, timestamp: "2025-02-27T02:10:00" },
      { id: "SIM-004", sophistication: "MODERATE", ttps_applied: ["TTP-012", "TTP-014", "TTP-016"], network_size: 35, detected: true, detection_latency_seconds: 12.1, risk_score: 0.76, false_negatives: 4, timestamp: "2025-02-27T02:15:00" },
      { id: "SIM-005", sophistication: "ADVANCED", ttps_applied: ["TTP-028", "TTP-029", "TTP-030", "TTP-031", "TTP-032"], network_size: 18, detected: true, detection_latency_seconds: 45.2, risk_score: 0.68, false_negatives: 5, timestamp: "2025-02-27T02:20:00" },
      { id: "SIM-006", sophistication: "ADVANCED", ttps_applied: ["TTP-029", "TTP-030", "TTP-031"], network_size: 42, detected: false, detection_latency_seconds: 120.0, risk_score: 0.42, false_negatives: 18, timestamp: "2025-02-27T02:25:00" },
      { id: "SIM-007", sophistication: "EXPERT", ttps_applied: ["TTP-043", "TTP-044", "TTP-045", "TTP-046", "TTP-047"], network_size: 12, detected: false, detection_latency_seconds: 180.0, risk_score: 0.31, false_negatives: 8, timestamp: "2025-02-27T02:30:00" },
      { id: "SIM-008", sophistication: "EXPERT", ttps_applied: ["TTP-044", "TTP-045", "TTP-047"], network_size: 25, detected: true, detection_latency_seconds: 95.6, risk_score: 0.59, false_negatives: 10, timestamp: "2025-02-27T02:35:00" },
    ];
    const kpis: RedTeamKPI[] = [
      { level: "BASIC", target: 0.98, achieved: 1.00, passed: true },
      { level: "MODERATE", target: 0.87, achieved: 0.89, passed: true },
      { level: "ADVANCED", target: 0.75, achieved: 0.50, passed: false },
      { level: "EXPERT", target: 0.60, achieved: 0.50, passed: false },
    ];
    return { scenarios, kpis };
  }

  static generateComplianceStatus(): ComplianceJurisdiction[] {
    return [
      { id: "GDPR", region: "European Union", framework: "GDPR", lawful_basis: "Article 6(1)(f) — Legitimate Interest (financial crime prevention)", status: "compliant", data_retention_years: 5, cross_border_mechanism: "Standard Contractual Clauses (SCCs)", dpia_status: "completed", rights: ["Access", "Rectification", "Erasure", "Portability", "Object"], special_notes: "DPIA completed. Legitimate Interest Assessment on file. Biometric processing prohibited." },
      { id: "DPDP", region: "India", framework: "DPDP Act 2023", lawful_basis: "Section 7 — Legitimate Uses (prevention of fraud)", status: "compliant", data_retention_years: 5, cross_border_mechanism: "Whitelisted countries + Data Fiduciary obligations", dpia_status: "completed", rights: ["Access", "Correction", "Erasure", "Grievance Redressal"], special_notes: "Data Fiduciary obligations met. Consent Manager integration complete." },
      { id: "GLBA", region: "United States", framework: "GLBA + BSA/AML", lawful_basis: "Financial crime exception under GLBA; BSA mandate for suspicious activity monitoring", status: "compliant", data_retention_years: 7, cross_border_mechanism: "Privacy Shield successor framework + contractual protections", dpia_status: "completed", rights: ["Opt-out of information sharing", "Access to privacy notices"], special_notes: "BSA/AML requirements satisfied. CTR and SAR filing protocols active." },
      { id: "UK_MLR", region: "United Kingdom", framework: "UK GDPR + MLR 2017", lawful_basis: "Schedule 2 Para 6 — Prevention/detection of crime", status: "partial", data_retention_years: 5, cross_border_mechanism: "UK Adequacy Decision + International Data Transfer Agreement", dpia_status: "in_progress", rights: ["Access", "Rectification", "Erasure", "Portability", "Object"], special_notes: "SAR filings exempt from subject access under MLR. JMLIT sharing permitted. DPIA in progress for new TGN model." },
    ];
  }

  static generateFederatedRounds(): FederatedRound[] {
    return [
      { round: 147, timestamp: "2025-02-27T14:00:00", participants: 6, dp_epsilon: 0.5, model_improvement_pct: 2.3, aggregation_method: "Secure Aggregation + DP Noise" },
      { round: 146, timestamp: "2025-02-27T02:00:00", participants: 6, dp_epsilon: 0.5, model_improvement_pct: 1.8, aggregation_method: "Secure Aggregation + DP Noise" },
      { round: 145, timestamp: "2025-02-26T14:00:00", participants: 5, dp_epsilon: 0.5, model_improvement_pct: 3.1, aggregation_method: "Secure Aggregation + DP Noise" },
      { round: 144, timestamp: "2025-02-26T02:00:00", participants: 6, dp_epsilon: 0.5, model_improvement_pct: 0.9, aggregation_method: "Secure Aggregation + DP Noise" },
      { round: 143, timestamp: "2025-02-25T14:00:00", participants: 6, dp_epsilon: 0.5, model_improvement_pct: 4.2, aggregation_method: "Secure Aggregation + DP Noise" },
    ];
  }

  static generateTransactions(): Transaction[] {
    const patterns: TransactionPattern[] = ['Fan-out', 'Fan-in', 'Structuring', 'Smurfing', 'Layering', 'Rapid Move', 'Normal'];
    const counterparties = [
      { name: 'CryptoWallet_0x44', initials: 'CW' },
      { name: 'Offshore_LLC_B', initials: 'OL' },
      { name: 'Retail_Merchant_7', initials: 'RM' },
      { name: 'Shell_Corp_Alpha', initials: 'SC' },
      { name: 'Peer_Account_99', initials: 'PA' },
      { name: 'Exchange_Bin_XY', initials: 'EB' },
      { name: 'NovaPay_Services', initials: 'NP' },
      { name: 'Digital_Wallet_Z9', initials: 'DW' },
      { name: 'BlackRock_Nominee', initials: 'BN' },
      { name: 'Hawala_Broker_12', initials: 'HB' },
      { name: 'Gaming_Platform_GX', initials: 'GP' },
      { name: 'Remittance_Corp_M', initials: 'RC' },
    ];

    const riskLevel = (score: number): RiskLevel => {
      if (score >= 85) return 'critical';
      if (score >= 65) return 'high';
      if (score >= 35) return 'medium';
      return 'low';
    };

    return [
      { id: 'TXN-8829-XJA', timestamp: '2025-02-27T14:23:01', counterparty: counterparties[0].name, counterparty_initials: counterparties[0].initials, amount: 15000, currency: 'USD', risk_score: 98, risk_level: 'critical', pattern: 'Fan-out', flagged: true },
      { id: 'TXN-9921-BKA', timestamp: '2025-02-27T14:15:22', counterparty: counterparties[1].name, counterparty_initials: counterparties[1].initials, amount: 4200, currency: 'USD', risk_score: 85, risk_level: 'critical', pattern: 'Structuring', flagged: true },
      { id: 'TXN-1102-LQP', timestamp: '2025-02-27T13:55:45', counterparty: counterparties[2].name, counterparty_initials: counterparties[2].initials, amount: 125, currency: 'USD', risk_score: 12, risk_level: 'low', pattern: 'Normal', flagged: false },
      { id: 'TXN-3392-MZO', timestamp: '2025-02-27T13:42:10', counterparty: counterparties[3].name, counterparty_initials: counterparties[3].initials, amount: 50000, currency: 'USD', risk_score: 92, risk_level: 'critical', pattern: 'Layering', flagged: true },
      { id: 'TXN-7741-PRA', timestamp: '2025-02-27T12:30:15', counterparty: counterparties[4].name, counterparty_initials: counterparties[4].initials, amount: 2500, currency: 'USD', risk_score: 45, risk_level: 'medium', pattern: 'Rapid Move', flagged: false },
      { id: 'TXN-6623-WRE', timestamp: '2025-02-27T11:18:33', counterparty: counterparties[5].name, counterparty_initials: counterparties[5].initials, amount: 8900, currency: 'USD', risk_score: 78, risk_level: 'high', pattern: 'Smurfing', flagged: true },
      { id: 'TXN-4412-KPM', timestamp: '2025-02-27T10:45:12', counterparty: counterparties[6].name, counterparty_initials: counterparties[6].initials, amount: 32000, currency: 'USD', risk_score: 88, risk_level: 'critical', pattern: 'Fan-in', flagged: true },
      { id: 'TXN-5578-RVN', timestamp: '2025-02-27T10:12:44', counterparty: counterparties[7].name, counterparty_initials: counterparties[7].initials, amount: 900, currency: 'USD', risk_score: 22, risk_level: 'low', pattern: 'Normal', flagged: false },
      { id: 'TXN-2239-GTL', timestamp: '2025-02-27T09:38:19', counterparty: counterparties[8].name, counterparty_initials: counterparties[8].initials, amount: 18500, currency: 'USD', risk_score: 72, risk_level: 'high', pattern: 'Layering', flagged: true },
      { id: 'TXN-8841-CFW', timestamp: '2025-02-27T09:05:33', counterparty: counterparties[9].name, counterparty_initials: counterparties[9].initials, amount: 9800, currency: 'USD', risk_score: 91, risk_level: 'critical', pattern: 'Structuring', flagged: true },
      { id: 'TXN-1190-DXE', timestamp: '2025-02-27T08:22:55', counterparty: counterparties[10].name, counterparty_initials: counterparties[10].initials, amount: 350, currency: 'USD', risk_score: 15, risk_level: 'low', pattern: 'Normal', flagged: false },
      { id: 'TXN-6634-MWQ', timestamp: '2025-02-27T07:45:01', counterparty: counterparties[11].name, counterparty_initials: counterparties[11].initials, amount: 6200, currency: 'USD', risk_score: 67, risk_level: 'high', pattern: 'Smurfing', flagged: true },
    ];
  }

  static generateCases(): CaseFile[] {
    return [
      { id: 'INV-2025-0342', title: 'Operation: CryptoMule', status: 'investigating', severity: 'critical', assigned_to: 'Agent Sarah K.', created: '2025-02-27T10:15:00', entities_count: 14, transactions_count: 22, summary: 'Rapid dispersion of funds (fan-out pattern) detected across 12 newly created accounts with shared device fingerprints.' },
      { id: 'INV-2025-0341', title: 'Phantom Funnel Network', status: 'escalated', severity: 'critical', assigned_to: 'Agent Raj P.', created: '2025-02-26T08:30:00', entities_count: 8, transactions_count: 45, summary: 'Multi-layered smurfing operation funneling funds through gaming platforms and crypto exchanges.' },
      { id: 'INV-2025-0340', title: 'Structuring Alert Cluster', status: 'investigating', severity: 'high', assigned_to: 'Agent Maria L.', created: '2025-02-25T14:20:00', entities_count: 5, transactions_count: 18, summary: 'Multiple cash deposits just under $10,000 reporting threshold across 3 days.' },
      { id: 'INV-2025-0339', title: 'Cross-Border Layering', status: 'resolved', severity: 'medium', assigned_to: 'Agent David K.', created: '2025-02-24T09:00:00', entities_count: 3, transactions_count: 7, summary: 'International wire transfers with shell company intermediaries. Resolved — accounts frozen.' },
    ];
  }
}
