import { REALMS } from "../../theme/realms";
import CarvedRune from "./CarvedRune";

export type SpreadDiagram = "single" | "three" | "four" | "five";

/* Each spread shown as real miniature stones laid out the way the draw will
 * be: a row for one/three, a diamond for four, a cross for five. Positions are
 * in a 100×84 box, spaced so the stones never touch; `lit` marks where the
 * reading starts. Each stone carries a gilded rune — bare dark stones on a
 * dark ground read as blots. */
const LAYOUTS: Record<SpreadDiagram, { x: number; y: number; rune: string; lit?: boolean }[]> = {
  single: [{ x: 50, y: 42, rune: "Ansuz", lit: true }],
  three: [
    { x: 17, y: 42, rune: "Fehu" },
    { x: 50, y: 42, rune: "Raidho", lit: true },
    { x: 83, y: 42, rune: "Kenaz" },
  ],
  four: [
    { x: 50, y: 12, rune: "Gebo" },
    { x: 22, y: 42, rune: "Wunjo", lit: true },
    { x: 78, y: 42, rune: "Ehwaz" },
    { x: 50, y: 72, rune: "Mannaz" },
  ],
  five: [
    { x: 50, y: 12, rune: "Sowilo" },
    { x: 17, y: 42, rune: "Uruz" },
    { x: 50, y: 42, rune: "Dagaz", lit: true },
    { x: 83, y: 42, rune: "Jera" },
    { x: 50, y: 72, rune: "Othala" },
  ],
};

interface SpreadOptionCardProps {
  label: string;
  diagram: SpreadDiagram;
  selected: boolean;
  onClick: () => void;
}

/**
 * A spread choice as a candle-lit recess in the altar stone, holding the
 * spread's own stones in miniature. Choosing it lights the whole recess: the
 * frame gilds, warm light breathes inside, every stone glows, a band of light
 * sweeps across and the label lights up in gold (.altar-option).
 */
export default function SpreadOptionCard({ label, diagram, selected, onClick }: SpreadOptionCardProps) {
  const stones = LAYOUTS[diagram];
  const size = diagram === "single" ? 50 : diagram === "three" ? 30 : 28;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`altar-option flex flex-col items-center justify-center gap-2.5 overflow-hidden px-3.5 pb-3 pt-3.5 text-center active:scale-[0.98] ${
        selected ? "is-selected" : ""
      }`}
    >
      {selected && <span key={diagram} className="altar-sweep" aria-hidden="true" />}
      <span className="relative block h-[84px] w-[100px]" aria-hidden="true">
        {stones.map((st) => (
          <span
            key={st.rune}
            className="altar-stone absolute"
            style={{
              width: size,
              height: size,
              left: st.x - size / 2,
              top: st.y - size / 2,
            }}
          >
            <CarvedRune
              stone={REALMS.fire.stone}
              runes={[st.rune]}
              size={size}
              weight={3.2}
              lite
              className={st.lit ? "altar-stone-lead" : undefined}
            />
          </span>
        ))}
      </span>
      <span className="altar-label text-[13px] leading-tight">{label}</span>
    </button>
  );
}
