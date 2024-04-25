"use client";

import { useEffect, useState } from "react";

export function HideInWebView({
  children,
  fallback,
  shouldHideInWebView = true,
}: {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  shouldHideInWebView?: boolean;
}) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const isWebView = localStorage.getItem("source") === "iosWebView";
    if (isWebView && shouldHideInWebView) {
      setShowContent(false);
    } else {
      setShowContent(true);
    }
  }, [shouldHideInWebView]);

  return showContent ? children : fallback;
}
