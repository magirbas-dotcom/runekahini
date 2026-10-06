// What each page's share image says and shows, for scripts/og.mjs (which draws them in a browser, where the
// site's own fonts load). Not linked from anywhere; the images themselves are in public/og/.
import type { APIRoute } from "astro";

import { content, dailyPath, firstSense, guideCopy, guidePath, lore, runes } from "../guide";
import { copy, type Lang } from "../i18n";
import { ogPath } from "../og";

interface OgPage {
  path: string;
  out: string;
  lang: Lang;
  kicker: string;
  title: string;
  sub: string;
  /** Source files, from the repository root. */
  stone: string;
  bg: string;
}

const guideStone = (n: string) => `src/assets/guide/${n.toLowerCase()}.webp`;

export const GET: APIRoute = () => {
  const pages: OgPage[] = [];
  for (const lang of ["en", "tr"] as const) {
    const t = copy[lang];
    const g = guideCopy[lang];
    const c = content[lang];
    const p = guidePath[lang];
    const locale = lang === "tr" ? "tr-TR" : "en";
    const add = (path: string, rest: Omit<OgPage, "path" | "out" | "lang">) =>
      pages.push({ path, out: ogPath(path), lang, ...rest });
    add(lang === "tr" ? "/tr/" : "/", {
      kicker: t.hero.kicker,
      title: t.hero.title.join(" "),
      sub: t.meta.description.split(". ")[0] + ".",
      stone: "src/assets/craft/stone-dagaz.webp",
      bg: "src/assets/bg/altar-wide.webp",
    });
    add(dailyPath[lang], {
      kicker: t.daily.kicker,
      title: t.daily.title,
      sub: t.daily.support,
      stone: "src/assets/craft/blank-basalt.webp",
      bg: "src/assets/bg/realm-home.webp",
    });
    add(p.index, {
      kicker: g.kicker,
      title: g.title,
      sub: g.sub,
      stone: "src/assets/craft/stone-ingwaz.webp",
      bg: "src/assets/bg/scrolls.webp",
    });
    add(p.history, {
      kicker: g.title.toLocaleUpperCase(locale),
      title: g.historyLink.title,
      sub: g.historyLink.desc,
      stone: guideStone("Othala"),
      bg: "src/assets/bg/scrolls.webp",
    });
    add(p.spreads, {
      kicker: g.title.toLocaleUpperCase(locale),
      title: g.spreadsLink.title,
      sub: g.spreadsLink.desc,
      stone: guideStone("Raidho"),
      bg: "src/assets/bg/altar-wide.webp",
    });
    for (const r of runes) {
      const text = c.runes[r.name];
      add(p.rune(r.name), {
        kicker: [firstSense(text.literalMeaning), c.aettNames[String(r.aett) as "1" | "2" | "3"]].join(" · ").toLocaleUpperCase(locale),
        title: r.name,
        sub: `${text.upright.keywords.join(" · ")}${lore[lang].runes[r.name] ? ` — ${lore[lang].runes[r.name].question}` : ""}`,
        stone: guideStone(r.name),
        bg: "src/assets/bg/scrolls.webp",
      });
    }
  }
  return new Response(JSON.stringify(pages, null, 1), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
