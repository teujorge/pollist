"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { StackPlus } from "@phosphor-icons/react";
import { SignInButton } from "@clerk/nextjs";
import { CreatePollForm } from "../CrudPoll/CreatePollForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function CreateItem({ userId }: { userId: string | null }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const CreateButtonContent = (
    <>
      <span className="hidden sm:inline">Create</span>
      <span className="sm:hidden">
        <StackPlus size={26} />
      </span>
    </>
  );

  return userId ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        className={cn(
          "h-fit w-fit underline decoration-transparent underline-offset-4 transition-colors hovact:text-primary",
          isDialogOpen && "text-primary decoration-primary",
        )}
      >
        {CreateButtonContent}
      </DialogTrigger>
      <DialogContent className="flex transform-gpu flex-col gap-0 p-0 delay-200">
        <h3 className="border-b border-b-accent-dark px-6 pb-3 pt-6 text-xl font-semibold">
          Create A Poll
        </h3>
        <CreatePollForm className="px-6 pb-6 pt-3" />
      </DialogContent>
    </Dialog>
  ) : (
    <SignInButton mode="modal">
      <button className="transition-colors hovact:text-purple-500">
        {CreateButtonContent}
      </button>
    </SignInButton>
  );
}
