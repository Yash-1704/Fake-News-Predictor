# Sample Articles and Answer Key

These are the same three sample texts offered by the website. Paste each into the article box and select **Analyse**. The answer key records the saved model's actual output; it is not a fact-check or a statement that the article is true or false.

Model version used: `2026-09-28-lr-v1`.

| Website sample    | Model label | Raw fake score | Score shown in UI |
| ----------------- | ----------- | -------------: | ----------------: |
| Sample: Real news | REAL        |         0.1975 |               20% |
| Sample: Fake news | FAKE        |         0.9422 |               94% |
| Sample: Opinion   | FAKE        |         0.7281 |               73% |

## 1. Sample: Real news

> The Federal Reserve held interest rates steady on Wednesday while signalling it still expects to cut borrowing costs later this year, as policymakers look for more evidence that inflation is on a sustainable path toward their 2% target. Fed Chair Jerome Powell said at a press conference that the committee remains attentive to inflation risks and will carefully assess incoming data before making any further changes.

**Model answer:** REAL, fake score `0.1975` (shown as 20%).

## 2. Sample: Fake news

> BREAKING: Scientists at a secret underground lab have confirmed that chemtrails contain mind-control chemicals approved by the deep state government to keep citizens docile. Leaked documents obtained by whistleblowers prove that major airlines are paid $50,000 per flight to spray these substances. Share this before it gets deleted!

**Model answer:** FAKE, fake score `0.9422` (shown as 94%).

## 3. Sample: Opinion

> The government has once again failed the working class with its latest budget proposal. While billionaires enjoy record tax cuts, ordinary families are left struggling to pay rent and put food on the table. The so-called economic growth touted by politicians is nothing but smoke and mirrors designed to hide the widening inequality gap that is tearing society apart.

**Model answer:** FAKE, fake score `0.7281` (shown as 73%).

## Reading the Score

The fake score is the model's uncalibrated score for the FAKE class. The UI rounds it to a whole percent. Neither the score nor the label establishes whether an article's claims are true; the classifier recognizes patterns learned from its training data.
