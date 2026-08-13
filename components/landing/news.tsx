import { getTranslations } from "next-intl/server";
import { Corners } from "@/components/ui/corners";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { SECTION_IDS } from "@/lib/sections";

const NEWS_KEYS = [
  "scheduledDelivery",
  "offlineTracking",
  "origins",
] as const;

export async function News() {
  const [t, items] = await Promise.all([
    getTranslations("News"),
    getTranslations("News.items"),
  ]);

  return (
    <section
      id={SECTION_IDS.news}
      className="scroll-mt-24 border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1240px] px-7 py-19.5">
        <SectionHeading
          index={t("index")}
          title={t("title")}
          action={
            <a
              href={`#${SECTION_IDS.news}`}
              className="px-1 text-sm text-accent underline-offset-4 hover:underline"
            >
              {t("allPosts")}
            </a>
          }
          className="mb-8"
        />

        <div className="grid gap-6.5 md:grid-cols-3">
          {NEWS_KEYS.map((key, index) => (
            <a
              key={key}
              href={`#${SECTION_IDS.news}`}
              className="blueprint group flex flex-col no-underline transition-transform duration-250 ease-out hover:-translate-y-1"
            >
              <Corners />

              <span
                aria-hidden
                className={cn(
                  "h-[3px] origin-left scale-x-0 transition-transform duration-350 ease-out group-hover:scale-x-100",
                  index % 2 === 0
                    ? "bg-gradient-to-r from-accent to-iris"
                    : "bg-gradient-to-r from-iris to-accent",
                )}
              />

              <span className="grid gap-2.5 px-6 pt-5.5 pb-6.5">
                <span className="text-[0.625rem] tracking-[0.1em] text-iris-700 uppercase dark:text-iris-400">
                  {items(`${key}.kicker`)}
                </span>

                <span className="font-display text-[1.3125rem] leading-tight font-semibold">
                  {items(`${key}.title`)}
                </span>

                <span className="text-sm text-muted">
                  {items(`${key}.body`)}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
