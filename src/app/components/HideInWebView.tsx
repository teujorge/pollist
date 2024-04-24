"use client";

import { useEffect, useState } from "react";

export function HideInWebView({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const isWebView = localStorage.getItem("source") === "iosWebView";
    if (isWebView) {
      setShowContent(false);
    } else {
      setShowContent(true);
    }
  }, []);

  return showContent ? children : fallback;
}
