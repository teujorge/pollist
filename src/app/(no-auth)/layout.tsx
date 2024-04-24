import Link from "next/link";
import { IconSvg } from "../svgs/IconSvg";
import { HideInWebView } from "../components/HideInWebView";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky left-0 right-0 top-0 z-40 flex w-full justify-between bg-gradient-to-b from-background from-60% px-5 py-4">
        <div className="flex flex-row items-center gap-4">
          <HideInWebView>
            <Link
              href="/"
              className="h-8 w-8 [&>svg>path]:transition-all [&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary"
            >
              <IconSvg className="h-full w-full" />
            </Link>
          </HideInWebView>
        </div>

        <div className="relative flex flex-row items-center gap-4 [&>a]:font-semibold">
          <Link href="/about">About</Link>
          <Link href="privacy">Privacy</Link>
          <Link href="/tos">Terms</Link>
          <HideInWebView>
            <Link href="/">Home</Link>
          </HideInWebView>
        </div>
      </header>
      {children}
    </>
  );
}
