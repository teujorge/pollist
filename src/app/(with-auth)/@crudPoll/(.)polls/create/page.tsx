"use client";

import { Modal } from "@/app/components/Modal";
import { useRef } from "react";
import { CreatePollForm } from "@/app/components/CrudPoll/CreatePollForm";

export default function CreatePollPage() {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <Modal ref={modalRef}>
      <CreatePollForm
        showBackButton
        popoverBoundary={modalRef.current ?? undefined}
      />
    </Modal>
  );
}
