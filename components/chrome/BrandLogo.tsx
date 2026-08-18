import { cn } from "@/lib/utils";

/**
 * The वanWood wordmark, rebuilt as text + SVG rather than the supplied
 * artwork: the original is a render on a white ground, which can't sit on a
 * dark navbar. This keeps the logo's structure — two-tone lettering, the rule
 * running off the "व", and the open door closing the word — while staying
 * crisp at any size and inheriting the site's copper/ivory palette.
 */
export default function BrandLogo({
  className,
  showTagline = true,
  sizeClass = "text-[1.35rem]",
}: {
  className?: string;
  showTagline?: boolean;
  /** Font size of the wordmark — the door mark scales with it (em units). */
  sizeClass?: string;
}) {
  return (
    <span className={cn("flex flex-col leading-none", className)} data-cursor>
      <span className={cn("flex items-center font-serif tracking-tight", sizeClass)}>
        <span>
          <span className="text-copper">व</span>
          <span className="text-ivory">an</span>
          <span className="text-copper-bright">Wood</span>
        </span>

        {/* rule + open door, as in the logo */}
        <svg
          width="1.2em"
          height="1.39em"
          viewBox="0 0 26 30"
          fill="none"
          aria-hidden
          className="ml-[0.05em] -translate-y-[0.14em]"
        >
          <defs>
            <linearGradient id="vw-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8A860" />
              <stop offset="55%" stopColor="#C98A4B" />
              <stop offset="100%" stopColor="#8a5a2c" />
            </linearGradient>
          </defs>
          {/* frame: rule across the top, down the right jamb */}
          <path
            d="M0 6 H18 V27"
            stroke="#C98A4B"
            strokeWidth="1.6"
            strokeLinecap="square"
          />
          {/* the door, swung open toward the viewer */}
          <path
            d="M8.5 9.5 L18 7.2 V26 L8.5 28.4 Z"
            fill="url(#vw-leaf)"
            stroke="#6b4226"
            strokeWidth="0.7"
            strokeLinejoin="round"
          />
          {/* handle */}
          <circle cx="10.6" cy="18.8" r="0.95" fill="#FFF3DF" />
        </svg>
      </span>

      {showTagline && (
        <span className="mt-[3px] whitespace-nowrap text-[0.47rem] font-semibold uppercase tracking-[0.2em] text-ivory-dim">
          Plywood · Flush Doors · Block Boards
        </span>
      )}
    </span>
  );
}
