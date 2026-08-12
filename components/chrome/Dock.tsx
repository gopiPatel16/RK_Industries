"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Sparkles, Volume2, VolumeX } from "lucide-react";
import { site } from "@/lib/site";
import Assistant from "@/components/chrome/Assistant";

/** Warm workshop ambience synthesized live — no audio files needed. */
function useAmbience() {
  const ctxRef = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);
  const [on, setOn] = useState(false);

  const toggle = async () => {
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02; // brown noise
        data[i] = last * 3.5;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 320;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.08;
      lfoGain.gain.value = 90;
      lfo.connect(lfoGain).connect(filter.frequency);
      lfo.start();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
      ctxRef.current = { ctx, gain };
    }
    const { ctx, gain } = ctxRef.current;
    await ctx.resume();
    const target = on ? 0 : 0.05;
    gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 1.2);
    setOn(!on);
  };

  return { on, toggle };
}

export default function Dock() {
  const { on, toggle } = useAmbience();
  const [assistant, setAssistant] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[65] flex flex-col items-end gap-3">
        <Assistant open={assistant} onClose={() => setAssistant(false)} />

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggle}
            aria-label={on ? "Mute ambience" : "Play ambience"}
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-ivory-dim transition-colors hover:text-copper-bright"
          >
            {on ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
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
