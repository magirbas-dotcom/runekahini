// The rune of the day, the same draw as the app's (askrune-app src/data/runes.ts drawDailyRune, todayKey):
// seeded by the local date, so on any given day the site and the app show the same stone. Copied; if the
// app's draw changes, change this with it.
import { runes } from "./content/runes";

/** Local calendar day as YYYY-MM-DD, the key the daily rune is seeded with. */
export function todayKey(d = new Date()): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** FNV-1a and a murmur3-style finaliser over the date, as in the app. */
export function drawDailyRune(dateKey: string): { name: string; reversed: boolean } {
  let hash = 2166136261;
  for (let i = 0; i < dateKey.length; i++) {
    hash ^= dateKey.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 2246822507);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 3266489909);
  hash = (hash ^ (hash >>> 16)) >>> 0;
  const rune = runes[hash % runes.length];
  return { name: rune.name, reversed: rune.reversible && (hash >>> 8) % 3 === 0 };
}
