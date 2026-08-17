import RuneGlyph from "./RuneGlyph";

interface RuneEmblemProps {
  name: string;
  /** Glyph size in px. The ring scales around it. */
  size?: number;
  reversed?: boolean;
  /** Draws the surrounding ring + ambient glow. Off for dense lists. */
  ring?: boolean;
  className?: string;
}

/**
 * A rune glyph presented as an emblem: the mark itself, a faint ring, and a
 * low radial glow behind it. Used as the focal element of a birth-rune card.
 */
export default function RuneEmblem({
  name,
  size = 80,
  reversed = false,
  ring = true,
  className = "",
}: RuneEmblemProps) {
  const box = Math.round(size * 1.9);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${className}`}
      style={{ width: box, height: box }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(199,163,74,0.16),transparent_68%)]"
        aria-hidden="true"
      />
      {ring && (
        <>
          <div
            className="pointer-events-none absolute inset-0 rounded-full border border-hairline"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute rounded-full border border-hairline/60"
            style={{ inset: box * 0.11 }}
            aria-hidden="true"
          />
        </>
      )}
      <span className="relative text-gold-light">
        <RuneGlyph name={name} size={size} strokeWidth={6} reversed={reversed} />
      </span>
    </div>
  );
}
