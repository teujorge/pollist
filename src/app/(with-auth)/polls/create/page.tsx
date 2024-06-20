import { CreatePollForm } from "@/app/components/CrudPoll/CreatePollForm";

export default function CreatePollPage() {
  return (
    <main className="flex w-full max-w-[762px] flex-col justify-center">
      <h1 className="text-2xl font-bold">Create A Poll</h1>
      <CreatePollForm />
    </main>
  );
}
