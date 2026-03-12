import { useState } from "react";

const ADJECTIVES = ["dramatic","chaotic","suspicious","philosophical","legendary","mysterious","sleepy","furious","absolutely unhinged"];
const VERBS = ["discovered","accidentally invented","got into an argument with","fell in love with","tried to eat","challenged to a dance-off","sued","became best friends with","started a podcast about","declared war on"];
const SETTINGS = ["at IKEA","during a Wednesday","in a Walmart parking lot","at 3am","while doing taxes","in a Zoom call","at a renaissance fair","on a Tuesday","in the cereal aisle","on a submarine"];
const TWISTS = [
  "Nobody called 911.",
  "A golden retriever witnessed everything.",
  "The WiFi was fine throughout.",
  "This made the news in 14 countries.",
  "Local authorities refused to comment.",
  "A TED Talk was later given about it.",
  "The manager was, in fact, called.",
  "Everyone got a coupon.",
  "No one was surprised.",
  "The sequel was worse."
];

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const TEMPLATES = [
  (w1, w2, w3) => `Once upon a time, a ${pick(ADJECTIVES)} ${w1} named Gerald ${pick(VERBS)} a ${w2} ${pick(SETTINGS)}. 

The situation escalated quickly when a nearby ${w3} started filming on its phone. Gerald, ever the professional, simply adjusted his hat and continued. The ${w2} was not impressed. The ${w3} got 2 million views.

${pick(TWISTS)}`,

  (w1, w2, w3) => `In a world where ${w1}s could talk, one chose not to — until it met a ${w2} ${pick(SETTINGS)}.

"You," said the ${w1}. The ${w2} said nothing. A ${w3} nearby began to weep softly. Nobody asked why.

The ${w1} and ${w2} are now co-owners of a small business. The ${w3} got 40% equity somehow.

${pick(TWISTS)}`,

  (w1, w2, w3) => `Scientists discovered that combining a ${w1}, a ${w2}, and raw ambition produces a ${w3} ${pick(SETTINGS)}.

The experiment took 4 minutes. The cleanup took 11 years. Three interns received certificates of participation.

"We'd do it again," said the lead researcher, not making eye contact.

${pick(TWISTS)}`,
];

export default function StoryGenerator() {
  const [words, setWords] = useState(["", "", ""]);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
  if (words.some(w => !w.trim())) return;

  setLoading(true);
  setGenerated(false);

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "API failed");
    }

    const data = await res.json();
    setStory(data.story);
  } catch (err) {
    console.error("API error:", err);
    // fallback template only if Gemini fails
    const tmpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    setStory(tmpl(...words));
  }

  setGenerated(true);
  setLoading(false);
};

  const reset = () => {
    setWords(["", "", ""]);
    setStory("");
    setGenerated(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFF9F0",
      fontFamily: "'Georgia', serif",
      overflow: "hidden",
      position: "relative"
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `radial-gradient(circle at 20% 20%, #FFE14D33 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, #FF6B6B22 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, #A8E6CF22 0%, transparent 70%)`
      }} />

      <div style={{
        position: "fixed", top: -80, right: -80, width: 300, height: 300,
        borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        background: "#FFE14D", opacity: 0.4, zIndex: 0,
        animation: "blob 8s ease-in-out infinite"
      }} />
      <div style={{
        position: "fixed", bottom: -60, left: -60, width: 250, height: 250,
        borderRadius: "40% 60% 30% 70% / 60% 40% 50% 50%",
        background: "#FF6B6B", opacity: 0.3, zIndex: 0,
        animation: "blob 10s ease-in-out infinite reverse"
      }} />

      <style>{`
        @keyframes blob { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 50%} 50%{border-radius:30% 70% 40% 60%/60% 30% 70% 40%} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wiggle { 0%,100%{transform:rotate(-1deg)} 50%{transform:rotate(1deg)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .word-input {
          border: 3px solid #1a1a1a;
          background: white;
          padding: 14px 18px;
          font-size: 1.2rem;
          font-family: 'Georgia', serif;
          font-style: italic;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          box-shadow: 4px 4px 0 #1a1a1a;
          transition: all 0.15s;
          color: #1a1a1a;
        }
        .word-input:focus { box-shadow: 6px 6px 0 #FF6B6B; transform: translate(-2px,-2px); }
        .word-input::placeholder { color: #aaa; }
        .gen-btn {
          background: #1a1a1a;
          color: #FFE14D;
          border: 3px solid #1a1a1a;
          padding: 18px 40px;
          font-size: 1.3rem;
          font-family: 'Georgia', serif;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 5px 5px 0 #FF6B6B;
          transition: all 0.15s;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .gen-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 8px 8px 0 #FF6B6B; }
        .gen-btn:active:not(:disabled) { transform: translate(3px,3px); box-shadow: 2px 2px 0 #FF6B6B; }
        .gen-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .story-box {
          animation: fadeIn 0.5s ease forwards;
          background: white;
          border: 3px solid #1a1a1a;
          box-shadow: 8px 8px 0 #1a1a1a;
          padding: 36px 40px;
          position: relative;
        }
        .reset-btn {
          background: transparent; border: 2px solid #1a1a1a; padding: 10px 24px;
          font-family: 'Georgia', serif; font-size: 0.9rem; cursor: pointer;
          transition: all 0.15s; box-shadow: 3px 3px 0 #1a1a1a;
        }
        .reset-btn:hover { background: #1a1a1a; color: white; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ display: "inline-block", background: "#FF6B6B", border: "3px solid #1a1a1a", padding: "4px 14px", fontSize: "0.7rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20, boxShadow: "3px 3px 0 #1a1a1a" }}>
            ✦ Absolutely Unnecessary ✦
          </div>
          <h1 style={{
            fontSize: "clamp(2.8rem, 8vw, 4.5rem)",
            fontWeight: "900",
            lineHeight: 1.05,
            color: "#1a1a1a",
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
            animation: "wiggle 4s ease-in-out infinite"
          }}>
            Story<br/>Machine™
          </h1>
          <p style={{ color: "#666", fontSize: "1.05rem", fontStyle: "italic", margin: 0 }}>
            Give it three words. It will ruin them.
          </p>
        </div>

        {!generated ? (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
              {["a noun", "another noun", "one more noun"].map((ph, i) => (
                <div key={i}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, color: "#888" }}>
                    Word {i + 1}
                  </label>
                  <input
                    className="word-input"
                    placeholder={ph}
                    value={words[i]}
                    onChange={e => {
                      const w = [...words];
                      w[i] = e.target.value;
                      setWords(w);
                    }}
                    onKeyDown={e => e.key === "Enter" && handleGenerate()}
                    maxLength={20}
                  />
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                className="gen-btn"
                onClick={handleGenerate}
                disabled={loading || words.some(w => !w.trim())}
              >
                {loading ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <span style={{ display: "inline-block", width: 16, height: 16, border: "3px solid #FFE14D", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Generating chaos...
                  </span>
                ) : "✦ Generate Story"}
              </button>
              {words.some(w => !w.trim()) && (
                <p style={{ marginTop: 12, color: "#bbb", fontSize: "0.85rem", fontStyle: "italic" }}>
                  (all three words required)
                </p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div className="story-box">
              <div style={{ position: "absolute", top: -14, left: 28 }}>
                <span style={{ display: "inline-block", background: "#FFE14D", border: "2px solid #1a1a1a", padding: "3px 10px", fontSize: "0.75rem", fontFamily: "monospace", fontWeight: "bold", letterSpacing: "0.1em", textTransform: "uppercase" }}>⚡ A True Story (Probably)</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, marginTop: 8 }}>
                {words.map((w, i) => (
                  <span key={i} style={{ background: ["#FFE14D","#A8E6CF","#FF6B6B"][i], border: "2px solid #1a1a1a", padding: "3px 12px", fontSize: "0.85rem", fontFamily: "monospace", fontWeight: "bold" }}>
                    {w}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#1a1a1a", whiteSpace: "pre-wrap" }}>
                {story}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="reset-btn" onClick={reset}>← Start Over</button>
              <button className="reset-btn" onClick={handleGenerate}>↻ New Story, Same Words</button>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 60, fontFamily: "monospace", letterSpacing: "0.1em" }}>
          <div style={{ color: "#ccc", fontSize: "0.75rem", marginBottom: 10 }}>
            NO WORDS WERE HARMED IN THE MAKING OF THESE STORIES
          </div>
          <div style={{ display: "inline-block", background: "#1a1a1a", color: "#FFE14D", border: "2px solid #1a1a1a", padding: "6px 16px", fontSize: "0.75rem", boxShadow: "3px 3px 0 #FF6B6B", letterSpacing: "0.15em" }}>
            ✦ A COMPLETELY USELESS PROJECT BY OMAR ✦
          </div>
        </div>
      </div>
    </div>
  );
}
