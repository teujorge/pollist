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
    <main className="flex min-h-full w-full flex-col items-center gap-4">
      {children}
      <div className="flex w-full flex-col justify-center gap-4 md:flex-row">
        {polls}
        {votes}
      </div>
    </main>
  );
}
