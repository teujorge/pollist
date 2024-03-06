"use client";

import React, { useEffect, useRef, useState } from "react";
import { acknowledgeCommentLike, acknowledgeCommentReply } from "./actions";

export function CommentAcknowledgmentTrigger({
  type,
  commentId,
}: {
  type: "reply" | "like";
  commentId: string;
}) {
  const triggerElementRef = useRef(null);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);

  useEffect(() => {
    if (hasBeenTriggered) return;
    if (!triggerElementRef.current) return;

    async function handleAcknowledgment() {
      setHasBeenTriggered(true);

      try {
        switch (type) {
          case "reply":
            await acknowledgeCommentReply({ commentId });
            break;
          case "like":
            await acknowledgeCommentLike({ commentId });
            break;
        }
      } catch (error) {
        console.error(error);
        setHasBeenTriggered(false);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) void handleAcknowledgment();
        });
      },
      {
        root: null, // relative to document viewport
        rootMargin: "0px", // margin around the root
        threshold: 1.0, // trigger when 100% of the element is visible
      },
    );

    observer.observe(triggerElementRef.current);

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, [type, commentId, hasBeenTriggered]);

  return <div ref={triggerElementRef} />;
}
