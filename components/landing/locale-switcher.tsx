"use client";

import { useLocale, useTranslations } from "next-intl";
import { Globe } from "@/components/ui/icons";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Footer language control: the globe and the current language's name, as in
 * the reference design, followed by a link to each other language.
 *
 * Uses links rather than client state so each language has a real, shareable
 * URL that search engines can index. `usePathname` from next-intl returns the
 * path with the locale prefix already stripped, so it can be handed straight
 * back to `<Link locale>`.
 */
export function LocaleSwitcher() {
  const t = useTranslations("Languages");
  const footer = useTranslations("Footer");
  const pathname = usePathname();
  const active = useLocale();
  const others = routing.locales.filter((locale) => locale !== active);

  return (
    <span
      role="group"
      aria-label={footer("languageLabel")}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" aria-hidden="true" />
      <span aria-current="true">{t(active)}</span>
      {others.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          hrefLang={locale}
          className="ml-1 border-l border-footer-border pl-3 hover:text-footer-heading"
        >
          {t(locale)}
        </Link>
      ))}
    </span>
  );
}
