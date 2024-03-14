import { Loader } from "@/app/components/Loader";

export default function MyVotesLoading() {
  return (
    <div className="flex h-fit w-full items-center justify-center pt-8">
      <Loader />
    </div>
  );
}
