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
  `IntentPresetCard`, `RunePicker`, `CarvedRune`, `GildedCut`, `TalismanMedallion`, `Talisman3D`. Yeni kart/buton/etiket yazmadan önce buraya bakın.
- Animasyonlar daima `prefers-reduced-motion: reduce` ile kapatılabilir olmalı.

### Diyarlar ve yaldızlı taşlar (2026-10-01)

Mobil uygulamayla (`../rune-kahini-mobile`) ortak görsel dil PWA'ya uyarlandı. Kullanıcı kararı: PWA masaüstü
genişliğine geçmeyecek, mobil-dar PWA olarak kalacak. Mobil uygulama ayrı ele alınıyor, PWA tasarım için fikir
veriyor.

- **Diyarlar** (`src/theme/realms.ts`): her sekmenin kendi Higgsfield fotoğrafı var. Okuma → Kuzey Ateşi,
  Doğum → Kutup Gecesi, Tılsım → Yggdrasil. `index.css`'teki `.realm-*` sınıfları `@theme` renk
  değişkenlerini (`--color-gold`, `--color-surface`, `--color-hairline`…) ezer. Tailwind v4 yardımcıları bu
  değişkenleri okuduğu için alt ağaçtaki her bileşen diyarın rengini kendiliğinden alır. Yüzeyler yarı saydam.
  `.realm-scene` sabit fotoğraf + okunurluk karartması.
- **`CarvedRune`** (`src/components/ui/`): gerçek taş fotoğrafına SVG ile altın yaldızlı kazıma. Kazıma
  katmanları: kenar ışığı, koyu kontur, altın gradyan dolgu, iki iç gölge (feOffset + feComposite out), parlama
  bandı. Mobildeki Skia `CarvedRunes` ile aynı katmanlar ve aynı `GOLD` durakları, ikisi birlikte
  güncellenmeli. Işık yönü `src/theme/light.ts` (sol üst, fotoğraflar öyle çekildi).
- **`RuneStone`**: ters yüzde boş taş, çevrilince aynı taş kazınmış hâlde. `RuneDetail` başlığında 64 px
  kazınmış taş var.
- Varlıklar `src/assets/realms/` ve `src/assets/stones/` altında (Vite import, hash'li). PWA precache
  WebP'yi de kapsıyor (`vite.config.ts` `workbox.globPatterns`). Toplam precache ~3 MB.
- Rune kazıması yapay zekâya çizdirilmez, glifler `RUNE_GLYPHS`'ten gelir.
- **Tılsım = antik madalyon** (kullanıcı isteği: etkileyici, gerçekçi, antik madalyon gibi; indirilen dosya
  da aynı çerçevede). `src/theme/medallions.ts`: Higgsfield ile üretilmiş üç boş madalyon (Altın örgü
  bordürlü, Gümüş oksitli, Bronz patinalı). Askı halkası yüzünden disk ortada değil. Boş orta alanın
  merkezi ve yarıçapı piksel taramasıyla ölçüldü, görsel değişirse yeniden ölçülmeli.
  - `TalismanMedallion` (SVG, 100 birimlik kutu): bind rune ya da mühür halkaları `EngravedCut` ile alana
    **madalyonun kendi metalinden oyulur**. Bind rune'da katman saydamlığı kaldırıldı, kesişen çizgiler taştaki gibi tek oyuk olur.
    `offsets` hâlâ eski 400 px önizlemenin biriminde (halka yarıçapı 124,4), eski taslaklar aynı yerde kalır.
  - **Bind rune otomatik ortalanır ve sığdırılır** (`bindFit`): kaydırma çubukları yalnızca rune'ların stave
    boyunca birbirine göre konumunu belirler. Birleşik şeklin sınır kutusu (`GLYPH_SIZE`) alan merkezine
    taşınır ve sığmazsa küçültülür, oyuk kalınlığı küçültmeden etkilenmez. Önceden kaydırınca şekil merkezden
    kayıyordu, kaydırmayınca rune'lar tamamen üst üste biniyordu. Kaydırma aralığı bu yüzden ±55'ten ±90'a
    çıktı.
  - Madalyon merkezleri iç alanın kenarına çember oturtularak ölçüldü. İlk ölçüm dış diskten türetildiği için
    mühür formu aşağıda kalıyordu.
  - `Talisman3D`: parmak/fare ile perspektif eğim + ışık yönü + temas gölgesi. Boşta yavaş salınım,
    `prefers-reduced-motion`'da sabit. ~30 fps, çünkü SVG filtreleri her karede yeniden çiziliyor.
  - **Export, önizlemenin kendisi:** gizli, eğilmemiş bir `TalismanMedallion` kopyası (fotoğraf data: URL
    olarak gömülü, `<img>` içindeki SVG dışarıdan kaynak çekemez) `XMLSerializer` ile görsele çevrilip canvas'a
    çizilir. Etrafına orman sahnesi, ışık haresi, gravür tarzı yazı (amaç, yaldız degradeli isim, süs çizgisi,
    rune'lar, marka) eklenir. Eski `BindruneCanvas` / `drawLayers` ve çerçeve PNG'leri silindi (−3,6 MB
    precache). Madalyon data URL'i ve sahne önceden yüklenir, "Kaydet" butonu hazır olana dek pasif.
  - Taslakta `material` alanı var (`StoredTalisman.material`, eski kayıtlarda yok → altın).
- **Madalyon kazıması = `EngravedCut`, yaldız değil** (kullanıcı geri bildirimi, 2026-10-01). Vektör altın
  yaldız (`GildedCut`) madalyonun dokusunu taşımadığı için "sonradan üstüne konmuş" duruyordu. Ara bir
  denemede de oyma kabartma gibi okundu ve çizgiler kalındı. Bu yüzden tek bir SVG filtresi kullanılıyor:
  kenarlar `feTurbulence` + `feDisplacementMap` ile keski izi gibi pürüzlü, oyuğun dibi `feImage` ile
  madalyon fotoğrafının kendisi, duvarlar
  `feDiffuseLighting` ile negatif yükseklik haritasından gölgeli. **Gölge ve ışık oyuğun içine kırpılır**:
  dışa taşan ışık, oyuğun yanında yükselen bir kenar gibi okunup kabartma etkisi veriyordu. Oyuk ince
  (`CUT_WEIGHT` 0,6). Dışa aktarmada `feImage` data: URL ile çalışıyor, doğrulandı.
  - **Her madalyon kendi renginde oyulur** (kullanıcı isteği). `Medallion.recess` o madalyonun kendi bordür
    süslemesindeki oyukların rengi: bordür piksellerinin parlaklığa göre %10–30 dilimi. En koyu %10
    alınmaz, o kısım gölge ve her madalyonda siyaha yakın. Ölçülen renkler: altın #2a241b, gümüş #151717,
    bronz #2b331b. Oyuk dibi bu renge boyanır, doku fotoğrafın parlaklığından (`fieldLum` ile normalize)
    gelir. Duvara düşen ışık da alanın ortalama renginden (`fieldColor`) türetilir, bu yüzden gümüşte nötr,
    bronzda yeşilimsi. Yeni madalyon eklenirse bu üç değer de ölçülmeli.
- `GildedCut`: altın yaldızlı kazıma. Yalnızca Okuma ekranındaki taşlar (`CarvedRune`) kullanıyor.
  `CutPaint` tipi de burada.

### Açılış, canlı arka plan, ikon (2026-10-01)

Kullanıcı geri bildirimi: açılış ve genel görünüm "kaliteli, çalışılmış, mistik" değildi. Arka planlar çok yavaş
hareketli olsun, PWA ikonu yeniden tasarlansın, uygun yerlere animasyon eklensin. Kullanıcı video yerine GIF
önerdi, ama GIF 256 renkle fotoğraf geçişlerinde bantlanır ve videodan çok daha büyük olur. Bu yüzden dosyasız
CSS ve canvas hareketi seçildi. Gerçek hareket istenirse sırada animasyonlu WebP var, ama video kaynağı
gerektiriyor (Higgsfield Seedance, 6 sn döngü ~42 kredi, kullanıcı onayı gerekir).

- **`IntroSplash`**: oturumda bir kez açılan sahne. 24 rune'luk halka tek tek yanar, oyma Perthro'lu altın
  madalyon yükselir, yaldızlı ad belirir. 3 sn sonra ya da dokununca kaybolur. Reduced-motion'da hiç
  gösterilmez. Kayıt `sessionStorage["runekahini.introSeen"]` içinde.
- **`HeroEmblem`** (`RuneRing` + `TalismanMedallion`): başlıkta yavaş dönen Futhark halkası içinde madalyon.
  **Perthro** seçildi (kura kupası, kader, "kahin"in rune'u). Başlık `.gilded-text`: altın gradyan, üzerinde
  gezinen parıltı.
- **Sekme kartları**: çizgi ikonlar yerine bölümün kendi nesnesi. Okuma: bazalt taşta Ansuz. Doğum: granit
  taşta Jera. Tılsım: altın madalyonda Algiz. Aktif olan ışır.
- **`RealmScene`**: üç diyar fotoğrafı üst üste, sekme değişince 1,2 sn'de birbirine geçer. Her fotoğraf
  70–90 sn'de bir yavaş yakınlaşıp kayar. Işık hareketi **opaklık animasyonlu renkli katmanlarla** yapılır:
  ocak titremesi, aurora perdeleri, kanopiden süzülen ışık. Animasyonlu `filter` kullanılmaz, tam ekran
  fotoğrafta her kare yeniden işlenip zayıf telefonlarda takılır.
- **`RealmParticles`**: tek canvas, ~30 fps, sekme gizliyken durur. Ateşte yükselen közler, kutupta yıldız
  pırıltısı, ormanda ateş böcekleri. Parlama, her parçacıkta `shadowBlur` yerine bir kez çizilen sprite ile.
- **Animasyonlar** (`index.css` "Hero, intro and transitions"): sekme içeriği girişi (`.view-enter`), taş
  açılınca ışık patlaması (`.reveal-flare`), madalyonda kazıma değişince madalyon silüetiyle maskeli ışık
  süpürmesi (`.medallion-sweep`), birincil butonda periyodik parıltı (`.btn-glint`). Hepsi
  `prefers-reduced-motion` bloğunda kapatılıyor. Yeni animasyon eklenirse oraya da eklenmeli.
- **PWA ikonu**: eski ikondaki Vegvísir 19. yy İzlanda kaynaklı, Elder Futhark değil. Tarihsel dürüstlük
  çizgisine uymadığı için kaldırıldı. Yeni ikon: koyu sıcak zemin + ışık haresi + oyma Perthro'lu altın
  madalyon. Madalyon SVG'si uygulamadan serileştirilip sharp/librsvg ile çizildi, rune ikon için %35
  büyütüldü. Ayrı `icon-maskable-512.png` var (içerik %80 güvenli alanda). Önizleme ve ara render'lar
  `../rune-kahini-mobile/design/icons/` altında.

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

### Kalıcılık

- `src/data/storage.ts` — **cihazda saklamanın tek kapısı.** Bileşenler `localStorage`'a doğrudan
  dokunmaz. Tutulanlar: doğum bilgisi (`birth`), son 30 okuma (`readings`), son tılsım taslağı
  (`talisman`). Anahtarlar `runekahini.v1.*` altında sürümlenir.
- **Hiçbir veri sunucuya gitmez.** Doğum tarihi/saati kişisel veridir; cihazda kaldığı sürece
  KVKK anlamında veri sorumlusu sıfatı doğmuyor. Üyelik/senkron istenirse bu değişir — o zaman
  Apple 5.1.1(v) uyarınca uygulama içinden hesap silme de zorunlu hale gelir.
- Okuma ve yazma **sessizce başarısız olabilir** (gizli sekme, dolu kota) ve olmalı da: kalıcılık
  bir kolaylık, gereksinim değil. Diskten gelen her kayıt kullanılmadan önce doğrulanır — elle
  kurcalanmış veya eski şemadan kalmış veri varsayılana düşer, ekranı bozmaz.
- Kullanıcının kendi yazdığı metin (`ReadingHistory` içindeki soru) **gövde fontuyla** basılır;
  Cinzel küçük-kapital bastığı için Türkçe "i" harfini noktasız I'ya çeviriyordu.
- İleride Capacitor'a taşınırsa `@capacitor/preferences`'a geçilmeli (iOS'ta WKWebView
  localStorage'ını sistem baskı altında temizleyebiliyor). Değişiklik bu tek dosyayla sınırlı kalır.

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
- **Önizleme ve export ayrışmamalı.** Tılsım export'u önizlemedeki `TalismanMedallion` SVG'sinin kendisini
  görsele çevirir. Yerleşim matematiği (`sealLayout` / `glyphTransform`) yalnızca orada. Yeni bir yerleşim
  eklenirse oraya konur, canvas'ta ayrıca çizilmez.
- **Canvas CSS değişkeni okuyamaz** — `BindruneDesigner` içinde `GOLD_DEEP`/`GOLD_MID`/`GOLD_LEAF`/`PARCHMENT_DIM`
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
