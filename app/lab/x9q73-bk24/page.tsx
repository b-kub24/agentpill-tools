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
];

export default function Lab() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
          PRIVATE LAB — internal testing only
        </span>
        <h1 className="mt-6 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
          Micro Products — Batch 2
        </h1>
        <p className="mt-3 text-slate-400">
          All 10 tools, fully functional. This page is noindexed, blocked in robots.txt, and linked from nowhere.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/lab/x9q73-bk24/${t.slug}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-indigo-500/50 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white group-hover:text-indigo-300">{t.name}</h2>
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
