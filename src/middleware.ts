import { NextResponse } from "next/server";
import { withClerkMiddleware } from "@clerk/nextjs";

// docs : https://clerk.com/docs/references/nextjs/auth-middleware
export default withClerkMiddleware(() => {
  return NextResponse.next();
});
// export default authMiddleware({
//   publicRoutes: () => true,
//   ignoredRoutes: ["/api/sitemap.xml"],
// });

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
