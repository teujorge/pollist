"use server";

import { db } from "@/database/prisma";

export async function delMultiUsers() {
  if (process.env.NODE_ENV !== "development") {
    console.error("This function is only available in development mode.");
    return;
  }

  if (process.env.ADMIN_ID === undefined) {
    console.error("Bad ADMIN_ID.");
    return;
  }

  console.log();
  console.log("Deleting test users...");

  await db.user.deleteMany({ where: { username: { startsWith: "user" } } });

  console.log("Test users deleted!");
  console.log();
}

async function createTestUsers(count: number) {
  const userPromises = [];

  for (let i = 0; i < count; i++) {
    userPromises.push(
      db.user
        .create({
          data: {
            id: `user${i}`,
            username: `user${i}`,
          },
        })
        .catch(console.error),
    );
  }

  await Promise.all(userPromises);
}

export async function multiVoteOn({
  pollId,
  voteCount,
  voteDistribution,
}: {
  pollId: string;
  voteCount: number;
  voteDistribution?: Record<string, number>;
}) {
  if (process.env.NODE_ENV !== "development") {
    console.error("This function is only available in development mode.");
    return;
  }

  if (process.env.ADMIN_ID === undefined) {
    console.error("Bad ADMIN_ID.");
    return;
  }

  if (voteDistribution) {
    const totalWeight = Object.values(voteDistribution).reduce(
      (acc, weight) => acc + weight,
      0,
    );

    if (totalWeight !== 100) {
      console.error("Vote Distribution Error: Total weight must be 100.");
      return;
    }
  }

  // ensure all test users exist
  console.log();
  console.log("Creating test users...");
  await createTestUsers(voteCount);
  console.log("Test users created!");
  console.log();

  try {
    // poll details
    console.log("Finding poll...");
    const poll = await db.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });

    if (!poll) {
      console.error("Poll not found.");
      return;
    }

    console.log("Poll found!");
    console.log();
    console.log("Voting...");

    for (let i = 0; i < voteCount; i++) {
      let optionId: string | undefined = undefined;

      // select option based on distribution
      if (voteDistribution) {
        const random = Math.random();
        let cumulative = 0;

        for (const [_optionId, weight] of Object.entries(voteDistribution)) {
          cumulative += weight / 100;

          if (random < cumulative) {
            optionId = _optionId;
            break;
          }
        }
      }
      // select random option
      else {
        optionId =
          poll.options[Math.floor(Math.random() * poll.options.length)]?.id;
      }

      if (!optionId) {
        console.error("Option not found.");
        return;
      }

      // random delay
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));
      // non-awaited vote
      db.vote
        .create({
          data: {
            pollId: pollId,
            optionId: optionId,
            voterId: `user${i}`,
          },
        })
        .catch(console.error);
    }

    console.log("Voting complete!");
    console.log();
  } catch (error) {
    console.error(error);
  }
}
