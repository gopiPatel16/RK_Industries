"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { Reveal, SplitText } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

const categories = ["All", "Flush Doors", "Plywood", "Factory", "Installations"] as const;
type Category = (typeof categories)[number];

type Item = {
  id: number;
  cat: Exclude<Category, "All">;
  title: string;
  place: string;
  hue: string;
  ratio: string;
  overlay: string;
};

const items: Item[] = [
  { id: 1, cat: "Flush Doors", title: "Walnut Twin-Inlay Entry", place: "Private villa, Raipur", hue: "wood-walnut", ratio: "aspect-[3/4]", overlay: "radial-gradient(60% 50% at 50% 30%, rgba(255,205,140,0.18), transparent 70%)" },
  { id: 2, cat: "Plywood", title: "BWP Marine Stack", place: "Dispatch bay", hue: "wood-teak", ratio: "aspect-[4/3]", overlay: "linear-gradient(160deg, rgba(255,205,140,0.1), transparent 60%)" },
  { id: 3, cat: "Factory", title: "Hot Press Line 2", place: "Birgaon works", hue: "wood-mahogany", ratio: "aspect-square", overlay: "radial-gradient(50% 60% at 70% 40%, rgba(255,150,60,0.2), transparent 70%)" },
  { id: 4, cat: "Installations", title: "Hotel Corridor Suite", place: "Hotel Amaltas, Jabalpur", hue: "wood-wenge", ratio: "aspect-[3/4]", overlay: "linear-gradient(200deg, rgba(232,168,96,0.14), transparent 55%)" },
  { id: 5, cat: "Flush Doors", title: "Golden Teak Quad", place: "Showroom display", hue: "wood-teak", ratio: "aspect-[3/5]", overlay: "radial-gradient(70% 50% at 50% 60%, rgba(255,205,140,0.15), transparent 70%)" },
  { id: 6, cat: "Factory", title: "Veneer Matching Table", place: "Finishing hall", hue: "wood-oak", ratio: "aspect-[4/3]", overlay: "linear-gradient(120deg, rgba(255,240,214,0.12), transparent 50%)" },
  { id: 7, cat: "Plywood", title: "Calibrated 19 mm", place: "QC station", hue: "wood-oak", ratio: "aspect-square", overlay: "linear-gradient(180deg, transparent 50%, rgba(19,9,6,0.5))" },
  { id: 8, cat: "Installations", title: "Clinic Fit-out", place: "Durg", hue: "wood-walnut", ratio: "aspect-[4/5]", overlay: "radial-gradient(60% 40% at 30% 30%, rgba(232,168,96,0.16), transparent 70%)" },
  { id: 9, cat: "Flush Doors", title: "Mahogany Grand Entry", place: "Farmhouse, Naya Raipur", hue: "wood-mahogany", ratio: "aspect-[3/5]", overlay: "radial-gradient(60% 50% at 50% 20%, rgba(255,180,100,0.2), transparent 70%)" },
  { id: 10, cat: "Factory", title: "Timber Yard at Dawn", place: "Birgaon works", hue: "wood-teak", ratio: "aspect-[4/3]", overlay: "linear-gradient(180deg, rgba(255,205,140,0.16), transparent 60%)" },
  { id: 11, cat: "Plywood", title: "Core Composition", place: "Layup line", hue: "wood-walnut", ratio: "aspect-square", overlay: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent 40%)" },
  { id: 12, cat: "Installations", title: "Duplex Stairwell", place: "Bhilai", hue: "wood-wenge", ratio: "aspect-[3/4]", overlay: "radial-gradient(50% 60% at 60% 50%, rgba(232,168,96,0.12), transparent 70%)" },
];

function Tile({ item, onOpen }: { item: Item; onOpen: () => void }) {
  return (
    <motion.button
      layoutId={`tile-${item.id}`}
      onClick={onOpen}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-champagne/10 text-left",
        item.ratio
      )}
      data-cursor
    >
      <div
        className={cn("wood absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-110", item.hue)}
      />
      <div className="absolute inset-0" style={{ background: item.overlay }} />
      <div className="absolute inset-0 bg-gradient-to-t from-walnut-950/85 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
        <div>
          <div className="text-[0.6rem] uppercase tracking-[0.2em] text-copper-bright">{item.cat}</div>
          <div className="mt-0.5 font-serif text-base text-ivory">{item.title}</div>
        </div>
        <ZoomIn size={15} className="mb-1 text-ivory-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </motion.button>
  );
}

export default function Gallery() {
  const [cat, setCat] = useState<Category>("All");
  const [openItem, setOpenItem] = useState<Item | null>(null);
  const visible = items.filter((i) => cat === "All" || i.cat === cat);

  return (
    <section id="gallery" className="relative scroll-mt-20 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="eyebrow mb-5">The gallery</div>
        </Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-xl font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
            <SplitText text="Grain, up close." />
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.72rem] font-medium transition-all duration-300",
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

        <div className="mt-12 columns-2 gap-5 md:columns-3 lg:columns-4">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <Tile key={item.id} item={item} onOpen={() => setOpenItem(item)} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {openItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center bg-walnut-950/92 p-6 backdrop-blur-xl"
            onClick={() => setOpenItem(null)}
          >
            <motion.div
              layoutId={`tile-${openItem.id}`}
              className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-champagne/15"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("wood h-[70vh] w-full", openItem.hue)} />
              <div className="absolute inset-0" style={{ background: openItem.overlay }} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-walnut-950/95 to-transparent p-7">
                <div className="text-[0.62rem] uppercase tracking-[0.22em] text-copper-bright">
                  {openItem.cat}
                </div>
                <div className="mt-1 font-serif text-2xl text-ivory">{openItem.title}</div>
                <div className="mt-0.5 text-xs text-ivory-dim">{openItem.place}</div>
              </div>
              <button
                onClick={() => setOpenItem(null)}
                aria-label="Close preview"
                className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ivory"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
