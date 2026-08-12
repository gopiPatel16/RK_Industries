/** Brand icons (removed from lucide v1) — minimal inline SVGs. */

type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function InstagramIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M15.5 3.5h-2.6a3.4 3.4 0 0 0-3.4 3.4v3H7v3.2h2.5v7.4h3.3v-7.4h2.6l.5-3.2h-3.1V7.2c0-.5.4-.9.9-.9h2.3z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="9.5" width="3.4" height="11" />
      <circle cx="4.7" cy="5.3" r="1.7" />
      <path d="M10.5 20.5v-6.2a3.2 3.2 0 0 1 6.4 0v6.2M10.5 9.5v2" />
    </svg>
  );
}

export function YoutubeIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10 9.3l5 2.7-5 2.7z" fill="currentColor" stroke="none" />
    </svg>
  );
}
