import { cache } from "react";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Media } from "@/payload-types";

/**
 * Read side of the CMS for server components.
 *
 * Everything goes through Payload's local API — no HTTP hop — in the locale
 * next-intl resolved for the request, so a French visitor and a French
 * catalogue always agree. Each reader is wrapped in React's `cache` so the
 * layout's metadata and the page's sections share one query per request.
 *
 * `getPayload` memoises the instance itself; the `Promise.all` only keeps the
 * locale lookup off the critical path.
 */
async function client() {
  return Promise.all([getPayload({ config }), getLocale()]);
}

export const getLanding = cache(async () => {
  const [payload, locale] = await client();
  return payload.findGlobal({ slug: "landing", locale, depth: 1 });
});

export const getProducts = cache(async () => {
  const [payload, locale] = await client();
  const { docs } = await payload.find({
    collection: "products",
    locale,
    sort: "order",
    depth: 1,
    pagination: false,
  });
  return docs;
});

export const getMarkets = cache(async () => {
  const [payload, locale] = await client();
  const { docs } = await payload.find({
    collection: "markets",
    locale,
    sort: "order",
    // Populates the product relationship so the row can print product names.
    depth: 1,
    pagination: false,
  });
  return docs;
});

/** The news section shows the three most recent posts. */
const NEWS_LIMIT = 3;

export const getLatestPosts = cache(async () => {
  const [payload, locale] = await client();
  const { docs } = await payload.find({
    collection: "posts",
    locale,
    sort: "-publishedAt",
    limit: NEWS_LIMIT,
    depth: 0,
  });
  return docs;
});

export const getFaqs = cache(async () => {
  const [payload, locale] = await client();
  const { docs } = await payload.find({
    collection: "faqs",
    locale,
    sort: "order",
    depth: 0,
    pagination: false,
  });
  return docs;
});

/**
 * Narrows an upload field to a usable image. Payload types the field as
 * `number | Media | null`: the id alone when not populated, the document when
 * `depth >= 1`. Only a populated doc with a URL and dimensions can be
 * rendered through `next/image`.
 */
export function resolveImage(
  value: number | Media | null | undefined,
): (Media & { url: string; width: number; height: number }) | null {
  if (!value || typeof value !== "object") return null;
  if (!value.url || !value.width || !value.height) return null;
  return value as Media & { url: string; width: number; height: number };
}
