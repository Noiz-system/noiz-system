import { getTranslations } from "next-intl/server";
import { buttonClasses } from "@/components/ui/button";
import { Corners } from "@/components/ui/corners";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import { SECTION_IDS } from "@/lib/sections";

export async function Products() {
  const [t, bdmarket, logistics] = await Promise.all([
    getTranslations("Products"),
    getTranslations("Products.items.bdmarket"),
    getTranslations("Products.items.logistics"),
  ]);

  return (
    <section
      id={SECTION_IDS.products}
      className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-7 py-19.5"
    >
      <SectionHeading
        index={t("index")}
        title={t("title")}
        lede={t("lede")}
        className="mb-9"
      />

      <div className="grid gap-7.5 lg:grid-cols-2">
        <ProductCard
          name={bdmarket("name")}
          status={bdmarket("status")}
          title={bdmarket("title")}
          body={bdmarket("body")}
          cta={bdmarket("cta")}
          mediaLabel={bdmarket("mediaLabel")}
          bullets={[
            bdmarket("bullets.vendors"),
            bdmarket("bullets.payments"),
            bdmarket("bullets.diaspora"),
          ]}
        />

        <ProductCard
          onPanel
          name={logistics("name")}
          status={logistics("status")}
          title={logistics("title")}
          body={logistics("body")}
          cta={logistics("cta")}
          mediaLabel={logistics("mediaLabel")}
          bullets={[
            logistics("bullets.driverApp"),
            logistics("bullets.dispatch"),
            logistics("bullets.api"),
          ]}
        />
      </div>
    </section>
  );
}

type ProductCardProps = {
  name: string;
  status: string;
  title: string;
  body: string;
  cta: string;
  mediaLabel: string;
  bullets: string[];
  onPanel?: boolean;
};

function ProductCard({
  name,
  status,
  title,
  body,
  cta,
  mediaLabel,
  bullets,
  onPanel = false,
}: ProductCardProps) {
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
          "h-59 border-b",
          onPanel ? "border-panel-line" : "border-line bg-surface",
        )}
      >
        <MediaPlaceholder label={mediaLabel} onPanel={onPanel} />
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
            {name}
          </Tag>
          <Tag
            tone={onPanel ? "outline-panel" : "outline"}
            className="text-[0.625rem]"
          >
            {status}
          </Tag>
        </div>

        <h3
          className={cn(
            "m-0 mb-2.5 text-3xl leading-none",
            onPanel && "text-panel-foreground",
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "m-0 mb-4.5 text-[0.9375rem] text-pretty",
            onPanel ? "text-panel-muted" : "text-muted",
          )}
        >
          {body}
        </p>

        <ul className="m-0 mb-5 grid list-none gap-2 p-0 text-sm">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2.5">
              <span
                aria-hidden
                className={onPanel ? "text-accent-300" : "text-iris-600"}
              >
                /
              </span>
              {bullet}
            </li>
          ))}
        </ul>

        <a
          href={`#${SECTION_IDS.contact}`}
          className={buttonClasses(
            onPanel ? "onPanel" : "secondary",
            "md",
            "mt-auto self-start",
          )}
        >
          {cta}
        </a>
      </div>
    </article>
  );
}
