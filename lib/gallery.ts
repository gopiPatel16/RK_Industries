/**
 * ── THE PROCESS, IN ORDER ────────────────────────────────────
 * The eleven stations a वanWood door passes through, shared by the Gallery
 * grid and the Factory carousel so the two can never drift.
 *
 * Step 07 (hot pressing) has no photograph yet — it carries `src: null` and
 * renders as a captioned placeholder rather than being skipped, so the
 * numbering matches the real floor. Drop the photo in `public/process/`, set
 * `src` and its `w`/`h`, and the placeholder disappears.
 */
export const galleryCategories = [
  "All",
  "Raw Material",
  "Machining",
  "Assembly",
  "Finished",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export type Shot = {
  /** null while the station is still awaiting a photograph. */
  src: string | null;
  w: number;
  h: number;
  title: string;
  caption: string;
  cat: Exclude<GalleryCategory, "All">;
  /**
   * Set false to keep a photograph out of the Factory carousel while still
   * showing it in the Gallery grid — for steps that aren't presented as
   * headline "stations".
   */
  station?: boolean;
};

export const shots: Shot[] = [
  {
    src: "/process/p01-collecting-planks.jpg",
    w: 1280,
    h: 729,
    title: "Collecting Planks",
    caption: "Raw hardwood planks gathered and graded at the yard.",
    cat: "Raw Material",
  },
  {
    src: "/process/p02-drying.jpg",
    w: 1280,
    h: 713,
    title: "Drying Process",
    caption: "Timber seasoned down to a stable working moisture.",
    cat: "Raw Material",
  },
  {
    src: "/process/p03-smoothening.jpg",
    w: 1280,
    h: 734,
    title: "Smoothening Process",
    caption: "Every face planed true and smooth before it is cut.",
    cat: "Machining",
  },
  {
    src: "/process/p04-wood-cutting.jpg",
    w: 1280,
    h: 1149,
    title: "Wood Cutting Process",
    caption: "Planks broken down to exact working sizes.",
    cat: "Machining",
  },
  {
    src: "/process/p05-glueing.jpg",
    w: 1280,
    h: 720,
    title: "Glueing Process",
    caption: "Resin spread edge to edge across the sheet.",
    cat: "Machining",
  },
  {
    src: "/process/p06-assembling.jpg",
    w: 1280,
    h: 853,
    title: "Assembling Process",
    caption: "Frame, core blocks and skins laid up by hand.",
    cat: "Assembly",
  },
  {
    // awaiting a photograph — see the note at the top of this file
    src: null,
    w: 1280,
    h: 853,
    title: "Hot Pressing Process",
    caption: "Photograph coming soon.",
    cat: "Assembly",
  },
  {
    src: "/process/p08-edge-cutting.jpg",
    w: 1280,
    h: 853,
    title: "Edge Cutting Process",
    caption: "The pressed door trimmed dead square on the edge cutter.",
    cat: "Machining",
  },
  {
    src: "/process/p09-sanding.jpg",
    w: 1585,
    h: 992,
    title: "Sanding Process",
    caption: "Faces sanded to an even, ready-to-finish surface.",
    cat: "Machining",
  },
  {
    src: "/process/p10-dipping.jpg",
    w: 1280,
    h: 800,
    title: "Dipping Process",
    caption: "Treated against borer and damp before dispatch.",
    cat: "Finished",
  },
  {
    src: "/process/p11-final-product.jpg",
    w: 1280,
    h: 800,
    title: "Final Product",
    caption: "Finished doors stacked and ready to dispatch.",
    cat: "Finished",
  },
];

/** The subset shown as stations in the Factory carousel. */
export const stations: Shot[] = shots.filter((s) => s.station !== false);

/** Spelled-out count for the factory headline. */
export const spellCount = (n: number) =>
  [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen",
  ][n] ?? String(n);
