import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isOnDashboard = pathname.startsWith("/dashboard");
  const isOnSettings = pathname.startsWith("/settings");
  const isOnLogin = pathname === "/login";
  const isProtectedApi = pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/") &&
    pathname !== "/api/health" &&
    !pathname.startsWith("/api/webhooks/");

  if ((isOnDashboard || isOnSettings) && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  if (isProtectedApi && !isLoggedIn) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/api/:path*",
    "/login",
  ],
};
