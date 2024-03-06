"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function TriggerNotificationSeen({
  acknowledgeFunction,
  className,
}: {
  acknowledgeFunction: () => Promise<void>;
  className?: string;
}) {
  const triggerElementRef = useRef(null);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);

  useEffect(() => {
    if (hasBeenTriggered) return;
    if (!triggerElementRef.current) return;

    async function handleAcknowledgment() {
      setHasBeenTriggered(true);
      console.log("Acknowledging notification as seen");

      try {
        await acknowledgeFunction();
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
  }, [acknowledgeFunction, hasBeenTriggered]);

  return (
    <div
      ref={triggerElementRef}
      className={cn("invisible", className)}
      style={{
        maxWidth: 0,
        maxHeight: 0,
      }}
    />
  );
}
