"use client";

import Counter from "@/components/fx/Counter";
import { Reveal } from "@/components/fx/Reveal";
import { site } from "@/lib/site";

const items = [
  { to: site.stats.years, suffix: "+", label: "Years of Craft" },
  { to: site.stats.doors, suffix: "+", label: "Doors Manufactured" },
  { to: site.stats.customers, suffix: "+", label: "Customers" },
  { to: site.stats.cities, suffix: "+", label: "Cities Served" },
];

export default function Stats() {
  return (
    <section className="relative border-y border-champagne/8 bg-walnut-900/30 py-16 lg:py-20">
      <div className="ambient pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 text-center lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.1}>
            <div className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none text-champagne">
              <Counter to={item.to} suffix={item.suffix} />
            </div>
            <div className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ivory-dim">
              {item.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
