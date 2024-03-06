"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useApp } from "@/app/app";
import { CloseSvg } from "@/app/svgs/CloseSvg";
import { ProfileImage } from "../ProfileImage";
import { useNotifications } from "./NotificationsBell";
import { removeNotification } from "./actions";
import { useEffect, useState } from "react";
import { acceptFollow, declineFollow } from "@/app/users/actions";
import type {
  NotificationCommentItem,
  NotificationCommentLikeItem,
  NotificationFollowAcceptedItem,
  NotificationFollowPendingItem,
  NotificationType,
} from "./actions";
import { Loader } from "../Loader";

type NotificationData =
  | NotificationCommentItem
  | NotificationCommentLikeItem
  | NotificationFollowPendingItem
  | NotificationFollowAcceptedItem;

export function NotificationList() {
  const { notifications } = useApp();

  const notificationList: {
    type: NotificationType;
    data: NotificationData;
  }[] = [
    ...notifications.comments.map((notification) => ({
      type: "CommentNotification" as NotificationType,
      data: notification,
    })),
    ...notifications.commentLikes.map((notification) => ({
      type: "CommentLikeNotification" as NotificationType,
      data: notification,
    })),
    ...notifications.followsPending.map((notification) => ({
      type: "FollowPendingNotification" as NotificationType,
      data: notification,
    })),
    ...notifications.followsAccepted.map((notification) => ({
      type: "FollowAcceptedNotification" as NotificationType,
      data: notification,
    })),
  ].sort(
    (a, b) =>
      new Date(a.data.createdAt).getTime() -
      new Date(b.data.createdAt).getTime(),
  );

  return (
    <div
      className="flex min-w-fit flex-col items-center gap-2 overflow-y-auto overflow-x-hidden overscroll-y-contain p-2"
      style={{ maxHeight: "calc(100dvh - 100px)" }}
    >
      {notificationList.map((item) => (
        <NotificationCard key={`${item.type}-${item.data.id}`} item={item} />
      ))}
    </div>
  );
}

function NotificationCard({
  item,
}: {
  item: {
    type: NotificationType;
    data: NotificationData;
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
      await removeNotification({ type: item.type, id: item.data.id });
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

  return (
    <div
      key={item.data.id}
      className={`relative flex w-full select-none flex-row gap-2 rounded-md border border-neutral-700 bg-neutral-900 p-2 transition-all duration-200
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
      {item.type === "CommentNotification" && (
        <CommentNotificationCard {...(item.data as NotificationCommentItem)} />
      )}
      {item.type === "CommentLikeNotification" && (
        <CommentLikeNotificationCard
          {...(item.data as NotificationCommentLikeItem)}
        />
      )}
      {item.type === "FollowPendingNotification" && (
        <FollowPendingNotificationCard
          {...(item.data as NotificationFollowPendingItem)}
        />
      )}
      {item.type === "FollowAcceptedNotification" && (
        <FollowAcceptedNotificationCard
          {...(item.data as NotificationFollowAcceptedItem)}
        />
      )}

      <button
        className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 rounded-full border border-neutral-600 bg-neutral-950 p-0.5 transition-colors hovact:cursor-pointer hovact:bg-neutral-600"
        onClick={handleRemove}
      >
        <CloseSvg fill="white" height={16} width={16} />
      </button>
    </div>
  );
}

function CommentNotificationCard(commentNotification: NotificationCommentItem) {
  const popover = useNotifications();

  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <Link
        href={`/users/${commentNotification.comment.author.id}`}
        className="flex flex-row items-center justify-center gap-1"
        onClick={() => popover.setIsNotificationsOpen(false)}
      >
        <ProfileImage
          src={commentNotification.comment.author.imageUrl}
          username={commentNotification.comment.author.username}
          size={30}
        />
        <p className="font-bold">
          {commentNotification.comment.author.username}
        </p>
      </Link>
      <p>
        {commentNotification.comment.parentId ? (
          <Link
            href={`/polls/${commentNotification.comment.pollId}?parentId=${commentNotification.comment.parentId}`}
            onClick={() => popover.setIsNotificationsOpen(false)}
          >
            replied to your comment
          </Link>
        ) : (
          <Link
            href={`/polls/${commentNotification.comment.pollId}`}
            onClick={() => popover.setIsNotificationsOpen(false)}
          >
            commented on your on your poll
          </Link>
        )}
      </p>
    </div>
  );
}

function CommentLikeNotificationCard(
  likeNotification: NotificationCommentLikeItem,
) {
  const popover = useNotifications();

  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <Link
        href={`/users/${likeNotification.commentLike.authorId}`}
        className="flex flex-row items-center justify-center gap-1"
        onClick={() => popover.setIsNotificationsOpen(false)}
      >
        <ProfileImage
          src={likeNotification.commentLike.author.imageUrl}
          username={likeNotification.commentLike.author.username}
          size={30}
        />
        <p className="font-bold">
          {likeNotification.commentLike.author.username}
        </p>
      </Link>

      <Link
        href={`/polls/${likeNotification.commentLike.comment.pollId}?parentId=${likeNotification.commentLike.comment.id}`}
        onClick={() => popover.setIsNotificationsOpen(false)}
      >
        <p>liked your comment</p>
      </Link>
    </div>
  );
}

function FollowPendingNotificationCard(
  followNotification: NotificationFollowPendingItem,
) {
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
    <div className="flex flex-col items-start justify-start">
      <Link
        href={`/users/${followNotification.follow.followerId}`}
        className="flex flex-row items-center justify-center gap-1"
        onClick={() => popover.setIsNotificationsOpen(false)}
      >
        <ProfileImage
          src={followNotification.follow.follower.imageUrl}
          username={followNotification.follow.follower.username}
          size={30}
        />
        <p className="font-bold">
          {followNotification.follow.follower.username}
        </p>
      </Link>
      <p>requested to follow you</p>
      <div className="flex flex-row gap-1">
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
          disabled={isDeclining || isAccepting}
          onClick={handleDecline}
          className={`flex h-7 w-14 items-center justify-center text-red-500 underline decoration-transparent hovact:decoration-red-500
            ${isAccepting && "pointer-events-none opacity-50"}
          `}
        >
          {isDeclining ? <Loader className="h-5 w-5 border-2" /> : "Decline"}
        </button>
      </div>
    </div>
  );
}

function FollowAcceptedNotificationCard(
  followNotification: NotificationFollowAcceptedItem,
) {
  const popover = useNotifications();

  async function handleLinkClick() {
    popover.setIsNotificationsOpen(false);
    await removeNotification({
      type: "FollowAcceptedNotification",
      id: followNotification.id,
    });
  }

  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <Link
        href={`/users/${followNotification.follow.followedId}`}
        className="flex flex-row items-center justify-center gap-1"
        onClick={handleLinkClick}
      >
        <ProfileImage
          src={followNotification.follow.followed.imageUrl}
          username={followNotification.follow.followed.username}
          size={30}
        />
        <p className="font-bold">
          {followNotification.follow.followed.username}
        </p>
      </Link>
      <p>accepted your follow request</p>
    </div>
  );
}
