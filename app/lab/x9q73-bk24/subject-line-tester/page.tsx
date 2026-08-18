"use client";

import { useState } from "react";

const spamWords = [
  "free", "act now", "limited time", "urgent", "click here", "buy now",
  "order now", "don't miss", "exclusive deal", "congratulations", "winner",
  "cash", "prize", "no cost", "risk free", "guarantee", "no obligation",
  "incredible deal", "lowest price", "best price", "bargain", "bonus",
  "discount", "earn money", "extra income", "make money", "million",
  "double your", "100%", "amazing", "unbelievable", "once in a lifetime",
  "act immediately", "apply now", "call now", "click below", "dear friend",
  "for free", "get it now", "great offer", "info you requested", "instant",
  "new customer", "offer expires", "please read", "special promotion",
  "take action", "this isn't spam", "while supplies last",
  "you have been selected", "save big", "clearance", "no strings attached",
  "as seen on", "compare rates", "opt in", "subscribe now", "remove",
  "bulk", "mass email",
];

const urgencyWords = [
  "now", "today", "hurry", "fast", "quick", "rush", "immediately",
  "deadline", "expires", "last chance", "limited", "ending", "final",
  "don't wait", "before it's gone",
];

const curiosityWords = [
  "secret", "revealed", "discover", "surprising", "unexpected", "hidden",
  "truth", "mystery", "untold", "insider", "little-known", "what if",
  "imagine", "guess", "why",
];

const powerWords = [
  "you", "your", "new", "proven", "results", "easy", "simple", "powerful",
  "exclusive", "breakthrough",
];

function countEmojis(text: string): number {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
}

function hasPersonalization(text: string): {
  tokens: boolean;
  youYour: boolean;
} {
  const tokens = /\{[a-zA-Z_]+\}/.test(text);
  const youYour = /\b(you|your|you're|yours|yourself)\b/i.test(text);
  return { tokens, youYour };
}

interface Analysis {
  charCount: number;
  wordCount: number;
  charScore: number;
  spamScore: number;
  foundSpam: string[];
  emojiCount: number;
  emojiEffect: "none" | "helps" | "hurts";
  emojiScore: number;
  personalization: { tokens: boolean; youYour: boolean };
  personalizationScore: number;
  urgencyLevel: number;
  foundUrgency: string[];
  curiosityScore: number;
  foundCuriosity: string[];
  powerScore: number;
  foundPower: string[];
  hasQuestion: boolean;
  hasNumbers: boolean;
  capsRatio: number;
  openRate: number;
}

function analyzeSubjectLine(text: string): Analysis {
  const lower = text.toLowerCase();
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Character count score (ideal: 30-50 characters)
  let charScore = 100;
  if (charCount < 15) charScore = 30;
  else if (charCount < 20) charScore = 45;
  else if (charCount < 30) charScore = 70;
  else if (charCount > 80) charScore = 25;
  else if (charCount > 70) charScore = 40;
  else if (charCount > 60) charScore = 55;
  else if (charCount > 50) charScore = 75;

  // Spam analysis
  const foundSpam = spamWords.filter((w) => lower.includes(w));
  const spamScore = Math.max(0, 100 - foundSpam.length * 15);

  // Emoji analysis
  const emojiCount = countEmojis(text);
  let emojiEffect: "none" | "helps" | "hurts" = "none";
  let emojiScore = 70;
  if (emojiCount === 1 || emojiCount === 2) {
    emojiEffect = "helps";
    emojiScore = 90;
  } else if (emojiCount >= 3) {
    emojiEffect = "hurts";
    emojiScore = 30;
  }

  // Personalization detection
  const personalization = hasPersonalization(text);
  let personalizationScore = 45;
  if (personalization.tokens) personalizationScore += 35;
  if (personalization.youYour) personalizationScore += 20;

  // Urgency level
  const foundUrgency = urgencyWords.filter((w) => lower.includes(w));
  const urgencyLevel = Math.min(100, foundUrgency.length * 25);

  // Curiosity score
  const foundCuriosity = curiosityWords.filter((w) => lower.includes(w));
  const hasQuestion = text.includes("?");
  const hasEllipsis = text.includes("...");
  const curiosityScore = Math.min(
    100,
    foundCuriosity.length * 20 + (hasQuestion ? 20 : 0) + (hasEllipsis ? 15 : 0)
  );

  // Power words
  const foundPower = powerWords.filter((w) => lower.includes(w));
  const powerScore = Math.min(100, foundPower.length * 15);

  // Number presence boost
  const hasNumbers = /\d/.test(text);
  const numberBoost = hasNumbers ? 8 : 0;

  // Caps ratio penalty
  const letters = text.replace(/[^A-Za-z]/g, "");
  const capsRatio =
    letters.length > 0
      ? text.replace(/[^A-Z]/g, "").length / letters.length
      : 0;
  const capsDeduction = capsRatio > 0.5 ? 20 : capsRatio > 0.3 ? 10 : 0;

  // Composite open rate prediction
  const openRate = Math.max(
    8,
    Math.min(
      72,
      (charScore * 0.2 +
        spamScore * 0.15 +
        emojiScore * 0.05 +
        personalizationScore * 0.2 +
        curiosityScore * 0.15 +
        powerScore * 0.1 +
        numberBoost +
        (urgencyLevel > 50 ? 5 : urgencyLevel > 20 ? 3 : 0) -
        capsDeduction) *
        0.65 +
      10
    )
  );

  return {
    charCount,
    wordCount,
    charScore,
    spamScore,
    foundSpam,
    emojiCount,
    emojiEffect,
    emojiScore,
    personalization,
    personalizationScore,
    urgencyLevel,
    foundUrgency,
    curiosityScore,
    foundCuriosity,
    powerScore,
    foundPower,
    hasQuestion,
    hasNumbers,
    capsRatio,
    openRate: Math.round(openRate * 10) / 10,
  };
}

function ScoreBar({
  value,
  max = 100,
  color = "indigo",
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const bgMap: Record<string, string> = {
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };
  return (
    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
      <div
        className={`h-2 rounded-full ${
          bgMap[color] || bgMap.indigo
        } transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ResultCard({
  label,
  subjectLine,
  analysis,
  isWinner,
}: {
  label: string;
  subjectLine: string;
  analysis: Analysis;
  isWinner: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 flex-1 min-w-0 ${
        isWinner
          ? "border-indigo-500/50 bg-indigo-500/5"
          : "border-slate-800 bg-slate-900/60"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-semibold text-slate-200">{label}</span>
        {isWinner && (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold tracking-wide uppercase">
            Winner
          </span>
        )}
      </div>
      <p className="text-sm text-slate-400 mb-4 italic truncate">
        &ldquo;{subjectLine}&rdquo;
      </p>
      <div className="text-3xl font-bold text-indigo-400 mb-1">
        {analysis.openRate}%
      </div>
      <p className="text-xs text-slate-500 mb-6">Predicted Open Rate</p>

      <div className="space-y-4">
        {/* Spam Score */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Spam Score</span>
            <span
              className={
                analysis.spamScore >= 70 ? "text-green-400" : "text-red-400"
              }
            >
              {analysis.spamScore}/100
            </span>
          </div>
          <ScoreBar
            value={analysis.spamScore}
            color={analysis.spamScore >= 70 ? "green" : "red"}
          />
          {analysis.foundSpam.length > 0 && (
            <p className="text-xs text-red-400/80 mt-1">
              Triggers: {analysis.foundSpam.slice(0, 5).join(", ")}
              {analysis.foundSpam.length > 5
                ? ` +${analysis.foundSpam.length - 5} more`
                : ""}
            </p>
          )}
        </div>

        {/* Character Count */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Character Count</span>
            <span
              className={
                analysis.charScore >= 75 ? "text-green-400" : "text-yellow-400"
              }
            >
              {analysis.charCount} chars
            </span>
          </div>
          <ScoreBar
            value={analysis.charScore}
            color={analysis.charScore >= 75 ? "green" : "yellow"}
          />
          <p className="text-xs text-slate-500 mt-1">
            {analysis.charCount < 30
              ? "Consider adding more context"
              : analysis.charCount > 50
              ? "May get truncated on mobile"
              : "Ideal length for most clients"}
          </p>
        </div>

        {/* Emoji */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Emoji Detection</span>
            <span className="text-slate-300">
              {analysis.emojiCount} found
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {analysis.emojiEffect === "helps"
              ? "1-2 emojis can improve open rates by 5-10%"
              : analysis.emojiEffect === "hurts"
              ? "Excessive emojis may trigger spam filters"
              : "No emojis found -- consider adding one for visual impact"}
          </p>
        </div>

        {/* Personalization */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Personalization</span>
            <span className="text-slate-300">
              {analysis.personalizationScore}/100
            </span>
          </div>
          <ScoreBar value={analysis.personalizationScore} color="violet" />
          <p className="text-xs text-slate-500 mt-1">
            {analysis.personalization.tokens && "Merge tokens detected. "}
            {analysis.personalization.youYour && 'Uses "you/your" language. '}
            {!analysis.personalization.tokens &&
              !analysis.personalization.youYour &&
              "Add {name} or use \"you/your\" for better engagement"}
          </p>
        </div>

        {/* Urgency */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Urgency Level</span>
            <span className="text-slate-300">{analysis.urgencyLevel}%</span>
          </div>
          <ScoreBar value={analysis.urgencyLevel} color="yellow" />
          {analysis.foundUrgency.length > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              Words: {analysis.foundUrgency.join(", ")}
            </p>
          )}
        </div>

        {/* Curiosity */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Curiosity Score</span>
            <span className="text-slate-300">{analysis.curiosityScore}%</span>
          </div>
          <ScoreBar value={analysis.curiosityScore} color="indigo" />
          {(analysis.hasQuestion ||
            analysis.foundCuriosity.length > 0) && (
            <p className="text-xs text-slate-500 mt-1">
              {analysis.hasQuestion ? "Contains question. " : ""}
              {analysis.foundCuriosity.length > 0
                ? `Words: ${analysis.foundCuriosity.join(", ")}`
                : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubjectLineTesterPage() {
  const [lineA, setLineA] = useState("");
  const [lineB, setLineB] = useState("");
  const [resultA, setResultA] = useState<Analysis | null>(null);
  const [resultB, setResultB] = useState<Analysis | null>(null);
  const [copied, setCopied] = useState(false);

  const canTest = lineA.trim().length > 0 && lineB.trim().length > 0;

  const runTest = () => {
    if (!canTest) return;
    setResultA(analyzeSubjectLine(lineA.trim()));
    setResultB(analyzeSubjectLine(lineB.trim()));
  };

  const winnerIsA =
    resultA && resultB ? resultA.openRate >= resultB.openRate : false;

  const copyReport = () => {
    if (!resultA || !resultB) return;
    const divider = "─".repeat(50);
    const lines = [
      "SUBJECT LINE A/B TEST REPORT",
      divider,
      "",
      `Subject A: ${lineA}`,
      `Subject B: ${lineB}`,
      "",
      "METRIC COMPARISON",
      divider,
      `  Open Rate Prediction:  A: ${resultA.openRate}%     B: ${resultB.openRate}%`,
      `  Spam Score:            A: ${resultA.spamScore}/100   B: ${resultB.spamScore}/100`,
      `  Character Count:       A: ${resultA.charCount}        B: ${resultB.charCount}`,
      `  Word Count:            A: ${resultA.wordCount}         B: ${resultB.wordCount}`,
      `  Emoji Count:           A: ${resultA.emojiCount}         B: ${resultB.emojiCount}`,
      `  Personalization:       A: ${resultA.personalizationScore}/100   B: ${resultB.personalizationScore}/100`,
      `  Urgency Level:         A: ${resultA.urgencyLevel}%       B: ${resultB.urgencyLevel}%`,
      `  Curiosity Score:       A: ${resultA.curiosityScore}%       B: ${resultB.curiosityScore}%`,
      `  Power Word Score:      A: ${resultA.powerScore}/100   B: ${resultB.powerScore}/100`,
      "",
      divider,
      `WINNER: Subject ${winnerIsA ? "A" : "B"} with ${
        winnerIsA ? resultA.openRate : resultB.openRate
      }% predicted open rate`,
      "",
      "Generated by AgentPill Lab - Subject Line Tester",
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      num: "1",
      title: "Enter Two Subject Lines",
      desc: "Write your A and B variants to compare head-to-head.",
    },
    {
      num: "2",
      title: "Run the Analysis",
      desc: "Get spam detection, personalization, urgency, and curiosity scores for each.",
    },
    {
      num: "3",
      title: "Pick the Winner",
      desc: "See the side-by-side breakdown with a clear winner badge and export your report.",
    },
  ];

  const comparisonRows: [string, string, string, string][] =
    resultA && resultB
      ? [
          ["Open Rate", `${resultA.openRate}%`, `${resultB.openRate}%`, resultA.openRate >= resultB.openRate ? "A" : "B"],
          ["Spam Score", `${resultA.spamScore}/100`, `${resultB.spamScore}/100`, resultA.spamScore >= resultB.spamScore ? "A" : "B"],
          ["Char Count", `${resultA.charCount}`, `${resultB.charCount}`, resultA.charScore >= resultB.charScore ? "A" : "B"],
          ["Word Count", `${resultA.wordCount}`, `${resultB.wordCount}`, Math.abs(resultA.wordCount - 7) <= Math.abs(resultB.wordCount - 7) ? "A" : "B"],
          ["Emoji", `${resultA.emojiCount}`, `${resultB.emojiCount}`, resultA.emojiScore >= resultB.emojiScore ? "A" : "B"],
          ["Personalization", `${resultA.personalizationScore}/100`, `${resultB.personalizationScore}/100`, resultA.personalizationScore >= resultB.personalizationScore ? "A" : "B"],
          ["Urgency", `${resultA.urgencyLevel}%`, `${resultB.urgencyLevel}%`, resultA.urgencyLevel >= resultB.urgencyLevel ? "A" : "B"],
          ["Curiosity", `${resultA.curiosityScore}%`, `${resultB.curiosityScore}%`, resultA.curiosityScore >= resultB.curiosityScore ? "A" : "B"],
          ["Power Words", `${resultA.powerScore}/100`, `${resultB.powerScore}/100`, resultA.powerScore >= resultB.powerScore ? "A" : "B"],
        ]
      : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
          Instant, private, 100% in your browser
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Subject Line Tester
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A/B test your email subject lines before you send. Compare spam
          triggers, personalization, urgency, and curiosity scores side by side
          with a clear winner.
        </p>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-center mb-10 text-slate-200">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                {s.num}
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Tool */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 text-slate-100">
            Test Your Subject Lines
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Subject Line A *
              </label>
              <input
                type="text"
                value={lineA}
                onChange={(e) => setLineA(e.target.value)}
                placeholder="Your first subject line variant"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <p className="text-xs text-slate-600 mt-1">
                {lineA.length} characters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Subject Line B *
              </label>
              <input
                type="text"
                value={lineB}
                onChange={(e) => setLineB(e.target.value)}
                placeholder="Your second subject line variant"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <p className="text-xs text-slate-600 mt-1">
                {lineB.length} characters
              </p>
            </div>
          </div>

          <button
            onClick={runTest}
            disabled={!canTest}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Test Both
          </button>

          {/* Results */}
          {resultA && resultB && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <h3 className="text-lg font-semibold text-slate-100">
                  Comparison Results
                </h3>
                <button
                  onClick={copyReport}
                  className="px-4 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-sm text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                >
                  {copied ? "Copied!" : "Copy Report"}
                </button>
              </div>

              {/* Side-by-side cards */}
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <ResultCard
                  label="Subject A"
                  subjectLine={lineA}
                  analysis={resultA}
                  isWinner={winnerIsA}
                />
                <ResultCard
                  label="Subject B"
                  subjectLine={lineB}
                  analysis={resultB}
                  isWinner={!winnerIsA}
                />
              </div>

              {/* Detailed Breakdown Table */}
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-300">
                    Detailed Breakdown
                  </h4>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/40">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">
                        Metric
                      </th>
                      <th className="text-center px-4 py-3 text-slate-400 font-medium">
                        Subject A
                      </th>
                      <th className="text-center px-4 py-3 text-slate-400 font-medium">
                        Subject B
                      </th>
                      <th className="text-center px-4 py-3 text-slate-400 font-medium">
                        Better
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {comparisonRows.map(([metric, a, b, better]) => (
                      <tr key={metric} className="bg-slate-900/30">
                        <td className="px-4 py-3 text-slate-300">{metric}</td>
                        <td
                          className={`px-4 py-3 text-center ${
                            better === "A"
                              ? "text-indigo-400 font-semibold"
                              : "text-slate-400"
                          }`}
                        >
                          {a}
                        </td>
                        <td
                          className={`px-4 py-3 text-center ${
                            better === "B"
                              ? "text-indigo-400 font-semibold"
                              : "text-slate-400"
                          }`}
                        >
                          {b}
                        </td>
                        <td className="px-4 py-3 text-center text-indigo-400 font-semibold">
                          {better}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-600 mt-4 text-center">
                Open rate predictions are heuristic estimates based on subject
                line characteristics. Actual results depend on audience, sender
                reputation, and send time.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-md mx-auto px-4 pb-20">
        <h2 className="text-2xl font-semibold text-center mb-8 text-slate-200">
          Pricing
        </h2>
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-8 text-center">
          <div className="text-sm text-indigo-400 font-medium mb-2">PRO</div>
          <div className="text-4xl font-bold text-slate-100 mb-1">
            $7
            <span className="text-lg font-normal text-slate-400">/mo</span>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Unlimited A/B testing with full analysis breakdown
          </p>
          <ul className="text-sm text-slate-300 space-y-3 mb-8 text-left">
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> Side-by-side
              comparison with winner badge
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> 50+ spam trigger
              word detection
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> Personalization
              and merge token analysis
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> Urgency,
              curiosity, and power word scoring
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> Exportable
              comparison reports
            </li>
          </ul>
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>AgentPill Lab &mdash; Subject Line Tester</span>
          <span>
            All processing happens locally. Your data never leaves your device.
          </span>
        </div>
      </footer>
    </div>
  );
}
