import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "quiet";

const VARIANTS: Record<Variant, string> = {
  /* The single strongest call to action on a screen. */
  primary:
    "border-transparent bg-gradient-to-b from-gold-light to-gold text-ink font-medium shadow-[0_4px_16px_rgba(199,163,74,0.25)] hover:from-gold-light hover:to-gold-light disabled:cursor-wait disabled:opacity-80",
  /* Secondary action — engraved outline, no fill. */
  ghost:
    "border-hairline-strong bg-transparent text-gold-light hover:border-gold hover:bg-surface-gold/40",
  /* Tertiary — reads as a link until hovered. */
  quiet:
    "border-transparent bg-transparent text-parchment-dim hover:text-parchment",
};

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

/**
 * Replaces the three copies of the filled gold CTA and the four copies of the
 * outlined secondary button. `active:scale-[0.98]` gives every button the same
 * press response.
 */
export default function GoldButton({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: GoldButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
