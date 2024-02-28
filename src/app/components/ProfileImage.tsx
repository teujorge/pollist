import Image from "next/image";
import DefaultImage from "public/default-profile-icon.jpg";
import { cn } from "@/lib/utils";

type ProfileImageProps = {
  src: string | undefined | null;
  username: string | undefined | null;
  size: number;
  className?: string;
};

export function ProfileImage(props: ProfileImageProps) {
  return (
    <div
      className={`shimmer !rounded-full w-[${props.size}px] h-[${props.size}px] `}
    >
      <Image
        src={props.src ?? DefaultImage}
        alt={`${props.username} profile image`}
        width={props.size}
        height={props.size}
        className={cn(props.className, "rounded-full object-cover")}
        style={{
          width: props.size,
          minWidth: props.size,
          height: props.size,
          minHeight: props.size,
        }}
      />
    </div>
  );
}
