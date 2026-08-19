/**
 * The 24 Elder Futhark runes as filled outlines, traced from one geometric
 * reference set so every glyph shares a single hand and a single stroke weight.
 * They replace straight-line approximations drawn here by eye, six of which
 * were plainly wrong — Mannaz and Ehwaz were even identical.
 *
 * The outlines are deliberately thin. A heavier hand-drawn set read well on its
 * own but merged into one unreadable block the moment two runes were stacked
 * into a bindrune, which is the whole point of the talisman screen.
 *
 * Paths stay in the reference artwork's coordinate space rather than being
 * rewritten: `glyphTransform` maps a glyph into the 100x100 box the app draws
 * in, by centring its bounding box and applying one shared scale. A single
 * scale across all 24 preserves their relative sizes — Isa really is a thin bar
 * and Ehwaz really is wide.
 *
 * Jera is two subpaths. It is the only Elder Futhark rune whose halves do not
 * meet, and the reference set draws it that way too.
 */

export interface RuneGlyph {
  /** Filled outline, in the reference artwork's coordinate space. */
  d: string;
  /** Centre of this glyph's bounding box in that same space. */
  cx: number;
  cy: number;
  /**
   * Shift, in 100-box units, that moves this glyph's vertical stave onto the
   * centre line. A bind rune is defined by its runes sharing that stave, and
   * bbox centring alone does not align them: Perthro's stave sits at x=30 of
   * its box while Isa's is at 50. Runes with no full-height stroke — Gebo,
   * Kenaz, Jera, Sowilo, Ingwaz, Othala — carry 0 and stay bbox-centred.
   *
   * Measured by rasterising each glyph and taking the column with the tallest
   * unbroken ink run.
   */
  staveDx: number;
}

/** Chosen so the tallest glyph fills about three quarters of the 100x100 box. */
export const GLYPH_FIT_SCALE = 0.78;

/**
 * Places a glyph in a 100x100 viewBox: centred on its bounding box, or, when
 * `alignStave` is set, shifted so its vertical stave lands on the centre line
 * — which is what lets several runes bind over one shared stave.
 */
export function glyphTransform(
  glyph: RuneGlyph,
  scale: number = GLYPH_FIT_SCALE,
  alignStave = false,
): string {
  const x = (50 - glyph.cx * scale + (alignStave ? glyph.staveDx : 0)).toFixed(2);
  const y = (50 - glyph.cy * scale).toFixed(2);
  return `translate(${x} ${y}) scale(${scale})`;
}

export const RUNE_GLYPHS: Record<string, RuneGlyph> = {
  Fehu: {
    cx: 344.03,
    cy: 210.19,
    staveDx: 13.25,
    d: "M365.38,195.47 L332.05,220.08 L331.97,255.8 L322.68,255.63 L322.71,165.73 L331.95,165.54 L332.19,184.67 L358.48,164.59 L363.83,171.66 L332.07,196.3 L332.27,208.57 L359.99,188.39 L365.38,195.47 Z",
  },
  Uruz: {
    cx: 461.48,
    cy: 209.45,
    staveDx: 17,
    d: "M473.42,197.13 L446.94,179.96 L446.87,255.65 L437.69,255.79 L437.74,163.11 L481.95,191.59 L485.26,255.2 L476.24,255.58 L473.42,197.13 Z",
  },
  Thurisaz: {
    cx: 578.38,
    cy: 210.73,
    staveDx: 12.25,
    d: "M567.59,186.09v-20.42s-9.39.07-9.39.07v90.05s9.31-.08,9.31-.08l.04-21.85,31.01-23.94-30.97-23.82ZM567.6,197.57l16.04,12.33-16.04,12.47v-24.8Z",
  },
  Ansuz: {
    cx: 695.52,
    cy: 209.51,
    staveDx: 14.5,
    d: "M714.6,212.7 L710.07,220.75 L684.16,204.45 L684.14,255.69 L674.88,255.64 L674.89,163.34 L716.16,189.01 L712.02,197.16 L684.13,179.74 L684.14,193.63 L714.6,212.7 Z",
  },
  Raidho: {
    cx: 813.1,
    cy: 209.07,
    staveDx: 15.75,
    d: "M805.79,213.27l28.42-21.82-43.28-29-.06,93.2,9.17.04.22-34.67,28.6,30.51,6.47-6.37-29.54-31.88ZM800.17,205.93l.04-26.34,18.52,12.45-18.56,13.9Z",
  },
  Kenaz: {
    cx: 930.85,
    cy: 210.6,
    staveDx: 0,
    d: "M954.23,250.58 L947.21,256.34 L907.48,210.43 L947.06,164.87 L954.14,170.38 L919.79,210.34 L954.23,250.58 Z",
  },
  Gebo: {
    cx: 1049.76,
    cy: 210.62,
    staveDx: 0,
    d: "M1077.55,251.97 L1069.63,256.27 L1049.73,220.47 L1030.07,256.25 L1021.86,252.04 L1044.42,210.71 L1021.85,169.25 L1029.94,164.97 L1049.73,200.92 L1069.57,164.98 L1077.67,169.2 L1055.01,210.56 L1077.55,251.97 Z",
  },
  Wunjo: {
    cx: 1169.21,
    cy: 209.16,
    staveDx: 16,
    d: "M1146.75,162.63l-.07,93.01,9.18.05.19-36.31,35.68-25.61-44.98-31.14ZM1155.99,208.07l-.04-28.08,19.98,13.76-19.94,14.32Z",
  },
  Hagalaz: {
    cx: 343.92,
    cy: 385.95,
    staveDx: 0.25,
    d: "M367.63,430.79 L358.49,431.01 L358.44,404.73 L329.5,375.89 L329.44,430.92 L320.2,430.87 L320.2,340.89 L329.32,341.02 L329.43,363.04 L358.41,391.59 L358.44,340.99 L367.58,340.98 L367.63,430.79 Z",
  },
  Nauthiz: {
    cx: 461.18,
    cy: 385.93,
    staveDx: 0.25,
    d: "M465.8,430.86 L456.63,430.96 L456.57,381.35 L433.83,366.92 L438.54,359.3 L456.51,370.4 L456.57,340.92 L465.77,340.91 L465.8,376.36 L488.54,390.87 L483.77,398.55 L465.87,387.19 L465.8,430.86 Z",
  },
  Isa: {
    cx: 578.39,
    cy: 385.95,
    staveDx: 0.25,
    d: "M573.83,431.05 L573.83,340.86 L582.94,340.86 L582.94,431.05 Z",
  },
  Jera: {
    cx: 695.86,
    cy: 385.93,
    staveDx: 0,
    d: "M700.93,398.09l-6.05,6.79-32.21-29.96,17.44-18.63,16.61-17.28c2.43,1.89,4.56,3.71,6.51,6.31l-12.62,13.09-15.04,16.06,25.35,23.63Z M688.55,427.03 L703.91,410.67 L716.08,397.91 L690.61,374.05 L697.08,367.51 L729.05,397.26 L695.2,432.86 L688.55,427.03 Z",
  },
  Eihwaz: {
    cx: 812.9,
    cy: 385.97,
    staveDx: 0.25,
    d: "M817.57,433.86 L783.64,404.93 L789.44,398.17 L808.42,414.05 L808.61,338.08 L842.16,367.04 L836.14,373.93 L817.78,358.25 L817.57,433.86 Z",
  },
  Perthro: {
    cx: 931.13,
    cy: 385.85,
    staveDx: 20,
    d: "M913.73,417.3 L933.32,405.84 L957.82,424.1 L952.34,431.4 L932.74,416.57 L904.45,433.71 L904.44,338 L932.7,355.26 L952.33,339.8 L957.74,346.69 L933.26,366.33 L913.69,354.41 L913.73,417.3 Z",
  },
  Algiz: {
    cx: 1049.66,
    cy: 385.93,
    staveDx: 0.25,
    d: "M1054.24,430.84 L1045.14,430.94 L1045.1,381.84 L1016.89,347.03 L1024.12,341.57 L1044.9,366.81 L1045.15,340.95 L1054.17,340.91 L1054.39,367.17 L1075.22,341.72 L1082.42,347.15 L1054.29,381.78 L1054.24,430.84 Z",
  },
  Sowilo: {
    cx: 1168.71,
    cy: 386.05,
    staveDx: 0,
    d: "M1169.4,432.4 L1161.18,428.36 L1180.09,388.6 L1141.13,395.6 L1167.9,339.7 L1176.17,343.33 L1157.28,383.23 L1196.29,376.34 L1169.4,432.4 Z",
  },
  Tiwaz: {
    cx: 343.94,
    cy: 560.27,
    staveDx: 0.5,
    d: "M348.51,606.17l-9.05.06-.1-73.13-17.62,19.6-6.77-6.13,28.99-32.26,28.95,32.31c-1.98,2.42-4.14,4.03-6.68,5.93l-17.7-19.23-.03,72.85Z",
  },
  Berkano: {
    cx: 461.82,
    cy: 560.85,
    staveDx: 16.75,
    d: "M455.58,560.42l28.71-19.78-45.02-27.88v96.18s45.11-28.24,45.11-28.24l-28.79-20.28ZM467.82,540.93l-19.43,13.15-.02-25.1,19.44,11.94ZM448.37,567.06l19.53,13-19.49,12.19-.04-25.19Z",
  },
  Ehwaz: {
    cx: 578.35,
    cy: 559.64,
    staveDx: 0.25,
    d: "M598.22,534.77 L578.2,554.58 L558.65,535.2 L558.49,606.06 L549.35,606.28 L549.44,512.98 L578.3,541.95 L607.29,513.04 L607.34,606.31 L598.31,606.31 L598.22,534.77 Z",
  },
  Mannaz: {
    cx: 695.68,
    cy: 559.89,
    staveDx: 0.25,
    d: "M724.58,606.15l-.06-92.51-28.78,24.76-28.89-24.86-.06,92.69,9-.04.08-38.78,19.9-17.33,19.8,17.55-.06,38.61,9.07-.1ZM675.94,555.38l-.1-22.07,13.05,10.97-12.95,11.1ZM715.35,555.15l-12.79-10.82,12.81-11.03-.02,21.86Z",
  },
  Laguz: {
    cx: 814.04,
    cy: 559.84,
    staveDx: 12.75,
    d: "M805.33,532.06 L805.36,606.16 L796.27,606.24 L796.36,513.44 L831.81,541.63 L825.89,548.57 L805.33,532.06 Z",
  },
  Ingwaz: {
    cx: 931.05,
    cy: 560.7,
    staveDx: 0,
    d: "M957.66,560.86l-20.22-20.78,19.53-19.57-6.28-6.25-19.58,19.6-19.77-19.82-6.22,6.3,19.59,19.7-20.27,20.61,20.38,20.51-19.7,19.76,6.2,6.38,19.8-19.81,19.71,19.88,6.33-6.44-19.74-19.81,20.24-20.26ZM916.93,560.71l14.02-14.16,14.27,14.13-14.02,14.16-14.27-14.13Z",
  },
  Dagaz: {
    cx: 1168.42,
    cy: 560.74,
    staveDx: 0.25,
    d: "M1168.53,553.49l-31.08-41.07.08,96.64,30.95-40.75,30.86,40.68.05-96.24-30.86,40.74ZM1146.61,582.39v-42.87s16.14,21.17,16.14,21.17l-16.14,21.7ZM1190.31,581.74l-16.09-20.74,16.13-21.15-.03,41.89Z",
  },
  Othala: {
    cx: 1049.7,
    cy: 560.83,
    staveDx: 0,
    d: "M1080.54,549.19l-30.79-34.82-30.89,35.19,24.64,25.77-6.75,7.35-17.65,18.14,6.5,6.48,24.27-25.17,24.31,25.14,6.22-6.29-24.44-25.38,24.58-26.4ZM1049.83,568.94l-18.9-19.65,18.87-21.5,18.53,21.32-13.52,14.33-4.98,5.5Z",
  },
};

/**
 * Nominal height a glyph occupies inside the 100x100 box at placement scale 1,
 * given GLYPH_FIT_SCALE and the reference set's ~96-unit glyph heights.
 */
const GLYPH_BOX_HEIGHT = 75;

/**
 * R/r for n equal circles packed inside a circle, each touching its neighbours
 * and the outer ring. The values for 2–4 are the exact packing solutions. One
 * rune is not a packing at all — a single circle would fill the ring — so its
 * ratio is a proportion chosen to sit comfortably inside the frame.
 */
const PACK_RATIO: Record<number, number> = {
  1: 1.45,
  2: 2,
  3: 1 + 2 / Math.sqrt(3),
  4: 1 + Math.SQRT2,
};

/** One rune's medallion within the seal. */
export interface SealSlot {
  /** Circle centre, relative to the ring centre. */
  dx: number;
  dy: number;
  /** Circle radius. */
  r: number;
  /** Placement scale for the glyph drawn inside it. */
  scale: number;
}

/**
 * Lays the chosen runes out as touching circles inside the ring — one rune per
 * medallion, no overlap, nothing to adjust by hand.
 *
 * This is not a bind rune. A bind rune is a ligature: its runes merge over a
 * shared stave, and stacking three or four of them at one centre is what made
 * the talisman unreadable in the first place. Giving each rune its own circle
 * trades that ligature for a composed seal, which is also what the app's own
 * ring artwork and app icon already look like.
 *
 * Both the SVG preview and the PNG exporter call this, so the two cannot drift.
 */
/**
 * The medallions are packed into a circle slightly smaller than the ring, so
 * they sit clear of it instead of touching the frame artwork.
 */
const SEAL_INSET = 0.86;

export function sealLayout(
  index: number,
  count: number,
  ringRadius: number,
  maxScale: number,
): SealSlot {
  const n = Math.min(Math.max(count, 1), 4);
  const packRadius = ringRadius * SEAL_INSET;
  const r = packRadius / PACK_RATIO[n];
  const d = n === 1 ? 0 : packRadius - r;
  // Two runes read better side by side than stacked; three and four start at
  // the top so the first rune chosen leads the composition.
  const startDeg = n === 2 ? 0 : -90;
  const angle = ((startDeg + (index * 360) / n) * Math.PI) / 180;

  return {
    dx: d * Math.cos(angle),
    dy: d * Math.sin(angle),
    r,
    scale: Math.min(maxScale, (r * 1.35) / GLYPH_BOX_HEIGHT),
  };
}
