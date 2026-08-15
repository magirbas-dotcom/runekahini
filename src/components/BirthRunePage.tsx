import { useState } from "react";
import { calculateBirthProfile, type BirthRuneProfile } from "../data/birthRune";
import BirthRuneCard from "./BirthRuneCard";

export default function BirthRunePage() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [profile, setProfile] = useState<BirthRuneProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1000) {
      setError("Lütfen geçerli bir doğum tarihi girin.");
      return;
    }

    const h = hour === "" ? 12 : Number(hour);
    const min = minute === "" ? 0 : Number(minute);
    if (h < 0 || h > 23 || min < 0 || min > 59) {
      setError("Lütfen geçerli bir saat girin (saat isteğe bağlıdır).");
      return;
    }

    setProfile(calculateBirthProfile(d, m, y, h, min));
  }

  function reset() {
    setProfile(null);
  }

  return (
    <div className="flex w-full flex-col items-center">
      {!profile ? (
        <form
          onSubmit={handleCalculate}
          className="w-full max-w-md rounded-2xl border border-amber-200/10 bg-stone-900/50 p-6 shadow-xl backdrop-blur-sm"
        >
          <p className="mb-5 text-xs uppercase tracking-wider text-amber-200/80">
            Doğum Tarihiniz
          </p>

          <div className="mb-4 grid grid-cols-3 gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Gün"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="rounded-lg border border-stone-700 bg-stone-950/60 p-2.5 text-center text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber-300/50 focus:outline-none"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Ay"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-lg border border-stone-700 bg-stone-950/60 p-2.5 text-center text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber-300/50 focus:outline-none"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Yıl"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-lg border border-stone-700 bg-stone-950/60 p-2.5 text-center text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber-300/50 focus:outline-none"
            />
          </div>

          <p className="mb-2 text-xs uppercase tracking-wider text-amber-200/80">
            Doğum Saati (isteğe bağlı)
          </p>
          <div className="mb-5 grid grid-cols-2 gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Saat (0-23)"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="rounded-lg border border-stone-700 bg-stone-950/60 p-2.5 text-center text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber-300/50 focus:outline-none"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Dakika"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="rounded-lg border border-stone-700 bg-stone-950/60 p-2.5 text-center text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber-300/50 focus:outline-none"
            />
          </div>

          {error && <p className="mb-4 text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-amber-200/90 py-2.5 text-sm font-medium text-stone-900 shadow transition hover:bg-amber-100"
          >
            Rune Profilimi Hesapla
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-stone-400">
            Bu hesaplama modern numerolojik bir yorumdur; tarihsel bir Viking
            pratiği değildir. Doğum saati bilinmiyorsa öğlen (12:00) varsayılır.
          </p>
        </form>
      ) : (
        <div className="w-full">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <BirthRuneCard
              title="Kader Yolu Rune'si"
              description="Hayattaki temel amacınızı ve potansiyelinizi gösterir."
              rune={profile.lifePathRune}
            />
            <BirthRuneCard
              title="Solar Doğum Rune'si"
              description="Öz ruhsal karakterinizi ve temel yaşam enerjinizi simgeler."
              rune={profile.solarBirthRune}
            />
            <BirthRuneCard
              title="Doğum Saati Rune'si"
              description="Dış dünyaya gösterdiğiniz maskeyi ve sosyal karakterinizi temsil eder."
              rune={profile.birthHourRune}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-400 transition hover:border-stone-600 hover:text-stone-200"
            >
              Yeniden Hesapla
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-stone-400">
            Bu hesaplama modern numerolojik bir yorumdur; tarihsel bir Viking
            pratiği değildir.
          </p>
        </div>
      )}
    </div>
  );
}
