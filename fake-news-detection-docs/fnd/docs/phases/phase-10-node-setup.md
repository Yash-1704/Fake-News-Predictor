# Phase 10: Node/Express + MongoDB setup

**Goal:** a running Express server, connected to MongoDB, that proxies `/predict`
to the existing FastAPI service. No auth, no LLM yet.
**Prerequisites:** Phases 0–9 done (FastAPI serves `/predict` on :8000). MongoDB
installed locally (or a free Atlas cluster) and running.
**Read:** docs/TWO_DAY_PLAN.md, docs/ARCHITECTURE_EXT.md, this file. Nothing else.

## Tasks
1. `mkdir server && cd server && npm init -y`
2. Install: `npm i express mongoose dotenv cors cookie-parser bcrypt jsonwebtoken node-cron nodemailer`
   Dev: `npm i -D nodemon`
3. `server/.env.example` and `server/.env` per `ARCHITECTURE_EXT.md`. Add
   `server/.env` and `server/node_modules` to the repo's `.gitignore`.
4. `server/src/config.js`:
   ```js
   require("dotenv").config();
   module.exports = {
     port: process.env.PORT || 4000,
     mongoUri: process.env.MONGODB_URI,
     jwtSecret: process.env.JWT_SECRET,
     fastapiUrl: process.env.FASTAPI_URL || "http://localhost:8000",
     clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
   };
   ```
5. `server/src/db.js`: `mongoose.connect(config.mongoUri)`, log connect/error events.
6. `server/src/services/fastapiClient.js`:
   ```js
   async function predict(text) {
     const res = await fetch(`${config.fastapiUrl}/predict`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ text }),
     });
     if (!res.ok) {
       const body = await res.json().catch(() => ({}));
       const err = new Error(body.detail || `FastAPI error ${res.status}`);
       err.status = res.status;
       throw err;
     }
     return res.json();
   }
   module.exports = { predict };
   ```
7. `server/src/routes/predict.js`: `POST /api/predict` calls `fastapiClient.predict`,
   returns its JSON, and (stub for now, real logic in Phase 13) does **not** yet
   touch the `Check` collection — that lands with the schema in this phase but
   the increment logic is fine to add now too, see step 8.
8. `server/src/models/Check.js`: the `Check` schema from `ARCHITECTURE_EXT.md`.
   Add a small helper `upsertCheck(textHash, preview, nlpResult)` used by the
   predict route so `checkCount`/`lastCheckedAt` start tracking from day one.
9. `server/src/app.js`: `express()`, `cors({origin: config.clientOrigin, credentials: true})`,
   `express.json()`, `cookieParser()`, mount `/api/predict`. `server.js` calls
   `db.js` then `app.listen(config.port)`.
10. `package.json` scripts: `"dev": "nodemon src/server.js"`.

## Files
`server/**` (excluding `node_modules`), `.gitignore` updated.

## Definition of Done
- [ ] `npm run dev` starts without errors and logs a successful MongoDB connection
- [ ] `curl -X POST localhost:4000/api/predict -H "Content-Type: application/json" -d '{"text":"<a real paragraph>"}'` returns the same shape FastAPI does
- [ ] A `Check` document appears in MongoDB after that call (check with `mongosh` or Compass)
- [ ] Stopping FastAPI and retrying `/api/predict` returns a clean error, not a crash

## Pitfalls
- CORS needs `credentials: true` on both the Express and the future fetch calls once cookies exist (Phase 11).
- Don't hardcode `localhost:8000` anywhere except `config.js`.

## Kickoff prompt
> Read docs/TWO_DAY_PLAN.md, docs/ARCHITECTURE_EXT.md and docs/phases/phase-10-node-setup.md. Do only Phase 10. Give me a short plan first.
