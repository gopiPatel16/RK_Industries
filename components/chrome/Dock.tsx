"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Sparkles } from "lucide-react";
import { site } from "@/lib/site";
import Assistant from "@/components/chrome/Assistant";

export default function Dock() {
  const [assistant, setAssistant] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[65] flex flex-col items-end gap-3">
        <Assistant open={assistant} onClose={() => setAssistant(false)} />

        <div className="flex items-center gap-2.5">
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
