import { getTranslations } from "next-intl/server";
import { BrandPanel } from "@/components/landing/brand-panel";
import { ContactForm } from "@/components/landing/contact-form";
import { SECTION_IDS } from "@/lib/sections";

export async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <BrandPanel glow="contact">
      <section id={SECTION_IDS.contact} className="relative scroll-mt-24">
        <div className="mx-auto grid w-full max-w-[1240px] items-start gap-15 px-7 py-19.5 lg:grid-cols-2">
          <div>
            <div className="mb-5 flex flex-wrap items-baseline gap-x-4.5 gap-y-2">
              <span className="font-display text-xs tracking-[0.16em] text-iris-400">
                {t("index")}
              </span>

              <h2 className="m-0 text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.92] text-panel-foreground">
                {t.rich("title", {
                  accent: (chunks) => (
                    <span className="brand-text">{chunks}</span>
                  ),
                })}
              </h2>
            </div>

            <p className="max-w-[32em] text-[1.09375rem] text-panel-muted text-pretty">
              {t("body")}
            </p>

            <a
              href={`mailto:${t("email")}`}
              className="mt-7 inline-block text-[0.9375rem] text-accent-300 underline-offset-4 hover:underline"
            >
              {t("email")}
            </a>
          </div>

          <ContactForm />
        </div>
      </section>
    </BrandPanel>
  );
}
