# Demo Script (3 to 5 Minutes)

Use the local setup in `README.md`. Start the backend and frontend, then open `http://localhost:5173`. Keep the API docs at `http://localhost:8000/docs` available in another tab. Do not present the model as a fact-checker.

## 0:00–0:30 | Introduce the task

“This is a text-pattern classifier. It predicts the FAKE or REAL dataset label from an article's words; it does not verify claims or sources.” Point out the disclaimer in the interface.

## 0:30–1:20 | Run a sample

Select **Sample: Real news**, choose **Analyse**, and show the result card, score label, and model version. Explain that the score is an uncalibrated model score, not a probability of truth.

## 1:20–1:50 | Show the API

Open `/docs`, expand `POST /predict`, and show the request body and response fields. Briefly note `/health` and `/model-info`.

## 1:50–2:40 | Show the learned features

Open `Documents/figures/top_features_baseline.png` and `top_features_cleaned.png`. Explain that the baseline assigned strong weights to publisher/formatting markers such as `reuters`, `via`, and `featured`, and cleaning removed those specific artifacts from the cleaned model's strongest terms.

## 2:40–3:40 | Compare evaluation results

Show the README results table and `Documents/figures/model_comparison.png`. State the ISOT held-out and second-dataset P2_LR results side by side: F1 97.62% and 69.13%. Mention that P1_LR's 69.63% cross-dataset score retained raw publisher artifacts, so score alone did not decide selection.

## 3:40–4:30 | State limits and close

Mention the out-of-domain drop, dataset/source bias, short-text and topic errors, and the absence of claim verification. Close by saying what would be evaluated next (newer/source-held-out data, calibration, or a transformer comparison); do not imply those extensions are implemented.
