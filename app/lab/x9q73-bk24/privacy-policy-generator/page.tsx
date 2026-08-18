"use client";

import { useState } from "react";

const dataTypes = [
  { id: "email", label: "Email Addresses", desc: "Newsletter signups, account emails" },
  { id: "name", label: "Names / Contact Info", desc: "First name, last name, phone" },
  { id: "payment", label: "Payment Information", desc: "Credit cards, billing addresses" },
  { id: "location", label: "Location Data", desc: "GPS, IP-based geolocation" },
  { id: "cookies", label: "Cookies", desc: "Session, preference, third-party" },
  { id: "analytics", label: "Analytics Data", desc: "Page views, click patterns, sessions" },
  { id: "device", label: "Device Information", desc: "Browser type, OS, screen size" },
];

function generateMarkdown(c: {
  companyName: string;
  websiteUrl: string;
  collectedData: string[];
  sharesData: boolean;
  sharingPartners: string;
  coppa: boolean;
  gdpr: boolean;
  contactEmail: string;
}) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dataLabels = dataTypes
    .filter((d) => c.collectedData.includes(d.id))
    .map((d) => d.label);

  let md = `# Privacy Policy for ${c.companyName}\n\n`;
  md += `**Effective Date:** ${date}\n\n`;
  md += `**Website:** ${c.websiteUrl}\n\n`;
  md += `---\n\n`;

  // Section 1 - Introduction
  md += `## 1. Introduction\n\n`;
  md += `Welcome to ${c.companyName}. We respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at ${c.websiteUrl} and use our services.\n\n`;
  md += `By accessing or using our services, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our services.\n\n`;

  // Section 2 - Information We Collect
  md += `## 2. Information We Collect\n\n`;
  md += `We collect the following types of information:\n\n`;
  dataLabels.forEach((label) => {
    md += `- **${label}**\n`;
  });
  md += `\nWe collect this information when you voluntarily provide it to us, when you use our services, and through automated data collection technologies.\n\n`;
  if (c.collectedData.includes("payment")) {
    md += `**Payment Data:** All payment information is processed through secure, PCI-compliant payment processors. We do not store complete credit card numbers on our servers.\n\n`;
  }
  if (c.collectedData.includes("location")) {
    md += `**Location Data:** We may collect approximate location data based on your IP address or, with your explicit consent, precise location data from your device.\n\n`;
  }

  // Section 3 - How We Use Information
  md += `## 3. How We Use Your Information\n\n`;
  md += `We use the information we collect for the following purposes:\n\n`;
  md += `- To provide, operate, and maintain our services\n`;
  md += `- To improve, personalize, and expand our services\n`;
  md += `- To understand and analyze how you use our services\n`;
  md += `- To communicate with you, including for customer service and support\n`;
  md += `- To send you updates, marketing communications, and other information (with your consent)\n`;
  md += `- To detect and prevent fraud, abuse, and security incidents\n`;
  md += `- To comply with legal obligations\n\n`;

  // Section 4 - Data Sharing
  md += `## 4. Data Sharing and Disclosure\n\n`;
  if (c.sharesData) {
    md += `We may share your personal information with the following third parties:\n\n`;
    md += `- ${c.sharingPartners || "Selected third-party partners"}\n\n`;
    md += `We require all third parties to respect the security of your personal data and to treat it in accordance with applicable law. We do not allow our third-party service providers to use your personal data for their own purposes; we only permit them to process your personal data for specified purposes and in accordance with our instructions.\n\n`;
    md += `We may also disclose your information when required by law, in response to valid legal process, or to protect our rights, privacy, safety, or property.\n\n`;
  } else {
    md += `We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. We may share anonymized, aggregate data that cannot be used to identify you for analytics and service improvement purposes.\n\n`;
    md += `We may disclose your information when required by law, in response to valid legal process, or to protect our rights, privacy, safety, or property.\n\n`;
  }

  // Section 5 - Cookies & Tracking
  if (c.collectedData.includes("cookies") || c.collectedData.includes("analytics")) {
    md += `## 5. Cookies and Tracking Technologies\n\n`;
    md += `We use cookies and similar tracking technologies to track activity on our services and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.\n\n`;
    md += `**Types of cookies we use:**\n\n`;
    md += `- **Essential Cookies:** Necessary for the website to function properly. These cannot be disabled.\n`;
    md += `- **Analytics Cookies:** Help us understand how visitors interact with our website by collecting and reporting information anonymously.\n`;
    md += `- **Preference Cookies:** Enable the website to remember your preferences and settings.\n`;
    md += `- **Marketing Cookies:** Used to track visitors across websites to display relevant advertisements.\n\n`;
    md += `You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our services.\n\n`;
  }

  // Section 6 - Data Retention
  md += `## ${c.collectedData.includes("cookies") || c.collectedData.includes("analytics") ? "6" : "5"}. Data Retention\n\n`;
  md += `We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.\n\n`;
  md += `When your data is no longer required, we will securely delete or anonymize it in accordance with our data retention schedule. Typical retention periods:\n\n`;
  md += `- Account data: Duration of account plus 30 days after deletion\n`;
  md += `- Transaction records: 7 years (legal/tax requirements)\n`;
  md += `- Analytics data: 26 months\n`;
  md += `- Server logs: 90 days\n\n`;

  // Section 7 - Your Rights
  const rightsSectionNum = c.collectedData.includes("cookies") || c.collectedData.includes("analytics") ? "7" : "6";
  if (c.gdpr) {
    md += `## ${rightsSectionNum}. Your Rights Under GDPR\n\n`;
    md += `If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). ${c.companyName} aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal data.\n\n`;
    md += `You have the following rights:\n\n`;
    md += `- **Right of Access:** You have the right to request copies of your personal data.\n`;
    md += `- **Right to Rectification:** You have the right to request correction of any inaccurate or incomplete data.\n`;
    md += `- **Right to Erasure:** You have the right to request erasure of your personal data under certain conditions.\n`;
    md += `- **Right to Restrict Processing:** You have the right to request restriction of processing under certain conditions.\n`;
    md += `- **Right to Data Portability:** You have the right to request transfer of your data to another organization or directly to you.\n`;
    md += `- **Right to Object:** You have the right to object to our processing of your personal data under certain conditions.\n`;
    md += `- **Right to Withdraw Consent:** Where processing is based on consent, you may withdraw it at any time.\n\n`;
    md += `To exercise any of these rights, please contact us at ${c.contactEmail}. We will respond to your request within 30 days.\n\n`;
    md += `**Legal Basis for Processing:** We process your data under one or more of the following bases: your consent, performance of a contract, compliance with a legal obligation, or our legitimate interests.\n\n`;
    md += `**Data Protection Officer:** For GDPR-related inquiries, please contact our data protection team at ${c.contactEmail}.\n\n`;
  } else {
    md += `## ${rightsSectionNum}. Your Privacy Rights\n\n`;
    md += `Depending on your jurisdiction, you may have certain rights regarding your personal information, including:\n\n`;
    md += `- The right to access the personal data we hold about you\n`;
    md += `- The right to request correction of inaccurate data\n`;
    md += `- The right to request deletion of your data\n`;
    md += `- The right to opt out of marketing communications\n\n`;
    md += `To exercise these rights, please contact us at ${c.contactEmail}.\n\n`;
  }

  // Section 8 - Children's Privacy
  const childrenNum = parseInt(rightsSectionNum) + 1;
  md += `## ${childrenNum}. Children's Privacy\n\n`;
  if (c.coppa) {
    md += `Our services are not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In compliance with the Children's Online Privacy Protection Act (COPPA), if we discover that a child under 13 has provided us with personal information, we will immediately delete that information from our servers.\n\n`;
    md += `If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us at ${c.contactEmail} so that we can take the necessary actions.\n\n`;
    md += `We encourage parents and guardians to observe, participate in, and/or monitor and guide their children's online activity.\n\n`;
  } else {
    md += `Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected personal data from a child, we will take steps to delete that information promptly.\n\n`;
  }

  // Section 9 - Security
  const securityNum = childrenNum + 1;
  md += `## ${securityNum}. Data Security\n\n`;
  md += `We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:\n\n`;
  md += `- Encryption of data in transit (TLS/SSL) and at rest\n`;
  md += `- Regular security assessments and penetration testing\n`;
  md += `- Access controls and authentication mechanisms\n`;
  md += `- Employee training on data protection and security\n\n`;
  md += `However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.\n\n`;

  // Section 10 - Changes
  const changesNum = securityNum + 1;
  md += `## ${changesNum}. Changes to This Privacy Policy\n\n`;
  md += `We may update our Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top of this document.\n\n`;
  md += `For significant changes, we will provide additional notice such as an email notification or a prominent notice on our website. We encourage you to review this Privacy Policy periodically.\n\n`;

  // Section 11 - Contact
  const contactNum = changesNum + 1;
  md += `## ${contactNum}. Contact Us\n\n`;
  md += `If you have any questions about this Privacy Policy or our data practices, please contact us:\n\n`;
  md += `- **Company:** ${c.companyName}\n`;
  md += `- **Website:** ${c.websiteUrl}\n`;
  md += `- **Email:** ${c.contactEmail}\n\n`;
  md += `---\n\n`;
  md += `*This privacy policy was generated on ${date} and should be reviewed by a qualified legal professional before publication.*\n`;

  return md;
}

function markdownToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "\n<br/><br/>\n");
  return `<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Privacy Policy</title>\n<style>body{font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:2rem auto;padding:0 1.5rem;line-height:1.8;color:#1e293b;background:#fff}h1{font-size:1.75rem;border-bottom:2px solid #e2e8f0;padding-bottom:0.5rem}h2{font-size:1.35rem;color:#0f172a;margin-top:2rem}hr{border:none;border-top:1px solid #cbd5e1;margin:2rem 0}li{margin:.25rem 0}strong{color:#0f172a}em{color:#64748b}</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
}

export default function PrivacyPolicyGeneratorPage() {
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [collectedData, setCollectedData] = useState<string[]>([]);
  const [sharesData, setSharesData] = useState(false);
  const [sharingPartners, setSharingPartners] = useState("");
  const [coppa, setCoppa] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [policy, setPolicy] = useState("");
  const [copied, setCopied] = useState("");

  const toggleData = (id: string) => {
    setCollectedData((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const canGenerate =
    companyName.trim() !== "" &&
    websiteUrl.trim() !== "" &&
    contactEmail.trim() !== "" &&
    collectedData.length > 0;

  const generate = () => {
    if (!canGenerate) return;
    setPolicy(
      generateMarkdown({
        companyName: companyName.trim(),
        websiteUrl: websiteUrl.trim(),
        collectedData,
        sharesData,
        sharingPartners: sharingPartners.trim(),
        coppa,
        gdpr,
        contactEmail: contactEmail.trim(),
      })
    );
  };

  const copyAs = (format: "md" | "html") => {
    const text = format === "html" ? markdownToHtml(policy) : policy;
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(""), 2000);
  };

  const download = () => {
    const blob = new Blob([policy], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${companyName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}-privacy-policy.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps = [
    {
      num: "1",
      title: "Enter Your Details",
      desc: "Provide your company name, website URL, and contact email for the policy header.",
    },
    {
      num: "2",
      title: "Configure Data Practices",
      desc: "Select all data types you collect, specify sharing partners, and toggle compliance flags.",
    },
    {
      num: "3",
      title: "Generate & Export",
      desc: "Get a professional, multi-section privacy policy ready to copy, download, or publish.",
    },
  ];

  const sectionPreview = [
    "Introduction",
    "Information We Collect",
    "How We Use Information",
    "Data Sharing",
    collectedData.includes("cookies") || collectedData.includes("analytics")
      ? "Cookies & Tracking"
      : null,
    "Data Retention",
    gdpr ? "Your GDPR Rights" : "Your Privacy Rights",
    "Children's Privacy",
    "Data Security",
    "Changes to Policy",
    "Contact",
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
          Instant, private, 100% in your browser
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Privacy Policy Generator
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Generate a complete, professional privacy policy for your website or
          app in seconds. Supports GDPR and COPPA compliance sections. No data
          ever leaves your browser.
        </p>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-center mb-10 text-slate-200">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                {s.num}
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Tool */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 text-slate-100">
            Generate Your Privacy Policy
          </h2>

          {/* Company details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Company / App Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc."
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Website URL *
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Data types */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Types of Data Collected *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dataTypes.map((dt) => (
                <label
                  key={dt.id}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                    collectedData.includes(dt.id)
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-200"
                      : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={collectedData.includes(dt.id)}
                    onChange={() => toggleData(dt.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      collectedData.includes(dt.id)
                        ? "bg-indigo-500 border-indigo-500"
                        : "border-slate-600"
                    }`}
                  >
                    {collectedData.includes(dt.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{dt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {dt.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Data sharing */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Do you share data with third parties?
              </label>
              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => setSharesData(true)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    sharesData
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setSharesData(false)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    !sharesData
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            {sharesData && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">
                  Who do you share data with?
                </label>
                <input
                  type="text"
                  value={sharingPartners}
                  onChange={(e) => setSharingPartners(e.target.value)}
                  placeholder="e.g. Google Analytics, Stripe, Mailchimp"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            )}
          </div>

          {/* Contact + compliance */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Contact Email *
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="privacy@example.com"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <label
              className={`flex items-center gap-3 cursor-pointer rounded-xl border px-4 py-2.5 self-end transition-all ${
                coppa
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <input
                type="checkbox"
                checked={coppa}
                onChange={(e) => setCoppa(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                  coppa ? "bg-indigo-500 border-indigo-500" : "border-slate-600"
                }`}
              >
                {coppa && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-sm text-slate-200 font-medium">
                  COPPA
                </span>
                <p className="text-xs text-slate-500">Children under 13</p>
              </div>
            </label>
            <label
              className={`flex items-center gap-3 cursor-pointer rounded-xl border px-4 py-2.5 self-end transition-all ${
                gdpr
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <input
                type="checkbox"
                checked={gdpr}
                onChange={(e) => setGdpr(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                  gdpr ? "bg-indigo-500 border-indigo-500" : "border-slate-600"
                }`}
              >
                {gdpr && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-sm text-slate-200 font-medium">GDPR</span>
                <p className="text-xs text-slate-500">EU data rights</p>
              </div>
            </label>
          </div>

          {/* Section preview */}
          {canGenerate && (
            <div className="mb-6 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
                Sections that will be generated:
              </p>
              <div className="flex flex-wrap gap-2">
                {sectionPreview.map((section) => (
                  <span
                    key={section}
                    className="px-2.5 py-1 rounded-md bg-slate-700/50 text-xs text-slate-300"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={generate}
            disabled={!canGenerate}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Privacy Policy
          </button>

          {/* Output */}
          {policy && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-slate-100">
                  Your Privacy Policy
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => copyAs("md")}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    {copied === "md" ? "Copied!" : "Copy Markdown"}
                  </button>
                  <button
                    onClick={() => copyAs("html")}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    {copied === "html" ? "Copied!" : "Copy HTML"}
                  </button>
                  <button
                    onClick={download}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-sm text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                  >
                    Download .md
                  </button>
                </div>
              </div>
              <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-6 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">
                  {policy}
                </pre>
              </div>
              <p className="text-xs text-slate-600 mt-3 text-center">
                This generated policy is a template. Please have it reviewed by
                a qualified legal professional before publishing.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-md mx-auto px-4 pb-20">
        <h2 className="text-2xl font-semibold text-center mb-8 text-slate-200">
          Pricing
        </h2>
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-8 text-center">
          <div className="text-sm text-indigo-400 font-medium mb-2">PRO</div>
          <div className="text-4xl font-bold text-slate-100 mb-1">
            $9
            <span className="text-lg font-normal text-slate-400">/mo</span>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            Unlimited privacy policies with all compliance options
          </p>
          <ul className="text-sm text-slate-300 space-y-3 mb-8 text-left">
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> GDPR and COPPA
              compliance sections
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> Markdown and HTML
              export formats
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> Smart conditional
              sections based on inputs
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> Data security and
              retention sections
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">&#10003;</span> Runs 100% in your
              browser, zero data sent
            </li>
          </ul>
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>AgentPill Lab &mdash; Privacy Policy Generator</span>
          <span>
            All processing happens locally. Your data never leaves your device.
          </span>
        </div>
      </footer>
    </div>
  );
}
