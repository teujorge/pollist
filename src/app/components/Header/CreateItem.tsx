"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
// import { useState } from "react";
import { StackPlus } from "@phosphor-icons/react";
import { SignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
// import { CreatePollForm } from "../CrudPoll/CreatePollForm";
// import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export function CreateItem({ userId }: { userId: string | null }) {
  const pathname = usePathname();
  // const [isDrawerOpen, setIsDialogOpen] = useState(false);

  const CreateButtonContent = (
    <>
      <span className="hidden sm:inline">Create</span>
      <span className="sm:hidden">
        <StackPlus size={26} />
      </span>
    </>
  );

  return userId ? (
    // <Drawer open={isDrawerOpen} onOpenChange={setIsDialogOpen}>
    //   <DrawerTrigger
    //     className={cn(
    //       "h-fit w-fit underline decoration-transparent underline-offset-4 transition-colors hovact:text-primary",
    //       isDrawerOpen && "text-primary decoration-primary",
    //     )}
    //   >
    //     {CreateButtonContent}
    //   </DrawerTrigger>
    //   <DrawerContent className="flex transform-gpu flex-col gap-0 p-0 delay-300">
    //     <h3 className="border-b border-b-accent-dark px-6 pb-3 pt-6 text-xl font-semibold">
    //       Create A Poll
    //     </h3>
    //     <CreatePollForm
    //       className="px-6 pb-6 pt-3"
    //       onCreatePollStart={() => setIsDialogOpen(false)}
    //     />
    //   </DrawerContent>
    // </Drawer>
    <Link
      href="/polls/create"
      className={cn(
        "underline decoration-transparent underline-offset-4",
        pathname === "/polls/create" && "text-primary decoration-primary",
      )}
    >
      {CreateButtonContent}
    </Link>
  ) : (
    <SignInButton mode="modal">
      <button className="transition-colors hovact:text-purple-500">
        {CreateButtonContent}
      </button>
    </SignInButton>
  );
}
