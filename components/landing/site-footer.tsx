import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/landing/locale-switcher";
import { buttonClasses } from "@/components/ui/button";
import {
  ArrowUpRight,
  Headphones,
  LifeBuoy,
  ShoppingBag,
} from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { homeAnchor, SECTION_IDS, SUPPORT_ANCHORS } from "@/lib/sections";

const linkClass =
  "block w-fit py-1 text-sm leading-relaxed text-footer-muted transition-colors hover:text-footer-heading " +
  "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4";

const headingClass =
  "border-b border-footer-border pb-3 text-sm font-bold text-footer-heading";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-border bg-footer-gradient text-footer-foreground">
      <div className="border-b border-border bg-background px-5 py-14 text-center text-foreground md:py-16">
        <p className="text-xs font-bold text-primary uppercase">
          {t("cta.kicker")}
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl leading-tight font-semibold md:text-4xl">
          {t.rich("cta.title", {
            br: () => <br />,
            accent: (chunks) => <span className="text-move">{chunks}</span>,
          })}
        </h2>
        <a
          href="https://bdmarket.fr/"
          className={buttonClasses("brand", "mt-7 h-12 max-w-full px-6")}
        >
          {t("cta.button")} <ArrowUpRight />
        </a>
      </div>

      <div className="h-1 bg-bar" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-5 pt-12 md:px-8 md:pt-16">
        <nav
          aria-label={t("navLabel")}
          className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-x-10"
        >
          <div>
            <h3 className={headingClass}>{t("product.heading")}</h3>
            <p className="mt-5 mb-3 flex items-center gap-2 text-xs font-bold text-footer-heading uppercase">
              <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t("product.name")}
            </p>
            <Link href={homeAnchor(SECTION_IDS.products)} className={linkClass}>
              {t("product.discover")}
            </Link>
            <Link href={homeAnchor(SECTION_IDS.products)} className={linkClass}>
              {t("product.grocery")}
            </Link>
            <Link href={homeAnchor(SECTION_IDS.contact)} className={linkClass}>
              {t("product.getApp")}
            </Link>
            <Link href="/support" className={linkClass}>
              {t("product.support")}
            </Link>
          </div>

          <div>
            <h3 className={headingClass}>{t("resources.heading")}</h3>
            <div className="mt-4">
              <Link href={homeAnchor(SECTION_IDS.faq)} className={linkClass}>
                {t("resources.faq")}
              </Link>
              <Link href="/support" className={linkClass}>
                {t("resources.help")}
              </Link>
              <Link href={homeAnchor(SECTION_IDS.method)} className={linkClass}>
                {t("resources.method")}
              </Link>
            </div>
          </div>

          <div>
            <h3 className={headingClass}>{t("assistance.heading")}</h3>
            <p className="mt-5 mb-3 flex items-center gap-2 text-xs font-bold text-footer-heading uppercase">
              <LifeBuoy className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t("assistance.sub")}
            </p>
            <Link
              href={{ pathname: "/support", hash: SUPPORT_ANCHORS.request }}
              className={linkClass}
            >
              {t("assistance.open")}
            </Link>
            <Link
              href={{ pathname: "/support", hash: SUPPORT_ANCHORS.tracking }}
              className={linkClass}
            >
              {t("assistance.track")}
            </Link>
            <Link
              href={{ pathname: "/support", hash: SUPPORT_ANCHORS.request }}
              className={linkClass}
            >
              {t("assistance.order")}
            </Link>
          </div>

          <div>
            <h3 className={headingClass}>{t("company.heading")}</h3>
            <div className="mt-4">
              <Link href="/" className={linkClass}>
                {t("company.home")}
              </Link>
              <Link href={homeAnchor(SECTION_IDS.method)} className={linkClass}>
                {t("company.approach")}
              </Link>
              <Link href={homeAnchor(SECTION_IDS.contact)} className={linkClass}>
                {t("company.contact")}
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex flex-col items-start justify-between gap-6 pt-12 pb-8 sm:flex-row sm:items-center md:pt-16">
          <Link
            href="/"
            aria-label="Noiz Systems"
            className="flex items-center gap-3"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-background">
              <Image
                src="/noiz-logo.webp"
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 object-contain"
              />
            </span>
            <span className="text-lg font-bold text-footer-heading">
              Noiz Systems
            </span>
          </Link>
          <Link
            href="/support"
            className="flex items-center gap-3 text-sm font-semibold text-footer-heading hover:underline hover:underline-offset-4"
          >
            <Headphones className="h-5 w-5" aria-hidden="true" />
            {t("talk")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 border-t border-footer-border py-6 text-xs text-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights")}</p>
          <div className="flex items-center gap-6">
            <Link
              href={homeAnchor(SECTION_IDS.contact)}
              className="hover:text-footer-heading"
            >
              {t("contact")}
            </Link>
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
