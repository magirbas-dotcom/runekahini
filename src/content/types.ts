import type { ElementKey } from "./runes";
/** The app's talisman preset groups (askrune-app src/data/runeStrokes.ts); the site does not use them. */
type PresetGroupId = string;

/**
 * Everything a reader sees about the runes, in one language. The structural
 * data (names, glyphs, order, dates) is language-neutral and lives in
 * `src/data/`; this is only the words.
 */
export interface RuneReadingText {
  keywords: string[];
  general: string;
  love: string;
  career: string;
}

export interface RuneText {
  literalMeaning: string;
  /** A concrete everyday-use tip: when this rune's energy is worth reaching for. */
  practicalNote: string;
  /**
   * One sentence, to the reader, on this rune as their Life Path rune (birth map share card,
   * 2026-10-04). Written for a lasting birth map rather than a day's reading, so it describes
   * a strength or a way of moving through life, never an event. Not in the web app.
   */
  lifePath: string;
  /** One sentence on what this rune brings to a relationship (Rune Uyumu, 2026-10-04). Not in the web app. */
  bond: string;
  upright: RuneReadingText;
  /** Present only for reversible runes. */
  reversed?: RuneReadingText;
}

export interface ZodiacText {
  name: string;
  /** What the sign's rune pair says when it comes up in a reading. */
  reading: string;
  /** How the two runes combine — also the talisman synergy text. */
  bindrune: string;
}

export interface PresetText {
  name: string;
  category: string;
  synergy: string;
}

/** Rune Uyumu texts: the pair's elements, their aettir and the overall tier (data/compatibility.ts). */
export interface CompatText {
  /** Keyed by the two elements in sorted order, e.g. "air-fire" (10 pairings). */
  elements: Record<string, string>;
  sameAett: string;
  diffAett: string;
  tiers: { high: string; mid: string; low: string };
}

export interface ContentData {
  aettNames: Record<"1" | "2" | "3", string>;
  elements: Record<ElementKey, string>;
  runes: Record<string, RuneText>;
  zodiac: Record<string, ZodiacText>;
  presets: Record<string, PresetText>;
  presetGroups: Record<PresetGroupId, string>;
  compat: CompatText;
}
