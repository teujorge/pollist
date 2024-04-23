import { auth } from "@clerk/nextjs";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function defaultRatelimit(userId?: string | undefined | null) {
  let _userId = userId;

  if (!userId) {
    const { user } = auth();
    _userId = user?.id;
  }

  if (!_userId) throw new Error("You must be logged in to perform this action");

  const { success } = await ratelimit.limit(_userId);

  if (!success) throw new Error("You are being rate limited");
}
