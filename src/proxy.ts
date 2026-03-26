import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { SUPPORTED_LANGS, DEFAULT_LANG } from "@/lib/i18n";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route protection
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await getToken({ req: request });
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Skip api, _next, admin, uploads, and static assets
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if path already starts with a supported locale
  const segments = pathname.split("/");
  const firstSegment = segments[1];
  if (SUPPORTED_LANGS.includes(firstSegment as (typeof SUPPORTED_LANGS)[number])) {
    return NextResponse.next();
  }

  // Determine preferred language from cookie or default
  const preferredLang =
    request.cookies.get("preferred-lang")?.value || DEFAULT_LANG;
  const lang = SUPPORTED_LANGS.includes(preferredLang as (typeof SUPPORTED_LANGS)[number])
    ? preferredLang
    : DEFAULT_LANG;

  // Redirect to locale-prefixed path
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
