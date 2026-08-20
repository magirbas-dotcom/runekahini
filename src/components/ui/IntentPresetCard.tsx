import RuneGlyph from "./RuneGlyph";

interface IntentPresetCardProps {
  /** The intent itself, e.g. "Koruma" — the small label above the name. */
  category: string;
  /** The talisman's given name, e.g. "Kuzey Muhafızı" — the card's headline. */
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
      className={`relative flex h-full flex-col items-center gap-1.5 rounded-card border p-3.5 text-center transition duration-200 active:scale-[0.98] ${
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

      <span
        className={`mb-0.5 ${selected ? "text-gold-light" : "text-parchment-dim"}`}
      >
        <RuneGlyph name={markRune} size={22} glow={false} />
      </span>

      {/* Category is a quiet eyebrow: small, spaced, dim. The name is the
          headline: larger, serif, bright. Separating them by size *and*
          colour keeps them apart even on an unselected card. */}
      <span
        className="min-h-3 text-[10px] uppercase leading-3 tracking-[0.18em] text-gold"
      >
        {category}
      </span>

      <span
        className={`min-h-[2.3em] font-serif text-[17px] leading-[1.15] ${
          selected ? "text-gold-light" : "text-parchment"
        }`}
      >
        {name}
      </span>

      <span className="min-h-8 text-[11px] leading-4 text-parchment-dim">
        {keywords}
      </span>
    </button>
  );
}
