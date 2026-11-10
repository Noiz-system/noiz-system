import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { buttonClasses } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { homeAnchor, SECTION_IDS } from "@/lib/sections";

export async function SiteHeader({ current }: { current?: "support" }) {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between gap-5 px-5 md:grid md:h-28 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <nav
          aria-label={t("ariaLabel")}
          className="hidden gap-6 text-sm font-semibold text-muted-foreground uppercase md:flex"
        >
          <Link href={homeAnchor(SECTION_IDS.products)} className="hover:text-primary">
            {t("bdmarket")}
          </Link>
          <Link href={homeAnchor(SECTION_IDS.method)} className="hover:text-primary">
            {t("method")}
          </Link>
          <Link href={homeAnchor(SECTION_IDS.faq)} className="hover:text-primary">
            {t("faq")}
          </Link>
        </nav>

        <Link href="/" aria-label={t("home")} className="shrink-0">
          <Image
            src="/noiz-logo.webp"
            alt="Noiz Systems"
            width={104}
            height={104}
            priority
            className="h-24 w-24 object-contain md:h-28 md:w-28"
          />
        </Link>

        <div className="flex items-center justify-end gap-6 text-sm font-semibold text-muted-foreground uppercase">
          <Link
            href="/support"
            aria-current={current === "support" ? "page" : undefined}
            className={cn("hover:text-primary", current === "support" && "text-primary")}
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
    </header>
  );
}
