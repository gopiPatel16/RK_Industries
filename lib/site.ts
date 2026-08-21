/**
 * ── BRAND CONFIG ─────────────────────────────────────────────
 * Swap these values for your real company details.
 * Everything on the site reads from this file.
 */
export const site = {
  name: "वanWood",
  /** Short form for tight spaces — navbar, loader, chat bubbles */
  shortName: "वanWood",
  /** Monogram shown in the logo mark (the व of the wordmark) */
  initials: "व",
  legalName: "वanWood",
  tagline: "Crafting Entrances That Last Generations.",
  sub: "We manufacture premium flush doors and plywood with precision engineering and timeless craftsmanship.",
  address: "Industrial Area, Birgaon, Raipur, Chhattisgarh 493221, India",
  shortAddress: "Birgaon, Raipur, Chhattisgarh",
  phone: "+91 62603 01778",
  whatsapp: "916260301778",
  email: "info@vanwood.in",
  hours: "Mon – Sat · 10:00 AM – 6:00 PM",
  gstin: "22AAUFR4139F1Z3",
  mapsQuery: "Birgaon,Raipur,Chhattisgarh",
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
  stats: {
    years: 5,
    doors: 250000,
    customers: 15,
    cities: 20,
  },
} as const;

/** A product entry with no `href` is announced but not yet orderable. */
export type NavChild = { label: string; href?: string; soon?: boolean };
export type NavItem = {
  label: string;
  href: string;
  children?: readonly NavChild[];
};

export const nav: readonly NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  {
    label: "Our Products",
    /* Falls through to the door configurator — the one product that can
       actually be ordered today. */
    href: "#configurator",
    children: [
      { label: "Flush Doors", href: "#configurator" },
      { label: "Plywood", soon: true },
      { label: "Block Board", soon: true },
    ],
  },
  { label: "Process", href: "#process" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];
