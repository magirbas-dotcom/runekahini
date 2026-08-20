interface TalismanFormCardProps {
  /** Which diagram to draw. */
  kind: "bindrune" | "medallion";
  label: string;
  /** One short line explaining what the form does. */
  hint: string;
  selected: boolean;
  onClick: () => void;
}

/** A 40×40 sketch of the composition, so the difference between the two forms
 *  is visible before the user switches. Deliberately schematic — not a real
 *  rune — so it reads as a diagram rather than a glyph to choose. */
function FormDiagram({ kind }: { kind: TalismanFormCardProps["kind"] }) {
  const stroke = "currentColor";
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {kind === "bindrune" ? (
        <g stroke={stroke} strokeWidth="1.6" strokeLinecap="round">
          {/* one shared stave, arms branching off it at three heights */}
          <path d="M20 5 V35" />
          <path d="M20 12 L29 7" />
          <path d="M20 20 L11 15" />
          <path d="M20 20 L29 25" />
          <path d="M20 28 L11 33" />
        </g>
      ) : (
        <g stroke={stroke} strokeWidth="1.4" fill="none">
          <circle cx="20" cy="20" r="16" />
          {/* three packed circles, mirroring sealLayout's n = 3 case */}
          <circle cx="20" cy="12.6" r="6.4" />
          <circle cx="13.6" cy="23.7" r="6.4" />
          <circle cx="26.4" cy="23.7" r="6.4" />
        </g>
      )}
    </svg>
  );
}

export default function TalismanFormCard({
  kind,
  label,
  hint,
  selected,
  onClick,
}: TalismanFormCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-2 rounded-card border p-3.5 text-center transition duration-200 active:scale-[0.98] ${
        selected
          ? "border-hairline-strong bg-surface-gold/70"
          : "border-hairline bg-surface/60 hover:border-hairline-strong"
      }`}
    >
      <span className={selected ? "text-gold-light" : "text-parchment-dim"}>
        <FormDiagram kind={kind} />
      </span>
      <span
        className={`font-serif text-[16px] leading-tight ${
          selected ? "text-gold-light" : "text-parchment"
        }`}
      >
        {label}
      </span>
      <span className="text-[11px] leading-4 text-parchment-dim">{hint}</span>
    </button>
  );
}
