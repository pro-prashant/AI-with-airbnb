// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const publicPaths = ["/pages/login", "/pages/signup",];

  // ⛔ If logged in, block access to public (auth) pages
  if (token && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ If not logged in, restrict access to private routes (non-API)
  const isApiRoute = path.startsWith("/api");
  const isPublicPath = publicPaths.includes(path);

  if (!token && !isPublicPath && !isApiRoute) {
    return NextResponse.redirect(new URL("/pages/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", 
    "/pages/login", 
    "/pages/signup", 
 
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)", // ✅ ignore static/public files
  ],
};
