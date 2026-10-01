import type { DrawnRune } from "../data/runes";
import { REALMS } from "../theme/realms";
import CarvedRune from "./ui/CarvedRune";

interface RuneStoneProps {
  drawn?: DrawnRune;
  revealed: boolean;
  onClick?: () => void;
  label?: string;
  delay?: number;
  /** Stone photo; defaults to the reading realm's basalt. */
  stone?: string;
}

/**
 * A real stone that turns over: face-down it is the bare stone, face-up the
 * same stone with the rune carved and gilded into it (CarvedRune). The flip is
 * the existing CSS 3D turn; only the faces changed from drawn tiles to photos.
 */
export default function RuneStone({
  drawn,
  revealed,
  onClick,
  label,
  delay = 0,
  stone = REALMS.fire.stone,
}: RuneStoneProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <span className="text-[11px] uppercase tracking-[0.18em] text-gold">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        aria-label={revealed && drawn ? drawn.rune.name : "Taşı çevir"}
        style={{ animationDelay: `${delay}ms` }}
        className={`stone-flip group relative h-28 w-28 [perspective:1000px] sm:h-32 sm:w-32 ${
          onClick ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div
          className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
            revealed ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Face down: the bare stone, a touch darker, inviting a tap. */}
          <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
            <CarvedRune
              stone={stone}
              runes={[]}
              size={128}
              blank
              className="h-full w-full brightness-[0.8] drop-shadow-[0_8px_14px_rgba(0,0,0,0.6)] transition group-hover:brightness-95"
            />
            {onClick && (
              <span className="stone-hint-pulse absolute bottom-3 text-[9px] uppercase tracking-[0.15em] text-gold-light">
                Dokun
              </span>
            )}
          </div>

          {/* Face up: the same stone, carved and gilded. */}
          <div
            className={`absolute inset-0 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${
              revealed ? "stone-breathe" : ""
            }`}
          >
            {drawn && (
              <CarvedRune
                stone={stone}
                runes={[drawn.rune.name]}
                reversed={drawn.reversed}
                size={128}
                className={`h-full w-full drop-shadow-[0_8px_14px_rgba(0,0,0,0.6)] ${
                  revealed ? "reveal-flare" : ""
                }`}
              />
            )}
          </div>
        </div>
      </button>
      {drawn && revealed && (
        // No uppercase: under lang="tr" CSS turns "Algiz" into "ALGİZ".
        <span className="animate-fade-in px-1 text-center text-[13px] tracking-[0.06em] text-gold">
          {drawn.rune.name}
          {drawn.reversed ? " (Ters)" : ""}
        </span>
      )}
    </div>
  );
}
