import "@/styles/globals.css";
import localFont from "next/font/local";
import { JsonLd, metadata, viewport } from "./seo";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const nunito = localFont({
  src: "../fonts/Nunito-VariableFont_wght.ttf",
  display: "swap",
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
      <body className={nunito.className}>{children}</body>
    </html>
  );
}

export { metadata, viewport };
