import { useEffect, useRef, useState } from "react";
import { runes } from "../data/runes";
import { RUNE_STROKES, INTENT_PRESETS } from "../data/runeStrokes";
import { buildCustomSynergy } from "../data/synergy";

interface Layer {
  name: string;
  offsetY: number;
}

const OPACITY_STEPS = [1, 0.8, 0.65, 0.5];
const DEFAULT_OFFSETS = [0, -20, 20, -38];
const MAX_LAYERS = 4;
const CANVAS_SIZE = 400;
const GLYPH_SCALE = 1.6;
const OFFSET_RANGE = 45;

// The ring's position/size within each frame image, measured once (as a
// fraction of image width/height so the same numbers work at any resolution):
// scanned both PNGs for the widest gap of non-gold pixels through the center,
// which lands on the ring's inner edge on every side.
const FRAME_SQUARE = { centerXFrac: 0.5, centerYFrac: 0.499, radiusFrac: 0.34 };
const FRAME_PORTRAIT = { centerXFrac: 0.5, centerYFrac: 0.4895, radiusFrac: 0.34 };
const SCREEN_RADIUS = CANVAS_SIZE * FRAME_SQUARE.radiusFrac;

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;

function layersFromNames(names: string[]): Layer[] {
  return names.map((name, i) => ({ name, offsetY: DEFAULT_OFFSETS[i] ?? 0 }));
}

export default function BindruneDesigner() {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [presetId, setPresetId] = useState(INTENT_PRESETS[0].id);
  const [layers, setLayers] = useState<Layer[]>(
    layersFromNames(INTENT_PRESETS[0].runeNames),
  );

  const preset = INTENT_PRESETS.find((p) => p.id === presetId);

  // Preload the export frame ahead of time — fetching it only when the user
  // clicks "Kaydet" adds enough async delay that some browsers stop treating
  // the resulting <a download> click as user-initiated and silently drop it.
  const frameImageRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = "/bindrune-frame-portrait.png";
    frameImageRef.current = img;
  }, []);

  function selectPreset(id: string) {
    const p = INTENT_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setMode("preset");
    setPresetId(id);
    setLayers(layersFromNames(p.runeNames));
  }

  function toggleCustomRune(name: string) {
    setMode("custom");
    setLayers((prev) => {
      const exists = prev.some((l) => l.name === name);
      if (exists) return prev.filter((l) => l.name !== name);
      if (prev.length >= MAX_LAYERS) return prev;
      return [...prev, { name, offsetY: DEFAULT_OFFSETS[prev.length] ?? 0 }];
    });
  }

  function updateOffset(index: number, value: number) {
    setLayers((prev) =>
      prev.map((l, i) => (i === index ? { ...l, offsetY: value } : l)),
    );
  }

  function downloadBlob(blob: Blob) {
    const pngUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "tilsim-duvar-kagidi.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoking immediately can race ahead of the browser actually reading
    // the blob for the download, silently dropping it — give it a beat.
    setTimeout(() => URL.revokeObjectURL(pngUrl), 2000);
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /** Shrinks font size until `text` fits within `maxWidth`, so long custom
   *  combinations ("Wunjo + Kenaz + Tiwaz + Eihwaz") don't overrun the plaque. */
  function fitFontSize(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    weight: string,
    family: string,
    maxSize: number,
    minSize: number,
  ): number {
    let size = maxSize;
    while (size > minSize) {
      ctx.font = `${weight} ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 2;
    }
    return size;
  }

  function drawPlaqueRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, w, h);
    }
  }

  /** Draws the current layer stack onto a 2D canvas context centered at
   *  (centerX, centerY) with the glyph sized to fit a circle of `radius`. */
  function drawLayers(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
  ) {
    const scaleRatio = radius / SCREEN_RADIUS;
    const glyphScale = GLYPH_SCALE * scaleRatio;

    layers.forEach((layer, i) => {
      const cx = centerX;
      const cy = centerY + layer.offsetY * scaleRatio;
      const tx = cx - 50 * glyphScale;
      const ty = cy - 50 * glyphScale;

      ctx.save();
      ctx.translate(tx, ty);
      ctx.scale(glyphScale, glyphScale);
      ctx.globalAlpha = OPACITY_STEPS[i] ?? 0.5;
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = i === 0 ? 4.5 : 3.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 6;
      ctx.stroke(new Path2D(RUNE_STROKES[layer.name]));
      ctx.restore();
    });
  }

  async function handleSaveTalisman() {
    // Make sure Cinzel/Inter are actually loaded before we draw text with
    // them — otherwise the canvas silently falls back to a generic serif.
    await document.fonts?.ready?.catch(() => {});

    const cached = frameImageRef.current;
    const frame =
      cached && cached.complete && cached.naturalWidth > 0
        ? cached
        : await loadImage("/bindrune-frame-portrait.png");

    const canvas = document.createElement("canvas");
    canvas.width = EXPORT_WIDTH;
    canvas.height = EXPORT_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(frame, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    drawLayers(
      ctx,
      EXPORT_WIDTH * FRAME_PORTRAIT.centerXFrac,
      EXPORT_HEIGHT * FRAME_PORTRAIT.centerYFrac,
      EXPORT_WIDTH * FRAME_PORTRAIT.radiusFrac,
    );

    // Talisman name + purpose, lettered into the frame's empty space below
    // the ring, plus a small brand mark up top — makes a saved/shared image
    // self-explanatory instead of just a bare glowing symbol.
    const name =
      mode === "preset" && preset
        ? preset.name
        : layers.map((l) => l.name).join(" + ");
    const purpose =
      mode === "preset" && preset ? preset.category : "Özel Kombinasyon";

    const textCenterX = EXPORT_WIDTH * FRAME_PORTRAIT.centerXFrac;
    const circleBottom =
      EXPORT_HEIGHT * FRAME_PORTRAIT.centerYFrac +
      EXPORT_WIDTH * FRAME_PORTRAIT.radiusFrac;

    ctx.textAlign = "center";

    // Small brand mark in the empty space above the ring.
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(253, 230, 138, 0.55)";
    ctx.font = "500 26px Inter, sans-serif";
    ctx.fillText("RUNE KAHİNİ", textCenterX, 130);

    // A dark plaque behind the name/purpose text guarantees legibility no
    // matter what part of the frame's texture ends up underneath it — well
    // clear of the ring's bottom flourish, deep into the frame's empty space.
    const plaqueWidth = 880;
    const plaqueHeight = 280;
    const plaqueTop = circleBottom + 200;
    ctx.fillStyle = "rgba(8, 6, 5, 0.6)";
    drawPlaqueRect(
      ctx,
      textCenterX - plaqueWidth / 2,
      plaqueTop,
      plaqueWidth,
      plaqueHeight,
      28,
    );

    const nameY = plaqueTop + 120;
    const purposeY = plaqueTop + 205;
    const textMaxWidth = plaqueWidth - 100;

    const nameSize = fitFontSize(
      ctx,
      name,
      textMaxWidth,
      "700",
      "Cinzel, Georgia, serif",
      72,
      36,
    );
    ctx.lineJoin = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(8, 6, 5, 0.9)";
    ctx.font = `700 ${nameSize}px Cinzel, Georgia, serif`;
    ctx.strokeText(name, textCenterX, nameY);
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#fde68a";
    ctx.fillText(name, textCenterX, nameY);

    const purposeText = purpose.toLocaleUpperCase("tr-TR");
    const purposeSize = fitFontSize(
      ctx,
      purposeText,
      textMaxWidth,
      "500",
      "Inter, sans-serif",
      36,
      20,
    );
    ctx.shadowBlur = 0;
    ctx.lineWidth = 7;
    ctx.strokeStyle = "rgba(8, 6, 5, 0.9)";
    ctx.font = `500 ${purposeSize}px Inter, sans-serif`;
    ctx.strokeText(purposeText, textCenterX, purposeY);
    ctx.fillStyle = "#e7e5e4";
    ctx.fillText(purposeText, textCenterX, purposeY);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Mobile: hand the image to the native share sheet, which offers
      // "Save to Photos" / "Fotoğraflara Kaydet" directly — a plain
      // <a download> link mostly just opens the image on iOS Safari and
      // lands in a generic Downloads folder (not the gallery) on Android.
      const file = new File([blob], "tilsim-duvar-kagidi.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
        share?: (data: { files: File[]; title?: string }) => Promise<void>;
      };

      if (nav.canShare?.({ files: [file] }) && nav.share) {
        try {
          await nav.share({ files: [file], title: "Tılsım" });
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
          // Share failed for another reason — fall back to a plain download.
        }
      }

      downloadBlob(blob);
    }, "image/png");
  }

  const synergy =
    mode === "preset" && preset
      ? preset.synergy
      : buildCustomSynergy(layers.map((l) => l.name));

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl text-amber-50">Niyetini Seç</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-stone-400">
          Her tılsım, iki ya da üç Rune'nin ortak bir gövdede birleşmesiyle
          doğar — kendi niyetine en yakın olanı seç, ya da alttan kendi
          kombinasyonunu kur.
        </p>
      </div>

      <div className="mb-6 grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
        {INTENT_PRESETS.map((p) => {
          const primarySymbol =
            runes.find((r) => r.name === p.runeNames[0])?.symbol ?? "";
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPreset(p.id)}
              className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition ${
                mode === "preset" && presetId === p.id
                  ? "border-amber-300/60 bg-amber-200/10 text-amber-100"
                  : "border-stone-700 text-stone-400 hover:border-stone-600"
              }`}
            >
              <span
                className="text-2xl text-amber-200/80"
                aria-hidden="true"
              >
                {primarySymbol}
              </span>
              <span>
                <span className="block text-xs font-medium">{p.name}</span>
                <span className="block text-[11px] text-stone-500">
                  {p.category}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-6 flex flex-col items-center gap-4">
        <svg
          id="bindrune-svg"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full max-w-[400px] rounded-2xl border border-amber-200/15 bg-stone-950"
        >
          <defs>
            <filter id="rune-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <image
            href="/bindrune-frame-square.png"
            x={0}
            y={0}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
          />

          {layers.length === 0 && (
            <text
              x={CANVAS_SIZE / 2}
              y={CANVAS_SIZE / 2}
              textAnchor="middle"
              fill="#a8a29e"
              fontSize="14"
            >
              Rune seçin
            </text>
          )}
          {layers.map((layer, i) => {
            const cx = CANVAS_SIZE * FRAME_SQUARE.centerXFrac;
            const cy = CANVAS_SIZE * FRAME_SQUARE.centerYFrac + layer.offsetY;
            const tx = cx - 50 * GLYPH_SCALE;
            const ty = cy - 50 * GLYPH_SCALE;
            return (
              <g
                key={layer.name}
                transform={`translate(${tx}, ${ty}) scale(${GLYPH_SCALE})`}
                opacity={OPACITY_STEPS[i] ?? 0.5}
                filter="url(#rune-glow)"
              >
                <path
                  d={RUNE_STROKES[layer.name]}
                  stroke="#fbbf24"
                  strokeWidth={i === 0 ? 4.5 : 3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            );
          })}
        </svg>

        {layers.length > 0 && (
          <div className="w-full max-w-sm space-y-2">
            {layers.map((layer, i) => (
              <div key={layer.name} className="flex items-center gap-3 text-xs">
                <span className="w-24 shrink-0 text-stone-300">
                  {layer.name}
                  {i === 0 && <span className="ml-1 text-amber-300/80">(ana gövde)</span>}
                </span>
                <input
                  type="range"
                  min={-OFFSET_RANGE}
                  max={OFFSET_RANGE}
                  value={layer.offsetY}
                  onChange={(e) => updateOffset(i, Number(e.target.value))}
                  disabled={i === 0}
                  className="flex-1 accent-amber-300 disabled:opacity-30"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleSaveTalisman}
          disabled={layers.length === 0}
          className="rounded-lg bg-amber-200/90 px-5 py-2 text-sm font-medium text-stone-900 shadow transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tılsımı Kaydet
        </button>
        <p className="max-w-xs text-center text-[11px] text-stone-500">
          Ekranda kare, kaydedilen görsel duvar kağıdı için 9:16 oranında hazırlanır.
        </p>
      </div>

      {synergy && (
        <div className="mb-8 w-full max-w-lg rounded-2xl border border-amber-200/20 bg-gradient-to-br from-amber-200/5 to-transparent p-5 text-left">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-300/90">
            Sinerji
          </p>
          <p className="text-sm leading-relaxed text-stone-300">{synergy}</p>
        </div>
      )}

      <div className="w-full max-w-lg">
        <p className="mb-3 text-xs uppercase tracking-wider text-amber-200/80">
          Ya da kendi kombinasyonunu seç ({layers.length}/{MAX_LAYERS})
        </p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {runes.map((r) => {
            const active = layers.some((l) => l.name === r.name);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleCustomRune(r.name)}
                disabled={!active && layers.length >= MAX_LAYERS}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition ${
                  active
                    ? "border-amber-300/60 bg-amber-200/10 text-amber-100"
                    : "border-stone-800 text-stone-400 hover:border-stone-600 disabled:cursor-not-allowed disabled:opacity-30"
                }`}
              >
                <span className="text-xl">{r.symbol}</span>
                <span className="text-[10px]">{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-8 max-w-lg text-center text-xs leading-relaxed text-stone-400">
        Dürüstlük notu: tarihsel bindruneler sade ve işlevseldi — bir kazımanın
        vuruş sayısını azaltmak için Rune'ler ortak bir dikey gövdede
        birleştirilirdi. Bugünün süslü "tasarımcı bindruneleri" (bu araç dahil)
        modern bir ezoterik yorumdur, Viking Çağı'na ait değildir.
      </p>
    </div>
  );
}
