# Phase 5: Final model and prediction module

**Goal:** turn the chosen experiment into a reusable artifact and a tiny prediction API in Python (Milestone M3).
**Prerequisites:** Phase 4 done; `model_selection.md` names the final combination.

## Tasks
1. In `ml/src/pipeline.py`, add `build_final_pipeline()` that returns exactly the chosen configuration (no arguments needed).
2. Create `ml/src/train.py`:
   - load ISOT (cleaned), stratified split, fit `build_final_pipeline()` on train
   - evaluate on test and on the second dataset
   - save with `joblib.dump(pipeline, config.MODELS_DIR / "pipeline.joblib")`
   - write `ml/models/model_card.json` per `docs/ARCHITECTURE.md` (version string like `YYYY-MM-DD-lr-v1`, sklearn and Python versions from `sklearn.__version__` and `platform.python_version()`, real metrics)
   - print a summary
   Optional decision: refit on train+test before saving. If you do, log it in `DECISIONS.md` and keep the reported metrics from the train-only run.
3. Create `ml/src/predict.py`:
   ```python
   import joblib
   from ml.src import config

   class Predictor:
       def __init__(self, pipeline, card):
           self.pipeline, self.card = pipeline, card

       @classmethod
       def load(cls):
           path = config.MODELS_DIR / "pipeline.joblib"
           if not path.exists():
               raise FileNotFoundError(f"Model not found at {path}. Run: python -m ml.src.train")
           card = json.loads((config.MODELS_DIR / "model_card.json").read_text())
           return cls(joblib.load(path), card)

       def predict(self, text: str) -> dict:
           score = float(self.pipeline.predict_proba([text])[0][list(self.pipeline.classes_).index(config.FAKE)])
           label = config.LABEL_NAMES[config.FAKE if score >= 0.5 else config.REAL]
           return {"label": label, "fake_score": round(score, 4), "model_version": self.card["model_version"]}
   ```
   (Add the missing `json` import. Looking up `classes_` avoids assuming column order.)
4. Tests in `tests/test_predict.py`: model loads; output has the three keys; `fake_score` in [0, 1]; `label` consistent with score; a fresh Python process (subprocess) can load and predict (proves the pickle works from the repo root).
5. Update README quick start with the real train command.

## Files
`ml/src/{pipeline.py, train.py, predict.py}`, `ml/models/model_card.json` (committed), `ml/models/pipeline.joblib` (gitignored), `tests/test_predict.py`.

## Definition of Done
- [ ] `python -m ml.src.train` produces both files
- [ ] `python -c "from ml.src.predict import Predictor; print(Predictor.load().predict('Some sample article text about a city council vote on new budget rules.'))"` prints label, score, version
- [ ] `pytest tests/test_predict.py` passes
- [ ] `model_card.json` numbers match the Phase 4 reports

## Pitfalls
- Loading a joblib file executes pickled code; only load files you trained. Note this in the README.
- The scikit-learn version at serving time must equal the training version; pin it in `requirements.txt` after this phase (`pip freeze | grep -i scikit`).
- The 0.5 cutoff and label mapping must come from `config`, not magic numbers.

## Concepts to meet
Model persistence (joblib/pickle), train/serve consistency, predict vs predict_proba, model card.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-05-final-model.md. Do only Phase 5. The final combination is in ml/reports/model_selection.md.
