import { useState } from "react";
import type { RuneReading } from "../data/runes";

type Tab = "general" | "love" | "career";

const TABS: { key: Tab; label: string }[] = [
  { key: "general", label: "Genel" },
  { key: "love", label: "Aşk" },
  { key: "career", label: "Kariyer" },
];

interface ReadingTabsProps {
  reading: RuneReading;
}

/** Keyword chips + Genel/Aşk/Kariyer tab switcher, shared by RuneDetail and BirthRuneCard. */
export default function ReadingTabs({ reading }: ReadingTabsProps) {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <>
      <div className="mb-3 flex flex-wrap gap-2">
        {reading.keywords.map((k) => (
          <span
            key={k}
            className="rounded-full border border-amber-200/20 bg-amber-200/5 px-2.5 py-0.5 text-xs text-amber-200/80"
          >
            {k}
          </span>
        ))}
      </div>

      <div className="mb-3 flex gap-1 border-b border-stone-800">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-3 py-1.5 text-xs uppercase tracking-wider transition ${
              tab === t.key
                ? "border-amber-300 text-amber-200"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-stone-300">{reading[tab]}</p>
    </>
  );
}
