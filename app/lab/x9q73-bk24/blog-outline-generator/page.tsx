"use client";

import { useState } from "react";

interface OutlineSection {
  level: "h2" | "h3";
  title: string;
  points: string[];
  wordCount: number;
}

interface GeneratedOutline {
  seoTitle: string;
  metaDescription: string;
  sections: OutlineSection[];
  totalWords: number;
  linkingSuggestions: string[];
}

function extractKeywords(topic: string): string[] {
  const stop = "a an the and or but in on at to for of with by from is are was were be been being have has had do does did will would could should may might shall can need how what why when where who which that this these those it its your my our their about into through during before after above below between under over up down out off then than so not no nor very just also more most much many some any each every all both few own same other new old big small great good best top ultimate complete guide tips ways things step";
  const stopWords = new Set(stop.split(" "));
  return topic.toLowerCase().replace(/[^a-z0-9\s-]/g, "").split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const titleCase = (s: string) => s.split(" ").map(capitalize).join(" ");
const pickRandom = <T,>(arr: T[], n: number): T[] =>
  [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

function generateOutline(
  topic: string,
  audience: string,
  tone: string,
  wordTarget: number,
  includes: Record<string, boolean>
): GeneratedOutline {
  const keywords = extractKeywords(topic);
  const kw = keywords.length > 0 ? keywords : ["topic"];
  const primary = kw[0];
  const secondary = kw.length > 1 ? kw[1] : primary;
  const tertiary = kw.length > 2 ? kw[2] : secondary;
  const topicClean = topic.trim() || "Your Topic";

  const audienceLabel = audience.trim() || "readers";

  const seoTitle = `${titleCase(topicClean)}${topicClean.length < 40 ? ": A Complete Guide" : ""}`.slice(0, 60);
  const metaDescription = `Learn everything about ${topicClean.toLowerCase()} in this comprehensive guide. Discover proven strategies, expert tips, and actionable insights for ${audienceLabel.toLowerCase()}.`.slice(0, 155);

  const toneAdj: Record<string, string[]> = {
    Professional: ["strategic", "data-driven", "evidence-based", "methodical", "results-oriented"],
    Casual: ["practical", "easy-to-follow", "hands-on", "real-world", "no-nonsense"],
    Academic: ["research-backed", "empirical", "systematic", "peer-reviewed", "theoretical"],
    Conversational: ["relatable", "straightforward", "down-to-earth", "friendly", "approachable"],
  };
  const adj = toneAdj[tone] || toneAdj.Professional;

  const coreH2Templates = [
    `What Is ${titleCase(primary)} and Why Does It Matter`,
    `The Current State of ${titleCase(primary)} in ${new Date().getFullYear()}`,
    `Key ${titleCase(secondary)} Strategies for ${titleCase(audienceLabel)}`,
    `How ${titleCase(primary)} Impacts ${titleCase(secondary)} Performance`,
    `${titleCase(adj[0])} Approaches to ${titleCase(primary)}`,
    `Common ${titleCase(primary)} Mistakes and How to Avoid Them`,
    `${titleCase(primary)} vs. Traditional ${titleCase(secondary)} Methods`,
    `Measuring ${titleCase(primary)} Success: Metrics That Matter`,
    `Building a ${titleCase(adj[1])} ${titleCase(primary)} Framework`,
    `Future Trends in ${titleCase(primary)} and ${titleCase(tertiary)}`,
    `Tools and Resources for ${titleCase(primary)} ${titleCase(audienceLabel)}`,
    `Expert ${titleCase(primary)} Tips from Industry Leaders`,
    `${titleCase(primary)} Case Studies and Real-World Examples`,
    `Step-by-Step ${titleCase(primary)} Implementation Plan`,
    `Overcoming ${titleCase(primary)} Challenges in ${titleCase(secondary)}`,
  ];

  const P = titleCase(primary), S = titleCase(secondary), A2 = titleCase(adj[2]);
  const h3Templates: string[][] = [
    [`Defining ${P} in Context`, `Core Components of ${P}`, `Historical Evolution of ${P}`],
    [`Setting ${A2} Goals for ${P}`, `Resource Allocation for ${S}`, `Prioritizing ${P} Initiatives`],
    [`Prerequisites and Setup for ${P}`, `Integration with Existing ${S} Workflows`, `Scaling ${P} Across Teams`],
    [`Benchmarking ${P} Against Industry Standards`, `Quantitative ${S} Assessment Methods`, `Interpreting ${P} Data Effectively`],
  ];

  const pointTemplates = [
    `Explore how ${primary} directly influences ${secondary} outcomes for ${audienceLabel}`,
    `Identify the ${adj[3]} factors that determine ${primary} effectiveness`,
    `Provide ${adj[0]} examples demonstrating ${primary} in practice`,
    `Outline the relationship between ${primary} and ${tertiary} optimization`,
    `Address common misconceptions about ${primary} among ${audienceLabel}`,
    `Compare ${adj[1]} and traditional approaches to ${primary}`,
    `Discuss the role of ${secondary} in supporting ${primary} goals`,
    `Highlight ${adj[2]} metrics used to evaluate ${primary} performance`,
    `Present actionable ${primary} recommendations backed by ${secondary} data`,
    `Examine how ${audienceLabel} can leverage ${primary} for ${tertiary} growth`,
    `Break down the cost-benefit analysis of ${primary} investments`,
    `Explain the technical requirements for implementing ${primary}`,
    `Share ${adj[4]} insights from real ${primary} deployments`,
    `Review the latest ${primary} tools and platforms for ${audienceLabel}`,
    `Map out a timeline for achieving ${primary} milestones in ${secondary}`,
  ];

  const sections: OutlineSection[] = [];
  const targetSections = Math.min(12, Math.max(8, Math.floor(wordTarget / 150)));
  const wordsPerSection = Math.floor(wordTarget / targetSections);
  let pointIndex = 0;

  if (includes.introduction) {
    sections.push({
      level: "h2",
      title: `Introduction: Why ${titleCase(primary)} Matters for ${titleCase(audienceLabel)}`,
      points: [
        `Hook the reader with a compelling ${primary} statistic or scenario relevant to ${audienceLabel}`,
        `Establish the scope and purpose of this ${adj[0]} guide`,
        `Preview the key ${primary} insights covered in each section`,
      ],
      wordCount: Math.floor(wordsPerSection * 0.8),
    });
  }

  const remainingSlots = targetSections - sections.length - (includes.faq ? 1 : 0) - (includes.conclusion ? 1 : 0) - (includes.cta ? 1 : 0) - (includes.takeaways ? 1 : 0);
  const selectedH2s = pickRandom(coreH2Templates, Math.min(remainingSlots, coreH2Templates.length));

  selectedH2s.forEach((h2Title, idx) => {
    const sectionPoints = [];
    for (let p = 0; p < 3; p++) {
      sectionPoints.push(pointTemplates[(pointIndex + p) % pointTemplates.length]);
    }
    pointIndex += 3;

    sections.push({
      level: "h2",
      title: h2Title,
      points: sectionPoints,
      wordCount: wordsPerSection + (idx % 3 === 0 ? 50 : -25),
    });

    if (idx < 3 && h3Templates[idx]) {
      const sub = pickRandom(h3Templates[idx], 1)[0];
      sections.push({
        level: "h3",
        title: sub,
        points: [
          pointTemplates[(pointIndex) % pointTemplates.length],
          pointTemplates[(pointIndex + 1) % pointTemplates.length],
        ],
        wordCount: Math.floor(wordsPerSection * 0.6),
      });
      pointIndex += 2;
    }
  });

  if (includes.takeaways) {
    sections.push({
      level: "h2",
      title: `Key Takeaways: ${titleCase(primary)} Essentials for ${titleCase(audienceLabel)}`,
      points: [
        `Summarize the top 5-7 ${adj[0]} ${primary} insights from the article`,
        `Highlight the most impactful ${secondary} strategies discussed`,
        `Provide a quick-reference checklist for ${audienceLabel}`,
      ],
      wordCount: Math.floor(wordsPerSection * 0.7),
    });
  }

  if (includes.faq) {
    sections.push({
      level: "h2",
      title: `Frequently Asked Questions About ${titleCase(primary)}`,
      points: [
        `What is the best way to get started with ${primary} as a ${audienceLabel.toLowerCase().replace(/s$/, "")}?`,
        `How long does it take to see results from ${primary} strategies?`,
        `What are the most common ${primary} pitfalls for ${audienceLabel}?`,
        `How does ${primary} compare to ${secondary} in terms of ROI?`,
      ],
      wordCount: Math.floor(wordsPerSection * 0.9),
    });
  }

  if (includes.conclusion) {
    sections.push({
      level: "h2",
      title: `Conclusion: Your Next Steps with ${titleCase(primary)}`,
      points: [
        `Reinforce the central ${primary} thesis with a ${adj[4]} summary`,
        `Provide a clear action plan for ${audienceLabel} to implement immediately`,
        `End with a forward-looking statement on the future of ${primary}`,
      ],
      wordCount: Math.floor(wordsPerSection * 0.6),
    });
  }

  if (includes.cta) {
    sections.push({
      level: "h2",
      title: `Ready to Transform Your ${titleCase(primary)} Strategy?`,
      points: [
        `Direct ${audienceLabel} to a relevant resource, tool, or next step`,
        `Include a compelling reason to take action on ${primary} today`,
      ],
      wordCount: Math.floor(wordsPerSection * 0.4),
    });
  }

  const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);

  const linkingSuggestions = [
    `Link "${titleCase(primary)} basics" to a foundational ${primary} guide or glossary page`,
    `Cross-reference "${titleCase(secondary)} strategies" with your ${secondary} resource hub`,
    `Add an internal link from the FAQ section to your ${primary} pricing or comparison page`,
    `Connect the case study section to related ${primary} success stories on your site`,
    `Link "${titleCase(primary)} tools" mentions to your recommended tools or reviews page`,
  ];

  return { seoTitle, metaDescription, sections, totalWords, linkingSuggestions };
}

function outlineToMarkdown(o: GeneratedOutline, topic: string): string {
  let md = `# ${o.seoTitle}\n\n> **Meta Description:** ${o.metaDescription}\n\n`;
  md += `**Topic:** ${topic}\n**Estimated Total Words:** ~${o.totalWords}\n\n---\n\n`;
  o.sections.forEach((s) => {
    md += `${s.level === "h2" ? "##" : "###"} ${s.title}\n*~${s.wordCount} words*\n\n`;
    s.points.forEach((p) => { md += `- ${p}\n`; });
    md += `\n`;
  });
  md += `---\n\n## Internal Linking Suggestions\n\n`;
  o.linkingSuggestions.forEach((l) => { md += `- ${l}\n`; });
  return md;
}

export default function BlogOutlineGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [wordCount, setWordCount] = useState("1500");
  const [includes, setIncludes] = useState({
    introduction: true,
    takeaways: true,
    faq: true,
    conclusion: true,
    cta: false,
  });
  const [outline, setOutline] = useState<GeneratedOutline | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleInclude = (key: string) => {
    setIncludes((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const result = generateOutline(topic, audience, tone, parseInt(wordCount), includes);
    setOutline(result);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!outline) return;
    const md = outlineToMarkdown(outline, topic);
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = () => {
    if (!outline) return;
    const md = outlineToMarkdown(outline, topic);
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "blog-outline"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const includeOptions = [
    { key: "introduction", label: "Introduction" },
    { key: "takeaways", label: "Key Takeaways" },
    { key: "faq", label: "FAQ Section" },
    { key: "conclusion", label: "Conclusion" },
    { key: "cta", label: "Call to Action" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            Instant, private, 100% in your browser
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Blog Outline Generator
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Generate structured, SEO-ready blog outlines in seconds. No API keys,
            no sign-ups — your data never leaves this page.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-2xl font-bold text-slate-100">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Enter Your Topic",
                desc: "Type your blog topic, target audience, and preferred tone. Select which sections to include.",
              },
              {
                step: "2",
                title: "Generate Outline",
                desc: "Our template engine parses your keywords and builds contextually relevant headings and talking points.",
              },
              {
                step: "3",
                title: "Export & Write",
                desc: "Copy the Markdown outline to your clipboard or download the .md file and start writing immediately.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-2xl font-bold text-slate-100">
            Build Your Outline
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-5">
            {/* Inputs */}
            <div className="space-y-5 lg:col-span-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Topic / Title
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Content Marketing Strategies for SaaS"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. B2B marketers, startup founders"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Casual">Casual</option>
                    <option value="Academic">Academic</option>
                    <option value="Conversational">Conversational</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">
                    Word Count
                  </label>
                  <select
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="500">500 words</option>
                    <option value="1000">1,000 words</option>
                    <option value="1500">1,500 words</option>
                    <option value="2000">2,000 words</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Include Sections
                </label>
                <div className="space-y-2">
                  {includeOptions.map((opt) => (
                    <label
                      key={opt.key}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={includes[opt.key as keyof typeof includes]}
                        onChange={() => toggleInclude(opt.key)}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Generate Outline
              </button>
            </div>

            {/* Output */}
            <div className="lg:col-span-3">
              {!outline ? (
                <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
                  <p className="text-sm text-slate-500">
                    Your generated outline will appear here
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  {/* SEO Meta */}
                  <div className="mb-6 space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        SEO Title
                      </span>
                      <span className="ml-2 text-xs text-slate-500">
                        ({outline.seoTitle.length}/60)
                      </span>
                      <p className="mt-1 text-sm text-slate-200">
                        {outline.seoTitle}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                        Meta Description
                      </span>
                      <span className="ml-2 text-xs text-slate-500">
                        ({outline.metaDescription.length}/155)
                      </span>
                      <p className="mt-1 text-sm text-slate-400">
                        {outline.metaDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>
                        Sections: {outline.sections.length}
                      </span>
                      <span>
                        Est. Words: ~{outline.totalWords}
                      </span>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="max-h-[500px] space-y-4 overflow-y-auto pr-2">
                    {outline.sections.map((section, i) => (
                      <div
                        key={i}
                        className={`rounded-xl border border-slate-800/60 p-4 ${
                          section.level === "h3"
                            ? "ml-5 bg-slate-950/30"
                            : "bg-slate-950/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                section.level === "h2"
                                  ? "bg-indigo-500/20 text-indigo-400"
                                  : "bg-violet-500/20 text-violet-400"
                              }`}
                            >
                              {section.level}
                            </span>
                            <h3 className="text-sm font-semibold text-slate-200">
                              {section.title}
                            </h3>
                          </div>
                          <span className="shrink-0 text-[10px] text-slate-600">
                            ~{section.wordCount}w
                          </span>
                        </div>
                        <ul className="mt-2.5 space-y-1.5">
                          {section.points.map((point, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-xs text-slate-400"
                            >
                              <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Linking Suggestions */}
                    <div className="rounded-xl border border-slate-800/60 bg-slate-950/50 p-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        Internal Linking Suggestions
                      </span>
                      <ul className="mt-2.5 space-y-1.5">
                        {outline.linkingSuggestions.map((link, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-400"
                          >
                            <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-indigo-500/50" />
                            {link}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Export Buttons */}
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={handleCopy}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                    >
                      {copied ? "Copied!" : "Copy as Markdown"}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20"
                    >
                      Download .md
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-100">
            Simple Pricing
          </h2>
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
              Pro Plan
            </p>
            <div className="mt-3 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold text-slate-100">$7</span>
              <span className="text-lg text-slate-500">/mo</span>
            </div>
            <ul className="mt-6 space-y-3 text-left text-sm text-slate-400">
              {[
                "Unlimited blog outlines",
                "SEO title & meta description generation",
                "H2/H3 heading structures with talking points",
                "Internal linking suggestions",
                "Export to Markdown",
                "100% client-side — your data stays private",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-lg font-bold text-transparent">BlogOutline</span>
              <span className="text-sm text-slate-500">Generator</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              {["Privacy", "Terms", "Contact"].map((link) => (
                <span key={link} className="cursor-pointer transition hover:text-slate-300">{link}</span>
              ))}
            </div>
            <p className="text-xs text-slate-600">All processing happens locally. No data is sent to any server.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
