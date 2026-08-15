import { runeById, type Rune } from "./runes";

// Solar takvimi: Güneş'in yıl boyunca her Rune'de ~15 gün kaldığı varsayılan yarı-ay
// döngüsü. Bu, Gemini ile hazırlanan spesifikasyondaki tabloya dayanır ve modern/
// popüler bir yorumdur — Viking dönemine ait doğrulanmış bir takvim değildir.
interface SolarInterval {
  start: [number, number]; // [ay, gün]
  end: [number, number];
  runeName: string;
}

const SOLAR_INTERVALS: SolarInterval[] = [
  { start: [1, 13], end: [1, 28], runeName: "Perthro" },
  { start: [1, 28], end: [2, 13], runeName: "Algiz" },
  { start: [2, 13], end: [2, 27], runeName: "Sowilo" },
  { start: [2, 27], end: [3, 14], runeName: "Tiwaz" },
  { start: [3, 14], end: [3, 30], runeName: "Berkano" },
  { start: [3, 30], end: [4, 14], runeName: "Ehwaz" },
  { start: [4, 14], end: [4, 29], runeName: "Mannaz" },
  { start: [4, 29], end: [5, 14], runeName: "Laguz" },
  { start: [5, 14], end: [5, 29], runeName: "Ingwaz" },
  { start: [5, 29], end: [6, 14], runeName: "Othala" },
  { start: [6, 14], end: [6, 29], runeName: "Dagaz" },
  { start: [6, 29], end: [7, 14], runeName: "Fehu" },
  { start: [7, 14], end: [7, 29], runeName: "Uruz" },
  { start: [7, 29], end: [8, 13], runeName: "Thurisaz" },
  { start: [8, 13], end: [8, 28], runeName: "Ansuz" },
  { start: [8, 28], end: [9, 13], runeName: "Raidho" },
  { start: [9, 13], end: [9, 28], runeName: "Kenaz" },
  { start: [9, 28], end: [10, 13], runeName: "Gebo" },
  { start: [10, 13], end: [10, 28], runeName: "Wunjo" },
  { start: [10, 28], end: [11, 13], runeName: "Hagalaz" },
  { start: [11, 13], end: [11, 28], runeName: "Nauthiz" },
  { start: [11, 28], end: [12, 13], runeName: "Isa" },
  { start: [12, 13], end: [12, 28], runeName: "Jera" },
  { start: [12, 28], end: [12, 31], runeName: "Eihwaz" },
  { start: [1, 1], end: [1, 13], runeName: "Eihwaz" },
];

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

export function calculateSolarBirthRune(month: number, day: number): string {
  const current: [number, number] = [month, day];
  const isBefore = (a: [number, number], b: [number, number]) =>
    a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
  const isBeforeOrEqual = (a: [number, number], b: [number, number]) =>
    a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1]);

  for (const { start, end, runeName } of SOLAR_INTERVALS) {
    const isYearWrapSegment = start[0] === 12 && start[1] === 28 && end[0] === 12 && end[1] === 31;
    if (isYearWrapSegment) {
      if (isBeforeOrEqual(start, current) && isBeforeOrEqual(current, end)) return runeName;
      continue;
    }
    if (isBeforeOrEqual(start, current) && isBefore(current, end)) return runeName;
  }
  return "Eihwaz";
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

  return { lifePathRune, solarBirthRune, birthHourRune };
}
