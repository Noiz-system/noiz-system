import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/cn";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * The Lucide icons the site uses (lucide-react 0.575, ISC licence), inlined
 * with their exact path data so the project does not take on an icon
 * package for a dozen glyphs. Same defaults as Lucide: 24×24, 2px round
 * stroke, `currentColor`, hidden from assistive tech.
 */
function createIcon(name: string, slug: string, nodes: ReactNode) {
  function Icon({ className, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        focusable="false"
        className={cn("lucide", `lucide-${slug}`, className)}
        {...props}
      >
        {nodes}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

/** Filled brand glyphs for the store buttons (same shapes as the BDMarket site). */
function createBrandIcon(name: string, d: string) {
  function Icon({ className, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        focusable="false"
        className={className}
        {...props}
      >
        <path d={d} />
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

export const AppleLogo = createBrandIcon(
  "AppleLogo",
  "M16.37 12.62c-.02-2.4 1.96-3.56 2.05-3.62-1.12-1.63-2.86-1.86-3.48-1.88-1.48-.15-2.89.87-3.64.87-.75 0-1.9-.85-3.13-.83-1.61.02-3.1.94-3.93 2.38-1.68 2.91-.43 7.21 1.2 9.57.8 1.15 1.75 2.45 3 2.4 1.2-.05 1.66-.78 3.11-.78 1.45 0 1.86.78 3.13.75 1.3-.02 2.12-1.17 2.9-2.33.92-1.34 1.3-2.64 1.31-2.7-.03-.01-2.51-.96-2.52-3.83zM14 5.6c.66-.8 1.11-1.92.99-3.03-.95.04-2.1.64-2.79 1.43-.61.7-1.15 1.84-1 2.92 1.06.08 2.14-.54 2.8-1.32z",
);

export const GooglePlayLogo = createBrandIcon(
  "GooglePlayLogo",
  "M3.6 1.8 13.5 12l-9.9 10.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1zm11 11.3 2.4 2.4-11 6.3 8.6-8.7zm3.6-3.7 3 1.7c.8.5.8 1.3 0 1.8l-3 1.7-2.7-2.6 2.7-2.6zM6 2.2l11 6.3-2.4 2.4L6 2.2z",
);

export const ArrowRight = createIcon(
  "ArrowRight",
  "arrow-right",
  <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>,
);

export const ArrowUpRight = createIcon(
  "ArrowUpRight",
  "arrow-up-right",
  <>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </>,
);

export const Check = createIcon("Check", "check", <path d="M20 6 9 17l-5-5" />);

export const CheckCircle2 = createIcon(
  "CheckCircle2",
  "circle-check",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </>,
);

export const Globe = createIcon(
  "Globe",
  "globe",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </>,
);

export const Headphones = createIcon(
  "Headphones",
  "headphones",
  <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />,
);

export const LifeBuoy = createIcon(
  "LifeBuoy",
  "life-buoy",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m4.93 4.93 4.24 4.24" />
    <path d="m14.83 9.17 4.24-4.24" />
    <path d="m14.83 14.83 4.24 4.24" />
    <path d="m9.17 14.83-4.24 4.24" />
    <circle cx="12" cy="12" r="4" />
  </>,
);

export const Minus = createIcon("Minus", "minus", <path d="M5 12h14" />);

export const Package = createIcon(
  "Package",
  "package",
  <>
    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
    <path d="M12 22V12" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <path d="m7.5 4.27 9 5.15" />
  </>,
);

export const Plus = createIcon(
  "Plus",
  "plus",
  <>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </>,
);

export const Search = createIcon(
  "Search",
  "search",
  <>
    <path d="m21 21-4.34-4.34" />
    <circle cx="11" cy="11" r="8" />
  </>,
);

export const Send = createIcon(
  "Send",
  "send",
  <>
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
    <path d="m21.854 2.147-10.94 10.939" />
  </>,
);

export const ShoppingBag = createIcon(
  "ShoppingBag",
  "shopping-bag",
  <>
    <path d="M16 10a4 4 0 0 1-8 0" />
    <path d="M3.103 6.034h17.794" />
    <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
  </>,
);
