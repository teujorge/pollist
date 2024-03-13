"use client";

import { Loader } from "./Loader";
import { Button } from "@/components/ui/button";
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
  awaitType?: "none" | "promise" | "forever";
  onDelete: () => void | Promise<boolean | void>;
};

export function DeleteAlertDialog({
  title,
  description,
  awaitType = "none",
  onDelete,
}: DeleteAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [awaiting, setAwaiting] = useState(false);

  async function handleAwaitedDelete() {
    // await promise or forever
    if (awaitType === "promise" || awaitType === "forever") {
      setAwaiting(true);
      const success = await onDelete();

      if (awaitType === "forever") return;

      if (success === undefined || success === true) {
        setIsOpen(false);
      } else {
        setAwaiting(false);
      }
    }

    // do not await
    else {
      void onDelete();
      setIsOpen(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="w-fit font-bold transition-colors hovact:text-destructive">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ?? "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ??
              "This action cannot be undone. This will permanently delete and remove your data from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={awaiting}>Cancel</AlertDialogCancel>
          <div className="flex h-9 w-full items-center justify-center sm:w-24">
            {awaiting ? (
              <Loader />
            ) : (
              <Button
                disabled={awaiting}
                variant="destructive"
                className="w-full"
                onClick={handleAwaitedDelete}
              >
                Continue
              </Button>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
