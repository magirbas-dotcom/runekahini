/**
 * Portrait-only fallback. iOS gives web apps no orientation lock and the
 * manifest's orientation is ignored there, so when a phone is turned sideways
 * this covers the app with a request to turn it back. Shown purely by CSS
 * (.rotate-notice, landscape and short screens only), so tablets and desktop
 * browsers are unaffected.
 */
export default function RotateNotice() {
  return (
    <div className="rotate-notice" role="alert" aria-live="polite">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="rotate-notice-icon">
        <rect x="20" y="8" width="24" height="44" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="46" r="1.6" fill="currentColor" />
        <path d="M50 22 a18 18 0 0 1 0 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <path d="M50 42 l-3 -1 M50 42 l1 -3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      </svg>
      <p className="gilded-text font-serif text-2xl">Rune Kahini</p>
      <p className="text-[15px] text-parchment-dim">Lütfen telefonunu dik tut.</p>
    </div>
  );
}
