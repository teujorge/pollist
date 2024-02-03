export default function NotFound() {
  return (
    <main className="flex h-[calc(100dvh-64px)] w-full items-center justify-center">
      <div className="flex w-fit flex-row items-center justify-center gap-2">
        <h1 className="text-3xl font-bold">404</h1>
        <div className="h-5 w-0.5 rounded-xl bg-neutral-400" />
        <desc className="text-lg">Page not found</desc>
      </div>
    </main>
  );
}
