// Carves the app's own runes into the app's own blank stones, for the site's "real signs" visuals.
// The glyphs are src/data/runeGlyphs.ts (copied from the mobile app, never AI-drawn); the stones and their
// face measurements are the mobile app's (askrune-app assets/images/stones/, src/theme/materials.ts STONE_ROW).
// The look follows the app's gilded cut (share/cardCanvas.ts carveCut): gold leaf, a shadowed wall toward the
// light (upper left), a lit wall opposite and a soft dark edge (see carve() below).
//
//   node scripts/carve.mjs <askrune-app folder>     (default ../askrune)
// (Node 24 runs the .ts import directly; on Node 22 add --experimental-strip-types.)
import path from "node:path";

import sharp from "sharp";

import { glyphPlacement, RUNE_GLYPHS } from "../src/data/runeGlyphs.ts";

const APP = process.argv[2] ?? "../askrune";
const OUT = "src/assets/craft";
const STONES = path.join(APP, "assets/images/stones");

/** One stone: file, face centre and radius (shares of the image), and the rune to carve. */
const JOBS = [
  { file: "talisman-1.webp", cx: 0.5, cy: 0.5, r: 0.4, rune: "Fehu", out: "stone-fehu" },
  { file: "talisman-2.webp", cx: 0.5, cy: 0.5, r: 0.4, rune: "Ansuz", out: "stone-ansuz" },
  { file: "talisman-3.webp", cx: 0.5, cy: 0.56, r: 0.37, rune: "Algiz", out: "stone-algiz" },
  { file: "talisman-4.webp", cx: 0.5, cy: 0.5, r: 0.36, rune: "Ingwaz", out: "stone-ingwaz" },
  { file: "stone-daily.webp", cx: 0.5, cy: 0.5, r: 0.36, rune: "Dagaz", out: "stone-dagaz" },
  // "Write in Runes" card (2026-10-07): R U N E, one letter a stone, on the four talisman stones.
  { file: "talisman-1.webp", cx: 0.5, cy: 0.5, r: 0.4, rune: "Raidho", out: "word-r", max: 480 },
  { file: "talisman-2.webp", cx: 0.5, cy: 0.5, r: 0.4, rune: "Uruz", out: "word-u", max: 480 },
  { file: "talisman-3.webp", cx: 0.5, cy: 0.56, r: 0.37, rune: "Nauthiz", out: "word-n", max: 480 },
  { file: "talisman-4.webp", cx: 0.5, cy: 0.5, r: 0.36, rune: "Ehwaz", out: "word-e", max: 480 },
  // The Rune Guide (2026-10-06): all 24 on the basalt the app's guide uses (realms.fire.stone, CarvedStone face
  // 0.62 = the 100-box over 62% of the image), smaller, into src/assets/guide/.
  ...Object.keys(RUNE_GLYPHS).map((rune) => ({
    file: "stone-fire.webp",
    cx: 0.5,
    cy: 0.5,
    r: 0.62 / 1.6,
    rune,
    out: `../guide/${rune.toLowerCase()}`,
    max: 480,
  })),
];

const GOLD = ["#4a3009", "#8f6620", "#d8b25a", "#f6e2a6", "#c79a3e", "#6e4e18", "#a9802f"].map((h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
]);
const GOLD_POS = [0, 0.18, 0.36, 0.5, 0.64, 0.84, 1];

/** The gold at a point along the leaf's diagonal (0..1). */
function gold(t) {
  t = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < GOLD_POS.length - 2 && t > GOLD_POS[i + 1]) i++;
  const f = (t - GOLD_POS[i]) / (GOLD_POS[i + 1] - GOLD_POS[i]);
  return GOLD[i].map((c, k) => c + (GOLD[i + 1][k] - c) * f);
}

/** Where the rune's 100-box lies on the stone, in image pixels, and the glyph's transform. */
function placement(size, { cx, cy, r, rune }) {
  const g = RUNE_GLYPHS[rune];
  const p = glyphPlacement(g, 0.78);
  // The 100-box spans 80% of the face's diameter: the rune sits within the stone with room around it.
  const box = r * 2 * size * 0.8;
  const ox = cx * size - box / 2;
  const oy = cy * size - box / 2;
  const k = box / 100;
  return { g, box, ox, oy, k, p, t: `translate(${ox} ${oy}) scale(${k}) translate(${p.x} ${p.y}) scale(${p.s})` };
}

/** The groove as a white-on-black mask (the glyph widened by the cut's weight). */
async function grooveMask(size, job) {
  const { g, k, p, t } = placement(size, job);
  const weight = (2.6 * k) / (k * p.s);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%"/><path d="${g.d}" transform="${t}" fill="#fff" stroke="#fff" stroke-width="${weight}" stroke-linejoin="round"/></svg>`;
  return sharp(Buffer.from(svg)).greyscale().raw().toBuffer();
}

/**
 * The cut, lit from the upper left as the stones were photographed. 2026-10-07 (user: "the runes have breaks and
 * deformations"): the walls used to be the glyph minus a shifted copy of itself, which left hard steps wherever
 * two strokes meet (Algiz's fork, Perthro's foot). Now the groove is a height field, the mask blurred, and each
 * pixel is shaded by that field's slope toward the light: the wall facing the light falls into shadow, the one
 * opposite catches it, and where strokes join the walls blend smoothly. Around the cut, a soft dark edge.
 */
async function carve(stone, size, job) {
  const mask = await grooveMask(size, job);
  const { box, ox, oy } = placement(size, job);
  // Height: soft enough that the walls slope, tight enough that the floor stays flat in a thick stroke.
  const sigma = Math.max(1.5, box * 0.016);
  const height = await sharp(mask, { raw: { width: size, height: size, channels: 1 } }).blur(sigma).extractChannel(0).raw().toBuffer();
  const edge = await sharp(mask, { raw: { width: size, height: size, channels: 1 } }).blur(sigma * 0.6).extractChannel(0).raw().toBuffer();
  const out = Buffer.from(stone);
  const L = Math.SQRT1_2; // light from the upper left: (-L, -L)
  const gain = sigma * 2.6;
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const i = y * size + x;
      const o = i * 4;
      const m = mask[i] / 255;
      // Outside the cut: a soft dark rim that makes the edge read on any stone.
      const rim = (edge[i] / 255) * (1 - m) * 0.7;
      let r = out[o] * (1 - rim);
      let gC = out[o + 1] * (1 - rim);
      let b = out[o + 2] * (1 - rim);
      if (m > 0) {
        const gx = (height[i + 1] - height[i - 1]) / 510;
        const gy = (height[i + size] - height[i - size]) / 510;
        // Rising into the groove toward the lower right means a wall that faces away from the light.
        const shade = Math.max(-0.72, Math.min(0.55, -(gx + gy) * L * gain));
        const [cr, cg, cb] = gold((x - ox + (y - oy)) / (2 * box));
        const lit = (c) => (shade < 0 ? c * (1 + shade) : c + (255 - c) * shade);
        r = r * (1 - m) + lit(cr) * m;
        gC = gC * (1 - m) + lit(cg) * m;
        b = b * (1 - m) + lit(cb) * m;
      }
      out[o] = r;
      out[o + 1] = gC;
      out[o + 2] = b;
    }
  }
  return out;
}

for (const job of JOBS) {
  const src = path.join(STONES, job.file);
  const { width } = await sharp(src).metadata();
  const size = Math.min(width, job.max ?? 900);
  const stone = await sharp(src).resize(size, size).ensureAlpha().raw().toBuffer();
  const carved = await carve(stone, size, job);
  await sharp(carved, { raw: { width: size, height: size, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(path.join(OUT, `${job.out}.webp`));
  console.log("carved", job.out, size);
}
