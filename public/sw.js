// Retires the old Rune Kahini web app (PWA), 2026-10-05: askrune.app is now the mobile app's site.
// Browsers that installed the PWA still have its service worker, which would keep serving the cached
// app. They fetch this file on their next visit (it is never cached, see _headers); it takes over at
// once, empties the old caches, removes itself and reloads open pages so they show the new site.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: "window" });
      windows.forEach((w) => w.navigate(w.url));
    })(),
  );
});
