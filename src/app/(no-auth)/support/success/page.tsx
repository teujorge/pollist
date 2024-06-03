import Link from "next/link";
import { BlobBg } from "@/app/components/BlobBg";
import { buttonVariants } from "@/components/ui/button";
import type { Metadata } from "next";

export default function SupportSuccessPage() {
  return (
    <main>
      <BlobBg />

      <div className="relative z-10 flex flex-col py-24">
        <h1 className="text-center text-7xl font-black md:text-9xl">
          Thank You!
        </h1>
      </div>

      <section className="relative z-10 flex flex-col items-center gap-16 px-4 py-10">
        <h2 className="text-center text-xl font-semibold">
          Your message has been successfully sent. We appreciate you reaching
          out and will get back to you as soon as possible.
        </h2>

        <Link
          href="/support"
          className={buttonVariants({ variant: "secondary" })}
        >
          Return to Support Page
        </Link>
      </section>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Support Success",
  description:
    "Your message has been successfully sent. We will get back to you as soon as possible.",
};
