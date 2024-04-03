"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { WhatsAppSvg } from "../svgs/WhatsAppSvg";
import { buttonVariants } from "@/components/ui/button";
import { CopyIcon, Share2Icon, TwitterLogoIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SharePopOver({
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
  const cnClassName = cn(
    buttonVariants({ variant: "ghost", size: "sm" }),
    "w-full rounded-none flex justify-start gap-2 ",
  );

  const url = "https://pollist.org" + pathname;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <Share2Icon />
        </button>
      </PopoverTrigger>
      <PopoverContent className="py-2">
        {copy && (
          <button
            className={cnClassName}
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              toast.success("Copied to clipboard");
            }}
          >
            <CopyIcon />
            Copy
          </button>
        )}

        {twitter && (
          <a
            className={cnClassName}
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
            <TwitterLogoIcon />
            Twitter
          </a>
        )}

        {whatsapp && (
          <a
            className={cnClassName}
            target="_blank"
            rel="noreferrer noopener"
            href={`https://api.whatsapp.com/send?text=${text}${encodeURIComponent("\n" + url)}`}
          >
            <WhatsAppSvg className="h-[15px] w-[15px] fill-foreground" />
            WhatsApp
          </a>
        )}

      </PopoverContent>
    </Popover>
  );
}
