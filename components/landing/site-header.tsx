import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/landing/locale-switcher";
import { buttonClasses } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { homeAnchor, SECTION_IDS } from "@/lib/sections";

/** The three home sections the header links to, in display order. */
const NAV_SECTIONS = ["company", "vision", "products"] as const;

export async function SiteHeader({ current }: { current?: "support" }) {
  const [t, sections] = await Promise.all([
    getTranslations("Nav"),
    getTranslations("Sections"),
  ]);

  const links = NAV_SECTIONS.map((key) => (
    <Link
      key={key}
      href={homeAnchor(SECTION_IDS[key])}
      className="hover:text-footer-heading"
    >
      {sections(key)}
    </Link>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-footer-border bg-footer-gradient text-footer-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:text-primary"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between gap-5 px-5 md:grid md:h-28 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <nav
          aria-label={t("ariaLabel")}
          className="hidden gap-5 text-xs font-semibold text-footer-heading uppercase md:flex"
        >
          {links}
        </nav>

        <Link href="/" aria-label={t("home")} className="shrink-0">
          <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-background">
            <Image
              src="/noiz-logo.webp"
              alt="Noiz Systems"
              width={72}
              height={72}
              priority
              className="h-16 w-16 object-contain"
            />
          </span>
        </Link>

        <div className="flex items-center justify-end gap-3 text-sm font-semibold text-footer-foreground uppercase">
          <LocaleSwitcher />
          <Link
            href="/support"
            aria-current={current === "support" ? "page" : undefined}
            className={cn(
              "hover:text-footer-heading",
              current === "support" &&
                "text-footer-heading underline underline-offset-4",
            )}
          >
            {t("support")}
          </Link>
          <Link
            href={homeAnchor(SECTION_IDS.contact)}
            className={buttonClasses("brandOutline", "hidden h-11 px-5 sm:inline-flex")}
          >
            {t("contact")}
          </Link>
        </div>
      </div>

      <nav
        aria-label={t("mobileLabel")}
        className="flex justify-center gap-5 border-t border-footer-border px-3 py-3 text-xs font-semibold text-footer-heading md:hidden"
      >
        {links}
      </nav>
    </header>
  );
}
