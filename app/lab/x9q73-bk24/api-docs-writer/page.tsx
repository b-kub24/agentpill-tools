"use client";

import { useState } from "react";

type ApiInfo = { name: string; baseUrl: string; version: string; auth: string };
type Endpoint = { method: string; path: string; description: string; params: string; response: string };
type ErrCode = { code: string; description: string };

const AUTH_TYPES = ["API Key", "Bearer Token", "OAuth 2.0", "Basic Auth", "None"];
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const FENCE = "```";

const DEFAULT_ERRORS: ErrCode[] = [
  { code: "400", description: "Bad Request — the request was malformed or contained invalid parameters." },
  { code: "401", description: "Unauthorized — authentication failed or credentials were missing." },
  { code: "403", description: "Forbidden — you do not have permission to access this resource." },
  { code: "404", description: "Not Found — the requested resource does not exist." },
  { code: "422", description: "Unprocessable Entity — the request was well-formed but failed validation." },
  { code: "429", description: "Too Many Requests — rate limit exceeded. Slow down and retry later." },
  { code: "500", description: "Internal Server Error — something went wrong on our end. Try again later." },
];

const BLANK_ENDPOINT: Endpoint = { method: "GET", path: "", description: "", params: "", response: "" };

const STEPS = [
  { title: "Add your API endpoints", body: "Define each endpoint with its HTTP method, path, description, request parameters, and an example response." },
  { title: "Configure auth & error codes", body: "Pick your authentication scheme and fine-tune the pre-filled HTTP error code reference to match your API." },
  { title: "Export Markdown or HTML", body: "Get complete, professional documentation with curl and JavaScript examples — copy or download a styled HTML file." },
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtJson(s: string) {
  if (!s.trim()) return "";
  try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s.trim(); }
}

function parseParams(text: string) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const m = l.match(/^([\w.\[\]-]+)\s*:\s*([^(\-]+?)\s*(?:\((required|optional)\))?\s*(?:-\s*(.*))?$/i);
    if (m) return { name: m[1], type: m[2].trim(), required: (m[3] || "optional").toLowerCase(), desc: m[4] || "" };
    return { name: l, type: "string", required: "optional", desc: "" };
  });
}

function authHeader(auth: string) {
  if (auth === "API Key") return { curl: "-H \"X-API-Key: YOUR_API_KEY\"", js: "\"X-API-Key\": \"YOUR_API_KEY\"" };
  if (auth === "Bearer Token" || auth === "OAuth 2.0")
    return { curl: "-H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"", js: "\"Authorization\": \"Bearer YOUR_ACCESS_TOKEN\"" };
  if (auth === "Basic Auth") return { curl: "-u \"username:password\"", js: "\"Authorization\": \"Basic \" + btoa(\"username:password\")" };
  return null;
}

function authBlock(auth: string, base: string) {
  const h = authHeader(auth);
  const intros: Record<string, string> = {
    "API Key": "All requests must include your API key in the X-API-Key header. Generate and revoke keys from your dashboard. Keep keys secret and never ship them in client-side code.",
    "Bearer Token": "All requests must include a bearer token in the Authorization header. Tokens are issued at sign-in and expire after 24 hours; refresh them via the token endpoint.",
    "OAuth 2.0": "This API uses OAuth 2.0 with the client credentials flow. Exchange your client ID and secret for an access token, then send it as a bearer token on every request.",
    "Basic Auth": "This API uses HTTP Basic Authentication. Send your username and password base64-encoded in the Authorization header on every request.",
    None: "This API is public and requires no authentication. Rate limits still apply per IP address.",
  };
  let curl = "";
  let js = "";
  if (auth === "OAuth 2.0") {
    curl = `# 1. Exchange credentials for an access token\ncurl -X POST "${base}/oauth/token" \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"\n\n# 2. Call the API with the token\ncurl "${base}/resource" \\\n  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`;
    js = `// 1. Exchange credentials for an access token\nconst tokenRes = await fetch("${base}/oauth/token", {\n  method: "POST",\n  headers: { "Content-Type": "application/x-www-form-urlencoded" },\n  body: new URLSearchParams({\n    grant_type: "client_credentials",\n    client_id: "YOUR_CLIENT_ID",\n    client_secret: "YOUR_CLIENT_SECRET",\n  }),\n});\nconst { access_token } = await tokenRes.json();\n\n// 2. Call the API with the token\nconst res = await fetch("${base}/resource", {\n  headers: { Authorization: \`Bearer \${access_token}\` },\n});`;
  } else if (h) {
    curl = `curl "${base}/resource" \\\n  ${h.curl}`;
    js = `const res = await fetch("${base}/resource", {\n  headers: { ${h.js} },\n});\nconst data = await res.json();`;
  }
  return { intro: intros[auth] || intros.None, curl, js };
}

function exampleRequests(ep: Endpoint, base: string, auth: string) {
  const path = ep.path ? (ep.path.startsWith("/") ? ep.path : "/" + ep.path) : "/";
  const url = base + path.replace(/:(\w+)/g, "123");
  const h = authHeader(auth);
  const hasBody = ["POST", "PUT", "PATCH"].includes(ep.method);
  const curlParts = [`curl -X ${ep.method} "${url}"`];
  if (h) curlParts.push(`  ${h.curl}`);
  if (hasBody) curlParts.push(`  -H "Content-Type: application/json"`, `  -d '{"example": "value"}'`);
  const headers = [h ? `    ${h.js}` : "", hasBody ? `    "Content-Type": "application/json"` : ""].filter(Boolean).join(",\n");
  const js = [
    `const res = await fetch("${url}", {`,
    `  method: "${ep.method}",`,
    headers ? `  headers: {\n${headers}\n  },` : "",
    hasBody ? `  body: JSON.stringify({ example: "value" }),` : "",
    `});`,
    `const data = await res.json();`,
  ].filter(Boolean).join("\n");
  return { curl: curlParts.join(" \\\n"), js };
}

function buildMarkdown(api: ApiInfo, endpoints: Endpoint[], errors: ErrCode[]) {
  const base = (api.baseUrl || "https://api.example.com/v1").replace(/\/+$/, "");
  const a = authBlock(api.auth, base);
  const L: string[] = [
    `# ${api.name || "My API"} — API Documentation`, "",
    `**Version:** ${api.version || "1.0.0"}  `,
    `**Base URL:** \`${base}\`  `,
    `**Authentication:** ${api.auth}`, "", "---", "",
    "## Authentication", "", a.intro, "",
  ];
  if (a.curl) L.push("**cURL**", "", FENCE + "bash", a.curl, FENCE, "", "**JavaScript**", "", FENCE + "javascript", a.js, FENCE, "");
  L.push("---", "", "## Endpoints", "");
  endpoints.forEach((ep) => {
    const { curl, js } = exampleRequests(ep, base, api.auth);
    const params = parseParams(ep.params);
    L.push(`### ${ep.method} \`${ep.path || "/"}\``, "", ep.description || "No description provided.", "", "**Parameters**", "");
    if (params.length) {
      L.push("| Name | Type | Required | Description |", "| --- | --- | --- | --- |");
      params.forEach((p) => L.push(`| \`${p.name}\` | ${p.type} | ${p.required === "required" ? "Yes" : "No"} | ${p.desc} |`));
    } else L.push("_This endpoint takes no parameters._");
    L.push(
      "", "**Example request — cURL**", "", FENCE + "bash", curl, FENCE,
      "", "**Example request — JavaScript**", "", FENCE + "javascript", js, FENCE,
      "", "**Example response**", "", FENCE + "json", fmtJson(ep.response) || "{}", FENCE, ""
    );
  });
  L.push("---", "", "## Error Codes", "", "| Status | Description |", "| --- | --- |");
  errors.forEach((e) => L.push(`| ${e.code} | ${e.description} |`));
  L.push(
    "", "---", "", "## Rate Limiting", "",
    "Requests are limited to **100 requests per minute** per credential. Current usage is reported via the `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` response headers. If you exceed the limit, the API responds with `429 Too Many Requests` — implement exponential backoff and retry after the window resets.", ""
  );
  return L.join("\n");
}

const HTML_STYLE = `:root{color-scheme:dark}*{box-sizing:border-box}
body{margin:0;background:#020617;color:#e2e8f0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6}
main{max-width:860px;margin:0 auto;padding:48px 24px}
h1{font-size:2.2rem;margin:0 0 8px;background:linear-gradient(90deg,#818cf8,#a78bfa);-webkit-background-clip:text;background-clip:text;color:transparent}
h2{margin-top:40px;border-bottom:1px solid #1e293b;padding-bottom:8px;color:#c7d2fe}
h3{margin:24px 0 8px;display:flex;align-items:center;gap:10px}
h4{margin:20px 0 8px;color:#94a3b8;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em}
.meta{color:#94a3b8}.muted{color:#64748b;font-style:italic}
code{background:#0f172a;border:1px solid #1e293b;border-radius:6px;padding:2px 6px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.9em;color:#a5b4fc}
pre{background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:16px;overflow-x:auto}
pre code{background:none;border:none;padding:0;color:#e2e8f0;font-size:.85rem}
.path{font-size:1.05rem}
table{width:100%;border-collapse:collapse;margin:12px 0}
th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #1e293b;font-size:.9rem}
th{color:#94a3b8;text-transform:uppercase;font-size:.72rem;letter-spacing:.06em}
.badge{display:inline-block;padding:3px 10px;border-radius:6px;font-size:.75rem;font-weight:700;letter-spacing:.05em}
.get{background:#064e3b;color:#6ee7b7}.post{background:#312e81;color:#a5b4fc}.put{background:#78350f;color:#fcd34d}.patch{background:#4c1d95;color:#c4b5fd}.delete{background:#7f1d1d;color:#fca5a5}
.endpoint{border:1px solid #1e293b;border-radius:14px;padding:8px 24px 24px;margin:20px 0;background:#0b1120}
footer{margin-top:48px;padding-top:16px;border-top:1px solid #1e293b;color:#64748b;font-size:.85rem;text-align:center}`;

function buildHtml(api: ApiInfo, endpoints: Endpoint[], errors: ErrCode[]) {
  const base = (api.baseUrl || "https://api.example.com/v1").replace(/\/+$/, "");
  const name = api.name || "My API";
  const a = authBlock(api.auth, base);
  const code = (c: string) => `<pre><code>${esc(c)}</code></pre>`;
  const eps = endpoints.map((ep) => {
    const { curl, js } = exampleRequests(ep, base, api.auth);
    const params = parseParams(ep.params);
    const rows = params
      .map((p) => `<tr><td><code>${esc(p.name)}</code></td><td>${esc(p.type)}</td><td>${p.required === "required" ? "Yes" : "No"}</td><td>${esc(p.desc)}</td></tr>`)
      .join("");
    const table = params.length
      ? `<table><thead><tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>`
      : `<p class="muted">This endpoint takes no parameters.</p>`;
    return `<section class="endpoint">
  <h3><span class="badge ${ep.method.toLowerCase()}">${ep.method}</span> <code class="path">${esc(ep.path || "/")}</code></h3>
  <p>${esc(ep.description || "No description provided.")}</p>
  <h4>Parameters</h4>
  ${table}
  <h4>Example request — cURL</h4>
  ${code(curl)}
  <h4>Example request — JavaScript</h4>
  ${code(js)}
  <h4>Example response</h4>
  ${code(fmtJson(ep.response) || "{}")}
</section>`;
  }).join("\n");
  const errRows = errors.map((e) => `<tr><td><code>${esc(e.code)}</code></td><td>${esc(e.description)}</td></tr>`).join("");
  const authCode = a.curl ? `<h4>cURL</h4>${code(a.curl)}<h4>JavaScript</h4>${code(a.js)}` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(name)} — API Documentation</title>
<style>${HTML_STYLE}</style>
</head>
<body>
<main>
  <header>
    <h1>${esc(name)}</h1>
    <p class="meta"><strong>Version:</strong> ${esc(api.version || "1.0.0")} &nbsp;&bull;&nbsp; <strong>Base URL:</strong> <code>${esc(base)}</code> &nbsp;&bull;&nbsp; <strong>Auth:</strong> ${esc(api.auth)}</p>
  </header>
  <section>
    <h2>Authentication</h2>
    <p>${esc(a.intro)}</p>
    ${authCode}
  </section>
  <h2>Endpoints</h2>
  ${eps}
  <section>
    <h2>Error Codes</h2>
    <table><thead><tr><th>Status</th><th>Description</th></tr></thead><tbody>${errRows}</tbody></table>
  </section>
  <section>
    <h2>Rate Limiting</h2>
    <p>Requests are limited to <strong>100 requests per minute</strong> per credential. Check the <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, and <code>X-RateLimit-Reset</code> headers on every response. When you exceed the limit the API returns <code>429 Too Many Requests</code> — use exponential backoff before retrying.</p>
  </section>
  <footer>Generated with API Documentation Writer</footer>
</main>
</body>
</html>`;
}

const inputCls =
  "w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";
const btnCls =
  "rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-white";

export default function Home() {
  const [api, setApi] = useState<ApiInfo>({ name: "", baseUrl: "", version: "", auth: "API Key" });
  const [endpoints, setEndpoints] = useState<Endpoint[]>([{ ...BLANK_ENDPOINT }]);
  const [errors, setErrors] = useState<ErrCode[]>(DEFAULT_ERRORS.map((e) => ({ ...e })));
  const [docs, setDocs] = useState<{ md: string; html: string } | null>(null);
  const [tab, setTab] = useState<"preview" | "markdown" | "html">("preview");
  const [copied, setCopied] = useState("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const setEp = (i: number, patch: Partial<Endpoint>) => setEndpoints((eps) => eps.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  const setErr = (i: number, patch: Partial<ErrCode>) => setErrors((es) => es.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  const removeEp = (i: number) => setEndpoints((eps) => eps.filter((_, j) => j !== i));

  const generate = () => {
    setDocs({ md: buildMarkdown(api, endpoints, errors), html: buildHtml(api, endpoints, errors) });
    setTab("preview");
    setTimeout(() => document.getElementById("output")?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  const copy = async (text: string, which: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(which); setTimeout(() => setCopied(""), 1800); } catch {}
  };

  const download = () => {
    if (!docs) return;
    const blob = new Blob([docs.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (api.name || "api").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-docs.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-indigo-400">{"</>"}</span> API Documentation Writer
        </span>
        <a href="#pricing" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
          Join waitlist
        </a>
      </nav>

      <section className="mx-auto max-w-4xl px-6 pb-20 pt-14 text-center sm:pt-24">
        <p className="mb-4 inline-block rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-xs font-medium text-indigo-300">
          For developers, startups, and API-first companies
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          API Documentation{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Writer</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Generate professional API documentation in minutes. Define your endpoints, parameters, and responses — get
          clean, structured docs with code examples, error codes, and authentication guides. Perfect for developers,
          startups, and API-first companies.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#tool" className="rounded-xl bg-emerald-500 px-7 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
            Generate docs now — free
          </a>
          <a href="#how" className="rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-white">
            How it works
          </a>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">{i + 1}</div>
              <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tool" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10">
          <h2 className="text-3xl font-bold text-white">Build your documentation</h2>
          <p className="mt-2 text-sm text-slate-400">Everything runs locally in your browser — nothing is uploaded anywhere.</p>

          <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-indigo-400">Section A — API info</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelCls}>API name</label>
              <input className={inputCls} placeholder="Acme API" value={api.name} onChange={(e) => setApi({ ...api, name: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Base URL</label>
              <input className={inputCls} placeholder="https://api.example.com/v1" value={api.baseUrl} onChange={(e) => setApi({ ...api, baseUrl: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>API version</label>
              <input className={inputCls} placeholder="1.0.0" value={api.version} onChange={(e) => setApi({ ...api, version: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Auth type</label>
              <select className={inputCls} value={api.auth} onChange={(e) => setApi({ ...api, auth: e.target.value })}>
                {AUTH_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="mt-10 text-sm font-bold uppercase tracking-widest text-indigo-400">Section B — Endpoints</h3>
          {endpoints.map((ep, i) => (
            <div key={i} className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Endpoint {i + 1}</span>
                {endpoints.length > 1 && (
                  <button onClick={() => removeEp(i)} className="text-xs text-slate-500 transition hover:text-red-400">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className={labelCls}>HTTP method</label>
                  <select className={inputCls} value={ep.method} onChange={(e) => setEp(i, { method: e.target.value })}>
                    {METHODS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Path</label>
                  <input className={inputCls} placeholder="/users/:id" value={ep.path} onChange={(e) => setEp(i, { path: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Description</label>
                  <input className={inputCls} placeholder="Retrieve a single user by ID" value={ep.description} onChange={(e) => setEp(i, { description: e.target.value })} />
                </div>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <label className={labelCls}>Request parameters (one per line)</label>
                  <textarea rows={4} className={inputCls + " font-mono"} placeholder={"name: string (required) - Full name of the user\nage: number (optional) - Age in years"} value={ep.params} onChange={(e) => setEp(i, { params: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Example response (JSON)</label>
                  <textarea rows={4} className={inputCls + " font-mono"} placeholder={"{ \"id\": 123, \"name\": \"Ada Lovelace\" }"} value={ep.response} onChange={(e) => setEp(i, { response: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setEndpoints([...endpoints, { ...BLANK_ENDPOINT }])} className="mt-4 rounded-xl border border-dashed border-indigo-500/50 px-5 py-2.5 text-sm font-semibold text-indigo-300 transition hover:border-indigo-400 hover:bg-indigo-500/10">
            + Add Endpoint
          </button>

          <h3 className="mt-10 text-sm font-bold uppercase tracking-widest text-indigo-400">Section C — Error codes</h3>
          <p className="mt-2 text-xs text-slate-500">Pre-populated with common HTTP errors — edit the codes or descriptions to match your API.</p>
          <div className="mt-4 space-y-2">
            {errors.map((er, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-24 flex-none">
                  <input className={inputCls + " text-center font-mono"} value={er.code} onChange={(e) => setErr(i, { code: e.target.value })} />
                </div>
                <input className={inputCls} value={er.description} onChange={(e) => setErr(i, { description: e.target.value })} />
              </div>
            ))}
          </div>

          <button onClick={generate} className="mt-10 w-full rounded-xl bg-emerald-500 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 sm:w-auto sm:px-12">
            Generate documentation
          </button>
        </div>
      </section>

      {docs && (
        <section id="output" className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
                {(["preview", "markdown", "html"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${tab === t ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => copy(docs.md, "md")} className={btnCls}>
                  {copied === "md" ? "Copied!" : "Copy Markdown"}
                </button>
                <button onClick={() => copy(docs.html, "html")} className={btnCls}>
                  {copied === "html" ? "Copied!" : "Copy HTML"}
                </button>
                <button onClick={download} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                  Download as HTML
                </button>
              </div>
            </div>
            <div className="mt-6">
              {tab === "preview" ? (
                <iframe title="Documentation preview" srcDoc={docs.html} className="h-[640px] w-full rounded-2xl border border-slate-800 bg-slate-950" />
              ) : (
                <pre className="max-h-[640px] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-950 p-6 font-mono text-xs leading-relaxed text-slate-300">
                  {tab === "markdown" ? docs.md : docs.html}
                </pre>
              )}
            </div>
          </div>
        </section>
      )}

      <section id="pricing" className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="text-center text-3xl font-bold text-white">Simple pricing</h2>
        <div className="mt-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-violet-500/5 p-8 text-center sm:p-12">
          <p className="text-5xl font-extrabold text-white">
            $12<span className="text-lg font-medium text-slate-400">/month</span>
          </p>
          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-slate-300">
            {["Unlimited APIs and endpoints", "Markdown + HTML export", "Auth guides with curl and JavaScript examples", "Error code and rate limit references", "Hosted docs and custom domains (coming soon)"].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-400">✓</span>
                {f}
              </li>
            ))}
          </ul>
          {joined ? (
            <p className="mt-8 font-semibold text-emerald-400">You are on the list! We will be in touch soon.</p>
          ) : (
            <form
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setJoined(true);
              }}
            >
              <input type="email" required placeholder="you@company.com" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 sm:flex-none">
                Join waitlist
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-slate-500">Early access opening soon. No spam, ever.</p>
        </div>
      </section>

      <footer className="border-t border-slate-800/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row">
          <span>
            <span className="text-indigo-400">{"</>"}</span> API Documentation Writer © {new Date().getFullYear()}
          </span>
          <div className="flex gap-6">
            <a href="#how" className="transition hover:text-slate-300">How it works</a>
            <a href="#tool" className="transition hover:text-slate-300">Generator</a>
            <a href="#pricing" className="transition hover:text-slate-300">Pricing</a>
          </div>
          <span>All generation happens locally in your browser.</span>
        </div>
      </footer>
    </main>
  );
}
