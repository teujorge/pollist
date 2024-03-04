import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  // publicRoutes: ["/", "/welcome", "/api/user"],

  beforeAuth() {
    // allow all requests to be processed
    return NextResponse.next();
  },
  afterAuth(auth, req) {
    // allow all users access
    return NextResponse.next();

    // allow access to  public routes
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }

    // allow authenticated users access to all routes
    if (auth.userId) {
      return NextResponse.next();
    }

    // redirect to login
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
