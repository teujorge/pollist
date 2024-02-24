"use client";

import React, { useEffect, useRef } from "react";
import { acknowledgeReply } from "./actions";

export function ReplyAcknowledgmentTrigger({
  commentId,
}: {
  commentId: string;
}) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    async function handleAcknowledgment() {
      await acknowledgeReply({ commentId });
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

    observer.observe(triggerRef.current);

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, [commentId]);

  return <div ref={triggerRef} />;
}
