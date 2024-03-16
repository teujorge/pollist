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
      <DialogContent className="max-h-[90dvh] max-w-[90dvw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscriptions</DialogTitle>
        </DialogHeader>
        <PricingTableEmbed userId={userId} />
      </DialogContent>
    </Dialog>
  );
}
