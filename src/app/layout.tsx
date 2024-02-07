import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "@/styles/globals.css";
import { Nunito_Sans } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";

const nunito = Nunito_Sans({
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
        <body className={`font-sans ${nunito.variable}`}>
          <Header />
          <Toaster richColors />

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
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full justify-between bg-gradient-to-b from-black from-60% px-5 py-4">
      <div className="flex flex-row items-center gap-4">
        <Link href="/">Poll</Link>
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
          <div className="flex h-8 w-fit items-center">
            <SignInButton mode="modal" />
          </div>
        </SignedOut>
      </div>
    </header>
  );
}
