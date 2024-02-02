/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TcpY2hkdR17
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

export default function PollPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Poll Title</h1>
          <desc>Created by John Doe</desc>
        </div>
        <div className="text-sm text-neutral-400">
          Created on January 1, 2024
        </div>
      </div>

      {/* content */}
      <ul className="divide-y divide-neutral-800">
        <li className="py-4">
          <div className="flex items-center justify-between">
            <div>Option 1</div>
            <div className="text-sm text-neutral-400">100 votes</div>
          </div>
        </li>
        <li className="py-4">
          <div className="flex items-center justify-between">
            <div>Option 2</div>
            <div className="text-sm text-neutral-400">50 votes</div>
          </div>
        </li>
        <li className="py-4">
          <div className="flex items-center justify-between">
            <div>Option 3</div>
            <div className="text-sm text-neutral-400">25 votes</div>
          </div>
        </li>
      </ul>

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
