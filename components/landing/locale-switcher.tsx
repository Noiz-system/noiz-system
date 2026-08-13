"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const LABELS: Record<string, string> = { en: "EN", fr: "FR" };

/**
 * Swaps locale without leaving the page.
 *
 * Uses links rather than client state so each language has a real, shareable
 * URL that search engines can index. `usePathname` from next-intl returns the
 * path with the locale prefix already stripped, so it can be handed straight
 * back to `<Link locale>`.
 */
export function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const active = useLocale();

  return (
    <div
      aria-label={t("languageLabel")}
      className="flex border border-white/20"
    >
      {routing.locales.map((locale, index) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          hrefLang={locale}
          aria-current={locale === active ? "true" : undefined}
          className={cn(
            "px-2.5 py-[7px] font-display text-xs font-semibold tracking-[0.06em] transition-colors",
            index > 0 && "border-l border-white/20",
            locale === active
              ? "bg-white/15 text-panel-foreground"
              : "text-panel-muted hover:text-panel-foreground",
          )}
        >
          {LABELS[locale] ?? locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
