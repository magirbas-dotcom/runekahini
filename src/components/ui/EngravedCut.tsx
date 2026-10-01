import { useId, type ReactNode } from "react";
import type { Light } from "../../theme/light";

interface EngravedCutProps {
  /** The cut's shapes, painted solid — only their alpha is used. */
  children: ReactNode;
  /** The medallion photo the cut is made into (a data: URL when exporting). */
  photo: string;
  light: Light;
  /** The medallion's own recess colour (see Medallion.recess). */
  tint: string;
  /** Mean brightness of the medallion's field, 0–1. */
  fieldLum: number;
  /** Mean colour of the field: light catching a wall is this metal, brightened. */
  fieldColor: string;
}

/**
 * Colour matrix that turns the photo into the recess colour while keeping its
 * texture: each pixel's luminance, divided by the field's mean, scales the
 * tint — an average pixel becomes exactly `tint`, scratches and pits stay
 * lighter or darker in proportion.
 */
/** Light glancing off a cut wall: the field's own colour lifted toward white. */
function glintRgb(fieldColor: string): string {
  const n = parseInt(fieldColor.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((v) => Math.min(1, (v / 255) * 1.4 + 0.25).toFixed(3))
    .join(" ");
}

function tintMatrix(tint: string, fieldLum: number): string {
  const n = parseInt(tint.slice(1), 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255 / fieldLum);
  const row = (c: number) =>
    `${(0.299 * c).toFixed(4)} ${(0.587 * c).toFixed(4)} ${(0.114 * c).toFixed(4)} 0 0`;
  return `${row(rgb[0])}  ${row(rgb[1])}  ${row(rgb[2])}  0 0 0 1 0`;
}

/**
 * An engraving made out of the medallion's own material rather than drawn on
 * top of it. Everything happens in one SVG filter over the cut's alpha:
 *
 * - chisel: the outline is roughened with fractal noise, so it reads as cut by
 *   hand rather than plotted;
 * - floor: the medallion photo itself, recoloured to that medallion's own
 *   recess colour (measured from its border decoration) — gold cuts go dark
 *   bronze-brown, silver oxidised charcoal, bronze olive patina — with the
 *   photo's scratches and pits carried through as texture;
 * - walls: a recessed height field (the blurred cut) lit with
 *   feDiffuseLighting from the photo's light direction. Shading darker than a
 *   flat surface becomes shadow, brighter becomes highlight.
 *
 * All shading is clipped to the cut. Letting it spill outside put the lit wall
 * *beside* the groove, where the eye reads it as a raised rim — the first
 * version looked embossed rather than engraved for exactly that reason.
 *
 * Coordinates are the medallion SVG's 100-unit box.
 */
export default function EngravedCut({
  children,
  photo,
  light,
  tint,
  fieldLum,
  fieldColor,
}: EngravedCutProps) {
  const [gr, gg, gb] = glintRgb(fieldColor).split(" ");
  const id = useId();
  // Azimuth of the light in SVG's convention (0° = from +x, clockwise with y down).
  const azimuth = (Math.atan2(light.y, light.x) * 180) / Math.PI;

  return (
    <>
      <defs>
        <filter
          id={`${id}-engrave`}
          filterUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100"
          height="100"
          colorInterpolationFilters="sRGB"
        >
          {/* Chisel: roughen the outline. */}
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="11" result="grain" />
          <feDisplacementMap
            in="SourceAlpha"
            in2="grain"
            scale="0.35"
            xChannelSelector="R"
            yChannelSelector="G"
            result="cut"
          />

          {/* Floor: the medallion's own metal in its own recess colour. */}
          <feImage href={photo} x="0" y="0" width="100" height="100" preserveAspectRatio="none" result="photo" />
          <feColorMatrix in="photo" type="matrix" values={tintMatrix(tint, fieldLum)} result="deep" />
          <feComposite in="deep" in2="cut" operator="in" result="floor" />

          {/* Walls: light a recessed height field from the photo's light. */}
          <feGaussianBlur in="cut" stdDeviation="0.3" result="height" />
          <feDiffuseLighting in="height" surfaceScale="-2.6" diffuseConstant="1" lightingColor="#fff" result="lit">
            <feDistantLight azimuth={azimuth} elevation="38" />
          </feDiffuseLighting>
          {/* Flat surface lights to sin(38°) ≈ 0.62: darker → shadow, brighter → highlight. */}
          <feColorMatrix
            in="lit"
            type="matrix"
            values="0 0 0 0 0.03  0 0 0 0 0.02  0 0 0 0 0.01  -2.4 0 0 0 1.49"
            result="shadowAll"
          />
          <feComposite in="shadowAll" in2="cut" operator="in" result="shadow" />
          <feColorMatrix
            in="lit"
            type="matrix"
            values={`0 0 0 0 ${gr}  0 0 0 0 ${gg}  0 0 0 0 ${gb}  1.8 0 0 0 -1.12`}
            result="highlightAll"
          />
          <feComposite in="highlightAll" in2="cut" operator="in" result="highlight" />

          <feMerge>
            <feMergeNode in="floor" />
            <feMergeNode in="shadow" />
            <feMergeNode in="highlight" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id}-engrave)`}>{children}</g>
    </>
  );
}
