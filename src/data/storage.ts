/**
 * Cihazda saklama katmanı.
 *
 * Uygulamanın tek kalıcı veri kapısı burasıdır — bileşenler `localStorage`'a
 * doğrudan dokunmaz. Bunun iki sebebi var: sürüm/şema değişikliği tek yerden
 * yönetilebilsin, ve ileride Capacitor'a taşınırsa (`@capacitor/preferences`,
 * iOS'ta WKWebView localStorage'ını sistem baskı altında temizleyebiliyor)
 * değişiklik bu dosyayla sınırlı kalsın.
 *
 * Hiçbir veri sunucuya gitmez. Doğum tarihi/saati kişisel veridir; cihazda
 * kaldığı sürece uygulamanın veri sorumlusu sıfatı doğmaz.
 */

const NS = "runekahini.v1";

/** Geçmişte tutulacak en fazla okuma sayısı. */
export const MAX_HISTORY = 30;

export interface StoredBirthInput {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
}

export interface StoredReadingRune {
  name: string;
  reversed: boolean;
}

export interface StoredReading {
  id: string;
  /** ISO 8601, cihazın yerel saatinden üretilir. */
  at: string;
  spread: string;
  /** Kullanıcı soru yazmadıysa boş dizi değil, boş metin. */
  question: string;
  runes: StoredReadingRune[];
}

export interface StoredTalisman {
  form: string;
  mode: string;
  presetId: string;
  layers: string[];
  offsets: Record<string, number>;
}

/**
 * Okuma da yazma da sessizce başarısız olabilir: gizli sekmede localStorage
 * erişimi istisna fırlatır, kota dolduğunda yazma reddedilir. Hiçbiri
 * uygulamayı durdurmamalı — kalıcılık bir kolaylık, gereksinim değil.
 */
function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${NS}.${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(`${NS}.${key}`, JSON.stringify(value));
  } catch {
    // yoksay
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(`${NS}.${key}`);
  } catch {
    // yoksay
  }
}

// ── Doğum bilgisi ────────────────────────────────────────────────────

export function loadBirthInput(): StoredBirthInput | null {
  const v = read<StoredBirthInput>("birth");
  // Elle kurcalanmış ya da eski şemadan kalmış kaydı sessizce yok say.
  if (!v || typeof v.day !== "string" || typeof v.year !== "string") return null;
  return v;
}

export function saveBirthInput(v: StoredBirthInput): void {
  write("birth", v);
}

export function clearBirthInput(): void {
  remove("birth");
}

// ── Okuma geçmişi ────────────────────────────────────────────────────

export function loadReadings(): StoredReading[] {
  const v = read<StoredReading[]>("readings");
  if (!Array.isArray(v)) return [];
  return v.filter((r) => r && typeof r.at === "string" && Array.isArray(r.runes));
}

/** En yeni kayıt başa gelir; liste MAX_HISTORY ile sınırlanır. */
export function appendReading(entry: Omit<StoredReading, "id" | "at">): StoredReading[] {
  const record: StoredReading = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
  };
  const next = [record, ...loadReadings()].slice(0, MAX_HISTORY);
  write("readings", next);
  return next;
}

export function clearReadings(): void {
  remove("readings");
}

// ── Tılsım taslağı ───────────────────────────────────────────────────

export function loadTalisman(): StoredTalisman | null {
  const v = read<StoredTalisman>("talisman");
  if (!v || !Array.isArray(v.layers) || v.layers.length === 0) return null;
  return v;
}

export function saveTalisman(v: StoredTalisman): void {
  write("talisman", v);
}
