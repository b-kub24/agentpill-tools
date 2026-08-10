"use client";

import { useState } from "react";

// ------- Scoring heuristics: 100% client-side, zero API calls -------

const COMMON_BRAND_WORDS = (
  "cloud tech hub lab labs app apps pro max plus smart digital data net " +
  "web soft sync link stack shift spark nova pulse flow core edge peak " +
  "apex zen bolt dash mint leaf loop grid byte bit pixel logic mind wave " +
  "beam nest hive forge craft works studio media group global prime elite " +
  "alpha beta meta ultra hyper super mega neo omni eco bio geo aero astro " +
  "solar lunar terra aqua fire storm cyber quantum fusion vertex vortex " +
  "zenith summit atlas titan orbit rocket launch scale boost lift rise " +
  "grow bloom thrive vital pure true clear bright shine glow now one box " +
  "kit base space place point spot zone land world city home go get my ai"
).split(" ");

const REAL_ENGLISH_WORDS = (
  "score brand name table chair light water house green apple stone river " +
  "dream honest simple happy brave quick silver golden ocean forest amber " +
  "candle window garden market bridge castle circle square shadow copper " +
  "velvet marble anchor harbor meadow willow ember frost dawn dusk echo " +
  "iris coral fable quill saga tide crest bloom drift flint grove haven"
).split(" ");

const clean = (s: string) => s.trim().toLowerCase();
const lettersOnly = (s: string) => clean(s).replace(/[^a-z]/g, "");
const compactName = (s: string) => clean(s).replace(/\s+/g, "");
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function countSyllables(word: string): number {
  const w = lettersOnly(word);
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let n = groups ? groups.length : 1;
  if (w.length > 2 && w.endsWith("e") && !w.endsWith("le") && n > 1) n -= 1;
  return Math.max(1, n);
}

function scoreLength(name: string): number {
  const len = compactName(name).length;
  if (len >= 4 && len <= 8) return 100;
  if (len === 3 || (len >= 9 && len <= 10)) return 75;
  if (len === 2 || (len >= 11 && len <= 12)) return 50;
  return 25;
}

function scoreMemorability(name: string): number {
  const w = lettersOnly(name);
  if (!w) return 0;
  let s = 40;
  const syl = countSyllables(w);
  if (syl <= 2) s += 30;
  else if (syl === 3) s += 15;
  else s -= 10;
  const vowels = (w.match(/[aeiou]/g) || []).length;
  const ratio = vowels / w.length;
  if (ratio >= 0.3 && ratio <= 0.55) s += 15;
  else if (ratio > 0) s += 5;
  if (/(.)\1/.test(w)) s += 5; // double letters are catchy
  if (/[aeiou]$/.test(w)) s += 5; // vowel endings stick in memory
  const patterns = ["er", "on", "an", "re", "in", "st", "ar", "le", "ta"];
  if (patterns.some((p) => w.includes(p))) s += 5;
  return clamp(s);
}

function scorePronounceability(name: string): number {
  const w = lettersOnly(name);
  if (!w) return 0;
  const vowels = (w.match(/[aeiouy]/g) || []).length;
  if (vowels === 0) return 10;
  let s = 100;
  const clusters = w.match(/[bcdfghjklmnpqrstvwxz]{3,}/g) || [];
  for (const c of clusters) s -= c.length >= 4 ? 35 : 20;
  if (/[xz]/.test(w)) s -= 8;
  if (/q(?!u)/.test(w)) s -= 12; // "q" without "u" trips people up
  if (vowels / w.length < 0.25) s -= 15;
  if (countSyllables(w) >= 5) s -= 15;
  return clamp(s);
}

function scoreUniqueness(name: string): number {
  const w = lettersOnly(name);
  if (!w) return 0;
  if (COMMON_BRAND_WORDS.includes(w)) return 15;
  let hits = 0;
  for (const word of COMMON_BRAND_WORDS) {
    if (word.length >= 3 && w.includes(word)) hits += 1;
  }
  return clamp(Math.max(100 - hits * 22, 10));
}

function scoreDomain(name: string): number {
  const c = compactName(name);
  if (!c) return 0;
  let s = 100;
  if (c.length > 15) s -= 30;
  else if (c.length > 12) s -= 15;
  if (c.includes("-")) s -= 25;
  if (/\d/.test(c)) s -= 20;
  if (/[^a-z0-9-]/.test(c)) s -= 25;
  const isRealWord =
    REAL_ENGLISH_WORDS.includes(c) || COMMON_BRAND_WORDS.includes(c);
  if (isRealWord) s -= 20; // dictionary words: .com is almost surely taken
  return clamp(s);
}

function scoreSocial(name: string): number {
  const c = compactName(name);
  if (!c) return 0;
  let s = 100;
  if (c.length > 15) s -= 50; // over most handle limits
  else if (c.length > 12) s -= 15;
  if (/[^a-z0-9]/.test(c)) s -= 30;
  if (/\d/.test(c)) s -= 10;
  if (/(.)\1{2,}/.test(c)) s -= 10; // triple letters are typo bait
  return clamp(s);
}

function gradeFor(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

type Scores = {
  length: number;
  memorability: number;
  pronounceability: number;
  uniqueness: number;
  domain: number;
  social: number;
};

type Result = {
  name: string;
  scores: Scores;
  overall: number;
  grade: string;
  recs: string[];
};

function buildRecs(name: string, sc: Scores): string[] {
  const recs: string[] = [];
  const c = compactName(name);
  if (sc.length < 75)
    recs.push(
      c.length > 10
        ? "Shorten the name — 4 to 8 characters is the sweet spot."
        : "Lengthen the name slightly — very short names are hard to own."
    );
  if (sc.memorability < 75)
    recs.push("Aim for 1-2 syllables with a balanced vowel/consonant mix.");
  if (sc.pronounceability < 75)
    recs.push("Break up consonant clusters so it reads the way it sounds.");
  if (sc.uniqueness < 75)
    recs.push(
      "It leans on overused brand words (tech, hub, cloud...). Try an invented or unexpected word."
    );
  if (sc.domain < 75)
    recs.push(
      "Drop hyphens, numbers, and dictionary words to improve domain readiness."
    );
  if (sc.social < 75)
    recs.push("Keep it under 15 characters with letters only for handles.");
  if (recs.length === 0)
    recs.push("Strong across the board — verify live availability and commit.");
  return recs;
}

function analyze(name: string): Result {
  const scores: Scores = {
    length: scoreLength(name),
    memorability: scoreMemorability(name),
    pronounceability: scorePronounceability(name),
    uniqueness: scoreUniqueness(name),
    domain: scoreDomain(name),
    social: scoreSocial(name),
  };
  const vals = Object.values(scores);
  const overall = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  return { name: name.trim(), scores, overall, grade: gradeFor(overall), recs: buildRecs(name, scores) };
}

const CATEGORIES: { key: keyof Scores; label: string; est?: boolean }[] = [
  { key: "length", label: "Length" },
  { key: "memorability", label: "Memorability" },
  { key: "pronounceability", label: "Pronounceability" },
  { key: "uniqueness", label: "Uniqueness" },
  { key: "domain", label: "Domain Readiness", est: true },
  { key: "social", label: "Social Handle Readiness", est: true },
];

const barColor = (s: number) =>
  s >= 75 ? "bg-emerald-500" : s >= 50 ? "bg-yellow-500" : "bg-red-500";
const textColor = (s: number) =>
  s >= 75 ? "text-emerald-400" : s >= 50 ? "text-yellow-400" : "text-red-400";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const scoreIt = (e: React.FormEvent) => {
    e.preventDefault();
    const name = input.trim();
    if (!name || !lettersOnly(name)) {
      setError("Enter a brand name containing at least one letter.");
      return;
    }
    if (results.some((r) => compactName(r.name) === compactName(name))) {
      setError("That name is already in your comparison.");
      return;
    }
    if (results.length >= 5) {
      setError("Maximum of 5 names — remove one to add another.");
      return;
    }
    setResults([...results, analyze(name)]);
    setInput("");
    setError("");
  };

  const latest = results[results.length - 1];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      {/* HERO */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-20 text-center sm:pt-28">
        <span className="mb-6 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-sm text-indigo-300">
          Instant, private, in-browser analysis
        </span>
        <h1 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          Brand Name Scorer
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          Score your brand name before you commit. Get instant analysis on
          memorability, pronounceability, and digital readiness.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Stop guessing — know if your brand name will work. Perfect for
          entrepreneurs, startups, and rebranding teams.
        </p>
        <a
          href="#tool"
          className="mt-8 inline-block rounded-xl bg-emerald-500 px-8 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
        >
          Score a name free
        </a>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center text-3xl font-bold text-white">
          How it works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            ["1", "Enter your name", "Type any potential brand name into the scorer."],
            ["2", "Get instant scores", "See ratings across 6 dimensions in under a second."],
            ["3", "Compare side-by-side", "Stack up to 5 candidate names and pick the winner."],
          ].map(([n, t, d]) => (
            <div
              key={n}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 font-bold text-violet-300">
                {n}
              </div>
              <h3 className="mt-4 font-semibold text-white">{t}</h3>
              <p className="mt-2 text-sm text-slate-400">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN TOOL */}
      <section id="tool" className="mx-auto max-w-5xl px-4 py-14">
        <div className="rounded-3xl border border-indigo-500/20 bg-slate-900/60 p-6 shadow-2xl shadow-indigo-950/50 sm:p-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Score your brand name
          </h2>
          <form onSubmit={scoreIt} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Lumora"
              maxLength={40}
              aria-label="Brand name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-lg text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Score It
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          {latest && (
            <div className="mt-10">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    &ldquo;{latest.name}&rdquo;
                  </h3>
                  <p className="text-sm text-slate-400">Latest analysis</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={"text-4xl font-extrabold " + textColor(latest.overall)}>
                    {latest.grade}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {latest.overall}
                      <span className="text-base text-slate-500">/100</span>
                    </div>
                    <div className="text-xs text-slate-500">overall score</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {CATEGORIES.map((c) => {
                  const s = latest.scores[c.key];
                  return (
                    <div key={c.key} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">
                          {c.label}
                          {c.est && <span className="text-indigo-400"> *</span>}
                        </span>
                        <span className={"font-bold " + textColor(s)}>{s}</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={"h-full rounded-full " + barColor(s)}
                          style={{ width: s + "%" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                * Readiness is an estimate based on the name&apos;s structure.
                Live domain and social handle availability cannot be checked in
                your browser — always verify with a registrar before committing.
              </p>

              <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
                <h4 className="font-semibold text-violet-300">Recommendations</h4>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-300">
                  {latest.recs.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>

              {results.length < 5 && (
                <button
                  onClick={() => {
                    setError("");
                    document.querySelector<HTMLInputElement>("input[aria-label='Brand name']")?.focus();
                  }}
                  className="mt-6 rounded-xl border border-indigo-500/40 px-6 py-3 font-semibold text-indigo-300 transition hover:bg-indigo-500/10"
                >
                  + Add Another Name ({results.length}/5)
                </button>
              )}
            </div>
          )}

          {results.length >= 2 && (
            <div className="mt-10 overflow-x-auto">
              <h3 className="mb-4 text-xl font-bold text-white">
                Side-by-side comparison
              </h3>
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 pr-4 font-medium">Category</th>
                    {results.map((r) => (
                      <th key={r.name} className="px-3 py-2 font-semibold text-white">
                        {r.name}
                        <button
                          onClick={() => setResults(results.filter((x) => x.name !== r.name))}
                          aria-label={"Remove " + r.name}
                          className="ml-2 text-slate-500 hover:text-red-400"
                        >
                          &times;
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((c) => (
                    <tr key={c.key} className="border-b border-slate-800/60">
                      <td className="py-2 pr-4 text-slate-300">
                        {c.label}
                        {c.est && <span className="text-indigo-400"> *</span>}
                      </td>
                      {results.map((r) => (
                        <td key={r.name} className={"px-3 py-2 font-semibold " + textColor(r.scores[c.key])}>
                          {r.scores[c.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 pr-4 font-bold text-white">Overall</td>
                    {results.map((r) => (
                      <td key={r.name} className={"px-3 py-3 font-extrabold " + textColor(r.overall)}>
                        {r.overall} ({r.grade})
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white">Pro plan</h2>
          <div className="mt-4 text-5xl font-extrabold text-white">
            $7<span className="text-xl font-medium text-slate-400">/month</span>
          </div>
          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-slate-300">
            <li>&#10003; Unlimited name scoring &amp; comparisons</li>
            <li>&#10003; Saved shortlists and score history</li>
            <li>&#10003; Exportable naming reports</li>
            <li>&#10003; Early access to new scoring dimensions</li>
          </ul>
          {joined ? (
            <p className="mt-8 font-semibold text-emerald-400">
              You&apos;re on the list! We&apos;ll email you at launch.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (/^\S+@\S+\.\S+$/.test(email)) setJoined(true);
              }}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Join waitlist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 px-4 py-10 text-center text-sm text-slate-500">
        <p className="font-semibold text-slate-400">Brand Name Scorer</p>
        <p className="mt-2">
          All scoring runs locally in your browser using linguistic heuristics.
          Domain and social scores are structural readiness estimates, not live
          availability checks.
        </p>
        <p className="mt-2">&copy; 2026 Brand Name Scorer. All rights reserved.</p>
      </footer>
    </main>
  );
}
