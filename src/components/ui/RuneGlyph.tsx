import { useId } from "react";
import { RUNE_STROKES } from "../../data/runeStrokes";

interface RuneGlyphProps {
  /** Rune name as keyed in RUNE_STROKES, e.g. "Hagalaz". */
  name: string;
  size?: number;
  /** Draws the glyph upside down, for a reversed draw. */
  reversed?: boolean;
  strokeWidth?: number;
  glow?: boolean;
  className?: string;
}

/**
 * Renders a rune as real SVG strokes from RUNE_STROKES rather than as the
 * Unicode character. The Unicode glyphs depend on whatever runic font the
 * device happens to have and can't carry a glow or a stroke weight; these
 * paths are ours, so the same glyph scales cleanly from a 20px list icon to
 * a full-size stone face and can actually be lit.
 *
 * Colour comes from `currentColor`, so callers set it with text-gold /
 * text-gold-light like any other text.
 */
export default function RuneGlyph({
  name,
  size = 48,
  reversed = false,
  strokeWidth = 6,
  glow = true,
  className = "",
}: RuneGlyphProps) {
  const filterId = useId();
  const path = RUNE_STROKES[name];
  if (!path) return null;

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
          {/* userSpaceOnUse, not the default objectBoundingBox: Isa is a
              single vertical line whose bounding box is zero pixels wide, so a
              bbox-relative filter region collapsed to nothing and the glyph
              rendered blank. The region is stated in viewBox units instead. */}
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
        <path
          d={path}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
