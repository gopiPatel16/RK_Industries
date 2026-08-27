"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, Phone, Sparkles } from "lucide-react";
import { site } from "@/lib/site";
import { lenisRef } from "@/lib/lenis";
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

  const toTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
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
