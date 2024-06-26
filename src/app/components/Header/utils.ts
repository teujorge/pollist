import type { Notifications } from "@/app/(with-auth)/app";
import type {
  NotificationPollCreatedItem,
  NotificationPollLikeItem,
  NotificationCommentItem,
  NotificationCommentLikeItem,
  NotificationFollowPendingItem,
  NotificationFollowAcceptedItem,
} from "./actions";

export function groupedPollCreated(notifications: Notifications): {
  type: "PollCreatedNotification";
  data: NotificationPollCreatedItem[];
}[] {
  return notifications.pollCreated.map((notification) => ({
    type: "PollCreatedNotification" as const,
    data: [notification],
  }));
}

export function groupedPollLikes(notifications: Notifications): {
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

export function groupedComments(notifications: Notifications): {
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

export function groupedCommentLikes(notifications: Notifications): {
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

export function groupedFollowPending(notifications: Notifications): {
  type: "FollowPendingNotification";
  data: NotificationFollowPendingItem[];
}[] {
  return notifications.followsPending.map((notification) => ({
    type: "FollowPendingNotification" as const,
    data: [notification],
  }));
}

export function groupedFollowAccepted(notifications: Notifications): {
  type: "FollowAcceptedNotification";
  data: NotificationFollowAcceptedItem[];
}[] {
  return notifications.followsAccepted.map((notification) => ({
    type: "FollowAcceptedNotification" as const,
    data: [notification],
  }));
}

export const notificationsPollLikeSelect = {
  id: true,
  createdAt: true,
  pollLike: {
    select: {
      poll: { select: { id: true, title: true } },
      author: { select: { id: true, username: true } },
    },
  },
};

export const notificationsPollCreatedSelect = {
  id: true,
  createdAt: true,
  poll: {
    select: {
      id: true,
      title: true,
      author: { select: { id: true, username: true } },
    },
  },
};

export const notificationsCommentSelect = {
  id: true,
  createdAt: true,
  comment: {
    select: {
      id: true,
      author: { select: { id: true, username: true } },
      parent: { select: { id: true, text: true } },
      poll: { select: { id: true, title: true } },
    },
  },
};

export const notificationsCommentLikeSelect = {
  id: true,
  createdAt: true,
  commentLike: {
    select: {
      author: { select: { id: true, username: true } },
      comment: {
        select: {
          id: true,
          text: true,
          poll: { select: { id: true, title: true } },
        },
      },
    },
  },
};

export const notificationsFollowPendingSelect = {
  id: true,
  createdAt: true,
  follow: {
    select: {
      follower: {
        select: { id: true, username: true, imageUrl: true },
      },
    },
  },
};

export const notificationsFollowAcceptedSelect = {
  id: true,
  createdAt: true,
  follow: {
    select: {
      followee: {
        select: { id: true, username: true, imageUrl: true },
      },
    },
  },
};
