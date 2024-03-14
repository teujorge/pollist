import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex h-[calc(100dvh-64px)] w-full flex-col items-center justify-center gap-4">
      <div className="flex w-fit flex-row items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">404</h1>
        <div className="h-5 w-0.5 rounded-xl bg-neutral-400" />
        <p className="text-lg">Page not found</p>
      </div>
      <Link
        href="/"
        className={buttonVariants({ variant: "outline", size: "lg" })}
      >
        Home
      </Link>
    </main>
  );
}
