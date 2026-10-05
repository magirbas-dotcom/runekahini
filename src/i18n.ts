// The site's words, in the app's two languages. Facts here follow the app (askrune-app): no account, data on
// the phone, what is free and what is Premium. "Fal" is never used, as in the app: it is a "Rune Okuması".

export type Lang = "en" | "tr";

export interface Feature {
  key: "home" | "reading-drawn" | "birth" | "talisman-medallion" | "compat";
  kicker: string;
  title: string;
  text: string;
  alt: string;
}

export interface Copy {
  meta: { title: string; description: string };
  nav: { other: string; otherHref: string };
  hero: { kicker: string; title: [string, string]; sub: string; ios: string; android: string; soon: string };
  head: { features: { kicker: string; title: string; text: string }; more: string; privacy: string; plans: string; faq: string };
  features: Feature[];
  more: { title: string; items: { title: string; text: string }[] };
  craft: { title: string; text: string; note: string };
  privacy: { title: string; items: string[]; link: string };
  plans: { title: string; free: string; freeItems: string[]; premium: string; premiumItems: string[]; note: string };
  faq: { title: string; items: { q: string; a: string }[] };
  footer: { privacy: string; terms: string; support: string; contact: string; rights: string };
  legal: { privacy: string; terms: string; support: string };
  pwa: { text: string; close: string };
  notFound: { title: string; text: string; home: string };
}

export const copy: Record<Lang, Copy> = {
  en: {
    meta: {
      title: "AskRune: rune readings, your birth rune and talismans",
      description:
        "Daily rune readings with the 24 runes of the Elder Futhark, your birth rune, a talisman of your own and the harmony of two. No account, no ads. Coming soon to the App Store and Google Play.",
    },
    nav: { other: "Türkçe", otherHref: "/tr/" },
    hero: {
      kicker: "THE 24 RUNES OF THE ELDER FUTHARK",
      title: ["Ancient signs,", "new perspectives"],
      sub: "Daily readings with the 24 runes of the Elder Futhark, your birth rune, a talisman of your own and the harmony of two. No account, no ads: everything stays on your phone.",
      ios: "App Store",
      android: "Google Play",
      soon: "Coming soon",
    },
    head: {
      features: {
        kicker: "INSIDE THE APP",
        title: "Five ways to read the runes",
        text: "Each part of AskRune has a room of its own: a candle-lit altar, the northern lights, an old forest.",
      },
      more: "ALSO IN THE APP",
      privacy: "PRIVACY",
      plans: "PLANS",
      faq: "QUESTIONS",
    },
    features: [
      {
        key: "home",
        kicker: "Rune of the day",
        title: "One stone every morning",
        text: "Turn it over and read what the day brings. If you like, a gentle reminder at the hour you choose.",
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
        key: "compat",
        kicker: "Rune compatibility",
        title: "Two dates, two runes",
        text: "How two Life Path runes meet: the bond, the elements, and a harmony stone carved with both.",
        alt: "Rune compatibility for two people",
      },
    ],
    more: {
      title: "And more",
      items: [
        { title: "Rune Guide", text: "All 24 runes, upright and reversed, with what each means in love and work." },
        { title: "History and notes", text: "Every reading kept on your phone, with your own notes beside it." },
        { title: "Share cards", text: "Your reading, birth map or talisman as a card made for stories." },
        { title: "Two languages", text: "English and Turkish, the readings included." },
      ],
    },
    craft: {
      title: "Real signs, carved in stone",
      text: "No rune is drawn by AI. Every sign comes from the Elder Futhark's own shapes and is cut into stone, gold or bronze, lit as the stone was lit.",
      note: "The birth rune, the zodiac pairing and talisman design are modern interpretations, and the app says so.",
    },
    privacy: {
      title: "Yours, and only yours",
      items: ["No account", "Everything stays on your phone", "No ads, no tracking", "Purchases only through the store"],
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
      items: [
        {
          q: "Does a rune reading tell the future?",
          a: "No. It is a tool for reflection, for entertainment and inspiration. It is not a substitute for professional advice.",
        },
        { q: "Where is my data?", a: "Only on your phone. There is no server and no account; we never see it." },
        { q: "Does it work offline?", a: "Yes, everything but purchases." },
        { q: "How do I cancel a subscription?", a: "In your App Store or Google Play account settings. See Support for the steps." },
        {
          q: "What happened to the Rune Kahini web app?",
          a: "It has closed and lives on as the AskRune app. Readings saved in the browser cannot be moved over.",
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
  },

  tr: {
    meta: {
      title: "AskRune · Rune Kahini: rune okumaları, doğum rune'si ve tılsım",
      description:
        "Elder Futhark'ın 24 rune'u ile günlük okumalar, doğum rune'in, kendi tılsımın ve iki kişinin uyumu. Hesap yok, reklam yok. Yakında App Store ve Google Play'de.",
    },
    nav: { other: "English", otherHref: "/" },
    hero: {
      kicker: "ELDER FUTHARK'IN 24 RUNE'U",
      title: ["Kadim işaretler,", "yeni bakışlar"],
      sub: "Elder Futhark'ın 24 rune'u ile günlük okumalar, doğum rune'in, kendi tılsımın ve iki kişinin uyumu. Hesap yok, reklam yok: her şey telefonunda kalır.",
      ios: "App Store",
      android: "Google Play",
      soon: "Yakında",
    },
    head: {
      features: {
        kicker: "UYGULAMANIN İÇİNDE",
        title: "Rune'ları okumanın beş yolu",
        text: "AskRune'un her bölümünün kendi odası var: mum ışıklı bir sunak, kuzey ışıkları, kadim bir orman.",
      },
      more: "UYGULAMADA AYRICA",
      privacy: "GİZLİLİK",
      plans: "PLANLAR",
      faq: "SORULAR",
    },
    features: [
      {
        key: "home",
        kicker: "Günün Rune'si",
        title: "Her sabah bir taş",
        text: "Çevir, bugünün sana getirdiği mesajı oku. İstersen seçtiğin saatte nazikçe hatırlatsın.",
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
        key: "compat",
        kicker: "Rune Uyumu",
        title: "İki tarih, iki rune",
        text: "İki Kader Yolu rune'unun buluşması: bağınız, elementleriniz ve ikisinin birlikte kazındığı bir uyum taşı.",
        alt: "İki kişi için Rune Uyumu",
      },
    ],
    more: {
      title: "Ve dahası",
      items: [
        { title: "Rune Rehberi", text: "24 rune'un hepsi, düz ve ters; aşkta ve işte ne anlattıkları." },
        { title: "Geçmiş ve notlar", text: "Her okuman telefonunda saklanır, yanına kendi notunu ekleyebilirsin." },
        { title: "Paylaşım kartları", text: "Okuman, doğum haritan ya da tılsımın, hikâyeler için hazırlanmış bir kart." },
        { title: "İki dil", text: "Türkçe ve İngilizce, yorumlar dahil." },
      ],
    },
    craft: {
      title: "Gerçek işaretler, kazınmış taş",
      text: "Hiçbir rune yapay zekâya çizdirilmez. Her işaret Elder Futhark'ın kendi biçiminden çizilir ve taşa, altına, bronza oyulur; taşın aldığı ışıkla aydınlanır.",
      note: "Doğum rune'si, burç eşleşmesi ve tılsım tasarımı modern yorumlardır; uygulama bunu açıkça söyler.",
    },
    privacy: {
      title: "Senin, yalnızca senin",
      items: ["Hesap yok", "Her şey telefonunda kalır", "Reklam ve takip yok", "Satın alma yalnızca mağazadan"],
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
      items: [
        {
          q: "Rune okuması geleceği söyler mi?",
          a: "Hayır. Bir düşünme ve kendini sorgulama aracıdır; eğlence ve ilham içindir. Profesyonel desteğin yerini tutmaz.",
        },
        { q: "Verilerim nerede?", a: "Yalnızca telefonunda. Sunucu da hesap da yok; biz göremeyiz." },
        { q: "İnternetsiz çalışır mı?", a: "Evet, satın alma dışında her şey." },
        { q: "Aboneliği nasıl iptal ederim?", a: "App Store ya da Google Play hesap ayarlarından. Adımlar Destek sayfasında." },
        {
          q: "Rune Kahini web sürümüne ne oldu?",
          a: "Kapandı; AskRune uygulaması olarak yenilendi. Tarayıcıda saklanan okumalar taşınamıyor.",
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
  },
};
