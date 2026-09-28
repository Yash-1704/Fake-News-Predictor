# Phase 3: Leakage and generalization check

**Goal:** find out whether the model learned real writing signal or dataset artifacts, remove obvious artifacts, and measure performance on a different dataset (Milestone M2). This phase is what makes the project credible.
**Prerequisites:** Phase 2 done.

## Tasks
### A. Inspect what the model learned
1. Notebook `ml/notebooks/02_leakage.ipynb`. Fit the baseline pipeline on train. Get feature names from `tfidf.get_feature_names_out()` and coefficients from `clf.coef_[0]`.
2. List the **top 30 features for FAKE (largest positive)** and **top 30 for REAL (largest negative)**. Save to `ml/reports/top_features_baseline.csv`.
3. Mark features that are artifacts rather than meaning: `reuters`, city datelines (`washington`, `london`), `21st century wire`, `featured image`, `via`, `getty`, `twitter`, `pic`, URLs, weekday names, etc. Write your observations in `ml/reports/leakage_report.md`.

### B. Clean and retrain
4. Create `ml/src/preprocess.py` with `clean_text(text: str) -> str`. Keep it simple, deterministic, and fast. Suggested steps, each a small regex with a comment:
   - remove leading dateline + agency tag, e.g. `^[A-Z][A-Za-z .,/'-]{1,40}\(Reuters\)\s*-?\s*`
   - remove any remaining `(Reuters)`
   - remove URLs, `pic.twitter.com/...`, `@handles`
   - remove phrases like `featured image via ...`, `21st century wire says ...` (only the ones you actually saw in step 3)
   - collapse whitespace
   Lowercase the result as the **last** step of `clean_text`. If `clean_text` is passed as `TfidfVectorizer(preprocessor=...)`, it replaces sklearn's default preprocessing (which is what lowercases), so nothing else will lowercase for you. Run the regexes that rely on capital letters (the dateline pattern) *before* lowercasing.
5. Add a `build_pipeline(clean=True, ngram_range=(1,1), stop_words=None, classifier=None)` to `pipeline.py` that puts `clean_text` in the TF-IDF `preprocessor` argument or a `FunctionTransformer` first step (it must live inside the Pipeline).
6. Retrain on the same split. Compare before/after in-domain metrics and re-list top features. Save `top_features_cleaned.csv`.
7. Repeat 4 to 6 once more if obvious artifacts remain. Stop after two rounds; perfection is not the goal.

### C. Cross-dataset evaluation
8. Load the second dataset via `data.load_second()`. Train on ISOT (train split), **test on the entire second dataset**. Do this for both the baseline pipeline and the cleaned pipeline.
9. Also do the reverse once if time allows (train on second, test on ISOT).
10. Save `ml/reports/cross_dataset.json` and add a table to `leakage_report.md`:

| Model | ISOT test F1 | Second-dataset F1 | Drop |
|---|---|---|---|
| baseline | real number | real number | |
| cleaned | real number | real number | |

Expect a large drop. That is a finding, not a failure. Explain it in the report (different sources, topics, time periods, writing styles).

## Files
`ml/notebooks/02_leakage.ipynb`, `ml/src/preprocess.py`, `ml/src/pipeline.py` (extended), `ml/reports/{top_features_*.csv, leakage_report.md, cross_dataset.json}`.

## Definition of Done
- [ ] Top-feature lists exist before and after cleaning
- [ ] `clean_text` has unit tests in `tests/test_preprocess.py` (at least 5 cases, including one with a Reuters dateline)
- [ ] Cross-dataset numbers exist for both pipelines
- [ ] `leakage_report.md` explains in plain language what leaked, what you removed, and what the cross-dataset drop means
- [ ] Nothing in `clean_text` uses the label

## Pitfalls
- Do not remove words just because they hurt the score; remove only things you can justify as source artifacts.
- Second dataset must be mapped to `FAKE=1`; re-check the label direction if the cross-dataset score is far below chance (a score near 0 recall on FAKE hints at inverted labels).
- Threshold, tuning and model swaps belong to Phase 4.

## Concepts to meet
Data leakage, spurious correlations, coefficients as feature importance, domain shift, generalization vs memorization.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-03-leakage-generalization.md. Do only Phase 3. First show me the top 30 features per class before changing anything, and wait for my review before writing clean_text.
