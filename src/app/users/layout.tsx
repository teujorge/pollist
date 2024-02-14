import { UserPageProvider } from "./context";

export default function Layout({
  children,
  polls,
  votes,
}: {
  children: React.ReactNode;
  polls: React.ReactNode;
  votes: React.ReactNode;
}) {
  return (
    <main className="flex max-h-[calc(100dvh-64px)] w-full flex-col gap-4 overflow-hidden ">
      <UserPageProvider>
        {children}
        <div className="flex max-h-full flex-row gap-4 overflow-hidden">
          {polls}
          {votes}
        </div>
      </UserPageProvider>
    </main>
  );
}
