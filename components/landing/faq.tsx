import { Minus, Plus } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFaqs, getLanding } from "@/lib/cms";
import { SECTION_IDS, sectionIndex } from "@/lib/sections";

/**
 * Built on native `<details>`, so each answer opens with zero JavaScript and
 * stays usable if hydration never happens. The summary carries the reference
 * design's ghost-button styling.
 */
export async function Faq() {
  const [{ sections }, faqs] = await Promise.all([getLanding(), getFaqs()]);

  return (
    <section id={SECTION_IDS.faq} className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        index={sectionIndex(SECTION_IDS.faq)}
        title={sections.faq.title}
      />

      <div className="divide-y divide-border border-y border-border">
        {faqs.map((faq) => (
          <details key={faq.id} className="group">
            <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-5 rounded-none px-0 py-6 text-left font-display text-base font-medium transition-colors hover:text-primary focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none md:text-xl [&::-webkit-details-marker]:hidden [&_svg]:size-4 [&_svg]:shrink-0">
              {faq.question}
              <Plus className="text-primary group-open:hidden" />
              <Minus className="hidden text-primary group-open:block" />
            </summary>
            <p className="pb-5 text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
