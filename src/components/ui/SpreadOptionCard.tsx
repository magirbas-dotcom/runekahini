import { REALMS } from "../../theme/realms";
import CarvedRune from "./CarvedRune";

export type SpreadDiagram = "single" | "three" | "four" | "five";

/* Each spread shown as real miniature stones laid out the way the draw will
 * be: a row for one/three, a diamond for four, a cross for five. Positions are
 * in a 76×64 box, spaced so the stones never touch; `lit` marks where the
 * reading starts. Each stone carries a gilded rune — bare dark stones on a
 * dark ground read as blots. */
const LAYOUTS: Record<SpreadDiagram, { x: number; y: number; rune: string; lit?: boolean }[]> = {
  single: [{ x: 38, y: 32, rune: "Ansuz", lit: true }],
  three: [
    { x: 14, y: 32, rune: "Fehu" },
    { x: 38, y: 32, rune: "Raidho", lit: true },
    { x: 62, y: 32, rune: "Kenaz" },
  ],
  four: [
    { x: 38, y: 10, rune: "Gebo" },
    { x: 16, y: 32, rune: "Wunjo", lit: true },
    { x: 60, y: 32, rune: "Ehwaz" },
    { x: 38, y: 54, rune: "Mannaz" },
  ],
  five: [
    { x: 38, y: 10, rune: "Sowilo" },
    { x: 14, y: 32, rune: "Uruz" },
    { x: 38, y: 32, rune: "Dagaz", lit: true },
    { x: 62, y: 32, rune: "Jera" },
    { x: 38, y: 54, rune: "Othala" },
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
  const size = diagram === "single" ? 34 : 22;
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
      <span className="relative block h-16 w-[76px]" aria-hidden="true">
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
