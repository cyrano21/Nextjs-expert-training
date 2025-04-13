// 📄 src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";
import type { Role } from "@/types/database.types";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/student/") ||
    pathname.startsWith("/instructor/") ||
    pathname.startsWith("/admin/");

  const isEducationalContentRoute =
    pathname.startsWith("/learn/modules/") ||
    pathname.startsWith("/courses/content/");

  if (isProtectedRoute || isEducationalContentRoute) {
    const response = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({ req: request, res: response });

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("callbackUrl", pathname); // 🔁 utilisé à la redirection
      return NextResponse.redirect(redirectUrl);
    }

    const userRole = session.user.user_metadata?.role as Role | undefined;

    // 🔒 Redirection selon les rôles
    if (pathname.startsWith("/instructor/") && userRole !== "instructor") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    if (pathname.startsWith("/admin/") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    // 🔐 Extension possible : vérifier l'inscription aux cours
    if (isEducationalContentRoute && userRole !== "student") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// 🔧 Routes concernées par ce middleware
export const config = {
  matcher: [
    "/student/:path*",
    "/instructor/:path*",
    "/admin/:path*",
    "/learn/modules/:path*",
    "/courses/content/:path*",
    // Empêche la protection des routes _next/static, API, images, etc.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
