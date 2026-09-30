const test = require("node:test");
const assert = require("node:assert/strict");

const { parseVerdict } = require("../src/services/factCheckService");

test("parseVerdict handles malformed model output without throwing", () => {
  const result = parseVerdict("This is a bad response without the required fields.", [
    { title: "First item", source: "Example News", url: "https://example.com/1", publishedAt: "2024-01-01" },
  ]);

  assert.equal(result.verdict, "unverifiable");
  assert.ok(result.explanation.length > 0);
  assert.deepEqual(result.sources, []);
});
