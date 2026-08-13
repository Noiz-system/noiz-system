import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  // English stays on `/`, French is served from `/fr`. Keeps the canonical
  // marketing URL clean while still giving each language its own address.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
