import type { ReactNode } from "react";

interface RuneChipProps {
  children: ReactNode;
  className?: string;
}

/** Keyword pill used under a rune's name. */
export default function RuneChip({ children, className = "" }: RuneChipProps) {
  return (
    <span
      className={`inline-block rounded-full border border-hairline bg-surface-gold/50 px-3 py-1 text-xs text-gold-light ${className}`}
    >
      {children}
    </span>
  );
}
