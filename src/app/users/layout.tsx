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
    <main className="flex min-h-full w-full flex-col gap-4 md:flex-row">
      {children}
      {polls}
      {votes}
    </main>
  );
}
