"use client";

import { Loader } from "./Loader";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteAlertDialogProps = {
  title?: string;
  description?: string;
  willAwait?: boolean;
  onDelete: () => void | Promise<boolean | void>;
};

export function DeleteAlertDialog(props: DeleteAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [awaiting, setAwaiting] = useState(false);

  async function handleAwaitedDelete() {
    // await async
    if (props.willAwait) {
      setAwaiting(true);
      const success = await props.onDelete();
      if (success === undefined || success === true) {
        setIsOpen(false);
      } else {
        setAwaiting(false);
      }
    }

    // do not await async
    else {
      void props.onDelete();
      setIsOpen(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="w-fit font-bold transition-colors hovact:text-red-500">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {props.title ?? "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {props.description ??
              "This action cannot be undone. This will permanently delete and remove your data from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={awaiting}
            className="border-neutral-700 hovact:bg-neutral-900"
          >
            Cancel
          </AlertDialogCancel>
          <div className="flex h-9 w-24 items-center justify-center">
            {awaiting ? (
              <Loader />
            ) : (
              <button
                disabled={awaiting}
                className="rounded-md bg-white px-4 py-2 text-sm text-black transition-colors hovact:bg-red-500 hovact:text-white"
                onClick={handleAwaitedDelete}
              >
                Continue
              </button>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
