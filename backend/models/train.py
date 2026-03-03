"""
Train ML models for MuleNet using YOUR real data from Downloads/train/.

Models:
  1. Fraud Detector       — Gradient Boosting on credit_card_transactions.csv
  2. Network Anomaly      — Random Forest on Data_of_Attack_Back.csv
  3. Risk Scorer Config   — Weighted ensemble (R = α·A + β·B + γ·C)
"""
import os
import sys
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    precision_recall_fscore_support, roc_auc_score, confusion_matrix
)

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved")
PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def train_fraud_detector():
    """Train credit card fraud detection model."""
    print("\n" + "=" * 60)
    print("Training Fraud Detection Model (Gradient Boosting)")
    print("=" * 60)

    data = np.load(os.path.join(PROCESSED_DIR, "creditcard_processed.npz"), allow_pickle=True)
    X_train, X_test = data["X_train"], data["X_test"]
    y_train, y_test = data["y_train"], data["y_test"]

    model = GradientBoostingClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        subsample=0.8,
        random_state=42,
    )

    print(f"  Training on {len(X_train)} samples ({y_train.sum()} fraud)...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="binary")
    auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n  Results:")
    print(f"    Precision: {precision:.4f}")
    print(f"    Recall:    {recall:.4f}")
    print(f"    F1 Score:  {f1:.4f}")
    print(f"    AUC-ROC:   {auc:.4f}")
    print(f"    Confusion Matrix:")
    print(f"      TN={cm[0][0]:>6}  FP={cm[0][1]:>5}")
    print(f"      FN={cm[1][0]:>6}  TP={cm[1][1]:>5}")

    ensure_dir(MODELS_DIR)
    joblib.dump(model, os.path.join(MODELS_DIR, "fraud_detector.joblib"))
    metrics = {"precision": float(precision), "recall": float(recall),
               "f1": float(f1), "auc_roc": float(auc),
               "confusion_matrix": cm.tolist(),
               "train_samples": int(len(X_train)), "test_samples": int(len(X_test))}
    joblib.dump(metrics, os.path.join(MODELS_DIR, "fraud_metrics.joblib"))
    print(f"  [✓] Model saved!")
    return model, metrics


def train_network_anomaly():
    """Train network intrusion detection model."""
    print("\n" + "=" * 60)
    print("Training Network Anomaly Model (Random Forest)")
    print("=" * 60)

    data = np.load(os.path.join(PROCESSED_DIR, "nslkdd_processed.npz"), allow_pickle=True)
    X_train, X_test = data["X_train"], data["X_test"]
    y_train, y_test = data["y_train"], data["y_test"]

    model = RandomForestClassifier(
        n_estimators=100, max_depth=15,
        min_samples_leaf=5, random_state=42, n_jobs=-1,
    )

    print(f"  Training on {len(X_train)} samples ({y_train.sum()} attacks)...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="binary")
    auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n  Results:")
    print(f"    Precision: {precision:.4f}")
    print(f"    Recall:    {recall:.4f}")
    print(f"    F1 Score:  {f1:.4f}")
    print(f"    AUC-ROC:   {auc:.4f}")
    print(f"    Confusion Matrix:")
    print(f"      TN={cm[0][0]:>6}  FP={cm[0][1]:>5}")
    print(f"      FN={cm[1][0]:>6}  TP={cm[1][1]:>5}")

    ensure_dir(MODELS_DIR)
    joblib.dump(model, os.path.join(MODELS_DIR, "network_anomaly.joblib"))
    metrics = {"precision": float(precision), "recall": float(recall),
               "f1": float(f1), "auc_roc": float(auc),
               "confusion_matrix": cm.tolist(),
               "train_samples": int(len(X_train)), "test_samples": int(len(X_test))}
    joblib.dump(metrics, os.path.join(MODELS_DIR, "network_metrics.joblib"))
    print(f"  [✓] Model saved!")
    return model, metrics


def create_risk_scorer():
    """Create combined risk scoring config."""
    print("\n" + "=" * 60)
    print("Creating Combined Risk Scorer (R = α·A + β·B + γ·C)")
    print("=" * 60)

    config = {
        "weights": {"alpha": 0.45, "beta": 0.30, "gamma": 0.25},
        "thresholds": {
            "IMMEDIATE_FREEZE": 0.85, "INVESTIGATION": 0.65,
            "ENHANCED_MONITORING": 0.40, "LOG_ONLY": 0.0,
        },
    }
    ensure_dir(MODELS_DIR)
    joblib.dump(config, os.path.join(MODELS_DIR, "risk_scorer_config.joblib"))
    w = config["weights"]
    print(f"  Weights: α={w['alpha']}, β={w['beta']}, γ={w['gamma']}")
    print(f"  [✓] Config saved!")
    return config


def train_all():
    """Full training pipeline."""
    print("\n" + "█" * 60)
    print("  MuleNet ML Training Pipeline — REAL DATA")
    print("█" * 60)

    # Step 1: Preprocess real data
    from data.preprocess import preprocess_all
    preprocess_all()

    # Step 2: Train models
    fraud_model, fraud_metrics = train_fraud_detector()
    network_model, network_metrics = train_network_anomaly()
    risk_config = create_risk_scorer()

    print("\n" + "█" * 60)
    print("  Training Complete!")
    print("█" * 60)
    print(f"\n  Fraud Detector:   F1={fraud_metrics['f1']:.4f}  AUC={fraud_metrics['auc_roc']:.4f}")
    print(f"  Network Anomaly:  F1={network_metrics['f1']:.4f}  AUC={network_metrics['auc_roc']:.4f}")
    w = risk_config["weights"]
    print(f"  Risk Scorer:      α={w['alpha']}  β={w['beta']}  γ={w['gamma']}")
    print(f"\n  Models saved to: {MODELS_DIR}")
    print(f"  Ready to serve via API!\n")


if __name__ == "__main__":
    train_all()
