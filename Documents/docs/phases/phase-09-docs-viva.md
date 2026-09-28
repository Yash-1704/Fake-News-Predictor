# Phase 9: Docs, results, and viva preparation

**Goal:** a submission-ready repository, report material, and demo/viva readiness (Milestone M5).
**Prerequisites:** Phase 8 done.

## Tasks
1. **Finalize `README.md`:** problem statement, features, architecture diagram, dataset (source, license, rows, class balance), NLP pipeline, models compared (table from `experiments.csv`), final model, in-domain vs cross-dataset results, screenshots of the UI, how to run, limitations, future scope.
2. **Figures** copied/exported to `docs/figures/`: class distribution, model comparison, confusion matrix, top features (before/after cleaning), UI screenshots.
3. **`docs/REPORT_NOTES.md`:** bullet material for the report chapters: Introduction, Literature (2 to 3 sources you actually read), Methodology, Implementation, Results, Limitations, Conclusion. Every number must trace to a file in `ml/reports/`.
4. **`docs/VIVA_PREP.md`:** your own answers (not the agent's) to these, in 2 to 4 sentences each:
   - What is TF-IDF? Why not just word counts?
   - Why logistic regression? How is it different from NB and SVM?
   - Why did you split the data, and why stratify?
   - What is precision vs recall for the FAKE class? Which matters more here?
   - What is data leakage? What leaked in ISOT and how did you find it?
   - Why does accuracy drop on the second dataset?
   - Is your app a fact-checker? Why not?
   - What does the model score mean, and why is it not a probability of truth?
   - Why a `Pipeline`? What would go wrong without it?
   - Why FastAPI and CORS? What does the lifespan do?
   - How would you improve this (BERT, more data, calibration, explainability)?
   - What are the ethical risks of deploying a fake-news classifier?
5. **Demo script (3 to 5 minutes):** show the UI with a sample, show `/docs`, show the top-features insight, show the cross-dataset table, state limitations honestly.
6. **PPT outline (about 12 slides):** title; problem; scope and non-goals; dataset; pipeline; models and experiments; leakage finding; results; architecture; live demo; limitations and future work; conclusion.
7. Final tag: `git tag v1.0`.

## Definition of Done
- [ ] README has no placeholders and every number is traceable to `ml/reports/`
- [ ] `VIVA_PREP.md` answers are written in your own words
- [ ] Screenshots and figures exist in `docs/figures/`
- [ ] You can run the demo twice without help from an agent

## Pitfalls
- Do not let an agent write claims like "state-of-the-art" or "high accuracy in the real world". Report the in-domain and cross-dataset results side by side.
- Do not include untested features in the README.

## Optional extension (only after everything above)
Compare against a fine-tuned or embedding-based transformer, add calibration, or add LIME/SHAP explanations. Record as a separate `phase-10` note if you do it.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-09-docs-viva.md. Draft README.md, docs/REPORT_NOTES.md and the PPT outline from the real files in ml/reports. Leave VIVA_PREP.md answers blank; I will write them.
