import { DeletePollForm } from "@/app/components/CrudPoll/DeletePollForm";

export default function DeletePollPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const pollId = searchParams?.pollId?.toString() ?? "";
  return (
    <main className="flex justify-center">
      <DeletePollForm pollId={pollId} />
    </main>
  );
}
