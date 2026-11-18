import { getPayload, type GlobalSlug, type Payload } from "payload";
import config from "@payload-config";
import type { Locale } from "@/i18n/routing";
import {
  brandAssets,
  faqs,
  landing,
  products,
  supportPage,
  type BrandAsset,
} from "./seed/content";
import {
  context,
  ensureBrandMedia,
  landingData,
  pick,
  primary,
  secondary,
  withRowIds,
  writeGlobal,
} from "./seed/lib";

/**
 * Brings an existing database in line with `scripts/seed/content.ts`, the
 * copy of the reference design (the "BD Marketing Support Hub" Lovable
 * project), without wiping anything else.
 *
 *   pnpm sync:content            – dry run: lists every field that would change
 *   pnpm sync:content --apply    – writes those changes
 *   … --upload-media             – also uploads brand files missing from Media
 *
 * It targets whatever `DATABASE_URI` points at, so the same command updates
 * a local, dev or production database. What it touches:
 *
 *   - Landing page and Help centre globals: every field `content.ts` defines.
 *   - Products, matched by name: the copy and brand images. Store links and
 *     the button link are only set when the product is created, so a URL an
 *     editor entered in the admin is kept.
 *   - FAQs, matched by position: updated in place, missing ones created,
 *     extra ones deleted.
 *   - Brand media: reused by filename. A file missing from Media is reported
 *     and its fields left alone, unless `--upload-media` is passed. Uploads
 *     are stored on the disk of the machine running the script (`media/`),
 *     so only use it where that disk is the one serving the site.
 *
 * Markets and posts are not displayed by the current design and are left as
 * they are. Run `pnpm payload migrate` first: the script writes fields the
 * latest migration adds.
 */

const apply = process.argv.includes("--apply");
const uploadMedia = process.argv.includes("--upload-media");
const locales = [primary, ...secondary] as const;

/** Reported as the new value of an image the dry run would upload. */
const pendingUpload = (asset: BrandAsset) => `<upload ${brandAssets[asset].file}>`;

/**
 * Drops the keys whose value is `undefined`, so a field tied to a media file
 * that is not available is neither compared nor written.
 */
function defined<T extends object>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as T;
}

async function main() {
  const payload = await getPayload({ config });
  payload.logger.info(
    `${apply ? "Syncing" : "Dry run against"} ${databaseHost()}${apply ? "" : " — nothing will be written"}`,
  );

  const media = await ensureBrandMedia(payload, { write: apply, upload: uploadMedia });
  /** The id to write: `undefined` (leave the field alone) when the file is unavailable. */
  const mediaId = (asset: BrandAsset) => media[asset] ?? undefined;
  /** The value to compare against: a placeholder for a file the dry run would upload. */
  const mediaRef = (asset: BrandAsset) =>
    media[asset] ?? (uploadMedia ? pendingUpload(asset) : undefined);

  let changes = 0;
  const report = (target: string, paths: string[]) => {
    if (paths.length === 0) {
      payload.logger.info(`✓ ${target} is up to date`);
      return false;
    }
    changes += paths.length;
    payload.logger.info(
      `${apply ? "↻ updating" : "• would update"} ${target}:\n  ${paths.join("\n  ")}`,
    );
    return true;
  };

  // --- Globals -------------------------------------------------------------
  const portraitAsset = landing.sections.company.founder.portraitAsset;
  const withPortrait = (portrait: number | string | undefined) => {
    const resolved = landingData(landing, media);
    return {
      ...resolved,
      sections: {
        ...resolved.sections,
        company: {
          ...resolved.sections.company,
          founder: defined({ ...resolved.sections.company.founder, portrait }),
        },
      },
    };
  };
  const resolvedLanding = withPortrait(mediaId(portraitAsset));
  const landingForDiff = withPortrait(mediaRef(portraitAsset));

  const globals: Array<[GlobalSlug, object, object]> = [
    ["landing", resolvedLanding, landingForDiff],
    ["support-page", supportPage, supportPage],
  ];
  for (const [slug, data, forDiff] of globals) {
    const paths = await diffLocales(forDiff, (locale) =>
      payload.findGlobal({ slug, locale, fallbackLocale: false, depth: 0 }),
    );
    if (report(`global "${slug}"`, paths) && apply) {
      await writeGlobal(payload, slug, data);
    }
  }

  // --- Products ------------------------------------------------------------
  for (const { imageAsset, wordmarkAsset, ...product } of products) {
    const { appStoreUrl, playStoreUrl, ...copy } = product;
    const data = defined({
      ...copy,
      image: mediaId(imageAsset),
      wordmark: mediaId(wordmarkAsset),
    });
    const forDiff = defined({
      ...copy,
      image: mediaRef(imageAsset),
      wordmark: mediaRef(wordmarkAsset),
    });

    const { docs } = await payload.find({
      collection: "products",
      where: { name: { equals: product.name } },
      limit: 1,
      depth: 0,
    });
    const existing = docs[0];

    if (!existing) {
      report(`product "${product.name}"`, ["(new document)"]);
      if (apply) {
        await saveLocalized(payload, "products", null, {
          ...data,
          appStoreUrl,
          playStoreUrl,
        });
      }
      continue;
    }

    const paths = await diffLocales(forDiff, (locale) =>
      payload.findByID({
        collection: "products",
        id: existing.id,
        locale,
        fallbackLocale: false,
        depth: 0,
      }),
    );
    if (report(`product "${product.name}"`, paths) && apply) {
      await saveLocalized(payload, "products", existing.id, data);
    }
  }

  // --- FAQs ----------------------------------------------------------------
  const { docs: currentFaqs } = await payload.find({
    collection: "faqs",
    sort: "order",
    pagination: false,
    depth: 0,
  });

  for (const [index, faq] of faqs.entries()) {
    const existing = currentFaqs[index];
    const label = `FAQ ${index + 1} "${faq.question.fr}"`;

    if (!existing) {
      report(label, ["(new document)"]);
      if (apply) await saveLocalized(payload, "faqs", null, faq);
      continue;
    }

    const paths = await diffLocales(faq, (locale) =>
      payload.findByID({
        collection: "faqs",
        id: existing.id,
        locale,
        fallbackLocale: false,
        depth: 0,
      }),
    );
    if (report(label, paths) && apply) {
      await saveLocalized(payload, "faqs", existing.id, faq);
    }
  }

  for (const extra of currentFaqs.slice(faqs.length)) {
    report(`FAQ "${extra.question}"`, ["(not in the reference design: deleted)"]);
    if (apply) await payload.delete({ collection: "faqs", id: extra.id, context });
  }

  // --- Summary -------------------------------------------------------------
  if (changes === 0) {
    payload.logger.info("Everything already matches the reference content.");
  } else if (apply) {
    payload.logger.info(
      `Done: ${changes} change(s) written. Pages refresh on the next deploy or the next save in /admin.`,
    );
  } else {
    payload.logger.info(`${changes} change(s) pending. Re-run with --apply to write them.`);
  }
}

/** Fields that differ between the desired content and the stored document, in every locale. */
async function diffLocales(
  desired: object,
  load: (locale: Locale) => Promise<unknown>,
): Promise<string[]> {
  const paths: string[] = [];
  for (const locale of locales) {
    const current = await load(locale);
    const found: string[] = [];
    diff(current, pick(desired, locale), "", found);
    paths.push(...found.map((line) => `[${locale}] ${line}`));
  }
  return paths;
}

/**
 * Compares only the keys present in `desired`, so fields the content file
 * does not manage (row ids, timestamps, store links…) are ignored. Arrays are
 * compared row by row.
 */
function diff(current: unknown, desired: unknown, path: string, out: string[]) {
  if (desired === null || desired === undefined) {
    if (current !== null && current !== undefined) out.push(`${path}: ${show(current)} → (empty)`);
    return;
  }
  if (Array.isArray(desired)) {
    const rows = Array.isArray(current) ? current : [];
    if (rows.length !== desired.length) {
      out.push(`${path}: ${rows.length} → ${desired.length} rows`);
    }
    desired.forEach((row, index) => diff(rows[index], row, `${path}[${index}]`, out));
    return;
  }
  if (typeof desired === "object") {
    const object =
      typeof current === "object" && current !== null
        ? (current as Record<string, unknown>)
        : {};
    for (const [key, value] of Object.entries(desired)) {
      diff(object[key], value, path ? `${path}.${key}` : key, out);
    }
    return;
  }
  if (current !== desired) out.push(`${path}: ${show(current)} → ${show(desired)}`);
}

function show(value: unknown) {
  if (value === null || value === undefined) return "(empty)";
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return JSON.stringify(text.length > 70 ? `${text.slice(0, 67)}…` : text);
}

/**
 * Creates (`id` null) or updates a document in the primary locale, then
 * translates it into each secondary locale on the same array rows.
 */
async function saveLocalized(
  payload: Payload,
  collection: "products" | "faqs",
  id: number | null,
  data: object,
) {
  const doc = id
    ? await payload.update({ collection, id, data: pick(data, primary), locale: primary, context })
    : await payload.create({ collection, data: pick(data, primary), locale: primary, context });

  for (const locale of secondary) {
    await payload.update({
      collection,
      id: doc.id,
      data: withRowIds(doc, pick(data, locale)),
      locale,
      context,
    });
  }
}

/** Host of the target database, printed so a run against production is never a surprise. */
function databaseHost() {
  try {
    return new URL(process.env.DATABASE_URI ?? "").host || "(DATABASE_URI not set)";
  } catch {
    return "(unparseable DATABASE_URI)";
  }
}

await main();
process.exit(0);
