import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isTeacherRoute = req.nextUrl.pathname.startsWith("/teacher");
    const isTeacher = req.nextauth.token?.role === "TEACHER";
    const isAuthPage = req.nextUrl.pathname.startsWith("/sign-in") || 
                      req.nextUrl.pathname.startsWith("/sign-up") ||
                      req.nextUrl.pathname.startsWith("/forgot-password") ||
                      req.nextUrl.pathname.startsWith("/reset-password");

    // If user is on auth page and is authenticated, redirect to dashboard
    if (isAuthPage && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is not authenticated and trying to access protected routes
    if (!req.nextauth.token && !isAuthPage) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // If user is not a teacher but trying to access teacher routes
    if (isTeacherRoute && !isTeacher) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // We'll handle authorization in the middleware function
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|teacher-image.png|logo.png|male.png|eraser.png|pencil.png|ruler.png|$).*)",
  ],
};