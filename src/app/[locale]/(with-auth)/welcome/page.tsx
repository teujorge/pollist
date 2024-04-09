import Link from "next/link";
import { CTA } from "@/app/components/CTA";
import { BlobBg } from "@/app/components/BlobBg";
import { Confetti } from "./Confetti";

export default function WelcomePage() {
  return (
    <main className="flex h-[calc(100dvh-64px)] w-full justify-center">
      <BlobBg />

      <div className="relative z-10 m-auto flex h-full min-h-[50dvh] w-full min-w-[50dvw] flex-grow flex-col items-center justify-between text-center">
        <div />

        <div className="flex flex-col items-center gap-4">
          <h1 className="pb-4 text-6xl font-bold md:text-8xl lg:text-9xl">
            Welcome!
          </h1>

          <p className="pb-2">
            How about participating in your first poll to get started?
          </p>
          <CTA />
        </div>

        <div>
          <p className="text-sm">
            Feel free to browse{" "}
            <Link
              href="/"
              scroll={false}
              className="underline underline-offset-2"
            >
              polls
            </Link>
          </p>
          <p className="text-sm">
            Or start off by{" "}
            <Link href="/polls/create" className="underline underline-offset-2">
              creating
            </Link>{" "}
            a poll
          </p>
        </div>
      </div>

      <Confetti />
    </main>
  );
}
