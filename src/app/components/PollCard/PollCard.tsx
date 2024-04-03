import Link from "next/link";
import AnonProfileImage from "~/public/default-profile-icon.webp";
import { ProfileImage } from "../ProfileImage";
import { PollCardActions } from "@/app/components/PollCard/PollCardActions";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { cn, uppercaseFirstLetterOfEachSentence } from "@/lib/utils";
import type { PollsDetails } from "../InfinitePolls/actions";

export type PollCardProps = {
  userId: string | null;
  poll: PollsDetails[number];
  highlightedUserId?: string;
  showCommentsButton?: boolean;
};

export function PollCard({
  userId,
  poll,
  highlightedUserId,
  showCommentsButton = true,
}: PollCardProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-accent bg-accent/10 p-6 shadow-md">
      <Link
        href={`/users/${poll.author.username}`}
        className={cn(
          "flex w-fit flex-row items-center gap-2 rounded-lg !bg-opacity-25 p-2 pl-0 transition-all [&>div>p]:hovact:text-primary [&>div>span]:hovact:text-purple-600 [&>div]:hovact:border-[#d0b3f5]",
          poll.anonymous && poll.authorId !== userId && "pointer-events-none",
        )}
      >
        <div className="rounded-full border-[3px] border-background transition-colors">
          <ProfileImage
            src={
              poll.anonymous && poll.authorId !== userId
                ? AnonProfileImage
                : poll.author.imageUrl
            }
            username={poll.author.username}
            size={38}
          />
        </div>

        <div className="flex flex-col justify-center gap-0.5 border-0">
          <p className="text-foreground transition-colors">
            {poll.author.username}
            {poll.anonymous && userId === poll.authorId && (
              <span className="text-sm italic"> (Anonymous)</span>
            )}
          </p>
          <span className="text-xs text-accent-foreground transition-colors">
            {new Date(poll.createdAt).toLocaleDateString(undefined, {
              year: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </Link>
      <Link href={`/polls/${poll.id}`} className="w-fit">
        <h2 className="text-2xl font-bold">
          {uppercaseFirstLetterOfEachSentence(poll.title)}
        </h2>
      </Link>

      <SignedIn>
        <PollCardActions
          poll={poll}
          highlightedUserId={highlightedUserId}
          showCommentsButton={showCommentsButton}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="w-full text-left">
            <PollCardActions
              poll={poll}
              highlightedUserId={highlightedUserId}
              showCommentsButton={showCommentsButton}
            />
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
