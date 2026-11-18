import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GlobalSlug, Payload } from "payload";
import { routing, type Locale } from "@/i18n/routing";
import { brandAssets, type BrandAsset, type L } from "./content";

/**
 * Helpers shared by `pnpm seed` (fills an empty database) and
 * `pnpm sync:content` (brings an existing one in line with `content.ts`).
 */

const ASSETS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "assets");

export const [primary, ...secondary] = [
  routing.defaultLocale,
  ...routing.locales.filter((locale) => locale !== routing.defaultLocale),
] as const;

/** Both scripts run outside a Next.js request, where revalidation throws. */
export const context = { disableRevalidate: true };

/**
 * Writes a global in the primary locale, then layers each secondary locale on
 * top. The secondary passes reuse the row ids of the primary one, so arrays
 * are translated rather than replaced.
 */
export async function writeGlobal(payload: Payload, slug: GlobalSlug, data: object) {
  const doc = await payload.updateGlobal({
    slug,
    data: pick(data, primary),
    locale: primary,
    context,
  });
  for (const locale of secondary) {
    await payload.updateGlobal({
      slug,
      data: withRowIds(doc, pick(data, locale)),
      locale,
      context,
    });
  }
}

/**
 * Uploads the brand files in `scripts/seed/assets/` to Media, reusing an
 * upload that already carries the same filename, so re-running does not pile
 * up duplicates. Returns each asset's media id.
 *
 * `write: false` changes nothing (dry run). `upload: false` only reuses what
 * is already there: a missing file is reported and mapped to `null`. Uploads
 * land in the `media/` folder of the machine running the script, so they
 * only make sense when that machine also serves the site.
 */
export async function ensureBrandMedia(
  payload: Payload,
  { write = true, upload = true }: { write?: boolean; upload?: boolean } = {},
): Promise<Record<BrandAsset, number | null>> {
  const ids = {} as Record<BrandAsset, number | null>;

  for (const [key, asset] of Object.entries(brandAssets) as Array<
    [BrandAsset, (typeof brandAssets)[BrandAsset]]
  >) {
    // Payload suffixes a filename that already exists on disk
    // (`bdmarket-icon-1.svg`), so match the base name with any such suffix.
    const extension = path.extname(asset.file);
    const base = asset.file.slice(0, -extension.length);
    const sameFile = new RegExp(`^${escapeRegExp(base)}(-\\d+)?${escapeRegExp(extension)}$`);
    const { docs } = await payload.find({
      collection: "media",
      where: { filename: { like: base } },
      sort: "createdAt",
      pagination: false,
      depth: 0,
    });

    let id: number | null =
      docs.find((doc) => doc.filename && sameFile.test(doc.filename))?.id ?? null;
    if (!id && !upload) {
      payload.logger.warn(
        `${asset.file} is not in Media: fields using it are left unchanged (pass --upload-media to upload it)`,
      );
    }
    if (!write || (!id && !upload)) {
      if (!id && upload) payload.logger.info(`[dry run] would upload ${asset.file}`);
      ids[key] = id;
      continue;
    }

    if (!id) {
      const doc = await payload.create({
        collection: "media",
        data: { alt: asset.alt[primary] },
        filePath: path.join(ASSETS_DIR, asset.file),
        locale: primary,
        context,
      });
      id = doc.id;
    }

    for (const locale of secondary) {
      await payload.update({
        collection: "media",
        id,
        data: { alt: asset.alt[locale] },
        locale,
        context,
      });
    }

    ids[key] = id;
  }

  return ids;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
export function pick(value: unknown, locale: Locale): any {
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
export function withRowIds(saved: unknown, data: unknown): any {
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

/**
 * The landing global's data with the media references resolved, as both
 * scripts write it.
 */
export function landingData(
  landing: typeof import("./content").landing,
  media: Record<BrandAsset, number | null>,
) {
  const { founder, ...company } = landing.sections.company;
  const { portraitAsset, ...founderData } = founder;
  return {
    ...landing,
    // The current design shows no brand mark above the hero headline.
    hero: { ...landing.hero, image: null },
    sections: {
      ...landing.sections,
      company: {
        ...company,
        founder: { ...founderData, portrait: media[portraitAsset] },
      },
    },
  };
}
