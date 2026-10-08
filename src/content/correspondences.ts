import type { Lang } from "../i18n";
// Copied from the app (askrune-app src/content/correspondences.ts); change it there and copy it again.

/**
 * Stones, incense and scents for each rune (user, 2026-10-08, from a guide the user supplied). These are
 * modern esoteric correspondences, not historical, and they vary from source to source: the app says so
 * wherever it shows them, as it does for the birth rune and the talisman. Never a health claim.
 *
 * Taken from the user's list with fixes: "Sığla (Frankincense)" was a mistranslation (frankincense is
 * günlük; sığla is storax) and is günlük throughout; "Lal (Garnet)" is garnet; incense that is not burnt
 * as incense was replaced (Dagaz's lemon by copal, Laguz's seaweed by camphor). The list's elements are
 * not used: the app keeps its own (they differ on Hagalaz only).
 */

export type StoneId =
  | "carnelian"
  | "garnet"
  | "tigers-eye"
  | "red-jasper"
  | "obsidian"
  | "bloodstone"
  | "lapis"
  | "sodalite"
  | "smoky-quartz"
  | "jade"
  | "sunstone"
  | "citrine"
  | "rose-quartz"
  | "green-aventurine"
  | "onyx"
  | "hematite"
  | "black-tourmaline"
  | "clear-quartz"
  | "selenite"
  | "moss-agate"
  | "amethyst"
  | "fluorite"
  | "labradorite"
  | "amber"
  | "moonstone"
  | "turquoise"
  | "malachite"
  | "aquamarine"
  | "ametrine"
  | "petrified-wood";

/** Each stone's name, in both languages. Its picture is src/assets/gems/<id>.webp (copied from the app). */
export const STONES: Record<StoneId, { tr: string; en: string }> = {
  carnelian: { tr: "Karnelyan", en: "Carnelian" },
  garnet: { tr: "Garnet", en: "Garnet" },
  "tigers-eye": { tr: "Kaplan Gözü", en: "Tiger's Eye" },
  "red-jasper": { tr: "Kırmızı Jasper", en: "Red Jasper" },
  obsidian: { tr: "Obsidyen", en: "Obsidian" },
  // Not "kan taşı": Turkish crystal shops give that name to hematite.
  bloodstone: { tr: "Heliotrop", en: "Bloodstone" },
  lapis: { tr: "Lapis Lazuli", en: "Lapis Lazuli" },
  sodalite: { tr: "Sodalit", en: "Sodalite" },
  "smoky-quartz": { tr: "Dumanlı Kuvars", en: "Smoky Quartz" },
  jade: { tr: "Yeşim", en: "Jade" },
  sunstone: { tr: "Güneş Taşı", en: "Sunstone" },
  citrine: { tr: "Sitrin", en: "Citrine" },
  "rose-quartz": { tr: "Pembe Kuvars", en: "Rose Quartz" },
  "green-aventurine": { tr: "Yeşil Aventurin", en: "Green Aventurine" },
  onyx: { tr: "Oniks", en: "Onyx" },
  hematite: { tr: "Hematit", en: "Hematite" },
  "black-tourmaline": { tr: "Siyah Turmalin", en: "Black Tourmaline" },
  "clear-quartz": { tr: "Berrak Kuvars", en: "Clear Quartz" },
  selenite: { tr: "Selenit", en: "Selenite" },
  "moss-agate": { tr: "Yosunlu Akik", en: "Moss Agate" },
  amethyst: { tr: "Ametist", en: "Amethyst" },
  fluorite: { tr: "Florit", en: "Fluorite" },
  labradorite: { tr: "Labradorit", en: "Labradorite" },
  amber: { tr: "Kehribar", en: "Amber" },
  moonstone: { tr: "Ay Taşı", en: "Moonstone" },
  turquoise: { tr: "Turkuaz", en: "Turquoise" },
  malachite: { tr: "Malakit", en: "Malachite" },
  aquamarine: { tr: "Akuamarin", en: "Aquamarine" },
  ametrine: { tr: "Ametrin", en: "Ametrine" },
  "petrified-wood": { tr: "Taşlaşmış Ağaç", en: "Petrified Wood" },
};

/** Incense and scents by name, in both languages. */
const N = {
  cinnamon: { tr: "Tarçın", en: "Cinnamon" },
  frankincense: { tr: "Günlük", en: "Frankincense" },
  sweetOrange: { tr: "Tatlı Portakal", en: "Sweet Orange" },
  orange: { tr: "Portakal", en: "Orange" },
  cedar: { tr: "Sedir", en: "Cedar" },
  pine: { tr: "Çam", en: "Pine" },
  blackPepper: { tr: "Karabiber", en: "Black Pepper" },
  dragonsBlood: { tr: "Ejder Kanı", en: "Dragon's Blood" },
  rosemary: { tr: "Biberiye", en: "Rosemary" },
  sage: { tr: "Adaçayı", en: "Sage" },
  bay: { tr: "Defne", en: "Bay Laurel" },
  lavender: { tr: "Lavanta", en: "Lavender" },
  eucalyptus: { tr: "Okaliptüs", en: "Eucalyptus" },
  myrrh: { tr: "Mür", en: "Myrrh" },
  sandalwood: { tr: "Sandal Ağacı", en: "Sandalwood" },
  mint: { tr: "Nane", en: "Peppermint" },
  lemongrass: { tr: "Limon Otu", en: "Lemongrass" },
  amberResin: { tr: "Amber", en: "Amber" },
  bergamot: { tr: "Bergamot", en: "Bergamot" },
  rose: { tr: "Gül", en: "Rose" },
  jasmine: { tr: "Yasemin", en: "Jasmine" },
  vanilla: { tr: "Vanilya", en: "Vanilla" },
  ylang: { tr: "Ylang Ylang", en: "Ylang-Ylang" },
  teaTree: { tr: "Çay Ağacı", en: "Tea Tree" },
  patchouli: { tr: "Paçuli", en: "Patchouli" },
  oakmoss: { tr: "Meşe Yosunu", en: "Oakmoss" },
  vetiver: { tr: "Vetiver", en: "Vetiver" },
  juniper: { tr: "Ardıç", en: "Juniper" },
  mugwort: { tr: "Pelin Otu", en: "Mugwort" },
  lemon: { tr: "Limon", en: "Lemon" },
  birchBark: { tr: "Huş Kabuğu", en: "Birch Bark" },
  birch: { tr: "Huş", en: "Birch" },
  basil: { tr: "Fesleğen", en: "Basil" },
  lotus: { tr: "Nilüfer", en: "Lotus" },
  camphor: { tr: "Kâfur", en: "Camphor" },
  chamomile: { tr: "Papatya", en: "Chamomile" },
  copal: { tr: "Kopal", en: "Copal" },
} as const;

type Name = (typeof N)[keyof typeof N];

export interface Correspondence {
  stones: StoneId[];
  incense: Name[];
  scents: Name[];
}

export const CORRESPONDENCES: Record<string, Correspondence> = {
  Fehu: { stones: ["carnelian", "garnet"], incense: [N.cinnamon, N.frankincense], scents: [N.cinnamon, N.sweetOrange] },
  Uruz: { stones: ["tigers-eye", "red-jasper"], incense: [N.cedar, N.pine], scents: [N.cedar, N.blackPepper] },
  Thurisaz: { stones: ["obsidian", "bloodstone"], incense: [N.dragonsBlood], scents: [N.rosemary, N.blackPepper] },
  Ansuz: { stones: ["lapis", "sodalite"], incense: [N.sage, N.bay], scents: [N.lavender, N.eucalyptus] },
  Raidho: { stones: ["smoky-quartz", "jade"], incense: [N.myrrh, N.sandalwood], scents: [N.mint, N.lemongrass] },
  Kenaz: { stones: ["sunstone", "citrine"], incense: [N.amberResin, N.frankincense], scents: [N.bergamot, N.orange] },
  Gebo: { stones: ["rose-quartz", "jade"], incense: [N.rose, N.jasmine], scents: [N.rose, N.jasmine] },
  Wunjo: { stones: ["citrine", "green-aventurine"], incense: [N.frankincense, N.vanilla], scents: [N.ylang, N.sweetOrange] },
  Hagalaz: { stones: ["onyx", "hematite"], incense: [N.myrrh, N.rosemary], scents: [N.rosemary, N.teaTree] },
  Nauthiz: { stones: ["black-tourmaline", "smoky-quartz"], incense: [N.patchouli, N.cedar], scents: [N.patchouli, N.rosemary] },
  Isa: { stones: ["clear-quartz", "selenite"], incense: [N.eucalyptus, N.mint], scents: [N.mint, N.eucalyptus] },
  Jera: { stones: ["moss-agate", "citrine"], incense: [N.oakmoss, N.sandalwood], scents: [N.vetiver, N.cedar] },
  Eihwaz: { stones: ["obsidian", "black-tourmaline"], incense: [N.juniper, N.cedar], scents: [N.juniper, N.pine] },
  Perthro: { stones: ["amethyst", "fluorite"], incense: [N.myrrh, N.mugwort], scents: [N.frankincense, N.lavender] },
  Algiz: { stones: ["black-tourmaline", "labradorite"], incense: [N.sage, N.bay], scents: [N.sage, N.cedar] },
  Sowilo: { stones: ["sunstone", "amber"], incense: [N.bay, N.frankincense], scents: [N.bergamot, N.lemon] },
  Tiwaz: { stones: ["red-jasper", "hematite"], incense: [N.cedar, N.pine], scents: [N.cedar, N.frankincense] },
  Berkano: { stones: ["moonstone", "jade"], incense: [N.birchBark, N.jasmine], scents: [N.birch, N.rose] },
  Ehwaz: { stones: ["turquoise", "malachite"], incense: [N.sage, N.pine], scents: [N.lavender, N.mint] },
  Mannaz: { stones: ["amethyst", "garnet"], incense: [N.sandalwood, N.lavender], scents: [N.sandalwood, N.basil] },
  Laguz: { stones: ["aquamarine", "moonstone"], incense: [N.lotus, N.camphor], scents: [N.chamomile, N.eucalyptus] },
  Ingwaz: { stones: ["green-aventurine", "jade"], incense: [N.frankincense, N.rosemary], scents: [N.vetiver, N.ylang] },
  Dagaz: { stones: ["ametrine", "clear-quartz"], incense: [N.copal, N.sage], scents: [N.lemon, N.rosemary] },
  Othala: { stones: ["petrified-wood", "amber"], incense: [N.cedar, N.oakmoss], scents: [N.cedar, N.myrrh] },
};

/** A name in the current language. */
export const nameIn = (n: { tr: string; en: string }, lang: Lang) => (lang === "tr" ? n.tr : n.en);

/**
 * What goes with several runes at once (the talisman): their stones, incense and scents in order, each
 * named once, at most `max` of each.
 */
export function combinedCorrespondence(runes: string[], max = 4): Correspondence {
  const pick = <T,>(lists: T[][], key: (t: T) => string) => {
    const seen = new Set<string>();
    const out: T[] = [];
    // Round-robin, so each rune gives its first before any gives its second.
    for (let i = 0; out.length < max && lists.some((l) => l[i] !== undefined); i++) {
      for (const l of lists) {
        const t = l[i];
        if (t === undefined || seen.has(key(t)) || out.length >= max) continue;
        seen.add(key(t));
        out.push(t);
      }
    }
    return out;
  };
  const cs = runes.map((r) => CORRESPONDENCES[r]).filter(Boolean);
  return {
    stones: pick(cs.map((c) => c.stones), (s) => s),
    incense: pick(cs.map((c) => c.incense), (n) => n.en),
    scents: pick(cs.map((c) => c.scents), (n) => n.en),
  };
}
