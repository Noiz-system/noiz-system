import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

// Wires up `i18n/request.ts` so server components can resolve messages.
const withNextIntl = createNextIntlPlugin();

// `withPayload` externalises the database driver and sharp for the server
// bundle; it wraps the innermost so next-intl's Turbopack aliases stay on top.
export default withNextIntl(withPayload(nextConfig));
