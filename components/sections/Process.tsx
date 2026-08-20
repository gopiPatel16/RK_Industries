"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { lenisRef } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * The real वanWood layup, bottom face upward — an eight-layer
 * sandwich pressed between two thin veneer skins:
 *
 *   veneer → core (3–4 horizontal pieces) → glue → frame
 *          → core blocks (vertical sticks) → core (3–4 horizontal pieces)
 *          → glue → veneer
 */
const steps = [
  {
    n: "01",
    title: "Veneer Sheet",
    copy: "The layup begins face-down: a thin, hand-matched natural veneer sheet is laid as the door's outer skin.",
  },
  {
    n: "02",
    title: "Core Sheet",
    copy: "Three to four horizontal core pieces are laid across the veneer, edge to edge, to form the first core layer.",
  },
  {
    n: "03",
    title: "The Bond",
    copy: "Phenol-formaldehyde resin spreads edge to edge — a boil-proof bond that laughs at monsoons.",
  },
  {
    n: "04",
    title: "The Frame",
    copy: "Kiln-seasoned hardwood stiles and rails are jointed into a perfectly square outer frame — the skeleton of every वanWood door.",
  },
  {
    n: "05",
    title: "Core Blocks",
    copy: "Small vertical stick-like blocks are packed tight inside the frame, killing hollow spots and future warp.",
  },
  {
    n: "06",
    title: "Core Sheet",
    copy: "A second set of three to four horizontal core pieces closes the core over the blocks.",
  },
  {
    n: "07",
    title: "The Bond",
    copy: "The second glue line seals the stack, edge to edge, before the final skin goes on.",
  },
  {
    n: "08",
    title: "Veneer Sheet",
    copy: "The last thin veneer sheet is hot-pressed onto the face at 110°C, grain aligned sheet to sheet.",
  },
];

/* ── Geometry ── */
const CORE_PIECES = 4; // horizontal pieces per core layer
const STICKS = 16; // vertical stick-like core blocks across the frame

const pieceTone = (i: number) => (i % 2 === 0 ? "wood-oak" : "wood-teak");
const stickTone = (c: number, s: number) => {
  const t = (c * 3 + s * 5) % 4;
  return t === 0 ? "wood-teak" : t === 2 ? "wood-oak" : "wood-walnut";
};

/**
 * Deterministic pseudo-random in [0,1) — stable across server and client so
 * the stick layout never mismatches on hydration.
 */
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/**
 * Off-cut sticks vary in width; flex-grow makes them fill the frame exactly.
 * Values are rounded — CSS serialises floats to 6 significant digits, so a
 * longer number would render differently on server and client and trip a
 * hydration mismatch.
 */
const r3 = (n: number) => Math.round(n * 1000) / 1000;
const stickWidth = (c: number) => r3(0.55 + rand(c + 1) * 1.35);
/** …and are pieced from a varying number of short lengths. */
const stickSegments = (c: number) => 4 + Math.floor(rand(c + 41) * 4); // 4–7
const segmentHeight = (c: number, s: number) => r3(0.6 + rand(c * 7 + s + 13) * 1.1);

/** One core layer: 3–4 horizontal pieces laid edge to edge. */
function CoreLayer({ face }: { face: "back" | "front" }) {
  return (
    <div className={`layer-core-${face} absolute inset-[9px] flex flex-col gap-[2px]`}>
      {Array.from({ length: CORE_PIECES }).map((_, i) => (
        <div
          key={i}
          className={`core-piece-${face} wood ${pieceTone(i)} flex-1 rounded-[2px]`}
          style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.5), inset 0 0 14px rgba(0,0,0,0.35)" }}
        />
      ))}
    </div>
  );
}

/**
 * Scroll-driven exploded assembly of a flush door.
 * The stage pins while the eight layup phases scrub with the scroll.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);
  const pinST = useRef<ScrollTrigger | null>(null);

  const [goingUp, setGoingUp] = useState(false);

  /**
   * Which way the reader is travelling. Taken from wheel and touch input rather
   * than scroll position: smooth scrolling keeps driving the page after the
   * gesture ends, so scroll events report the animation, not the intent.
   */
  useEffect(() => {
    const setDir = (up: boolean) => setGoingUp((was) => (was === up ? was : up));
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 1) setDir(e.deltaY < 0);
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      if (Math.abs(y - touchY) > 4) {
        setDir(y > touchY); // finger moving down drags the page upward
        touchY = y;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home") setDir(true);
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "End") setDir(false);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  /**
   * Leave the pinned sequence in whichever direction the reader is already
   * heading — past the pin release going down, back before its start going up.
   * Someone who has watched the eight phases once shouldn't have to scrub
   * through them again in either direction.
   */
  const skipSection = () => {
    const st = pinST.current;
    const start = st ? st.start : (root.current?.offsetTop ?? 0);
    const end = st ? st.end : start + 5600;
    const target = goingUp ? Math.max(start - 2, 0) : end + 2;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const captions = q<HTMLElement>(".step-caption");
      const sticks = q<HTMLElement>(".core-stick");
      const backPieces = q<HTMLElement>(".core-piece-back");
      const frontPieces = q<HTMLElement>(".core-piece-front");

      gsap.set(captions, { autoAlpha: 0, y: 24 });
      gsap.set(q(".layer-veneer-back"), { autoAlpha: 0, scale: 1.12 });
      gsap.set(backPieces, { autoAlpha: 0, x: (i) => (i % 2 ? 150 : -150) });
      gsap.set(q(".layer-glue-back"), { autoAlpha: 0, scaleY: 0 });
      gsap.set(q(".layer-frame"), { autoAlpha: 0, scale: 1.15 });
      gsap.set(sticks, { autoAlpha: 0, y: (i) => (i % 2 ? -180 : 180) });
      gsap.set(frontPieces, { autoAlpha: 0, x: (i) => (i % 2 ? 150 : -150) });
      gsap.set(q(".layer-glue-front"), { autoAlpha: 0, scaleY: 0 });
      gsap.set(q(".layer-veneer-front"), { autoAlpha: 0, y: -260, rotateX: 25 });
      gsap.set(q(".final-glow"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=5600",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });
      pinST.current = tl.scrollTrigger ?? null;

      /** Retire the previous caption, bring in this one. */
      const caption = (i: number) => {
        if (i > 0) tl.to(captions[i - 1], { autoAlpha: 0, y: -24, duration: 0.4 });
        tl.to(captions[i], { autoAlpha: 1, y: 0, duration: 0.5 });
      };
      /** Let a finished step breathe so it stays readable. */
      const hold = () => tl.to({}, { duration: 0.7 });

      // 01 · first thin veneer sheet — the base skin
      caption(0);
      tl.to(q(".layer-veneer-back"), { autoAlpha: 1, scale: 1, duration: 1 }, "<");
      hold();

      // 02 · first core layer — 3–4 horizontal pieces
      caption(1);
      tl.to(backPieces, { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.12 }, "<");
      hold();

      // 03 · first glue line
      caption(2);
      tl.to(q(".layer-glue-back"), { autoAlpha: 0.7, scaleY: 1, duration: 1.1, ease: "power1.inOut" }, "<");
      hold();

      // 04 · frame (the glue sinks behind it)
      caption(3);
      tl.to(q(".layer-frame"), { autoAlpha: 1, scale: 1, duration: 1 }, "<");
      tl.to(q(".layer-glue-back"), { autoAlpha: 0.25, duration: 0.6 }, "<+0.3");
      hold();

      // 05 · vertical stick-like core blocks pack the frame
      caption(4);
      tl.to(
        sticks,
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: { each: 0.02, from: "center" } },
        "<"
      );
      hold();

      // 06 · second core layer closes over the blocks
      caption(5);
      tl.to(frontPieces, { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.12 }, "<");
      hold();

      // 07 · second glue line
      caption(6);
      tl.to(q(".layer-glue-front"), { autoAlpha: 0.75, scaleY: 1, duration: 1.1, ease: "power1.inOut" }, "<");
      hold();

      // 08 · final veneer skin lands
      caption(7);
      tl.to(q(".layer-veneer-front"), { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.2 }, "<");
      tl.to(q(".layer-glue-front"), { autoAlpha: 0, duration: 0.6 }, "<+0.5");
      hold();

      // …the press: the exploded stack squeezes into one solid slab, so the
      // door turns as a finished door rather than a pile of loose boards.
      tl.to(q(".layer-veneer-back"), { z: -5, duration: 0.9 });
      tl.to(q(".core-wrap-back"), { z: -3, duration: 0.9 }, "<");
      tl.to(q(".layer-glue-back"), { autoAlpha: 0, duration: 0.5 }, "<");
      tl.to(q(".core-wrap-front"), { z: 3, duration: 0.9 }, "<");
      tl.to(q(".layer-veneer-front"), { z: 5, duration: 0.9 }, "<");
      tl.to(q(".final-glow"), { autoAlpha: 1, duration: 0.9 }, "<");

      // the finished door turns
      tl.to(q(".assembly"), { rotateY: 360, duration: 3, ease: "power1.inOut" });
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

            {/* 01 · thin veneer sheet (back skin) */}
            <div
              className="layer-veneer-back wood wood-mahogany absolute inset-[4px] rounded-md"
              style={{
                transform: "translateZ(-20px)",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(0,0,0,0.45)",
              }}
            >
              <div
                className="absolute inset-0 rounded-md"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.06), transparent 30%, rgba(0,0,0,0.3) 65%, transparent 90%)",
                }}
              />
            </div>

            {/* 02 · first core layer — horizontal pieces */}
            <div className="core-wrap-back absolute inset-0" style={{ transform: "translateZ(-13px)" }}>
              <CoreLayer face="back" />
            </div>

            {/* 03 · first glue line */}
            <div
              className="layer-glue-back absolute inset-[8px] origin-top rounded-md"
              style={{
                transform: "translateZ(-7px)",
                background:
                  "linear-gradient(180deg, rgba(255,190,90,0.85), rgba(214,142,52,0.75))",
                filter: "blur(1px)",
                boxShadow: "0 0 30px rgba(255,190,90,0.4)",
              }}
            />

            {/* 04 · frame */}
            <div className="layer-frame absolute inset-0 rounded-lg border-[10px] border-[#3a2413] shadow-[0_24px_70px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(201,138,75,0.3)]" />

            {/* 05 · core blocks — off-cut sticks of random width, packed edge
                to edge so they fill the frame with no gaps (see the Core
                Layering photograph in the gallery). */}
            <div className="stick-wrap absolute inset-[10px] flex gap-px overflow-hidden">
              {Array.from({ length: STICKS }).map((_, c) => (
                <div
                  key={c}
                  className="flex flex-col gap-px"
                  style={{ flexGrow: stickWidth(c), flexBasis: 0 }}
                >
                  {Array.from({ length: stickSegments(c) }).map((_, s) => (
                    <div
                      key={s}
                      className={`core-stick wood ${stickTone(c, s)}`}
                      style={{
                        flexGrow: segmentHeight(c, s),
                        flexBasis: 0,
                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.45)",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* 06 · second core layer — horizontal pieces */}
            <div className="core-wrap-front absolute inset-0" style={{ transform: "translateZ(8px)" }}>
              <CoreLayer face="front" />
            </div>

            {/* 07 · second glue line */}
            <div
              className="layer-glue-front absolute inset-[8px] origin-top rounded-md"
              style={{
                transform: "translateZ(13px)",
                background:
                  "linear-gradient(180deg, rgba(255,190,90,0.85), rgba(214,142,52,0.75))",
                filter: "blur(1px)",
                boxShadow: "0 0 30px rgba(255,190,90,0.4)",
              }}
            />

            {/* 08 · thin veneer sheet (face skin) */}
            <div
              className="layer-veneer-front wood wood-mahogany absolute inset-[4px] rounded-md"
              style={{
                transform: "translateZ(20px)",
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

      {/* Skip — for the second visit, when the sequence has already been seen */}
      <button
        onClick={skipSection}
        className="group absolute bottom-7 left-6 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-champagne/20 bg-walnut-950/60 px-4 py-2 text-[0.72rem] font-semibold text-ivory-dim backdrop-blur-sm transition-colors hover:border-copper hover:text-copper-bright lg:bottom-8"
      >
        Skip this section
        {goingUp ? (
          <ChevronsUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
        ) : (
          <ChevronsDown size={14} className="transition-transform group-hover:translate-y-0.5" />
        )}
      </button>

      {/* step progress rail */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {steps.map((s) => (
          <span key={s.n} className="h-1 w-6 rounded-full bg-champagne/15" />
        ))}
      </div>
    </section>
  );
}
