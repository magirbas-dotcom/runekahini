import { GLYPH_FIT_SCALE, RUNE_GLYPHS, glyphTransform } from "../../data/runeGlyphs";
import { DEFAULT_LIGHT, type Light } from "../../theme/light";
import GildedCut, { type CutPaint } from "./GildedCut";

interface CarvedRuneProps {
  /** Blank stone photo (transparent WebP, object fills its square). */
  stone: string;
  /** One rune, or several bound over a shared stave into a bind rune. */
  runes: string[];
  size: number;
  reversed?: boolean;
  /** Fraction of the image the carving spans. */
  face?: number;
  /** Cut widening in 100-box units — the traced outlines are hairline-thin. */
  weight?: number;
  /** Groove depth in 100-box units. */
  depth?: number;
  light?: Light;
  /** Leave the stone blank (face-down). */
  blank?: boolean;
  /** Thumbnail mode — see GildedCut. For lists and grids. */
  lite?: boolean;
  className?: string;
}

/**
 * A rune carved into a real stone photo and gilded — the web counterpart of
 * the mobile app's Skia `CarvedRunes`. The engraving itself is GildedCut.
 *
 * The reversed-rune rotation sits inside each shape, not around the cut, so
 * the light does not turn upside down with the rune.
 */
export default function CarvedRune({
  stone,
  runes,
  size,
  reversed = false,
  face = 0.62,
  weight = 2.4,
  depth = 1.6,
  light = DEFAULT_LIGHT,
  blank = false,
  lite = false,
  className = "",
}: CarvedRuneProps) {
  const bind = runes.length > 1;
  const offset = (100 * (1 - face)) / 2;
  // Stroke width is set in the path's own (reference) space, which the glyph
  // transform scales by GLYPH_FIT_SCALE; divide so the cut is `weight` wide in
  // the 100-box.
  const local = (w: number) => w / GLYPH_FIT_SCALE;
  const turn = reversed ? "rotate(180 50 50)" : undefined;

  const shapes = ({ color, extra }: CutPaint) => (
    <g transform={turn}>
      {runes.map((name) => {
        const glyph = RUNE_GLYPHS[name];
        if (!glyph) return null;
        return (
          <g key={name} transform={glyphTransform(glyph, GLYPH_FIT_SCALE, bind)}>
            <path
              d={glyph.d}
              fill={color}
              stroke={color}
              strokeWidth={local(weight + extra)}
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </g>
  );

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <image href={stone} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
      {!blank && (
        <g transform={`translate(${offset} ${offset}) scale(${face})`}>
          <GildedCut shapes={shapes} light={light} depth={depth} outline={0.7} lite={lite} />
        </g>
      )}
    </svg>
  );
}
