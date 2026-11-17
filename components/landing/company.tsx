import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { buttonClasses } from "@/components/ui/button";
import { ArrowUpRight } from "@/components/ui/icons";
import { renderAccented } from "@/lib/accent";
import { getLanding, resolveImage } from "@/lib/cms";
import { SECTION_IDS, sectionLabel } from "@/lib/sections";

/** Section 01: who the company is, then the founder. */
export async function Company() {
  const [{ sections }, t] = await Promise.all([
    getLanding(),
    getTranslations("Sections"),
  ]);
  const { company } = sections;
  if (!company?.title) return null;

  const founder = company.founder;
  const portrait = resolveImage(founder?.portrait);

  return (
    <section id={SECTION_IDS.company} className="border-y border-border bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-8 md:py-20">
        <div>
          <p className="mb-3 text-xs font-bold text-primary uppercase">
            {sectionLabel(SECTION_IDS.company, t("company"))}
          </p>
          <h2 className="text-3xl leading-tight font-bold md:text-4xl">
            {renderAccented(company.title)}
          </h2>
        </div>

        <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {company.lead ? (
            <p className="text-xl font-semibold text-foreground">{company.lead}</p>
          ) : null}
          {(company.paragraphs ?? []).map((paragraph, index) => (
            <p key={paragraph.id ?? index}>{paragraph.text}</p>
          ))}
        </div>
      </div>

      {founder?.name ? (
        <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-20">
          <div className="grid items-center gap-8 border-t border-border pt-10 md:grid-cols-[260px_minmax(0,1fr)] md:gap-12">
            {portrait ? (
              <Image
                src={portrait.url}
                alt={portrait.alt}
                width={portrait.width}
                height={portrait.height}
                sizes="260px"
                className="mx-auto aspect-square w-full max-w-[260px] rounded-md object-cover"
              />
            ) : null}
            <div className="text-center md:text-left">
              {founder.kicker ? (
                <p className="text-xs font-bold text-primary uppercase">
                  {founder.kicker}
                </p>
              ) : null}
              <h3 className="mt-4 text-3xl font-semibold">{founder.name}</h3>
              {founder.role ? (
                <p className="mt-3 text-base text-muted-foreground">{founder.role}</p>
              ) : null}
              {founder.cta ? (
                <a
                  href={`#${SECTION_IDS.contact}`}
                  className={buttonClasses("brandOutline", "mt-6 h-12 px-6")}
                >
                  {founder.cta} <ArrowUpRight />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
