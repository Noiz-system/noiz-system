import { getTranslations } from "next-intl/server";
import { buttonClasses } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Corners } from "@/components/ui/corners";
import { renderAccented } from "@/lib/accent";
import { getLanding } from "@/lib/cms";
import { SECTION_IDS } from "@/lib/sections";

export async function Hero() {
  const [{ hero }, t] = await Promise.all([
    getLanding(),
    getTranslations("Hero"),
  ]);

  return (
    <section
      id="top"
      className="relative mx-auto w-full max-w-[1240px] px-7 pt-21"
    >
      <p className="animate-rise mb-6.5 flex items-center gap-3 font-display text-xs tracking-[0.18em] text-accent-300 uppercase">
        <span
          aria-hidden
          className="h-0.5 w-11 bg-gradient-to-r from-accent-400 to-iris-400"
        />
        {hero.kicker}
      </p>

      <h1 className="animate-rise m-0 mb-6.5 max-w-[15em] text-[clamp(3.25rem,8.2vw,8.25rem)] leading-[0.88] tracking-[-0.028em] text-panel-foreground">
        {renderAccented(hero.title)}
      </h1>

      <div className="grid items-end gap-14 pb-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-7.5 max-w-[33em] text-lg leading-relaxed text-panel-muted text-pretty">
            {hero.body}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={`#${SECTION_IDS.contact}`}
              className={buttonClasses("primary", "lg", "blueprint")}
            >
              <Corners />
              {hero.primaryCta}
            </a>

            <a
              href={`#${SECTION_IDS.products}`}
              className={buttonClasses("onPanel", "lg")}
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>

        <figure className="blueprint blueprint-panel m-0 aspect-[5/3.2] overflow-hidden bg-white/6 text-accent-300">
          <Corners />
          <CmsImage
            media={hero.image}
            placeholderLabel={t("mediaLabel")}
            sizes="(min-width: 1024px) 560px, 100vw"
            onPanel
          />
        </figure>
      </div>
    </section>
  );
}
