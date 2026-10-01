import { runes, type DrawnRune, type Rune } from "../../data/runes";
import type { RuneWord, Transliteration } from "../../data/transliterate";
import parchment from "../../assets/cards/parchment.webp";
import { ZODIAC_STROKES } from "../../data/zodiac";
import {
  carveStone,
  drawStone,
  firstSentence,
  fitFontSize,
  loadFonts,
  runeName,
  spaced,
  wrapLines,
} from "./cardCanvas";

/* Result cards for sharing a rune reading or a birth-rune map: 9:16 story
 * format on an illuminated parchment. Light ground, dark ink — on a page meant
 * to be read by someone else, ink on parchment reads far better than the app's
 * gold-on-dark. */

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;
export const CARD_BACKGROUND = parchment;

const SERIF = "Cinzel, Georgia, serif";
const SANS = "Inter, sans-serif";
const INK = "#2a1a0d";
// Secondary text: dark enough to read at phone size on the stained parchment.
const INK_SOFT = "#3e2812";
/** The border's deep red, for small labels. */
const RED = "#7a2a17";

const CX = CARD_WIDTH / 2;
/** Inside the knotwork border, with a margin. */
const TEXT_MAX = 800;
/** Below this the pebbles in the bottom-right corner begin. */
const CONTENT_BOTTOM = 1550;

const FONTS = [`600 40px Cinzel`, `500 40px Inter`, `400 40px Inter`, `italic 400 40px Inter`];

export interface CardAssets {
  background: HTMLImageElement;
  stone: HTMLImageElement;
}

type Ctx = CanvasRenderingContext2D;

function reading(d: DrawnRune) {
  return d.reversed && d.rune.reversed ? d.rune.reversed : d.rune.upright;
}

function text(ctx: Ctx, t: string, x: number, y: number, font: string, color: string) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(t, x, y);
}

/** A short ink rule with a diamond in the middle. */
function ornament(ctx: Ctx, y: number, half = 180) {
  ctx.save();
  ctx.strokeStyle = "rgba(90,52,20,0.55)";
  ctx.fillStyle = "rgba(122,42,23,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CX - half, y);
  ctx.lineTo(CX - 18, y);
  ctx.moveTo(CX + 18, y);
  ctx.lineTo(CX + half, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(CX, y - 10);
  ctx.lineTo(CX + 10, y);
  ctx.lineTo(CX, y + 10);
  ctx.lineTo(CX - 10, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function blankCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  return { canvas, ctx };
}

function newCard(assets: CardAssets) {
  const { canvas, ctx } = blankCanvas();
  const bg = assets.background;
  const k = Math.max(CARD_WIDTH / bg.naturalWidth, CARD_HEIGHT / bg.naturalHeight);
  ctx.drawImage(
    bg,
    (CARD_WIDTH - bg.naturalWidth * k) / 2,
    (CARD_HEIGHT - bg.naturalHeight * k) / 2,
    bg.naturalWidth * k,
    bg.naturalHeight * k,
  );
  return { canvas, ctx };
}

/** Kicker, title and subtitle; returns the y where content can start. */
function header(ctx: Ctx, kicker: string, title: string, sub: string) {
  text(ctx, spaced(kicker), CX, 180, `600 32px ${SANS}`, RED);
  const size = fitFontSize(ctx, title, TEXT_MAX, "600", SERIF, 66, 40);
  ctx.fillStyle = INK;
  ctx.fillText(title, CX, 200 + size + 16);
  const subY = 200 + size + 76;
  const subSize = fitFontSize(ctx, sub, TEXT_MAX, "500", SANS, 34, 26);
  text(ctx, sub, CX, subY, `500 ${subSize}px ${SANS}`, INK_SOFT);
  ornament(ctx, subY + 52);
  return subY + 52;
}

/**
 * Brand centred on the page, as low as it can sit while staying centred: below
 * this the pebbles and leaves in the bottom-right corner reach in past the
 * middle (x≈620 near the bottom band) and would run into the lettering.
 */
const FOOT_Y = 1716;
function footer(ctx: Ctx, note?: string) {
  if (note) text(ctx, note, CX, FOOT_Y - 64, `italic 500 28px ${SANS}`, INK_SOFT);
  const brand = spaced("Rune Kahini");
  text(ctx, brand, CX, FOOT_Y, `600 32px ${SERIF}`, RED);
  // A small diamond either side, as in the header's rule.
  const half = ctx.measureText(brand).width / 2 + 30;
  ctx.save();
  ctx.fillStyle = "rgba(122,42,23,0.85)";
  for (const x of [CX - half, CX + half]) {
    ctx.beginPath();
    ctx.moveTo(x, FOOT_Y - 21);
    ctx.lineTo(x + 7, FOOT_Y - 12);
    ctx.lineTo(x, FOOT_Y - 3);
    ctx.lineTo(x - 7, FOOT_Y - 12);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Position label, rune name (with a "ters" mark when reversed) and keywords
 * under a stone. Returns the y below the block.
 */
function caption(
  ctx: Ctx,
  x: number,
  top: number,
  d: DrawnRune,
  o: { label?: string; nameSize: number; kwSize?: number; keywords: "stack" | "line" | "none"; width: number },
) {
  let y = top;
  if (o.label) {
    y += 30;
    ctx.font = `600 28px ${SANS}`;
    const label = spaced(o.label);
    // Long labels ("Senin Enerjin") drop the letter spacing before they overrun.
    const fits = ctx.measureText(label).width <= o.width;
    text(ctx, fits ? label : o.label.toLocaleUpperCase("tr-TR"), x, y, `600 28px ${SANS}`, RED);
    y += 12;
  }
  y += o.nameSize;
  text(ctx, runeName(d.rune.name), x, y, `600 ${o.nameSize}px ${SERIF}`, INK);
  if (d.reversed) {
    y += 36;
    text(ctx, "ters", x, y, `italic 500 30px ${SANS}`, RED);
  }
  const kw = reading(d).keywords;
  const kwSize = o.kwSize ?? 36;
  if (o.keywords === "stack") {
    y += 10;
    for (const w of kw) {
      y += kwSize * 1.4;
      const size = fitFontSize(ctx, w, o.width, "500", SANS, kwSize, kwSize - 8);
      text(ctx, w, x, y, `500 ${size}px ${SANS}`, INK_SOFT);
    }
  } else if (o.keywords === "line") {
    y += kwSize * 1.7;
    const line = kw.join(" · ");
    const size = fitFontSize(ctx, line, o.width, "500", SANS, kwSize, kwSize - 10);
    text(ctx, line, x, y, `500 ${size}px ${SANS}`, INK_SOFT);
  }
  return y;
}

/** Prose block, wrapped and centred; returns the y below it. */
function prose(ctx: Ctx, t: string, top: number, maxLines: number, size = 36) {
  ctx.font = `italic 400 ${size}px ${SANS}`;
  ctx.fillStyle = INK;
  let y = top;
  for (const line of wrapLines(ctx, t, TEXT_MAX - 20, maxLines)) {
    y += size * 1.42;
    ctx.fillText(line, CX, y);
  }
  return y;
}

/**
 * Lays the body out twice: once on a scratch canvas to measure it, then for
 * real, shifted down so it sits centred in the space under the header — a
 * one-rune reading and a five-rune cross then both fill the page.
 */
function centred(ctx: Ctx, top: number, body: (c: Ctx, top: number) => number) {
  const bottom = body(blankCanvas().ctx, top);
  const slack = Math.max(0, CONTENT_BOTTOM - bottom);
  body(ctx, top + slack * 0.45);
}

/** Carved stones are drawn on both passes; carve each only once. */
function stoneMaker(assets: CardAssets) {
  const cache = new Map<string, HTMLCanvasElement>();
  return (c: Ctx, rune: string, reversed: boolean, cx: number, cy: number, size: number) => {
    const key = `${rune}|${reversed}|${size}`;
    let carved = cache.get(key);
    if (!carved) {
      carved = carveStone({ stone: assets.stone, rune, reversed, size: size * 2 });
      cache.set(key, carved);
    }
    drawStone(c, carved, cx, cy, size);
  };
}

export type CardSpread = "single" | "three" | "four" | "five";

export interface ReadingCardInput {
  spread: CardSpread;
  spreadTitle: string;
  labels: string[];
  drawn: DrawnRune[];
  question: string;
  date: Date;
}

export async function drawReadingCard(input: ReadingCardInput, assets: CardAssets) {
  await loadFonts(FONTS);
  const { canvas, ctx } = newCard(assets);
  const { drawn, labels } = input;
  const date = input.date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  let top = header(ctx, "Rune Okuması", input.spreadTitle, date);

  const q = input.question.trim();
  if (q) top = prose(ctx, `“${q}”`, top + 26, 3, 38) + 10;
  top += 50;

  const stoneAt = stoneMaker(assets);
  const stone = (c: Ctx, d: DrawnRune, cx: number, cy: number, size: number) =>
    stoneAt(c, d.rune.name, d.reversed, cx, cy, size);

  centred(ctx, top, (c, t) => {
    if (input.spread === "single") {
      const d = drawn[0];
      const size = q ? 400 : 460;
      stone(c, d, CX, t + size / 2, size);
      const y = caption(c, CX, t + size + 24, d, { nameSize: 84, kwSize: 40, keywords: "line", width: TEXT_MAX });
      return prose(c, firstSentence(reading(d).general), y + 30, 5);
    }
    if (input.spread === "three") {
      const size = 260;
      let bottom = 0;
      [CX - 270, CX, CX + 270].forEach((x, i) => {
        stone(c, drawn[i], x, t + size / 2, size);
        bottom = Math.max(
          bottom,
          caption(c, x, t + size + 20, drawn[i], { label: labels[i], nameSize: 56, kwSize: 36, keywords: "stack", width: 250 }),
        );
      });
      return bottom;
    }
    if (input.spread === "four") {
      const size = q ? 210 : 240;
      const rowH = size + 300;
      let bottom = 0;
      [
        [CX - 215, t],
        [CX + 215, t],
        [CX - 215, t + rowH],
        [CX + 215, t + rowH],
      ].forEach(([x, y], i) => {
        stone(c, drawn[i], x, y + size / 2, size);
        bottom = Math.max(
          bottom,
          caption(c, x, y + size + 14, drawn[i], { label: labels[i], nameSize: 46, keywords: "stack", width: 390 }),
        );
      });
      return bottom;
    }
    // Cross: Merkez, Sol, Üst, Alt, Sağ — same order as the spread's labels.
    const size = q ? 160 : 180;
    const step = size + 110;
    const cy = t + step + size / 2 - 10;
    const at: [number, number][] = [
      [CX, cy],
      [CX - 280, cy],
      [CX, cy - step],
      [CX, cy + step],
      [CX + 280, cy],
    ];
    at.forEach(([x, y], i) => {
      stone(c, drawn[i], x, y, size);
      caption(c, x, y + size / 2 + 6, drawn[i], { label: labels[i], nameSize: 38, keywords: "none", width: 250 });
    });
    // Keywords as a key below the cross — there is no room under each stone.
    let y = cy + step + size / 2 + 140;
    drawn.forEach((d, i) => {
      // One line per stone: "Merkez · Sowilo" in red, then its keywords.
      const head = `${labels[i]} · ${d.rune.name}${d.reversed ? " (ters)" : ""}`;
      // Long lines first shrink a little, then drop the third keyword.
      const kw = reading(d).keywords;
      let rest = `  —  ${kw.join(", ")}`;
      const width = (size: number) => {
        c.font = `600 ${size}px ${SANS}`;
        const w1 = c.measureText(head).width;
        c.font = `500 ${size}px ${SANS}`;
        return w1 + c.measureText(rest).width;
      };
      let fs = 32;
      while (fs > 27 && width(fs) > TEXT_MAX - 40) fs -= 1;
      if (width(fs) > TEXT_MAX - 40) rest = `  —  ${kw.slice(0, 2).join(", ")}`;
      while (fs > 23 && width(fs) > TEXT_MAX - 40) fs -= 1;
      c.font = `600 ${fs}px ${SANS}`;
      const w1 = c.measureText(head).width;
      c.font = `500 ${fs}px ${SANS}`;
      const x0 = CX - (w1 + c.measureText(rest).width) / 2;
      c.textAlign = "left";
      text(c, head, x0, y, `600 ${fs}px ${SANS}`, RED);
      text(c, rest, x0 + w1, y, `500 ${fs}px ${SANS}`, INK_SOFT);
      c.textAlign = "center";
      y += 54;
    });
    return y - 30;
  });

  footer(ctx);
  return canvas;
}

export interface BirthCardInput {
  lifePath: Rune;
  solar: Rune;
  hour: Rune;
  zodiacId: string;
  zodiacName: string;
  /** Formatted birth date, plus the time when the user gave one. */
  dateText: string;
}

/**
 * Birth card header, in the order the user set: kicker, the sign's symbol and
 * name (the card's title), birth date and time, then the rule.
 */
function birthHeader(ctx: Ctx, input: BirthCardInput) {
  text(ctx, spaced("Doğum Rune'si"), CX, 170, `600 32px ${SANS}`, RED);

  const cy = 306;
  const r = 98;
  ctx.save();
  ctx.fillStyle = "rgba(255,244,214,0.45)";
  ctx.strokeStyle = RED;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(CX, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(122,42,23,0.6)";
  ctx.beginPath();
  ctx.arc(CX, cy, r - 10, 0, Math.PI * 2);
  ctx.stroke();

  const d = ZODIAC_STROKES[input.zodiacId];
  if (d) {
    // The sign drawn like the runes: gold leaf with a dark ink edge.
    const k = 1.36;
    const path = new Path2D(d);
    ctx.translate(CX - 50 * k, cy - 50 * k);
    ctx.scale(k, k);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = INK;
    ctx.lineWidth = 8;
    ctx.stroke(path);
    const gold = ctx.createLinearGradient(15, 15, 85, 85);
    gold.addColorStop(0, "#8a6420");
    gold.addColorStop(0.4, "#e9c96a");
    gold.addColorStop(0.55, "#fff1bd");
    gold.addColorStop(0.75, "#d9ab45");
    gold.addColorStop(1, "#8a6420");
    ctx.strokeStyle = gold;
    ctx.lineWidth = 4.6;
    ctx.stroke(path);
  }
  ctx.restore();

  const nameY = cy + r + 80;
  const size = fitFontSize(ctx, input.zodiacName, TEXT_MAX, "600", SERIF, 80, 50);
  text(ctx, input.zodiacName, CX, nameY, `600 ${size}px ${SERIF}`, INK);
  const dateY = nameY + 62;
  const dateSize = fitFontSize(ctx, input.dateText, TEXT_MAX, "500", SANS, 36, 26);
  text(ctx, input.dateText, CX, dateY, `500 ${dateSize}px ${SANS}`, INK_SOFT);
  ornament(ctx, dateY + 54);
  return dateY + 54;
}

export async function drawBirthCard(input: BirthCardInput, assets: CardAssets) {
  await loadFonts(FONTS);
  const { canvas, ctx } = newCard(assets);
  const top = birthHeader(ctx, input) + 46;

  const up = (rune: Rune): DrawnRune => ({ rune, reversed: false });
  const stoneAt = stoneMaker(assets);

  centred(ctx, top, (c, t) => {
    // Label above the main stone, so it reads as the map's title rune.
    text(c, spaced("Kader Yolu"), CX, t + 10, `600 30px ${SANS}`, RED);
    const size = 236;
    stoneAt(c, input.lifePath.name, false, CX, t + 34 + size / 2, size);
    let y = caption(c, CX, t + 34 + size + 14, up(input.lifePath), {
      nameSize: 72,
      kwSize: 36,
      keywords: "line",
      width: TEXT_MAX,
    });
    const small = 170;
    const row = y + 44;
    let bottom = 0;
    (
      [
        [CX - 210, "Güneş Rune'si", input.solar],
        [CX + 210, "Doğum Saati", input.hour],
      ] as const
    ).forEach(([x, label, r]) => {
      stoneAt(c, r.name, false, x, row + small / 2, small);
      bottom = Math.max(
        bottom,
        caption(c, x, row + small + 12, up(r), { label, nameSize: 48, keywords: "stack", width: 360 }),
      );
    });
    return bottom;
  });

  footer(ctx, "Modern bir yorumdur.");
  return canvas;
}

export interface NameCardInput {
  name: string;
  result: Transliteration;
}

type Slot = { kind: "letter"; runes: string[]; from: string } | { kind: "sep" };

/** A two-rune letter (c, ç, x) sits its stones a little closer, as one unit. */
const PAIR_STEP = 0.9;
const letterWidth = (n: number, size: number) => size + (n - 1) * size * PAIR_STEP + 18;
const slotWidth = (s: Slot, size: number) => (s.kind === "sep" ? 46 : letterWidth(s.runes.length, size));

/**
 * Lays the name's stones out in centred rows. When the whole name fits on one
 * row the words share it, divided by the inscriptions' two dots; otherwise each
 * word starts its own row (a divider would end up opening a row), and only a
 * word too long for a row is broken.
 */
function nameRows(words: RuneWord[], size: number, maxWidth: number): Slot[][] {
  const letterSlots = (w: RuneWord): Slot[] =>
    w.letters.map((l) => ({ kind: "letter", runes: l.runes, from: l.from }));
  const all = words.flatMap((w, i) => (i > 0 ? [{ kind: "sep" } as Slot, ...letterSlots(w)] : letterSlots(w)));
  if (all.reduce((n, sl) => n + slotWidth(sl, size), 0) <= maxWidth) return [all];
  // A two-rune letter is never split across rows.
  const rows: Slot[][] = [];
  for (const w of words) {
    let row: Slot[] = [];
    let used = 0;
    for (const sl of letterSlots(w)) {
      const sw = slotWidth(sl, size);
      if (row.length > 0 && used + sw > maxWidth) {
        rows.push(row);
        row = [];
        used = 0;
      }
      row.push(sl);
      used += sw;
    }
    if (row.length > 0) rows.push(row);
  }
  return rows;
}

export async function drawNameCard(input: NameCardInput, assets: CardAssets) {
  await loadFonts(FONTS);
  const { canvas, ctx } = newCard(assets);
  const title = input.name.toLocaleUpperCase("tr-TR");
  const top = header(ctx, "Rune ile Yazılışı", title, "Elder Futhark harfleriyle") + 50;
  const stoneAt = stoneMaker(assets);
  const words = input.result.words;

  // Largest stone size at which no word has to be broken across rows (one row
  // for the whole name, or one per word), within three rows; failing that, the
  // largest that fits three rows at all.
  const SIZES = [190, 160, 136, 116, 100, 86, 74];
  const W = TEXT_MAX + 20;
  const unbroken = (sz: number) => {
    const n = nameRows(words, sz, W).length;
    return n <= 3 && (n === 1 || n === words.length);
  };
  const size =
    SIZES.find(unbroken) ??
    SIZES.find((sz) => nameRows(words, sz, W).length <= 3) ??
    SIZES[SIZES.length - 1];
  const rows = nameRows(words, size, TEXT_MAX + 20);

  const distinct: string[] = [];
  for (const w of words) for (const r of w.runes) if (!distinct.includes(r.rune)) distinct.push(r.rune);

  centred(ctx, top, (c, t) => {
    let y = t;
    const letterSize = Math.round(Math.max(26, size * 0.2));
    for (const row of rows) {
      const width = row.reduce((n, sl) => n + slotWidth(sl, size), 0);
      let x = CX - width / 2;
      for (const s of row) {
        if (s.kind === "sep") {
          c.save();
          c.fillStyle = RED;
          for (const dy of [-12, 12]) {
            c.beginPath();
            c.arc(x + 23, y + size / 2 + dy, 6, 0, Math.PI * 2);
            c.fill();
          }
          c.restore();
          x += 46;
          continue;
        }
        const w = slotWidth(s, size);
        const first = x + 9 + size / 2;
        const last = first + (s.runes.length - 1) * size * PAIR_STEP;
        s.runes.forEach((rune, i) => stoneAt(c, rune, false, first + i * size * PAIR_STEP, y + size / 2, size));
        if (s.runes.length > 1) {
          // Bracket under the pair: one letter, two runes.
          const by = y + size + 10;
          const x0 = first - size * 0.28;
          const x1 = last + size * 0.28;
          c.save();
          c.strokeStyle = RED;
          c.lineWidth = 3;
          c.lineJoin = "round";
          c.beginPath();
          c.moveTo(x0, by - 8);
          c.lineTo(x0, by);
          c.lineTo(x1, by);
          c.lineTo(x1, by - 8);
          c.stroke();
          c.restore();
        }
        text(c, s.from, x + w / 2, y + size + letterSize + 22, `600 ${letterSize}px ${SANS}`, RED);
        x += w;
      }
      y += size + letterSize + 50;
    }

    // Key: each distinct rune with its first two keywords.
    y += 30;
    ornament(c, y, 140);
    y += 30;
    const lines = distinct.map((name) => {
      const rune = runes.find((r) => r.name === name);
      return { name, kw: rune ? rune.upright.keywords.slice(0, 2).join(", ") : "" };
    });
    const twoCols = lines.length > 6;
    const colW = twoCols ? TEXT_MAX / 2 : TEXT_MAX;
    const rowsN = twoCols ? Math.ceil(lines.length / 2) : lines.length;
    const fs = twoCols ? 27 : 32;
    lines.forEach((l, i) => {
      const col = twoCols ? Math.floor(i / rowsN) : 0;
      const row = twoCols ? i % rowsN : i;
      const cx = twoCols ? CX - TEXT_MAX / 4 + col * (TEXT_MAX / 2) : CX;
      const ly = y + 20 + row * (fs + 22) + fs;
      const head = `${l.name}  `;
      c.font = `600 ${fs}px ${SERIF}`;
      const w1 = c.measureText(runeName(head)).width;
      const kwSize = fitFontSize(c, l.kw, colW - w1 - 30, "500", SANS, fs, 20);
      c.font = `500 ${kwSize}px ${SANS}`;
      const w2 = c.measureText(l.kw).width;
      const x0 = cx - (w1 + w2) / 2;
      c.textAlign = "left";
      text(c, runeName(head), x0, ly, `600 ${fs}px ${SERIF}`, INK);
      text(c, l.kw, x0 + w1, ly, `500 ${kwSize}px ${SANS}`, INK_SOFT);
      c.textAlign = "center";
    });
    return y + 20 + rowsN * (fs + 22);
  });

  footer(ctx, "Harf çevirisidir, modern bir uygulamadır.");
  return canvas;
}
