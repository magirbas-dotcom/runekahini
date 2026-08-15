import { AETT_NAMES, type Rune } from "../data/runes";
import ReadingTabs from "./ReadingTabs";

interface BirthRuneCardProps {
  title: string;
  description: string;
  rune: Rune;
}

export default function BirthRuneCard({ title, description, rune }: BirthRuneCardProps) {
  return (
    <div className="animate-fade-in flex-1 rounded-2xl border border-amber-200/15 bg-stone-900/60 p-5 text-left shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-xs uppercase tracking-[0.2em] text-amber-300/90">{title}</p>
      <p className="mb-4 text-xs text-stone-400">{description}</p>

      <div className="mb-3 flex items-center gap-4">
        <span className="text-4xl text-amber-100">{rune.symbol}</span>
        <div>
          <h3 className="font-serif text-xl text-amber-50">{rune.name}</h3>
          <p className="text-xs text-stone-400">
            {rune.pronunciation} · {rune.literalMeaning}
          </p>
          <p className="text-xs text-stone-400">
            {AETT_NAMES[rune.aett]} · {rune.element} Elementi
          </p>
        </div>
      </div>

      <ReadingTabs reading={rune.upright} />

      <div className="mt-4 rounded-lg border border-stone-800 bg-stone-950/40 p-3">
        <p className="mb-1 text-[11px] uppercase tracking-wider text-amber-200/70">
          Pratik İpucu
        </p>
        <p className="text-xs leading-relaxed text-stone-400">
          {rune.practicalNote}
        </p>
      </div>
    </div>
  );
}
