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
