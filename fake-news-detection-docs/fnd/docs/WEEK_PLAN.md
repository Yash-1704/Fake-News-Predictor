# 7-day plan (overrides the phase files where they conflict)

Context: free choice of dataset/model/frontend; about one week to finish. Assumes roughly 5 to 6 focused hours per day. Keep every phase's Definition of Done except where a cut is listed below.

## Decisions (already made, do not revisit)
- Dataset: ISOT (train/test) + one second article-style dataset for cross-dataset testing.
- Models: Logistic Regression, Multinomial NB, LinearSVC. Final model: prefer Logistic Regression unless another clearly wins.
- Frontend: React + Vite + Tailwind. No Streamlit, no Docker.

## Schedule
| Day | Phases | Target at end of day |
|---|---|---|
| 1 | 0 + 1 | Repo works; both datasets downloaded, verified, cleaned; EDA report written |
| 2 | 2 + start 3 | Baseline metrics printed (M1); top-30 features listed before cleaning |
| 3 | finish 3 | `clean_text` + tests; cleaned retrain; cross-dataset table (M2) |
| 4 | 4 (lite) + 5 | Comparison table + error analysis; `pipeline.joblib` + `Predictor` (M3) |
| 5 | 6 + start 7 | `/predict` working with tests; React app scaffolded and talking to it |
| 6 | finish 7 + 8 (lite) | UI complete with error states; clean-room run; consistency test (M4) |
| 7 | 9 (lite) | README with real numbers, screenshots, viva answers, PPT, demo rehearsal |

## Cuts
**Phase 4 (lite):**
- Experiment grid becomes 3 preprocessing variants (P1 raw, P2 cleaned, P3 cleaned + bigrams) x 3 models = 9 runs. Drop P4 (stopwords).
- 3-fold CV instead of 5-fold.
- Cross-dataset F1 is computed for every run (needed for model selection).
- Error analysis for the final model only (20 FP + 20 FN).
- Skip the threshold analysis.

**Phase 3:** one cleaning round (not two). Skip the reverse cross-dataset direction.

**Phase 8 (lite):** clean-room test, consistency test, and the manual test matrix limited to: normal article, too short, too long, backend stopped, model missing. Skip Makefile/scripts unless trivial. Skip pinned-version polish except scikit-learn.

**Phase 9 (lite):** README, figures, viva answers, 10 to 12 slide outline, demo script. Skip `REPORT_NOTES.md` unless your college requires a written report.

**Learning:** read only the Learning.md parts named in the schedule notes below, and answer the self-test questions on Day 7.

## Learning reads per day
- Day 1: Parts 1, 2, 3
- Day 2: Parts 4, 5.2, 6.1 to 6.2
- Day 3: Part 7
- Day 4: Parts 5.3 to 5.5, 6.4 to 6.6, 8, 9
- Day 5: Part 10
- Day 7: Parts 13, 15

## If you fall behind (cut in this order)
1. Drop NB or SVM from Phase 4 (keep LR + one other).
2. Drop the bigram variant.
3. Simplify the UI (no About section; keep the disclaimer).
4. Never cut: Phase 3 leakage/cross-dataset check, the disclaimer, the test that the API matches the Predictor.

## Rules for agents
Do only the phase and day scope listed here. Do not add features beyond the Cuts and Decisions above.
