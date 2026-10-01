import type { ReactNode } from "react";

/**
 * A panel's section title as gilded lettering between two fine rules that end
 * in diamonds — the relic counterpart of SectionHeader, for the one or two
 * headings inside an ornate panel.
 */
export default function OrnateHeader({
  children,
  className = "",
  size = "lg",
}: {
  children: ReactNode;
  className?: string;
  /** lg: a panel's main sections. md: section titles between cards. */
  size?: "lg" | "md";
}) {
  const rule = (dir: "l" | "r") => (
    <span className={`flex flex-1 items-center ${dir === "l" ? "" : "flex-row-reverse"}`} aria-hidden="true">
      <span
        className={`h-px flex-1 ${
          dir === "l" ? "bg-gradient-to-r" : "bg-gradient-to-l"
        } from-transparent to-[color-mix(in_oklab,var(--color-gold)_70%,transparent)]`}
      />
      <span className="mx-1.5 block h-2 w-2 rotate-45 bg-gold" />
    </span>
  );
  return (
    <div className={`mb-4 flex items-center gap-1 ${className}`}>
      {rule("l")}
      <span
        className={`gilded-text whitespace-nowrap px-1.5 font-serif tracking-[0.1em] ${
          size === "lg" ? "text-[19px]" : "text-[16px]"
        }`}
      >
        {children}
      </span>
      {rule("r")}
    </div>
  );
}
