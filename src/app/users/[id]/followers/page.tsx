import { Followers } from "../components/Followers";

export default function FollowersPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <Followers userId={params.id} />
    </main>
  );
}
