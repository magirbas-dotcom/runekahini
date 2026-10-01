import { RUNE_GLYPHS, glyphTransform } from "../../data/runeGlyphs";
import { runes } from "../../data/runes";

interface RuneRingProps {
  size: number;
  /** Staggered fade-in of each rune, for the intro. */
  reveal?: boolean;
  className?: string;
}

/**
 * The full Elder Futhark, Fehu to Othala, set around a circle like the rune
 * band on a bracteate, each glyph standing on the ring with its foot toward
 * the centre. Two hairline rings frame it. Rotation is applied by the caller
 * (CSS), so this stays a static, cheap SVG.
 */
export default function RuneRing({ size, reveal = false, className = "" }: RuneRingProps) {
  const R = 41;
  const glyphBox = 9.5;
  const s = glyphBox / 100;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rune-ring-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6420" />
          <stop offset="0.45" stopColor="#f3dd94" />
          <stop offset="1" stopColor="#a77a24" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r={R + 6.2} fill="none" stroke="url(#rune-ring-gold)" strokeWidth="0.35" opacity="0.7" />
      <circle cx="50" cy="50" r={R - 6.2} fill="none" stroke="url(#rune-ring-gold)" strokeWidth="0.35" opacity="0.7" />
      {runes.map((rune, i) => {
        const glyph = RUNE_GLYPHS[rune.name];
        if (!glyph) return null;
        const deg = (i / runes.length) * 360;
        return (
          <g
            key={rune.name}
            transform={`rotate(${deg} 50 50) translate(${50 - glyphBox / 2} ${50 - R - glyphBox / 2}) scale(${s})`}
            className={reveal ? "ring-rune-reveal" : undefined}
            style={reveal ? { animationDelay: `${i * 45}ms` } : undefined}
          >
            <g transform={glyphTransform(glyph)}>
              <path d={glyph.d} fill="url(#rune-ring-gold)" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
