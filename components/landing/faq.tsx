import { SectionHeading } from "@/components/ui/section-heading";
import { getFaqs, getLanding } from "@/lib/cms";
import { cn } from "@/lib/cn";
import { SECTION_IDS, sectionIndex } from "@/lib/sections";

/**
 * Built on native `<details>`, so the accordion opens with zero JavaScript and
 * stays usable if hydration never happens.
 */
export async function Faq() {
  const [{ sections }, faqs] = await Promise.all([getLanding(), getFaqs()]);

  return (
    <section id={SECTION_IDS.faq} className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid w-full max-w-[1240px] items-start gap-15 px-7 py-19.5 lg:grid-cols-[0.65fr_1.35fr]">
        <SectionHeading
          index={sectionIndex(SECTION_IDS.faq)}
          title={sections.faq.title}
        />

        <div className="border-t border-line">
          {faqs.map((faq, index) => (
            <details
              key={faq.id}
              className={cn(
                "group",
                index < faqs.length - 1 && "border-b border-line",
              )}
            >
              <summary className="flex cursor-pointer list-none items-center gap-4.5 px-0.5 py-5 font-display text-[1.375rem] font-semibold [&::-webkit-details-marker]:hidden">
                <span className="flex-1">{faq.question}</span>
                <span
                  aria-hidden
                  className="text-2xl leading-none text-accent transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <p className="m-0 max-w-[62ch] px-0.5 pb-5.5 text-[0.96875rem] text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
