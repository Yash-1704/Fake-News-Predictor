const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { factCheck } = require("../services/factCheckService");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const { text } = req.body || {};

  if (typeof text !== "string") {
    return res.status(400).json({ error: "Request body must include text." });
  }

  if (text.trim().length < 20 || text.trim().length > 20000) {
    return res.status(400).json({ error: "Text must be between 20 and 20000 characters." });
  }

  try {
    const result = await factCheck(text);
    return res.json(result);
  } catch (error) {
    console.error("Fact-check request failed:", error.message);
    return res.status(500).json({ error: "Fact-check service unavailable." });
  }
});

module.exports = router;
