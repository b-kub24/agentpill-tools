"use client";

import { useState } from "react";

type EmailDraft = { day: string; title: string; subject: string; body: string };

const TONES = ["Professional", "Friendly", "Casual", "Bold", "Minimal"];
const INDUSTRIES = ["SaaS", "E-commerce", "Education", "Finance", "Health", "Creative", "Other"];

const GREETINGS: Record<string, string> = {
  Professional: "Hello", Friendly: "Hi there", Casual: "Hey", Bold: "Hey", Minimal: "Hi",
};

const SIGNOFFS: Record<string, (n: string) => string> = {
  Professional: (n) => `Best regards,\nThe ${n} Team`,
  Friendly: (n) => `Cheers,\nThe ${n} Team`,
  Casual: (n) => `Talk soon,\nThe ${n} Crew`,
  Bold: (n) => `Let's go,\nTeam ${n}`,
  Minimal: (n) => `— ${n}`,
};

const ACTIONS: Record<string, string> = {
  SaaS: "connect your first integration and run your core workflow",
  "E-commerce": "add your first product and preview your storefront",
  Education: "create your first course module and share it with a learner",
  Finance: "link your accounts and generate your first report",
  Health: "set up your first program and track your first metric",
  Creative: "start your first project and export a sample",
  Other: "complete your first project end to end",
};

function buildEmails(f: { name: string; desc: string; audience: string; tone: string; industry: string; benefit: string }): EmailDraft[] {
  const { name, desc, audience, tone, industry } = f;
  const benefit = f.benefit.replace(/\.+$/, "");
  const greet = GREETINGS[tone] || "Hi";
  const signoff = (SIGNOFFS[tone] || SIGNOFFS.Minimal)(name);
  const action = ACTIONS[industry] || ACTIONS.Other;
  const subjects: Record<string, string[]> = {
    Professional: [
      `Welcome to ${name} — let's get you started`,
      `Your first win with ${name} (5 minutes)`,
      `The ${name} feature our customers rely on most`,
      `How ${audience} succeed with ${name}`,
      `Your first week with ${name} — what's next`,
    ],
    Friendly: [
      `Welcome aboard — we're so glad you're here!`,
      `A quick win for you today`,
      `Have you tried this yet?`,
      `See what other ${audience} are saying`,
      `One week in — how's it going?`,
    ],
    Casual: [
      `you're in — here's what to do first`,
      `try this — takes 5 min, tops`,
      `ok, this feature is criminally underused`,
      `don't take our word for it`,
      `so... how's it going?`,
    ],
    Bold: [
      `You just made a great decision.`,
      `5 minutes. One big win. Go.`,
      `The feature that changes everything`,
      `Proof: ${name} delivers.`,
      `Week one down. Time to level up.`,
    ],
    Minimal: [
      `Welcome to ${name}`,
      `One quick win`,
      `Feature spotlight`,
      `Results from customers`,
      `Week 1 check-in`,
    ],
  };
  const s = subjects[tone] || subjects.Minimal;
  return [
    {
      day: "Day 0",
      title: "Welcome & Getting Started",
      subject: s[0],
      body: `${greet},\n\nWelcome to ${name}! ${desc}\n\nWe built ${name} specifically for ${audience} like you, and our goal is simple: ${benefit}.\n\nHere's the one thing to do right now:\n1. Log in to your account\n2. Complete your setup (takes under 5 minutes)\n3. Then ${action}\n\nThat's it. Small steps, real momentum.\n\nIf you get stuck at any point, just reply to this email — a real human reads every message.\n\n${signoff}`,
    },
    {
      day: "Day 1",
      title: "Quick Win",
      subject: s[1],
      body: `${greet},\n\nYesterday you joined ${name}. Today, let's get you a real result.\n\nMost ${audience} see value fastest when they ${action}. Here's the fastest path:\n\nStep 1: Open ${name} and head to your dashboard.\nStep 2: ${action.charAt(0).toUpperCase() + action.slice(1)} — this is where "${benefit}" starts to show.\nStep 3: Take 2 minutes to review what you get back.\n\nWhy this matters: users who complete this step in their first 48 hours are far more likely to hit their goals with ${name}.\n\nGot 5 minutes now? Go grab that win.\n\n${signoff}`,
    },
    {
      day: "Day 3",
      title: "Feature Spotlight",
      subject: s[2],
      body: `${greet},\n\nBy now you've had a chance to look around ${name}. Today we want to spotlight the feature ${audience} tell us they can't live without.\n\n[FEATURE NAME — replace with your hero feature]\n\nWhat it does: ${desc}\n\nWhy ${audience} love it:\n- It directly delivers on ${benefit}\n- It saves hours of manual work every week\n- It works out of the box — no complicated setup\n\nHow to try it today:\n1. Log in to ${name}\n2. Open [Feature Name] from your dashboard\n3. Run it on a real task and see the difference\n\nGive it a spin, then hit reply and tell us what you think.\n\n${signoff}`,
    },
    {
      day: "Day 5",
      title: "Social Proof",
      subject: s[3],
      body: `${greet},\n\nYou don't have to take our word for it. Here's what other ${audience} say about ${name}:\n\n"[Insert customer quote — e.g. 'Within two weeks, ${name} helped us with ${benefit.toLowerCase()}. I can't imagine going back.']"\n— [Customer Name], [Role, Company]\n\n"[Insert a second quote highlighting a specific, measurable result.]"\n— [Customer Name], [Role, Company]\n\nMini case study template:\n- The challenge: [What the customer struggled with before]\n- The solution: How they used ${name} for ${benefit.toLowerCase()}\n- The result: [Specific metric — e.g. 40% time saved, 2x output]\n\nWant results like these? You're closer than you think — you've already taken the first step.\n\n${signoff}`,
    },
    {
      day: "Day 7",
      title: "Check-in & Next Steps",
      subject: s[4],
      body: `${greet},\n\nIt's been a week since you joined ${name} — congratulations on getting started!\n\nQuick check-in: how is it going so far? Hit reply and let us know. We read and answer every message.\n\nHere's what we recommend next:\n1. If you haven't yet, ${action}\n2. Invite a teammate — ${name} is better together\n3. Explore your settings to tailor ${name} to how ${audience} work\n\nReady for more? Our paid plan unlocks the full power of ${name} — everything you need for ${benefit}, without limits. You can upgrade any time from your account page.\n\nThanks for spending your first week with us. We're just getting started.\n\n${signoff}`,
    },
  ];
}

const formatEmail = (e: EmailDraft) =>
  `${e.day} — ${e.title}\nSubject: ${e.subject}\n\n${e.body}`;

const inputCls =
  "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";
const labelCls = "mb-1.5 block text-sm font-medium text-slate-300";

export default function Home() {
  const [form, setForm] = useState({
    name: "", desc: "", audience: "", tone: "Professional", industry: "SaaS", benefit: "",
  });
  const [emails, setEmails] = useState<EmailDraft[]>([]);
  const [copied, setCopied] = useState<number | "all" | null>(null);
  const [waitEmail, setWaitEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const ready = form.name && form.desc && form.audience && form.benefit;

  const generate = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!ready) return;
    setEmails(buildEmails(form));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const copy = async (text: string, key: number | "all") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch {}
  };

  const allText = () =>
    `WELCOME EMAIL SEQUENCE — ${form.name}\n${"=".repeat(40)}\n\n` +
    emails.map(formatEmail).join(`\n\n${"-".repeat(40)}\n\n`);

  const exportTxt = () => {
    const blob = new Blob([allText()], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(form.name || "welcome").toLowerCase().replace(/\s+/g, "-")}-email-sequence.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const editEmail = (i: number, k: "subject" | "body", v: string) =>
    setEmails((p) => p.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 text-center sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-6 inline-block rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Onboarding emails, done in seconds
          </span>
          <h1 className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Welcome Email Sequence Generator
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Generate a complete 5-email onboarding sequence in seconds. Just describe your product
            and audience — get professional welcome emails with subject lines, body copy, and
            optimal send timing. Built for SaaS founders, marketers, and growth teams.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#tool" className="w-full rounded-lg bg-emerald-500 px-8 py-3.5 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 sm:w-auto">
              Generate My Sequence — Free
            </a>
            <a href="#pricing" className="w-full rounded-lg border border-slate-700 px-8 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-white sm:w-auto">
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              ["1", "Describe your product", "Tell us your product name, what it does, and who your target audience is."],
              ["2", "Choose tone & industry", "Pick from 5 tones and 7 industries so every email sounds like your brand."],
              ["3", "Get 5 ready-to-send emails", "A complete welcome sequence with subject lines, body copy, and send timing."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                  {n}
                </div>
                <h3 className="text-lg font-semibold text-white">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN TOOL */}
      <section id="tool" className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-indigo-500/25 bg-slate-900/60 p-6 shadow-2xl shadow-indigo-950/50 sm:p-10">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Build your sequence</h2>
            <p className="mt-2 text-sm text-slate-400">Fill in the details below — your 5 emails are generated instantly, right in your browser.</p>
            <form onSubmit={generate} className="mt-8 space-y-5">
              <div>
                <label className={labelCls}>Product / Company name</label>
                <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. LaunchPad" required />
              </div>
              <div>
                <label className={labelCls}>What does your product do?</label>
                <textarea className={`${inputCls} min-h-[96px] resize-y`} value={form.desc} onChange={(e) => set("desc", e.target.value)} placeholder="2–3 sentences. e.g. LaunchPad helps indie founders ship landing pages in minutes. It handles hosting, forms, and analytics out of the box." required />
              </div>
              <div>
                <label className={labelCls}>Target audience</label>
                <input className={inputCls} value={form.audience} onChange={(e) => set("audience", e.target.value)} placeholder='e.g. "small business owners", "developers"' required />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Tone</label>
                  <select className={inputCls} value={form.tone} onChange={(e) => set("tone", e.target.value)}>
                    {TONES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Industry</label>
                  <select className={inputCls} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
                    {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Key benefit / value prop</label>
                <input className={inputCls} value={form.benefit} onChange={(e) => set("benefit", e.target.value)} placeholder="e.g. launch faster without hiring a developer" required />
              </div>
              <button type="submit" disabled={!ready} className="w-full rounded-lg bg-emerald-500 px-6 py-4 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">
                Generate 5-Email Sequence
              </button>
            </form>
          </div>

          {/* RESULTS */}
          {emails.length > 0 && (
            <div id="results" className="mt-12 space-y-6">
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                Your welcome sequence for <span className="text-indigo-300">{form.name}</span>
              </h3>
              {emails.map((e, i) => (
                <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-3 py-1 text-xs font-bold text-white">{e.day}</span>
                      <span className="text-sm font-semibold text-slate-300">{e.title}</span>
                    </div>
                    <button onClick={() => copy(formatEmail(e), i)} className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20">
                      {copied === i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-500">Subject line</label>
                  <input className={`${inputCls} mb-4 font-medium`} value={e.subject} onChange={(ev) => editEmail(i, "subject", ev.target.value)} />
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-500">Email body</label>
                  <textarea className={`${inputCls} min-h-[260px] resize-y font-mono text-[13px] leading-relaxed`} value={e.body} onChange={(ev) => editEmail(i, "body", ev.target.value)} />
                </div>
              ))}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => copy(allText(), "all")} className="flex-1 rounded-lg bg-emerald-500 px-6 py-3.5 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
                  {copied === "all" ? "Copied all 5 emails!" : "Copy All Emails"}
                </button>
                <button onClick={exportTxt} className="flex-1 rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-6 py-3.5 text-sm font-bold text-indigo-300 transition hover:bg-indigo-500/20">
                  Export as Text
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-4 py-20">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-bold text-white">Simple pricing</h2>
          <p className="mt-2 text-slate-400">One plan. Unlimited sequences.</p>
          <div className="mt-8 rounded-2xl border border-violet-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl shadow-violet-950/40">
            <div className="text-5xl font-extrabold text-white">
              $12<span className="text-lg font-medium text-slate-400">/month</span>
            </div>
            <ul className="mt-6 space-y-3 text-left text-sm text-slate-300">
              {[
                "Unlimited 5-email sequences",
                "All 5 tones and 7 industries",
                "Editable subject lines & body copy",
                "Copy & export in one click",
                "New templates added monthly",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-emerald-400">✓</span>{f}
                </li>
              ))}
            </ul>
            {joined ? (
              <p className="mt-8 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                You're on the list! We'll email you when Pro launches.
              </p>
            ) : (
              <form
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                onSubmit={(ev) => { ev.preventDefault(); if (waitEmail.includes("@")) setJoined(true); }}
              >
                <input type="email" required value={waitEmail} onChange={(e) => setWaitEmail(e.target.value)} placeholder="you@company.com" className={`${inputCls} flex-1`} />
                <button type="submit" className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-400">
                  Join Waitlist
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-slate-500">Pro is launching soon — join the waitlist for early access.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/70 px-4 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-semibold text-white">Welcome Email Sequence Generator</p>
            <p className="mt-1 text-xs text-slate-500">Ship better onboarding emails, faster.</p>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#tool" className="transition hover:text-indigo-300">Generator</a>
            <a href="#pricing" className="transition hover:text-indigo-300">Pricing</a>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
