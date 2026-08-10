"use client";

import { useState } from "react";

const SOFTWARE_TYPES = ["Web App", "Mobile App", "Desktop App", "API/Backend", "CLI Tool", "Browser Extension", "Other"];
const PLATFORMS = ["Windows", "macOS", "Linux", "iOS", "Android", "Web Browser", "Cross-platform"];
const KEY_AREAS = ["UI/Visual", "Performance", "Data/Storage", "Authentication", "API/Integration", "Accessibility", "Security"];
const SEVERITY_OPTIONS = ["Simple (Low/Medium/High)", "Detailed (P0-P4)", "Custom"];

const SECTIONS = [
  { id: "steps", label: "Steps to Reproduce" },
  { id: "expected", label: "Expected vs Actual" },
  { id: "env", label: "Environment Info" },
  { id: "media", label: "Screenshots/Videos" },
  { id: "device", label: "Browser/Device Info" },
  { id: "logs", label: "Console Logs" },
  { id: "severity", label: "Severity" },
  { id: "assignee", label: "Assignee Field" },
];

const FORMATS = [
  { id: "github", label: "GitHub Issues", lang: "Markdown" },
  { id: "jira", label: "Jira", lang: "Jira markup" },
  { id: "linear", label: "Linear", lang: "Markdown" },
  { id: "generic", label: "Generic", lang: "Plain text" },
];

const ENV_FIELDS: Record<string, string[]> = {
  "Web App": ["Browser + version (e.g. Chrome 126)", "Operating system", "Screen size / resolution", "App version or commit hash", "Network conditions (wifi, VPN, offline)"],
  "Mobile App": ["Device model (e.g. iPhone 15, Pixel 8)", "OS version", "App version / build number", "Network (wifi / cellular / offline)", "Low-power mode active?"],
  "Desktop App": ["Operating system + version", "App version / build number", "Display setup (resolution, scaling, monitors)", "Installed via (installer, store, package manager)"],
  "API/Backend": ["Endpoint + HTTP method", "Environment (dev / staging / production)", "API version", "Client used (curl, SDK, Postman)", "Request ID / trace ID if available"],
  "CLI Tool": ["Operating system + version", "Shell (bash, zsh, PowerShell)", "Tool version (--version output)", "Runtime version (Node, Python, etc.)", "Terminal emulator"],
  "Browser Extension": ["Browser + version", "Extension version", "Operating system", "Other extensions that may conflict", "Incognito / private mode?"],
  Other: ["Operating system + version", "Software version", "Relevant configuration details"],
};

const DEVICE_HINTS: Record<string, string[]> = {
  Windows: ["Windows version (10 / 11) + build number", "Hardware model / GPU if relevant", "Display scaling (100% / 125% / 150%)"],
  macOS: ["macOS version (e.g. Sonoma 14.5)", "Mac model + chip (Intel / Apple Silicon)", "External displays connected?"],
  Linux: ["Distribution + version (e.g. Ubuntu 24.04)", "Desktop environment / window manager", "Display server (X11 / Wayland)"],
  iOS: ["iPhone / iPad model", "iOS / iPadOS version", "Accessibility settings active (text size, VoiceOver)"],
  Android: ["Manufacturer + model", "Android version + skin (One UI, MIUI, stock)", "Screen size / density if UI-related"],
  "Web Browser": ["Browser name + exact version", "Operating system", "Extensions / ad blockers active", "Cookies + JavaScript enabled?"],
  "Cross-platform": ["Platform where the bug occurred", "OS + version", "Device model (if mobile)", "Does it reproduce on other platforms?"],
};

const AREA_PROMPTS: Record<string, string> = {
  "UI/Visual": "Which screen / component? Include theme (light/dark) and zoom level.",
  Performance: "How slow, exactly? Include timings, dataset size, and whether it degrades over time.",
  "Data/Storage": "Any data loss or corruption? Include record IDs and the last known good state.",
  Authentication: "Which auth method (SSO, OAuth, password)? Fresh login or existing session?",
  "API/Integration": "Which endpoint or integration? Include request, response body, and status code.",
  Accessibility: "Which assistive tech (screen reader, keyboard-only, voice control)? WCAG criterion if known.",
  Security: "Do NOT post exploit details publicly — mark confidential and follow your security policy.",
};

type FormState = {
  name: string;
  type: string;
  platform: string;
  areas: string[];
  severity: string;
  sections: string[];
};

function severityLines(severity: string): [string, string][] {
  if (severity === "Detailed (P0-P4)")
    return [
      ["P0", "critical outage, data loss, or security breach — drop everything"],
      ["P1", "major feature broken for many users — fix in the current cycle"],
      ["P2", "important bug with a workaround — schedule soon"],
      ["P3", "minor bug with limited impact — backlog"],
      ["P4", "cosmetic issue / nice-to-fix"],
    ];
  if (severity === "Custom")
    return [
      ["Critical", "(define what critical means for your team)"],
      ["Major", "(define what major means for your team)"],
      ["Minor", "(define what minor means for your team)"],
    ];
  return [
    ["High", "blocks core functionality or affects many users; no workaround"],
    ["Medium", "degrades a feature but a workaround exists"],
    ["Low", "cosmetic issue or minor annoyance"],
  ];
}

function buildTemplate(fmt: string, d: FormState): string {
  const name = d.name.trim() || "Your Product";
  const jira = fmt === "jira";
  const plain = fmt === "generic";
  const h = (t: string) => (jira ? "h2. " + t : plain ? "=== " + t.toUpperCase() + " ===" : "## " + t);
  const b = (t: string) => (jira ? "*" + t + "*" : plain ? t : "**" + t + "**");
  const li = (t: string) => (jira ? "* " + t : "- " + t);
  const num = (i: number, t: string) => (jira ? "# " + t : i + ". " + t);
  const ph = (t: string) => (jira ? "_" + t + "_" : plain ? "> " + t : "<!-- " + t + " -->");
  const code = (t: string) => (jira ? "{code}\n" + t + "\n{code}" : plain ? "    " + t : "```\n" + t + "\n```");
  const has = (id: string) => d.sections.includes(id);
  const areas = d.areas.length ? d.areas : ["General"];
  const env = ENV_FIELDS[d.type] ?? ENV_FIELDS.Other;
  const device = DEVICE_HINTS[d.platform] ?? [];
  const out: string[] = [];

  if (fmt === "github") {
    out.push("---");
    out.push("name: Bug Report — " + name);
    out.push("about: Report a bug in " + name + " (" + d.type + ", " + d.platform + ")");
    out.push('title: "[Bug][' + areas[0] + ']: "');
    out.push("labels: bug, needs-triage");
    out.push("assignees: ''");
    out.push("---", "");
  } else if (jira) {
    out.push("Project: " + name);
    out.push("Issue Type: Bug");
    out.push("Components: " + areas.join(", "));
    out.push("");
  } else if (fmt === "linear") {
    out.push("> " + name + " bug report template — paste into Linear: Settings → Team → Templates.");
    out.push("");
  } else {
    out.push("BUG REPORT — " + name.toUpperCase() + " (" + d.type + " / " + d.platform + ")");
    out.push("========================================", "");
  }

  out.push(h("Title"));
  out.push(ph('Format: [' + areas[0] + '] short, specific summary — e.g. "[' + areas[0] + '] Save button does nothing on ' + d.platform + '"'));
  out.push("");

  out.push(h("Bug Area"));
  out.push(ph("Check the area this bug belongs to"));
  areas.forEach((a) => out.push(jira || plain ? li("( ) " + a) : "- [ ] " + a));
  out.push("");

  out.push(h("Description"));
  out.push(ph("One clear paragraph: what were you trying to do in " + name + ", and what went wrong?"));
  out.push("");

  if (d.areas.length) {
    out.push(h("Area-Specific Details"));
    d.areas.forEach((a) => out.push(li(b(a) + ": " + AREA_PROMPTS[a])));
    out.push("");
  }

  if (has("steps")) {
    out.push(h("Steps to Reproduce"));
    out.push(num(1, "Go to / open ..."));
    out.push(num(2, "Click / run / call ..."));
    out.push(num(3, "Observe the failure"));
    out.push("");
    out.push(b("Reproducibility") + ": always / sometimes / only once");
    out.push("");
  }

  if (has("expected")) {
    out.push(h("Expected vs Actual Behavior"));
    out.push(b("Expected") + ":");
    out.push(ph("What should have happened"));
    out.push("");
    out.push(b("Actual") + ":");
    out.push(ph("What actually happened — include exact error messages, word for word"));
    out.push("");
  }

  if (has("env")) {
    out.push(h("Environment"));
    env.forEach((f) => out.push(li(f + ": ")));
    out.push("");
  }

  if (has("device")) {
    out.push(h("Browser / Device Info"));
    device.forEach((f) => out.push(li(f + ": ")));
    out.push("");
  }

  if (has("media")) {
    out.push(h("Screenshots / Videos"));
    out.push(ph(d.areas.includes("UI/Visual") ? "Attach a screenshot or short recording. For visual bugs a before/after screenshot is required." : "Attach a screenshot or short recording of the failing state — it saves a round of questions."));
    out.push("");
  }

  if (has("logs")) {
    out.push(h("Console Logs / Error Output"));
    out.push(code("Paste relevant console output, stack traces, or API error responses here."));
    out.push("");
  }

  if (has("severity")) {
    out.push(h("Severity"));
    out.push(ph("Pick one"));
    severityLines(d.severity).forEach(([lvl, desc]) => out.push(li(b(lvl) + " — " + desc)));
    out.push("");
  }

  if (has("assignee")) {
    out.push(h("Assignee"));
    out.push(b("Assignee") + ": @");
    out.push(b("Team / component owner") + ": ");
    out.push("");
  }

  out.push(plain ? "-- Generated with Bug Report Template Generator --" : ph("Generated with Bug Report Template Generator"));
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

const inputCls =
  "w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
const labelCls = "mb-1.5 block text-sm font-medium text-slate-300";

export default function Home() {
  const [form, setForm] = useState<FormState>({
    name: "",
    type: SOFTWARE_TYPES[0],
    platform: PLATFORMS[0],
    areas: ["UI/Visual", "Performance"],
    severity: SEVERITY_OPTIONS[0],
    sections: SECTIONS.map((s) => s.id),
  });
  const [output, setOutput] = useState<Record<string, string> | null>(null);
  const [tab, setTab] = useState("github");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const toggle = (key: "areas" | "sections", v: string) =>
    setForm((f) => ({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] }));

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    FORMATS.forEach((f) => (next[f.id] = buildTemplate(f.id, form)));
    setOutput(next);
    setCopied(false);
    setTimeout(() => document.getElementById("output")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output[tab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-base font-bold tracking-tight text-white">
          Bug<span className="text-indigo-400">Template</span>Gen
        </span>
        <a href="#pricing" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400">
          Get started — $7/mo
        </a>
      </nav>

      {/* HERO */}
      <section className="relative mx-auto max-w-4xl px-6 pb-20 pt-16 text-center sm:pt-24">
        <p className="mb-4 inline-block rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-xs font-medium text-indigo-300">
          For GitHub Issues · Jira · Linear
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Bug Report{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
            Template Generator
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Generate professional bug report templates tailored to your software. Get formatted templates for GitHub
          Issues, Jira, and Linear — ready to paste into your project settings. Stop getting vague bug reports from
          your team and users.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#tool" className="w-full rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 sm:w-auto">
            Generate my template
          </a>
          <a href="#how" className="w-full rounded-xl border border-slate-700 px-8 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-white sm:w-auto">
            How it works
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["1", "Describe your software", "Tell us your product name, the type of software, and the platform it runs on."],
            ["2", "Choose your issue tracker", "Pick GitHub Issues, Jira, Linear, or a generic plain-text format."],
            ["3", "Copy & paste", "Copy your customized template and paste it straight into your project settings."],
          ].map(([n, title, body]) => (
            <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-indigo-500/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                {n}
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN TOOL */}
      <section id="tool" className="relative mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-white">Build your template</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-400">
          Everything runs in your browser — nothing is uploaded, no account needed to try it.
        </p>

        <form onSubmit={generate} className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className={labelCls}>Software / product name</label>
              <input id="name" type="text" value={form.name} placeholder="e.g. AcmeBoard" className={inputCls}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="type" className={labelCls}>Type of software</label>
              <select id="type" value={form.type} className={inputCls} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {SOFTWARE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="platform" className={labelCls}>Primary platform</label>
              <select id="platform" value={form.platform} className={inputCls} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <span className={labelCls}>Key areas to report on</span>
              <div className="flex flex-wrap gap-2">
                {KEY_AREAS.map((a) => (
                  <label key={a} className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${form.areas.includes(a) ? "border-indigo-500 bg-indigo-500/20 text-indigo-200" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                    <input type="checkbox" className="sr-only" checked={form.areas.includes(a)} onChange={() => toggle("areas", a)} />
                    {a}
                  </label>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="severity" className={labelCls}>Severity levels</label>
              <select id="severity" value={form.severity} className={inputCls} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                {SEVERITY_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <span className={labelCls}>Include sections</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                {SECTIONS.map((s) => (
                  <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600">
                    <input type="checkbox" checked={form.sections.includes(s.id)} onChange={() => toggle("sections", s.id)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-indigo-500" />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="mt-8 w-full rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
            Generate templates
          </button>
        </form>

        {/* OUTPUT */}
        {output && (
          <div id="output" className="mt-10 scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
              {FORMATS.map((f) => (
                <button key={f.id} type="button" onClick={() => { setTab(f.id); setCopied(false); }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === f.id ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {FORMATS.find((f) => f.id === tab)?.lang}
              </span>
              <button type="button" onClick={copy}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${copied ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"}`}>
                {copied ? "Copied!" : "Copy Template"}
              </button>
            </div>
            <pre className="mt-3 max-h-[540px] overflow-auto rounded-xl border border-slate-800 bg-black/60 p-5 text-[13px] leading-relaxed text-indigo-200">
              <code>{output[tab]}</code>
            </pre>
          </div>
        )}
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-950 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white">Simple pricing</h2>
          <p className="mt-4 text-5xl font-extrabold text-white">
            $7<span className="text-lg font-medium text-slate-400">/month</span>
          </p>
          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-slate-300">
            {["Unlimited template generation", "All four formats: GitHub, Jira, Linear, generic", "Save & manage templates for every product", "New tracker formats as they ship"].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-400">✓</span>{f}
              </li>
            ))}
          </ul>
          {joined ? (
            <p className="mt-8 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-4 text-sm font-medium text-emerald-300">
              You are on the list! We will email you at launch.
            </p>
          ) : (
            <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => { e.preventDefault(); if (email.trim()) setJoined(true); }}>
              <input type="email" required value={email} placeholder="you@company.com" aria-label="Email address"
                className={inputCls} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="shrink-0 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400">
                Join the waitlist
              </button>
            </form>
          )}
          <p className="mt-4 text-xs text-slate-500">Launching soon. No spam, one email at launch.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-slate-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row">
          <span>© 2026 BugTemplateGen. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#how" className="transition hover:text-indigo-300">How it works</a>
            <a href="#tool" className="transition hover:text-indigo-300">Generator</a>
            <a href="#pricing" className="transition hover:text-indigo-300">Pricing</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
