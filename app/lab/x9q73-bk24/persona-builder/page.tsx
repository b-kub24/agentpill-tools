"use client";

import { useState } from "react";

type Inputs = { business: string; sell: string; industry: string; price: string; market: string; value: string };
type Persona = {
  archetype: string; tagline: string; emoji: string; name: string; age: string; title: string;
  companySize: string; income: string; goals: string[]; pains: string[]; objections: string[];
  channels: string[]; triggers: string[]; quote: string;
};

const INDUSTRIES = ["SaaS/Tech", "E-commerce", "Professional Services", "Education", "Health/Wellness", "Finance", "Creative", "B2B", "Other"];
const PRICES = ["Free", "$1-50/mo", "$50-200/mo", "$200-1000/mo", "$1000+/mo", "One-time under $100", "One-time $100+"];
const MARKETS = ["Consumers (B2C)", "Small Business (SMB)", "Mid-Market", "Enterprise", "Mixed"];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickN = <T,>(arr: T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

const FIRST = [
  ["Maya", "Jordan", "Zoe", "Kai", "Priya", "Leo", "Aisha", "Diego"],
  ["Sarah", "Marcus", "Elena", "David", "Nina", "Rachel", "Omar", "Grace"],
  ["Patricia", "Robert", "Linda", "James", "Margaret", "Steven", "Carol", "Howard"],
];
const LAST = ["Chen", "Rivera", "Okafor", "Kim", "Novak", "Patel", "Silva", "Bennett", "Larsson", "Ito"];
const AGES = [["24-30", "26-32", "23-29"], ["34-42", "36-44", "33-40"], ["46-55", "48-58", "45-54"]];
const EMOJI = [["🚀", "⚡", "🧪"], ["📊", "🎯", "🧭"], ["🏛️", "💼", "🔐"]];

const DOMAIN: Record<string, string> = {
  "SaaS/Tech": "their product and growth stack",
  "E-commerce": "their store, inventory, and fulfillment",
  "Professional Services": "client delivery and billable work",
  "Education": "courses, learners, and outcomes",
  "Health/Wellness": "client health journeys and retention",
  "Finance": "financial planning, compliance, and reporting",
  "Creative": "creative projects and client pipelines",
  "B2B": "their sales pipeline and operations",
  "Other": "their day-to-day operations",
};

const TITLES: Record<string, string[][]> = {
  "SaaS/Tech": [["Growth Engineer", "Product Designer", "Indie Hacker", "Frontend Developer"], ["Product Manager", "Engineering Manager", "Marketing Ops Lead", "Head of Growth"], ["VP of Product", "CTO", "Director of Engineering", "COO"]],
  "E-commerce": [["DTC Brand Founder", "Social Commerce Manager", "Shopify Store Owner", "Growth Marketer"], ["E-commerce Manager", "Digital Marketing Manager", "Operations Lead", "Merchandising Manager"], ["Head of E-commerce", "VP of Retail", "Brand Director", "Managing Director"]],
  "Professional Services": [["Freelance Consultant", "Junior Associate", "Solo Practitioner", "Boutique Agency Founder"], ["Practice Manager", "Senior Consultant", "Account Director", "Operations Manager"], ["Managing Partner", "Principal", "Firm Director", "Practice Lead"]],
  "Education": [["Course Creator", "EdTech Coordinator", "Instructional Designer", "Teaching Assistant"], ["Program Director", "Curriculum Lead", "Department Chair", "Learning Manager"], ["Dean", "Superintendent", "Head of School", "VP of Learning"]],
  "Health/Wellness": [["Wellness Coach", "Personal Trainer", "Nutrition Blogger", "Yoga Instructor"], ["Clinic Manager", "Studio Owner", "Program Coordinator", "Practice Administrator"], ["Medical Director", "Regional Director", "Practice Owner", "VP of Operations"]],
  "Finance": [["Fintech Analyst", "Junior Advisor", "Personal Finance Creator", "Bookkeeper"], ["Financial Advisor", "Controller", "Finance Manager", "Senior Accountant"], ["CFO", "Managing Director", "Head of Finance", "Partner"]],
  "Creative": [["Freelance Designer", "Content Creator", "Motion Designer", "Photographer"], ["Creative Director", "Studio Manager", "Senior Art Director", "Brand Strategist"], ["Agency Owner", "Executive Creative Director", "Managing Partner", "Head of Brand"]],
  "B2B": [["SDR Team Lead", "RevOps Analyst", "Growth Marketer", "Solutions Consultant"], ["Sales Manager", "Marketing Director", "Customer Success Lead", "Operations Manager"], ["VP of Sales", "CRO", "General Manager", "CEO"]],
  "Other": [["Early-Career Specialist", "Side-Hustle Founder", "Team Coordinator", "Analyst"], ["Operations Manager", "Team Lead", "Program Manager", "Department Manager"], ["Director", "Owner", "General Manager", "VP of Operations"]],
};

const B2C_TITLES = [
  ["Recent Graduate", "Junior Professional", "Content Creator", "Grad Student"],
  ["Working Parent", "Mid-Career Professional", "Team Manager", "Homeowner"],
  ["Senior Professional", "Small Business Owner", "Empty Nester", "Executive"],
];

const SIZES: Record<string, string[]> = {
  "Consumers (B2C)": ["Individual consumer", "Household decision-maker", "Individual buyer"],
  "Small Business (SMB)": ["1-10 employees", "10-50 employees", "5-25 employees"],
  "Mid-Market": ["50-200 employees", "200-500 employees", "100-350 employees"],
  "Enterprise": ["1,000-5,000 employees", "5,000+ employees", "2,500+ employees"],
};
const MIXED_SIZES = [["1-20 employees", "Solo / early startup"], ["50-200 employees", "20-100 employees"], ["500-2,000 employees", "1,000+ employees"]];

const INCOME = [
  ["$40K-$65K", "$55K-$80K", "$70K-$100K", "$85K-$120K", "$100K-$140K"],
  ["$65K-$95K", "$80K-$110K", "$95K-$130K", "$110K-$150K", "$130K-$180K"],
  ["$110K-$150K", "$130K-$170K", "$150K-$200K", "$180K-$250K", "$220K-$350K+"],
];

const CHANNELS = [
  ["Twitter/X & Reddit", "Product Hunt", "TikTok & Instagram", "Tech newsletters", "Discord communities", "YouTube reviews"],
  ["Email", "LinkedIn", "Google search", "Webinars", "Industry podcasts", "Comparison sites"],
  ["Email", "LinkedIn", "Industry conferences", "Analyst reports", "Peer referrals", "Executive roundtables"],
];

const priceIdx = (p: string) => ({ "Free": 0, "$1-50/mo": 1, "$50-200/mo": 2, "$200-1000/mo": 3, "$1000+/mo": 4, "One-time under $100": 1, "One-time $100+": 2 } as Record<string, number>)[p] ?? 1;
const isB2C = (m: string) => m === "Consumers (B2C)";

function buildGoals(a: number, inp: Inputs): string[] {
  const d = DOMAIN[inp.industry] || DOMAIN["Other"];
  const pools = [
    [`Discover new tools before competitors and be seen as the innovator on ${d}`, "Automate repetitive work to focus on creative, high-leverage projects", "Build a personal brand as someone ahead of the curve", "Move fast and experiment without waiting for approvals", "Level up skills that make them more marketable"],
    [`Hit measurable targets tied to ${d} this quarter`, "Prove clear ROI on every tool and process they own", "Reduce time wasted on manual, error-prone workflows", "Standardize how the team works so results are repeatable", "Look competent and prepared in front of leadership"],
    [`Protect margins and reduce risk across ${d}`, "Make defensible decisions that won't blow back on them", "Consolidate vendors and control budget creep", "Ensure anything new integrates with existing systems and policies", "Leave a legacy of a well-run, scalable operation"],
  ];
  return pickN(pools[a], 4);
}

function buildPains(a: number, inp: Inputs): string[] {
  const d = DOMAIN[inp.industry] || DOMAIN["Other"];
  const pools = [
    ["Current tools feel dated, slow, and built for someone else", `Spends nights and weekends duct-taping ${d} together`, "Frustrated by bureaucracy and slow-moving decision makers", "FOMO: worried they're missing the tool everyone will use next year", "Budget is tiny, so every purchase has to punch above its weight"],
    [`Drowning in spreadsheets and manual reporting around ${d}`, "Burned before by shiny tools that didn't deliver promised results", "Under pressure to do more with a flat or shrinking budget", "No time to evaluate ten options — needs a clear, credible winner", "Team resists change unless the payoff is obvious"],
    [`Fragmented systems create blind spots across ${d}`, "Worried about security, compliance, and vendor lock-in", "Past failed rollouts made the organization gun-shy", "Hard to get accurate data for board- and exec-level reporting", "Too many vendors pitching; too little proof at their scale"],
  ];
  return pickN(pools[a], 4);
}

function buildObjections(a: number, inp: Inputs): string[] {
  const priceLine = [
    ["Even free tools cost time — is this worth setting up?", "Will the free tier stay free, or is this a bait-and-switch?"],
    ["Another small subscription — do these add up to real value?", "Can I get 80% of this with a free alternative?"],
    ["At this price it needs to replace something I already pay for", "I'll need to justify this line item — where's the proof?"],
    ["This needs a business case — who else at my size uses it?", "What's the switching cost if it doesn't work out?"],
    ["This is a strategic spend — I need references and an SLA", "Procurement and security review will take months — is it worth starting?"],
  ][priceIdx(inp.price)];
  const pools = [
    ["It looks cool, but is anyone actually using it seriously?", "If it's not fast to set up, I'm out", "Will this product still exist in a year?"],
    ["Where are the case studies and hard numbers?", "How long until we see measurable results?", "My team already has tool fatigue — why add one more?"],
    ["How does this handle security, compliance, and data ownership?", "What does support look like when something breaks?", "We've survived without it — why change now?"],
  ];
  return [pick(priceLine), ...pickN(pools[a], 2)];
}

function buildTriggers(a: number): string[] {
  const pools = [
    ["Saw it trending on Product Hunt or a subreddit they trust", "A creator or peer they follow demoed it", "Hit a wall with their current duct-taped workflow", "New job or project where they get to pick the stack"],
    ["Quarter started with a bigger target and the same headcount", "A competitor or peer company publicly credited a similar tool", "An audit of time spent revealed an embarrassing bottleneck", "A trusted colleague recommended it after real results"],
    ["A costly mistake or missed number exposed the gap", "Budget planning season opened a window for consolidation", "Leadership asked a question they couldn't answer with data", "A key hire or departure forced a process rethink"],
  ];
  return pickN(pools[a], 3);
}

function buildQuote(a: number, inp: Inputs): string {
  const what = inp.sell.trim() ? inp.sell.trim().split(/[.\n]/)[0].toLowerCase().slice(0, 60) : "a better way to work";
  const v = inp.value.trim() ? inp.value.trim().toLowerCase().replace(/\.$/, "") : "real results without the busywork";
  const pools = [
    [`If ${what} actually delivers ${v}, I want to be using it before everyone else.`, "I don't need another pitch — let me try it today and I'll know in an hour.", "The old way is broken. Show me something built for how we actually work now."],
    [`Show me the numbers. If ${v} is real, I can sell it to my team.`, "I don't buy promises, I buy outcomes. Prove it works for teams like mine.", "Every hour I save on busywork is an hour on work that moves the needle."],
    [`I've seen tools come and go. What I need is ${v}, reliably, at scale.`, "Convince my team first — but if this reduces risk and cost, you have my attention.", "Nobody gets fired for choosing the safe option. Make the safe option obvious."],
  ];
  return pick(pools[a]);
}

function generate(inp: Inputs): Persona[] {
  const meta = [
    { archetype: "The Early Adopter", tagline: "Younger, tech-savvy, values innovation" },
    { archetype: "The Pragmatist", tagline: "Mid-career, ROI-focused, needs proof" },
    { archetype: "The Decision Maker", tagline: "Senior, budget authority, risk-averse" },
  ];
  return meta.map((m, a) => ({
    ...m,
    emoji: pick(EMOJI[a]),
    name: `${pick(FIRST[a])} ${pick(LAST)}`,
    age: pick(AGES[a]),
    title: pick(isB2C(inp.market) ? B2C_TITLES[a] : (TITLES[inp.industry] || TITLES["Other"])[a]),
    companySize: inp.market === "Mixed" ? pick(MIXED_SIZES[a]) : pick(SIZES[inp.market] || SIZES["Small Business (SMB)"]),
    income: INCOME[a][priceIdx(inp.price)],
    goals: buildGoals(a, inp),
    pains: buildPains(a, inp),
    objections: buildObjections(a, inp),
    channels: pickN(CHANNELS[a], 4),
    triggers: buildTriggers(a),
    quote: buildQuote(a, inp),
  }));
}

function toMarkdown(personas: Persona[], inp: Inputs): string {
  const head = `# Customer Personas — ${inp.business || "My Business"}\n\nIndustry: ${inp.industry} · Price: ${inp.price} · Market: ${inp.market}\n\n`;
  return head + personas.map((p) => [
    `## ${p.emoji} ${p.name} — ${p.archetype}`,
    `*${p.tagline}*`,
    `- **Age:** ${p.age}\n- **Role:** ${p.title}\n- **Company size:** ${p.companySize}\n- **Income:** ${p.income}`,
    `### Goals\n${p.goals.map((g) => `- ${g}`).join("\n")}`,
    `### Pain Points\n${p.pains.map((g) => `- ${g}`).join("\n")}`,
    `### Common Objections\n${p.objections.map((g) => `- ${g}`).join("\n")}`,
    `### Preferred Channels\n${p.channels.map((g) => `- ${g}`).join("\n")}`,
    `### Buying Triggers\n${p.triggers.map((g) => `- ${g}`).join("\n")}`,
    `> "${p.quote}"`,
  ].join("\n\n")).join("\n\n---\n\n");
}

function toHtml(personas: Persona[], inp: Inputs): string {
  const cards = personas.map((p) => `<div style="border:1px solid #ddd;border-radius:12px;padding:24px;margin-bottom:24px;page-break-inside:avoid;font-family:system-ui,sans-serif">
<h2 style="margin:0">${p.emoji} ${p.name} <span style="color:#6d28d9">— ${p.archetype}</span></h2>
<p style="color:#666;font-style:italic">${p.tagline}</p>
<p><b>Age:</b> ${p.age} · <b>Role:</b> ${p.title} · <b>Company:</b> ${p.companySize} · <b>Income:</b> ${p.income}</p>
<h3>Goals</h3><ul>${p.goals.map((g) => `<li>${g}</li>`).join("")}</ul>
<h3>Pain Points</h3><ul>${p.pains.map((g) => `<li>${g}</li>`).join("")}</ul>
<h3>Common Objections</h3><ul>${p.objections.map((g) => `<li>${g}</li>`).join("")}</ul>
<h3>Preferred Channels</h3><ul>${p.channels.map((g) => `<li>${g}</li>`).join("")}</ul>
<h3>Buying Triggers</h3><ul>${p.triggers.map((g) => `<li>${g}</li>`).join("")}</ul>
<blockquote style="border-left:3px solid #6d28d9;padding-left:12px;color:#444">"${p.quote}"</blockquote></div>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Customer Personas — ${inp.business || "My Business"}</title></head><body style="max-width:800px;margin:40px auto;padding:0 20px"><h1 style="font-family:system-ui,sans-serif">Customer Personas — ${inp.business || "My Business"}</h1>${cards}</body></html>`;
}

function ListBlock({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${color}`}>{title}</h4>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-slate-300 flex gap-2">
            <span className="text-violet-400 shrink-0 mt-0.5">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PersonaCard({ p }: { p: Persona }) {
  return (
    <article className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 shadow-xl shadow-violet-950/20 flex flex-col gap-5">
      <header className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl" aria-hidden>
          {p.emoji}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{p.name}</h3>
          <p className="text-sm font-medium text-violet-300">{p.archetype}</p>
          <p className="text-xs text-slate-400">{p.tagline}</p>
        </div>
      </header>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        {[["Age", p.age], ["Role", p.title], ["Company", p.companySize], ["Income", p.income]].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-slate-800/50 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-slate-500">{k}</dt>
            <dd className="text-slate-200 text-xs sm:text-sm">{v}</dd>
          </div>
        ))}
      </dl>
      <ListBlock title="Goals" items={p.goals} color="text-emerald-400" />
      <ListBlock title="Pain Points" items={p.pains} color="text-rose-400" />
      <ListBlock title="Common Objections" items={p.objections} color="text-amber-400" />
      <ListBlock title="Preferred Channels" items={p.channels} color="text-sky-400" />
      <ListBlock title="Buying Triggers" items={p.triggers} color="text-indigo-400" />
      <blockquote className="mt-auto rounded-xl border-l-4 border-violet-500 bg-violet-500/10 p-4 text-sm italic text-violet-100">
        &ldquo;{p.quote}&rdquo;
      </blockquote>
    </article>
  );
}

const field = "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30";
const label = "mb-1.5 block text-sm font-medium text-slate-300";

export default function Home() {
  const [inputs, setInputs] = useState<Inputs>({ business: "", sell: "", industry: INDUSTRIES[0], price: PRICES[1], market: MARKETS[0], value: "" });
  const [personas, setPersonas] = useState<Persona[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const set = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setInputs((p) => ({ ...p, [k]: e.target.value }));

  const onGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonas(generate(inputs));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const onCopy = async () => {
    if (!personas) return;
    await navigator.clipboard.writeText(toMarkdown(personas, inputs));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onExport = () => {
    if (!personas) return;
    const blob = new Blob([toHtml(personas, inputs)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(inputs.business || "personas").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-personas.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-6 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
            Know exactly who you&apos;re selling to
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Customer <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Persona Builder</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Generate 3 detailed, actionable customer personas in minutes. Answer a few questions about your business and get realistic buyer profiles with demographics, pain points, goals, and objections. Built for marketers, product managers, and startup founders.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#tool" className="rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
              Build My Personas — Free
            </a>
            <a href="#pricing" className="rounded-xl border border-slate-700 px-8 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-violet-500 hover:text-white">
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              ["1", "Tell us about your business", "Answer six quick questions about what you sell, your market, and your pricing."],
              ["2", "Get 3 detailed personas instantly", "Distinct, realistic buyer profiles — demographics, goals, pains, objections, and channels."],
              ["3", "Export and share", "Export as PDF-ready cards or copy clean Markdown straight into your docs."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">{n}</div>
                <h3 className="font-semibold text-white">{t}</h3>
                <p className="mt-2 text-sm text-slate-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN TOOL */}
      <section id="tool" className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-white">Describe your business</h2>
          <p className="mt-2 text-center text-sm text-slate-400">All fields help tailor your personas. No signup required to try.</p>
          <form onSubmit={onGenerate} className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="business" className={label}>Business name</label>
                <input id="business" className={field} value={inputs.business} onChange={set("business")} placeholder="e.g. Acme Analytics" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="sell" className={label}>What do you sell?</label>
                <textarea id="sell" className={field} rows={3} value={inputs.sell} onChange={set("sell")} placeholder="e.g. A dashboard that turns raw sales data into weekly insights" />
              </div>
              <div>
                <label htmlFor="industry" className={label}>Industry</label>
                <select id="industry" className={field} value={inputs.industry} onChange={set("industry")}>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="price" className={label}>Price range</label>
                <select id="price" className={field} value={inputs.price} onChange={set("price")}>
                  {PRICES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="market" className={label}>Target market</label>
                <select id="market" className={field} value={inputs.market} onChange={set("market")}>
                  {MARKETS.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="value" className={label}>Primary value proposition</label>
                <input id="value" className={field} value={inputs.value} onChange={set("value")} placeholder="e.g. Save 10 hours a week" />
              </div>
            </div>
            <button type="submit" className="mt-6 w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
              Generate My 3 Personas
            </button>
          </form>

          {personas && (
            <div id="results" className="mt-14 scroll-mt-8">
              <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
                <button onClick={onCopy} className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20">
                  {copied ? "Copied!" : "Copy All as Markdown"}
                </button>
                <button onClick={onExport} className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/20">
                  Export as HTML
                </button>
                <button onClick={() => setPersonas(generate(inputs))} className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-emerald-500 hover:text-emerald-300">
                  Regenerate
                </button>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {personas.map((p) => <PersonaCard key={p.archetype} p={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-16">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-b from-indigo-950/60 to-slate-950 p-8 text-center shadow-2xl shadow-violet-950/30">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">PRO — LAUNCHING SOON</span>
            <div className="mt-6 flex items-end justify-center gap-1">
              <span className="text-5xl font-extrabold text-white">$9</span>
              <span className="pb-1.5 text-slate-400">/month</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-left text-sm text-slate-300">
              {["Unlimited persona generations", "Save & organize persona sets by project", "PDF export with your branding", "Persona-to-messaging prompts for ads & email", "Priority support"].map((f) => (
                <li key={f} className="flex gap-2"><span className="text-emerald-400">✓</span>{f}</li>
              ))}
            </ul>
            {joined ? (
              <p className="mt-6 rounded-lg bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-300">
                You&apos;re on the list! We&apos;ll email you at launch.
              </p>
            ) : (
              <form
                className="mt-6 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setJoined(true); }}
              >
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={field} aria-label="Email address" />
                <button type="submit" className="shrink-0 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400">
                  Join Waitlist
                </button>
              </form>
            )}
            <p className="mt-4 text-xs text-slate-500">No spam. Cancel anytime. Free tier stays free.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-bold text-white">Customer Persona Builder</p>
            <p className="mt-1 text-sm text-slate-500">Know your buyer. Ship the right message.</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <a href="#tool" className="transition hover:text-violet-300">Tool</a>
            <a href="#pricing" className="transition hover:text-violet-300">Pricing</a>
            <a href="mailto:hello@persona-builder.app" className="transition hover:text-violet-300">Contact</a>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Customer Persona Builder. All personas are illustrative profiles generated from your inputs.
        </p>
      </footer>
    </main>
  );
}
