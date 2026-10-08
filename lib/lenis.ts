import type Lenis from "lenis";

/** Module-level handle so any client component can drive smooth scrolling. */
export const lenisRef: { current: Lenis | null } = { current: null };

/**
 * Sections whose nav target isn't their top edge — a pinned, scroll-scrubbed
 * section registers the scroll position where its first frame is fully drawn.
 */
export const sectionLanding: Record<string, () => number | null> = {};

export function scrollToSection(hash: string) {
  const landing = sectionLanding[hash]?.();
  if (landing != null) {
    if (lenisRef.current) lenisRef.current.scrollTo(landing, { duration: 1.6 });
    else window.scrollTo({ top: landing, behavior: "smooth" });
    return;
  }

  let el = document.querySelector(hash);
  if (!el) return;
  /* A GSAP-pinned section reports its post-pin position once the reader has
     scrolled past it, which would land on its last frame. Its pin-spacer
     always sits where the section begins. */
  if (el.parentElement?.classList.contains("pin-spacer")) el = el.parentElement;
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el as HTMLElement, { offset: -80, duration: 1.6 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}
