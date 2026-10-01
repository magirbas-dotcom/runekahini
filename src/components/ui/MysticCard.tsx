import type { ReactNode } from "react";
import RelicCorners from "./RelicCorners";

type Tone = "default" | "raised" | "gold";

const TONES: Record<Tone, string> = {
  /* Standard content card: carved slate (.relic-card in index.css). */
  default: "",
  /* A card on top of another card — same slate, a touch lighter edge. */
  raised: "",
  /* One focal card per screen (e.g. Bütünsel Değerlendirme): gilt-tinted. */
  gold: "is-gold",
};

interface MysticCardProps {
  children: ReactNode;
  tone?: Tone;
  /** Adds the film-grain overlay. Off for small/dense cards where it muddies text. */
  grain?: boolean;
  /** Carved-slate panel with gilt corner fittings — for a screen's one main panel. */
  ornate?: boolean;
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
  ornate = false,
  className = "",
}: MysticCardProps) {
  if (ornate) {
    return (
      <div className={`relic-panel ${grain ? "grain" : ""} ${className}`}>
        <RelicCorners />
        {children}
      </div>
    );
  }
  return (
    <div
      className={`relic-card overflow-hidden ${TONES[tone]} ${grain ? "grain" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
