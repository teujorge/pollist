import { Loader } from "./components/Loader";

export default function HomePageLoading() {
  return (
    <main className="flex h-dvh w-dvw items-center justify-center bg-red-500">
      <Loader />
    </main>
  );
}
