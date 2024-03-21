import { CTA } from "@/app/components/CTA";
import { BlobBg } from "@/app/components/BlobBg";

export default function AboutPage() {
  return (
    <main>
      <BlobBg />

      <div className="relative z-10 flex flex-col gap-10 py-24">
        <h1 className="text-center text-7xl font-black md:text-9xl">
          Welcome to Pollist!
        </h1>
      </div>

      <section className="relative z-10 flex flex-col items-center gap-16 px-4 py-10">
        <h2 className="text-center text-xl font-semibold">
          Tired of endless scrolling through picture-perfect lives? 🙄 Pollist
          is your antidote to the ordinary, a place where questions are odder
          than your aunt&apos;s Facebook posts.
        </h2>

        <CTA />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card title="Engage on the Edge">
            <p>
              Pondering whether a cat video can truly change the world, or why
              we can&apos;t stop watching them? Pollist is your playground for
              the whimsical, the profound, and everything in between. 🎭
            </p>
          </Card>

          <Card title="Conversations, Not Just Comments">
            <p>
              This isn&apos;t your grandma&apos;s comment section. Dive into
              discussions where opinions clash, merge, and sometimes make
              absolutely no sense. And that&apos;s the beauty of it. 💬
            </p>
          </Card>

          <Card title="Find Your Tribe">
            <p>
              Connect with people who argue whether dogs wearing sweaters is a
              fashion statement or just plain silly. Spoiler: It&apos;s high
              fashion. 🐕‍🦺
            </p>
          </Card>

          <Card title="Public Polls: Your Soapbox Awaits">
            <p>
              Share your most pressing questions, from the mundane to the
              mind-boggling, and watch the world respond. Your soapbox in the
              digital age. 🚀
            </p>
          </Card>

          <Card title="Insightful Comments: Or So We Hope">
            <p>
              Engage in “deep” conversations, and maybe, just maybe, find the
              answers you&apos;ve been looking for. Or not. We&apos;re not
              philosophers here. 💡
            </p>
          </Card>

          <Card title="Social Sharing: Because Your Polls Deserve an Audience">
            <p>
              Spread your curiosity far and wide. Because what&apos;s the point
              of asking if a tree falls in a forest and no one&apos;s around to
              hear it? 🌳
            </p>
          </Card>

          {/* TODO: Placeholder for future interactive components */}
          {/* <FunFact /> */}
          {/* <QuirkyPoll /> */}
        </div>

        <h3>
          Ready to Dive Into the Rabbit Hole?{" "}
          <span className="text-yellow-300">
            Warning: Side effects may include sudden emotional triggering.
          </span>
        </h3>
      </section>
    </main>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-accent bg-background/40 p-4 shadow-md">
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      {children}
    </div>
  );
}
