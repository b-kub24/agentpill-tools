"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Word lists for client-side analysis
// ---------------------------------------------------------------------------
const EMOTIONAL_WORDS = [
  "amazing", "shocking", "secret", "secrets", "proven", "stunning", "unbelievable", "incredible",
  "astonishing", "remarkable", "sensational", "spectacular", "breathtaking", "jaw-dropping",
  "mind-blowing", "heartbreaking", "heartwarming", "terrifying", "thrilling", "inspiring",
  "outrageous", "scary", "hilarious", "devastating", "epic", "surprising", "alarming", "brilliant",
  "painful", "blissful", "courageous", "daring", "fearless", "gripping", "haunting", "magical",
  "miraculous", "tragic", "triumphant", "wonderful", "dangerous", "deadly", "forbidden",
  "irresistible", "controversial", "explosive", "scandalous", "horrifying", "delightful", "joyful",
  "furious", "obsessed", "addictive", "unforgettable", "life-changing", "insane", "crazy", "wild",
  "ridiculous", "absurd", "dreadful", "gorgeous", "beautiful", "brutal", "savage", "ruthless",
  "desperate", "hopeful", "fear", "love", "hate", "panic", "rage", "bliss", "dream", "nightmare",
  "chaos", "miracle", "disaster", "catastrophe", "triumph", "victory", "failure", "struggle",
  "suffering", "pleasure", "agony", "stunned", "shocked", "embarrassing", "humiliating",
  "empowering", "uplifting", "captivating", "mesmerizing", "enchanting", "provocative", "genius",
  "regret", "jealous", "envy", "greed", "lust", "pride", "shame", "guilt", "hope", "wonder",
];

const POWER_WORDS = [
  "free", "new", "instantly", "now", "discover", "unlock", "boost", "transform", "master",
  "ultimate", "essential", "exclusive", "guaranteed", "limited", "easy", "simple", "fast",
  "quick", "effortless", "powerful", "best", "top", "insider", "hidden", "revealed", "results",
  "skyrocket", "supercharge", "crush", "dominate", "hack", "hacks", "blueprint", "formula",
  "step-by-step", "actionable", "foolproof", "painless", "revolutionary", "breakthrough",
  "cutting-edge", "premium", "elite", "smart", "killer", "magnetic", "viral", "surefire", "bold",
  "savvy", "effective", "avoid", "stop", "warning", "mistake", "mistakes", "never", "always",
  "only", "because", "you", "your", "win", "save", "gain", "double", "triple", "tricks", "tips",
  "strategies", "today", "complete", "definitive", "expert", "instant", "little-known",
  "overlooked", "underrated", "critical", "crucial", "vital", "must-know", "game-changing",
  "next-level", "improve", "grow", "profit", "success", "succeed", "winning", "cheat-sheet",
  "checklist", "toolkit", "roadmap", "shortcut", "shortcuts", "beginner", "advanced", "without",
];

const EMO_SET = new Set(EMOTIONAL_WORDS);
const POW_SET = new Set(POWER_WORDS);

// ---------------------------------------------------------------------------
// Analysis engine (100% client-side)
// ---------------------------------------------------------------------------
function syllables(raw: string): number {
  const w = raw.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]es|[^laeiouy]e|ed)$/, "").replace(/^y/, "");
  const groups = stripped.match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

interface Analysis {
  grade: string;
  composite: number;
  emotion: number;
  power: number;
  length: number;
  clarity: number;
  emotionalFound: string[];
  powerFound: string[];
  complexWords: string[];
  wordCount: number;
  charCount: number;
  suggestions: string[];
}

function gradeFor(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  if (score >= 62) return "C";
  if (score >= 55) return "D";
  return "F";
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function analyzeHeadline(headline: string): Analysis {
  const clean = headline.trim().replace(/\s+/g, " ");
  const words = clean.split(" ").filter(Boolean);
  const tokens = words.map((w) => w.toLowerCase().replace(/[^a-z0-9'-]/g, ""));
  const wordCount = words.length;
  const charCount = clean.length;
  const hasNumber = /\d/.test(clean);
  const isQuestion = /\?\s*$/.test(clean);

  const emotionalFound = Array.from(new Set(tokens.filter((t) => EMO_SET.has(t))));
  const powerFound = Array.from(new Set(tokens.filter((t) => POW_SET.has(t))));
  const complexWords = Array.from(
    new Set(words.filter((w, i) => syllables(tokens[i]) >= 4 || tokens[i].length >= 13))
  );

  // Emotional impact: trigger words + curiosity signals
  let emotion = 18 + emotionalFound.length * 32;
  if (isQuestion) emotion += 8;
  if (hasNumber) emotion += 6;
  emotion = clamp(emotion);

  // Power words: density-aware
  let power = powerFound.length === 0 ? 12 : 25 + powerFound.length * 26;
  power = clamp(power);

  // Length: ideal 6-12 words
  let length: number;
  if (wordCount >= 6 && wordCount <= 12) length = 100;
  else if (wordCount === 5 || wordCount === 13) length = 78;
  else if (wordCount === 4 || (wordCount >= 14 && wordCount <= 16)) length = 55;
  else length = 30;
  if (charCount > 70) length -= 15;
  length = clamp(length);

  // Clarity: penalize complex words, long words, run-on headlines
  const avgWordLen = wordCount ? tokens.join("").length / wordCount : 0;
  let clarity = 100 - complexWords.length * 18;
  if (avgWordLen > 7) clarity -= 12;
  if (wordCount > 14) clarity -= 12;
  if (charCount > 80) clarity -= 8;
  clarity = clamp(clarity);

  const composite = clamp(emotion * 0.3 + power * 0.2 + length * 0.25 + clarity * 0.25);

  // Suggestions
  const suggestions: string[] = [];
  if (emotionalFound.length === 0)
    suggestions.push(
      'Add an emotional trigger word like "surprising", "proven", or "unforgettable" — headlines that evoke feeling get more clicks.'
    );
  if (powerFound.length === 0)
    suggestions.push(
      'Work in a power word such as "free", "instantly", "discover", or "essential" to create urgency and value.'
    );
  else if (powerFound.length === 1)
    suggestions.push(
      "You have 1 power word — adding a second (e.g. \"proven\", \"ultimate\", \"effortless\") can lift click-through without feeling spammy."
    );
  if (wordCount < 6)
    suggestions.push(
      `At ${wordCount} word${wordCount === 1 ? "" : "s"}, your headline is too short to convey a full benefit. Aim for 6-12 words.`
    );
  if (wordCount > 12)
    suggestions.push(
      `At ${wordCount} words, your headline may get skimmed past. Trim filler words to land in the 6-12 word sweet spot.`
    );
  if (charCount > 70)
    suggestions.push(
      `At ${charCount} characters, it will be truncated in Google results. Keep it under 60-70 characters.`
    );
  if (complexWords.length > 0)
    suggestions.push(
      `Simplify complex word${complexWords.length > 1 ? "s" : ""}: ${complexWords.join(", ")}. Plain language reads faster and converts better.`
    );
  if (!hasNumber && !isQuestion)
    suggestions.push(
      'Consider adding a specific number ("7 Ways...") or turning it into a question — both boost curiosity and engagement.'
    );
  if (suggestions.length < 3)
    suggestions.push("Front-load your strongest words — the first 3 words carry the most weight in scanning.");
  if (suggestions.length < 3)
    suggestions.push("Strong headline! A/B test 2-3 variants of it to squeeze out even more clicks.");

  return {
    grade: gradeFor(composite), composite, emotion, power, length, clarity,
    emotionalFound, powerFound, complexWords, wordCount, charCount,
    suggestions: suggestions.slice(0, 5),
  };
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
function scoreText(s: number) {
  return s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-rose-400";
}
function scoreBar(s: number) {
  return s >= 80 ? "bg-emerald-500" : s >= 60 ? "bg-amber-500" : "bg-rose-500";
}
function gradeStyle(g: string) {
  if (g.startsWith("A")) return "from-emerald-500 to-teal-500";
  if (g.startsWith("B")) return "from-indigo-500 to-violet-500";
  if (g.startsWith("C")) return "from-amber-500 to-orange-500";
  return "from-rose-500 to-red-600";
}

function ScoreCard({ label, score, detail }: { label: string; score: number; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
      <div className="flex items-baseline justify-between">
        <h4 className="text-sm font-medium text-slate-300">{label}</h4>
        <span className={`text-2xl font-bold ${scoreText(score)}`}>{score}</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${scoreBar(score)} transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">{detail}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Home() {
  const [headline, setHeadline] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState("");

  const runAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;
    setResult(analyzeHeadline(headline));
  };

  const joinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setToast("Please enter a valid email address.");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    try {
      const key = "headline-analyzer-waitlist";
      const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      if (!list.includes(trimmed)) list.push(trimmed);
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
    setEmail("");
    setToast("You're on the waitlist! We'll be in touch soon.");
    setTimeout(() => setToast(""), 3500);
  };

  const scrollToTool = () => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl border border-emerald-500/40 bg-slate-900 px-5 py-3 text-sm font-medium text-emerald-300 shadow-2xl shadow-emerald-500/10">
          {toast}
        </div>
      )}

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-300">
          Instant, private, 100% in your browser
        </span>
        <h1 className="mt-6 bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          Headline Analyzer
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-medium text-slate-200 sm:text-xl">
          Write headlines that convert. Get instant scores on emotional impact, power words, and clarity.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Headline Analyzer grades your titles the way readers judge them — in seconds. Paste any blog title,
          email subject line, or ad headline and get a letter grade plus specific, actionable fixes. Built for
          bloggers, marketers, and copywriters who know the headline decides whether the rest ever gets read.
        </p>
        <button
          onClick={scrollToTool}
          className="mt-8 rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 hover:shadow-emerald-400/30"
        >
          Analyze My Headline — Free
        </button>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-center text-3xl font-bold text-white">How It Works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { icon: "\u{1F4DD}", title: "1. Paste your headline", desc: "Drop in any blog title, subject line, or ad headline. No sign-up, nothing leaves your browser." },
            { icon: "⚡", title: "2. Get instant analysis", desc: "Our engine scores emotional impact, power words, length, and clarity — then hands you a letter grade." },
            { icon: "\u{1F680}", title: "3. Apply suggested fixes", desc: "Follow specific improvement tips, re-run the analysis, and watch your grade climb toward an A+." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center backdrop-blur transition hover:border-indigo-500/40">
              <div className="text-4xl">{s.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN TOOL */}
      <section id="tool" className="mx-auto max-w-4xl scroll-mt-10 px-6 pb-24">
        <div className="rounded-3xl border border-indigo-500/20 bg-slate-900/70 p-6 shadow-2xl shadow-indigo-500/5 backdrop-blur sm:p-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Analyze Your Headline</h2>
          <p className="mt-2 text-sm text-slate-400">Try: &ldquo;7 Proven Ways to Instantly Write Amazing Headlines&rdquo;</p>
          <form onSubmit={runAnalysis} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Paste your headline here..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-base text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              maxLength={200}
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-violet-400"
            >
              Analyze
            </button>
          </form>

          {result && (
            <div className="mt-10">
              {/* Grade */}
              <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-8 sm:flex-row">
                <div className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradeStyle(result.grade)} text-5xl font-extrabold text-white shadow-xl`}>
                  {result.grade}
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm uppercase tracking-widest text-slate-400">Overall Score</p>
                  <p className="mt-1 text-3xl font-bold text-white">{result.composite} / 100</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {result.wordCount} words &middot; {result.charCount} characters
                    {result.powerFound.length > 0 && (
                      <> &middot; Power words: <span className="font-medium text-violet-300">{result.powerFound.join(", ")}</span></>
                    )}
                    {result.emotionalFound.length > 0 && (
                      <> &middot; Emotional words: <span className="font-medium text-indigo-300">{result.emotionalFound.join(", ")}</span></>
                    )}
                  </p>
                </div>
              </div>

              {/* Score cards */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ScoreCard
                  label="Emotional Impact"
                  score={result.emotion}
                  detail={
                    result.emotionalFound.length > 0
                      ? `Found ${result.emotionalFound.length} emotional trigger${result.emotionalFound.length > 1 ? "s" : ""}: ${result.emotionalFound.join(", ")}.`
                      : "No emotional trigger words detected. Emotion drives clicks."
                  }
                />
                <ScoreCard
                  label="Power Words"
                  score={result.power}
                  detail={
                    result.powerFound.length > 0
                      ? `${result.powerFound.length} power word${result.powerFound.length > 1 ? "s" : ""} found: ${result.powerFound.join(", ")}.`
                      : "No power words found. Words like “discover” and “instantly” add punch."
                  }
                />
                <ScoreCard
                  label="Length"
                  score={result.length}
                  detail={`${result.wordCount} words / ${result.charCount} characters. The sweet spot is 6-12 words and under 70 characters.`}
                />
                <ScoreCard
                  label="Clarity"
                  score={result.clarity}
                  detail={
                    result.complexWords.length > 0
                      ? `Complex word${result.complexWords.length > 1 ? "s" : ""} slowing readers down: ${result.complexWords.join(", ")}.`
                      : "Clean, simple language. Easy to read at a glance."
                  }
                />
              </div>

              {/* Suggestions */}
              <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
                <h3 className="text-lg font-semibold text-white">How to Improve</h3>
                <ul className="mt-4 space-y-3">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                      <span className="mt-0.5 shrink-0 text-violet-400">&#10148;</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="text-center text-3xl font-bold text-white">Simple Pricing</h2>
        <p className="mt-2 text-center text-sm text-slate-400">One plan. Everything included. Cancel anytime.</p>
        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl shadow-indigo-500/10">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-extrabold text-white">$7</span>
            <span className="text-lg text-slate-400">/month</span>
          </div>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            {[
              "Unlimited headline analyses",
              "Letter grades with full score breakdowns",
              "Emotional impact & power word detection",
              "Specific, actionable improvement fixes",
              "Headline history & side-by-side comparison",
              "Early access to new scoring models",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>
          <form onSubmit={joinWaitlist} className="mt-8 flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
            >
              Join Waitlist
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">Launching soon. Waitlist members get 50% off their first 3 months.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-sm text-slate-500">
        &copy; 2025 Headline Analyzer. All rights reserved.
      </footer>
    </main>
  );
}
