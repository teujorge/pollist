import { TabManagement } from "./components/TabManagement";
import { UserPageProvider } from "./context";

export default function UserPageLayout({
  children,
  polls,
  votes,
  follows,
}: {
  children: React.ReactNode;
  polls: React.ReactNode;
  votes: React.ReactNode;
  follows: React.ReactNode;
}) {
  return (
    <>
      <main className="flex w-full flex-col gap-2 overflow-hidden md:gap-4 ">
        <UserPageProvider>
          {children}
          <TabManagement tabKey="polls">{polls}</TabManagement>
          <TabManagement tabKey="votes">{votes}</TabManagement>
        </UserPageProvider>
      </main>
      {follows}
    </>
  );
}
