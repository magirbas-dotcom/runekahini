import { useId } from "react";
import { RUNE_GLYPHS, glyphTransform } from "../../data/runeGlyphs";

interface RuneGlyphProps {
  /** Rune name as keyed in RUNE_GLYPHS, e.g. "Hagalaz". */
  name: string;
  size?: number;
  /** Draws the glyph upside down, for a reversed draw. */
  reversed?: boolean;
  glow?: boolean;
  className?: string;
}

/**
 * Renders a rune from the traced reference outlines rather than the Unicode
 * character, so the same glyph scales from a 26px picker tile to a full-size
 * stone face without depending on the device having a runic font, and can be
 * lit and recoloured.
 *
 * The outlines are filled, not stroked: they carry their own hand-drawn weight,
 * including the tapered ends a uniform stroke width cannot express. Colour comes
 * from `currentColor`, so callers set it with text-gold / text-gold-light like
 * any other text.
 */
export default function RuneGlyph({
  name,
  size = 48,
  reversed = false,
  glow = true,
  className = "",
}: RuneGlyphProps) {
  const filterId = useId();
  const glyph = RUNE_GLYPHS[name];
  if (!glyph) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {glow && (
        <defs>
          {/* userSpaceOnUse, not the default objectBoundingBox: a bbox-relative
              region collapses on glyphs whose outline is a straight bar, which
              used to leave Isa unpainted. */}
          <filter
            id={filterId}
            filterUnits="userSpaceOnUse"
            x="-20"
            y="-20"
            width="140"
            height="140"
          >
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <g
        transform={reversed ? "rotate(180 50 50)" : undefined}
        filter={glow ? `url(#${filterId})` : undefined}
      >
        <g transform={glyphTransform(glyph)}>
          <path d={glyph.d} fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}
