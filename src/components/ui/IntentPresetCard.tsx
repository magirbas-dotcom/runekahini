import RuneGlyph from "./RuneGlyph";

interface IntentPresetCardProps {
  /** The intent itself, e.g. "Koruma" — shown as the heading. */
  category: string;
  /** The talisman's given name, e.g. "Kuzey Muhafızı". */
  name: string;
  /** Three keywords derived from the preset's runes, pre-joined. */
  keywords: string;
  /** Leading rune of the combination, drawn as the card's mark. */
  markRune: string;
  selected: boolean;
  onClick: () => void;
}

export default function IntentPresetCard({
  category,
  name,
  keywords,
  markRune,
  selected,
  onClick,
}: IntentPresetCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex h-full flex-col items-start gap-2 rounded-card border p-3.5 text-left transition duration-200 active:scale-[0.98] ${
        selected
          ? "border-hairline-strong bg-surface-gold/70"
          : "border-hairline bg-surface/60 hover:border-hairline-strong"
      }`}
    >
      {/* Selection is marked by a shape as well as colour. */}
      {selected && (
        <span
          className="absolute right-3 top-3 h-1.5 w-1.5 rotate-45 bg-gold"
          aria-hidden="true"
        />
      )}

      <span className={selected ? "text-gold-light" : "text-parchment-dim"}>
        <RuneGlyph name={markRune} size={24} glow={false} />
      </span>

      <span
        className={`text-[13px] font-medium uppercase tracking-[0.12em] ${
          selected ? "text-gold-light" : "text-parchment"
        }`}
      >
        {category}
      </span>

      <span className="font-serif text-[15px] leading-tight text-parchment">
        {name}
      </span>

      <span className="text-[11px] leading-4 text-parchment-dim">{keywords}</span>
    </button>
  );
}
