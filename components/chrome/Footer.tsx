"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/fx/SocialIcons";
import { site, nav } from "@/lib/site";
import { scrollToSection } from "@/lib/lenis";

export default function Footer() {
  return (
    <footer className="relative border-t border-champagne/8 bg-walnut-900/40">
      <div className="ambient pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-20">
        <div>
          <div className="font-serif text-3xl text-champagne">{site.name}</div>
          <div className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ivory-dim">
            By Radha Krishna Industries
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory-dim">
            {site.sub} Proudly manufactured in {site.shortAddress}.
          </p>
          <div className="mt-6 flex gap-3">
            {(
              [
                [InstagramIcon, site.socials.instagram, "Instagram"],
                [FacebookIcon, site.socials.facebook, "Facebook"],
              ] as const
            ).map(([Icon, href, label], i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="glass flex h-9 w-9 items-center justify-center rounded-full text-ivory-dim transition-colors hover:text-copper-bright"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow mb-5">Explore</div>
          <ul className="space-y-2.5">
            {nav.map((n) => (
              <li key={n.label}>
                <button
                  onClick={() => scrollToSection(n.href)}
                  className="text-sm text-ivory-dim transition-colors hover:text-copper-bright"
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-5">Visit the Works</div>
          <ul className="space-y-3.5 text-sm text-ivory-dim">
            <li className="flex gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-copper" />
              {site.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="shrink-0 text-copper" />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-copper-bright">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-copper" />
              <a href={`mailto:${site.email}`} className="hover:text-copper-bright">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={15} className="shrink-0 text-copper" />
              {site.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-champagne/8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-[0.7rem] text-ivory-dim/70 md:flex-row">
          <span>
            © {new Date().getFullYear()} {site.legalName} · GSTIN {site.gstin}
          </span>
          <span className="tracking-wide">
            Crafted with pride in Chhattisgarh 🇮🇳
          </span>
        </div>
      </div>
    </footer>
  );
}
