import { AETT_NAMES, type DrawnRune } from "../data/runes";
import ReadingTabs from "./ReadingTabs";
import MysticCard from "./ui/MysticCard";
import SectionHeader from "./ui/SectionHeader";
import RuneGlyph from "./ui/RuneGlyph";

interface RuneDetailProps {
  drawn: DrawnRune;
  positionLabel?: string;
  /** When provided (together with onToggle), the card becomes a collapsible
   *  accordion item — tapping the header shows/hides the reading. Omit both
   *  props to always render fully expanded (used for single-rune contexts). */
  expanded?: boolean;
  onToggle?: () => void;
}

export default function RuneDetail({
  drawn,
  positionLabel,
  expanded,
  onToggle,
}: RuneDetailProps) {
  const { rune, reversed } = drawn;
  const reading = reversed && rune.reversed ? rune.reversed : rune.upright;
  const collapsible = typeof expanded === "boolean" && !!onToggle;
  const isOpen = collapsible ? expanded : true;

  const header = (
    <div className="flex items-center gap-4">
      <span className="shrink-0 text-gold-light">
        <RuneGlyph name={rune.name} size={44} strokeWidth={6} reversed={reversed} />
      </span>
      <div className="flex-1 text-left">
        <h3 className="font-serif text-2xl leading-tight text-parchment">
          {rune.name}
          {reversed && (
            <span className="ml-2 font-sans text-sm text-gold">(Ters)</span>
          )}
        </h3>
        {isOpen ? (
          <div className="mt-1 space-y-0.5">
            <p className="text-[13px] text-parchment-dim">
              {rune.pronunciation} · {rune.literalMeaning}
            </p>
            <p className="text-[13px] text-parchment-dim">
              {AETT_NAMES[rune.aett]} · {rune.element} Elementi
            </p>
          </div>
        ) : (
          <p className="mt-1 text-[13px] text-parchment-dim">
            {reading.keywords.join(", ")}
          </p>
        )}
      </div>
      {collapsible && (
        <span
          className={`shrink-0 text-lg text-gold transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ⌄
        </span>
      )}
    </div>
  );

  return (
    <MysticCard grain className="animate-fade-in p-5 text-left sm:p-6">
      {positionLabel && <SectionHeader align="left">{positionLabel}</SectionHeader>}

      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          className="w-full"
          aria-expanded={isOpen}
        >
          {header}
        </button>
      ) : (
        <div>{header}</div>
      )}

      {isOpen && (
        <>
          {!rune.reversible && (
            <p className="mt-4 text-[13px] italic leading-relaxed text-parchment-dim">
              Simetrik yapısı gereği bu Rune'nin ters konumu yoktur — her zaman
              düz okunur.
            </p>
          )}

          <div className="mt-4">
            <ReadingTabs reading={reading} />
          </div>

          <div className="mt-5 rounded-lg border border-hairline bg-ink-soft/70 p-4">
            <p className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-gold">
              Pratik İpucu
            </p>
            <p className="text-[15px] leading-6 text-parchment-dim">
              {rune.practicalNote}
            </p>
          </div>
        </>
      )}
    </MysticCard>
  );
}
