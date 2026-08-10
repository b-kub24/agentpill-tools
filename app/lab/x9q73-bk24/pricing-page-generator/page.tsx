"use client";

import { useState } from "react";

type Tier = {
  name: string;
  price: string;
  period: string;
  customPeriod: string;
  popular: boolean;
  cta: string;
  features: string;
};

type Theme = { accent: string; badge: string; btn: string; check: string; ring: string };

const THEMES: Record<string, Theme> = {
  Indigo: { accent: "text-indigo-400", badge: "bg-indigo-500", btn: "bg-indigo-500 hover:bg-indigo-400", check: "text-indigo-400", ring: "ring-indigo-500" },
  Violet: { accent: "text-violet-400", badge: "bg-violet-500", btn: "bg-violet-500 hover:bg-violet-400", check: "text-violet-400", ring: "ring-violet-500" },
  Blue: { accent: "text-blue-400", badge: "bg-blue-500", btn: "bg-blue-500 hover:bg-blue-400", check: "text-blue-400", ring: "ring-blue-500" },
  Emerald: { accent: "text-emerald-400", badge: "bg-emerald-500", btn: "bg-emerald-500 hover:bg-emerald-400", check: "text-emerald-400", ring: "ring-emerald-500" },
  Rose: { accent: "text-rose-400", badge: "bg-rose-500", btn: "bg-rose-500 hover:bg-rose-400", check: "text-rose-400", ring: "ring-rose-500" },
  Amber: { accent: "text-amber-400", badge: "bg-amber-500", btn: "bg-amber-500 hover:bg-amber-400", check: "text-amber-400", ring: "ring-amber-500" },
  Slate: { accent: "text-slate-300", badge: "bg-slate-600", btn: "bg-slate-600 hover:bg-slate-500", check: "text-slate-300", ring: "ring-slate-500" },
};

const STYLES: Record<string, string> = {
  Cards: "bg-slate-900 shadow-xl shadow-black/40",
  Minimal: "bg-transparent",
  Gradient: "bg-gradient-to-b from-slate-800/70 to-slate-900/90 border border-slate-800",
  Bordered: "bg-slate-950 border-2 border-slate-800",
};

const PERIODS = ["/month", "/year", "one-time", "custom"];

const DEFAULT_TIERS: Tier[] = [
  { name: "Starter", price: "$9", period: "/month", customPeriod: "", popular: false, cta: "Get Started", features: "+ 1 project\n+ Basic analytics\n+ Email support\n- Custom domain\n- Priority support" },
  { name: "Pro", price: "$29", period: "/month", customPeriod: "", popular: true, cta: "Start Free Trial", features: "+ Unlimited projects\n+ Advanced analytics\n+ Custom domain\n+ Priority support\n- Dedicated manager" },
  { name: "Enterprise", price: "Custom", period: "custom", customPeriod: "per contract", popular: false, cta: "Contact Sales", features: "+ Everything in Pro\n+ Dedicated manager\n+ SSO & SAML\n+ Custom SLA\n+ White-glove onboarding" },
];

const NEW_TIER: Tier = { name: "New Tier", price: "$0", period: "/month", customPeriod: "", popular: false, cta: "Get Started", features: "+ Feature one\n+ Feature two\n- Feature three" };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const periodLabel = (t: Tier) =>
  t.period === "custom" ? t.customPeriod : t.period === "one-time" ? "one-time" : t.period;

function buildPricingHtml(tiers: Tier[], themeName: string, styleName: string, showToggle: boolean): string {
  const t = THEMES[themeName];
  const cardBase = STYLES[styleName];
  const cols =
    tiers.length === 1 ? "max-w-sm mx-auto" :
    tiers.length === 2 ? "sm:grid-cols-2 max-w-3xl mx-auto" :
    tiers.length === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  const toggle = showToggle
    ? `
    <div class="mb-12 flex items-center justify-center gap-3 text-sm">
      <span class="font-medium text-white">Monthly</span>
      <button type="button" aria-label="Toggle annual billing" class="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700"><span class="absolute left-1 inline-block h-4 w-4 rounded-full bg-white"></span></button>
      <span class="text-slate-400">Annual <span class="${t.accent} font-medium">save 20%</span></span>
    </div>`
    : "";
  const cards = tiers.map((tier) => {
    const feats = tier.features.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const off = l.startsWith("-");
      const text = esc(l.replace(/^[+-]\s*/, ""));
      return off
        ? `          <li class="flex items-start gap-3 text-sm text-slate-500"><span class="mt-0.5 font-bold text-slate-600">&#10007;</span><span class="line-through">${text}</span></li>`
        : `          <li class="flex items-start gap-3 text-sm text-slate-300"><span class="mt-0.5 font-bold ${t.check}">&#10003;</span><span>${text}</span></li>`;
    }).join("\n");
    const badge = tier.popular
      ? `
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full ${t.badge} px-3 py-1 text-xs font-semibold text-white">Most Popular</span>`
      : "";
    const btn = tier.popular ? `${t.btn} text-white` : "bg-slate-800 hover:bg-slate-700 text-white";
    return `      <div class="relative flex flex-col rounded-2xl p-8 ${cardBase}${tier.popular ? ` ring-2 ${t.ring}` : ""}">${badge}
        <h3 class="text-lg font-semibold text-white">${esc(tier.name)}</h3>
        <div class="mt-4 flex items-baseline gap-1">
          <span class="text-4xl font-bold tracking-tight text-white">${esc(tier.price)}</span>
          <span class="text-sm text-slate-400">${esc(periodLabel(tier))}</span>
        </div>
        <ul class="mt-8 flex-1 space-y-3">
${feats}
        </ul>
        <a href="#" class="mt-8 block rounded-lg px-4 py-3 text-center text-sm font-semibold transition ${btn}">${esc(tier.cta)}</a>
      </div>`;
  }).join("\n");
  return `<section class="bg-slate-950 px-6 py-20">
  <div class="mx-auto max-w-6xl">${toggle}
    <div class="grid grid-cols-1 gap-8 ${cols}">
${cards}
    </div>
  </div>
</section>`;
}

function genHTML(tiers: Tier[], themeName: string, styleName: string, showToggle: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pricing</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950">
${buildPricingHtml(tiers, themeName, styleName, showToggle)}
</body>
</html>
`;
}

function genReact(tiers: Tier[], themeName: string, styleName: string, showToggle: boolean): string {
  const jsx = buildPricingHtml(tiers, themeName, styleName, showToggle)
    .replace(/class="/g, 'className="')
    .split("\n").map((l) => (l ? "    " + l : l)).join("\n");
  return `export default function PricingSection() {
  return (
${jsx}
  );
}
`;
}

export default function Home() {
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
  const [theme, setTheme] = useState("Indigo");
  const [style, setStyle] = useState("Cards");
  const [showToggle, setShowToggle] = useState(true);
  const [copied, setCopied] = useState<"" | "html" | "react">("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const update = (i: number, patch: Partial<Tier>) =>
    setTiers((prev) => prev.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  const setPopular = (i: number, val: boolean) =>
    setTiers((prev) => prev.map((t, j) => ({ ...t, popular: val && j === i })));
  const addTier = () => {
    if (tiers.length < 4) setTiers([...tiers, { ...NEW_TIER }]);
  };
  const removeTier = (i: number) => {
    if (tiers.length > 1) setTiers(tiers.filter((_, j) => j !== i));
  };
  const copy = async (kind: "html" | "react") => {
    const code = kind === "html" ? genHTML(tiers, theme, style, showToggle) : genReact(tiers, theme, style, showToggle);
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(kind);
    setTimeout(() => setCopied(""), 2000);
  };
  const download = () => {
    const blob = new Blob([genHTML(tiers, theme, style, showToggle)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pricing-page.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const input = "w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const label = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400";

  return (
    <main>
      <header className="border-b border-slate-800/60 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-lg font-bold text-white">
            Pricing<span className="text-indigo-400">Page</span>Generator
          </span>
          <nav className="hidden gap-6 text-sm text-slate-400 sm:flex">
            <a href="#how" className="transition hover:text-white">How it works</a>
            <a href="#tool" className="transition hover:text-white">Generator</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-20 pt-24 text-center">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-indigo-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-6 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
            HTML + React export &middot; Tailwind-ready
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Pricing Page{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Generator</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            Build a stunning pricing page in minutes, not hours. Enter your tiers and features &mdash; get a
            production-ready pricing component you can drop into any website. Export as clean HTML or React.
            Perfect for SaaS, agencies, and product launches.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#tool" className="rounded-lg bg-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
              Start Building &mdash; Free
            </a>
            <a href="#how" className="rounded-lg border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      <section id="how" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white">How It Works</h2>
          <p className="mt-3 text-center text-slate-400">Three steps from blank page to production-ready pricing.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "1", t: "Define your pricing tiers", d: "Add up to four tiers with names, prices, billing periods, CTAs, and feature lists. Mark one as most popular." },
              { n: "2", t: "Customize colors and layout", d: "Pick from seven color themes and four card styles, toggle annual billing, and watch the live preview update instantly." },
              { n: "3", t: "Export as HTML or React", d: "Copy a self-contained HTML file or a clean React component and drop it straight into your site." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">{s.n}</span>
                <h3 className="mt-5 text-lg font-semibold text-white">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tool" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white">The Generator</h2>
          <p className="mt-3 text-center text-slate-400">Everything runs in your browser &mdash; nothing is uploaded anywhere.</p>

          <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-white">
                <span className="text-indigo-400">Step 1.</span> Define Your Tiers
              </h3>
              <button onClick={addTier} disabled={tiers.length >= 4} className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-40">
                + Add Tier ({tiers.length}/4)
              </button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {tiers.map((tier, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-300">Tier {i + 1}</span>
                    <button onClick={() => removeTier(i)} disabled={tiers.length <= 1} className="text-xs text-slate-500 transition hover:text-rose-400 disabled:opacity-30">
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={label}>Tier name</label>
                      <input className={input} value={tier.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Starter" />
                    </div>
                    <div>
                      <label className={label}>Price</label>
                      <input className={input} value={tier.price} onChange={(e) => update(i, { price: e.target.value })} placeholder="$9" />
                    </div>
                    <div>
                      <label className={label}>Billing period</label>
                      <select className={input} value={tier.period} onChange={(e) => update(i, { period: e.target.value })}>
                        {PERIODS.map((p) => (
                          <option key={p} value={p}>{p === "custom" ? "custom text..." : p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={label}>CTA button text</label>
                      <input className={input} value={tier.cta} onChange={(e) => update(i, { cta: e.target.value })} placeholder="Get Started" />
                    </div>
                    {tier.period === "custom" && (
                      <div className="sm:col-span-2">
                        <label className={label}>Custom period text</label>
                        <input className={input} value={tier.customPeriod} onChange={(e) => update(i, { customPeriod: e.target.value })} placeholder="per seat / month" />
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className={label}>Features &mdash; one per line, + included / - excluded</label>
                    <textarea rows={5} className={input} value={tier.features} onChange={(e) => update(i, { features: e.target.value })} placeholder={"+ Unlimited projects\n- Priority support"} />
                  </div>
                  <label className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={tier.popular} onChange={(e) => setPopular(i, e.target.checked)} className="h-4 w-4 accent-indigo-500" />
                    Mark as the &ldquo;Most Popular&rdquo; tier
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white">
              <span className="text-indigo-400">Step 2.</span> Customize
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <label className={label}>Color theme</label>
                <select className={input} value={theme} onChange={(e) => setTheme(e.target.value)}>
                  {Object.keys(THEMES).map((t) => (<option key={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label className={label}>Style</label>
                <select className={input} value={style} onChange={(e) => setStyle(e.target.value)}>
                  {Object.keys(STYLES).map((s) => (<option key={s}>{s}</option>))}
                </select>
              </div>
              <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-slate-300">
                <input type="checkbox" checked={showToggle} onChange={(e) => setShowToggle(e.target.checked)} className="h-4 w-4 accent-indigo-500" />
                Show annual toggle
              </label>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-white">
                <span className="text-indigo-400">Step 3.</span> Live Preview &amp; Export
              </h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => copy("html")} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  {copied === "html" ? "Copied!" : "Copy HTML"}
                </button>
                <button onClick={() => copy("react")} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  {copied === "react" ? "Copied!" : "Copy React Component"}
                </button>
                <button onClick={download} className="rounded-lg border border-emerald-500/50 px-4 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/10">
                  Download HTML File
                </button>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-900 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-xs text-slate-500">yoursite.com/pricing &mdash; live preview</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: buildPricingHtml(tiers, theme, style, showToggle) }} />
            </div>
            <p className="mt-4 text-xs text-slate-500">
              The exported HTML is fully self-contained (Tailwind via CDN). The React export is a drop-in functional component styled with Tailwind classes.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold text-white">Simple Pricing</h2>
          <p className="mt-3 text-slate-400">One plan. Unlimited pricing pages.</p>
          <div className="mt-10 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl shadow-indigo-500/10">
            <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-300">PRO</span>
            <div className="mt-5 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-extrabold text-white">$9</span>
              <span className="text-slate-400">/month</span>
            </div>
            <ul className="mt-7 space-y-2.5 text-left text-sm text-slate-300">
              {["Unlimited pricing pages", "HTML + React export", "7 color themes, 4 layout styles", "Annual billing toggle", "Commercial license"].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="font-bold text-emerald-400">&#10003;</span>{f}
                </li>
              ))}
            </ul>
            {joined ? (
              <p className="mt-8 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
                You&rsquo;re on the list! We&rsquo;ll email you at launch.
              </p>
            ) : (
              <form
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setJoined(true);
                }}
              >
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={input} />
                <button type="submit" className="whitespace-nowrap rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  Join the Waitlist
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-slate-500">Early-bird spots get 50% off for life. No spam, ever.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Pricing Page Generator. All rights reserved.</span>
          <nav className="flex gap-6">
            <a href="#how" className="transition hover:text-slate-300">How it works</a>
            <a href="#tool" className="transition hover:text-slate-300">Generator</a>
            <a href="#pricing" className="transition hover:text-slate-300">Pricing</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
