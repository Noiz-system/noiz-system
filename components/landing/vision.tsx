import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLanding } from "@/lib/cms";
import { SECTION_IDS, sectionLabel } from "@/lib/sections";

/** Section 02: the goals that drive the company. */
export async function Vision() {
  const [{ sections }, t] = await Promise.all([
    getLanding(),
    getTranslations("Sections"),
  ]);
  const { vision } = sections;
  if (!vision?.title) return null;

  const items = vision.items ?? [];

  return (
    <section id={SECTION_IDS.vision} className="mx-auto max-w-6xl px-5 py-20 md:px-8">
      <SectionHeading
        index={sectionLabel(SECTION_IDS.vision, t("vision"))}
        title={vision.title}
        lede={vision.lede}
      />

      <div className="grid gap-8 md:grid-cols-3 md:gap-10">
        {items.map((item, index) => (
          <article key={item.id ?? index} className="border-t-2 border-primary pt-6">
            <p className="font-mono text-sm text-primary">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
