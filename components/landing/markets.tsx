import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { SECTION_IDS } from "@/lib/sections";

/**
 * Which market is at what stage is a business fact, not a translation — so the
 * status lives here and only its label comes from the catalogue.
 */
const MARKET_ROWS = [
  { key: "paris", status: "live" },
  { key: "lyon", status: "next" },
  { key: "brussels", status: "study" },
  { key: "westAfrica", status: "study" },
] as const;

const STATUS_TONE = {
  live: "accent",
  next: "iris",
  study: "outline",
} as const;

export async function Markets() {
  const [t, rows, status] = await Promise.all([
    getTranslations("Markets"),
    getTranslations("Markets.rows"),
    getTranslations("Markets.status"),
  ]);

  return (
    <section id={SECTION_IDS.markets} className="scroll-mt-24">
      <div className="mx-auto grid w-full max-w-[1240px] items-start gap-15 px-7 py-19.5 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading
            index={t("index")}
            title={t("title")}
            className="mb-5"
          />

          <p className="mb-4 max-w-[30em] text-[1.03125rem] text-muted text-pretty">
            {t("body")}
          </p>

          {/* Placeholder note carried over from the design — remove once the
              next markets are confirmed. */}
          <p className="m-0 font-mono text-xs text-faint">{t("note")}</p>
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
              {MARKET_ROWS.map((row) => (
                <tr
                  key={row.key}
                  className="transition-colors hover:bg-foreground/4"
                >
                  <td className="border-b border-foreground/8 p-2">
                    {rows(`${row.key}.market`)}
                  </td>
                  <td className="border-b border-foreground/8 p-2">
                    {rows(`${row.key}.products`)}
                  </td>
                  <td className="border-b border-foreground/8 p-2">
                    <Tag tone={STATUS_TONE[row.status]}>
                      {status(row.status)}
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
