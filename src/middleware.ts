import { locales } from "./i18n";
import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";

// docs
// https://clerk.com/docs/references/nextjs/auth-middleware

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: locales[0]!,
  localePrefix: "as-needed",
});

export default authMiddleware({
  afterAuth: (_, req, __) => intlMiddleware(req),
  publicRoutes: () => true,
  ignoredRoutes: ["/api/sitemap.xml"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
