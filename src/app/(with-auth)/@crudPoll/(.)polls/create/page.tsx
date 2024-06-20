"use client";

import { Modal } from "@/app/components/Modal";
import { useRef } from "react";
import { CreatePollForm } from "@/app/components/CrudPoll/CreatePollForm";

export default function CreatePollPage() {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <Modal ref={modalRef} className="w-full max-w-[762px]">
      <h1 className="w-full text-center text-2xl font-bold">Create A Poll</h1>
      <CreatePollForm
        showBackButton
        popoverBoundary={modalRef.current ?? undefined}
      />
    </Modal>
  );
}
