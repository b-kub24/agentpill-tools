import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentPill Tools",
  description: "Micro tools for founders and marketers.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-white">{children}</body>
    </html>
  );
}
