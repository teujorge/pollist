"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HideInWebView } from "./HideInWebView";

function _WebViewMessenger() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(searchParams);

    if (params.get("client_reference_id")) return;

    params.set("client_reference_id", user.id);

    const newUrl = `${pathname}?${params.toString()}`;
    console.log("----------------Redirecting to");
    console.log(newUrl);
    console.log("----------------Redirecting to");
    // router.push(newUrl);

    if (window?.webkit?.messageHandlers?.iosListener?.postMessage) {
      window.webkit?.messageHandlers?.iosListener?.postMessage?.(user.id);
    } else {
      router.push("/webkit-bridge-not-found");
    }
  }, [user]);

  return null;
}

export function WebViewMessenger() {
  return <HideInWebView fallback={<_WebViewMessenger />} />;
}
