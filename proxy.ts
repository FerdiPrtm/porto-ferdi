import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";

  // Proteksi seluruh /admin/* kecuali halaman login.
  if (pathname.startsWith("/admin") && !user && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // User yang sudah login tidak perlu melihat halaman login.
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};