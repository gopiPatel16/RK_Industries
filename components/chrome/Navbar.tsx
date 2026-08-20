"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, MapPin, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/fx/SocialIcons";
import { site, nav } from "@/lib/site";
import { scrollToSection } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/fx/Magnetic";
import BrandLogo from "@/components/chrome/BrandLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section highlighting
  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector(n.href))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (href: string) => {
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      {/* ── Top information bar ── */}
      <div className="fixed inset-x-0 top-0 z-[60] hidden border-b border-champagne/8 bg-walnut-950/70 backdrop-blur-md lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[0.7rem] text-ivory-dim">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin size={11} className="text-copper" /> {site.shortAddress}
            </span>
            <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 transition-colors hover:text-copper-bright">
              <Mail size={11} className="text-copper" /> {site.email}
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 transition-colors hover:text-copper-bright">
              <Phone size={11} className="text-copper" /> {site.phone}
            </a>
            <span className="flex items-center gap-1.5">
              <Clock size={11} className="text-copper" /> {site.hours}
            </span>
          </div>
          <div className="flex items-center gap-3">
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
                className="transition-colors hover:text-copper-bright"
              >
                <Icon size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating glass navbar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[55] lg:top-7"
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-5 py-3 transition-all duration-500 lg:mx-6 lg:rounded-2xl xl:mx-auto",
            scrolled
              ? "glass-strong shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
              : "border border-transparent bg-transparent"
          )}
        >
          <button onClick={() => go("#home")} aria-label={`${site.name} home`}>
            <BrandLogo />
          </button>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.href)}
                className={cn(
                  "nav-link text-[0.8rem] font-medium tracking-wide text-ivory-dim transition-colors hover:text-ivory",
                  active === item.href && "active"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Magnetic>
              <button onClick={() => go("#configurator")} className="btn-primary !px-6 !py-2.5 text-xs">
                Request a Quote
              </button>
            </Magnetic>
          </div>

          <button
            className="rounded-lg p-2 text-ivory lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </motion.header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-walnut-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <BrandLogo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 text-ivory">
                <X />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-8" aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go(item.href)}
                  className="py-2 text-left font-serif text-3xl text-ivory-dim transition-colors hover:text-copper-bright"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
            <div className="px-8 pb-10 text-sm text-ivory-dim">
              <p>{site.shortAddress}</p>
              <p className="mt-1 text-copper-bright">{site.phone}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
