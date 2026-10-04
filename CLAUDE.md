# CLAUDE.md

Bu dosya, Claude Code'un (claude.ai/code) bu depoda çalışırken projeyi hızlıca hatırlaması için yazıldı.

## DEVAM EDEN İŞ: PWA → AskRune tanıtım sitesi (`landing` dalı, 2026-10-05)

Kullanıcı kararı: PWA kaldırılıyor, askrune.app mobil uygulamanın (repo `askrune-app`) tanıtım sitesi oluyor.
İş `landing` dalında; `main`'e birleşmeden canlı site (Cloudflare + Vercel) değişmez. Aşağıdaki "Proje nedir"
ve sonrası PWA dönemini anlatır, site yayına girince güncellenecek.

**Diğer bilgisayarda devam (ör. Windows):** bu iş `landing` dalında, `main`'de değil. Önce
`git fetch`, `git checkout landing`, `git pull`; sonra `npm ci` (paketler PWA'dan tamamen farklı, yeni
`package-lock.json` dalda; `npm ci` eski `node_modules`'ü silip yeniden kurar). Ekran görüntüsü betiği
(`scripts/shots/cdp.mjs`) Chrome yolunu Mac'e göre yazıyor (`/Applications/Google Chrome.app/...`); Windows'ta
görüntü yeniden alınacaksa Chrome yolu değiştirilmeli. Görüntüler zaten `src/assets/screens/`'te, gerekmedikçe
yeniden alınmaz.

**Kararlar (kullanıcı):** site şimdi yayına girer, mağaza düğmeleri "Yakında" (uygulama mağazaya çıkınca gerçek
bağlantı); PWA kendini kaldırır + eski kullanıcıya kısa duyuru; dil tarayıcıya göre (TR tarayıcı → `/tr/`,
diğerleri `/` İngilizce, elle seçim hatırlanır).

**Yapılanlar (commit edildi):**
- PWA kodu silindi (`src/` React, `vite.config.ts`, `index.html`, PWA ikonları). Astro 7 kuruldu (`package.json`
  sıfırdan; `npm run build` = `astro check && astro build`, çıktı `dist`).
- `public/sw.js`: PWA'yı emekli eden service worker (önbellekleri siler, kendini kaldırır, sayfayı yeniler).
  Yolu `/sw.js` kalmalı. `_headers` yeni siteye göre.
- Yasal sayfalar (`public/gizlilik|privacy|kosullar|terms|destek|support`) aynen duruyor; uygulama bu adreslere
  bağlı, adresler değişmemeli.
- İkonlar uygulamanın Ingwaz ikonundan (`public/icons/`).
- `wrangler.jsonc`: `not_found_handling: "404-page"` (sitede `src/pages/404.astro` olmalı).
- Ekran görüntüleri: `src/assets/screens/{tr,en}/` (home, reading-drawn, birth, talisman-medallion, compat;
  780 px WebP). Üretimi: mobil repoda Expo web önizlemesi açıkken (`npx expo start`, port 8081)
  `node scripts/shots/run.mjs tr|en` (headless Chrome, 390×844 @3x PNG, `scripts/shots/out/`), sonra
  `npm run images -- scripts/shots/out`.
- Arka planlar `src/assets/bg/` (altar-wide, aurora-wide, forest-wide, ritual-tall), mobil repodaki
  görsellerden.

**Sıradaki adımlar:**
1. `astro.config.mjs` (`site: "https://askrune.app"`), `src/styles/site.css` (uygulama tokenları: ink #090908,
   surface #11110F, parchment #F3EBDD / dim #AEA596 / mute #857D72, gold #C8A46A / light #E1C48B; Cormorant
   Garamond başlık + Inter gövde, `@fontsource` latin + latin-ext, dış font yok), `src/layouts/Base.astro`
   (hreflang, OG, `/` sayfasında TR tarayıcıyı `/tr/`'ye yönlendiren küçük betik), `src/i18n.ts` (metinler),
   `src/pages/index.astro` (EN), `src/pages/tr/index.astro`, `src/pages/404.astro`.
2. Bölümler: logo (mobil repodaki `Wordmark.tsx` SVG path'i, altın gradyan) + TR/EN; hero (başlık "Kadim
   işaretler, yeni bakışlar" / "Ancient signs, new perspectives", alt metin, "Yakında App Store / Google Play",
   telefon çerçevesinde ana sayfa görüntüsü); özellikler (Günün Rune'si + hatırlatma, Rune Okuması, Doğum
   Rune'si, Tılsım, Rune Uyumu; ayrıca Rehber, geçmiş ve notlar, paylaşım kartları, iki dil); "gerçek glifler,
   kazınmış taş"; gizlilik (hesap yok, veri telefonda, reklam/takip yok, satın alma mağazadan); ücretsiz ve
   Premium (ücretsiz: günün rune'si, tek rune, doğum rune'si, rehber; premium: 3-4-5 rune açılımlar, Rune Uyumu,
   tılsım kaydetme, sınırsız geçmiş; aylık / yıllık / ömür boyu; fiyat yazılmaz); SSS (geleceği söylemez,
   öz-yansıma; veriler; internetsiz çalışma; abonelik iptali → /destek); altbilgi (yasal sayfalar,
   destek@askrune.app, "© 2026 Murat Ağırbaş"). Uygulamada "fal" denmez, sitede de.
3. PWA duyurusu: tarayıcıda `runekahini.v1.*` localStorage anahtarı varsa ya da `display-mode: standalone`
   ise kapatılabilir not ("web sürümü kapandı, yakında mobil uygulamada; eski okumalar taşınmaz").
4. Yasal sayfalardaki marka yeniden `/` bağlantısı olabilir (aşağıda not var).
5. Vercel: `vercel.json` ile runekahini.vercel.app → askrune.app yönlendirmesi.
6. `npm run build` + `npx astro preview` ile kontrol (telefon ve masaüstü genişliği), sonra kullanıcı onayıyla
   `main`'e birleştir ve push. Mobil uygulamanın App Store "pazarlama" ve "destek" adresleri bu site.

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
  `MysticDivider`, `MysticInput`, `SpreadOptionCard`, `ZodiacGlyph`, `OrnateHeader`, `RelicCorners`,
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
  - **Export:** yerleşim önizlemeyle aynı kaynaktan gelir. Gizli bir `TalismanMedallion maskOnly` kopyası
    (yalnızca oyuk şekilleri, filtre ve fotoğraf yok) görsele çevrilir. Oymanın kendisi
    `ui/engraveCanvas.ts` ile **piksel piksel JS'te** hesaplanır: taban rengi, kutu bulanıklığıyla yükseklik
    haritası, diffuse ışık. Sebebi: SVG ışık filtrelerini `<img>` üzerinden canvas'a aktarmak, filtre
    çözünürlüğünü tarayıcıya bırakıyor ve kullanıcının telefonunda gölge yayılıp dağılıyordu. Ekran yine SVG
    filtresini kullanır. Canvas sürümünde yüzey derinliği -6 (SVG'de -2,6), çünkü tam çözünürlükte aynı değer
    düz görünüyor. İki sürümün sabitleri birlikte güncellenmeli. Keski pürüzü export'ta yok, bilinçli.
  - **Export yerleşimi:** kilit ekranı saati telefonun üst ~%28'ini kaplıyor (kullanıcı geri bildirimi). Madalyon
    ve yazılar `EXPORT_SCALE` 0,8 ile küçültüldü, madalyon merkezi yüksekliğin %46'sında, üst kenarı ~%29'da.
    Ölçüler `T()` ile ölçekleniyor. Etrafına orman sahnesi, ışık haresi, gravür tarzı yazı (amaç, yaldız degradeli isim, süs çizgisi,
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
  madalyon yükselir, yaldızlı ad belirir. 3 sn sonra ya da dokununca kaybolur. Reduced-motion'da
  sadece solup belirerek oynar. Kayıt `sessionStorage["runekahini.introSeen"]` içinde.
- **`HeroEmblem`** (`RuneRing` + `TalismanMedallion`): başlıkta yavaş dönen Futhark halkası içinde madalyon.
  **Perthro** seçildi (kura kupası, kader, "kahin"in rune'u). Başlık `.gilded-text`: altın gradyan, üzerinde
  gezinen parıltı.
- **Sekme kartları**: çizgi ikonlar yerine bölümün kendi nesnesi. Okuma: bazalt taşta Ansuz. Doğum: granit
  taşta Jera. Tılsım: altın madalyonda Algiz. Aktif olan ışır. Küçük madalyonda rune okunmuyordu (kullanıcı geri
  bildirimi): `TalismanMedallion emphasis` oymayı alan merkezi etrafında büyütüp kalınlaştırıyor (nav 1,45).
  Pasif sekme nesneleri yalnızca hafif soluk (`grayscale(0.1) brightness(0.92)`).
- **`RealmScene`**: üç diyar fotoğrafı üst üste, sekme değişince 1,2 sn'de birbirine geçer. Her fotoğraf
  70–90 sn'de bir yavaş yakınlaşıp kayar. Işık hareketi **opaklık animasyonlu renkli katmanlarla** yapılır:
  ocak titremesi, aurora perdeleri, kanopiden süzülen ışık. Animasyonlu `filter` kullanılmaz, tam ekran
  fotoğrafta her kare yeniden işlenip zayıf telefonlarda takılır.
- **`RealmParticles`**: tek canvas, ~30 fps, sekme gizliyken durur. Ateşte yükselen közler, kutupta yıldız
  pırıltısı, ormanda ateş böcekleri. Parlama, her parçacıkta `shadowBlur` yerine bir kez çizilen sprite ile.
- **Animasyonlar** (`index.css` "Hero, intro and transitions"): sekme içeriği girişi (`.view-enter`), taş
  açılınca ışık patlaması (`.reveal-flare`), madalyonda kazıma değişince madalyon silüetiyle maskeli ışık
  süpürmesi (`.medallion-sweep`), birincil butonda periyodik parıltı (`.btn-glint`).
- **Reduced motion politikası** (kullanıcı geri bildirimi: "telefonda animasyonlar çalışmıyor"): ilk sürüm
  `prefers-reduced-motion`'da her şeyi kapatıyordu. Bu tercih birçok Android'de pil tasarrufuyla sessizce
  açılıyor, sonuç tamamen durağan bir uygulama oluyordu. Artık yalnızca **yer değiştiren / ölçeklenen /
  dönen** hareket duruyor: fotoğraf kayması, halka dönüşü, yükselen girişler, taş zıplaması, tılsımın
  kendiliğinden salınımı. **Yerinde ışık değişimi sürüyor**: ateş titremesi, aurora (yalnızca opaklık), orman
  ışığı, yaldız parıltısı, hare, buton parıltısı, ışık süpürmesi. Parçacıklar yerinde pırıldıyor, açılış
  sahnesi yalnızca solup belirerek oynuyor. Parmakla tılsım eğme doğrudan kullanıcı eylemi olduğu için açık.
  Yeni animasyon eklerken bu ayrıma göre karar verilmeli.
- **PWA ikonu**: eski ikondaki Vegvísir 19. yy İzlanda kaynaklı, Elder Futhark değil. Tarihsel dürüstlük
  çizgisine uymadığı için kaldırıldı. İlk yeni ikon (koyu zeminde oyma Perthro'lu altın madalyon) telefonda
  silik ve küçük göründü. Kullanıcı yerine kendi getirdiği görseli seçti: yeşil kozmik sis + ince hale
  üzerinde büyük, parlak bakır Perthro (`../rune-kahini-mobile/design/icons/final-green.png`). Glif
  `runeGlyphs.ts`'teki Perthro ile üst üste konup doğrulandı. Kaynakta pişmiş yuvarlak köşeler vardı,
  kenarlardan 76px kırpılarak atıldı (köşeleri iOS/Android kendisi yuvarlar). `icon-maskable-512.png`
  ayrı: görsel %74'e küçültülüp yumuşak dairesel kenarla koyu yeşil radyal zemine oturtuldu, böylece
  rune %80 güvenli alanda kalıyor (bulanık kopya zemin denenmişti, rune kenarlarda lekeleniyordu).

### Eser arayüzü: kontroller objelerle aynı dünyadan (2026-10-01)

Kullanıcı: kutular, giriş ve seçim alanları yeni tasarıma uymuyordu, "jenerik uygulama arayüzü" duruyordu. Önce
Rune Okuması'nda prototip yapıldı, kullanıcı geri bildirimleriyle ayarlandı, sonra tüm sayfalara yayıldı.
Stiller `index.css` içinde "Relic UI" bölümünde.

- **`.relic-panel`** (`MysticCard ornate`): oyma taş levha, eğim + derinlik gölgesi + `RelicCorners` altın köşe
  süsleri. **Ekran başına yalnızca bir ana panel** için: okuma formu, doğum formu.
- **`.relic-card`**: `MysticCard`'ın varsayılanı. Aynı levha, köşe süsü yok. `tone="gold"` → `.is-gold`.
- **`.altar-option`**: seçim yuvaları (açılım, niyet, form, malzeme, rune seçici, burç rune'ları). Yuvanın içi
  **siyah değil, ışık almış sıcak taş**. Kullanıcı ilk sürümü "çok karanlık, anlaşılmaz" buldu. Renk diyara göre
  `--altar-hi/-mid/-lit` değişkenlerinden gelir: ateşte kahve, kutupta buz mavisi, ormanda zeytin. Seçilince
  bütün yuva ışır: yaldızlı çift çerçeve, nefes alan ışık, `.altar-stone` parlaması, tek seferlik
  `.altar-sweep`. Seçili etiket **aynı yazı tipi ve boyutta, düz altın + hafif ışıma** kalır. Cinzel'e geçip
  degradeyle boyamak yazıyı kenarlara dayadı ve küçük boyutta okunmaz yaptı. Seçim ışığı **ölçülü**: geniş dış hale ve
  güçlü nabız, Tılsım'da (orman) "çiğ" duruyordu. Işık yuvanın içinde tutuluyor, dış hale 14 px, orman
  `--altar-lit` mat zeytin-altın.
  - Tılsım'daki küçük rune taşları (niyet kartları, rune seçici) **temiz bazalt** (`REALMS.fire.stone`),
    `face 0.72`. Orman taşının liken ve benekleri küçük boyutta yaldızlı rune'la karışıyordu.
- **`OrnateHeader`**: elmas uçlu çizgiler arasında yaldızlı Cinzel başlık. `lg` (19 px) panel içi ana başlıklar,
  `md` (16 px) `SectionHeader`'ın ortalı varyantı. Kullanıcı ilk 15 px'i küçük buldu.
- **`.inscription`** (soru alanı, `MysticInput`): içe gömülü yazı tableti, ince altın çerçeve, odakta altın
  ışıma. **Satır çizgisi yok.** İki kez denendi, ikisinde de kullanıcı beğenmedi. İlk "kutusuz yazıt satırı"
  ise alan olarak fark edilmiyordu.
- **`.plaque`** (`GoldButton` primary): varak altın plaket, oyulmuş Cinzel yazı, 1,08 rem, tek satır
  (`nowrap`, dar harf aralığı). "Taşları Çek" 14 px'te okunmuyordu.
- **`.relic-range`**: oyma yarık + altın sikke tutamak kaydırma çubuğu.
- **Küçük rune'lar = `CarvedRune lite`** (filtresiz yaldız + kontur). Listelerde ve ızgaralarda kullanılır:
  rune seçici (24 adet), niyet kartları, geçmiş, rehber, açılım minyatürleri. Mobilde 24 filtreli SVG kaydırmayı
  ağırlaştırır. Büyük tekil taşlar tam `CarvedRune`. `RuneGlyph` ve `RuneEmblem` artık kullanılmadığı için
  silindi.

### Rune ile Yaz: isim ya da kelimeyi Rune ile yazma (2026-10-01)

Fikir NotebookLM'den geldi ("Runik Çevirici"). Tılsım bölümüne üçüncü sekme olarak eklendi. İlk adı "İsmim"di. Kullanıcı kelime de yazılabileceğini sorunca
yazılar genişletildi (isim, kelime ya da kısa söz) ve sekme önce "Sen Yaz", sonra "Rune ile Yaz" oldu.
  Sekmeler: Hazır Niyetler · Rune Seç · Rune ile Yaz (aynı kalıpta bir çift, kart başlığı "Rune ile Yazılışı" ile uyumlu). "Kendi Seçimim", Rune Seç oldu. "Tılsım Oluştur" düşünüldü ama
  üç sekme de tılsım oluşturduğu için yanıltıcıydı. "Sen Seç" de iki "Sen" olduğu için reddedildi.

- `src/data/transliterate.ts`: **çeviri değil, harf çevirisi.** Rune'lar bir alfabe, dil değil. Arayüz de
  bunu söyler. Türkçe yazıldığı gibi okunduğu için eşleme sese göre yapılır.
  - **Alfabede olmayan sesler** en yakın rune'a gider: c → Dagaz + Jera, ç → Tiwaz + Sowilo, ş → Sowilo,
    ı → Isa, ö → Othala, ü → Uruz, v → Wunjo, y → Jera.
  - **ğ yazılmaz,** çünkü ayrı bir ses değil, önündeki ünlüyü uzatır.
  - **Şeffaflık:** Kullanılan her yaklaşık eşleme ekranda bir not satırıyla gösterilir.
  - **"ng" ve "th" birleştirilmez:** Türkçede iki ayrı sestir.
  - **NotebookLM tablosundan farklar:** Tablo c ve ç'yi Kenaz'a ("Can" → "Kan"), ğ'yi Gebo'ya eşliyordu.
    Bu eşlemeler alınmadı.
- **İki rune'lu harfler (c, ç, x) tek harf gibi gösterilir (kullanıcı isteği):** İki taş yakın durur, altında
  bir köşeli bağ olur, harf bir kez yazılır. `RuneWord.letters` harf bazında gruplar. Kartta bir harfin
  taşları satırlar arasında bölünmez.
- `NameRunes`: Her rune için bir oyma taş, altında harfi. İsim tek satıra sığarsa kelimeler arasında
  yazıtlardaki iki nokta ayıracı durur. Sığmazsa her kelime kendi satırına geçer, böylece ayıraç satır
  başına düşmez.
- **Tılsım:** İsmin farklı rune'larından ilk dördü kullanılır (`MAX_LAYERS`). Dörtten fazlaysa ekran bunu
  söyler. Duvar kâğıdında yazılan metin başlık, "Kişisel Tılsım" amaç olur. İsim `talisman.nameText` olarak saklanır.
- **Taşlar koyu bazalt** (`REALMS.fire.stone`, Rune Seç ile aynı): Tılsım diyarının yeşil yosunlu taşında
  altın rune'lar seçilmiyordu (kullanıcı geri bildirimi).
- `drawNameCard` (parşömen, 1080×1920): İsim başlıkta, taşlar satırlarda, altında her farklı rune'un iki
  anahtar kelimesi yer alır. Taş boyutu, hiçbir kelime bölünmeyecek en büyük boyut olarak seçilir.

### Sonuç kartları: okuma ve doğum rune'si paylaşımı (2026-10-01)

Kullanıcı önerisi: tılsımdaki gibi, Rune Okuması ve Doğum Rune'si sonuçları da özetlenip görsel olarak
kaydedilebilsin. Zemini kullanıcı getirdi (yaldızlı örgü çerçeveli eski parşömen, sağ altta çakıl taşları,
`src/assets/cards/parchment.webp`). Kullanıcı kırmızı lekelerin kalmasını istedi.

- **Boyut 1080×1920 (9:16 hikâye).** Tılsım duvar kâğıdı olduğu için 1080×2340. Sonuç kartı paylaşmak
  için, bu yüzden Instagram/WhatsApp hikâye oranında.
- **Açık zemin, koyu mürekkep.** Ekranlar koyu diyarlarda kalır, kart ise "uygulamadan çıkan belge" gibi
  durur. Yazı mürekkep kahvesi, küçük etiketler çerçevenin koyu kırmızısında.
- `src/components/share/cardCanvas.ts`: ortak canvas yardımcıları. Tılsım dışa aktarımı da artık bunları
  kullanıyor: `loadImage`, `spaced`, `fitFontSize`, `wrapLines`, `shareCanvas` (paylaşım menüsü, yoksa
  indirme).
  - `carveStone`: `CarvedRune` + `GildedCut`'ın piksel karşılığı (dudak ışığı, koyu kontur, altın varak,
    iki iç gölge). SVG filtresi ve `ctx.filter` kullanmaz. SVG filtreleri bazı telefonlarda dağılıyordu,
    Safari canvas'ında da `filter` yok.
- `src/components/share/resultCards.ts`: `drawReadingCard` (4 açılımın her biri için ayrı yerleşim) ve
  `drawBirthCard`.
  - Özet olarak rune'un üç anahtar kelimesi kullanılır, yeni metin yazılmadı. Tek rune ve Kader Yolu
    rune'sinde genel okumanın ilk cümlesi de eklenir.
  - Gövde iki kez yerleşir: önce ölçmek için boş bir canvas'a, sonra çerçevenin içinde ortalanmış olarak
    (`centred`). Böylece tek taş da 5'li haç da sayfayı doldurur.
  - `CONTENT_BOTTOM` 1580: altındaki sağ köşede çakıllar başlar, içerik oraya inmemeli.
  - **Doğum kartı sırası (kullanıcı isteği):** "Doğum Rune'si" üst yazısı, çember içinde yaldızlı burç
    sembolü (`ZODIAC_STROKES`), büyük burç adı, doğum tarihi · saati, çizgi, Kader Yolu ve ardından Güneş
    ve Doğum Saati rune'leri. Kader Yolu'nun yorum cümlesi yer açmak için çıkarıldı.
  - **Okunurluk (kullanıcı isteği: küçük yazılar zor okunuyordu):** ikincil metin `#3e2812` ve 500
    kalınlıkta. Anahtar kelimeler 36 px, etiketler 28 px/600, hiçbir metin 23 px'in altına inmez.
  - **Altlık:** web adresi yok (kullanıcı isteği). "Rune Kahini" sayfaya ortalı, iki yanında küçük
    elmaslar (`FOOT_Y` 1716). Önce alt örgü bandının hemen üstüne indirilip çakıllardan kaçmak için sola
    kaydırılmıştı, kullanıcı "çok altta ve ortalı değil" dedi, ardından "biraz daha aşağı". Daha aşağıda sağ alttaki çakıl ve yapraklar
    ortaya kadar uzandığı için ortalı kalabileceği en alt nokta burası. İçerik `CONTENT_BOTTOM` 1550'de biter.
  - Rune adları Cinzel'de `ı` ile yazılır (`runeName`). Sayfa `lang="tr"` olduğu için Cinzel'in küçük
    büyük harfli `i`'si noktalı İ çıkıyordu ("SOWİLO"). Türkçe başlıklarda (Şimdi, Haritan) noktalı İ doğru
    olduğu için yalnızca rune adlarına uygulanır.
  - Kartta kullanılan Inter italik hiçbir ekranda geçmediği için `document.fonts.ready` onu yüklemiyor.
    `loadFonts` her yüzü adıyla ister.
- `ShareCardButton`: "Kartı Kaydet". Görseller bileşen açılınca önceden yüklenir, çünkü dokunuşta yükleme
  paylaşımın "kullanıcı eylemi" sayılmasını bozabiliyor (tılsımdaki dersle aynı). Okumada tüm taşlar
  açılınca, doğum haritasında sonuçların altında görünür.

## İki bilgisayarda çalışma (Mac + Windows, 2026-10-03)

Proje iki bilgisayarda çalışılıyor: Windows (`E:\Claude\…`) ve Mac (`~/Projects/…`). Senkron GitHub üzerinden.
Kod hiçbir işletim sistemine bağlı olmamalı.

**Oturum düzeni (Claude hatırlatır):**
- **Başlarken:** `git pull`. Önce `git status` temiz olmalı, değilse kullanıcıya sorulur.
- **Kalkarken:** commit, ardından kullanıcı onayıyla `git push`. Push edilmemiş iş diğer bilgisayarda görünmez.
- Aynı anda iki bilgisayarda aynı repoya dokunulmaz. Çakışma çıkarsa elle çözülür, `--force` kullanılmaz.

**İşletim sisteminden bağımsızlık:**
- **Satır sonu LF.** `.gitattributes` (`* text=auto eol=lf`) bunu Windows'un `core.autocrlf` ayarından
  bağımsız zorlar, `.editorconfig` de editörlere söyler. Bu iki dosya silinmez.
- **Node.js 24** (`.nvmrc`). İki bilgisayarda aynı ana sürüm olmalı. Yoksa `package-lock.json` her
  kurulumda gereksiz yere değişir. Paket eklerken lockfile da commit edilir, kurulum `npm ci` ile yapılır.
- **Dosya adı büyük/küçük harfi:** Mac ve Windows harf büyüklüğüne duyarsız, derleme sunucuları (Linux)
  duyarlı. Import yolu dosya adıyla harfi harfine aynı olmalı. Yalnız harf büyüklüğü değişen yeniden
  adlandırma `git mv` ile yapılır.
- **Yollar:** kodda ve betiklerde `/` kullanılır, mutlak yol (`E:\…`, `/Users/…`) yazılmaz.
  `package.json` betiklerinde yalnızca iki sistemde de çalışan komutlar kullanılır (`rm`, `cp`, `&&` ile
  kabuk zinciri yok; gerekiyorsa Node betiği).
- **Dosya adları:** ASCII, boşluksuz. Türkçe karakter ve `: * ? " < > |` kullanılmaz, Windows bunları kabul etmez.

**GitHub'a gitmeyen, her bilgisayarda ayrı tutulanlar:**
- `.claude/launch.json`: önizleme ayarı, bilgisayara özel yol içerebilir. Commit edilmez.
- `node_modules/`, `dist/`: `npm ci` ve `npm run build` ile yeniden üretilir.
- Claude'un hafıza notları (ör. `firstgate-lovable-workflow.md`) bilgisayara özel. Kalıcı proje kararları
  bu dosyaya yazılır ki iki tarafta da görünsün.

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
  "i"nin noktasını korur — aynı sorun ("SOWİLO", Isa → "İSA").
  - **Çözüm:** Cinzel'de (`font-serif`) gösterilen rune adı `lang="en"` taşıyan bir öğeye konur: `RuneDetail`,
    `BirthRuneCard`, `ZodiacCard`. Canvas belgenin dilini kullandığı ve `lang` alamadığı için orada
    `runeName()` (`share/cardCanvas.ts`) "i"yi noktasız "ı" yapar, Cinzel bunu düz I çizer.
  - Yalnızca rune adlarına uygulanır. Türkçe kelimelerde (Kahini, Şimdi) noktalı İ doğrudur.
  - Yeni bir yerde rune adı Cinzel ya da büyük harfle gösterilirse aynısı yapılmalı.
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
- **Yakınlaştırma kilitli** (kullanıcı isteği): telefonda iki parmakla büyütünce sabit diyar arka planı ve
  parçacık tuvali bozuluyordu. Üç katman var: viewport `maximum-scale=1, user-scalable=no` (Android),
  `html, body { touch-action: pan-x pan-y }` (iOS dahil pinch ve çift dokunma) ve `main.tsx`'te iOS
  `gesturestart/gesturechange` engeli. Bu yüzden **giriş alanları en az 16 px** kalmalı, yoksa iOS odakta
  otomatik yakınlaştırır. Gövde metni de 16 px tabanında.
- **Yalnızca dikey** (kullanıcı isteği). Manifest `orientation: 'portrait'` (kurulu Android PWA uyar),
  `main.tsx`'te `screen.orientation.lock('portrait')` (desteklenen yerde). iOS web uygulamalarına yönelim
  kilidi vermiyor. Bu yüzden `RotateNotice` yatay + 500 px'ten kısa ekranda uygulamanın üstünü "telefonunu
  dik tut" ekranıyla kaplar, alttaki sayfa kaymaz. Tablet ve masaüstü etkilenmez.
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

**askrune.app (2026-10-01):**
- **Domain:** Kullanıcı Cloudflare'den aldı.
- **Yayın:** Site Cloudflare Workers'ın statik varlık özelliğiyle yayınlanıyor. `wrangler.jsonc` (`assets.directory`
  `./dist`) ve GitHub bağlantısıyla çalışıyor. Cloudflare'de build komutu `npm run build`, deploy komutu
  `npx wrangler deploy`.
- **Önbellek:** `public/_headers`, `sw.js`, `index.html` ve manifestin her açılışta yeniden doğrulanmasını
  sağlar. Hash'li `assets/` dosyaları kalıcı önbelleğe alınır.
- **Gizlilik ve destek sayfaları:** `public/gizlilik`, `privacy`, `destek`, `support` (her biri `index.html`, ortak
  stil `public/legal/legal.css`). Uygulamanın parçası değiller, düz HTML. Mağazalar bu adresleri istiyor.
  - Web fontu yüklemezler.
  - Service worker bu yolları uygulama kabuğuna yönlendirmez (`navigateFallbackDenylist`).
  - Uygulama altbilgisinde bağlantıları var.
  - Vite geliştirme sunucusu `/gizlilik/` adresinde uygulamayı açar, `/gizlilik/index.html` ile bakılmalı.
    Cloudflare klasör adresini kendisi çözer.
  - **Yazı tipleri sitenin kendi sunucusundan yüklenir (2026-10-01).** Google Fonts kaldırıldı; `@fontsource/cinzel` ve
    `@fontsource/inter`, yalnızca Latin ve Latin genişletilmiş setler, `main.tsx` içinde import ediliyor. Böylece web sürümü
    hiçbir dış sunucuya bağlanmıyor ve gizlilik metni de bunu söylüyor. Yeni ağırlık gerekirse oraya iki set
    (latin ve latin-ext) birlikte eklenir.
  - **Uygulamaya geri bağlantı yok (2026-10-04, kullanıcı):** altbilgideki "Uygulamaya dön / Back to the app"
    PWA'ya gidiyordu. Bu sayfalar artık mobil uygulamanın mağaza sayfaları; PWA bu adresten kaldırılıp yerine
    tanıtım sitesi gelecek. Altbilgide yalnızca diğer yasal sayfa var, başlıktaki marka da bağlantısız
    (`span.brand`). Tanıtım sitesi kökte yayına girince marka yeniden `/` bağlantısı yapılabilir.
  - **Marka (2026-10-04, kullanıcı: "Türkçede ikisini de kullanalım"):** Türkçe sayfalarda başlık ve marka
    satırı "AskRune · Rune Kahini", ilk geçişte "AskRune (Rune Kahini)", sonra AskRune; abonelik iptal
    adımlarında mağazada Türkçe görünen ad önde: "Rune Kahini (AskRune)". İngilizce sayfalar yalnız AskRune.
  - **Kullanım Koşulları (2026-10-04):** `public/kosullar`, `public/terms`. Mobil uygulama Apple'ın standart
    EULA'sı yerine bunlara bağlanıyor; "ömür boyu" erişimin kapsamını tanımlıyor (uygulama yayında ve
    destekte olduğu sürece) ve Apple'ın özel EULA için istediği asgari maddeleri içeriyor (9. madde).
    Service worker bu yolları da uygulamaya yönlendirmez. Dört yasal sayfanın altbilgisi birbirine bağlı.
  - Okuma sayısı yazılmaz ("okuma geçmişin"): PWA 30, mobil 500 saklıyor. Hitap adı da saklananlar
    listesinde. Yürürlük tarihi 4 Ekim 2026.
  - Metinlerdeki iddialar koda bağlı.
    Yeni bir dış servis ya da analiz aracı eklenirse iki dildeki gizlilik metni de güncellenmeli.
- **Vercel:** Geçiş süresince paralel çalışır. Tarayıcı verisi (geçmiş, doğum bilgisi, tılsım) adrese bağlı,
  yeni adrese kendiliğinden geçmez.

Not: service worker `prompt` modunda olduğu için mevcut kullanıcılar yeni sürümü ancak bildirimden sonra
görür; telefonda test ederken uygulamayı kapatıp açmak gerekebilir.
