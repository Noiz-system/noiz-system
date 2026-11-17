import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLanding } from "@/lib/cms";
import { SECTION_IDS, sectionLabel } from "@/lib/sections";

/** Section 03: from need to product. */
export async function Method() {
  const [{ sections }, t] = await Promise.all([
    getLanding(),
    getTranslations("Sections"),
  ]);
  const steps = sections.method.steps ?? [];

  return (
    <section id={SECTION_IDS.method} className="border-y border-border bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <SectionHeading
          index={sectionLabel(SECTION_IDS.method, t("method"))}
          title={sections.method.title}
        />

        <ol className="mx-auto max-w-3xl divide-y divide-border border-y border-border">
          {steps.map((step, index) => (
            <li key={step.id ?? index} className="flex gap-5 py-6">
              <span className="pt-1 font-mono text-sm text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
