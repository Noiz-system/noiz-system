import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { getLanding, getMarkets } from "@/lib/cms";
import { SECTION_IDS, sectionIndex } from "@/lib/sections";
import type { Market } from "@/payload-types";

const STATUS_TONE: Record<Market["status"], "accent" | "iris" | "outline"> = {
  live: "accent",
  next: "iris",
  study: "outline",
};

/** "BDMarket · Noiz Logistics" from a populated products relationship. */
function productNames(products: Market["products"]): string {
  return products
    .map((product) => (typeof product === "object" ? product.name : null))
    .filter(Boolean)
    .join(" · ");
}

export async function Markets() {
  const [{ sections }, markets, t] = await Promise.all([
    getLanding(),
    getMarkets(),
    getTranslations("Markets"),
  ]);

  return (
    <section id={SECTION_IDS.markets} className="scroll-mt-24">
      <div className="mx-auto grid w-full max-w-[1240px] items-start gap-15 px-7 py-19.5 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading
            index={sectionIndex(SECTION_IDS.markets)}
            title={sections.markets.title}
            className="mb-5"
          />

          <p className="mb-4 max-w-[30em] text-[1.03125rem] text-muted text-pretty">
            {sections.markets.body}
          </p>

          {sections.markets.note ? (
            <p className="m-0 font-mono text-xs text-faint">
              {sections.markets.note}
            </p>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {(["market", "products", "status"] as const).map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="border-b border-line p-2 text-left text-[0.6875rem] tracking-[0.08em] text-muted uppercase"
                  >
                    {t(`columns.${column}`)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {markets.map((market) => (
                <tr
                  key={market.id}
                  className="transition-colors hover:bg-foreground/4"
                >
                  <td className="border-b border-foreground/8 p-2">
                    {market.name}
                  </td>
                  <td className="border-b border-foreground/8 p-2">
                    {productNames(market.products)}
                  </td>
                  <td className="border-b border-foreground/8 p-2">
                    <Tag tone={STATUS_TONE[market.status]}>
                      {t(`status.${market.status}`)}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
