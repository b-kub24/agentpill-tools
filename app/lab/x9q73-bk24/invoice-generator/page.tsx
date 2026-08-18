"use client";

import { useState } from "react";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

function generateInvoiceNumber(): string {
  const prefix = "INV";
  const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `${prefix}-${timestamp}-${rand}`;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InvoiceGeneratorPage() {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [invoiceNumber] = useState(generateInvoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(todayISO);
  const [dueDate, setDueDate] = useState(() => addDays(todayISO(), 30));
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState(
    "Payment is due within 30 days of the invoice date. Late payments may incur a 1.5% monthly fee."
  );
  const [showPreview, setShowPreview] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: Date.now(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateLineItem = (
    id: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = subtotal * (taxRate / 100);
  const discountAmount = discount;
  const total = subtotal + taxAmount - discountAmount;

  const buildInvoiceHTML = (): string => {
    const rows = lineItems
      .map(
        (item) => `
      <tr style="border-bottom:1px solid #e2e8f0">
        <td style="padding:10px 8px;text-align:left">${item.description || "—"}</td>
        <td style="padding:10px 8px;text-align:center">${item.quantity}</td>
        <td style="padding:10px 8px;text-align:right">${formatCurrency(item.unitPrice)}</td>
        <td style="padding:10px 8px;text-align:right">${formatCurrency(item.quantity * item.unitPrice)}</td>
      </tr>`
      )
      .join("");

    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Invoice ${invoiceNumber}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1e293b}
table{width:100%;border-collapse:collapse}
@media print{body{padding:20px}}</style></head>
<body>
<div style="display:flex;justify-content:space-between;margin-bottom:40px">
  <div><h1 style="margin:0;font-size:28px;color:#4f46e5">${companyName || "Your Company"}</h1>
  <p style="color:#64748b;white-space:pre-line;margin-top:8px">${companyAddress || ""}</p></div>
  <div style="text-align:right"><h2 style="margin:0;font-size:24px;color:#1e293b">INVOICE</h2>
  <p style="color:#64748b;margin-top:8px">${invoiceNumber}</p></div>
</div>
<div style="display:flex;justify-content:space-between;margin-bottom:32px;padding:20px;background:#f8fafc;border-radius:8px">
  <div><p style="font-weight:600;margin:0 0 4px">Bill To</p>
  <p style="margin:0;color:#334155">${clientName || "—"}</p>
  <p style="margin:0;color:#64748b">${clientEmail || ""}</p></div>
  <div style="text-align:right"><p style="margin:0"><span style="font-weight:600">Date:</span> ${formatDate(invoiceDate)}</p>
  <p style="margin:0"><span style="font-weight:600">Due:</span> ${formatDate(dueDate)}</p></div>
</div>
<table>
  <thead><tr style="background:#4f46e5;color:#fff">
    <th style="padding:10px 8px;text-align:left;border-radius:6px 0 0 0">Description</th>
    <th style="padding:10px 8px;text-align:center">Qty</th>
    <th style="padding:10px 8px;text-align:right">Unit Price</th>
    <th style="padding:10px 8px;text-align:right;border-radius:0 6px 0 0">Amount</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div style="display:flex;justify-content:flex-end;margin-top:24px">
  <div style="width:280px">
    <div style="display:flex;justify-content:space-between;padding:6px 0"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
    <div style="display:flex;justify-content:space-between;padding:6px 0"><span>Tax (${taxRate}%)</span><span>${formatCurrency(taxAmount)}</span></div>
    ${discountAmount > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0;color:#dc2626"><span>Discount</span><span>-${formatCurrency(discountAmount)}</span></div>` : ""}
    <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:2px solid #4f46e5;font-size:18px;font-weight:700"><span>Total</span><span style="color:#4f46e5">${formatCurrency(total)}</span></div>
  </div>
</div>
${notes ? `<div style="margin-top:40px;padding:20px;background:#f8fafc;border-radius:8px;border-left:4px solid #4f46e5"><p style="font-weight:600;margin:0 0 8px">Notes &amp; Terms</p><p style="margin:0;color:#64748b;white-space:pre-line">${notes}</p></div>` : ""}
</body></html>`;
  };

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(buildInvoiceHTML()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const blob = new Blob([buildInvoiceHTML()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail) setWaitlistSubmitted(true);
  };

  const steps = [
    {
      num: "01",
      title: "Enter Details",
      desc: "Fill in your company info, client details, and line items for the invoice.",
    },
    {
      num: "02",
      title: "Review Preview",
      desc: "See a professional, print-ready invoice preview with all totals calculated.",
    },
    {
      num: "03",
      title: "Export Instantly",
      desc: "Copy as HTML, print directly, or download — no sign-up or watermark.",
    },
  ];

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800 px-4 pb-20 pt-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-400">
            Instant, private, 100% in your browser
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Invoice Generator
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Create polished, professional invoices in seconds. No sign-up, no
            backend, no data leaves your machine. Enter your details, preview,
            and export.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-slate-800 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.num}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center transition hover:border-indigo-500/40"
              >
                <span className="mb-3 inline-block text-3xl font-extrabold text-indigo-500/60">
                  {s.num}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-slate-100">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section className="border-b border-slate-800 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              Create Your Invoice
            </span>
          </h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            {/* Company & Client */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-4 text-base font-semibold text-indigo-400">
                  Your Company
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Company Name</label>
                    <input
                      className={inputClass}
                      placeholder="Acme Inc."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <textarea
                      className={inputClass + " resize-none"}
                      rows={2}
                      placeholder="123 Main St, Suite 100&#10;City, State 12345"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-base font-semibold text-violet-400">
                  Client Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Client Name</label>
                    <input
                      className={inputClass}
                      placeholder="Jane Smith"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Client Email</label>
                    <input
                      className={inputClass}
                      type="email"
                      placeholder="jane@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="mb-8 grid gap-6 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Invoice Number</label>
                <input
                  className={inputClass + " bg-slate-800/40 cursor-not-allowed"}
                  value={invoiceNumber}
                  readOnly
                />
              </div>
              <div>
                <label className={labelClass}>Invoice Date</label>
                <input
                  className={inputClass}
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Due Date</label>
                <input
                  className={inputClass}
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-emerald-400">
                  Line Items
                </h3>
                <button
                  onClick={addLineItem}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
                >
                  + Add Row
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-2 pr-3">Description</th>
                      <th className="pb-2 pr-3 w-24 text-center">Qty</th>
                      <th className="pb-2 pr-3 w-32 text-right">
                        Unit Price
                      </th>
                      <th className="pb-2 pr-3 w-32 text-right">Total</th>
                      <th className="pb-2 w-12" />
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-800/50"
                      >
                        <td className="py-2 pr-3">
                          <input
                            className={inputClass}
                            placeholder="Service or product"
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            className={inputClass + " text-center"}
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateLineItem(
                                item.id,
                                "quantity",
                                Math.max(1, Number(e.target.value))
                              )
                            }
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            className={inputClass + " text-right"}
                            type="number"
                            min={0}
                            step="0.01"
                            value={item.unitPrice || ""}
                            onChange={(e) =>
                              updateLineItem(
                                item.id,
                                "unitPrice",
                                Math.max(0, Number(e.target.value))
                              )
                            }
                          />
                        </td>
                        <td className="py-2 pr-3 text-right font-medium text-slate-300">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                        <td className="py-2 text-center">
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="text-slate-600 transition hover:text-red-400 disabled:opacity-30"
                            disabled={lineItems.length <= 1}
                            aria-label="Remove row"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tax, Discount, Notes */}
            <div className="mb-8 grid gap-6 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Tax Rate (%)</label>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  step="0.1"
                  value={taxRate || ""}
                  onChange={(e) =>
                    setTaxRate(Math.max(0, Number(e.target.value)))
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Discount ($)</label>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  step="0.01"
                  value={discount || ""}
                  onChange={(e) =>
                    setDiscount(Math.max(0, Number(e.target.value)))
                  }
                />
              </div>
              <div className="flex flex-col justify-end">
                <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 text-right">
                  <p className="text-xs text-slate-500">Live Total</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className={labelClass}>Notes / Payment Terms</label>
              <textarea
                className={inputClass + " resize-none"}
                rows={3}
                placeholder="Payment terms, bank details, thank-you note..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={() => setShowPreview(true)}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview */}
      {showPreview && (
        <section className="border-b border-slate-800 px-4 py-20 print:border-0 print:p-0">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
              <h2 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  Invoice Preview
                </span>
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyHTML}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500/50 hover:text-white"
                >
                  {copied ? "Copied!" : "Copy as HTML"}
                </button>
                <button
                  onClick={handlePrint}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500/50 hover:text-white"
                >
                  Print Invoice
                </button>
                <button
                  onClick={handleDownload}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                  Download as HTML
                </button>
              </div>
            </div>

            {/* Invoice Card */}
            <div className="rounded-2xl border border-slate-800 bg-white p-8 text-slate-900 shadow-2xl sm:p-10 print:border-0 print:shadow-none">
              {/* Header */}
              <div className="mb-10 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-600">
                    {companyName || "Your Company"}
                  </h3>
                  {companyAddress && (
                    <p className="mt-1 whitespace-pre-line text-sm text-slate-500">
                      {companyAddress}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">INVOICE</p>
                  <p className="mt-1 font-mono text-sm text-slate-500">
                    {invoiceNumber}
                  </p>
                </div>
              </div>

              {/* Bill To / Dates */}
              <div className="mb-8 flex justify-between rounded-lg bg-slate-50 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Bill To
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {clientName || "---"}
                  </p>
                  {clientEmail && (
                    <p className="text-sm text-slate-500">{clientEmail}</p>
                  )}
                </div>
                <div className="text-right text-sm">
                  <p>
                    <span className="font-semibold text-slate-600">Date: </span>
                    {formatDate(invoiceDate)}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-slate-600">Due: </span>
                    {formatDate(dueDate)}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="mb-6 w-full text-sm">
                <thead>
                  <tr className="rounded-lg bg-indigo-600 text-white">
                    <th className="rounded-l-lg px-4 py-3 text-left font-semibold">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">Qty</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Unit Price
                    </th>
                    <th className="rounded-r-lg px-4 py-3 text-right font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }
                    >
                      <td className="px-4 py-3 text-slate-700">
                        {item.description || "---"}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-700">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax ({taxRate}%)</span>
                    <span className="text-slate-700">
                      {formatCurrency(taxAmount)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Discount</span>
                      <span className="text-red-500">
                        -{formatCurrency(discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t-2 border-indigo-600 pt-2 text-lg font-bold">
                    <span className="text-slate-800">Total</span>
                    <span className="text-indigo-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {notes && (
                <div className="mt-10 rounded-lg border-l-4 border-indigo-600 bg-slate-50 p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Notes &amp; Terms
                  </p>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                    {notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="border-b border-slate-800 px-4 py-20 print:hidden">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="mb-4 text-3xl font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
              Go Pro
            </span>
          </h2>
          <p className="mb-8 text-slate-400">
            This tool is free forever. The Pro plan adds batch invoicing,
            recurring schedules, PDF export, and client portals.
          </p>
          <div className="mx-auto max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
              Pro Plan
            </p>
            <p className="mt-2 text-5xl font-extrabold text-white">
              $9
              <span className="text-lg font-normal text-slate-500">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-left text-sm text-slate-400">
              {[
                "Unlimited invoices",
                "PDF export with branding",
                "Recurring invoice schedules",
                "Client portal & tracking",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-400">
                    <svg
                      className="h-4 w-4"
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
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <form onSubmit={handleWaitlist} className="mt-8">
              {waitlistSubmitted ? (
                <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-400">
                  You are on the waitlist!
                </p>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    className={inputClass + " flex-1"}
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Join Waitlist
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 text-center print:hidden">
        <p className="text-sm text-slate-600">
          Built by{" "}
          <span className="font-semibold text-indigo-400">AgentPill Lab</span>.
          100% client-side. Your data never leaves your browser.
        </p>
      </footer>
    </div>
  );
}
