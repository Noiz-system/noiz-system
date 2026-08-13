import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/cn";

const TICKER_KEYS = [
  "bdmarket",
  "logistics",
  "paris",
  "idf",
  "saintDenis",
  "montreuil",
  "creteil",
  "mobileMoney",
  "lastMile",
] as const;

/** Seconds for one full pass; tuned so the type stays readable. */
const DURATION_SECONDS = 34;

export async function Ticker() {
  const t = await getTranslations("Ticker");
  const items = TICKER_KEYS.map((key) => t(key));

  return (
    <div className="relative overflow-hidden border-t border-panel-line py-3.5">
      <div
        className="animate-marquee flex w-[200%]"
        style={{ ["--marquee-duration" as string]: `${DURATION_SECONDS}s` }}
      >
        <TickerTrack items={items} />
        <TickerTrack items={items} aria-hidden />
      </div>
    </div>
  );
}

function TickerTrack({
  items,
  ...rest
}: { items: string[] } & React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className="flex w-1/2 flex-none list-none gap-11 pr-11 font-display text-sm tracking-[0.16em] whitespace-nowrap text-panel-muted uppercase"
      {...rest}
    >
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-11">
          {item}
          <span
            aria-hidden
            className={cn(index % 2 === 0 ? "text-iris-400" : "text-accent-400")}
          >
            ◆
          </span>
        </li>
      ))}
    </ul>
  );
}
