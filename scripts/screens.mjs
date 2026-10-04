// Turns full-size app screenshots (1170×2532 PNG, taken from the app's web preview at 390×844 @3x)
// into the site's WebP images: src/assets/screens/<lang>/<name>.webp, 780 px wide (2× the phone frame).
// Usage: npm run images -- <folder with tr/ and en/ subfolders of PNGs>
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) throw new Error("Give the screenshot folder: npm run images -- <folder>");
const KEEP = ["home", "reading-drawn", "birth", "talisman-medallion", "compat"];

for (const lang of ["tr", "en"]) {
  const out = join("src", "assets", "screens", lang);
  mkdirSync(out, { recursive: true });
  for (const file of readdirSync(join(src, lang))) {
    const name = file.replace(/\.png$/, "");
    if (!KEEP.includes(name)) continue;
    await sharp(join(src, lang, file)).resize({ width: 780 }).webp({ quality: 80 }).toFile(join(out, `${name}.webp`));
    console.log(lang, name);
  }
}
