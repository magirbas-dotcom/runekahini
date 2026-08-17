interface MysticDividerProps {
  className?: string;
}

/** Hairline rule with a centred diamond — separates blocks inside a card. */
export default function MysticDivider({ className = "" }: MysticDividerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-hairline" />
      <span className="h-1.5 w-1.5 rotate-45 border border-hairline-strong" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-hairline" />
    </div>
  );
}
