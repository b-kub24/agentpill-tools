"use client";

import { useState } from "react";

const suffixes = ["-ly", "-ify", "-io", "-ful", "-hub", "-stack", "-ware", "-base", "-mint", "-spot"];
const prefixes = ["go", "super", "meta", "re", "un", "neo", "hyper", "omni", "zen", "flux"];
const techPool = ["sync", "link", "pulse", "wave", "nest", "core", "mesh", "loop", "node", "beam"];
const playfulPool = ["fizz", "pop", "snap", "buzz", "doodle", "wiggle", "spark", "bloom", "zippy", "chirp"];
const modernPool = ["aura", "nova", "prism", "helix", "orbit", "slate", "vapor", "drift", "apex", "lumen"];
const minimalPool = ["one", "dot", "line", "simple", "bare", "pure", "clear", "lean", "flat", "calm"];
const proPool = ["trust", "prime", "summit", "forge", "shield", "vault", "bridge", "scope", "edge", "peak"];

function hash(s: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function portmanteau(a: string, b: string): string {
  const midA = Math.ceil(a.length * 0.6);
  const startB = Math.floor(b.length * 0.4);
  return capitalize(a.slice(0, midA) + b.slice(startB));
}

function vowelShift(word: string): string {
  const vowels = "aeiou";
  const shifted = "eioua";
  return word
    .split("")
    .map((c) => {
      const idx = vowels.indexOf(c.toLowerCase());
      if (idx >= 0) {
        const replacement = shifted[idx];
        return c === c.toUpperCase() ? replacement.toUpperCase() : replacement;
      }
      return c;
    })
    .join("");
}

interface GeneratedName {
  name: string;
  comScore: number;
  styleScore: number;
  memoScore: number;
}

function generateNames(
  industry: string,
  keywords: string[],
  style: string,
  length: string,
  mustInclude: string,
  seed: number
): GeneratedName[] {
  const stylePool =
    style === "Tech"
      ? techPool
      : style === "Playful"
      ? playfulPool
      : style === "Modern"
      ? modernPool
      : style === "Minimal"
      ? minimalPool
      : proPool;

  const allKeywords = [
    ...keywords.filter((k) => k.length > 0),
    ...industry
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2),
  ];

  if (allKeywords.length === 0) return [];

  const results: GeneratedName[] = [];
  const seen = new Set<string>();

  const maxLen = length === "short" ? 8 : 14;

  const addName = (
    rawName: string,
    comBase: number,
    styleBase: number,
    memoBase: number
  ) => {
    const name = rawName.replace(/[^a-zA-Z0-9]/g, "");
    if (!name || name.length < 3 || name.length > maxLen) return;
    const lower = name.toLowerCase();
    if (seen.has(lower)) return;
    if (mustInclude && !lower.includes(mustInclude.toLowerCase())) return;
    seen.add(lower);
    const h = hash(name, seed);
    results.push({
      name: capitalize(name),
      comScore: Math.max(1, Math.min(5, comBase + (h % 3) - 1)),
      styleScore: Math.max(40, Math.min(99, styleBase + (h % 30))),
      memoScore: Math.max(50, Math.min(99, memoBase + (h % 25))),
    });
  };

  // Strategy 1: Portmanteau combinations of keywords + style words
  for (let i = 0; i < allKeywords.length && results.length < 40; i++) {
    for (let j = 0; j < stylePool.length && results.length < 40; j++) {
      const idx = (i + j + seed) % stylePool.length;
      addName(portmanteau(allKeywords[i], stylePool[idx]), 2, 70, 65);
      addName(portmanteau(stylePool[idx], allKeywords[i]), 3, 65, 70);
    }
  }

  // Strategy 2: Suffix patterns (-ly, -ify, -io, etc.)
  for (let i = 0; i < allKeywords.length; i++) {
    const base = hash(allKeywords[i], seed);
    addName(capitalize(allKeywords[i]) + suffixes[base % suffixes.length], 3, 75, 72);
    addName(capitalize(allKeywords[i]) + suffixes[(base + 3) % suffixes.length], 2, 72, 68);
    addName(capitalize(allKeywords[i]) + suffixes[(base + 5) % suffixes.length], 2, 70, 74);
  }

  // Strategy 3: Prefix patterns (go-, super-, meta-, etc.)
  for (let i = 0; i < allKeywords.length; i++) {
    const base = hash(allKeywords[i], seed + 7);
    addName(capitalize(prefixes[base % prefixes.length]) + capitalize(allKeywords[i]), 2, 68, 74);
    addName(capitalize(prefixes[(base + 4) % prefixes.length]) + capitalize(allKeywords[i]), 3, 66, 70);
  }

  // Strategy 4: Vowel-shifted variants
  for (const kw of allKeywords) {
    const shifted = vowelShift(kw);
    if (shifted.toLowerCase() !== kw.toLowerCase()) {
      addName(capitalize(shifted), 4, 60, 78);
    }
  }

  // Strategy 5: Keyword + style word direct combos
  for (let i = 0; i < allKeywords.length; i++) {
    const sIdx = (i + seed) % stylePool.length;
    addName(capitalize(allKeywords[i]) + capitalize(stylePool[sIdx]), 2, 80, 60);
    addName(capitalize(stylePool[(sIdx + 2) % stylePool.length]) + capitalize(allKeywords[i]), 3, 78, 62);
  }

  // Strategy 6: Double keyword combos
  for (let i = 0; i < allKeywords.length; i++) {
    for (let j = i + 1; j < allKeywords.length; j++) {
      addName(capitalize(allKeywords[i]) + capitalize(allKeywords[j]), 2, 72, 66);
      addName(capitalize(allKeywords[j]) + capitalize(allKeywords[i]), 3, 70, 68);
    }
  }

  // Sort by combined score descending and return top 10
  results.sort(
    (a, b) => b.styleScore + b.memoScore - (a.styleScore + a.memoScore)
  );
  return results.slice(0, 10);
}

function ComDots({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full transition-colors ${
            i < score ? "bg-indigo-400" : "bg-slate-700"
          }`}
        />
      ))}
    </div>
  );
}

export default function StartupNameGeneratorPage() {
  const [industry, setIndustry] = useState("");
  const [keywordsRaw, setKeywordsRaw] = useState("");
  const [style, setStyle] = useState("Modern");
  const [length, setLength] = useState("short");
  const [mustInclude, setMustInclude] = useState("");
  const [names, setNames] = useState<GeneratedName[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [seed, setSeed] = useState(1);
  const [copied, setCopied] = useState(false);

  const canGenerate = industry.trim() !== "" || keywordsRaw.trim() !== "";

  const generate = (overrideSeed?: number) => {
    if (!canGenerate) return;
    const s = overrideSeed ?? seed;
    const keywords = keywordsRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    const results = generateNames(industry.trim(), keywords, style, length, mustInclude.trim(), s);
    setNames(results);
  };

  const generateMore = () => {
    const nextSeed = seed + 7;
    setSeed(nextSeed);
    generate(nextSeed);
  };

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const copyFavorites = () => {
    const favNames = names.filter((n) => favorites.has(n.name));
    if (favNames.length === 0) return;
    const lines = [
      "STARTUP NAME SHORTLIST",
      "======================",
      "",
      ...favNames.map(
        (n) =>
          `${n.name}  |  .com likelihood: ${n.comScore}/5  |  Style match: ${n.styleScore}%  |  Memorability: ${n.memoScore}%`
      ),
      "",
      `Generated for: ${industry} | Style: ${style} | Keywords: ${keywordsRaw}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      num: "1",
      title: "Describe Your Startup",
      desc: "Enter your industry niche, target keywords, and pick a naming style that fits your brand.",
    },
    {
      num: "2",
      title: "Generate Names",
      desc: "Get 10 creative names with .com availability hints, style match, and memorability scores.",
    },
    {
      num: "3",
      title: "Favorite & Export",
      desc: "Star the names you love, regenerate for more options, and copy your shortlist.",
    },
  ];

  const styleOptions = [
    { value: "Modern", desc: "Clean, contemporary feel" },
    { value: "Playful", desc: "Fun, energetic vibe" },
    { value: "Professional", desc: "Trust and authority" },
    { value: "Tech", desc: "Technical, cutting-edge" },
    { value: "Minimal", desc: "Simple and understated" },
  ];

  const favCount = names.filter((n) => favorites.has(n.name)).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
          Instant, private, 100% in your browser
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Startup Name Generator
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Generate creative, memorable startup names with availability hints and
          scoring. Powered by deterministic algorithms, entirely in your
          browser. No API keys needed.
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
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 text-slate-100">
            Generate Startup Names
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Industry / Niche *
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Fintech, Health, EdTech, SaaS"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={keywordsRaw}
                onChange={(e) => setKeywordsRaw(e.target.value)}
                placeholder="pay, swift, money, cloud"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Style preference as selectable cards */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Style Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {styleOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStyle(opt.value)}
                  className={`rounded-xl border px-3 py-3 text-center transition-all ${
                    style === opt.value
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <div className="text-sm font-medium">{opt.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Desired Length
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setLength("short")}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    length === "short"
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  Short (3-8 chars)
                </button>
                <button
                  onClick={() => setLength("medium")}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    length === "medium"
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  Medium (up to 14)
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Must Include Word (optional)
              </label>
              <input
                type="text"
                value={mustInclude}
                onChange={(e) => setMustInclude(e.target.value)}
                placeholder="e.g. pay, cloud"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => generate()}
              disabled={!canGenerate}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate Names
            </button>
            {names.length > 0 && (
              <button
                onClick={generateMore}
                className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
              >
                Generate More
              </button>
            )}
          </div>

          {/* Results */}
          {names.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-slate-100">
                  Generated Names
                </h3>
                <button
                  onClick={copyFavorites}
                  disabled={favCount === 0}
                  className="px-4 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-sm text-indigo-300 hover:bg-indigo-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {copied ? "Copied!" : `Copy Favorites (${favCount})`}
                </button>
              </div>

              {/* Table header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                <div className="col-span-1" />
                <div className="col-span-4">Name</div>
                <div className="col-span-3 text-center">.com Likelihood</div>
                <div className="col-span-2 text-center">Style Match</div>
                <div className="col-span-2 text-center">Memorability</div>
              </div>

              <div className="space-y-2">
                {names.map((n, idx) => (
                  <div
                    key={n.name + idx}
                    className={`rounded-xl border p-4 transition-all ${
                      favorites.has(n.name)
                        ? "border-indigo-500/40 bg-indigo-500/5"
                        : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600"
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <button
                          onClick={() => toggleFavorite(n.name)}
                          className="text-xl transition-colors hover:scale-110 transform"
                          title={
                            favorites.has(n.name)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {favorites.has(n.name) ? (
                            <span className="text-yellow-400">&#9733;</span>
                          ) : (
                            <span className="text-slate-600 hover:text-slate-400">
                              &#9734;
                            </span>
                          )}
                        </button>
                      </div>
                      <div className="col-span-4">
                        <span className="text-lg font-semibold text-slate-100">
                          {n.name}
                        </span>
                        <span className="text-slate-600 text-sm ml-1">
                          .com
                        </span>
                      </div>
                      <div className="col-span-3 flex flex-col items-center gap-1">
                        <ComDots score={n.comScore} />
                        <span className="text-xs text-slate-500">
                          {n.comScore}/5
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-indigo-300 font-semibold">
                          {n.styleScore}%
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-violet-300 font-semibold">
                          {n.memoScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-600 mt-4 text-center">
                .com likelihood is an estimate based on name length and pattern.
                Always verify actual domain availability with a registrar.
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
            Unlimited name generation across all style modes
          </p>
          <ul className="text-sm text-slate-300 space-y-3 mb-8 text-left">
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> 10 names per
              generation with infinite reruns
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> 5 distinct style
              modes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> .com availability
              scoring
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> Favorites list
              with export
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> 6 algorithmic
              generation strategies
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
          <span>AgentPill Lab &mdash; Startup Name Generator</span>
          <span>
            All processing happens locally. Your data never leaves your device.
          </span>
        </div>
      </footer>
    </div>
  );
}
