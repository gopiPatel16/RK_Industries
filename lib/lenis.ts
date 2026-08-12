import type Lenis from "lenis";

/** Module-level handle so any client component can drive smooth scrolling. */
export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollToSection(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el as HTMLElement, { offset: -80, duration: 1.6 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}
