/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TcpY2hkdR17
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { db } from "@/database/db";
import Link from "next/link";
import { PollCardVoting } from "@/app/components/PollCard/PollCardVoting";
import { auth } from "@clerk/nextjs";

export default async function PollPage({ params }: { params: { id: string } }) {
  const { userId } = auth();

  const poll = await db.poll.findUnique({
    where: {
      id: params.id,
    },
    include: {
      options: true,
      votes: true,
      author: true,
    },
  });

  if (!poll) return { notFound: true };

  return (
    <main className="flex min-h-full flex-col justify-center">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl">{poll.title}</h1>
          <h2>{poll.description}</h2>
          <span>
            Created by{" "}
            <Link href={`/users/${poll.author.id}`}>
              {poll.author.username}
            </Link>
          </span>
        </div>
        <div className="flex flex-row gap-2 text-sm text-neutral-400">
          Created on{" "}
          {new Date(poll.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {userId === poll.authorId && (
            <Link
              href={`/polls/delete?id=${poll.id}`}
              className="text-red-500 hovact:text-red-400"
            >
              Delete
            </Link>
          )}
        </div>
      </div>

      <PollCardVoting poll={poll} useRealtime={true} />

      {/* <BarChart className="aspect-[16/9] w-full" /> */}
    </main>
  );
}

// function BarChart(props) {
//   return (
//     <div {...props}>
//       <ResponsiveBar
//         data={[
//           { name: "Jan", count: 111 },
//           { name: "Feb", count: 157 },
//           { name: "Mar", count: 129 },
//           { name: "Apr", count: 150 },
//           { name: "May", count: 119 },
//           { name: "Jun", count: 72 },
//         ]}
//         keys={["count"]}
//         indexBy="name"
//         margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
//         padding={0.3}
//         colors={["#2563eb"]}
//         axisBottom={{
//           tickSize: 0,
//           tickPadding: 16,
//         }}
//         axisLeft={{
//           tickSize: 0,
//           tickValues: 4,
//           tickPadding: 16,
//         }}
//         gridYValues={4}
//         theme={{
//           tooltip: {
//             chip: {
//               borderRadius: "9999px",
//             },
//             container: {
//               fontSize: "12px",
//               textTransform: "capitalize",
//               borderRadius: "6px",
//             },
//           },
//           grid: {
//             line: {
//               stroke: "#f3f4f6",
//             },
//           },
//         }}
//         tooltipLabel={({ id }) => `${id}`}
//         enableLabel={false}
//         role="application"
//         ariaLabel="A bar chart showing data"
//       />
//     </div>
//   );
// }
