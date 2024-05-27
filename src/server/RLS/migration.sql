
-- Enable Row Level Security (RLS) on necessary tables
alter table "User" enable row level security;
alter table "UserBlock" enable row level security;
alter table "Follow" enable row level security;
alter table "NotificationFollowAccepted" enable row level security;
alter table "NotificationFollowPending" enable row level security;
alter table "Poll" enable row level security;
alter table "PollLike" enable row level security;
alter table "NotificationPollLike" enable row level security;
alter table "Option" enable row level security;
alter table "Vote" enable row level security;
alter table "Comment" enable row level security;
alter table "NotificationComment" enable row level security;
alter table "CommentLike" enable row level security;
alter table "NotificationCommentLike" enable row level security;
alter table "AppleTransaction" enable row level security;

-- Force Row Level Security for table owners
alter table "User" force row level security;
alter table "UserBlock" force row level security;
alter table "Follow" force row level security;
alter table "NotificationFollowAccepted" force row level security;
alter table "NotificationFollowPending" force row level security;
alter table "Poll" force row level security;
alter table "PollLike" force row level security;
alter table "NotificationPollLike" force row level security;
alter table "Option" force row level security;
alter table "Vote" force row level security;
alter table "Comment" force row level security;
alter table "NotificationComment" force row level security;
alter table "CommentLike" force row level security;
alter table "NotificationCommentLike" force row level security;
alter table "AppleTransaction" force row level security;

-- Create row security policies for each table
-- User table: Users can select their own profile and public profiles
create policy select_own_user on "User" using (auth.uid ()::text = id::text);
create policy select_public_users on "User" using (not private);

-- UserBlock table: Users can see who they have blocked and who has blocked them
create policy select_own_blocks on "UserBlock" using (
  auth.uid ()::text = "blockerId"::text
  or auth.uid ()::text = "blockeeId"::text
);

-- Follow table: Users can see their own follows and followers
create policy select_own_follows on "Follow" using (
  auth.uid ()::text = "followerId"::text
  or auth.uid ()::text = "followeeId"::text
);

-- NotificationFollowAccepted table: Users can see notifications of their follow requests being accepted
create policy select_own_follow_accepted_notifications on "NotificationFollowAccepted" using (auth.uid ()::text = "notifyeeId"::text);

-- NotificationFollowPending table: Users can see notifications of their pending follow requests
create policy select_own_follow_pending_notifications on "NotificationFollowPending" using (auth.uid ()::text = "notifyeeId"::text);

-- Poll table: Users can see their own polls, public polls, and private polls they have access to
create policy select_own_polls on "Poll" using (auth.uid ()::text = "authorId"::text);
create policy select_public_polls on "Poll" using (not private);

-- PollLike table: Users can see likes they have given and likes on polls they have access to
create policy select_own_poll_likes on "PollLike" using (auth.uid ()::text = "authorId"::text);
create policy select_poll_likes_for_accessible_polls on "PollLike" using (
  exists (
    select
      1
    from
      "Poll"
    where
      "Poll".id::text = "pollId"::text
      and (
        not "Poll".private
        or "Poll"."authorId"::text = auth.uid ()::text
      )
  )
);

-- NotificationPollLike table: Users can see notifications related to likes on their polls
create policy select_own_poll_like_notifications on "NotificationPollLike" using (auth.uid ()::text = "notifyeeId"::text);

-- Option table: Users can see options for polls they have access to
create policy select_options_for_accessible_polls on "Option" using (
  exists (
    select
      1
    from
      "Poll"
    where
      "Poll".id::text = "pollId"::text
      and (
        not "Poll".private
        or "Poll"."authorId"::text = auth.uid ()::text
      )
  )
);

-- Vote table: Users can see votes they have cast and votes on polls they have access to
create policy select_own_votes on "Vote" using (auth.uid ()::text = "voterId"::text);
create policy select_votes_for_accessible_polls on "Vote" using (
  exists (
    select
      1
    from
      "Poll"
    where
      "Poll".id::text = "pollId"::text
      and (
        not "Poll".private
        or "Poll"."authorId"::text = auth.uid ()::text
      )
  )
);

-- Comment table: Users can see comments they have written and comments on polls they have access to
create policy select_own_comments on "Comment" using (auth.uid ()::text = "authorId"::text);
create policy select_comments_for_accessible_polls on "Comment" using (
  exists (
    select
      1
    from
      "Poll"
    where
      "Poll".id::text = "pollId"::text
      and (
        not "Poll".private
        or "Poll"."authorId"::text = auth.uid ()::text
      )
  )
);

-- NotificationComment table: Users can see notifications related to comments on their polls
create policy select_own_comment_notifications on "NotificationComment" using (auth.uid ()::text = "notifyeeId"::text);

-- CommentLike table: Users can see likes they have given on comments and likes on comments they have access to
create policy select_own_comment_likes on "CommentLike" using (auth.uid ()::text = "authorId"::text);
create policy select_comment_likes_for_accessible_comments on "CommentLike" using (
  exists (
    select
      1
    from
      "Comment"
    where
      "Comment".id::text = "commentId"::text
      and (
        exists (
          select
            1
          from
            "Poll"
          where
            "Poll".id::text = "Comment"."pollId"::text
            and (
              not "Poll".private
              or "Poll"."authorId"::text = auth.uid ()::text
            )
        )
      )
  )
);

-- NotificationCommentLike table: Users can see notifications related to likes on their comments
create policy select_own_comment_like_notifications on "NotificationCommentLike" using (auth.uid ()::text = "notifyeeId"::text);

-- AppleTransaction table: Users can see their own Apple transactions
create policy select_own_apple_transactions on "AppleTransaction" using (auth.uid ()::text = "userId"::text);

-- Optional: Create policies to bypass RLS for admin users or specific conditions
-- Example policy for bypassing RLS if 'app.bypass_rls' is set to 'on'
create policy bypass_rls_policy on "User" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "UserBlock" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "Follow" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "NotificationFollowAccepted" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "NotificationFollowPending" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "Poll" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "PollLike" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "NotificationPollLike" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "Option" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "Vote" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "Comment" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "NotificationComment" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "CommentLike" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "NotificationCommentLike" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);

create policy bypass_rls_policy on "AppleTransaction" using (
  current_setting('app.bypass_rls', true)::text = 'on'
);