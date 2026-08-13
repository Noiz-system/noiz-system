import { cn } from "@/lib/cn";

/**
 * Hatched stand-in for artwork that has not been shot yet.
 *
 * Deliberately reads as a placeholder rather than as finished design, so an
 * unfilled slot is obvious in review. Swap for `next/image` once the asset
 * exists.
 */
export function MediaPlaceholder({
  label,
  onPanel = false,
  className,
}: {
  label: string;
  onPanel?: boolean;
  className?: string;
}) {
  // Derived from the label so each instance owns its pattern: duplicate SVG ids
  // in one document are invalid, and labels are unique per placeholder.
  const patternId = `noiz-hatch-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  return (
    <svg
      viewBox="0 0 560 300"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      // `currentColor` throughout, so the hatching follows the semantic text
      // colour and stays visible when the scheme flips to dark.
      className={cn(
        "block h-full w-full",
        onPanel ? "text-panel-foreground" : "text-foreground",
        className,
      )}
    >
      <defs>
        <pattern
          id={patternId}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            stroke="currentColor"
            strokeOpacity={0.16}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="560" height="300" fill={`url(#${patternId})`} />
      <text
        x="280"
        y="154"
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="11"
        fill="currentColor"
        fillOpacity={0.6}
      >
        {label}
      </text>
    </svg>
  );
}
