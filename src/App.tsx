import { useState } from "react";
import OraclePage from "./components/OraclePage";
import BirthRunePage from "./components/BirthRunePage";
import BindruneDesigner from "./components/BindruneDesigner";

type View = "oracle" | "birthRune" | "bindrune";

const NAV: { key: View; label: string; description: string }[] = [
  { key: "oracle", label: "Rune Falı", description: "Anlık kehanet çek" },
  { key: "birthRune", label: "Doğum Rune'si", description: "Doğum haritanı öğren" },
  { key: "bindrune", label: "Tılsım", description: "Kendi tılsımını tasarla" },
];

function App() {
  const [view, setView] = useState<View>("oracle");

  return (
    <div className="min-h-screen bg-stone-950 bg-[radial-gradient(ellipse_at_top,_rgba(120,90,40,0.15),_transparent_60%)] text-stone-200">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-4 py-10 sm:py-16">
        <header className="mb-8 text-center">
          <span
            className="emblem-pulse mx-auto mb-1 block text-6xl text-amber-200 sm:text-7xl"
            aria-hidden="true"
          >
            ᛉ
          </span>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-300/80">
            Elder Futhark
          </p>
          <h1 className="font-serif text-4xl text-amber-50 sm:text-5xl">
            Rune Kahini
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-stone-400">
            İçinden bir soru geçir, taşları karıştır ve eski Rune'lerin sana ne
            söylediğini keşfet.
          </p>
        </header>

        <nav className="mb-8 grid w-full max-w-lg grid-cols-3 gap-1 rounded-lg border border-stone-800 bg-stone-900/40 p-1">
          {NAV.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => setView(n.key)}
              className={`rounded-md px-2 py-2 text-center transition sm:px-4 ${
                view === n.key
                  ? "bg-amber-200/10 text-amber-100"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <span className="block text-sm font-medium">{n.label}</span>
              <span
                className={`mt-0.5 block text-[10px] ${
                  view === n.key ? "text-amber-200/60" : "text-stone-500"
                }`}
              >
                {n.description}
              </span>
            </button>
          ))}
        </nav>

        {view === "oracle" && <OraclePage />}
        {view === "birthRune" && <BirthRunePage />}
        {view === "bindrune" && <BindruneDesigner />}

        <footer className="mt-16 text-center text-xs text-stone-400">
          Eğlence ve öz-yansıma amaçlıdır — tıbbi, hukuki ya da finansal tavsiye
          yerine geçmez.
        </footer>
      </div>
    </div>
  );
}

export default App;
