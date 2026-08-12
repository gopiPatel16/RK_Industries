/**
 * ── BRAND CONFIG ─────────────────────────────────────────────
 * Swap these values for your real company details.
 * Everything on the site reads from this file.
 */
export const site = {
  name: "Radha Krishna Industries",
  /** Short form for tight spaces — navbar, loader, chat bubbles */
  shortName: "Radha Krishna",
  /** Monogram letters shown in the logo mark */
  initials: "RK",
  legalName: "Radha Krishna Industries",
  tagline: "Crafting Entrances That Last Generations.",
  sub: "We manufacture premium flush doors and plywood with precision engineering and timeless craftsmanship.",
  address: "Industrial Area, Birgaon, Raipur, Chhattisgarh 493221, India",
  shortAddress: "Birgaon, Raipur, Chhattisgarh",
  phone: "+91 62603 01778",
  whatsapp: "916260301778",
  email: "info@radhakrishnaindustries.in",
  hours: "Mon – Sat · 9:00 AM – 7:00 PM",
  gstin: "22XXXXX0000X1Z5",
  mapsQuery: "Birgaon,Raipur,Chhattisgarh",
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
  stats: {
    years: 18,
    doors: 250000,
    dealers: 320,
    cities: 85,
  },
} as const;

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Flush Doors", href: "#doors" },
  { label: "Plywood", href: "#plywood" },
  { label: "Process", href: "#process" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;
