export interface IntentPreset {
  id: string;
  name: string;
  category: string;
  /** Which PRESET_GROUPS bucket this belongs to. */
  group: PresetGroupId;
  runeNames: string[];
  synergy: string;
}

export type PresetGroupId =
  | "koruma"
  | "is"
  | "ask"
  | "sifa"
  | "zihin"
  | "ev";

/** Display order of the preset groups. The list outgrew a flat grid at 33
 *  entries, so the designer renders one labelled block per group. */
export const PRESET_GROUPS: { id: PresetGroupId; label: string }[] = [
  { id: "koruma", label: "Koruma & Arınma" },
  { id: "is", label: "İş & Bolluk" },
  { id: "ask", label: "Aşk & İlişkiler" },
  { id: "sifa", label: "Şifa & Beden" },
  { id: "zihin", label: "Zihin & Yol" },
  { id: "ev", label: "Ev & Gündelik" },
];

export const INTENT_PRESETS: IntentPreset[] = [
  // ── Koruma & Arınma ────────────────────────────────────────────────
  {
    id: "protection",
    name: "Kuzey Muhafızı",
    category: "Koruma",
    group: "koruma",
    runeNames: ["Algiz", "Thurisaz"],
    synergy:
      "Algiz'in yukarı uzanan kalkanı, Thurisaz'ın aktif savunma gücüyle birleşiyor — sarsılmaz bir koruma kalkanı.",
  },
  {
    id: "evileye",
    name: "Ağır Enerji Çözücü",
    category: "Nazar & Arınma",
    group: "koruma",
    runeNames: ["Thurisaz", "Hagalaz", "Algiz"],
    synergy:
      "Hagalaz'ın dağıtıcı sarsıntısı ile Thurisaz'ın keskin savunması üzerinize yönelmiş ağır enerjiyi kırıyor, Algiz ise açılan boşluğu kapatıyor — çözme ve koruma aynı tılsımda.",
  },
  {
    id: "mirror",
    name: "Yansıma Mührü",
    category: "Ayna & Eşik",
    group: "koruma",
    runeNames: ["Isa", "Algiz", "Dagaz"],
    synergy:
      "Isa akışı donduruyor, Algiz geçişi kolluyor, Dagaz ise kalan enerjiyi dengeye çekiyor — aynalar ve eşikler gibi geçiş noktaları için bir mühür.",
  },
  {
    id: "childroom",
    name: "Yavru Kalkanı",
    category: "Çocuk Koruma",
    group: "koruma",
    runeNames: ["Algiz", "Othala"],
    synergy:
      "Algiz'in koruyucu kalkanı, Othala'nın hane ve soy bağıyla destekleniyor — çocuğun uyuduğu ve vakit geçirdiği alanı kollayan yumuşak ama sağlam bir koruma.",
  },
  {
    id: "animalguard",
    name: "Sadık Yoldaş",
    category: "Hayvan Koruma",
    group: "koruma",
    runeNames: ["Thurisaz", "Tiwaz", "Algiz", "Kenaz"],
    synergy:
      "Thurisaz ve Tiwaz dış tehlikeye karşı duruyor, Algiz kalkanı geriyor, Kenaz ise sertliği yumuşatıyor — evcil hayvanın güvenliği ve sakinliği için bir bileşim.",
  },
  {
    id: "travel",
    name: "Güvenli Rota",
    category: "Güvenli Seyahat",
    group: "koruma",
    runeNames: ["Raidho", "Algiz"],
    synergy:
      "Raidho'nun doğru yön bulma gücü, Algiz'in koruyucu kalkanıyla pekişiyor — yolculuk boyunca güvenliği gözeten bir işaret.",
  },

  // ── İş & Bolluk ────────────────────────────────────────────────────
  {
    id: "prosperity",
    name: "Bereketli Hasat",
    category: "Bolluk",
    group: "is",
    runeNames: ["Fehu", "Jera"],
    synergy:
      "Fehu'nun akan serveti, Jera'nın sabırlı döngüsel hasadıyla buluşuyor — sürdürülebilir bir bolluk.",
  },
  {
    id: "promotion",
    name: "Zirveye Çıkış",
    category: "Terfi & Yükseliş",
    group: "is",
    runeNames: ["Sowilo", "Fehu"],
    synergy:
      "Sowilo'nun zafer parlaklığı, Fehu'nun hak edilmiş kazanımıyla taçlanıyor — beklenen terfi veya yükseliş için bir ivme.",
  },
  {
    id: "jobsearch",
    name: "Kapı Açan Yol",
    category: "İş Bulma",
    group: "is",
    runeNames: ["Tiwaz", "Raidho", "Fehu", "Sowilo"],
    synergy:
      "Tiwaz niyeti keskinleştiriyor, Raidho yolu açıyor, Fehu karşılığı getiriyor, Sowilo ise görünür kılıyor — iş arayışını hızlandırmak için dörtlü bir dizilim.",
  },
  {
    id: "business",
    name: "Tüccarın Mührü",
    category: "Ticaret & Girişim",
    group: "is",
    runeNames: ["Sowilo", "Gebo", "Berkano", "Fehu"],
    synergy:
      "Sowilo başarıyı görünür kılarken Gebo alışverişi dengeliyor, Berkano büyümeyi besliyor, Fehu ise kazancı akıtıyor — girişim ve ticaret için bir bileşim.",
  },
  {
    id: "workplace",
    name: "Ocak Bekçisi",
    category: "İş Yeri Koruma",
    group: "is",
    runeNames: ["Othala", "Tiwaz", "Sowilo", "Mannaz"],
    synergy:
      "Othala mekânı sahipleniyor, Tiwaz düzeni koruyor, Sowilo işi ayakta tutuyor, Mannaz ise doğru insanları ve ortaklıkları çağırıyor.",
  },
  {
    id: "luck",
    name: "Şans Kapısı",
    category: "Şans & Uğur",
    group: "is",
    runeNames: ["Perthro", "Fehu"],
    synergy:
      "Perthro'nun beklenmedik kader oyunları, Fehu'nun bereketli akışıyla buluşuyor — kapıyı şansa ve kazanca aralayan bir işaret.",
  },

  // ── Aşk & İlişkiler ────────────────────────────────────────────────
  {
    id: "love",
    name: "Bağlılık Düğümü",
    category: "Aşk & Uyum",
    group: "ask",
    runeNames: ["Gebo", "Wunjo"],
    synergy:
      "Gebo'nun dengeli alışverişi, Wunjo'nun neşesiyle taçlanıyor — karşılıklı sevgi ve uyum.",
  },
  {
    id: "soulmate",
    name: "Ruh Eşi Çağrısı",
    category: "Ruh Eşi",
    group: "ask",
    runeNames: ["Kenaz", "Tiwaz", "Berkano", "Ingwaz"],
    synergy:
      "Kenaz görmek isteneni aydınlatıyor, Tiwaz niyeti sabitliyor, Berkano bağı besliyor, Ingwaz ise onu olgunlaşacağı sabra bırakıyor.",
  },
  {
    id: "grace",
    name: "Nazik Kalp",
    category: "Lütuf & Nezaket",
    group: "ask",
    runeNames: ["Gebo", "Sowilo"],
    synergy:
      "Gebo'nun karşılıksız cömertliği, Sowilo'nun sıcak ışığıyla yumuşuyor — çevrenize nezaket ve lütuf yayan bir duruş.",
  },
  {
    id: "communication",
    name: "Net Söz",
    category: "İletişim & İkna",
    group: "ask",
    runeNames: ["Ansuz", "Mannaz"],
    synergy:
      "Ansuz'un berrak ifadesi, Mannaz'ın insan ilişkilerini yönetme becerisiyle destekleniyor — ikna edici ve dürüst bir iletişim.",
  },

  // ── Şifa & Beden ───────────────────────────────────────────────────
  {
    id: "healing",
    name: "Yenilenme Kalkanı",
    category: "Şifa",
    group: "sifa",
    runeNames: ["Uruz", "Berkano"],
    synergy:
      "Uruz'un ham yaşamsal gücü, Berkano'nun yenileyici şefkatiyle destekleniyor — bedensel ve ruhsal iyileşme.",
  },
  {
    id: "pain",
    name: "Dinginlik Sargısı",
    category: "Rahatlama",
    group: "sifa",
    runeNames: ["Dagaz", "Ingwaz", "Berkano", "Laguz"],
    synergy:
      "Dagaz keskinliği kırıyor, Ingwaz onarımı sabırla sürdürüyor, Berkano dokuyu besliyor, Laguz ise gerginliği akıtıyor — fiziksel rahatsızlıkta rahatlama niyeti.",
  },
  {
    id: "fertility",
    name: "Tohum ve Su",
    category: "Doğurganlık",
    group: "sifa",
    runeNames: ["Berkano", "Ingwaz", "Laguz"],
    synergy:
      "Berkano'nun doğurgan şefkati, Ingwaz'ın içte olgunlaşan tohumuyla birleşiyor, Laguz ise akışı besliyor — bereket ve yeni yaşam niyeti.",
  },
  {
    id: "energy",
    name: "Yaşam Ateşi",
    category: "Enerji & Canlılık",
    group: "sifa",
    runeNames: ["Sowilo", "Uruz"],
    synergy:
      "Sowilo'nun parlayan zafer ışığı, Uruz'un fiziksel dayanıklılığıyla besleniyor — tükenmişlikten çıkışı hızlandıran canlı bir enerji.",
  },
  {
    id: "strength",
    name: "Ham Güç",
    category: "Dayanıklılık",
    group: "sifa",
    runeNames: ["Uruz", "Thurisaz"],
    synergy:
      "Uruz'un yontulmamış yaşamsal gücü, Thurisaz'ın kırıp geçen kararlılığıyla katmerleşiyor — fiziksel ve zihinsel dayanıklılığın zirvesi.",
  },
  {
    id: "grief",
    name: "Şafak Nefesi",
    category: "Yas & İyileşme",
    group: "sifa",
    runeNames: ["Dagaz", "Ingwaz"],
    synergy:
      "Dagaz'ın çığır açan farkındalığı, Ingwaz'ın sabırlı iç olgunlaşmasıyla yavaşlıyor — kaybın ardından gelen iyileşmeye nazik bir eşlik.",
  },

  // ── Zihin & Yol ────────────────────────────────────────────────────
  {
    id: "wisdom",
    name: "Meşale Bilgeliği",
    category: "Bilgelik & Netlik",
    group: "zihin",
    runeNames: ["Ansuz", "Kenaz"],
    synergy:
      "Ansuz'un ilahi rehberliği, Kenaz'ın aydınlatıcı meşalesiyle birleşiyor — net görüş ve doğru karar.",
  },
  {
    id: "exam",
    name: "Sakin Zihin",
    category: "Sınav & Mülakat",
    group: "zihin",
    runeNames: ["Ansuz", "Algiz", "Tiwaz"],
    synergy:
      "Ansuz'un akıcı ifadesi, Algiz'in koruyucu sakinliği ve Tiwaz'ın kararlılığıyla üçe katlanıyor — heyecanı dizginleyip net anlatan bir zihin.",
  },
  {
    id: "creativity",
    name: "İlham Kaynağı",
    category: "Yaratıcılık",
    group: "zihin",
    runeNames: ["Kenaz", "Laguz"],
    synergy:
      "Kenaz'ın aydınlatıcı yaratıcı ateşi, Laguz'un sezgisel akışıyla derinleşiyor — sanatsal ilhamın önünü açan bir birleşim.",
  },
  {
    id: "courage",
    name: "Savaşçı Ruhu",
    category: "Cesaret",
    group: "zihin",
    runeNames: ["Tiwaz", "Uruz"],
    synergy:
      "Tiwaz'ın kararlı adalet duygusu, Uruz'un ham yaşamsal gücüyle birleşiyor — zorluklar karşısında geri adım atmayan bir cesaret.",
  },
  {
    id: "newstart",
    name: "Açılan Yol",
    category: "Yeni Başlangıç",
    group: "zihin",
    runeNames: ["Ehwaz", "Fehu"],
    synergy:
      "Ehwaz'ın bağımsız ilerleyişi, Fehu'nun taze kazanım enerjisiyle destekleniyor — taşınma, iş değişimi ya da yeni bir sayfa için hız.",
  },
  {
    id: "sleep",
    name: "Ay Işığı Huzuru",
    category: "Uyku & Rüya",
    group: "zihin",
    runeNames: ["Laguz", "Ansuz"],
    synergy:
      "Laguz'un sezgisel akışı, Ansuz'un berrak mesajlarıyla yumuşuyor — huzurlu bir uyku ve hatırlanan rüyalar için bir denge.",
  },

  // ── Ev & Gündelik ──────────────────────────────────────────────────
  {
    id: "home",
    name: "Eşik Muhafızı",
    category: "Ev & Aile",
    group: "ev",
    runeNames: ["Othala", "Algiz"],
    synergy:
      "Othala'nın ata topraklarını koruyan gücü, Algiz'in kalkanıyla pekişiyor — evin ve hanenin bütününü kollayan bir mühür.",
  },
  {
    id: "lostfound",
    name: "Geri Dönüş Yolu",
    category: "Kayıp Bulma",
    group: "ev",
    runeNames: ["Raidho", "Tiwaz"],
    synergy:
      "Raidho'nun yön bulma gücü, Tiwaz'ın kararlı doğrultusuyla birleşiyor — kaybolanın geri dönüş yolunu açan bir işaret.",
  },
  {
    id: "blockage",
    name: "Kilit Açan",
    category: "Blokaj Açma",
    group: "ev",
    runeNames: ["Perthro", "Uruz"],
    synergy:
      "Perthro örtülü olanı görünür kılıyor, Uruz ise onu kırıp geçecek gücü veriyor — nedenini bilmediğiniz bir tıkanıklığı çözmeye yönelik ikili.",
  },
  {
    id: "balance",
    name: "Terazi Düğümü",
    category: "Alma & Verme",
    group: "ev",
    runeNames: ["Gebo", "Wunjo", "Tiwaz", "Othala"],
    synergy:
      "Gebo alışverişi eşitliyor, Wunjo hoşnutluğu getiriyor, Tiwaz sınırı çiziyor, Othala ise kalanı koruyor — hep verip karşılığını alamayanlar için bir denge.",
  },
  {
    id: "chakra",
    name: "Merkez Hizası",
    category: "İç Denge",
    group: "ev",
    runeNames: ["Fehu", "Uruz", "Ingwaz"],
    synergy:
      "Fehu enerjiyi harekete geçiriyor, Uruz onu topraklıyor, Ingwaz ise merkeze oturtuyor — dağılmış hissettiğinizde toparlayıcı bir üçlü.",
  },
];
