"use client";

import Link from "next/link";
import { X } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Loader } from "../Loader";
import { useApp } from "@/app/(with-auth)/app";
import { useState } from "react";
import { useDialog } from "@/app/hooks/useDialog";
import { ProfileImage } from "../ProfileImage";
import { cn, timeElapsed } from "@/lib/utils";
import { removeNotifications } from "./actions";
import { acceptFollow, declineFollow } from "@/app/(with-auth)/users/actions";
import {
  groupedPollCreated,
  groupedPollLikes,
  groupedComments,
  groupedCommentLikes,
  groupedFollowPending,
  groupedFollowAccepted,
} from "./utils";
import type {
  NotificationType,
  NotificationPollCreatedItem,
  NotificationPollLikeItem,
  NotificationCommentItem,
  NotificationCommentLikeItem,
  NotificationFollowAcceptedItem,
  NotificationFollowPendingItem,
} from "./actions";

type NotificationData =
  | NotificationPollCreatedItem
  | NotificationPollLikeItem
  | NotificationCommentItem
  | NotificationCommentLikeItem
  | NotificationFollowPendingItem
  | NotificationFollowAcceptedItem;

export function NotificationList() {
  const { notifications } = useApp();

  const notificationList: (
    | {
        type: "PollCreatedNotification";
        data: NotificationPollCreatedItem[];
      }
    | {
        type: "PollLikeNotification";
        data: NotificationPollLikeItem[];
      }
    | {
        type: "CommentNotification";
        data: NotificationCommentItem[];
      }
    | {
        type: "CommentLikeNotification";
        data: NotificationCommentLikeItem[];
      }
    | {
        type: "FollowPendingNotification";
        data: NotificationFollowPendingItem[];
      }
    | {
        type: "FollowAcceptedNotification";
        data: NotificationFollowAcceptedItem[];
      }
  )[] = [
    ...groupedPollCreated(notifications),
    ...groupedPollLikes(notifications),
    ...groupedComments(notifications),
    ...groupedCommentLikes(notifications),
    ...groupedFollowPending(notifications),
    ...groupedFollowAccepted(notifications),
  ].sort(
    (a, b) =>
      new Date(a.data[0]?.createdAt ?? new Date()).getTime() -
      new Date(b.data[0]?.createdAt ?? new Date()).getTime(),
  );

  return (
    <div
      className="flex min-w-fit flex-col items-center gap-2 overflow-y-auto overflow-x-hidden overscroll-y-contain px-6 pb-6 pt-3"
      style={{ maxHeight: "calc(100dvh - 100px)" }}
    >
      {notificationList.length > 0 ? (
        notificationList.map((group) => (
          <NotificationCard
            key={`${group.type}-${group.data[0]?.id}`}
            item={group}
          />
        ))
      ) : (
        <div className="w-full px-3 py-2 text-left text-sm text-accent-foreground">
          No new notifications
        </div>
      )}
    </div>
  );
}

function NotificationCard({
  item,
}: {
  item: {
    type: NotificationType;
    data: NotificationData[];
  };
}) {
  async function handleRemove() {
    try {
      await removeNotifications({
        type: item.type,
        ids: item.data.map((d) => d.id),
      });
    } catch (error) {
      toast.error("Failed to remove notification");
    }
  }

  const card = (() => {
    switch (item.type) {
      case "PollCreatedNotification":
        return (
          <PollCreatedNotificationCard
            pollCreatedNotifications={
              item.data as NotificationPollCreatedItem[]
            }
          />
        );
      case "PollLikeNotification":
        return (
          <PollLikeNotificationCard
            pollLikeNotifications={item.data as NotificationPollLikeItem[]}
          />
        );
      case "CommentNotification":
        return (
          <CommentNotificationCard
            commentNotifications={item.data as NotificationCommentItem[]}
          />
        );
      case "CommentLikeNotification":
        return (
          <CommentLikeNotificationCard
            likeNotifications={item.data as NotificationCommentLikeItem[]}
          />
        );
      case "FollowPendingNotification":
        return (
          <FollowPendingNotificationCard
            followNotifications={item.data as NotificationFollowPendingItem[]}
          />
        );
      case "FollowAcceptedNotification":
        return (
          <FollowAcceptedNotificationCard
            followNotifications={item.data as NotificationFollowAcceptedItem[]}
          />
        );
    }
  })();

  return (
    <div className="relative flex w-full select-none flex-row gap-2 rounded-md border border-accent bg-accent-dark2 p-4 transition-all duration-200 sm:border-accent-dark">
      {card}
      <button
        className="absolute right-0 top-0 rounded-full p-1 text-foreground outline-none transition-colors hovact:text-destructive"
        onClick={handleRemove}
      >
        <X size={15} />
      </button>
    </div>
  );
}

function PollCreatedNotificationCard({
  pollCreatedNotifications,
}: {
  pollCreatedNotifications: NotificationPollCreatedItem[];
}) {
  const dialog = useDialog();

  async function handleLinkClick() {
    dialog.setIsNotificationsOpen?.(false);
    try {
      await removeNotifications({
        type: "PollCreatedNotification",
        ids: [pollCreatedNotifications[0]!.id],
      });
    } catch (e) {
      toast.error("Failed to remove notification");
    }
  }

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/polls/${pollCreatedNotifications[0]!.poll.id}`}
        onClick={handleLinkClick}
      >
        New poll:{" "}
        <q className="text-sm font-light">
          {pollCreatedNotifications[0]!.poll.title}
        </q>
      </Link>

      <NotificationInfo className="pt-1">
        Created By: {pollCreatedNotifications[0]!.poll.author.username}
      </NotificationInfo>

      <NotificationInfo>
        {timeElapsed(pollCreatedNotifications[0]!.createdAt)} ago
      </NotificationInfo>
    </div>
  );
}

function PollLikeNotificationCard({
  pollLikeNotifications,
}: {
  pollLikeNotifications: NotificationPollLikeItem[];
}) {
  const dialog = useDialog();

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/polls/${pollLikeNotifications[0]!.pollLike.poll.id}`}
        onClick={() => dialog.setIsNotificationsOpen?.(false)}
      >
        People liked your poll:
        <br />
        <q className="text-sm font-light">
          {pollLikeNotifications[0]!.pollLike.poll.title}
        </q>
      </Link>

      <NotificationInfo className="pt-1">
        Who:{" "}
        {notificationBy(
          pollLikeNotifications.map((n) => n.pollLike.author.username),
        )}
      </NotificationInfo>

      <NotificationInfo>
        {timeElapsed(pollLikeNotifications[0]!.createdAt)} ago
      </NotificationInfo>
    </div>
  );
}

function CommentNotificationCard({
  commentNotifications,
}: {
  commentNotifications: NotificationCommentItem[];
}) {
  const dialog = useDialog();

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      {commentNotifications[0]!.comment.parent?.id ? (
        <>
          <Link
            href={`/polls/${commentNotifications[0]!.comment.poll.id}?parentId=${commentNotifications[0]!.comment.parent.id}`}
            onClick={() => dialog.setIsNotificationsOpen?.(false)}
          >
            People replied to your comment:{" "}
            <q className="text-sm font-light">
              {commentNotifications[0]!.comment.parent.text}
            </q>
          </Link>

          <NotificationInfo className="pt-1">
            Who:{" "}
            {notificationBy(
              commentNotifications.map((n) => n.comment.author.username),
            )}
          </NotificationInfo>

          <NotificationInfo>
            {timeElapsed(commentNotifications[0]!.createdAt)} ago
          </NotificationInfo>
        </>
      ) : (
        <>
          <Link
            href={`/polls/${commentNotifications[0]!.comment.poll.id}`}
            onClick={() => dialog.setIsNotificationsOpen?.(false)}
          >
            People commented on your poll:{" "}
            <q className="text-sm font-light">
              {commentNotifications[0]!.comment.poll.title}
            </q>
          </Link>

          <NotificationInfo className="pt-1">
            Who:{" "}
            {notificationBy(
              commentNotifications.map(
                (n) => n.comment.author.username ?? "Anon",
              ),
            )}
          </NotificationInfo>

          <NotificationInfo>
            {timeElapsed(commentNotifications[0]!.createdAt)} ago
          </NotificationInfo>
        </>
      )}
    </div>
  );
}

function CommentLikeNotificationCard({
  likeNotifications,
}: {
  likeNotifications: NotificationCommentLikeItem[];
}) {
  const dialog = useDialog();

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/polls/${likeNotifications[0]!.commentLike.comment.poll.id}?parentId=${likeNotifications[0]!.commentLike.comment.id}`}
        onClick={() => dialog.setIsNotificationsOpen?.(false)}
      >
        People liked your comment:
        <br />
        <q className="text-sm font-light">
          {likeNotifications[0]!.commentLike.comment.text}
        </q>
        <br />
        On the poll:
        <br />
        <q className="text-sm font-light">
          {likeNotifications[0]!.commentLike.comment.poll.title}
        </q>
      </Link>

      <NotificationInfo className="pt-1">
        Who:{" "}
        {notificationBy(
          likeNotifications.map((n) => n.commentLike.author.username),
        )}
      </NotificationInfo>

      <NotificationInfo>
        {timeElapsed(
          likeNotifications[likeNotifications.length - 1]!.createdAt,
        )}{" "}
        ago
      </NotificationInfo>
    </div>
  );
}

function FollowPendingNotificationCard({
  followNotifications,
}: {
  followNotifications: NotificationFollowPendingItem[];
}) {
  const followNotification = followNotifications[0]!;
  const dialog = useDialog();

  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  async function handleAccept() {
    setIsAccepting(true);
    try {
      await acceptFollow(followNotification.follow.follower.id);
    } catch (error) {
      setIsAccepting(false);
      toast.error("Failed to accept follow request");
    }
  }

  async function handleDecline() {
    setIsDeclining(true);
    try {
      await declineFollow(followNotification.follow.follower.id);
    } catch (error) {
      setIsDeclining(false);
      toast.error("Failed to decline follow request");
    }
  }

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/users/${followNotification.follow.follower.username}`}
        className="flex flex-row items-center justify-center gap-1"
        onClick={() => dialog.setIsNotificationsOpen?.(false)}
      >
        <ProfileImage
          src={followNotification.follow.follower.imageUrl}
          username={followNotification.follow.follower.username}
          size={24}
        />
        <span className="font-bold">
          {followNotification.follow.follower.username}
        </span>
      </Link>

      <span>Requested to follow you</span>

      <div className="flex flex-row gap-0.5">
        <button
          disabled={isAccepting || isDeclining}
          onClick={handleAccept}
          className={`flex h-7 w-14 items-center justify-center text-sm text-green-500 underline decoration-transparent hovact:decoration-green-500
            ${isDeclining && "pointer-events-none opacity-50"}
          `}
        >
          {isAccepting ? <Loader className="h-4 w-4 border-2" /> : "Accept"}
        </button>
        <button
          disabled={isAccepting || isDeclining}
          onClick={handleDecline}
          className={`flex h-7 w-14 items-center justify-center text-sm text-destructive underline decoration-transparent hovact:decoration-destructive
            ${isAccepting && "pointer-events-none opacity-50"}
          `}
        >
          {isDeclining ? <Loader className="h-4 w-4 border-2" /> : "Decline"}
        </button>
      </div>

      <NotificationInfo className="pt-1">
        {timeElapsed(followNotification.createdAt)} ago
      </NotificationInfo>
    </div>
  );
}

function FollowAcceptedNotificationCard({
  followNotifications,
}: {
  followNotifications: NotificationFollowAcceptedItem[];
}) {
  const followNotification = followNotifications[0]!;
  const dialog = useDialog();

  async function handleLinkClick() {
    dialog.setIsNotificationsOpen?.(false);
    try {
      await removeNotifications({
        type: "FollowAcceptedNotification",
        ids: [followNotification.id],
      });
    } catch (e) {
      toast.error("Failed to remove notification");
    }
  }

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/users/${followNotification.follow.followee.username}`}
        className="flex flex-row items-center justify-center gap-1"
        onClick={handleLinkClick}
      >
        <ProfileImage
          src={followNotification.follow.followee.imageUrl}
          username={followNotification.follow.followee.username}
          size={24}
        />
        <p className="font-bold">
          {followNotification.follow.followee.username}
        </p>
      </Link>

      <span>Accepted your follow request</span>

      <NotificationInfo className="pt-1">
        {timeElapsed(followNotification.createdAt)} ago
      </NotificationInfo>
    </div>
  );
}

function notificationBy(usernames: string[]): string {
  if (usernames.length === 1) {
    return `${usernames[0]}`;
  }

  if (usernames.length === 2) {
    return `${usernames[0]} and ${usernames[1]}`;
  }

  return `${usernames[0]}, ${usernames[1]}, and ${usernames.length - 2} others`;
}

function NotificationInfo({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("px-1 text-xs text-accent-foreground", className)}>
      {children}
    </span>
  );
}
