"use client";

import { useState } from "react";

// ─── Color Conversion Utilities ─────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  const sN = Math.max(0, Math.min(100, s)) / 100;
  const lN = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let rP = 0,
    gP = 0,
    bP = 0;
  if (h < 60) {
    rP = c; gP = x; bP = 0;
  } else if (h < 120) {
    rP = x; gP = c; bP = 0;
  } else if (h < 180) {
    rP = 0; gP = c; bP = x;
  } else if (h < 240) {
    rP = 0; gP = x; bP = c;
  } else if (h < 300) {
    rP = x; gP = 0; bP = c;
  } else {
    rP = c; gP = 0; bP = x;
  }
  return {
    r: Math.round((rP + m) * 255),
    g: Math.round((gP + m) * 255),
    b: Math.round((bP + m) * 255),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

// ─── WCAG Relative Luminance & Contrast ─────────────────────────────────────

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function bestTextColor(hex: string): "white" | "black" {
  const { r, g, b } = hexToRgb(hex);
  const lum = relativeLuminance(r, g, b);
  const whiteContrast = contrastRatio(1, lum);
  const blackContrast = contrastRatio(lum, 0);
  return whiteContrast >= blackContrast ? "white" : "black";
}

function wcagRating(hex: string, textColor: "white" | "black"): string {
  const { r, g, b } = hexToRgb(hex);
  const bgLum = relativeLuminance(r, g, b);
  const textLum = textColor === "white" ? 1 : 0;
  const ratio = contrastRatio(Math.max(bgLum, textLum), Math.min(bgLum, textLum));
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

// ─── Palette Generation ─────────────────────────────────────────────────────

type Mood = "Warm" | "Cool" | "Neutral" | "Vibrant" | "Muted" | "Dark" | "Pastel";
type PaletteType = "Complementary" | "Analogous" | "Triadic" | "Split-complementary" | "Monochromatic";

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  textColor: "white" | "black";
  wcag: string;
  lighter: string;
  darker: string;
}

function applyMood(h: number, s: number, l: number, mood: Mood): { h: number; s: number; l: number } {
  switch (mood) {
    case "Warm":
      // Shift hue toward red/orange (0-30 range)
      if (h > 180) h = h - (h - 30) * 0.3;
      else if (h > 60) h = h - (h - 30) * 0.2;
      s = Math.min(100, s + 5);
      return { h: ((h % 360) + 360) % 360, s, l };
    case "Cool":
      // Shift hue toward blue (210-240 range)
      if (h < 180) h = h + (210 - h) * 0.3;
      else if (h > 270) h = h - (h - 240) * 0.2;
      return { h: ((h % 360) + 360) % 360, s, l };
    case "Vibrant":
      return { h, s: Math.min(100, s + 25), l: Math.min(60, Math.max(40, l)) };
    case "Muted":
      return { h, s: Math.max(10, s - 30), l };
    case "Dark":
      return { h, s, l: Math.max(8, l - 20) };
    case "Pastel":
      return { h, s: Math.max(20, s - 25), l: Math.min(90, l + 20) };
    case "Neutral":
    default:
      return { h, s, l };
  }
}

function buildColorInfo(h: number, s: number, l: number): ColorInfo {
  const hex = hslToHex(h, s, l);
  const rgb = hexToRgb(hex);
  const textColor = bestTextColor(hex);
  return {
    hex,
    rgb,
    hsl: { h: Math.round(((h % 360) + 360) % 360), s: Math.round(s), l: Math.round(l) },
    textColor,
    wcag: wcagRating(hex, textColor),
    lighter: hslToHex(h, Math.max(0, s - 10), Math.min(95, l + 15)),
    darker: hslToHex(h, Math.min(100, s + 10), Math.max(5, l - 15)),
  };
}

function generatePalette(baseHex: string, mood: Mood, type: PaletteType): ColorInfo[] {
  const base = hexToHsl(baseHex);
  let hueOffsets: number[];

  switch (type) {
    case "Complementary":
      hueOffsets = [0, 180, 30, 210, 330];
      break;
    case "Analogous":
      hueOffsets = [0, 30, -30, 60, -60];
      break;
    case "Triadic":
      hueOffsets = [0, 120, 240, 60, 300];
      break;
    case "Split-complementary":
      hueOffsets = [0, 150, 210, 30, 330];
      break;
    case "Monochromatic":
      hueOffsets = [0, 0, 0, 0, 0];
      break;
    default:
      hueOffsets = [0, 180, 30, 210, 330];
  }

  return hueOffsets.map((offset, i) => {
    let h = (base.h + offset) % 360;
    if (h < 0) h += 360;
    let s = base.s;
    let l = base.l;

    if (type === "Monochromatic") {
      const satShifts = [0, 15, -15, 25, -25];
      const litShifts = [0, 18, -18, 30, -12];
      s = Math.max(5, Math.min(100, s + satShifts[i]));
      l = Math.max(10, Math.min(90, l + litShifts[i]));
    } else if (i > 0) {
      // Slight saturation/lightness variation for visual interest
      s = Math.max(10, Math.min(100, s + (i % 2 === 0 ? 5 : -5)));
      l = Math.max(15, Math.min(85, l + (i % 2 === 0 ? 8 : -8)));
    }

    const adjusted = applyMood(h, s, l, mood);
    return buildColorInfo(adjusted.h, adjusted.s, adjusted.l);
  });
}

// ─── CSS / Tailwind Export ──────────────────────────────────────────────────

function exportAsCSS(colors: ColorInfo[]): string {
  const names = ["primary", "secondary", "accent", "highlight", "muted"];
  return `:root {\n${colors
    .map((c, i) => {
      const n = names[i] || `color-${i + 1}`;
      return [
        `  --color-${n}: ${c.hex};`,
        `  --color-${n}-light: ${c.lighter};`,
        `  --color-${n}-dark: ${c.darker};`,
      ].join("\n");
    })
    .join("\n")}\n}`;
}

function exportAsTailwind(colors: ColorInfo[]): string {
  const names = ["primary", "secondary", "accent", "highlight", "muted"];
  const entries = colors
    .map((c, i) => {
      const n = names[i] || `color${i + 1}`;
      return `      "${n}": {\n        DEFAULT: "${c.hex}",\n        light: "${c.lighter}",\n        dark: "${c.darker}",\n      }`;
    })
    .join(",\n");
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      }\n    }\n  }\n}`;
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ColorPaletteGeneratorPage() {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [mood, setMood] = useState<Mood>("Neutral");
  const [paletteType, setPaletteType] = useState<PaletteType>("Analogous");
  const [palette, setPalette] = useState<ColorInfo[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [exportCopied, setExportCopied] = useState<string | null>(null);

  const moods: Mood[] = ["Warm", "Cool", "Neutral", "Vibrant", "Muted", "Dark", "Pastel"];
  const paletteTypes: PaletteType[] = [
    "Complementary", "Analogous", "Triadic", "Split-complementary", "Monochromatic",
  ];

  function handleGenerate() {
    const result = generatePalette(baseColor, mood, paletteType);
    setPalette(result);
    setCopied(null);
    setExportCopied(null);
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  function handleExport(format: "css" | "tailwind") {
    if (!palette.length) return;
    const text = format === "css" ? exportAsCSS(palette) : exportAsTailwind(palette);
    navigator.clipboard.writeText(text);
    setExportCopied(format);
    setTimeout(() => setExportCopied(null), 2000);
  }

  const selectClass =
    "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer";

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            Instant, private, 100% in your browser
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Color Palette Generator
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Build harmonious color palettes using real color-theory algorithms.
            Complementary, analogous, triadic, split-complementary, and
            monochromatic schemes — with mood adjustments, contrast checking,
            and one-click export.
          </p>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-100">
          How It Works
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Pick a Base Color",
              desc: "Choose any hex color or use the native color picker to start your palette.",
            },
            {
              step: "2",
              title: "Set Mood & Scheme",
              desc: "Select a mood (Warm, Cool, Vibrant...) and a palette type based on color theory.",
            },
            {
              step: "3",
              title: "Generate & Export",
              desc: "Get 5 harmonious colors with contrast scores, then export as CSS or Tailwind.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-lg font-bold text-indigo-400">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Tool ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-bold text-slate-100">
            Generate Your Palette
          </h2>

          {/* Controls */}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {/* Base Color */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Base Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="h-12 w-14 cursor-pointer rounded-lg border border-slate-700 bg-transparent p-1"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setBaseColor(v);
                  }}
                  maxLength={7}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Mood
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
                className={selectClass}
              >
                {moods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Palette Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Palette Type
              </label>
              <select
                value={paletteType}
                onChange={(e) => setPaletteType(e.target.value as PaletteType)}
                className={selectClass}
              >
                {paletteTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 hover:brightness-110 active:scale-[0.98]"
          >
            Generate Palette
          </button>

          {/* ── Palette Results ─────────────────────────────────────────── */}
          {palette.length > 0 && (
            <div className="mt-10">
              {/* Swatches Row */}
              <div className="grid gap-4 sm:grid-cols-5">
                {palette.map((color, i) => {
                  const id = `swatch-${i}`;
                  return (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(color.hex, id)}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-700 transition hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 focus:outline-none"
                    >
                      {/* Large color swatch */}
                      <div
                        className="flex h-32 items-center justify-center text-base font-bold sm:h-40"
                        style={{
                          backgroundColor: color.hex,
                          color: color.textColor,
                        }}
                      >
                        {copied === id ? "Copied!" : color.hex}
                      </div>

                      {/* Lighter / Darker strip */}
                      <div className="flex h-6">
                        <div
                          className="flex-1"
                          style={{ backgroundColor: color.lighter }}
                        />
                        <div
                          className="flex-1"
                          style={{ backgroundColor: color.darker }}
                        />
                      </div>

                      {/* Info */}
                      <div className="bg-slate-800/80 px-3 py-3 text-left text-xs">
                        <p className="font-mono text-slate-200">
                          RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </p>
                        <p className="font-mono text-slate-400">
                          HSL({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              color.wcag === "AAA"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : color.wcag === "AA"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : color.wcag === "AA Large"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {color.wcag}
                          </span>
                          <span className="text-slate-500">
                            {color.textColor === "white" ? "white" : "black"}{" "}
                            text
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Export Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleExport("css")}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-500/50 hover:bg-slate-700"
                >
                  {exportCopied === "css"
                    ? "Copied CSS!"
                    : "Copy as CSS Variables"}
                </button>
                <button
                  onClick={() => handleExport("tailwind")}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-500/50 hover:bg-slate-700"
                >
                  {exportCopied === "tailwind"
                    ? "Copied Tailwind!"
                    : "Copy as Tailwind Config"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-100">Simple Pricing</h2>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
            Pro
          </p>
          <p className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-5xl font-extrabold text-slate-100">$7</span>
            <span className="text-lg text-slate-400">/mo</span>
          </p>
          <ul className="mt-6 space-y-3 text-left text-sm text-slate-300">
            {[
              "Unlimited palette generation",
              "All palette types & moods",
              "WCAG contrast analysis",
              "CSS & Tailwind export",
              "Lighter/darker variants",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-0.5 text-indigo-400">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>
          <button className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 hover:brightness-110">
            Get Started
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-10 text-center text-sm text-slate-500">
        <p className="font-semibold text-slate-400">AgentPill Lab</p>
        <p className="mt-1">
          &copy; {new Date().getFullYear()} AgentPill Lab. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
