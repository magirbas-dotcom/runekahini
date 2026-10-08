// For AI search and answer engines (2026-10-06, user: "beyond SEO, support AI search engines too"): the site's
// content as plain Markdown. /llms.txt (llmstxt.org) is the map, /llms-full.txt everything in one file, and every
// guide page has a .md twin (/guide/fehu.md, /tr/rehber/fehu.md) that its HTML page links to. All built from the
// same sources as the pages (src/guide.ts, src/i18n.ts), so the two never drift apart.

import { content, firstSense, guideCopy, guidePath, lore, runes } from "./guide";
import { CORRESPONDENCES, nameIn, STONES } from "./content/correspondences";
import { copy, type Lang } from "./i18n";

export const SITE = "https://askrune.app";

/** The Markdown twin of a guide page: "/guide/fehu/" → "/guide/fehu.md", "/guide/" → "/guide.md". */
export const mdPath = (htmlPath: string) => htmlPath.replace(/\/$/, "") + ".md";

const aettName = (lang: Lang, aett: number) => content[lang].aettNames[String(aett) as "1" | "2" | "3"];

/** Words for the Markdown pages that the HTML pages say with layout instead. */
const words = {
  en: {
    source: "Source",
    other: "Türkçe",
    element: "Element",
    aett: "Aett",
    meaning: "Meaning",
    reversible: "Reversed reading",
    yes: "yes",
    no: "no (symmetrical, always read upright)",
    modern: "modern interpretation",
    runes: "The 24 runes",
    app: "The app",
    guide: "Rune Guide",
    about: "AskRune is a rune reading app for iPhone and Android (coming soon to the App Store and Google Play).",
  },
  tr: {
    source: "Kaynak",
    other: "English",
    element: "Element",
    aett: "Aett",
    meaning: "Anlam",
    reversible: "Ters okuma",
    yes: "var",
    no: "yok (simetrik, her zaman düz okunur)",
    modern: "modern yorum",
    runes: "24 rune",
    app: "Uygulama",
    guide: "Rune Rehberi",
    about: "AskRune (Türkçe adı Rune Kahini), iPhone ve Android için bir rune okuması uygulamasıdır (yakında App Store ve Google Play'de).",
  },
} as const;

function head(lang: Lang, title: string, htmlPath: string, otherPath: string) {
  const w = words[lang];
  return `# ${title}\n\n${w.source}: ${SITE}${htmlPath} · ${w.other}: ${SITE}${mdPath(otherPath)}\n`;
}

/** One rune: its facts, upright and reversed readings, tip and lore. */
/** A rune's stones, incense and scents (modern correspondences), as on its page. */
function corrMd(name: string, lang: Lang): string[] {
  const c = CORRESPONDENCES[name];
  if (!c) return [];
  const g = guideCopy[lang];
  const w = words[lang];
  return [
    `## ${g.corr.title} (${w.modern})`,
    "",
    `- ${c.stones.map((s) => nameIn(STONES[s], lang)).join(", ")}`,
    `- ${g.corr.incense}: ${c.incense.map((n) => nameIn(n, lang)).join(", ")}`,
    `- ${g.corr.scents}: ${c.scents.map((n) => nameIn(n, lang)).join(", ")}`,
    "",
    g.corr.note,
    "",
  ];
}

export function runeMd(lang: Lang, name: string) {
  const g = guideCopy[lang];
  const w = words[lang];
  const r = runes.find((x) => x.name === name)!;
  const t = content[lang].runes[name];
  const l = lore[lang].runes[name];
  const other = lang === "tr" ? "en" : "tr";
  const out = [
    head(lang, g.meta.rune(name, firstSense(t.literalMeaning)).replace(/ · AskRune$/, ""), guidePath[lang].rune(name), guidePath[other].rune(name)),
    `- ${w.meaning}: ${t.literalMeaning}`,
    `- ${g.sound}: ${r.soundValue} (${r.pronunciation})`,
    l ? `- ${g.proto}: ${l.proto}` : "",
    `- ${w.aett}: ${aettName(lang, r.aett)}`,
    `- ${w.element}: ${content[lang].elements[r.element]}`,
    `- ${w.reversible}: ${r.reversible ? w.yes : w.no}`,
    "",
  ];
  const reading = (label: string, x: typeof t.upright) =>
    [`## ${label}`, "", `${g.keywords}: ${x.keywords.join(", ")}`, "", `### ${g.general}`, "", x.general, "", `### ${g.love}`, "", x.love, "", `### ${g.career}`, "", x.career, ""].join("\n");
  out.push(reading(g.upright, t.upright));
  if (r.reversible && t.reversed) out.push(reading(g.reversed, t.reversed));
  out.push(`## ${g.practicalTip}`, "", t.practicalNote, "");
  if (l) {
    out.push(
      `## ${g.lore.poem}`, "", l.poem, "",
      `## ${g.lore.myth}`, "", l.myth, "",
      `## ${g.lore.inner}`, "", l.inner, "",
      `## ${g.lore.shadow}`, "", l.shadow, "",
      `## ${g.lore.harmony} (${w.modern})`, "", l.harmony, "",
      `## ${g.lore.talisman} (${w.modern})`, "", l.talisman, "",
      ...corrMd(r.name, lang),
      `## ${g.lore.question}`, "", l.question, "",
    );
  }
  return out.filter((x, i, a) => !(x === "" && a[i - 1] === "")).join("\n");
}

export function historyMd(lang: Lang) {
  const g = guideCopy[lang];
  const other = lang === "tr" ? "en" : "tr";
  const sections = lore[lang].history.map(
    (s) => `## ${s.title}${s.modern ? ` (${words[lang].modern})` : ""}\n\n${s.paragraphs.join("\n\n")}\n`,
  );
  return [head(lang, g.historyLink.title, guidePath[lang].history, guidePath[other].history), ...sections, g.sources, ""].join("\n");
}

export function spreadsMd(lang: Lang) {
  const g = guideCopy[lang];
  const l = lore[lang];
  const other = lang === "tr" ? "en" : "tr";
  const sections = l.spreads.map((s) =>
    [
      `## ${s.title}`,
      "",
      `**${g.spread.origin}:** ${s.origin}`,
      "",
      `**${g.spread.layout}:** ${s.layout}`,
      "",
      `**${g.spread.positions}:**`,
      "",
      ...s.positions.map((p, i) => (s.key === "scatter" ? `- ${p}` : `${i + 1}. ${p}`)),
      "",
      `**${g.spread.questions}:** ${s.questions}`,
      "",
      `**${g.spread.reading}:** ${s.reading}`,
      "",
    ].join("\n"),
  );
  return [head(lang, g.spreadsLink.title, guidePath[lang].spreads, guidePath[other].spreads), `${l.spreadsIntro} (${words[lang].modern})`, "", ...sections, g.sources, ""].join("\n");
}

/** The guide's front page: what the runes are, then the 24 with their meanings and keywords. */
export function guideIndexMd(lang: Lang) {
  const g = guideCopy[lang];
  const c = content[lang];
  const p = guidePath[lang];
  const other = lang === "tr" ? "en" : "tr";
  const aettir = [1, 2, 3].map((a) =>
    [
      `### ${aettName(lang, a)}: ${g.aettThemes[a - 1]}`,
      "",
      ...runes
        .filter((r) => r.aett === a)
        .map((r) => `- [${r.name}](${SITE}${mdPath(p.rune(r.name))}) (${r.symbol}, ${r.soundValue}): ${c.runes[r.name].literalMeaning}. ${c.runes[r.name].upright.keywords.join(", ")}.`),
      "",
    ].join("\n"),
  );
  return [
    head(lang, g.title, p.index, guidePath[other].index),
    `> ${g.sub}`,
    "",
    `## ${g.introTitle}`,
    "",
    g.intro.join("\n\n"),
    "",
    `- [${g.historyLink.title}](${SITE}${mdPath(p.history)}): ${g.historyLink.desc}`,
    `- [${g.spreadsLink.title}](${SITE}${mdPath(p.spreads)}): ${g.spreadsLink.desc}`,
    "",
    `## ${g.runesTitle}`,
    "",
    ...aettir,
    g.sources,
    "",
  ].join("\n");
}

/** The landing in words: what the app does, privacy, plans, and every question with its answer. */
export function aboutMd(lang: Lang) {
  const t = copy[lang];
  const w = words[lang];
  return [
    `## ${w.app}`,
    "",
    w.about,
    "",
    t.hero.sub,
    "",
    ...t.features.map((f) => `- **${f.kicker}: ${f.title}.** ${f.text}`),
    ...t.more.items.map((m) => `- **${m.title}.** ${m.text}`),
    "",
    `**${t.craft.title}.** ${t.craft.text} ${t.craft.note}`,
    "",
    `### ${t.privacy.title}`,
    "",
    ...t.privacy.items.map((i) => `- **${i.title}:** ${i.text}`),
    "",
    `### ${t.plans.title}`,
    "",
    `- **${t.plans.free}:** ${t.plans.freeItems.join(", ")}.`,
    `- **${t.plans.premium}:** ${t.plans.premiumItems.join(", ")}. ${t.plans.note}`,
    "",
    `### ${t.faq.title}`,
    "",
    ...t.faq.groups.flatMap((gr) => gr.items.map((f) => `**${f.q}**\n\n${f.a}\n`)),
  ].join("\n");
}

/** /llms.txt (llmstxt.org): what the site is and where its Markdown lives, both languages. */
export function llmsTxt() {
  const section = (lang: Lang) => {
    const g = guideCopy[lang];
    const p = guidePath[lang];
    const w = words[lang];
    return [
      `## ${w.guide} (${lang === "tr" ? "Türkçe" : "English"})`,
      "",
      `- [${g.title}](${SITE}${mdPath(p.index)}): ${g.sub}`,
      `- [${g.historyLink.title}](${SITE}${mdPath(p.history)}): ${g.historyLink.desc}`,
      `- [${g.spreadsLink.title}](${SITE}${mdPath(p.spreads)}): ${g.spreadsLink.desc}`,
      ...runes.map((r) => `- [${r.name}](${SITE}${mdPath(p.rune(r.name))}): ${content[lang].runes[r.name].literalMeaning}`),
      "",
    ].join("\n");
  };
  return [
    "# AskRune",
    "",
    `> ${copy.en.meta.description}`,
    "",
    "AskRune (in Turkish: Rune Kahini) is a rune reading app for iPhone and Android by Murat Ağırbaş, in English and Turkish. This site presents the app and holds its free Rune Guide: all 24 runes of the Elder Futhark with upright and reversed meanings (general, love, career), rune poems, history and myth, and the spreads. Attested history and modern interpretation are kept apart: rune reading as practised today, reversed runes, the blank rune, the birth rune and talisman design are labelled modern. A rune reading is for reflection and inspiration, not a prediction or professional advice.",
    "",
    `- [Everything in one file](${SITE}/llms-full.txt): the app, the FAQ and the whole Rune Guide, in English and Turkish`,
    `- [About the app and FAQ (English)](${SITE}/): features, privacy, plans, questions`,
    `- [Uygulama ve SSS (Türkçe)](${SITE}/tr/)`,
    `- [Rune of the Day](${SITE}/rune-of-the-day/) · [Günün Rune'si](${SITE}/tr/gunun-runesi/): one rune a day, the same stone as in the app (drawn in the browser from the local date)`,
    "",
    section("en"),
    section("tr"),
    "## Optional",
    "",
    `- [Privacy Policy](${SITE}/privacy/): no account, no server, no analytics; data stays on the phone`,
    `- [Terms of Use](${SITE}/terms/)`,
    `- [Support](${SITE}/support/): destek@askrune.app`,
    "",
  ].join("\n");
}

/** /llms-full.txt: the app, the FAQ and the whole guide, English then Turkish. */
export function llmsFull() {
  const lang = (l: Lang) =>
    [
      `# AskRune · ${l === "tr" ? "Türkçe" : "English"}`,
      "",
      aboutMd(l),
      guideIndexMd(l),
      historyMd(l),
      spreadsMd(l),
      ...runes.map((r) => runeMd(l, r.name)),
    ].join("\n\n---\n\n");
  return `${lang("en")}\n\n---\n\n${lang("tr")}\n`;
}

/** A Markdown response, served as UTF-8 text. */
export const markdown = (body: string) =>
  new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });

