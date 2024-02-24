import { Modal } from "@/app/components/Modal";
import { AllComments } from "@/app/components/Comments/AllComments";

export default function CommentsModal({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <Modal className="w-full !max-w-[1000px]">
      <AllComments pollId={params.id} parentId={searchParams.parentId} />
    </Modal>
  );
}
