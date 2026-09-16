import type { Locale } from "@/i18n/routing";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

/**
 * English defines the canonical message shape.
 *
 * Only UI microcopy lives here — labels, aria text, form copy. Everything an
 * editor might want to change (headlines, products, posts…) comes from the
 * CMS; see `lib/cms.ts`.
 */
export type Messages = typeof en;

/**
 * Catalogues are imported statically rather than resolved with a dynamic
 * `import(\`../messages/${locale}.json\`)`. A template import is typed `any`,
 * which let a translation drift out of shape unnoticed; the `satisfies` check
 * below turns a missing or misspelled key into a compile error instead of a
 * fallback string on the page.
 *
 * Both files are a few kB and only the active locale is handed to the client,
 * so giving up per-locale code splitting costs nothing here.
 */
export const messages = { fr, en } satisfies Record<Locale, Messages>;
