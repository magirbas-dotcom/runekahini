import { useState } from "react";
import { clearReadings, type StoredReading } from "../data/storage";
import MysticCard from "./ui/MysticCard";
import SectionHeader from "./ui/SectionHeader";
import RuneGlyph from "./ui/RuneGlyph";

interface ReadingHistoryProps {
  readings: StoredReading[];
  onCleared: () => void;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Bu cihazda yapılmış son okumalar. Kapalı gelir — ana ekranı doldurmasın,
 * isteyen açsın. Kayıtlar yalnızca cihazda durur, hiçbir yere gönderilmez.
 */
export default function ReadingHistory({
  readings,
  onCleared,
}: ReadingHistoryProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (readings.length === 0) return null;

  return (
    <div className="mt-6 w-full max-w-md">
      <SectionHeader>Geçmiş Okumalar</SectionHeader>

      <MysticCard className="overflow-hidden">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] uppercase tracking-[0.16em] text-gold">
              Bu cihazda
            </span>
            <span className="mt-1 block text-[12px] leading-4 text-parchment-dim">
              {readings.length} okuma
            </span>
          </span>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-surface-gold/60 text-gold-light transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6.5 L8 10.5 L12 6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {open && (
          <div className="border-t border-hairline">
            <ul>
              {readings.map((r) => (
                <li
                  key={r.id}
                  className="border-b border-hairline px-4 py-3.5 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12px] text-parchment-dim">
                      {formatWhen(r.at)}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-gold">
                      {r.spread}
                    </span>
                  </div>

                  {/* Kullanıcının kendi yazdığı metin: Cinzel küçük-kapital
                      bastığı için "i" harfini noktasız I yapıyordu. Serbest
                      metin gövde fontuyla yazılır. */}
                  {r.question && (
                    <p className="mt-1.5 text-[14px] italic leading-snug text-parchment">
                      “{r.question}”
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                    {r.runes.map((rn, i) => (
                      <span
                        key={`${r.id}-${i}`}
                        className="flex items-center gap-1.5 text-[12px] text-parchment-dim"
                      >
                        <span className="text-gold-light">
                          <RuneGlyph
                            name={rn.name}
                            size={18}
                            reversed={rn.reversed}
                            glow={false}
                          />
                        </span>
                        {rn.name}
                        {rn.reversed && <span className="text-gold">(T)</span>}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-4 py-3.5 text-center">
              {confirming ? (
                <p className="text-[13px] leading-5 text-parchment-dim">
                  Tüm geçmiş silinsin mi?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      clearReadings();
                      setConfirming(false);
                      setOpen(false);
                      onCleared();
                    }}
                    className="text-gold underline underline-offset-2"
                  >
                    Sil
                  </button>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="text-parchment underline underline-offset-2"
                  >
                    Vazgeç
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="text-[13px] text-parchment-dim underline decoration-dotted underline-offset-4 transition hover:text-parchment"
                >
                  Geçmişi temizle
                </button>
              )}
            </div>
          </div>
        )}
      </MysticCard>
    </div>
  );
}
