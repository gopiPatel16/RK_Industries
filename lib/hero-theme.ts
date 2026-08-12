/**
 * ── HERO THEME SWITCHER ──────────────────────────────────────
 * Change this one line to swap the homepage hero's visual theme.
 * Text, layout, buttons, navbar and timings are shared — only the
 * backdrop scene changes.
 */
export type HeroTheme = "artisan" | "luxury-gallery";

export const currentTheme: HeroTheme = "artisan";
// artisan          → THE ARTISAN WORKSHOP  (photo background, spotlight, dust)
// luxury-gallery   → LUXURY PRODUCT GALLERY (golden halo, smoke, showroom)
