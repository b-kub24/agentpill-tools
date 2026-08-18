"use client";

import { useState } from "react";

function renderMarkdown(md: string): string {
  let html = md;

  // Badge images: ![alt](url)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt) =>
      `<span style="display:inline-block;background:#334155;color:#a5b4fc;padding:2px 10px;border-radius:4px;font-size:12px;margin-right:6px;font-weight:600;letter-spacing:0.02em">${alt}</span>`
  );

  // Links: [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" style="color:#818cf8;text-decoration:underline;text-underline-offset:2px" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Fenced code blocks: ```lang\n...\n```
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .trimEnd();
    return `<pre style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:16px;overflow-x:auto;margin:12px 0;font-size:13px;line-height:1.6"><code style="color:#e2e8f0">${escaped}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(
    /`([^`]+)`/g,
    '<code style="background:#1e293b;padding:2px 6px;border-radius:4px;font-size:13px;color:#c4b5fd">$1</code>'
  );

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic: *text* (not preceded/followed by *)
  html = html.replace(
    /(?<!\*)\*([^*]+)\*(?!\*)/g,
    "<em>$1</em>"
  );

  // Horizontal rules: --- or more
  html = html.replace(
    /^---+$/gm,
    '<hr style="border:none;border-top:1px solid #334155;margin:24px 0"/>'
  );

  // Headings (process from smallest to largest to avoid prefix conflicts)
  html = html.replace(
    /^#### (.+)$/gm,
    '<h4 style="font-size:16px;font-weight:600;margin:16px 0 6px;color:#cbd5e1">$1</h4>'
  );
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 style="font-size:18px;font-weight:700;margin:20px 0 8px;color:#e2e8f0">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 style="font-size:22px;font-weight:700;margin:28px 0 12px;color:#f1f5f9;border-bottom:1px solid #334155;padding-bottom:8px">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 style="font-size:28px;font-weight:800;margin:0 0 16px;color:#f8fafc">$1</h1>'
  );

  // Checkbox list items: - [x] and - [ ]
  html = html.replace(
    /^- \[x\] (.+)$/gm,
    '<li style="list-style:none;padding:4px 0"><span style="color:#a78bfa;margin-right:8px">&#10003;</span>$1</li>'
  );
  html = html.replace(
    /^- \[ \] (.+)$/gm,
    '<li style="list-style:none;padding:4px 0"><span style="color:#475569;margin-right:8px">&#9744;</span>$1</li>'
  );

  // Unordered list items: - item
  html = html.replace(
    /^- (.+)$/gm,
    '<li style="list-style:none;padding:4px 0"><span style="color:#818cf8;margin-right:8px">&#8226;</span>$1</li>'
  );

  // Ordered list items: 1. item, 2. item, etc.
  html = html.replace(
    /^(\d+)\. (.+)$/gm,
    '<li style="list-style:none;padding:4px 0"><span style="color:#818cf8;margin-right:8px;font-weight:600;font-size:13px">$1.</span>$2</li>'
  );

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(
    /((?:<li[^>]*>.*<\/li>\n?)+)/g,
    '<ul style="padding-left:8px;margin:8px 0">$1</ul>'
  );

  // Blockquotes: > text
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote style="border-left:3px solid #6366f1;padding:4px 0 4px 14px;color:#94a3b8;margin:10px 0;font-style:italic">$1</blockquote>'
  );

  // Paragraphs: wrap remaining bare text lines
  html = html.replace(
    /^(?!<[a-z])((?!\s*$).+)$/gm,
    '<p style="margin:6px 0;line-height:1.7;color:#cbd5e1">$1</p>'
  );

  return html;
}

export default function ReadmeGeneratorPage() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [installCmd, setInstallCmd] = useState("");
  const [usageExample, setUsageExample] = useState("");
  const [license, setLicense] = useState("MIT");
  const [features, setFeatures] = useState("");
  const [contributing, setContributing] = useState(true);
  const [hasTests, setHasTests] = useState(false);
  const [copied, setCopied] = useState(false);

  const licenseBadge: Record<string, string> = {
    MIT: "MIT",
    Apache: "Apache_2.0",
    GPL: "GPL_3.0",
    BSD: "BSD_3--Clause",
  };

  const licenseFullName: Record<string, string> = {
    MIT: "MIT",
    Apache: "Apache License 2.0",
    GPL: "GNU General Public License v3.0",
    BSD: "BSD 3-Clause",
  };

  function generateMarkdown(): string {
    const name = projectName.trim() || "My Project";
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const desc =
      description.trim() || "A modern, production-ready project.";
    const badge = licenseBadge[license] || "MIT";

    let md = "";

    // Title and badges
    md += `# ${name}\n\n`;
    md += `![Build Status](https://img.shields.io/badge/build-passing-brightgreen)\n`;
    md += `![License](https://img.shields.io/badge/license-${badge}-blue)\n`;
    md += `![Version](https://img.shields.io/badge/version-1.0.0-purple)\n\n`;

    // Description
    md += `${desc}\n\n`;

    // Table of Contents
    md += `---\n\n`;
    md += `## Table of Contents\n\n`;
    const tocSections: string[] = [];
    const featureLines = features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    if (featureLines.length > 0) tocSections.push("Features");
    const techs = techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (techs.length > 0) tocSections.push("Tech Stack");
    const cmd = installCmd.trim();
    if (cmd) tocSections.push("Installation");
    const usage = usageExample.trim();
    if (usage) tocSections.push("Quick Start");
    if (hasTests) tocSections.push("Running Tests");
    if (contributing) tocSections.push("Contributing");
    tocSections.push("License");
    tocSections.push("Contact");
    tocSections.forEach((s) => {
      const anchor = s.toLowerCase().replace(/\s+/g, "-");
      md += `- [${s}](#${anchor})\n`;
    });
    md += `\n---\n\n`;

    // Features
    if (featureLines.length > 0) {
      md += `## Features\n\n`;
      featureLines.forEach((f) => {
        md += `- [x] ${f}\n`;
      });
      md += `\n`;
    }

    // Tech Stack
    if (techs.length > 0) {
      md += `## Tech Stack\n\n`;
      techs.forEach((t) => {
        md += `- **${t}**\n`;
      });
      md += `\n`;
    }

    // Installation
    if (cmd) {
      md += `## Installation\n\n`;
      md += `Clone the repository and install dependencies:\n\n`;
      md += "```bash\n";
      md += `git clone https://github.com/your-username/${slug}.git\n`;
      md += `cd ${slug}\n`;
      md += `${cmd}\n`;
      md += "```\n\n";
    }

    // Quick Start / Usage
    if (usage) {
      md += `## Quick Start\n\n`;
      md += "```\n";
      md += `${usage}\n`;
      md += "```\n\n";
    }

    // Running Tests
    if (hasTests) {
      md += `## Running Tests\n\n`;
      md += `Run the test suite with:\n\n`;
      md += "```bash\nnpm test\n```\n\n";
    }

    // Contributing
    if (contributing) {
      md += `## Contributing\n\n`;
      md += `Contributions are welcome! Here's how to get started:\n\n`;
      md += `1. Fork the repository\n`;
      md += `2. Create your feature branch: \`git checkout -b feature/amazing-feature\`\n`;
      md += `3. Commit your changes: \`git commit -m 'Add amazing feature'\`\n`;
      md += `4. Push to the branch: \`git push origin feature/amazing-feature\`\n`;
      md += `5. Open a Pull Request\n\n`;
      md += `Please read the [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.\n\n`;
    }

    // License
    md += `## License\n\n`;
    md += `This project is licensed under the **${licenseFullName[license] || license}** License. See the [LICENSE](LICENSE) file for details.\n\n`;

    // Contact
    md += `---\n\n`;
    md += `## Contact\n\n`;
    md += `Created with care. If you have questions or suggestions, feel free to open an issue or reach out.\n\n`;
    md += `> Built with [${name}](https://github.com/your-username/${slug})\n`;

    return md;
  }

  const markdown = generateMarkdown();

  function handleCopy() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  function handleDownload() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "README.md";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-300 mb-6">
            Instant, private, 100% in your browser
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              README Generator
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4">
            Generate professional, polished GitHub README files in seconds.
            Fill in your project details and get a beautifully formatted
            Markdown file — no account needed, nothing leaves your browser.
          </p>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mb-8">
            Includes shields.io badges, table of contents, code blocks,
            contributing guidelines, and more.
          </p>
          <a
            href="#tool"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500 active:scale-[0.98]"
          >
            Start generating
            <span aria-hidden="true">&darr;</span>
          </a>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold mb-3 text-slate-200">
          How It Works
        </h2>
        <p className="text-center text-sm text-slate-500 mb-12 max-w-lg mx-auto">
          Three simple steps to a polished, professional README.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Describe your project",
              text: "Enter your project name, tech stack, features, and other details into the form fields.",
            },
            {
              step: "2",
              title: "Preview in real time",
              text: "Watch the live preview update instantly as you type. See exactly how your README will render on GitHub.",
            },
            {
              step: "3",
              title: "Export & ship",
              text: "Copy the raw Markdown to your clipboard or download a ready-to-use README.md file. Drop it into your repo.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-lg">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Main Tool ───── */}
      <section id="tool" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left panel — Form inputs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-100">
                Project Details
              </h2>
              <span className="text-xs text-slate-600">
                All fields optional
              </span>
            </div>

            {/* Project Name */}
            <div>
              <label className={labelClass}>Project Name</label>
              <input
                className={inputClass}
                placeholder="e.g. SuperApp"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className={inputClass + " min-h-[80px] resize-y"}
                placeholder="A brief description of what your project does and why it exists..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className={labelClass}>
                Tech Stack
                <span className="ml-1.5 text-xs text-slate-500 font-normal">
                  (comma-separated)
                </span>
              </label>
              <input
                className={inputClass}
                placeholder="e.g. React, TypeScript, Tailwind CSS, Node.js"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
              />
            </div>

            {/* Installation Command */}
            <div>
              <label className={labelClass}>Installation Command</label>
              <input
                className={inputClass + " font-mono text-xs"}
                placeholder="e.g. npm install"
                value={installCmd}
                onChange={(e) => setInstallCmd(e.target.value)}
              />
            </div>

            {/* Usage Example */}
            <div>
              <label className={labelClass}>Usage Example</label>
              <textarea
                className={
                  inputClass + " min-h-[80px] resize-y font-mono text-xs"
                }
                placeholder={"npm run dev\n# then open http://localhost:3000"}
                value={usageExample}
                onChange={(e) => setUsageExample(e.target.value)}
              />
            </div>

            {/* Features */}
            <div>
              <label className={labelClass}>
                Features
                <span className="ml-1.5 text-xs text-slate-500 font-normal">
                  (one per line)
                </span>
              </label>
              <textarea
                className={inputClass + " min-h-[90px] resize-y"}
                placeholder={
                  "Blazing fast performance\nDark mode support\nFully responsive design"
                }
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>

            {/* License */}
            <div>
              <label className={labelClass}>License</label>
              <select
                className={inputClass + " cursor-pointer"}
                value={license}
                onChange={(e) => setLicense(e.target.value)}
              >
                <option value="MIT">MIT</option>
                <option value="Apache">Apache 2.0</option>
                <option value="GPL">GPL 3.0</option>
                <option value="BSD">BSD 3-Clause</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
              <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer select-none">
                <span
                  role="checkbox"
                  aria-checked={contributing}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setContributing(!contributing);
                    }
                  }}
                  onClick={() => setContributing(!contributing)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                    contributing
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-600 bg-slate-800 hover:border-slate-500"
                  }`}
                >
                  {contributing && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                Contributing guidelines
              </label>

              <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer select-none">
                <span
                  role="checkbox"
                  aria-checked={hasTests}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setHasTests(!hasTests);
                    }
                  }}
                  onClick={() => setHasTests(!hasTests)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                    hasTests
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-600 bg-slate-800 hover:border-slate-500"
                  }`}
                >
                  {hasTests && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                Has tests
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCopy}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-500/15"
              >
                {copied ? "Copied!" : "Copy as Markdown"}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 active:scale-[0.98]"
              >
                Download .md
              </button>
            </div>
          </div>

          {/* Right panel — Live Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col min-h-[600px]">
            {/* macOS-style title bar */}
            <div className="flex items-center gap-2 border-b border-slate-800 px-6 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs font-medium text-slate-500 tracking-wide">
                README.md &mdash; Live Preview
              </span>
            </div>

            {/* Rendered markdown */}
            <div
              className="flex-1 overflow-auto p-6 md:p-8 prose-invert text-sm leading-relaxed"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              }}
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(markdown),
              }}
            />
          </div>
        </div>
      </section>

      {/* ───── Pricing ───── */}
      <section className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-100 mb-3">
            Simple pricing
          </h2>
          <p className="text-slate-400 text-sm mb-10">
            Unlock unlimited generation and premium templates.
          </p>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Pro
            </div>
            <div className="mb-5 flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold text-white">$7</span>
              <span className="text-slate-500 text-sm">/mo</span>
            </div>
            <ul className="mb-8 space-y-3 text-sm text-slate-300 text-left">
              {[
                "Unlimited README generation",
                "Custom badge presets",
                "Table-of-contents auto-generation",
                "Priority template updates",
                "Export to multiple formats",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-indigo-400 shrink-0">
                    &#10003;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-500/15">
              Get started
            </button>
            <p className="mt-3 text-xs text-slate-600">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2.5 font-semibold text-slate-300">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm shadow-indigo-500/20">
              A
            </span>
            AgentPill Lab
          </div>
          <p>README Generator &mdash; a tool by AgentPill Lab</p>
          <p>
            &copy; {new Date().getFullYear()} AgentPill Lab. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
