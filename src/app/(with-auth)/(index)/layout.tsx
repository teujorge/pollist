import { Suspense } from "react";
import { ScrollRestorer } from "./components/ScrollRestorer";

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Suspense>
        <ScrollRestorer />
      </Suspense>
    </>
  );
}
