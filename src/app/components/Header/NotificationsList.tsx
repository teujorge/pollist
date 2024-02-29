"use client";

import Link from "next/link";
import { useApp } from "@/app/app";
import { Loader } from "../Loader";
import { ProfileImage } from "../ProfileImage";
import { useEffect, useState } from "react";
import { getNotificationsItems } from "./actions";
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
        <div
          key={item.data.id}
          className="flex flex-row gap-2 rounded-md border border-neutral-800 p-2"
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
        </div>
      ))}
      {data.loading && <Loader />}
    </div>
  );
}

function CommentNotificationCard(comment: CommentNotification) {
  return (
    <>
      <Link
        href={`/users/${comment.authorId}`}
        className="flex flex-col items-center justify-center"
      >
        <ProfileImage
          src={comment.author.imageUrl}
          username={comment.author.username}
          size={30}
        />
        {comment.author.username}
      </Link>
      <p>
        {comment.parentId ? (
          <>
            replied to your comment:{" "}
            <Link
              href={`/polls/${comment.pollId}?parentId=${comment.parentId}`}
            >
              View Reply
            </Link>
          </>
        ) : (
          <>
            commented on your on your poll:{" "}
            <Link href={`/polls/${comment.pollId}`}>View Comment</Link>
          </>
        )}
      </p>
    </>
  );
}

function CommentLikeNotificationCard(like: CommentLikeNotification) {
  return (
    <>
      <Link href={`/users/${like.authorId}`}>
        <ProfileImage
          src={like.author.imageUrl}
          username={like.author.username}
          size={20}
        />
        <p>{like.author.username}</p>
      </Link>

      <p>
        liked your comment:{" "}
        <Link href={`/polls/${like.comment.pollId}`}>View Comment</Link>
      </p>
    </>
  );
}

function FollowPendingNotificationCard(follow: FollowPendingNotification) {
  return (
    <>
      <Link href={`/users/${follow.followerId}`}>
        <ProfileImage
          src={follow.follower.imageUrl}
          username={follow.follower.username}
          size={20}
        />
        <p>{follow.follower.username}</p>
      </Link>
      <p>requested to follow you</p>
      <button onClick={() => acceptFollow(follow.followerId)}>Accept</button>
      <button onClick={() => declineFollow(follow.followerId)}>Decline</button>
    </>
  );
}

function FollowAcceptedNotificationCard(follow: FollowAcceptedNotification) {
  return (
    <>
      <Link href={`/users/${follow.followedId}`}>
        <ProfileImage
          src={follow.followed.imageUrl}
          username={follow.followed.username}
          size={20}
        />
        <p>{follow.followed.username}</p>
      </Link>
      <p>accepted your follow request</p>
    </>
  );
}
