import { UserPendingList } from "../../components/UserPendingList";

export default function PendingPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <UserPendingList userId={params.id} />
    </main>
  );
}
