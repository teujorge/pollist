import { Modal } from "@/app/components/Modal";
import { PollComments } from "@/app/components/Comments/PollComments";

export default function CommentsModal({ params }: { params: { id: string } }) {
  return (
    <Modal className="w-full !max-w-[1000px]">
      <PollComments pollId={params.id} />
    </Modal>
  );
}
