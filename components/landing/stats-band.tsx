import { getTranslations } from "next-intl/server";
import { Corners } from "@/components/ui/corners";
import { cn } from "@/lib/cn";

const STAT_KEYS = [
  "productsLive",
  "foundedBy",
  "inHouse",
  "liveMarket",
] as const;

export async function StatsBand() {
  const t = await getTranslations("Stats");

  return (
    <section className="mx-auto w-full max-w-[1240px] px-7">
      <div className="blueprint -mt-px grid grid-cols-2 bg-canvas lg:grid-cols-4">
        <Corners />

        {STAT_KEYS.map((key, index) => (
          <div
            key={key}
            className={cn(
              "px-6 pt-5.5 pb-6.5 transition-colors hover:bg-accent/7",
              index > 0 && "border-l border-line",
            )}
          >
            <p className="mb-2 font-display text-[0.6875rem] tracking-[0.14em] text-accent-700 uppercase dark:text-accent-400">
              {t(`${key}.label`)}
            </p>
            <p className="font-display text-[2.75rem] leading-[0.9]">
              {t(`${key}.value`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
