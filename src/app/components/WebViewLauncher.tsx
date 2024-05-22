"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HideInWebView } from "./HideInWebView";

function _WebViewLauncher() {
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
    router.push(newUrl);
  }, [user]);

  return null;
}

export function WebViewLauncher() {
  return <HideInWebView fallback={<_WebViewLauncher />} />;
}
