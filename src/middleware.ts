import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/favicon.ico", "/robots.txt"]);

const isPublicPath = (pathname: string): boolean => {
  if (PUBLIC_PATHS.has(pathname)) {
    return true;
  }
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  );
};

/**
 * Redirects unauthenticated users to the landing page for protected routes.
 * Middleware trusts the non-HTTP-only login cookie as the auth indicator.
 * @param request Incoming request to evaluate.
 * @returns A redirect when unauthenticated or the next response when allowed.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  const loginCookie = request.cookies.get("login");
  if (!loginCookie || loginCookie.value !== "true") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"]
};
