import { PricingTableEmbed } from "./PricingTableEmbed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PricingTable({ userId }: { userId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-[4px] bg-white px-2 text-xs text-accent">
          UPGRADE
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[90dvw]">
        <DialogHeader>
          <DialogTitle>Subscriptions</DialogTitle>
        </DialogHeader>
        <div className="h-full w-full overflow-y-auto rounded-lg">
          <PricingTableEmbed userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
