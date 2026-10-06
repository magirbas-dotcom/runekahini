/**
 * The Rune Guide's deeper content (2026-10-06): the history of the runes, the spreads, and more on every rune.
 * Written in our own words from the user's NotebookLM research (notebooklm-rune-kahini/Rune Rehberi.docx), with
 * what is attested (inscriptions, rune poems, archaeology) kept apart from modern interpretation, which is
 * labelled as such. Every text exists in both languages.
 */

export interface GuideSection {
  title: string;
  paragraphs: string[];
  /** A modern practice, not history: shown with the "modern interpretation" tag. */
  modern?: boolean;
}

export interface SpreadLore {
  key: "single" | "three" | "four" | "five" | "scatter";
  title: string;
  /** Where it comes from. */
  origin: string;
  /** How the stones are laid. */
  layout: string;
  /** What each place means, in order. */
  positions: string[];
  /** The questions it suits. */
  questions: string;
  /** How the places are read together. */
  reading: string;
}

export interface RuneLore {
  /** Reconstructed Proto-Germanic name, with its asterisk. */
  proto: string;
  /** What the rune poems say, summarised (never quoted). */
  poem: string;
  /** Myth and history, worded by how firm it is. */
  myth: string;
  /** The rune in the inner life (not health). */
  inner: string;
  /** Its shadow side. */
  shadow: string;
  /** Runes it works with and against (modern interpretation). */
  harmony: string;
  /** A question to carry through the day. */
  question: string;
  /** Its use in bind runes and talismans (modern interpretation). */
  talisman: string;
}

export interface GuideLore {
  history: GuideSection[];
  spreadsIntro: string;
  spreads: SpreadLore[];
  runes: Record<string, RuneLore>;
}
