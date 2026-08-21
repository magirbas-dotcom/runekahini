import { useEffect, useRef, useState } from "react";
import { runes } from "../data/runes";
import {
  INTENT_PRESETS,
  PRESET_GROUPS,
  type PresetGroupId,
} from "../data/runeStrokes";
import { RUNE_GLYPHS, GLYPH_FIT_SCALE, sealLayout } from "../data/runeGlyphs";
import { buildCustomSynergy } from "../data/synergy";
import MysticCard from "./ui/MysticCard";
import SectionHeader from "./ui/SectionHeader";
import GoldButton from "./ui/GoldButton";
import RuneChip from "./ui/RuneChip";
import IntentPresetCard from "./ui/IntentPresetCard";
import RunePicker from "./ui/RunePicker";
import BindruneCanvas, { type TalismanForm } from "./ui/BindruneCanvas";
import TalismanFormCard from "./ui/TalismanFormCard";
import { loadTalisman, saveTalisman } from "../data/storage";

const MAX_LAYERS = 4;
/** Starting vertical spread for a bind rune, so a new stack is not fully
 *  coincident before the user touches a slider. */
const DEFAULT_OFFSETS = [0, -22, 22, -42];
const OFFSET_RANGE = 55;
/** Mirrors BIND_OPACITY in BindruneCanvas. */
const BIND_OPACITY = [1, 0.85, 0.72, 0.6];
const CANVAS_SIZE = 400;
const GLYPH_SCALE = 1.6;

// Canvas cannot read the CSS custom properties, so the design tokens the
// exported image needs are mirrored here. Keep these in step with the
// @theme block in index.css.
const GOLD = "#c7a34a";           // --color-gold
const GOLD_LIGHT = "#e5cf8b";     // --color-gold-light
const PARCHMENT = "#f2eee7";      // --color-parchment
const INK_RGB = "7, 7, 6";        // --color-ink

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

// 9:19.5 rather than 9:16 — the ratio most current phones use. A 9:16 image
// set as wallpaper gets scaled up to cover a taller screen, which cropped the
// frame's sides off. The frame is also inset inside that canvas, so the
// remaining margin absorbs whatever a differently proportioned screen crops.
const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 2340;
/** Frame artwork aspect (941 x 1672). */
const FRAME_ASPECT = 941 / 1672;
/** Frame width as a fraction of the canvas. */
const FRAME_INSET = 0.86;

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
  // Son tasarım cihazda saklanıyorsa oradan devam et. Kaydedilen değerler
  // serbest metin olduğu için hepsi doğrulanır: elle kurcalanmış ya da eski
  // sürümden kalmış bir kayıt varsayılana düşer, ekranı bozmaz.
  const restored = useState(() => {
    const v = loadTalisman();
    if (!v) return null;
    const names = v.layers.filter((n) => n in RUNE_GLYPHS).slice(0, MAX_LAYERS);
    if (names.length === 0) return null;
    return {
      mode: v.mode === "custom" ? ("custom" as const) : ("preset" as const),
      form: v.form === "medallion" ? ("medallion" as const) : ("bindrune" as const),
      preset: INTENT_PRESETS.find((p) => p.id === v.presetId) ?? INTENT_PRESETS[0],
      layers: names,
      offsets: v.offsets ?? {},
    };
  })[0];
  const first = restored?.preset ?? INTENT_PRESETS[0];

  const [mode, setMode] = useState<"preset" | "custom">(restored?.mode ?? "preset");
  const [presetId, setPresetId] = useState(first.id);
  // One intent group open at a time — 33 presets in a flat grid ran far past
  // the fold on a phone.
  const [openGroup, setOpenGroup] = useState<PresetGroupId | null>(first.group);
  const [form, setForm] = useState<TalismanForm>(restored?.form ?? "bindrune");
  const [layers, setLayers] = useState<string[]>(restored?.layers ?? first.runeNames);
  // Keyed by rune name so a nudge survives adding or removing another rune.
  const [offsets, setOffsets] = useState<Record<string, number>>(() =>
    restored
      ? Object.fromEntries(
          restored.layers.map((n, i) => [
            n,
            typeof restored.offsets[n] === "number"
              ? restored.offsets[n]
              : (DEFAULT_OFFSETS[i] ?? 0),
          ]),
        )
      : Object.fromEntries(
          first.runeNames.map((n, i) => [n, DEFAULT_OFFSETS[i] ?? 0]),
        ),
  );

  // Her değişiklikte yaz. Kayıt küçük ve nadir değişiyor; ayrı bir
  // "kaydet" adımı istemeye değmez.
  useEffect(() => {
    saveTalisman({ form, mode, presetId, layers, offsets });
  }, [form, mode, presetId, layers, offsets]);

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
    setLayers(p.runeNames);
    setOffsets(
      Object.fromEntries(p.runeNames.map((n, i) => [n, DEFAULT_OFFSETS[i] ?? 0])),
    );
  }

  function toggleCustomRune(name: string) {
    setMode("custom");
    setLayers((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= MAX_LAYERS) return prev;
      setOffsets((o) => ({ ...o, [name]: DEFAULT_OFFSETS[prev.length] ?? 0 }));
      return [...prev, name];
    });
  }

  function updateOffset(name: string, value: number) {
    setOffsets((prev) => ({ ...prev, [name]: value }));
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

    layers.forEach((name, i) => {
      const glyph = RUNE_GLYPHS[name];
      if (!glyph) return;

      let x = centerX;
      let y = centerY;
      let scale = glyphScale;

      if (form === "bindrune") {
        y = centerY + (offsets[name] ?? 0) * scaleRatio;
        ctx.globalAlpha = BIND_OPACITY[i] ?? 0.6;
      } else {
        const slot = sealLayout(i, layers.length, radius, glyphScale);
        x = centerX + slot.dx;
        y = centerY + slot.dy;
        scale = slot.scale;

        ctx.save();
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 1.6 * scaleRatio;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(x, y, slot.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = form === "bindrune" ? BIND_OPACITY[i] ?? 0.6 : 1;
      ctx.translate(x - 50 * scale, y - 50 * scale);
      ctx.scale(scale, scale);
      // Same mapping glyphTransform performs for the SVG preview, so the
      // exported image matches what was composed on screen. In bind-rune form
      // the glyph is shifted onto the shared stave rather than its bbox.
      ctx.translate(
        50 - glyph.cx * GLYPH_FIT_SCALE + (form === "bindrune" ? glyph.staveDx : 0),
        50 - glyph.cy * GLYPH_FIT_SCALE,
      );
      ctx.scale(GLYPH_FIT_SCALE, GLYPH_FIT_SCALE);
      ctx.fillStyle = GOLD;
      ctx.shadowColor = GOLD;
      ctx.shadowBlur = 6;
      ctx.fill(new Path2D(glyph.d));
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

    // The frame sits inset on a black field. Its own edges are already black,
    // so the padding continues the artwork rather than framing it.
    const frameW = EXPORT_WIDTH * FRAME_INSET;
    const frameH = frameW / FRAME_ASPECT;
    const frameX = (EXPORT_WIDTH - frameW) / 2;
    const frameY = (EXPORT_HEIGHT - frameH) / 2;
    // Every measurement below was tuned when the frame spanned 1080px, so they
    // are scaled by however much it has shrunk.
    const fs = frameW / 1080;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
    ctx.drawImage(frame, frameX, frameY, frameW, frameH);

    const ringX = frameX + frameW * FRAME_PORTRAIT.centerXFrac;
    const ringY = frameY + frameH * FRAME_PORTRAIT.centerYFrac;
    const ringR = frameW * FRAME_PORTRAIT.radiusFrac;
    drawLayers(ctx, ringX, ringY, ringR);

    // Talisman name + purpose, lettered into the frame's empty space below
    // the ring, plus a small brand mark — makes a saved image self-explanatory
    // instead of just a bare glowing symbol.
    const name =
      mode === "preset" && preset
        ? preset.name
        : layers.join(" + ");
    const purpose =
      mode === "preset" && preset ? preset.category : "Özel Kombinasyon";

    const textCenterX = ringX;
    const circleBottom = ringY + ringR;

    ctx.textAlign = "center";

    // A dark plaque behind the name/purpose text guarantees legibility no
    // matter what part of the frame's texture ends up underneath it — well
    // clear of the ring's bottom flourish, deep into the frame's empty space.
    const plaqueWidth = 880 * fs;
    const plaqueHeight = 280 * fs;
    const plaqueTop = circleBottom + 200 * fs;
    ctx.fillStyle = `rgba(${INK_RGB}, 0.6)`;
    drawPlaqueRect(
      ctx,
      textCenterX - plaqueWidth / 2,
      plaqueTop,
      plaqueWidth,
      plaqueHeight,
      28 * fs,
    );

    const nameY = plaqueTop + 120 * fs;
    const purposeY = plaqueTop + 205 * fs;
    const textMaxWidth = plaqueWidth - 100 * fs;

    const nameSize = fitFontSize(
      ctx,
      name,
      textMaxWidth,
      "700",
      "Cinzel, Georgia, serif",
      72 * fs,
      36 * fs,
    );
    ctx.lineJoin = "round";
    ctx.lineWidth = 10 * fs;
    ctx.strokeStyle = `rgba(${INK_RGB}, 0.9)`;
    ctx.font = `700 ${nameSize}px Cinzel, Georgia, serif`;
    ctx.strokeText(name, textCenterX, nameY);
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 18 * fs;
    ctx.fillStyle = GOLD_LIGHT;
    ctx.fillText(name, textCenterX, nameY);

    const purposeText = purpose.toLocaleUpperCase("tr-TR");
    const purposeSize = fitFontSize(
      ctx,
      purposeText,
      textMaxWidth,
      "500",
      "Inter, sans-serif",
      36 * fs,
      20 * fs,
    );
    ctx.shadowBlur = 0;
    ctx.lineWidth = 7 * fs;
    ctx.strokeStyle = `rgba(${INK_RGB}, 0.9)`;
    ctx.font = `500 ${purposeSize}px Inter, sans-serif`;
    ctx.strokeText(purposeText, textCenterX, purposeY);
    ctx.fillStyle = PARCHMENT;
    ctx.fillText(purposeText, textCenterX, purposeY);

    // Brand mark rides along the bottom of the plaque. It used to sit above
    // the ring, but the frame artwork has an ornament chain hanging down the
    // centre there — on the plaque it is clear of every decorated area.
    ctx.lineWidth = 0;
    ctx.fillStyle = "rgba(229, 207, 139, 0.5)";
    ctx.font = `500 ${22 * fs}px Inter, sans-serif`;
    ctx.fillText("RUNE KAHİNİ", textCenterX, plaqueTop + 250 * fs);

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
      : buildCustomSynergy(layers);

  const talismanName =
    mode === "preset" && preset ? preset.name : "Özel Kombinasyon";
  const talismanIntent =
    mode === "preset" && preset ? preset.category : "Kendi niyetin";

  const FORMS = [
    // Written in caps already: the page is lang="tr", so both Cinzel's small
    // caps and text-transform would raise the "i" to a dotted "İ".
    {
      key: "bindrune" as const,
      label: "BINDRUNE",
      hint: "Ortak gövdede birleşir",
    },
    {
      key: "medallion" as const,
      label: "MADALYON",
      hint: "Her Rune kendi dairesinde",
    },
  ];

  const MODES = [
    { key: "preset" as const, label: "Hazır Niyetler" },
    { key: "custom" as const, label: "Kendi Seçimim" },
  ];

  return (
    <div className="flex w-full max-w-md flex-col">
      <div className="mb-8 text-center">
        {/* clamp + nowrap keeps the title on one line down to 320px. */}
        <h2 className="whitespace-nowrap font-serif text-[clamp(19px,5.8vw,28px)] leading-tight text-parchment">
          Kendi tılsımını oluştur
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-parchment-dim">
          Niyetini seç, Rune'larını birleştir ve sana özel sembolünü oluştur.
        </p>
      </div>

      {/* Which runes go on the talisman. Rendered as tabs attached to the
          section below, so it reads as "which list am I looking at" rather
          than as a second option sitting next to the form choice. */}
      <div
        role="tablist"
        aria-label="Tılsım içeriği"
        className="mb-6 flex border-b border-hairline"
      >
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={mode === m.key}
            onClick={() =>
              m.key === "preset" ? selectPreset(presetId) : setMode("custom")
            }
            className={`-mb-px flex-1 border-b-2 px-3 pb-3 text-[13px] uppercase tracking-[0.12em] transition duration-200 ${
              mode === m.key
                ? "border-gold text-gold-light"
                : "border-transparent text-parchment-dim hover:text-parchment"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "preset" ? (
        <section className="mb-9">
          {PRESET_GROUPS.map((g) => {
            const items = INTENT_PRESETS.filter((p) => p.group === g.id);
            const open = openGroup === g.id;
            const chosen = items.find((p) => p.id === presetId);
            return (
              <div
                key={g.id}
                className={`mb-2 overflow-hidden rounded-card border transition-colors duration-200 ${
                  chosen
                    ? "border-hairline-strong bg-surface-gold/25"
                    : "border-hairline bg-surface/40"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenGroup(open ? null : g.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] uppercase tracking-[0.16em] text-gold">
                      {g.label}
                    </span>
                    <span className="mt-1 block text-[12px] leading-4 text-parchment-dim">
                      {items.length} niyet
                    </span>
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-surface-gold/60 text-gold-light transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 6.5 L8 10.5 L12 6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {open && (
                  <div className="grid auto-rows-fr grid-cols-2 gap-2.5 px-3 pb-3">
                    {items.map((p) => (
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
                )}
              </div>
            );
          })}
        </section>
      ) : (
        <section className="mb-9">
          <p className="mb-4 text-center text-[13px] leading-5 text-parchment-dim">
            Tılsımında kullanmak istediğin Rune'ları seç.
          </p>

          <RunePicker
            selected={layers}
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
                {layers.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleCustomRune(name)}
                    aria-label={`${name} Rune'sini kaldır`}
                    className="rounded-full transition duration-150 active:scale-[0.98]"
                  >
                    <RuneChip>{name} ×</RuneChip>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="mb-9">
        <SectionHeader>Tılsım Önizleme</SectionHeader>

        {/* The form belongs beside the preview: it changes how the talisman is
            drawn, not what goes on it. Keeping it up with the intent list made
            the two choices look like alternatives to one another. */}
        <div className="mb-5 grid grid-cols-2 gap-2.5">
          {FORMS.map((fm) => (
            <TalismanFormCard
              key={fm.key}
              kind={fm.key}
              label={fm.label}
              hint={fm.hint}
              selected={form === fm.key}
              onClick={() => setForm(fm.key)}
            />
          ))}
        </div>

        <BindruneCanvas
          names={layers}
          form={form}
          offsets={offsets}
          size={CANVAS_SIZE}
          centerXFrac={FRAME_SQUARE.centerXFrac}
          centerYFrac={FRAME_SQUARE.centerYFrac}
          radiusFrac={FRAME_SQUARE.radiusFrac}
          glyphScale={GLYPH_SCALE}
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
              {layers.join(" · ")}
            </p>
          )}
        </div>

        {form === "bindrune" && layers.length > 1 && (
          <div className="mt-6 space-y-3">
            <p className="text-center text-[11px] uppercase tracking-[0.16em] text-gold">
              Gövde Üzerindeki Konum
            </p>
            {layers.map((name, i) => (
              <div key={name} className="flex items-center gap-3 text-[13px]">
                <span className="w-28 shrink-0 text-parchment-dim">
                  {name}
                  {i === 0 && <span className="ml-1 text-gold">(ana gövde)</span>}
                </span>
                <input
                  type="range"
                  min={-OFFSET_RANGE}
                  max={OFFSET_RANGE}
                  value={offsets[name] ?? 0}
                  onChange={(e) => updateOffset(name, Number(e.target.value))}
                  disabled={i === 0}
                  aria-label={`${name} dikey konumu`}
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
        Dürüstlük notu: tarihsel <em>bindrune</em>, Rune'lerin ortak bir dikey
        gövdede tek bir işarete birleştirilmesiydi — çoğunlukla kazımada yer ve
        emek kazanmak için, büyüsel bir formül gereği değil. Üstelik Viking
        Çağı yazıtlarında oldukça nadirdir. Buradaki tılsım Rune'leri
        birleştirmiyor, her birini kendi dairesine yerleştiriyor; yani bir
        bindrune değil, modern bir mühür tasarımı.
      </p>
    </div>
  );
}
