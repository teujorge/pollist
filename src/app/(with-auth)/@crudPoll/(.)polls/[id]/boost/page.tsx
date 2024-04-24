import { auth } from "@clerk/nextjs/server";
import { Modal } from "@/app/components/Modal";
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

  return (
    <Modal>
      <BoostPoll userId={userId} pollId={props.params.id} />
    </Modal>
  );
}
