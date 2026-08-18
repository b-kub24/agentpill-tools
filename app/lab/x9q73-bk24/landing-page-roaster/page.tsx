"use client"

import { useState } from "react"

// ── Word Lists & Constants ──────────────────────────────────────────────────────

const WEAK_WORDS = [
  "very", "really", "just", "maybe", "things", "stuff", "nice", "good",
  "great", "basically", "actually", "literally", "quite", "somewhat",
  "rather", "pretty", "kind of", "sort of", "a lot", "many", "some",
  "interesting", "amazing", "awesome", "cool", "simple", "easy",
  "helpful", "important", "big", "small", "better", "best",
]

const POWER_WORDS = [
  "proven", "guaranteed", "exclusive", "instant", "revolutionary",
  "breakthrough", "powerful", "ultimate", "essential", "transform",
  "dominate", "unleash", "skyrocket", "effortless", "secret", "free",
  "new", "limited", "urgent", "remarkable", "extraordinary", "incredible",
  "massive", "explosive", "unstoppable", "unbeatable", "game-changing",
  "cutting-edge", "world-class", "elite", "premium", "zero-risk",
  "foolproof", "battle-tested", "blazing", "turbocharged", "insider",
]

const EMOTIONAL_WORDS = [
  "love", "hate", "fear", "risk", "fail", "win", "lose", "crush",
  "dream", "nightmare", "obsess", "crave", "thrive", "struggle",
  "conquer", "destroy", "empower", "inspire", "frustrate", "delight",
  "regret", "confident", "anxious", "excited", "relief", "pride",
]

const CTA_VERBS = [
  "get", "start", "try", "discover", "unlock", "claim", "grab", "join",
  "launch", "build", "create", "boost", "download", "access", "reserve",
  "secure", "activate", "begin", "explore", "master", "deploy", "ship",
  "see", "watch", "learn", "request", "schedule", "book",
]

const URGENCY_WORDS = [
  "now", "today", "limited", "hurry", "fast", "instant", "immediately",
  "before", "deadline", "expires", "last chance", "don't miss", "act now",
  "while", "ending", "only", "remaining", "closing", "final",
]

const JARGON_WORDS = [
  "synergy", "leverage", "paradigm", "ecosystem", "holistic", "scalable",
  "disruptive", "best-in-class", "turnkey", "end-to-end", "bleeding edge",
  "next-gen", "robust", "enterprise-grade", "mission-critical", "agile",
  "seamless", "360-degree", "deep dive", "move the needle",
]

const TRUST_PATTERNS: RegExp[] = [
  /\d+%/, /\d+\+/, /\d+k\+?/i, /\$[\d,]+/, /trusted by/i, /used by/i,
  /rated/i, /award/i, /featured in/i, /as seen/i, /certified/i,
  /verified/i, /guarantee/i, /\d+ customer/i, /\d+ team/i, /\d+ compan/i,
  /5[- ]star/i, /4\.\d/i, /fortune/i, /inc\./i, /forbes/i, /g2/i,
]

const BENEFIT_MARKERS = [
  "save", "grow", "increase", "reduce", "improve", "boost", "achieve",
  "gain", "earn", "protect", "avoid", "eliminate", "simplify", "automate",
  "accelerate", "double", "triple", "cut", "slash", "maximize", "minimize",
  "reclaim", "recover", "prevent", "streamline",
]

const FEATURE_MARKERS = [
  "includes", "features", "built with", "powered by", "integrates",
  "supports", "compatible", "specifications", "technical", "architecture",
  "infrastructure", "stack", "api", "sdk", "database", "framework",
  "module", "component", "plugin", "engine",
]

// ── Scoring Helpers ─────────────────────────────────────────────────────────────

function countHits(text: string, words: string[]): number {
  const lower = text.toLowerCase()
  return words.filter((w) => lower.includes(w)).length
}

function matchPatterns(text: string, patterns: RegExp[]): number {
  return patterns.filter((p) => p.test(text)).length
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n))
}

function letterGrade(score: number): string {
  if (score >= 93) return "A+"
  if (score >= 90) return "A"
  if (score >= 87) return "A-"
  if (score >= 83) return "B+"
  if (score >= 80) return "B"
  if (score >= 77) return "B-"
  if (score >= 73) return "C+"
  if (score >= 70) return "C"
  if (score >= 67) return "C-"
  if (score >= 60) return "D"
  return "F"
}

function gradeColor(g: string): string {
  if (g.startsWith("A")) return "text-emerald-400"
  if (g.startsWith("B")) return "text-blue-400"
  if (g.startsWith("C")) return "text-amber-400"
  if (g.startsWith("D")) return "text-orange-400"
  return "text-red-400"
}

function gradeBg(g: string): string {
  if (g.startsWith("A")) return "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30"
  if (g.startsWith("B")) return "from-blue-500/20 to-blue-500/5 border-blue-500/30"
  if (g.startsWith("C")) return "from-amber-500/20 to-amber-500/5 border-amber-500/30"
  if (g.startsWith("D")) return "from-orange-500/20 to-orange-500/5 border-orange-500/30"
  return "from-red-500/20 to-red-500/5 border-red-500/30"
}

function barColor(g: string): string {
  if (g.startsWith("A")) return "#34d399"
  if (g.startsWith("B")) return "#60a5fa"
  if (g.startsWith("C")) return "#fbbf24"
  if (g.startsWith("D")) return "#fb923c"
  return "#f87171"
}

function roastVerdict(score: number): { label: string; desc: string } {
  if (score >= 90) return { label: "Chef's Kiss", desc: "This page is conversion-ready. Ship it and split-test." }
  if (score >= 80) return { label: "Hot Stuff", desc: "Strong page with minor polish needed. Close to peak performance." }
  if (score >= 70) return { label: "Mild Burn", desc: "Decent foundation but several areas are leaving conversions on the table." }
  if (score >= 60) return { label: "Medium Roast", desc: "Real problems here. Follow the fixes below or risk losing half your leads." }
  if (score >= 40) return { label: "Charred", desc: "Heavy rewrite needed. The copy is actively hurting your conversions." }
  return { label: "Scorched Earth", desc: "Start over. Almost every element needs a complete rethink." }
}

// ── Analysis Engine ─────────────────────────────────────────────────────────────

interface Section { score: number; grade: string; fixes: string[] }
interface AnalysisResult {
  headline: Section
  cta: Section
  copy: Section
  trust: Section
  overall: { score: number; grade: string }
}

function analyzeHeadline(headline: string, sub: string): Section {
  const text = (headline + " " + sub).trim()
  let score = 50
  const fixes: string[] = []
  const words = headline.trim().split(/\s+/).filter(Boolean)
  const len = words.length

  if (len >= 6 && len <= 12) score += 15
  else if (len >= 4 && len <= 15) score += 8
  else fixes.push(`Headline is ${len} words — aim for 6-12 for peak impact.`)

  if (/\d/.test(text)) score += 12
  else fixes.push('Add a specific number. Before: "Grow Your Business" → After: "Grow Revenue 3x in 90 Days"')

  const pw = countHits(text, POWER_WORDS)
  score += Math.min(pw * 6, 15)
  if (pw === 0) fixes.push('Add a power word. Before: "Marketing Tool" → After: "Proven Marketing Engine"')

  const ew = countHits(text, EMOTIONAL_WORDS)
  score += Math.min(ew * 4, 8)

  const ww = countHits(text, WEAK_WORDS)
  score -= ww * 5
  if (ww > 0) fixes.push(`Found ${ww} weak word${ww > 1 ? "s" : ""} ("very", "really", "just") — cut them all.`)

  const jw = countHits(text, JARGON_WORDS)
  score -= jw * 4
  if (jw > 0) fixes.push(`Detected ${jw} jargon term${jw > 1 ? "s" : ""}. Replace buzzwords with plain language.`)

  if (/\byou\b|\byour\b/i.test(text)) score += 8
  else fixes.push('Make it about the reader. Before: "Our AI Platform" → After: "Your Growth Engine"')

  if (sub.trim().length > 0) score += 5
  else fixes.push("Add a subheadline to reinforce the value proposition and add context.")

  if (text.includes("?")) score += 3
  if (fixes.length === 0) fixes.push("Strong headline. A/B test a variant with a different emotional angle.")
  return { score: clamp(score), grade: letterGrade(clamp(score)), fixes }
}

function analyzeCTA(text: string): Section {
  let score = 40
  const fixes: string[] = []
  const lower = text.toLowerCase().trim()
  const words = lower.split(/\s+/).filter(Boolean)

  if (CTA_VERBS.some((v) => lower.startsWith(v))) score += 20
  else fixes.push(`Lead with an action verb. Before: "${text}" → After: "Get ${text}" or "Start ${text}"`)

  if (URGENCY_WORDS.some((w) => lower.includes(w))) score += 15
  else fixes.push('Add urgency. Before: "Sign Up" → After: "Start Free Today"')

  if (BENEFIT_MARKERS.some((b) => lower.includes(b))) score += 15
  else fixes.push('Include the benefit. Before: "Submit" → After: "Get My Free Report"')

  if (words.length >= 2 && words.length <= 5) score += 10
  else if (words.length <= 1) { score -= 5; fixes.push('One-word CTAs underperform. Before: "Submit" → After: "Get Started Free"') }
  else { score -= 3; fixes.push(`CTA is ${words.length} words — trim to 2-5 for clarity.`) }

  if (/\bmy\b|\bme\b/i.test(text)) score += 5

  if (/^(submit|click here|learn more|send)$/i.test(lower)) {
    score -= 8
    fixes.push(`"${text}" is generic. Before: "${text}" → After: "Claim Your Free Trial Now"`)
  }

  if (fixes.length === 0) fixes.push('Solid CTA. Test first-person ("Get My...") vs second-person ("Get Your...").')
  return { score: clamp(score), grade: letterGrade(clamp(score)), fixes }
}

function analyzeCopy(text: string): Section {
  let score = 45
  const fixes: string[] = []
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim())
  const words = text.split(/\s+/).filter(Boolean)

  const avgLen = sentences.length > 0 ? words.length / sentences.length : words.length
  if (avgLen <= 20) score += 12
  else if (avgLen <= 25) score += 6
  else fixes.push(`Avg sentence is ${Math.round(avgLen)} words — keep under 20 for readability.`)

  const ben = countHits(text, BENEFIT_MARKERS)
  const feat = countHits(text, FEATURE_MARKERS)
  if (ben > feat) score += 15
  else if (ben === feat && ben > 0) score += 8
  else fixes.push('Lead with benefits, not features. Before: "Built with AI" → After: "Save 10 hrs/week with AI automation"')

  const pw = countHits(text, POWER_WORDS)
  score += Math.min(pw * 3, 12)
  if (pw === 0) fixes.push('Sprinkle power words like "proven", "effortless", or "guaranteed" into your copy.')

  const ww = countHits(text, WEAK_WORDS)
  score -= ww * 3
  if (ww > 2) fixes.push(`${ww} filler words found — trim for sharper copy.`)

  const jw = countHits(text, JARGON_WORDS)
  score -= jw * 3
  if (jw > 1) fixes.push(`${jw} jargon terms detected. Before: "leverage our ecosystem" → After: "use our platform to grow faster"`)

  if (/\byou\b|\byour\b/i.test(text)) score += 8
  else fixes.push('Address the reader directly with "you" and "your".')

  if (words.length < 20) { score -= 10; fixes.push("Body copy is thin. Expand on benefits, objections, or use cases.") }
  else if (words.length > 400) { score -= 3; fixes.push("Copy is long. Cut anything that doesn't sell.") }

  if (text === text.toUpperCase() && text.length > 30) { score -= 5; fixes.push("All-caps copy is hard to read. Use sentence case.") }

  if (fixes.length === 0) fixes.push("Copy reads well. Consider adding a mini case study for extra credibility.")
  return { score: clamp(score), grade: letterGrade(clamp(score)), fixes }
}

function analyzeTrust(social: string, ch: Record<string, boolean>): Section {
  let score = 30
  const fixes: string[] = []

  const pm = matchPatterns(social, TRUST_PATTERNS)
  score += Math.min(pm * 8, 24)
  if (pm === 0 && social.trim()) fixes.push('Add specifics. Before: "Many happy users" → After: "2,847 teams ship faster with us"')
  if (!social.trim()) fixes.push("Add social proof — logos, testimonials, customer counts, or rating badges.")

  if (/stripe|notion|linear|shopify|vercel|google|meta|apple|amazon/i.test(social)) score += 5

  if (ch.testimonials) score += 12; else fixes.push("Add testimonials — the #1 trust driver. Even 2 short quotes help.")
  if (ch.pricing) score += 8; else fixes.push("Show pricing upfront. Hidden pricing increases bounce rate by 40%.")
  if (ch.faq) score += 6; else fixes.push("Add an FAQ to handle objections before they kill conversions.")
  if (ch.video) score += 6; else fixes.push("Add a demo video — pages with video convert up to 86% higher.")
  if (ch.mobile) score += 8; else fixes.push("Make it responsive. 60%+ of traffic is mobile — you are losing leads.")

  if (fixes.length === 0) fixes.push("Trust signals are solid. Add a money-back guarantee badge for extra lift.")
  return { score: clamp(score), grade: letterGrade(clamp(score)), fixes }
}

// ── Page Component ──────────────────────────────────────────────────────────────

export default function LandingPageRoasterPage() {
  const [headline, setHeadline] = useState("")
  const [subheadline, setSubheadline] = useState("")
  const [ctaText, setCtaText] = useState("")
  const [bodyCopy, setBodyCopy] = useState("")
  const [socialProof, setSocialProof] = useState("")
  const [checks, setChecks] = useState({
    testimonials: false, pricing: false, faq: false, video: false, mobile: false,
  })
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)
  const [copied, setCopied] = useState(false)

  const canRoast = headline.trim().length > 2 || ctaText.trim().length > 1

  function handleRoast() {
    const h = analyzeHeadline(headline, subheadline)
    const c = analyzeCTA(ctaText)
    const cp = analyzeCopy(bodyCopy)
    const t = analyzeTrust(socialProof, checks)
    const os = Math.round(h.score * 0.3 + c.score * 0.25 + cp.score * 0.25 + t.score * 0.2)
    setResult({
      headline: h, cta: c, copy: cp, trust: t,
      overall: { score: os, grade: letterGrade(os) },
    })
  }

  function exportReport() {
    if (!result) return
    const r = result
    const v = roastVerdict(r.overall.score)
    const checkedElements = Object.entries(checks)
      .filter(([, val]) => val)
      .map(([key]) => key)
      .join(", ") || "none checked"
    const lines = [
      "========================================",
      "  LANDING PAGE ROAST REPORT",
      "========================================",
      `Generated: ${new Date().toLocaleDateString()}`,
      "",
      `OVERALL ROAST SCORE: ${r.overall.score}/100 (${r.overall.grade})`,
      `Verdict: ${v.label} — ${v.desc}`,
      "",
      "--- INPUT SUMMARY ---",
      `Headline: ${headline || "(empty)"}`,
      `Subheadline: ${subheadline || "(empty)"}`,
      `CTA: ${ctaText || "(empty)"}`,
      `Social Proof: ${socialProof || "(empty)"}`,
      `Elements: ${checkedElements}`,
      "",
      `--- HEADLINE  [ ${r.headline.grade} | ${r.headline.score}/100 ] ---`,
      ...r.headline.fixes.map((f) => `  * ${f}`),
      "",
      `--- CTA  [ ${r.cta.grade} | ${r.cta.score}/100 ] ---`,
      ...r.cta.fixes.map((f) => `  * ${f}`),
      "",
      `--- COPY QUALITY  [ ${r.copy.grade} | ${r.copy.score}/100 ] ---`,
      ...r.copy.fixes.map((f) => `  * ${f}`),
      "",
      `--- TRUST SIGNALS  [ ${r.trust.grade} | ${r.trust.score}/100 ] ---`,
      ...r.trust.fixes.map((f) => `  * ${f}`),
      "",
      "========================================",
      "  Powered by AgentPill Lab",
      "  Landing Page Roaster",
      "========================================",
    ]
    navigator.clipboard.writeText(lines.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const toggle = (key: keyof typeof checks) =>
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }))

  const checkboxItems: [keyof typeof checks, string][] = [
    ["testimonials", "Has testimonials?"],
    ["pricing", "Has pricing?"],
    ["faq", "Has FAQ?"],
    ["video", "Has video?"],
    ["mobile", "Mobile responsive?"],
  ]

  const proFeatures = [
    "Unlimited roasts",
    "Competitor page comparison",
    "Historical score tracking",
    "Priority fix recommendations",
    "Export to PDF & Notion",
    "Weekly re-roast reminders",
  ]

  // ── Score Card sub-component ──

  function ScoreCard({ label, section, icon }: { label: string; section: Section; icon: string }) {
    return (
      <div className={`rounded-2xl border bg-gradient-to-b p-6 ${gradeBg(section.grade)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300">{icon}</span>
            <h3 className="font-semibold text-slate-100">{label}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{section.score}/100</span>
            <span className={`text-2xl font-bold ${gradeColor(section.grade)}`}>{section.grade}</span>
          </div>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
          <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${section.score}%`, background: barColor(section.grade) }} />
        </div>
        <ul className="space-y-2">
          {section.fixes.map((fix, i) => (
            <li key={i} className="text-sm text-slate-300 flex gap-2">
              <span className="text-orange-400 mt-0.5 shrink-0">{"→"}</span><span>{fix}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-wide uppercase rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Instant, private, 100% in your browser
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-violet-400 bg-clip-text text-transparent leading-tight">
            Get Your Landing Page Roasted
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Paste your copy. Get a brutally honest, data-backed teardown with specific
            fixes you can ship today. No API keys, no signups, no judgment stored anywhere.
          </p>
          <a href="#tool" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:brightness-110 transition">
            Roast My Page {"↓"}
          </a>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-4 text-slate-200">How It Works</h2>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
          Three steps to a sharper landing page. Takes under 60 seconds.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Paste Your Copy", desc: "Drop in your headline, subheadline, CTA, body copy, and social proof text." },
            { step: "2", title: "Check Your Elements", desc: "Tell us what your page includes: testimonials, pricing, FAQ, video, mobile." },
            { step: "3", title: "Get Your Roast", desc: "Receive letter grades, scores, and specific before/after fixes for every section." },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                {s.step}
              </div>
              <h3 className="font-semibold mb-2 text-slate-100">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tool ── */}
      <section id="tool" className="max-w-4xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-bold mb-1 text-slate-100">Paste Your Landing Page Copy</h2>
          <p className="text-sm text-slate-500 mb-6">
            Fill in what you have — every field is optional but more input means a better roast.
          </p>

          <div className="space-y-5">
            {/* Text inputs */}
            {([
              ["Headline", headline, setHeadline, "e.g. Ship Products That Customers Love", false],
              ["Subheadline", subheadline, setSubheadline, "e.g. The all-in-one platform for product teams", false],
              ["CTA Button Text", ctaText, setCtaText, "e.g. Start Free Trial", false],
            ] as [string, string, (v: string) => void, string, boolean][]).map(([lbl, val, setter, ph]) => (
              <div key={lbl}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{lbl}</label>
                <input type="text" value={val} onChange={(e) => setter(e.target.value)} placeholder={ph} className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Body Copy</label>
              <textarea value={bodyCopy} onChange={(e) => setBodyCopy(e.target.value)} rows={5} placeholder="Paste the main body text of your landing page..." className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Social Proof Text</label>
              <textarea value={socialProof} onChange={(e) => setSocialProof(e.target.value)} rows={3} placeholder='e.g. "Trusted by 2,500+ teams including Stripe, Notion, and Linear"' className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-y" />
            </div>

            {/* Checkboxes */}
            <div>
              <p className="text-sm font-medium text-slate-300 mb-3">Page elements present:</p>
              <div className="flex flex-wrap gap-4">
                {checkboxItems.map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none group">
                    <input type="checkbox" checked={checks[key]} onChange={() => toggle(key)} className="sr-only peer" />
                    <span className="w-5 h-5 rounded-md border border-slate-600 bg-slate-800 flex items-center justify-center peer-checked:bg-orange-500 peer-checked:border-orange-500 transition">
                      {checks[key] && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm text-slate-400 group-hover:text-slate-200 transition">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleRoast} disabled={!canRoast} className="mt-8 w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition">
            Roast My Page
          </button>
        </div>
      </section>

      {/* ── Results ── */}
      {result && (
        <section className="max-w-4xl mx-auto px-6 pb-20">
          {/* Verdict banner */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-lg">{result.overall.score >= 80 ? "A" : result.overall.score >= 60 ? "C" : "F"}</span>
            </div>
            <div>
              <p className="font-bold text-red-300">{roastVerdict(result.overall.score).label}</p>
              <p className="text-sm text-slate-400">{roastVerdict(result.overall.score).desc}</p>
            </div>
          </div>

          {/* Overall score */}
          <div className={`rounded-2xl border bg-gradient-to-b p-8 mb-8 text-center ${gradeBg(result.overall.grade)}`}>
            <p className="text-sm uppercase tracking-widest text-slate-400 mb-2">Overall Roast Score</p>
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className={`text-6xl font-black ${gradeColor(result.overall.grade)}`}>{result.overall.score}</span>
              <span className="text-slate-500 text-2xl font-light">/100</span>
            </div>
            <span className={`inline-block text-3xl font-bold ${gradeColor(result.overall.grade)}`}>{result.overall.grade}</span>
            <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto">
              {result.overall.score >= 80 ? "Your page is in great shape. Focus on the fine-tuning tips below."
                : result.overall.score >= 60 ? "Decent foundation, but several areas need work. Follow the fixes below."
                : "This page needs serious attention. Start with the highest-impact fixes."}
            </p>
          </div>

          {/* Section cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ScoreCard label="Headline" section={result.headline} icon="H" />
            <ScoreCard label="CTA" section={result.cta} icon=">" />
            <ScoreCard label="Copy Quality" section={result.copy} icon="T" />
            <ScoreCard label="Trust Signals" section={result.trust} icon="S" />
          </div>

          {/* Export */}
          <div className="text-center">
            <button onClick={exportReport} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition font-medium">
              {copied ? "Copied to clipboard!" : "Copy Full Roast Report"}
            </button>
          </div>
        </section>
      )}

      {/* ── Pricing ── */}
      <section className="border-t border-slate-800">
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold mb-3 text-slate-100">Landing Page Roaster Pro</h2>
          <p className="text-slate-400 mb-6">
            Deeper analysis, competitor benchmarks, and weekly re-roasts.
          </p>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 mb-6">
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$9</span>
              <span className="text-slate-400">/mo</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">Cancel anytime. No contracts.</p>
            <ul className="text-sm text-slate-300 space-y-2 text-left mb-8">
              {proFeatures.map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <span className="text-orange-400">{"✓"}</span> {feat}
                </li>
              ))}
            </ul>
            {joined ? (
              <p className="text-emerald-400 font-medium py-3">You are on the waitlist!</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setJoined(true) }} className="flex gap-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm" />
                <button type="submit" className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:brightness-110 transition text-sm whitespace-nowrap">
                  Join Waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>AgentPill Lab &mdash; Landing Page Roaster</span>
          <span>100% client-side. Your copy never leaves your browser.</span>
        </div>
      </footer>
    </div>
  )
}
