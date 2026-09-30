# Phase 13: Fact-check (Groq + your own news context)

**Goal:** the headline feature. Logged-in users submit article text and get back
a verdict + explanation, grounded in real cached news items, not the LLM's
unaided memory. Cached so repeats are free and instant.
**Prerequisites:** Phases 10, 11, 12 done.

## Tasks
1. Get a free Groq API key at console.groq.com, put it in `.env` as `GROQ_API_KEY`,
   and set `GROQ_MODEL=llama-3.1-8b-instant`.
2. `server/src/utils/hash.js`: `sha256(text.trim().toLowerCase())` (Node's built-in
   `crypto` module — no new dependency).
3. `server/src/services/groqClient.js`:
   ```js
   async function chat(messages) {
     const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${config.groqApiKey}`,
       },
       body: JSON.stringify({ model: config.groqModel, messages, temperature: 0.2 }),
     });
     if (!res.ok) throw new Error(`Groq error ${res.status}: ${await res.text()}`);
     const data = await res.json();
     return data.choices[0].message.content;
   }
   module.exports = { chat };
   ```
4. `server/src/services/factCheckService.js`, the core logic:
   ```js
   async function factCheck(text) {
     const textHash = sha256(text);
     const existing = await Check.findOne({ textHash });
     if (existing?.factCheck) {
       existing.checkCount += 1; existing.lastCheckedAt = new Date();
       await existing.save();
       return { ...existing.factCheck, cached: true };
     }

     const topic = extractTopic(text); // first ~8 significant words; simple, no ML needed
     let context = await NewsItem.find({ /* text search on topic, or recent cache */ }).limit(4);
     if (context.length === 0) {
       try { context = await fetchTopHeadlines(topic); } catch { context = []; }
     }

     const contextBlock = context.length
       ? context.map((c, i) => `[${i + 1}] ${c.title} — ${c.source} (${c.publishedAt})`).join("\n")
       : "(no related articles found)";

     const prompt = `You are a careful fact-checking assistant. Given an ARTICLE and
some RELATED NEWS ITEMS retrieved from a news API, assess the article.
Only use the related items and well-established general knowledge — do not
invent facts or sources. If the related items don't cover the claim, say
"unverifiable" rather than guessing.

ARTICLE:
${text.slice(0, 3000)}

RELATED NEWS ITEMS:
${contextBlock}

Respond in this exact format:
VERDICT: <likely true | likely false | unverifiable>
EXPLANATION: <2-4 sentences, plain language>
SOURCES_USED: <comma-separated numbers from the list above, or "none">`;

     let raw;
     try { raw = await chat([{ role: "user", content: prompt }]); }
     catch (err) {
       return { verdict: "unavailable", explanation: "Fact-check service is temporarily unavailable.", sources: [], cached: false };
     }

     const parsed = parseVerdict(raw, context); // simple regex/line-split parser
     await Check.findOneAndUpdate(
       { textHash },
       { $set: { textPreview: text.slice(0, 300), factCheck: { ...parsed, model: config.groqModel, checkedAt: new Date() } },
         $inc: { checkCount: 1 }, $currentDate: { lastCheckedAt: true } },
       { upsert: true }
     );
     return { ...parsed, cached: false };
   }
   ```
   Write `extractTopic` and `parseVerdict` as small, well-commented helpers.
   `parseVerdict` must not throw on malformed model output — fall back to
   `{verdict: "unverifiable", explanation: raw.slice(0,500), sources: []}`.
5. `server/src/routes/factcheck.js`: `POST /api/factcheck`, protected by
   `requireAuth`. Validate `text` length (reuse the same 20–20,000 char rule as
   `/predict`). Call `factCheckService.factCheck(text)`, return it.
6. Update `server/src/routes/predict.js` (from Phase 10) to also upsert/increment
   `Check` the same way, if it doesn't already, so guest NLP checks also count
   toward "popular articles" for Phase 15.

## Files
`server/src/{utils/hash.js, services/groqClient.js, services/factCheckService.js, routes/factcheck.js}`.

## Definition of Done
- [ ] `POST /api/factcheck` without a cookie returns 401
- [ ] With a valid cookie, a real article returns a verdict, explanation, and the news items it used
- [ ] Submitting the exact same text twice returns `cached: true` the second time, with no Groq call (check server logs)
- [ ] Killing the Groq key / forcing an error still returns a clean `200 {verdict:"unavailable", ...}`, not a 500
- [ ] `parseVerdict` handles at least one deliberately malformed model response without crashing (write a quick test with a hardcoded bad string)

## Pitfalls
- Don't call Groq before checking the cache — that's the whole point of the cache.
- Keep prompts short (`text.slice(0, 3000)`) — long articles waste tokens and risk hitting context limits.
- Free daily caps are real; if you hit one during testing, that's expected — the cache is what makes the demo survive it.

## Kickoff prompt
> Read docs/TWO_DAY_PLAN.md, docs/ARCHITECTURE_EXT.md and docs/phases/phase-13-factcheck.md. Do only Phase 13. Show me one real Groq response before wiring up caching, so I can sanity-check the prompt.
