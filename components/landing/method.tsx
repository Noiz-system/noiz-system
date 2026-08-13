import { getTranslations } from "next-intl/server";
import { BrandPanel } from "@/components/landing/brand-panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { SECTION_IDS } from "@/lib/sections";

const STEP_KEYS = ["groundTruth", "blueprint", "ship", "operate"] as const;

export async function Method() {
  const [t, steps] = await Promise.all([
    getTranslations("Method"),
    getTranslations("Method.steps"),
  ]);

  return (
    <BrandPanel>
      <section id={SECTION_IDS.method} className="relative scroll-mt-24">
        <div className="mx-auto w-full max-w-[1240px] px-7 py-19.5">
          <SectionHeading
            index={t("index")}
            title={t("title")}
            onPanel
            className="mb-10"
          />

          <div
            aria-hidden
            className="animate-sweep h-0.5 bg-gradient-to-r from-accent-400 to-iris-400"
          />

          <ol className="grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {STEP_KEYS.map((key, index) => (
              <li
                key={key}
                className={cn(
                  "px-6.5 pt-6.5 pb-7.5",
                  index < STEP_KEYS.length - 1 && "lg:border-r lg:border-panel-line",
                )}
              >
                <p
                  className={cn(
                    "mb-3.5 font-display text-[3.25rem] leading-[0.9]",
                    index % 2 === 0 ? "text-accent-400" : "text-iris-400",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="m-0 mb-2 text-[1.3125rem] text-panel-foreground">
                  {steps(`${key}.title`)}
                </h3>

                <p className="m-0 text-[0.90625rem] text-panel-muted">
                  {steps(`${key}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </BrandPanel>
  );
}
