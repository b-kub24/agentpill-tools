"use client";

import { useEffect, useState } from "react";

type Status = "yes" | "no" | "partial";

type FeatureRow = {
  feature: string;
  statuses: [Status, Status, Status, Status];
  notes: string;
};

const STATUS_META: Record<Status, { icon: string; label: string }> = {
  yes: { icon: "✅", label: "Has it" },
  no: { icon: "❌", label: "Doesn't have it" },
  partial: { icon: "\u{1F536}", label: "Partial" },
};

const NEXT_STATUS: Record<Status, Status> = {
  no: "yes",
  yes: "partial",
  partial: "no",
};

const emptyRow = (): FeatureRow => ({
  feature: "",
  statuses: ["no", "no", "no", "no"],
  notes: "",
});

const PLACEHOLDERS = ["Your Product", "Competitor A", "Competitor B", "Competitor C"];

export default function Home() {
  const [products, setProducts] = useState<string[]>(["", "", "", ""]);
  const [rows, setRows] = useState<FeatureRow[]>(() =>
    Array.from({ length: 5 }, emptyRow)
  );
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const name = (i: number) => products[i].trim() || PLACEHOLDERS[i];
  const filledRows = rows.filter((r) => r.feature.trim() !== "");

  const setProduct = (i: number, v: string) =>
    setProducts((p) => p.map((x, idx) => (idx === i ? v : x)));

  const setFeature = (i: number, v: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, feature: v } : r)));

  const setNotes = (i: number, v: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, notes: v } : r)));

  const cycleStatus = (row: number, col: number) =>
    setRows((rs) =>
      rs.map((r, idx) => {
        if (idx !== row) return r;
        const next = [...r.statuses] as FeatureRow["statuses"];
        next[col] = NEXT_STATUS[next[col]];
        return { ...r, statuses: next };
      })
    );

  const addRow = () => setRows((rs) => [...rs, emptyRow()]);
  const removeRow = (i: number) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((_, idx) => idx !== i) : rs));

  const download = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportRows = () => (filledRows.length > 0 ? filledRows : rows);

  const copyMarkdown = async () => {
    const header = `| Feature | ${[0, 1, 2, 3].map(name).join(" | ")} | Notes |`;
    const divider = `|${Array(6).fill("---").join("|")}|`;
    const body = exportRows()
      .map(
        (r) =>
          `| ${r.feature.trim() || "—"} | ${r.statuses
            .map((s) => STATUS_META[s].icon)
            .join(" | ")} | ${r.notes.trim() || " "} |`
      )
      .join("\n");
    const md = `# Feature Comparison Matrix\n\n${header}\n${divider}\n${body}\n`;
    try {
      await navigator.clipboard.writeText(md);
      setToast("Markdown copied to clipboard!");
    } catch {
      setToast("Copy failed — your browser blocked clipboard access.");
    }
  };

  const exportHTML = () => {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const head = [0, 1, 2, 3].map((i) => `<th>${esc(name(i))}</th>`).join("");
    const body = exportRows()
      .map(
        (r, i) =>
          `<tr style="background:${i % 2 ? "#f8fafc" : "#ffffff"}"><td><strong>${esc(
            r.feature.trim() || "—"
          )}</strong></td>${r.statuses
            .map((s) => `<td style="text-align:center">${STATUS_META[s].icon}</td>`)
            .join("")}<td>${esc(r.notes)}</td></tr>`
      )
      .join("\n");
    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Feature Comparison Matrix</title>
<style>body{font-family:system-ui,sans-serif;padding:2rem;color:#0f172a}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #e2e8f0;padding:.6rem .8rem;text-align:left}
th{background:#4f46e5;color:#fff}caption{font-size:1.3rem;font-weight:700;margin-bottom:1rem;text-align:left}</style>
</head><body><table><caption>Feature Comparison Matrix</caption>
<thead><tr><th>Feature</th>${head}<th>Notes</th></tr></thead><tbody>
${body}
</tbody></table><p style="color:#64748b;font-size:.8rem">✅ Has it &nbsp; ❌ Doesn't have it &nbsp; \u{1F536} Partial — Made with Competitor Feature Matrix</p></body></html>`;
    download(html, "feature-matrix.html", "text/html");
    setToast("HTML file downloaded!");
  };

  const exportCSV = () => {
    const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const labels: Record<Status, string> = { yes: "Yes", no: "No", partial: "Partial" };
    const lines = [
      ["Feature", ...[0, 1, 2, 3].map(name), "Notes"].map(q).join(","),
      ...exportRows().map((r) =>
        [r.feature.trim() || "—", ...r.statuses.map((s) => labels[s]), r.notes]
          .map(q)
          .join(",")
      ),
    ];
    download(lines.join("\n"), "feature-matrix.csv", "text/csv");
    setToast("CSV file downloaded!");
  };

  const joinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!v || !v.includes("@")) {
      setToast("Please enter a valid email address.");
      return;
    }
    try {
      const key = "cm_waitlist";
      const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      if (!list.includes(v)) list.push(v);
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
    setEmail("");
    setToast("You're on the waitlist! We'll be in touch soon.");
  };

  const inputCls =
    "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-16 pt-24 text-center sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-6 inline-block rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-indigo-300">
            For PMs, sales teams &amp; founders
          </span>
          <h1 className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Competitor Feature Matrix
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Create professional feature comparison tables in seconds. Compare
            your product against competitors and share with your team. Perfect
            for product managers, sales teams, and founders.
          </p>
          <a
            href="#tool"
            className="mt-8 inline-block rounded-xl bg-emerald-500 px-8 py-3 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
          >
            Build your matrix — free
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              ["1", "Name the players", "Enter your product and up to three competitor names."],
              ["2", "Map the features", "Add features and mark which products have them — full, partial, or missing."],
              ["3", "Export & share", "Copy as Markdown or export HTML / CSV to share your comparison matrix."],
            ].map(([n, title, desc]) => (
              <div
                key={n}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-indigo-500/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
                  {n}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN TOOL */}
      <section id="tool" className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white">Build your matrix</h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Click a status cell to cycle: {STATUS_META.yes.icon} Has it →{" "}
            {STATUS_META.partial.icon} Partial → {STATUS_META.no.icon} Doesn&apos;t have it
          </p>

          {/* Product names */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLACEHOLDERS.map((ph, i) => (
              <div key={ph}>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                  {i === 0 ? "Your product" : `Competitor ${i}`}
                </label>
                <input
                  className={`${inputCls} ${i === 0 ? "border-indigo-500/60" : ""}`}
                  placeholder={ph}
                  value={products[i]}
                  onChange={(e) => setProduct(i, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Feature rows editor */}
          <div className="mt-8 space-y-3">
            <div className="hidden grid-cols-[1fr_repeat(4,3.5rem)_1fr_2rem] gap-2 px-1 text-xs font-medium uppercase tracking-wide text-slate-500 lg:grid">
              <span>Feature</span>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="truncate text-center" title={name(i)}>
                  {name(i)}
                </span>
              ))}
              <span>Notes</span>
              <span />
            </div>
            {rows.map((row, ri) => (
              <div
                key={ri}
                className="grid grid-cols-2 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3 lg:grid-cols-[1fr_repeat(4,3.5rem)_1fr_2rem] lg:rounded-lg lg:border-0 lg:bg-transparent lg:p-1"
              >
                <input
                  className={`${inputCls} col-span-2 lg:col-span-1`}
                  placeholder={`Feature ${ri + 1} (e.g. SSO login)`}
                  value={row.feature}
                  onChange={(e) => setFeature(ri, e.target.value)}
                />
                {row.statuses.map((s, ci) => (
                  <button
                    key={ci}
                    type="button"
                    onClick={() => cycleStatus(ri, ci)}
                    title={`${name(ci)}: ${STATUS_META[s].label} — click to change`}
                    aria-label={`${name(ci)}: ${STATUS_META[s].label}`}
                    className="rounded-lg border border-slate-700 bg-slate-900/70 py-2 text-lg transition hover:border-violet-500 hover:bg-slate-800"
                  >
                    {STATUS_META[s].icon}
                  </button>
                ))}
                <input
                  className={`${inputCls} col-span-2 lg:col-span-1`}
                  placeholder="Notes (optional)"
                  value={row.notes}
                  onChange={(e) => setNotes(ri, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeRow(ri)}
                  title="Remove row"
                  className="col-span-2 rounded-lg border border-slate-800 py-1 text-sm text-slate-500 transition hover:border-red-500/50 hover:text-red-400 lg:col-span-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addRow}
              className="rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
            >
              + Add Feature
            </button>
          </div>

          {/* Preview */}
          <h3 className="mt-12 text-xl font-semibold text-white">Live preview</h3>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl shadow-indigo-950/40">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                  <th className="px-4 py-3 font-semibold">Feature</th>
                  {[0, 1, 2, 3].map((i) => (
                    <th key={i} className="px-4 py-3 text-center font-semibold">
                      {name(i)}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {(filledRows.length > 0 ? filledRows : rows).map((r, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-slate-900/70" : "bg-slate-800/50"}
                  >
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {r.feature.trim() || (
                        <span className="italic text-slate-600">Feature {i + 1}</span>
                      )}
                    </td>
                    {r.statuses.map((s, ci) => (
                      <td key={ci} className="px-4 py-3 text-center text-base">
                        {STATUS_META[s].icon}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-slate-400">{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {STATUS_META.yes.icon} Has it · {STATUS_META.no.icon} Doesn&apos;t have it ·{" "}
            {STATUS_META.partial.icon} Partial
          </p>

          {/* Export buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyMarkdown}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              Copy as Markdown
            </button>
            <button
              type="button"
              onClick={exportHTML}
              className="rounded-xl border border-violet-500/60 bg-violet-500/10 px-5 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
            >
              Export as HTML
            </button>
            <button
              type="button"
              onClick={exportCSV}
              className="rounded-xl border border-indigo-500/60 bg-indigo-500/10 px-5 py-2.5 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
            >
              Export as CSV
            </button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-md rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center shadow-2xl shadow-indigo-950/50">
          <span className="rounded-full bg-violet-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
            Pro plan
          </span>
          <div className="mt-6 flex items-end justify-center gap-1">
            <span className="text-5xl font-extrabold text-white">$9</span>
            <span className="pb-1 text-slate-400">/month</span>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            <li>Unlimited comparison matrices</li>
            <li>Shareable hosted links for your team</li>
            <li>Custom branding on exports</li>
            <li>Saved competitor profiles</li>
          </ul>
          <form onSubmit={joinWaitlist} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              className={inputCls}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              Join waitlist
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-500">
            No spam — just a heads-up when Pro launches.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 px-4 py-8 text-center text-sm text-slate-600">
        © 2025 Competitor Feature Matrix. All rights reserved.
      </footer>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-indigo-500/50 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-100 shadow-2xl shadow-indigo-950/60">
          {toast}
        </div>
      )}
    </main>
  );
}
