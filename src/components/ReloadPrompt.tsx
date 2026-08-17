import { useRegisterSW } from "virtual:pwa-register/react";
import MysticCard from "./ui/MysticCard";
import GoldButton from "./ui/GoldButton";

/**
 * Tells the user when a new build is waiting, instead of silently swapping it
 * in. The service worker serves the cached version first, so without this a
 * returning visitor sees the previous release with no indication that an
 * update exists — they'd have to close and reopen the app to get it.
 */
export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  function dismiss() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <MysticCard
        tone="raised"
        className="animate-fade-in pointer-events-auto w-full max-w-md p-4"
      >
        <div role="status" aria-live="polite">
          {needRefresh ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                Yeni Sürüm
              </p>
              <p className="mt-1.5 text-[15px] leading-6 text-parchment">
                Uygulamanın yeni bir sürümü hazır.
              </p>
              <div className="mt-4 flex gap-2">
                <GoldButton
                  onClick={() => updateServiceWorker(true)}
                  className="flex-1"
                >
                  Yenile
                </GoldButton>
                <GoldButton variant="quiet" onClick={dismiss}>
                  Daha Sonra
                </GoldButton>
              </div>
            </>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                Hazır
              </p>
              <p className="mt-1.5 text-[15px] leading-6 text-parchment">
                Uygulama artık çevrimdışı da açılabilir.
              </p>
              <div className="mt-4 flex justify-end">
                <GoldButton variant="ghost" onClick={dismiss}>
                  Tamam
                </GoldButton>
              </div>
            </>
          )}
        </div>
      </MysticCard>
    </div>
  );
}
