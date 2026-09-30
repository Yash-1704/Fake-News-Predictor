const config = require("../config");

function normalizeArticle(article, topic = "") {
  const sourceName = article?.source?.name || article?.source || "Unknown";
  return {
    title: article?.title || "Untitled",
    url: article?.url || article?.link || "",
    source: sourceName,
    publishedAt: article?.publishedAt || article?.published_at || new Date().toISOString(),
    topic: topic || "general",
    snippet: article?.description || article?.content || "",
  };
}

async function fetchTopHeadlines(topic = "") {
  if (!config.gnewsApiKey) {
    return [];
  }

  const url = new URL("https://gnews.io/api/v4/top-headlines");
  url.searchParams.set("lang", "en");
  url.searchParams.set("apikey", config.gnewsApiKey);
  if (topic) {
    url.searchParams.set("q", topic);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GNews error ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.articles) ? data.articles.map((article) => normalizeArticle(article, topic)) : [];
}

module.exports = { fetchTopHeadlines, normalizeArticle };
