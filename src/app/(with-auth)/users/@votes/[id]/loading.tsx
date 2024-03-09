import { Card } from "@/app/components/Card";
import { Loader } from "@/app/components/Loader";

export default function MyVotesLoading() {
  return (
    <Card className="hidden h-fit w-full items-center md:flex md:w-1/2">
      <Loader />
    </Card>
  );
}
