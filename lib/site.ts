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

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Flush Doors", href: "#configurator" },
  { label: "Plywood", href: "#contact" },
  { label: "Process", href: "#process" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;
