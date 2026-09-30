# Phase 14: Frontend integration

**Goal:** the React app now talks to Express (not FastAPI directly), has
login/register pages, and gates the fact-check UI behind login.
**Prerequisites:** Phases 10–13 done.

## Tasks
1. `frontend/src/api.js`: change the base URL to Express (`http://localhost:4000/api`
   or via Vite proxy), and add `credentials: "include"` to every `fetch` call —
   required for the auth cookie to be sent/received.
2. `frontend/vite.config.js`: proxy `/api` to `http://localhost:4000` (was FastAPI
   in Phase 7; now it's Express, which itself proxies to FastAPI server-side).
3. `frontend/src/context/AuthContext.jsx` (or equivalent): on app load, call
   `GET /api/auth/me`; expose `{ user, login(), register(), logout() }` to the app.
4. `frontend/src/pages/{Login,Register}.jsx`: simple forms, call the auth routes,
   redirect home on success, show the API's error message on failure.
5. Update the existing result page/component:
   - Guests: only the existing NLP predict flow, unchanged.
   - Logged-in users: after an NLP result, show a "Fact-check this" button that
     calls `POST /api/factcheck` and renders `FactCheckPanel.jsx` (verdict badge,
     explanation, list of sources used, and a note when `cached: true`).
   - Logged-out users see the same button but disabled/hinted ("Log in to fact-check"),
     not hidden — this is better for the demo than mysteriously missing.
6. Add a nav bar: Home, News Feed, and either Login/Register or "Logged in as
   X · Logout" depending on `user`.
7. Keep the disclaimer from Phase 7 on the NLP result; add a similar one on the
   fact-check result ("automated assessment based on limited retrieved sources,
   not a guarantee").

## Files
`frontend/src/{api.js, context/AuthContext.jsx, pages/{Login,Register}.jsx, components/FactCheckPanel.jsx}`, updates to the existing result component and nav.

## Definition of Done
- [ ] `npm run dev` works; register, login, logout all work through the UI
- [ ] A guest can still get an NLP prediction with no login
- [ ] A guest sees the fact-check option but cannot use it without logging in
- [ ] A logged-in user can fact-check an article and sees the verdict, explanation, and sources
- [ ] Refreshing the page keeps the user logged in (cookie persists)

## Pitfalls
- Forgetting `credentials: "include"` on any fetch call is the most common bug here — cookies silently won't be sent.
- Don't call FastAPI directly from React anywhere; everything goes through Express now.

## Kickoff prompt
> Read docs/TWO_DAY_PLAN.md, docs/ARCHITECTURE_EXT.md and docs/phases/phase-14-frontend-integration.md. Do only Phase 14.
