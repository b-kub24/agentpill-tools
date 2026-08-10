"use client";

import { useState } from "react";

type FAQ = { id: number; category: string; q: string; a: string };
type FormState = {
  name: string;
  offer: string;
  industry: string;
  trial: string;
  refund: string;
  pricing: string;
  channels: string[];
};

const INDUSTRIES = ["SaaS", "E-commerce", "Consulting", "Agency", "Education", "Healthcare", "Other"];
const PRICING_MODELS = ["Subscription", "One-time", "Freemium", "Custom/Enterprise", "Free"];
const CHANNEL_OPTIONS = ["Email", "Chat", "Phone", "Knowledge Base"];
const CATEGORIES = ["General", "Pricing & Billing", "Getting Started", "Features & Usage", "Support & Contact"];

const AUDIENCE: Record<string, string> = {
  SaaS: "startups, product teams, and growing software companies that want to move fast",
  "E-commerce": "online store owners, DTC brands, and marketplace sellers of every size",
  Consulting: "founders, executives, and organizations looking for expert guidance",
  Agency: "brands and businesses that want specialist work done right the first time",
  Education: "students, educators, and lifelong learners at every level",
  Healthcare: "patients, providers, and healthcare organizations that value reliability",
  Other: "businesses and individuals who want a dependable, no-fuss solution",
};

const ALTERNATIVES: Record<string, string> = {
  SaaS: "SaaS tools",
  "E-commerce": "e-commerce solutions",
  Consulting: "consulting services",
  Agency: "agencies",
  Education: "education platforms",
  Healthcare: "healthcare solutions",
  Other: "solutions",
};

function generateFaqs(f: FormState): FAQ[] {
  const n = f.name.trim() || "Our product";
  const offer = (f.offer.trim() || "a solution designed to save you time and deliver real results").replace(/\.+\s*$/, "");
  const audience = AUDIENCE[f.industry] || AUDIENCE.Other;
  const alts = ALTERNATIVES[f.industry] || ALTERNATIVES.Other;
  const faqs: FAQ[] = [];
  let id = 0;
  const add = (category: string, q: string, a: string) => faqs.push({ id: id++, category, q, a });

  add("General", `What is ${n}?`, `${n} is ${offer}. It is built to deliver value from day one, with no steep learning curve and no unnecessary complexity.`);
  add("General", `Who is ${n} for?`, `${n} is designed for ${audience}. Whether you are just getting started or scaling up, it adapts to the way you work.`);
  add("General", `How is ${n} different from other ${alts}?`, `Unlike generic alternatives, ${n} focuses on doing one thing exceptionally well. You get a focused, polished experience instead of a bloated feature list, which means faster results and fewer headaches.`);
  add("General", `Do I need any technical skills to use ${n}?`, `No. ${n} is designed to be simple enough for anyone to use. If you can fill out a form and click a button, you already have all the skills you need.`);
  add("General", `Is ${n} suitable for small teams or solo founders?`, `Absolutely. ${n} works great for individuals and small teams, and it scales smoothly as your needs grow. You will never pay for complexity you do not use.`);

  const billing = "Pricing & Billing";
  const priceAnswers: Record<string, string> = {
    Subscription: `${n} is available as a simple monthly subscription. You always know exactly what you will pay, and you can cancel anytime in a couple of clicks with no lock-in contracts.`,
    "One-time": `${n} is a one-time purchase. Pay once and it is yours, with no recurring fees and no surprise renewals.`,
    Freemium: `${n} offers a free plan you can use for as long as you like, plus paid plans that unlock more power when you need it. Upgrade only when it makes sense for you.`,
    "Custom/Enterprise": `Pricing for ${n} is tailored to your needs. Reach out and we will put together a quote based on your team size, usage, and requirements.`,
    Free: `${n} is completely free to use. No credit card, no trial clock, no catch.`,
  };
  add(billing, `How much does ${n} cost?`, priceAnswers[f.pricing] || priceAnswers.Subscription);
  if (f.trial === "yes") {
    add(billing, "Is there a free trial?", `Yes. You can try ${n} free before committing, with no credit card required. Explore every feature and see the value for yourself before you pay a cent.`);
  } else if (f.pricing !== "Free") {
    add(billing, `Can I see ${n} in action before buying?`, `We do not offer a free trial, but we are happy to walk you through ${n} and answer any questions so you can buy with confidence. Just reach out.`);
  }
  if (f.refund === "yes") {
    add(billing, "What is your refund policy?", `If ${n} turns out not to be the right fit, contact us and we will make it right, including a refund within the policy window. We would rather have a happy non-customer than an unhappy customer.`);
  } else if (f.pricing !== "Free") {
    add(billing, "Can I cancel whenever I want?", "Yes. There are no long-term contracts. Cancel anytime and you will not be billed again; you keep access through the end of your current period.");
  }
  add(billing, "Are there any hidden fees?", "No. The price you see is the price you pay. There are no setup fees, per-seat surprises, or hidden charges of any kind.");

  const start = "Getting Started";
  add(start, `How do I get started with ${n}?`, "Getting started takes just a few minutes: sign up, tell us a little about what you need, and you are ready to go. Most users are up and running in under five minutes.");
  add(start, "How long does setup take?", `There is virtually no setup. ${n} works out of the box, with no installations, downloads, or IT tickets required.`);
  add(start, "What do I need before I start?", "Just a modern web browser and a few minutes of your time. There is nothing to install and there are no special hardware or software requirements.");
  add(start, `Can I switch to ${n} from another provider?`, `Yes. Moving to ${n} is straightforward, and most people make the switch in a single afternoon. If you get stuck at any point, our team is happy to help.`);

  const feat = "Features & Usage";
  add(feat, `What are the key features of ${n}?`, `At its core, ${n} gives you ${offer}. Every feature is designed around getting you to results faster, with professional output you can rely on.`);
  add(feat, `Does ${n} integrate with the tools I already use?`, `${n} works with standard formats and everyday workflows, so it fits into your existing stack instead of forcing you to change how you work.`);
  add(feat, "Are there any usage limits?", "Fair-use limits keep the service fast and reliable for everyone, and they are generous enough that the vast majority of users never notice them.");
  add(feat, `Is my data safe with ${n}?`, "Yes. Your data is transmitted securely, never sold, and never shared with third parties. You stay in full control of your information at all times.");

  const support = "Support & Contact";
  const ch = f.channels.length ? f.channels : ["Email"];
  const lower = ch.map((c) => (c === "Knowledge Base" ? "our knowledge base" : c.toLowerCase()));
  const chList = lower.length === 1 ? lower[0] : lower.slice(0, -1).join(", ") + " and " + lower[lower.length - 1];
  add(support, "How can I get help or contact support?", `You can reach us via ${chList}. We aim to respond quickly and actually solve your problem, not just close the ticket.`);
  if (ch.includes("Knowledge Base")) {
    add(support, "Do you have documentation I can browse on my own?", "Yes. Our knowledge base covers everything from getting started to advanced tips, so you can find answers instantly, 24/7.");
  }
  if (ch.includes("Chat") || ch.includes("Phone")) {
    add(support, "What are your support hours?", `Our team is available during standard business hours, and ${ch.includes("Chat") ? "live chat" : "phone support"} gets you real-time help when you need it most.`);
  } else {
    add(support, "How fast will I get a response?", "Most questions are answered within one business day, and often much faster than that.");
  }
  return faqs;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildHtmlExport(faqs: FAQ[], name: string) {
  const title = name.trim() ? `${name.trim()} — Frequently Asked Questions` : "Frequently Asked Questions";
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const sections = CATEGORIES.map((cat) => {
    const items = faqs.filter((f) => f.category === cat);
    if (!items.length) return "";
    return `    <h2>${escapeHtml(cat)}</h2>\n` + items.map((f) => `    <details>\n      <summary>${escapeHtml(f.q)}</summary>\n      <p>${escapeHtml(f.a)}</p>\n    </details>`).join("\n");
  }).filter(Boolean).join("\n");
  const schemaTag = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </` + `script>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 760px; margin: 0 auto; padding: 48px 24px; color: #1e293b; line-height: 1.65; }
    h1 { font-size: 2rem; margin-bottom: 2rem; color: #0f172a; }
    h2 { font-size: 1.15rem; margin: 2.5rem 0 1rem; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.05em; }
    details { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px; background: #f8fafc; }
    summary { font-weight: 600; cursor: pointer; color: #0f172a; }
    details p { margin: 10px 0 4px; color: #475569; }
  </style>
  ${schemaTag}
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
${sections}
  </main>
</body>
</html>`;
}

function toMarkdown(faqs: FAQ[], name: string) {
  let md = `# ${name.trim() || "Product"} — Frequently Asked Questions\n`;
  for (const cat of CATEGORIES) {
    const items = faqs.filter((f) => f.category === cat);
    if (!items.length) continue;
    md += `\n## ${cat}\n`;
    for (const f of items) md += `\n### ${f.q}\n\n${f.a}\n`;
  }
  return md;
}

const inputCls =
  "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";
const labelCls = "mb-1.5 block text-sm font-medium text-slate-300";

export default function Home() {
  const [form, setForm] = useState<FormState>({
    name: "", offer: "", industry: "SaaS", trial: "yes", refund: "yes", pricing: "Subscription", channels: ["Email"],
  });
  const [faqs, setFaqs] = useState<FAQ[] | null>(null);
  const [openIds, setOpenIds] = useState<number[]>([]);
  const [editing, setEditing] = useState<{ id: number; field: "q" | "a" } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const toggleChannel = (c: string) =>
    setForm((p) => ({ ...p, channels: p.channels.includes(c) ? p.channels.filter((x) => x !== c) : [...p.channels, c] }));

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = generateFaqs(form);
    setFaqs(result);
    setOpenIds([result[0].id]);
    setEditing(null);
  };

  const toggleOpen = (fid: number) =>
    setOpenIds((p) => (p.includes(fid) ? p.filter((x) => x !== fid) : [...p, fid]));

  const updateFaq = (fid: number, field: "q" | "a", value: string) =>
    setFaqs((p) => (p ? p.map((f) => (f.id === fid ? { ...f, [field]: value } : f)) : p));

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(`${label} copied to clipboard`);
    } catch {
      notify("Copy failed — please try again");
    }
  };

  const downloadHtml = () => {
    if (!faqs) return;
    const blob = new Blob([buildHtmlExport(faqs, form.name)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.name.trim() || "faq").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-faq.html`;
    a.click();
    URL.revokeObjectURL(url);
    notify("HTML file downloaded");
  };

  const jsonExport = () =>
    faqs ? JSON.stringify(faqs.map(({ category, q, a }) => ({ category, question: q, answer: a })), null, 2) : "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      {/* HERO */}
      <header className="relative overflow-hidden px-6 pb-20 pt-16 text-center sm:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-6 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-medium tracking-wide text-indigo-300">
            Instant. Template-powered. 100% yours.
          </span>
          <h1 className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            FAQ Page Builder
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Generate a complete, professional FAQ page in seconds. Enter your product details and get 15-20 relevant questions and answers, ready to embed on your website. Perfect for startups, SaaS products, and service businesses.
          </p>
          <a href="#tool" className="mt-8 inline-block rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
            Build my FAQ page →
          </a>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { n: "1", t: "Describe your product", d: "Tell us your product or service name, what you offer, and a few quick details about pricing and support." },
            { n: "2", t: "Get 15-20 tailored FAQs", d: "Instantly receive a complete FAQ page organized into categories and written to match your business." },
            { n: "3", t: "Export and embed", d: "Download as styled HTML with schema.org markup, or copy everything as Markdown or JSON." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">{s.n}</div>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN TOOL */}
      <section id="tool" className="mx-auto max-w-3xl scroll-mt-8 px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-indigo-950/40 sm:p-10">
          <h2 className="text-2xl font-bold text-white">Tell us about your product</h2>
          <p className="mt-1 text-sm text-slate-400">Fill this out and we will draft your entire FAQ page.</p>
          <form onSubmit={handleGenerate} className="mt-8 space-y-5">
            <div>
              <label htmlFor="pname" className={labelCls}>Product / Service name</label>
              <input id="pname" type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Acme Analytics" className={inputCls} />
            </div>
            <div>
              <label htmlFor="poffer" className={labelCls}>What do you offer?</label>
              <textarea id="poffer" required rows={3} value={form.offer} onChange={(e) => set("offer", e.target.value)} placeholder="e.g. a real-time analytics dashboard that helps e-commerce teams track revenue and conversion in one place" className={inputCls} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="pind" className={labelCls}>Industry</label>
                <select id="pind" value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inputCls}>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="pprice" className={labelCls}>Pricing model</label>
                <select id="pprice" value={form.pricing} onChange={(e) => set("pricing", e.target.value)} className={inputCls}>
                  {PRICING_MODELS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { k: "trial" as const, label: "Do you offer free trials?" },
                { k: "refund" as const, label: "Do you have a refund policy?" },
              ].map((r) => (
                <fieldset key={r.k}>
                  <legend className={labelCls}>{r.label}</legend>
                  <div className="flex gap-3">
                    {["yes", "no"].map((v) => (
                      <label key={v} className={`flex-1 cursor-pointer rounded-lg border px-4 py-2 text-center text-sm capitalize transition ${form[r.k] === v ? "border-indigo-500 bg-indigo-500/20 text-indigo-200" : "border-slate-700 bg-slate-900/70 text-slate-400 hover:border-slate-600"}`}>
                        <input type="radio" name={r.k} value={v} checked={form[r.k] === v} onChange={() => set(r.k, v)} className="sr-only" />
                        {v}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <fieldset>
              <legend className={labelCls}>Support channels</legend>
              <div className="flex flex-wrap gap-3">
                {CHANNEL_OPTIONS.map((c) => (
                  <label key={c} className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition ${form.channels.includes(c) ? "border-violet-500 bg-violet-500/20 text-violet-200" : "border-slate-700 bg-slate-900/70 text-slate-400 hover:border-slate-600"}`}>
                    <input type="checkbox" checked={form.channels.includes(c)} onChange={() => toggleChannel(c)} className="sr-only" />
                    {c}
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
              Generate my FAQ page
            </button>
          </form>
        </div>

        {/* RESULTS */}
        {faqs && (
          <div className="mt-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-white">
                Your FAQ page <span className="ml-2 rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300">{faqs.length} questions</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={downloadHtml} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">Export as HTML</button>
                <button onClick={() => copyText(toMarkdown(faqs, form.name), "Markdown")} className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500 hover:text-white">Copy All as Markdown</button>
                <button onClick={() => copyText(jsonExport(), "JSON")} className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500 hover:text-white">Copy All as JSON</button>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-500">Tip: click any question or answer to edit it before exporting.</p>
            {CATEGORIES.map((cat) => {
              const items = faqs.filter((f) => f.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat} className="mt-8">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">{cat}</h3>
                  <div className="space-y-2">
                    {items.map((f) => {
                      const open = openIds.includes(f.id);
                      const editQ = editing?.id === f.id && editing.field === "q";
                      const editA = editing?.id === f.id && editing.field === "a";
                      return (
                        <div key={f.id} className="rounded-xl border border-slate-800 bg-slate-900/50 transition hover:border-slate-700">
                          <div className="flex items-center gap-3 px-5 py-3.5">
                            {editQ ? (
                              <input autoFocus value={f.q} onChange={(e) => updateFaq(f.id, "q", e.target.value)} onBlur={() => setEditing(null)} onKeyDown={(e) => e.key === "Enter" && setEditing(null)} className="w-full rounded border border-indigo-500 bg-slate-950 px-2 py-1 text-sm font-medium text-white outline-none" />
                            ) : (
                              <button onClick={() => setEditing({ id: f.id, field: "q" })} className="flex-1 text-left text-sm font-medium text-slate-100 hover:text-indigo-300" title="Click to edit question">{f.q}</button>
                            )}
                            <button onClick={() => toggleOpen(f.id)} aria-expanded={open} aria-label={open ? "Collapse answer" : "Expand answer"} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-indigo-500 hover:text-indigo-300 ${open ? "rotate-180" : ""}`}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                          </div>
                          {open && (
                            <div className="border-t border-slate-800 px-5 py-4">
                              {editA ? (
                                <textarea autoFocus rows={3} value={f.a} onChange={(e) => updateFaq(f.id, "a", e.target.value)} onBlur={() => setEditing(null)} className="w-full rounded border border-indigo-500 bg-slate-950 px-2 py-1 text-sm text-slate-200 outline-none" />
                              ) : (
                                <p onClick={() => setEditing({ id: f.id, field: "a" })} className="cursor-text text-sm leading-relaxed text-slate-400 hover:text-slate-300" title="Click to edit answer">{f.a}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-3xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 via-slate-900/60 to-violet-950/50 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white">Simple pricing</h2>
          <div className="mt-6 flex items-end justify-center gap-1">
            <span className="text-6xl font-extrabold text-white">$7</span>
            <span className="pb-2 text-lg text-slate-400">/month</span>
          </div>
          <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm text-slate-300">
            {["Unlimited FAQ pages", "HTML export with schema.org markup", "Markdown and JSON export", "Fully editable questions and answers", "Cancel anytime"].map((b) => (
              <li key={b} className="flex items-start gap-2"><span className="mt-0.5 text-emerald-400">✓</span>{b}</li>
            ))}
          </ul>
          {joined ? (
            <p className="mt-8 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-4 text-sm font-medium text-emerald-300">
              You are on the list! We will email you as soon as your spot opens up.
            </p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email.trim()) setJoined(true); }}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" aria-label="Email address" className={inputCls} />
              <button type="submit" className="shrink-0 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
                Join the waitlist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p><span className="font-semibold text-slate-300">FAQ Page Builder</span> — professional FAQ pages in seconds.</p>
          <nav className="flex gap-6">
            <a href="#tool" className="transition hover:text-indigo-300">Tool</a>
            <a href="#pricing" className="transition hover:text-indigo-300">Pricing</a>
            <a href="#" className="transition hover:text-indigo-300">Terms</a>
            <a href="#" className="transition hover:text-indigo-300">Privacy</a>
          </nav>
          <p>© {new Date().getFullYear()} FAQ Page Builder</p>
        </div>
      </footer>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-500/40 bg-slate-900 px-5 py-2.5 text-sm font-medium text-emerald-300 shadow-xl">
          {toast}
        </div>
      )}
    </main>
  );
}
