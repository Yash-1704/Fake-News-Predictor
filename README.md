# Fake News Detection Using NLP

A web app that classifies a pasted news article as **FAKE** or **REAL** using TF-IDF features and a scikit-learn classifier, served through FastAPI and a React UI.

> It is a **text classifier**, not a fact-checker. It predicts whether text resembles the fake or real articles in its training data. It does not verify claims.

## Stack

| Layer | Tech |
|---|---|
| ML / NLP | Python 3.11+, pandas, scikit-learn (`Pipeline`: cleaning, TF-IDF, classifier), joblib |
| Backend | FastAPI + Uvicorn |
| Frontend | React (Vite) + Tailwind CSS |
| Tooling | Git, venv, Jupyter, pytest |

## Repository layout

```text
fake-news-detection/
├── AGENTS.md              # rules every AI agent must follow (READ FIRST)
├── README.md
├── requirements.txt
├── .gitignore
├── .github/copilot-instructions.md
├── docs/
│   ├── SRS.md             # what we are building
│   ├── ARCHITECTURE.md    # how the pieces fit + contracts
│   ├── ROADMAP.md         # phase overview
│   ├── PROGRESS.md        # checklist, update after each phase
│   ├── DECISIONS.md       # decision log
│   ├── Learning.md        # human study guide: ML/NLP concepts explained (agents need not read)
│   ├── LEARNING_LOG.md    # your own notes per phase
│   └── phases/phase-00 ... phase-09
├── ml/                    # python package: data, training, prediction
│   ├── data/raw|processed # gitignored
│   ├── notebooks/
│   ├── src/               # config, data, preprocess, train, predict, ...
│   ├── models/            # pipeline.joblib (gitignored) + model_card.json
│   └── reports/           # metrics, figures, error analysis (committed)
├── backend/               # FastAPI app
├── frontend/              # React app
└── tests/
```

## How to work on this project (humans and agents)

1. Read `AGENTS.md`, then `docs/ARCHITECTURE.md`.
2. Open `docs/PROGRESS.md` and find the first unfinished phase.
3. Open that phase file in `docs/phases/`. Do **only** that phase.
4. Verify every item under "Definition of Done", then tick it in `PROGRESS.md`, add notes to `LEARNING_LOG.md`, and commit.
5. Start the next phase in a fresh agent session so context stays small.

## Quick start (fills in as phases complete)

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python -m ml.src.train           # after Phase 5: builds ml/models/pipeline.joblib
uvicorn backend.main:app --reload --port 8000   # after Phase 6
cd frontend && npm install && npm run dev        # after Phase 7
```

Run all Python commands from the **repository root** (module paths like `ml.src.train` depend on it).

## Results and limitations

Filled in during Phase 9 from real numbers in `ml/reports/`.
