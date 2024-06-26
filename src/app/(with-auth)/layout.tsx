import { App } from "./app";
import { dark } from "@clerk/themes";
import { Loader } from "../components/Loader";
import { Header } from "../components/Header/Header";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { PricingTable } from "../components/Header/ClerkUserButton/settings/PricingTable";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkElements } from "@/styles/clerk";

export default function RootLayout({
  children,
  crudPoll,
}: {
  children: React.ReactNode;
  crudPoll: React.ReactNode;
}) {
  return (
    <>
      <Toaster richColors position="top-left" />
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          layout: {
            termsPageUrl: "/tos",
            privacyPageUrl: "/privacy",
            helpPageUrl: "/support",
            logoPlacement: "none",
            socialButtonsVariant: "blockButton",
            socialButtonsPlacement: "top",
          },
          variables: {
            colorPrimary: "#a855f7", // purple
            colorDanger: "#cc3333", // red
            colorSuccess: "#22c55e", // green
            colorWarning: "#F59e0b", // amber

            colorNeutral: "#ffffff",
            colorBackground: "#0f0f0f",

            colorText: "#f1f1f1",
            colorTextOnPrimaryBackground: "#f1f1f1",
            colorTextSecondary: "#f1f1f1",

            colorInputText: "#f1f1f1",
            colorInputBackground: "#191919",
          },
          elements: clerkElements,
        }}
      >
        <App
          pricingTable={
            <Suspense fallback={<Loader />}>
              <PricingTable />
            </Suspense>
          }
        >
          <Header />
          {children}
          {crudPoll}
          <div className="block h-[60px] sm:hidden" />
        </App>
      </ClerkProvider>
    </>
  );
}
