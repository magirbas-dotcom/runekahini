import { useState } from "react";
import { calculateBirthProfile, type BirthRuneProfile } from "../data/birthRune";
import BirthRuneCard from "./BirthRuneCard";
import ZodiacCard from "./ZodiacCard";
import MysticCard from "./ui/MysticCard";
import SectionHeader from "./ui/SectionHeader";
import GoldButton from "./ui/GoldButton";
import MysticInput from "./ui/MysticInput";
import {
  clearBirthInput,
  loadBirthInput,
  saveBirthInput,
} from "../data/storage";

export default function BirthRunePage() {
  // Doğum bilgisi cihazda saklanıyorsa formu onunla aç — kullanıcı her
  // gelişinde aynı tarihi yeniden yazmasın. useState'in lazy başlatıcısı,
  // okumanın yalnızca ilk render'da yapılmasını sağlar.
  const saved = useState(loadBirthInput)[0];
  const [day, setDay] = useState(saved?.day ?? "");
  const [month, setMonth] = useState(saved?.month ?? "");
  const [year, setYear] = useState(saved?.year ?? "");
  const [hour, setHour] = useState(saved?.hour ?? "");
  const [minute, setMinute] = useState(saved?.minute ?? "");
  const [remembered, setRemembered] = useState(saved !== null);
  const [profile, setProfile] = useState<BirthRuneProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

    saveBirthInput({ day, month, year, hour, minute });
    setRemembered(true);
    setProfile(calculateBirthProfile(d, m, y, h, min));
  }

  function forget() {
    clearBirthInput();
    setRemembered(false);
    setDay("");
    setMonth("");
    setYear("");
    setHour("");
    setMinute("");
  }

  function reset() {
    setProfile(null);
    setOpenIndex(null);
  }

  if (profile) {
    const secondaries = [
      {
        // The zodiac card above already explains which of the sign's two runes
        // the birth date lands on, so this one only has to carry the reading.
        title: "Solar Doğum Rune'si",
        description:
          "Doğum gününe düşen Rune'nin ayrıntılı okuması.",
        rune: profile.solarBirthRune,
      },
      {
        title: "Doğum Saati Rune'si",
        description:
          "Dış dünyaya gösterdiğiniz maskeyi ve sosyal karakterinizi temsil eder.",
        rune: profile.birthHourRune,
      },
    ];

    return (
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-md">
          <SectionHeader>Senin Rune Haritan</SectionHeader>

          <div className="mb-4">
            <ZodiacCard
              sign={profile.zodiac}
              activeRuneName={profile.solarBirthRune.name}
            />
          </div>

          <BirthRuneCard
            variant="primary"
            title="Ana Doğum Rune'n · Kader Yolu"
            description="Hayattaki temel amacınızı ve potansiyelinizi gösterir."
            rune={profile.lifePathRune}
          />

          <div className="mt-4 space-y-3">
            {secondaries.map((s, i) => (
              <BirthRuneCard
                key={s.title}
                title={s.title}
                description={s.description}
                rune={s.rune}
                expanded={openIndex === i}
                onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <GoldButton variant="ghost" onClick={reset}>
              Başka Bir Tarih Hesapla
            </GoldButton>
          </div>

          <p className="mt-6 text-center text-[13px] leading-6 text-parchment-dim">
            Bu harita modern bir yorumdur; tarihsel bir Viking pratiği değildir.
            Burç–Rune eşleşmesi de hiçbir İskandinav kaynağında geçmez —
            24 Rune'ü 12 burca ikişerli dağıtmak çağdaş bir kurgudur.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-7 max-w-md text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gold">
          Doğum Rune'si
        </p>
        <h2 className="font-serif text-[28px] leading-tight text-parchment">
          Doğum tarihinin taşıdığı Rune izini keşfet.
        </h2>
        <p className="mt-3 text-[15px] leading-6 text-parchment-dim">
          Doğum tarihine göre seni temsil eden Rune enerjilerini hesapla.
        </p>
      </div>

      <MysticCard grain className="w-full max-w-md p-6">
        <form onSubmit={handleCalculate}>
          <SectionHeader align="left">Doğum Tarihi</SectionHeader>
          <div className="mb-6 grid grid-cols-3 gap-2.5">
            <MysticInput
              type="number"
              inputMode="numeric"
              placeholder="Gün"
              aria-label="Doğum günü"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
            <MysticInput
              type="number"
              inputMode="numeric"
              placeholder="Ay"
              aria-label="Doğum ayı"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <MysticInput
              type="number"
              inputMode="numeric"
              placeholder="Yıl"
              aria-label="Doğum yılı"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <SectionHeader align="left">Doğum Saati (isteğe bağlı)</SectionHeader>
          <div className="mb-6 grid grid-cols-2 gap-2.5">
            <MysticInput
              type="number"
              inputMode="numeric"
              placeholder="Saat (0-23)"
              aria-label="Doğum saati"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            />
            <MysticInput
              type="number"
              inputMode="numeric"
              placeholder="Dakika"
              aria-label="Doğum dakikası"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="mb-4 text-sm text-red-400">
              {error}
            </p>
          )}

          <GoldButton type="submit" className="min-h-14 w-full">
            Doğum Rune'mi Hesapla
          </GoldButton>
        </form>

        {remembered && (
          <p className="mt-4 text-center text-[12px] leading-5 text-parchment-dim">
            Doğum bilgin bu cihazda saklanıyor.{" "}
            <button
              type="button"
              onClick={forget}
              className="text-gold underline underline-offset-2"
            >
              Unut
            </button>
          </p>
        )}

        <p className="mt-5 text-center text-[13px] leading-6 text-parchment-dim">
          Bu hesaplama modern numerolojik bir yorumdur; tarihsel bir Viking
          pratiği değildir. Doğum saati bilinmiyorsa öğlen (12:00) varsayılır.
        </p>
      </MysticCard>
    </div>
  );
}
