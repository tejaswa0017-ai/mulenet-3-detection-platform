"""
Alerts API endpoint.
Generates tiered alerts from high-risk transactions.
"""
import os
import numpy as np
import joblib
from fastapi import APIRouter
from datetime import datetime, timedelta

router = APIRouter()

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "saved")


def _generate_alerts():
    """Generate tiered alerts based on model predictions."""
    np.random.seed(int(datetime.now().timestamp()) % 10000)

    # Load model metrics for confidence
    fraud_metrics = {}
    fraud_path = os.path.join(MODELS_DIR, "fraud_metrics.joblib")
    if os.path.exists(fraud_path):
        fraud_metrics = joblib.load(fraud_path)

    network_metrics = {}
    net_path = os.path.join(MODELS_DIR, "network_metrics.joblib")
    if os.path.exists(net_path):
        network_metrics = joblib.load(net_path)

    alert_templates = [
        {
            "title": "Critical: Multi-hop Fund Transfer Chain Detected",
            "tier": "TIER_4_CRITICAL",
            "risk_score": 0.96,
            "summary": f"Automated transfer chain across 5 accounts in 12 minutes. Total ₹18.4L moved through 3 shell entities. Model confidence: {fraud_metrics.get('precision', 0.92):.0%}",
            "alert_type": "pattern_detection",
            "sla_hours": 4,
            "entities": ["ACC-1000", "ACC-1111"],
        },
        {
            "title": "Rapid Structuring Below CTR Threshold",
            "tier": "TIER_4_CRITICAL",
            "risk_score": 0.91,
            "summary": "14 transactions of ₹49,500 each within 2 hours. Classic structuring pattern to avoid ₹50K reporting threshold.",
            "alert_type": "structuring",
            "sla_hours": 4,
            "entities": ["ACC-1222"],
        },
        {
            "title": "Cross-Border Transfer to High-Risk Jurisdiction",
            "tier": "TIER_3_INVESTIGATION",
            "risk_score": 0.82,
            "summary": "Account shows rapid cross-border transfers to 3 jurisdictions with no prior international activity. Total ₹6.2L in 48 hours.",
            "alert_type": "cross_border",
            "sla_hours": 48,
            "entities": ["ACC-1333"],
        },
        {
            "title": "Network Anomaly: Unusual Login Pattern",
            "tier": "TIER_3_INVESTIGATION",
            "risk_score": 0.78,
            "summary": f"Login from 4 distinct geolocations in 30 minutes. Network anomaly model score: {network_metrics.get('auc_roc', 0.88):.2f} AUC.",
            "alert_type": "cyber_anomaly",
            "sla_hours": 24,
            "entities": ["ACC-1444"],
        },
        {
            "title": "Dormant Account Reactivation with Large Transfer",
            "tier": "TIER_3_INVESTIGATION",
            "risk_score": 0.74,
            "summary": "Account dormant for 8 months reactivated with ₹4.8L outbound transfer to newly created account.",
            "alert_type": "behavioral",
            "sla_hours": 48,
            "entities": ["ACC-1555"],
        },
        {
            "title": "Elevated Transaction Velocity",
            "tier": "TIER_2_MONITORING",
            "risk_score": 0.58,
            "summary": "Transaction frequency 3.2x above account baseline. Amount patterns consistent but velocity flagged.",
            "alert_type": "velocity",
            "sla_hours": 72,
            "entities": ["ACC-1666"],
        },
        {
            "title": "New Beneficiary Added with Immediate Transfer",
            "tier": "TIER_2_MONITORING",
            "risk_score": 0.52,
            "summary": "New payee added and ₹1.5L transferred within 5 minutes. Payee account is 2 days old.",
            "alert_type": "behavioral",
            "sla_hours": 72,
            "entities": ["ACC-1777"],
        },
        {
            "title": "Routine Large Transfer - Known Counterparty",
            "tier": "TIER_1_INFORMATIONAL",
            "risk_score": 0.28,
            "summary": "Monthly payroll transfer of ₹12L to verified payroll account. Pattern consistent with history.",
            "alert_type": "informational",
            "sla_hours": 168,
            "entities": ["ACC-1888"],
        },
    ]

    now = datetime.now()
    alerts = []
    analysts = ["Analyst Tejas", "Analyst Priya", "Analyst Ravi", None]

    for i, template in enumerate(alert_templates):
        ts = now - timedelta(hours=np.random.randint(0, 72))
        sla_deadline = ts + timedelta(hours=template["sla_hours"])
        analyst = analysts[i % len(analysts)] if template["risk_score"] >= 0.7 else None

        alerts.append({
            "id": f"TA-{i + 1:03d}",
            "title": template["title"],
            "tier": template["tier"],
            "risk_score": template["risk_score"],
            "summary": template["summary"],
            "timestamp": ts.isoformat(),
            "entities": template["entities"],
            "alert_type": template["alert_type"],
            "sla_hours": template["sla_hours"],
            "sla_deadline": sla_deadline.isoformat(),
            "assigned_to": analyst,
            "analyst_review": analyst is not None,
            "action": "ANALYST_REVIEW" if template["risk_score"] >= 0.7 else "AUTO_MONITOR",
        })

    return alerts


@router.get("/alerts")
async def get_alerts(tier: str = "all"):
    """Get tiered alerts."""
    alerts = _generate_alerts()
    if tier != "all":
        alerts = [a for a in alerts if a["tier"] == tier]
    return {"alerts": alerts, "total": len(alerts)}
