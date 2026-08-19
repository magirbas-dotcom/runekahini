import { RUNE_STROKES } from "../../data/runeStrokes";

export interface BindruneLayer {
  name: string;
  offsetY: number;
}

interface BindruneCanvasProps {
  layers: BindruneLayer[];
  /** viewBox edge length; the caller owns this so export math stays in sync. */
  size: number;
  centerXFrac: number;
  centerYFrac: number;
  glyphScale: number;
  opacitySteps: number[];
}

/**
 * On-screen talisman preview: the ornate ring artwork with the bindrune
 * layered into it. The frame is the same artwork family the PNG export
 * composites onto (square here, 9:16 there) and the glyph geometry — centre,
 * scale, per-layer Y offset, stroke weights, opacity ramp — is identical to
 * what BindruneDesigner hands the exporter, so the preview is a true preview.
 */
export default function BindruneCanvas({
  layers,
  size,
  centerXFrac,
  centerYFrac,
  glyphScale,
  opacitySteps,
}: BindruneCanvasProps) {
  // Keyed on which runes are present, deliberately not on their offsets: with
  // offsets in the key every slider tick remounted the group and replayed the
  // settle animation, so dragging one layer made the whole bindrune pulse as
  // though every glyph were moving.
  const signature = layers.map((l) => l.name).join("|");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto block h-auto w-full max-w-[400px] rounded-card border border-hairline bg-ink"
      role="img"
      aria-label={
        layers.length
          ? `Tılsım önizlemesi: ${layers.map((l) => l.name).join(", ")}`
          : "Tılsım önizlemesi — henüz Rune seçilmedi"
      }
    >
      <defs>
        {/* A native SVG blur rather than a CSS filter — the same glow then
            survives rasterisation into the exported PNG. */}
        {/* userSpaceOnUse for the same reason as RuneGlyph: a bbox-relative
            region is degenerate for zero-width glyphs such as Isa. */}
        <filter
          id="rune-glow"
          filterUnits="userSpaceOnUse"
          x={-size}
          y={-size}
          width={size * 3}
          height={size * 3}
        >
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <image href="/bindrune-frame-square.png" x={0} y={0} width={size} height={size} />

      {layers.length === 0 ? (
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          fill="#a8a29e"
          fontSize="14"
        >
          Rune seçin
        </text>
      ) : (
        <g key={signature} className="bindrune-settle">
          {layers.map((layer, i) => {
            const cx = size * centerXFrac;
            const cy = size * centerYFrac + layer.offsetY;
            const tx = cx - 50 * glyphScale;
            const ty = cy - 50 * glyphScale;
            return (
              <g
                key={layer.name}
                transform={`translate(${tx}, ${ty}) scale(${glyphScale})`}
                opacity={opacitySteps[i] ?? 0.5}
                filter="url(#rune-glow)"
              >
                <path
                  d={RUNE_STROKES[layer.name]}
                  stroke="#fbbf24"
                  strokeWidth={i === 0 ? 4.5 : 3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
