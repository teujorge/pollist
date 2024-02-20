import { Following } from "../components/Following";

export default function FollowingPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <Following userId={params.id} />
    </main>
  );
}
