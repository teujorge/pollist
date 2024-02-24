import Link from "next/link";
import { AllComments } from "@/app/components/Comments/AllComments";

export default function CommentsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <main>
      <Link href={`/polls/${params.id}`}>{"<-"}Back to poll</Link>
      <AllComments pollId={params.id} parentId={searchParams.parentId} />
    </main>
  );
}
