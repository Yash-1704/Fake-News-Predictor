const express = require("express");
const NewsItem = require("../models/NewsItem");
const { fetchTopHeadlines } = require("../services/newsApiClient");

const router = express.Router();

router.get("/", async (req, res) => {
  const topic = String(req.query.topic || "").trim();

  try {
    const cachedItems = await NewsItem.find(topic ? { topic: { $regex: new RegExp(topic, "i") } } : {})
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();

    if (!topic) {
      return res.json({ items: cachedItems });
    }

    if (cachedItems.length > 0) {
      return res.json({ items: cachedItems });
    }

    // Why: only miss-driven topic lookups hit GNews once; cached stories are reused for everyone.
    try {
      const fetched = await fetchTopHeadlines(topic);
      const savedItems = [];

      for (const article of fetched) {
        if (!article.url) continue;

        const item = await NewsItem.findOneAndUpdate(
          { url: article.url },
          {
            title: article.title,
            source: article.source,
            publishedAt: article.publishedAt,
            fetchedAt: new Date(),
            topic,
            snippet: article.snippet || "",
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );

        savedItems.push(item.toObject ? item.toObject() : item);
      }

      return res.json({ items: savedItems.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 20) });
    } catch (gnewsError) {
      console.error("Topic-specific GNews lookup failed:", gnewsError.message);
      return res.json({ items: cachedItems });
    }
  } catch (error) {
    console.error("News feed request failed:", error.message);
    return res.status(500).json({ error: "Could not load news feed." });
  }
});

module.exports = router;
