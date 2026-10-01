import { runes } from "../../data/runes";
import CarvedRune from "./CarvedRune";
import { REALMS } from "../../theme/realms";

interface RunePickerProps {
  /** Names of currently chosen runes, in selection order. */
  selected: string[];
  onToggle: (name: string) => void;
  /** Upper bound enforced by the caller's existing layer logic. */
  max: number;
}

/**
 * The 24 Elder Futhark runes as a pickable grid of small carved stones. The
 * stones use CarvedRune's lite mode (no filter) — 24 simultaneous SVG filters
 * is a real scroll cost on mobile.
 */
export default function RunePicker({ selected, onToggle, max }: RunePickerProps) {
  const atLimit = selected.length >= max;

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {runes.map((r) => {
        const active = selected.includes(r.name);
        const disabled = !active && atLimit;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onToggle(r.name)}
            disabled={disabled}
            aria-pressed={active}
            className={`altar-option relative flex min-h-[84px] flex-col items-center justify-center gap-1 p-1.5 active:scale-[0.98] ${
              active ? "is-selected" : ""
            }`}
          >
            {active && (
              <span
                className="absolute right-1.5 top-1.5 h-1 w-1 rotate-45 bg-gold"
                aria-hidden="true"
              />
            )}
            <span className="altar-stone block">
              {/* Clean dark basalt, not the realm's mossy stone: at this size
                  the lichen and speckle tangled with the gilded rune. A larger
                  face makes the rune itself bigger on the stone. */}
              <CarvedRune stone={REALMS.fire.stone} runes={[r.name]} size={48} face={0.72} weight={3.4} lite />
            </span>
            <span className="altar-label text-[11px] leading-none">{r.name}</span>
          </button>
        );
      })}
    </div>
  );
}
