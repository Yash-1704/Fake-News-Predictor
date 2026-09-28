# Progress tracker

Update after each phase. An agent must find the first unchecked phase here.

- [x] Phase 0: Setup and skeleton
- [x] Phase 1: Data
- [x] Phase 2: Baseline model
- [x] Phase 3: Leakage and generalization check
- [x] Phase 4: Experiments
- [x] Phase 5: Final model and prediction module
- [x] Phase 6: Backend API

- [x] Phase 7: Frontend
- [x] Phase 8: Integration and hardening
- [ ] Phase 9: Docs, results, viva

## Key numbers (fill from real runs)

| Item                               | Value                                                     |
| ---------------------------------- | --------------------------------------------------------- | ------------- |
| Dataset(s) used                    | ISOT Fake News & Kaggle Fake/Real News                    |
| Rows after cleaning                | ISOT: 39,100                                              | Kaggle: 6,305 |
| Majority-class baseline accuracy   | 54.21%                                                    |
| Baseline in-domain F1              | 98.07%                                                    |
| In-domain F1 after leakage cleanup | 97.62%                                                    |
| Cross-dataset F1                   | 69.13%                                                    |
| Final model                        | P2_LR (clean_text + TF-IDF unigrams + LogisticRegression) |

## Notes / blockers

- Phase 0 complete: Project root configured, virtual environment active, dependencies installed, git initialized.
- Phase 1 complete: Built `ml/src/data.py` (`load_isot()`, `load_second()`, `train_test()`), cleaned and deduplicated ISOT (39,100 rows) & Kaggle Fake/Real (6,305 rows), generated figures and `ml/reports/eda_summary.md` with empirical artifact leakage counts.
- Phase 2 complete: Trained TF-IDF + LogisticRegression baseline model on ISOT. Reached 98.25% accuracy and 98.07% F1 score (vs 54.21% majority baseline accuracy).
- Is this 98.07% score believable? No. The unnaturally high score is driven by publisher-specific text artifacts like `(Reuters)` and `"via"` in ISOT text, which Phase 3 will test and strip.
- Phase 3 complete: Created `clean_text` to strip publisher artifacts (`(Reuters)`, `via`, `featured image`, URLs). Baseline model evaluated on a completely unseen Kaggle dataset dropped from ~98% F1 to ~69% F1, proving the model was relying heavily on spurious correlations and publisher artifacts rather than true language semantics.
- Phase 4 complete: Evaluated 12 preprocessing/classifier combinations on 5-fold CV, held-out test split, and cross-dataset benchmark. `P2_LR` selected as the final model pipeline (Cross-dataset F1: 69.13%, CV F1: 97.70%, Test F1: 97.62%, native `predict_proba`).
- Phase 5 complete: Added `build_final_pipeline()`, implemented `ml/src/train.py`, serialized `ml/models/pipeline.joblib` and `ml/models/model_card.json`, built `Predictor` class in `ml/src/predict.py`, verified with unit and subprocess tests in `tests/test_predict.py` (5/5 passed).
- Phase 6 complete: Implemented FastAPI backend service (`backend/main.py`, `backend/schemas.py`, `backend/README.md`) with `/health`, `/model-info`, `/predict`, CORS, lifespan model loading, Pydantic validation, and comprehensive tests in `tests/test_api.py` (16/16 total repo tests passed).
- Phase 7 complete: Scaffolded React + Vite frontend (`frontend/`), added `/api` proxy to Vite config, implemented `api.js`, `NewsForm`, `ResultCard`, `ErrorBanner`, and `About` components. Premium dark-theme CSS. `npm run build` passes (227 kB JS, 6.7 kB CSS). API proxy verified via curl.
- Next: Phase 8 (Integration and hardening).
- Phase 8 dependency snapshot regenerated with `.venv/bin/pip freeze`; required FastAPI, Uvicorn, scikit-learn, pandas, Pydantic, pytest, and httpx pins are present.
- Phase 8 README now documents the venv setup, both Kaggle dataset links, exact gitignored CSV paths, recorded license wording, fresh-clone training, `npm install`, and `bash scripts/dev.sh`.
- Phase 8 consistency check is present for five fixed texts and compares Predictor/API labels and scores; covered by the passing test suite.
- Phase 8 request middleware logs path, method, status, and latency without formatting or logging request/article text.
- Phase 8 manual matrix in `Documents/docs/TESTING.md` records the clean-room run and the five requested cases; the browser limit case was hardened and all cases passed.
- Phase 8 Python verification after dependency regeneration: `.venv/bin/python -m pytest -q` passed (17 tests; one Starlette/httpx deprecation warning).
- Phase 8 clean-room rerun passed using user-approved copies of the three raw CSVs at the README paths; venv dependencies, frontend install/build, training, and both-server startup succeeded.
- Phase 8 clean-room model-card metric dictionaries exactly match the working tree: in-domain and cross-dataset accuracy, precision, recall, and F1 are identical.
- Phase 8 over-limit form hardening removes silent truncation; 20,001 characters now show a red counter and maximum-length hint and disable Analyse. API rejects 20,001 characters with HTTP 422.
- Phase 8 clean-room suite: `.venv/bin/python -m pytest -q` passed (17 tests; one Starlette/httpx deprecation warning); frontend builds passed in both worktrees.
- Phase 8 clean-room missing-model check passed on 2026-09-28: `/health` reported `model_loaded: false`, `/predict` returned 503, and the UI showed its model-unavailable message; servers were stopped afterward.
- Phase 8 clean-room backend-stopped check passed: Vite remained available and the UI displayed the friendly backend connection error.
- Phase 8 temporary clone, including copied datasets and generated model, was removed after verification; no datasets or model files were added to the worktree.

### Phase 8 handoff

- Phase 8 integration and hardening is complete; clean-room startup was verified using the approved local CSV copy procedure.
- All five requested manual cases passed; the clean-room model-card metrics match the working model card exactly.
- The temporary clean-room folder and its generated artifacts were removed; next phase is Phase 9.
- Human: add your own Phase 8 entry to `Documents/docs/LEARNING_LOG.md`.
