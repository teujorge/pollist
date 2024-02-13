import { Card } from "@/app/components/Card";

export default function UserPageLoading() {
  return (
    <Card className="flex w-36 max-w-36 flex-col items-center">
      <div className="shimmer h-[100px] w-[100px] !rounded-full" />
      <h1 className="shimmer flex w-full items-center justify-center text-transparent">
        -username-
      </h1>
    </Card>
  );
}
