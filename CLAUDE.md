# CLAUDE.md

Bu dosya, Claude Code'un (claude.ai/code) bu depoda çalışırken projeyi hızlıca hatırlaması için yazıldı.

## Proje nedir

**Rune Kahini** — Elder Futhark Rune okuması, doğum rünü / burç haritası ve tılsım tasarımı yapılan,
tamamen istemci taraflı (backend/veritabanı yok), Türkçe bir web uygulaması.

- Canlı adres: https://runekahini.vercel.app
- GitHub: https://github.com/magirbas-dotcom/runekahini (branch: `main`)
- Vercel bu repoya bağlı: `main`'e her `git push` otomatik prod deploy tetikler.
- **Bu, `E:\Claude` kök deposundan bağımsız, kendi git geçmişine sahip ayrı bir repo.** Kök `E:\Claude\CLAUDE.md`
  bu projeyle ilgili değil, karıştırmamak lazım.

## Teknoloji yığını

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 — token'lar `src/index.css` içindeki `@theme` bloğunda, `@tailwindcss/vite` plugin'i
- `vite-plugin-pwa`, **`registerType: 'prompt'`** + `injectRegister: null` (kayıt `ReloadPrompt` içinde
  `virtual:pwa-register/react` ile yapılıyor)
- Canvas 2D API ile tılsım PNG'si üretilip indiriliyor/paylaşılıyor (Web Share API + `<a download>` fallback)
- State yönetimi kütüphanesi yok; her şey React local state

## Komutlar

```bash
npm run dev            # geliştirme sunucusu (.claude/launch.json'da "rune-oracle", port 5173)
npm run build          # tsc -b && vite build → dist/
npm run preview        # build'i yerelde önizle (port 4173, "rune-oracle-preview")
npm run lint           # oxlint
npx tsc -b --noEmit    # sadece tip kontrolü
```

`OraclePage.tsx`'te `useMemo`/`todayKey` için bilinen bir lint uyarısı var — kasıtlı ("gün değişince yeniden
hesapla" tetikleyicisi). Yeni uyarı eklememek gerekir, bu birini saymayın.

## Tasarım sistemi

Ham Tailwind paleti (`stone-*`, `amber-*`) **kullanılmaz**; `index.css` `@theme` içindeki semantik token'lar
kullanılır: `ink`, `ink-soft`, `surface`, `surface-raised`, `surface-gold`, `gold`, `gold-light`, `gold-dark`,
`parchment`, `parchment-dim`, `parchment-mute`, `hairline`, `hairline-strong`.

- **`parchment-mute` gövde metninde kullanılmaz** — `surface` üzerinde 3.94:1, WCAG AA altında. Sadece
  dekoratif/pasif öğelerde. Gövde metni `parchment` veya `parchment-dim` (8.48:1).
- Gövde metni tabanı 16/26 (`.prose-reading`).
- Ortak primitifler `src/components/ui/` altında: `MysticCard`, `SectionHeader`, `GoldButton`, `RuneChip`,
  `MysticDivider`, `MysticInput`, `SpreadOptionCard`, `RuneGlyph`, `ZodiacGlyph`, `RuneEmblem`,
  `IntentPresetCard`, `RunePicker`, `BindruneCanvas`. Yeni kart/buton/etiket yazmadan önce buraya bakın.
- Animasyonlar daima `prefers-reduced-motion: reduce` ile kapatılabilir olmalı.

## Mimari / önemli dosyalar

### Veri

- `src/data/runes.ts` — 24 rün: `Rune` arayüzü, `AETT_NAMES`, `RUNE_POSSESSIVE` (Türkçe iyelik ekleri),
  `drawRunes()`, `drawDailyRune(dateKey)`, `runeById()`.
- `src/data/runeGlyphs.ts` — **Glif çizimlerinin tek kaynağı.** `RUNE_GLYPHS` (24 dolgu path'i, kaynak
  görselin koordinat uzayında + `cx`/`cy`/`staveDx`), `glyphTransform()`, `sealLayout()`, `GLYPH_FIT_SCALE`.
  Eski `RUNE_STROKES` tablosu kaldırıldı.
- `src/data/runeStrokes.ts` — artık yalnızca `INTENT_PRESETS` (20 hazır niyet). Dosya adı tarihsel.
- `src/data/zodiac.ts` — 12 burç: ad, element, tarih aralığı, iki rune, yorum, burç tılsımı metni;
  `ZODIAC_STROKES` (elle çizilmiş 12 burç glifi), `zodiacForDate()`, `solarRuneForDate()`.
- `src/data/birthRune.ts` — Kader Yolu (numeroloji), Solar (artık `zodiac.ts`'e delege eder), Doğum Saati.
- `src/data/synergy.ts` — `buildSynergySummary()` (açılımlar), `buildCustomSynergy()` (özel tılsım).

### Ekranlar

- `src/components/OraclePage.tsx` — "Rune Okuması": zeminde `<tarih> · GÜNÜN RUNE'Sİ` başlığı + kapalı gelen
  günlük rune kartı, Açılım Seçimi (soru alanının **üstünde**), "Bir Soru Sor", çekiş animasyonu, accordion
  detay kartları, "Rune Rehberi".
- `src/components/BirthRunePage.tsx` + `BirthRuneCard.tsx` + `ZodiacCard.tsx` — "Doğum Rune'si": burç kartı
  (hero), Kader Yolu (hero), Solar ve Doğum Saati (accordion).
- `src/components/BindruneDesigner.tsx` — "Tılsım". **İki form var:**
  - `bindrune` — rünler ortak gövdede üst üste; `glyphTransform(..., alignStave=true)` ile omurgadan
    hizalanır, konum slider'ları burada çalışır.
  - `medallion` — her rune kendi dairesinde (`sealLayout`), daireler birbirine değer ama dış halkaya değmez;
    ayar yok.
- `src/components/ReloadPrompt.tsx` — yeni sürüm çıkınca "Yenile / Daha Sonra" bildirimi.
- `src/App.tsx` — kabuk + 3'lü nav (Rune Okuması / Doğum Rune'si / Tılsım).

## Konvansiyonlar / dikkat edilecekler

- **Türkçe iyelik ekleri elle eşlenir** (`RUNE_POSSESSIVE`); Latin harf çevirisinden türetilemez.
- **`lang="tr"` tuzağı:** CSS `text-transform: uppercase`, "bindrune"u "BİNDRUNE" yapar (noktalı İ). Norse
  kökenli kelimeler arayüzde baştan büyük harfle yazılır. Cinzel de küçük harfleri küçük-kapital basar ama
  "i"nin noktasını korur — aynı sorun.
- **Glif değişikliği tek yerden:** tüm ekranlar `RUNE_GLYPHS`'ten besleniyor. Referans görsel geldiğinde
  path'ler oradan çıkarılır; isim eşleşmesi **ızgara sırasına güvenilerek değil, Unicode ile tek tek
  karşılaştırılarak** doğrulanır. (Bir kaynak seti Othala/Dagaz'ı ters sırada veriyordu — bracteate
  sıralaması.)
- **Önizleme ve export ayrışmamalı.** `BindruneCanvas` (SVG) ile `drawLayers` (canvas) aynı `sealLayout` /
  `glyphTransform` matematiğini kullanır. Yeni bir yerleşim eklenirse ortak fonksiyona konur.
- **Canvas CSS değişkeni okuyamaz** — `BindruneDesigner` içinde `GOLD`/`GOLD_LIGHT`/`PARCHMENT`/`INK_RGB`
  sabitleri `@theme`'i aynalar; ikisi birlikte güncellenir.
- **Push öncesi her zaman kullanıcıdan açık onay alınır** (sibling proje FirstGate'teki olay — bkz. kullanıcı
  hafızası `firstgate-lovable-workflow.md`). Lovable/Vercel'in kendi web editörünün bu repoya dokunmasına
  izin verilmez.
- **Deploy doğrulama:** yerel `dist/assets/index-*.js` hash'i ile canlı sitedekini karşılaştır (Vercel
  dashboard erişimi yok).
- **`read_network_requests`, `<a download>` blob indirmelerini yakalamaz.** PNG export'u doğrulamak için
  `HTMLCanvasElement.prototype.toBlob`'u sarmalayıp canvas'ı sayfaya basmak en pratik yöntem.
- Proje client-side-only; backend/API/veritabanı yok ve planlanmıyor.

## Tarihsel dürüstlük çizgisi

Uygulama ezoterik içerik sunuyor ama **uydurma tarih sunmuyor.** Kurulmuş çizgi:

- Doğum rünü, burç–rune eşleşmesi ve tılsım tasarımcısı arayüzde açıkça "modern yorum" diye etiketlenir.
- Burç–rune eşleşmesinin hiçbir İskandinav kaynağında geçmediği yazılıdır.
- "Boş rune"un 1954 değil **1982'de Ralph Blum'un icadı** olduğu Rune Rehberi'nde belirtilir.
- Madalyon formu bir ligatür değil; dürüstlük notu bunu söyler.
- Reddedilen içerik: Göktürk/Turkic köken iddiaları, Mu/Lemuria kozmolojisi, Odin'in Türk beyi olduğu iddiası.

Yeni içerik eklerken bu çizgi korunur: eşleşme/sistem alınır, iddialı tarihsel çerçeve alınmaz.

## Dağıtım

1. `npx tsc -b --noEmit` ve `npm run build` ile yerel doğrulama, ardından tarayıcıda 375px kontrol.
2. `git add -A && git commit` (açıklayıcı mesaj + `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`).
3. **Kullanıcı onayı** → `git push origin main` → Vercel otomatik deploy.
4. Bundle hash karşılaştırması ile canlı doğrulama.

Not: service worker `prompt` modunda olduğu için mevcut kullanıcılar yeni sürümü ancak bildirimden sonra
görür; telefonda test ederken uygulamayı kapatıp açmak gerekebilir.
