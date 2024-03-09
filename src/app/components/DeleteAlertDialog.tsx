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
      <AlertDialogTrigger className="hovact:text-destructive w-fit font-bold transition-colors">
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
          <AlertDialogCancel disabled={awaiting}>Cancel</AlertDialogCancel>
          <div className="flex h-9 w-24 items-center justify-center">
            {awaiting ? (
              <Loader />
            ) : (
              <Button
                disabled={awaiting}
                variant="destructive"
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
