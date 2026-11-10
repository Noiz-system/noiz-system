import { getTranslations } from "next-intl/server";
import { buttonClasses } from "@/components/ui/button";
import { ArrowUpRight } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";

/** Help-center call to action between the method and the FAQ. */
export async function HelpBand() {
  const t = await getTranslations("Help");

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col items-start justify-between gap-6 border-y border-border bg-paper px-6 py-12 md:flex-row md:items-center">
        <div>
          <p className="eyebrow text-accent">{t("kicker")}</p>
          <h2 className="mt-2 text-3xl font-semibold">{t("title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("body")}</p>
        </div>
        <Link
          href="/support"
          className={buttonClasses("brand", "h-12 shrink-0 px-6")}
        >
          {t("cta")}
          <ArrowUpRight />
        </Link>
      </div>
    </section>
  );
}
