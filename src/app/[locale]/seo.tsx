import Script from "next/script";
import type { Metadata, Viewport } from "next";
import type { WithContext, WebSite } from "schema-dts";

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
      url: "https://pollist.org/logo.png",
      width: "600",
      height: "600",
    },
  },
  author: {
    "@type": "Person",
    name: "Matheus Jorge",
    url: "https://mjorge.me",
  },
};

export const JsonLd = () => (
  <Script
    id="json-ld"
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
);

export const metadata: Metadata = {
  title: {
    template: "Pollist | %s",
    default: "Pollist | Your Voice",
  },
  description:
    "Discover and engage with a wide array of polls on Pollist. Share your opinions and explore what the world thinks on diverse topics.",
  category: "Social Media, Polls, Public Opinion",
  icons: [{ rel: "icon", url: "/logo.png" }],
  keywords: [
    "polls",
    "pollist",
    "opinions",
    "social media",
    "public voting",
    "community engagement",
    "interactive polls",
    "vote on issues",
    "global opinions",
  ],
  metadataBase: new URL("https://pollist.org"),
  creator: "Matheus Jorge",
  authors: [
    { name: "Matheus Jorge", url: "https://mjorge.me" },
    { name: "Davi Guimell" },
  ],
  openGraph: {
    title: "Pollist | Your Voice",
    description:
      "Join Pollist to vote on and create polls on any topic. Share your thoughts and see how they align with others globally.",
    url: "https://pollist.org",
    siteName: "Pollist",
    images: [
      {
        url: "https://pollist.org/logo.png",
        width: 600,
        height: 600,
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pollist | Your Voice",
    description:
      "Explore global opinions with Pollist. Create, share, and vote on polls on any topic.",
    images: {
      url: "https://pollist.org/logo.png",
      alt: "Pollist logo",
    },
    site: "@pollist",
  },
  appleWebApp: {
    title: "Pollist",
    statusBarStyle: "black-translucent",
    startupImage: "/logo.png",
  },
  appLinks: {
    web: {
      url: "https://pollist.org",
      should_fallback: false,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
};
