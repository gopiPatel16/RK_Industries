"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { TreePine, Ruler, HandHeart } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal, SplitText } from "@/components/fx/Reveal";

const values = [
  {
    icon: TreePine,
    title: "Honest Material",
    copy: "We choose our timber at the yard by hand, reading the grain before we buy.",
  },
  {
    icon: Ruler,
    title: "Obsessive Precision",
    copy: "A door is judged in millimetres. Ours are built to half of one.",
  },
  {
    icon: HandHeart,
    title: "Generational Trust",
    copy: "Customers from our first year still order every month.",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  /* Kept small on purpose: the column is centred against the photograph, and
     the slack between the two is only ~27px each way, so a drift wider than
     this swings the value cards past the photo's edge mid-scroll. */
  const textY = useTransform(scrollYProgress, [0, 1], [18, -18]);

  /* The story column drifts 60px against the scroll. On phones the section
     stacks directly under the hero banner, so that head start reads as an
     empty band rather than as parallax — run it from lg up only. */
  const [drift, setDrift] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDrift(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section id="about" className="ambient relative scroll-mt-20 overflow-hidden pb-20 pt-12 lg:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.58fr_1fr] lg:gap-20">
        {/* Parallax wood portrait */}
        <div
          ref={ref}
          className="relative order-2 h-[26rem] overflow-hidden rounded-[2rem] border border-champagne/10 shadow-[0_40px_100px_rgba(0,0,0,0.55)] lg:order-1 lg:h-[27rem]"
        >
          <motion.div className="absolute inset-[-10%]" style={{ scale: imgScale }}>
            <Image
              src="/images/our-story.jpg"
              alt="The vanWood yard at dusk — open sheds with offcuts stacked outside"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-center"
            />
          </motion.div>
          {/* Graded from the bottom so the caption card keeps its contrast. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(200deg, transparent 35%, rgba(19,9,6,0.88))",
            }}
          />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass-strong rounded-2xl p-5">
              <div className="font-serif text-2xl text-champagne">
                {new Date().getFullYear() - site.stats.years} → Today
              </div>
            </div>
          </div>
        </div>

        {/* Story */}
        <motion.div style={{ y: drift ? textY : 0 }} className="order-1 lg:order-2">
          <Reveal>
            <div className="eyebrow mb-4">Our story</div>
          </Reveal>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
            <SplitText text="Wood remembers the hands that shaped it." />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-ivory-dim">
              Years ago we ran timber mills, and worked the floor ourselves. We
              supplied the wood to the factories that built flush doors. Today
              our manufactured doors go out to {site.stats.cities}+ cities across
              India.
            </p>
          </Reveal>

          <div className="mt-6 space-y-2">
            {values.map(({ icon: Icon, title, copy }, i) => (
              <Reveal key={title} delay={0.1 * i}>
                <div className="glass reflect flex gap-3.5 rounded-2xl p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-copper/30 bg-walnut-900">
                    <Icon size={15} className="text-copper-bright" />
                  </span>
                  <div>
                    <div className="font-serif text-base text-ivory">{title}</div>
                    <p className="mt-0.5 text-[0.78rem] leading-tight text-ivory-dim">{copy}</p>
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
