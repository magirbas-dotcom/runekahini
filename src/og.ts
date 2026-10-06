// Share images (2026-10-07): every page's 1200×630 picture for link previews (WhatsApp, X, iMessage…), made
// by scripts/og.mjs from the list at /og-pages.json and kept in public/og/. One address rule, used by both.

/** "/" → "/og/home.jpg", "/tr/rehber/fehu/" → "/og/tr/rehber/fehu.jpg". */
export const ogPath = (htmlPath: string) => `/og${htmlPath === "/" ? "/home" : htmlPath.replace(/\/$/, "")}.jpg`;
