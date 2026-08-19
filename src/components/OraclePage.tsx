import { useMemo, useState } from "react";
import { AETT_NAMES, drawDailyRune, drawRunes, runes, type DrawnRune } from "../data/runes";
import { buildSynergySummary } from "../data/synergy";
import RuneStone from "./RuneStone";
import RuneDetail from "./RuneDetail";
import MysticCard from "./ui/MysticCard";
import SectionHeader from "./ui/SectionHeader";
import MysticDivider from "./ui/MysticDivider";
import GoldButton from "./ui/GoldButton";
import RuneGlyph from "./ui/RuneGlyph";
import SpreadOptionCard from "./ui/SpreadOptionCard";

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
  // Both the key and the displayed date come from the local calendar day.
  // toISOString() would give the UTC day, which in UTC+3 meant the header
  // showed tomorrow between local midnight and 03:00 while the rune was
  // still yesterday's.
  const todayKey = useMemo(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  }, []);
  const daily = useMemo(() => drawDailyRune(todayKey), [todayKey]);
  // The card starts collapsed: its header already names the rune and lists
  // its keywords, so the full reading stays one tap away rather than filling
  // the home screen before the user has asked for it.
  const [detailOpen, setDetailOpen] = useState(false);
  const formattedDate = useMemo(
    () =>
      new Date().toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [todayKey],
  );

  return (
    <div className="mb-6 w-full max-w-md">
      <SectionHeader>{formattedDate} · Günün Rune'si</SectionHeader>
      <RuneDetail
        drawn={daily}
        expanded={detailOpen}
        onToggle={() => setDetailOpen((v) => !v)}
      />
    </div>
  );
}

export default function OraclePage() {
  const [question, setQuestion] = useState("");
  const [spreadType, setSpreadType] = useState<SpreadType>("single");
  const [drawn, setDrawn] = useState<DrawnRune[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showAlphabet, setShowAlphabet] = useState(false);
  const [showEthics, setShowEthics] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const count =
    spreadType === "single" ? 1 : spreadType === "three" ? 3 : spreadType === "four" ? 4 : 5;
  const allRevealed = revealed.length > 0 && revealed.every(Boolean);

  function handleDraw() {
    setIsDrawing(true);
    // A short beat before the stones land — makes "çekmek" feel like an
    // action taken, not an instant state flip.
    window.setTimeout(() => {
      const result = drawRunes(count);
      setDrawn(result);
      setRevealed(new Array(result.length).fill(false));
      setIsDrawing(false);
    }, 550);
  }

  function revealStone(index: number) {
    setRevealed((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    // Newly revealed stone opens its card and collapses the rest — keeps a
    // multi-rune spread from turning into one long scroll on mobile.
    setExpandedIndex(index);
  }

  function revealAll() {
    setRevealed(new Array(drawn.length).fill(true));
    // Bulk reveal: start with everything collapsed to a compact list; the
    // user picks which one to read first instead of scrolling past all of them.
    setExpandedIndex(null);
  }

  function toggleExpanded(index: number) {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }

  function reset() {
    setDrawn([]);
    setRevealed([]);
    setExpandedIndex(null);
  }

  return (
    <div className="flex w-full flex-col items-center">
      {drawn.length === 0 && <DailyRune />}

      {drawn.length === 0 ? (
        <MysticCard grain className="w-full max-w-md p-6">
          {/* Spread choice comes first: it's the primary decision and, on a
              phone, used to sit far enough below the optional question field
              that it required scrolling before the draw button was even
              visible. */}
          <SectionHeader align="left">Açılım Seçimi</SectionHeader>
          <div className="mb-6 grid grid-cols-2 gap-2.5">
            {(Object.keys(SPREAD_TITLES) as SpreadType[]).map((type) => (
              <SpreadOptionCard
                key={type}
                label={SPREAD_TITLES[type]}
                diagram={type}
                selected={spreadType === type}
                onClick={() => setSpreadType(type)}
              />
            ))}
          </div>

          {/* "Sorun" read as the Turkish word for "problem" rather than as
              "your question" — renamed to an imperative phrase, matching the
              "Niyetini Seç" tone used in the Tılsım screen. */}
          <SectionHeader align="left">Bir Soru Sor (İsteğe Bağlı)</SectionHeader>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Örn. Bu dönemde neye odaklanmalıyım?"
            rows={3}
            className="mb-6 w-full resize-none rounded-lg border border-hairline bg-ink-soft/70 p-3.5 text-[15px] leading-6 text-parchment transition placeholder:text-parchment-mute focus:border-hairline-strong focus:outline-none"
          />

          <GoldButton
            onClick={handleDraw}
            disabled={isDrawing}
            className="w-full py-3"
          >
            {isDrawing ? (
              <>
                <span
                  className="shuffle-spinner h-4 w-4 rounded-full border-2 border-ink/25 border-t-ink"
                  aria-hidden="true"
                />
                Taşlar Karıştırılıyor…
              </>
            ) : (
              "Taşları Çek"
            )}
          </GoldButton>

          <button
            type="button"
            onClick={() => setShowEthics((v) => !v)}
            className="mt-5 w-full text-center text-xs text-parchment-dim underline decoration-dotted underline-offset-4 transition hover:text-parchment"
          >
            {showEthics ? "Kullanım ilkelerini gizle" : "Kullanım ilkeleri"}
          </button>
          {showEthics && (
            <p className="mt-3 text-[15px] leading-6 text-parchment-dim">
              Rune okuması yalnızca kendi hayatın için niyet taşımalı — başka
              birinin özgür iradesine karışmak ya da rızası olmadan onun adına
              çalışmak için kullanılmamalı. Gönderdiğin niyet, iyi ya da kötü,
              er ya da geç kendine döner; bu yüzden en dürüst okuma, kendi
              sorumluluğunu üstlenerek sorduğun okumadır.
            </p>
          )}
        </MysticCard>
      ) : (
        <section className="w-full">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={reset}
              aria-label="Yeniden çek"
              title="Yeniden çek"
              className="shrink-0 rounded-full border border-hairline p-2.5 text-gold transition hover:border-hairline-strong hover:bg-surface-gold/50"
            >
              <span className="block text-base leading-none">↻</span>
            </button>
          </div>

          {question.trim() && (
            <p className="mb-4 text-center font-serif text-lg italic leading-relaxed text-parchment-dim">
              “{question.trim()}”
            </p>
          )}

          {!allRevealed && (
            <p className="mb-6 text-center text-sm text-gold">
              Anlamlarını görmek için taşlara dokun
            </p>
          )}

          {spreadType === "five" ? (
            <div className="mx-auto mb-9 grid w-fit grid-cols-3 grid-rows-3 place-items-center gap-4 sm:gap-6">
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
            <div className="mb-9 flex flex-wrap justify-center gap-6 sm:gap-10">
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

          {revealed.some(Boolean) && (
            <div className="mb-9 flex flex-col gap-4">
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
                      {...(spreadType !== "single"
                        ? {
                            expanded: expandedIndex === i,
                            onToggle: () => toggleExpanded(i),
                          }
                        : {})}
                    />
                  ),
              )}
            </div>
          )}

          {allRevealed && drawn.length > 1 && (
            <MysticCard
              tone="gold"
              grain
              className="animate-fade-in mb-9 p-6 text-left"
            >
              <SectionHeader>Bütünsel Değerlendirme</SectionHeader>
              <p className="prose-reading text-parchment-dim">
                {buildSynergySummary(spreadType, drawn)}
              </p>
              <MysticDivider className="mt-5" />
            </MysticCard>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {!allRevealed && (
              <GoldButton variant="ghost" onClick={revealAll}>
                Tümünü Aç
              </GoldButton>
            )}
            <GoldButton variant="quiet" onClick={reset}>
              Yeniden Çek
            </GoldButton>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setShowAlphabet((v) => !v)}
        className="mt-14 text-xs uppercase tracking-[0.18em] text-gold underline decoration-dotted underline-offset-4 transition hover:text-gold-light"
      >
        {showAlphabet ? "Rune Rehberini Gizle" : "Rune Rehberini Göster"}
      </button>

      {showAlphabet && (
        <section className="mt-6 w-full">
          <MysticCard grain className="mb-8 w-full p-6">
            <h2 className="mb-4 font-serif text-2xl text-parchment">
              Rune Taşları Nedir?
            </h2>
            <p className="prose-reading mb-4 text-parchment-dim">
              Elder Futhark, MS 150–800 yılları arasında Kuzey ve Orta
              Avrupa'daki Germen halkları tarafından kullanılan, günümüze
              ulaşan en eski Rune alfabesidir. 24 semboldan oluşur; her Rune
              hem bir ses değeri hem de kendi başına bir sembolizm taşır.
            </p>
            <p className="prose-reading mb-4 text-parchment-dim">
              Rune'ler sekizerli üç gruba (Aettir) ayrılır:{" "}
              <span className="text-gold-light">Freyr &amp; Freyja Ailesi</span>{" "}
              maddi dünyayı ve günlük yaşamı,{" "}
              <span className="text-gold-light">Heimdall Ailesi</span> sınavları
              ve dönüşümü, <span className="text-gold-light">Tyr Ailesi</span>{" "}
              ise adaleti ve ruhsal olgunluğu temsil eder.
            </p>
            <p className="prose-reading mb-4 text-parchment-dim">
              9 Rune (Gebo, Hagalaz, Nauthiz, Isa, Jera, Eihwaz, Sowilo, Ingwaz,
              Dagaz) simetrik yapıları gereği hiçbir zaman ters dönmez. Her
              Rune ayrıca dört klasik elementten (Ateş, Toprak, Hava, Su)
              biriyle ilişkilendirilir — tılsım tasarlarken birbirini
              tamamlayan elementleri seçmek işine yarayabilir.
            </p>
            <p className="prose-reading text-parchment-dim">
              Bazı modern setlerde 25. bir <span className="text-gold-light">boş
              Rune</span> bulunur. Bu, kadim yazıtlarda ya da Rune şiirlerinde
              geçmez; 1982'de Ralph Blum'un eklediği çağdaş bir icattır. Elder
              Futhark 24 semboldür ve bu uygulama o saf hâline sadık kalır.
            </p>
          </MysticCard>

          {([1, 2, 3] as const).map((aettNum) => (
            <div key={aettNum} className="mb-8 w-full">
              <SectionHeader>{AETT_NAMES[aettNum]}</SectionHeader>
              <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
                {runes
                  .filter((r) => r.aett === aettNum)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-3.5 rounded-lg border border-hairline bg-surface/70 p-3.5"
                    >
                      <span className="shrink-0 text-gold">
                        <RuneGlyph name={r.name} size={30} strokeWidth={7} glow={false} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] text-parchment">
                          {r.name}{" "}
                          <span className="text-xs text-gold">
                            · {r.element}
                          </span>
                        </p>
                        <p className="text-[13px] leading-5 text-parchment-dim">
                          {r.upright.keywords.join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
