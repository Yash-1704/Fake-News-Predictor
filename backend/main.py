import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from ml.src.predict import Predictor
from backend.schemas import PredictRequest, PredictResponse

DISCLAIMER = "Automated model prediction based on writing patterns; not a fact-check."


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager that loads the trained Predictor artifact
    once at startup into app.state.predictor.
    """
    try:
        app.state.predictor = Predictor.load()
    except FileNotFoundError:
        app.state.predictor = None
    yield


app = FastAPI(title="Fake News Detection API", lifespan=lifespan)

# Enable CORS for frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


def get_predictor(request: Request) -> Predictor:
    """Helper to retrieve the loaded Predictor from app.state, raising 503 if unavailable."""
    p = request.app.state.predictor
    if p is None:
        raise HTTPException(status_code=503, detail="Model not available. Train it first.")
    return p


@app.get("/health")
def health(request: Request):
    """Healthcheck endpoint reporting service status and model readiness."""
    return {"status": "ok", "model_loaded": request.app.state.predictor is not None}


@app.get("/model-info")
def model_info(request: Request):
    """Returns model card metadata dictionary."""
    return get_predictor(request).card


@app.post("/predict", response_model=PredictResponse)
def predict(body: PredictRequest, request: Request):
    """Predicts fake news score and label for input text.
    
    Why: Uses a plain def function so FastAPI automatically delegates ML inference execution
    to an asynchronous threadpool, ensuring CPU-bound tokenization/classification does not block
    the main event loop.
    """
    predictor = get_predictor(request)
    try:
        result = predictor.predict(body.text)
    except Exception:
        logging.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed.")
    return {**result, "disclaimer": DISCLAIMER}
