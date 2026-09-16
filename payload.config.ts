import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { en } from "@payloadcms/translations/languages/en";
import { fr } from "@payloadcms/translations/languages/fr";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Faqs } from "@/cms/collections/faqs";
import { Markets } from "@/cms/collections/markets";
import { Media } from "@/cms/collections/media";
import { Posts } from "@/cms/collections/posts";
import { Products } from "@/cms/collections/products";
import { Users } from "@/cms/collections/users";
import { Landing } from "@/cms/globals/landing";
import { routing } from "@/i18n/routing";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Admin-panel labels for each content locale. */
const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
  fr: "Français",
  en: "English",
};

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "",

  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI ?? "file:./noiz.db" },
  }),

  collections: [Products, Markets, Posts, Faqs, Media, Users],
  globals: [Landing],

  // Content locales mirror the site's routing config so adding a language is
  // a one-line change in `i18n/routing.ts`. French is the source of truth;
  // an untranslated English field falls back to it rather than to nothing.
  localization: {
    locales: routing.locales.map((code) => ({
      code,
      label: LOCALE_LABELS[code],
    })),
    defaultLocale: routing.defaultLocale,
    fallback: true,
  },

  // The admin UI itself, as opposed to the content it edits.
  i18n: {
    fallbackLanguage: "fr",
    supportedLanguages: { fr, en },
  },

  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: " · Noiz Systems" },
  },

  // The frontend reads through the local API, and the admin panel uses REST,
  // so GraphQL would only be surface area to secure.
  graphQL: { disable: true },

  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },

  sharp,
});
