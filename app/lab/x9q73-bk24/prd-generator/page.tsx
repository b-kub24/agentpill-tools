"use client";

import { useState } from "react";

interface FormData {
  productName: string;
  description: string;
  targetAudience: string;
  problem: string;
  features: string;
  techStack: string;
}

const initialForm: FormData = {
  productName: "",
  description: "",
  targetAudience: "",
  problem: "",
  features: "",
  techStack: "",
};

function generatePRD(form: FormData): string {
  const featureList = form.features
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  const audienceSegments = form.targetAudience
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const techItems = form.techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const today = new Date().toISOString().split("T")[0];

  const stories = featureList.slice(0, 8).map((feat, i) => {
    const persona = audienceSegments[i % audienceSegments.length] || "a user";
    const templates = [
      `As ${persona}, I want to ${feat.toLowerCase()} so that I can accomplish my goals more efficiently.`,
      `As ${persona}, I want ${feat.toLowerCase()} so that I can save time and reduce friction in my workflow.`,
      `As ${persona}, I want to leverage ${feat.toLowerCase()} so that I can make better-informed decisions.`,
      `As ${persona}, I want ${feat.toLowerCase()} available so that I can stay productive without interruptions.`,
      `As ${persona}, I want to use ${feat.toLowerCase()} so that I can collaborate effectively with my team.`,
      `As ${persona}, I want ${feat.toLowerCase()} so that I feel confident the product meets my needs.`,
      `As ${persona}, I want to access ${feat.toLowerCase()} so that I can track my progress over time.`,
      `As ${persona}, I want ${feat.toLowerCase()} so that I can customize my experience to fit my preferences.`,
    ];
    return templates[i % templates.length];
  });

  while (stories.length < 5) {
    stories.push(
      `As ${audienceSegments[0] || "a user"}, I want a seamless onboarding experience so that I can start using ${form.productName} within minutes.`
    );
  }

  const functionalReqs = featureList.map(
    (feat, i) =>
      `FR-${String(i + 1).padStart(3, "0")}: The system shall provide ${feat.toLowerCase()} with appropriate error handling, input validation, and user feedback.`
  );
  functionalReqs.push(
    `FR-${String(featureList.length + 1).padStart(3, "0")}: The system shall support user authentication and session management.`,
    `FR-${String(featureList.length + 2).padStart(3, "0")}: The system shall log all critical user actions for auditing and analytics purposes.`
  );

  const risks = [
    {
      risk: "Scope creep leading to delayed delivery",
      impact: "High",
      mitigation:
        "Strict change-request process; all additions require PM sign-off and backlog re-prioritization.",
    },
    {
      risk: "Key technical dependencies become unavailable or deprecated",
      impact: "Medium",
      mitigation:
        "Abstract third-party integrations behind service interfaces; maintain a vetted fallback for each critical dependency.",
    },
    {
      risk: "Low initial user adoption post-launch",
      impact: "High",
      mitigation:
        "Run a closed beta with target users before GA; iterate on onboarding based on activation funnel data.",
    },
    {
      risk: "Performance degradation under peak load",
      impact: "Medium",
      mitigation:
        "Load-test at 3x projected traffic during Phase 2; implement auto-scaling and circuit-breaker patterns.",
    },
    {
      risk: "Data privacy and compliance gaps",
      impact: "High",
      mitigation:
        "Engage security review in Phase 1; maintain a compliance checklist aligned with GDPR / SOC 2 requirements.",
    },
  ];

  return `# Product Requirements Document
## ${form.productName}

**Version:** 1.0
**Date:** ${today}
**Status:** Draft
**Author:** PRD Generator — AgentPill Lab

---

## 1. Executive Summary

${form.productName} is ${form.description}. This product targets ${form.targetAudience} and aims to solve the critical challenge of ${form.problem.toLowerCase()}. By delivering ${featureList.slice(0, 3).join(", ")}, and more, ${form.productName} will establish a differentiated position in the market while providing measurable value to its users from day one.

This document outlines the product vision, target users, functional and non-functional requirements, technical architecture, success metrics, timeline, and risk mitigations needed to bring ${form.productName} from concept to a successful launch.

---

## 2. Problem Statement

### Current State
${form.targetAudience} currently face significant friction when dealing with ${form.problem.toLowerCase()}. Existing solutions are either too complex, too expensive, or fail to address the core workflow needs of the target audience.

### Pain Points
- **Inefficiency:** Manual processes and fragmented tools force users to spend excessive time on tasks that should be streamlined.
- **Lack of Integration:** Current solutions do not connect seamlessly with the broader workflows of ${audienceSegments[0] || "users"}.
- **Poor User Experience:** Competitors prioritize feature count over usability, resulting in steep learning curves and low adoption.
- **Scalability Gaps:** As teams grow, existing tools fail to scale gracefully, leading to bottlenecks and data silos.

### Desired Outcome
A purpose-built solution that empowers ${form.targetAudience} to overcome ${form.problem.toLowerCase()} through an intuitive, integrated, and scalable platform.

---

## 3. Target Users & Personas

${audienceSegments
  .map(
    (segment, i) => `### Persona ${i + 1}: ${segment}
- **Role:** ${segment}
- **Goals:** Reduce time spent on ${form.problem.toLowerCase()}; gain actionable insights quickly; collaborate with team members effortlessly.
- **Frustrations:** Current tools are fragmented, slow, or require excessive manual effort.
- **Tech Comfort:** Moderate to high — expects modern, responsive interfaces with minimal onboarding friction.`
  )
  .join("\n\n")}

---

## 4. User Stories

${stories.map((story, i) => `${i + 1}. ${story}`).join("\n")}

---

## 5. Functional Requirements

${functionalReqs.map((req) => `- ${req}`).join("\n")}

---

## 6. Non-Functional Requirements

- **NFR-001 — Performance:** Page load time shall not exceed 2 seconds under normal load (p95). API responses shall complete within 500 ms.
- **NFR-002 — Scalability:** The architecture shall support a 10x increase in concurrent users without re-architecture.
- **NFR-003 — Availability:** The system shall target 99.9% uptime, measured monthly, excluding scheduled maintenance windows.
- **NFR-004 — Security:** All data in transit shall use TLS 1.3. Data at rest shall be encrypted with AES-256. Authentication shall support MFA.
- **NFR-005 — Accessibility:** The product shall conform to WCAG 2.1 AA standards across all user-facing interfaces.
- **NFR-006 — Compatibility:** The product shall support the latest two major versions of Chrome, Firefox, Safari, and Edge.
- **NFR-007 — Observability:** The system shall emit structured logs, metrics, and traces compatible with standard observability stacks.

---

## 7. Technical Architecture Overview

### Technology Stack
${techItems.length > 0 ? techItems.map((t) => `- ${t}`).join("\n") : "- To be determined based on team expertise and project constraints"}

### High-Level Architecture
\`\`\`
┌─────────────────────────────────────────────────┐
│                  Client Layer                   │
│         (Web App / Mobile / Desktop)            │
└──────────────────────┬──────────────────────────┘
                       │  HTTPS / WebSocket
┌──────────────────────▼──────────────────────────┐
│               API Gateway / BFF                 │
│          (Auth, Rate Limiting, Routing)          │
└──────────────────────┬──────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌───────────┐ ┌────────────────┐
│  Core Service│ │ Analytics │ │  Integration   │
│   (Business  │ │  Service  │ │   Service      │
│    Logic)    │ │           │ │  (3rd Party)   │
└──────┬───────┘ └─────┬─────┘ └───────┬────────┘
       │               │               │
┌──────▼───────────────▼───────────────▼────────┐
│              Data Layer                        │
│   (Primary DB, Cache, Object Storage, Queue)   │
└────────────────────────────────────────────────┘
\`\`\`

### Key Architectural Decisions
- **Modular service boundaries** to enable independent scaling and deployment of core, analytics, and integration layers.
- **Event-driven communication** between services via a message queue to ensure loose coupling and resilience.
- **Infrastructure-as-code** for all environments, enabling reproducible deployments and disaster recovery.

---

## 8. Success Metrics & KPIs

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| User Activation Rate | > 60% within first 7 days | Analytics funnel tracking |
| Weekly Active Users (WAU) | 1,000 within 3 months post-launch | Product analytics |
| Task Completion Rate | > 85% for core workflows | In-app event tracking |
| Net Promoter Score (NPS) | > 40 | Quarterly user survey |
| System Uptime | 99.9% | Infrastructure monitoring |
| Average Response Time | < 500 ms (p95) | APM tooling |
| Customer Support Tickets | < 5 per 100 active users/month | Support platform metrics |
| Feature Adoption Rate | > 50% of users try each core feature within 30 days | Product analytics |

---

## 9. Timeline & Milestones

### Phase 1 — Foundation (Weeks 1–6)
- Finalize architecture and technical design documents
- Set up CI/CD pipeline, infrastructure, and development environments
- Implement core authentication, authorization, and user management
- Build out ${featureList.slice(0, Math.ceil(featureList.length / 3)).join(", ") || "foundational features"}
- Establish automated testing framework (unit + integration)
- **Milestone:** Internal demo of core flows; architecture review sign-off

### Phase 2 — Build & Iterate (Weeks 7–14)
- Implement remaining features: ${featureList.slice(Math.ceil(featureList.length / 3)).join(", ") || "extended feature set"}
- Integrate analytics and observability stack
- Conduct load testing and performance optimization
- Run closed beta with 20–50 target users; collect structured feedback
- Iterate on UX based on beta insights
- **Milestone:** Beta feedback report; go/no-go decision for GA

### Phase 3 — Launch & Scale (Weeks 15–20)
- Harden security: penetration testing, dependency audit, compliance review
- Finalize documentation, onboarding guides, and support runbooks
- Execute marketing launch plan and coordinated communications
- Deploy to production; monitor dashboards and on-call rotation active
- Post-launch retrospective and roadmap refresh
- **Milestone:** General Availability (GA) release; first 30-day metrics review

---

## 10. Risks & Mitigations

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
${risks.map((r, i) => `| ${i + 1} | ${r.risk} | ${r.impact} | ${r.mitigation} |`).join("\n")}

---

*Generated by PRD Generator — AgentPill Lab*
*This document is a starting point. Review, customize, and validate all sections with your team before committing to execution.*
`;
}

export default function PRDGeneratorPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [prd, setPrd] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"preview" | "markdown">("preview");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const canGenerate =
    form.productName.trim() &&
    form.description.trim() &&
    form.targetAudience.trim() &&
    form.problem.trim() &&
    form.features.trim();

  const handleGenerate = () => {
    if (!canGenerate) return;
    const result = generatePRD(form);
    setPrd(result);
    setActiveTab("preview");
    setCopied(false);
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([prd], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.productName.replace(/\s+/g, "-").toLowerCase()}-prd.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) setWaitlistSubmitted(true);
  };

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const renderPreview = (md: string) => {
    return md.split("\n").map((line, i) => {
      if (line.startsWith("# "))
        return (
          <h1 key={i} className="text-3xl font-bold text-white mt-8 mb-3">
            {line.slice(2)}
          </h1>
        );
      if (line.startsWith("## "))
        return (
          <h2 key={i} className="text-2xl font-semibold text-indigo-300 mt-7 mb-2">
            {line.slice(3)}
          </h2>
        );
      if (line.startsWith("### "))
        return (
          <h3 key={i} className="text-lg font-semibold text-violet-300 mt-5 mb-1">
            {line.slice(4)}
          </h3>
        );
      if (line.startsWith("---"))
        return <hr key={i} className="border-slate-700 my-6" />;
      if (line.startsWith("- **"))
        return (
          <li key={i} className="ml-4 text-slate-300 mb-1 list-disc">
            <span
              dangerouslySetInnerHTML={{
                __html: line
                  .slice(2)
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
              }}
            />
          </li>
        );
      if (line.startsWith("- "))
        return (
          <li key={i} className="ml-4 text-slate-300 mb-1 list-disc">
            {line.slice(2)}
          </li>
        );
      if (line.startsWith("|")) {
        const cells = line
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim());
        if (cells.every((c) => /^[-:]+$/.test(c))) return null;
        const isHeader = i > 0 && md.split("\n")[i + 1]?.trim().startsWith("|---");
        return (
          <tr key={i} className={isHeader ? "bg-slate-800/60" : ""}>
            {cells.map((cell, j) =>
              isHeader ? (
                <th key={j} className="px-3 py-2 text-left text-sm font-semibold text-indigo-300 border-b border-slate-700">
                  {cell}
                </th>
              ) : (
                <td key={j} className="px-3 py-2 text-sm text-slate-300 border-b border-slate-800">
                  {cell}
                </td>
              )
            )}
          </tr>
        );
      }
      if (line.startsWith("```"))
        return (
          <div key={i} className="my-1 text-xs text-slate-500">
            {line.replace(/```/g, "")}
          </div>
        );
      if (/^\d+\.\s/.test(line))
        return (
          <li key={i} className="ml-4 text-slate-300 mb-1 list-decimal">
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
      if (line.startsWith("**") && line.endsWith("**"))
        return (
          <p key={i} className="text-white font-semibold mt-1">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      if (line.startsWith("*") && line.endsWith("*"))
        return (
          <p key={i} className="text-slate-400 italic text-sm mt-2">
            {line.replace(/\*/g, "")}
          </p>
        );
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return (
        <p key={i} className="text-slate-300 leading-relaxed">
          {line.replace(/\*\*(.*?)\*\*/g, "")}
          <span
            dangerouslySetInnerHTML={{
              __html: line.replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="text-white">$1</strong>'
              ),
            }}
          />
        </p>
      );
    });
  };

  const tableBlocks: number[][] = [];
  if (prd) {
    const lines = prd.split("\n");
    let start = -1;
    lines.forEach((line, i) => {
      if (line.startsWith("|") && start === -1) start = i;
      if (!line.startsWith("|") && start !== -1) {
        tableBlocks.push([start, i]);
        start = -1;
      }
    });
    if (start !== -1) tableBlocks.push([start, lines.length]);
  }

  const renderPreviewSmart = (md: string) => {
    const lines = md.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      const tableBlock = tableBlocks.find(([s]) => s === i);
      if (tableBlock) {
        const tableLines = lines.slice(tableBlock[0], tableBlock[1]);
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-4">
            <table className="w-full text-left border-collapse">
              <tbody>
                {tableLines.map((line, j) => {
                  const node = renderPreview(line)[0] as React.ReactNode;
                  return node;
                }).filter(Boolean)}
              </tbody>
            </table>
          </div>
        );
        i = tableBlock[1];
      } else {
        elements.push(...renderPreview(lines[i]));
        i++;
      }
    }
    return elements;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-violet-950/30" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            Instant, private, 100% in your browser
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              PRD Generator
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Turn a product idea into a comprehensive, stakeholder-ready Product Requirements
            Document in seconds. No API keys, no backend, no data ever leaves your machine.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-center text-3xl font-bold mb-14">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            How It Works
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Describe Your Product",
              desc: "Enter the product name, audience, problem, key features, and preferred tech stack.",
            },
            {
              step: "02",
              title: "Generate Instantly",
              desc: "Our template engine interpolates your inputs into a structured, 10-section PRD.",
            },
            {
              step: "03",
              title: "Export & Share",
              desc: "Copy the Markdown to your clipboard or download as a .md file, ready for Notion, Confluence, or GitHub.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-indigo-500/40 transition-colors"
            >
              <span className="text-4xl font-black text-indigo-500/30">{item.step}</span>
              <h3 className="text-xl font-semibold text-white mt-3 mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Tool */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Build Your PRD
          </span>
        </h2>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
          {[
            { label: "Product Name", field: "productName" as const, placeholder: "e.g. FlowBoard", type: "input" },
            { label: "One-line Description", field: "description" as const, placeholder: "e.g. a real-time collaborative kanban board for remote teams", type: "input" },
            { label: "Target Audience", field: "targetAudience" as const, placeholder: "e.g. product managers, engineering leads, startup founders", type: "input" },
            { label: "Problem It Solves", field: "problem" as const, placeholder: "e.g. remote teams lack a fast, visual way to coordinate sprint work", type: "textarea" },
            { label: "Key Features (comma-separated)", field: "features" as const, placeholder: "e.g. drag-and-drop boards, real-time sync, Slack integration, analytics dashboard", type: "textarea" },
            { label: "Tech Stack Preference", field: "techStack" as const, placeholder: "e.g. Next.js, PostgreSQL, Redis, Vercel", type: "input" },
          ].map(({ label, field, placeholder, type }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
              {type === "input" ? (
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                />
              ) : (
                <textarea
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  placeholder={placeholder}
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors resize-none"
                />
              )}
            </div>
          ))}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Generate PRD
          </button>
        </div>
      </section>

      {/* Results */}
      {prd && (
        <section id="results-section" className="max-w-4xl mx-auto px-6 py-12">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            {/* Tab Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
              <div className="flex gap-1">
                {(["preview", "markdown"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {tab === "preview" ? "Preview" : "Markdown"}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {copied ? "Copied!" : "Copy as Markdown"}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                >
                  Download .md
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {activeTab === "preview" ? (
                <div className="prose-invert">{renderPreviewSmart(prd)}</div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">
                  {prd}
                </pre>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Go Pro
          </span>
        </h2>
        <p className="text-center text-slate-400 mb-10">
          This free tool covers the essentials. The Pro tier adds AI-powered refinement,
          team collaboration, and version history.
        </p>
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-8 text-center">
          <div className="mb-6">
            <span className="text-5xl font-extrabold text-white">$12</span>
            <span className="text-slate-400 text-lg">/mo</span>
          </div>
          <ul className="text-slate-300 text-sm space-y-3 mb-8 max-w-xs mx-auto text-left">
            {[
              "AI-enhanced section refinement",
              "Team workspaces & shared PRDs",
              "Version history & diffing",
              "Export to PDF, Notion, Confluence",
              "Custom templates & branding",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {waitlistSubmitted ? (
            <p className="text-emerald-400 font-medium">
              You are on the list. We will be in touch soon.
            </p>
          ) : (
            <form onSubmit={handleWaitlist} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>AgentPill Lab &mdash; PRD Generator</span>
          <span>100% client-side. Your data never leaves this browser.</span>
          <span>&copy; {new Date().getFullYear()} AgentPill</span>
        </div>
      </footer>
    </div>
  );
}
