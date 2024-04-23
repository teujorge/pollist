import "server-only";
import { PostHog } from "posthog-node";

function serverSideAnalytics() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
    flushAt: 1,
    flushInterval: 1,
  });

  return posthogClient;
}

export const analyticsServerClient = serverSideAnalytics();
