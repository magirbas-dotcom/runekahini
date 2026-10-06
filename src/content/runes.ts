// Copied from the mobile app (askrune-app src/data/runes.ts), the language-neutral rune data only: the draw
// functions stay in the app. src/content/{tr,en,types}.ts and src/content/guide/ are copies too (2026-10-06,
// the Rune Guide on the site). If the app's texts change, copy the files again; never edit them here alone.

/** Classical element a rune resonates with. Display names are per language (`content.elements`). */
export type ElementKey = "fire" | "earth" | "air" | "water";

export interface Rune {
  id: number;
  name: string;
  symbol: string;
  soundValue: string;
  pronunciation: string;
  /** Some runes are symmetric and traditionally carry no separate reversed meaning. */
  reversible: boolean;
  aett: 1 | 2 | 3;
  element: ElementKey;
}

export const runes: Rune[] = [
  { id: 1, name: "Fehu", symbol: "ᚠ", soundValue: "F", pronunciation: "FAY-hoo", reversible: true, aett: 1, element: "fire" },
  { id: 2, name: "Uruz", symbol: "ᚢ", soundValue: "U", pronunciation: "OO-rooz", reversible: true, aett: 1, element: "earth" },
  { id: 3, name: "Thurisaz", symbol: "ᚦ", soundValue: "TH", pronunciation: "THUR-ee-sahz", reversible: true, aett: 1, element: "fire" },
  { id: 4, name: "Ansuz", symbol: "ᚨ", soundValue: "A", pronunciation: "AHN-sooz", reversible: true, aett: 1, element: "air" },
  { id: 5, name: "Raidho", symbol: "ᚱ", soundValue: "R", pronunciation: "RYE-dhoe", reversible: true, aett: 1, element: "air" },
  { id: 6, name: "Kenaz", symbol: "ᚲ", soundValue: "K", pronunciation: "KAY-nahz", reversible: true, aett: 1, element: "fire" },
  { id: 7, name: "Gebo", symbol: "ᚷ", soundValue: "G", pronunciation: "GAY-boe", reversible: false, aett: 1, element: "water" },
  { id: 8, name: "Wunjo", symbol: "ᚹ", soundValue: "W/V", pronunciation: "WOON-yoe", reversible: true, aett: 1, element: "earth" },
  { id: 9, name: "Hagalaz", symbol: "ᚺ", soundValue: "H", pronunciation: "HAH-gah-lahz", reversible: false, aett: 2, element: "air" },
  { id: 10, name: "Nauthiz", symbol: "ᚾ", soundValue: "N", pronunciation: "NOW-theez", reversible: false, aett: 2, element: "fire" },
  { id: 11, name: "Isa", symbol: "ᛁ", soundValue: "I", pronunciation: "EE-sah", reversible: false, aett: 2, element: "water" },
  { id: 12, name: "Jera", symbol: "ᛃ", soundValue: "J/Y", pronunciation: "YAY-rah", reversible: false, aett: 2, element: "earth" },
  { id: 13, name: "Eihwaz", symbol: "ᛇ", soundValue: "EI", pronunciation: "EYE-wahz", reversible: false, aett: 2, element: "earth" },
  { id: 14, name: "Perthro", symbol: "ᛈ", soundValue: "P", pronunciation: "PER-throe", reversible: true, aett: 2, element: "water" },
  { id: 15, name: "Algiz", symbol: "ᛉ", soundValue: "Z", pronunciation: "AL-geez", reversible: true, aett: 2, element: "air" },
  { id: 16, name: "Sowilo", symbol: "ᛋ", soundValue: "S", pronunciation: "SOE-wee-loe", reversible: false, aett: 2, element: "fire" },
  { id: 17, name: "Tiwaz", symbol: "ᛏ", soundValue: "T", pronunciation: "TEE-wahz", reversible: true, aett: 3, element: "fire" },
  { id: 18, name: "Berkano", symbol: "ᛒ", soundValue: "B", pronunciation: "BER-kah-noe", reversible: true, aett: 3, element: "earth" },
  { id: 19, name: "Ehwaz", symbol: "ᛖ", soundValue: "E", pronunciation: "AY-wahz", reversible: true, aett: 3, element: "air" },
  { id: 20, name: "Mannaz", symbol: "ᛗ", soundValue: "M", pronunciation: "MAHN-nahz", reversible: true, aett: 3, element: "air" },
  { id: 21, name: "Laguz", symbol: "ᛚ", soundValue: "L", pronunciation: "LAH-gooz", reversible: true, aett: 3, element: "water" },
  { id: 22, name: "Ingwaz", symbol: "ᛜ", soundValue: "NG", pronunciation: "ING-wahz", reversible: false, aett: 3, element: "earth" },
  { id: 23, name: "Dagaz", symbol: "ᛞ", soundValue: "D", pronunciation: "DAH-gahz", reversible: false, aett: 3, element: "fire" },
  { id: 24, name: "Othala", symbol: "ᛟ", soundValue: "O", pronunciation: "OH-thah-lah", reversible: true, aett: 3, element: "earth" },
];
