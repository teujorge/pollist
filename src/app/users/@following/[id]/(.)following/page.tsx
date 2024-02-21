import { Modal } from "@/app/components/Modal";
import { Following } from "@/app/users/components/Following";

export default function UserFollowing({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <Following userId={params.id} />
    </Modal>
  );
}
