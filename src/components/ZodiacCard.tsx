import { runes } from "../data/runes";
import type { ZodiacSign } from "../data/zodiac";
import MysticCard from "./ui/MysticCard";
import MysticDivider from "./ui/MysticDivider";
import RuneGlyph from "./ui/RuneGlyph";
import ZodiacGlyph from "./ui/ZodiacGlyph";

interface ZodiacCardProps {
  sign: ZodiacSign;
  /** Which of the sign's two runes the exact birth date falls on. */
  activeRuneName: string;
}

const ROLE_LABELS = ["Başlatan Güç", "Olgunlaştıran Güç"] as const;

export default function ZodiacCard({ sign, activeRuneName }: ZodiacCardProps) {
  return (
    <MysticCard grain className="animate-fade-in p-6 text-center">
      <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-gold">
        Burcun
      </p>

      <span className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-hairline text-gold-light">
        <ZodiacGlyph id={sign.id} size={48} />
      </span>

      <h3 className="font-serif text-[28px] leading-tight text-parchment">
        {sign.name}
      </h3>
      <p className="mt-1 text-sm text-gold">
        {sign.latinName} · {sign.element} Elementi
      </p>

      <MysticDivider className="my-6" />

      <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-gold">
        Burcunun Rune'leri
      </p>

      <div className="grid grid-cols-2 gap-3">
        {sign.runeNames.map((name, i) => {
          const rune = runes.find((r) => r.name === name);
          const isActive = name === activeRuneName;
          return (
            <div
              key={name}
              className={`rounded-lg border p-3.5 ${
                isActive
                  ? "border-hairline-strong bg-surface-gold/70"
                  : "border-hairline bg-surface/60"
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.14em] text-gold">
                {ROLE_LABELS[i]}
              </p>
              <span
                className={`mx-auto my-2 block w-fit ${
                  isActive ? "text-gold-light" : "text-parchment-dim"
                }`}
              >
                <RuneGlyph name={name} size={34} glow={isActive} />
              </span>
              <p className="font-serif text-lg leading-tight text-parchment">
                {name}
              </p>
              <p className="mt-1 text-[12px] leading-4 text-parchment-dim">
                {rune?.upright.keywords.join(", ")}
              </p>
            </div>
          );
        })}
      </div>

      {/* The exact birth date lands on one of the two — say so, otherwise the
          Solar card below looks like it is repeating this one. */}
      <p className="mt-3 text-[12px] leading-5 text-parchment-dim">
        Doğum tarihin{" "}
        <span className="text-gold-light">{activeRuneName}</span> yarısına
        düşüyor.
      </p>

      <MysticDivider className="my-6" />

      <p className="prose-reading text-left text-parchment-dim">{sign.reading}</p>

      <div className="mt-5 rounded-lg border border-hairline bg-ink-soft/70 p-4 text-left">
        <p className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-gold">
          Burç Tılsımı
        </p>
        <p className="text-[15px] leading-6 text-parchment-dim">{sign.bindrune}</p>
      </div>
    </MysticCard>
  );
}
