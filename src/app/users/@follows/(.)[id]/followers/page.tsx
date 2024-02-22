import { Modal } from "@/app/components/Modal";
import { USerFollowersList } from "@/app/users/components/UserFollowersList";

export default function UserFollowers({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <USerFollowersList userId={params.id} />
    </Modal>
  );
}
