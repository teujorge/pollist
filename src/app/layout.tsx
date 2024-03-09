import "@/styles/globals.css";
import { Nunito_Sans } from "next/font/google";
import { JsonLd, metadata, viewport } from "./seo";

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
      <body className={`font-sans ${nunito.variable}`}>{children}</body>
    </html>
  );
}

export { metadata, viewport };
