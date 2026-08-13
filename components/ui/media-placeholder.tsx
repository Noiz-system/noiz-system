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
  const stroke = onPanel ? "#ffffff" : "#14161f";
  const patternId = onPanel ? "noiz-hatch-panel" : "noiz-hatch-canvas";

  return (
    <svg
      viewBox="0 0 560 300"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      className={cn("block h-full w-full", className)}
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
            stroke={stroke}
            strokeOpacity={onPanel ? 0.16 : 0.14}
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
        fill={stroke}
        fillOpacity={onPanel ? 0.62 : 0.55}
      >
        {label}
      </text>
    </svg>
  );
}
