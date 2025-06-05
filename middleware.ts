import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isTeacherRoute = req.nextUrl.pathname.startsWith("/teacher");
    const isTeacher = req.nextauth.token?.role === "TEACHER";

    if (isTeacherRoute && !isTeacher) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|forgot-password|reset-password|teacher-image.png|logo.png|male.png|$).*)",
  ],
};