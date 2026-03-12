module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { words } = body || {};

  if (!words || words.length !== 3 || words.some(w => !w?.trim())) {
    return res.status(400).json({ error: "Need exactly 3 words" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `You are a Pakistani comedy writer. You ALWAYS write stories set in Pakistan with desi characters. You NEVER use western names like Gerald. The main character is ALWAYS called "Maa ka ladla" or "PaPa ki pari". Every story MUST mention chai, biryani, aunties, rickshaws, and a power outage. You write like a deadpan news reporter covering complete nonsense.`
            }]
          },
          contents: [{
            parts: [{
              text: `Write a 4 paragraph funny Pakistani story using these 3 words: "${words[0]}", "${words[1]}", "${words[2]}".

The main character MUST be named "Maa ka ladla" or "PaPa ki pari". Set it in Lahore or Karachi. Include a chai dhaba, nosy aunties on balconies, a rickshaw chaos, someone shouting from a rooftop, a sudden power outage, a generator roaring to life, and biryani mentioned randomly. A famous person like Babar Azam or Dwayne Johnson must witness the chaos. Include a fake statistic like "63% of Pakistani uncles predicted this". End with a one sentence epilogue that makes everything worse. Write as a deadpan serious news report. No bullet points, just 4 paragraphs of pure chaos.`
            }]
          }],
          generationConfig: { temperature: 1.9, maxOutputTokens: 1000 }
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
    return res.status(500).json({ error: err.message });
  }
}
