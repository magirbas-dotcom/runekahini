// The site's pages for search engines, each with its other-language twin (hreflang). The legal pages are
// plain HTML in public/ and listed by hand.
import type { APIRoute } from "astro";

import { dailyPath, guideAlternates, runes } from "../guide";

const pairs: { en: string; tr: string }[] = [
  { en: "/", tr: "/tr/" },
  { en: dailyPath.en, tr: dailyPath.tr },
  guideAlternates("index"),
  guideAlternates("history"),
  guideAlternates("spreads"),
  ...runes.map((r) => guideAlternates({ rune: r.name })),
  { en: "/privacy/", tr: "/gizlilik/" },
  { en: "/terms/", tr: "/kosullar/" },
  { en: "/support/", tr: "/destek/" },
];

export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() ?? "https://askrune.app/").replace(/\/$/, "");
  const links = (p: { en: string; tr: string }) =>
    `<xhtml:link rel="alternate" hreflang="en" href="${base}${p.en}"/><xhtml:link rel="alternate" hreflang="tr" href="${base}${p.tr}"/>`;
  const urls = pairs.flatMap((p) => [p.en, p.tr].map((loc) => `<url><loc>${base}${loc}</loc>${links(p)}</url>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
