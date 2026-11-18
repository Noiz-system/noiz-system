import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
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
import { SupportPage } from "@/cms/globals/support-page";
import { routing } from "@/i18n/routing";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Admin-panel labels for each content locale. */
const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
  fr: "Français",
  en: "English",
};

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "",

  // Any Postgres works: a local container, Neon, Supabase… `sslmode=require`
  // in the URL is enough for the hosted ones; node-postgres reads it.
  // Schema changes only go through `migrations/`, applied by the `vercel-build`
  // script before `next build`. Dev push stays off: it marks the database as
  // "pushed in dev mode", which makes `payload migrate` stop at an interactive
  // prompt on Vercel. After editing a collection or global, run
  // `pnpm payload migrate:create <name>` then `pnpm payload migrate`.
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    push: false,
  }),

  // Support tickets are not a collection here: they live in BDMarket's
  // Firestore so its back-office can process them (lib/server/support-tickets.ts).
  collections: [Products, Markets, Posts, Faqs, Media, Users],
  globals: [Landing, SupportPage],

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

  plugins: [
    // Uploads go to Neon Object Storage (S3-compatible) when `S3_BUCKET` is
    // set — always the case on Vercel, whose disk does not survive a deploy.
    // Without it, files stay in `media/` as before.
    //
    // The bucket is private: Payload streams each file through
    // `/api/media/file/<name>`, so stored URLs are the same either way and no
    // credential reaches the browser. `S3_*` rather than `AWS_*` names, as
    // Vercel reserves the latter for its own runtime.
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      // Keeps the `prefix` column in the schema whether or not storage is on,
      // so local and production databases share one set of migrations.
      alwaysInsertFields: true,
      bucket: process.env.S3_BUCKET ?? "",
      collections: { media: true },
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION ?? "us-east-2",
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        // Recent AWS SDKs add CRC checksums by default, which Neon's endpoint
        // does not expect; only send them when an operation requires one.
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED",
      },
    }),
  ],

  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },

  sharp,
});
