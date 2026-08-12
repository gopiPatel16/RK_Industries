# RADHA KRISHNA INDUSTRIES — Premium Flush Doors & Plywood

A cinematic, dark-luxury single-page website for Radha Krishna Industries,
a doors & plywood manufacturer in Birgaon, Raipur, Chhattisgarh. Built with
Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP ScrollTrigger,
Framer Motion, Lenis and React Three Fiber.

> Every company detail — name, phone, email, address, GSTIN, socials, stats —
> lives in **`lib/site.ts`**. The phone number, email, GSTIN and stats are
> still **placeholders**; put the real values there before going live.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy to Vercel (when ready)

```bash
npx vercel         # from this folder (aranya/)
```

If deploying from the repo root, set the Vercel project's **Root Directory**
to `aranya`. No environment variables are required. Before going live, update
`metadataBase` in `app/layout.tsx` to your real domain.

## Where things live

| Path | What it is |
|---|---|
| `lib/site.ts` | Brand config — name, contact, hours, socials, stats |
| `app/layout.tsx` | Fonts (Fraunces + Manrope), SEO metadata, JSON-LD |
| `app/globals.css` | Design tokens, wood-grain & glass utilities, keyframes |
| `components/chrome/` | Navbar, top bar, door-loader, footer, floating dock |
| `components/sections/` | Hero, products, about, door experience, process, factory, stats, configurator, testimonials, gallery, dealer map, contact |
| `components/door/DoorVisual.tsx` | The reusable CSS-crafted door (finish/handle/inlay/open/glow props) |
| `components/fx/` | Reusable animations — reveals, tilt cards, magnetic buttons, counters, cursor glow, particles |

## Notes

- All wood textures are generated with CSS/SVG turbulence filters — there are
  **no image assets**, so the page is fully static and loads fast.
- The contact form opens a pre-filled email draft (no backend). Wire it to a
  form service (Resend, Formspree, a route handler…) when you're ready.
- The manufacturing-process and factory sections are scroll-scrubbed and pinned
  (GSAP ScrollTrigger); the loader, reveals and marquees are Framer Motion/CSS.
- Smooth scrolling is Lenis, synced to GSAP's ticker in
  `components/providers/SmoothScroll.tsx`. Reduced-motion preferences disable it.
