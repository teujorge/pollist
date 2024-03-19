import { CreatePollForm } from "@/app/components/CrudPoll/CreatePollForm";
import { Modal } from "@/app/components/Modal";

export default function CreatePollPage() {
  return (
    <Modal>
      <CreatePollForm showBackButton />
    </Modal>
  );
}
