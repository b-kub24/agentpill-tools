import Link from "next/link";

const TOOLS = [
  { slug: "headline-analyzer", name: "Headline Analyzer", price: "$7/mo", desc: "Score headlines on emotional impact, power words, length, and clarity." },
  { slug: "tos-generator", name: "Terms of Service Generator", price: "$9/mo", desc: "Answer 8 questions, get a complete professional ToS." },
  { slug: "competitor-matrix", name: "Competitor Feature Matrix", price: "$9/mo", desc: "Build shareable feature comparison tables." },
  { slug: "welcome-email-sequence", name: "Welcome Email Sequence", price: "$12/mo", desc: "Generate a 5-email onboarding sequence." },
  { slug: "faq-page-builder", name: "FAQ Page Builder", price: "$7/mo", desc: "Generate 15-20 FAQs with HTML export + schema markup." },
  { slug: "brand-name-scorer", name: "Brand Name Scorer", price: "$7/mo", desc: "Score brand names across 6 dimensions, compare up to 5." },
  { slug: "persona-builder", name: "Customer Persona Builder", price: "$9/mo", desc: "Generate 3 detailed customer personas." },
  { slug: "pricing-page-generator", name: "Pricing Page Generator", price: "$9/mo", desc: "Build pricing pages, export HTML or React." },
  { slug: "bug-report-generator", name: "Bug Report Template Generator", price: "$7/mo", desc: "Templates for GitHub Issues, Jira, and Linear." },
  { slug: "api-docs-writer", name: "API Documentation Writer", price: "$12/mo", desc: "Generate professional API docs with examples." },
  { slug: "prd-generator", name: "PRD Generator", price: "$9/mo", desc: "Generate complete product requirement docs with user stories and priorities.", badge: "NEW" },
  { slug: "landing-page-roaster", name: "Landing Page Roaster", price: "$9/mo", desc: "Paste your landing page copy and get a brutally honest roast with fixes.", badge: "NEW" },
  { slug: "invoice-generator", name: "Invoice Generator", price: "$7/mo", desc: "Create professional invoices with live preview. Print or copy as HTML.", badge: "NEW" },
  { slug: "privacy-policy-generator", name: "Privacy Policy Generator", price: "$9/mo", desc: "Generate GDPR and CCPA compliant privacy policies in minutes.", badge: "NEW" },
  { slug: "startup-name-generator", name: "Startup Name Generator", price: "$7/mo", desc: "Generate 20+ creative startup names with taglines and availability.", badge: "NEW" },
  { slug: "subject-line-tester", name: "Subject Line Tester", price: "$7/mo", desc: "Compare up to 5 email subject lines. Scores, grades, and a winner.", badge: "NEW" },
  { slug: "blog-outline-generator", name: "Blog Outline Generator", price: "$7/mo", desc: "SEO-optimized blog outlines with titles, H2s, H3s, and meta descriptions.", badge: "NEW" },
  { slug: "color-palette-generator", name: "Color Palette Generator", price: "$7/mo", desc: "Generate harmonious color palettes using real color theory. Export as CSS.", badge: "NEW" },
  { slug: "readme-generator", name: "README Generator", price: "$7/mo", desc: "Professional README.md files with badges, TOC, and proper formatting.", badge: "NEW" },
  { slug: "resume-forge", name: "ResumeForge", price: "$12/mo", desc: "Build ATS-friendly resumes with live preview. 3 templates. Print to PDF.", badge: "NEW" },
];

export default function Lab() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
          PRIVATE LAB &mdash; internal testing only
        </span>
        <h1 className="mt-6 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
          AgentPill Lab &mdash; All Tools
        </h1>
        <p className="mt-3 text-slate-400">
          All 20 tools, fully functional. This page is noindexed, blocked in robots.txt, and linked from nowhere.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
            {TOOLS.length} tools live
          </span>
          <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-400">
            {TOOLS.filter((t) => "badge" in t).length} new this batch
          </span>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/lab/x9q73-bk24/${t.slug}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-indigo-500/50 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white group-hover:text-indigo-300">{t.name}</h2>
                  {"badge" in t && (
                    <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                      {(t as { badge: string }).badge}
                    </span>
                  )}
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">{t.price}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{t.desc}</p>
            </Link>
          ))}
        </div>
        <p className="mt-12 text-center text-xs text-slate-600">
          Bookmark this URL. Do not share. &copy; {new Date().getFullYear()} AgentPill.
        </p>
      </div>
    </main>
  );
}
