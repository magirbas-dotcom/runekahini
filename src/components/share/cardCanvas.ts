import { GLYPH_FIT_SCALE, RUNE_GLYPHS } from "../../data/runeGlyphs";
import { DEFAULT_LIGHT } from "../../theme/light";

/* Shared canvas helpers for the downloadable images: the talisman wallpaper
 * and the reading / birth-rune result cards. */

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Canvas text falls back to a generic font when the face is not loaded yet,
 * and `document.fonts.ready` only covers faces the page has already used — the
 * cards use Inter italic, which no screen does. Each face is requested by name.
 */
export async function loadFonts(faces: string[]): Promise<void> {
  await Promise.all(faces.map((f) => document.fonts?.load(f).catch(() => [])));
}

/** Spaced capitals for canvas lettering; Turkish casing keeps the dotted İ. */
export function spaced(t: string): string {
  return t.toLocaleUpperCase("tr-TR").split("").join(" ");
}

/** Shrinks the font until `text` fits `maxWidth`. Sets ctx.font and returns the size. */
export function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  weight: string,
  family: string,
  maxSize: number,
  minSize: number,
): number {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  ctx.font = `${weight} ${size}px ${family}`;
  return size;
}

/** Greedy word wrap with the current ctx.font. The last allowed line gets an
 *  ellipsis when the text runs past `maxLines`. */
export function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
      continue;
    }
    lines.push(line);
    line = words[i];
    if (lines.length === maxLines) {
      line = "";
      let last = lines[maxLines - 1];
      while (last && ctx.measureText(`${last}…`).width > maxWidth) {
        last = last.replace(/\s*\S+$/, "");
      }
      lines[maxLines - 1] = `${last}…`;
      return lines;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** The first sentence of a reading, for places with room for one line of prose. */
export function firstSentence(text: string): string {
  const m = text.match(/^.+?[.!?](?=\s|$)/);
  return (m ? m[0] : text).trim();
}

const GOLD: [number, string][] = [
  [0, "#5e400f"],
  [0.18, "#a77a24"],
  [0.36, "#e9c96a"],
  [0.5, "#fff1bd"],
  [0.64, "#d9ab45"],
  [0.84, "#8a6420"],
  [1, "#c99a38"],
];

interface CarveOptions {
  stone: HTMLImageElement;
  rune: string;
  reversed?: boolean;
  /** Output edge in px. */
  size: number;
  /** Fraction of the stone the carving spans (CarvedRune `face`). */
  face?: number;
  /** Cut widening, 100-box units (CarvedRune `weight`). */
  weight?: number;
}

/**
 * A gilded rune cut into a stone photo, in pixels — the canvas counterpart of
 * CarvedRune + GildedCut. Built from plain fills and composites (no SVG filter,
 * no ctx.filter) because rasterising SVG filters smeared on some phones and
 * Safari's canvas has no `filter`.
 */
export function carveStone({
  stone,
  rune,
  reversed = false,
  size,
  face = 0.62,
  weight = 2.8,
}: CarveOptions): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = out.height = size;
  const ctx = out.getContext("2d")!;
  ctx.drawImage(stone, 0, 0, size, size);

  const glyph = RUNE_GLYPHS[rune];
  if (!glyph) return out;
  const path = new Path2D(glyph.d);
  const k = size / 100;
  const offset = (100 * (1 - face)) / 2;
  // 100-box → px, then the face inset, the reversed turn, and the glyph's own
  // centring — the same chain as CarvedRune's nested SVG transforms.
  const place = (c: CanvasRenderingContext2D, dx = 0, dy = 0) => {
    c.setTransform(1, 0, 0, 1, dx, dy);
    c.scale(k, k);
    c.translate(offset, offset);
    c.scale(face, face);
    if (reversed) {
      c.translate(50, 50);
      c.rotate(Math.PI);
      c.translate(-50, -50);
    }
    c.translate(50 - glyph.cx * GLYPH_FIT_SCALE, 50 - glyph.cy * GLYPH_FIT_SCALE);
    c.scale(GLYPH_FIT_SCALE, GLYPH_FIT_SCALE);
  };
  const paint = (c: CanvasRenderingContext2D, style: string | CanvasGradient, extra = 0, dx = 0, dy = 0) => {
    place(c, dx, dy);
    c.fillStyle = style;
    c.strokeStyle = style;
    c.lineJoin = "round";
    c.lineWidth = (weight + extra) / GLYPH_FIT_SCALE;
    c.fill(path);
    c.stroke(path);
    c.setTransform(1, 0, 0, 1, 0, 0);
  };
  const layer = () => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    return c.getContext("2d")!;
  };

  // Lip: the far rim catches the light.
  const depth = 1.6 * face * k; // px
  const L = DEFAULT_LIGHT;
  ctx.globalAlpha = 0.22;
  paint(ctx, "#fff4e4", 0, -L.x * depth * 0.45, -L.y * depth * 0.45);
  ctx.globalAlpha = 1;
  // Dark outline keeps the letterform crisp on any stone.
  paint(ctx, "rgba(0,0,0,0.6)", 0.7);

  // Gold leaf, then the two inner shadows clipped to it: a rim is the cut
  // minus a shifted copy of itself.
  const gold = layer();
  const grad = gold.createLinearGradient(size * 0.19, size * 0.19, size * 0.81, size * 0.81);
  for (const [o, c] of GOLD) grad.addColorStop(o, c);
  paint(gold, grad);
  const rim = (dx: number, dy: number, color: string, alpha: number) => {
    const r = layer();
    paint(r, "#000");
    r.globalCompositeOperation = "destination-out";
    paint(r, "#000", 0, dx, dy);
    r.globalCompositeOperation = "source-in";
    r.globalAlpha = alpha;
    r.fillStyle = color;
    r.fillRect(0, 0, size, size);
    gold.globalCompositeOperation = "source-atop";
    gold.drawImage(r.canvas, 0, 0);
  };
  rim(-L.x * depth, -L.y * depth, "#281600", 0.85);
  rim(L.x * depth * 0.7, L.y * depth * 0.7, "#fffae1", 0.55);
  ctx.drawImage(gold.canvas, 0, 0);
  return out;
}

/** Draws a carved stone with a soft contact shadow, centred on (cx, cy). */
export function drawStone(
  ctx: CanvasRenderingContext2D,
  carved: HTMLCanvasElement,
  cx: number,
  cy: number,
  size: number,
) {
  ctx.save();
  ctx.shadowColor = "rgba(58,30,8,0.55)";
  ctx.shadowBlur = size * 0.12;
  ctx.shadowOffsetY = size * 0.05;
  ctx.drawImage(carved, cx - size / 2, cy - size / 2, size, size);
  ctx.restore();
}

/**
 * Mobile: hands the image to the native share sheet, which offers "Save to
 * Photos" directly — a plain <a download> mostly just opens the image on iOS
 * Safari and lands in Downloads (not the gallery) on Android. Elsewhere, or
 * if sharing fails for a reason other than the user cancelling, downloads it.
 */
export function shareCanvas(canvas: HTMLCanvasElement, filename: string, title: string) {
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], filename, { type: "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (data: { files: File[] }) => boolean;
      share?: (data: { files: File[]; title?: string }) => Promise<void>;
    };
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      try {
        await nav.share({ files: [file], title });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoking immediately can race the browser reading the blob.
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, "image/png");
}
