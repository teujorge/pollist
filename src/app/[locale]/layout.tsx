import "@/styles/globals.css";
import { Nunito_Sans } from "next/font/google";
import { JsonLd, metadata, viewport } from "./seo";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <JsonLd />
      <Analytics />
      <SpeedInsights />
      <body className={`font-sans ${nunito.variable}`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

export { metadata, viewport };
