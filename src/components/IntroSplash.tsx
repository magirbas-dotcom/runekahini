import { useEffect, useState } from "react";
import HeroEmblem from "./ui/HeroEmblem";

const SEEN_KEY = "runekahini.introSeen";
const HOLD_MS = 3000;
const FADE_MS = 700;

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

/**
 * Opening scene, once per session: the Futhark band appears rune by rune, the
 * engraved medallion rises into it, the gilded name fades up beneath. It
 * dissolves into the app after three seconds; a tap ends it at once. Skipped
 * entirely under prefers-reduced-motion.
 */
export default function IntroSplash() {
  const [phase, setPhase] = useState<"show" | "leaving" | "gone">(() =>
    shouldShow() ? "show" : "gone",
  );

  useEffect(() => {
    if (phase === "gone") return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // A private window may refuse storage; the intro just plays again.
    }
    if (phase === "show") {
      const t = window.setTimeout(() => setPhase("leaving"), HOLD_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setPhase("gone"), FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      role="presentation"
      onClick={() => setPhase("leaving")}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink transition-opacity ${
        phase === "leaving" ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="intro-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <HeroEmblem size={280} reveal />
      <p className="intro-line mt-8 whitespace-nowrap text-center text-xs uppercase tracking-[0.42em] text-gold" style={{ animationDelay: "1.3s" }}>
        Elder Futhark
      </p>
      {/* The reveal sits on a wrapper: on the h1 itself its animation and
          filter would override the gilded glint and drop shadow. */}
      <div className="intro-line mt-2" style={{ animationDelay: "1.55s" }}>
        <h1 className="gilded-text whitespace-nowrap text-center font-serif text-5xl">Rune Kahini</h1>
      </div>
      <p className="intro-line mt-10 whitespace-nowrap text-center text-[11px] tracking-[0.2em] text-parchment-dim" style={{ animationDelay: "2.1s" }}>
        Devam etmek için dokun
      </p>
    </div>
  );
}
