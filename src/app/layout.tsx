import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Nunito_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { App } from "./app";
import Script from "next/script";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Pollist",
  description: "Opinions exposed",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

export default function RootLayout({
  children,
  crudPoll,
  welcome,
}: {
  children: React.ReactNode;
  crudPoll: React.ReactNode;
  welcome: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6132246468312218"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />

      <ClerkProvider
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#a855f7", // purple
            colorDanger: "#cc3333", // red
            colorSuccess: "#22c55e", // green
            colorWarning: "#F59e0b", // amber

            colorAlphaShade: "#ffffff",

            colorTextOnPrimaryBackground: "#f1f1f1",
            colorTextSecondary: "#f1f1f1",

            // colorBackground: "#010101",

            colorInputText: "#f1f1f1",
            colorInputBackground: "#191919",
          },
        }}
      >
        <body className={`font-sans ${nunito.variable}`}>
          <App>
            <Toaster richColors />

            {children}
            {crudPoll}
            {welcome}
          </App>
        </body>
      </ClerkProvider>
    </html>
  );
}
