"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, DoorOpen, MessageCircle, Phone, Sparkles } from "lucide-react";
import { site } from "@/lib/site";
import { lenisRef, scrollToSection } from "@/lib/lenis";
import Assistant from "@/components/chrome/Assistant";

export default function Dock() {
  const [assistant, setAssistant] = useState(false);

  /* Back-to-top appears once the hero is behind you — showing it at the top of
     the page would be a button that does nothing. */
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * The order tab rides level with the scrollbar thumb, so it must reproduce the
   * thumb's geometry rather than simply spread itself over the viewport: the
   * thumb is sized by how much of the document fits on screen, and travels only
   * `viewport - thumb` pixels. Mapping the tab across the full height instead
   * makes it drift out of step, fast at first and slow at the end.
   *
   * Committed as a plain CSS `top` from a scroll listener on purpose — an
   * animated MotionValue only moves on a rendered frame, and this has to hold
   * its place even when the page is not compositing.
   */
  const tabRef = useRef<HTMLButtonElement>(null);
  const [tabTop, setTabTop] = useState(0);
  useEffect(() => {
    const place = () => {
      const vh = window.innerHeight;
      const sh = document.documentElement.scrollHeight;
      const max = sh - vh;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // WebKit will not draw a thumb shorter than ~20px however long the page is.
      const thumbH = Math.max(20, (vh * vh) / sh);
      const thumbCentre = p * (vh - thumbH) + thumbH / 2;

      const tabH = tabRef.current?.offsetHeight ?? 0;
      const top = thumbCentre - tabH / 2;
      setTabTop(Math.min(Math.max(top, 4), vh - tabH - 4));
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, []);

  const toTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Order tab — rides the right edge level with the scrollbar thumb, so it
          travels with the scrollbar as the page moves. `100%` inside the calc is
          the button's own height, which keeps it inside the viewport at both
          ends of the track. */}
      <button
        ref={tabRef}
        onClick={() => scrollToSection("#configurator")}
        aria-label="Order now — go to the door configurator"
        style={{
          top: `${tabTop}px`,
          background:
            "linear-gradient(135deg, var(--copper-bright), var(--copper) 55%, #9c6534)",
          boxShadow:
            "0 6px 22px rgba(201,138,75,0.35), inset 0 1px 0 rgba(255,244,224,0.5)",
        }}
        className="group fixed right-0 z-[64] flex items-center gap-1.5 rounded-l-full py-1.5 pl-3 pr-2.5 text-[0.58rem] font-bold tracking-wide text-walnut-950 transition-[filter,box-shadow] duration-300 hover:brightness-110 sm:py-2 sm:pl-3.5 sm:pr-3 sm:text-[0.63rem]"
      >
        <DoorOpen size={11} className="transition-transform group-hover:-translate-x-0.5" />
        Order Now
      </button>

      <div className="fixed bottom-5 right-5 z-[65] flex flex-col items-end gap-3">
        <Assistant open={assistant} onClose={() => setAssistant(false)} />

        <div className="flex items-center gap-2.5">
          <AnimatePresence>
            {showTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={toTop}
                aria-label="Back to top"
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-ivory-dim transition-colors hover:text-copper-bright"
              >
                <ArrowUp size={16} />
              </motion.button>
            )}
          </AnimatePresence>
          <button
            onClick={() => setAssistant((v) => !v)}
            aria-label={assistant ? "Close assistant" : "Open assistant"}
            aria-expanded={assistant}
            className={`glass flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
              assistant ? "text-copper-bright" : "text-ivory-dim hover:text-copper-bright"
            }`}
          >
            <Sparkles size={16} />
          </button>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            aria-label="Call us"
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-ivory-dim transition-colors hover:text-copper-bright"
          >
            <Phone size={16} />
          </a>
          <motion.a
            href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi ${site.shortName} Industries, I'd like a quote`)}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            whileHover={{ scale: 1.08 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3ddc71] to-[#1faa4f] text-walnut-950 shadow-[0_8px_28px_rgba(61,220,113,0.35)]"
          >
            <MessageCircle size={19} />
          </motion.a>
        </div>
      </div>
    </>
  );
}
