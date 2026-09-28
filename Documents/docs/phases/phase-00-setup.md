# Phase 0: Setup and skeleton

**Goal:** an empty but organized project where Python imports work and Git is initialized.
**Prerequisites:** Python 3.11+, Git, VS Code. Node is needed later (Phase 7).

## Tasks
1. Create the folders (some can hold a `.gitkeep`):
   ```text
   ml/data/raw  ml/data/processed  ml/notebooks  ml/src  ml/models  ml/reports
   backend  frontend  tests
   ```
2. Create empty `ml/__init__.py` and `ml/src/__init__.py` (makes `python -m ml.src.x` work).
3. Create the venv and install: `python -m venv .venv`, activate it, `pip install -r requirements.txt`.
4. Register the Jupyter kernel: `python -m ipykernel install --user --name fnd`.
5. Create `ml/src/config.py`:
   ```python
   from pathlib import Path

   ROOT = Path(__file__).resolve().parents[2]
   DATA_RAW = ROOT / "ml" / "data" / "raw"
   DATA_PROCESSED = ROOT / "ml" / "data" / "processed"
   MODELS_DIR = ROOT / "ml" / "models"
   REPORTS_DIR = ROOT / "ml" / "reports"

   RANDOM_STATE = 42
   TEST_SIZE = 0.2

   FAKE = 1
   REAL = 0
   LABEL_NAMES = {FAKE: "FAKE", REAL: "REAL"}

   MIN_TEXT_CHARS = 20
   MAX_TEXT_CHARS = 20_000
   ```
6. `git init`, confirm `.gitignore` exists, make the first commit.

## Files
`ml/__init__.py`, `ml/src/__init__.py`, `ml/src/config.py`, folder skeleton.

## Definition of Done
- [ ] `python -c "import pandas, sklearn, fastapi; from ml.src import config; print(config.ROOT)"` prints the repo root
- [ ] `git status` is clean after the first commit; `.venv` is not tracked
- [ ] `requirements.txt` installs without errors

## Out of scope
Any data, model, API, or React code.

## Concepts to meet
Virtual environments, Python packages/`-m` execution, `.gitignore`.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-00-setup.md. Do only Phase 0. Show me the verification command outputs when done.
