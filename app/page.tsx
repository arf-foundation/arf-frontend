"""
ARF API Control Plane – Main entry point.
"""
import os
import sys
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.api import routes_incidents, routes_risk, routes_intents, routes_history, routes_governance
from app.core.config import settings
from app.api.deps import limiter
from agentic_reliability_framework.core.governance.risk_engine import RiskEngine

# ------------------------------------------------------------------------------
# Lifespan manager for startup/shutdown events (optional but clean)
# ------------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: can initialize resources here if needed (already done inline)
    print(">>> ARF API starting up...", flush=True)
    yield
    # Shutdown: clean up resources if any
    print(">>> ARF API shutting down...", flush=True)

# ------------------------------------------------------------------------------
# FastAPI app creation
# ------------------------------------------------------------------------------
app = FastAPI(
    title="ARF API Control Plane",
    version="0.3.0",
    description="Bayesian risk scoring and governance API for the Agentic Reliability Framework",
    lifespan=lifespan,
)

# ------------------------------------------------------------------------------
# CORS configuration – only allow the frontend domain
# ------------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "https://arf-frontend-sandy.vercel.app",  # Production frontend
    # Add any other domains (e.g., localhost for development) as needed:
    # "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],          # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],           # Allow all headers (including X-API-Key)
)

# ------------------------------------------------------------------------------
# Rate limiting
# ------------------------------------------------------------------------------
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# ------------------------------------------------------------------------------
# RiskEngine initialization (once, at startup)
# ------------------------------------------------------------------------------
hmc_model_path = os.getenv("ARF_HMC_MODEL", "models/hmc_model.json")
use_hyperpriors = os.getenv("ARF_USE_HYPERPRIORS", "false").lower() == "true"

print(">>> Initializing RiskEngine...", flush=True)
try:
    app.state.risk_engine = RiskEngine(
        hmc_model_path=hmc_model_path,
        use_hyperpriors=use_hyperpriors,
        n0=1000,
        hyperprior_weight=0.3
    )
    print(">>> RiskEngine initialized successfully.", flush=True)
except Exception as e:
    print(f">>> FATAL: RiskEngine initialization failed: {e}", flush=True)
    sys.exit(1)   # Fail fast – the API cannot run without the engine

# ------------------------------------------------------------------------------
# Include API routers
# ------------------------------------------------------------------------------
app.include_router(routes_incidents.router, prefix="/api/v1", tags=["incidents"])
app.include_router(routes_risk.router, prefix="/api/v1", tags=["risk"])
app.include_router(routes_intents.router, prefix="/api/v1", tags=["intents"])
app.include_router(routes_history.router, prefix="/api/v1", tags=["history"])
app.include_router(routes_governance.router, prefix="/api/v1", tags=["governance"])

# ------------------------------------------------------------------------------
# Prometheus metrics
# ------------------------------------------------------------------------------
Instrumentator().instrument(app).expose(app, include_in_schema=False, tags=["metrics"])

# ------------------------------------------------------------------------------
# Health check endpoint
# ------------------------------------------------------------------------------
@app.get("/health", tags=["health"])
async def health() -> Dict[str, str]:
    """Simple health check – used by monitoring and load balancers."""
    return {"status": "ok"}

# Optional: root redirect (optional)
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "ARF API is running. See /docs for documentation."}