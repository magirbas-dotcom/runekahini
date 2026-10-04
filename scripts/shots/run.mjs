import { launch, page, sleep } from "./cdp.mjs";

const BASE = "http://localhost:8081";
const LANG = process.argv[2] ?? "tr";
const ONLY = process.argv[3]; // optional: run one scene
const OUT = new URL(`./out/${LANG}`, import.meta.url).pathname;
const tr = LANG === "tr";
const L = {
  turn: tr ? "Taşı Çevir" : "Turn the Stone",
  devOn: tr ? "[Geliştirme] Premium'u aç" : "[Dev] Turn Premium on",
  close: tr ? "Kapat" : "Close",
  reading: tr ? "Okuma" : "Reading",
  three: tr ? "Üç Rune" : "Three",
  draw: tr ? "Taşları Çek" : "Draw the Stones",
  revealAll: tr ? "Tümünü Aç" : "Reveal All",
  birth: tr ? "Doğum" : "Birth",
  calcBirth: tr ? "Doğum Rune'mi Hesapla" : "Find My Birth Runes",
  talisman: tr ? "Tılsım" : "Talisman",
  home: tr ? "Ana Sayfa" : "Home",
  compat: tr ? "Rune Uyumu" : "Rune Compatibility",
  calcCompat: tr ? "Uyumu Hesapla" : "See Our Compatibility",
};

/** Types into the page's inputs in order, the way React expects (native setter + input event). */
const fill = (values) => `(() => {
  const inputs = [...document.querySelectorAll('input, textarea')];
  const vals = ${JSON.stringify(values)};
  vals.forEach((v, i) => {
    if (v === null || !inputs[i]) return;
    const el = inputs[i];
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  });
  return inputs.length;
})()`;

const { proc, send } = await launch(new URL("./profile", import.meta.url).pathname);
const p = page(send, OUT);
const run = (name) => !ONLY || ONLY === name;
try {
  await send("Page.enable");
  await send("Runtime.enable");
  await p.phone();
  await p.go(BASE + "/", 4000);
  await p.eval(`(() => {
    localStorage.clear();
    const s = (k, v) => localStorage.setItem('runekahini.v1.' + k, JSON.stringify(v));
    s('onboarded', true); s('userName', ''); s('reminderAsked', true); s('musicOn', false);
    localStorage.setItem('runekahini.v1.lang', '${LANG}');
  })()`);
  await p.go(BASE + "/", 9000);
  if (run("home")) {
    await p.click(L.turn, 3500);
    await p.shot("home");
  }

  // Premium on (dev switch on the paywall), then move by in-app links so the state survives.
  await p.go(BASE + "/paywall", 6000);
  if (run("paywall")) await p.shot("paywall");
  await p.click(L.devOn, 1000);
  await p.click(L.close, 2500);

  if (run("reading")) {
    await p.click(L.reading, 3000);
    await p.click(L.three, 1500);
    await p.shot("reading-pick");
    await p.click(L.draw, 3000);
    await p.click(L.revealAll, 3500);
    await p.shot("reading-drawn");
  }

  if (run("birth")) {
    await p.click(L.birth, 3500);
    console.log("inputs", await p.eval(fill(["14", "03", "1990", "08", "30"])));
    await sleep(800);
    await p.click(L.calcBirth, 4000);
    await p.shot("birth");
  }

  if (run("talisman")) {
    await p.click(L.talisman, 5000);
    await p.shot("talisman");
    await p.eval(`(() => { const c=[...document.querySelectorAll("canvas")].sort((a,b)=>b.width*b.height-a.width*a.height)[0]; c.scrollIntoView({block:"center"}); return c.width; })()`);
    await sleep(2500);
    await p.shot("talisman-medallion");
  }

  if (run("compat")) {
    await p.click(L.home, 3000);
    await p.click(L.compat, 4000);
    console.log("inputs", await p.eval(fill(["Elif", "21", "06", "1992", "Deniz", "09", "11", "1989"])));
    await sleep(800);
    await p.shot("compat-form");
    await p.click(L.calcCompat, 4500);
    await p.shot("compat");
  }
} catch (e) {
  console.error("ERR", e.message);
  await p.shot("error");
} finally {
  await sleep(300);
  proc.kill();
}
