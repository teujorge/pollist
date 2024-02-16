import Image from "next/image";

export function ProfileImage(props: React.ComponentProps<typeof Image>) {
  return (
    <div
      className={`shimmer !rounded-full w-[${props.width}px] h-[${props.height}px]`}
    >
      <Image {...props} alt={props.alt} />
    </div>
  );
}
