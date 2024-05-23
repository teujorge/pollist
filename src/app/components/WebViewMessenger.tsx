"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { HideInWebView } from "./HideInWebView";

function _WebViewMessenger() {
  const { user } = useUser();

  useEffect(() => {
    window.webkit?.messageHandlers?.userListener?.postMessage?.(user?.id ?? "");
  }, [user]);

  return null;
}

export function WebViewMessenger() {
  return <HideInWebView fallback={<_WebViewMessenger />} />;
}
