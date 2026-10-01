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
import { DEFAULT_LIGHT } from "../theme/light";
import { engraveMedallion } from "./ui/engraveCanvas";
import { fitFontSize, loadImage, runeName, shareCanvas, spaced } from "./share/cardCanvas";

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
// The lock screen's clock and date cover roughly the top 28% of a phone, so the
// medallion's top edge sits below that (~29% down) and the whole composition —
// medallion and lettering — is 20% smaller than it first was (980px medallion).
const EXPORT_SCALE = 0.8;
const EXPORT_MEDALLION = Math.round(980 * EXPORT_SCALE);
const EXPORT_MEDALLION_Y = 0.46;
/** Lettering sizes and gaps, at EXPORT_SCALE. */
const T = (px: number) => Math.round(px * EXPORT_SCALE);


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
  const [photo, setPhoto] = useState<{ id: MedallionId; img: HTMLImageElement } | null>(null);
  useEffect(() => {
    let live = true;
    const img = new Image();
    img.onload = () => {
      if (live) setPhoto({ id: material, img });
    };
    img.src = MEDALLIONS[material].src;
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
  /** Off-screen copy of the cut's shapes only — the export's engraving mask. */
  const exportSvgRef = useRef<SVGSVGElement>(null);
  const exportReady = photo?.id === material;

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
    if (!svgEl || !photo || photo.id !== material) return;
    const cached = sceneRef.current;
    const scene =
      cached && cached.complete && cached.naturalWidth > 0
        ? cached
        : await loadImage(REALMS.forest.background);

    // The cut's shapes come from the same TalismanMedallion as the preview
    // (mask-only: plain shapes, no filters), so layout cannot drift. The
    // engraving itself is computed in pixels by engraveMedallion — rasterising
    // the preview's SVG lighting filters smeared the shading on some devices.
    const svgBlob = new Blob([new XMLSerializer().serializeToString(svgEl)], {
      type: "image/svg+xml",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    let mask: HTMLImageElement;
    try {
      mask = await loadImage(svgUrl);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
    const m = MEDALLIONS[material];
    const medallion = engraveMedallion({
      photo: photo.img,
      mask,
      size: EXPORT_MEDALLION,
      light: DEFAULT_LIGHT,
      tint: m.recess,
      fieldLum: m.fieldLum,
      fieldColor: m.fieldColor,
    });

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
    ctx.shadowBlur = T(70);
    ctx.shadowOffsetY = T(34);
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
    const name = mode === "preset" && preset ? preset.name : layers.map(runeName).join(" + ");
    const purpose = mode === "preset" && preset ? preset.category : "Özel Kombinasyon";
    const textTop = my + EXPORT_MEDALLION / 2 + T(40);
    const textMax = W - 160;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.font = `500 ${T(32)}px Inter, sans-serif`;
    ctx.fillStyle = "rgba(243,227,154,0.85)";
    ctx.fillText(spaced(purpose), cx, textTop + T(40));

    const nameSize = fitFontSize(ctx, name, textMax, "700", "Cinzel, Georgia, serif", T(92), T(44));
    ctx.font = `700 ${nameSize}px Cinzel, Georgia, serif`;
    const nameY = textTop + T(74) + nameSize;
    const half = Math.min(ctx.measureText(name).width / 2, textMax / 2);
    const leaf = ctx.createLinearGradient(cx - half, nameY - nameSize, cx + half, nameY);
    leaf.addColorStop(0, GOLD_DEEP);
    leaf.addColorStop(0.35, GOLD_MID);
    leaf.addColorStop(0.5, GOLD_LEAF);
    leaf.addColorStop(0.65, GOLD_MID);
    leaf.addColorStop(1, GOLD_DEEP);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = T(18);
    ctx.shadowOffsetY = T(4);
    ctx.fillStyle = leaf;
    ctx.fillText(name, cx, nameY);
    ctx.restore();

    drawOrnament(ctx, cx, nameY + T(56), T(190));

    ctx.font = `400 ${T(34)}px Inter, sans-serif`;
    ctx.fillStyle = PARCHMENT_DIM;
    ctx.fillText(layers.join("  ·  "), cx, nameY + T(126));

    ctx.font = `600 ${T(26)}px Cinzel, Georgia, serif`;
    ctx.fillStyle = "rgba(226,207,122,0.6)";
    ctx.fillText(spaced("Rune Kahini"), cx, EXPORT_HEIGHT - 120);

    shareCanvas(canvas, "tilsim-duvar-kagidi.png", "Tılsım");
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
            className={`-mb-px flex-1 border-b-2 px-3 pb-3 font-serif text-[15px] tracking-[0.08em] transition duration-200 ${
              mode === m.key
                ? "border-gold text-gold-light [text-shadow:0_0_10px_color-mix(in_oklab,var(--color-gold)_55%,transparent)]"
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
                className={`relic-card mb-2.5 overflow-hidden transition-colors duration-200 ${
                  chosen ? "is-gold" : ""
                }`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenGroup(open ? null : g.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-serif text-[16px] tracking-[0.06em] text-gold-light">
                      <span className="block h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
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

        <div className="mb-5 grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Madalyon">
          {MEDALLION_IDS.map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={material === id}
              onClick={() => setMaterial(id)}
              className={`altar-option relative flex flex-col items-center justify-center gap-1.5 overflow-hidden px-2 pb-2.5 pt-3 active:scale-[0.98] ${
                material === id ? "is-selected" : ""
              }`}
            >
              {material === id && <span key={id} className="altar-sweep" aria-hidden="true" />}
              <img src={MEDALLIONS[id].src} alt="" className="altar-stone h-11 w-11" />
              <span className="altar-label text-[13px]">{MEDALLIONS[id].name}</span>
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
              maskOnly
              names={layers}
              form={form}
              offsets={offsets}
              material={material}
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
                  className="relic-range flex-1"
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
