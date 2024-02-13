import { Card } from "@/app/components/Card";
import { Loader } from "@/app/components/Loader";

export default function MyPollsLoading() {
  return (
    <Card className="items-center">
      <Loader />
    </Card>
  );
}
