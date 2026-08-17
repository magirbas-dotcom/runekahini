import type { ReactNode } from "react";

interface SectionHeaderProps {
  children: ReactNode;
  /** Centred headings get the flanking rules; left-aligned ones are a bare label. */
  align?: "center" | "left";
  className?: string;
}

/**
 * The small gold all-caps section label — replaces the
 * `text-xs uppercase tracking-[0.2em] text-amber-300/90` string that appeared
 * in seven places. Centred variant adds the engraved rules either side.
 */
export default function SectionHeader({
  children,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const label = (
    <span className="text-xs uppercase tracking-[0.18em] text-gold">
      {children}
    </span>
  );

  if (align === "left") {
    return <div className={`mb-3 ${className}`}>{label}</div>;
  }

  return (
    <div className={`mb-4 flex items-center justify-center gap-3 ${className}`}>
      <span
        className="h-px max-w-16 flex-1 bg-gradient-to-r from-transparent to-hairline-strong"
        aria-hidden="true"
      />
      {label}
      <span
        className="h-px max-w-16 flex-1 bg-gradient-to-l from-transparent to-hairline-strong"
        aria-hidden="true"
      />
    </div>
  );
}
