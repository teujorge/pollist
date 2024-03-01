"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useApp } from "@/app/app";
import { Loader } from "../Loader";
import { CloseSvg } from "@/app/svgs/CloseSvg";
import { ProfileImage } from "../ProfileImage";
import React, { useEffect, useState } from "react";
import { getNotificationsItems, removeNotification } from "./actions";
import { acceptFollow, declineFollow } from "@/app/users/actions";
import type {
  CommentLikeNotification,
  CommentNotification,
  FollowPendingNotification,
  FollowAcceptedNotification,
  NotificationItem,
} from "./actions";

export function NotificationList() {
  const { notifications } = useApp();

  const [data, setData] = useState<{
    error: boolean;
    loading: boolean;
    items: NotificationItem[];
  }>({
    error: false,
    loading: true,
    items: [],
  });

  // initial data load
  useEffect(() => {
    getNotificationsItems(notifications)
      .then((items) => {
        setData((prev) => ({ ...prev, items }));
      })
      .catch((error) => {
        setData((prev) => ({ ...prev, error: true }));
        console.error("Failed to get notification items", error);
      })
      .finally(() => {
        setData((prev) => ({ ...prev, loading: false }));
      });
  }, [notifications]);

  return (
    <div className="flex flex-col gap-2">
      {data.items.map((item) => (
        <NotificationCard key={`${item.type}-${item.data.id}`} item={item} />
      ))}
      {data.loading && <Loader />}
    </div>
  );
}

function NotificationCard({ item }: { item: NotificationItem }) {
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
      className={`relative flex select-none flex-row gap-2 rounded-md border border-neutral-800 bg-neutral-900 p-2 transition-all duration-200
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
      {item.type === "COMMENT_REPLY" && (
        <CommentNotificationCard {...(item.data as CommentNotification)} />
      )}
      {item.type === "COMMENT_LIKE" && (
        <CommentLikeNotificationCard
          {...(item.data as CommentLikeNotification)}
        />
      )}
      {item.type === "FOLLOW_PENDING" && (
        <FollowPendingNotificationCard
          {...(item.data as FollowPendingNotification)}
        />
      )}
      {item.type === "FOLLOW_ACCEPTED" && (
        <FollowAcceptedNotificationCard
          {...(item.data as FollowAcceptedNotification)}
        />
      )}

      <button
        className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 rounded-full border border-transparent bg-neutral-800 transition-colors hover:cursor-pointer hovact:bg-neutral-600"
        onClick={handleRemove}
      >
        <CloseSvg fill="white" height={20} width={20} />
      </button>
    </div>
  );
}

function CommentNotificationCard(comment: CommentNotification) {
  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <Link
        href={`/users/${comment.authorId}`}
        className="flex flex-row items-center justify-center gap-1"
      >
        <ProfileImage
          src={comment.author.imageUrl}
          username={comment.author.username}
          size={30}
        />
        <p className="font-bold">{comment.author.username}</p>
      </Link>
      <p>
        {comment.parentId ? (
          <Link href={`/polls/${comment.pollId}?parentId=${comment.parentId}`}>
            replied to your comment
          </Link>
        ) : (
          <Link href={`/polls/${comment.pollId}`}>
            commented on your on your poll
          </Link>
        )}
      </p>
    </div>
  );
}

function CommentLikeNotificationCard(like: CommentLikeNotification) {
  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <Link
        href={`/users/${like.authorId}`}
        className="flex flex-row items-center justify-center gap-1"
      >
        <ProfileImage
          src={like.author.imageUrl}
          username={like.author.username}
          size={30}
        />
        <p className="font-bold">{like.author.username}</p>
      </Link>

      <Link href={`/polls/${like.comment.pollId}`}>
        <p>liked your comment</p>
      </Link>
    </div>
  );
}

function FollowPendingNotificationCard(follow: FollowPendingNotification) {
  return (
    <div className="flex flex-col items-start justify-start">
      <Link
        href={`/users/${follow.followerId}`}
        className="flex flex-row items-center justify-center gap-1"
      >
        <ProfileImage
          src={follow.follower.imageUrl}
          username={follow.follower.username}
          size={30}
        />
        <p className="font-bold">{follow.follower.username}</p>
      </Link>
      <p>requested to follow you</p>
      <div className="flex flex-row gap-1">
        <button
          onClick={() => acceptFollow(follow.followerId)}
          className="text-green-500 underline decoration-transparent hovact:decoration-green-500"
        >
          Accept
        </button>
        <button
          onClick={() => declineFollow(follow.followerId)}
          className=" text-red-500 underline decoration-transparent hovact:decoration-red-500"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

function FollowAcceptedNotificationCard(follow: FollowAcceptedNotification) {
  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <Link
        href={`/users/${follow.followedId}`}
        className="flex flex-row items-center justify-center gap-1"
      >
        <ProfileImage
          src={follow.followed.imageUrl}
          username={follow.followed.username}
          size={30}
        />
        <p className="font-bold">{follow.followed.username}</p>
      </Link>
      <p>accepted your follow request</p>
    </div>
  );
}
