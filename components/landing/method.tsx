import { SectionHeading } from "@/components/ui/section-heading";
import { getLanding } from "@/lib/cms";
import { SECTION_IDS, sectionIndex } from "@/lib/sections";

export async function Method() {
  const { sections } = await getLanding();
  const steps = sections.method.steps ?? [];

  return (
    <section id={SECTION_IDS.method} className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        index={sectionIndex(SECTION_IDS.method)}
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
    </section>
  );
}
