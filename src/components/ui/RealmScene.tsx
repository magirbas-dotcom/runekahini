import { REALMS, type RealmName } from "../../theme/realms";
import RealmParticles from "./RealmParticles";

const ORDER: RealmName[] = ["fire", "aurora", "forest"];

/**
 * The living backdrop. All three realm photos stay mounted and crossfade, so a
 * tab switch dissolves from one world into the next instead of cutting. Each
 * photo drifts very slowly (a Ken Burns pan over about a minute) and carries a
 * realm-specific light motion — firelight flicker, aurora shimmer, sunbeams —
 * all in CSS (index.css, .realm-layer-*). Particles ride on top. Everything
 * stops under prefers-reduced-motion.
 */
export default function RealmScene({ realm }: { realm: RealmName }) {
  return (
    <div className="realm-scene" aria-hidden="true">
      {ORDER.map((name) => (
        <div
          key={name}
          className={`realm-layer realm-layer-${name} ${name === realm ? "is-active" : ""}`}
          style={{ backgroundImage: `url(${REALMS[name].background})` }}
        />
      ))}
      <div className="realm-scrim" />
      <RealmParticles key={realm} realm={realm} />
    </div>
  );
}
