"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TreePine, Ruler, HandHeart } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal, SplitText } from "@/components/fx/Reveal";

const values = [
  {
    icon: TreePine,
    title: "Honest Material",
    copy: "We buy standing timber the way our grandfather did — by walking the yard and reading the grain.",
  },
  {
    icon: Ruler,
    title: "Obsessive Precision",
    copy: "A door is judged in millimetres. Ours are built to half of one.",
  },
  {
    icon: HandHeart,
    title: "Generational Trust",
    copy: "Customers who started with us in year one still order every month. That is the only award we count.",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="about" className="ambient relative scroll-mt-20 overflow-hidden py-28 lg:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Parallax wood portrait */}
        <div
          ref={ref}
          className="relative order-2 h-[26rem] overflow-hidden rounded-[2rem] border border-champagne/10 shadow-[0_40px_100px_rgba(0,0,0,0.55)] lg:order-1 lg:h-[34rem]"
        >
          <motion.div className="wood absolute inset-[-10%]" style={{ scale: imgScale }}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 60% at 35% 30%, rgba(255,205,140,0.14), transparent 70%), linear-gradient(200deg, transparent 40%, rgba(19,9,6,0.85))",
              }}
            />
          </motion.div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass-strong rounded-2xl p-5">
              <div className="font-serif text-2xl text-champagne">
                {new Date().getFullYear() - site.stats.years} → Today
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ivory-dim">
                From a single press in Birgaon to one of Chhattisgarh&apos;s most
                trusted door and plywood works.
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <motion.div style={{ y: textY }} className="order-1 lg:order-2">
          <Reveal>
            <div className="eyebrow mb-5">Our story</div>
          </Reveal>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
            <SplitText text="Wood remembers the hands that shaped it." />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-lg text-[0.95rem] leading-relaxed text-ivory-dim">
              {site.name} began {site.stats.years} years ago on the industrial edge of
              Raipur with one hydraulic press, three craftsmen, and a stubborn idea —
              that a door made in Chhattisgarh could stand beside anything made anywhere.
            </p>
            <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-ivory-dim">
              Today our doors hang in homes, hospitals and hotels across {site.stats.cities}+
              Indian cities. The press count grew. The idea never changed.
            </p>
          </Reveal>

          <div className="mt-10 space-y-5">
            {values.map(({ icon: Icon, title, copy }, i) => (
              <Reveal key={title} delay={0.1 * i}>
                <div className="glass reflect flex gap-4 rounded-2xl p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-copper/30 bg-walnut-900">
                    <Icon size={17} className="text-copper-bright" />
                  </span>
                  <div>
                    <div className="font-serif text-lg text-ivory">{title}</div>
                    <p className="mt-1 text-[0.82rem] leading-relaxed text-ivory-dim">{copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
