"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Axe, Scissors, Sparkles, Combine, SearchCheck, Package } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    icon: Axe,
    title: "Wood Selection",
    copy: "Only FSC-tracked hardwood with under 12% moisture makes it past the gate.",
    stat: "12% max moisture",
    hue: "wood-teak",
  },
  {
    icon: Scissors,
    title: "Precision Cutting",
    copy: "CNC panel saws hold tolerances a human hair would fail.",
    stat: "±0.5 mm tolerance",
    hue: "wood-walnut",
  },
  {
    icon: Combine,
    title: "Hot Pressing",
    copy: "Hydraulic day-light presses fuse core and face at 110°C.",
    stat: "140 tonnes of press",
    hue: "wood-mahogany",
  },
  {
    icon: Sparkles,
    title: "Polishing",
    copy: "Wide-belt sanders take every face to a 240-grit silk finish.",
    stat: "240-grit finish",
    hue: "wood-oak",
  },
  {
    icon: SearchCheck,
    title: "Quality Checks",
    copy: "Every single door is checked twice — squareness, bond, finish.",
    stat: "2× inspection, 100% of doors",
    hue: "wood-wenge",
  },
  {
    icon: Package,
    title: "Packaging",
    copy: "Corner-guarded, shrink-wrapped, and dispatched across India.",
    stat: "85+ cities served",
    hue: "wood-teak",
  },
];

/** Cinematic horizontal-scroll tour of the factory floor. */
export default function Factory() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = track.current!;
      const scroll = () => el.scrollWidth - window.innerWidth;
      gsap.to(el, {
        x: () => -scroll(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${scroll()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="factory"
      ref={root}
      className="relative h-svh overflow-hidden bg-walnut-950"
    >
      <div className="absolute left-6 top-16 z-10 lg:left-12 lg:top-24">
        <div className="eyebrow mb-3">The factory floor</div>
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ivory md:text-4xl">
          Six stations. Zero shortcuts.
        </h2>
      </div>

      <div
        ref={track}
        className="flex h-full items-end gap-6 px-6 pb-14 pt-56 will-change-transform lg:items-center lg:px-12 lg:pt-0"
      >
        {stages.map((s, i) => {
          const Icon = s.icon;
          return (
            <article
              key={s.title}
              className="glass reflect noise relative flex h-[62vh] w-[78vw] shrink-0 flex-col justify-end overflow-hidden rounded-[1.75rem] p-7 md:w-[46vw] lg:h-[64vh] lg:w-[34vw]"
            >
              {/* "footage" — animated wood pan standing in for autoplay video */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={`wood ${s.hue} absolute inset-[-15%]`}
                  style={{
                    animation: `slowZoom ${16 + i * 2}s ease-in-out infinite alternate`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(19,9,6,0.25) 0%, rgba(19,9,6,0.55) 55%, rgba(19,9,6,0.92) 100%)",
                  }}
                />
                {/* light sweep = machine movement */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 42%, rgba(255,205,140,0.1) 50%, transparent 58%)",
                    backgroundSize: "300% 100%",
                    animation: `shimmer ${5 + i}s linear infinite`,
                  }}
                />
              </div>

              <div className="relative z-10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="glass flex h-10 w-10 items-center justify-center rounded-full">
                    <Icon size={16} className="text-copper-bright" />
                  </span>
                  <span className="font-serif text-5xl text-champagne/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-ivory">{s.title}</h3>
                <p className="mt-2 max-w-xs text-[0.82rem] leading-relaxed text-ivory-dim">
                  {s.copy}
                </p>
                <div className="mt-4 inline-block rounded-full border border-copper/40 bg-walnut-950/60 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-copper-bright">
                  {s.stat}
                </div>
              </div>
            </article>
          );
        })}

        {/* end card */}
        <div className="flex h-[62vh] w-[60vw] shrink-0 items-center justify-center md:w-[36vw]">
          <div className="text-center">
            <div className="font-serif text-4xl leading-tight text-champagne md:text-5xl">
              Then it ships.
            </div>
            <div className="mt-3 text-sm text-ivory-dim">Keep scrolling ↓</div>
          </div>
        </div>
      </div>
    </section>
  );
}
