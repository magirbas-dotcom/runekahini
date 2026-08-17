import { useState } from "react";
import type { RuneReading } from "../data/runes";
import RuneChip from "./ui/RuneChip";

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
      <div className="mb-4 flex flex-wrap gap-2">
        {reading.keywords.map((k) => (
          <RuneChip key={k}>{k}</RuneChip>
        ))}
      </div>

      <div className="mb-4 flex gap-1 border-b border-hairline">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-selected={tab === t.key}
            className={`-mb-px border-b-2 px-3 py-2 text-xs uppercase tracking-[0.14em] transition duration-200 ${
              tab === t.key
                ? "border-gold text-gold-light"
                : "border-transparent text-parchment-dim hover:text-parchment"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="prose-reading text-parchment-dim">{reading[tab]}</p>
    </>
  );
}
