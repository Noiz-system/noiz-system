import { buttonClasses } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { renderAccented } from "@/lib/accent";
import { getLanding } from "@/lib/cms";
import { SECTION_IDS } from "@/lib/sections";

export async function Hero() {
  const { hero } = await getLanding();

  return (
    <section className="mx-auto max-w-6xl px-5 pt-10 pb-12 text-center md:px-8 md:pt-16 md:pb-16">
      <p className="mb-5 text-xs font-bold text-primary uppercase">
        {hero.kicker}
      </p>

      <h1 className="mx-auto max-w-4xl text-4xl leading-tight font-bold md:text-6xl">
        {renderAccented(hero.title)}
      </h1>

      {hero.tagline ? (
        <p className="mx-auto mt-5 max-w-3xl text-2xl leading-snug font-semibold md:text-4xl">
          {renderAccented(hero.tagline)}
        </p>
      ) : null}

      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {hero.body}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={`#${SECTION_IDS.company}`}
          className={buttonClasses("brand", "h-12 px-6")}
        >
          {hero.primaryCta} <ArrowRight />
        </a>
        <a
          href={`#${SECTION_IDS.products}`}
          className={buttonClasses("brandOutline", "h-12 px-6")}
        >
          {hero.secondaryCta} <ArrowUpRight />
        </a>
      </div>
    </section>
  );
}
