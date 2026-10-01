import { useEffect, useRef, useState, type PointerEvent } from "react";
import { DEFAULT_LIGHT } from "../../theme/light";
import { MEDALLIONS, type MedallionId } from "../../theme/medallions";
import TalismanMedallion, { type TalismanForm } from "./TalismanMedallion";

interface Talisman3DProps {
  names: string[];
  form: TalismanForm;
  offsets: Record<string, number>;
  material: MedallionId;
}

/** Rotation in degrees at full tilt — enough to read as an object, not to distort. */
const MAX_DEG = 13;
/** After the pointer leaves, how long before the idle sway takes over again. */
const IDLE_MS = 1800;

/**
 * The medallion as a physical object. One tilt value drives three things: the
 * perspective rotation, the carving's light direction (the light is fixed in
 * the room, so it slides across the gold the other way), and the contact
 * shadow beneath. Tilt follows the finger or mouse over the medallion; left
 * alone it sways slowly. With prefers-reduced-motion it does not sway on its
 * own, but still follows the finger.
 */
export default function Talisman3D({ names, form, offsets, material }: Talisman3DProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const lastPointer = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    let frame = 0;
    let last = 0;
    const tick = (t: number) => {
      frame = requestAnimationFrame(tick);
      // ~30fps is plenty for a slow tilt and halves the SVG filter work.
      if (t - last < 33) return;
      last = t;
      // The idle sway is motion the user did not ask for, so it is skipped
      // under reduced motion; tilting with a finger is direct manipulation
      // and stays.
      if (!reduced && t - lastPointer.current > IDLE_MS) {
        target.current = { x: Math.sin(t / 2200) * 0.5, y: Math.sin(t / 2900) * 0.32 };
      }
      setTilt((cur) => {
        const nx = cur.x + (target.current.x - cur.x) * 0.18;
        const ny = cur.y + (target.current.y - cur.y) * 0.18;
        return Math.abs(nx - cur.x) < 0.001 && Math.abs(ny - cur.y) < 0.001 ? cur : { x: nx, y: ny };
      });
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    target.current = {
      x: clamp(((e.clientX - box.left) / box.width) * 2 - 1),
      y: clamp(((e.clientY - box.top) / box.height) * 2 - 1),
    };
    lastPointer.current = performance.now();
  }

  const light = { x: DEFAULT_LIGHT.x - tilt.x * 0.55, y: DEFAULT_LIGHT.y - tilt.y * 0.55 };

  return (
    <div
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
      className="relative mx-auto aspect-square w-full max-w-[380px] touch-pan-y select-none [perspective:900px]"
    >
      {/* Aura behind the medallion, in the realm's accent. */}
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-gold)_32%,transparent)_0%,transparent_68%)] blur-xl"
      />
      {/* Contact shadow: slides opposite the tilt, as if cast from above. */}
      <div
        aria-hidden="true"
        className="absolute left-[16%] top-[24%] h-[68%] w-[68%] rounded-full bg-black/70 blur-2xl"
        style={{ transform: `translate(${-tilt.x * 14}px, ${18 - tilt.y * 8}px)` }}
      />
      <div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ transform: `rotateY(${tilt.x * MAX_DEG}deg) rotateX(${-tilt.y * MAX_DEG}deg)` }}
      >
        <TalismanMedallion
          names={names}
          form={form}
          offsets={offsets}
          material={material}
          light={light}
          className="h-full w-full"
        />
        {/* Re-keyed on the composition, so a light sweeps across the medallion
            each time its engraving changes. Masked by the medallion photo
            itself, so the light only travels over metal. */}
        <div
          key={`${material}:${form}:${names.join("|")}`}
          className="medallion-sweep"
          style={{
            maskImage: `url(${MEDALLIONS[material].src})`,
            WebkitMaskImage: `url(${MEDALLIONS[material].src})`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            borderRadius: 0,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
