import { ArrowUpRight } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { renderAccented } from "@/lib/accent";
import { getLanding } from "@/lib/cms";
import { SECTION_IDS, sectionIndex } from "@/lib/sections";

export async function Contact() {
  const { contact } = await getLanding();

  return (
    <section id={SECTION_IDS.contact} className="mx-auto max-w-6xl px-6 pb-24">
      <SectionHeading
        index={sectionIndex(SECTION_IDS.contact)}
        title={renderAccented(contact.title)}
        lede={contact.body}
      />
      <a
        href={`mailto:${contact.email}`}
        className="flex flex-wrap items-center justify-center gap-3 font-display text-xl break-all text-primary md:text-3xl"
      >
        {contact.email} <ArrowUpRight className="shrink-0" />
      </a>
    </section>
  );
}
