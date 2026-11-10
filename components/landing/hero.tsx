import { buttonClasses } from "@/components/ui/button";
import { ArrowRight, Headphones } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { renderAccented } from "@/lib/accent";
import { getLanding, resolveMedia } from "@/lib/cms";

export async function Hero() {
  const { hero } = await getLanding();
  const wordmark = resolveMedia(hero.image);

  return (
    <section className="mx-auto max-w-6xl px-5 pt-10 pb-12 text-center md:px-8 md:pt-16 md:pb-16">
      <p className="mb-5 text-xs font-bold text-primary uppercase">
        {hero.kicker}
      </p>

      <h1 className="mx-auto max-w-4xl text-4xl leading-tight font-bold md:text-6xl">
        {wordmark ? (
          <span className="mb-3 block">
            {/* Brand mark (SVG) from the CMS: a plain <img>, as next/image
                would need intrinsic dimensions and SVG opt-in. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wordmark.url}
              alt={wordmark.alt}
              className="mx-auto h-9 w-auto md:h-14"
            />
          </span>
        ) : null}
        {renderAccented(hero.title)}
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {hero.body}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href="https://bdmarket.fr/"
          className={buttonClasses("brand", "h-12 px-6")}
        >
          {hero.primaryCta} <ArrowRight />
        </a>
        <Link
          href="/support"
          className={buttonClasses("brandOutline", "h-12 px-6")}
        >
          <Headphones /> {hero.secondaryCta}
        </Link>
      </div>
    </section>
  );
}
