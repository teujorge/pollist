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
      url: "https://pollist.org/icon.png",
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
