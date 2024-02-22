import { USerFollowersList } from "@/app/users/components/UserFollowersList";

export default function FollowersPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <USerFollowersList userId={params.id} />
    </main>
  );
}
