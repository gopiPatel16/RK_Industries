import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * The Radhavan door-R mark, redrawn as SVG rather than the supplied artwork:
 * the original is dark ink on a cream ground, which can't sit on a dark
 * navbar. The R's bowl and leg crown two door leaves that meet at a chevron
 * foot; the right leaf carries the handle slot. Copper on dark, crisp at any
 * size.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 104 140" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id="rv-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8A860" />
          <stop offset="55%" stopColor="#C98A4B" />
          <stop offset="100%" stopColor="#8a5a2c" />
        </linearGradient>
        <mask id="rv-slot">
          <rect width="104" height="140" fill="white" />
          <rect x="62" y="73" width="7" height="17" fill="none" stroke="black" strokeWidth="2.4" />
        </mask>
      </defs>
      {/* R: top bar, bowl and leg */}
      <path
        d="M0 4.5 H80 A16.5 16.5 0 0 1 80 37.5 H73 L99 57"
        stroke="url(#rv-wood)"
        strokeWidth="9"
        strokeLinejoin="miter"
      />
      {/* left leaf — the R's stem */}
      <path d="M0 12.5 L45 35.5 V138 L0 114 Z" fill="url(#rv-wood)" />
      {/* right leaf, with the handle slot cut out */}
      <path d="M52 39 L101 64 V114 L52 138 Z" fill="url(#rv-wood)" mask="url(#rv-slot)" />
    </svg>
  );
}

export default function BrandLogo({
  className,
  showTagline = true,
  sizeClass = "text-[1.2rem]",
}: {
  className?: string;
  showTagline?: boolean;
  /** Font size of the wordmark — the mark scales with it (em units). */
  sizeClass?: string;
}) {
  return (
    <span className={cn("flex items-center gap-[0.55em] leading-none", sizeClass, className)} data-cursor>
      <BrandMark className="h-[2.3em] w-auto shrink-0" />
      <span className="flex flex-col items-start">
        <span className="font-sans font-medium uppercase tracking-[0.2em] text-ivory">
          {site.name}
        </span>
        {showTagline && (
          <span className="mt-[0.45em] whitespace-nowrap text-[0.36em] font-semibold uppercase tracking-[0.2em] text-ivory-dim">
            {site.motto}
          </span>
        )}
      </span>
    </span>
  );
}
