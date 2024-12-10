import NextAuth from 'next-auth';
import { auth as middleware } from 'auth';
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from '___src/lib/route';

export default middleware((req) => {
  const { nextUrl } = req;
  console.log("🚀 ~ middleware ~ nextUrl:", nextUrl)

  const isAuthenticated = !!req.auth;
  console.log("🚀 ~ middleware ~ isAuthenticated:", isAuthenticated)
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  console.log("🚀 ~ middleware ~ isPublicRoute:", isPublicRoute)

  if (isPublicRoute && isAuthenticated)
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL(ROOT, nextUrl));
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};



/* import { NextResponse } from "next/server";
import { auth } from "auth";

export default auth((req: any) => {
  const currentPath = req.nextUrl.pathname;

  // Redirect to login page if user is not authenticated
  if (!req.auth) {
    return NextResponse.redirect(
      new URL(`/signin?next=${currentPath}`, req.url)
    );
  }
});

// Manage list of protected routes
export const config = {
  matcher: ["/portal/:path*"],
};
 */
