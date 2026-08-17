import { runes } from "../../data/runes";
import RuneGlyph from "./RuneGlyph";

interface RunePickerProps {
  /** Names of currently chosen runes, in selection order. */
  selected: string[];
  onToggle: (name: string) => void;
  /** Upper bound enforced by the caller's existing layer logic. */
  max: number;
}

/**
 * The 24 Elder Futhark runes as a pickable grid. Glyphs are drawn without a
 * glow filter here — 24 simultaneous SVG filters is a real scroll cost on
 * mobile, and the glow belongs on the talisman itself, not the picker.
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
            className={`relative flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-lg border p-2 transition duration-150 active:scale-[0.98] ${
              active
                ? "border-hairline-strong bg-surface-gold/70 text-gold-light"
                : "border-hairline bg-surface/60 text-parchment-dim hover:border-hairline-strong hover:text-parchment disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-hairline"
            }`}
          >
            {active && (
              <span
                className="absolute right-1.5 top-1.5 h-1 w-1 rotate-45 bg-gold"
                aria-hidden="true"
              />
            )}
            <RuneGlyph name={r.name} size={26} strokeWidth={7} glow={false} />
            <span className="text-[10px] leading-none">{r.name}</span>
          </button>
        );
      })}
    </div>
  );
}
