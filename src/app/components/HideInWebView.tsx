"use client";

import { useEffect, useState } from "react";

export function HideInWebView({
  children,
  fallback,
  showOnIOS = true,
  showOnAndroid = true,
  shouldHideInWebView = true,
}: {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  showOnIOS?: boolean;
  showOnAndroid?: boolean;
  shouldHideInWebView?: boolean;
}) {
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const source = localStorage.getItem("source");
    const isIOSWebView = source === "iosWebView";
    const isAndroidWebView = source === "androidWebView";
    const isWebView = isIOSWebView || isAndroidWebView;

    // If the component should be hidden in webview
    if (isWebView && shouldHideInWebView) {
      // If the component should be hidden in iOS WebView
      if (isIOSWebView && !showOnIOS) {
        setShowContent(false);
        return;
      }
      // If the component should be hidden in Android WebView
      else if (isAndroidWebView && !showOnAndroid) {
        setShowContent(false);
        return;
      }
      // If the component should be shown in WebView (iOS or Android)
      else {
        setShowContent(false);
        return;
      }
    }
    // If the component should be shown in webview
    else {
      setShowContent(true);
      return;
    }
  }, [shouldHideInWebView, showOnIOS, showOnAndroid]);

  return showContent ? children : fallback;
}
