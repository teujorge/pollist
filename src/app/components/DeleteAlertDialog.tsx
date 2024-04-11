"use client";

import { cn } from "@/lib/utils";
import { Trash } from "@phosphor-icons/react";
import { Loader } from "./Loader";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

type DeleteAlertDialogProps = {
  title?: string;
  description?: string;
  awaitType?: "none" | "promise" | "forever";
  onDelete: () => void | Promise<boolean | void>;
  className?: string;
};

export function DeleteAlertDialog({
  title,
  description,
  awaitType = "none",
  onDelete,
  className,
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
      <AlertDialogTrigger
        className={cn(
          buttonVariants({ variant: "popover" }),
          "hovact:bg-destructive/20 hovact:text-destructive",
          className,
        )}
      >
        <Trash size={15} /> Delete
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
