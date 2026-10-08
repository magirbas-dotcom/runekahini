// The site's words, in the app's two languages. Facts here follow the app (askrune-app): no account, data on
// the phone, what is free and what is Premium. "Fal" is never used, as in the app: it is a "Rune Okuması".

export type Lang = "en" | "tr";

export interface Feature {
  key: "home" | "reading-drawn" | "birth" | "talisman-medallion" | "journey" | "compat";
  kicker: string;
  title: string;
  text: string;
  alt: string;
}

/** A question and its answer; `link` points into the Rune Guide (its address comes from src/guide.ts). */
export interface FaqItem {
  q: string;
  a: string;
  link?: { page: "index" | "history" | "spreads"; label: string };
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export interface Copy {
  meta: { title: string; description: string };
  nav: { other: string; otherHref: string; guide: string };
  hero: { kicker: string; title: [string, string]; sub: string; ios: string; android: string; soon: string };
  head: { features: { kicker: string; title: string; text: string }; more: string; privacy: string; plans: string; faq: string };
  features: Feature[];
  more: { title: string; items: { title: string; text: string }[]; open: string };
  craft: { kicker: string; title: string; text: string; note: string };
  privacy: { title: string; items: { title: string; text: string }[]; link: string };
  plans: { title: string; free: string; freeItems: string[]; premium: string; premiumItems: string[]; note: string };
  faq: { title: string; groups: FaqGroup[] };
  footer: { privacy: string; terms: string; support: string; contact: string; rights: string };
  legal: { privacy: string; terms: string; support: string };
  pwa: { text: string; close: string };
  daily: {
    kicker: string;
    title: string;
    silent: string;
    support: string;
    turn: string;
    turnLabel: string;
    reversed: string;
    later: string;
    readMore: string;
    /** Over the stones, incense and scent for today (the app's corr.daily). */
    corrKicker: string;
    /** The app card's button once the stone is turned ("Anlamını Oku"). */
    read: string;
    about: string;
    /** On the landing's "one stone every morning" card. */
    cta: string;
    meta: { title: string; description: string };
  };
  notFound: { title: string; text: string; home: string };
}

export const copy: Record<Lang, Copy> = {
  en: {
    meta: {
      title: "AskRune: rune readings, your birth rune and talismans",
      description:
        "Daily rune readings with the 24 runes of the Elder Futhark, your birth rune, a talisman of your own, a seven-day Rune Journey and the harmony of two. No account, no ads. Coming soon to the App Store and Google Play.",
    },
    nav: { other: "Türkçe", otherHref: "/tr/", guide: "Rune Guide" },
    hero: {
      kicker: "THE 24 RUNES OF THE ELDER FUTHARK",
      title: ["Ancient signs,", "new perspectives"],
      sub: "Daily readings with the 24 runes of the Elder Futhark, your birth rune, a talisman of your own, a seven-day Rune Journey and the harmony of two. No account, no ads: everything stays on your phone.",
      ios: "App Store",
      android: "Google Play",
      soon: "Coming soon",
    },
    head: {
      features: {
        kicker: "INSIDE THE APP",
        title: "Six ways to read the runes",
        text: "Each part of AskRune has a room of its own: a candle-lit altar, the northern lights, an old forest.",
      },
      more: "ALSO IN THE APP",
      privacy: "PRIVACY",
      plans: "PLANS",
      faq: "GOOD TO KNOW",
    },
    features: [
      {
        key: "home",
        kicker: "Rune of the day",
        title: "One stone every morning",
        text: "Turn it over and read what the day brings, with the stones, incense and scent that go with its rune. If you like, a gentle reminder at the hour you choose.",
        alt: "The AskRune home screen with the rune of the day",
      },
      {
        key: "reading-drawn",
        kicker: "Rune reading",
        title: "Ask, then draw the stones",
        text: "A single rune, or spreads of three, four and five. Each stone with its own reading, and the spread read as a whole.",
        alt: "A three-rune reading on a candle-lit altar",
      },
      {
        key: "birth",
        kicker: "Birth rune",
        title: "A map from your birth date",
        text: "Your Life Path, Sun and Birth Hour runes and your zodiac sign, drawn as one map you can keep and share.",
        alt: "The birth rune map under the northern lights",
      },
      {
        key: "talisman-medallion",
        kicker: "Talisman",
        title: "A talisman of your own",
        text: "Pick an intention, choose the runes yourself or write your name in runes. Carved into a gold, bronze or stone pendant, and saved as a wallpaper.",
        alt: "A bind rune carved into a gold leaf pendant",
      },
      {
        key: "journey",
        kicker: "Rune Journey",
        title: "Seven days, seven runes",
        text: "One rune and one question a day, a small step to take, the stones and scents that go with it, and a note only you will read. A finished journey stays in your history, with a card to share.",
        alt: "Day three of a Rune Journey: Isa, carved in labradorite",
      },
      {
        key: "compat",
        kicker: "Rune compatibility",
        title: "Two dates, two runes",
        text: "How two Life Path runes meet: the bond, the elements, and a harmony stone carved with both.",
        alt: "Rune compatibility for two people",
      },
    ],
    more: {
      title: "And more",
      open: "Open the guide",
      items: [
        { title: "Rune Guide", text: "All 24 runes, upright and reversed, with their stones and scents." },
        { title: "History and notes", text: "Every reading kept on your phone, with your own notes beside it." },
        { title: "Share cards", text: "Your reading, birth map, talisman or finished journey as a card made for stories." },
        { title: "Write in runes", text: "Your name or a word, letter by letter in runes, by how it sounds in English or Turkish." },
      ],
    },
    craft: {
      kicker: "THE CRAFT",
      title: "Real signs, carved in stone",
      text: "No rune is drawn by AI. Every sign comes from the Elder Futhark's own shapes and is cut into stone, gold or bronze, lit as the stone was lit.",
      note: "The birth rune, the zodiac pairing, talisman design and the stone and scent pairings are modern interpretations, and the app says so.",
    },
    privacy: {
      title: "Yours, and only yours",
      items: [
        { title: "No account", text: "No sign-up, no email, no password." },
        { title: "On your phone", text: "Your readings, birth date and notes never leave it." },
        { title: "No ads, no tracking", text: "No analytics, no ad networks, no cookies." },
        { title: "Store purchases", text: "Payments go through Apple or Google; we never see them." },
      ],
      link: "Privacy Policy",
    },
    plans: {
      title: "Free, with Premium when you want more",
      free: "Free",
      freeItems: [
        "Rune of the day",
        "Single rune readings",
        "Your birth rune and its card",
        "The Rune Guide",
        "Rune compatibility",
        "The seven-day Rune Journey",
        "Design a talisman",
        "Your last 10 readings",
      ],
      premium: "Premium",
      premiumItems: [
        "Three, four and five rune spreads",
        "Talisman as a wallpaper",
        "Harmony stone and compatibility card",
        "Unlimited history",
      ],
      note: "Monthly, yearly or once for life.",
    },
    faq: {
      title: "Questions",
      groups: [
        {
          title: "About the app",
          items: [
            {
              q: "Does a rune reading tell the future?",
              a: "No. It is a tool for reflection, for entertainment and inspiration. It is not a substitute for professional advice.",
            },
            { q: "Where is my data?", a: "Only on your phone. There is no server and no account; we never see it." },
            {
              q: "What is a Rune Journey?",
              a: "Seven days, one rune and one question each, with a small step for the day and the stones and scents that go with its rune. A new day opens the day after the one before, and your notes stay on your phone. A finished journey is kept in your history with a card to share.",
            },
            { q: "Does it work offline?", a: "Yes, everything but purchases." },
            { q: "How do I cancel a subscription?", a: "In your App Store or Google Play account settings. See Support for the steps." },
            {
              q: "What happened to the Rune Kahini web app?",
              a: "It has closed and lives on as the AskRune app. Readings saved in the browser cannot be moved over.",
            },
          ],
        },
        {
          title: "About the runes",
          items: [
            {
              q: "What is the Elder Futhark?",
              a: "The oldest known runic alphabet, used by the Germanic peoples of northern and central Europe from about AD 150 to 800. It is named after its first six letters (F, U, Th, A, R, K), and each of its 24 signs carries both a sound and a meaning. From the 8th century it gave way to the 16-sign Younger Futhark in Scandinavia.",
              link: { page: "history", label: "History of the Runes" },
            },
            {
              q: "How many runes are there, and what is an aett?",
              a: "The Elder Futhark has 24 runes in three groups of eight. Each group is an aett (plural aettir), Old Norse for family or kin. Freyr & Freyja's aett begins with Fehu and speaks of the material world and daily life; Heimdall's begins with Hagalaz and speaks of trials and transformation; Tyr's begins with Tiwaz and speaks of justice and spiritual maturity.",
              link: { page: "index", label: "All 24 runes in the Rune Guide" },
            },
            {
              q: "Were runes used to read the future in history?",
              a: "Runes are first of all a script: names, dedications and short protective formulas were carved into stone, wood, bone and metal. The Roman historian Tacitus, writing in AD 98, describes Germanic tribes drawing lots with marked slips of wood, but whether those marks were runes is disputed. There is no direct archaeological evidence for reading runes by drawing stones; today's rune reading is largely a modern reconstruction, and AskRune presents it as one.",
              link: { page: "history", label: "What were runes used for?" },
            },
            {
              q: "What is the oldest rune inscription?",
              a: "One of the oldest known is the word \"harja\" on the Vimose comb from Denmark, from around AD 160. The oldest complete row of all 24 runes in order is on the Kylver stone on Gotland, Sweden, from around AD 400.",
            },
            {
              q: "What does a reversed rune mean?",
              a: "Reading a rune that lands upside down with a different, usually shadowed meaning is a modern practice, borrowed from reversed cards in tarot; old inscriptions know no such rule. Nine runes are symmetrical and look the same either way up, so they are read upright only: Gebo, Hagalaz, Nauthiz, Isa, Jera, Eihwaz, Sowilo, Ingwaz and Dagaz. The Rune Guide gives every other rune's upright and reversed meaning.",
              link: { page: "index", label: "Upright and reversed meanings" },
            },
            {
              q: "What is the blank rune, and why is there none in AskRune?",
              a: "The unmarked stone in some sets appears in no ancient inscription, rune poem or Viking Age find. It entered rune reading with Ralph Blum's The Book of Runes in 1982, when the spare blank stone packed with commercial sets was read as \"the unknown\". The Elder Futhark has 24 signs, and AskRune stays true to that.",
            },
            {
              q: "Which spread should I choose?",
              a: "A single rune for daily direction or quick clarity. Past · Present · Future, inspired by the three Norns who weave fate, to see where a matter comes from and where it is heading. The four-rune relationship spread for a bond between two people. The five-rune cross for complex decisions. All of today's spreads are modern.",
              link: { page: "spreads", label: "The spreads explained" },
            },
            {
              q: "How do I prepare for a reading?",
              a: "Modern readers begin with a small pause: a quiet place, a few deep breaths, and the question held clearly in mind. The runes are not a prophecy but a mirror to think with. Whatever the stone says, the choice and the path are yours.",
            },
            {
              q: "Are the birth rune and the zodiac pairing historical?",
              a: "No, both are modern interpretations. No Norse source pairs runes with the signs of the zodiac, and working out a rune from a birth date is today's practice. The app labels them as modern interpretations, as it does talisman design.",
            },
            {
              q: "Are the stone, incense and scent pairings historical?",
              a: "No. They are modern esoteric correspondences and vary from source to source; no old source pairs runes with crystals or scents. AskRune offers them as something to go with a rune, labelled as modern, and never as a health claim.",
            },
            {
              q: "What is a bind rune?",
              a: "Several runes joined on one shared stave into a single sign. In AskRune it is how a talisman is made: pick an intention or your own runes, and they are carved together into a gold, bronze or stone pendant. Each rune's page in the guide says which intentions it is used for (In Talismans). Talisman design is a modern interpretation.",
            },
          ],
        },
      ],
    },
    footer: { privacy: "Privacy", terms: "Terms of Use", support: "Support", contact: "Contact", rights: "© 2026 Murat Ağırbaş" },
    legal: { privacy: "/privacy/", terms: "/terms/", support: "/support/" },
    pwa: {
      text: "The Rune Kahini web app has closed. It is coming back as the AskRune app for iPhone and Android. Readings saved in this browser cannot be moved over.",
      close: "Close",
    },
    notFound: { title: "Nothing carved here", text: "This page does not exist.", home: "Back to AskRune" },
    daily: {
      kicker: "RUNE OF THE DAY",
      title: "Rune of the Day",
      silent: "The stone is\nstill silent",
      support: "Discover what today brings you.",
      turn: "Turn the Stone",
      turnLabel: "Turn the stone and see its rune",
      reversed: "Reversed",
      later: "A new stone awaits you tomorrow.",
      readMore: "Read {rune} in the Rune Guide",
      corrKicker: "TO GO WITH TODAY",
      read: "Read Its Meaning",
      cta: "Turn today's stone",
      about:
        "One stone a day, the same for everyone and the same as in the AskRune app; it changes at midnight, your time. A rune reading is for reflection, not a prediction.",
      meta: {
        title: "Rune of the Day: one Elder Futhark rune for today · AskRune",
        description:
          "Turn today's stone: one rune of the Elder Futhark, its meaning, keywords and a question to carry through the day. The same stone as in the AskRune app.",
      },
    },
  },

  tr: {
    meta: {
      title: "AskRune: rune okumaları, doğum rune'si ve tılsım",
      description:
        "Elder Futhark'ın 24 rune'u ile günlük okumalar, doğum rune'in, kendi tılsımın, yedi günlük Rune Yolculuğu ve iki kişinin uyumu. Hesap yok, reklam yok. Yakında App Store ve Google Play'de.",
    },
    nav: { other: "English", otherHref: "/", guide: "Rune Rehberi" },
    hero: {
      kicker: "ELDER FUTHARK'IN 24 RUNE'U",
      title: ["Kadim işaretler,", "yeni bakışlar"],
      sub: "Elder Futhark'ın 24 rune'u ile günlük okumalar, doğum rune'in, kendi tılsımın, yedi günlük Rune Yolculuğu ve iki kişinin uyumu. Hesap yok, reklam yok: her şey telefonunda kalır.",
      ios: "App Store",
      android: "Google Play",
      soon: "Yakında",
    },
    head: {
      features: {
        kicker: "UYGULAMANIN İÇİNDE",
        title: "Rune'ları okumanın altı yolu",
        text: "AskRune'un her bölümünün kendi odası var: mum ışıklı bir sunak, kuzey ışıkları, kadim bir orman.",
      },
      more: "UYGULAMADA AYRICA",
      privacy: "GİZLİLİK",
      plans: "PLANLAR",
      faq: "MERAK EDİLENLER",
    },
    features: [
      {
        key: "home",
        kicker: "Günün Rune'si",
        title: "Her sabah bir taş",
        text: "Çevir, bugünün sana getirdiği mesajı oku; yanında o rune'a eşlik eden taşlar, tütsü ve koku. İstersen seçtiğin saatte nazikçe hatırlatsın.",
        alt: "AskRune ana sayfası ve günün rune'si",
      },
      {
        key: "reading-drawn",
        kicker: "Rune Okuması",
        title: "Sor, sonra taşları çek",
        text: "Tek rune ya da üç, dört ve beş rune'lu açılımlar. Her taş kendi yorumuyla, açılım da bir bütün olarak.",
        alt: "Mum ışıklı sunakta üç rune'lu okuma",
      },
      {
        key: "birth",
        kicker: "Doğum Rune'si",
        title: "Doğum tarihinden bir harita",
        text: "Kader Yolu, Güneş ve Doğum Saati rune'ların ve burcun, saklayıp paylaşabileceğin tek bir haritada.",
        alt: "Kuzey ışıkları altında doğum rune'si haritası",
      },
      {
        key: "talisman-medallion",
        kicker: "Tılsım",
        title: "Kendi tılsımın",
        text: "Bir niyet seç, rune'ları kendin belirle ya da adını rune'larla yaz. Altın, bronz ya da taş bir kolyeye kazınsın, duvar kâğıdın olsun.",
        alt: "Altın yaprak kolyeye kazınmış bağ rune'u",
      },
      {
        key: "journey",
        kicker: "Rune Yolculuğu",
        title: "Yedi gün, yedi rune",
        text: "Her gün bir rune ve bir soru, atılacak küçük bir adım, o rune'a eşlik eden taşlar ve kokular, bir de yalnızca senin okuyacağın bir not. Biten yolculuk Geçmiş'inde kalır, paylaşılacak bir kartı olur.",
        alt: "Rune Yolculuğu'nun üçüncü günü: labradorite kazınmış Isa",
      },
      {
        key: "compat",
        kicker: "Rune Uyumu",
        title: "İki tarih, iki rune",
        text: "İki Kader Yolu rune'unun buluşması: bağınız, elementleriniz ve ikisinin birlikte kazındığı bir uyum taşı.",
        alt: "İki kişi için Rune Uyumu",
      },
    ],
    more: {
      title: "Ve dahası",
      open: "Rehberi aç",
      items: [
        { title: "Rune Rehberi", text: "24 rune'un hepsi, düz ve ters; taşları ve kokularıyla." },
        { title: "Geçmiş ve notlar", text: "Her okuman telefonunda saklanır, yanına kendi notunu ekleyebilirsin." },
        { title: "Paylaşım kartları", text: "Okuman, doğum haritan, tılsımın ya da biten yolculuğun, hikâyeler için hazırlanmış bir kart." },
        { title: "Rune ile Yaz", text: "Adın ya da bir kelime, Türkçe ya da İngilizce okunuşuna göre harf harf rune'larla." },
      ],
    },
    craft: {
      kicker: "ZANAAT",
      title: "Gerçek işaretler, kazınmış taş",
      text: "Hiçbir rune yapay zekâya çizdirilmez. Her işaret Elder Futhark'ın kendi biçiminden çizilir ve taşa, altına, bronza oyulur; taşın aldığı ışıkla aydınlanır.",
      note: "Doğum rune'si, burç eşleşmesi, tılsım tasarımı ve taş ile koku eşleşmeleri modern yorumlardır; uygulama bunu açıkça söyler.",
    },
    privacy: {
      title: "Senin, yalnızca senin",
      items: [
        { title: "Hesap yok", text: "Kayıt yok, e-posta yok, şifre yok." },
        { title: "Telefonunda kalır", text: "Okumaların, doğum tarihin ve notların cihazdan çıkmaz." },
        { title: "Reklam ve takip yok", text: "Analiz aracı yok, reklam ağı yok, çerez yok." },
        { title: "Mağazadan satın alma", text: "Ödeme Apple ya da Google üzerinden; biz görmeyiz." },
      ],
      link: "Gizlilik Politikası",
    },
    plans: {
      title: "Ücretsiz; daha fazlası için Premium",
      free: "Ücretsiz",
      freeItems: [
        "Günün Rune'si",
        "Tek rune okumaları",
        "Doğum rune'in ve kartı",
        "Rune Rehberi",
        "Rune Uyumu",
        "Yedi günlük Rune Yolculuğu",
        "Tılsım tasarlama",
        "Son 10 okuman",
      ],
      premium: "Premium",
      premiumItems: [
        "Üç, dört ve beş rune'lu açılımlar",
        "Tılsımı duvar kâğıdı yapma",
        "Uyum taşı ve uyum kartı",
        "Sınırsız geçmiş",
      ],
      note: "Aylık, yıllık ya da tek seferlik ömür boyu.",
    },
    faq: {
      title: "Sorular",
      groups: [
        {
          title: "Uygulama hakkında",
          items: [
            {
              q: "Rune okuması geleceği söyler mi?",
              a: "Hayır. Bir düşünme ve kendini sorgulama aracıdır; eğlence ve ilham içindir. Profesyonel desteğin yerini tutmaz.",
            },
            { q: "Verilerim nerede?", a: "Yalnızca telefonunda. Sunucu da hesap da yok; biz göremeyiz." },
            {
              q: "Rune Yolculuğu nedir?",
              a: "Yedi gün; her gün bir rune ve bir soru, o güne küçük bir adım ve rune'a eşlik eden taşlar ve kokular. Yeni gün bir öncekinin ertesi günü açılır, notların telefonunda kalır. Biten yolculuk paylaşılacak bir kartla Geçmiş'inde saklanır.",
            },
            { q: "İnternetsiz çalışır mı?", a: "Evet, satın alma dışında her şey." },
            { q: "Aboneliği nasıl iptal ederim?", a: "App Store ya da Google Play hesap ayarlarından. Adımlar Destek sayfasında." },
            {
              q: "Rune Kahini web sürümüne ne oldu?",
              a: "Kapandı; AskRune uygulaması olarak yenilendi. Tarayıcıda saklanan okumalar taşınamıyor.",
            },
          ],
        },
        {
          title: "Rune'lar hakkında",
          items: [
            {
              q: "Elder Futhark nedir?",
              a: "Kuzey ve Orta Avrupa'daki Germen halklarının yaklaşık MS 150–800 arasında kullandığı, bilinen en eski rune alfabesidir. Adını ilk altı harfinden alır (F, U, Th, A, R, K); 24 işaretin her biri hem bir ses hem bir anlam taşır. 8. yüzyıldan sonra İskandinavya'da yerini 16 işaretli Younger Futhark'a bıraktı.",
              link: { page: "history", label: "Rune'ların Tarihi" },
            },
            {
              q: "Kaç rune var, aett ne demek?",
              a: "Elder Futhark 24 rune'dur ve sekizerli üç gruba ayrılır. Her gruba aett denir (çoğulu aettir); Eski İskandinavcada aile ya da soy demektir. Freyr & Freyja Ailesi Fehu ile başlar, maddi dünyayı ve günlük yaşamı anlatır; Heimdall Ailesi Hagalaz ile başlar, sınavları ve dönüşümü; Tyr Ailesi Tiwaz ile başlar, adaleti ve ruhsal olgunluğu.",
              link: { page: "index", label: "Rune Rehberi'nde 24 rune" },
            },
            {
              q: "Rune'lar tarihte geleceği okumak için kullanıldı mı?",
              a: "Rune'lar her şeyden önce bir yazıdır: taşa, ahşaba, kemiğe ve metale isimler, adaklar ve kısa koruyucu formüller kazındı. Romalı tarihçi Tacitus MS 98'de Germen kabilelerinin işaretli çubuklarla kura çektiğini anlatır, ama bu işaretlerin rune olup olmadığı tartışmalıdır. Taş çekerek okumaya dair doğrudan arkeolojik kanıt yoktur; bugünkü rune okuması büyük ölçüde modern bir yeniden kurgudur ve AskRune onu böyle sunar.",
              link: { page: "history", label: "Rune'lar ne için kullanıldı?" },
            },
            {
              q: "Bilinen en eski rune yazıtı hangisi?",
              a: "En eskilerden biri, Danimarka'da bulunan ve MS 160 civarına tarihlenen Vimose tarağındaki \"harja\" kelimesidir. 24 rune'un sırasıyla yazıldığı en eski eksiksiz dizi ise İsveç'in Gotland adasındaki Kylver taşındadır (MS 400 civarı).",
            },
            {
              q: "Ters rune ne anlama gelir?",
              a: "Ters çıkan bir rune'un farklı, çoğu zaman gölgeli bir anlamla okunması moderndir; tarot'taki ters kartlardan uyarlanmıştır, eski yazıtlarda böyle bir kural yoktur. Dokuz rune simetrik olduğu için ters çevrilince aynı görünür ve yalnız düz okunur: Gebo, Hagalaz, Nauthiz, Isa, Jera, Eihwaz, Sowilo, Ingwaz ve Dagaz. Diğer rune'ların düz ve ters anlamları rehberde ayrı ayrı yazılı.",
              link: { page: "index", label: "Düz ve ters anlamlar" },
            },
            {
              q: "Boş rune nedir, AskRune'da neden yok?",
              a: "Bazı setlerdeki işaretsiz taş, hiçbir eski yazıtta, rune şiirinde ya da Viking Çağı buluntusunda geçmez. 1982'de Ralph Blum'un The Book of Runes kitabıyla okumaya girdi; satılan setlere yedek olarak konan boş taş \"bilinmeyen\" diye yorumlandı. Elder Futhark 24 işarettir ve AskRune o hâline sadık kalır.",
            },
            {
              q: "Hangi açılımı seçmeliyim?",
              a: "Günlük yön ya da hızlı bir netlik için Tek Rune. Bir sürecin nereden gelip nereye gittiğini görmek için, kaderi dokuyan üç Norn'dan esinlenen Geçmiş · Şimdi · Gelecek. İki kişi arasındaki bağ için 4'lü İlişki Açılımı. Karmaşık kararlar için 5'li Haç. Bugünkü açılımların hepsi moderndir.",
              link: { page: "spreads", label: "Açılımlar nasıl okunur" },
            },
            {
              q: "Okumadan önce nasıl hazırlanırım?",
              a: "Modern okuyucular küçük bir hazırlıkla başlar: sakin bir yer, birkaç derin nefes ve sorunun açıkça düşünülmesi. Rune'lar bir kehanet değil, düşünmek için bir aynadır. Çıkan taş ne söylerse söylesin, kararın ve yolun senindir.",
            },
            {
              q: "Doğum rune'u ve burç eşleşmesi tarihsel mi?",
              a: "Hayır, ikisi de modern yorumdur. Rune'ları burçlarla eşleyen hiçbir İskandinav kaynağı yoktur; doğum tarihinden rune hesaplamak da bugünün pratiğidir. Uygulama bunları, tılsım tasarımı gibi, açıkça modern yorum olarak etiketler.",
            },
            {
              q: "Taş, tütsü ve koku eşleşmeleri tarihsel mi?",
              a: "Hayır. Bunlar modern ezoterik eşleşmelerdir ve kaynaktan kaynağa değişir; rune'ları kristallerle ya da kokularla eşleyen eski bir kaynak yoktur. AskRune bunları bir rune'a eşlik edebilecek şeyler olarak, modern yorum etiketiyle sunar; hiçbir zaman sağlık iddiası olarak değil.",
            },
            {
              q: "Bağ rune'u (bindrune) nedir?",
              a: "Birden çok rune'un ortak bir gövde üzerinde tek bir işarette birleştirilmesidir. AskRune'da tılsım böyle yapılır: bir niyet ya da kendi rune'larını seçersin, birlikte altın, bronz ya da taş bir kolyeye kazınır. Rehberde her rune'un \"Tılsımda\" bölümü hangi niyetlerde kullanıldığını anlatır. Tılsım tasarımı modern bir yorumdur.",
            },
          ],
        },
      ],
    },
    footer: { privacy: "Gizlilik", terms: "Kullanım Koşulları", support: "Destek", contact: "İletişim", rights: "© 2026 Murat Ağırbaş" },
    legal: { privacy: "/gizlilik/", terms: "/kosullar/", support: "/destek/" },
    pwa: {
      text: "Rune Kahini web sürümü kapandı. Yakında iPhone ve Android için AskRune uygulaması olarak geri geliyor. Bu tarayıcıda saklanan okumalar taşınamıyor.",
      close: "Kapat",
    },
    notFound: { title: "Burada kazılı bir şey yok", text: "Bu sayfa bulunamadı.", home: "AskRune'a dön" },
    daily: {
      kicker: "GÜNÜN RUNE'Sİ",
      title: "Günün Rune'si",
      silent: "Taş henüz sessiz",
      support: "Bugünün sana getirdiği mesajı keşfet.",
      turn: "Taşı Çevir",
      turnLabel: "Taşı çevir, rune'unu gör",
      reversed: "Ters",
      later: "Yarın yeni bir taş seni bekliyor.",
      readMore: "Rehberde {rune}",
      corrKicker: "BUGÜNE EŞLİK EDEN",
      read: "Anlamını Oku",
      cta: "Bugünün taşını çevir",
      about:
        "Günde bir taş: herkes için aynı ve AskRune uygulamasındaki günün taşıyla aynı; senin saatinle gece yarısı değişir. Rune okuması bir kehanet değil, düşünmek için bir aynadır.",
      meta: {
        title: "Günün Rune'si: bugün için bir Elder Futhark rune'u · AskRune",
        description:
          "Bugünün taşını çevir: Elder Futhark'tan bir rune, anlamı, anahtar kelimeleri ve gün boyu taşıyacağın bir soru. AskRune uygulamasındaki taşla aynı.",
      },
    },
  },
};

/** The questions as schema.org FAQPage data, for search engines. */
export function faqJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: copy[lang].faq.groups.flatMap((g) =>
      g.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    ),
  };
}

/** Who and what the site is, for search and answer engines: the publisher, the site and the app itself. */
export function siteJsonLd(lang: Lang) {
  const site = "https://askrune.app";
  const t = copy[lang];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": site + "/#org",
      name: "AskRune",
      alternateName: "Rune Kahini",
      url: site + "/",
      logo: site + "/icons/icon-512.png",
      email: "destek@askrune.app",
      founder: { "@type": "Person", name: "Murat Ağırbaş" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": site + "/#site",
      name: "AskRune",
      url: site + (lang === "tr" ? "/tr/" : "/"),
      inLanguage: lang,
      publisher: { "@id": site + "/#org" },
    },
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: lang === "tr" ? "Rune Kahini (AskRune)" : "AskRune",
      operatingSystem: "iOS, Android",
      applicationCategory: "LifestyleApplication",
      inLanguage: ["en", "tr"],
      description: t.meta.description,
      image: site + "/icons/icon-512.png",
      author: { "@id": site + "/#org" },
      featureList: [...t.features.map((f) => `${f.kicker}: ${f.title}`), ...t.more.items.map((m) => m.title)].join(", "),
    },
  ];
}
