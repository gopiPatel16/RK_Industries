/**
 * ── FACTORY PHOTOGRAPHS ──────────────────────────────────────
 * The floor in the order the door is actually made. Shared by the
 * Gallery grid and the Factory carousel so the two can never drift.
 *
 * To add the missing stations (hot press, sanding machine): drop the
 * file in `public/gallery/` and insert an entry at the right position —
 * step numbers are derived from array order and renumber themselves.
 *
 * Note: each photograph carries its own burnt-in caption at bottom-left,
 * so overlays deliberately stay clear of that corner.
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
  src: string;
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
    src: "/gallery/01-planks.jpg",
    w: 1600,
    h: 911,
    title: "Planks",
    caption: "Raw hardwood planks arriving at the yard.",
    cat: "Raw Material",
  },
  {
    src: "/gallery/02-veneer-sheet.jpg",
    station: false,
    w: 1450,
    h: 1085,
    title: "Veneer Sheet",
    caption: "Hand-matched natural veneer, stacked and ready.",
    cat: "Raw Material",
  },
  {
    src: "/gallery/03-core-sheet.jpg",
    station: false,
    w: 1600,
    h: 882,
    title: "Core Sheet",
    caption: "Core sheets seasoning in the open air.",
    cat: "Raw Material",
  },
  {
    src: "/gallery/04-wood-drying.jpg",
    w: 1600,
    h: 889,
    title: "Wood Drying",
    caption: "The seasoning chamber — timber dried to under 12% moisture.",
    cat: "Raw Material",
  },
  {
    src: "/gallery/05-raw-material-cutting.jpg",
    w: 1319,
    h: 1192,
    title: "Raw Material Cutting",
    caption: "Planks broken down to working sizes.",
    cat: "Machining",
  },
  {
    src: "/gallery/06-randha-machine.jpg",
    w: 1600,
    h: 918,
    title: "Randha Machine",
    caption: "Planing every face to a smooth, true surface.",
    cat: "Machining",
  },
  {
    src: "/gallery/07-finger-jointer.jpg",
    station: false,
    w: 1448,
    h: 1086,
    title: "Finger Making & Jointer",
    caption: "Finger joints cut for full-length, knot-free lengths.",
    cat: "Machining",
  },
  {
    src: "/gallery/08-glue-spreader.jpg",
    station: false,
    w: 1600,
    h: 900,
    title: "Glue Spreader",
    caption: "Resin rollered edge to edge across the sheet.",
    cat: "Machining",
  },
  {
    src: "/gallery/10-veneer-and-core.jpg",
    w: 1536,
    h: 1024,
    title: "Veneer and Core",
    caption: "Veneer and core stacked on the frame, ready for the press.",
    cat: "Assembly",
  },
  {
    src: "/gallery/11-core-layering.jpg",
    w: 1536,
    h: 1024,
    title: "Core Layering",
    caption: "The frame packed with core blocks, core pieces laid over by hand.",
    cat: "Assembly",
  },
  {
    src: "/gallery/09-edge-cutting.jpg",
    w: 1536,
    h: 1024,
    title: "Edge Cutting Machine",
    caption: "The pressed door trimmed dead square on the edge cutter.",
    cat: "Machining",
  },
  {
    src: "/gallery/12-final-product.jpg",
    w: 1536,
    h: 1024,
    title: "Flush Door",
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
