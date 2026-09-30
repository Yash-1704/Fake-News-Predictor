const config = require("../config");
const { Check } = require("../models/Check");
const NewsItem = require("../models/NewsItem");
const { sha256 } = require("../utils/hash");
const { chat } = require("./groqClient");
const { fetchTopHeadlines } = require("./newsApiClient");

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "he",
  "her",
  "his",
  "i",
  "in",
  "into",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "our",
  "she",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "to",
  "us",
  "was",
  "we",
  "were",
  "with",
  "you",
  "your",
]);

function extractTopic(text) {
  const words = String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !STOP_WORDS.has(word));

  return words.slice(0, 8).join(" ").trim() || "general";
}

function parseVerdict(raw, context = []) {
  try {
    const text = String(raw ?? "").trim();
    if (!text) {
      return { verdict: "unverifiable", explanation: "No fact-check response returned.", sources: [] };
    }

    const verdictMatch = text.match(/VERDICT\s*:\s*(likely true|likely false|unverifiable)/i);
    const explanationMatch = text.match(/EXPLANATION\s*:\s*([\s\S]*?)(?:\n\s*SOURCES_USED\s*:|$)/i);
    const sourcesMatch = text.match(/SOURCES_USED\s*:\s*([\s\S]*?)(?:\n|$)/i);

    const verdict = verdictMatch ? verdictMatch[1].toLowerCase() : "unverifiable";
    const explanation = explanationMatch
      ? explanationMatch[1].trim().replace(/\s+/g, " ")
      : text.slice(0, 500).trim().replace(/\s+/g, " ");

    const sourceNumbers = sourcesMatch
      ? sourcesMatch[1]
          .split(/[\s,]+/)
          .map((value) => Number.parseInt(value, 10))
          .filter((value) => Number.isInteger(value) && value > 0)
      : [];

    const sources = sourceNumbers
      .map((index) => context[index - 1])
      .filter(Boolean)
      .map((item) => ({
        title: item.title,
        source: item.source,
        url: item.url,
        publishedAt: item.publishedAt,
      }));

    return {
      verdict,
      explanation: explanation || "No explanation available.",
      sources,
    };
  } catch (error) {
    console.error("Fact-check parsing failed:", error.message);
    return {
      verdict: "unverifiable",
      explanation: String(raw || "").slice(0, 500),
      sources: [],
    };
  }
}

async function factCheck(text) {
  const cleanText = typeof text === "string" ? text.trim() : "";
  const textHash = sha256(cleanText);

  const existing = await Check.findOne({ textHash }).lean();
  if (existing?.factCheck) {
    await Check.findOneAndUpdate(
      { textHash },
      {
        $inc: { checkCount: 1 },
        $currentDate: { lastCheckedAt: true },
      },
      { new: true },
    );

    return { ...existing.factCheck, cached: true };
  }

  const topic = extractTopic(cleanText);
  let context = await NewsItem.find({
    $or: [
      { title: { $regex: new RegExp(topic.split(" ").slice(0, 4).join("|"), "i") } },
      { snippet: { $regex: new RegExp(topic.split(" ").slice(0, 4).join("|"), "i") } },
    ],
  })
    .sort({ publishedAt: -1 })
    .limit(4)
    .lean();

  if (context.length === 0) {
    try {
      context = await fetchTopHeadlines(topic);
    } catch (error) {
      console.error("GNews fallback failed for fact-check context:", error.message);
      context = [];
    }
  }

  const contextBlock = context.length
    ? context.map((item, index) => `[${index + 1}] ${item.title} — ${item.source} (${item.publishedAt})`).join("\n")
    : "(no related articles found)";

  const prompt = `You are a careful fact-checking assistant. Given an ARTICLE and some RELATED NEWS ITEMS retrieved from a news API, assess the article.
Only use the related items and well-established general knowledge — do not invent facts or sources. If the related items don't cover the claim, say
"unverifiable" rather than guessing.

ARTICLE:
${cleanText.slice(0, 3000)}

RELATED NEWS ITEMS:
${contextBlock}

Respond in this exact format:
VERDICT: <likely true | likely false | unverifiable>
EXPLANATION: <2-4 sentences, plain language>
SOURCES_USED: <comma-separated numbers from the list above, or "none">`;

  let raw;
  try {
    raw = await chat([{ role: "user", content: prompt }]);
  } catch (error) {
    console.error("Groq fact-check failed:", error.message);
    return {
      verdict: "unavailable",
      explanation: "Fact-check service is temporarily unavailable.",
      sources: [],
      cached: false,
    };
  }

  const parsed = parseVerdict(raw, context);
  const payload = {
    ...parsed,
    model: config.groqModel,
    checkedAt: new Date(),
  };

  await Check.findOneAndUpdate(
    { textHash },
    {
      $set: {
        textPreview: cleanText.slice(0, 300),
        factCheck: payload,
      },
      $inc: { checkCount: 1 },
      $currentDate: { lastCheckedAt: true },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return { ...parsed, cached: false };
}

module.exports = { factCheck, extractTopic, parseVerdict };
