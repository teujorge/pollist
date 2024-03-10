import "@/styles/globals.css";
import { Nunito_Sans } from "next/font/google";
import { JsonLd, metadata, viewport } from "./seo";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <JsonLd />
      <Analytics />
      <SpeedInsights />
      <body className={`font-sans ${nunito.variable}`}>{children}</body>
    </html>
  );
}

export { metadata, viewport };
