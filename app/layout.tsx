import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Video Studio - Grok & Google Veo",
  description: "Generate complete AI videos using Grok API and Google Veo API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
