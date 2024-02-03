export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex animate-pulse flex-col items-center space-y-4">
        <div className="h-24 w-24 rounded-full bg-neutral-800"></div>
        <div className="h-6 w-24 rounded-full bg-neutral-800"></div>
        <div className="h-6 w-24 rounded-full bg-neutral-800"></div>
        <div className="h-6 w-24 rounded-full bg-neutral-800"></div>
      </div>
    </main>
  );
}
