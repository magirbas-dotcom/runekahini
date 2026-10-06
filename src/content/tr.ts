import type { ContentData } from "./types";

// Türkçe içerik. Metinler web sürümünün (rune-oracle) veri dosyalarından
// birebir taşındı; değiştirirken iki sürümü birlikte güncelle.
const tr: ContentData = {
  "aettNames": {
    "1": "Freyr & Freyja Ailesi",
    "2": "Heimdall Ailesi",
    "3": "Tyr Ailesi"
  },
  "runes": {
    "Fehu": {
      "literalMeaning": "Evcil Sığır / Servet",
      "practicalNote": "Yeni bir kazanımı başlatmak kadar, eldekini korumak için de düşünülür — ateşli/gerilimli dönemlerde değil, tükenmişlik sonrası toparlanmada tercih edilir.",
      "lifePath": "Emeğini bereket hâline getirme gücün var; elindekini paylaştıkça çoğalan bir enerji taşıyorsun.",
      "bond": "İlişkiye cömertlik getirir; paylaşmakta, hissetmekte ve vermekte eli açıktır.",
      "upright": {
        "keywords": [
          "bolluk",
          "servet",
          "hak edilmiş ödül"
        ],
        "general": "Emeğinizin karşılığını almanın, hatta bazen beklediğinizden fazlasını kazanmanın zamanı. Bu bolluk sizinle sınırlı kalmamalı — Fehu'nun enerjisi durağan değil akışkandır ve paylaştıkça çoğalır. Elinizdeki kaynakları hem koruyup hem de bilinçli şekilde büyütmeniz için uygun bir dönemdesiniz.",
        "love": "İlişkinizde güven, istikrar ve maddi/manevi bolluk hissi öne çıkıyor. Ortak biriktirdiğiniz değerler — ister maddi ister duygusal — artık meyvesini vermeye başlıyor. Cömertçe vermek, karşılığında daha derin bir bağ kurmanızı sağlayacak.",
        "career": "Attığınız adımlar somut, ölçülebilir bir karşılık buluyor — beklenen bir terfi, yeni bir gelir kapısı ya da bir girişimin nihayet meyve vermesi söz konusu olabilir. Bu, şansa değil disipline dayalı bir kazanım; harcadığınız emeğin doğal sonucu. Fırsatı değerlendirmek için doğru zamandasınız."
      },
      "reversed": {
        "keywords": [
          "kayıp",
          "açgözlülük",
          "mali istikrarsızlık"
        ],
        "general": "Akması gereken bir şey tıkanmış durumda — kaynaklar, fikirler ya da fırsatlar bir yerde sıkışıp kalmış. Bu dönemde açgözlülük veya aşırı kontrolcü bir tutum, elinizdekini korumak yerine daha da kaybetmenize yol açabilir. Sıkı tutmak yerine gevşetmek, akışı yeniden başlatmanın anahtarı.",
        "love": "Para, kaynaklar ya da emek paylaşımı konusunda ilişkinizde gerilim yaşanabilir. Biri fazla cömert, diğeri fazla temkinli davranıyor olabilir — bu dengesizlik konuşulmadıkça büyüyor. Açık bir hesaplaşma, güveni yeniden inşa etmenin ilk adımı.",
        "career": "Bir yatırımın veya projenin beklenen zamanda sonuç vermemesi sizi hayal kırıklığına uğratabilir. Kaynaklarınızı verimsiz alanlara harcamış olabilirsiniz; şimdi bütçenizi ve önceliklerinizi gözden geçirme zamanı. Sabırla yeniden planlamak, kaybı telafi etmenin en sağlıklı yolu."
      }
    },
    "Uruz": {
      "literalMeaning": "Yaban Öküzü (Aurochs)",
      "practicalNote": "Öz güven kaybı ve tükenmişlik sonrası toparlanmada güçlendirici bir destektir; hem kadınsı hem eril duruşu dengelemeye yardımcı olduğu düşünülür.",
      "lifePath": "Özünde ham bir güç ve dayanıklılık var; zorlukları iradenle ve sebatınla aşan birisin.",
      "bond": "Fiziksel çekim, canlı bir tutku ve kolay sarsılmayan bir bağlılık taşır.",
      "upright": {
        "keywords": [
          "güç",
          "dayanıklılık",
          "cesaret"
        ],
        "general": "Bedeninizde ve ruhunuzda ham, yontulmamış bir güç uyanıyor — tıpkı evcilleştirilemeyen yaban öküzü gibi. Bu enerji sizi kaçınılmaz bir değişime doğru itiyor; direnmek yerine kucaklamanız gereken doğal bir dönüşüm süreci bu. Fiziksel dayanıklılığınız ve iradeniz, önünüzdeki her engeli aşmaya yetecek kadar güçlü.",
        "love": "İlişkinizde güçlü bir fiziksel çekim ve tutku hakim — birbirinizi hem bedenen hem ruhen besleyen, canlı bir enerji akışı var. Bu, yüzeysel değil köklü bir bağ; zorluklar karşısında birbirinizi daha da güçlendiren bir dinamik. Cesaretle ilerlemek, bağınızı derinleştirecek.",
        "career": "Önünüzdeki zorluklar sizi yıldırmak yerine güçlendiriyor. Başkalarının vazgeçtiği yerde siz devam edecek dayanıklılığa ve cesarete sahipsiniz. Bu dönem, iddialı bir projeyi sonuna kadar götürmek ya da zorlu bir müzakereye girmek için elverişli."
      },
      "reversed": {
        "keywords": [
          "güçsüzlük",
          "irade kaybı",
          "kaçırılan fırsat"
        ],
        "general": "Her zamanki gücünüzü ve kararlılığınızı hissetmiyor olabilirsiniz — yorgunluk, tükenmişlik ya da irade kaybı kendini gösteriyor. Enerjiniz yanlış yöne akıyor ya da bir yerde tıkanmış durumda. Kendinize dinlenme ve toparlanma alanı tanımak, gücünüzü yeniden bulmanın ilk adımı.",
        "love": "İlişkide kim daha güçlü, kim haklı sorusu etrafında dönen bir güç mücadelesi yaşanıyor olabilir. Ego, sevgiden daha yüksek sesle konuşuyor. Karşılıklı esneklik göstermeden bu tıkanıklığın çözülmesi zor.",
        "career": "Motivasyonunuz her zamanki kadar yüksek değil ve bu, fırsatları kaçırmanıza neden olabilir. Bir liderlik pozisyonunda kararsızlık ya da özgüven eksikliği hissediyor olabilirsiniz. Küçük, somut adımlarla yeniden ivme kazanmak mümkün."
      }
    },
    "Thurisaz": {
      "literalMeaning": "Dev / Diken / Thor'un Çekici",
      "practicalNote": "Gücü yoğun bir Rune'dir, dikkatli kullanılmalıdır; kaçmak yerine zor bir gerçekle cepheden yüzleşme cesareti verdiğine inanılır.",
      "lifePath": "Sınırlarını koruyan, gerektiğinde engeli kırıp yol açan bir cesaret taşıyorsun.",
      "bond": "İlişkinin sınırlarını korur; gerektiğinde ikisini dış dünyaya karşı savunur.",
      "upright": {
        "keywords": [
          "koruma",
          "savunma",
          "ani şans"
        ],
        "general": "Thor'un çekici gibi, önünüzdeki engelleri kırıp geçecek yoğun bir güç elinizde. Bu enerji hem koruyucu hem de aktif bir savunma niteliği taşıyor — kendinizi ve değerlerinizi korumak için harekete geçme zamanı. Dikkatli ama kararlı kullanıldığında, en zorlu engelleri bile aşmanıza yardımcı olur.",
        "love": "İlişkinizi dıştan gelen tehditlere ya da içten büyüyen sorunlara karşı koruyacak güçlü bir kalkan devrede. Ancak bu koruma, kaçınmakla değil cesurca yüzleşmekle sağlanıyor — sorunları açıkça konuşmaktan çekinmeyin. Zor bir gerçeği söylemek, ilişkiyi güçlendirecek.",
        "career": "Kariyerinizde karşınıza çıkan engellere karşı pasif kalmak yerine aktif bir duruş sergilemeniz gerekiyor. Rakiplerinizi geride bırakacak kararlılık ve cesaret sizde mevcut. Zor bir konuşmayı ya da müzakereyi ertelemeyin — doğrudan yüzleşmek en iyi sonucu verecek."
      },
      "reversed": {
        "keywords": [
          "savunmasızlık",
          "aceleci kararlar",
          "gizli tehlike"
        ],
        "general": "Ya kendinizi savunmasız hissediyorsunuz ya da tam tersine, öfkeniz kontrolden çıkıyor. Bu ikisi arasındaki denge bozulmuş durumda — aceleci bir kararla durumu daha da kötüleştirme riski var. Kurban rolüne sığınmak yerine, gücünüzü bilinçli şekilde geri almanın yollarını arayın.",
        "love": "Küçük bir tartışma beklenmedik şekilde büyüyebilir; öfke kontrolsüzce patlak veriyor olabilir. Kıskançlık ya da aşırı korumacı bir tavır, güveni zedeleme riski taşıyor. Soğukkanlılıkla durup nefes almak, durumu tersine çevirebilir.",
        "career": "Anlık öfkeyle alınan bir karar, iş hayatınızda kalıcı bir zarara yol açabilir. İş arkadaşlarınızla gereksiz bir çatışmaya girme riski var — önce sakinleşip sonra harekete geçmek çok daha isabetli olacak."
      }
    },
    "Ansuz": {
      "literalMeaning": "Ağız / Odin / İlahi Nefes",
      "practicalNote": "Sınav kaygısı, kekemelik ve topluluk önünde konuşma korkusunda rahatlatıcı olduğu düşünülür; önemli bir konuşma ya da sınav öncesi zihinde canlandırılabilir.",
      "lifePath": "Sözün ve sezgin güçlü; doğru kelimeyi bulmak ve bildiğini aktarmak senin yolun.",
      "bond": "Açık ve derin konuşmalarla bağ kurar; anlaşılmak onun için sevginin dilidir.",
      "upright": {
        "keywords": [
          "bilgelik",
          "iletişim",
          "ilham"
        ],
        "general": "Kelimeler bu dönemde her zamankinden daha güçlü — hem söyleyecekleriniz hem de duyacaklarınız kaderinizi şekillendirecek. Bilge bir kişiden gelecek bir tavsiyeye ya da kendi iç sesinize kulak verin. Zihniniz olağanüstü bir berraklıkla çalışıyor, karmaşık bir konuyu çözecek ilham bu günlerde gelebilir.",
        "love": "Partnerinizle uzun süredir erteleniyor olabilecek dürüst bir konuşmanın tam zamanı. Zihinsel uyumunuz güçlü — birbirinizi gerçekten anlıyorsunuz ve bu anlayış sözlere döküldükçe daha da derinleşiyor. Açık iletişim, bu dönemin en değerli armağanı.",
        "career": "Konuşma ve ikna yeteneğiniz zirvede — önemli bir sunum, görüşme ya da anlaşma için ideal bir dönemdesiniz. Fikirlerinizi net bir şekilde ifade etmeniz, karşınızdakini kolayca ikna etmenizi sağlayacak. Sesinizi duyurmaktan çekinmeyin."
      },
      "reversed": {
        "keywords": [
          "iletişimsizlik",
          "manipülasyon",
          "kötü tavsiye"
        ],
        "general": "Aranızdaki iletişim kanalı bulanıklaşmış olabilir — söylenenler yanlış anlaşılıyor ya da hiç söylenmiyor. Birinin size kötü niyetle tavsiye verdiğinden veya bir bilgiyi çarpıttığından şüpheleniyor olabilirsiniz. Bu dönemde duyduklarınızı sorgulamak, kendi sezginize güvenmek kadar önemli.",
        "love": "İlişkinizde söylenmeyen, saklanan bir şeyler olabilir. Yanlış anlaşılmalar büyümeden önce masaya yatırılmalı — sessizlik bu dönemde çözüm değil, sorunun kendisi. Birinin sözlerini manipülatif bir amaçla kullandığını fark ederseniz, mesafe koymaktan çekinmeyin.",
        "career": "İş yerinde size ulaşan bilgi tam ya da doğru olmayabilir; dedikodular gerçeklerin önüne geçebilir. Önemli bir karar vermeden önce bilgiyi doğrulamak, sizi büyük bir hayal kırıklığından koruyacak."
      }
    },
    "Raidho": {
      "literalMeaning": "At Arabası / Yolculuk",
      "practicalNote": "Yolculuk güvenliğiyle ilişkilendirilir; kaybolan bir eşyanın ya da kişinin geri dönüşünü desteklediğine inanılır.",
      "lifePath": "Hayatın bir yolculuk gibi akıyor; kendi ritmini bulduğunda her adımın anlam kazanıyor.",
      "bond": "Hayatta birlikte yol almayı sever; ortak hedeflere aynı ritimle yürümek ister.",
      "upright": {
        "keywords": [
          "yolculuk",
          "hareket",
          "doğru eylem"
        ],
        "general": "Hayat yolculuğunuzda doğru ritmi yakalamış durumdasınız — ne çok hızlı ne çok yavaş, tam kendi temponuzda ilerliyorsunuz. Bu, fiziksel bir seyahat olabileceği gibi içsel bir yolculuk da olabilir. Önemli olan, yönünüzden emin adımlarla devam etmeniz.",
        "love": "Siz ve partneriniz aynı yöne, aynı hızda ilerliyorsunuz — bu nadir bulunan bir uyum. Ortak bir hedefe doğru birlikte yol almak, bağınızı güçlendiren en önemli unsur. Bu ritmi koruduğunuz sürece ilişkiniz sağlıklı şekilde büyümeye devam edecek.",
        "career": "Bir iş seyahati, şehir/pozisyon değişikliği ya da uzun süredir planladığınız bir projenin nihayet yola çıkması gündemde olabilir. Her şey planladığınız zaman çizelgesine uygun şekilde ilerliyor. Bu doğru ritmi bozmadan devam etmek, başarıyı garantileyecek."
      },
      "reversed": {
        "keywords": [
          "durgunluk",
          "yanlış yön",
          "gecikme"
        ],
        "general": "Bir yerlere varmak istiyorsunuz ama önünüze sürekli engeller çıkıyor gibi hissediyorsunuz. Ritminiz bozulmuş — ya çok hızlı gidip tükeniyorsunuz ya da bir türlü harekete geçemiyorsunuz. Sabır göstermek ve doğru zamanı beklemek, şu an zorlamaktan daha akıllıca.",
        "love": "İlişkinizde bir durgunluk, tekrar eden bir monotonluk hissi olabilir. Belki de siz ve partneriniz artık farklı hızlarda ilerliyorsunuz — bu farkı görmezden gelmek yerine açıkça konuşmak gerekiyor.",
        "career": "Planladığınız bir seyahat, toplantı ya da proje son anda aksayabilir. Bu gecikmeler sinir bozucu olsa da, genellikle daha büyük bir sorunu önlemek için bir fırsat sunar. Esnek kalmak, hayal kırıklığını azaltacak."
      }
    },
    "Kenaz": {
      "literalMeaning": "Meşale / Kontrollü Ateş",
      "practicalNote": "Gizli kalmış bir yeteneği ya da bilgiyi yüzeye çıkardığına inanılır; yeni bir hobiye başlarken veya saklı bir beceriyi harekete geçirmek isteyenler için uygun görülür.",
      "lifePath": "İçinde yanan bir meşale var; öğrenerek ve üreterek karanlığı aydınlatan birisin.",
      "bond": "İlişkiye kıvılcım ve yaratıcılık katar; ikisine de ilham veren bir sevgi arar.",
      "upright": {
        "keywords": [
          "aydınlanma",
          "yaratıcılık",
          "zanaat"
        ],
        "general": "İçinizdeki yaratıcı meşale yeniden alevleniyor — uzun süredir bastırılmış bir yetenek ya da fikir şimdi yüzeye çıkmaya hazır. Bu ışık hem sizi hem çevrenizdekileri aydınlatacak nitelikte; bir zanaatta ustalaşmak ya da şifa vermek için elinizden gelenin en iyisini ortaya koyabileceğiniz bir dönem.",
        "love": "İlişkinizde sönmüş sanılan bir kıvılcım yeniden alevleniyor. Birlikte yaratıcı bir şeyler üretmek — bir proje, bir anı, bir gelenek — bağınızı tazeleyecek. Romantizm bu dönemde yapay değil, içten ve derin.",
        "career": "Zihninizde uzun süredir olgunlaşan bir fikir artık hayata geçmeye hazır. Yaratıcılık gerektiren bir projede parlama, uzmanlığınızı sergileme fırsatı elinizde. Cesaretle paylaştığınız bir fikir, beklenmedik bir kapı açabilir."
      },
      "reversed": {
        "keywords": [
          "yaratıcı blokaj",
          "kafa karışıklığı",
          "tükenmişlik"
        ],
        "general": "Bir zamanlar parlak olan bir fikir ya da tutku şimdi sönükleşmiş durumda. Yaratıcı bir tıkanıklık yaşıyor, zihniniz net düşünemiyor olabilir. Bazı şeylerin doğal ömrünü tamamladığını kabul etmek, yeni bir ışığa yer açacak.",
        "love": "İlişkinizdeki ateş bir süredir sönük yanıyor — heyecan, ilk günlerdeki gibi değil. Bu, ilişkinin bittiği anlamına gelmez ama görmezden gelinmemesi gereken bir uyarı. Yeniden bağlanmak için ortak bir çaba gerekiyor.",
        "career": "Bir süredir tükenmişlik hissediyor, işinizden eskisi kadar ilham alamıyor olabilirsiniz. Yarım kalan projeler zihninizde ağırlık yapıyor. Dinlenmeye ve yeniden ilham bulmaya izin vermek, üretkenliğinize geri dönmenin ilk adımı."
      }
    },
    "Gebo": {
      "literalMeaning": "Hediye / Ortaklık",
      "practicalNote": "Karşılıklılığı öne çıkarır; iş ortaklıklarında ve adil paylaşım gerektiren anlaşmalarda güçlü bir destek olarak anılır.",
      "lifePath": "Vermek ile almak arasındaki dengede güçleniyorsun; kurduğun bağlar en büyük armağanın.",
      "bond": "Vermek ile almak arasındaki dengeyi gözetir; ortaklığın kendisi onun armağanıdır.",
      "upright": {
        "keywords": [
          "hediye",
          "ortaklık",
          "denge"
        ],
        "general": "Vermek ve almak arasında nadir görülen güzellikte bir denge kuruluyor. Bu, çıkarcı bir alışveriş değil, karşılıklı saygıya dayanan kutsal bir ortaklık. Cömertçe verdiğiniz, aynı cömertlikle size geri dönüyor — bu döngüyü bozmadan sürdürmek bereketi büyütecek.",
        "love": "İlişkinizde nadir bulunan bir denge var: ikiniz de eşit ölçüde veriyor, eşit ölçüde alıyorsunuz. Bu karşılıklılık, sevginin en sağlıklı hâli — ne biri diğerine bağımlı ne de biri diğerinden fazla fedakarlık ediyor. Bu dengeyi koruduğunuz sürece bağınız sağlamlaşmaya devam edecek.",
        "career": "Bir iş ortaklığı ya da sözleşme, her iki taraf için de adil şartlarla sonuçlanıyor. Ortak bir projede katkınız hakkıyla takdir ediliyor. Bu, uzun vadeli ve güvene dayalı bir işbirliğinin temellerini atmak için ideal bir zaman."
      }
    },
    "Wunjo": {
      "literalMeaning": "Neşe / Uyum",
      "practicalNote": "Gergin bir anda ortamı yumuşatmak için zihinde çağrılabileceği söylenir; ev huzurunu ve durgun/depresif dönemlerden çıkışı desteklediğine inanılır.",
      "lifePath": "Uyumu ve sevinci çevrene yayma yeteneğin var; içindeki huzur başkalarına da iyi geliyor.",
      "bond": "Birlikte gülmeyi, evdeki huzuru ve paylaşılan küçük sevinçleri büyütür.",
      "upright": {
        "keywords": [
          "sevinç",
          "uyum",
          "tamamlanma"
        ],
        "general": "Uzun süredir beklediğiniz bir mutluluk artık kapınızda. İçsel huzurunuz, çevrenizdeki insanlarla kurduğunuz uyuma da yansıyor. Bu, geçici bir keyif değil — emek verdiğiniz bir şeyin nihayet meyvesini vermesinden doğan, kalıcı bir doyum hissi.",
        "love": "İlişkinizde nadir rastlanan bir hafiflik ve uyum var — birlikte gülmek, kolayca anlaşmak, sıradan anları bile keyifli kılmak. Aile içi huzur da bu dönemde belirgin şekilde artıyor. Bu mutluluğun kıymetini bilip beslemeye devam edin.",
        "career": "Uzun zamandır üzerinde çalıştığınız bir hedefe ulaşmanın kutlamasını yapma zamanı geldi. İş ortamınız da bu dönemde daha huzurlu ve keyifli — ekip içi uyum artıyor. Bu olumlu havayı yeni projelere de taşıyabilirsiniz."
      },
      "reversed": {
        "keywords": [
          "yalnızlık",
          "melankoli",
          "gecikmiş mutluluk"
        ],
        "general": "Etrafınız kalabalık olsa bile içten içe bir yalnızlık, bir yabancılaşma hissi taşıyor olabilirsiniz. Beklediğiniz mutluluk gecikiyor gibi görünse de yok olmuş değil — sadece zamanlaması sizin elinizde değil. Bu dönemde kendinize şefkat göstermek, melankoliyi hafifletecek.",
        "love": "İlişkinizde geçici bir soğukluk, bir anlaşılamama hissi var. Beklentileriniz karşılanmıyor gibi hissedebilirsiniz ama bu durum kalıcı değil — açık konuşmak, kaybolan sıcaklığı geri getirebilir.",
        "career": "Ekip içinde beklenmedik bir gerginlik ya da uyumsuzluk baş gösterebilir. Hedeflediğiniz sonuca ulaşmanız planladığınızdan daha uzun sürebilir. Sabırlı kalmak ve iletişimi açık tutmak, huzuru geri kazanmanın anahtarı."
      }
    },
    "Hagalaz": {
      "literalMeaning": "Dolu Yağışı",
      "practicalNote": "En yoğun ve zorlayıcı Rune'lerden biri kabul edilir — ani ama arındırıcı bir dönüşümü temsil eder; sürekli taşınması değil, kısa süreli ve bilinçli çalışmalarda kullanılması önerilir.",
      "lifePath": "Sarsıntılardan yılmadan geçip arınarak güçlenen birisin; fırtınalar seni yeniden kuruyor.",
      "bond": "Zor zamanlarda kaçmaz; krizleri birlikte aşıp bağı güçlendirir.",
      "upright": {
        "keywords": [
          "yıkım",
          "sınama",
          "doğa gücü"
        ],
        "general": "Kontrolünüz dışında, doğa olayları gibi kaçınılmaz bir kriz kapınızı çalıyor olabilir. Ama unutmayın: bu bir dolu fırtınası gibi yıkıcı görünse de, aslında miadını doldurmuş olanı temizleyen arındırıcı bir güç. Fırtınanın ardından gelen berraklık, şu anki sarsıntıya değecek.",
        "love": "İlişkinizin altında uzun süredir biriken bir gerilim ya da söylenmemiş bir gerçek şimdi yüzeye çıkabilir. Bu sarsıntı acı verici olsa da, sağlıksız kalıpları kırıp daha dürüst bir zemine geçmenizi sağlayacak. Direnmek yerine dönüşüme izin vermek, uzun vadede iyileştirici olacak.",
        "career": "İş hayatınızda beklenmedik, kontrolünüz dışında bir değişiklik yaşanabilir — bir organizasyonel kriz ya da ani bir karar sizi hazırlıksız yakalayabilir. Bu sarsıntı, aslında köhnemiş yapıların yenilenmesi için gerekli bir adım. Esnek kalmak, bu geçişten güçlenerek çıkmanızı sağlayacak."
      }
    },
    "Nauthiz": {
      "literalMeaning": "İhtiyaç / Kısıtlama",
      "practicalNote": "Aktif olarak 'üzerinde çalışılan' değil, çoğunlukla bir okumada 'bekle ve gözlemle' sinyali olarak yorumlanan bir Rune olarak öne çıkar.",
      "lifePath": "Gücünü ihtiyaçtan ve sabırdan alıyorsun; zor zamanlar dayanıklılığını ortaya çıkarıyor.",
      "bond": "Sabırlı bir destektir; ihtiyaç anında yanında durmayı bilir.",
      "upright": {
        "keywords": [
          "ihtiyaç",
          "kısıtlama",
          "sabır"
        ],
        "general": "Hareket alanınız daralmış, bir şeylerden mahrum kaldığınızı hissediyor olabilirsiniz. Ama tıpkı ateş yakmak için birbirine sürtülen iki kuru odun gibi, bu sürtünme ve kısıtlama sizi güçlendiriyor. Şu an mücadele etmek yerine sabırla ders çıkarmak, gizli gücünüzü ortaya çıkaracak.",
        "love": "İlişkinizde ikinizin de hissettiği bir kısıtlama, bir zorluk dönemi var — belki maddi, belki zamansal. Bu dönem kolay değil ama birlikte sabırla göğüslediğinizde bağınızı sınayıp güçlendirecek bir fırsat da barındırıyor.",
        "career": "Elinizdeki kaynaklar, isteğinizden daha kısıtlı olabilir — az bütçeyle, sınırlı imkanlarla çalışmanız gerekebilir. Bu zorlu bir dönem olsa da, yaratıcılığınızı ve dayanıklılığınızı geliştiren değerli bir sınav. Kısıtlamayı bir engel değil, bir disiplin alıştırması olarak görün."
      }
    },
    "Isa": {
      "literalMeaning": "Buz",
      "practicalNote": "Bir tür 'acil fren' Rune'si olarak anılır; ani bir sancıyı, ateşi veya istenmeyen bir gidişatı geçici olarak yavaşlatmak için düşünülür — sürekli taşınmaz.",
      "lifePath": "Durup berraklaşmayı bilen bir odak taşıyorsun; sakinliğin, kararlarının en sağlam zemini.",
      "bond": "Alan tanımayı bilir; sakinliği ilişkiye duygusal bir denge getirir.",
      "upright": {
        "keywords": [
          "durgunluk",
          "buz",
          "iç gözlem"
        ],
        "general": "Her şey donmuş, hareketsiz gibi görünüyor — ama bu bir sona işaret değil, bilinçli bir bekleme hâli. Şu an harekete geçmek yerine gözlemlemek, mevcut durumu olduğu gibi korumak en akıllıca yaklaşım. Sessizlik içinde netlik kazanacaksınız.",
        "love": "İlişkinizde bir soğukluk, bir mesafe hissi olabilir — ama bu kalıcı bir kopuş değil, geçici bir duraklama. İkiniz de bu dönemde kendi içinize dönüp düşünme ihtiyacı duyabilirsiniz. Zorlamadan, sürecin kendi hızında ilerlemesine izin verin.",
        "career": "Bir proje beklemede kalabilir, kariyerinizde ilerleme durmuş gibi hissedebilirsiniz. Bu, harekete geçmenin değil durup değerlendirme yapmanın zamanı. Aceleyle karar vermek yerine mevcut durumu net bir şekilde analiz edin."
      }
    },
    "Jera": {
      "literalMeaning": "Yıl / Hasat",
      "practicalNote": "Sabırla beklenen sonuçları, özellikle doğa ve emekle ilgili çabaların (bahçe, hayvan, uzun soluklu projeler) meyvesini simgelediğine inanılır.",
      "lifePath": "Sabırla ektiğini zamanı gelince biçen birisin; döngülere güvenmek senin bilgeliğin.",
      "bond": "Sevgiyi zamanla olgunlaştırır; sabırla emek verilen bağın meyvesini toplar.",
      "upright": {
        "keywords": [
          "hasat",
          "döngü",
          "ödül"
        ],
        "general": "Uzun zaman önce ektiğiniz tohumlar artık hasat vermeye hazır. Bu, aceleyle elde edilen bir kazanç değil — doğal döngüsünü tamamlamış, hak edilmiş bir ödül. Sabrınız ve tutarlılığınız şimdi somut bir karşılık buluyor.",
        "love": "İlişkinize yatırdığınız zaman ve emek, kalıcı bir bağlılığa dönüşme aşamasında — evlilik, birlikte yaşama ya da köklü bir taahhüt gündeme gelebilir. Bu, aceleyle değil doğal bir olgunlaşmayla gelen bir dönüm noktası.",
        "career": "Yaptığınız yatırımlar ve giriştiğiniz projeler artık kâra dönüşmeye başlıyor. Bu başarı şansa değil, sürdürdüğünüz disipline dayanıyor. Hasat mevsiminin tadını çıkarın — ama yeni bir döngü için tohum atmayı da ihmal etmeyin."
      }
    },
    "Eihwaz": {
      "literalMeaning": "Porsuk Ağacı (Yew)",
      "practicalNote": "Zaten elde edilmiş bir kazanımı korumaya ve yarım kalan bir işi tamamlamaya destek olduğu, ilişkilerde bağı güçlendirdiği düşünülür.",
      "lifePath": "Esneyip kırılmayan bir omurgan var; dönüşümlerden köklerini kaybetmeden geçiyorsun.",
      "bond": "Derin bir sadakat taşır; esneyip kırılmayan bir bağ kurar.",
      "upright": {
        "keywords": [
          "dayanıklılık",
          "dönüşüm",
          "hayat ağacı"
        ],
        "general": "Porsuk ağacı gibi hem uzun ömürlü hem de koruyucu bir güce sahipsiniz; kolay kolay yıkılmayacak bir dayanıklılık taşıyorsunuz içinizde. Bu dönem, köklerinize inip gerçek bir içsel dönüşüm yaşamanız için elverişli. Bir kapı kapanırken, çok daha sağlam bir temel üzerine yenisi açılıyor.",
        "love": "İlişkiniz bir sınavdan geçmiş ve bu sınav, bağınızı kırmak yerine köklendirmiş. Artık aranızdaki bağlılık, yüzeysel değil derinlerde, sarsılmaz bir yerde. Bu dayanıklılık, gelecekteki zorlukları da birlikte aşmanızı sağlayacak.",
        "career": "Karşınıza çıkan zorlu bir proje ya da uzun soluklu bir hedef, sandığınızdan daha fazla dayanıklılığa sahip olduğunuzu kanıtlayacak. Yarım kalmış bir işi tamamlamak için gereken köklü gücü kendinizde bulacaksınız."
      }
    },
    "Perthro": {
      "literalMeaning": "Zar Kupası / Sır / Kader",
      "practicalNote": "Nadir rastlanan bir gizlilik Rune'si olarak tarif edilir; göze görünmeden hareket etmek istenen dönemlerde ve geçmişten gelen örüntüleri anlamlandırma çalışmalarında akla gelir.",
      "lifePath": "Hayatın gizemleriyle barışık birisin; bilinmeyene açık kalmak sana yeni kapılar açıyor.",
      "bond": "İlişkiye gizem ve derin bir ruhsal çekim katar; kaderin sürprizlerine açıktır.",
      "upright": {
        "keywords": [
          "gizem",
          "şans",
          "sezgi"
        ],
        "general": "Görünenin ardında, henüz kelimelere dökülmemiş bir gizem dönüyor. Kaderin çarkları sizin bilginiz dışında işliyor olabilir ama sezgileriniz size doğru yolu fısıldıyor. Saklı bir gerçek, beklenmedik bir anda kendini gösterebilir — hazır olun.",
        "love": "Partnerinizde daha önce fark etmediğiniz bir yön keşfedebilirsiniz — bu sürpriz, ilişkinize yeni bir derinlik katacak. Beklenmedik, şanslı bir gelişme de kapıda olabilir. Merakınızı canlı tutun, cevaplar zamanı geldiğinde kendiliğinden gelecek.",
        "career": "Hiç ummadığınız bir yerden gelen bir teklif ya da fırsat kariyerinizde yeni bir kapı açabilir. Bu dönemde mantık kadar sezgilerinize de güvenmeniz gerekecek — bazı kararlar veriyle değil, içgüdüyle alınır."
      },
      "reversed": {
        "keywords": [
          "hayal kırıklığı",
          "sırların ifşası",
          "kaçırılan şans"
        ],
        "general": "Saklı kalması gereken bir sır beklenmedik şekilde açığa çıkabilir ve bu hayal kırıklığına yol açabilir. Tekrar eden, sizi geriye çeken bir döngüden kurtulma zamanı gelmiş olabilir. Bir fırsatı kaçırmış olsanız da, bu son fırsat değil.",
        "love": "İlişkinizde saklı tutulan bir gerçek ortaya çıkabilir ve bu sarsıcı olabilir. Geçmişe fazla takılı kalmak, bugünü yaşamanızı engelliyor olabilir. İyileşme, gerçeği kabullenmekle başlar.",
        "career": "Bir yatırımın ya da kararın risklerini yeterince değerlendirmemiş olabilirsiniz. Plansız harcamalar veya aceleyle alınan kararlar hayal kırıklığına yol açabilir. Bundan sonraki adımlarınızı daha temkinli atmakta fayda var."
      }
    },
    "Algiz": {
      "literalMeaning": "Sığın / Koruyucu Kalkan",
      "practicalNote": "En sık başvurulan koruma Rune'lerinden biridir; çocuğun odasından sınav stresine kadar geniş bir koruma yelpazesinde kullanıldığı söylenir.",
      "lifePath": "Kendini ve sevdiklerini koruyan güçlü bir sezgin var; içindeki ses sana yol gösteriyor.",
      "bond": "Sevdiğini korur; ilişkiyi dış etkilere karşı saran bir kalkan gibidir.",
      "upright": {
        "keywords": [
          "koruma",
          "sezgi",
          "sınır koyma"
        ],
        "general": "Görünmeyen bir koruma kalkanı sizi kuşatıyor — tehlikelerden sezgisel olarak haberdar oluyor, doğru anda doğru tarafa yöneliyorsunuz. Bu dönem, kendinize sağlıklı sınırlar koymanın ve neye 'hayır' diyeceğinizi netleştirmenin tam zamanı. Sezgileriniz size yol gösteriyor, onları dinleyin.",
        "love": "İlişkinizde karşılıklı bir koruma ve güven hissi var — biriniz zor bir dönemden geçerken diğeri doğal bir kalkan oluyor. Bu, ruhsal olarak derin ve güvenli bir bağ. Sınırlarınıza saygı duyulduğunu hissetmeniz, ilişkinizin sağlığının bir göstergesi.",
        "career": "İş hayatınızda görünmez bir koruma altında olduğunuzu hissedebilirsiniz — riskli bir durumdan sezgisel olarak kaçınıyor ya da doğru anda doğru kararı veriyorsunuz. Bu dönemde içgüdülerinize güvenmek, mantıklı hesaplardan daha isabetli sonuç verebilir."
      },
      "reversed": {
        "keywords": [
          "savunmasızlık",
          "sınır ihlali",
          "ruhsal kopukluk"
        ],
        "general": "Kendinizi her zamankinden daha savunmasız hissediyor olabilirsiniz — sınırlarınız ihlal ediliyor ya da bir uyarı işaretini görmezden geliyorsunuz. Manevi bir boşluk hissi eşlik edebilir. Sınırlarınızı yeniden çizmek, güvenliğinizi geri kazanmanın ilk adımı.",
        "love": "İlişkinizde sağlıklı sınırlar bulanıklaşmış olabilir — biri diğerinin alanına fazla müdahale ediyor ya da bir güvensizlik hissi büyüyor. Bu dönemde net sınırlar çizmek, ilişkiyi korumak için gerekli.",
        "career": "İş yerinde manipülasyona ya da haksız bir talebe karşı savunmasız kalabilirsiniz. Bir sınırın ihlal edilme riski var. Şüphelendiğiniz bir durumu görmezden gelmek yerine sorgulayın."
      }
    },
    "Sowilo": {
      "literalMeaning": "Güneş",
      "practicalNote": "Zafer ve yükselen statüyü temsil eder; uzun bir dinlenme ya da hastalık döneminden sonra enerjiyi yeniden ateşlemek için uygun görülür, ancak aşırı kullanımı egoyu şişirebileceğinden ölçülü kullanılması önerilir.",
      "lifePath": "İçinde bir güneş taşıyorsun; netliğin ve canlılığın hem sana hem çevrene yol gösteriyor.",
      "bond": "Işığı ve canlılığıyla ilişkiyi aydınlatır; ortak başarıyı sever.",
      "upright": {
        "keywords": [
          "güneş",
          "başarı",
          "bütünlük"
        ],
        "general": "Güneş tüm gücüyle üzerinizde parlıyor — netlik, yüksek enerji ve gerçek bir aydınlanma dönemindesiniz. Bu, Elder Futhark'ın en olumlu enerjilerinden biri: karanlık geride kalıyor, yol önünüzde ışıl ışıl açılıyor. Ancak bu ışığı ölçülü kullanmak, egoya kapılmadan zaferi paylaşmak önemli.",
        "love": "İlişkiniz bu dönemde adeta ışık saçıyor — enerji dolu, mutlu ve her türlü karanlığı aydınlatan bir hâl. Birlikte geçirdiğiniz zaman, geçmişteki zorlukları bile anlamlı kılıyor. Bu parlaklığın tadını çıkarın.",
        "career": "Kariyerinizde net, tartışmasız bir başarı kapıda — liderlik vasıflarınız öne çıkıyor, üzerinde çalıştığınız proje parlıyor. Motivasyonunuz zirvede; bu enerjiyi büyük bir hedefe yönlendirmenin tam zamanı."
      }
    },
    "Tiwaz": {
      "literalMeaning": "Tanrı Tyr / Adalet",
      "practicalNote": "Adil ve hızlı sonuçlanan mücadelelerde, özellikle hukuki süreçlerde cesaret ve kararlılık getirdiğine inanılır.",
      "lifePath": "Adalet duygun ve cesaretin seni ileri taşıyor; doğru bildiğinin arkasında durmayı biliyorsun.",
      "bond": "Dürüstlüğe ve sadakate değer verir; sözünün arkasında durur.",
      "upright": {
        "keywords": [
          "adalet",
          "fedakârlık",
          "cesaret"
        ],
        "general": "Savaşçı tanrı Tyr'ın enerjisi sizinle — doğru olan için mücadele etme cesareti, onurlu bir duruş ve adil bir zafer bu dönemin işaretleri. Zor bir kararda vicdanınızın sesini dinlemeniz, sizi haklı çıkaracak. Liderlik etmekten çekinmeyin.",
        "love": "İlişkinizde adanmışlık, dürüstlük ve adil bir denge öne çıkıyor. Zorlukları birlikte, cesaretle göğüslüyorsunuz — bu, kolay değil ama son derece değerli bir ortaklık. Sözünüzün arkasında durmak, güveni pekiştirecek.",
        "career": "Hukuki bir süreçte haklılığınız kanıtlanabilir ya da iş hayatınızda dürüst liderliğiniz takdir görebilir. Disiplinli çalışmanız, kestirmeden köşe dönenlerden çok daha kalıcı bir başarı getirecek."
      },
      "reversed": {
        "keywords": [
          "adaletsizlik",
          "cesaret kaybı",
          "yenilgi"
        ],
        "general": "Haksızlığa uğradığınızı hissedebilir ya da bir mücadeleyi sürdürecek cesareti kendinizde bulamayabilirsiniz. Disiplininiz sarsılmış olabilir. Ama pes etmeden önce, gerçekten yorgun mu yoksa sadece korkmuş mu olduğunuzu sorgulayın.",
        "love": "İlişkinizde dengesiz bir güç dağılımı ya da bir adaletsizlik hissi olabilir. Sadakatle ilgili şüpheler baş gösterebilir. Sorunlardan kaçmak yerine cesurca yüzleşmek, ilişkiyi kurtarma şansını artırır.",
        "career": "Hukuki bir konuda haksız bir sonuçla karşılaşma riski var. İş hayatınızda motivasyonunuz ve kararlılığınız zayıflamış olabilir. Bu dönemde geri çekilmek yerine, küçük adımlarla yeniden disiplin kazanmaya odaklanın."
      }
    },
    "Berkano": {
      "literalMeaning": "Huş Ağacı / Doğum",
      "practicalNote": "Şefkat ve doğurganlıkla ilişkilendirilir; bir okumada sık sık karşınıza çıkması, kalbinizi yeniden yumuşatma zamanının geldiğinin bir işareti olarak da yorumlanabilir.",
      "lifePath": "Büyüten ve besleyen bir enerjin var; yeni başlangıçlar senin elinde filizleniyor.",
      "bond": "Besleyen ve büyüten bir sevgi taşır; şefkat bu bağın toprağıdır.",
      "upright": {
        "keywords": [
          "büyüme",
          "bereket",
          "yeni başlangıç"
        ],
        "general": "Kışın ardından ilk yeşeren huş ağacı gibi, hayatınızda taze bir başlangıç filizleniyor. Bu, gerçek bir doğum olabileceği gibi bir fikrin, bir ilişkinin ya da yeni bir 'siz'in doğuşu da olabilir. Şefkatle yaklaştığınız her şey bu dönemde büyüyecek.",
        "love": "İlişkinizde taze bir sayfa açılıyor — bu bir hamilelik/doğum haberi olabileceği gibi, ilişkinin kendisinin yeni bir olgunluk aşamasına geçmesi de olabilir. Sevginiz, koruyucu ve besleyici bir yöne evriliyor.",
        "career": "Yeni fikirlendirdiğiniz bir proje filizlenmeye başlıyor. Kariyerinizde durgunluktan çıkış ve canlanma dönemi bu — küçük bir tohumu sabırla sulamanız, zamanla büyük bir ağaca dönüşecek."
      },
      "reversed": {
        "keywords": [
          "durmuş büyüme",
          "ailevi kriz",
          "kaygı"
        ],
        "general": "Bir büyüme süreci beklenmedik şekilde duraklamış olabilir. Aile içinde bir kriz ya da uzun süredir ihmal ettiğiniz bir duygusal alan dikkat istiyor. Kaygı hissi, ihmal edilenin sesini yükseltmesinden kaynaklanıyor olabilir.",
        "love": "İlişkinizde bir soğuma ya da aile içinde beklenmedik tartışmalar yaşanabilir. Atmayı planladığınız yeni bir adım engellerle karşılaşabilir. Sabır ve şefkat, bu dönemi atlatmanın anahtarı.",
        "career": "Büyümeyi planladığınız bir proje ya da strateji beklediğiniz sonucu vermeyebilir. Bu bir başarısızlık değil, yön değiştirme çağrısı — planınızı gözden geçirmek için doğru zaman."
      }
    },
    "Ehwaz": {
      "literalMeaning": "At / Ortaklık",
      "practicalNote": "Bağımsızlığı korurken hızlı ilerlemeyi desteklediği düşünülür; taşınma, kariyer değişimi ve güvenilir bir rehber/mentor bulma dönemlerinde uygun görülür.",
      "lifePath": "Güvendiğin bağlarla birlikte ilerleyen birisin; uyumlu ortaklıklar seni hızlandırıyor.",
      "bond": "Tam bir güvenle birlikte hareket etmek ister; adım adım uyumlu bir ortaklık arar.",
      "upright": {
        "keywords": [
          "hareket",
          "güven",
          "ortaklık"
        ],
        "general": "At ve binicisi arasındaki sessiz güven gibi, hayatınızdaki önemli bir ortaklıkta kusursuz bir uyum var. Bu dönem, bağımsızlığınızı kaybetmeden hızla ilerlemenizi sağlıyor. Bir taşınma, bir kariyer değişimi ya da güvenilir bir rehberle yol almak gündemde olabilir.",
        "love": "İlişkiniz, at ve binicisi gibi kusursuz bir uyum içinde ilerliyor — tam güven, karşılıklı bağımsızlığa saygı ve ortak bir yöne doğru hızlı bir ilerleyiş. Bu beraberlik, geleceğe dair sağlam bir zemin sunuyor.",
        "career": "Bir iş ortaklığı beklenenden çok daha hızlı ve sorunsuz ilerliyor. Güvenilir bir ortak ya da mentor bulma ihtimaliniz yüksek. Bu dönemde bağımsızlığınızı korurken işbirliğinin gücünden yararlanın."
      },
      "reversed": {
        "keywords": [
          "güvensizlik",
          "ilerleyememe",
          "tıkanıklık"
        ],
        "general": "Güvenmeniz gereken bir kişi ya da süreçte tereddüt yaşıyor olabilirsiniz. İlerlemeniz gereken bir konuda tıkanmış hissediyorsunuz. Uyumsuz bir ortaklık, sizi geride tutuyor olabilir — bu dengesizliği fark etmek ilk adım.",
        "love": "İlişkinizde güven sarsılmış olabilir; taraflardan biri diğerini kısıtlıyor ya da bağımsızlığına müdahale ediyor hissi var. İletişim kanalları tıkanmış — bu tıkanıklığı açmak, ilişkiyi yeniden harekete geçirecek.",
        "career": "Bir iş ortaklığında anlaşmazlıklar baş gösterebilir, hatta bir sözleşme feshi gündeme gelebilir. Üzerinde çalıştığınız bir proje durma noktasına gelebilir. Bu gecikmeyi bir felaket değil, yeniden değerlendirme fırsatı olarak görün."
      }
    },
    "Mannaz": {
      "literalMeaning": "İnsanlık / Öz Farkındalık",
      "practicalNote": "Anlaşma ve ittifakların Rune'si olarak anılır; bir sözleşme imzalamadan önce zihinde canlandırmak, adil bir işbirliği niyeti taşımaya yardımcı olabileceği söylenir.",
      "lifePath": "Kendini tanımak ve insanlarla bağ kurmak senin yolun; anlamı başkalarıyla birlikte buluyorsun.",
      "bond": "Birbirini tamamlamayı ve birlikte daha iyi insanlar olmayı önemser.",
      "upright": {
        "keywords": [
          "benlik",
          "insanlık",
          "topluluk"
        ],
        "general": "Kendinizi ve çevrenizdeki insanları her zamankinden daha net görüyorsunuz. Sosyal bağlarınız sizi güçlendiren bir kaynak — yalnız başaramayacağınız şeyleri topluluk içinde başarabilirsiniz. Rasyonel zihniniz, duygularla dengeli bir şekilde çalışıyor.",
        "love": "Bir arkadaşlığın aşka dönüşmesi ya da mevcut ilişkinizin arkadaşlık temelinin güçlenmesi söz konusu olabilir. Çevrenizde uyumlu, saygın bir çift olarak görülüyorsunuz. Bu bağ, sağlam bir dostluk zemininde yükseliyor.",
        "career": "Ekip çalışması gerektiren bir projede öne çıkma şansınız yüksek — insan ilişkilerini yönetme beceriniz takdir görüyor. Akılcı, dengeli kararlarınız hem sizi hem çevrenizdekileri doğru yöne taşıyor."
      },
      "reversed": {
        "keywords": [
          "izolasyon",
          "bencillik",
          "sahte dostluk"
        ],
        "general": "Kendinizi çevrenizden izole olmuş hissedebilirsiniz — ya siz mesafe koyuyorsunuz ya da etrafınızdakiler sizden uzaklaşıyor. Bazı 'dostlukların' aslında yüzeysel olduğunu fark edebilirsiniz. Kendinize karşı da dürüst olmak, bu izolasyonu kırmanın ilk adımı.",
        "love": "İlişkinizde biri fazla bencil davranıyor olabilir; birlikte olsanız bile içten içe bir yalnızlık hissediyorsunuz. Bu dengesizliği adlandırmak, düzeltmenin ilk şartı.",
        "career": "İş yerinde dışlandığınızı hissedebilir ya da bir iş arkadaşınızın samimiyetinden şüphe duyabilirsiniz. Alınan bencil bir karar, ekibe zarar veriyor olabilir. Şeffaflık ve dürüst iletişim, bu gerilimi azaltacak."
      }
    },
    "Laguz": {
      "literalMeaning": "Su / Akış",
      "practicalNote": "Ay döngüsüyle ve rüyalarla güçlü bir bağı olduğuna inanılır; uyku kalitesini ve rüya hatırlamayı desteklemek isteyenler için Ansuz ile birlikte düşünülebilir.",
      "lifePath": "Sezgilerin derin ve akışkan; duyguların sana aklın göremediği yerden yolu gösteriyor.",
      "bond": "Sezgiyle bağ kurar; söylenmeyeni de hisseden derin bir yakınlık arar.",
      "upright": {
        "keywords": [
          "akış",
          "sezgi",
          "bilinçaltı"
        ],
        "general": "Duygularınız su gibi akıyor — bastırmak yerine bu akışa güvenmeniz gereken bir dönemdesiniz. Rüyalarınız size mesajlar taşıyor olabilir, sezgileriniz mantığınızdan daha güvenilir. Esneklik göstererek yenilenmeye açık olun.",
        "love": "İlişkinizde duygusal derinlik ve sezgisel bir anlayış öne çıkıyor — kelimelere gerek kalmadan birbirinizi hissedebiliyorsunuz. Akışa bırakılmış, şefkatli bir bağ bu; kontrol etmeye çalışmadan güvenmek, ilişkiyi daha da derinleştirecek.",
        "career": "Sanatsal ya da yaratıcı bir işte parlamanız için ideal bir dönem — ilhamınız bilinçaltından, sezgisel bir yerden akıyor. Mantıklı hesaplar yerine içgüdünüze güvendiğiniz kararlar, sizi doğru yöne taşıyacak."
      },
      "reversed": {
        "keywords": [
          "bastırılmış sezgi",
          "duygusal karmaşa",
          "korku"
        ],
        "general": "İçgüdülerinizi susturmuş, mantığın arkasına saklanıyor olabilirsiniz. Bu, duygusal bir karmaşaya ve gerçeği net görememeye yol açabilir. Korkularınızın sesi, sezgilerinizin sesinden daha yüksek çıkıyor olabilir — bunu fark etmek iyileşmenin başlangıcı.",
        "love": "Duygularınız kontrolden çıkmış bir girdaba dönüşebilir — aşırı hassasiyet, kıskançlık ya da güvensizlik ilişkinizi zorluyor olabilir. Bu duyguları bastırmak yerine sakin bir şekilde adlandırmak, girdabı yatıştıracak.",
        "career": "İş yerinde duygusal bir tepkiyle verdiğiniz bir karar hataya yol açabilir. Gerçeklerden kaçıp bir hayal dünyasına sığınma eğiliminiz olabilir. Bu dönemde ayakları yere basan, somut adımlara odaklanmak gerekiyor."
      }
    },
    "Ingwaz": {
      "literalMeaning": "Tohum / Potansiyel",
      "practicalNote": "İçe dönük olgunlaşmayı simgeler; hayatınızdan gereksiz olanı ayıklamak istediğiniz dönemlerde akla gelir.",
      "lifePath": "İçinde olgunlaşmayı bekleyen bir tohum taşıyorsun; işleri tamamlama gücün zamanla açılıyor.",
      "bond": "Ortak hayallere ve geleceğe tohum eker; bağın zamanla olgunlaşmasını bekler.",
      "upright": {
        "keywords": [
          "bereket",
          "potansiyel",
          "iç huzur"
        ],
        "general": "Toprağın altında sessizce olgunlaşan bir tohum gibi, potansiyeliniz henüz görünmese de aktif şekilde şekilleniyor. Bu, sabır gerektiren ama son derece verimli bir bekleme dönemi. Sonuçları göremiyor olmanız, hiçbir şeyin olmadığı anlamına gelmiyor.",
        "love": "İlişkiniz sessizce, ama emin adımlarla olgunlaşıyor. Henüz büyük bir dönüm noktasına gelmemiş olabilirsiniz ama içsel bağlarınız derinleşiyor. Bu hazırlık dönemi, ileride sağlam bir temel sağlayacak.",
        "career": "Perde arkasında yürüttüğünüz sessiz ama verimli bir çalışma, tamamlanma aşamasına yaklaşıyor. Henüz görünür bir sonuç almasanız da temeller sağlam atılıyor. Sabrınız, yakında somut bir karşılık bulacak."
      }
    },
    "Dagaz": {
      "literalMeaning": "Gün / Şafak",
      "practicalNote": "Ani bir farkındalık ve çığır açan dönüşümü temsil eder; ancak önce kendi merkezinizde olmanızı ister — kaosun ortasında değil, sakinlik anında en güçlü kabul edilir.",
      "lifePath": "Karanlıktan aydınlığa geçişlerin insanısın; uyanışlar ve yeni sayfalar hayatında sık sık beliriyor.",
      "bond": "İlişkiye tazelik ve yenilenme getirir; birlikte yeni sayfalar açmayı sever.",
      "upright": {
        "keywords": [
          "uyanış",
          "dönüşüm",
          "aydınlık"
        ],
        "general": "Gece bitiyor, şafak söküyor — ama bu dönüşüm sizi merkezinizde bulduğunda gerçek gücünü gösteriyor. Ani bir farkındalık, uzun süredir bulanık olan bir konuyu bir anda netleştirebilir. Umut artık soyut değil, somut ve kesin.",
        "love": "İlişkinizdeki belirsizlik ve karanlık dönem geride kalıyor — artık her şey çok daha net ve şeffaf. Bu farkındalık anı, ilişkinizi yeni ve daha sağlıklı bir aşamaya taşıyor.",
        "career": "İş hayatınızda köklü bir dönüşüm, hatta devrim niteliğinde bir atılım kapıda olabilir. Uzun süredir aradığınız çözüm, beklenmedik bir anda netleşebilir. Bu farkındalığı harekete geçirmek için merkezinizde, sakin kalmanız gerekiyor."
      }
    },
    "Othala": {
      "literalMeaning": "Ata Toprağı / Miras",
      "practicalNote": "Ev, mülk ve aile korumasının en güçlü sembollerinden biri kabul edilir; Fehu'nun aksine bireysel değil, kolektif (aile/hane) kazanımı koruduğuna inanılır.",
      "lifePath": "Köklerinden ve mirasından güç alıyorsun; kendine ve sevdiklerine bir yuva kurmak senin yolun.",
      "bond": "Kök salmayı, yuva kurmayı ve aile olmayı önemser.",
      "upright": {
        "keywords": [
          "miras",
          "yuva",
          "kökler"
        ],
        "general": "Köklerinizle, ailenizle ve size ait olan mülkle güçlü bir bağ hissediyorsunuz. Bu dönem, kalıcı değerler inşa etmek ve derin bir aidiyet duygusunu pekiştirmek için elverişli. Fehu'nun bireysel kazancından farklı olarak, burada söz konusu olan kolektif, paylaşılan bir miras.",
        "love": "İlişkinizde kalıcı bir yuva kurma arzusu öne çıkıyor — birlikte bir ev, bir aile ya da paylaşılan bir gelecek inşa etmek gündemde olabilir. Geleneklere ve köklere bağlılık, ilişkinizin sağlam bir temele oturmasını sağlıyor.",
        "career": "Bir aile işletmesi, miras yoluyla gelen bir kazanç ya da gayrimenkul yatırımı gündeminizde olabilir. Bu dönemde inşa ettiğiniz başarı, geçici değil nesiller boyu sürecek kalıcı bir değer taşıyor."
      },
      "reversed": {
        "keywords": [
          "köklerinden kopma",
          "miras kavgası",
          "geçmişe takılma"
        ],
        "general": "Köklerinizden, ailenizden ya da geldiğiniz yerden bir kopukluk hissediyor olabilirsiniz. Bir miras meselesi etrafında anlaşmazlıklar çıkabilir. Geçmişe fazla takılı kalmak, bugünkü aidiyet arayışınızı zorlaştırıyor olabilir.",
        "love": "Aile içindeki bir miras anlaşmazlığı ilişkinize de yansıyabilir. Geleneksel beklentiler ya da aile baskısı, çift olarak aranızda gerginlik yaratabilir. Kendi sınırlarınızı aile beklentilerinden ayırt etmek önemli.",
        "career": "Bir gayrimenkul ya da aile işiyle ilgili maddi bir kayıp veya anlaşmazlık yaşanabilir. Güvende hissettiğiniz bir zemin sarsılmış olabilir. Bu dönemde net bir mali plan yapmak, güvensizliği azaltacak."
      }
    }
  },
  "zodiac": {
    "aries": {
      "name": "Koç",
      "reading": "Fehu kazanmayı, Uruz o kazanımı taşıyacak ham gücü veriyor. Akışın içinde büyüyen bir cesaret taşıyorsun; aynı enerji dengesini kaybettiğinde açgözlülüğe ya da gücü yanlış yere harcamaya dönüşebilir.",
      "bindrune": "Uruz'un ham yaşam gücü, Fehu'nun akışkan bereketine kanalize oluyor. Bu birleşim dürtüselliği yıkıcı değil üretken bir harekete çeviriyor."
    },
    "taurus": {
      "name": "Boğa",
      "reading": "Thurisaz seni sarsarak uyandıran diken, Ansuz ise o sarsıntıdan çıkan söz ve bilgelik. İkisi birlikte, savunmayı körü körüne değil düşünerek yapmayı öğretiyor.",
      "bindrune": "Koruyucu bir kalkanın (Thurisaz) aklın ve sözün gücüyle (Ansuz) mühürlenmesi. Sabit fikirliliği, doğru zamanı bekleyen bir sabra çeviriyor."
    },
    "gemini": {
      "name": "İkizler",
      "reading": "Raidho doğru ritimde ilerlemeyi, Kenaz yolda taşıdığın meşaleyi temsil ediyor. Merakın dağılmadığı sürece hem hızlı hem isabetli ilerlersin.",
      "bindrune": "Hareketin (Raidho) içsel aydınlanma ve ustalıkla (Kenaz) buluşması. Dağınık merakı, hedefi olan bir keşfe sabitliyor."
    },
    "cancer": {
      "name": "Yengeç",
      "reading": "Gebo karşılıklı alışverişi, Wunjo o alışverişten doğan huzuru anlatıyor. Verdiğin kadar alabildiğin bağlarda güçlenirsin.",
      "bindrune": "Duygusal bağın (Gebo) uyum ve neşeyle (Wunjo) mühürlenmesi. Kırılganlığı, paylaşılan değerlerin koruyuculuğuna dönüştürüyor."
    },
    "leo": {
      "name": "Aslan",
      "reading": "Hagalaz beklenmedik bir sarsıntı, Nauthiz o sarsıntının öğrettiği dayanıklılık. Bu ikili, gücün gösterişten değil dayanmaktan geldiğini söylüyor.",
      "bindrune": "Arındırıcı krizin (Hagalaz) ihtiyaçtan doğan iradeyle (Nauthiz) birleşmesi. Dışa dönük parlaklığı, içeriden sarsılmaz bir sağlamlığa çeviriyor."
    },
    "virgo": {
      "name": "Başak",
      "reading": "Isa durup berraklaşmayı, Jera sabırla beklenen hasadı temsil ediyor. Acele etmediğin sürece emeğinin karşılığını eksiksiz alırsın.",
      "bindrune": "Döngünün ve emeğin (Jera) berrak bir sükunetle (Isa) birleşmesi. Mükemmeliyetçilik kaygısını, zamanın kendi akışına duyulan güvenle yatıştırıyor."
    },
    "libra": {
      "name": "Terazi",
      "reading": "Eihwaz esneyip kırılmayan omurga, Perthro ise henüz açılmamış olanın gizemi. Karar veremediğin anlarda seni taşıyan şey dayanıklılığın oluyor.",
      "bindrune": "Derin köklerin (Eihwaz) kaderin gizemiyle (Perthro) mühürlenmesi. Kararsızlığı, beklemeyi bilen bir kararlılığa çeviriyor."
    },
    "scorpio": {
      "name": "Akrep",
      "reading": "Algiz seni koruyan kalkan, Sowilo o korumanın altındaki güneş. Derinlerde taşıdığın şey karanlık değil, henüz gösterilmemiş bir güç.",
      "bindrune": "Koruyucu kalkanın (Algiz) güneşin netliğiyle (Sowilo) aydınlatılması. Gizli gücü, bilinçli ve görünür bir başarıya yönlendiriyor."
    },
    "sagittarius": {
      "name": "Yay",
      "reading": "Tiwaz doğru bildiğinin yanında durmak, Berkano ise o duruştan doğan yeni başlangıç. İdealin, somut bir şeyi büyüttüğünde anlam kazanıyor.",
      "bindrune": "Adalet ve cesaretin (Tiwaz) besleyici bir büyümeyle (Berkano) taçlanması. Hedefi etik bir zemine bağlıyor."
    },
    "capricorn": {
      "name": "Oğlak",
      "reading": "Ehwaz güvene dayalı ortaklığı, Mannaz kendi benliğini ve topluluk içindeki yerini anlatıyor. Yalnız gitmek yerine birlikte gitmek seni daha uzağa taşır.",
      "bindrune": "Bireysel sorumluluğun (Mannaz) karşılıklı güvenle (Ehwaz) birleşmesi. Hırsı, çevresine de yarayan bir yapıya dönüştürüyor."
    },
    "aquarius": {
      "name": "Kova",
      "reading": "Laguz sezginin akışı, Ingwaz ise henüz doğmamış ama olgunlaşan potansiyel. Fikirlerin görünür olmadan önce içeride sessizce büyüyor.",
      "bindrune": "Sezgisel akışın (Laguz) somut bir potansiyele (Ingwaz) dönüşmesi. Vizyonu, doğmaya hazırlanan bir güç olarak sabitliyor."
    },
    "pisces": {
      "name": "Balık",
      "reading": "Dagaz karanlığın ardından gelen uyanış, Othala ise seni taşıyan kökler. Aydınlanman geçmişini reddederek değil, ona yaslanarak geliyor.",
      "bindrune": "Kökten gelen mirasın (Othala) yeni bir uyanışla (Dagaz) mühürlenmesi. Dağılma eğilimini, aidiyet duygusuyla dengeliyor."
    }
  },
  "presets": {
    "protection": {
      "name": "Kuzey Muhafızı",
      "category": "Koruma",
      "synergy": "Algiz'in yukarı uzanan kalkanı, Thurisaz'ın aktif savunma gücüyle birleşiyor — sarsılmaz bir koruma kalkanı."
    },
    "evileye": {
      "name": "Ağır Enerji Çözücü",
      "category": "Nazar & Arınma",
      "synergy": "Hagalaz'ın dağıtıcı sarsıntısı ile Thurisaz'ın keskin savunması üzerinize yönelmiş ağır enerjiyi kırıyor, Algiz ise açılan boşluğu kapatıyor — çözme ve koruma aynı tılsımda."
    },
    "mirror": {
      "name": "Yansıma Mührü",
      "category": "Ayna & Eşik",
      "synergy": "Isa akışı donduruyor, Algiz geçişi kolluyor, Dagaz ise kalan enerjiyi dengeye çekiyor — aynalar ve eşikler gibi geçiş noktaları için bir mühür."
    },
    "childroom": {
      "name": "Yavru Kalkanı",
      "category": "Çocuk Koruma",
      "synergy": "Algiz'in koruyucu kalkanı, Othala'nın hane ve soy bağıyla destekleniyor — çocuğun uyuduğu ve vakit geçirdiği alanı kollayan yumuşak ama sağlam bir koruma."
    },
    "animalguard": {
      "name": "Sadık Yoldaş",
      "category": "Hayvan Koruma",
      "synergy": "Thurisaz ve Tiwaz dış tehlikeye karşı duruyor, Algiz kalkanı geriyor, Kenaz ise sertliği yumuşatıyor — evcil hayvanın güvenliği ve sakinliği için bir bileşim."
    },
    "travel": {
      "name": "Güvenli Rota",
      "category": "Güvenli Seyahat",
      "synergy": "Raidho'nun doğru yön bulma gücü, Algiz'in koruyucu kalkanıyla pekişiyor — yolculuk boyunca güvenliği gözeten bir işaret."
    },
    "prosperity": {
      "name": "Bereketli Hasat",
      "category": "Bolluk",
      "synergy": "Fehu'nun akan serveti, Jera'nın sabırlı döngüsel hasadıyla buluşuyor — sürdürülebilir bir bolluk."
    },
    "promotion": {
      "name": "Zirveye Çıkış",
      "category": "Terfi & Yükseliş",
      "synergy": "Sowilo'nun zafer parlaklığı, Fehu'nun hak edilmiş kazanımıyla taçlanıyor — beklenen terfi veya yükseliş için bir ivme."
    },
    "jobsearch": {
      "name": "Kapı Açan Yol",
      "category": "İş Bulma",
      "synergy": "Tiwaz niyeti keskinleştiriyor, Raidho yolu açıyor, Fehu karşılığı getiriyor, Sowilo ise görünür kılıyor — iş arayışını hızlandırmak için dörtlü bir dizilim."
    },
    "business": {
      "name": "Tüccarın Mührü",
      "category": "Ticaret & Girişim",
      "synergy": "Sowilo başarıyı görünür kılarken Gebo alışverişi dengeliyor, Berkano büyümeyi besliyor, Fehu ise kazancı akıtıyor — girişim ve ticaret için bir bileşim."
    },
    "workplace": {
      "name": "Ocak Bekçisi",
      "category": "İş Yeri Koruma",
      "synergy": "Othala mekânı sahipleniyor, Tiwaz düzeni koruyor, Sowilo işi ayakta tutuyor, Mannaz ise doğru insanları ve ortaklıkları çağırıyor."
    },
    "luck": {
      "name": "Şans Kapısı",
      "category": "Şans & Uğur",
      "synergy": "Perthro'nun beklenmedik kader oyunları, Fehu'nun bereketli akışıyla buluşuyor — kapıyı şansa ve kazanca aralayan bir işaret."
    },
    "love": {
      "name": "Bağlılık Düğümü",
      "category": "Aşk & Uyum",
      "synergy": "Gebo'nun dengeli alışverişi, Wunjo'nun neşesiyle taçlanıyor — karşılıklı sevgi ve uyum."
    },
    "soulmate": {
      "name": "Ruh Eşi Çağrısı",
      "category": "Ruh Eşi",
      "synergy": "Kenaz görmek isteneni aydınlatıyor, Tiwaz niyeti sabitliyor, Berkano bağı besliyor, Ingwaz ise onu olgunlaşacağı sabra bırakıyor."
    },
    "grace": {
      "name": "Nazik Kalp",
      "category": "Lütuf & Nezaket",
      "synergy": "Gebo'nun karşılıksız cömertliği, Sowilo'nun sıcak ışığıyla yumuşuyor — çevrenize nezaket ve lütuf yayan bir duruş."
    },
    "communication": {
      "name": "Net Söz",
      "category": "İletişim & İkna",
      "synergy": "Ansuz'un berrak ifadesi, Mannaz'ın insan ilişkilerini yönetme becerisiyle destekleniyor — ikna edici ve dürüst bir iletişim."
    },
    "healing": {
      "name": "Yenilenme Kalkanı",
      "category": "Şifa",
      "synergy": "Uruz'un ham yaşamsal gücü, Berkano'nun yenileyici şefkatiyle destekleniyor — bedensel ve ruhsal iyileşme."
    },
    "pain": {
      "name": "Dinginlik Sargısı",
      "category": "Rahatlama",
      "synergy": "Dagaz keskinliği kırıyor, Ingwaz onarımı sabırla sürdürüyor, Berkano dokuyu besliyor, Laguz ise gerginliği akıtıyor — fiziksel rahatsızlıkta rahatlama niyeti."
    },
    "fertility": {
      "name": "Tohum ve Su",
      "category": "Doğurganlık",
      "synergy": "Berkano'nun doğurgan şefkati, Ingwaz'ın içte olgunlaşan tohumuyla birleşiyor, Laguz ise akışı besliyor — bereket ve yeni yaşam niyeti."
    },
    "energy": {
      "name": "Yaşam Ateşi",
      "category": "Enerji & Canlılık",
      "synergy": "Sowilo'nun parlayan zafer ışığı, Uruz'un fiziksel dayanıklılığıyla besleniyor — tükenmişlikten çıkışı hızlandıran canlı bir enerji."
    },
    "strength": {
      "name": "Ham Güç",
      "category": "Dayanıklılık",
      "synergy": "Uruz'un yontulmamış yaşamsal gücü, Thurisaz'ın kırıp geçen kararlılığıyla katmerleşiyor — fiziksel ve zihinsel dayanıklılığın zirvesi."
    },
    "grief": {
      "name": "Şafak Nefesi",
      "category": "Yas & İyileşme",
      "synergy": "Dagaz'ın çığır açan farkındalığı, Ingwaz'ın sabırlı iç olgunlaşmasıyla yavaşlıyor — kaybın ardından gelen iyileşmeye nazik bir eşlik."
    },
    "wisdom": {
      "name": "Meşale Bilgeliği",
      "category": "Bilgelik & Netlik",
      "synergy": "Ansuz'un ilahi rehberliği, Kenaz'ın aydınlatıcı meşalesiyle birleşiyor — net görüş ve doğru karar."
    },
    "exam": {
      "name": "Sakin Zihin",
      "category": "Sınav & Mülakat",
      "synergy": "Ansuz'un akıcı ifadesi, Algiz'in koruyucu sakinliği ve Tiwaz'ın kararlılığıyla üçe katlanıyor — heyecanı dizginleyip net anlatan bir zihin."
    },
    "creativity": {
      "name": "İlham Kaynağı",
      "category": "Yaratıcılık",
      "synergy": "Kenaz'ın aydınlatıcı yaratıcı ateşi, Laguz'un sezgisel akışıyla derinleşiyor — sanatsal ilhamın önünü açan bir birleşim."
    },
    "courage": {
      "name": "Savaşçı Ruhu",
      "category": "Cesaret",
      "synergy": "Tiwaz'ın kararlı adalet duygusu, Uruz'un ham yaşamsal gücüyle birleşiyor — zorluklar karşısında geri adım atmayan bir cesaret."
    },
    "newstart": {
      "name": "Açılan Yol",
      "category": "Yeni Başlangıç",
      "synergy": "Ehwaz'ın bağımsız ilerleyişi, Fehu'nun taze kazanım enerjisiyle destekleniyor — taşınma, iş değişimi ya da yeni bir sayfa için hız."
    },
    "sleep": {
      "name": "Ay Işığı Huzuru",
      "category": "Uyku & Rüya",
      "synergy": "Laguz'un sezgisel akışı, Ansuz'un berrak mesajlarıyla yumuşuyor — huzurlu bir uyku ve hatırlanan rüyalar için bir denge."
    },
    "home": {
      "name": "Eşik Muhafızı",
      "category": "Ev & Aile",
      "synergy": "Othala'nın ata topraklarını koruyan gücü, Algiz'in kalkanıyla pekişiyor — evin ve hanenin bütününü kollayan bir mühür."
    },
    "lostfound": {
      "name": "Geri Dönüş Yolu",
      "category": "Kayıp Bulma",
      "synergy": "Raidho'nun yön bulma gücü, Tiwaz'ın kararlı doğrultusuyla birleşiyor — kaybolanın geri dönüş yolunu açan bir işaret."
    },
    "blockage": {
      "name": "Kilit Açan",
      "category": "Blokaj Açma",
      "synergy": "Perthro örtülü olanı görünür kılıyor, Uruz ise onu kırıp geçecek gücü veriyor — nedenini bilmediğiniz bir tıkanıklığı çözmeye yönelik ikili."
    },
    "balance": {
      "name": "Terazi Düğümü",
      "category": "Alma & Verme",
      "synergy": "Gebo alışverişi eşitliyor, Wunjo hoşnutluğu getiriyor, Tiwaz sınırı çiziyor, Othala ise kalanı koruyor — hep verip karşılığını alamayanlar için bir denge."
    },
    "chakra": {
      "name": "Merkez Hizası",
      "category": "İç Denge",
      "synergy": "Fehu enerjiyi harekete geçiriyor, Uruz onu topraklıyor, Ingwaz ise merkeze oturtuyor — dağılmış hissettiğinizde toparlayıcı bir üçlü."
    }
  },
  "presetGroups": {
    "koruma": "Koruma & Arınma",
    "is": "İş & Bolluk",
    "ask": "Aşk & İlişkiler",
    "sifa": "Şifa & Beden",
    "zihin": "Zihin & Yol",
    "ev": "Ev & Gündelik"
  },
  "elements": {
    "fire": "Ateş",
    "earth": "Toprak",
    "air": "Hava",
    "water": "Su"
  },
  "compat": {
    "elements": {
      "fire-fire": "İki Ateş: tutkulu, hızlı ve parlak bir bağ; birlikte yanarken birbirinizi tüketmemeye dikkat edin.",
      "earth-earth": "İki Toprak: sağlam, güvenilir ve sabırlı bir bağ; ortak bir düzen kurmakta ustasınız.",
      "air-air": "İki Hava: zihinlerin buluşması; konuşmak, düşünmek ve keşfetmek sizi birbirinize bağlıyor.",
      "water-water": "İki Su: derin bir duygusal anlayış; söylenmeyeni bile hissediyorsunuz.",
      "air-fire": "Ateş ve Hava: biri kıvılcım, öteki onu büyüten rüzgâr; birbirinizi canlandırıyorsunuz.",
      "earth-water": "Toprak ve Su: biri kap, öteki onu dolduran; birbirinizi besleyen, büyüten bir uyum.",
      "earth-fire": "Ateş ve Toprak: tutku ile istikrar; biri harekete geçirir, öteki kök saldırır.",
      "fire-water": "Ateş ve Su: güçlü bir çekim ve güçlü bir gerilim; dengeyi bulduğunuzda dönüştürücü bir buluşma.",
      "air-earth": "Hava ve Toprak: fikir ile emek; biri hayal eder, öteki gerçeğe döker.",
      "air-water": "Hava ve Su: düşünce ile duygu; birbirinizin dünyasını genişleten bir buluşma."
    },
    "sameAett": "Kader Yolu rune'larınız aynı aett'ten: hayata benzer bir yerden bakıyorsunuz.",
    "diffAett": "Kader Yolu rune'larınız farklı aett'lerden: her biriniz ötekinde eksik olanı getiriyor.",
    "tiers": {
      "high": "Rune'larınız arasında nadir bir uyum var; birbirinizi doğal bir kolaylıkla tamamlıyorsunuz.",
      "mid": "Aranızda güçlü bir güven ve tamamlayıcılık var; iletişimi açık tuttukça bağınız derinleşir.",
      "low": "Farklı enerjilerin buluşması bu; birbirinizin sınırlarına saygı duydukça birlikte çok şey öğrenirsiniz."
    }
  }
};

export default tr;
