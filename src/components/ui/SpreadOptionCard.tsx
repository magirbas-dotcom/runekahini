import type { ReactNode } from "react";

export type SpreadDiagram = "single" | "three" | "four" | "five";

/* Tiny stone tiles laid out in the shape the spread actually takes on screen,
 * so the layout is visible before committing to a draw. The arrangements match
 * the real ones in OraclePage: a row for one/three, a diamond for four, a
 * cross for five. The lit tile marks where the reading starts. */
function Tile({
  x,
  y,
  w = 9,
  h = 12,
  lit,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  lit?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={2}
      fill={lit ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
      opacity={lit ? 0.95 : 0.7}
    />
  );
}

const DIAGRAMS: Record<SpreadDiagram, ReactNode> = {
  single: <Tile x={22} y={12} w={12} h={16} lit />,
  three: (
    <>
      <Tile x={6.5} y={14} />
      <Tile x={23.5} y={14} lit />
      <Tile x={40.5} y={14} />
    </>
  ),
  four: (
    <>
      <Tile x={23.5} y={2} />
      <Tile x={8.5} y={14} lit />
      <Tile x={38.5} y={14} />
      <Tile x={23.5} y={26} />
    </>
  ),
  five: (
    <>
      <Tile x={23.5} y={2} />
      <Tile x={6.5} y={14} />
      <Tile x={23.5} y={14} lit />
      <Tile x={40.5} y={14} />
      <Tile x={23.5} y={26} />
    </>
  ),
};

interface SpreadOptionCardProps {
  label: string;
  diagram: SpreadDiagram;
  selected: boolean;
  onClick: () => void;
}

export default function SpreadOptionCard({
  label,
  diagram,
  selected,
  onClick,
}: SpreadOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center justify-center gap-2.5 rounded-lg border px-3 py-3.5 text-center transition duration-200 active:scale-[0.98] ${
        selected
          ? "border-hairline-strong bg-surface-gold/70 text-gold-light"
          : "border-hairline bg-surface/60 text-parchment-dim hover:border-hairline-strong hover:text-parchment"
      }`}
    >
      <svg
        width="56"
        height="40"
        viewBox="0 0 56 40"
        fill="none"
        aria-hidden="true"
      >
        {DIAGRAMS[diagram]}
      </svg>
      <span className="text-xs leading-tight">{label}</span>
    </button>
  );
}
