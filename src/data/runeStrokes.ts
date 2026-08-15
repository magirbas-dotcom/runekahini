/**
 * Simplified straight-line stroke paths for the 24 Elder Futhark runes, each
 * normalized to a 100x100 box so they can be stacked (bindrune-style) without
 * per-glyph adjustment. These are clean, legible approximations for a digital
 * talisman designer — not paleographically exact manuscript reproductions.
 * Where the historical glyph has a full vertical stave, it runs x=50, y=10→90
 * so multiple runes lock to the same vertical line when layered.
 */
export const RUNE_STROKES: Record<string, string> = {
  Fehu: "M50,10 L50,90 M50,20 L85,5 M50,40 L85,25",
  Uruz: "M30,10 L30,90 M30,10 L75,90",
  Thurisaz: "M40,10 L40,90 M40,30 L65,40 L40,55",
  Ansuz: "M50,10 L50,90 M50,25 L85,40 M50,45 L85,60",
  Raidho: "M40,10 L40,90 M40,10 L65,25 L40,40 M40,55 L70,90",
  Kenaz: "M30,15 L65,50 L30,85",
  Gebo: "M20,15 L80,85 M80,15 L20,85",
  Wunjo: "M35,10 L35,90 M35,10 L70,25 L35,40",
  Hagalaz: "M30,10 L30,90 M70,10 L70,90 M30,35 L70,65",
  Nauthiz: "M50,10 L50,90 M35,35 L65,65",
  Isa: "M50,10 L50,90",
  Jera: "M30,15 L50,45 L30,75 M70,15 L50,45 L70,75",
  Eihwaz: "M50,10 L50,90 M50,25 L65,35 M50,55 L35,65",
  Perthro: "M35,10 L35,90 M35,10 L65,10 L65,45 L35,45",
  Algiz: "M50,10 L50,90 M50,30 L20,10 M50,30 L80,10",
  Sowilo: "M25,10 L60,35 L30,55 L70,90",
  Tiwaz: "M50,10 L50,90 M30,30 L50,10 L70,30",
  Berkano: "M35,10 L35,90 M35,10 L65,25 L35,40 M35,40 L65,60 L35,80",
  Ehwaz: "M30,10 L30,90 M70,10 L70,90 M30,50 L70,50",
  Mannaz: "M25,10 L25,90 M75,10 L75,90 M25,10 L50,50 L75,10",
  Laguz: "M50,10 L50,90 M50,55 L25,90",
  Ingwaz: "M50,20 L80,50 L50,80 L20,50 Z",
  Dagaz: "M20,20 L20,80 M80,20 L80,80 M20,20 L80,80 M20,80 L80,20",
  Othala: "M50,15 L75,40 L50,65 L25,40 Z M50,65 L30,90 M50,65 L70,90",
};

export interface IntentPreset {
  id: string;
  name: string;
  category: string;
  runeNames: string[];
  synergy: string;
}

export const INTENT_PRESETS: IntentPreset[] = [
  {
    id: "protection",
    name: "Kuzey Muhafızı",
    category: "Koruma",
    runeNames: ["Algiz", "Thurisaz"],
    synergy:
      "Algiz'in yukarı uzanan kalkanı, Thurisaz'ın aktif savunma gücüyle birleşiyor — sarsılmaz bir koruma kalkanı.",
  },
  {
    id: "prosperity",
    name: "Bereketli Hasat",
    category: "Bolluk",
    runeNames: ["Fehu", "Jera"],
    synergy:
      "Fehu'nun akan serveti, Jera'nın sabırlı döngüsel hasadıyla buluşuyor — sürdürülebilir bir bolluk.",
  },
  {
    id: "love",
    name: "Bağlılık Düğümü",
    category: "Aşk & Uyum",
    runeNames: ["Gebo", "Wunjo"],
    synergy:
      "Gebo'nun dengeli alışverişi, Wunjo'nun neşesiyle taçlanıyor — karşılıklı sevgi ve uyum.",
  },
  {
    id: "healing",
    name: "Yenilenme Kalkanı",
    category: "Şifa & Yaşam Gücü",
    runeNames: ["Uruz", "Berkano"],
    synergy:
      "Uruz'un ham yaşamsal gücü, Berkano'nun yenileyici şefkatiyle destekleniyor — bedensel ve ruhsal iyileşme.",
  },
  {
    id: "wisdom",
    name: "Meşale Bilgeliği",
    category: "Bilgelik & Netlik",
    runeNames: ["Ansuz", "Kenaz"],
    synergy:
      "Ansuz'un ilahi rehberliği, Kenaz'ın aydınlatıcı meşalesiyle birleşiyor — net görüş ve doğru karar.",
  },
  {
    id: "exam",
    name: "Sakin Zihin",
    category: "Sınav & Mülakat",
    runeNames: ["Ansuz", "Algiz", "Tiwaz"],
    synergy:
      "Ansuz'un akıcı ifadesi, Algiz'in koruyucu sakinliği ve Tiwaz'ın kararlılığıyla üçe katlanıyor — heyecanı dizginleyip net anlatan bir zihin.",
  },
  {
    id: "home",
    name: "Eşik Muhafızı",
    category: "Ev & Aile",
    runeNames: ["Othala", "Algiz"],
    synergy:
      "Othala'nın ata topraklarını koruyan gücü, Algiz'in kalkanıyla pekişiyor — evin ve hanenin bütününü kollayan bir mühür.",
  },
  {
    id: "lostfound",
    name: "Geri Dönüş Yolu",
    category: "Kayıp Bulma",
    runeNames: ["Raidho", "Tiwaz"],
    synergy:
      "Raidho'nun yön bulma gücü, Tiwaz'ın kararlı doğrultusuyla birleşiyor — kaybolanın geri dönüş yolunu açan bir işaret.",
  },
  {
    id: "sleep",
    name: "Ay Işığı Huzuru",
    category: "Uyku & Rüya",
    runeNames: ["Laguz", "Ansuz"],
    synergy:
      "Laguz'un sezgisel akışı, Ansuz'un berrak mesajlarıyla yumuşuyor — huzurlu bir uyku ve hatırlanan rüyalar için bir denge.",
  },
  {
    id: "newstart",
    name: "Açılan Yol",
    category: "Yeni Başlangıç",
    runeNames: ["Ehwaz", "Fehu"],
    synergy:
      "Ehwaz'ın bağımsız ilerleyişi, Fehu'nun taze kazanım enerjisiyle destekleniyor — taşınma, iş değişimi ya da yeni bir sayfa için hız.",
  },
  {
    id: "courage",
    name: "Savaşçı Ruhu",
    category: "Cesaret & Kararlılık",
    runeNames: ["Tiwaz", "Uruz"],
    synergy:
      "Tiwaz'ın kararlı adalet duygusu, Uruz'un ham yaşamsal gücüyle birleşiyor — zorluklar karşısında geri adım atmayan bir cesaret.",
  },
  {
    id: "energy",
    name: "Yaşam Ateşi",
    category: "Enerji & Canlılık",
    runeNames: ["Sowilo", "Uruz"],
    synergy:
      "Sowilo'nun parlayan zafer ışığı, Uruz'un fiziksel dayanıklılığıyla besleniyor — tükenmişlikten çıkışı hızlandıran canlı bir enerji.",
  },
  {
    id: "luck",
    name: "Şans Kapısı",
    category: "Şans & Uğur",
    runeNames: ["Perthro", "Fehu"],
    synergy:
      "Perthro'nun beklenmedik kader oyunları, Fehu'nun bereketli akışıyla buluşuyor — kapıyı şansa ve kazanca aralayan bir işaret.",
  },
  {
    id: "grace",
    name: "Nazik Kalp",
    category: "Lütuf & Nezaket",
    runeNames: ["Gebo", "Sowilo"],
    synergy:
      "Gebo'nun karşılıksız cömertliği, Sowilo'nun sıcak ışığıyla yumuşuyor — çevrenize nezaket ve lütuf yayan bir duruş.",
  },
  {
    id: "communication",
    name: "Net Söz",
    category: "İletişim & İkna",
    runeNames: ["Ansuz", "Mannaz"],
    synergy:
      "Ansuz'un berrak ifadesi, Mannaz'ın insan ilişkilerini yönetme becerisiyle destekleniyor — ikna edici ve dürüst bir iletişim.",
  },
  {
    id: "promotion",
    name: "Zirveye Çıkış",
    category: "Terfi & Yükseliş",
    runeNames: ["Sowilo", "Fehu"],
    synergy:
      "Sowilo'nun zafer parlaklığı, Fehu'nun hak edilmiş kazanımıyla taçlanıyor — beklenen terfi veya yükseliş için bir ivme.",
  },
  {
    id: "grief",
    name: "Şafak Nefesi",
    category: "Yas & Duygusal İyileşme",
    runeNames: ["Dagaz", "Ingwaz"],
    synergy:
      "Dagaz'ın çığır açan farkındalığı, Ingwaz'ın sabırlı iç olgunlaşmasıyla yavaşlıyor — kaybın ardından gelen iyileşmeye nazik bir eşlik.",
  },
  {
    id: "travel",
    name: "Güvenli Rota",
    category: "Güvenli Seyahat",
    runeNames: ["Raidho", "Algiz"],
    synergy:
      "Raidho'nun doğru yön bulma gücü, Algiz'in koruyucu kalkanıyla pekişiyor — yolculuk boyunca güvenliği gözeten bir işaret.",
  },
  {
    id: "creativity",
    name: "İlham Kaynağı",
    category: "Yaratıcılık & Sanat",
    runeNames: ["Kenaz", "Laguz"],
    synergy:
      "Kenaz'ın aydınlatıcı yaratıcı ateşi, Laguz'un sezgisel akışıyla derinleşiyor — sanatsal ilhamın önünü açan bir birleşim.",
  },
  {
    id: "strength",
    name: "Ham Güç",
    category: "Kuvvet & Dayanıklılık",
    runeNames: ["Uruz", "Thurisaz"],
    synergy:
      "Uruz'un yontulmamış yaşamsal gücü, Thurisaz'ın kırıp geçen kararlılığıyla katmerleşiyor — fiziksel ve zihinsel dayanıklılığın zirvesi.",
  },
];
