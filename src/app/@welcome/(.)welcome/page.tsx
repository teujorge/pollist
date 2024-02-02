import { Modal } from "@/app/components/Modal";
import { Welcome } from "@/app/components/Welcome/Welcome";

export default async function WelcomePage() {
  return (
    <Modal>
      <Welcome />
    </Modal>
  );
}
