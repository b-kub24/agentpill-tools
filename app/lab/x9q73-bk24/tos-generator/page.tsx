"use client";

import { useState } from "react";

type Answers = {
  company: string;
  url: string;
  bizType: string;
  collectsData: boolean;
  paidServices: boolean;
  jurisdiction: string;
  accounts: boolean;
  email: string;
};

type Section = { title: string; body: string };

const BIZ_TYPES = ["SaaS", "E-commerce", "Marketplace", "Blog/Content", "Mobile App", "Other"];
const JURISDICTIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Ireland",
  "India",
  "Singapore",
  "Japan",
  "Brazil",
  "Other",
];

const DEFAULT_ANSWERS: Answers = {
  company: "",
  url: "",
  bizType: "SaaS",
  collectsData: true,
  paidServices: true,
  jurisdiction: "United States",
  accounts: true,
  email: "",
};

function buildSections(a: Answers): Section[] {
  const name = a.company.trim() || "the Company";
  const site = a.url.trim() || "our website";
  const email = a.email.trim() || "our legal contact address";
  const juris = a.jurisdiction === "Other" ? "the jurisdiction in which we are established" : a.jurisdiction;
  const service =
    a.bizType === "E-commerce" ? "online store and services" :
    a.bizType === "Marketplace" ? "marketplace platform and services" :
    a.bizType === "Blog/Content" ? "website, content, and services" :
    a.bizType === "Mobile App" ? "mobile application and services" :
    a.bizType === "SaaS" ? "software-as-a-service platform" : "products and services";

  const raw: (Section | null)[] = [
    {
      title: "Introduction & Acceptance of Terms",
      body: `Welcome to ${name}. These Terms of Service ("Terms") govern your access to and use of ${site} and the ${service} provided by ${name} (collectively, the "Service").\n\nBy accessing or using the Service, you agree to be bound by these Terms and our related policies. If you do not agree to these Terms, you must not access or use the Service. If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms, in which case "you" refers to that organization.\n\nYou must be at least 18 years of age, or the age of legal majority in your jurisdiction, to use the Service. By using the Service, you represent that you meet this requirement.`,
    },
    a.accounts
      ? {
          title: "User Accounts",
          body: `To access certain features of the Service, you must create an account. When you register, you agree to provide accurate, current, and complete information, and to keep this information up to date at all times.\n\nYou are responsible for safeguarding your account credentials and for all activity that occurs under your account, whether or not authorized by you. You must notify us immediately at ${email} if you suspect any unauthorized access to or use of your account.\n\nWe reserve the right to suspend or terminate accounts that contain false or misleading information, are used in violation of these Terms, or have been inactive for an extended period. You may not transfer, sell, or assign your account to any other person or entity without our prior written consent.`,
        }
      : null,
    a.paidServices
      ? {
          title: "Payment Terms",
          body: `Certain features of the Service are offered on a paid basis. By purchasing a paid plan or service, you agree to pay all applicable fees as described at the time of purchase, together with any applicable taxes.\n\nUnless otherwise stated, subscription fees are billed in advance on a recurring basis (e.g., monthly or annually) and automatically renew at the end of each billing period unless cancelled before the renewal date. You may cancel your subscription at any time through your account settings or by contacting us at ${email}; cancellation takes effect at the end of the current billing period.\n\nExcept where required by law, all fees are non-refundable. We reserve the right to change our pricing with reasonable advance notice; price changes will apply from your next billing cycle. Failure to pay fees when due may result in suspension or termination of your access to paid features. All payments are processed by third-party payment processors, and your use of those processors is subject to their own terms and privacy policies.`,
        }
      : null,
    {
      title: "Intellectual Property Rights",
      body: `The Service, including all software, design, text, graphics, logos, trademarks, and other content provided by ${name} (excluding content submitted by users), is owned by ${name} or its licensors and is protected by copyright, trademark, and other intellectual property laws.\n\nSubject to your compliance with these Terms, ${name} grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for its intended purpose. This license does not permit you to copy, modify, distribute, sell, lease, reverse engineer, or create derivative works of any part of the Service, except as expressly permitted by law or with our prior written consent.\n\nAll trademarks, service marks, and trade names displayed on the Service are the property of ${name} or their respective owners. Nothing in these Terms grants you any right to use them without prior written permission. If you provide us with feedback or suggestions, you grant us a perpetual, irrevocable, royalty-free license to use that feedback for any purpose without obligation to you.`,
    },
    {
      title: "User Content & Conduct",
      body: `You retain ownership of any content you submit, post, or display on or through the Service ("User Content"). By submitting User Content, you grant ${name} a worldwide, non-exclusive, royalty-free license to host, store, reproduce, and display that content solely as necessary to operate, provide, and improve the Service.\n\nYou are solely responsible for your User Content and your conduct on the Service. You agree not to: (a) violate any applicable law or regulation; (b) infringe the intellectual property, privacy, or other rights of any third party; (c) upload or transmit viruses, malware, or other harmful code; (d) attempt to gain unauthorized access to the Service, other accounts, or related systems; (e) use the Service to send spam or unsolicited communications; (f) harass, abuse, defame, or harm other users; or (g) interfere with or disrupt the integrity or performance of the Service.\n\nWe reserve the right, but have no obligation, to review, moderate, or remove any User Content that we believe violates these Terms, and to suspend or terminate the accounts of repeat offenders.`,
    },
    a.collectsData
      ? {
          title: "Privacy & Data Collection",
          body: `We collect and process certain personal data in connection with your use of the Service, such as account information, contact details, usage data, and technical information about your device and connection. Our collection and use of personal data is described in our Privacy Policy, which forms an integral part of these Terms.\n\nBy using the Service, you consent to the collection, processing, and storage of your data as described in the Privacy Policy. We implement reasonable technical and organizational measures designed to protect your personal data against unauthorized access, loss, or misuse; however, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.\n\nDepending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict the processing of your data. To exercise these rights or ask questions about our data practices, contact us at ${email}.`,
        }
      : null,
    {
      title: "Limitation of Liability",
      body: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.\n\nTO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL ${name.toUpperCase()}, ITS DIRECTORS, EMPLOYEES, PARTNERS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF (OR INABILITY TO USE) THE SERVICE.\n\nOUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS (USD $100). SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR LIMITATION OF LIABILITY, SO SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.`,
    },
    {
      title: "Termination",
      body: `We may suspend or terminate your access to the Service at any time, with or without cause and with or without notice, including if we reasonably believe you have violated these Terms. You may stop using the Service and terminate your relationship with us at any time${a.accounts ? " by closing your account" : ""}.\n\nUpon termination, your right to use the Service will immediately cease. Provisions of these Terms that by their nature should survive termination shall survive, including intellectual property provisions, disclaimers, limitations of liability, and governing law.\n\n${a.paidServices ? "Termination does not relieve you of the obligation to pay any fees accrued before the effective date of termination. Unless otherwise required by law, fees already paid are non-refundable upon termination." : "We shall not be liable to you or any third party for any termination of your access to the Service."}`,
    },
    {
      title: "Governing Law",
      body: `These Terms and any dispute or claim arising out of or in connection with them or the Service shall be governed by and construed in accordance with the laws of ${juris}, without regard to its conflict of law principles.\n\nAny disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in ${juris}, and you consent to the personal jurisdiction of such courts. Before initiating any formal proceedings, you agree to first attempt to resolve any dispute informally by contacting us at ${email}; the parties shall use good-faith efforts to resolve the dispute within thirty (30) days.\n\nNothing in this section limits any mandatory consumer protection rights you may have under the laws of your country of residence.`,
    },
    {
      title: "Changes to Terms",
      body: `We may modify these Terms from time to time to reflect changes in our Service, business practices, or legal requirements. When we make material changes, we will provide reasonable notice, such as by posting the updated Terms on ${site}, updating the "Last updated" date, or notifying you by email${a.accounts ? " or through the Service" : ""}.\n\nYour continued use of the Service after the updated Terms take effect constitutes your acceptance of the changes. If you do not agree to the modified Terms, you must stop using the Service. We encourage you to review these Terms periodically.`,
    },
    {
      title: "Contact Information",
      body: `If you have any questions, concerns, or feedback regarding these Terms or the Service, please contact us:\n\n${name}\nWebsite: ${site}\nLegal inquiries: ${email}\n\nWe will make reasonable efforts to respond to legitimate inquiries in a timely manner.`,
    },
  ];

  return (raw.filter(Boolean) as Section[]).map((s, i) => ({
    title: `${i + 1}. ${s.title}`,
    body: s.body,
  }));
}

function tosPlainText(a: Answers, sections: Section[]): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const head = `TERMS OF SERVICE\n${a.company.trim() || "Company"} — ${a.url.trim() || "Website"}\nLast updated: ${date}\n\n`;
  return head + sections.map((s) => `${s.title.toUpperCase()}\n\n${s.body}`).join("\n\n\n");
}

function tosHtml(a: Answers, sections: Section[]): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const body = sections
    .map((s) => `<h2>${esc(s.title)}</h2>\n${s.body.split("\n\n").map((p) => `<p>${esc(p)}</p>`).join("\n")}`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Terms of Service — ${esc(a.company.trim() || "Company")}</title>
<style>
body{font-family:Georgia,'Times New Roman',serif;max-width:800px;margin:0 auto;padding:48px 24px;color:#1e293b;line-height:1.7}
h1{font-size:2rem;margin-bottom:.25rem}h2{font-size:1.25rem;margin-top:2.5rem;color:#312e81}
.meta{color:#64748b;font-size:.95rem;margin-bottom:2rem}p{margin:.75rem 0}
</style>
</head>
<body>
<h1>Terms of Service</h1>
<p class="meta">${esc(a.company.trim() || "Company")} — ${esc(a.url.trim() || "Website")}<br/>Last updated: ${esc(date)}</p>
${body}
</body>
</html>`;
}

const QUESTIONS = [
  { key: "company", label: "What is your business or company name?", type: "text", placeholder: "e.g. Acme Inc." },
  { key: "url", label: "What is your website URL?", type: "text", placeholder: "e.g. https://acme.com" },
  { key: "bizType", label: "What type of business do you run?", type: "select", options: BIZ_TYPES },
  { key: "collectsData", label: "Do you collect user data?", type: "toggle" },
  { key: "paidServices", label: "Do you offer paid services?", type: "toggle" },
  { key: "jurisdiction", label: "What is your country / legal jurisdiction?", type: "select", options: JURISDICTIONS },
  { key: "accounts", label: "Do users create accounts on your platform?", type: "toggle" },
  { key: "email", label: "Contact email for legal inquiries?", type: "text", placeholder: "e.g. legal@acme.com" },
] as const;

export default function Home() {
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [step, setStep] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [toast, setToast] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3000);
  };

  const q = QUESTIONS[step];
  const sections = generated ? buildSections(answers) : [];

  const set = (key: keyof Answers, value: string | boolean) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else {
      setGenerated(true);
      showToast("Your Terms of Service has been generated");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tosPlainText(answers, sections));
      showToast("Copied to clipboard");
    } catch {
      showToast("Copy failed — please select and copy manually");
    }
  };

  const exportHtml = () => {
    const blob = new Blob([tosHtml(answers, sections)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "terms-of-service.html";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("HTML file downloaded");
  };

  const joinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.includes("@")) {
      showToast("Please enter a valid email address");
      return;
    }
    const saved = JSON.parse(localStorage.getItem("tos-waitlist") || "[]");
    localStorage.setItem("tos-waitlist", JSON.stringify([...saved, { email: waitlistEmail, at: Date.now() }]));
    setWaitlistEmail("");
    showToast("You're on the waitlist! We'll be in touch.");
  };

  const toggleBtn = (key: keyof Answers, value: boolean, label: string) => (
    <button
      type="button"
      onClick={() => set(key, value)}
      className={`flex-1 rounded-xl border px-6 py-4 text-lg font-semibold transition ${
        answers[key] === value
          ? "border-indigo-400 bg-indigo-500/20 text-indigo-200 shadow-lg shadow-indigo-500/20"
          : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-500/40 bg-slate-900 px-5 py-3 text-sm font-medium text-emerald-300 shadow-2xl shadow-emerald-500/10">
          {toast}
        </div>
      )}

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-6 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
            Legal docs without the lawyer fees
          </span>
          <h1 className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Terms of Service Generator
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Generate professional, comprehensive Terms of Service in minutes. Answer 8 simple
            questions about your business and get a complete, ready-to-use ToS document. Perfect
            for startups, SaaS companies, and online businesses.
          </p>
          <a
            href="#tool"
            className="mt-10 inline-block rounded-xl bg-emerald-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
          >
            Generate My Terms — Free
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-white">How It Works</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { n: "1", t: "Answer 8 questions", d: "Tell us about your business — name, website, business type, and how you operate." },
            { n: "2", t: "Review your ToS", d: "Instantly get a complete, professionally structured Terms of Service tailored to your answers." },
            { n: "3", t: "Export & publish", d: "Export as a styled HTML file or copy the full document to your clipboard." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{s.t}</h3>
              <p className="mt-2 leading-relaxed text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN TOOL */}
      <section id="tool" className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-indigo-500/20 bg-slate-900/60 p-6 shadow-2xl shadow-indigo-500/5 sm:p-10">
          {!generated ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>
                    Question {step + 1} of {QUESTIONS.length}
                  </span>
                  <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                    style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white sm:text-3xl">{q.label}</h3>

              <div className="mt-8">
                {q.type === "text" && (
                  <input
                    type={q.key === "email" ? "email" : "text"}
                    value={answers[q.key] as string}
                    onChange={(e) => set(q.key, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && next()}
                    placeholder={"placeholder" in q ? q.placeholder : ""}
                    autoFocus
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-lg text-white placeholder-slate-600 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                  />
                )}
                {q.type === "select" && (
                  <select
                    value={answers[q.key] as string}
                    onChange={(e) => set(q.key, e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-lg text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                  >
                    {("options" in q ? q.options : []).map((o: string) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                )}
                {q.type === "toggle" && (
                  <div className="flex gap-4">
                    {toggleBtn(q.key, true, "Yes")}
                    {toggleBtn(q.key, false, "No")}
                  </div>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="rounded-xl bg-emerald-500 px-8 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                >
                  {step === QUESTIONS.length - 1 ? "Generate My ToS" : "Next"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-white">Your Terms of Service</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    type="button"
                    onClick={exportHtml}
                    className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-400"
                  >
                    Export as HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGenerated(false);
                      setStep(0);
                    }}
                    className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-400"
                  >
                    Edit Answers
                  </button>
                </div>
              </div>
              <div className="max-h-[32rem] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8">
                <h4 className="text-2xl font-bold text-white">Terms of Service</h4>
                <p className="mt-1 text-sm text-slate-500">
                  {answers.company || "Company"} — {answers.url || "Website"} · Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                {sections.map((s) => (
                  <div key={s.title} className="mt-8">
                    <h5 className="text-lg font-semibold text-indigo-300">{s.title}</h5>
                    {s.body.split("\n\n").map((p, i) => (
                      <p key={i} className="mt-3 leading-relaxed text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-600">
                This generated document is a template and does not constitute legal advice. Consider
                having it reviewed by a qualified attorney in your jurisdiction.
              </p>
            </>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-white">Simple Pricing</h2>
        <div className="mt-10 rounded-3xl border border-violet-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center shadow-2xl shadow-violet-500/10 sm:p-12">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-300">
            Pro Plan — Coming Soon
          </span>
          <div className="mt-6 flex items-end justify-center gap-1">
            <span className="text-6xl font-extrabold text-white">$9</span>
            <span className="pb-2 text-lg text-slate-400">/month</span>
          </div>
          <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left text-slate-300">
            {[
              "Unlimited ToS generations",
              "Privacy Policy & Cookie Policy generators",
              "Auto-updates when laws change",
              "White-label HTML exports",
              "Priority support",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-1 text-emerald-400">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <form onSubmit={joinWaitlist} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3.5 text-white placeholder-slate-600 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-7 py-3.5 font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 px-6 py-10 text-center text-sm text-slate-600">
        <p>© 2025 Terms of Service Generator. All rights reserved.</p>
        <p className="mt-2">Not a law firm. Generated documents are templates, not legal advice.</p>
      </footer>
    </main>
  );
}
