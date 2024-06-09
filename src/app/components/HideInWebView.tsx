"use client";

import { useEffect, useState } from "react";

export function HideInWebView({
  children,
  fallback,
  forceHideInIOS = true,
  forceHideInAndroid = true,
  forceHideInWebView = true,
}: {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  forceHideInIOS?: boolean;
  forceHideInAndroid?: boolean;
  forceHideInWebView?: boolean;
}) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const source = localStorage.getItem("source");
    const isIOSWebView = source === "iosWebView";
    const isAndroidWebView = source === "androidWebView";
    const isWebView = isIOSWebView || isAndroidWebView;

    // If the component should be hidden in webview
    if (isWebView && forceHideInWebView) {
      // If the component should be hidden in iOS WebView
      if (isIOSWebView) {
        if (forceHideInIOS) {
          setShowContent(false);
          return;
        } else {
          setShowContent(true);
          return;
        }
      }
      // If the component should be hidden in Android WebView
      else if (isAndroidWebView) {
        if (forceHideInAndroid) {
          setShowContent(false);
          return;
        } else {
          setShowContent(true);
          return;
        }
      }
      // If the component should be hidden in any WebView
      else {
        setShowContent(false);
        return;
      }
    }
    // If the component should be shown in web
    else {
      setShowContent(true);
      return;
    }
  }, [forceHideInWebView, forceHideInIOS, forceHideInAndroid]);

  return showContent ? children : fallback;
}
