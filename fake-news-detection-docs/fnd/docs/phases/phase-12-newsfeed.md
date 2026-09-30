# Phase 12: News feed

**Goal:** a cached news feed endpoint and a basic React page. This also builds the
GNews plumbing that Phase 13 reuses for fact-check context.
**Prerequisites:** Phase 10 done (Phase 11 not required, but fine if done first).

## Tasks
1. Get a free GNews API key at gnews.io, put it in `.env` as `GNEWS_API_KEY`.
2. `server/src/models/NewsItem.js`: schema per `ARCHITECTURE_EXT.md`. Unique
   index on `url` to avoid duplicates.
3. `server/src/services/newsApiClient.js`:
   ```js
   async function fetchTopHeadlines(topic = "") {
     const url = new URL("https://gnews.io/api/v4/top-headlines");
     url.searchParams.set("lang", "en");
     url.searchParams.set("apikey", config.gnewsApiKey);
     if (topic) url.searchParams.set("q", topic);
     const res = await fetch(url);
     if (!res.ok) throw new Error(`GNews error ${res.status}`);
     const data = await res.json();
     return data.articles || [];
   }
   module.exports = { fetchTopHeadlines };
   ```
4. `server/src/jobs/refreshNews.js`: fetch top headlines (no topic = general),
   upsert into `NewsItem` by `url`, set `fetchedAt`. Run once on server start,
   then on a timer (`setInterval`, every 2 hours is plenty for 100 req/day) —
   **do not** call GNews inside the `/api/news` request handler.
5. `server/src/routes/news.js`: `GET /api/news?topic=` reads from MongoDB only
   (sorted by `publishedAt` desc, limit 20). If `topic` is given and nothing
   matches in cache, call `fetchTopHeadlines(topic)` once, cache it, and return
   it — this on-demand path is also what Phase 13 will call directly (not via
   HTTP, just import the service function).
6. Frontend: `frontend/src/pages/NewsFeed.jsx` — a simple list of title/source/
   date/link, fetched from `/api/news` with `credentials: "include"`. Add a nav
   link to it. No auth gating here; the feed is open to everyone.

## Files
`server/src/{models/NewsItem.js, services/newsApiClient.js, jobs/refreshNews.js, routes/news.js}`, `frontend/src/pages/NewsFeed.jsx`.

## Definition of Done
- [ ] `GET /api/news` returns cached items without calling GNews on every request (check server logs / add a console.log in the client to prove it)
- [ ] `GET /api/news?topic=elections` returns relevant items, cached after the first call
- [ ] The React news feed page renders real headlines
- [ ] A GNews outage/rate-limit doesn't crash `/api/news` — it falls back to whatever is cached

## Pitfalls
- 100 requests/day disappears fast if you fetch per page load. The refresh job + cache is the whole point.
- GNews response shape can vary slightly by plan; log one real response and adjust field names if `articles` isn't there.

## Kickoff prompt
> Read docs/TWO_DAY_PLAN.md, docs/ARCHITECTURE_EXT.md and docs/phases/phase-12-newsfeed.md. Do only Phase 12.
