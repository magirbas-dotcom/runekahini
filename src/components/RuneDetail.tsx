import { AETT_NAMES, type DrawnRune } from "../data/runes";
import ReadingTabs from "./ReadingTabs";

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
      <span
        className={`text-4xl text-amber-100 ${reversed ? "inline-block rotate-180" : ""}`}
      >
        {rune.symbol}
      </span>
      <div className="flex-1 text-left">
        <h3 className="font-serif text-xl text-amber-50">
          {rune.name}
          {reversed && (
            <span className="ml-2 text-sm font-sans text-amber-300/70">
              (Ters)
            </span>
          )}
        </h3>
        {isOpen ? (
          <>
            <p className="text-xs text-stone-400">
              {rune.pronunciation} · {rune.literalMeaning}
            </p>
            <p className="text-xs text-stone-400">
              {AETT_NAMES[rune.aett]} · {rune.element} Elementi
            </p>
          </>
        ) : (
          <p className="text-xs text-stone-400">
            {reading.keywords.join(", ")}
          </p>
        )}
      </div>
      {collapsible && (
        <span
          className={`shrink-0 text-lg text-stone-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ⌄
        </span>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in rounded-2xl border border-amber-200/15 bg-stone-900/60 p-5 text-left shadow-xl backdrop-blur-sm sm:p-6">
      {positionLabel && (
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-300/90">
          {positionLabel}
        </p>
      )}

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
        <div className="mb-1">{header}</div>
      )}

      {isOpen && (
        <>
          {!rune.reversible && (
            <p className="mb-3 mt-3 text-xs italic text-stone-400">
              Simetrik yapısı gereği bu Rune'nin ters konumu yoktur — her zaman
              düz okunur.
            </p>
          )}

          <div className="mt-3">
            <ReadingTabs reading={reading} />
          </div>

          <div className="mt-4 rounded-lg border border-stone-800 bg-stone-950/40 p-3">
            <p className="mb-1 text-[11px] uppercase tracking-wider text-amber-200/70">
              Pratik İpucu
            </p>
            <p className="text-xs leading-relaxed text-stone-400">
              {rune.practicalNote}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
