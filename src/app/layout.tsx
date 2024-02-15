import "@/styles/globals.css";
import Head from "next/head";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Nunito_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { IconSvg } from "./svgs/IconSvg";
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
            <Header />
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

function Header() {
  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full justify-between bg-gradient-to-b from-black from-60% px-5 py-4">
      <div className="flex flex-row items-center gap-4">
        <Link
          href="/"
          className="h-8 w-8 [&>svg>path]:transition-all [&>svg>path]:hovact:fill-purple-500 [&>svg>path]:hovact:stroke-purple-500"
        >
          <IconSvg className="h-full w-full" />
        </Link>
      </div>

      <div className="flex flex-row items-center gap-4">
        <Link href="/">Home</Link>

        <Link href="/polls/create">Create</Link>

        <SignedIn>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex h-8 w-fit items-center [&>button]:transition-colors [&>button]:hovact:text-purple-500">
            <SignInButton mode="modal" />
          </div>
        </SignedOut>
      </div>
    </header>
  );
}
