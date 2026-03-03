"""
MuleNet ML Backend — FastAPI Application
Serves ML model predictions via REST API.
"""
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from api.transactions import router as transactions_router
from api.risk_scores import router as risk_scores_router
from api.alerts import router as alerts_router
from api.network import router as network_router
from api.stats import router as stats_router
from api.cases import router as cases_router
from api.entity_resolution import router as entity_resolution_router
from api.federated import router as federated_router
from api.red_team import router as red_team_router

app = FastAPI(
    title="MuleNet ML Backend",
    description="Financial crime detection ML platform API",
    version="1.0.0",
)

# CORS — allow frontend on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://0.0.0.0:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(transactions_router, prefix="/api", tags=["Transactions"])
app.include_router(risk_scores_router, prefix="/api", tags=["Risk Scores"])
app.include_router(alerts_router, prefix="/api", tags=["Alerts"])
app.include_router(network_router, prefix="/api", tags=["Network"])
app.include_router(stats_router, prefix="/api", tags=["Stats"])
app.include_router(cases_router, prefix="/api", tags=["Cases"])
app.include_router(entity_resolution_router, prefix="/api", tags=["Entity Resolution"])
app.include_router(federated_router, prefix="/api", tags=["Federated Intel"])
app.include_router(red_team_router, prefix="/api", tags=["Red Team"])


@app.get("/")
async def root():
    return {
        "service": "MuleNet ML Backend",
        "version": "1.0.0",
        "status": "online",
        "endpoints": [
            "/api/transactions",
            "/api/risk-scores",
            "/api/alerts",
            "/api/network",
            "/api/stats",
            "/api/cases",
            "/api/entity-matches",
            "/api/federated/edge-nodes",
            "/api/federated/rounds",
            "/api/red-team",
        ],
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    models_dir = os.path.join(os.path.dirname(__file__), "models", "saved")
    has_fraud_model = os.path.exists(os.path.join(models_dir, "fraud_detector.joblib"))
    has_network_model = os.path.exists(os.path.join(models_dir, "network_anomaly.joblib"))
    has_data = os.path.exists(os.path.join(os.path.dirname(__file__), "data", "processed", "transactions_enriched.csv"))

    return {
        "status": "healthy",
        "models_loaded": {
            "fraud_detector": has_fraud_model,
            "network_anomaly": has_network_model,
        },
        "data_available": has_data,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
