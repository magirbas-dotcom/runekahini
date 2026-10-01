import { useId, type ReactNode } from "react";
import type { Light } from "../../theme/light";

/* Gold leaf: deep shadow-gold through bright leaf and back. Mirrors the mobile
 * app's GOLD_STOPS (rune-kahini-mobile/src/components/CarvedRunes.tsx). */
const GOLD: [string, string][] = [
  ["0", "#5e400f"],
  ["0.18", "#a77a24"],
  ["0.36", "#e9c96a"],
  ["0.5", "#fff1bd"],
  ["0.64", "#d9ab45"],
  ["0.84", "#8a6420"],
  ["1", "#c99a38"],
];

/**
 * How the caller's shapes should be painted for one layer. `extra` is added to
 * the shape's own stroke width — the outline layer is the cut widened a little,
 * so a dark edge shows around the gold.
 */
export interface CutPaint {
  color: string;
  extra: number;
}

interface GildedCutProps {
  /** Draws the cut's shapes with the given paint. Called once per layer. */
  shapes: (paint: CutPaint) => ReactNode;
  light: Light;
  /** Groove depth, in the SVG's user units — drives the inner-shadow offsets. */
  depth: number;
  /** Outline growth around the cut, in user units. */
  outline: number;
  /**
   * Thumbnail mode: gold leaf and outline only — no inner-shadow filter and no
   * sheen. At list sizes the shading is invisible anyway, and a grid of 24
   * filtered SVGs is a real scroll cost on phones.
   */
  lite?: boolean;
}

/**
 * A gilded engraving, as SVG layers inside an existing <svg>:
 *
 * 1. a lip highlight on the far rim of the cut;
 * 2. a thin dark outline (the cut widened), which keeps the letterform crisp
 *    on any surface, light gold or dark basalt;
 * 3. the cut filled with gold leaf and shaded by two inner shadows — dark on
 *    the wall facing the light, bright on the opposite wall — so it reads as
 *    recessed rather than painted on;
 * 4. a sheen band whose position follows the light, so it glints as it tilts.
 *
 * Inner shadow = alpha minus a shifted copy of itself, which leaves a rim on
 * one side of the shape, then tinted. Everything is native SVG, so the same
 * markup rasterises unchanged when the talisman is exported as a PNG.
 */
export default function GildedCut({ shapes, light, depth, outline, lite = false }: GildedCutProps) {
  const id = useId();
  const shade = { dx: -light.x * depth, dy: -light.y * depth };
  const lit = { dx: light.x * depth * 0.7, dy: light.y * depth * 0.7 };
  const lip = { dx: -light.x * depth * 0.45, dy: -light.y * depth * 0.45 };

  return (
    <>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          {GOLD.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient
          id={`${id}-sheen`}
          x1={0.2 + light.x * 0.3}
          y1={0.2 + light.y * 0.3}
          x2={0.8 + light.x * 0.3}
          y2={0.8 + light.y * 0.3}
        >
          <stop offset="0.38" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff8dc" stopOpacity="0.75" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* userSpaceOnUse with a generous region: a bbox-relative one is near
            degenerate for a thin bar like Isa and would clip its shading. Both
            callers draw in a 100-unit box. */}
        <filter id={`${id}-carve`} filterUnits="userSpaceOnUse" x="-50" y="-50" width="200" height="200">
          <feOffset in="SourceAlpha" dx={shade.dx} dy={shade.dy} result="o1" />
          <feGaussianBlur in="o1" stdDeviation={depth * 0.3} result="o1b" />
          <feComposite in="SourceAlpha" in2="o1b" operator="out" result="m1" />
          <feFlood floodColor="#281600" floodOpacity="0.85" />
          <feComposite in2="m1" operator="in" result="shade" />
          <feOffset in="SourceAlpha" dx={lit.dx} dy={lit.dy} result="o2" />
          <feGaussianBlur in="o2" stdDeviation={depth * 0.25} result="o2b" />
          <feComposite in="SourceAlpha" in2="o2b" operator="out" result="m2" />
          <feFlood floodColor="#fffae1" floodOpacity="0.55" />
          <feComposite in2="m2" operator="in" result="lit" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="shade" />
            <feMergeNode in="lit" />
          </feMerge>
        </filter>
      </defs>

      {!lite && (
        <g transform={`translate(${lip.dx} ${lip.dy})`} opacity={0.22}>
          {shapes({ color: "#fff4e4", extra: 0 })}
        </g>
      )}
      {shapes({ color: "rgba(0,0,0,0.6)", extra: outline })}
      {lite ? (
        shapes({ color: `url(#${id}-gold)`, extra: 0 })
      ) : (
        <>
          <g filter={`url(#${id}-carve)`}>{shapes({ color: `url(#${id}-gold)`, extra: 0 })}</g>
          <g style={{ mixBlendMode: "screen" }} opacity={0.6}>
            {shapes({ color: `url(#${id}-sheen)`, extra: 0 })}
          </g>
        </>
      )}
    </>
  );
}
