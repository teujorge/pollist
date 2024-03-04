import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: (req) => req.url.includes("/"),
  ignoredRoutes: ["/api/sitemap.xml"],
  debug: true,

  // afterAuth(auth, req) {
  //   // allow access to  public routes
  //   if (auth.isPublicRoute) {
  //     return NextResponse.next();
  //   }

  //   // allow authenticated users access to all routes
  //   if (auth.userId) {
  //     return NextResponse.next();
  //   }

  //   // redirect to login
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/";
  //   return NextResponse.redirect(url);
  // },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
