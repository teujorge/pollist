import { Modal } from "@/app/components/Modal";
import { Following } from "../../../[id]/components/Following";

export default function UserFollowers({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <Following userId={params.id} />
    </Modal>
  );
}
