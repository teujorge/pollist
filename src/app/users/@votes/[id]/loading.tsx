import { Card } from "@/app/components/Card";
import { Loader } from "@/app/components/Loader";

export default function MyVotesLoading() {
  return (
    <Card className="items-center">
      <Loader />
    </Card>
  );
}
