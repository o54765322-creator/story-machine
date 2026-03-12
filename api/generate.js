export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { words } = req.body;

  if (!words || words.length !== 3 || words.some(w => !w?.trim())) {
    return res.status(400).json({ error: "Need exactly 3 words" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const prompt = `Generate a short, wildly funny absurdist story (3-4 paragraphs) using these 3 words as key elements: "${words[0]}", "${words[1]}", and "${words[2]}".

The tone should be deadpan and unhinged — like a Wikipedia article about something that should never have happened. Include ridiculous specific details (names, numbers, brands). End with a one-sentence punchline that makes no sense but feels correct. Do NOT use bullet points or headers, just flowing paragraphs.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const story = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!story) {
      return res.status(500).json({ error: "No story generated" });
    }

    return res.status(200).json({ story });
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate story" });
  }
}
