// /api/generate.js
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Safe body parsing
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { words } = body || {};

    if (!words || words.length !== 3 || words.some(w => !w?.trim())) {
      return res.status(400).json({ error: "Need exactly 3 words" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    console.log("WORDS:", words);
    console.log("API KEY EXISTS:", !!apiKey);

    const prompt = `
Write a 4 paragraph funny Pakistani story using these 3 words: "${words[0]}", "${words[1]}", "${words[2]}".

Rules:
- Main character MUST be "Maa ka ladla" or "PaPa ki pari"
- Set in Lahore or Karachi
- Include chai, biryani, aunties on balconies, rickshaw chaos, power outage
- Deadpan news reporter style
- Include a fake statistic like "63% of Pakistani uncles predicted this"
- End with a one sentence epilogue that makes everything worse
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 1.2, maxOutputTokens: 800 }
        })
      }
    );

    const data = await response.json();
    const story = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!story) {
      console.error("Gemini response:", data);
      return res.status(500).json({ error: "No story generated" });
    }

    return res.status(200).json({ story });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: err.message });
  }
};