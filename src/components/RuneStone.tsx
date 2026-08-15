import type { DrawnRune } from "../data/runes";

interface RuneStoneProps {
  drawn?: DrawnRune;
  revealed: boolean;
  onClick?: () => void;
  label?: string;
  delay?: number;
}

export default function RuneStone({
  drawn,
  revealed,
  onClick,
  label,
  delay = 0,
}: RuneStoneProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <span className="text-xs uppercase tracking-[0.2em] text-amber-200/80">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        style={{ animationDelay: `${delay}ms` }}
        className={`stone-flip group relative h-32 w-24 sm:h-40 sm:w-28 [perspective:1000px] ${
          onClick ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div
          className={`relative h-full w-full rounded-xl transition-transform duration-700 [transform-style:preserve-3d] ${
            revealed ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Back of stone */}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-amber-200/20 bg-gradient-to-br from-stone-800 via-stone-900 to-black shadow-lg [backface-visibility:hidden] group-hover:border-amber-200/40">
            <div className="h-10 w-10 rounded-full border border-amber-100/10 bg-gradient-to-br from-amber-100/5 to-transparent" />
          </div>

          {/* Front of stone */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl border border-amber-200/30 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-950 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <span
              className={`text-4xl sm:text-5xl text-amber-100 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)] ${
                drawn?.reversed ? "inline-block rotate-180" : ""
              }`}
            >
              {drawn?.rune.symbol ?? ""}
            </span>
            {drawn && (
              <span className="text-[11px] uppercase tracking-wider text-amber-200/90">
                {drawn.rune.name}
                {drawn.reversed ? " (Ters)" : ""}
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
