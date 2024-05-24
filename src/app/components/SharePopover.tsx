"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Copy, Export, TwitterLogo, WhatsappLogo } from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SharePopover({
  copy = true,
  twitter = true,
  whatsapp = true,

  text,
  pathname,
}: {
  copy?: boolean;
  twitter?: boolean;
  whatsapp?: boolean;

  text: string;
  pathname: string;
}) {
  const url = "https://pollist.org" + pathname;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          <Export size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="py-2">
        {copy && (
          <Button
            variant="popover"
            onMouseDown={async () => {
              await navigator.clipboard.writeText(url);
              toast.success("URL copied to clipboard");
            }}
          >
            <Copy size={15} />
            Copy
          </Button>
        )}

        {twitter && (
          <a
            className={cn(
              buttonVariants({ variant: "popover" }),
              "hovact:bg-[#1DA1F2]/20 hovact:text-[#1DA1F2]",
            )}
            target="_blank"
            rel="noreferrer noopener"
            href={
              "https://twitter.com/intent/tweet?" +
              "via=Pollist" +
              "&source=tweetbutton" +
              `&original_referer=${encodeURIComponent(url)}` +
              `&text=${text}` +
              `&url=${url}`
            }
          >
            <TwitterLogo size={15} />
            Twitter
          </a>
        )}

        {whatsapp && (
          <a
            className={cn(
              buttonVariants({ variant: "popover" }),
              "hovact:bg-[#25D366]/20 hovact:text-[#25D366]",
            )}
            target="_blank"
            rel="noreferrer noopener"
            href={`https://api.whatsapp.com/send?text=${text}${encodeURIComponent("\n" + url)}`}
          >
            <WhatsappLogo size={15} />
            WhatsApp
          </a>
        )}
      </PopoverContent>
    </Popover>
  );
}
