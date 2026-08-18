import type { DrawnRune } from "../data/runes";
import RuneGlyph from "./ui/RuneGlyph";

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
    <div className="flex flex-col items-center gap-2.5">
      {label && (
        <span className="text-[11px] uppercase tracking-[0.18em] text-gold">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        style={{ animationDelay: `${delay}ms` }}
        className={`stone-flip group relative h-32 w-24 [perspective:1000px] sm:h-40 sm:w-28 ${
          onClick ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div
          className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
            revealed ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Face down */}
          <div className="stone-face-back grain absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-stone border border-hairline [backface-visibility:hidden] group-hover:border-hairline-strong">
            <div
              className={`h-10 w-10 rounded-full border border-hairline bg-gradient-to-br from-gold/10 to-transparent ${
                onClick ? "stone-hint-pulse" : ""
              }`}
            />
            {onClick && (
              <span className="text-[9px] uppercase tracking-[0.15em] text-gold/70">
                Dokun
              </span>
            )}
          </div>

          {/* Face up — the glyph is carved into the stone, not printed on it:
              a dark offset copy underneath reads as the cut, the lit copy on
              top as the gold catching the light. */}
          <div
            className={`stone-face grain absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-stone border border-hairline-strong [backface-visibility:hidden] [transform:rotateY(180deg)] ${
              revealed ? "stone-breathe" : ""
            }`}
          >
            {drawn && (
              <span className="relative flex items-center justify-center">
                {/* The cut under the lit stroke. It must never be wider than
                    the gold copy above it: at strokeWidth 7 against the gold 6
                    it spilled out past the highlight, which swallowed thin
                    single-stroke runes like Isa in black. */}
                <span className="absolute translate-x-[1px] translate-y-[1px] text-black/60">
                  <RuneGlyph
                    name={drawn.rune.name}
                    size={54}
                    strokeWidth={6}
                    reversed={drawn.reversed}
                    glow={false}
                  />
                </span>
                <span className="relative text-gold-light">
                  <RuneGlyph
                    name={drawn.rune.name}
                    size={54}
                    strokeWidth={6}
                    reversed={drawn.reversed}
                  />
                </span>
              </span>
            )}
            {drawn && (
              <span className="px-1 text-center text-[10px] uppercase tracking-[0.12em] text-gold">
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
