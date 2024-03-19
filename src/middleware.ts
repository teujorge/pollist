import { authMiddleware } from "@clerk/nextjs";

// docs : https://clerk.com/docs/references/nextjs/auth-middleware

export default authMiddleware({
  publicRoutes: () => true,
  ignoredRoutes: ["/api/sitemap.xml"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
