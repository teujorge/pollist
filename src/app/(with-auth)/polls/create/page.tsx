import { CreatePollForm } from "@/app/components/CrudPoll/CreatePollForm";

export const dynamic = "force-static";

export default function CreatePollPage() {
  return (
    <main className="flex max-w-full justify-center">
      <CreatePollForm />
    </main>
  );
}
