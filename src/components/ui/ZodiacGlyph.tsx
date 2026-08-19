import { useId } from "react";
import { ZODIAC_STROKES } from "../../data/zodiac";

interface ZodiacGlyphProps {
  /** Sign id as keyed in ZODIAC_STROKES, e.g. "aries". */
  id: string;
  size?: number;
  strokeWidth?: number;
  glow?: boolean;
  className?: string;
}

/**
 * The zodiac counterpart of RuneGlyph — same 100x100 stroke box, same
 * currentColor contract, so signs and runes sit together without any visual
 * seam. Kept separate rather than folded into RuneGlyph because the two read
 * from different stroke tables and neither should silently fall back to the
 * other when a key is missing.
 */
export default function ZodiacGlyph({
  id,
  size = 48,
  strokeWidth = 5,
  glow = true,
  className = "",
}: ZodiacGlyphProps) {
  const filterId = useId();
  const path = ZODIAC_STROKES[id];
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
          {/* userSpaceOnUse for the same reason as RuneGlyph: a bbox-relative
              region collapses on glyphs whose path is a straight line. */}
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
      <g filter={glow ? `url(#${filterId})` : undefined}>
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
