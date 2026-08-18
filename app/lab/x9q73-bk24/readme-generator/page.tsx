"use client";

import { useState, useEffect } from "react";

const LICENSE_OPTIONS = [
  "MIT",
  "Apache 2.0",
  "GPL 3.0",
  "BSD 3-Clause",
  "ISC",
  "Unlicense",
];

function badgeSlug(tech: string): string {
  return tech.replace(/\s+/g, "_").replace(/\./g, "dot");
}

function licenseBadgeTag(license: string): string {
  const encoded = license.replace(/\s+/g, "_");
  return `![License](https://img.shields.io/badge/License-${encoded}-blue.svg)`;
}

function techBadge(tech: string): string {
  const slug = badgeSlug(tech);
  return `![${tech}](https://img.shields.io/badge/${slug}-20232A?logo=${tech.toLowerCase().replace(/\s+/g, "")})`;
}

function generateReadme(form: FormState): string {
  const lines: string[] = [];
  const name = form.projectName || "My Project";
  const licenseName = form.license || "MIT";

  lines.push(`# ${name}`);
  lines.push("");
  const badges = [licenseBadgeTag(licenseName)];
  form.techStack.forEach((t) => badges.push(techBadge(t)));
  lines.push(badges.join(" "));
  lines.push("");

  if (form.description) {
    lines.push(form.description);
    lines.push("");
  }

  lines.push("## Table of Contents");
  lines.push("");
  lines.push("- [Features](#features)");
  lines.push("- [Tech Stack](#tech-stack)");
  lines.push("- [Prerequisites](#prerequisites)");
  lines.push("- [Installation](#installation)");
  lines.push("- [Usage](#usage)");
  if (form.hasContributing) lines.push("- [Contributing](#contributing)");
  if (form.hasTests) lines.push("- [Running Tests](#running-tests)");
  lines.push("- [License](#license)");
  lines.push("- [Author](#author)");
  lines.push("- [Acknowledgments](#acknowledgments)");
  lines.push("");

  lines.push("## Features");
  lines.push("");
  const features = form.features
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (features.length > 0) {
    features.forEach((f) => lines.push(`- ${f}`));
  } else {
    lines.push("- Core functionality");
  }
  lines.push("");

  lines.push("## Tech Stack");
  lines.push("");
  if (form.techStack.length > 0) {
    form.techStack.forEach((t) => lines.push(`- **${t}** ${techBadge(t)}`));
  } else {
    lines.push("- No specific tech stack listed");
  }
  lines.push("");

  lines.push("## Prerequisites");
  lines.push("");
  lines.push("Before you begin, ensure you have the following installed:");
  lines.push("");
  lines.push("- [Node.js](https://nodejs.org/) (v16 or higher)");
  lines.push("- npm or yarn");
  lines.push("");

  lines.push("## Installation");
  lines.push("");
  const steps = form.installation
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (steps.length > 0) {
    steps.forEach((step, i) => {
      lines.push(`${i + 1}. ${step}`);
      lines.push("");
      lines.push("```bash");
      lines.push(step);
      lines.push("```");
      lines.push("");
    });
  } else {
    lines.push("```bash");
    lines.push(`git clone https://github.com/${form.githubUsername || "username"}/${name.toLowerCase().replace(/\s+/g, "-")}.git`);
    lines.push(`cd ${name.toLowerCase().replace(/\s+/g, "-")}`);
    lines.push("npm install");
    lines.push("```");
    lines.push("");
  }

  lines.push("## Usage");
  lines.push("");
  if (form.usage) {
    lines.push("```");
    lines.push(form.usage);
    lines.push("```");
  } else {
    lines.push("```bash");
    lines.push("npm start");
    lines.push("```");
  }
  lines.push("");

  if (form.hasContributing) {
    lines.push("## Contributing");
    lines.push("");
    lines.push("Contributions are welcome! Please follow these steps:");
    lines.push("");
    lines.push("1. Fork the repository");
    lines.push("2. Create a feature branch (`git checkout -b feature/amazing-feature`)");
    lines.push("3. Commit your changes (`git commit -m 'Add amazing feature'`)");
    lines.push("4. Push to the branch (`git push origin feature/amazing-feature`)");
    lines.push("5. Open a Pull Request");
    lines.push("");
    lines.push("Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.");
    lines.push("");
  }

  if (form.hasTests) {
    lines.push("## Running Tests");
    lines.push("");
    lines.push("```bash");
    lines.push("npm test");
    lines.push("```");
    lines.push("");
    lines.push("To run tests with coverage:");
    lines.push("");
    lines.push("```bash");
    lines.push("npm run test:coverage");
    lines.push("```");
    lines.push("");
  }

  lines.push("## License");
  lines.push("");
  lines.push(`This project is licensed under the ${licenseName} License - see the [LICENSE](LICENSE) file for details.`);
  lines.push("");

  lines.push("## Author");
  lines.push("");
  if (form.authorName || form.githubUsername) {
    if (form.authorName) lines.push(`**${form.authorName}**`);
    if (form.githubUsername) {
      lines.push("");
      lines.push(`- GitHub: [@${form.githubUsername}](https://github.com/${form.githubUsername})`);
    }
  } else {
    lines.push("Your Name");
  }
  lines.push("");

  lines.push("## Acknowledgments");
  lines.push("");
  lines.push("- Thanks to all contributors who helped shape this project");
  lines.push("- Inspired by the open-source community");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`*Generated with README Generator*`);

  return lines.join("\n");
}

interface FormState {
  projectName: string;
  description: string;
  techStack: string[];
  installation: string;
  usage: string;
  features: string;
  license: string;
  authorName: string;
  githubUsername: string;
  hasContributing: boolean;
  hasTests: boolean;
}

const INITIAL_FORM: FormState = {
  projectName: "",
  description: "",
  techStack: [],
  installation: "",
  usage: "",
  features: "",
  license: "MIT",
  authorName: "",
  githubUsername: "",
  hasContributing: false,
  hasTests: false,
};

const HOW_IT_WORKS = [
  { step: "1", title: "Fill the Form", desc: "Enter your project details, tech stack, and installation steps." },
  { step: "2", title: "Generate README", desc: "Click generate and get a professional, badge-rich README.md instantly." },
  { step: "3", title: "Copy & Use", desc: "Copy the raw Markdown and drop it straight into your repository." },
];

export default function ReadmeGeneratorPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [techInput, setTechInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTech = () => {
    const tag = techInput.trim();
    if (tag && !form.techStack.includes(tag)) {
      updateField("techStack", [...form.techStack, tag]);
    }
    setTechInput("");
  };

  const removeTech = (tech: string) => {
    updateField("techStack", form.techStack.filter((t) => t !== tech));
  };

  const handleGenerate = () => {
    const md = generateReadme(form);
    setResult(md);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setToast("Markdown copied to clipboard!");
    } catch {
      setToast("Failed to copy. Please select and copy manually.");
    }
  };

  const handleWaitlist = () => {
    if (!waitlistEmail || !waitlistEmail.includes("@")) {
      setToast("Please enter a valid email address.");
      return;
    }
    const existing = JSON.parse(localStorage.getItem("readmeGeneratorWaitlist") || "[]");
    if (!existing.includes(waitlistEmail)) {
      existing.push(waitlistEmail);
      localStorage.setItem("readmeGeneratorWaitlist", JSON.stringify(existing));
    }
    setToast("You have been added to the waitlist!");
    setWaitlistEmail("");
  };

  const inputClasses =
    "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const labelClasses = "mb-1.5 block text-sm font-medium text-slate-300";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-6 z-50 rounded-lg border border-emerald-500/30 bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-500/20">
          {toast}
        </div>
      )}

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-24 text-center">
        <span className="mb-4 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Developer Tool
        </span>
        <h1 className="mt-4 bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-5xl font-extrabold leading-tight text-transparent md:text-6xl">
          README Generator
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          Generate professional, badge-rich README.md files for your open-source projects in seconds.
          Fill in your project details and get a polished README ready to drop into your repository.
        </p>
        <button
          onClick={() => document.getElementById("tool-section")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
        >
          Start Generating
        </button>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-white">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-slate-700 bg-slate-800/60 p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Tool */}
      <section id="tool-section" className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-8 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-center text-3xl font-bold text-transparent">
          Build Your README
        </h2>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-800/40 p-6">
            <div>
              <label className={labelClasses}>Project Name</label>
              <input type="text" className={inputClasses} placeholder="e.g. My Awesome Project" value={form.projectName} onChange={(e) => updateField("projectName", e.target.value)} />
            </div>

            <div>
              <label className={labelClasses}>Description</label>
              <textarea className={inputClasses + " min-h-[80px]"} placeholder="A brief description of your project..." value={form.description} onChange={(e) => updateField("description", e.target.value)} />
            </div>

            <div>
              <label className={labelClasses}>Tech Stack</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="Type a technology and press Enter"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                />
              </div>
              {form.techStack.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.techStack.map((tech) => (
                    <span key={tech} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
                      {tech}
                      <button onClick={() => removeTech(tech)} className="ml-0.5 text-indigo-400 hover:text-white">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={labelClasses}>Installation Steps</label>
              <textarea className={inputClasses + " min-h-[80px]"} placeholder={"git clone ...\ncd project\nnpm install"} value={form.installation} onChange={(e) => updateField("installation", e.target.value)} />
              <p className="mt-1 text-xs text-slate-500">Each line becomes a numbered step.</p>
            </div>

            <div>
              <label className={labelClasses}>Usage Example</label>
              <textarea className={inputClasses + " min-h-[80px] font-mono text-xs"} placeholder="npm start" value={form.usage} onChange={(e) => updateField("usage", e.target.value)} />
              <p className="mt-1 text-xs text-slate-500">Displayed as a code block.</p>
            </div>

            <div>
              <label className={labelClasses}>Features</label>
              <textarea className={inputClasses + " min-h-[80px]"} placeholder={"Fast performance\nEasy configuration\nExtensible plugin system"} value={form.features} onChange={(e) => updateField("features", e.target.value)} />
              <p className="mt-1 text-xs text-slate-500">Each line becomes a bullet point.</p>
            </div>

            <div>
              <label className={labelClasses}>License</label>
              <select className={inputClasses} value={form.license} onChange={(e) => updateField("license", e.target.value)}>
                {LICENSE_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Author Name</label>
                <input type="text" className={inputClasses} placeholder="Jane Doe" value={form.authorName} onChange={(e) => updateField("authorName", e.target.value)} />
              </div>
              <div>
                <label className={labelClasses}>GitHub Username</label>
                <input type="text" className={inputClasses} placeholder="janedoe" value={form.githubUsername} onChange={(e) => updateField("githubUsername", e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500" checked={form.hasContributing} onChange={(e) => updateField("hasContributing", e.target.checked)} />
                Contributing guide
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500" checked={form.hasTests} onChange={(e) => updateField("hasTests", e.target.checked)} />
                Has tests
              </label>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
            >
              Generate README
            </button>
          </div>

          {/* Output */}
          <div className="flex flex-col rounded-xl border border-slate-700 bg-slate-950 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">Generated README.md</h3>
              {result && (
                <button
                  onClick={handleCopy}
                  className="rounded-md bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/30"
                >
                  Copy as Markdown
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto rounded-lg bg-slate-900/50 p-4">
              {result ? (
                <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-slate-300">
                  {result}
                </pre>
              ) : (
                <p className="py-20 text-center text-sm text-slate-600">
                  Fill in the form and click Generate to see your README here.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Waitlist */}
      <section className="mx-auto max-w-2xl px-6 pb-20">
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">Pro Plan</h2>
          <p className="mb-1 text-4xl font-extrabold text-emerald-400">$7<span className="text-lg font-normal text-slate-400">/mo</span></p>
          <p className="mb-6 text-sm text-slate-400">Unlimited generations, custom templates, and priority support.</p>
          <div className="mx-auto flex max-w-md gap-2">
            <input
              type="email"
              className={inputClasses}
              placeholder="you@example.com"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleWaitlist(); }}
            />
            <button
              onClick={handleWaitlist}
              className="shrink-0 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        &copy; 2025 README Generator. All rights reserved.
      </footer>
    </div>
  );
}
