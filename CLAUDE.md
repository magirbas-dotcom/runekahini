# CLAUDE.md

Bu dosya, Claude Code'un (claude.ai/code) bu depoda çalışırken projeyi hızlıca hatırlaması için yazıldı.

## Proje nedir

**Rune Kahini** — Elder Futhark rün sembolleriyle fal/kehanet, doğum rünü hesaplama ve tılsım (bindrune)
tasarımı yapılan, tamamen istemci taraflı (backend/veritabanı yok), Türkçe bir web uygulaması.

- Canlı adres: https://runekahini.vercel.app
- GitHub: https://github.com/magirbas-dotcom/runekahini (branch: `main`)
- Vercel bu repoya bağlı: `main`'e her `git push` otomatik prod deploy tetikler.
- **Bu, `E:\Claude` kök deposundan bağımsız, kendi git geçmişine sahip ayrı bir repo.** Kök `E:\Claude\CLAUDE.md`
  bu projeyle ilgili değil, karıştırmamak lazım.

## Teknoloji yığını

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (`@theme` token'ları `src/index.css` içinde, `@tailwindcss/vite` plugin'i)
- `vite-plugin-pwa` (Workbox tabanlı service worker + manifest, `registerType: 'autoUpdate'`)
- Canvas 2D API ile tılsım görselini (PNG) oluşturup indirme/paylaşma (Web Share API + `<a download>` fallback)
- State yönetimi yok (Redux/Zustand vb.), her şey React local state

## Komutlar

```bash
npm run dev       # geliştirme sunucusu
npm run build     # tsc -b && vite build → dist/
npm run preview   # build'i yerelde önizle
npm run lint       # oxlint
npx tsc -b --noEmit   # sadece tip kontrolü
```

## Mimari / önemli dosyalar

- `src/data/runes.ts` — Çekirdek veri: `Rune` arayüzü (id, isim, sembol, ses değeri, telaffuz, düz/ters anlam,
  element, aett), `AETT_NAMES`, `drawRunes()`, `drawDailyRune(dateKey)`, `runeById()`, ve `RUNE_POSSESSIVE`
  (24 rün ismi için Türkçe ünlü uyumuna uygun doğru iyelik eki eşlemesi — Latin harf çevirisinden algoritmik
  türetilemediği için elle eşlenmiş, örn. `Fehu: "Fehu'nun"`, `Isa: "Isa'nın"`).
- `src/data/synergy.ts` — Çoklu rün açılımları (3'lü/4'lü/5'li) için `buildSynergySummary()`; kullanıcının kendi
  seçtiği bindrune kombinasyonları için `buildCustomSynergy()` (rünlerin baskın özelliklerini + doğru iyelik
  ekleriyle birleştiren cümle üretir).
- `src/data/runeStrokes.ts` — `RUNE_STROKES` (24 rün için elle yazılmış SVG path string'leri) ve
  `INTENT_PRESETS` (20 hazır niyet şablonu: koruma, bolluk, aşk, şifa, bilgelik, sınav, ev, kayıp eşya,
  uyku, yeni başlangıç, cesaret, enerji, şans, zarafet, iletişim, terfi, yas, seyahat, yaratıcılık, güç).
- `src/data/birthRune.ts` — Doğum tarihinden rün hesaplama mantığı.
- `src/components/OraclePage.tsx` — Ana "Rune Falı" sekmesi: soru girişi, açılım seçimi (tek/geçmiş-şimdi-gelecek/
  4'lü ilişki/5'li haç), "Bugünün Rune'si" widget'ı (yatay kart: tarih + teaser + taş), çekiş animasyonu
  (550ms "Taşlar Karıştırılıyor…" state'i + `stone-appear` keyframe), soru varsa "CEVAP" etiketinin hemen
  üstünde tırnak içinde gösterimi, çok rünlü açılımlarda accordion detay kartları, "Rune Rehberi" (aett'lere
  göre gruplanmış alfabe + "Rune Taşları Nedir?" bilgi kartı).
- `src/components/BindruneDesigner.tsx` — "Tılsım" sekmesi: hazır niyet şablonları veya kendi rün kombinasyonunu
  seçip, `public/bindrune-frame-square.png` (ekranda 1:1) / `public/bindrune-frame-portrait.png` (indirilen
  görsel 9:16, duvar kağıdı olarak kullanılabilsin diye) çerçevelerinin üstüne rün glifleri bindirip PNG
  olarak indirme/paylaşma. Metin okunaklılığı için koyu plaket + outline'lı yazı kullanılıyor. Çerçeve
  içindeki daire konumu/yarıçapı, referans görsellerden piksel taraması ile bulunup `centerXFrac`/
  `centerYFrac`/`radiusFrac` gibi çözünürlükten bağımsız oranlarla saklanıyor (`FRAME_SQUARE`/`FRAME_PORTRAIT`).
- `src/components/BirthRunePage.tsx` / `BirthRuneCard.tsx` — "Doğum Rune'si" sekmesi.
- `src/components/RuneStone.tsx` — Tek bir rün taşının görsel bileşeni (flip animasyonu vb.).
- `src/components/ReadingTabs.tsx` / `RuneDetail.tsx` — Ortak yardımcı bileşenler.
- `src/App.tsx` — Üst seviye layout: nabız atan Algiz amblemi, başlık, açıklamalı nav sekmeleri
  (Rune Falı / Doğum Rune'si / Tılsım).
- `src/index.css` — Tailwind `@theme` token'ları + özel keyframe'ler (`stone-appear`, `shuffle-spin`,
  `emblem-pulse`), hepsinde `prefers-reduced-motion` guard'ı var.
- `index.html` — `<title>Rune Kahini</title>`, favicon/apple-touch-icon `public/icons/` altından.
- `vite.config.ts` — `VitePWA` manifest tanımı (isim, tema rengi `#0c0a09`, ikonlar).
- `public/icons/` — PWA/favicon ikon seti (32/180/192/512px), kullanıcının verdiği altın Vegvisir sembollü
  görselden üretildi.

## Konvansiyonlar / dikkat edilecekler

- **Türkçe iyelik ekleri elle eşlenir.** Rün isimleri Latin harfli olduğu için ünlü uyumu koddan otomatik
  türetilemiyor; yeni bir rün eklenirse `RUNE_POSSESSIVE`'e elle giriş eklenmeli.
- **Push öncesi her zaman kullanıcıdan açık onay alınır** (bkz. proje sahibinin sibling proje FirstGate'te
  yaşadığı deneyim — bkz. kullanıcı hafızası `firstgate-lovable-workflow.md`). Bu repoya Lovable/Vercel'in
  kendi web kod editörünün dokunmasına izin verilmemeli; tüm kod değişiklikleri sadece Claude Code üzerinden,
  bu git deposu üzerinden yapılmalı.
- **Deploy doğrulama yöntemi:** Canlı sitedeki `dist/assets/index-*.js` dosya adı (hash) ile yerel
  `npm run build` sonrası `dist/assets/index-*.js` hash'i karşılaştırılarak deploy'un gerçekten yayına
  geçtiği teyit edilir (Vercel dashboard erişimi olmadığı için).
- **`read_network_requests` tarayıcı aracı, `<a download>` ile tetiklenen blob dosya indirmelerini YAKALAMAZ.**
  İndirme doğrulaması gerekiyorsa işletim sistemi İndirilenler klasörü (`ls -lt`) kontrol edilmeli.
- Animasyonlar her zaman `prefers-reduced-motion: reduce` ile devre dışı bırakılabilir şekilde yazılmalı.
- Proje client-side-only; backend/API/veritabanı eklenmedi ve şu an için planlanmıyor.

## Dağıtım

1. `npx tsc -b --noEmit` ve `npm run build` ile yerel doğrulama.
2. `git add -A && git commit` (açıklayıcı mesaj + `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` trailer).
3. `git push origin main` → Vercel otomatik build/deploy eder.
4. Bundle hash karşılaştırması + tarayıcıdan birkaç özelliğin canlı kontrolü ile doğrulama.
