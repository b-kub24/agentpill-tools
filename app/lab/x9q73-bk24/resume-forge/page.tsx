"use client";

import { useState, useRef, useCallback } from "react";

interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  present: boolean;
  bullets: string;
}

interface Education {
  degree: string;
  school: string;
  year: string;
  gpa: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

type Template = "classic" | "modern" | "minimal";
type Section = "personal" | "summary" | "experience" | "education" | "skills" | "certs" | "template";

const SECTION_LABELS: Record<Section, string> = {
  personal: "Personal Info",
  summary: "Summary / Objective",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  certs: "Certifications",
  template: "Template Style",
};

export default function ResumeForge() {
  const [openSection, setOpenSection] = useState<Section>("personal");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [summary, setSummary] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [template, setTemplate] = useState<Template>("modern");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [toast, setToast] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  const toggle = (s: Section) => setOpenSection(openSection === s ? s : s);

  const addExperience = () =>
    setExperiences([...experiences, { title: "", company: "", startDate: "", endDate: "", present: false, bullets: "" }]);
  const removeExperience = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const updateExp = (i: number, field: keyof Experience, value: string | boolean) =>
    setExperiences(experiences.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));

  const addEducation = () => setEducations([...educations, { degree: "", school: "", year: "", gpa: "" }]);
  const removeEducation = (i: number) => setEducations(educations.filter((_, idx) => idx !== i));
  const updateEdu = (i: number, field: keyof Education, value: string) =>
    setEducations(educations.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));

  const addCert = () => setCertifications([...certifications, { name: "", issuer: "", year: "" }]);
  const removeCert = (i: number) => setCertifications(certifications.filter((_, idx) => idx !== i));
  const updateCert = (i: number, field: keyof Certification, value: string) =>
    setCertifications(certifications.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const joinWaitlist = () => {
    if (!waitlistEmail) return;
    const existing = JSON.parse(localStorage.getItem("resumeForgeWaitlist") || "[]");
    if (!existing.includes(waitlistEmail)) {
      existing.push(waitlistEmail);
      localStorage.setItem("resumeForgeWaitlist", JSON.stringify(existing));
    }
    showToast("You're on the waitlist! We'll be in touch soon.");
    setWaitlistEmail("");
  };

  const copyHTML = () => {
    if (!previewRef.current) return;
    navigator.clipboard.writeText(previewRef.current.innerHTML);
    showToast("Resume HTML copied to clipboard!");
  };

  const printResume = () => window.print();

  const inputClass =
    "w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

  const sectionBtn = (s: Section) => (
    <button
      key={s}
      onClick={() => toggle(s)}
      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
        openSection === s ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-slate-800/60 text-slate-300 border border-slate-700 hover:bg-slate-700/60"
      }`}
    >
      {SECTION_LABELS[s]}
    </button>
  );

  /* ---------- template-specific preview styles ---------- */
  const previewStyles: Record<Template, Record<string, React.CSSProperties>> = {
    classic: {
      wrapper: { fontFamily: "Georgia, 'Times New Roman', serif", padding: 40, lineHeight: 1.5 },
      name: { fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 2 },
      contact: { textAlign: "center", fontSize: 11, color: "#555", marginBottom: 16 },
      heading: { fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, borderBottom: "2px solid #222", paddingBottom: 3, marginTop: 18, marginBottom: 8 },
      jobTitle: { fontWeight: 700, fontSize: 13 },
      company: { fontStyle: "italic", fontSize: 12, color: "#444" },
      bullet: { marginLeft: 18, fontSize: 12 },
      skillTag: { display: "inline-block", fontSize: 11, marginRight: 8, marginBottom: 4 },
    },
    modern: {
      wrapper: { fontFamily: "'Segoe UI', Arial, sans-serif", padding: 40, lineHeight: 1.55 },
      name: { fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 2 },
      contact: { fontSize: 11, color: "#64748b", marginBottom: 16 },
      heading: { fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#6366f1", borderLeft: "3px solid #6366f1", paddingLeft: 10, marginTop: 20, marginBottom: 8 },
      jobTitle: { fontWeight: 700, fontSize: 13, color: "#1e293b" },
      company: { fontSize: 12, color: "#6366f1" },
      bullet: { marginLeft: 18, fontSize: 12, color: "#334155" },
      skillTag: { display: "inline-block", background: "#e0e7ff", color: "#4338ca", borderRadius: 4, padding: "2px 8px", fontSize: 11, marginRight: 6, marginBottom: 4 },
    },
    minimal: {
      wrapper: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: 48, lineHeight: 1.7 },
      name: { fontSize: 24, fontWeight: 300, letterSpacing: 2, marginBottom: 2 },
      contact: { fontSize: 11, color: "#999", marginBottom: 24 },
      heading: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: "#aaa", marginTop: 24, marginBottom: 10 },
      jobTitle: { fontWeight: 600, fontSize: 13 },
      company: { fontSize: 12, color: "#888" },
      bullet: { marginLeft: 16, fontSize: 12, color: "#555" },
      skillTag: { display: "inline-block", fontSize: 11, marginRight: 10, color: "#555", marginBottom: 4 },
    },
  };

  const ts = previewStyles[template];

  const resumePreview = (
    <div style={{ ...ts.wrapper, color: "#1a1a1a" }}>
      <div style={ts.name}>{name || "Your Name"}</div>
      <div style={ts.contact}>
        {[email, phone, location, linkedin, portfolio].filter(Boolean).join("  |  ") || "email@example.com | (555) 123-4567 | City, ST"}
      </div>
      {summary && (
        <>
          <div style={ts.heading}>Summary</div>
          <p style={{ fontSize: 12 }}>{summary}</p>
        </>
      )}
      {experiences.length > 0 && (
        <>
          <div style={ts.heading}>Experience</div>
          {experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={ts.jobTitle}>{exp.title || "Job Title"}</span>
                <span style={{ fontSize: 11, color: "#888" }}>
                  {exp.startDate || "Start"} &ndash; {exp.present ? "Present" : exp.endDate || "End"}
                </span>
              </div>
              <div style={ts.company}>{exp.company || "Company Name"}</div>
              {exp.bullets &&
                exp.bullets
                  .split("\n")
                  .filter(Boolean)
                  .map((b, j) => (
                    <div key={j} style={ts.bullet}>
                      &bull; {b}
                    </div>
                  ))}
            </div>
          ))}
        </>
      )}
      {educations.length > 0 && (
        <>
          <div style={ts.heading}>Education</div>
          {educations.map((edu, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{edu.degree || "Degree"}</span>
              <span style={{ fontSize: 12, color: "#666" }}> &mdash; {edu.school || "School"}{edu.year ? `, ${edu.year}` : ""}{edu.gpa ? ` (GPA: ${edu.gpa})` : ""}</span>
            </div>
          ))}
        </>
      )}
      {skills.length > 0 && (
        <>
          <div style={ts.heading}>Skills</div>
          <div>{skills.map((s, i) => <span key={i} style={ts.skillTag}>{s}</span>)}</div>
        </>
      )}
      {certifications.length > 0 && (
        <>
          <div style={ts.heading}>Certifications</div>
          {certifications.map((c, i) => (
            <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{c.name || "Certification"}</span>
              {c.issuer && <span style={{ color: "#666" }}> &mdash; {c.issuer}</span>}
              {c.year && <span style={{ color: "#999" }}> ({c.year})</span>}
            </div>
          ))}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-900/40 animate-pulse">
          {toast}
        </div>
      )}

      {/* Print-only view */}
      <div id="resume-print" className="hidden print:block">
        <div ref={previewRef} style={{ background: "#fff" }}>
          {resumePreview}
        </div>
      </div>

      <div className="print:hidden">
        {/* ───── Hero ───── */}
        <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
          <div className="mx-auto max-w-3xl">
            <span className="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              AI-Powered Resume Builder
            </span>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                ResumeForge
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
              Build ATS-friendly, professionally formatted resumes in minutes. Choose a template, fill in your details, and export a polished PDF ready to land interviews.
            </p>
            <a href="#tool" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
              Start Building &darr;
            </a>
          </div>
        </section>

        {/* ───── How It Works ───── */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="mb-10 text-center text-2xl font-bold text-white">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Enter Your Details", desc: "Fill in your work history, education, skills, and certifications using our guided form." },
              { step: "2", title: "Pick a Template", desc: "Choose Classic, Modern, or Minimal styling. See your resume update live as you type." },
              { step: "3", title: "Export & Apply", desc: "Copy the HTML or print directly to PDF. Your resume is ready to submit in seconds." },
            ].map((c) => (
              <div key={c.step} className="rounded-xl border border-slate-700 bg-slate-800/60 p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">
                  {c.step}
                </div>
                <h3 className="mb-1 text-base font-semibold text-white">{c.title}</h3>
                <p className="text-sm text-slate-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ───── Tool Section ───── */}
        <section id="tool" className="mx-auto max-w-7xl px-6 pb-24">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Build Your Resume</h2>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left — Form */}
            <div className="space-y-3">
              {/* Section nav */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(Object.keys(SECTION_LABELS) as Section[]).map((s) => sectionBtn(s))}
              </div>

              {/* Personal Info */}
              {openSection === "personal" && (
                <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-800/60 p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className={inputClass} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input className={inputClass} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className={inputClass} placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <input className={inputClass} placeholder="City, State" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <input className={inputClass} placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                    <input className={inputClass} placeholder="Portfolio URL" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Summary */}
              {openSection === "summary" && (
                <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
                  <textarea rows={4} className={inputClass} placeholder="Write a brief professional summary or objective..." value={summary} onChange={(e) => setSummary(e.target.value)} />
                </div>
              )}

              {/* Experience */}
              {openSection === "experience" && (
                <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800/60 p-5">
                  {experiences.map((exp, i) => (
                    <div key={i} className="space-y-2 rounded-lg border border-slate-600 bg-slate-900/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Experience {i + 1}</span>
                        <button onClick={() => removeExperience(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input className={inputClass} placeholder="Job Title" value={exp.title} onChange={(e) => updateExp(i, "title", e.target.value)} />
                        <input className={inputClass} placeholder="Company" value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} />
                        <input className={inputClass} placeholder="Start Date" value={exp.startDate} onChange={(e) => updateExp(i, "startDate", e.target.value)} />
                        <div className="flex items-center gap-2">
                          <input className={`${inputClass} ${exp.present ? "opacity-50" : ""}`} placeholder="End Date" value={exp.endDate} disabled={exp.present} onChange={(e) => updateExp(i, "endDate", e.target.value)} />
                          <label className="flex items-center gap-1 whitespace-nowrap text-xs text-slate-400">
                            <input type="checkbox" checked={exp.present} onChange={(e) => updateExp(i, "present", e.target.checked)} className="accent-emerald-500" /> Present
                          </label>
                        </div>
                      </div>
                      <textarea rows={3} className={inputClass} placeholder="Bullet points (one per line)" value={exp.bullets} onChange={(e) => updateExp(i, "bullets", e.target.value)} />
                    </div>
                  ))}
                  <button onClick={addExperience} className="w-full rounded-lg border border-dashed border-emerald-500/40 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10">
                    + Add Experience
                  </button>
                </div>
              )}

              {/* Education */}
              {openSection === "education" && (
                <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800/60 p-5">
                  {educations.map((edu, i) => (
                    <div key={i} className="space-y-2 rounded-lg border border-slate-600 bg-slate-900/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Education {i + 1}</span>
                        <button onClick={() => removeEducation(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input className={inputClass} placeholder="Degree" value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} />
                        <input className={inputClass} placeholder="School" value={edu.school} onChange={(e) => updateEdu(i, "school", e.target.value)} />
                        <input className={inputClass} placeholder="Graduation Year" value={edu.year} onChange={(e) => updateEdu(i, "year", e.target.value)} />
                        <input className={inputClass} placeholder="GPA (optional)" value={edu.gpa} onChange={(e) => updateEdu(i, "gpa", e.target.value)} />
                      </div>
                    </div>
                  ))}
                  <button onClick={addEducation} className="w-full rounded-lg border border-dashed border-emerald-500/40 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10">
                    + Add Education
                  </button>
                </div>
              )}

              {/* Skills */}
              {openSection === "skills" && (
                <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
                  <div className="flex gap-2">
                    <input className={inputClass} placeholder="Type a skill and press Enter" value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    />
                    <button onClick={addSkill} className="shrink-0 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-500">Add</button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
                        {s}
                        <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className="ml-0.5 text-indigo-400 hover:text-white">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {openSection === "certs" && (
                <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800/60 p-5">
                  {certifications.map((c, i) => (
                    <div key={i} className="space-y-2 rounded-lg border border-slate-600 bg-slate-900/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Certification {i + 1}</span>
                        <button onClick={() => removeCert(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <input className={inputClass} placeholder="Name" value={c.name} onChange={(e) => updateCert(i, "name", e.target.value)} />
                        <input className={inputClass} placeholder="Issuer" value={c.issuer} onChange={(e) => updateCert(i, "issuer", e.target.value)} />
                        <input className={inputClass} placeholder="Year" value={c.year} onChange={(e) => updateCert(i, "year", e.target.value)} />
                      </div>
                    </div>
                  ))}
                  <button onClick={addCert} className="w-full rounded-lg border border-dashed border-emerald-500/40 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10">
                    + Add Certification
                  </button>
                </div>
              )}

              {/* Template Selector */}
              {openSection === "template" && (
                <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {([
                      { id: "classic" as Template, label: "Classic", desc: "Traditional serif layout with horizontal rules" },
                      { id: "modern" as Template, label: "Modern", desc: "Clean sans-serif with colored accent bars" },
                      { id: "minimal" as Template, label: "Minimal", desc: "Ultra-clean with generous whitespace" },
                    ]).map((t) => (
                      <button key={t.id} onClick={() => setTemplate(t.id)}
                        className={`rounded-lg border p-4 text-left transition ${
                          template === t.id ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500" : "border-slate-600 bg-slate-900/50 hover:border-slate-500"
                        }`}
                      >
                        {/* Mini preview */}
                        <div className="mb-3 h-20 w-full rounded bg-white p-2">
                          <div style={{ fontFamily: t.id === "classic" ? "Georgia, serif" : "Arial, sans-serif", fontSize: 7, lineHeight: 1.4 }}>
                            <div style={{ fontWeight: 700, fontSize: 9, textAlign: t.id === "classic" ? "center" : "left", borderBottom: t.id === "classic" ? "1px solid #ccc" : "none", borderLeft: t.id === "modern" ? "2px solid #6366f1" : "none", paddingLeft: t.id === "modern" ? 4 : 0, letterSpacing: t.id === "minimal" ? 2 : 0 }}>
                              John Doe
                            </div>
                            <div style={{ color: "#999", fontSize: 5, marginBottom: 3 }}>email@mail.com | 555-1234</div>
                            <div style={{ height: 1, background: t.id === "classic" ? "#333" : t.id === "modern" ? "#6366f1" : "#ddd", marginBottom: 3 }} />
                            <div style={{ color: "#666", fontSize: 5 }}>Experience section preview...</div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-white">{t.label}</span>
                        <p className="mt-1 text-xs text-slate-400">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={copyHTML} className="flex-1 rounded-lg border border-slate-600 bg-slate-800 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700">
                  Copy as HTML
                </button>
                <button onClick={printResume} className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
                  Print / Save as PDF
                </button>
              </div>
            </div>

            {/* Right — Live Preview */}
            <div className="flex flex-col">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Live Preview</h3>
              <div className="flex-1 overflow-auto rounded-xl bg-slate-800/40 p-4">
                <div className="mx-auto w-full max-w-[612px] rounded-sm bg-white shadow-2xl shadow-black/50 print:shadow-none" ref={previewRef}>
                  {resumePreview}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── Pricing ───── */}
        <section className="mx-auto max-w-xl px-6 pb-24 text-center">
          <h2 className="text-2xl font-bold text-white">Go Pro</h2>
          <p className="mt-2 text-slate-400">Unlock premium templates, AI-powered bullet rewrites, and unlimited exports.</p>
          <div className="mt-6 inline-block rounded-2xl border border-slate-700 bg-slate-800/60 px-10 py-8">
            <span className="text-4xl font-extrabold text-white">$12</span>
            <span className="text-slate-400">/mo</span>
            <p className="mt-2 text-sm text-slate-500">Cancel anytime. Free tier always available.</p>
            <div className="mt-6 flex gap-2">
              <input className={inputClass} placeholder="Your email" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") joinWaitlist(); }}
              />
              <button onClick={joinWaitlist} className="shrink-0 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400">
                Join Waitlist
              </button>
            </div>
          </div>
        </section>

        {/* ───── Footer ───── */}
        <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
          &copy; 2025 ResumeForge. All rights reserved.
        </footer>
      </div>

      {/* Print stylesheet */}
      <style>{`
        @media print {
          body { margin: 0; padding: 0; background: #fff; }
          #resume-print { display: block !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}
