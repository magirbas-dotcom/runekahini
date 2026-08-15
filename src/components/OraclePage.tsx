import { useMemo, useState } from "react";
import { drawDailyRune, drawRunes, runes, type DrawnRune } from "../data/runes";
import { buildSynergySummary } from "../data/synergy";
import RuneStone from "./RuneStone";
import RuneDetail from "./RuneDetail";

type SpreadType = "single" | "three" | "four" | "five";

const SPREAD_LABELS: Record<SpreadType, string[]> = {
  single: ["Cevap"],
  three: ["Geçmiş", "Şimdi", "Gelecek"],
  four: ["Senin Enerjin", "Sen", "Karşı Taraf", "Sonuç"],
  five: ["Merkez", "Sol (Geçmiş)", "Üst (Hedef)", "Alt (Engel)", "Sağ (Sonuç)"],
};

const SPREAD_TITLES: Record<SpreadType, string> = {
  single: "Tek Rune",
  three: "Geçmiş · Şimdi · Gelecek",
  four: "4'lü İlişki Açılımı",
  five: "5'li Haç Düzeni",
};

// Grid placement for the five-rune cross layout: [column, row] on a 3x3 grid.
const FIVE_POSITIONS: [number, number][] = [
  [2, 2], // Merkez
  [1, 2], // Sol
  [2, 1], // Üst
  [2, 3], // Alt
  [3, 2], // Sağ
];

function DailyRune() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const daily = useMemo(() => drawDailyRune(todayKey), [todayKey]);
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="mb-8 w-full max-w-md rounded-2xl border border-amber-200/10 bg-stone-900/30 p-5 text-center">
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-amber-200/70">
        Bugünün Rune'si
      </p>
      <div className="flex justify-center">
        <RuneStone
          drawn={daily}
          revealed={revealed}
          onClick={revealed ? undefined : () => setRevealed(true)}
        />
      </div>
      {revealed && (
        <div className="mt-4 text-left">
          <RuneDetail drawn={daily} />
        </div>
      )}
    </section>
  );
}

export default function OraclePage() {
  const [question, setQuestion] = useState("");
  const [spreadType, setSpreadType] = useState<SpreadType>("single");
  const [drawn, setDrawn] = useState<DrawnRune[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [showAlphabet, setShowAlphabet] = useState(false);
  const [showEthics, setShowEthics] = useState(false);

  const count =
    spreadType === "single" ? 1 : spreadType === "three" ? 3 : spreadType === "four" ? 4 : 5;
  const allRevealed = revealed.length > 0 && revealed.every(Boolean);

  function handleDraw() {
    const result = drawRunes(count);
    setDrawn(result);
    setRevealed(new Array(result.length).fill(false));
  }

  function revealStone(index: number) {
    setRevealed((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }

  function revealAll() {
    setRevealed(new Array(drawn.length).fill(true));
  }

  function reset() {
    setDrawn([]);
    setRevealed([]);
  }

  return (
    <div className="flex w-full flex-col items-center">
      {drawn.length === 0 && <DailyRune />}

      {drawn.length === 0 ? (
        <section className="w-full max-w-md rounded-2xl border border-amber-200/10 bg-stone-900/50 p-6 shadow-xl backdrop-blur-sm">
          <label
            htmlFor="question"
            className="mb-2 block text-xs uppercase tracking-wider text-amber-200/80"
          >
            Sorun (isteğe bağlı)
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Örn. Bu dönemde neye odaklanmalıyım?"
            rows={3}
            className="mb-5 w-full resize-none rounded-lg border border-stone-700 bg-stone-950/60 p-3 text-sm text-stone-200 placeholder:text-stone-600 focus:border-amber-300/50 focus:outline-none"
          />

          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(SPREAD_TITLES) as SpreadType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSpreadType(type)}
                className={`rounded-lg border px-2 py-2 text-xs transition ${
                  spreadType === type
                    ? "border-amber-300/60 bg-amber-200/10 text-amber-100"
                    : "border-stone-700 text-stone-400 hover:border-stone-600"
                }`}
              >
                {SPREAD_TITLES[type]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDraw}
            className="w-full rounded-lg bg-amber-200/90 py-2.5 text-sm font-medium text-stone-900 shadow transition hover:bg-amber-100"
          >
            Taşları Çek
          </button>

          <button
            type="button"
            onClick={() => setShowEthics((v) => !v)}
            className="mt-4 w-full text-center text-[11px] text-stone-500 underline decoration-dotted underline-offset-4 hover:text-stone-300"
          >
            {showEthics ? "Kullanım ilkelerini gizle" : "Kullanım ilkeleri"}
          </button>
          {showEthics && (
            <p className="mt-3 text-xs leading-relaxed text-stone-400">
              Rune okuması yalnızca kendi hayatın için niyet taşımalı — başka
              birinin özgür iradesine karışmak ya da rızası olmadan onun adına
              çalışmak için kullanılmamalı. Gönderdiğin niyet, iyi ya da kötü,
              er ya da geç kendine döner; bu yüzden en dürüst okuma, kendi
              sorumluluğunu üstlenerek sorduğun okumadır.
            </p>
          )}
        </section>
      ) : (
        <section className="w-full">
          {question.trim() && (
            <p className="mb-6 text-center text-sm italic text-stone-400">
              “{question.trim()}”
            </p>
          )}

          {spreadType === "five" ? (
            <div className="mb-8 grid w-fit grid-cols-3 grid-rows-3 place-items-center gap-4 sm:gap-6 mx-auto">
              {drawn.map((d, i) => {
                const [col, row] = FIVE_POSITIONS[i];
                return (
                  <div key={i} style={{ gridColumn: col, gridRow: row }}>
                    <RuneStone
                      drawn={d}
                      revealed={revealed[i]}
                      onClick={revealed[i] ? undefined : () => revealStone(i)}
                      label={SPREAD_LABELS[spreadType][i]}
                      delay={i * 120}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mb-8 flex flex-wrap justify-center gap-6 sm:gap-10">
              {drawn.map((d, i) => (
                <RuneStone
                  key={i}
                  drawn={d}
                  revealed={revealed[i]}
                  onClick={revealed[i] ? undefined : () => revealStone(i)}
                  label={SPREAD_LABELS[spreadType][i]}
                  delay={i * 120}
                />
              ))}
            </div>
          )}

          {!allRevealed && (
            <p className="mb-6 text-center text-xs text-stone-400">
              Anlamını görmek için taşlara dokun.
            </p>
          )}

          {revealed.some(Boolean) && (
            <div className="mb-8 flex flex-col gap-4">
              {drawn.map(
                (d, i) =>
                  revealed[i] && (
                    <RuneDetail
                      key={i}
                      drawn={d}
                      positionLabel={
                        spreadType !== "single"
                          ? SPREAD_LABELS[spreadType][i]
                          : undefined
                      }
                    />
                  ),
              )}
            </div>
          )}

          {allRevealed && drawn.length > 1 && (
            <div className="animate-fade-in mb-8 rounded-2xl border border-amber-200/20 bg-gradient-to-br from-amber-200/5 to-transparent p-5 text-left sm:p-6">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-300/90">
                Bütünsel Değerlendirme
              </p>
              <p className="text-sm leading-relaxed text-stone-300">
                {buildSynergySummary(spreadType, drawn)}
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {!allRevealed && (
              <button
                type="button"
                onClick={revealAll}
                className="rounded-lg border border-amber-200/30 px-4 py-2 text-sm text-amber-100 transition hover:border-amber-200/60"
              >
                Tümünü Aç
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-400 transition hover:border-stone-600 hover:text-stone-200"
            >
              Yeniden Çek
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setShowAlphabet((v) => !v)}
        className="mt-12 text-xs uppercase tracking-wider text-stone-400 underline decoration-dotted underline-offset-4 hover:text-stone-200"
      >
        {showAlphabet ? "Rune Alfabesini Gizle" : "Rune Alfabesini Göster"}
      </button>

      {showAlphabet && (
        <section className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
          {runes.map((r) => (
            <div
              key={r.id}
              className="flex items-start gap-3 rounded-lg border border-stone-800 bg-stone-900/40 p-3"
            >
              <span className="text-2xl text-amber-100">{r.symbol}</span>
              <div>
                <p className="text-sm text-stone-200">
                  {r.name}{" "}
                  <span className="text-[11px] text-stone-500">· {r.element}</span>
                </p>
                <p className="text-xs text-stone-400">
                  {r.upright.keywords.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
