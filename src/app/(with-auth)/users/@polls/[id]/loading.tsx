import { Loader } from "@/app/components/Loader";

export default function MyPollsLoading() {
  return (
    <div className="flex w-full items-center justify-center pt-8">
      <Loader />
    </div>
  );
}
