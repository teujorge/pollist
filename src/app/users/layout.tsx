"use client";

import { Card } from "../components/Card";
import { useState } from "react";

export default function Layout({
  children,
  polls,
  votes,
}: {
  children: React.ReactNode;
  polls: React.ReactNode;
  votes: React.ReactNode;
}) {
  const [showContent, setShowContent] = useState(true);

  const togglePoll = () => {
    setShowContent(true);
  };
  const toggleVotes = () => {
    setShowContent(false);
  };
  const isMobileScreen = () => {
    return window.innerWidth < 768; // Example threshold for mobile screens
  };

  return (
    <main className="flex min-h-full w-full flex-col items-center gap-4">
      {isMobileScreen() ? (
        <>
          {children}
          <div className="flex w-full flex-row gap-4 md:hidden">
            <button className="w-1/2 hover:brightness-200" onClick={togglePoll}>
              <Card className="w-full">
                <h2 className="flex items-center justify-center">POLL</h2>
              </Card>
            </button>
            <button
              className="w-1/2 hover:brightness-200"
              onClick={toggleVotes}
            >
              <Card className="w-full">
                <h2 className="flex items-center justify-center">VOTES</h2>
              </Card>
            </button>
          </div>
          <div className="flex w-full flex-col justify-center gap-4 md:flex-row">
            {showContent === true ? polls : votes}
          </div>
        </>
      ) : (
        <div className="flex flex-row">
          <div className="p-2">{children}</div>
          <div className="flex flex-col gap-2 p-2">
            <div className=" w-full  rounded-xl border border-neutral-800 px-3 py-2">
              <h2 className="flex items-center justify-center font-bold">
                POLL
              </h2>
            </div>
            {polls}
          </div>
          <div className="flex flex-col gap-2 p-2">
            <div className=" w-full  rounded-xl border border-neutral-800 px-3 py-2">
              <h2 className="flex items-center justify-center font-bold ">
                VOTES
              </h2>
            </div>
            {votes}
          </div>
        </div>
      )}
    </main>
  );
}
