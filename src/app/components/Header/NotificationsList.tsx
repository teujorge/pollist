"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Loader } from "../Loader";
import { useApp } from "@/app/(with-auth)/app";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ProfileImage } from "../ProfileImage";
import { useNotifications } from "./NotificationsBell";
import { removeNotifications } from "./actions";
import { useEffect, useState } from "react";
import { acceptFollow, declineFollow } from "@/app/(with-auth)/users/actions";
import type {
  NotificationType,
  NotificationPollLikeItem,
  NotificationCommentItem,
  NotificationCommentLikeItem,
  NotificationFollowAcceptedItem,
  NotificationFollowPendingItem,
} from "./actions";

type NotificationData =
  | NotificationPollLikeItem
  | NotificationCommentItem
  | NotificationCommentLikeItem
  | NotificationFollowPendingItem
  | NotificationFollowAcceptedItem;

export function NotificationList() {
  const { notifications } = useApp();

  function groupedPollLikes(): {
    type: "PollLikeNotification";
    data: NotificationPollLikeItem[];
  }[] {
    // Group pollLikes by pollId and map them to the desired structure
    const groupedObject = notifications.pollLikes.reduce(
      (acc, notification) => {
        const key = notification.pollLike.pollId;
        if (!acc[key]) acc[key] = [];
        acc[key]?.push(notification);
        return acc;
      },
      {} as Record<string, NotificationPollLikeItem[]>,
    );

    const groupedArray = Object.values(groupedObject).map((group) => ({
      type: "PollLikeNotification" as const,
      data: group.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    }));

    return groupedArray;
  }

  function groupedComments(): {
    type: "CommentNotification";
    data: NotificationCommentItem[];
  }[] {
    // Group comments by pollId and map them to the desired structure
    const groupedObject = notifications.comments.reduce(
      (acc, notification) => {
        const key = notification.comment.pollId;
        if (!acc[key]) acc[key] = [];
        acc[key]?.push(notification);
        return acc;
      },
      {} as Record<string, NotificationCommentItem[]>,
    );

    const groupedArray = Object.values(groupedObject).map((group) => ({
      type: "CommentNotification" as const,
      data: group.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    }));

    return groupedArray;
  }

  function groupedCommentLikes(): {
    type: "CommentLikeNotification";
    data: NotificationCommentLikeItem[];
  }[] {
    // Group commentLikes by pollId and map them to the desired structure
    const groupedObject = notifications.commentLikes.reduce(
      (acc, notification) => {
        const key = notification.commentLike.comment.pollId;
        if (!acc[key]) acc[key] = [];
        acc[key]?.push(notification);
        return acc;
      },
      {} as Record<string, NotificationCommentLikeItem[]>,
    );

    const groupedArray = Object.values(groupedObject).map((group) => ({
      type: "CommentLikeNotification" as const,
      data: group.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    }));

    return groupedArray;
  }

  const notificationList: (
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
    ...groupedPollLikes(),
    ...groupedComments(),
    ...groupedCommentLikes(),
    ...notifications.followsPending.map((notification) => ({
      type: "FollowPendingNotification" as const,
      data: [notification],
    })),
    ...notifications.followsAccepted.map((notification) => ({
      type: "FollowAcceptedNotification" as const,
      data: [notification],
    })),
  ].sort(
    (a, b) =>
      new Date(a.data[0]?.createdAt ?? new Date()).getTime() -
      new Date(b.data[0]?.createdAt ?? new Date()).getTime(),
  );

  return (
    <div
      className="flex min-w-fit flex-col items-center gap-2 overflow-y-auto overflow-x-hidden overscroll-y-contain p-2"
      style={{ maxHeight: "calc(100dvh - 100px)" }}
    >
      {notificationList.map((group) => (
        <NotificationCard
          key={`${group.type}-${group.data[0]?.id}`}
          item={group}
        />
      ))}
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false);
  const [hasBeenRemoved, setHasBeenRemoved] = useState(false);

  useEffect(() => {
    if (isRemoving) {
      // Wait for animation to finish before hiding the component
      const timer = setTimeout(() => {
        setHasBeenRemoved(true);
      }, 200); // Match the CSS animation duration

      return () => clearTimeout(timer);
    }
  }, [isRemoving]);

  async function handleRemove() {
    setIsRemoving(true);

    try {
      await removeNotifications({
        type: item.type,
        ids: item.data.map((d) => d.id),
      });
    } catch (error) {
      console.error("Failed to remove notification", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to remove notification");
      }

      setIsDragging(false);
      setStartX(0);
      setCurrentX(0);
      setIsRemoving(false);
      setHasBeenRemoved(false);
    }
  }

  const startDrag = (x: number) => {
    setStartX(x);
    setCurrentX(x);
    setIsDragging(true);
  };

  const onDrag = (x: number) => {
    if (!isDragging) return;
    if (startX > currentX) return;
    setCurrentX(x);
  };

  const endDrag = () => {
    setIsDragging(false);

    // Determine if the notification has been dragged enough to be considered as "removed"
    const dragThreshold = 100; // Pixels; adjust as needed
    if (Math.abs(currentX - startX) > dragThreshold) {
      void handleRemove();
    } else {
      setCurrentX(startX); // Reset position if not dragged enough
    }
  };

  // Mouse Events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) =>
    startDrag(e.clientX);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) =>
    onDrag(e.clientX);
  const handleMouseUp = () => endDrag();

  // Touch Events
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) =>
    startDrag(e.touches[0]?.clientX ?? 0);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) =>
    onDrag(e.touches[0]?.clientX ?? 0);
  const handleTouchEnd = () => endDrag();

  // Apply the dragging effect
  const draggingStyle = isDragging
    ? { transform: `translateX(${currentX - startX}px)`, transition: "none" }
    : {};

  const card = (() => {
    switch (item.type) {
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
    <div
      className={`relative flex w-full select-none flex-row gap-2 rounded-md border border-accent bg-neutral-900 p-2 transition-all duration-200
        ${isRemoving && "translate-x-full opacity-0"}
        ${hasBeenRemoved && "hidden"}
      `}
      style={draggingStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={isDragging ? handleMouseUp : undefined} // Cancel drag if mouse leaves the component
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {card}
      <button
        className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 rounded-full border border-neutral-600 bg-neutral-950 p-0.5 outline-none transition-colors hovact:cursor-pointer hovact:bg-neutral-600"
        onClick={handleRemove}
      >
        <Cross2Icon />
      </button>
    </div>
  );
}

function PollLikeNotificationCard({
  pollLikeNotifications,
}: {
  pollLikeNotifications: NotificationPollLikeItem[];
}) {
  const popover = useNotifications();

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/polls/${pollLikeNotifications[0]!.pollLike.poll.id}`}
        onClick={() => popover.setIsNotificationsOpen(false)}
      >
        Liked Your Poll
      </Link>

      <NotificationInfo>
        By:{" "}
        {notificationBy(
          pollLikeNotifications.map(
            (n) => n.pollLike.author.username ?? "Anon",
          ),
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
  const popover = useNotifications();

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      {commentNotifications[0]!.comment.parentId ? (
        <>
          <Link
            href={`/polls/${commentNotifications[0]!.comment.pollId}?parentId=${commentNotifications[0]!.comment.parentId}`}
            onClick={() => popover.setIsNotificationsOpen(false)}
          >
            Replied To Your Comment
          </Link>

          <NotificationInfo>
            By:{" "}
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
      ) : (
        <>
          <Link
            href={`/polls/${commentNotifications[0]!.comment.pollId}`}
            onClick={() => popover.setIsNotificationsOpen(false)}
          >
            Commented On Your Poll
          </Link>

          <NotificationInfo>
            By:{" "}
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
  const popover = useNotifications();

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/polls/${likeNotifications[0]!.commentLike.comment.pollId}?parentId=${likeNotifications[0]!.commentLike.comment.id}`}
        onClick={() => popover.setIsNotificationsOpen(false)}
      >
        {Array.from(likeNotifications).length} people liked your comment
      </Link>
    </div>
  );
}

function FollowPendingNotificationCard({
  followNotifications,
}: {
  followNotifications: NotificationFollowPendingItem[];
}) {
  const followNotification = followNotifications[0]!;
  const popover = useNotifications();

  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  async function handleAccept() {
    setIsAccepting(true);
    try {
      await acceptFollow(followNotification.follow.followerId);
    } catch (error) {
      setIsAccepting(false);
      console.error("Failed to accept follow", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to accept follow");
      }
    }
  }

  async function handleDecline() {
    setIsDeclining(true);
    try {
      await declineFollow(followNotification.follow.followerId);
    } catch (error) {
      setIsDeclining(false);
      console.error("Failed to decline follow", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to decline follow");
      }
    }
  }

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/users/${followNotification.follow.followerId}`}
        className="flex flex-row items-center justify-center gap-0.5"
        onClick={() => popover.setIsNotificationsOpen(false)}
      >
        <ProfileImage
          src={followNotification.follow.follower.imageUrl}
          username={followNotification.follow.follower.username}
          size={30}
        />
        <span className="font-bold">
          {followNotification.follow.follower.username}
        </span>
      </Link>

      <span>Requested To Follow You</span>

      <div className="flex flex-row gap-0.5">
        <button
          disabled={isAccepting || isDeclining}
          onClick={handleAccept}
          className={`flex h-7 w-14 items-center justify-center text-green-500 underline decoration-transparent hovact:decoration-green-500
            ${isDeclining && "pointer-events-none opacity-50"}
          `}
        >
          {isAccepting ? <Loader className="h-5 w-5 border-2" /> : "Accept"}
        </button>
        <button
          disabled={isAccepting || isDeclining}
          onClick={handleDecline}
          className={`flex h-7 w-14 items-center justify-center text-destructive underline decoration-transparent hovact:decoration-destructive
            ${isAccepting && "pointer-events-none opacity-50"}
          `}
        >
          {isDeclining ? <Loader className="h-5 w-5 border-2" /> : "Decline"}
        </button>
      </div>

      <NotificationInfo>
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
  const popover = useNotifications();

  async function handleLinkClick() {
    popover.setIsNotificationsOpen(false);
    await removeNotifications({
      type: "FollowAcceptedNotification",
      ids: [followNotification.id],
    });
  }

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/users/${followNotification.follow.followeeId}`}
        className="flex flex-row items-center justify-center gap-0.5"
        onClick={handleLinkClick}
      >
        <ProfileImage
          src={followNotification.follow.followee.imageUrl}
          username={followNotification.follow.followee.username}
          size={30}
        />
        <p className="font-bold">
          {followNotification.follow.followee.username}
        </p>
      </Link>

      <span>Accepted Your Follow Request</span>

      <NotificationInfo>
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

function timeElapsed(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function NotificationInfo({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-neutral-400">{children}</span>;
}
