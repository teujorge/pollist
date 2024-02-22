import { Modal } from "@/app/components/Modal";
import { UserFollowedList } from "@/app/users/components/UserFollowedList";

export default function UserFollowing({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <UserFollowedList userId={params.id} />
    </Modal>
  );
}
