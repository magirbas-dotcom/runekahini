import { runes, RUNE_POSSESSIVE, type DrawnRune } from "./runes";

function readingOf(d: DrawnRune) {
  return d.reversed && d.rune.reversed ? d.rune.reversed : d.rune.upright;
}

function nameOf(d: DrawnRune): string {
  return `${d.rune.name}${d.reversed ? " (ters)" : ""}`;
}

function joinWithVe(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} ve ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} ve ${items[items.length - 1]}`;
}

/**
 * Synergy line for a self-picked Bindrune combination (the talisman
 * designer's "custom" mode) — names each rune's dominant trait so the
 * result reads as an actual synthesis, not a generic "energies combine".
 */
export function buildCustomSynergy(layerNames: string[]): string | null {
  if (layerNames.length < 2) return null;

  const phrases = layerNames.map((name) => {
    const rune = runes.find((r) => r.name === name);
    const trait = rune?.upright.keywords[0] ?? name.toLowerCase();
    const possessive = RUNE_POSSESSIVE[name] ?? `${name}'in`;
    return `${possessive} ${trait}`;
  });

  return `${joinWithVe(phrases)} enerjileri tek bir sembolde kesişiyor — bu tılsım seçtiğin Rune'lerin baskın özelliklerini birleştiriyor.`;
}

/**
 * Templated "Bütünsel Değerlendirme" paragraph that ties the drawn runes of a
 * spread together — a lightweight synthesis built from each position's keyword,
 * not hand-authored prose per combination (24^N combinations aren't feasible
 * to author by hand for N ≥ 3).
 */
export function buildSynergySummary(
  spreadType: "single" | "three" | "four" | "five",
  drawn: DrawnRune[],
): string | null {
  if (spreadType === "single" || drawn.length < 2) return null;

  if (spreadType === "three") {
    const [past, present, future] = drawn;
    const p = readingOf(past);
    const s = readingOf(present);
    const f = readingOf(future);

    return (
      `Geçmişte beliren ${nameOf(past)}, ${p.keywords[0]} temalı bir zemin hazırlamış — ` +
      `şu anki durumunuza buradan ulaştınız. Şimdiki zamanda ${nameOf(present)} ile ` +
      `${s.keywords[0]} sınanıyorsunuz; bu, mevcut enerjinin odak noktası. Yön ` +
      `değişmeden devam ederse önünüzde ${nameOf(future)} — ${f.keywords[0]} — beliriyor. ` +
      `Yolunuz, geçmişin ${p.keywords[0]} deneyiminden aldığınız dersle şimdiki ` +
      `${s.keywords[0]} sınavını aşıp bu olası geleceğe bilinçli şekilde yön vermekten geçiyor.`
    );
  }

  if (spreadType === "four") {
    // [Senin Enerjin, Sen, Karşı Taraf, Sonuç]
    const [energy, self, other, outcome] = drawn;
    const e = readingOf(energy);
    const y = readingOf(self);
    const o = readingOf(other);
    const r = readingOf(outcome);

    return (
      `İlişkiye taşıdığınız genel enerji ${nameOf(energy)} — ${e.keywords[0]} tonunda. ` +
      `Sizi şu an temsil eden ${nameOf(self)} (${y.keywords[0]}), karşı tarafı ise ` +
      `${nameOf(other)} (${o.keywords[0]}) anlatıyor. İki enerji arasındaki alışverişin ` +
      `olası sonucu ${nameOf(outcome)} — ${r.keywords[0]} — olarak beliriyor. Bu açılım, ` +
      `${y.keywords[0]} ile ${o.keywords[0]} arasındaki dengenin ${r.keywords[0]} yönünde ` +
      `nasıl şekillenebileceğine dair bir ayna tutuyor.`
    );
  }

  // five-rune cross: [Merkez, Sol, Üst, Alt, Sağ]
  const [center, left, top, bottom, right] = drawn;
  const c = readingOf(center);
  const l = readingOf(left);
  const t = readingOf(top);
  const b = readingOf(bottom);
  const r = readingOf(right);

  return (
    `Bu açılımın merkezinde ${nameOf(center)} duruyor — durumun temel enerjisi ${c.keywords[0]}. ` +
    `Bunu geçmişten besleyen etki ${nameOf(left)} (${l.keywords[0]}); bilinçli hedefleriniz ` +
    `${nameOf(top)} ile ${t.keywords[0]} yönünde şekilleniyor. Bilinçaltında ise ${nameOf(bottom)} ` +
    `— ${b.keywords[0]} — bir engel ya da göze alınması gereken bir fedakârlık olarak duruyor. ` +
    `Atılacak adımın ve olası sonucun işareti ${nameOf(right)}: ${r.keywords[0]}. ` +
    `Bu beş taş birlikte, ${c.keywords[0]} ekseninde ilerleyen ve ${b.keywords[0]} engelini ` +
    `aşarak ${r.keywords[0]} sonucuna doğru evrilen bir bütün oluşturuyor.`
  );
}
