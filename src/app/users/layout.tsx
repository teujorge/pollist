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
    <main className="flex h-[calc(100dvh-64px)] w-full flex-col gap-4 overflow-hidden md:flex-row">
      {children}
      {polls}
      {votes}
    </main>
  );
}
