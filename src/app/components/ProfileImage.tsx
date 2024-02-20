import Image from "next/image";
import { twMerge } from "tailwind-merge";

export function ProfileImage(props: React.ComponentProps<typeof Image>) {
  return (
    <div
      className={`shimmer !rounded-full w-[${props.width}px] h-[${props.height}px] `}
    >
      <Image
        {...props}
        className={twMerge(props.className, "rounded-full object-cover")}
        style={{
          width: props.width,
          minWidth: props.width,
          height: props.height,
          minHeight: props.height,
        }}
        alt={props.alt}
      />
    </div>
  );
}
