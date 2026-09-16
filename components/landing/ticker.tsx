import { getLanding } from "@/lib/cms";
import { cn } from "@/lib/cn";

/** Seconds for one full pass; tuned so the type stays readable. */
const DURATION_SECONDS = 34;

export async function Ticker() {
  const { hero } = await getLanding();
  const items = (hero.ticker ?? []).map((item) => item.label);

  if (items.length === 0) return null;

  return (
    <div className="relative overflow-hidden border-t border-panel-line py-3.5">
      {/* `w-max` lets the pair of tracks size to their content. A percentage
          width would clamp each track narrower than its items and overlap them
          at the seam; the -50% keyframe then shifts by exactly one track. */}
      <div
        className="animate-marquee flex w-max"
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
      className="flex flex-none list-none gap-11 pr-11 font-display text-sm tracking-[0.16em] whitespace-nowrap text-panel-muted uppercase"
      {...rest}
    >
      {items.map((item, index) => (
        <li key={`${index}-${item}`} className="flex items-center gap-11">
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
