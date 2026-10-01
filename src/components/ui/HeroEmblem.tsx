import RuneRing from "./RuneRing";
import TalismanMedallion from "./TalismanMedallion";

interface HeroEmblemProps {
  size: number;
  /** Intro variant: runes fade in one by one, medallion rises in after. */
  reveal?: boolean;
}

/**
 * The app's mark: the gold medallion with Perthro — the rune of the lot-cup,
 * of casting and chance, the oracle's own — engraved in it, inside a slowly
 * turning band of the whole Futhark.
 */
export default function HeroEmblem({ size, reveal = false }: HeroEmblemProps) {
  const medallion = size * 0.62;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }} aria-hidden="true">
      <div className="hero-aura absolute inset-[14%] rounded-full" />
      <RuneRing size={size} reveal={reveal} className="ring-spin absolute inset-0" />
      <div
        className={`absolute ${reveal ? "medallion-rise" : ""}`}
        style={{ width: medallion, height: medallion, left: (size - medallion) / 2, top: (size - medallion) / 2 }}
      >
        <TalismanMedallion
          names={["Perthro"]}
          form="bindrune"
          offsets={{}}
          material="gold"
          className="h-full w-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]"
        />
      </div>
    </div>
  );
}
