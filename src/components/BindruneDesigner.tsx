import { useState } from "react";
import { runes } from "../data/runes";
import { RUNE_STROKES, INTENT_PRESETS } from "../data/runeStrokes";

interface Layer {
  name: string;
  offsetY: number;
}

const OPACITY_STEPS = [1, 0.8, 0.65, 0.5];
const DEFAULT_OFFSETS = [0, -30, 30, -55];
const MAX_LAYERS = 4;
const CANVAS_SIZE = 400;
const GLYPH_SCALE = 2.1;

function layersFromNames(names: string[]): Layer[] {
  return names.map((name, i) => ({ name, offsetY: DEFAULT_OFFSETS[i] ?? 0 }));
}

// 24 small tick marks around the ring, one per rune of the Elder Futhark —
// purely decorative, evokes a protective rune circle without spelling anything out.
const TICK_COUNT = 24;
const RING_CENTER = CANVAS_SIZE / 2;
const RING_OUTER_R = 186;
const RING_TICK_INNER_R = 178;
const ringTicks = Array.from({ length: TICK_COUNT }, (_, i) => {
  const angle = (i / TICK_COUNT) * 2 * Math.PI;
  const x1 = RING_CENTER + RING_OUTER_R * Math.cos(angle);
  const y1 = RING_CENTER + RING_OUTER_R * Math.sin(angle);
  const x2 = RING_CENTER + RING_TICK_INNER_R * Math.cos(angle);
  const y2 = RING_CENTER + RING_TICK_INNER_R * Math.sin(angle);
  return { x1, y1, x2, y2 };
});

export default function BindruneDesigner() {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [presetId, setPresetId] = useState(INTENT_PRESETS[0].id);
  const [layers, setLayers] = useState<Layer[]>(
    layersFromNames(INTENT_PRESETS[0].runeNames),
  );

  const preset = INTENT_PRESETS.find((p) => p.id === presetId);

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

  function handleDownload() {
    const svg = document.getElementById("bindrune-svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const scaleFactor = 2;
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE * scaleFactor;
      canvas.height = CANVAS_SIZE * scaleFactor;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "tilsim.png";
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  }

  const synergy =
    mode === "preset" && preset
      ? preset.synergy
      : layers.length > 1
        ? `${layers.map((l) => l.name).join(" + ")} Rune'lerinin enerjileri tek bir sembolde birleşiyor.`
        : null;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
        {INTENT_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => selectPreset(p.id)}
            className={`rounded-lg border px-2 py-2 text-left text-xs transition ${
              mode === "preset" && presetId === p.id
                ? "border-amber-300/60 bg-amber-200/10 text-amber-100"
                : "border-stone-700 text-stone-400 hover:border-stone-600"
            }`}
          >
            <span className="block font-medium">{p.name}</span>
            <span className="block text-[11px] text-stone-500">{p.category}</span>
          </button>
        ))}
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
            <radialGradient id="bg-glow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="#0c0a09" />
          <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="url(#bg-glow)" />

          {/* Decorative protective circle: two rings + 24 ticks, one per Futhark rune */}
          <circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={RING_OUTER_R}
            fill="none"
            stroke="#fbbf24"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={RING_OUTER_R - 14}
            fill="none"
            stroke="#fbbf24"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
          {ringTicks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="#fbbf24"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
          ))}

          {layers.length === 0 && (
            <text
              x={CANVAS_SIZE / 2}
              y={CANVAS_SIZE / 2}
              textAnchor="middle"
              fill="#78716c"
              fontSize="14"
            >
              Rune seçin
            </text>
          )}
          {layers.map((layer, i) => {
            const cx = CANVAS_SIZE / 2;
            const cy = CANVAS_SIZE / 2 + layer.offsetY;
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
                  min={-70}
                  max={70}
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
          onClick={handleDownload}
          disabled={layers.length === 0}
          className="rounded-lg bg-amber-200/90 px-5 py-2 text-sm font-medium text-stone-900 shadow transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tılsımı İndir (PNG)
        </button>
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
