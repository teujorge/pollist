"use client";

import { getPoll, handleVote } from "./actions";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/database/dbRealtime";
import { useApp } from "@/app/app";
import {
  type MutableRefObject,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { type AxisOptions, Chart } from "react-charts";
import type { PollCardProps } from "./PollCard";
import type { PollsDetails } from "../InfinitePolls/actions";
import type { RealtimeChannel } from "@supabase/realtime-js";
import type { Vote } from "@prisma/client";
import { LockSvg } from "@/app/svgs/LockSvg";

type PollCardVotingProps = PollCardProps & {
  useChart?: boolean;
  useRealtime?: boolean;
};

export function PollCardVoting(props: PollCardVotingProps) {
  const { userId, isAnon } = useApp();

  const supabaseChannelRef: MutableRefObject<RealtimeChannel | undefined> =
    useRef();

  const [optimisticPoll, setOptimisticPoll] = useState<PollsDetails[number]>(
    props.poll,
  );

  const userVote = optimisticPoll.votes.find((vote) => vote.voterId === userId);

  const [isVotePending, setIsVotePending] = useState(false);

  // Subscribe to changes in the database
  useEffect(() => {
    if (!props.useRealtime) return;
    if (!optimisticPoll.realtime) return;

    // console.log("!!! Subscribing to db changes !!!");
    supabaseChannelRef.current = supabase
      ?.channel("votes-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Vote",
          filter: `pollId=eq.${props.poll.id}`,
        },
        (payload) => {
          if (isVotePending) return;

          const oldPayload: Record<string, string> = payload.old;
          const newPayload: Record<string, string> = payload.new;

          const voteId = oldPayload.id ?? newPayload.id;
          if (!voteId) return;

          const newVote =
            Object.keys(newPayload).length > 0
              ? ({
                  ...newPayload,
                  createdAt: new Date(newPayload.createdAt ?? ""),
                } as Vote)
              : undefined;

          // new payload exists, so inserted or updated row
          if (newVote) {
            // old payload id exists, so it's an update
            if (oldPayload.id) {
              console.log("Vote updated:", newVote);
              setOptimisticPoll((prev) => ({
                ...prev,
                votes: prev.votes.map((vote) =>
                  vote.id === voteId ? newVote : vote,
                ),
              }));
            }
            // old payload id doesn't exist, so it's an insert
            else {
              console.log("Vote inserted:", newVote);
              // if the vote already exists, don't add it again
              if (optimisticPoll.votes.some((vote) => vote.id === newVote.id)) {
                return;
              }
              setOptimisticPoll((prev) => ({
                ...prev,
                votes: [...prev.votes, newVote],
              }));
            }
          }
          // no new payload, so it's a delete
          else {
            console.log("Vote deleted:", oldPayload);
            setOptimisticPoll((prev) => ({
              ...prev,
              votes: prev.votes.filter((vote) => vote.id !== voteId),
            }));
          }
        },
      )
      .subscribe();

    return () =>
      supabaseChannelRef.current &&
      void supabase?.removeChannel(supabaseChannelRef.current);
  }, [
    props.poll.id,
    props.useRealtime,
    isVotePending,
    optimisticPoll.votes,
    optimisticPoll.realtime,
  ]);

  // Poll every few seconds for updates (backup to subscription)
  useEffect(() => {
    if (isVotePending) return;
    if (!props.useRealtime) return;
    if (!optimisticPoll.realtime) return;
    if (supabaseChannelRef.current) return;

    const intervalId = setInterval(() => {
      // console.log("!!! Polling for updates !!!");
      getPoll(optimisticPoll.id)
        .then((updatedPoll) => {
          console.log("Got updated poll:", updatedPoll);
          if (!updatedPoll) return;
          if (isVotePending) return;
          if (supabaseChannelRef.current) return;
          setOptimisticPoll((prev) => ({
            ...prev,
            ...updatedPoll,
          }));
        })
        .catch((error) => {
          toast.warning("Poll may be out of date");
          console.error("Error fetching poll:", error);
        });
    }, 10000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [
    isVotePending,
    optimisticPoll.id,
    optimisticPoll.realtime,
    props.useRealtime,
    userId,
  ]);

  async function onVote(optionId: string) {
    if (isAnon && !props.poll.allowAnon) {
      toast.warning("Sign in required to vote on this poll");
      return;
    }

    if (isVotePending) {
      toast.warning("Vote pending, please wait");
      return;
    }

    // Save the current poll state to revert to if the vote fails
    const prevPoll = optimisticPoll;

    try {
      setIsVotePending(true);

      const isUnVoting = userVote?.optionId === optionId;
      const idToSet = isUnVoting ? undefined : optionId;

      setOptimisticPoll((prev) => {
        // Get users current vote
        const prevVote = prev.votes.find((vote) => vote.voterId === userId);

        // If un-voting, remove the vote from the array
        const updatedVotes = prev.votes.filter(
          (vote) => vote.voterId !== userId,
        );

        // If voting, add the updated vote to the array
        if (idToSet) {
          const newVote: typeof prevVote = prevVote
            ? {
                ...prevVote,
                optionId: idToSet,
              }
            : {
                id: "optimistic-vote-id",
                createdAt: new Date(),
                voterId: userId ?? "anon",
                pollId: optimisticPoll.id,
                optionId: idToSet,
              };

          updatedVotes.push(newVote);
        }

        return {
          ...prev,
          votes: updatedVotes,
        };
      });

      const dbVote = await handleVote({
        pollId: optimisticPoll.id,
        optionId: idToSet,
        userId: userId ?? "anon",
        voteId: userVote?.id,
      });

      if (isUnVoting) return;
      setOptimisticPoll((prev) => {
        const newVotes = prev.votes.filter((vote) => vote.voterId !== userId);
        newVotes.push(dbVote);
        return { ...prev, votes: newVotes };
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "An unknown error occurred while voting. Please try again.",
        );
      }

      console.error(error);
      setOptimisticPoll(prevPoll);
    } finally {
      setIsVotePending(false);
    }
  }

  const optionIdToHighlight = optimisticPoll.votes.find(
    (vote) => vote.voterId === props.highlightedUserId,
  )?.optionId;

  const voteBlocked = isAnon && !props.poll.allowAnon;

  return (
    <div className="flex h-full w-full flex-grow flex-col pt-2 transition-opacity">
      {voteBlocked && (
        <div title="Sign in required to vote on this poll" className="ml-auto">
          <LockSvg className="fill-neutral-500" />
        </div>
      )}
      <ul
        title={
          voteBlocked ? "Sign in required to vote on this poll" : undefined
        }
        className={`divide-y divide-neutral-800
          ${voteBlocked && "opacity-50"}
        `}
      >
        {optimisticPoll.options.map((option) => {
          const votePercentage =
            optimisticPoll.votes.length === 0
              ? 0
              : Math.round(
                  (optimisticPoll.votes.filter(
                    (vote) => vote.optionId === option.id,
                  ).length /
                    optimisticPoll.votes.length) *
                    100,
                );

          return (
            <li key={option.id} onClick={() => onVote(option.id)}>
              <div
                className={twMerge(
                  "relative flex cursor-pointer flex-row items-center gap-2 rounded-xl border p-4 transition-colors hovact:bg-neutral-900 [&>div]:z-10 [&>p]:z-10 [&>span]:hovact:opacity-20",
                  option.id === optionIdToHighlight
                    ? "border-purple-500"
                    : "border-transparent",
                )}
              >
                <span
                  className="absolute left-0 top-0 my-auto h-full rounded-xl bg-purple-500 opacity-10 transition-all"
                  style={{ width: `${votePercentage}%` }}
                />
                <div
                  className={`min-h-4 min-w-4 rounded-full transition-colors
                    ${userVote?.optionId === option.id ? "bg-purple-500" : "bg-neutral-700"}
                  `}
                />
                <p className="text-sm text-neutral-200">{option.text}</p>
                <p className="ml-auto text-sm text-neutral-200">
                  {
                    optimisticPoll.votes.filter(
                      (vote) => vote.optionId === option.id,
                    ).length
                  }
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex-grow" />

      {props.useChart && <VoteChart {...optimisticPoll} />}
    </div>
  );
}

function VoteChart(poll: PollsDetails[number]) {
  const data = useMemo(
    () =>
      poll.options.map((option) => ({
        option: option.text,
        data: [
          {
            x: option.text,
            y: poll.votes.filter((vote) => vote.optionId === option.id).length,
          },
          {
            x: option.text,
            y: poll.votes.filter((vote) => vote.optionId === option.id).length,
          },
        ],
      })),
    [poll.options, poll.votes],
  );

  const primaryAxis = useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>
  >(() => ({ getValue: (datum) => datum.x }), []);

  const secondaryAxes = useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>[]
  >(() => [{ getValue: (datum) => datum.y }], []);

  return (
    <div className="pt-2">
      <div className="rounded-lg bg-neutral-900 p-2">
        <div className="h-64 w-full">
          <Chart
            datatype="ordinal"
            options={{
              dark: true,
              interactionMode: "closest",
              data,
              primaryAxis,
              secondaryAxes,
              tooltip: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
