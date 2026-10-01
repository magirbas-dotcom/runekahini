import { useState, type ReactElement } from "react";
import OraclePage from "./components/OraclePage";
import BirthRunePage from "./components/BirthRunePage";
import BindruneDesigner from "./components/BindruneDesigner";
import ReloadPrompt from "./components/ReloadPrompt";
import IntroSplash from "./components/IntroSplash";
import RotateNotice from "./components/RotateNotice";
import CarvedRune from "./components/ui/CarvedRune";
import HeroEmblem from "./components/ui/HeroEmblem";
import RealmScene from "./components/ui/RealmScene";
import TalismanMedallion from "./components/ui/TalismanMedallion";
import { REALMS, type RealmName } from "./theme/realms";

type View = "oracle" | "birthRune" | "bindrune";

const VIEW_REALM: Record<View, RealmName> = {
  oracle: "fire",
  birthRune: "aurora",
  bindrune: "forest",
};

/* Nav marks: each tab shows its own realm's object — the basalt stone, the
 * frost-granite stone, the gold medallion — so the three sections read as
 * three places before a word is read. */
function OracleMark() {
  return <CarvedRune stone={REALMS.fire.stone} runes={["Ansuz"]} size={46} />;
}

function BirthRuneMark() {
  return <CarvedRune stone={REALMS.aurora.stone} runes={["Jera"]} size={46} />;
}

function TalismanMark() {
  return (
    <TalismanMedallion
      names={["Algiz"]}
      form="bindrune"
      offsets={{}}
      material="gold"
      size={50}
      emphasis={1.45}
      className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]"
    />
  );
}

const NAV: {
  key: View;
  label: string;
  description: string;
  Mark: () => ReactElement;
}[] = [
  { key: "oracle", label: "Rune Okuması", description: "Anlık kehanet çek", Mark: OracleMark },
  { key: "birthRune", label: "Doğum Rune'si", description: "Doğum haritanı öğren", Mark: BirthRuneMark },
  { key: "bindrune", label: "Tılsım", description: "Kendi tılsımını tasarla", Mark: TalismanMark },
];

function App() {
  const [view, setView] = useState<View>("oracle");
  const realm = REALMS[VIEW_REALM[view]];

  return (
    <div className={`relative min-h-screen bg-ink text-parchment ${realm.className}`}>
      {/* Each tab lives in its own living photographic realm (RealmScene). */}
      <RealmScene realm={VIEW_REALM[view]} />
      <IntroSplash />
      <RotateNotice />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center px-4 py-6 sm:py-14">
        {/* Header trimmed down from its original size: on a phone it used to
            take most of the first screen by itself, pushing the actual
            action (spread choice, draw button) below the fold. */}
        <header className="mb-6 text-center">
          <HeroEmblem size={150} />
          <p className="mb-1 mt-1 text-xs uppercase tracking-[0.36em] text-gold">
            Elder Futhark
          </p>
          <h1 className="gilded-text font-serif text-4xl sm:text-5xl">Rune Kahini</h1>
          <p className="mx-auto mt-2.5 max-w-sm text-[15px] leading-6 text-parchment-dim">
            İçinden bir soru geçir, taşları karıştır ve eski Rune'lerin sana ne
            söylediğini keşfet.
          </p>
        </header>

        <nav className="mb-6 grid w-full max-w-lg grid-cols-3 gap-2">
          {NAV.map((n) => {
            const active = view === n.key;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => setView(n.key)}
                aria-current={active ? "page" : undefined}
                className={`nav-card flex flex-col items-center gap-1 rounded-card border px-2 py-2.5 text-center transition duration-300 active:scale-[0.98] ${
                  active
                    ? "is-active border-hairline-strong bg-surface-gold/70 text-gold-light"
                    : "border-hairline bg-surface/60 text-parchment-dim hover:border-hairline-strong hover:text-parchment"
                }`}
              >
                <span className="nav-mark">
                  <n.Mark />
                </span>
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

        {/* Keyed on the view so each tab's content rises in when switched to. */}
        <div key={view} className="view-enter flex w-full flex-col items-center">
          {view === "oracle" && <OraclePage />}
          {view === "birthRune" && <BirthRunePage />}
          {view === "bindrune" && <BindruneDesigner />}
        </div>

        <footer className="mt-16 text-center text-xs leading-relaxed text-parchment-dim">
          Eğlence ve öz-yansıma amaçlıdır — tıbbi, hukuki ya da finansal tavsiye
          yerine geçmez.
          {/* Static pages in public/, outside the app (and outside the
              service worker's app-shell fallback, see vite.config.ts). */}
          <span className="mt-3 block">
            <a href="/gizlilik/" className="underline decoration-dotted underline-offset-4 hover:text-parchment">
              Gizlilik
            </a>
            <span className="mx-2" aria-hidden="true">·</span>
            <a href="/destek/" className="underline decoration-dotted underline-offset-4 hover:text-parchment">
              Destek
            </a>
          </span>
        </footer>
      </div>

      <ReloadPrompt />
    </div>
  );
}

export default App;
