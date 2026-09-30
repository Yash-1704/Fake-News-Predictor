const config = require("../config");

async function chat(messages) {
  if (!config.groqApiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.groqApiKey}`,
    },
    body: JSON.stringify({
      model: config.groqModel,
      messages,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

module.exports = { chat };
