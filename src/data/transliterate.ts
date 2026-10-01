/**
 * Writing a name with Elder Futhark runes — a sound-based *transliteration*,
 * not a translation: runes are an alphabet, not a language.
 *
 * Built for Turkish, which is written as it is pronounced, so letter → sound
 * → rune holds up well. Letters with no Elder Futhark sound get the nearest
 * one, and the UI shows each such choice (`note`) so nothing is hidden:
 *
 *   c (/dʒ/, "can")  → Dagaz + Jera   ("dj")
 *   ç (/tʃ/, "çiçek") → Tiwaz + Sowilo ("ts")
 *   ş → Sowilo, ı → Isa, ö → Othala, ü → Uruz   (closest vowel / sibilant)
 *   ğ → not written: it lengthens the vowel before it rather than being a sound
 *   v, w → Wunjo; y → Jera (the rune's own sound is English "y")
 *   z → Algiz (its Proto-Germanic value is z)
 *
 * "ng" and "th" are deliberately *not* merged into Ingwaz / Thurisaz: in
 * Turkish they are two separate sounds ("Engin", "Hatice" has no "th").
 *
 * An earlier draft of this table (from a NotebookLM suggestion) mapped c and ç
 * to Kenaz and ğ to Gebo; both read Turkish wrong ("Can" is not "Kan").
 */

export interface RuneLetter {
  rune: string;
  /** The letter(s) of the input this rune stands for. */
  from: string;
}

/** One typed letter and the rune(s) that write it — two for c, ç and x. */
export interface WordLetter {
  from: string;
  runes: string[];
}

export interface RuneWord {
  text: string;
  /** Flat, one entry per rune. */
  runes: RuneLetter[];
  /** Grouped by letter, so a two-rune letter can be shown as one unit. */
  letters: WordLetter[];
}

export interface Transliteration {
  words: RuneWord[];
  /** Approximations used, one line each, for the letters actually typed. */
  notes: string[];
  /** Characters that have no rune at all (digits, punctuation) and were dropped. */
  skipped: string[];
}

const MAP: Record<string, string[]> = {
  a: ["Ansuz"],
  â: ["Ansuz"],
  b: ["Berkano"],
  c: ["Dagaz", "Jera"],
  ç: ["Tiwaz", "Sowilo"],
  d: ["Dagaz"],
  e: ["Ehwaz"],
  f: ["Fehu"],
  g: ["Gebo"],
  ğ: [],
  h: ["Hagalaz"],
  ı: ["Isa"],
  i: ["Isa"],
  î: ["Isa"],
  j: ["Jera"],
  k: ["Kenaz"],
  q: ["Kenaz"],
  l: ["Laguz"],
  m: ["Mannaz"],
  n: ["Nauthiz"],
  o: ["Othala"],
  ö: ["Othala"],
  p: ["Perthro"],
  r: ["Raidho"],
  s: ["Sowilo"],
  ş: ["Sowilo"],
  t: ["Tiwaz"],
  u: ["Uruz"],
  ü: ["Uruz"],
  û: ["Uruz"],
  v: ["Wunjo"],
  w: ["Wunjo"],
  x: ["Kenaz", "Sowilo"],
  y: ["Jera"],
  z: ["Algiz"],
};

const NOTES: Record<string, string> = {
  c: "C rune alfabesinde yok: sesine en yakın D + J (Dagaz + Jera) ile yazıldı.",
  ç: "Ç rune alfabesinde yok: sesine en yakın T + S (Tiwaz + Sowilo) ile yazıldı.",
  ş: "Ş için ayrı bir rune yok: S (Sowilo) ile yazıldı.",
  ğ: "Ğ ayrı bir ses değil, önündeki ünlüyü uzatır: yazılmadı.",
  ı: "I ve İ için tek rune var: Isa.",
  ö: "Ö için ayrı bir rune yok: O (Othala) ile yazıldı.",
  ü: "Ü için ayrı bir rune yok: U (Uruz) ile yazıldı.",
  v: "V, W sesini taşıyan Wunjo ile yazıldı.",
  y: "Y sesi Jera ile yazılır (Jera'nın sesi Türkçe Y'dir).",
  x: "X, K + S olarak yazıldı.",
};
// Notes that cover several letters are keyed on one of them.
const NOTE_KEY: Record<string, string> = { î: "ı", û: "ü", w: "v" };

export const MAX_NAME_LENGTH = 24;

export function transliterate(input: string): Transliteration {
  const text = input.toLocaleLowerCase("tr-TR").slice(0, MAX_NAME_LENGTH);
  const words: RuneWord[] = [];
  const noteKeys = new Set<string>();
  const skipped = new Set<string>();

  for (const raw of text.split(/\s+/).filter(Boolean)) {
    const runes: RuneLetter[] = [];
    const letters: WordLetter[] = [];
    let source = "";
    // Normalise so a decomposed "i̇" (i + combining dot, what a non-Turkish
    // lower-casing of "İ" produces) reads as plain i.
    for (const ch of raw.normalize("NFC").replace(/̇/g, "")) {
      const mapped = MAP[ch];
      if (!mapped) {
        skipped.add(ch);
        continue;
      }
      source += ch;
      const key = NOTE_KEY[ch] ?? ch;
      if (NOTES[key]) noteKeys.add(key);
      const from = ch.toLocaleUpperCase("tr-TR");
      if (mapped.length > 0) letters.push({ from, runes: mapped });
      for (const rune of mapped) runes.push({ rune, from });
    }
    if (runes.length > 0) words.push({ text: source.toLocaleUpperCase("tr-TR"), runes, letters });
  }

  return {
    words,
    notes: [...noteKeys].map((k) => NOTES[k]),
    skipped: [...skipped],
  };
}

/** The distinct runes of a transliteration, in order of first appearance. */
export function distinctRunes(t: Transliteration): string[] {
  const seen: string[] = [];
  for (const w of t.words) for (const r of w.runes) if (!seen.includes(r.rune)) seen.push(r.rune);
  return seen;
}
