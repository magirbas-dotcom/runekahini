import type { Element } from "./runes";

export interface ZodiacSign {
  id: string;
  /** Turkish name, e.g. "Koç". */
  name: string;
  /** Latin name, kept alongside for recognition. */
  latinName: string;
  element: Element;
  /** Inclusive start of the sign, as [month, day]. */
  start: [number, number];
  /** Inclusive end of the sign, as [month, day]. */
  end: [number, number];
  /**
   * The sign's two runes, in order: the initiating force that sets its
   * motivation, and the maturing one that shapes how that lands in practice.
   * The Elder Futhark runs in strict sequence, two runes per sign, starting at
   * the spring equinox — 24 runes across 12 signs.
   *
   * Sequence note: attested inscriptions disagree on two pairs. The Kylver
   * Stone (~400 CE) carves Perthro before Eihwaz and Dagaz before Othala; the
   * Vadstena and Mariedamm bracteates invert both. This app follows the
   * ordinary modern convention that runes.ts already uses — Eihwaz 13,
   * Perthro 14, Dagaz 23, Othala 24 — so Libra reads Eihwaz then Perthro. The
   * source this mapping came from followed Kylver on that pair, which would
   * have made Libra the one sign whose runes ran backwards against our own
   * rune ids.
   *
   * The zodiac-to-rune correspondence itself is a modern construction; no
   * Norse source attests a runic zodiac.
   */
  runeNames: [string, string];
  /** What the pairing says when it comes up in a reading. */
  reading: string;
  /** How the two runes combine — also used as the talisman synergy text. */
  bindrune: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    name: "Koç",
    latinName: "Aries",
    element: "Ateş",
    start: [3, 21],
    end: [4, 19],
    runeNames: ["Fehu", "Uruz"],
    reading:
      "Fehu kazanmayı, Uruz o kazanımı taşıyacak ham gücü veriyor. Akışın içinde büyüyen bir cesaret taşıyorsun; aynı enerji dengesini kaybettiğinde açgözlülüğe ya da gücü yanlış yere harcamaya dönüşebilir.",
    bindrune:
      "Uruz'un ham yaşam gücü, Fehu'nun akışkan bereketine kanalize oluyor. Bu birleşim dürtüselliği yıkıcı değil üretken bir harekete çeviriyor.",
  },
  {
    id: "taurus",
    name: "Boğa",
    latinName: "Taurus",
    element: "Toprak",
    start: [4, 20],
    end: [5, 20],
    runeNames: ["Thurisaz", "Ansuz"],
    reading:
      "Thurisaz seni sarsarak uyandıran diken, Ansuz ise o sarsıntıdan çıkan söz ve bilgelik. İkisi birlikte, savunmayı körü körüne değil düşünerek yapmayı öğretiyor.",
    bindrune:
      "Koruyucu bir kalkanın (Thurisaz) aklın ve sözün gücüyle (Ansuz) mühürlenmesi. Sabit fikirliliği, doğru zamanı bekleyen bir sabra çeviriyor.",
  },
  {
    id: "gemini",
    name: "İkizler",
    latinName: "Gemini",
    element: "Hava",
    start: [5, 21],
    end: [6, 20],
    runeNames: ["Raidho", "Kenaz"],
    reading:
      "Raidho doğru ritimde ilerlemeyi, Kenaz yolda taşıdığın meşaleyi temsil ediyor. Merakın dağılmadığı sürece hem hızlı hem isabetli ilerlersin.",
    bindrune:
      "Hareketin (Raidho) içsel aydınlanma ve ustalıkla (Kenaz) buluşması. Dağınık merakı, hedefi olan bir keşfe sabitliyor.",
  },
  {
    id: "cancer",
    name: "Yengeç",
    latinName: "Cancer",
    element: "Su",
    start: [6, 21],
    end: [7, 22],
    runeNames: ["Gebo", "Wunjo"],
    reading:
      "Gebo karşılıklı alışverişi, Wunjo o alışverişten doğan huzuru anlatıyor. Verdiğin kadar alabildiğin bağlarda güçlenirsin.",
    bindrune:
      "Duygusal bağın (Gebo) uyum ve neşeyle (Wunjo) mühürlenmesi. Kırılganlığı, paylaşılan değerlerin koruyuculuğuna dönüştürüyor.",
  },
  {
    id: "leo",
    name: "Aslan",
    latinName: "Leo",
    element: "Ateş",
    start: [7, 23],
    end: [8, 22],
    runeNames: ["Hagalaz", "Nauthiz"],
    reading:
      "Hagalaz beklenmedik bir sarsıntı, Nauthiz o sarsıntının öğrettiği dayanıklılık. Bu ikili, gücün gösterişten değil dayanmaktan geldiğini söylüyor.",
    bindrune:
      "Arındırıcı krizin (Hagalaz) ihtiyaçtan doğan iradeyle (Nauthiz) birleşmesi. Dışa dönük parlaklığı, içeriden sarsılmaz bir sağlamlığa çeviriyor.",
  },
  {
    id: "virgo",
    name: "Başak",
    latinName: "Virgo",
    element: "Toprak",
    start: [8, 23],
    end: [9, 22],
    runeNames: ["Isa", "Jera"],
    reading:
      "Isa durup berraklaşmayı, Jera sabırla beklenen hasadı temsil ediyor. Acele etmediğin sürece emeğinin karşılığını eksiksiz alırsın.",
    bindrune:
      "Döngünün ve emeğin (Jera) berrak bir sükunetle (Isa) birleşmesi. Mükemmeliyetçilik kaygısını, zamanın kendi akışına duyulan güvenle yatıştırıyor.",
  },
  {
    id: "libra",
    name: "Terazi",
    latinName: "Libra",
    element: "Hava",
    start: [9, 23],
    end: [10, 22],
    runeNames: ["Eihwaz", "Perthro"],
    reading:
      "Eihwaz esneyip kırılmayan omurga, Perthro ise henüz açılmamış olanın gizemi. Karar veremediğin anlarda seni taşıyan şey dayanıklılığın oluyor.",
    bindrune:
      "Derin köklerin (Eihwaz) kaderin gizemiyle (Perthro) mühürlenmesi. Kararsızlığı, beklemeyi bilen bir kararlılığa çeviriyor.",
  },
  {
    id: "scorpio",
    name: "Akrep",
    latinName: "Scorpio",
    element: "Su",
    start: [10, 23],
    end: [11, 21],
    runeNames: ["Algiz", "Sowilo"],
    reading:
      "Algiz seni koruyan kalkan, Sowilo o korumanın altındaki güneş. Derinlerde taşıdığın şey karanlık değil, henüz gösterilmemiş bir güç.",
    bindrune:
      "Koruyucu kalkanın (Algiz) güneşin netliğiyle (Sowilo) aydınlatılması. Gizli gücü, bilinçli ve görünür bir başarıya yönlendiriyor.",
  },
  {
    id: "sagittarius",
    name: "Yay",
    latinName: "Sagittarius",
    element: "Ateş",
    start: [11, 22],
    end: [12, 21],
    runeNames: ["Tiwaz", "Berkano"],
    reading:
      "Tiwaz doğru bildiğinin yanında durmak, Berkano ise o duruştan doğan yeni başlangıç. İdealin, somut bir şeyi büyüttüğünde anlam kazanıyor.",
    bindrune:
      "Adalet ve cesaretin (Tiwaz) besleyici bir büyümeyle (Berkano) taçlanması. Hedefi etik bir zemine bağlıyor.",
  },
  {
    id: "capricorn",
    name: "Oğlak",
    latinName: "Capricorn",
    element: "Toprak",
    start: [12, 22],
    end: [1, 19],
    runeNames: ["Ehwaz", "Mannaz"],
    reading:
      "Ehwaz güvene dayalı ortaklığı, Mannaz kendi benliğini ve topluluk içindeki yerini anlatıyor. Yalnız gitmek yerine birlikte gitmek seni daha uzağa taşır.",
    bindrune:
      "Bireysel sorumluluğun (Mannaz) karşılıklı güvenle (Ehwaz) birleşmesi. Hırsı, çevresine de yarayan bir yapıya dönüştürüyor.",
  },
  {
    id: "aquarius",
    name: "Kova",
    latinName: "Aquarius",
    element: "Hava",
    start: [1, 20],
    end: [2, 18],
    runeNames: ["Laguz", "Ingwaz"],
    reading:
      "Laguz sezginin akışı, Ingwaz ise henüz doğmamış ama olgunlaşan potansiyel. Fikirlerin görünür olmadan önce içeride sessizce büyüyor.",
    bindrune:
      "Sezgisel akışın (Laguz) somut bir potansiyele (Ingwaz) dönüşmesi. Vizyonu, doğmaya hazırlanan bir güç olarak sabitliyor.",
  },
  {
    id: "pisces",
    name: "Balık",
    latinName: "Pisces",
    element: "Su",
    start: [2, 19],
    end: [3, 20],
    runeNames: ["Dagaz", "Othala"],
    reading:
      "Dagaz karanlığın ardından gelen uyanış, Othala ise seni taşıyan kökler. Aydınlanman geçmişini reddederek değil, ona yaslanarak geliyor.",
    bindrune:
      "Kökten gelen mirasın (Othala) yeni bir uyanışla (Dagaz) mühürlenmesi. Dağılma eğilimini, aidiyet duygusuyla dengeliyor.",
  },
];

/**
 * Simplified single-stroke glyphs for the twelve signs, normalized to the same
 * 100x100 box as RUNE_STROKES so the existing glyph renderer works unchanged.
 * These are legible approximations drawn for this app, not reproductions of
 * any particular typeface.
 */
export const ZODIAC_STROKES: Record<string, string> = {
  aries:
    "M50,88 L50,44 M50,44 C48,24 34,15 26,22 C19,29 25,43 34,48 M50,44 C52,24 66,15 74,22 C81,29 75,43 66,48",
  taurus:
    "M33,68 a17,17 0 1,0 34,0 a17,17 0 1,0 -34,0 M29,26 C29,47 38,53 50,53 C62,53 71,47 71,26",
  gemini:
    "M28,22 C40,14 60,14 72,22 M28,78 C40,86 60,86 72,78 M38,20 L38,80 M62,20 L62,80",
  cancer:
    "M25,38 a9,9 0 1,0 18,0 a9,9 0 1,0 -18,0 M57,62 a9,9 0 1,0 18,0 a9,9 0 1,0 -18,0 M43,35 C56,25 72,27 80,39 M57,65 C44,75 28,73 20,61",
  leo: "M23,60 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0 M47,56 C52,38 48,24 60,20 C72,16 80,28 74,40 C70,50 74,62 82,66",
  virgo:
    "M20,32 L20,72 M20,36 C22,28 30,28 32,36 L32,72 M32,36 C34,28 42,28 44,36 L44,72 M44,42 C48,32 58,32 62,42 C66,54 58,66 46,70 M56,58 C66,60 72,66 76,74",
  libra: "M18,72 L82,72 M18,54 L34,54 M34,54 A16,16 0 0,1 66,54 M66,54 L82,54",
  scorpio:
    "M20,32 L20,72 M20,36 C22,28 30,28 32,36 L32,72 M32,36 C34,28 42,28 44,36 L44,72 M44,36 C46,28 54,28 56,36 L56,66 L76,84 M66,82 L78,84 M76,72 L78,84",
  sagittarius: "M22,80 L76,26 M52,24 L78,24 M78,24 L78,50 M36,46 L54,64",
  capricorn:
    "M20,30 C26,44 32,58 38,66 C42,40 50,30 58,34 C66,38 64,52 56,54 C70,54 78,64 72,74 C66,82 54,78 52,68",
  aquarius:
    "M20,42 L32,33 L44,42 L56,33 L68,42 L80,33 M20,66 L32,57 L44,66 L56,57 L68,66 L80,57",
  pisces: "M28,18 C16,36 16,64 28,82 M72,18 C84,36 84,64 72,82 M22,50 L78,50",
};

/** Day of the year for a [month, day], on a non-leap reference year. */
const MONTH_OFFSETS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const DAYS_IN_YEAR = 365;

function dayOfYear(month: number, day: number): number {
  return MONTH_OFFSETS[month - 1] + day;
}

/** Zodiac sign for a birth date, using the standard tropical boundaries. */
export function zodiacForDate(month: number, day: number): ZodiacSign {
  const current = dayOfYear(month, day);

  for (const sign of ZODIAC_SIGNS) {
    const start = dayOfYear(...sign.start);
    let end = dayOfYear(...sign.end);
    // Capricorn is the only sign that runs across the year boundary.
    if (end < start) {
      if (current >= start || current <= end) return sign;
      continue;
    }
    if (current >= start && current <= end) return sign;
  }

  return ZODIAC_SIGNS[0];
}

/**
 * Which of the sign's two runes governs this exact date: the initiating rune
 * in the sign's first half, the maturing one in its second. This is what keeps
 * the solar rune and the zodiac pairing describing one calendar rather than
 * two competing ones.
 */
export function solarRuneForDate(month: number, day: number): string {
  const sign = zodiacForDate(month, day);
  const start = dayOfYear(...sign.start);
  let end = dayOfYear(...sign.end);
  let current = dayOfYear(month, day);

  if (end < start) end += DAYS_IN_YEAR;
  if (current < start) current += DAYS_IN_YEAR;

  const midpoint = start + (end - start) / 2;
  return current <= midpoint ? sign.runeNames[0] : sign.runeNames[1];
}
