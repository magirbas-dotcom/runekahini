import { forwardRef } from "react";
import {
  GLYPH_FIT_SCALE,
  GLYPH_SIZE,
  RUNE_GLYPHS,
  glyphTransform,
  sealLayout,
} from "../../data/runeGlyphs";
import { DEFAULT_LIGHT, type Light } from "../../theme/light";
import { MEDALLIONS, type MedallionId } from "../../theme/medallions";
import EngravedCut from "./EngravedCut";
import type { CutPaint } from "./GildedCut";

/**
 * Two ways of composing the chosen runes.
 *
 * "bindrune" is the historical one: a ligature, its runes stacked over a single
 * shared stave so they touch and read as one mark. Carved as one cut — where
 * strokes cross they merge, as they would in stone.
 *
 * "medallion" gives each rune its own engraved circle, packed inside the field.
 * Legible at a glance and needs no adjusting, but it is a modern seal.
 */
export type TalismanForm = "bindrune" | "medallion";

/**
 * Bind-rune vertical offsets are stored in the units of the original 400px
 * preview, where the ring radius was 124.4px. Kept so saved drafts and the
 * slider range still mean the same thing.
 */
const LEGACY_RING_RADIUS = 124.4;
/** Glyph box edge relative to the ring radius in the original preview (160 / 124.4). */
const GLYPH_TO_RING = 160 / LEGACY_RING_RADIUS;
/** Engraving stays clear of the field's inner border. */
const FIELD_USE = 0.9;
/** Cut widening and seal-ring width, in the SVG's 100-unit box. Kept fine:
 *  a wide cut read as a raised bar rather than a groove. */
const CUT_WEIGHT = 0.6;
const RING_WIDTH = 0.45;
/** A bind rune's outline may use this much of the field radius, per axis… */
const FIT_AXIS = 0.96;
/** …and this much along the diagonal: bounding-box corners are mostly empty. */
const FIT_DIAGONAL = 1.12;

interface BindFit {
  /** Shrink factor applied to the whole composition (never enlarges). */
  k: number;
  /** Centre of the combined outline before fitting. */
  ccx: number;
  ccy: number;
}

/**
 * Centres a bind rune's combined outline on the field and shrinks it to fit.
 *
 * The sliders move runes along the shared stave relative to one another; that
 * is the only thing they should mean. Without this the composition drifted
 * off-centre as soon as a rune was nudged, and pulling runes apart enough to
 * stop them overlapping pushed the ends out of the field. Here the union of
 * every placed glyph's bounding box (GLYPH_SIZE, centred on the stave-aligned
 * placement glyphTransform uses) is measured, moved to the field centre, and
 * scaled down until it fits.
 */
function bindFit(
  names: string[],
  offsets: Record<string, number>,
  cx: number,
  cy: number,
  R: number,
  s: number,
  toUnits: number,
): BindFit {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const name of names) {
    const glyph = RUNE_GLYPHS[name];
    const size = GLYPH_SIZE[name];
    if (!glyph || !size) continue;
    // Stave-aligned placement puts the bbox centre at 50 + staveDx in the box.
    const gx = cx + glyph.staveDx * s;
    const gy = cy + (offsets[name] ?? 0) * toUnits;
    const hx = (size.w * GLYPH_FIT_SCALE * s) / 2;
    const hy = (size.h * GLYPH_FIT_SCALE * s) / 2;
    x0 = Math.min(x0, gx - hx);
    x1 = Math.max(x1, gx + hx);
    y0 = Math.min(y0, gy - hy);
    y1 = Math.max(y1, gy + hy);
  }
  if (!Number.isFinite(x0)) return { k: 1, ccx: cx, ccy: cy };
  const hw = (x1 - x0) / 2;
  const hh = (y1 - y0) / 2;
  const k = Math.min(
    1,
    (R * FIT_AXIS) / hh,
    (R * FIT_AXIS) / Math.max(hw, 1e-6),
    (R * FIT_DIAGONAL) / Math.hypot(hw, hh),
  );
  return { k, ccx: (x0 + x1) / 2, ccy: (y0 + y1) / 2 };
}

interface TalismanMedallionProps {
  names: string[];
  form: TalismanForm;
  offsets: Record<string, number>;
  material: MedallionId;
  light?: Light;
  /** Overrides the medallion photo URL — the exporter passes a data: URL so the
   *  serialised SVG is self-contained when drawn into a canvas. */
  imageHref?: string;
  /** Draw only the cut's shapes, opaque black, with no photo and no filter —
   *  the exporter's input to engraveMedallion. Plain shapes rasterise the
   *  same in every browser; the SVG lighting filters do not. */
  maskOnly?: boolean;
  /**
   * Enlarges the engraving about the field centre — strokes included, so the
   * cut also gets bolder. For thumbnail sizes (nav mark, app icon), where the
   * normal proportions leave the rune too small and thin to read.
   */
  emphasis?: number;
  size?: number;
  className?: string;
}

/**
 * The talisman as an antique medallion: a real medallion photo with the bind
 * rune (or seal) carved and gilded into its empty field. Drawn in a 100-unit
 * box. The same component renders the on-screen preview and, serialised, the
 * exported wallpaper — so the two cannot drift apart.
 */
const TalismanMedallion = forwardRef<SVGSVGElement, TalismanMedallionProps>(
  function TalismanMedallion(
    {
      names,
      form,
      offsets,
      material,
      light = DEFAULT_LIGHT,
      imageHref,
      maskOnly = false,
      emphasis = 1,
      size = 100,
      className = "",
    },
    ref,
  ) {
    const m = MEDALLIONS[material];
    const cx = m.cx * 100;
    const cy = m.cy * 100;
    const R = m.fieldR * 100 * FIELD_USE;
    const toUnits = R / LEGACY_RING_RADIUS;
    const bindScale = (GLYPH_TO_RING * R) / 100;

    const fit = form === "bindrune" ? bindFit(names, offsets, cx, cy, R, bindScale, toUnits) : null;

    const bindShapes = ({ color, extra }: CutPaint, { k, ccx, ccy }: BindFit) => (
      <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-ccx} ${-ccy})`}>
        {names.map((name) => {
          const glyph = RUNE_GLYPHS[name];
          if (!glyph) return null;
          const y = cy + (offsets[name] ?? 0) * toUnits;
          const s = bindScale;
          return (
            <g key={name} transform={`translate(${cx - 50 * s} ${y - 50 * s}) scale(${s})`}>
              <g transform={glyphTransform(glyph, GLYPH_FIT_SCALE, true)}>
                <path
                  d={glyph.d}
                  fill={color}
                  stroke={color}
                  // Divide by the fit too, so a shrunk composition keeps the
                  // same cut width as an unshrunk one.
                  strokeWidth={(CUT_WEIGHT + extra) / (s * k * GLYPH_FIT_SCALE)}
                  strokeLinejoin="round"
                />
              </g>
            </g>
          );
        })}
      </g>
    );

    const sealShapes = ({ color, extra }: CutPaint) =>
      names.map((name, i) => {
        const glyph = RUNE_GLYPHS[name];
        if (!glyph) return null;
        const slot = sealLayout(i, names.length, R, bindScale);
        const x = cx + slot.dx;
        const y = cy + slot.dy;
        return (
          <g key={name}>
            <circle cx={x} cy={y} r={slot.r} fill="none" stroke={color} strokeWidth={RING_WIDTH + extra} />
            <g transform={`translate(${x - 50 * slot.scale} ${y - 50 * slot.scale}) scale(${slot.scale})`}>
              <g transform={glyphTransform(glyph)}>
                <path
                  d={glyph.d}
                  fill={color}
                  stroke={color}
                  strokeWidth={(CUT_WEIGHT + extra) / (slot.scale * GLYPH_FIT_SCALE)}
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </g>
        );
      });

    const shapes = (paint: CutPaint) => (
      <g transform={`translate(${cx} ${cy}) scale(${emphasis}) translate(${-cx} ${-cy})`}>
        {fit ? bindShapes(paint, fit) : sealShapes(paint)}
      </g>
    );

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        role="img"
        aria-label={
          names.length ? `Tılsım: ${names.join(", ")}` : "Tılsım — henüz Rune seçilmedi"
        }
      >
        {maskOnly ? (
          shapes({ color: "#000", extra: 0 })
        ) : (
          <image href={imageHref ?? m.src} x="0" y="0" width="100" height="100" />
        )}
        {!maskOnly && names.length > 0 && (
          <EngravedCut photo={imageHref ?? m.src} light={light} tint={m.recess} fieldLum={m.fieldLum} fieldColor={m.fieldColor}>
            {shapes({ color: "#000", extra: 0 })}
          </EngravedCut>
        )}
      </svg>
    );
  },
);

export default TalismanMedallion;
