# Phase 4: Experiments

**Goal:** compare preprocessing variants and classifiers fairly, using cross-validation, cross-dataset scores, and error analysis, then choose the final model with a written justification.
**Prerequisites:** Phase 3 done.

## Experiment grid
Preprocessing / features (all inside a Pipeline):
| ID | Setup |
|---|---|
| P1 | raw text, TF-IDF unigrams |
| P2 | `clean_text` + TF-IDF unigrams |
| P3 | `clean_text` + TF-IDF unigrams+bigrams (`ngram_range=(1,2)`, `min_df=3`) |
| P4 | P2 + `stop_words="english"` |

Classifiers:
| ID | Model |
|---|---|
| LR | `LogisticRegression(max_iter=1000)` |
| NB | `MultinomialNB()` (or `ComplementNB`) |
| SVM | `LinearSVC()` |

That is 12 combinations. Keep `max_features` fixed (e.g. 50,000, or `None` if memory allows) so comparisons are fair.

## Tasks
1. Create `ml/src/experiments.py` that loops over the grid and for each combination records:
   - 5-fold stratified CV on the **training** split: mean and std of F1 (FAKE)
   - one evaluation on the held-out **test** split: accuracy, precision, recall, F1
   - cross-dataset F1 on the second dataset
   - fit time in seconds
   Write `ml/reports/experiments.csv`. Print a sorted summary.
2. Notebook `ml/notebooks/03_experiments.ipynb`: load the CSV, draw a bar chart (in-domain F1 vs cross-dataset F1 per combination), save to `ml/reports/figures/model_comparison.png`.
3. **Error analysis** for the top 2 candidates: dump 20 false positives and 20 false negatives (with the text truncated to 300 chars) to `ml/reports/errors_<model>.csv`. Read them. In `ml/reports/error_analysis.md` describe 3 to 5 patterns you see (short texts, opinion pieces, satire, topic bias, odd formatting).
4. **Threshold check (optional):** for LR, plot precision/recall at different thresholds; note whether 0.5 is reasonable. Do not change the API contract's 0.5 unless you log it in `DECISIONS.md`.
5. **Choose the final model** with this rule, and write it in `ml/reports/model_selection.md`:
   1. highest cross-dataset F1,
   2. then highest CV F1 mean,
   3. then simpler/faster,
   4. must support `predict_proba` (LR does; for SVM you would need `CalibratedClassifierCV`, which adds complexity, so prefer LR unless SVM clearly wins).
6. Log the decision in `DECISIONS.md`.

## Files
`ml/src/experiments.py`, `ml/notebooks/03_experiments.ipynb`, `ml/reports/{experiments.csv, error_analysis.md, model_selection.md, errors_*.csv}`, `ml/reports/figures/model_comparison.png`.

## Definition of Done
- [ ] `experiments.csv` has 12 rows with all columns filled from a real run
- [ ] Test split was used once per combination and never for choosing among them (selection uses CV + cross-dataset)
- [ ] Error analysis with concrete examples exists
- [ ] `model_selection.md` names the final combination and why

## Pitfalls
- Do not tune hyperparameters on the test set.
- Do not add extra models or grid dimensions "to be thorough"; the grid above is enough.
- SVM has no `predict_proba`; do not compute probabilities from it without calibration.

## Concepts to meet
Cross-validation, stratification, overfitting, n-grams, stopwords, Naive Bayes vs LR vs SVM (one-paragraph intuition each), bias in evaluation.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-04-experiments.md. Do only Phase 4. Implement experiments.py first and run it on one combination to show me the output before running the full grid.
