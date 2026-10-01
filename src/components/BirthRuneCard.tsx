import { AETT_NAMES, type Rune } from "../data/runes";
import ReadingTabs from "./ReadingTabs";
import MysticCard from "./ui/MysticCard";
import MysticDivider from "./ui/MysticDivider";
import CarvedRune from "./ui/CarvedRune";
import { REALMS } from "../theme/realms";

interface BirthRuneCardProps {
  /** The role this rune plays, e.g. "Kader Yolu Rune'si". */
  title: string;
  description: string;
  rune: Rune;
  /** "primary" is the hero card; "secondary" is a compact, expandable card. */
  variant?: "primary" | "secondary";
  /** Secondary cards only — controlled accordion state. */
  expanded?: boolean;
  onToggle?: () => void;
}

export default function BirthRuneCard({
  title,
  description,
  rune,
  variant = "secondary",
  expanded,
  onToggle,
}: BirthRuneCardProps) {
  const keywords = rune.upright.keywords.join(" · ");

  if (variant === "primary") {
    return (
      <MysticCard tone="gold" grain className="animate-fade-in p-6 text-center sm:p-8">
        <p className="mb-5 text-[11px] uppercase tracking-[0.18em] text-gold">
          {title}
        </p>

        <CarvedRune
          stone={REALMS.aurora.stone}
          runes={[rune.name]}
          size={120}
          className="reveal-flare mx-auto drop-shadow-[0_10px_18px_rgba(0,0,0,0.6)]"
        />

        <h3 lang="en" className="mt-4 font-serif text-[32px] leading-tight text-parchment">
          {rune.name}
        </h3>
        <p className="mt-2 text-sm text-gold">{keywords}</p>
        <p className="mt-1.5 text-[13px] text-parchment-dim">
          {rune.pronunciation} · {rune.literalMeaning}
        </p>
        <p className="text-[13px] text-parchment-dim">
          {AETT_NAMES[rune.aett]} · {rune.element} Elementi
        </p>

        <MysticDivider className="my-6" />

        <p className="prose-reading mb-6 text-left text-parchment-dim">
          {description}
        </p>

        <div className="text-left">
          <ReadingTabs reading={rune.upright} />
        </div>

        <div className="inscription mt-6 p-4 text-left">
          <p className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-gold">
            Pratik İpucu
          </p>
          <p className="text-[15px] leading-6 text-parchment-dim">
            {rune.practicalNote}
          </p>
        </div>
      </MysticCard>
    );
  }

  const isOpen = !!expanded;

  return (
    <MysticCard className="animate-fade-in p-5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 text-left"
      >
        <CarvedRune
          stone={REALMS.aurora.stone}
          runes={[rune.name]}
          size={52}
          lite
          className="shrink-0 drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            {title}
          </span>
          <span lang="en" className="mt-0.5 block font-serif text-xl leading-tight text-parchment">
            {rune.name}
          </span>
          <span className="mt-0.5 block text-[13px] leading-5 text-parchment-dim">
            {keywords}
          </span>
        </span>
        <span
          className={`shrink-0 text-lg text-gold transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>

      {isOpen && (
        <div className="mt-5">
          <p className="prose-reading mb-5 text-parchment-dim">{description}</p>
          <ReadingTabs reading={rune.upright} />
          <div className="mt-5 rounded-lg border border-hairline bg-ink-soft/70 p-4">
            <p className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-gold">
              Pratik İpucu
            </p>
            <p className="text-[15px] leading-6 text-parchment-dim">
              {rune.practicalNote}
            </p>
          </div>
        </div>
      )}
    </MysticCard>
  );
}
