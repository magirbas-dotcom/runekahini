import type { ReactNode } from "react";

type Tone = "default" | "raised" | "gold";

const TONES: Record<Tone, string> = {
  /* Standard content card. */
  default: "border-hairline bg-surface/85",
  /* Slightly lighter — for a card that sits on top of another card. */
  raised: "border-hairline bg-surface-raised/90",
  /* Warm + stronger edge, reserved for one focal card per screen
   * (e.g. Bütünsel Değerlendirme) so gold stays scarce. */
  gold: "border-hairline-strong bg-surface-gold/70",
};

interface MysticCardProps {
  children: ReactNode;
  tone?: Tone;
  /** Adds the film-grain overlay. Off for small/dense cards where it muddies text. */
  grain?: boolean;
  className?: string;
}

/**
 * The one card shell for the app. Replaces the
 * `rounded-2xl border border-amber-200/1x bg-stone-900/xx shadow-xl backdrop-blur-sm`
 * recipe that had been copy-pasted into six different components.
 */
export default function MysticCard({
  children,
  tone = "default",
  grain = false,
  className = "",
}: MysticCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-card border shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-sm ${
        TONES[tone]
      } ${grain ? "grain" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
