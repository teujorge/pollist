import { DeletePollForm } from "@/app/components/CrudPoll/DeletePollForm";
import { Modal } from "@/app/components/Modal";

export default function DeletePollPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const pollId = searchParams?.id?.toString() ?? "";

  return (
    <Modal>
      <DeletePollForm pollId={pollId} />
    </Modal>
  );
}
