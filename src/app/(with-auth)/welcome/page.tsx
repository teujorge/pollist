import Link from "next/link";
import styles from "@/styles/blob.module.css";
import { Confetti } from "./Confetti";

export default function WelcomePage() {
  return (
    <main className="flex h-[calc(100dvh-64px)] w-full justify-center">
      <div className="fixed left-0 top-0 z-0 h-full w-full scale-150 blur-2xl [&>div]:absolute [&>div]:left-1/2 [&>div]:top-1/2 [&>div]:-translate-x-1/2 [&>div]:-translate-y-1/2 [&>div]:transform [&>div]:rounded-full [&>div]:opacity-50 [&>div]:filter">
        <div
          className={`bg-purple-300 ${styles.blob1}`}
          style={{
            width: "calc(min(30vw, 30vh))",
            height: "calc(min(30vw, 30vh))",
          }}
        />
        <div
          className={`bg-primary ${styles.blob2}`}
          style={{
            width: "calc(min(40vw, 40vh))",
            height: "calc(min(40vw, 40vh))",
          }}
        />
        <div
          className={`bg-purple-900 ${styles.blob3}`}
          style={{
            width: "calc(min(30vw, 30vh))",
            height: "calc(min(30vw, 30vh))",
          }}
        />
      </div>

      <div className="relative z-10 m-auto flex h-full min-h-[50dvh] w-full min-w-[50dvw] flex-grow flex-col items-center justify-between text-center">
        <div />

        <div className="flex flex-col items-center gap-4">
          <h1 className="pb-4 text-5xl font-bold sm:text-6xl md:text-7xl">
            Welcome!
          </h1>

          <p className="pb-2">
            How about participating in your first poll to get started?
          </p>
          <Link
            href="/polls/sample-poll"
            className="w-fit rounded bg-white px-4 py-2 font-bold text-black"
          >
            Participate in a Poll
          </Link>
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
