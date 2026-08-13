import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // French first: it is the default, and the order drives the language
  // switcher's display order.
  locales: ["fr", "en"],
  defaultLocale: "fr",
  // French stays on `/`, English is served from `/en`. Keeps the canonical
  // marketing URL clean while still giving each language its own address.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
