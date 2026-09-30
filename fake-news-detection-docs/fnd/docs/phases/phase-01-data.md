# Phase 1: Data

**Goal:** one clean, verified, deduplicated dataset saved to disk, plus a short EDA report. No model yet.
**Prerequisites:** Phase 0 done.

## Dataset
Default: **ISOT Fake News Dataset**, two files `Fake.csv` and `True.csv` with columns `title, text, subject, date`. Get it from the University of Victoria ISOT page or Kaggle (mirror). Check the license/terms and note them in `ml/reports/eda_summary.md`. If your college specified a dataset, use it and adapt the steps.
Place files in `ml/data/raw/isot/`. (Gitignored.)

Also download the **second dataset** now (used in Phase 3): pick an article-style English fake/real dataset with a different origin (for example WELFake on Kaggle). Place it in `ml/data/raw/second/`. **Verify its label meaning yourself** by reading 10 rows per class; some Kaggle fake-news datasets have confusing or inverted label documentation.

## Tasks
1. Notebook `ml/notebooks/01_eda.ipynb` (kernel `fnd`). Load both files, add `label` (Fake.csv -> `config.FAKE`, True.csv -> `config.REAL`), concatenate.
2. Inspect and record: shape, columns, dtypes, missing values, empty/whitespace-only `text`, duplicate rows, duplicate `text`, class balance, text length distribution per class (chars and words), value counts of `subject` and `date` per class.
3. **Read 10 random articles per class** in full. Write down what you notice (style, formatting, source hints).
4. Check for label-revealing artifacts and record counts per class:
   - share of REAL articles containing `(Reuters)`
   - share of articles by class that contain "via" / "featured image" / "21st Century Wire" / twitter.com / http
   - `subject` values by class (in ISOT the subject categories barely overlap between classes, so **do not use `subject` or `date` as features**)
5. Build `content = title + " " + text` (strip, collapse whitespace). Drop rows with empty content and duplicate `content`.
6. Implement `ml/src/data.py`:
   ```python
   def load_isot() -> pd.DataFrame:      # columns: content, label, source_dataset
   def load_second() -> pd.DataFrame:    # same columns, labels harmonized to FAKE=1
   def train_test(df):                   # stratified split using config.TEST_SIZE / RANDOM_STATE
   ```
   `load_*` must be deterministic, use `config` paths and constants, and never touch `subject`/`date` downstream.
7. Save `ml/data/processed/isot_clean.csv` and `second_clean.csv`.
8. Save figures (class balance, length histogram) to `ml/reports/figures/`.
9. Write `ml/reports/eda_summary.md`: dataset source and license, row counts before/after cleaning, class balance, duplicates removed, artifact observations, label verification notes for both datasets.

## Files
`ml/notebooks/01_eda.ipynb`, `ml/src/data.py`, `ml/data/processed/*.csv`, `ml/reports/eda_summary.md`, `ml/reports/figures/*.png`.

## Definition of Done
- [ ] `python -c "from ml.src.data import load_isot; d=load_isot(); print(d.shape, d.label.value_counts().to_dict())"` works
- [ ] No duplicate `content`, no empty content, both classes present
- [ ] Second dataset loads with `FAKE=1` and you manually confirmed the labels
- [ ] `eda_summary.md` contains real numbers, including the Reuters/artifact counts

## Pitfalls
- Duplicated articles across classes or splits inflate scores. Dedupe **before** splitting.
- Reading `Fake.csv` can fail on encoding; try `encoding="utf-8"` and `on_bad_lines="skip"` only if needed and log how many rows are lost.
- Do not "fix" leakage yet; only measure it. Phase 3 handles it.

## Concepts to meet
DataFrame, missing values, class balance, deduplication, data leakage (first look), stratified split.

## Kickoff prompt
> Read AGENTS.md and docs/phases/phase-01-data.md. Do only Phase 1. I have placed the datasets in ml/data/raw/isot and ml/data/raw/second. Ask me if column names differ from the phase file. Do not train any model.
