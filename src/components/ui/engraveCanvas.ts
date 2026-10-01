import type { Light } from "../../theme/light";

/**
 * Canvas implementation of EngravedCut, for the exported image.
 *
 * The on-screen medallion uses SVG filters (feDiffuseLighting, feGaussianBlur,
 * feDisplacementMap). Rasterising that SVG into a canvas left the filter
 * resolution to the browser, and on some engines — WebKit in particular — the
 * cut's shading came out spread and smeared in the saved image. Here the same
 * maths is done in plain pixels, so the export looks the same on every device:
 *
 *   floor     = medallion photo, luminance ÷ field mean × recess colour
 *   height    = cut mask, blurred (σ = 0.3 box units), recessed
 *   lit       = diffuse lighting of that height field from `light`
 *   shadow    = α (−2.4·lit + 1.49), highlight α (1.8·lit − 1.12), inside the cut
 *
 * Constants mirror EngravedCut; keep the two in step.
 */

interface EngraveInput {
  /** The blank medallion photo, drawn at size × size. */
  photo: CanvasImageSource;
  /** The cut's shapes as an opaque-on-transparent image, same size and framing. */
  mask: CanvasImageSource;
  size: number;
  light: Light;
  /** Medallion.recess, Medallion.fieldLum, Medallion.fieldColor. */
  tint: string;
  fieldLum: number;
  fieldColor: string;
}

// Steeper than EngravedCut's -2.6: that filter is evaluated at the browser's filter
// resolution, coarser than this full-size pixel pass, so the same value read
// flat here. -6 matches the bevel seen on screen.
const SURFACE_SCALE = -6;
const ELEVATION_DEG = 38;
/** Blur of the height field, in the 100-unit box (EngravedCut stdDeviation). */
const HEIGHT_SIGMA = 0.3;

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Three passes of a separable box blur ≈ a Gaussian of the given σ (px). */
function blur(src: Float32Array, w: number, h: number, sigma: number): Float32Array {
  const r = Math.max(1, Math.round((Math.sqrt((12 * sigma * sigma) / 3 + 1) - 1) / 2));
  const win = 2 * r + 1;
  const a = Float32Array.from(src);
  const t = new Float32Array(src.length);
  const clampX = (x: number) => Math.min(w - 1, Math.max(0, x));
  const clampY = (y: number) => Math.min(h - 1, Math.max(0, y));
  for (let pass = 0; pass < 3; pass++) {
    // Horizontal: a → t
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += a[row + clampX(x)];
      for (let x = 0; x < w; x++) {
        t[row + x] = acc / win;
        acc += a[row + clampX(x + r + 1)] - a[row + clampX(x - r)];
      }
    }
    // Vertical: t → a
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += t[clampY(y) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc / win;
        acc += t[clampY(y + r + 1) * w + x] - t[clampY(y - r) * w + x];
      }
    }
  }
  return a;
}

/** Returns a canvas holding the medallion with the cut engraved into it. */
export function engraveMedallion({
  photo,
  mask,
  size,
  light,
  tint,
  fieldLum,
  fieldColor,
}: EngraveInput): HTMLCanvasElement {
  const N = size;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = N;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  ctx.drawImage(mask, 0, 0, N, N);
  const maskData = ctx.getImageData(0, 0, N, N).data;
  ctx.clearRect(0, 0, N, N);
  ctx.drawImage(photo, 0, 0, N, N);
  const img = ctx.getImageData(0, 0, N, N);
  const px = img.data;

  const cut = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) cut[i] = maskData[i * 4 + 3] / 255;
  const height = blur(cut, N, N, (HEIGHT_SIGMA * N) / 100);

  // Distant light (SVG convention: azimuth from +x, y down).
  const az = Math.atan2(light.y, light.x);
  const el = (ELEVATION_DEG * Math.PI) / 180;
  const Lx = Math.cos(az) * Math.cos(el);
  const Ly = Math.sin(az) * Math.cos(el);
  const Lz = Math.sin(el);

  const [tr, tg, tb] = hexRgb(tint).map((v) => v / fieldLum);
  const [gr, gg, gb] = hexRgb(fieldColor).map((v) => Math.min(255, v * 1.4 + 64));
  const shadeRgb = [8, 5, 3];

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      const m = cut[i];
      if (m <= 0) continue;
      const o = i * 4;

      // Floor: the photo's own texture in this medallion's recess colour.
      const lum = (0.299 * px[o] + 0.587 * px[o + 1] + 0.114 * px[o + 2]) / 255;
      let r = Math.min(255, lum * tr);
      let g = Math.min(255, lum * tg);
      let b = Math.min(255, lum * tb);

      // Walls: diffuse lighting of the recessed height field.
      const hx = (height[y * N + Math.min(N - 1, x + 1)] - height[y * N + Math.max(0, x - 1)]) / 2;
      const hy = (height[Math.min(N - 1, y + 1) * N + x] - height[Math.max(0, y - 1) * N + x]) / 2;
      let nx = -SURFACE_SCALE * hx;
      let ny = -SURFACE_SCALE * hy;
      const len = Math.hypot(nx, ny, 1);
      nx /= len;
      ny /= len;
      const lit = Math.max(0, Math.min(1, nx * Lx + ny * Ly + Lz / len));

      const sa = Math.max(0, Math.min(1, -2.4 * lit + 1.49));
      r = r * (1 - sa) + shadeRgb[0] * sa;
      g = g * (1 - sa) + shadeRgb[1] * sa;
      b = b * (1 - sa) + shadeRgb[2] * sa;
      const ha = Math.max(0, Math.min(1, 1.8 * lit - 1.12));
      r = r * (1 - ha) + gr * ha;
      g = g * (1 - ha) + gg * ha;
      b = b * (1 - ha) + gb * ha;

      // Antialiased cut edge: blend the engraved pixel over the photo.
      px[o] = px[o] * (1 - m) + r * m;
      px[o + 1] = px[o + 1] * (1 - m) + g * m;
      px[o + 2] = px[o + 2] * (1 - m) + b * m;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}
