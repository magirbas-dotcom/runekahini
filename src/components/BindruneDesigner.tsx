import { useEffect, useRef, useState } from "react";
import { runes } from "../data/runes";
import {
  INTENT_PRESETS,
  PRESET_GROUPS,
  type PresetGroupId,
} from "../data/runeStrokes";
import { RUNE_GLYPHS } from "../data/runeGlyphs";
import { buildCustomSynergy } from "../data/synergy";
import MysticCard from "./ui/MysticCard";
import SectionHeader from "./ui/SectionHeader";
import GoldButton from "./ui/GoldButton";
import RuneChip from "./ui/RuneChip";
import IntentPresetCard from "./ui/IntentPresetCard";
import RunePicker from "./ui/RunePicker";
import Talisman3D from "./ui/Talisman3D";
import TalismanMedallion, { type TalismanForm } from "./ui/TalismanMedallion";
import TalismanFormCard from "./ui/TalismanFormCard";
import { loadTalisman, saveTalisman } from "../data/storage";
import { MEDALLIONS, MEDALLION_IDS, type MedallionId } from "../theme/medallions";
import { REALMS } from "../theme/realms";

const MAX_LAYERS = 4;
/** Starting vertical spread for a bind rune, so a new stack is not fully
 *  coincident before the user touches a slider. */
const DEFAULT_OFFSETS = [0, -22, 22, -42];
// Wide enough to pull two runes fully apart along the stave: the composition
// is re-centred and shrunk to fit the field (TalismanMedallion bindFit), so a
// large spread no longer runs off the medallion.
const OFFSET_RANGE = 90;
// Canvas cannot read the CSS custom properties, so the colours the exported
// image needs are mirrored here (forest realm + gold leaf, see index.css).
const GOLD_DEEP = "#8a6420";
const GOLD_LEAF = "#fff1bd";
const GOLD_MID = "#e2cf7a";
const PARCHMENT_DIM = "#cfc6b8";

// 9:19.5 rather than 9:16 — the ratio most current phones use, so the image
// covers a modern screen as wallpaper without the sides being cropped off.
const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 2340;
/** Medallion edge in the export, and where its centre sits (fraction of height). */
const EXPORT_MEDALLION = 980;
const EXPORT_MEDALLION_Y = 0.39;

/** Reads an image URL into a data: URL. An SVG drawn into a canvas via <img>
 *  may not fetch anything external, so the medallion photo is inlined. */
async function toDataUrl(src: string): Promise<string> {
  const blob = await (await fetch(src)).blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

/** Spaced capitals for canvas lettering; Turkish casing keeps the dotted İ. */
function spaced(t: string): string {
  return t.toLocaleUpperCase("tr-TR").split("").join(" ");
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
      material: (MEDALLION_IDS as string[]).includes(v.material ?? "")
        ? (v.material as MedallionId)
        : ("gold" as const),
    };
  })[0];
  const first = restored?.preset ?? INTENT_PRESETS[0];

  const [mode, setMode] = useState<"preset" | "custom">(restored?.mode ?? "preset");
  const [presetId, setPresetId] = useState(first.id);
  // One intent group open at a time — 33 presets in a flat grid ran far past
  // the fold on a phone.
  const [openGroup, setOpenGroup] = useState<PresetGroupId | null>(first.group);
  const [form, setForm] = useState<TalismanForm>(restored?.form ?? "bindrune");
  const [material, setMaterial] = useState<MedallionId>(restored?.material ?? "gold");
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
    saveTalisman({ form, mode, presetId, layers, offsets, material });
  }, [form, mode, presetId, layers, offsets, material]);

  const preset = INTENT_PRESETS.find((p) => p.id === presetId);

  // Everything the export draws is fetched ahead of time — fetching only when
  // the user taps "Kaydet" adds enough async delay that some browsers stop
  // treating the resulting <a download> click as user-initiated and drop it.
  const [medallionData, setMedallionData] = useState<{ id: MedallionId; url: string } | null>(
    null,
  );
  useEffect(() => {
    let live = true;
    toDataUrl(MEDALLIONS[material].src)
      .then((url) => {
        if (live) setMedallionData({ id: material, url });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [material]);
  const sceneRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = REALMS.forest.background;
    sceneRef.current = img;
  }, []);
  /** Off-screen, untilted copy of the medallion — serialised for the export. */
  const exportSvgRef = useRef<SVGSVGElement>(null);
  const exportReady = medallionData?.id === material;

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

  /** Draws the cover-fitted realm scene, darkened for the medallion and text. */
  function drawScene(ctx: CanvasRenderingContext2D, scene: HTMLImageElement) {
    const W = EXPORT_WIDTH;
    const H = EXPORT_HEIGHT;
    const k = Math.max(W / scene.naturalWidth, H / scene.naturalHeight);
    const sw = scene.naturalWidth * k;
    const sh = scene.naturalHeight * k;
    ctx.fillStyle = "#050604";
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(scene, (W - sw) / 2, (H - sh) / 2, sw, sh);

    const fade = ctx.createLinearGradient(0, 0, 0, H);
    fade.addColorStop(0, "rgba(4,6,4,0.45)");
    fade.addColorStop(0.45, "rgba(4,6,4,0.55)");
    fade.addColorStop(0.68, "rgba(4,6,4,0.82)");
    fade.addColorStop(1, "rgba(4,6,4,0.96)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, W, H);

    const vignette = ctx.createRadialGradient(W / 2, H * 0.42, W * 0.35, W / 2, H * 0.42, H * 0.75);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.75)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
  }

  /** A short gold rule with a diamond in the middle — the text block's divider. */
  function drawOrnament(ctx: CanvasRenderingContext2D, cx: number, y: number, half: number) {
    ctx.save();
    ctx.strokeStyle = "rgba(226,207,122,0.55)";
    ctx.fillStyle = "rgba(226,207,122,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - half, y);
    ctx.lineTo(cx - 18, y);
    ctx.moveTo(cx + 18, y);
    ctx.lineTo(cx + half, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, y - 9);
    ctx.lineTo(cx + 9, y);
    ctx.lineTo(cx, y + 9);
    ctx.lineTo(cx - 9, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  async function handleSaveTalisman() {
    // Make sure Cinzel/Inter are actually loaded before we draw text with
    // them — otherwise the canvas silently falls back to a generic serif.
    await document.fonts?.ready?.catch(() => {});

    const svgEl = exportSvgRef.current;
    if (!svgEl || !exportReady) return;
    const cached = sceneRef.current;
    const scene =
      cached && cached.complete && cached.naturalWidth > 0
        ? cached
        : await loadImage(REALMS.forest.background);

    // The medallion is the very same SVG as the preview, serialised and
    // rasterised — preview and export cannot drift apart.
    const svgBlob = new Blob([new XMLSerializer().serializeToString(svgEl)], {
      type: "image/svg+xml",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    let medallion: HTMLImageElement;
    try {
      medallion = await loadImage(svgUrl);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }

    const canvas = document.createElement("canvas");
    canvas.width = EXPORT_WIDTH;
    canvas.height = EXPORT_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = EXPORT_WIDTH;
    const cx = W / 2;
    const my = EXPORT_HEIGHT * EXPORT_MEDALLION_Y;
    drawScene(ctx, scene);

    // Warm light pooled behind the medallion.
    const aura = ctx.createRadialGradient(cx, my, 0, cx, my, EXPORT_MEDALLION * 0.62);
    aura.addColorStop(0, "rgba(255,214,140,0.34)");
    aura.addColorStop(0.55, "rgba(226,170,80,0.12)");
    aura.addColorStop(1, "rgba(226,170,80,0)");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, W, EXPORT_HEIGHT);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 70;
    ctx.shadowOffsetY = 34;
    ctx.drawImage(
      medallion,
      cx - EXPORT_MEDALLION / 2,
      my - EXPORT_MEDALLION / 2,
      EXPORT_MEDALLION,
      EXPORT_MEDALLION,
    );
    ctx.restore();

    // Lettering below the medallion: purpose, name in gilded capitals, a
    // divider, the runes themselves, and the brand at the foot.
    const name = mode === "preset" && preset ? preset.name : layers.join(" + ");
    const purpose = mode === "preset" && preset ? preset.category : "Özel Kombinasyon";
    const textTop = my + EXPORT_MEDALLION / 2 + 40;
    const textMax = W - 160;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.font = "500 32px Inter, sans-serif";
    ctx.fillStyle = "rgba(243,227,154,0.85)";
    ctx.fillText(spaced(purpose), cx, textTop + 40);

    const nameSize = fitFontSize(ctx, name, textMax, "700", "Cinzel, Georgia, serif", 92, 44);
    ctx.font = `700 ${nameSize}px Cinzel, Georgia, serif`;
    const nameY = textTop + 74 + nameSize;
    const half = Math.min(ctx.measureText(name).width / 2, textMax / 2);
    const leaf = ctx.createLinearGradient(cx - half, nameY - nameSize, cx + half, nameY);
    leaf.addColorStop(0, GOLD_DEEP);
    leaf.addColorStop(0.35, GOLD_MID);
    leaf.addColorStop(0.5, GOLD_LEAF);
    leaf.addColorStop(0.65, GOLD_MID);
    leaf.addColorStop(1, GOLD_DEEP);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = leaf;
    ctx.fillText(name, cx, nameY);
    ctx.restore();

    drawOrnament(ctx, cx, nameY + 56, 190);

    ctx.font = "400 34px Inter, sans-serif";
    ctx.fillStyle = PARCHMENT_DIM;
    ctx.fillText(layers.join("  ·  "), cx, nameY + 126);

    ctx.font = "600 26px Cinzel, Georgia, serif";
    ctx.fillStyle = "rgba(226,207,122,0.6)";
    ctx.fillText(spaced("Rune Kahini"), cx, EXPORT_HEIGHT - 120);

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

        <div className="mb-5 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Madalyon">
          {MEDALLION_IDS.map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={material === id}
              onClick={() => setMaterial(id)}
              className={`flex items-center justify-center gap-2 rounded-card border px-2 py-2 text-[13px] transition active:scale-[0.98] ${
                material === id
                  ? "border-hairline-strong bg-surface-gold text-gold-light"
                  : "border-hairline bg-surface text-parchment-dim hover:border-hairline-strong"
              }`}
            >
              <img src={MEDALLIONS[id].src} alt="" className="h-7 w-7" />
              {MEDALLIONS[id].name}
            </button>
          ))}
        </div>

        <Talisman3D names={layers} form={form} offsets={offsets} material={material} />

        {/* Untilted, default-lit copy with the photo inlined: this exact SVG
            becomes the medallion in the saved image. */}
        <div hidden>
          {exportReady && (
            <TalismanMedallion
              ref={exportSvgRef}
              names={layers}
              form={form}
              offsets={offsets}
              material={material}
              imageHref={medallionData.url}
              size={EXPORT_MEDALLION}
            />
          )}
        </div>

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
          disabled={layers.length === 0 || !exportReady}
          className="mt-7 min-h-14 w-full"
        >
          Tılsımı Kaydet
        </GoldButton>
        <p className="mt-3 text-center text-[13px] leading-5 text-parchment-dim">
          Madalyonu parmağınla eğebilirsin. Kaydedilen görsel telefon duvar
          kağıdı oranında hazırlanır.
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
