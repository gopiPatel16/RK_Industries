"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { stations, spellCount } from "@/lib/gallery";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

/**
 * A guided walk of the factory floor — one station per photograph, moved
 * with the arrows (or arrow keys / swipe). Deliberately NOT scroll-driven:
 * the page scrolls normally past this section.
 */
const GAP_PX = 20; // matches `gap-5` on the track

export default function Factory() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  /**
   * Distance to shift per step, in pixels. Measured rather than expressed as a
   * percentage: a % translate resolves against the track's own width (all
   * twelve cards) rather than the visible area, which slides the wrong amount.
   */
  const [step, setStep] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  /** Pointer x where a swipe began, so touch users can flick between cards. */
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = window.innerWidth;
      const pv = w < 640 ? 1 : w < 1024 ? 2 : 3;
      setPerView(pv);
      const cardW = (el.clientWidth - (pv - 1) * GAP_PX) / pv;
      setStep(cardW + GAP_PX);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maxIndex = Math.max(0, stations.length - perView);
  const clamped = Math.min(index, maxIndex);
  const go = (dir: -1 | 1) =>
    setIndex((i) => Math.min(maxIndex, Math.max(0, i + dir)));

  // keyboard support when the carousel has focus
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  const atStart = clamped === 0;
  const atEnd = clamped >= maxIndex;

  return (
    <section
      id="factory"
      className="relative overflow-hidden bg-walnut-950 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Heading + arrows ── */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <div className="eyebrow mb-3">The factory floor</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="max-w-md font-serif text-3xl leading-tight text-ivory md:text-4xl">
                {spellCount(stations.length)} stations. Zero shortcuts.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="flex items-center gap-3">
              <span className="mr-2 font-serif text-sm text-ivory-dim">
                <span className="text-copper-bright">
                  {String(clamped + 1).padStart(2, "0")}
                </span>
                <span className="mx-1 opacity-50">/</span>
                {String(stations.length).padStart(2, "0")}
              </span>
              {([-1, 1] as const).map((dir) => {
                const disabled = dir === -1 ? atStart : atEnd;
                const Icon = dir === -1 ? ArrowLeft : ArrowRight;
                return (
                  <button
                    key={dir}
                    onClick={() => go(dir)}
                    disabled={disabled}
                    aria-label={dir === -1 ? "Previous station" : "Next station"}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300",
                      disabled
                        ? "cursor-not-allowed border-champagne/10 text-ivory-dim/30"
                        : "border-copper/45 text-copper-bright hover:bg-copper/15 hover:shadow-[0_0_24px_rgba(212,161,90,0.35)]"
                    )}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* ── Track ── */}
        <div
          ref={viewportRef}
          className="relative mt-10 overflow-hidden focus:outline-none"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={(e) => { swipeStart.current = e.clientX; }}
          onPointerUp={(e) => {
            if (swipeStart.current === null) return;
            const dx = e.clientX - swipeStart.current;
            if (dx < -50) go(1);
            else if (dx > 50) go(-1);
            swipeStart.current = null;
          }}
          onPointerCancel={() => { swipeStart.current = null; }}
          role="group"
          aria-roledescription="carousel"
          aria-label="Factory floor stations"
        >
          <div
            className="flex gap-5 will-change-transform"
            style={{
              transform: `translate3d(${-clamped * step}px, 0, 0)`,
              transition: "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {stations.map((s, i) => (
              <article
                key={s.title}
                aria-hidden={i < clamped || i >= clamped + perView}
                className="relative shrink-0 overflow-hidden rounded-[1.5rem] border border-champagne/10"
                style={{ width: `calc((100% - ${(perView - 1) * GAP_PX}px) / ${perView})` }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {s.src ? (
                    <>
                      <Image
                        src={s.src}
                        alt={`${s.title} — ${s.caption}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      {/* keeps the photo's own burnt-in caption legible */}
                      <div className="absolute inset-0 bg-gradient-to-t from-walnut-950/85 via-walnut-950/10 to-transparent" />
                    </>
                  ) : (
                    /* station still awaiting its photograph — named, not skipped */
                    <div className="absolute inset-0 flex items-center justify-center bg-walnut-900/50 px-6 text-center">
                      <span className="font-serif text-xl leading-snug text-champagne/70">
                        {s.title}
                      </span>
                    </div>
                  )}
                  <span className="absolute right-4 top-4 rounded-full bg-walnut-950/70 px-2.5 py-1 font-serif text-[0.7rem] text-copper-bright backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-ivory">{s.title}</h3>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-ivory-dim">
                    {s.caption}
                  </p>
                  <div className="mt-4 inline-block rounded-full border border-copper/40 bg-walnut-950/60 px-3.5 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-copper-bright">
                    {s.cat}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── Progress rail ──
             The bar itself stays 4px, but each button carries vertical padding
             so there is a finger-sized target around it on touch screens. */}
        <div className="mt-6 flex items-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to station ${i + 1}`}
              className="group/dot flex h-11 items-center px-0.5"
            >
              <span
                className={cn(
                  "block h-1 rounded-full transition-all duration-500",
                  i === clamped
                    ? "w-10 bg-copper-bright"
                    : "w-5 bg-champagne/15 group-hover/dot:bg-champagne/30"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
