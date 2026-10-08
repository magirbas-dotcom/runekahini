// The Rune Guide on the site (2026-10-06, user: "add the app's Rune Guide to askrune.app"). The texts are the
// app's own (src/content/, copied); the labels below are the app's guide and detail strings (askrune-app
// src/i18n/{tr,en}.json "guide", "detail"), with a few the site needs on its own (page titles, the app nudge).

import contentEn from "./content/en";
import { guideEn } from "./content/guide/en";
import { guideTr } from "./content/guide/tr";
import contentTr from "./content/tr";
import { runes, type Rune } from "./content/runes";
import type { Lang } from "./i18n";

export { runes, type Rune };

export const content = { en: contentEn, tr: contentTr };
export const lore = { en: guideEn, tr: guideTr };

/** Addresses: the English guide at /guide/, the Turkish at /tr/rehber/, a rune at its lower-case name. */
export const guidePath = {
  en: { index: "/guide/", history: "/guide/history/", spreads: "/guide/spreads/", rune: (n: string) => `/guide/${n.toLowerCase()}/` },
  tr: { index: "/tr/rehber/", history: "/tr/rehber/tarih/", spreads: "/tr/rehber/acilimlar/", rune: (n: string) => `/tr/rehber/${n.toLowerCase()}/` },
} as const;

export type GuidePage = "index" | "history" | "spreads";

/** The Rune of the Day page (2026-10-07). */
export const dailyPath = { en: "/rune-of-the-day/", tr: "/tr/gunun-runesi/" } as const;

/** The same page in both languages, for hreflang and the language switch. */
export function guideAlternates(page: GuidePage | { rune: string }) {
  const of = (l: Lang) => (typeof page === "string" ? guidePath[l][page] : guidePath[l].rune(page.rune));
  return { en: of("en"), tr: of("tr") };
}

/** The first sense of a meaning ("Giant / Thorn / Thor's Hammer" → "Giant", "Aurochs (Wild Ox)" → "Aurochs"). */
export const firstSense = (meaning: string) => meaning.split(" / ")[0].replace(/\s*\(.*\)$/, "");

/** The first sentence of a text, for page descriptions. */
export const firstSentence = (text: string) => text.match(/^[^.!?]+[.!?]/)?.[0] ?? text;

export interface GuideCopy {
  title: string;
  kicker: string;
  sub: string;
  introTitle: string;
  intro: string[];
  aettThemes: string[];
  aettShort: string[];
  historyLink: { title: string; desc: string };
  spreadsLink: { title: string; desc: string };
  runesTitle: string;
  modern: string;
  lore: { poem: string; myth: string; inner: string; shadow: string; harmony: string; question: string; talisman: string };
  /** Stones, incense and scents (the app's corr.*). */
  corr: { title: string; incense: string; scents: string; note: string };
  spread: { origin: string; layout: string; positions: string; questions: string; reading: string };
  sources: string;
  prev: string;
  next: string;
  back: string;
  upright: string;
  reversed: string;
  general: string;
  love: string;
  career: string;
  keywords: string;
  practicalTip: string;
  symmetric: string;
  proto: string;
  sound: string;
  app: { title: string; text: string; link: string };
  meta: {
    index: { title: string; description: string };
    history: { title: string; description: string };
    spreads: { title: string; description: string };
    rune: (name: string, meaning: string) => string;
  };
}

export const guideCopy: Record<Lang, GuideCopy> = {
  en: {
    title: "Rune Guide",
    kicker: "ELDER FUTHARK · 24 RUNES",
    sub: "Every rune of the Elder Futhark, upright and reversed: what it means in general, in love and at work, its rune poem, its history and its shadow.",
    introTitle: "What are rune stones?",
    intro: [
      "The Elder Futhark is the oldest known runic alphabet, used by Germanic peoples of northern and central Europe from about AD 150 to 800. Each of its 24 signs carries both a sound and a meaning, and they fall into three families of eight (aettir).",
      "Freyr & Freyja's aett speaks of the material world and daily life, Heimdall's of trials and transformation, and Tyr's of justice and spiritual maturity.",
      "Nine runes (Gebo, Hagalaz, Nauthiz, Isa, Jera, Eihwaz, Sowilo, Ingwaz, Dagaz) are symmetrical and never appear reversed. Each rune is also linked to one of the four classical elements (Fire, Earth, Air, Water), which helps when choosing runes that complement each other in a talisman.",
      "Some modern sets add a 25th, blank rune. It appears in no ancient inscription or rune poem; it is a 1982 invention by Ralph Blum. The Elder Futhark has 24 signs, and AskRune stays true to that.",
    ],
    aettThemes: ["The material world and daily life", "Trials and transformation", "Justice and spiritual maturity"],
    aettShort: ["Freyr", "Heimdall", "Tyr"],
    historyLink: { title: "History of the Runes", desc: "Inscriptions, the aettir, Tacitus and how modern reading began" },
    spreadsLink: { title: "Spreads", desc: "Where each spread comes from, how it is laid out and read" },
    runesTitle: "The 24 runes",
    modern: "MODERN INTERPRETATION",
    lore: {
      poem: "Rune Poem",
      myth: "History and Myth",
      inner: "Inner Life",
      shadow: "Shadow Side",
      harmony: "Harmony and Tension",
      question: "This Rune's Question",
      talisman: "In Talismans",
    },
    corr: {
      title: "Stones · Incense · Scents",
      incense: "Incense",
      scents: "Scents",
      note: "Modern esoteric correspondences; they vary from source to source. Burn incense somewhere airy.",
    },
    spread: { origin: "Origin", layout: "Layout", positions: "Places", questions: "Good for", reading: "How to read it" },
    sources:
      "This guide draws on historical sources and modern rune literature, written in our own words. What is attested and what is modern interpretation are kept apart.",
    prev: "Previous",
    next: "Next",
    back: "All runes",
    upright: "Upright",
    reversed: "Reversed",
    general: "General",
    love: "Love",
    career: "Career",
    keywords: "Keywords",
    practicalTip: "Practical Tip",
    symmetric: "Being symmetrical, this rune has no reversed position: it is always read upright.",
    proto: "Proto-Germanic",
    sound: "Sound",
    app: {
      title: "Draw the stones in AskRune",
      text: "The rune of the day, readings of one to five runes, your birth rune, a talisman of your own and a seven-day Rune Journey. Coming soon to the App Store and Google Play.",
      link: "Discover the app",
    },
    meta: {
      index: {
        title: "Rune Guide: the 24 Elder Futhark runes and their meanings · AskRune",
        description:
          "All 24 runes of the Elder Futhark, upright and reversed: meanings in general, love and career, rune poems, history and myth, and the spreads used in rune reading.",
      },
      history: {
        title: "History of the Runes: the Elder Futhark, inscriptions and rune reading · AskRune",
        description:
          "Where the runes come from: the Elder Futhark and its three aettir, the oldest inscriptions, Tacitus, and how modern rune reading, the blank rune and reversed runes came about.",
      },
      spreads: {
        title: "Rune Spreads: single rune, three runes, the cross and more · AskRune",
        description:
          "The rune spreads explained: where each comes from, how the stones are laid out, what every place means, the questions it suits and how to read it as a whole.",
      },
      rune: (name, meaning) => `${name} rune meaning (${meaning}): upright and reversed · AskRune`,
    },
  },

  tr: {
    title: "Rune Rehberi",
    kicker: "ELDER FUTHARK · 24 RUNE",
    sub: "Elder Futhark'ın her rune'u, düz ve ters: genel olarak, aşkta ve işte ne anlattığı, rune şiiri, tarihi ve gölge yönü.",
    introTitle: "Rune taşları nedir?",
    intro: [
      "Elder Futhark, Kuzey ve Orta Avrupa'daki Germen halklarının MS 150–800 arasında kullandığı, bilinen en eski rune alfabesidir. 24 işaretin her biri hem bir ses hem bir anlam taşır ve sekizerli üç aileye (aett) ayrılır.",
      "Freyr & Freyja Ailesi maddi dünyayı ve günlük yaşamı, Heimdall Ailesi sınavları ve dönüşümü, Tyr Ailesi ise adaleti ve ruhsal olgunluğu temsil eder.",
      "9 rune (Gebo, Hagalaz, Nauthiz, Isa, Jera, Eihwaz, Sowilo, Ingwaz, Dagaz) simetrik yapıları gereği hiçbir zaman ters dönmez. Her rune ayrıca dört klasik elementten (Ateş, Toprak, Hava, Su) biriyle ilişkilendirilir; tılsım tasarlarken birbirini tamamlayan elementleri seçmek işine yarayabilir.",
      "Bazı modern setlerde 25. bir boş rune bulunur. Bu, kadim yazıtlarda ya da rune şiirlerinde geçmez; 1982'de Ralph Blum'un eklediği çağdaş bir icattır. Elder Futhark 24 semboldür ve AskRune o saf hâline sadık kalır.",
    ],
    aettThemes: ["Maddi dünya ve gündelik yaşam", "Sınavlar ve dönüşüm", "Adalet ve ruhsal olgunluk"],
    aettShort: ["Freyr", "Heimdall", "Tyr"],
    historyLink: { title: "Rune'ların Tarihi", desc: "Yazıtlar, aettir, Tacitus ve modern okumanın doğuşu" },
    spreadsLink: { title: "Açılımlar", desc: "Her açılımın kökeni, dizilişi ve nasıl okunduğu" },
    runesTitle: "24 rune",
    modern: "MODERN YORUM",
    lore: {
      poem: "Rune Şiiri",
      myth: "Tarih ve Mitoloji",
      inner: "İç Dünya",
      shadow: "Gölge Yönü",
      harmony: "Uyum ve Gerilim",
      question: "Bu Rune'un Sorusu",
      talisman: "Tılsımda",
    },
    corr: {
      title: "Taş · Tütsü · Koku",
      incense: "Tütsü",
      scents: "Koku",
      note: "Modern ezoterik eşleşmelerdir, kaynaktan kaynağa değişir. Tütsüyü havadar bir yerde yak.",
    },
    spread: { origin: "Kökeni", layout: "Diziliş", positions: "Yerler", questions: "Hangi sorular için", reading: "Nasıl okunur" },
    sources:
      "Bu rehber tarihsel kaynaklardan ve modern rune literatüründen derlenip kendi sözlerimizle yazıldı. Tarihsel bilgi ile modern yorum ayrı tutuldu.",
    prev: "Önceki",
    next: "Sonraki",
    back: "Tüm rune'lar",
    upright: "Düz",
    reversed: "Ters",
    general: "Genel",
    love: "Aşk",
    career: "Kariyer",
    keywords: "Anahtar kelimeler",
    practicalTip: "Pratik İpucu",
    symmetric: "Simetrik yapısı gereği bu rune'un ters konumu yoktur: her zaman düz okunur.",
    proto: "Proto-Germence",
    sound: "Ses",
    app: {
      title: "Taşları AskRune'da çek",
      text: "Günün rune'u, bir ile beş rune arası okumalar, doğum rune'un, kendi tılsımın ve yedi günlük Rune Yolculuğu. Yakında App Store ve Google Play'de.",
      link: "Uygulamayı keşfet",
    },
    meta: {
      index: {
        title: "Rune Rehberi: Elder Futhark'ın 24 rune'u ve anlamları · AskRune",
        description:
          "Elder Futhark'ın 24 rune'u, düz ve ters: genel, aşk ve kariyer anlamları, rune şiirleri, tarih ve mitoloji, rune okumasında kullanılan açılımlar.",
      },
      history: {
        title: "Rune'ların Tarihi: Elder Futhark, yazıtlar ve rune okuması · AskRune",
        description:
          "Rune'lar nereden geliyor: Elder Futhark ve üç aett, en eski yazıtlar, Tacitus; modern rune okuması, boş rune ve ters rune'lar nasıl ortaya çıktı.",
      },
      spreads: {
        title: "Rune Açılımları: tek rune, üç rune, haç ve dahası · AskRune",
        description:
          "Rune açılımları: her birinin kökeni, taşların dizilişi, her yerin anlamı, hangi sorulara uygun olduğu ve bir bütün olarak nasıl okunduğu.",
      },
      rune: (name, meaning) => `${name} rune'u anlamı (${meaning}): düz ve ters · AskRune`,
    },
  },
};
