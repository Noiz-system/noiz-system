import { buttonClasses } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Corners } from "@/components/ui/corners";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { getLanding, getProducts } from "@/lib/cms";
import { cn } from "@/lib/cn";
import { SECTION_IDS, sectionIndex } from "@/lib/sections";
import type { Product } from "@/payload-types";

export async function Products() {
  const [{ sections }, products] = await Promise.all([
    getLanding(),
    getProducts(),
  ]);

  return (
    <section
      id={SECTION_IDS.products}
      className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-7 py-19.5"
    >
      <SectionHeading
        index={sectionIndex(SECTION_IDS.products)}
        title={sections.products.title}
        lede={sections.products.lede}
        className="mb-9"
      />

      <div className="grid gap-7.5 lg:grid-cols-2">
        {products.map((product, index) => (
          // Cards alternate between the canvas and the navy panel so a pair
          // reads as two distinct products rather than a list.
          <ProductCard
            key={product.id}
            product={product}
            onPanel={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onPanel = false,
}: {
  product: Product;
  onPanel?: boolean;
}) {
  const bullets = product.bullets ?? [];

  return (
    <article
      className={cn(
        "blueprint group flex flex-col transition-transform duration-250 ease-out hover:-translate-y-1",
        onPanel && "blueprint-panel bg-panel text-panel-foreground",
      )}
    >
      <Corners />

      <div
        aria-hidden
        className={cn(
          "h-[3px] origin-left scale-x-0 transition-transform duration-350 ease-out group-hover:scale-x-100",
          onPanel
            ? "bg-gradient-to-r from-iris to-accent"
            : "bg-gradient-to-r from-accent to-iris",
        )}
      />

      <div
        className={cn(
          "relative h-59 overflow-hidden border-b",
          onPanel ? "border-panel-line" : "border-line bg-surface",
        )}
      >
        <CmsImage
          media={product.image}
          placeholderLabel={product.name}
          sizes="(min-width: 1024px) 600px, 100vw"
          onPanel={onPanel}
        />
      </div>

      <div className="flex flex-1 flex-col p-6 pb-7">
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <Tag
            tone={onPanel ? "iris" : "accent"}
            className={cn(
              "font-display tracking-[0.08em] uppercase",
              onPanel && "bg-iris-500 text-white",
            )}
          >
            {product.name}
          </Tag>
          <Tag
            tone={onPanel ? "outline-panel" : "outline"}
            className="text-[0.625rem]"
          >
            {product.status}
          </Tag>
        </div>

        <h3
          className={cn(
            "m-0 mb-2.5 text-3xl leading-none",
            onPanel && "text-panel-foreground",
          )}
        >
          {product.title}
        </h3>

        <p
          className={cn(
            "m-0 mb-4.5 text-[0.9375rem] text-pretty",
            onPanel ? "text-panel-muted" : "text-muted",
          )}
        >
          {product.body}
        </p>

        <ul className="m-0 mb-5 grid list-none gap-2 p-0 text-sm">
          {bullets.map((bullet, index) => (
            <li key={bullet.id ?? index} className="flex gap-2.5">
              <span
                aria-hidden
                className={onPanel ? "text-accent-300" : "text-iris-600"}
              >
                /
              </span>
              {bullet.text}
            </li>
          ))}
        </ul>

        <a
          href={product.ctaHref || `#${SECTION_IDS.contact}`}
          className={buttonClasses(
            onPanel ? "onPanel" : "secondary",
            "md",
            "mt-auto self-start",
          )}
        >
          {product.cta}
        </a>
      </div>
    </article>
  );
}
