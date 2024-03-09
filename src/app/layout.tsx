import "@/styles/globals.css";
import Script from "next/script";
import GlobalLoading from "./loading";
import { App } from "./app";
import { dark } from "@clerk/themes";
import { Header } from "./components/Header/Header";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { Nunito_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import type { WithContext, WebSite } from "schema-dts";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
  crudPoll,
}: {
  children: React.ReactNode;
  crudPoll: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense fallback={<GlobalLoading />}>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#a855f7", // purple
              colorDanger: "#cc3333", // red
              colorSuccess: "#22c55e", // green
              colorWarning: "#F59e0b", // amber

              colorAlphaShade: "#ffffff",

              colorTextOnPrimaryBackground: "#f1f1f1",
              colorTextSecondary: "#f1f1f1",

              // colorBackground: "#010101",

              colorInputText: "#f1f1f1",
              colorInputBackground: "#191919",
            },
          }}
        >
          <body className={`font-sans ${nunito.variable}`}>
            <Toaster richColors />
            <App>
              <Header />
              {children}
              {crudPoll}
            </App>
          </body>
        </ClerkProvider>
      </Suspense>
    </html>
  );
}

const jsonLd: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pollist",
  url: "https://pollist.org",
  description:
    "Pollist is a platform for creating and sharing polls. Get opinions on your questions and share your thoughts with the world.",
  publisher: {
    "@type": "Organization",
    name: "Pollist",
    url: "https://pollist.org",
    logo: {
      "@type": "ImageObject",
      url: "https://pollist.org/icon.png",
    },
  },
  author: {
    "@type": "Person",
    name: "Matheus Jorge",
    url: "https://mjorge.me",
  },
};

export const metadata: Metadata = {
  title: {
    template: "Pollist | %s",
    default: "Pollist | Opinions exposed",
  },
  description:
    "Pollist is a platform for creating and sharing polls. Get opinions on your questions and share your thoughts with the world.",
  category: "Social",
  icons: [{ rel: "icon", url: "/icon.png" }],
  metadataBase: new URL("https://pollist.org"),
  creator: "Matheus Jorge",
  authors: [
    { name: "Matheus Jorge", url: "https://mjorge.me" },
    { name: "Davi Guimell" },
  ],
  openGraph: {
    title: "Pollist | Opinions exposed",
    description:
      "Pollist is a platform for creating and sharing polls. Get opinions on your questions and share your thoughts with the world.",
    url: "https://pollist.org",
    siteName: "Pollist",
    images: [
      {
        url: "https://pollist.org/icon.png",
        width: 600,
        height: 600,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pollist",
    description:
      "Pollist is a platform for creating and sharing polls. Get opinions on your questions and share your thoughts with the world.",
    images: {
      url: "https://pollist.org/icon.png",
      alt: "Pollist logo",
    },
    site: "@pollist",
  },
  appleWebApp: {
    title: "Pollist",
    statusBarStyle: "black-translucent",
    startupImage: ["/icon.png"],
  },
  appLinks: {
    web: {
      url: "https://pollist.org",
      should_fallback: true,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "black",
};
