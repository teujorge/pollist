"use client";

import Link from "next/link";
import { X } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Loader } from "../Loader";
import { useApp } from "@/app/(with-auth)/app";
import { usePopover } from "@/app/hooks/usePopover";
import { ProfileImage } from "../ProfileImage";
import { cn, timeElapsed } from "@/lib/utils";
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
        const key = notification.pollLike.poll.id;
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
        const key = notification.comment.poll.id;
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
    // Group commentLikes by my commentId and map them to the desired structure
    const groupedObject = notifications.commentLikes.reduce(
      (acc, notification) => {
        const key = notification.commentLike.comment.id;
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
      toast.error("Failed to remove notification");

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
      className={`relative flex w-full select-none flex-row gap-2 rounded-md bg-accent/40 p-4 transition-all duration-200
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
        className="absolute right-0 top-0 rounded-full p-1 text-foreground outline-none transition-colors hovact:text-destructive"
        onClick={handleRemove}
      >
        <X size={15} />
      </button>
    </div>
  );
}

function PollLikeNotificationCard({
  pollLikeNotifications,
}: {
  pollLikeNotifications: NotificationPollLikeItem[];
}) {
  const popover = usePopover();

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/polls/${pollLikeNotifications[0]!.pollLike.poll.id}`}
        onClick={() => popover.setIsNotificationsOpen?.(false)}
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
  const popover = usePopover();

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      {commentNotifications[0]!.comment.parent?.id ? (
        <>
          <Link
            href={`/polls/${commentNotifications[0]!.comment.poll.id}?parentId=${commentNotifications[0]!.comment.parent.id}`}
            onClick={() => popover.setIsNotificationsOpen?.(false)}
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
            onClick={() => popover.setIsNotificationsOpen?.(false)}
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
  const popover = usePopover();

  return (
    <div className="flex flex-col items-start justify-start gap-0.5">
      <Link
        href={`/polls/${likeNotifications[0]!.commentLike.comment.poll.id}?parentId=${likeNotifications[0]!.commentLike.comment.id}`}
        onClick={() => popover.setIsNotificationsOpen?.(false)}
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
  const popover = usePopover();

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
        onClick={() => popover.setIsNotificationsOpen?.(false)}
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
  const popover = usePopover();

  async function handleLinkClick() {
    popover.setIsNotificationsOpen?.(false);
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
