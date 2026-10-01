import { useLayoutEffect, useRef, useState } from "react";
import type { RuneWord } from "../../data/transliterate";
import { REALMS } from "../../theme/realms";
import CarvedRune from "./CarvedRune";

interface NameRunesProps {
  words: RuneWord[];
  className?: string;
}

/**
 * A name written in runes: one carved stone per rune with the letter it stands
 * for underneath. Words are divided by two stacked dots — the word separator
 * of actual runic inscriptions.
 */
export default function NameRunes({ words, className = "" }: NameRunesProps) {
  const count = words.reduce((n, w) => n + w.runes.length, 0);
  // Shrink stones as the name grows so a full name still fits two rows.
  const size = count <= 6 ? 50 : count <= 10 ? 42 : 36;
  // The two-dot divider only reads as one when the words share a line; once
  // they wrap, each word gets its own line instead (a divider would otherwise
  // start the second line). Measured against the real column width, which
  // runs from ~288px on a 320px phone to ~400px.
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const oneLine = count * (size + 4) + (words.length - 1) * 22 <= width;

  return (
    <div
      ref={ref}
      className={`flex justify-center gap-y-3 ${oneLine ? "flex-row items-start" : "flex-col items-center"} ${className}`}
    >
      {words.map((w, wi) => (
        <div key={wi} className="flex flex-wrap items-start justify-center">
          {wi > 0 && oneLine && (
            <span className="mx-1.5 flex flex-col gap-1.5 self-center pb-5" aria-hidden="true">
              <span className="block h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="block h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
          )}
          {w.letters.map((l, li) => (
            // A letter written with two runes (c, ç, x) is one unit: the
            // stones sit closer, a gold bracket joins them, the letter is
            // printed once.
            <span key={li} className="flex flex-col items-center px-0.5">
              <span className={`flex ${l.runes.length > 1 ? "-space-x-1" : ""}`}>
                {l.runes.map((rune, ri) => (
                  <CarvedRune
                    key={ri}
                    stone={REALMS.forest.stone}
                    runes={[rune]}
                    size={size}
                    face={0.7}
                    weight={3.2}
                    lite
                    className="drop-shadow-[0_3px_5px_rgba(0,0,0,0.6)]"
                  />
                ))}
              </span>
              {/* Present on every letter (invisible on single runes) so all
                  the letters underneath stay on one baseline. */}
              <span
                className={`mt-0.5 block h-1 w-[calc(100%-1.25rem)] rounded-b-sm border-x border-b ${
                  l.runes.length > 1 ? "border-gold/80" : "border-transparent"
                }`}
                aria-hidden="true"
              />
              <span className="mt-1 text-[12px] font-medium leading-none text-gold-light">{l.from}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
