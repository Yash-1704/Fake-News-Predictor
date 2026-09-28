# Phase 6: Backend API (FastAPI)

**Goal:** an HTTP service that wraps `Predictor`, with validation, CORS, error handling, and tests.
**Prerequisites:** Phase 5 done.
Coming from Express? Mapping: routes = `app.get/post`; Pydantic models = request validation; `CORSMiddleware` = `cors()`; lifespan = startup code; `/docs` = free Swagger UI.

## Tasks
1. `backend/__init__.py` (empty), `backend/schemas.py`:
   ```python
   from typing import Literal
   from pydantic import BaseModel, Field, field_validator
   from ml.src import config

   class PredictRequest(BaseModel):
       text: str = Field(..., max_length=config.MAX_TEXT_CHARS)

       @field_validator("text")
       @classmethod
       def long_enough(cls, v: str) -> str:
           if len(v.strip()) < config.MIN_TEXT_CHARS:
               raise ValueError(f"Text must have at least {config.MIN_TEXT_CHARS} characters.")
           return v

   class PredictResponse(BaseModel):
       label: Literal["FAKE", "REAL"]
       fake_score: float
       model_version: str
       disclaimer: str
   ```
2. `backend/main.py`:
   ```python
   from contextlib import asynccontextmanager
   from fastapi import FastAPI, HTTPException, Request
   from fastapi.middleware.cors import CORSMiddleware
   from ml.src.predict import Predictor
   from backend.schemas import PredictRequest, PredictResponse

   DISCLAIMER = "Automated model prediction based on writing patterns; not a fact-check."

   @asynccontextmanager
   async def lifespan(app: FastAPI):
       try:
           app.state.predictor = Predictor.load()   # load once, not per request
       except FileNotFoundError:
           app.state.predictor = None
       yield

   app = FastAPI(title="Fake News Detection API", lifespan=lifespan)
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],
       allow_methods=["GET", "POST"],
       allow_headers=["Content-Type"],
   )

   def get_predictor(request: Request) -> Predictor:
       p = request.app.state.predictor
       if p is None:
           raise HTTPException(503, "Model not available. Train it first.")
       return p

   @app.get("/health")
   def health(request: Request):
       return {"status": "ok", "model_loaded": request.app.state.predictor is not None}

   @app.get("/model-info")
   def model_info(request: Request):
       return get_predictor(request).card

   @app.post("/predict", response_model=PredictResponse)
   def predict(body: PredictRequest, request: Request):
       predictor = get_predictor(request)
       try:
           result = predictor.predict(body.text)
       except Exception:
           # log the traceback server-side; do not leak internals to the client
           import logging; logging.exception("prediction failed")
           raise HTTPException(500, "Prediction failed.")
       return {**result, "disclaimer": DISCLAIMER}
   ```
   (Use plain `def`, not `async def`, for CPU-bound prediction, so FastAPI runs it in a threadpool.)
3. `backend/README.md`: run command `uvicorn backend.main:app --reload --port 8000` from the repo root, plus example `curl`.
4. `tests/test_api.py` with `fastapi.testclient.TestClient` (use `with TestClient(app) as client:` so lifespan runs):
   - `/health` 200
   - valid `/predict` 200 with schema keys
   - empty string, 5 characters, whitespace-only, 20,001 characters, missing field, wrong type: all 422
   - simulated missing model (set `app.state.predictor = None`): 503
5. Manually try it in `http://localhost:8000/docs`.

## Files
`backend/{__init__.py, main.py, schemas.py, README.md}`, `tests/test_api.py`.

## Definition of Done
- [ ] `pytest` passes for the whole repo
- [ ] `curl -X POST localhost:8000/predict -H "Content-Type: application/json" -d '{"text":"<a normal paragraph>"}'` returns the documented JSON
- [ ] Invalid inputs return 422 with a readable `detail`
- [ ] Backend contains no ML logic beyond calling `Predictor`

## Pitfalls
- Running `uvicorn main:app` from inside `backend/` breaks the `ml.src` imports; run from the repo root.
- CORS errors appear only in the browser, not in curl or `/docs`.
- Do not enable `allow_origins=["*"]` together with credentials.

## Concepts to meet
REST endpoints, Pydantic validation, HTTP status codes, CORS, app lifespan (load once), threadpool vs async.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-06-backend.md. Do only Phase 6. Do not modify anything under ml/ except by asking me first.
