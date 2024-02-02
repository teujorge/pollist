import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Poll",
  description: "Opinions exposed",
  icons: [{ rel: "icon", url: "/icon.jpg" }],
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
        <body className={`pt-16 font-sans ${inter.variable}`}>
          <Header />

          {children}
          {crudPoll}
          {welcome}
        </body>
      </ClerkProvider>
    </html>
  );
}

function Header() {
  return (
    <header className="fixed left-0 top-0 flex w-full justify-between bg-gradient-to-b from-black from-60% p-4">
      <Link href="/">Poll</Link>

      <SignedIn>
        <div className="flex flex-row items-center gap-4">
          <Link href="/">Home</Link>
          <Link href="/create-poll">Create Poll</Link>
          <div className="h-8 w-8">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
    </header>
  );
}
