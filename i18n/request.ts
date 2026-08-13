import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as localeRootParam } from "next/root-params";
import { messages } from "@/i18n/messages";
import { routing } from "@/i18n/routing";

/**
 * Resolves the active locale and loads its catalogue for every request.
 *
 * Reads the `[locale]` segment through `next/root-params` rather than the
 * `requestLocale` param, which next-intl deprecates in favour of it.
 */
export default getRequestConfig(async ({ locale: overrideLocale }) => {
  // `getTranslations({locale})` passes an override; otherwise fall back to the
  // route segment.
  const requested = overrideLocale ?? (await localeRootParam());
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return { locale, messages: messages[locale] };
});
