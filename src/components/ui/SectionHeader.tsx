import type { ReactNode } from "react";
import OrnateHeader from "./OrnateHeader";

interface SectionHeaderProps {
  children: ReactNode;
  /** Centred: an ornate gilded title between cards. Left: a quiet gilded label inside a card. */
  align?: "center" | "left";
  className?: string;
}

/**
 * Section titles in the relic language. Centred ones are OrnateHeader at the
 * smaller size (gilded lettering between diamond-tipped rules); left-aligned
 * ones, used as labels inside cards, are spaced gold capitals with a diamond.
 */
export default function SectionHeader({
  children,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  if (align === "left") {
    return (
      <div className={`mb-3 flex items-center gap-2 ${className}`}>
        <span className="block h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.18em] text-gold">{children}</span>
      </div>
    );
  }
  return (
    <OrnateHeader size="md" className={className}>
      {children}
    </OrnateHeader>
  );
}
