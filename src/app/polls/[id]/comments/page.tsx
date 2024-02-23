import Link from "next/link";
import { Comments } from "@/app/polls/components/Comments";

export default function CommentsPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <Link href={`/polls/${params.id}`}>{"<-"}Back to poll</Link>
      <Comments pollId={params.id} />
    </main>
  );
}
