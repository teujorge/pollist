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
    <main
      className="flex w-full flex-col gap-4 overflow-hidden md:flex-row"
      style={{
        maxHeight: "calc(100vh - 64px)",
      }}
    >
      {children}
      {polls}
      {votes}
    </main>
  );
}
