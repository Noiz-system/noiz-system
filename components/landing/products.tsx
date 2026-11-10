import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { buttonClasses } from "@/components/ui/button";
import {
  AppleLogo,
  ArrowUpRight,
  Check,
  GooglePlayLogo,
  Headphones,
} from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";
import { getLanding, getProducts, resolveMedia } from "@/lib/cms";
import { SECTION_IDS, sectionIndex } from "@/lib/sections";
import type { Product } from "@/payload-types";

export async function Products() {
  const [{ sections }, products, t] = await Promise.all([
    getLanding(),
    getProducts(),
    getTranslations("Products"),
  ]);

  return (
    <section id={SECTION_IDS.products} className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        index={sectionIndex(SECTION_IDS.products)}
        title={sections.products.title}
        lede={sections.products.lede}
      />

      <div className="mx-auto grid max-w-3xl gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            labels={{
              support: t("support", { name: product.name }),
              appStore: {
                kicker: t("appStore.kicker"),
                name: t("appStore.name"),
                label: t("appStore.label", { name: product.name }),
              },
              googlePlay: {
                kicker: t("googlePlay.kicker"),
                name: t("googlePlay.name"),
                label: t("googlePlay.label", { name: product.name }),
              },
            }}
          />
        ))}
      </div>
    </section>
  );
}

type StoreLabels = { kicker: string; name: string; label: string };

type CardLabels = {
  support: string;
  appStore: StoreLabels;
  googlePlay: StoreLabels;
};

/** Two-line store button: "Download on the / App Store". */
function StoreButton({
  href,
  icon,
  labels,
}: {
  href: string;
  icon: ReactNode;
  labels: StoreLabels;
}) {
  return (
    <a
      href={href}
      aria-label={labels.label}
      className={buttonClasses(
        "brand",
        "h-12 gap-3 px-5 text-left [&_svg]:size-6",
      )}
    >
      {icon}
      <span className="flex flex-col leading-none">
        <span className="text-[0.6875rem] font-medium opacity-80">
          {labels.kicker}
        </span>
        <span className="mt-1 text-base leading-none font-bold">
          {labels.name}
        </span>
      </span>
    </a>
  );
}

function ProductCard({
  product,
  labels,
}: {
  product: Product;
  labels: CardLabels;
}) {
  const icon = resolveMedia(product.image);
  const hasStores = Boolean(product.appStoreUrl || product.playStoreUrl);

  return (
    <article className="flex flex-col border-t-2 border-primary bg-background py-8">
      <div className="mb-6 flex items-center gap-3">
        {icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon.url}
            alt=""
            className="h-12 w-12 rounded-md bg-paper p-1"
          />
        ) : null}
        <div>
          <p className="font-display text-xl font-semibold">{product.name}</p>
          <p className="eyebrow text-muted-foreground">{product.status}</p>
        </div>
      </div>

      <h3 className="text-3xl font-semibold">{product.title}</h3>
      <p className="mt-3 text-muted-foreground">{product.body}</p>

      <ul className="mt-6 space-y-2 text-sm">
        {(product.bullets ?? []).map((bullet, index) => (
          <li key={bullet.id ?? index} className="flex items-start gap-3">
            <Check className="h-5 w-5 shrink-0 text-primary" />
            {bullet.text}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-3 pt-8">
        {hasStores ? (
          <>
            {product.appStoreUrl ? (
              <StoreButton
                href={product.appStoreUrl}
                icon={<AppleLogo />}
                labels={labels.appStore}
              />
            ) : null}
            {product.playStoreUrl ? (
              <StoreButton
                href={product.playStoreUrl}
                icon={<GooglePlayLogo />}
                labels={labels.googlePlay}
              />
            ) : null}
          </>
        ) : (
          <a
            href={product.ctaHref || `#${SECTION_IDS.contact}`}
            className={buttonClasses("brand", "h-12 px-6")}
          >
            {product.cta}
            <ArrowUpRight />
          </a>
        )}
        <Link
          href="/support"
          className={buttonClasses("brandOutline", "h-12 px-6")}
        >
          {labels.support}
          <Headphones />
        </Link>
      </div>
    </article>
  );
}
