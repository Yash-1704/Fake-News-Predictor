# Extension: 2-day plan

Adds auth, an LLM fact-check feature, a news feed, and weekly emails on top of the
finished NLP project. Stack for the new work: **Node/Express + MongoDB**, calling
the existing FastAPI service for NLP predictions and the Groq API for fact-checking.
The Python model and FastAPI service are untouched.

## Reality check
Two days is enough for auth + news feed + fact-check with a working demo. The
weekly email is the first thing to cut if you fall behind — it does not block
anything else and is graded less on "does it look polished" than the other three.

## Order (do not reorder)
| # | Phase | Day | Cuttable? |
|---|---|---|---|
| 10 | Node/Express + MongoDB setup, talks to FastAPI | 1 (morning) | No |
| 11 | Auth: register/login, guest vs logged-in gating | 1 (morning/midday) | No |
| 12 | News feed: fetch, cache, serve, basic React page | 1 (afternoon) | Trim to headlines-only if short on time |
| 13 | Fact-check: Groq + your own news-context retrieval, cached | 1 evening → 2 morning | No — this is the headline feature |
| 14 | Frontend integration: auth UI, gated fact-check, feed page, polish | 2 (afternoon) | Trim styling, keep function |
| 15 | Weekly email: popularity tracking + Nodemailer + cron | 2 (evening) | **Cut first if behind** |

## Decisions (don't re-litigate mid-build)
- **LLM: Groq**, not Gemini. Reason: Groq's free daily caps are far higher (used
  here: `llama-3.1-8b-instant`, ~14,400 requests/day per Groq's published limits)
  than Gemini's current free API tier (measured around 20/day on a fresh key,
  unpublished, and shrinking). Verify your own dashboard if numbers seem off —
  free tiers change without notice.
- **No paid "grounding."** Gemini/Google's official web-grounding tool costs money
  per request. Instead: fetch a few real, recent articles about the same topic
  from the news API (Phase 12) and hand them to the LLM as context before asking
  it to reason. This is free and reuses infrastructure you're building anyway.
- **News API: GNews.io.** ~100 requests/day free, no credit card. Cache every
  response in MongoDB and refresh on a timer (Phase 12), never fetch per user
  request — 100/day would not survive a live demo otherwise.
- **Cache every fact-check result** by a hash of the article text. Same reason:
  Groq's quota is generous but not infinite, and repeat lookups should be instant
  and free.
- **Auth: JWT in an httpOnly cookie**, bcrypt for passwords. No sessions, no
  OAuth — out of scope for two days.
- **Email: Gmail SMTP via Nodemailer** for the demo. Fine at this scale; note in
  the README that Gmail's daily send cap makes it unsuitable beyond a small
  registered-user list.

## Files this adds
```text
Fake-News-Detection/
├── server/                      # NEW — Node/Express app
│   ├── src/
│   │   ├── config.js
│   │   ├── db.js
│   │   ├── models/ (User, Check, NewsItem)
│   │   ├── middleware/auth.js
│   │   ├── routes/ (auth, predict, factcheck, news)
│   │   ├── services/ (fastapiClient, groqClient, newsApiClient, mailer)
│   │   ├── jobs/weeklyDigest.js
│   │   └── app.js / server.js
│   ├── .env.example
│   └── package.json
├── frontend/src/                # EXTENDED — existing React app
│   ├── pages/Login.jsx, Register.jsx, NewsFeed.jsx
│   └── components/FactCheckPanel.jsx
```
`backend/` (FastAPI) and `ml/` are unchanged. React now calls `server/` (Express)
only; Express calls FastAPI internally for `/predict`.

## Setup instructions to add to AGENTS.md and PROGRESS.md
Append this once, before starting Phase 10:
```markdown
## Extension phases (10–15)
See docs/TWO_DAY_PLAN.md and docs/ARCHITECTURE_EXT.md. Read order for these
phases: TWO_DAY_PLAN.md → ARCHITECTURE_EXT.md → the current phase file.
Do not read the Phase 0–9 ML phase files unless a task touches ml/ or backend/.
```
And to PROGRESS.md:
```markdown
- [ ] Phase 10: Node/Express + MongoDB setup
- [ ] Phase 11: Auth
- [ ] Phase 12: News feed
- [ ] Phase 13: Fact-check (Groq)
- [ ] Phase 14: Frontend integration
- [ ] Phase 15: Weekly email (optional, cut first if short on time)
```
