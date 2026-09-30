# Extension architecture and contracts

```text
React (:5173) → Express (:4000) → FastAPI (:8000) → sklearn pipeline
                       │
                       ├──→ MongoDB (users, checks, news cache)
                       ├──→ Groq API (fact-check reasoning)
                       ├──→ GNews API (news feed + fact-check context)
                       └──→ Gmail SMTP via Nodemailer (weekly digest)
```
React no longer calls FastAPI directly. Express is the only public API. FastAPI
stays internal (bind to `127.0.0.1` or keep it firewalled if you deploy).

## Environment variables (`server/.env`, never committed)
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/fake-news-detection
JWT_SECRET=<random 32+ char string>
FASTAPI_URL=http://localhost:8000
GROQ_API_KEY=<your key>
GROQ_MODEL=llama-3.1-8b-instant
GNEWS_API_KEY=<your key>
SMTP_USER=<gmail address>
SMTP_APP_PASSWORD=<gmail app password, not your real password>
CLIENT_ORIGIN=http://localhost:5173
```
`server/.env.example` lists the same keys with placeholder values, committed.
Add `server/.env` and `server/node_modules` to `.gitignore`.

## MongoDB schema (Mongoose)
### User
| Field | Type | Notes |
|---|---|---|
| email | String, unique, lowercase | |
| passwordHash | String | bcrypt, never store plaintext |
| emailOptIn | Boolean, default true | weekly digest |
| createdAt | Date | default now |

### Check
One row per distinct article text ever submitted, by anyone.
| Field | Type | Notes |
|---|---|---|
| textHash | String, unique, indexed | sha256 of trimmed, lowercased article text |
| textPreview | String | first ~300 chars, for admin/debug only |
| nlpLabel | String | "FAKE" / "REAL", from FastAPI |
| nlpScore | Number | from FastAPI |
| factCheck | Object, nullable | `{ verdict, explanation, sources: [url], model, checkedAt }` |
| checkCount | Number, default 1 | incremented on every repeat submission |
| lastCheckedAt | Date | |

### NewsItem
| Field | Type | Notes |
|---|---|---|
| title, url, source, publishedAt | | from GNews |
| fetchedAt | Date | used to decide when to refresh |
| topic | String | the query used to fetch it, for fact-check context lookup |

## API contract (Express)
All responses `{ ...data }` on success; errors `{ "error": "message" }`.

| Method & path | Auth | Body / query | Response |
|---|---|---|---|
| `POST /api/auth/register` | none | `{email, password}` | `201 {email}` + sets cookie |
| `POST /api/auth/login` | none | `{email, password}` | `200 {email}` + sets cookie |
| `POST /api/auth/logout` | none | — | `200 {}`, clears cookie |
| `GET /api/auth/me` | optional | — | `200 {email}` or `200 {user: null}` |
| `POST /api/predict` | optional (guest allowed) | `{text}` | `200 {label, score, disclaimer}` — proxies FastAPI |
| `POST /api/factcheck` | **required** | `{text}` | `200 {verdict, explanation, sources, cached: bool}` |
| `GET /api/news` | optional | `?topic=` | `200 {items: [...]}` — from cache, refreshed by a background job, not per-request |

`POST /api/predict` and `POST /api/factcheck` both compute `textHash` and
upsert/increment the `Check` document — this is what feeds Phase 15's "most
popular" query, regardless of which feature was used.

## JWT / auth contract
- Cookie name: `token`, httpOnly, `sameSite=lax`, `secure` in production only.
- Payload: `{ userId, email }`, expiry 7 days.
- Middleware `requireAuth`: 401 `{error:"Login required"}` if missing/invalid.
- Middleware `attachUserIfPresent`: never blocks, just sets `req.user` when a
  valid cookie exists — used on `/predict` and `/news` so guests still work.

## Fact-check contract (the core new feature)
1. Hash the input text. If `Check.factCheck` already exists for that hash, return
   it immediately with `cached: true`. **Check this before calling Groq.**
2. Otherwise: extract a short topic/keyword string from the article (simplest:
   the first ~8 significant words of the title/first sentence).
3. Look up cached `NewsItem`s matching that topic (or fetch fresh from GNews if
   none cached recently — see Phase 12's refresh job).
4. Build a Groq prompt: the article text, plus the 2-4 retrieved news items
   (title + source + short snippet) as context, asking for a verdict
   (`likely true` / `likely false` / `unverifiable`), a short explanation, and
   which of the provided sources it used. Explicitly instruct the model to say
   "unverifiable" rather than guess when the context doesn't cover the claim.
5. Save the result on the `Check` document, return it.
6. **Never let a Groq or GNews failure crash the request.** On error, return
   `200 {verdict: "unavailable", explanation: "Fact-check service is
   temporarily unavailable.", cached: false}` and log the real error server-side.

## Weekly email contract (Phase 15)
- `node-cron` schedule, e.g. `0 9 * * 1` (Monday 9am).
- Query: top 5 `Check` documents by `checkCount` in the last 7 days
  (`lastCheckedAt >= now-7d`), sorted descending.
- Send one email per `User` with `emailOptIn: true`, listing those 5 with their
  label/verdict. Log successes/failures; don't let one bad address stop the rest.
