import { runeById, type Rune } from "./runes";
import { solarRuneForDate, zodiacForDate, type ZodiacSign } from "./zodiac";

interface HourInterval {
  start: [number, number]; // [saat, dakika]
  end: [number, number];
  runeName: string;
}

const HOUR_INTERVALS: HourInterval[] = [
  { start: [0, 30], end: [1, 30], runeName: "Eihwaz" },
  { start: [1, 30], end: [2, 30], runeName: "Perthro" },
  { start: [2, 30], end: [3, 30], runeName: "Algiz" },
  { start: [3, 30], end: [4, 30], runeName: "Sowilo" },
  { start: [4, 30], end: [5, 30], runeName: "Tiwaz" },
  { start: [5, 30], end: [6, 30], runeName: "Berkano" },
  { start: [6, 30], end: [7, 30], runeName: "Ehwaz" },
  { start: [7, 30], end: [8, 30], runeName: "Mannaz" },
  { start: [8, 30], end: [9, 30], runeName: "Laguz" },
  { start: [9, 30], end: [10, 30], runeName: "Ingwaz" },
  { start: [10, 30], end: [11, 30], runeName: "Dagaz" },
  { start: [11, 30], end: [12, 30], runeName: "Othala" },
  { start: [12, 30], end: [13, 30], runeName: "Fehu" },
  { start: [13, 30], end: [14, 30], runeName: "Uruz" },
  { start: [14, 30], end: [15, 30], runeName: "Thurisaz" },
  { start: [15, 30], end: [16, 30], runeName: "Ansuz" },
  { start: [16, 30], end: [17, 30], runeName: "Raidho" },
  { start: [17, 30], end: [18, 30], runeName: "Kenaz" },
  { start: [18, 30], end: [19, 30], runeName: "Gebo" },
  { start: [19, 30], end: [20, 30], runeName: "Wunjo" },
  { start: [20, 30], end: [21, 30], runeName: "Hagalaz" },
  { start: [21, 30], end: [22, 30], runeName: "Nauthiz" },
  { start: [22, 30], end: [23, 30], runeName: "Isa" },
  { start: [23, 30], end: [24, 0], runeName: "Jera" },
  { start: [0, 0], end: [0, 30], runeName: "Jera" },
];

function digitSum(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((sum, ch) => sum + Number(ch), 0);
}

/**
 * Kader Yolu Rune'si: doğum gününün, ayının ve yılının haneleri ayrı ayrı toplanır,
 * ardından toplam 1-24 aralığına düşene kadar tekrar indirgenir. Bu bir numeroloji
 * yöntemidir, tarihsel bir Viking pratiği değildir.
 */
export function calculateLifePathRuneIndex(day: number, month: number, year: number): number {
  let total = digitSum(day) + digitSum(month) + digitSum(year);
  while (total > 24) {
    total = digitSum(total);
  }
  return total === 0 ? 24 : total;
}

/**
 * Solar Doğum Rune'si. The calendar is now the zodiac one: each sign spans two
 * runes, the initiating one in its first half and the maturing one in its
 * second, with the Elder Futhark running in sequence from the spring equinox.
 * The previous table started Fehu in late June, which put every sign against a
 * rune its own pairing disagreed with. Like that table, this is a modern
 * interpretation — there is no attested Norse zodiac calendar.
 */
export function calculateSolarBirthRune(month: number, day: number): string {
  return solarRuneForDate(month, day);
}

export function calculateBirthHourRune(hour: number, minute: number): string {
  const current = hour + minute / 60;
  for (const { start, end, runeName } of HOUR_INTERVALS) {
    const startVal = start[0] + start[1] / 60;
    const endVal = end[0] + end[1] / 60;
    if (startVal <= current && current < endVal) return runeName;
  }
  return "Jera";
}

export interface BirthRuneProfile {
  lifePathRune: Rune;
  solarBirthRune: Rune;
  birthHourRune: Rune;
  /** The birth date's zodiac sign and the rune pair that governs it. */
  zodiac: ZodiacSign;
}

export function calculateBirthProfile(
  day: number,
  month: number,
  year: number,
  hour = 12,
  minute = 0,
): BirthRuneProfile {
  const lifePathIndex = calculateLifePathRuneIndex(day, month, year);
  const solarName = calculateSolarBirthRune(month, day);
  const hourName = calculateBirthHourRune(hour, minute);

  const lifePathRune = runeById(lifePathIndex);
  const solarBirthRune = [...Array(24)].map((_, i) => runeById(i + 1)).find((r) => r?.name === solarName);
  const birthHourRune = [...Array(24)].map((_, i) => runeById(i + 1)).find((r) => r?.name === hourName);

  if (!lifePathRune || !solarBirthRune || !birthHourRune) {
    throw new Error("Rune profili hesaplanamadı.");
  }

  return {
    lifePathRune,
    solarBirthRune,
    birthHourRune,
    zodiac: zodiacForDate(month, day),
  };
}
