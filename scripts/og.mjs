// Draws every page's share image (1200×630 JPEG, public/og/), in a headless browser so the site's own fonts
// (Cormorant Garamond, Inter) and the AskRune wordmark are used. The pages, their words and their pictures come
// from the built site's /og-pages.json (src/pages/og-pages.json.ts), so this never drifts from the pages.
//
//   npm run build && node scripts/og.mjs        (then build again so dist/ carries the images)
//
// Needs Playwright with a Chromium: `npm i -g playwright && npx playwright install chromium`, or point
// NODE_PATH at an existing install. The images are committed, like the carved stones.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
// require() rather than import: it honours NODE_PATH, so a global Playwright works without installing it here.
const { chromium } = createRequire(import.meta.url)("playwright");
const pages = JSON.parse(fs.readFileSync(path.join(ROOT, "dist/og-pages.json"), "utf8"));
const file = (p) => pathToFileURL(path.join(ROOT, p)).href;

// The logo's path, from the site's own Wordmark component.
const wordmark = fs.readFileSync(path.join(ROOT, "src/components/Wordmark.astro"), "utf8").match(/"(M481 0L[^"]+)"/)[1];

const fonts = [
  "@fontsource/cormorant-garamond/latin-500.css",
  "@fontsource/cormorant-garamond/latin-ext-500.css",
  "@fontsource/cormorant-garamond/latin-500-italic.css",
  "@fontsource/cormorant-garamond/latin-ext-500-italic.css",
  "@fontsource/inter/latin-500.css",
  "@fontsource/inter/latin-ext-500.css",
]
  .map((f) => `<link rel="stylesheet" href="${file("node_modules/" + f)}">`)
  .join("");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function html(p) {
  return `<!doctype html><html lang="${p.lang}"><head><meta charset="utf-8">${fonts}<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #090908; font-family: "Inter", sans-serif; }
  .bg { position: absolute; inset: 0; background: url("${file(p.bg)}") center 35% / cover; }
  .bg::after { content: ""; position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(9,9,8,.5) 0%, rgba(9,9,8,.82) 42%, rgba(9,9,8,.92) 100%),
                linear-gradient(180deg, rgba(9,9,8,0) 60%, rgba(9,9,8,.7) 100%); }
  .frame { position: absolute; inset: 22px; border: 1px solid rgba(200,164,106,.35); border-radius: 18px; }
  .stone { position: absolute; left: 70px; top: 115px; width: 400px; height: 400px; object-fit: contain;
    filter: drop-shadow(0 30px 34px rgba(0,0,0,.85)); }
  .glow { position: absolute; left: 40px; top: 90px; width: 460px; height: 460px; border-radius: 50%;
    background: radial-gradient(closest-side, rgba(225,196,139,.20), transparent); }
  .copy { position: absolute; left: 530px; right: 70px; top: 0; bottom: 0; display: flex; flex-direction: column;
    justify-content: center; gap: 20px; }
  .kicker { font-size: 17px; letter-spacing: .26em; color: #c8a46a; font-weight: 500; }
  h1 { font-family: "Cormorant Garamond", serif; font-weight: 500; font-size: ${p.title.length > 22 ? 64 : 84}px;
    line-height: 1.04; color: #e1c48b; text-wrap: balance; }
  .line { width: 56px; height: 1px; background: #c8a46a; }
  .sub { font-family: "Cormorant Garamond", serif; font-style: italic; font-weight: 500; font-size: 29px;
    line-height: 1.3; color: #d9cfbf; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
    overflow: hidden; }
  .brand { position: absolute; left: 530px; bottom: 52px; display: flex; align-items: center; gap: 16px;
    font-size: 16px; letter-spacing: .08em; color: #b3aa9a; }
  .brand svg { height: 30px; width: auto; }
  </style></head><body>
  <div class="bg"></div><div class="frame"></div><div class="glow"></div>
  <img class="stone" src="${file(p.stone)}">
  <div class="copy"><div class="kicker">${esc(p.kicker)}</div><h1>${esc(p.title)}</h1><div class="line"></div>
  <div class="sub">${esc(p.sub)}</div></div>
  <div class="brand"><svg viewBox="0 0 1445 311"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#f3dfae"/><stop offset=".55" stop-color="#c8a46a"/><stop offset="1" stop-color="#8f6a35"/>
  </linearGradient></defs><path d="${wordmark}" fill="url(#g)"/></svg><span>askrune.app</span></div>
  </body></html>`;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "askrune-og-"));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const p of pages) {
  const src = path.join(tmp, "page.html");
  fs.writeFileSync(src, html(p));
  await page.goto(pathToFileURL(src).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(ROOT, "public", p.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, type: "jpeg", quality: 84 });
  console.log("og", p.out);
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
