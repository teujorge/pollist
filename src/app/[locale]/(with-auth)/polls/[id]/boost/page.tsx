import { auth } from "@clerk/nextjs";
import { BoostPoll } from "@/app/components/CrudPoll/BoostPoll";

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function BoostPollPage(props: Props) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return <BoostPoll userId={userId} pollId={props.params.id} />;
}
