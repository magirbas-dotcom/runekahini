import { RUNE_GLYPHS, glyphTransform, sealLayout } from "../../data/runeGlyphs";

/**
 * Two ways of composing the chosen runes.
 *
 * "bindrune" is the historical one: a ligature, its runes stacked over a single
 * shared stave so they touch and read as one mark. That overlap is what makes a
 * bind rune a bind rune rather than runes written in a row.
 *
 * "medallion" gives each rune its own circle, packed inside the ring. Legible
 * at a glance and needs no adjusting, but it is a modern seal, not a ligature.
 */
export type TalismanForm = "bindrune" | "medallion";

/** Layer opacity in bind-rune form, so overlapping runes stay tellable apart. */
const BIND_OPACITY = [1, 0.85, 0.72, 0.6];

interface BindruneCanvasProps {
  /** Chosen rune names, in selection order. */
  names: string[];
  form: TalismanForm;
  /** Vertical nudge per rune. Bind-rune form only. */
  offsets: Record<string, number>;
  /** viewBox edge length; the caller owns this so export math stays in sync. */
  size: number;
  centerXFrac: number;
  centerYFrac: number;
  /** Ring radius as a fraction of `size`. */
  radiusFrac: number;
  glyphScale: number;
}

export default function BindruneCanvas({
  names,
  form,
  offsets,
  size,
  centerXFrac,
  centerYFrac,
  radiusFrac,
  glyphScale,
}: BindruneCanvasProps) {
  // Keyed on the composition so the settle animation replays when it changes,
  // but not on every slider tick.
  const signature = `${form}:${names.join("|")}`;

  const cx = size * centerXFrac;
  const cy = size * centerYFrac;
  const ringRadius = size * radiusFrac;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto block h-auto w-full max-w-[400px] rounded-card border border-hairline bg-ink"
      role="img"
      aria-label={
        names.length
          ? `Tılsım önizlemesi: ${names.join(", ")}`
          : "Tılsım önizlemesi — henüz Rune seçilmedi"
      }
    >
      <defs>
        {/* A native SVG blur rather than a CSS filter — the same glow then
            survives rasterisation into the exported PNG.
            userSpaceOnUse for the same reason as RuneGlyph: a bbox-relative
            region is degenerate for zero-width glyphs such as Isa. */}
        <filter
          id="rune-glow"
          filterUnits="userSpaceOnUse"
          x={-size}
          y={-size}
          width={size * 3}
          height={size * 3}
        >
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <image href="/bindrune-frame-square.png" x={0} y={0} width={size} height={size} />

      {names.length === 0 ? (
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          fill="#b4aca2"
          fontSize="14"
        >
          Rune seçin
        </text>
      ) : (
        <g key={signature} className="bindrune-settle">
          {names.map((name, i) => {
            const glyph = RUNE_GLYPHS[name];
            if (!glyph) return null;

            if (form === "bindrune") {
              // Every rune at full size on one centre line; glyphTransform is
              // asked to align staves rather than bounding boxes, which is what
              // makes the runes actually bind instead of merely overlap.
              const y = cy + (offsets[name] ?? 0);
              return (
                <g
                  key={name}
                  transform={`translate(${cx - 50 * glyphScale}, ${y - 50 * glyphScale}) scale(${glyphScale})`}
                  opacity={BIND_OPACITY[i] ?? 0.6}
                  filter="url(#rune-glow)"
                >
                  <g transform={glyphTransform(glyph, undefined, true)}>
                    <path d={glyph.d} fill="#c7a34a" />
                  </g>
                </g>
              );
            }

            const slot = sealLayout(i, names.length, ringRadius, glyphScale);
            const x = cx + slot.dx;
            const y = cy + slot.dy;
            return (
              <g key={name}>
                <circle
                  cx={x}
                  cy={y}
                  r={slot.r}
                  fill="none"
                  stroke="#c7a34a"
                  strokeWidth={1.6}
                  opacity={0.55}
                />
                {/* Colour is --color-gold, the tone the ring artwork averages
                    (#be9742 measured), so the marks read as cut into the frame
                    rather than laid on top of it. */}
                <g
                  transform={`translate(${x - 50 * slot.scale}, ${y - 50 * slot.scale}) scale(${slot.scale})`}
                  filter="url(#rune-glow)"
                >
                  <g transform={glyphTransform(glyph)}>
                    <path d={glyph.d} fill="#c7a34a" />
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
