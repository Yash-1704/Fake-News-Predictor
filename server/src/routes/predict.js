const express = require("express");
const fastapiClient = require("../services/fastapiClient");
const { upsertCheck } = require("../models/Check");
const { sha256 } = require("../utils/hash");

const router = express.Router();

router.post("/", async (req, res) => {
  const { text } = req.body || {};
  if (typeof text !== "string") {
    return res.status(400).json({ error: "Request body must include text." });
  }

  if (text.trim().length < 20 || text.trim().length > 20000) {
    return res.status(400).json({ error: "Text must be between 20 and 20000 characters." });
  }

  try {
    const prediction = await fastapiClient.predict(text);
    const textHash = sha256(text);

    await upsertCheck(textHash, text.trim().slice(0, 300), prediction);
    return res.json(prediction);
  } catch (error) {
    console.error("Prediction request failed:", error.message);
    const status = Number.isInteger(error.status) ? error.status : 502;
    return res.status(status).json({ error: error.message || "Prediction service unavailable." });
  }
});

module.exports = router;