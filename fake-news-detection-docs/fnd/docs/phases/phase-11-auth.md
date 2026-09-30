# Phase 11: Authentication

**Goal:** register/login/logout with JWT cookies; guests keep NLP access, logged-in
users are marked for the fact-check gate (enforced in Phase 13).
**Prerequisites:** Phase 10 done.

## Tasks
1. `server/src/models/User.js`: schema per `ARCHITECTURE_EXT.md`. Static/helper
   `comparePassword`.
2. `server/src/routes/auth.js`:
   - `POST /register`: validate email format and password length (min 8), 409 if
     email exists, bcrypt-hash (`bcrypt.hash(pw, 10)`), create user, sign JWT,
     set cookie, return `{email}`.
   - `POST /login`: find by email, `bcrypt.compare`, same cookie/response on
     success, `401 {error:"Invalid email or password"}` on failure (don't leak
     which field was wrong).
   - `POST /logout`: `res.clearCookie("token")`.
   - `GET /me`: read cookie, verify JWT, return `{email}` or `{user:null}` (200
     either way, don't 401 here — the frontend uses this to decide what to show).
3. `server/src/middleware/auth.js`:
   ```js
   function attachUserIfPresent(req, res, next) {
     const token = req.cookies?.token;
     if (token) { try { req.user = jwt.verify(token, config.jwtSecret); } catch {} }
     next();
   }
   function requireAuth(req, res, next) {
     if (!req.user) return res.status(401).json({ error: "Login required" });
     next();
   }
   module.exports = { attachUserIfPresent, requireAuth };
   ```
4. Mount `attachUserIfPresent` globally in `app.js` (before routes). Mount
   `/api/auth` routes.
5. Cookie options: `{ httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 7*24*60*60*1000 }`.
6. Tests (`server/tests/auth.test.js` with `supertest` + `jest`, or a manual curl
   checklist if you're short on time — note which you did in the handoff):
   register → 201; duplicate register → 409; login wrong password → 401;
   `/me` with valid cookie → the email; `/me` with no cookie → `{user:null}`.

## Files
`server/src/{models/User.js, routes/auth.js, middleware/auth.js}` (+tests if time allows).

## Definition of Done
- [ ] Register, login, logout, `/me` all work via curl (cookies: `curl -c cookies.txt -b cookies.txt ...`)
- [ ] Passwords are never stored or logged in plaintext
- [ ] A wrong password gives the same error message as a nonexistent email
- [ ] `/api/predict` still works with **no** cookie (guest path untouched)

## Pitfalls
- Don't put the JWT secret in `config.js`'s defaults — it must come from `.env` only.
- `sameSite: "lax"` with `credentials: true` fetches: the frontend must send `credentials: "include"` on every request (Phase 14).

## Kickoff prompt
> Read docs/TWO_DAY_PLAN.md, docs/ARCHITECTURE_EXT.md and docs/phases/phase-11-auth.md. Do only Phase 11.
