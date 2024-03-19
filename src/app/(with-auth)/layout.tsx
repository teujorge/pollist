import GlobalLoading from "../loading";
import { App } from "./app";
import { dark } from "@clerk/themes";
import { Header } from "../components/Header/Header";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
  crudPoll,
}: {
  children: React.ReactNode;
  crudPoll: React.ReactNode;
}) {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <Toaster richColors />
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          layout: {
            termsPageUrl: "/tos",
            privacyPageUrl: "/privacy",
            logoPlacement: "outside",
            socialButtonsVariant: "blockButton",
            socialButtonsPlacement: "top",
          },
          variables: {
            colorPrimary: "#a855f7", // purple
            colorDanger: "#cc3333", // red
            colorSuccess: "#22c55e", // green
            colorWarning: "#F59e0b", // amber

            colorNeutral: "#ffffff",

            colorTextOnPrimaryBackground: "#f1f1f1",
            colorTextSecondary: "#f1f1f1",

            // colorBackground: "#010101",

            colorInputText: "#f1f1f1",
            colorInputBackground: "#191919",
          },
        }}
      >
        <App>
          <Header />
          {children}
          {crudPoll}
        </App>
      </ClerkProvider>
    </Suspense>
  );
}
