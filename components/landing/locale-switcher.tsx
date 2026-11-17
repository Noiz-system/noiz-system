"use client";

import { useLocale, useTranslations } from "next-intl";
import { Globe } from "@/components/ui/icons";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Language control shared by the header and the footer: a globe and the code
 * of the language to switch to ("EN" on the French site, "FR" on the English
 * one), styled as a small ghost button that inherits the surrounding colour.
 *
 * Uses links rather than client state so each language has a real, shareable
 * URL that search engines can index. `usePathname` from next-intl returns the
 * path with the locale prefix already stripped, so it can be handed straight
 * back to `<Link locale>`.
 */
export function LocaleSwitcher() {
  const t = useTranslations("Languages");
  const pathname = usePathname();
  const active = useLocale();
  const others = routing.locales.filter((locale) => locale !== active);

  return others.map((locale) => (
    <Link
      key={locale}
      href={pathname}
      locale={locale}
      hrefLang={locale}
      aria-label={t(locale)}
      title={t(`switch.${locale}`)}
      className="inline-flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md px-2 text-xs font-medium whitespace-nowrap text-current uppercase transition-colors hover:bg-footer-border hover:text-footer-heading focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none [&_svg]:size-4 [&_svg]:shrink-0"
    >
      <Globe className="h-4 w-4" aria-hidden="true" />
      {locale}
    </Link>
  ));
}
