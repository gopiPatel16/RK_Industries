"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { Reveal, SplitText } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";
import {
  shots,
  galleryCategories as categories,
  type GalleryCategory as Category,
  type Shot,
} from "@/lib/gallery";

export default function Gallery() {
  const [cat, setCat] = useState<Category>("All");
  const [open, setOpen] = useState<Shot | null>(null);

  const visible = shots.filter((s) => cat === "All" || s.cat === cat);

  return (
    <section id="gallery" className="relative scroll-mt-20 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="eyebrow mb-5">The gallery</div>
        </Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-xl font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
            <SplitText text="Inside the works." />
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-[0.72rem] font-medium transition-all duration-300",
                  cat === c
                    ? "border-copper bg-copper/15 text-copper-bright"
                    : "border-champagne/15 text-ivory-dim hover:border-champagne/35 hover:text-ivory"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry — photos keep their natural aspect ratio */}
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {visible.map((s, i) => (
            <motion.button
              key={s.title}
              onClick={() => s.src && setOpen(s)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-champagne/10 text-left"
              data-cursor
            >
              {s.src ? (
                <Image
                  src={s.src}
                  alt={`${s.title} — ${s.caption}`}
                  width={s.w}
                  height={s.h}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                />
              ) : (
                /* station still awaiting its photograph — named, not skipped */
                <div
                  className="flex items-center justify-center bg-walnut-900/50 px-6 text-center"
                  style={{ aspectRatio: `${s.w} / ${s.h}` }}
                >
                  <span className="font-serif text-xl leading-snug text-champagne/70">
                    {s.title}
                  </span>
                </div>
              )}
              {/* keeps the tile in key with the dark page, lifts on hover */}
              <div className="pointer-events-none absolute inset-0 bg-walnut-950/25 transition-opacity duration-500 group-hover:opacity-0" />
              {/* step number, kept clear of the photo's own caption (bottom-left) */}
              <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2">
                <span className="rounded-full bg-walnut-950/70 px-2.5 py-1 font-serif text-[0.7rem] text-copper-bright backdrop-blur-sm">
                  {String(shots.indexOf(s) + 1).padStart(2, "0")}
                </span>
                <ZoomIn
                  size={14}
                  className="text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Fullscreen preview */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center bg-walnut-950/94 p-4 backdrop-blur-xl sm:p-8"
            onClick={() => setOpen(null)}
          >
            <motion.figure
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-full w-full max-w-5xl overflow-hidden rounded-2xl border border-champagne/15"
              onClick={(e) => e.stopPropagation()}
            >
              {/* caption sits at the top — the photo carries its own at bottom-left */}
              <figcaption className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 bg-gradient-to-b from-walnut-950/90 to-transparent px-5 py-4">
                <span className="font-serif text-sm text-copper-bright">
                  {String(shots.indexOf(open) + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-ivory">{open.title}</span>
                <span className="hidden text-xs text-ivory-dim sm:inline">· {open.caption}</span>
              </figcaption>
              {open.src && (
                <Image
                  src={open.src}
                  alt={`${open.title} — ${open.caption}`}
                  width={open.w}
                  height={open.h}
                  sizes="100vw"
                  className="max-h-[85vh] w-full object-contain"
                />
              )}
              <button
                onClick={() => setOpen(null)}
                aria-label="Close preview"
                className="glass absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full text-ivory"
              >
                <X size={16} />
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
