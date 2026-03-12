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

* You MUST name the main character either "Maa ka ladla" or "PaPa ki pari", no other names allowed
* The story MUST have a Pakistani setting or strong desi touch (chai dhabas, aunties spying from balconies, rickshaws screaming like dying lawnmowers, someone shouting from a rooftop, random power outage, generators roaring, someone mentioning biryani for absolutely no reason)
* Include extremely specific useless details (like "at exactly 3:47pm on a humid Tuesday outside a chai stall in Lahore while a suspicious pigeon stared at a half-eaten samosa")
* Use dramatic overreaction to completely trivial situations (like dropping a samosa or someone finishing the last cup of chai)
* Add a completely unrelated celebrity or fictional character as a witness (for example Babar Azam, Batman, or Dwayne Johnson)
* Include one insane statistic that sounds official but makes no sense (like "according to a recent study, 63% of Pakistani uncles predicted this exact disaster")
* The story should escalate from mildly weird to absolutely chaotic (rickshaw traffic jams, aunties forming emergency committees, someone starting a WhatsApp investigation group, etc.)
* End with a one sentence epilogue that is completely unexpected and somehow makes the whole situation even worse
* Write like a deadpan serious news report about something that should never have made the news
* DO NOT use bullet points or headers in the story itself, just 4 flowing paragraphs of pure chaos

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
