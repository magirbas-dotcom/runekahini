import { useEffect, useState } from "react";
import GoldButton from "../ui/GoldButton";
import { loadImage, shareCanvas } from "./cardCanvas";
import { CARD_BACKGROUND, type CardAssets } from "./resultCards";

interface ShareCardButtonProps {
  /** Blank stone photo the runes are carved into. */
  stone: string;
  draw: (assets: CardAssets) => Promise<HTMLCanvasElement>;
  filename: string;
  title: string;
  label?: string;
  className?: string;
}

/**
 * "Kartı Kaydet": draws a result card and hands it to the share sheet. The
 * images are fetched on mount — fetching only on tap adds enough delay that
 * some browsers no longer treat the share/download as user-initiated.
 */
export default function ShareCardButton({
  stone,
  draw,
  filename,
  title,
  label = "Kartı Kaydet",
  className = "",
}: ShareCardButtonProps) {
  const [assets, setAssets] = useState<CardAssets | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([loadImage(CARD_BACKGROUND), loadImage(stone)])
      .then(([background, s]) => {
        if (live) setAssets({ background, stone: s });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [stone]);

  async function handleClick() {
    if (!assets) return;
    setBusy(true);
    try {
      shareCanvas(await draw(assets), filename, title);
    } finally {
      setBusy(false);
    }
  }

  return (
    <GoldButton
      variant="ghost"
      onClick={handleClick}
      disabled={!assets || busy}
      className={className}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 11.5v2h11v-2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </GoldButton>
  );
}
