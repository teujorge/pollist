import { Modal } from "@/app/components/Modal";
import { Followers } from "../../../[id]/components/Followers";

export default function UserFollowers({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <Followers userId={params.id} />
    </Modal>
  );
}
