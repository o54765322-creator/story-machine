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

  const prompt = `You are the world's funniest absurdist comedy writer. Generate a hilariously unhinged short story (4 paragraphs) using these 3 words as the main characters or key elements: "${words[0]}", "${words[1]}", and "${words[2]}".

RULES FOR MAXIMUM COMEDY:
- Give characters ridiculous full names (like "Gerald Thunderbottom III" or "Karen McMeltdown")
- Include extremely specific useless details (like "at 3:47pm on a Tuesday in a Lidl parking lot in Belgium")
- Use dramatic overreaction to completely trivial situations
- Add a completely unrelated celebrity or fictional character as a witness
- Include one insane statistic that sounds official but makes no sense (like "47% of experts agree")
- The story should escalate from mildly weird to absolutely chaotic
- End with a one sentence epilogue that is completely unexpected and makes the whole thing worse
- Write like a deadpan news report about something that should never have made the news
- DO NOT use bullet points or headers, just 4 flowing paragraphs of pure chaos`;

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
