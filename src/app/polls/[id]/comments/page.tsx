import Link from "next/link";
import { PollComments } from "@/app/components/Comments/PollComments";

export default function CommentsPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <Link href={`/polls/${params.id}`}>{"<-"}Back to poll</Link>
      <PollComments pollId={params.id} />
    </main>
  );
}
