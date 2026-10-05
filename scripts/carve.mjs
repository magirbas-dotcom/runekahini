// Carves the app's own runes into the app's own blank stones, for the site's "real signs" visuals.
// The glyphs are src/data/runeGlyphs.ts (copied from the mobile app, never AI-drawn); the stones and their
// face measurements are the mobile app's (askrune-app assets/images/stones/, src/theme/materials.ts STONE_ROW).
// The look follows the app's gilded cut (share/cardCanvas.ts carveCut): a light lip below-right, a dark
// outline, gold leaf, a shadowed wall toward the light (upper left) and a lit wall opposite.
//
//   node scripts/carve.mjs <askrune-app folder>     (default ../askrune)
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
];

const GOLD = ["#4a3009", "#8f6620", "#d8b25a", "#f6e2a6", "#c79a3e", "#6e4e18", "#a9802f"];
const GOLD_POS = [0, 0.18, 0.36, 0.5, 0.64, 0.84, 1];

function svgFor(size, { cx, cy, r, rune }) {
  const g = RUNE_GLYPHS[rune];
  const p = glyphPlacement(g, 0.78);
  // The 100-box spans 80% of the face's diameter: the rune sits within the stone with room around it.
  const box = r * 2 * size * 0.8;
  const ox = cx * size - box / 2;
  const oy = cy * size - box / 2;
  const k = box / 100;
  const t = `translate(${ox} ${oy}) scale(${k}) translate(${p.x} ${p.y}) scale(${p.s})`;
  // Groove widening and wall depth in image pixels, then back into glyph units for the stroke.
  const weight = (2.6 * k) / (k * p.s);
  const d = 0.02 * size;
  const shape = (w = weight) => `<path d="${g.d}" transform="${t}" stroke-width="${w}" stroke-linejoin="round"/>`;
  const stops = GOLD.map((c, i) => `<stop offset="${GOLD_POS[i]}" stop-color="${c}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="${ox}" y1="${oy}" x2="${ox + box}" y2="${oy + box}">${stops}</linearGradient>
    <mask id="dark"><g fill="#fff" stroke="#fff">${shape()}</g><g fill="#000" stroke="#000" transform="translate(${d} ${d})">${shape()}</g></mask>
    <mask id="lit"><g fill="#fff" stroke="#fff">${shape()}</g><g fill="#000" stroke="#000" transform="translate(${-d * 0.7} ${-d * 0.7})">${shape()}</g></mask>
    <filter id="soft"><feGaussianBlur stdDeviation="${d * 0.3}"/></filter>
    <filter id="cast" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${d * 0.5}"/></filter>
  </defs>
  <g fill="rgba(0,0,0,0.55)" stroke="rgba(0,0,0,0.55)" filter="url(#cast)">${shape(weight + 2 / p.s)}</g>
  <g fill="rgba(255,240,215,0.22)" stroke="rgba(255,240,215,0.22)" transform="translate(${d * 0.45} ${d * 0.45})">${shape()}</g>
  <g fill="rgba(25,16,4,0.75)" stroke="rgba(25,16,4,0.75)">${shape(weight + 0.9 / p.s)}</g>
  <g fill="url(#gold)" stroke="url(#gold)">${shape()}</g>
  <rect width="${size}" height="${size}" fill="rgba(30,16,0,0.95)" mask="url(#dark)" filter="url(#soft)"/>
  <rect width="${size}" height="${size}" fill="rgba(255,250,225,0.5)" mask="url(#lit)"/>
</svg>`;
}

for (const job of JOBS) {
  const src = path.join(STONES, job.file);
  const { width } = await sharp(src).metadata();
  const size = Math.min(width, 900);
  const stone = await sharp(src).resize(size, size).toBuffer();
  await sharp(stone)
    .composite([{ input: Buffer.from(svgFor(size, job)) }])
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(path.join(OUT, `${job.out}.webp`));
  console.log("carved", job.out, size);
}
