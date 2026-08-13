import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Matches the incoming request to a locale and rewrites it onto the `[locale]`
 * segment. `proxy` is the Next.js 16 name for what used to be `middleware`.
 */
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
