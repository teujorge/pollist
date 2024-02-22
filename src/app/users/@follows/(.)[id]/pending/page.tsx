import { Modal } from "@/app/components/Modal";
import { UserPendingList } from "@/app/users/components/UserPendingList";

export default function UserPending({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <UserPendingList userId={params.id} />
    </Modal>
  );
}
