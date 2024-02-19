import { Card } from "@/app/components/Card";
import { Loader } from "@/app/components/Loader";

export default function MyVotesLoading() {
  return (
    <Card className="hidden items-center md:flex">
      <Loader />
    </Card>
  );
}
