import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { TicketForm } from "@/components/support/ticket-form";
import { TicketLookup } from "@/components/support/ticket-lookup";
import { ArrowUpRight, Headphones, Package } from "@/components/ui/icons";
import { getLanding, getProducts, resolveMedia } from "@/lib/cms";
import { readSession } from "@/lib/server/email-verification";
import { SUPPORT_ANCHORS } from "@/lib/sections";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Support");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
    },
    twitter: { card: "summary" },
  };
}

export default async function SupportPage() {
  const [t, { contact }, products, verifiedEmail] = await Promise.all([
    getTranslations("Support"),
    getLanding(),
    getProducts(),
    // An email verified in the last 30 minutes skips straight to the form.
    readSession(),
  ]);

  const product = products[0];
  const icon = resolveMedia(product?.image);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader current="support" />
      <main id="main">
        <section className="border-b border-border bg-paper">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-5 py-10 md:flex-row md:items-end md:px-8 md:py-14">
            <div className="max-w-2xl">
              <p className="mb-5 flex items-center gap-2 text-xs font-bold text-primary uppercase">
                <Headphones className="h-4 w-4" />
                {t("kicker")}
              </p>
              <h1 className="text-4xl leading-tight font-bold md:text-5xl">
                {t.rich("title", {
                  br: () => <br />,
                  accent: (chunks) => <span className="text-move">{chunks}</span>,
                })}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                {t.rich("intro", {
                  brmd: () => <br className="hidden md:block" />,
                })}
              </p>
            </div>

            {product ? (
              <div className="flex items-center gap-4 border-l-2 border-primary pl-5">
                {icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={icon.url} alt="" className="h-12 w-12" />
                ) : null}
                <div>
                  <p className="text-lg font-bold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("productTagline")}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 md:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <section id={SUPPORT_ANCHORS.request} className="min-w-0">
            <TicketForm initialEmail={verifiedEmail} />
          </section>

          <aside className="space-y-8">
            <TicketLookup />
            <div className="px-1 text-sm leading-relaxed text-muted-foreground">
              <Package className="mb-3 h-6 w-6 text-primary" />
              <p className="mb-2 font-semibold text-foreground">
                {t("aside.title")}
              </p>
              {t("aside.body")}
              <a
                href={`mailto:${contact.email}`}
                className="mt-5 flex flex-wrap items-center gap-2 font-semibold break-all text-primary"
              >
                {contact.email} <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
