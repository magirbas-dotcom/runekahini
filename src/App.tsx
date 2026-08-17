import { useState, type ReactElement } from "react";
import OraclePage from "./components/OraclePage";
import BirthRunePage from "./components/BirthRunePage";
import BindruneDesigner from "./components/BindruneDesigner";
import RuneGlyph from "./components/ui/RuneGlyph";

type View = "oracle" | "birthRune" | "bindrune";

/* Small engraved marks for the nav — geometric rather than pictorial, so they
 * sit next to the runes without competing with them. */
function OracleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <path d="M12 4.5 L19.5 12 L12 19.5 L4.5 12 Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 8.5 L15.5 12 L12 15.5 L8.5 12 Z" stroke="currentColor" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

function BirthRuneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 L20 7.5 L20 16.5 L12 21 L4 16.5 L4 7.5 Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M12 3 L12 21 M4 7.5 L20 16.5 M20 7.5 L4 16.5" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
    </svg>
  );
}

function TalismanIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="7.5" r="3.4" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="16.5" cy="14" r="3.4" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="7.5" cy="14" r="3.4" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

const NAV: {
  key: View;
  label: string;
  description: string;
  Icon: () => ReactElement;
}[] = [
  { key: "oracle", label: "Rune Okuması", description: "Anlık kehanet çek", Icon: OracleIcon },
  { key: "birthRune", label: "Doğum Rune'si", description: "Doğum haritanı öğren", Icon: BirthRuneIcon },
  { key: "bindrune", label: "Tılsım", description: "Kendi tılsımını tasarla", Icon: TalismanIcon },
];

function App() {
  const [view, setView] = useState<View>("oracle");

  return (
    <div className="relative min-h-screen bg-ink text-parchment">
      {/* Warm light from above, then a vignette pulling the edges down —
          keeps the page from reading as a flat black rectangle. */}
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(199,163,74,0.13),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center px-4 py-10 sm:py-14">
        <header className="mb-9 text-center">
          <span
            className="emblem-pulse mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-hairline text-gold"
            aria-hidden="true"
          >
            <RuneGlyph name="Algiz" size={34} strokeWidth={7} />
          </span>
          <p className="mb-2 text-xs uppercase tracking-[0.32em] text-gold">
            Elder Futhark
          </p>
          <h1 className="font-serif text-4xl text-parchment sm:text-5xl">
            Rune Kahini
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-parchment-dim">
            İçinden bir soru geçir, taşları karıştır ve eski Rune'lerin sana ne
            söylediğini keşfet.
          </p>
        </header>

        <nav className="mb-9 grid w-full max-w-lg grid-cols-3 gap-2">
          {NAV.map((n) => {
            const active = view === n.key;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => setView(n.key)}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1.5 rounded-card border px-2 py-3 text-center transition duration-200 active:scale-[0.98] ${
                  active
                    ? "border-hairline-strong bg-surface-gold/70 text-gold-light"
                    : "border-hairline bg-surface/60 text-parchment-dim hover:border-hairline-strong hover:text-parchment"
                }`}
              >
                <n.Icon />
                <span className="text-[13px] font-medium leading-tight">
                  {n.label}
                </span>
                <span
                  className={`text-[10px] leading-tight ${
                    active ? "text-gold" : "text-parchment-mute"
                  }`}
                >
                  {n.description}
                </span>
              </button>
            );
          })}
        </nav>

        {view === "oracle" && <OraclePage />}
        {view === "birthRune" && <BirthRunePage />}
        {view === "bindrune" && <BindruneDesigner />}

        <footer className="mt-16 text-center text-xs leading-relaxed text-parchment-dim">
          Eğlence ve öz-yansıma amaçlıdır — tıbbi, hukuki ya da finansal tavsiye
          yerine geçmez.
        </footer>
      </div>
    </div>
  );
}

export default App;
