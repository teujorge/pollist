import { auth } from "@clerk/nextjs";
import { Modal } from "@/app/components/Modal";
import { FeaturePoll } from "@/app/components/CrudPoll/FeaturePoll";

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function FeaturePollPage(props: Props) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <Modal>
      <FeaturePoll userId={userId} pollId={props.params.id} />
    </Modal>
  );
}
