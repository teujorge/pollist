import Image from "next/image";
import DefaultImage from "~/public/default-profile-icon.webp";
import { cn } from "@/lib/utils";
import type { StaticImageData } from "next/image";

type ProfileImageProps = {
  src: StaticImageData | string | undefined | null;
  username: string | undefined | null;
  size: number;
  className?: string;
};

export function ProfileImage(props: ProfileImageProps) {
  return (
    <div
      className="shimmer !rounded-full"
      style={{
        width: props.size,
        minWidth: props.size,
        maxWidth: props.size,
        height: props.size,
        minHeight: props.size,
        maxHeight: props.size,
      }}
    >
      <Image
        src={props.src ?? DefaultImage}
        alt={`${props.username} profile image`}
        width={props.size}
        height={props.size}
        className={cn(
          props.className,
          "rounded-full object-cover object-center",
        )}
        style={{
          width: props.size,
          minWidth: props.size,
          maxWidth: props.size,
          height: props.size,
          minHeight: props.size,
          maxHeight: props.size,
        }}
      />
    </div>
  );
}
