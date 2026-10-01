import bronze from "../assets/medallions/bronze-sunburst.webp";
import gold from "../assets/medallions/gold-knotwork.webp";
import silver from "../assets/medallions/silver-oxidized.webp";

/**
 * Antik madalyonlar — Higgsfield (GPT Image 2.5) ile üretilmiş boş madalyon
 * fotoğrafları (kaynak PNG'ler ../rune-kahini-mobile/design/medallions/).
 *
 * Askı halkası yüzünden disk görselin ortasında değil, ve iç alan dış diskle
 * tam eş merkezli de değil. Bu yüzden merkez dış diskten türetilmez: iç alanın
 * kenarı 24 yönde (±6° sektör ortalamalı parlaklık profiliyle) bulunup bu
 * noktalara en küçük kareler çemberi oturtuldu, sonuç görsel üzerine çizilip
 * gözle doğrulandı (design/medallions/_fit.png). Altında gölgeli kenar ölçümü
 * kaydırdığı için değer bu kontrolde elle düzeltildi. Değerler görsel
 * genişliğine oran.
 */
export type MedallionId = "gold" | "silver" | "bronze";

export interface Medallion {
  name: string;
  src: string;
  /** Centre of the empty field, as a fraction of the image. */
  cx: number;
  cy: number;
  /** Radius of the empty field, as a fraction of the image width. */
  fieldR: number;
  /**
   * Colour of an engraved cut in this metal, taken from the medallion itself:
   * the mean of the 10–30th percentile (by brightness) of its border pixels —
   * the recesses of its own knotwork / rope / notches. The darkest 10% is
   * excluded: that is cast shadow, near-black on every medallion.
   */
  recess: string;
  /** Mean brightness (0–1) of the empty field, to normalise the floor texture. */
  fieldLum: number;
  /** Mean colour of the empty field — the tint of light catching a cut wall. */
  fieldColor: string;
}

export const MEDALLIONS: Record<MedallionId, Medallion> = {
  gold: { name: "Altın", src: gold, cx: 0.494, cy: 0.507, fieldR: 0.257, recess: "#2a241b", fieldLum: 0.441, fieldColor: "#916b38" },
  silver: { name: "Gümüş", src: silver, cx: 0.4919, cy: 0.5264, fieldR: 0.2755, recess: "#151717", fieldLum: 0.563, fieldColor: "#918f8b" },
  bronze: { name: "Bronz", src: bronze, cx: 0.498, cy: 0.4984, fieldR: 0.293, recess: "#2b331b", fieldLum: 0.319, fieldColor: "#4b593d" },
};

export const MEDALLION_IDS = Object.keys(MEDALLIONS) as MedallionId[];
