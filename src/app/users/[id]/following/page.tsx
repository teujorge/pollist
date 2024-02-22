import { UserFollowedList } from "@/app/users/components/UserFollowedList";

export default function FollowingPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <UserFollowedList userId={params.id} />
    </main>
  );
}
