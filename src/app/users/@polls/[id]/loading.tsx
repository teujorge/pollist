import { Card } from "@/app/components/Card";
import { Loader } from "@/app/components/Loader";

export default function MyPollsLoading() {
  return (
    <Card className="h-fit w-full items-center md:w-1/2">
      <Loader />
    </Card>
  );
}
