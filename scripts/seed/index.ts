import { getPayload, type CollectionSlug, type Payload } from "payload";
import config from "@payload-config";
import { routing, type Locale } from "@/i18n/routing";
import { faqs, landing, markets, posts, products, type L } from "./content";

/**
 * Populates the CMS with the landing page's launch copy in every locale.
 *
 *   pnpm seed          – fills an empty database
 *   pnpm seed reset    – wipes the content collections first, then fills them
 *
 * Localized fields are written in two passes: the default locale (French)
 * creates each document, then English is layered on with `update`. Payload
 * merges array rows across locales by their `id`, so the English pass reuses
 * the ids the French pass produced (see `withRowIds`); without that, the
 * English rows would replace the French ones instead of translating them.
 *
 * Runs outside a Next.js request, so the revalidation hooks are told to stand
 * down through `context.disableRevalidate`.
 */

const CONTENT_COLLECTIONS = ["markets", "products", "posts", "faqs"] as const;
const [primary, ...secondary] = [
  routing.defaultLocale,
  ...routing.locales.filter((locale) => locale !== routing.defaultLocale),
] as const;

const context = { disableRevalidate: true };

async function main() {
  const payload = await getPayload({ config });
  const reset = process.argv.includes("reset");

  await ensureAdminUser(payload);

  const existing = await countContent(payload);
  if (existing > 0) {
    if (!reset) {
      payload.logger.warn(
        `Found ${existing} content documents. Re-run with \`pnpm seed reset\` to replace them.`,
      );
      return;
    }
    await wipeContent(payload);
  }

  const productIds = new Map<string, number>();
  for (const product of products) {
    const doc = await createLocalized(payload, "products", product);
    productIds.set(product.name, doc.id);
  }
  payload.logger.info(`Seeded ${products.length} products`);

  for (const market of markets) {
    const ids = market.products.map((name) => {
      const id = productIds.get(name);
      if (!id) throw new Error(`Market "${market.name.fr}" references unknown product "${name}"`);
      return id;
    });
    await createLocalized(payload, "markets", { ...market, products: ids });
  }
  payload.logger.info(`Seeded ${markets.length} markets`);

  for (const post of posts) await createLocalized(payload, "posts", post);
  payload.logger.info(`Seeded ${posts.length} posts`);

  for (const faq of faqs) await createLocalized(payload, "faqs", faq);
  payload.logger.info(`Seeded ${faqs.length} FAQs`);

  const doc = await payload.updateGlobal({
    slug: "landing",
    data: pick(landing, primary),
    locale: primary,
    context,
  });
  for (const locale of secondary) {
    await payload.updateGlobal({
      slug: "landing",
      data: withRowIds(doc, pick(landing, locale)),
      locale,
      context,
    });
  }
  payload.logger.info("Seeded landing page");

  payload.logger.info("Done. Open /admin to edit the content.");
}

/**
 * The first admin account, so `/admin` is usable straight after seeding.
 * Credentials come from `.env`; the defaults there are for local use only.
 */
async function ensureAdminUser(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: "users" });
  if (totalDocs > 0) return;

  const email = process.env.PAYLOAD_SEED_USER_EMAIL ?? "admin@noiz.systems";
  const password = process.env.PAYLOAD_SEED_USER_PASSWORD ?? "changeme";

  await payload.create({
    collection: "users",
    data: { email, password, name: "Noiz admin" },
  });
  payload.logger.info(`Created admin user ${email} (password from .env)`);
}

async function countContent(payload: Payload) {
  const counts = await Promise.all(
    CONTENT_COLLECTIONS.map((collection) =>
      payload.count({ collection }).then(({ totalDocs }) => totalDocs),
    ),
  );
  return counts.reduce((sum, count) => sum + count, 0);
}

/** Markets go first: they hold the relationship to products. */
async function wipeContent(payload: Payload) {
  for (const collection of CONTENT_COLLECTIONS) {
    await payload.delete({
      collection,
      where: { id: { exists: true } },
      context,
    });
  }
  payload.logger.info("Cleared existing content");
}

/**
 * Creates a document in the primary locale, then translates it into each
 * secondary locale.
 */
async function createLocalized(
  payload: Payload,
  collection: Extract<CollectionSlug, "products" | "markets" | "posts" | "faqs">,
  data: object,
) {
  const doc = await payload.create({
    collection,
    data: pick(data, primary),
    locale: primary,
    context,
  });

  for (const locale of secondary) {
    await payload.update({
      collection,
      id: doc.id,
      data: withRowIds(doc, pick(data, locale)),
      locale,
      context,
    });
  }

  return doc;
}

function isLocalized(value: unknown): value is L {
  return (
    typeof value === "object" &&
    value !== null &&
    routing.locales.every(
      (locale) => typeof (value as Record<string, unknown>)[locale] === "string",
    )
  );
}

/* The two transforms below return `any` on purpose. Erasing `{fr, en}` pairs
   into strings is not expressible as a type, and Payload validates the result
   against the collection's fields at runtime anyway. */

/** Resolves every `{fr, en}` leaf in `value` to one locale's string. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pick(value: unknown, locale: Locale): any {
  if (isLocalized(value)) return value[locale];
  if (Array.isArray(value)) return value.map((item) => pick(item, locale));
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, pick(item, locale)]),
    );
  }
  return value;
}

/**
 * Copies array-row ids from a saved document onto translated data with the
 * same shape, so an update in another locale targets the existing rows.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withRowIds(saved: unknown, data: unknown): any {
  if (Array.isArray(data)) {
    const savedRows = Array.isArray(saved) ? saved : [];
    return data.map((item, index) => {
      const savedRow = savedRows[index];
      if (typeof item !== "object" || item === null) return item;
      const merged = withRowIds(savedRow, item) as Record<string, unknown>;
      return savedRow?.id ? { id: savedRow.id, ...merged } : merged;
    });
  }
  if (typeof data === "object" && data !== null) {
    const savedObject =
      typeof saved === "object" && saved !== null
        ? (saved as Record<string, unknown>)
        : {};
    return Object.fromEntries(
      Object.entries(data).map(([key, item]) => [
        key,
        withRowIds(savedObject[key], item),
      ]),
    );
  }
  return data;
}

await main();
