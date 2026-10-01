/**
 * Gilt corner brackets for a relic panel: an L of two fine rules ending in a
 * small diamond, like the fittings on a reliquary box. One SVG, mirrored into
 * each corner.
 */
function Corner({ className, flip }: { className: string; flip: string }) {
  return (
    <svg viewBox="0 0 26 26" className={`relic-corner ${className}`} style={{ transform: flip }} aria-hidden="true">
      <path d="M2 24 V6 Q2 2 6 2 H24" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M6 22 V9 Q6 6 9 6 H22" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      <path d="M2 2 l2.6 2.6 -2.6 2.6 -2.6 -2.6 Z" transform="translate(4 4)" fill="currentColor" />
    </svg>
  );
}

export default function RelicCorners() {
  return (
    <>
      <Corner className="left-1.5 top-1.5" flip="none" />
      <Corner className="right-1.5 top-1.5" flip="scaleX(-1)" />
      <Corner className="bottom-1.5 left-1.5" flip="scaleY(-1)" />
      <Corner className="bottom-1.5 right-1.5" flip="scale(-1, -1)" />
    </>
  );
}
