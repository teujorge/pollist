import { Modal } from "@/app/components/Modal";
import { Comments } from "@/app/polls/components/Comments";

export default function CommentsModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <Comments pollId={params.id} />
    </Modal>
  );
}
