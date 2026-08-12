"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: "01",
    title: "The Frame",
    copy: "Kiln-seasoned hardwood stiles and rails are jointed into a perfectly square outer frame — the skeleton of every Radha Krishna door.",
  },
  {
    n: "02",
    title: "Core Blocks",
    copy: "Seasoned wooden battens slide into the frame in a staggered brick pattern, killing hollow spots and future warp.",
  },
  {
    n: "03",
    title: "Core Sheet",
    copy: "A calibrated core sheet locks the battens into one monolithic slab with zero voids.",
  },
  {
    n: "04",
    title: "The Bond",
    copy: "Phenol-formaldehyde resin spreads edge to edge — a boil-proof bond that laughs at monsoons.",
  },
  {
    n: "05",
    title: "The Veneer",
    copy: "Hand-matched natural veneer is hot-pressed onto the face at 110°C, grain aligned sheet to sheet.",
  },
  {
    n: "06",
    title: "The Door",
    copy: "Trimmed, sanded to 240-grit, inspected twice. A flush door ready to last generations.",
  },
];

/**
 * Scroll-driven exploded assembly of a flush door.
 * The stage pins while six construction phases scrub with the scroll.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const captions = q<HTMLElement>(".step-caption");
      const blocks = q<HTMLElement>(".core-block");

      gsap.set(captions, { autoAlpha: 0, y: 24 });
      gsap.set(q(".layer-frame"), { autoAlpha: 0, scale: 1.15 });
      gsap.set(blocks, { autoAlpha: 0, x: (i) => (i % 2 ? 160 : -160) });
      gsap.set(q(".layer-core"), { autoAlpha: 0, scale: 0.85 });
      gsap.set(q(".layer-glue"), { autoAlpha: 0, scaleY: 0 });
      gsap.set(q(".layer-veneer"), { autoAlpha: 0, y: -260, rotateX: 25 });
      gsap.set(q(".final-glow"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=4200",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      const caption = (i: number) => {
        if (i > 0) tl.to(captions[i - 1], { autoAlpha: 0, y: -24, duration: 0.4 }, "<+0.2");
        tl.to(captions[i], { autoAlpha: 1, y: 0, duration: 0.5 });
      };

      // 01 · frame
      caption(0);
      tl.to(q(".layer-frame"), { autoAlpha: 1, scale: 1, duration: 1 }, "<");

      // 02 · blocks slide in
      caption(1);
      tl.to(blocks, { autoAlpha: 1, x: 0, duration: 1, stagger: 0.05 }, "<");

      // 03 · core sheet
      caption(2);
      tl.to(q(".layer-core"), { autoAlpha: 0.92, scale: 1, duration: 1 }, "<");

      // 04 · glue spread
      caption(3);
      tl.to(q(".layer-glue"), { autoAlpha: 0.75, scaleY: 1, duration: 1.2, ease: "power1.inOut" }, "<");

      // 05 · veneer drops on
      caption(4);
      tl.to(q(".layer-veneer"), { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.2 }, "<");
      tl.to(q(".layer-glue"), { autoAlpha: 0, duration: 0.6 }, "<+0.5");

      // 06 · final rotation
      caption(5);
      tl.to(q(".final-glow"), { autoAlpha: 1, duration: 0.8 }, "<");
      tl.to(q(".assembly"), { rotateY: 360, duration: 3, ease: "none" }, "<");
      tl.to({}, { duration: 0.4 }); // breathing room at the end
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={root}
      className="noise relative flex h-svh items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(80% 70% at 70% 50%, #1d0f07 0%, #130906 60%, #0d0603 100%)",
      }}
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
        {/* ── Captions ── */}
        <div className="relative z-10 order-1 h-48 md:h-52 lg:h-56">
          <div className="eyebrow mb-4 lg:mb-6">How a door is born</div>
          {steps.map((s) => (
            <div key={s.n} className="step-caption absolute inset-x-0 top-9 lg:top-12">
              <div className="font-serif text-4xl text-copper/25 lg:text-6xl">{s.n}</div>
              <h3 className="mt-1 font-serif text-2xl text-ivory lg:text-4xl">{s.title}</h3>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-ivory-dim lg:mt-3 lg:text-sm">{s.copy}</p>
            </div>
          ))}
        </div>

        {/* ── Exploded assembly stage ── */}
        <div
          className="order-2 flex items-center justify-center"
          style={{ perspective: "1600px" }}
        >
          <div className="assembly relative aspect-[10/19] w-40 [transform-style:preserve-3d] md:w-56 lg:w-64">
            {/* dynamic light behind final door */}
            <div
              className="final-glow absolute inset-[-25%] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,168,96,0.28), transparent 65%)",
                filter: "blur(14px)",
              }}
            />
            {/* 01 frame */}
            <div className="layer-frame absolute inset-0 rounded-lg border-[10px] border-[#3a2413] shadow-[0_24px_70px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(201,138,75,0.3)]" />
            {/* 02 core blocks */}
            <div className="absolute inset-[10px] grid grid-cols-3 gap-[4px] p-[4px]">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`core-block wood rounded-[2px] ${i % 3 === 1 ? "wood-teak" : "wood-walnut"}`}
                  style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4)" }}
                />
              ))}
            </div>
            {/* 03 core sheet */}
            <div
              className="layer-core wood wood-oak absolute inset-[8px] rounded-md"
              style={{ boxShadow: "inset 0 0 20px rgba(0,0,0,0.4)" }}
            />
            {/* 04 glue */}
            <div
              className="layer-glue absolute inset-[8px] origin-top rounded-md"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,190,90,0.85), rgba(214,142,52,0.75))",
                filter: "blur(1px)",
                boxShadow: "0 0 30px rgba(255,190,90,0.4)",
              }}
            />
            {/* 05 veneer face */}
            <div
              className="layer-veneer wood wood-mahogany absolute inset-[4px] rounded-md"
              style={{
                transform: "translateZ(14px)",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(0,0,0,0.45)",
              }}
            >
              <div
                className="absolute inset-0 rounded-md"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.1), transparent 25%, rgba(0,0,0,0.25) 60%, transparent 85%)",
                }}
              />
              <div className="absolute inset-x-[18%] inset-y-[8%] flex flex-col justify-between">
                <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(232,168,96,0.7), transparent)" }} />
                <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(232,168,96,0.7), transparent)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* step progress rail */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {steps.map((s) => (
          <span key={s.n} className="h-1 w-8 rounded-full bg-champagne/15" />
        ))}
      </div>
    </section>
  );
}
