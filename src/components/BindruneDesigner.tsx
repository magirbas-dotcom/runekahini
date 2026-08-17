import { useEffect, useRef, useState } from "react";
import { runes } from "../data/runes";
import { RUNE_STROKES, INTENT_PRESETS } from "../data/runeStrokes";
import { buildCustomSynergy } from "../data/synergy";
import MysticCard from "./ui/MysticCard";
import SectionHeader from "./ui/SectionHeader";
import GoldButton from "./ui/GoldButton";
import RuneChip from "./ui/RuneChip";
import IntentPresetCard from "./ui/IntentPresetCard";
import RunePicker from "./ui/RunePicker";
import BindruneCanvas from "./ui/BindruneCanvas";

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
//
// The square frame's opening is a true circle (390 x 390.5 px of 1254). The
// portrait frame's is an ellipse (347 x 418.5 px of 941 x 1672) — radiusFrac
// takes its *narrow* (horizontal) semi-axis, so the glyph can never overrun
// the ring sideways; the extra vertical room just becomes headroom.
const FRAME_SQUARE = { centerXFrac: 0.5, centerYFrac: 0.499, radiusFrac: 0.311 };
const FRAME_PORTRAIT = { centerXFrac: 0.5, centerYFrac: 0.498, radiusFrac: 0.369 };
const SCREEN_RADIUS = CANVAS_SIZE * FRAME_SQUARE.radiusFrac;

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;

function layersFromNames(names: string[]): Layer[] {
  return names.map((name, i) => ({ name, offsetY: DEFAULT_OFFSETS[i] ?? 0 }));
}

/** Three keywords describing a preset, taken from its own runes' upright
 *  readings — derived at render time so INTENT_PRESETS stays untouched. */
function presetKeywords(runeNames: string[]): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const pass of [0, 1, 2]) {
    for (const n of runeNames) {
      const kw = runes.find((r) => r.name === n)?.upright.keywords[pass];
      if (kw && !seen.has(kw)) {
        seen.add(kw);
        out.push(kw);
      }
      if (out.length === 3) return out.join(" · ");
    }
  }
  return out.join(" · ");
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

    // Brand mark rides along the bottom of the plaque. It used to sit above
    // the ring, but the frame artwork has an ornament chain hanging down the
    // centre there — on the plaque it is clear of every decorated area.
    ctx.lineWidth = 0;
    ctx.fillStyle = "rgba(253, 230, 138, 0.5)";
    ctx.font = "500 22px Inter, sans-serif";
    ctx.fillText("RUNE KAHİNİ", textCenterX, plaqueTop + 250);

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

  const talismanName =
    mode === "preset" && preset ? preset.name : "Özel Kombinasyon";
  const talismanIntent =
    mode === "preset" && preset ? preset.category : "Kendi niyetin";

  const MODES = [
    { key: "preset" as const, label: "Hazır Niyet" },
    { key: "custom" as const, label: "Özel" },
  ];

  return (
    <div className="flex w-full max-w-md flex-col">
      <div className="mb-7 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gold">
          Tılsım
        </p>
        {/* "BINDRUNE" is written in caps on purpose: Cinzel renders lowercase
            as small capitals but keeps the tittle on "i", which would spell it
            "BİNDRUNE" — a Turkish dotted İ on a Norse loanword. */}
        <h2 className="font-serif text-[28px] leading-tight text-parchment">
          Kendi BINDRUNE'ını oluştur.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-parchment-dim">
          Niyetini seç, Rune'larını birleştir ve sana özel sembolünü oluştur.
        </p>
      </div>

      {/* Mode switch. "Hazır Niyet" re-applies the current intent's runes;
          "Özel" keeps what's on screen as a starting combination. */}
      <div
        role="group"
        aria-label="Tılsım oluşturma yöntemi"
        className="mb-8 grid grid-cols-2 gap-1 rounded-card border border-hairline bg-surface/60 p-1"
      >
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            aria-pressed={mode === m.key}
            onClick={() =>
              m.key === "preset" ? selectPreset(presetId) : setMode("custom")
            }
            className={`rounded-[0.7rem] px-3 py-2.5 text-[13px] uppercase tracking-[0.12em] transition duration-200 ${
              mode === m.key
                ? "bg-surface-gold text-gold-light"
                : "text-parchment-dim hover:text-parchment"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "preset" ? (
        <section className="mb-9">
          <SectionHeader>Niyet</SectionHeader>
          <div className="grid grid-cols-2 gap-2.5">
            {INTENT_PRESETS.map((p) => (
              <IntentPresetCard
                key={p.id}
                category={p.category}
                name={p.name}
                keywords={presetKeywords(p.runeNames)}
                markRune={p.runeNames[0]}
                selected={presetId === p.id}
                onClick={() => selectPreset(p.id)}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-9">
          <SectionHeader>Rune'lar</SectionHeader>
          <p className="mb-4 text-center text-[13px] leading-5 text-parchment-dim">
            Tılsımında kullanmak istediğin Rune'ları seç.
          </p>

          <RunePicker
            selected={layers.map((l) => l.name)}
            onToggle={toggleCustomRune}
            max={MAX_LAYERS}
          />

          <p className="mt-4 text-center text-[13px] text-gold">
            {layers.length} / {MAX_LAYERS} Rune seçildi
          </p>

          {layers.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-center text-[11px] uppercase tracking-[0.16em] text-gold">
                Seçilenler
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {layers.map((l) => (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => toggleCustomRune(l.name)}
                    aria-label={`${l.name} Rune'sini kaldır`}
                    className="rounded-full transition duration-150 active:scale-[0.98]"
                  >
                    <RuneChip>{l.name} ×</RuneChip>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="mb-9">
        <SectionHeader>Tılsım Önizleme</SectionHeader>

        <BindruneCanvas
          layers={layers}
          size={CANVAS_SIZE}
          centerXFrac={FRAME_SQUARE.centerXFrac}
          centerYFrac={FRAME_SQUARE.centerYFrac}
          glyphScale={GLYPH_SCALE}
          opacitySteps={OPACITY_STEPS}
        />

        <div className="mt-5 text-center">
          <p className="font-serif text-2xl leading-tight text-parchment">
            {talismanName}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-gold">
            {talismanIntent}
          </p>
          {layers.length > 0 && (
            <p className="mt-2 text-[13px] text-parchment-dim">
              {layers.map((l) => l.name).join(" · ")}
            </p>
          )}
        </div>

        {layers.length > 1 && (
          <div className="mt-6 space-y-3">
            <p className="text-center text-[11px] uppercase tracking-[0.16em] text-gold">
              Katman Konumu
            </p>
            {layers.map((layer, i) => (
              <div key={layer.name} className="flex items-center gap-3 text-[13px]">
                <span className="w-28 shrink-0 text-parchment-dim">
                  {layer.name}
                  {i === 0 && (
                    <span className="ml-1 text-gold">(ana gövde)</span>
                  )}
                </span>
                <input
                  type="range"
                  min={-OFFSET_RANGE}
                  max={OFFSET_RANGE}
                  value={layer.offsetY}
                  onChange={(e) => updateOffset(i, Number(e.target.value))}
                  disabled={i === 0}
                  aria-label={`${layer.name} dikey konumu`}
                  className="flex-1 accent-[#c7a34a] disabled:opacity-30"
                />
              </div>
            ))}
          </div>
        )}

        <GoldButton
          onClick={handleSaveTalisman}
          disabled={layers.length === 0}
          className="mt-7 min-h-14 w-full"
        >
          Tılsımı Kaydet
        </GoldButton>
        <p className="mt-3 text-center text-[13px] leading-5 text-parchment-dim">
          Ekranda kare, kaydedilen görsel duvar kağıdı için 9:16 oranında
          hazırlanır.
        </p>
      </section>

      {synergy && (
        <MysticCard tone="gold" grain className="mb-8 p-6 text-left">
          <SectionHeader>Sinerji</SectionHeader>
          <p className="prose-reading text-parchment-dim">{synergy}</p>
        </MysticCard>
      )}

      <p className="text-center text-[13px] leading-6 text-parchment-dim">
        Dürüstlük notu: tarihsel bindruneler sade ve işlevseldi — bir kazımanın
        vuruş sayısını azaltmak için Rune'ler ortak bir dikey gövdede
        birleştirilirdi. Bugünün süslü "tasarımcı bindruneleri" (bu araç dahil)
        modern bir ezoterik yorumdur, Viking Çağı'na ait değildir.
      </p>
    </div>
  );
}
