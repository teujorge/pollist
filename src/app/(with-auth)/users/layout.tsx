import { UserPageProvider } from "./context";

export default function UserPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex w-full flex-col gap-2 overflow-hidden md:gap-4 ">
        <UserPageProvider>{children}</UserPageProvider>
      </main>
    </>
  );
}
