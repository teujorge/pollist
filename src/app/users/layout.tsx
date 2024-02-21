import { UserPageProvider } from "./context";

export default function Layout({
  children,
  polls,
  votes,
  followers,
  following,
}: {
  children: React.ReactNode;
  polls: React.ReactNode;
  votes: React.ReactNode;
  followers: React.ReactNode;
  following: React.ReactNode;
}) {
  return (
    <>
      <main className="flex max-h-[calc(100dvh-64px)] w-full flex-col gap-2 overflow-hidden md:gap-4 ">
        <UserPageProvider>
          {children}
          <div className="flex max-h-full flex-row gap-4 overflow-hidden">
            {polls}
            {votes}
          </div>
        </UserPageProvider>
      </main>
      {followers}
      {following}
    </>
  );
}
