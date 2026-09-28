import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from ml.src.predict import Predictor
from backend.schemas import PredictRequest, PredictResponse

DISCLAIMER = "Automated model prediction based on writing patterns; not a fact-check."

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager that loads the trained Predictor artifact
    once at startup into app.state.predictor.
    """
    try:
        app.state.predictor = Predictor.load()
        logger.info("Successfully loaded Predictor artifact.")
    except FileNotFoundError:
        app.state.predictor = None
        logger.warning("Predictor artifact not found at startup.")
    yield


app = FastAPI(title="Fake News Detection API", lifespan=lifespan)

# Enable CORS for frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware logging request path, HTTP method, status code, and latency.

    Why: Keeps server access logs clean and privacy-compliant by explicitly NOT logging input article text.
    """
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000  # in ms
    logger.info(
        f"path={request.url.path} method={request.method} status={response.status_code} latency={process_time:.2f}ms"
    )
    return response


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
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed.")
    return {**result, "disclaimer": DISCLAIMER}
