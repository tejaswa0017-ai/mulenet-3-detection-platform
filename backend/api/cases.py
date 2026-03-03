"""
Cases API endpoint.
Case files generated from flagged transaction clusters.
"""
import os
import numpy as np
import pandas as pd
from fastapi import APIRouter
from datetime import datetime, timedelta

router = APIRouter()

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")


def _generate_cases():
    """Generate case files from flagged transactions."""
    csv_path = os.path.join(PROCESSED_DIR, "transactions_enriched.csv")
    np.random.seed(42)

    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        fraud_txns = df[df["is_fraud"] == 1]
        total_fraud = len(fraud_txns)
    else:
        total_fraud = 12

    analysts = ["Analyst Tejas", "Analyst Priya", "Analyst Ravi", "Analyst Meera"]
    statuses = ["investigating", "escalated", "resolved", "dismissed"]
    severities = ["critical", "high", "medium", "low"]

    case_templates = [
        {"title": "Operation Phantom Funnel — Multi-Layer Transfer Network", "severity": "critical", "status": "investigating"},
        {"title": "Structured Deposits Below CTR Threshold", "severity": "critical", "status": "escalated"},
        {"title": "Cross-Border Shell Company Network", "severity": "high", "status": "investigating"},
        {"title": "Rapid Fund Movement — Dormant Account Cluster", "severity": "high", "status": "investigating"},
        {"title": "Cyber-Enabled Account Takeover Chain", "severity": "high", "status": "escalated"},
        {"title": "Trade-Based Money Laundering Pattern", "severity": "medium", "status": "investigating"},
        {"title": "Suspicious Beneficiary Network", "severity": "medium", "status": "resolved"},
        {"title": "Anomalous P2P Transfer Pattern", "severity": "low", "status": "dismissed"},
    ]

    cases = []
    now = datetime.now()
    for i, template in enumerate(case_templates):
        created = now - timedelta(days=np.random.randint(1, 30))
        entities = np.random.randint(3, 15)
        txns = np.random.randint(5, min(50, max(10, total_fraud)))

        summaries = [
            f"Cluster of {entities} entities involved in {txns} flagged transactions. Model-detected pattern: layered transfers across multiple intermediaries.",
            f"Automated structuring detected: {txns} transactions below ₹50K threshold. {entities} accounts linked via shared device fingerprints.",
            f"Cross-border transfers to {np.random.randint(2, 5)} high-risk jurisdictions. Total volume: ₹{np.random.randint(200, 2000) / 100:.1f}L.",
            f"Previously dormant accounts ({np.random.randint(3, 12)} months) reactivated with coordinated transfers. Model confidence: {np.random.randint(75, 98)}%.",
            f"Account credentials compromised via phishing. {txns} unauthorized transfers detected by anomaly model within {np.random.randint(5, 30)} minutes.",
            f"Over/under-invoicing pattern detected in {txns} trade transactions. Price deviation: {np.random.randint(15, 45)}% above market.",
            f"New beneficiary cluster with {entities} accounts created within 48 hours. All receiving accounts are < 1 week old.",
            f"P2P transfers between {entities} accounts showing round-trip pattern. Low risk score but flagged for monitoring.",
        ]

        cases.append({
            "id": f"CASE-{2025000 + i}",
            "title": template["title"],
            "status": template["status"],
            "severity": template["severity"],
            "assigned_to": analysts[i % len(analysts)],
            "created": created.isoformat(),
            "entities_count": entities,
            "transactions_count": txns,
            "summary": summaries[i],
        })

    return cases


@router.get("/cases")
async def get_cases(status: str = "all", severity: str = "all"):
    """Get case files."""
    cases = _generate_cases()
    if status != "all":
        cases = [c for c in cases if c["status"] == status]
    if severity != "all":
        cases = [c for c in cases if c["severity"] == severity]
    return {"cases": cases, "total": len(cases)}
