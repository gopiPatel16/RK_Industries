"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { Play } from "lucide-react";
import { site } from "@/lib/site";
import { scrollToSection } from "@/lib/lenis";
import { currentTheme } from "@/lib/hero-theme";
import DoorVisual from "@/components/door/DoorVisual";
import Magnetic from "@/components/fx/Magnetic";
import Dust from "@/components/fx/Dust";
import { cn } from "@/lib/utils";

/**
 * Homepage hero with two switchable visual themes (see lib/hero-theme.ts):
 *  "artisan"        — THE ARTISAN WORKSHOP: the photographed workshop
 *                     (public/images/hero-workshop.jpg) as a full-screen
 *                     backdrop; spotlight flicker, dust, door glow + hover.
 *  "luxury-gallery" — LUXURY PRODUCT GALLERY: dark showroom gradient, a
 *                     glowing golden halo behind the CSS door, drifting
 *                     smoke, idle door rotation.
 * The content block (text, buttons, timings) is shared and untouched.
 */

const GOLD = "#D4A15A";
const easeOut = [0.22, 1, 0.36, 1] as const;

type SceneProps = {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  sceneY: MotionValue<number>;
};

/** One masked headline line rising into view. */
function Line({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className={cn("block will-change-transform", className)}
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: easeOut }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ════════════════════════════════════════════════════════════
   THEME 1 · THE ARTISAN WORKSHOP — photo backdrop
   ════════════════════════════════════════════════════════════ */
function ArtisanScene({ sx, sy, sceneY }: SceneProps) {
  const bgX = useTransform(sx, [-1, 1], [12, -12]);
  const bgY = useTransform(sy, [-1, 1], [8, -8]);

  return (
    <motion.div
      style={{ y: sceneY }}
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      {/* The workshop photograph — over-scaled so parallax never shows edges */}
      <motion.div
        className="absolute inset-[-3%]"
        style={{ x: bgX, y: bgY }}
        initial={{ opacity: 0, scale: 1.09 }}
        animate={{ opacity: 1, scale: 1.03 }}
        transition={{ delay: 2.2, duration: 2.4, ease: easeOut }}
      >
        <Image
          src="/images/hero-workshop.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
      </motion.div>

      {/* Readability overlay — left kept clean for the text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,7,5,0.72) 0%, rgba(10,7,5,0.30) 50%, rgba(10,7,5,0.14) 72%, rgba(10,7,5,0.40) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-28"
        style={{
          background: "linear-gradient(180deg, rgba(10,7,5,0.8), transparent)",
        }}
      />

      {/* Spotlight — flickers on over the photo's beam, then breathes */}
      <motion.div
        className="absolute left-[73%] top-[4%] h-[74%] w-[38%] -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.25, 0.9, 0.7, 1] }}
        transition={{
          delay: 2.5,
          duration: 1.6,
          times: [0, 0.2, 0.35, 0.6, 0.8, 1],
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 58% at 50% 18%, rgba(255,208,140,0.18), transparent 72%)",
            filter: "blur(6px)",
            animation: "pulseGlow 7s ease-in-out infinite",
          }}
        />
      </motion.div>

      {/* The photo's door — golden glow, subtle movement on hover */}
      <motion.div
        className="group pointer-events-auto absolute left-[64%] top-[20%] h-[60%] w-[19%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1.4 }}
        whileHover={{ y: -5 }}
      >
        <div
          className="absolute inset-[-22%] rounded-[50%] opacity-55 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 55%, rgba(212,161,90,0.22), transparent 70%)",
            filter: "blur(16px)",
          }}
        />
      </motion.div>

      {/* Floating wood dust */}
      <Dust count={18} />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 55% 40%, transparent 55%, rgba(4,2,1,0.7) 100%)",
        }}
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   THEME 2 · LUXURY PRODUCT GALLERY — halo showroom
   ════════════════════════════════════════════════════════════ */
function GalleryScene({ sx, sy, sceneY }: SceneProps) {
  const doorRot = useTransform(sx, [-1, 1], [-4.5, 4.5]);
  const doorTilt = useTransform(sy, [-1, 1], [1.2, -1.2]);
  const poolX = useTransform(sx, [-1, 1], [-14, 14]);
  const haloX = useTransform(sx, [-1, 1], [8, -8]);

  return (
    <motion.div
      style={{ y: sceneY }}
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      {/* Dark premium gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 75% at 66% 38%, #1c1109 0%, #100a06 48%, #0A0705 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[30%]"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(20,12,7,0.9) 55%, #0A0705)",
        }}
      />

      {/* ── Showroom rig: halo → smoke → door → reflection ── */}
      <div className="absolute inset-y-0 left-1/2 w-[min(92vw,36rem)] -translate-x-1/2 lg:left-[63%]">
        {/* Golden circular halo behind the door */}
        <motion.div
          className="absolute bottom-[10%] left-1/2 z-[1] w-[21rem] -translate-x-1/2 sm:w-[25rem] xl:w-[29rem]"
          style={{ x: haloX }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 1.8, ease: easeOut }}
        >
          <div className="relative aspect-square">
            {/* soft breathing glow disc */}
            <div
              className="absolute inset-[-12%] rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(212,161,90,0.16), rgba(212,161,90,0.05) 60%, transparent 78%)",
                filter: "blur(18px)",
                animation: "pulseGlow 6s ease-in-out infinite",
              }}
            />
            {/* crisp golden ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1.5px solid rgba(212,161,90,0.55)",
                boxShadow:
                  "0 0 40px rgba(212,161,90,0.25), inset 0 0 40px rgba(212,161,90,0.12)",
              }}
            />
            {/* slowly-rotating shimmer arc */}
            <div
              className="absolute inset-[-2px] rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 6%, rgba(255,216,155,0.9) 16%, transparent 30%, transparent 55%, rgba(212,161,90,0.45) 68%, transparent 82%)",
                WebkitMask:
                  "radial-gradient(closest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
                mask: "radial-gradient(closest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
                animation: "spinSlow 26s linear infinite",
              }}
            />
          </div>
        </motion.div>

        {/* Soft smoke drifting through the showroom */}
        {[
          { left: "8%", bottom: "6%", size: "16rem", dur: "17s", delay: "0s" },
          { left: "46%", bottom: "3%", size: "22rem", dur: "23s", delay: "6s" },
          { left: "68%", bottom: "8%", size: "14rem", dur: "20s", delay: "12s" },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: s.left,
              bottom: s.bottom,
              width: s.size,
              height: s.size,
              background:
                "radial-gradient(closest-side, rgba(235,205,165,0.07), transparent 70%)",
              filter: "blur(30px)",
              animation: `smokeRise ${s.dur} ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}

        {/* Golden pool on the floor */}
        <motion.div
          className="absolute bottom-[4%] left-1/2 h-24 w-[125%] -translate-x-1/2"
          style={{ x: poolX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1.6 }}
        >
          <div
            className="absolute inset-0 rounded-[50%]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(212,161,90,0.3), rgba(212,161,90,0.08) 55%, transparent 80%)",
              filter: "blur(14px)",
            }}
          />
        </motion.div>

        {/* Door's reflection in the polished floor */}
        <motion.div
          className="absolute bottom-0 left-1/2 z-[2] h-[12%] w-[11.5rem] -translate-x-1/2 overflow-hidden sm:w-[13rem] xl:w-[14.5rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.28 }}
          transition={{ delay: 3.2, duration: 1.8 }}
        >
          <div
            className="absolute inset-x-0 top-0 aspect-[10/21] origin-top -scale-y-100"
            style={{
              maskImage: "linear-gradient(0deg, transparent 10%, #000 88%)",
              WebkitMaskImage: "linear-gradient(0deg, transparent 10%, #000 88%)",
              filter: "blur(3px) brightness(0.7)",
            }}
          >
            <DoorVisual finish="walnut" handle="bar" inlay="plain" />
          </div>
        </motion.div>

        {/* Contact shadow where the door meets the floor */}
        <motion.div
          className="absolute bottom-[11.4%] left-1/2 h-5 w-[13rem] -translate-x-1/2 sm:w-[14.5rem] xl:w-[16rem]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(0,0,0,0.85), transparent 78%)",
            filter: "blur(7px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.1, duration: 1.2 }}
        />

        {/* The door — rises, then idles with a slow sway inside the halo */}
        <motion.div
          className="absolute bottom-[12%] left-1/2 z-[3] w-[11.5rem] -translate-x-1/2 sm:w-[13rem] xl:w-[14.5rem]"
          initial={{ y: 110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.75, duration: 1.6, ease: easeOut }}
        >
          <motion.div
            style={{ rotateY: doorRot, rotateX: doorTilt, perspective: 1200 }}
            className="relative [transform-style:preserve-3d]"
          >
            <motion.div
              animate={{ rotateY: [-2.5, 2.5] }}
              transition={{
                duration: 9,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: 4.4,
              }}
              className="[transform-style:preserve-3d]"
            >
              <DoorVisual finish="walnut" handle="bar" inlay="plain" />
              {/* warm highlight from the halo */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "radial-gradient(95% 60% at 50% 40%, rgba(255,208,140,0.22), rgba(255,190,115,0.06) 55%, transparent 80%)",
                  mixBlendMode: "screen",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating ambient particles */}
      <Dust count={16} />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 55% 40%, transparent 52%, rgba(4,2,1,0.78) 100%)",
        }}
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   HERO — shared shell + content (identical across themes)
   ════════════════════════════════════════════════════════════ */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // ── Mouse tracking, shared by both scenes ──
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });

  // ── Scroll parallax ──
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentFade = useTransform(scrollYProgress, [0, 0.65], [1, 0.15]);

  return (
    <section
      id="home"
      ref={ref}
      className="noise relative min-h-svh overflow-hidden bg-[#0A0705]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
    >
      {/* ════ SCENE (theme-switched) ════ */}
      {currentTheme === "luxury-gallery" ? (
        <GalleryScene sx={sx} sy={sy} sceneY={sceneY} />
      ) : (
        <ArtisanScene sx={sx} sy={sy} sceneY={sceneY} />
      )}

      {/* Legibility scrim behind the content block */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[78%] lg:w-[58%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,7,5,0.88) 0%, rgba(10,7,5,0.45) 55%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* ════ CONTENT ════ */}
      <motion.div
        style={{ y: contentY, opacity: contentFade }}
        className="pointer-events-none relative z-20 mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-center px-6 pb-16 pt-28 lg:pt-24"
      >
        <div className="pointer-events-auto max-w-xl">
          <motion.div
            className="mb-7 text-[0.68rem] font-semibold tracking-[0.38em]"
            style={{ color: GOLD }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9, duration: 0.9, ease: easeOut }}
          >
            BIRGAON &bull; RAIPUR &bull; SINCE{" "}
            {new Date().getFullYear() - site.stats.years}
          </motion.div>

          <h1 className="font-serif text-[clamp(2.4rem,5.4vw,4.3rem)] uppercase leading-[1.08] tracking-[0.03em] text-ivory">
            <Line delay={3.0}>Crafting</Line>
            <Line delay={3.14}>Entrances</Line>
            <Line delay={3.28}>That Last</Line>
            <Line delay={3.42} className="text-[#D4A15A]">
              Generations.
            </Line>
          </h1>

          <motion.p
            className="mt-7 max-w-md text-[0.95rem] leading-relaxed text-ivory-dim"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.65, duration: 1, ease: easeOut }}
          >
            {site.sub}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-7"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.85, duration: 1, ease: easeOut }}
          >
            <Magnetic>
              <button
                onClick={() => scrollToSection("#doors")}
                className="btn-primary"
              >
                Explore Products
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToSection("#factory")}
                className="group flex items-center gap-3.5"
                aria-label="Watch our story"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(212,161,90,0.45)]"
                  style={{
                    borderColor: "rgba(212,161,90,0.45)",
                    background: "rgba(212,161,90,0.06)",
                  }}
                >
                  <Play
                    size={13}
                    className="ml-0.5 fill-[#D4A15A] text-[#D4A15A]"
                  />
                </span>
                <span className="text-sm font-medium tracking-wide text-ivory-dim transition-colors duration-500 group-hover:text-ivory">
                  Watch Our Story
                </span>
              </button>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* Blend into the next (walnut) section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-24"
        style={{ background: "linear-gradient(180deg, transparent, #130906)" }}
        aria-hidden
      />
    </section>
  );
}
