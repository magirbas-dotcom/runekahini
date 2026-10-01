import auroraBg from "../assets/realms/aurora.webp";
import fireBg from "../assets/realms/fire.webp";
import forestBg from "../assets/realms/forest.webp";
import stoneAurora from "../assets/stones/stone-aurora.webp";
import stoneFire from "../assets/stones/stone-fire.webp";
import stoneForest from "../assets/stones/stone-forest.webp";

/**
 * Üç görsel "diyar", mobil uygulamayla (rune-kahini-mobile) ortak tasarım dili.
 * Kullanıcı Higgsfield denemelerinden üçünü seçti, her biri bir sekmeye ait:
 *
 *   fire   — Kuzey Ateşi: Rune Okuması
 *   aurora — Kutup Gecesi: Doğum Rune'si
 *   forest — Yggdrasil: Tılsım
 *
 * Vurgu renkleri `index.css`'teki `.realm-*` sınıflarında: sınıf `@theme`
 * değişkenlerini (--color-gold, --color-hairline…) ezer, Tailwind yardımcıları
 * da bu değişkenleri okuduğu için alt ağaçtaki her bileşen o diyarın rengini
 * kendiliğinden alır. Rune kazımaları her diyarda altın yaldız kalır.
 */
export type RealmName = "fire" | "aurora" | "forest";

export interface Realm {
  className: string;
  background: string;
  /** Blank natural rune stone for this realm. */
  stone: string;
}

export const REALMS: Record<RealmName, Realm> = {
  fire: { className: "realm-fire", background: fireBg, stone: stoneFire },
  aurora: { className: "realm-aurora", background: auroraBg, stone: stoneAurora },
  forest: { className: "realm-forest", background: forestBg, stone: stoneForest },
};
