/**
 * ============================================================================
 * DERGİMİZ İNTERAKTİF YAYINCILIK, CANVA GRID DND & 100+100 AI PROMPT KÜTÜPHANESİ
 * ----------------------------------------------------------------------------
 * 1. 100 Metin + 100 Görsel Hazır AI Komut Kütüphanesi (Canlı Önizlemeli Modal)
 * 2. Canva Tarzı Otomatik Sığdırmalı Sürükle-Bırak Fotoğraf Izgaraları (Drag & Drop Cover)
 * 3. İnteraktif Medya Sihirbazı (Video, Ses/Podcast, Düğmeler, Sıcak Noktalar, Galeri, Tablo)
 * ============================================================================
 */

// ============================================================================
// 1. METİN İÇİN 100 HAZIR AI KOMUTU (7 KATEGORİ)
// ============================================================================
window.AI_TEXT_PROMPT_LIBRARY = [
  // Kategori 1: İmla, Noktalama ve TDK Redaksiyonu (15)
  { id: 't1', cat: 'imla', catName: 'İmla & TDK', title: 'TDK Tam Düzelti', cmd: 'Tüm imla, yazım ve noktalama hatalarını TDK standartlarında düzelt.', icon: 'ph-check-circle' },
  { id: 't2', cat: 'imla', catName: 'İmla & TDK', title: 'De/Da ve Ki Ayırma', cmd: 'Metindeki de/da ve ki bağlaçlarının yazımını TDK kurallarına göre denetle ve ayır.', icon: 'ph-scissors' },
  { id: 't3', cat: 'imla', catName: 'İmla & TDK', title: 'Kesme İşaretleri', cmd: 'Özel isimlerdeki kesme işaretlerini ve ekleri kurallara uygun düzelt.', icon: 'ph-pencil-line' },
  { id: 't4', cat: 'imla', catName: 'İmla & TDK', title: 'Büyük/Küçük Harf', cmd: 'Başlık ve cümle başı büyük-küçük harf hiyerarşisini düzelt.', icon: 'ph-text-aa' },
  { id: 't5', cat: 'imla', catName: 'İmla & TDK', title: 'Anlatım Bozukluğu', cmd: 'Gereksiz sözcük kullanımı ve mantık hatalarını gider, akıcı yap.', icon: 'ph-sparkle' },
  { id: 't6', cat: 'imla', catName: 'İmla & TDK', title: 'Sözcük Durulaştırma', cmd: 'Metindeki ağdalı ve gereksiz laf kalabalığını ayıkla, duru Türkçe yap.', icon: 'ph-drop' },
  { id: 't7', cat: 'imla', catName: 'İmla & TDK', title: 'Akıcı Cümle Bağlantıları', cmd: 'Cümleler arasındaki geçiş bağlaçlarını güçlendir ve akıcılık kat.', icon: 'ph-git-commit' },
  { id: 't8', cat: 'imla', catName: 'İmla & TDK', title: 'Noktalama Dengesi', cmd: 'Virgül, noktalı virgül ve iki noktaları edebi bir ritimle yeniden yerleştir.', icon: 'ph-dot-outline' },
  { id: 't9', cat: 'imla', catName: 'İmla & TDK', title: 'Sayı ve Kısaltmalar', cmd: 'Sayıları, tarihleri ve kurum kısaltmalarını TDK formatına getir.', icon: 'ph-hash' },
  { id: 't10', cat: 'imla', catName: 'İmla & TDK', title: 'Akademik Redaksiyon', cmd: 'Metni akademik bir dergide yayımlanacak ciddiyette baştan sona redakte et.', icon: 'ph-graduation-cap' },
  { id: 't11', cat: 'imla', catName: 'İmla & TDK', title: 'Yabancı Kelimeleri Türkçeleştir', cmd: 'Plaza dili ve yabancı kökenli terimleri yaşayan güzel Türkçeye çevir.', icon: 'ph-globe-stand' },
  { id: 't12', cat: 'imla', catName: 'İmla & TDK', title: 'Paragraf Akışını Onar', cmd: 'Düşünce zincirini giriş, gelişme ve sonuç mantığında tutarlı diz.', icon: 'ph-sort-ascending' },
  { id: 't13', cat: 'imla', catName: 'İmla & TDK', title: 'Kurallı Cümleye Çevir', cmd: 'Devrik cümleleri yüklemi sonda olan kurallı cümle kalıbına getir.', icon: 'ph-text-align-left' },
  { id: 't14', cat: 'imla', catName: 'İmla & TDK', title: 'Kelime Çeşitliliği', cmd: 'Tekrarlanan kelimeleri anlamı bozmadan zengin eş anlamlılarıyla değiştir.', icon: 'ph-arrows-clockwise' },
  { id: 't15', cat: 'imla', catName: 'İmla & TDK', title: 'Yazar Üslubunu Koruyarak Düzelt', cmd: 'Yazarın özgün üslubunu hiç bozmadan sadece mekanik hataları onar.', icon: 'ph-shield-check' },

  // Kategori 2: Üslup ve Ton Dönüşümleri (20)
  { id: 't16', cat: 'uslup', catName: 'Üslup & Ton', title: 'Resmi Protokol Dili', cmd: 'Bu metni MEB ve Valilik standartlarında resmi, saygılı kurumsal dile çevir.', icon: 'ph-buildings' },
  { id: 't17', cat: 'uslup', catName: 'Üslup & Ton', title: 'Dinamik Gençlik Dili', cmd: 'Metni lise öğrenci kulübü ve gençlik dergisi havasında samimi ve coşkulu yaz.', icon: 'ph-lightning' },
  { id: 't18', cat: 'uslup', catName: 'Üslup & Ton', title: 'Edebi & Sanat Dergisi', cmd: 'Metni metaforik, felsefi ve edebi bir derinlikle yeniden kaleme al.', icon: 'ph-feather' },
  { id: 't19', cat: 'uslup', catName: 'Üslup & Ton', title: 'Popüler Bilim Dili', cmd: 'Karmaşık terimleri herkesin anlayacağı açık ve merak uyandırıcı bilim diliyle yaz.', icon: 'ph-atom' },
  { id: 't20', cat: 'uslup', catName: 'Üslup & Ton', title: 'İlkokul / Çocuk Dili', cmd: 'Bu yazıyı 10 yaşındaki bir ilkokul öğrencisinin anlayacağı neşeli dilde sadeleştir.', icon: 'ph-smiley' },
  { id: 't21', cat: 'uslup', catName: 'Üslup & Ton', title: 'Milli & Coşkulu Dil', cmd: 'Mehmet Akif ve Yahya Kemal esintisiyle vatan ve bayrak sevgisini öne çıkar.', icon: 'ph-flag' },
  { id: 't22', cat: 'uslup', catName: 'Üslup & Ton', title: 'İlham Verici Motivasyon', cmd: 'Gençlere hayallerinin peşinden gitmeleri için ilham veren bir motivasyon konuşması yap.', icon: 'ph-rocket-launch' },
  { id: 't23', cat: 'uslup', catName: 'Üslup & Ton', title: 'Haber Muhabiri Dili', cmd: '5N1K kuralına uygun, tarafsız ve çarpıcı bir haber bülteni üslubuna çevir.', icon: 'ph-newspaper-clipping' },
  { id: 't24', cat: 'uslup', catName: 'Üslup & Ton', title: 'Nostaljik Masal Dili', cmd: 'Bir zamanlar diyerek başlayan sıcacık bir edebi masal anlatımına büründür.', icon: 'ph-moon-stars' },
  { id: 't25', cat: 'uslup', catName: 'Üslup & Ton', title: 'Mizahi Okul Anısı', cmd: 'Okul sıralarındaki tatlı anıları hatırlatan hafif mizahi ve tebessüm ettiren ton ver.', icon: 'ph-hand-waving' },
  { id: 't26', cat: 'uslup', catName: 'Üslup & Ton', title: 'Gelecek Vizyonu', cmd: '2050 yılının teknolojilerini ve yapay zekâ çağını tasvir eden fütüristik bir hava ver.', icon: 'ph-cpu' },
  { id: 't27', cat: 'uslup', catName: 'Üslup & Ton', title: 'Tarihçi Ciddiyeti', cmd: 'Tarihi bir arşiv belgesi gibi kaynaklara dayanan analitik bir üsluba getir.', icon: 'ph-books' },
  { id: 't28', cat: 'uslup', catName: 'Üslup & Ton', title: 'Samimi Söyleşi Tonu', cmd: 'Okuyucuyla karşılıklı kahve içip sohbet eder gibi samimi bir üsluba uyarla.', icon: 'ph-chats-teardrop' },
  { id: 't29', cat: 'uslup', catName: 'Üslup & Ton', title: 'Lirik ve Duygusal', cmd: 'Şiirsel imgeler ve kalbe dokunan zarif cümlelerle lirik bir hava kat.', icon: 'ph-heart' },
  { id: 't30', cat: 'uslup', catName: 'Üslup & Ton', title: 'Eylem Çağrısı (Call to Action)', cmd: 'Okuyucuyu dergiye katılmaya ve proje üretmeye davet eden dinamik bir çağrı yap.', icon: 'ph-megaphone' },
  { id: 't31', cat: 'uslup', catName: 'Üslup & Ton', title: 'Şehir & Kültür Rehberi', cmd: 'Kentin tarihi sokaklarını ve kültür duraklarını gezdiren bir seyyah dili kullan.', icon: 'ph-compass' },
  { id: 't32', cat: 'uslup', catName: 'Üslup & Ton', title: 'Münazara ve Fikir Tezgahı', cmd: 'Tez ve antitez içeren, okuyucuya sorular sorduran düşündürücü bir üslup kur.', icon: 'ph-scales' },
  { id: 't33', cat: 'uslup', catName: 'Üslup & Ton', title: 'Veda ve Teşekkür', cmd: 'Mezuniyet ve dönem sonu için duygusal bir teşekkür ve veda mektubuna dönüştür.', icon: 'ph-envelope-simple' },
  { id: 't34', cat: 'uslup', catName: 'Üslup & Ton', title: 'Bahar ve Yenilenme', cmd: 'Bahar mevsiminin tazeliğini ve doğanın uyanışını müjdeleyen neşeli ton ver.', icon: 'ph-sun-dim' },
  { id: 't35', cat: 'uslup', catName: 'Üslup & Ton', title: 'Sanat Eleştirmeni Gözüyle', cmd: 'Eseri biçim, renk ve anlam katmanlarıyla inceleyen zarif bir eleştiri yazısı yap.', icon: 'ph-paint-brush' },

  // Kategori 3: Manşet, Spot ve Başlık Laboratuvarı (15)
  { id: 't36', cat: 'manset', catName: 'Manşet & Spot', title: '3 Alternatif Kapak Manşeti', cmd: 'Bu metinden dergi kapağına yakışacak 3 farklı tonda çarpıcı manşet çıkar.', icon: 'ph-text-h-one' },
  { id: 't37', cat: 'manset', catName: 'Manşet & Spot', title: 'Okuyucu Yakalayan Spot (Lead)', cmd: 'Metnin başına 1-2 cümlelik merak uyandırıcı vurucu bir spot yazısı türet.', icon: 'ph-quotes' },
  { id: 't38', cat: 'manset', catName: 'Manşet & Spot', title: 'Soru Formunda Manşet', cmd: 'Okuyucuyu düşündüren ve merak ettiren soru kalıbında bir ana başlık yap.', icon: 'ph-question' },
  { id: 't39', cat: 'manset', catName: 'Manşet & Spot', title: '3 Kelimelik Kısa Manşet', cmd: 'En fazla 3 kelimeden oluşan keskin, minimalist ve modern bir başlık üret.', icon: 'ph-cursor-text' },
  { id: 't40', cat: 'manset', catName: 'Manşet & Spot', title: 'Ara Başlıklarla Böl (H2)', cmd: 'Metni okumayı kolaylaştıracak 3 adet şık ve anlamlı ara başlıkla parçalara ayır.', icon: 'ph-text-h-two' },
  { id: 't41', cat: 'manset', catName: 'Manşet & Spot', title: 'Kafiyeli Edebi Başlık', cmd: 'Ahenkli ve kafiyeli duran edebi bir dergi başlığı öner.', icon: 'ph-music-note' },
  { id: 't42', cat: 'manset', catName: 'Manşet & Spot', title: 'Gençlik Kulübü Başlığı', cmd: 'Öğrencilerin heyecanını yansıtan dinamik ve enerjik bir başlık yaz.', icon: 'ph-fire' },
  { id: 't43', cat: 'manset', catName: 'Manşet & Spot', title: 'Resmi ve Ağırbaşlı Başlık', cmd: 'Kurumsal okul bültenine yakışan saygın ve resmi bir başlık türet.', icon: 'ph-medal' },
  { id: 't44', cat: 'manset', catName: 'Manşet & Spot', title: 'Çift Katmanlı Başlık Seti', cmd: 'Üstte küçük kategori etiketi, altta büyük ana başlık içeren ikili set yap.', icon: 'ph-stack-simple' },
  { id: 't45', cat: 'manset', catName: 'Manşet & Spot', title: 'Rakamlı Dikkat Çekici Başlık', cmd: 'İstatistik veya rakam içeren merak uyandırıcı bir başlık hazırla.', icon: 'ph-number-circle-seven' },
  { id: 't46', cat: 'manset', catName: 'Manşet & Spot', title: 'Alıntı Başlığı', cmd: 'Yazının içinden en vurucu sözü tırnak içinde manşete taşı.', icon: 'ph-chat-circle-dots' },
  { id: 't47', cat: 'manset', catName: 'Manşet & Spot', title: 'Bunu Biliyor muydunuz?', cmd: 'Metinden ilginç bir detay çıkarıp "Bunu Biliyor muydunuz?" kutucuk başlığı yap.', icon: 'ph-lightbulb' },
  { id: 't48', cat: 'manset', catName: 'Manşet & Spot', title: 'BÜYÜK HARF Manşet', cmd: 'Başlığı büyük harfe (UPPERCASE) ve güçlü font dengesine uyarla.', icon: 'ph-text-b' },
  { id: 't49', cat: 'manset', catName: 'Manşet & Spot', title: 'Yazar İmzası ve Spotu', cmd: 'Başlığın altına yazar adını ve 1 satırlık biyografik tanıtım spotunu ekle.', icon: 'ph-user-circle' },
  { id: 't50', cat: 'manset', catName: 'Manşet & Spot', title: 'Dosya Konusu Manşeti', cmd: 'Derginin özel dosya konusu olduğunu vurgulayan tematik bir manşet oluştur.', icon: 'ph-folder-star' },

  // Kategori 4: Özetleme, Kısaltma ve Genişletme (15)
  { id: 't51', cat: 'ozet', catName: 'Özet & Boyut', title: 'Yarı Yarıya Kısalt', cmd: 'Metnin anlamını ve mesajını koruyarak uzunluğunu tam yarı yarıya indir.', icon: 'ph-arrows-in-line-vertical' },
  { id: 't52', cat: 'ozet', catName: 'Özet & Boyut', title: 'Tam 50 Kelimelik Hap Özet', cmd: 'Metni tam 50 kelimeden oluşan konsantre bir özet haline getir.', icon: 'ph-pill' },
  { id: 't53', cat: 'ozet', catName: 'Özet & Boyut', title: '5 Maddelik Özet', cmd: 'Bu metinden okuyucunun aklında kalması gereken 5 maddelik özet çıkar.', icon: 'ph-list-numbers' },
  { id: 't54', cat: 'ozet', catName: 'Özet & Boyut', title: 'Tek Cümlede Özetle', cmd: 'Tüm metnin ana fikrini tek bir güçlü ve unutulmaz cümlede açıkla.', icon: 'ph-lightning-slash' },
  { id: 't55', cat: 'ozet', catName: 'Özet & Boyut', title: 'Örneklerle Genişlet', cmd: 'Metne somut örnekler ve açıklamalar ekleyerek hacmini 1 paragraf uzat.', icon: 'ph-arrows-out-line-vertical' },
  { id: 't56', cat: 'ozet', catName: 'Özet & Boyut', title: 'Hikayeli Giriş Ekle', cmd: 'Giriş paragrafını okuyucuyu içine çeken kısa bir hikaye ile genişlet.', icon: 'ph-book-open' },
  { id: 't57', cat: 'ozet', catName: 'Özet & Boyut', title: 'Düşündürücü Kapanış', cmd: 'Sonuç kısmına okuyucuyu kendi hayatıyla yüzleştiren bir soru ekle.', icon: 'ph-arrow-fat-line-right' },
  { id: 't58', cat: 'ozet', catName: 'Özet & Boyut', title: 'Vurgulu Çekme Alıntı', cmd: 'Sayfa ortasında büyük tırnakla basılacak en vurucu 1 cümleyi alıntı yap.', icon: 'ph-chat-teardrop-text' },
  { id: 't59', cat: 'ozet', catName: 'Özet & Boyut', title: '3 Eşit Paragrafa Böl', cmd: 'Metni mizanpaj dengesi için kelime sayıları eşit 3 parçaya böl.', icon: 'ph-columns' },
  { id: 't60', cat: 'ozet', catName: 'Özet & Boyut', title: 'İnfografik Bilgi Kartı Yap', cmd: 'Metni dergi kenarında kullanılacak bir infografik bilgi kartı metnine dönüştür.', icon: 'ph-cards' },
  { id: 't61', cat: 'ozet', catName: 'Özet & Boyut', title: '1 Dakikalık Hızlı Okuma', cmd: 'Okuma süresi tam 60 saniye sürecek şekilde optimize et.', icon: 'ph-timer' },
  { id: 't62', cat: 'ozet', catName: 'Özet & Boyut', title: 'Sadeleştir ve Temizle', cmd: 'Yinelemeleri ve laf kalabalığını atarak sadece ana mesaja odaklan.', icon: 'ph-broom' },
  { id: 't63', cat: 'ozet', catName: 'Özet & Boyut', title: 'Neden-Nasıl-Ne Zaman', cmd: 'Metni "Neden, Nasıl ve Ne Zaman" sorularının cevabı olarak yapılandır.', icon: 'ph-tree-structure' },
  { id: 't64', cat: 'ozet', catName: 'Özet & Boyut', title: 'Sayfaya Sığdır (%20 Kısalt)', cmd: 'Metin kutusu taşmasını engellemek için metni %20 oranında sıkılaştır.', icon: 'ph-frame-corners' },
  { id: 't65', cat: 'ozet', catName: 'Özet & Boyut', title: 'Boşluğu Doldur (%25 Uzat)', cmd: 'Sayfadaki beyaz boşluğu doldurmak için edebi tasvirlerle zenginleştir.', icon: 'ph-paint-bucket' },

  // Kategori 5: Tipografi, Düzen ve Boşluklar (15)
  { id: 't66', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'İki Yana Yasla (Justify)', cmd: 'Metni dergi sütununa tam iki yana yaslanacak (justify) şekilde hizala.', icon: 'ph-text-align-justify' },
  { id: 't67', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Sayfada Yatay Ortala', cmd: 'Metin kutusunu dergi sayfasının tam yatay ortasına hizala.', icon: 'ph-text-align-center' },
  { id: 't68', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Sola Blok Hizalama', cmd: 'Metni modern sola hizalı ve sağ kenarı serbest bırakılmış diz.', icon: 'ph-text-align-left' },
  { id: 't69', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Ferah Satır Aralığı', cmd: 'Satır aralıklarını açarak gözü yormayan rahat bir dergi dizgisi yap.', icon: 'ph-arrows-vertical' },
  { id: 't70', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Kompakt Satır Aralığı', cmd: 'Satır aralıklarını daraltarak metni daha sıkı bir blok haline getir.', icon: 'ph-arrows-in-line-horizontal' },
  { id: 't71', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Harf Aralığını Aç (Tracking)', cmd: 'Harf aralıklarını açarak şık ve ferah bir başlık tipografisi oluştur.', icon: 'ph-arrows-horizontal' },
  { id: 't72', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Paragraf Başı Girintisi', cmd: 'Her paragrafın başına 4 boşluk klasik kitap girintisi (indent) ekle.', icon: 'ph-text-indent' },
  { id: 't73', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Süslü Başlangıç İnisiyali (Drop Cap)', cmd: 'İlk harfi 3 satır boyunda süslü Drop Cap inisiyaline dönüştür.', icon: 'ph-letter-circle-p' },
  { id: 't74', cat: 'tipografi', catName: 'Tipografi & Düzen', title: '2 Eşit Sütuna Böl', cmd: 'Metni anlamı bozmadan 2 dengeli sütunlu dergi mizanpajına ayır.', icon: 'ph-columns' },
  { id: 't75', cat: 'tipografi', catName: 'Tipografi & Düzen', title: '3 Eşit Sütuna Böl', cmd: 'Metni 3 eşit gazete sütununa bölerek sayfa genişliğine yay.', icon: 'ph-rows' },
  { id: 't76', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Puntoları %20 Büyüt', cmd: 'Okunabilirliği artırmak için yazı puntosunu %20 büyüt.', icon: 'ph-plus-circle' },
  { id: 't77', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Puntoları %15 Küçült', cmd: 'Sayfaya rahat sığması için yazı puntosunu %15 küçült.', icon: 'ph-minus-circle' },
  { id: 't78', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Kalın (Bold) Vurgu', cmd: 'Anahtar cümleleri ve önemli tarihleri kalın puntoyla vurgula.', icon: 'ph-text-b' },
  { id: 't79', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'İtalik Edebi Yazı', cmd: 'Yazıyı zarif edebi bir duruş için italik yazı karakterine uyarla.', icon: 'ph-text-italic' },
  { id: 't80', cat: 'tipografi', catName: 'Tipografi & Düzen', title: 'Paragraflar Arası Boşluk', cmd: 'Paragraflar arasına nefes alan estetik birer satır boşluk bırak.', icon: 'ph-split-horizontal' },

  // Kategori 6: Yabancı Dil ve Tercüme (10)
  { id: 't81', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'İngilizceye Çevir', cmd: 'Bu Türkçe metni akıcı ve edebi bir İngilizceye tercüme et.', icon: 'ph-translate' },
  { id: 't82', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'İngilizceden Türkçeye', cmd: 'İngilizce metni Türkçe dil zenginliğine uygun akıcı şekilde çevir.', icon: 'ph-globe' },
  { id: 't83', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'Almancaya Çevir', cmd: 'Metni kurumsal ve doğru bir Almancaya tercüme et.', icon: 'ph-flag-banner' },
  { id: 't84', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'Fransızcaya Çevir', cmd: 'Metni zarif ve edebi bir Fransızcaya tercüme et.', icon: 'ph-sparkle' },
  { id: 't85', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'İki Dilli (TR + EN) Sütun', cmd: 'Metni yan yana sol Türkçe sağ İngilizce iki dilli format haline getir.', icon: 'ph-split-vertical' },
  { id: 't86', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'Akademik C1 İngilizce', cmd: 'Uluslararası okul dergileri için ileri düzey akademik İngilizceye uyarla.', icon: 'ph-graduation-cap' },
  { id: 't87', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'Kavram Sözlüğü Ekle', cmd: 'Yazıdaki yabancı terimlerin altına 1 satırlık Türkçe anlamlarını listele.', icon: 'ph-book-bookmark' },
  { id: 't88', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'Kültürel Yerelleştirme', cmd: 'Deyim ve kalıpları hedef dilin kültürüne uygun şekilde adapte et.', icon: 'ph-map-pin' },
  { id: 't89', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'Karakter Sınırını Koru', cmd: 'Tercüme ederken dergi sayfa mizanpajına taşmaması için uzunluğu koru.', icon: 'ph-ruler' },
  { id: 't90', cat: 'ceviri', catName: 'Tercüme & Çeviri', title: 'İngilizce Abstract (Özet)', cmd: 'Metnin sonuna 2 cümlelik İngilizce özet (Abstract) ekle.', icon: 'ph-notepad' },

  // Kategori 7: Edebi ve Yaratıcı Türler (10)
  { id: 't91', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Hece Vezinli Şiir', cmd: 'Bu metnin duygusunu 4 kıtalık hece vezinli ve kafiyeli bir şiire dönüştür.', icon: 'ph-pen-nib' },
  { id: 't92', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Serbest Ölçülü Şiir', cmd: 'Metni çağdaş Türk edebiyatı tarzında serbest ölçülü bir şiir haline getir.', icon: 'ph-waves' },
  { id: 't93', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Söyleşi & Röportaj Formatı', cmd: 'Metni [Soru] ve [Cevap] bloklarından oluşan sürükleyici bir söyleşiye çevir.', icon: 'ph-microphone-stage' },
  { id: 't94', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Öğrenci Günlüğü Notu', cmd: 'Bu yazıyı "Sevgili Günlük" diye başlayan samimi bir hatıra defterine dönüştür.', icon: 'ph-notebook' },
  { id: 't95', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Tiyatro & Piyes Sahnesi', cmd: 'Metni iki öğrencinin sahnede konuştuğu canlı bir tiyatro diyaloğu yap.', icon: 'ph-mask-happy' },
  { id: 't96', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Açık Mektup', cmd: '"Değerli Gençler ve Sevgili Okurlar" diye başlayan sıcak bir açık mektuba çevir.', icon: 'ph-envelope-open' },
  { id: 't97', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Seyahatname Tasviri', cmd: 'Evliya Çelebi esintisiyle canlı sokak tasvirleri içeren bir gezi yazısı yap.', icon: 'ph-compass' },
  { id: 't98', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Deney Seyir Defteri', cmd: 'Bir genç bilim insanının laboratuvardaki heyecanlı notları gibi kurgula.', icon: 'ph-flask' },
  { id: 't99', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Münazara Tezi', cmd: 'Konuyu çarpıcı kanıtlarla savunan güçlü bir fikir münazarası metni yap.', icon: 'ph-scales' },
  { id: 't100', cat: 'yaratici', catName: 'Edebi & Türler', title: 'Felsefi Deneme (Montaigne)', cmd: 'İnsan ruhunu ve zamanı irdeleyen felsefi bir dergi denemesi kaleme al.', icon: 'ph-brain' }
];

// ============================================================================
// 2. GÖRSEL İÇİN 100 HAZIR AI KOMUTU (7 KATEGORİ)
// ============================================================================
window.AI_IMAGE_PROMPT_LIBRARY = [
  // Kategori 1: Dekupe, Arka Plan ve Katmanlama (15)
  { id: 'i1', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Arka Planı Kaldır (Dekupe)', cmd: 'Fotoğrafın arka planını kaldırıp şeffaf PNG haline getir.', icon: 'ph-scissors', vision: true },
  { id: 'i2', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Metni Başın Arkasına Al', cmd: 'TIME / Vogue dergisi tarzında başlığı kişinin arkasından geçir (Derinlik efekti).', icon: 'ph-layers', vision: true },
  { id: 'i3', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Arka Planı Bulanıklaştır', cmd: 'Arka plana hafif derinlik (bokeh) vererek portreyi öne çıkar.', icon: 'ph-aperture', vision: true },
  { id: 'i4', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Yumuşak Gölge Ver', cmd: 'Görselin altına zarif ve doğal bir derinlik gölgesi ekle.', icon: 'ph-sun' },
  { id: 'i5', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Kenarları Yumuşat (Feather)', cmd: 'Görselin kenarlarını arka planla pürüzsüzce kaynaştır.', icon: 'ph-feather' },
  { id: 'i6', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Beyaz Çıkartma Konturu', cmd: 'Görsele dergi çıkartması gibi 4px beyaz parlak kontur çerçeve ekle.', icon: 'ph-sticker' },
  { id: 'i7', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Stüdyo Beyaz Fonu', cmd: 'Arka planı pürüzsüz stüdyo beyazı fonuna dönüştür.', icon: 'ph-paint-bucket' },
  { id: 'i8', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Koyu Lacivert Dergi Fonu', cmd: 'Arka planı koyu lacivert kurumsal dergi zeminine dönüştür.', icon: 'ph-moon' },
  { id: 'i9', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Bir Katman Öne Getir', cmd: 'Görseli katman sırasında bir adım öne taşı.', icon: 'ph-arrow-up' },
  { id: 'i10', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Bir Katman Arkaya Gönder', cmd: 'Görseli katman sırasında bir adım arkaya gönder.', icon: 'ph-arrow-down' },
  { id: 'i11', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Sayfa Zeminine Al', cmd: 'Görseli tüm nesnelerin en arkasına sayfa arka planı olarak yerleştir.', icon: 'ph-intersect' },
  { id: 'i12', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'En Öne Al', cmd: 'Görseli sayfadaki tüm yazıların ve kutuların en önüne al.', icon: 'ph-arrow-fat-line-up' },
  { id: 'i13', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Ön Planı Klonla', cmd: 'Dekupe edilen nesneyi klonlayıp 3 boyutlu katman derinliği oluştur.', icon: 'ph-copy' },
  { id: 'i14', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Hafif Pastel Doku', cmd: 'Arka plana gözü yormayan sıcak bir pastel kağıt dokusu bindir.', icon: 'ph-file-text' },
  { id: 'i15', cat: 'dekupe', catName: 'Dekupe & Zemin', title: 'Altın Oran Konumlandırma', cmd: 'Portreyi sayfanın altın oran dikey ve yatay çizgisine oturt.', icon: 'ph-grid-nine' },

  // Kategori 2: Yüz, Özne ve Altın Oran Odaklama (15)
  { id: 'i16', cat: 'odak', catName: 'Yüz & Odak', title: 'Yüzü Otomatik Ortala', cmd: 'Gemini Vision ile insan yüzünü tespit et ve çerçevede merkeze al.', icon: 'ph-crosshair', vision: true },
  { id: 'i17', cat: 'odak', catName: 'Yüz & Odak', title: 'Kafayı Kesmeden Hizala', cmd: 'Fotoğraftaki kişinin saç ve baş üstü mesafesini altın oranda ayarla.', icon: 'ph-user-focus', vision: true },
  { id: 'i18', cat: 'odak', catName: 'Yüz & Odak', title: 'İki Kişiyi Dengele', cmd: 'Fotoğraftaki iki kişinin arasındaki boşluğu çerçevenin ortasına oturt.', icon: 'ph-users', vision: true },
  { id: 'i19', cat: 'odak', catName: 'Yüz & Odak', title: 'Yakın Portre Odağı', cmd: 'Çerçeve içinde yüz detayını öne çıkaracak şekilde yakınlaştır (Zoom).', icon: 'ph-magnifying-glass-plus' },
  { id: 'i20', cat: 'odak', catName: 'Yüz & Odak', title: 'Geniş Sahne Gösterimi', cmd: 'Çerçeve içinde uzaklaşarak çevreyi ve ortamı tam göster.', icon: 'ph-magnifying-glass-minus' },
  { id: 'i21', cat: 'odak', catName: 'Yüz & Odak', title: 'Bakış Yönü Boşluğu', cmd: 'Kişinin baktığı yöne doğru dergi nefes payı bırak.', icon: 'ph-eye', vision: true },
  { id: 'i22', cat: 'odak', catName: 'Yüz & Odak', title: 'Grup Fotoğrafı Dengesi', cmd: 'Kalabalık okul grubu fotoğrafını tüm hücreye eşit sığdır.', icon: 'ph-users-three', vision: true },
  { id: 'i23', cat: 'odak', catName: 'Yüz & Odak', title: 'Dikey 1/3 Kuralı', cmd: 'Yüzü fotoğrafın üst 1/3 kural çizgisine tam hizala.', icon: 'ph-align-top' },
  { id: 'i24', cat: 'odak', catName: 'Yüz & Odak', title: 'Yatay 1/3 Kuralı', cmd: 'Ana nesneyi çerçevenin sol 1/3 çizgisine yerleştir.', icon: 'ph-align-left' },
  { id: 'i25', cat: 'odak', catName: 'Yüz & Odak', title: 'Kontrastla Odaklama', cmd: 'Ana öznenin aydınlığını artırıp çevreyi hafif gölgele.', icon: 'ph-sun-dim' },
  { id: 'i26', cat: 'odak', catName: 'Yüz & Odak', title: 'Daire Çerçeveye Odakla', cmd: 'Tam daire çerçeve maskesinin içine yüzü kusursuz ortala.', icon: 'ph-circle' },
  { id: 'i27', cat: 'odak', catName: 'Yüz & Odak', title: 'Polaroid Kartına Oturt', cmd: 'Fotoğrafı beyaz alt yazılı nostaljik Polaroid karta oturt.', icon: 'ph-camera' },
  { id: 'i28', cat: 'odak', catName: 'Yüz & Odak', title: 'Akıllı Telefon Mockup', cmd: 'Fotoğrafı modern bir akıllı telefon çerçevesinin içine yerleştir.', icon: 'ph-device-mobile' },
  { id: 'i29', cat: 'odak', catName: 'Yüz & Odak', title: 'Monitör & Laptop Mockup', cmd: 'Görüntüyü masaüstü bilgisayar ekranına perspektifiyle oturt.', icon: 'ph-desktop' },
  { id: 'i30', cat: 'odak', catName: 'Yüz & Odak', title: 'Sinema Film Şeridi', cmd: 'Görseli 35mm sinema film şeridi çerçevesine yerleştir.', icon: 'ph-film-strip' },

  // Kategori 3: Sanat Filtreleri ve Stil Transferi (20)
  { id: 'i31', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Karakalem Portre', cmd: 'Fotoğrafı detaylı bir kurşun kalem eskiz çizimine dönüştür.', icon: 'ph-pencil' },
  { id: 'i32', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Suluboya Edebi Resim', cmd: 'Fotoğrafa zarif bir edebiyat dergisi suluboya efekti uygula.', icon: 'ph-palette' },
  { id: 'i33', cat: 'filtre', catName: 'Sanat Filtreleri', title: '1923 Cumhuriyet Arşivi', cmd: 'Fotoğrafa 1920\'ler sepya nostaljik tarihi gazete arşivi dokusu ver.', icon: 'ph-archive' },
  { id: 'i34', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Pop-Art Çizgi Roman', cmd: 'Yüksek doygunluk ve net konturlarla Pop-Art afiş tarzı yap.', icon: 'ph-sparkle' },
  { id: 'i35', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Sinematik Siyah-Beyaz', cmd: 'Dramatik yüksek kontrastlı siyah-beyaz sanat fotoğrafı yap.', icon: 'ph-camera-rotate' },
  { id: 'i36', cat: 'filtre', catName: 'Sanat Filtreleri', title: '70\'ler Retro Film', cmd: 'Sıcak sarımsı tonlarda vintage 1970 dergisi havası ver.', icon: 'ph-hourglass-simple' },
  { id: 'i37', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Pastel Şiir Dergisi', cmd: 'Renkleri dinginleştirerek sakin ve pastel edebi tonlama yap.', icon: 'ph-flower-lotus' },
  { id: 'i38', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Yağlı Boya Tablo', cmd: 'Fotoğrafı fırça darbeleri belirgin bir yağlı boya tablosuna dönüştür.', icon: 'ph-paint-brush-broad' },
  { id: 'i39', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Gravür Taş Baskı', cmd: 'Tarih kitaplarındaki ahşap oyma ve gravür baskı hissi ver.', icon: 'ph-book-open-text' },
  { id: 'i40', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Minimalist Monokrom', cmd: 'Yalnızca tek bir tonun gölgelerinden oluşan sade monokrom yap.', icon: 'ph-square-half' },
  { id: 'i41', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Altın Saat (Golden Hour)', cmd: 'Sıcak gün batımı altın ışığı ve yumuşak parıltı ekle.', icon: 'ph-sun-horizon' },
  { id: 'i42', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Kuzey Işığı Soğuk Ton', cmd: 'Fotoğrafa serin mavi sinematik bir kış atmosferi kazandır.', icon: 'ph-snowflake' },
  { id: 'i43', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Neon Siber Gelecek', cmd: 'Teknoloji dergileri için neon mavi ve pembe tonlama ver.', icon: 'ph-lightning' },
  { id: 'i44', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Noktalı Tram Baskı (Halftone)', cmd: 'Eski gazete kupürlerindeki noktalı tram baskı dokusunu uygula.', icon: 'ph-dots-nine' },
  { id: 'i45', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Analog Film Greni', cmd: 'Fotoğrafa 35mm Kodak film greni ve sıcaklığı ekle.', icon: 'ph-film-slate' },
  { id: 'i46', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Canlı HDR Manzara', cmd: 'Görselin renk derinliğini ve dinamik aralığını maksimuma çıkar.', icon: 'ph-mountains' },
  { id: 'i47', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Duotone: Mavi - Amber', cmd: 'Kapak için iki renkli (Lacivert ve Kehribar) afiş stili yap.', icon: 'ph-paint-roller' },
  { id: 'i48', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Duotone: Bordo - Krem', cmd: 'Edebiyat sayısı için iki renkli (Bordo ve Krem) zarif stil yap.', icon: 'ph-eyedropper' },
  { id: 'i49', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Polarize Netlik', cmd: 'Gereksiz yansımaları silip gökyüzünü ve nesneleri doygunlaştır.', icon: 'ph-sunglasses' },
  { id: 'i50', cat: 'filtre', catName: 'Sanat Filtreleri', title: 'Filtreleri Sıfırla', cmd: 'Tüm efektleri kaldırıp fotoğrafın orijinal doğal haline dön.', icon: 'ph-arrows-clockwise' },

  // Kategori 4: Renk Paleti, Tonlama ve Işık (15)
  { id: 'i51', cat: 'renk', catName: 'Renk & Işık', title: 'Sayfaya Renk Paleti Giydir', cmd: 'Görselin renklerini analiz edip sayfa başlıklarına ve kartlarına uyarla.', icon: 'ph-palette', vision: true },
  { id: 'i52', cat: 'renk', catName: 'Renk & Işık', title: 'Otomatik Işık & Kontrast', cmd: 'Fotoğrafın parlaklığını ve kontrast dengesini otomatik iyileştir.', icon: 'ph-sliders-horizontal' },
  { id: 'i53', cat: 'renk', catName: 'Renk & Işık', title: 'Karanlık Gölgeleri Aç', cmd: 'Karanlıkta kalmış yüzleri ve ayrıntıları aydınlat.', icon: 'ph-flashlight' },
  { id: 'i54', cat: 'renk', catName: 'Renk & Işık', title: 'Parlama Alanlarını Kıs', cmd: 'Fazla ışık almış patlamış beyaz alanları dengele.', icon: 'ph-sun-horizon' },
  { id: 'i55', cat: 'renk', catName: 'Renk & Işık', title: 'Canlılığı (Vibrance) Artır', cmd: 'Soluk renkleri canlandırıp baskıya uygun doygunluğa getir.', icon: 'ph-sparkle' },
  { id: 'i56', cat: 'renk', catName: 'Renk & Işık', title: 'Doygunluğu Hafif Kıs', cmd: 'Aşırı parlak renkleri gözü dinlendiren seviyeye çek.', icon: 'ph-drop-half' },
  { id: 'i57', cat: 'renk', catName: 'Renk & Işık', title: 'Doğal Ten Rengi Dengesi', cmd: 'Öğrenci ve öğretmen yüzlerindeki ten rengini pürüzsüzleştir.', icon: 'ph-face-mask' },
  { id: 'i58', cat: 'renk', catName: 'Renk & Işık', title: 'Sıcak Kehribar Sıcaklığı', cmd: 'Fotoğrafa tatlı bir güneş sıcaklığı kat.', icon: 'ph-fire' },
  { id: 'i59', cat: 'renk', catName: 'Renk & Işık', title: 'Serin Kristal Mavisi', cmd: 'Görsele berrak ve ferah serin bir ton ver.', icon: 'ph-drop' },
  { id: 'i60', cat: 'renk', catName: 'Renk & Işık', title: 'Beyaz Ayarını Düzelt (WB)', cmd: 'Sarı veya yeşil kaçan renk dengesini nötr beyaz yap.', icon: 'ph-crosshair-simple' },
  { id: 'i61', cat: 'renk', catName: 'Renk & Işık', title: 'Zemini Görsele Uyarla', cmd: 'Sayfanın arka plan rengini bu fotoğrafın ana tonu yap.', icon: 'ph-frame-corners', vision: true },
  { id: 'i62', cat: 'renk', catName: 'Renk & Işık', title: 'Başlığı Görsele Uyarla', cmd: 'Sayfa başlığının rengini bu fotoğraftaki en canlı vurgu rengi yap.', icon: 'ph-text-aa', vision: true },
  { id: 'i63', cat: 'renk', catName: 'Renk & Işık', title: 'Kartı Görsele Uyarla', cmd: 'Metin arkasındaki kartın rengini fotoğrafın uyumlu tonu yap.', icon: 'ph-cards', vision: true },
  { id: 'i64', cat: 'renk', catName: 'Renk & Işık', title: 'Kenar Karartması (Vignette)', cmd: 'Fotoğrafın dört köşesine hafif sinematik karartma ekle.', icon: 'ph-circle-dashed' },
  { id: 'i65', cat: 'renk', catName: 'Renk & Işık', title: 'S-Curve Derinlik Kontrastı', cmd: 'Fotoğrafa dergi kapağı kalitesinde S-eğrisi kontrastı ver.', icon: 'ph-chart-line' },

  // Kategori 5: Geometri, Açı ve Çerçeveler (15)
  { id: 'i66', cat: 'geometri', catName: 'Geometri & Açı', title: 'Sağa 90° Döndür', cmd: 'Görseli saat yönünde sağa 90 derece döndür.', icon: 'ph-arrow-clockwise' },
  { id: 'i67', cat: 'geometri', catName: 'Geometri & Açı', title: 'Sola 90° Döndür', cmd: 'Görseli saat yönünün tersine sola 90 derece döndür.', icon: 'ph-arrow-counter-clockwise' },
  { id: 'i68', cat: 'geometri', catName: 'Geometri & Açı', title: 'Sağa 5° Tatlı Eğim', cmd: 'Görsele dergi kolajı havasında sağa 5 derece eğim ver.', icon: 'ph-arrows-clockwise' },
  { id: 'i69', cat: 'geometri', catName: 'Geometri & Açı', title: 'Sola 5° Tatlı Eğim', cmd: 'Görsele sola 5 derece hafif tatlı eğim ver.', icon: 'ph-arrows-counter-clockwise' },
  { id: 'i70', cat: 'geometri', catName: 'Geometri & Açı', title: 'Açıyı Sıfırla (Tam Dik)', cmd: 'Fotoğrafın eğimini sıfırlayıp tam dik konuma getir.', icon: 'ph-ruler' },
  { id: 'i71', cat: 'geometri', catName: 'Geometri & Açı', title: 'Yatay Aynala (Flip X)', cmd: 'Görseli yatay olarak sağdan sola ters çevir.', icon: 'ph-arrows-left-right' },
  { id: 'i72', cat: 'geometri', catName: 'Geometri & Açı', title: 'Dikey Aynala (Flip Y)', cmd: 'Görseli dikey olarak yukarıdan aşağı ters çevir.', icon: 'ph-arrows-down-up' },
  { id: 'i73', cat: 'geometri', catName: 'Geometri & Açı', title: 'Tam Daire Maske', cmd: 'Fotoğrafı yuvarlak tam daire maske içine al.', icon: 'ph-circle' },
  { id: 'i74', cat: 'geometri', catName: 'Geometri & Açı', title: 'Kemer (Arch) Maske', cmd: 'Fotoğrafın üstünü kemer şeklinde yuvarla.', icon: 'ph-egg' },
  { id: 'i75', cat: 'geometri', catName: 'Geometri & Açı', title: 'Yıldız Maske', cmd: 'Fotoğrafı çok köşeli yıldız çerçeve içine al.', icon: 'ph-star' },
  { id: 'i76', cat: 'geometri', catName: 'Geometri & Açı', title: 'Elmas / Baklava Maske', cmd: 'Fotoğrafı 45 derece elmas çerçeve içine al.', icon: 'ph-diamonds-four' },
  { id: 'i77', cat: 'geometri', catName: 'Geometri & Açı', title: 'Altıgen Maske', cmd: 'Fotoğrafı modern altıgen petek çerçeve içine al.', icon: 'ph-hexagon' },
  { id: 'i78', cat: 'geometri', catName: 'Geometri & Açı', title: 'Köşeleri 24px Yuvarlat', cmd: 'Fotoğrafın sivri köşelerini 24 piksel yumuşak yuvarlat.', icon: 'ph-corners-out' },
  { id: 'i79', cat: 'geometri', catName: 'Geometri & Açı', title: 'Köşeleri 48px Yuvarlat', cmd: 'Fotoğrafın köşelerini 48 piksel belirgin yuvarlat.', icon: 'ph-corners-in' },
  { id: 'i80', cat: 'geometri', catName: 'Geometri & Açı', title: 'Sayfada Tam Merkeze Al', cmd: 'Fotoğrafı dergi sayfasının hem dikey hem yatay merkezine oturt.', icon: 'ph-arrows-in-cardinal' },

  // Kategori 6: Netleştirme ve Baskı Kalitesi (10)
  { id: 'i81', cat: 'kalite', catName: 'Netlik & Baskı', title: 'Akıllı Keskinleştirme (Unsharp)', cmd: 'Unsharp Mask filtresi ile fotoğrafın bulanıklığını gider.', icon: 'ph-magic-wand' },
  { id: 'i82', cat: 'kalite', catName: 'Netlik & Baskı', title: 'Gren ve Parazit Temizle', cmd: 'Düşük ışıkta çekilmiş grenli fotoğrafları pürüzsüzleştir.', icon: 'ph-sparkle' },
  { id: 'i83', cat: 'kalite', catName: 'Netlik & Baskı', title: '300 DPI Matbaa Netliği', cmd: 'Fotoğrafı matbaa basımına uygun netlik standardına getir.', icon: 'ph-printer' },
  { id: 'i84', cat: 'kalite', catName: 'Netlik & Baskı', title: 'Saç ve Yüz Detayları', cmd: 'Portredeki göz, saç ve yüz çizgilerini belirginleştir.', icon: 'ph-user' },
  { id: 'i85', cat: 'kalite', catName: 'Netlik & Baskı', title: 'Bulanık Alanları Kurtar', cmd: 'Hafif titrek çıkmış bulanık alanları toparla.', icon: 'ph-activity' },
  { id: 'i86', cat: 'kalite', catName: 'Netlik & Baskı', title: 'JPEG Sıkıştırma Onar', cmd: 'WhatsApp üzerinden gelen bozulmuş pikselleri düzelt.', icon: 'ph-file-image' },
  { id: 'i87', cat: 'kalite', catName: 'Netlik & Baskı', title: 'Doku Ayrıntılarını Parlat', cmd: 'Kumaş, kağıt ve mimari dokuları öne çıkar.', icon: 'ph-texture' },
  { id: 'i88', cat: 'kalite', catName: 'Netlik & Baskı', title: 'Göz Bebeği Işığı', cmd: 'Portredeki gözlerin içine canlı stüdyo ışıltısı kat.', icon: 'ph-eye' },
  { id: 'i89', cat: 'kalite', catName: 'Netlik & Baskı', title: 'Mikro-Kontrast Derinliği', cmd: 'Mikro-kontrastı artırarak 3 boyutlu derinlik hissi kat.', icon: 'ph-cube' },
  { id: 'i90', cat: 'kalite', catName: 'Netlik & Baskı', title: 'Matbaa Renk Provası', cmd: 'CMYK baskıda renklerin solmaması için profili optimize et.', icon: 'ph-shield-check' },

  // Kategori 7: OCR ve Görsel Analiz (10)
  { id: 'i91', cat: 'analiz', catName: 'OCR & Analiz', title: 'Görseldeki Yazıları Oku (OCR)', cmd: 'Fotoğraftaki veya belgedeki tüm yazıları okuyup tuvale metin yap.', icon: 'ph-text-t', vision: true },
  { id: 'i92', cat: 'analiz', catName: 'OCR & Analiz', title: 'Haber Alt Yazısı Üret', cmd: 'Fotoğrafı analiz edip altına 1 cümlelik haber alt yazısı ekle.', icon: 'ph-chats-circle', vision: true },
  { id: 'i93', cat: 'analiz', catName: 'OCR & Analiz', title: 'Çarpıcı Başlık Öner', cmd: 'Fotoğrafın temasına uygun 3 adet vurucu dergi başlığı öner.', icon: 'ph-lightbulb', vision: true },
  { id: 'i94', cat: 'analiz', catName: 'OCR & Analiz', title: 'Objeleri ve Kişileri Listele', cmd: 'Fotoğraftaki ana nesneleri ve kişileri tespit edip listele.', icon: 'ph-list-magnifying-glass', vision: true },
  { id: 'i95', cat: 'analiz', catName: 'OCR & Analiz', title: 'Renk Dağılımını Raporla', cmd: 'Fotoğraftaki baskın renklerin yüzdelik oranlarını çıkar.', icon: 'ph-chart-pie', vision: true },
  { id: 'i96', cat: 'analiz', catName: 'OCR & Analiz', title: 'El Yazısı / Belge Çözümle', cmd: 'Eski el yazması veya tarihi mektuptaki yazıları dijitalleştir.', icon: 'ph-pencil-line', vision: true },
  { id: 'i97', cat: 'analiz', catName: 'OCR & Analiz', title: 'Kompozisyon Kalite Puanı', cmd: 'Fotoğrafın kompozisyonuna 100 üzerinden editoryal puan ver.', icon: 'ph-star-half', vision: true },
  { id: 'i98', cat: 'analiz', catName: 'OCR & Analiz', title: 'Duygu ve Atmosfer Analizi', cmd: 'Fotoğrafın yarattığı duyguyu ve atmosferi 1 cümleyle açıkla.', icon: 'ph-heart-straight', vision: true },
  { id: 'i99', cat: 'analiz', catName: 'OCR & Analiz', title: 'Kıyafet & Yaş Grubu', cmd: 'Fotoğraftaki öğrencilerin yaş grubunu ve giyim tarzını analiz et.', icon: 'ph-t-shirt', vision: true },
  { id: 'i100', cat: 'analiz', catName: 'OCR & Analiz', title: 'Mekan ve Çevre Analizi', cmd: 'Fotoğrafın nerede çekildiğini (kütüphane, laboratuvar, açık hava) tespit et.', icon: 'ph-map-pin', vision: true }
];

// ============================================================================
// 3. 100+100 AI KOMUT KÜTÜPHANESİ MODAL KONTROLCÜSÜ
// ============================================================================
let activePromptLibTab = 'text';
let activePromptLibCategory = 'all';

window._aiLivePreviewOriginalSnapshot = null;
window._aiLivePreviewActiveTarget = null;

window.updatePromptLibTargetInfo = function() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  const disp = document.getElementById('aiActiveObjDisplay');
  if (!disp) return;

  if (!active) {
    disp.textContent = 'Nesne seçilmedi (Tuvaldeki bir metne veya resme tıklayın)';
    disp.className = 'text-slate-400 font-normal italic';
    return;
  }

  const isImg = active.type === 'image' || active.isGridSlot;
  const isTxt = active.type === 'textbox' || active.type === 'i-text';
  const name = active.name || (isImg ? 'Görsel / Fotoğraf' : (isTxt ? 'Metin Kutusu' : 'Öğe'));

  disp.textContent = `${name} (${isImg ? 'Görsel' : (isTxt ? 'Metin' : active.type)})`;
  disp.className = isImg ? 'text-sky-300 font-bold font-mono' : 'text-amber-300 font-bold font-mono';
};

window.openAiPromptLibraryModal = function(initialTab = null) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;

  if (!initialTab) {
    if (active && (active.type === 'image' || active.isGridSlot)) {
      initialTab = 'image';
    } else {
      initialTab = 'text';
    }
  }

  activePromptLibTab = initialTab;
  activePromptLibCategory = 'all';
  switchPromptLibraryTab(initialTab);
  updatePromptLibTargetInfo();

  // Sabit önizleme çubuğunu sıfırla
  const stickyBar = document.getElementById('aiLivePreviewStickyBar');
  if (stickyBar) stickyBar.classList.add('hidden');
  window._aiLivePreviewOriginalSnapshot = null;
  window._aiLivePreviewActiveTarget = null;

  // Çekmeceyi aç
  openModal('aiPromptLibraryModal');
};

window.switchPromptLibraryTab = function(tabName) {
  activePromptLibTab = tabName;
  activePromptLibCategory = 'all';

  const btnText = document.getElementById('btnPromptLibTab_text');
  const btnImg = document.getElementById('btnPromptLibTab_image');
  const badge = document.getElementById('aiPromptLibTargetBadge');

  if (tabName === 'text') {
    if (btnText) btnText.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition bg-amber-500 text-slate-950 shadow';
    if (btnImg) btnImg.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition text-slate-300 hover:text-white';
    if (badge) {
      badge.textContent = 'Metin (100)';
      badge.className = 'text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold';
    }
  } else {
    if (btnText) btnText.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition text-slate-300 hover:text-white';
    if (btnImg) btnImg.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition bg-sky-500 text-slate-950 shadow';
    if (badge) {
      badge.textContent = 'Görsel (100)';
      badge.className = 'text-[9px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold';
    }
  }

  const searchInp = document.getElementById('promptLibSearchInput');
  if (searchInp) searchInp.value = '';

  renderPromptLibCategories();
  renderPromptLibCards();
};

function renderPromptLibCategories() {
  const container = document.getElementById('promptLibCategoryPills');
  if (!container) return;

  const dataset = activePromptLibTab === 'text' ? window.AI_TEXT_PROMPT_LIBRARY : window.AI_IMAGE_PROMPT_LIBRARY;
  const categories = ['all'];
  const catNames = { all: 'Tümü' };

  dataset.forEach(item => {
    if (!categories.includes(item.cat)) {
      categories.push(item.cat);
      catNames[item.cat] = item.catName;
    }
  });

  container.innerHTML = categories.map(cat => {
    const isAct = activePromptLibCategory === cat;
    return `
      <button onclick="setPromptLibCategory('${cat}')" class="px-2 py-0.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition ${isAct ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'}">
        ${catNames[cat]}
      </button>
    `;
  }).join('');
}

window.setPromptLibCategory = function(cat) {
  activePromptLibCategory = cat;
  renderPromptLibCategories();
  renderPromptLibCards();
};

window.filterPromptLibraryCards = function(query) {
  renderPromptLibCards(query);
};

function renderPromptLibCards(query = '') {
  const grid = document.getElementById('promptLibCardsGrid');
  const countBadge = document.getElementById('promptLibCountBadge');
  if (!grid) return;

  const dataset = activePromptLibTab === 'text' ? window.AI_TEXT_PROMPT_LIBRARY : window.AI_IMAGE_PROMPT_LIBRARY;
  const qLower = String(query || '').toLowerCase().trim();

  const filtered = dataset.filter(item => {
    const matchCat = (activePromptLibCategory === 'all') || (item.cat === activePromptLibCategory);
    if (!matchCat) return false;
    if (!qLower) return true;
    return item.title.toLowerCase().includes(qLower) ||
           item.cmd.toLowerCase().includes(qLower) ||
           item.catName.toLowerCase().includes(qLower);
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Komut`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-8 text-center text-slate-400">
        <i class="ph ph-magnifying-glass text-2xl mb-1 text-slate-600 block"></i>
        <span class="text-xs">Aradığınız kriterde komut bulunamadı.</span>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 transition flex flex-col justify-between group shadow-sm">
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
            ${item.catName}
          </span>
          <i class="ph ${item.icon || 'ph-sparkle'} text-amber-400 text-xs"></i>
        </div>
        <div class="font-bold text-[11.5px] text-white group-hover:text-amber-300 transition truncate">
          ${item.title}
        </div>
        <p class="text-[9.5px] text-slate-400 line-clamp-2 leading-tight">
          ${item.cmd}
        </p>
      </div>
      <div class="pt-2 mt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1">
        <button onclick="applyLibraryPromptLive('${item.cmd.replace(/'/g, "\\'")}', ${Boolean(item.vision)}, true)" class="px-2 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-600/50 text-sky-300 text-[9.5px] font-bold flex items-center gap-1 transition" title="Tuvalde canlı dene">
          <i class="ph ph-eye"></i> Önizle
        </button>
        <button onclick="applyLibraryPromptLive('${item.cmd.replace(/'/g, "\\'")}', ${Boolean(item.vision)}, false)" class="flex-1 px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center gap-1 shadow transition">
          <i class="ph ph-check"></i> Uygula
        </button>
      </div>
    </div>
  `).join('');
}

window.applyLibraryPromptLive = async function(cmdText, isVision = false, isPreview = false) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;

  if (!active) {
    showToast('Lütfen önce sol taraftaki dergi sayfasında düzenlemek istediğiniz metne veya görsele tıklayın.');
    return;
  }

  // İlk önizleme veya farklı bir nesne seçildiyse orijinal durumun kopyasını al
  if (window._aiLivePreviewActiveTarget !== active) {
    window._aiLivePreviewActiveTarget = active;
    try {
      window._aiLivePreviewOriginalSnapshot = JSON.stringify(active.toObject(window.FABRIC_PERSIST_PROPS || []));
    } catch(err) {
      window._aiLivePreviewOriginalSnapshot = null;
    }
  }

  // Komut kutusuna yaz
  const inlineInp = document.getElementById('inlineAiMagicInput');
  if (inlineInp) inlineInp.value = cmdText;

  // Sabit aksiyon çubuğunu güncelle ve göster
  const stickyBar = document.getElementById('aiLivePreviewStickyBar');
  const stickyCmd = document.getElementById('aiLivePreviewActiveCmd');
  if (stickyBar && stickyCmd) {
    stickyCmd.textContent = cmdText;
    stickyBar.classList.remove('hidden');
  }

  updatePromptLibTargetInfo();
  showToast(`👁️ [Canlı Önizleme] ${cmdText}`);
  await runSmartElementAICommand(cmdText, isVision ? 'vision' : 'auto');

  if (!isPreview) {
    commitAiLivePreview();
  }
};

window.revertAiLivePreview = function() {
  const fCanvas = getCurrentFabricCanvas();
  if (!fCanvas || !window._aiLivePreviewActiveTarget || !window._aiLivePreviewOriginalSnapshot) {
    showToast('Geri alınacak önizleme kaydı bulunamadı.');
    return;
  }

  const target = window._aiLivePreviewActiveTarget;
  try {
    const origData = JSON.parse(window._aiLivePreviewOriginalSnapshot);
    target.set(origData);
    if (typeof applyImageCornerAndMask === 'function' && target.type === 'image') {
      applyImageCornerAndMask(target, target.maskType, target.cornerRadiusPx);
    }
    target.setCoords();
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);

    const stickyBar = document.getElementById('aiLivePreviewStickyBar');
    if (stickyBar) stickyBar.classList.add('hidden');
    window._aiLivePreviewOriginalSnapshot = null;
    window._aiLivePreviewActiveTarget = null;
    showToast('↩️ Orijinal haline geri döndürüldü.');
  } catch(err) {
    console.error('Revert error:', err);
    showToast('Orijinal durum geri yüklenemedi.');
  }
};

window.commitAiLivePreview = function() {
  const stickyBar = document.getElementById('aiLivePreviewStickyBar');
  if (stickyBar) stickyBar.classList.add('hidden');
  window._aiLivePreviewOriginalSnapshot = null;
  window._aiLivePreviewActiveTarget = null;
  pushFabricHistory(selectedEditIndex);
  saveFabricPageState(selectedEditIndex);
  showToast('✅ Değişiklik onaylandı ve kaydedildi!');
};

// Tuvalde seçim değiştiğinde panel açıksa hedef bilgisini otomatik güncelle
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
      const modal = document.getElementById('aiPromptLibraryModal');
      if (modal && !modal.classList.contains('hidden')) {
        updatePromptLibTargetInfo();
      }
    }, 800);
  });
}

// ============================================================================
// 4. CANVA TARZI GERÇEK SÜRÜKLE-BIRAK (DRAG & DROP COVER) IZGARA SİSTEMİ
// ============================================================================
window.initCanvaGridDragAndDrop = function() {
  const ws = document.getElementById('mainCanvasWorkspace');
  if (!ws || ws._canvaDndReady) return;
  ws._canvaDndReady = true;

  let currentHoverSlot = null;

  // Sürükleme sırasında imleç altındaki ızgara hücresini algıla
  ws.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    const fCanvas = getCurrentFabricCanvas();
    if (!fCanvas) return;

    const upperEl = fCanvas.upperCanvasEl;
    if (!upperEl) return;
    const rect = upperEl.getBoundingClientRect();
    const zoom = fCanvas.getZoom() || 1;
    const px = (e.clientX - rect.left) / zoom;
    const py = (e.clientY - rect.top) / zoom;
    const pt = new fabric.Point(px, py);

    const objs = fCanvas.getObjects();
    let target = null;
    for (let i = objs.length - 1; i >= 0; i--) {
      const o = objs[i];
      const isImageSlot = o.isGridSlot || o.isSlot || o.type === 'image' || o.customType === 'image' || o.customType === 'photo_slot' || (o.name && (o.name.includes('Foto') || o.name.includes('Görsel') || o.name.includes('Izgara')));
      if (isImageSlot && o.containsPoint(pt)) {
        target = o;
        break;
      }
    }

    if (target !== currentHoverSlot) {
      if (currentHoverSlot && currentHoverSlot.set) {
        currentHoverSlot.set('stroke', currentHoverSlot._preDndStroke || null);
        currentHoverSlot.set('strokeWidth', currentHoverSlot._preDndStrokeWidth || 0);
        fCanvas.requestRenderAll();
      }
      currentHoverSlot = target;
      if (currentHoverSlot) {
        currentHoverSlot._preDndStroke = currentHoverSlot.stroke;
        currentHoverSlot._preDndStrokeWidth = currentHoverSlot.strokeWidth;
        currentHoverSlot.set('stroke', '#38bdf8');
        currentHoverSlot.set('strokeWidth', 3);
        fCanvas.requestRenderAll();
      }
    }
  });

  ws.addEventListener('dragleave', () => {
    if (currentHoverSlot) {
      const fCanvas = getCurrentFabricCanvas();
      currentHoverSlot.set('stroke', currentHoverSlot._preDndStroke || null);
      currentHoverSlot.set('strokeWidth', currentHoverSlot._preDndStrokeWidth || 0);
      currentHoverSlot = null;
      if (fCanvas) fCanvas.requestRenderAll();
    }
  });

  ws.addEventListener('drop', async (e) => {
    e.preventDefault();
    const fCanvas = getCurrentFabricCanvas();
    const slot = currentHoverSlot;

    if (currentHoverSlot) {
      currentHoverSlot.set('stroke', currentHoverSlot._preDndStroke || null);
      currentHoverSlot.set('strokeWidth', currentHoverSlot._preDndStrokeWidth || 0);
      currentHoverSlot = null;
      if (fCanvas) fCanvas.requestRenderAll();
    }

    if (!fCanvas || !slot) return;

    // 1. Masaüstünden doğrudan dosya bırakıldıysa
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          fitImageIntoGridSlot(slot, ev.target.result, fCanvas);
        };
        reader.readAsDataURL(file);
        return;
      }
    }

    // 2. Yüklemelerden veya web linki bırakıldıysa
    const rawData = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
    if (rawData) {
      fitImageIntoGridSlot(slot, rawData, fCanvas);
    }
  });
};

window.fitImageIntoGridSlot = function(slot, imgSrc, fCanvas = null) {
  if (!fCanvas) fCanvas = getCurrentFabricCanvas();
  if (!fCanvas || !slot) return;

  pushFabricHistory(selectedEditIndex);
  showToast('🖼️ Fotoğraf ızgara hücresine tam oturtuluyor (Cover)...');

  fabric.Image.fromURL(imgSrc, (newImg) => {
    if (!newImg || !newImg.width) return;
    const targetW = slot.getScaledWidth() || slot.width || 200;
    const targetH = slot.getScaledHeight() || slot.height || 200;

    // Canva Object-fit: cover mantığı (cropX/cropY + scaleX/scaleY)
    const natW = newImg.width;
    const natH = newImg.height;
    const targetRatio = targetW / targetH;
    const natRatio = natW / natH;

    let cropX = 0;
    let cropY = 0;
    let cropW = natW;
    let cropH = natH;

    if (natRatio > targetRatio) {
      cropW = Math.round(natH * targetRatio);
      cropX = Math.round((natW - cropW) / 2);
    } else {
      cropH = Math.round(natW / targetRatio);
      cropY = Math.round((natH - cropH) / 2);
    }

    newImg.set({
      id: 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      left: slot.left,
      top: slot.top,
      cropX: cropX,
      cropY: cropY,
      width: cropW,
      height: cropH,
      scaleX: targetW / cropW,
      scaleY: targetH / cropH,
      originX: 'left',
      originY: 'top',
      angle: slot.angle || 0,
      opacity: slot.opacity !== undefined ? slot.opacity : 1,
      isGridSlot: true,
      name: slot.name || 'Izgara Fotoğrafı',
      cornerRadiusPx: slot.cornerRadiusPx !== undefined ? slot.cornerRadiusPx : 12,
      maskType: slot.maskType || 'none'
    });

    if (typeof applyImageCornerAndMask === 'function') {
      applyImageCornerAndMask(newImg, newImg.maskType, newImg.cornerRadiusPx);
    }

    fCanvas.remove(slot);
    fCanvas.add(newImg);
    fCanvas.setActiveObject(newImg);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    renderRightEditorPanel();
    showToast('✨ Fotoğraf ızgara hücresine kusursuz sığdırıldı!');
  }, { crossOrigin: 'anonymous' });
};

// ============================================================================
// 5. İNTERAKTİF MEDYA SİHİRBAZI & KARTLAR (VİDEO, SES, DÜĞME, HOTSPOT, SLIDER)
// ============================================================================
window.openInteractiveMediaModal = function(type) {
  const modal = document.getElementById('interactiveMediaModal');
  const titleEl = document.getElementById('interactiveMediaModalTitle');
  const bodyEl = document.getElementById('interactiveMediaModalBody');
  if (!modal || !bodyEl) return;

  const titles = {
    video: '🎬 İnteraktif Video Ekle (YouTube / MP4)',
    audio: '🎙️ Ses & Podcast Çaları Ekle',
    button: '🔘 Etkileşimli Buton Ekle',
    hotspot: '🎯 Sıcak Nokta (Hotspot İpucu) Ekle',
    slideshow: '🖼️ Slayt Gösterisi (Mini Galeri) Ekle',
    table: '📊 Etkileşimli Tablo & Widget Ekle'
  };
  if (titleEl) titleEl.innerHTML = `<i class="ph ph-sparkle text-amber-400"></i> ${titles[type] || 'İnteraktif Medya'}`;

  if (type === 'video') {
    bodyEl.innerHTML = `
      <div class="space-y-3">
        <div>
          <label class="block font-bold text-slate-300 mb-1">Video Bağlantısı (YouTube / MP4 URL):</label>
          <input id="imVideoUrl" type="text" placeholder="https://www.youtube.com/watch?v=... veya MP4 bağlantısı" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <div>
          <label class="block font-bold text-slate-300 mb-1">Video Başlığı & Açıklaması:</label>
          <input id="imVideoTitle" type="text" placeholder="Örn: 2026 Bilim Fuarı Açılış Konuşması" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span class="text-slate-300 font-semibold">Tıklandığında Video Penceresi Açılsın</span>
          <input id="imVideoPopup" type="checkbox" checked class="w-4 h-4 accent-amber-500">
        </div>
        <button onclick="insertConfiguredInteractiveMedia('video')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition">
          <i class="ph ph-plus-circle text-base"></i> Videoyu Sayfaya Yerleştir
        </button>
      </div>
    `;
  } else if (type === 'audio') {
    bodyEl.innerHTML = `
      <div class="space-y-3">
        <div>
          <label class="block font-bold text-slate-300 mb-1">Ses / Podcast Dosyası URL (MP3):</label>
          <input id="imAudioUrl" type="text" placeholder="https://...podcast.mp3 veya ses bağlantısı" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <div>
          <label class="block font-bold text-slate-300 mb-1">Podcast / Ses Başlığı:</label>
          <input id="imAudioTitle" type="text" placeholder="Örn: Edebiyat Kulübü Podcast'i - 1. Bölüm" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <div>
          <label class="block font-bold text-slate-300 mb-1">Seslendiren / Konuşmacı:</label>
          <input id="imAudioAuthor" type="text" placeholder="Örn: Mehmet Akif Şiiri - Seslendiren: Ali Yılmaz" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <button onclick="insertConfiguredInteractiveMedia('audio')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition">
          <i class="ph ph-plus-circle text-base"></i> Ses Çalarını Sayfaya Yerleştir
        </button>
      </div>
    `;
  } else if (type === 'button') {
    bodyEl.innerHTML = `
      <div class="space-y-3">
        <div>
          <label class="block font-bold text-slate-300 mb-1">Düğme Üzerindeki Yazı:</label>
          <input id="imButtonText" type="text" placeholder="Örn: Okul Web Sitesine Git →" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <div>
          <label class="block font-bold text-slate-300 mb-1">Düğme Eylemi:</label>
          <select id="imButtonAction" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
            <option value="link">Web Sitesi Bağlantısı Aç</option>
            <option value="page">Belirli Bir Sayfaya Git</option>
            <option value="popup">Açılır Bilgi Penceresi Göster</option>
          </select>
        </div>
        <div>
          <label class="block font-bold text-slate-300 mb-1">Hedef Değer (URL / Sayfa No / Açıklama):</label>
          <input id="imButtonValue" type="text" placeholder="https://... veya Sayfa Numarası" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <button onclick="insertConfiguredInteractiveMedia('button')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition">
          <i class="ph ph-plus-circle text-base"></i> Düğmeyi Sayfaya Ekle
        </button>
      </div>
    `;
  } else if (type === 'hotspot') {
    bodyEl.innerHTML = `
      <div class="space-y-3">
        <div>
          <label class="block font-bold text-slate-300 mb-1">Nokta Başlığı:</label>
          <input id="imHotspotTitle" type="text" placeholder="Örn: TÜBİTAK Proje Detayı" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <div>
          <label class="block font-bold text-slate-300 mb-1">Dokunulduğunda Açılacak Açıklama:</label>
          <textarea id="imHotspotDesc" rows="3" placeholder="Okuyucu bu noktaya tıkladığında ekranda belirecek zengin açıklama..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-400"></textarea>
        </div>
        <button onclick="insertConfiguredInteractiveMedia('hotspot')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition">
          <i class="ph ph-target text-base"></i> Sıcak Noktayı Sayfaya Yerleştir
        </button>
      </div>
    `;
  } else if (type === 'slideshow') {
    bodyEl.innerHTML = `
      <div class="space-y-3">
        <div>
          <label class="block font-bold text-slate-300 mb-1">Galeri Başlığı:</label>
          <input id="imSlideshowTitle" type="text" placeholder="Örn: 2026 Mezuniyet Fotoğrafları" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <p class="text-slate-400 text-[11px]">Slayt gösterisi eklendikten sonra okuyucular sağ/sol oklarla fotoğrafları dergi içinde kaydırabilir.</p>
        <button onclick="insertConfiguredInteractiveMedia('slideshow')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition">
          <i class="ph ph-slideshow text-base"></i> Slayt Gösterisini Sayfaya Yerleştir
        </button>
      </div>
    `;
  } else {
    bodyEl.innerHTML = `
      <div class="space-y-3">
        <div>
          <label class="block font-bold text-slate-300 mb-1">Tablo / Widget Başlığı:</label>
          <input id="imTableTitle" type="text" placeholder="Örn: Etkinlik Takvimi & Puan Tablosu" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400">
        </div>
        <button onclick="insertConfiguredInteractiveMedia('table')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition">
          <i class="ph ph-table text-base"></i> Tabloyu Sayfaya Ekle
        </button>
      </div>
    `;
  }

  openModal('interactiveMediaModal');
};

window.insertConfiguredInteractiveMedia = function(type) {
  const fCanvas = getCurrentFabricCanvas();
  if (!fCanvas) return;

  pushFabricHistory(selectedEditIndex);

  if (type === 'video') {
    const url = document.getElementById('imVideoUrl')?.value || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const title = document.getElementById('imVideoTitle')?.value || 'Özel Video Röportajı';
    const isPopup = document.getElementById('imVideoPopup')?.checked !== false;

    // Şık video oynatıcı kartı oluştur
    const cardW = 340, cardH = 200;
    const bgRect = new fabric.Rect({
      width: cardW,
      height: cardH,
      rx: 16,
      ry: 16,
      fill: '#0f172a',
      stroke: '#334155',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });

    const playCircle = new fabric.Circle({
      radius: 28,
      fill: 'rgba(239, 68, 68, 0.9)',
      originX: 'center',
      originY: 'center'
    });

    const playTriangle = new fabric.Triangle({
      width: 18,
      height: 20,
      fill: '#ffffff',
      angle: 90,
      originX: 'center',
      originY: 'center',
      left: 3
    });

    const titleText = new fabric.Textbox(title, {
      width: cardW - 30,
      fontSize: 13,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      top: 60,
      originX: 'center',
      originY: 'center'
    });

    const badgeText = new fabric.Textbox('▶ VİDEOYU İZLE', {
      width: 140,
      fontSize: 10,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#38bdf8',
      textAlign: 'center',
      top: -65,
      originX: 'center',
      originY: 'center'
    });

    const grp = new fabric.Group([bgRect, playCircle, playTriangle, titleText, badgeText], {
      name: 'İnteraktif Video: ' + title,
      left: 100,
      top: 240,
      customType: 'interactive_video',
      videoUrl: url,
      actionType: isPopup ? 'popup_video' : 'link',
      actionValue: url,
      shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.35)', blur: 18, offsetY: 8 })
    });

    fCanvas.add(grp);
    fCanvas.setActiveObject(grp);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    closeModal('interactiveMediaModal');
    showToast('🎬 İnteraktif Video kartı başarıyla sayfaya yerleştirildi!');

  } else if (type === 'audio') {
    const url = document.getElementById('imAudioUrl')?.value || 'https://example.com/podcast.mp3';
    const title = document.getElementById('imAudioTitle')?.value || 'Okul Podcast Yayını';
    const author = document.getElementById('imAudioAuthor')?.value || 'Seslendiren: Edebiyat Kulübü';

    const cardW = 340, cardH = 95;
    const bgRect = new fabric.Rect({
      width: cardW,
      height: cardH,
      rx: 16,
      ry: 16,
      fill: '#064e3b',
      stroke: '#059669',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });

    const playBtn = new fabric.Circle({
      radius: 20,
      fill: '#10b981',
      left: -cardW / 2 + 40,
      top: 0,
      originX: 'center',
      originY: 'center'
    });

    const playIcon = new fabric.Triangle({
      width: 12,
      height: 14,
      fill: '#ffffff',
      angle: 90,
      left: -cardW / 2 + 42,
      top: 0,
      originX: 'center',
      originY: 'center'
    });

    const titleTxt = new fabric.Textbox(title, {
      width: 220,
      fontSize: 12.5,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#ffffff',
      left: 20,
      top: -14,
      originX: 'center',
      originY: 'center'
    });

    const authorTxt = new fabric.Textbox(author + ' • 🎙️ Dinle', {
      width: 220,
      fontSize: 10,
      fontFamily: 'Inter',
      fill: '#a7f3d0',
      left: 20,
      top: 14,
      originX: 'center',
      originY: 'center'
    });

    const grp = new fabric.Group([bgRect, playBtn, playIcon, titleTxt, authorTxt], {
      name: 'İnteraktif Ses / Podcast',
      left: 100,
      top: 260,
      customType: 'interactive_audio',
      audioUrl: url,
      actionType: 'audio_play',
      actionValue: url,
      shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 16, offsetY: 6 })
    });

    fCanvas.add(grp);
    fCanvas.setActiveObject(grp);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    closeModal('interactiveMediaModal');
    showToast('🎙️ Ses & Podcast Çaları sayfaya yerleştirildi!');

  } else if (type === 'button') {
    const text = document.getElementById('imButtonText')?.value || 'Detayları İncele →';
    const action = document.getElementById('imButtonAction')?.value || 'link';
    const val = document.getElementById('imButtonValue')?.value || 'https://dergimiz.com.tr';

    const btnW = 200, btnH = 46;
    const btnRect = new fabric.Rect({
      width: btnW,
      height: btnH,
      rx: 23,
      ry: 23,
      fill: '#2563eb',
      originX: 'center',
      originY: 'center'
    });

    const btnTxt = new fabric.Textbox(text, {
      width: btnW - 20,
      fontSize: 12.5,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });

    const grp = new fabric.Group([btnRect, btnTxt], {
      name: 'İnteraktif Düğme: ' + text,
      left: 170,
      top: 280,
      customType: 'button',
      actionType: action,
      actionValue: val,
      shadow: new fabric.Shadow({ color: 'rgba(37,99,235,0.35)', blur: 14, offsetY: 5 })
    });

    fCanvas.add(grp);
    fCanvas.setActiveObject(grp);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    closeModal('interactiveMediaModal');
    showToast('🔘 İnteraktif Düğme sayfaya eklendi!');

  } else if (type === 'hotspot') {
    const title = document.getElementById('imHotspotTitle')?.value || 'Önemli Detay';
    const desc = document.getElementById('imHotspotDesc')?.value || 'Bu bölüm hakkında detaylı açıklama...';

    const pCircle = new fabric.Circle({
      radius: 18,
      fill: '#e11d48',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });

    const pText = new fabric.Textbox('+', {
      width: 24,
      fontSize: 18,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      top: -1
    });

    const grp = new fabric.Group([pCircle, pText], {
      name: 'Sıcak Nokta (Hotspot): ' + title,
      left: 240,
      top: 260,
      customType: 'hotspot',
      actionType: 'popup',
      popupTitle: title,
      popupText: desc,
      shadow: new fabric.Shadow({ color: 'rgba(225,29,72,0.5)', blur: 16, offsetY: 0 })
    });

    fCanvas.add(grp);
    fCanvas.setActiveObject(grp);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    closeModal('interactiveMediaModal');
    showToast('🎯 Sıcak Nokta (Hotspot) fotoğrafın üzerine yerleştirildi!');

  } else if (type === 'slideshow') {
    const title = document.getElementById('imSlideshowTitle')?.value || 'Foto Galeri';
    const sampleImg = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';

    fabric.Image.fromURL(sampleImg, (img) => {
      const cardW = 320, cardH = 220;
      img.set({
        left: 110,
        top: 220,
        scaleX: cardW / img.width,
        scaleY: cardH / img.height,
        name: 'Slayt Gösterisi: ' + title,
        customType: 'slideshow',
        galleryImages: [
          sampleImg,
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80'
        ],
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.25)', blur: 14, offsetY: 6 })
      });
      fCanvas.add(img);
      fCanvas.setActiveObject(img);
      fCanvas.requestRenderAll();
      saveFabricPageState(selectedEditIndex);
      closeModal('interactiveMediaModal');
      showToast('🖼️ Slayt Gösterisi mini galerisi sayfaya eklendi!');
    }, { crossOrigin: 'anonymous' });

  } else {
    // Tablo
    addCanvasElement('table');
    closeModal('interactiveMediaModal');
    showToast('📊 Tablo sayfaya eklendi!');
  }
};

// Sayfa yüklendiğinde Canva Drag & Drop başlat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCanvaGridDragAndDrop, 400);
    setTimeout(() => { if (typeof renderWireframesDrawerList === 'function') renderWireframesDrawerList(); }, 500);
  });
} else {
  setTimeout(initCanvaGridDragAndDrop, 400);
  setTimeout(() => { if (typeof renderWireframesDrawerList === 'function') renderWireframesDrawerList(); }, 500);
}

// ============================================================================
// 6. DERGİMİZ 2.0: 3 ÇALIŞMA MASASI (ADOBE WORKSPACES) MOTORU
// ============================================================================
window.activeEditorWorkspace = 'design'; // 'layout' | 'design' | 'publish'

window.switchEditorWorkspace = function(mode) {
  window.activeEditorWorkspace = mode;

  // Buton stillerini güncelle
  const btnL = document.getElementById('wsBtn_layout');
  const btnD = document.getElementById('wsBtn_design');
  const btnP = document.getElementById('wsBtn_publish');

  const activeClass = 'px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-indigo-600 text-white shadow ring-2 ring-indigo-400/50';
  const inactiveClass = 'px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800';

  if (btnL) btnL.className = mode === 'layout' ? activeClass : inactiveClass;
  if (btnD) btnD.className = mode === 'design' ? activeClass : inactiveClass;
  if (btnP) btnP.className = mode === 'publish' ? activeClass : inactiveClass;

  // Moda göre sol ve sağ panelleri akıllıca organize et
  if (mode === 'layout') {
    // 1. Mizanpaj Modu: Sayfalar ve Şablonlar ön planda
    switchLeftTab('pages');
    showToast('🏗️ Mizanpaj Masası: Sayfa akışı, boş sayfa ve şablonlar aktif.');
  } else if (mode === 'design') {
    // 2. Tasarım & İçerik Modu: Tuval maksimum ferah, bağlamsal denetçi aktif
    switchLeftTab('elements');
    showToast('✍️ Tasarım Masası: Bağlamsal araçlar ve serbest kutular aktif.');
  } else if (mode === 'publish') {
    // 3. İnteraktif & Yayın Modu: Video, ses, animasyonlar ve AI doktoru aktif
    switchLeftTab('links');
    showToast('🎬 İnteraktif Masası: Video, podcast, animasyon ve yayın araçları aktif.');
  }

  // Tuval seçimini ve sağ paneli tazele
  renderRightEditorPanel();
};

// ============================================================================
// 7. SİHİRLİ KOMUT PALETİ (CANVA / NOTION / CTRL+K SPOTLIGHT SPOT)
// ============================================================================
window.MAGIC_COMMANDS_CATALOG = [
  // Sayfa & Mizanpaj
  { id: 'blank_page', title: '➕ Bembeyaz Boş Sayfa Ekle', desc: 'Sıfırdan kendi mizanpajını tasarlamak için tertemiz sayfa aç', cat: 'Sayfa', action: () => addBlankPage() },
  { id: 'spread_pages', title: '📖 Yeni İki Sayfa Ekle (Kitap Açılışı)', desc: 'Karşılıklı sol ve sağ iki sayfa birden ekle', cat: 'Sayfa', action: () => addSpreadPages() },
  { id: 'toggle_spread', title: '👁️ Çift Sayfa Görünümünü Aç / Kapat', desc: 'Kitap açılışı gibi yan yana 2 sayfa olarak görüntüle', cat: 'Görünüm', action: () => toggleSpreadView() },
  { id: 'master_page', title: '📐 Kalıp Sayfa (Master Page) Aç / Kapat', desc: 'Sayfa numarası ve dergi üst başlığını bu sayfada göster/gizle', cat: 'Sayfa', action: () => toggleMasterPageForCurrentPage() },
  { id: 'save_template', title: '⭐ Bu Sayfayı Şablonum Olarak Kaydet', desc: 'Tasarladığınız özel mizanpajı şablon kütüphanenize ekler', cat: 'Şablon', action: () => promptSaveUserTemplate() },
  { id: 'all_templates', title: '🏛️ Tüm Şablon Kataloğunu Aç (40 Model)', desc: 'Kapak, röportaj, edebiyat ve bilim şablonları', cat: 'Şablon', action: () => openAllTemplatesModal() },

  // Kutu Modeli & Canva Izgaraları (Quark / InDesign / Canva)
  { id: 'add_img_frame', title: '🖼️ Boş Resim Çerçevesi Çiz (Kutu Modeli)', desc: 'İçine fotoğraf sürüklenebilir otomatik sığdırma (cover) çerçevesi', cat: 'Kutu', action: () => addQuarkFrame('image') },
  { id: 'add_txt_frame', title: '🔤 Boş Metin Çerçevesi Ekle', desc: 'Sayfaya serbestçe konumlandırılabilir metin kutusu', cat: 'Kutu', action: () => addQuarkFrame('text') },
  { id: 'add_divider', title: '📏 Zarif Edebi Ayraç Çizgisi Ekle', desc: 'Sütunlar veya başlıklar arasına estetik çizgi yerleştir', cat: 'Kutu', action: () => addQuarkFrame('shape') },
  { id: 'add_canva_2col', title: '🖼️ 2\'li Yan Yana Dikey Izgara Ekle', desc: 'İki eşit sütunlu otomatik sığdırma fotoğraf ızgarası', cat: 'Izgara', action: () => addCanvaGrid('split_2_col') },
  { id: 'add_canva_3t', title: '🖼️ 3\'lü T-Izgara Ekle', desc: 'Sol 1 büyük, sağ 2 küçük fotoğraflı dergi mizanpajı', cat: 'Izgara', action: () => addCanvaGrid('t_grid_3') },
  { id: 'add_canva_4matrix', title: '🖼️ 4\'lü Kolaj Izgarası Ekle', desc: '4 kareli simetrik fotoğraf galerisi', cat: 'Izgara', action: () => addCanvaGrid('matrix_4') },
  { id: 'add_canva_circle', title: '⭕ Yuvarlak Dairesel Portre Çerçevesi', desc: 'Dairesel maskeli yazar veya kahraman portresi', cat: 'Izgara', action: () => addCanvaGrid('frame_circle') },
  { id: 'add_canva_arch', title: '🏛️ Kemerli Mimari Çerçeve (Arch Frame)', desc: 'Kubbe/kemer kesimli klasik mimari çerçeve', cat: 'Izgara', action: () => addCanvaGrid('frame_arch') },
  { id: 'runaround_layout', title: '🌊 Portre + Metin Akıtma (Runaround) Düzeni', desc: 'Dairesel portre ve etrafından akan iki sütunlu edebi makale', cat: 'Mizanpaj', action: () => addQuarkRunaroundLayout() },
  { id: 'toggle_wrap', title: '🌊 Metin Akıtma (Text Wrap) Aç / Kapat', desc: 'Seçili görselin etrafından metin kutularını otomatik dolandır', cat: 'Mizanpaj', action: () => toggleTextWrapOnActiveObject() },
  { id: 'drop_cap', title: '🔠 Drop Cap (Büyük Baş Harf) Ekle / Kaldır', desc: 'Paragrafın ilk harfini klasik edebi büyük inisiyal harfe dönüştür', cat: 'Tipografi', action: () => toggleDropCapForActiveText() },

  // AI & Mizanpaj Doktoru
  { id: 'layout_doctor', title: '🩺 AI Mizanpaj Doktorunu Çalıştır', desc: 'Taşan metinleri, imla hatalarını ve düşük kontrastı tek tıkla düzelt', cat: 'AI Doktor', action: () => runLayoutDoctor() },
  { id: 'ai_library', title: '📚 100+100 AI Hazır Komut Kütüphanesini Aç', desc: 'Metin ve görsel için canlı önizlemeli dev katalog', cat: 'AI', action: () => openAiPromptLibraryModal() },

  // Hızlı Metin & Tipografi Dönüşümleri
  { id: 'txt_two_col', title: '📰 Seçili Metni 2 Sütuna Böl', desc: 'Gövde yazısını gazete/dergi tarzında çift sütuna ayır', cat: 'Metin', action: () => runSmartElementAICommand('2 sütuna böl') },
  { id: 'txt_tdk', title: '🔍 TDK İmla ve Yazım Kurallarına Göre Düzelt', desc: 'Yazım ve noktalama hatalarını anında gider', cat: 'Metin', action: () => runSmartElementAICommand('tdk imla düzelt') },
  { id: 'txt_headline', title: '✨ Çarpıcı Manşet ve Spot Yazısı Yap', desc: 'Başlığı büyüt, altına edebi koyu spot ekle', cat: 'Metin', action: () => runSmartElementAICommand('manşet ve spot yap') },
  { id: 'txt_quote', title: '💬 Büyük Tırnaklı Çekme Alıntıya Dönüştür', desc: 'Önemli cümleyi sayfa ortası vurgu kutusu yap', cat: 'Metin', action: () => runSmartElementAICommand('çekme alıntı yap') },

  // Görsel & Filtre
  { id: 'img_sepia', title: '🎨 Fotoğrafa Nostaljik Sepya Filtresi Ver', desc: 'Eski edebi dergi tarzında sıcak vintage ton', cat: 'Görsel', action: () => runSmartElementAICommand('sepya eskitme') },
  { id: 'img_bw', title: '🖤 Fotoğrafı Siyah-Beyaz Yap (Monokrom)', desc: 'Yüksek kontrastlı klasik edebi siyah beyaz', cat: 'Görsel', action: () => runSmartElementAICommand('siyah beyaz') },
  { id: 'img_circle', title: '⭕ Görseli Yuvarlak / Daire Çerçeveye Al', desc: 'Yazar portresi için yuvarlak maske uygula', cat: 'Görsel', action: () => runSmartElementAICommand('daire maske') },
  { id: 'img_arch', title: '🏛️ Görseli Kemer (Arch) Çerçeveye Al', desc: 'Tarih ve mimari dergileri için kubbe maskesi', cat: 'Görsel', action: () => runSmartElementAICommand('kemer maske') },

  // Kinetik Tipografi & Canlı Görseller
  { id: 'anim_typewriter', title: '⌨️ Daktilo Animasyonu Ekle (Harf Harf Geliş)', desc: 'Okuyucu sayfayı açtığında metin daktilo gibi yazılsın', cat: 'Animasyon', action: () => applyTextAnimation('typewriter') },
  { id: 'anim_fade', title: '🌊 Süzülerek Giriş Animasyonu (Fade & Slide)', desc: 'Metin yukarıdan hafifçe süzülerek yerine otursun', cat: 'Animasyon', action: () => applyTextAnimation('fade_in') },
  { id: 'anim_shimmer', title: '✨ Işık Geçişi / Neon Parıltı Animasyonu', desc: 'Başlığın üzerinden altın ışık geçsin', cat: 'Animasyon', action: () => applyTextAnimation('shimmer') },
  { id: 'loop_flag', title: '🇹🇷 Fotoğrafı Dalgalanan Türk Bayrağı Videosuna Çevir', desc: 'Kutuyu kesintisiz dalgalanan canlı video döngüsüne dönüştür', cat: 'Canlı Görsel', action: () => convertActiveImageToLoop('flag') },
  { id: 'loop_river', title: '🌊 Fotoğrafı Canlı Akarsu / Doğa Döngüsüne Çevir', desc: 'Durgun fotoğraf yerine canlı doğa videosu oynasın', cat: 'Canlı Görsel', action: () => convertActiveImageToLoop('nature') },

  // İnteraktif Medya & Yayın
  { id: 'media_video', title: '🎬 İnteraktif Video Ekle (YouTube / MP4)', desc: 'Sayfa üzerine video kartı veya tıkla-aç penceresi koy', cat: 'Medya', action: () => openInteractiveMediaModal('video') },
  { id: 'media_audio', title: '🎙️ Ses & Podcast Çaları Ekle', desc: 'Sayfaya dinlenebilir MP3 kaset ve konuşmacı künyesi ekle', cat: 'Medya', action: () => openInteractiveMediaModal('audio') },
  { id: 'media_hotspot', title: '🎯 Sıcak Nokta (Hotspot İpucu) Yerleştir', desc: 'Fotoğraf üstünde tıklandığında açıklama açan parlayan pin', cat: 'Medya', action: () => openInteractiveMediaModal('hotspot') },
  { id: 'student_hub', title: '📬 Öğrenci Katkı Havuzunu Aç', desc: 'Öğrencilerin gönderdiği şiir ve yazıları tek tıkla sayfaya al', cat: 'Okul', action: () => openStudentSubmissionsModal() },
  { id: 'multi_pub', title: '🏫 Okul / Dergi Değiştirici (Çoklu Yayın)', desc: 'A Okulu, B Okulu ve farklı sayılar arasında 1 tıkla geçiş yap', cat: 'Yayın', action: () => openMultiPublicationModal() }
];

window.openMagicCommandPalette = function() {
  const modal = document.getElementById('magicCommandPaletteModal');
  const input = document.getElementById('magicPaletteInput');
  if (!modal || !input) return;

  modal.classList.remove('hidden');
  input.value = '';
  input.focus();
  renderMagicPaletteList('');
};

window.closeMagicCommandPalette = function() {
  const modal = document.getElementById('magicCommandPaletteModal');
  if (modal) modal.classList.add('hidden');
};

window.filterMagicCommandPalette = function(query) {
  renderMagicPaletteList(query);
};

function renderMagicPaletteList(query = '') {
  const listContainer = document.getElementById('magicPaletteList');
  if (!listContainer) return;

  const q = String(query || '').toLowerCase().trim();
  const filtered = window.MAGIC_COMMANDS_CATALOG.filter(c => {
    if (!q) return true;
    return c.title.toLowerCase().includes(q) ||
           c.desc.toLowerCase().includes(q) ||
           c.cat.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="py-8 text-center text-slate-400">
        <i class="ph ph-magnifying-glass text-2xl text-slate-600 mb-1 block"></i>
        <span class="text-xs">"${escapeHtml(query)}" ile eşleşen bir işlem bulunamadı.</span>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered.map((c, idx) => `
    <button onclick="executeMagicPaletteCommand('${c.id}')" class="w-full p-2.5 rounded-xl hover:bg-slate-800/90 border border-transparent hover:border-slate-700/80 flex items-center justify-between text-left transition group">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
          <i class="ph ph-sparkle text-base"></i>
        </div>
        <div class="min-w-0">
          <div class="font-bold text-xs text-white group-hover:text-amber-300 transition truncate">${c.title}</div>
          <div class="text-[10px] text-slate-400 truncate">${c.desc}</div>
        </div>
      </div>
      <span class="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 shrink-0 ml-2">
        ${c.cat}
      </span>
    </button>
  `).join('');
}

window.executeMagicPaletteCommand = function(cmdId) {
  closeMagicCommandPalette();
  const cmd = window.MAGIC_COMMANDS_CATALOG.find(c => c.id === cmdId);
  if (cmd && typeof cmd.action === 'function') {
    cmd.action();
  }
};

// Global Ctrl+K ve / Tuş Dinleyicisi
document.addEventListener('keydown', (e) => {
  // Input veya textarea içindeyse sadece Ctrl+K yakala
  const tag = (e.target?.tagName || '').toLowerCase();
  const isInput = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable;

  if (e.ctrlKey && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    openMagicCommandPalette();
    return;
  }

  if (e.key === '/' && !isInput) {
    e.preventDefault();
    openMagicCommandPalette();
    return;
  }

  if (e.key === 'Escape') {
    closeMagicCommandPalette();
    const docModal = document.getElementById('layoutDoctorModal');
    if (docModal) docModal.classList.add('hidden');
  }
});

// ============================================================================
// 8. BEMBEYAZ BOŞ SAYFA & QUARK KUTU MODELİ (FRAME MODEL)
// ============================================================================
window.addBlankPage = function() {
  if (!magazineData || !magazineData.pages) return;

  const newPageIndex = magazineData.pages.length;
  const newPage = {
    id: 'page_' + Date.now(),
    type: 'blank',
    navTitle: `Sayfa ${newPageIndex + 1} (Özel Mizanpaj)`,
    bgColor: '#ffffff',
    layout: 'freeform',
    elements: [],
    showMasterPage: true
  };

  magazineData.pages.push(newPage);
  renderAll();
  selectPageForEdit(newPageIndex);
  switchEditorWorkspace('design');
  showToast('📄 Bembeyaz boş sayfa açıldı! Kendi mizanpajınızı serbestçe dizin.');
};

window.addQuarkFrame = function(frameType) {
  const fCanvas = getCurrentFabricCanvas();
  if (!fCanvas) return;

  pushFabricHistory(selectedEditIndex);

  if (frameType === 'image') {
    // Quark / Canva Boş Resim Çerçevesi (X İşaretli & Drag-Drop Uyumlu)
    const boxW = 260, boxH = 200;
    const bgRect = new fabric.Rect({
      width: boxW,
      height: boxH,
      rx: 12,
      ry: 12,
      fill: '#f1f5f9',
      stroke: '#94a3b8',
      strokeWidth: 2,
      strokeDashArray: [6, 4],
      originX: 'center',
      originY: 'center'
    });

    const iconTxt = new fabric.Textbox('🖼️\nFotoğrafı Buraya Sürükleyin\n(Canva Otomatik Sığdırma)', {
      width: boxW - 30,
      fontSize: 12,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#475569',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });

    const grp = new fabric.Group([bgRect, iconTxt], {
      name: 'Boş Resim Çerçevesi',
      left: 140,
      top: 240,
      isGridSlot: true,
      customType: 'photo_slot',
      cornerRadiusPx: 12
    });

    fCanvas.add(grp);
    fCanvas.setActiveObject(grp);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    showToast('🖼️ Boş Resim Çerçevesi eklendi. Fotoğrafı doğrudan üzerine bırakabilirsiniz!');

  } else if (frameType === 'text') {
    // Boş Metin Çerçevesi
    const txt = new fabric.Textbox('Buraya başlığınızı veya metninizi yazın...\n(Düzenlemek için çift tıklayın)', {
      name: 'Metin Çerçevesi',
      left: 60,
      top: 180,
      width: 420,
      fontSize: 16,
      fontFamily: 'Playfair Display',
      fill: '#0f172a',
      lineHeight: 1.35
    });

    fCanvas.add(txt);
    fCanvas.setActiveObject(txt);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    showToast('🔤 Metin kutusu eklendi.');

  } else if (frameType === 'shape') {
    // Edebi Ayraç Çizgisi
    const line = new fabric.Rect({
      name: 'Edebi Ayraç Çizgisi',
      left: 60,
      top: 140,
      width: 420,
      height: 3,
      rx: 2,
      ry: 2,
      fill: '#d97706'
    });

    fCanvas.add(line);
    fCanvas.setActiveObject(line);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    showToast('📏 Ayraç çizgisi eklendi.');
  }
};

// ============================================================================
// 9. "⭐ KENDİ ŞABLONUM OLARAK KAYDET" SİSTEMİ
// ============================================================================
window.promptSaveUserTemplate = function() {
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!page) return;

  const title = prompt('Bu mizanpaj için bir şablon adı yazın:', page.navTitle || 'Özel Okul Şablonum');
  if (!title || !title.trim()) return;

  saveCurrentPageAsUserTemplate(title.trim());
};

window.saveCurrentPageAsUserTemplate = function(templateName) {
  const page = magazineData?.pages?.[selectedEditIndex];
  const fCanvas = getCurrentFabricCanvas();
  if (!page || !fCanvas) return;

  const userTemplates = getUserCustomTemplates();
  const serializedObjects = fCanvas.getObjects().map(o => o.toObject(window.FABRIC_PERSIST_PROPS || []));

  const newTpl = {
    id: 'user_tpl_' + Date.now(),
    name: templateName,
    createdAt: new Date().toLocaleDateString('tr-TR'),
    bgColor: page.bgColor || '#ffffff',
    layout: page.layout || 'custom',
    objects: serializedObjects
  };

  userTemplates.push(newTpl);
  localStorage.setItem('dergimiz_custom_templates', JSON.stringify(userTemplates));

  showToast(`⭐ "${templateName}" başarıyla Özel Şablonlarım arasına kaydedildi!`);
};

window.getUserCustomTemplates = function() {
  try {
    return JSON.parse(localStorage.getItem('dergimiz_custom_templates') || '[]');
  } catch(e) {
    return [];
  }
};

window.applyUserCustomTemplate = function(tplId) {
  const userTemplates = getUserCustomTemplates();
  const tpl = userTemplates.find(t => t.id === tplId);
  const fCanvas = getCurrentFabricCanvas();
  if (!tpl || !fCanvas) return;

  pushFabricHistory(selectedEditIndex);
  fCanvas.clear();
  fCanvas.setBackgroundColor(tpl.bgColor || '#ffffff', fCanvas.renderAll.bind(fCanvas));

  fabric.util.enlivenObjects(tpl.objects, (enlivenedObjects) => {
    enlivenedObjects.forEach(obj => fCanvas.add(obj));
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    showToast(`⭐ "${tpl.name}" şablonu sayfaya uygulandı!`);
  });
};

window.WIREFRAME_TEMPLATES_CATALOG = [
  {
    type: 'wireframe_blank',
    title: 'Bembeyaz Boş Sayfa',
    desc: 'Hiçbir metin ve görsel olmadan tertemiz, sıfır tuval.',
    icon: 'ph-square',
    badge: 'Sıfır Tuval'
  },
  {
    type: 'wireframe_article_2col',
    title: 'Boş 2 Sütunlu Makale',
    desc: 'Büyük başlık, manşet spotu ve iki eşit genişlikte metin sütunu.',
    icon: 'ph-columns',
    badge: 'Dergi Makalesi'
  },
  {
    type: 'wireframe_interview_3img',
    title: 'Boş Röportaj & 3 Görsel',
    desc: 'Sol 1 büyük + 2 küçük görsel kutusu, sağ soru-cevap metinleri.',
    icon: 'ph-chats-circle',
    badge: 'Röportaj'
  },
  {
    type: 'wireframe_gallery_4grid',
    title: 'Boş 4\'lü Fotoğraf Kolajı',
    desc: '2x2 eşit hizalı görsel ızgaraları ve ortak açıklama kutusu.',
    icon: 'ph-grid-four',
    badge: 'Fotoğraf Izgarası'
  },
  {
    type: 'wireframe_poetry_author',
    title: 'Boş Şiir & Yazar Portresi',
    desc: 'Yuvarlak portre çerçevesi, şair adı ve ortalanmış şiir alanı.',
    icon: 'ph-pen-nib',
    badge: 'Edebiyat & Şiir'
  }
];

window.applyWireframeToPage = function(wireframeType, mode = 'current') {
  if (mode === 'current') {
    const page = magazineData?.pages?.[selectedEditIndex];
    if (!page) return;
    page.type = wireframeType;
    page.fabricJSON = null;
    page.isCustomized = false;
    delete page.elements;
    renderAll();
    saveFabricPageState(selectedEditIndex);
    showToast('📐 Boş iskelet açık olan sayfaya giydirildi!');
  } else {
    if (typeof addNewPage === 'function') {
      addNewPage(wireframeType);
      showToast('📐 Yeni boş iskelet sayfa olarak eklendi!');
    }
  }
  if (typeof closeModal === 'function') {
    closeModal('allTemplatesModal');
  }
};

window.renderWireframesDrawerList = function() {
  const container = document.getElementById('drawerWireframesList');
  if (!container) return;

  container.innerHTML = window.WIREFRAME_TEMPLATES_CATALOG.map(w => `
    <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition space-y-2">
      <div class="flex items-start justify-between gap-1.5">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <i class="ph ${w.icon} text-sm"></i>
          </div>
          <div>
            <div class="font-bold text-xs text-white">${escapeHtml(w.title)}</div>
            <span class="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-900 text-amber-400 font-semibold">${w.badge}</span>
          </div>
        </div>
      </div>
      <p class="text-[10px] text-slate-400 leading-relaxed">${escapeHtml(w.desc)}</p>
      <div class="flex items-center gap-1.5 pt-1">
        <button onclick="applyWireframeToPage('${w.type}', 'current')" class="flex-1 py-1 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10.5px] transition" title="Mevcut sayfaya uygula">
          Sayfaya Giydir
        </button>
        <button onclick="applyWireframeToPage('${w.type}', 'new')" class="py-1 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10.5px] font-bold transition" title="Yeni sayfa olarak ekle">
          + Yeni Ekle
        </button>
      </div>
    </div>
  `).join('');
};

window.renderWireframesModalGrid = function() {
  const container = document.getElementById('allWireframesGrid');
  if (!container) return;

  container.innerHTML = window.WIREFRAME_TEMPLATES_CATALOG.map(w => `
    <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 transition flex flex-col justify-between space-y-2.5">
      <div class="space-y-1.5">
        <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg">
          <i class="ph ${w.icon}"></i>
        </div>
        <div class="font-bold text-xs text-white">${escapeHtml(w.title)}</div>
        <p class="text-[10.5px] text-slate-400 leading-snug">${escapeHtml(w.desc)}</p>
      </div>
      <div class="space-y-1 pt-1 border-t border-slate-800/80">
        <button onclick="applyWireframeToPage('${w.type}', 'current')" class="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] shadow transition">
          Açık Sayfaya Giydir
        </button>
        <button onclick="applyWireframeToPage('${w.type}', 'new')" class="w-full py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10.5px] font-bold transition">
          + Yeni Sayfa Ekle
        </button>
      </div>
    </div>
  `).join('');
};

window.switchTemplatesDrawerTab = function(tab) {
  const btnW = document.getElementById('btnTplTab_wireframes');
  const btnP = document.getElementById('btnTplTab_presets');
  const btnC = document.getElementById('btnTplTab_custom');
  const listW = document.getElementById('drawerWireframesList');
  const listP = document.getElementById('drawerTemplatesList');
  const listC = document.getElementById('drawerCustomTemplatesList');

  if (tab === 'wireframes') {
    if (btnW) btnW.className = 'px-2 py-1 rounded-lg bg-amber-500 text-slate-950 shadow font-bold';
    if (btnP) btnP.className = 'px-2 py-1 rounded-lg text-slate-400 hover:text-white font-bold';
    if (btnC) btnC.className = 'px-2 py-1 rounded-lg text-slate-400 hover:text-white font-bold';
    if (listW) listW.classList.remove('hidden');
    if (listP) listP.classList.add('hidden');
    if (listC) listC.classList.add('hidden');
    renderWireframesDrawerList();
  } else if (tab === 'presets') {
    if (btnW) btnW.className = 'px-2 py-1 rounded-lg text-slate-400 hover:text-white font-bold';
    if (btnP) btnP.className = 'px-2 py-1 rounded-lg bg-amber-500 text-slate-950 shadow font-bold';
    if (btnC) btnC.className = 'px-2 py-1 rounded-lg text-slate-400 hover:text-white font-bold';
    if (listW) listW.classList.add('hidden');
    if (listP) listP.classList.remove('hidden');
    if (listC) listC.classList.add('hidden');
  } else {
    if (btnW) btnW.className = 'px-2 py-1 rounded-lg text-slate-400 hover:text-white font-bold';
    if (btnP) btnP.className = 'px-2 py-1 rounded-lg text-slate-400 hover:text-white font-bold';
    if (btnC) btnC.className = 'px-2 py-1 rounded-lg bg-amber-500 text-slate-950 shadow font-bold';
    if (listW) listW.classList.add('hidden');
    if (listP) listP.classList.add('hidden');
    if (listC) listC.classList.remove('hidden');
    renderCustomTemplatesList();
  }
};

window.renderCustomTemplatesList = function() {
  const container = document.getElementById('drawerCustomTemplatesList');
  if (!container) return;

  const list = getUserCustomTemplates();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="py-12 px-4 text-center space-y-3">
        <i class="ph ph-star text-3xl text-amber-500/50 mx-auto block"></i>
        <div class="font-bold text-xs text-white">Henüz Kayıtlı Şablonunuz Yok</div>
        <p class="text-[11px] text-slate-400 leading-relaxed">
          Kendi dizdiğiniz bir sayfayı gelecekte tekrar kullanmak için sağ paneldeki <strong>"⭐ Şablon Kaydet"</strong> butonuna basın.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((t) => `
    <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between space-y-2 group">
      <div class="flex items-center justify-between">
        <div class="font-bold text-xs text-white group-hover:text-amber-300 transition truncate">${escapeHtml(t.name)}</div>
        <span class="text-[9.5px] text-slate-500 font-mono">${t.createdAt || ''}</span>
      </div>
      <div class="flex items-center gap-1.5 pt-1">
        <button onclick="applyUserCustomTemplate('${t.id}')" class="flex-1 py-1.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10.5px] shadow transition">
          Bu Şablonu Uygula
        </button>
        <button onclick="deleteUserCustomTemplate('${t.id}')" class="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs transition" title="Şablonu Sil">
          <i class="ph ph-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
};

window.deleteUserCustomTemplate = function(tplId) {
  let list = getUserCustomTemplates();
  list = list.filter(t => t.id !== tplId);
  localStorage.setItem('dergimiz_custom_templates', JSON.stringify(list));
  renderCustomTemplatesList();
  showToast('🗑️ Özel şablon silindi.');
};

window.handleGridSlotFileUpload = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) {
    showToast('Lütfen önce fotoğrafı yerleştirmek istediğiniz kutuya tıklayın.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    fitImageIntoGridSlot(active, e.target.result, fCanvas);
  };
  reader.readAsDataURL(file);
};

// ============================================================================
// 10. KALIP SAYFA (MASTER PAGE) & OTOMATİK SAYFA NUMARASI (#)
// ============================================================================
window.toggleMasterPageForCurrentPage = function() {
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!page) return;

  page.showMasterPage = page.showMasterPage === false ? true : false;
  renderMasterPageOverlay();
  showToast(page.showMasterPage ? '📐 Kalıp Sayfa (Üst Bilgi & Sayfa No) açıldı.' : '📐 Kalıp Sayfa bu sayfa için gizlendi.');
};

window.renderMasterPageOverlay = function(optCanvas, optPageIndex) {
  const fCanvas = optCanvas || getCurrentFabricCanvas();
  const pIdx = (typeof optPageIndex === 'number') ? optPageIndex : selectedEditIndex;
  const page = magazineData?.pages?.[pIdx];
  if (!fCanvas || !page) return;

  // Önceki master nesnelerini temizle
  const objs = fCanvas.getObjects();
  objs.filter(o => o.isMasterPageObject).forEach(o => fCanvas.remove(o));

  // Kapak sayfasında veya gizlendiyse çizme
  if (page.type === 'cover' || page.showMasterPage === false) {
    fCanvas.requestRenderAll();
    return;
  }

  const pNum = pIdx + 1;
  const magTitle = (magazineData.schoolName || 'DERGİMİZ').toUpperCase();
  const issueInfo = magazineData.issueMonth || magazineData.issueInfo || 'SAYI 01';

  // 1. Üst Bilgi (Running Header)
  const headerTxt = new fabric.Textbox(`${magTitle} • ${issueInfo}`, {
    name: 'Master Header',
    left: 45,
    top: 24,
    width: 460,
    fontSize: 9,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fill: '#64748b',
    selectable: false,
    evented: false,
    isMasterPageObject: true
  });

  const headerLine = new fabric.Rect({
    name: 'Master Header Line',
    left: 45,
    top: 38,
    width: 460,
    height: 1,
    fill: '#cbd5e1',
    selectable: false,
    evented: false,
    isMasterPageObject: true
  });

  // 2. Alt Bilgi (Running Footer & Sayfa Numarası)
  const isLeftPage = pNum % 2 === 0;
  const footerTxt = new fabric.Textbox(`— ${pNum} —`, {
    name: 'Master Page Number',
    left: 45,
    top: 742,
    width: 460,
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fill: '#475569',
    textAlign: 'center',
    selectable: false,
    evented: false,
    isMasterPageObject: true
  });

  fCanvas.add(headerTxt, headerLine, footerTxt);
  headerTxt.sendToBack();
  headerLine.sendToBack();
  footerTxt.sendToBack();
  fCanvas.requestRenderAll();
};

// ============================================================================
// 11. ÇİFT SAYFA (SPREAD VIEW) GÖRÜNÜMÜ
// ============================================================================
window.isSpreadViewActive = false;

window.toggleSpreadView = function() {
  if (typeof toggleSpreadMode === 'function') {
    toggleSpreadMode();
  }
  const btn = document.getElementById('btnSpreadViewToggle');
  if (btn) {
    if (typeof spreadMode !== 'undefined' && spreadMode) {
      btn.className = 'p-1 rounded-xl bg-amber-500 text-slate-950 font-bold border border-amber-400 text-xs shadow transition';
      showToast('📖 Çift Sayfa (Kitap Açılışı) görünümüne geçildi.');
    } else {
      btn.className = 'p-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition';
      showToast('📄 Tek Sayfa görünümüne dönüldü.');
    }
  }
};

// ============================================================================
// 12. 🩺 AI MİZANPAJ DOKTORU & TEK TIKLA TEDAVİ (AUTO-HEAL)
// ============================================================================
window.layoutDoctorIssues = [];

// ============================================================================
// 12. 🩺 GERÇEK GOOGLE GEMINI AI MİZANPAJ VE REDAKSİYON DOKTORU
// ============================================================================
window.runLayoutDoctor = async function() {
  const fCanvas = getCurrentFabricCanvas();
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!fCanvas || !page) return;

  // 1. Modalı Aç ve Gemini Taraması Başlat
  let modal = document.getElementById('layoutDoctorModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'layoutDoctorModal';
    modal.className = 'fixed top-12 right-0 bottom-0 w-[480px] max-w-[95vw] bg-slate-900/98 backdrop-blur-xl border-l border-slate-700 shadow-2xl z-50 flex flex-col select-text';
    document.body.appendChild(modal);
  }
  modal.classList.remove('hidden');

  modal.innerHTML = `
    <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-slate-950 font-bold shadow">
          <i class="ph ph-first-aid text-lg"></i>
        </div>
        <div>
          <h3 class="font-display font-bold text-sm text-white flex items-center gap-1.5">
            <span>Gemini AI Sayfa Doktoru</span>
            <span class="text-[9px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold animate-pulse">Analiz Ediliyor</span>
          </h3>
          <p class="text-[10px] text-slate-400">Sayfa ${selectedEditIndex + 1} için yapay zekâ redaksiyonu yapılıyor...</p>
        </div>
      </div>
      <button onclick="document.getElementById('layoutDoctorModal').classList.add('hidden')" class="text-slate-400 hover:text-white p-1 rounded-lg">
        <i class="ph ph-x text-lg"></i>
      </button>
    </div>
    <div class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div class="relative">
        <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-3xl text-slate-950 shadow-xl shadow-teal-500/20 animate-bounce">
          <i class="ph ph-sparkle"></i>
        </div>
        <div class="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
      </div>
      <div class="font-bold text-white text-sm">Google Gemini AI Sayfayı İnceliyor</div>
      <p class="text-xs text-slate-400 max-w-xs leading-relaxed">
        Tüm metin blokları TDK imla kuralları, anlatım bozuklukları, manşet-spot ritmi ve sayfa marjları açısından taranıyor...
      </p>
    </div>
  `;

  // 2. Tuvaldeki Metinleri Topla
  window.layoutDoctorIssues = [];
  const objs = fCanvas.getObjects().filter(o => !o.isMasterPageObject && o.visible);
  const textObjs = objs.filter(o => (o.type === 'textbox' || o.type === 'i-text') && o.text && o.text.trim().length > 2);

  // 3. Kenar / Marj Kontrolü
  objs.forEach(o => {
    const rightEdge = (o.left || 0) + o.getScaledWidth();
    const bottomEdge = (o.top || 0) + o.getScaledHeight();
    if (rightEdge > 542 || bottomEdge > 768 || (o.left || 0) < 5 || (o.top || 0) < 5) {
      window.layoutDoctorIssues.push({
        id: 'bounds_' + (o.id || Math.random()),
        targetObj: o,
        type: 'bounds',
        icon: 'ph-frame-corners',
        severity: 'critical',
        title: `Kenar Taşması: "${o.name || 'Öğe'}"`,
        desc: 'Öğe sayfa sınırlarının dışına çıkmış; dergi baskısında veya PDF çıktısında kesilebilir.',
        actionLabel: '🪄 Güvenli Marja Çek',
        fix: () => {
          if ((o.left || 0) < 20) o.set('left', 30);
          if (rightEdge > 530) o.set('left', 520 - o.getScaledWidth());
          if ((o.top || 0) < 20) o.set('top', 30);
          if (bottomEdge > 750) o.set('top', 740 - o.getScaledHeight());
          fCanvas.requestRenderAll();
          saveFabricPageState(selectedEditIndex);
          showToast('🪄 Öğe güvenli sayfa marjı içine çekildi.');
        }
      });
    }
  });

  // Eğer sayfada hiç metin yoksa
  if (textObjs.length === 0 && window.layoutDoctorIssues.length === 0) {
    window.layoutDoctorDoctorResult = {
      summary: "Sayfada incelenecek metin bulunamadı. Lütfen sol 'Bileşenler' panelinden metin kutusu ekleyin.",
      overallScore: 100
    };
    renderLayoutDoctorModal();
    return;
  }

  // 4. Gemini AI Backend'e Gönder
  try {
    const textsPayload = textObjs.map(o => {
      if (!o.id) o.id = 'txt_' + Math.random().toString(36).substring(2, 9);
      return {
        id: o.id,
        name: o.name || 'Metin',
        fontSize: o.fontSize,
        text: o.text
      };
    });

    const resp = await fetch('/api/ai/proofread-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: page.title || page.navTitle || `Sayfa ${selectedEditIndex + 1}`,
        pageNumber: selectedEditIndex + 1,
        texts: textsPayload
      })
    });

    const data = await resp.json();
    if (data && data.doctor) {
      window.layoutDoctorDoctorResult = data.doctor;
      const aiIssues = data.doctor.issues || [];

      aiIssues.forEach(aiIss => {
        const target = textObjs.find(t => t.id === aiIss.elementId) || textObjs[0];
        window.layoutDoctorIssues.push({
          id: 'ai_' + Math.random().toString(36).substring(2, 8),
          targetObj: target,
          type: aiIss.type || 'spelling',
          severity: aiIss.severity || 'warning',
          icon: aiIss.type === 'spelling' ? 'ph-spell-check' : aiIss.type === 'grammar' ? 'ph-pen-nib' : 'ph-layout',
          title: aiIss.title || 'İmla / Redaksiyon Önerisi',
          desc: aiIss.desc || '',
          originalSnippet: aiIss.originalSnippet,
          suggestedSnippet: aiIss.suggestedSnippet,
          actionLabel: aiIss.actionLabel || '🪄 Düzelt',
          fix: () => {
            if (target && target.type === 'textbox') {
              if (aiIss.fullCorrectedText) {
                target.set('text', aiIss.fullCorrectedText);
              } else if (aiIss.originalSnippet && aiIss.suggestedSnippet) {
                target.set('text', target.text.replace(aiIss.originalSnippet, aiIss.suggestedSnippet));
              }
              fCanvas.requestRenderAll();
              saveFabricPageState(selectedEditIndex);
              showToast(`🪄 "${aiIss.title}" başarıyla düzeltildi.`);
            }
          }
        });
      });
    }
  } catch (err) {
    console.warn('AI Doktoru API bağlantı uyarısı:', err.message);
    window.layoutDoctorDoctorResult = {
      summary: "Yerel kontroller tamamlandı. (Yapay zekâ çevrimdışı kural motoru devrede)",
      overallScore: 85
    };
  }

  // 5. Sonuçları Ekrana Bas
  renderLayoutDoctorModal();
};

function renderLayoutDoctorModal() {
  let modal = document.getElementById('layoutDoctorModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const issues = window.layoutDoctorIssues || [];
  const count = issues.length;
  const docRes = window.layoutDoctorDoctorResult || { overallScore: count === 0 ? 100 : 80, summary: "Denetim tamamlandı." };

  modal.innerHTML = `
    <!-- Başlık -->
    <div class="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-slate-950 font-bold shadow">
          <i class="ph ph-first-aid text-lg"></i>
        </div>
        <div>
          <h3 class="font-display font-bold text-sm text-white flex items-center gap-1.5">
            <span>AI Mizanpaj Doktoru</span>
            <span class="text-[9.5px] px-2 py-0.5 rounded-full ${count === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'} font-mono font-bold">
              ${docRes.overallScore ? `${docRes.overallScore}/100 Puan` : `${count} Teşhis`}
            </span>
          </h3>
          <p class="text-[10px] text-slate-400">${escapeHtml(docRes.summary || 'Sayfa editoryal ve biçimsel olarak incelendi.')}</p>
        </div>
      </div>
      <button onclick="document.getElementById('layoutDoctorModal').classList.add('hidden')" class="text-slate-400 hover:text-white p-1 rounded-lg">
        <i class="ph ph-x text-lg"></i>
      </button>
    </div>

    <!-- Tümünü Çöz Butonu (Hata varsa) -->
    ${count > 0 ? `
      <div class="p-3 bg-gradient-to-r from-teal-950/60 to-emerald-950/60 border-b border-teal-500/30 flex items-center justify-between gap-2 shrink-0">
        <span class="text-xs text-teal-200 font-semibold flex items-center gap-1.5">
          <i class="ph ph-sparkle text-teal-400"></i> ${count} adet teşhis tespit edildi
        </span>
        <button onclick="applyAllDoctorAutoFixes()" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1 transition">
          <i class="ph ph-check-circle"></i> Tümünü 1 Tıkla Onar
        </button>
      </div>
    ` : ''}

    <!-- Teşhis Listesi -->
    <div class="p-3 flex-1 overflow-y-auto space-y-2.5 text-xs">
      ${count === 0 ? `
        <div class="py-16 text-center space-y-3">
          <div class="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl">
            <i class="ph ph-seal-check"></i>
          </div>
          <div class="font-bold text-white text-sm">Sayfa Mizanpajı & İmlası Kusursuz!</div>
          <p class="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Google Gemini yapay zekâsı sayfada herhangi bir TDK imla hatası, anlatım bozukluğu veya sayfa kenar taşması bulamadı. Sayfanız yayına hazır.
          </p>
        </div>
      ` : issues.map((iss, idx) => `
        <div class="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg ${iss.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : iss.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'} flex items-center justify-center shrink-0">
                <i class="ph ${iss.icon || 'ph-warning'} text-sm"></i>
              </span>
              <span class="font-bold text-white text-[11.5px]">${escapeHtml(iss.title)}</span>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 leading-relaxed">${escapeHtml(iss.desc)}</p>
          
          ${iss.originalSnippet && iss.suggestedSnippet ? `
            <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10.5px] font-mono space-y-1">
              <div class="text-rose-400 line-through truncate">❌ ${escapeHtml(iss.originalSnippet)}</div>
              <div class="text-emerald-400 font-bold truncate">✅ ${escapeHtml(iss.suggestedSnippet)}</div>
            </div>
          ` : ''}

          <div class="pt-1 flex justify-end">
            <button onclick="applyDoctorAutoFix(${idx})" class="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 font-bold text-[10.5px] border border-teal-500/30 transition flex items-center gap-1">
              ${iss.actionLabel || '🪄 Düzelt'}
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.applyDoctorAutoFix = function(issueIdx) {
  const issue = window.layoutDoctorIssues[issueIdx];
  if (issue && typeof issue.fix === 'function') {
    issue.fix();
    window.layoutDoctorIssues.splice(issueIdx, 1);
    renderLayoutDoctorModal();
  }
};

window.applyAllDoctorAutoFixes = function() {
  const issues = [...window.layoutDoctorIssues];
  issues.forEach(iss => {
    if (typeof iss.fix === 'function') iss.fix();
  });
  window.layoutDoctorIssues = [];
  renderLayoutDoctorModal();
  showToast('✨ Tüm mizanpaj ve imla hataları Gemini AI ile tek tıkla onarıldı!');
};

// ============================================================================
// 13. 📬 ÖĞRENCİ KATKI HAVUZU (FAZ 4: GERÇEK API & /gonder PORTALI ENTEGRASYONU)
// ============================================================================
window.STUDENT_SUBMISSIONS_SAMPLE = [
  { id: 'sub_sample_1', student: 'Zeynep Kaya (10-A)', type: 'Şiir', title: '23 Nisan Rüzgârı', preview: 'Gökyüzünde süzülen al bayrak gibi,\nÖzgürlüğe kanat açar yarınlarımız...', date: 'Bugün 14:20' },
  { id: 'sub_sample_2', student: 'Emir Yılmaz (11-C)', type: 'Deneme', title: 'Yapay Zekâ ve İnsan Ruhu', preview: 'Geleceğin teknolojisi edebiyatı öldürecek mi yoksa ona yeni bir nefes mi verecek?...', date: 'Dün 18:45' },
  { id: 'sub_sample_3', student: 'Elif Demir (9-B)', type: 'Çizim / Sanat', title: 'Atatürk ve Çocuklar (Karakalem)', preview: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', date: '2 gün önce' }
];

window.currentSubmissionsList = [];

window.openStudentSubmissionsModal = async function() {
  let modal = document.getElementById('studentSubmissionsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'studentSubmissionsModal';
    modal.className = 'fixed top-12 right-0 bottom-0 w-[480px] max-w-[95vw] bg-slate-900/98 backdrop-blur-xl border-l border-slate-700 shadow-2xl z-50 flex flex-col select-text';
    document.body.appendChild(modal);
  }

  modal.classList.remove('hidden');

  const issueParam = (typeof currentIssue !== 'undefined' && currentIssue && currentIssue.id) ? currentIssue.id : 'sayi-1';
  const portalUrl = `${window.location.origin}/gonder?issueId=${encodeURIComponent(issueParam)}`;

  // Yükleniyor durumunu göster
  modal.innerHTML = `
    <div class="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow">
          <i class="ph ph-tray text-lg"></i>
        </div>
        <div>
          <h3 class="font-display font-bold text-sm text-white">Öğrenci Katkı Havuzu</h3>
          <p class="text-[10px] text-slate-400">Yazı ve şiirleri dergi tuvaline tek tıkla aktarın.</p>
        </div>
      </div>
      <button onclick="document.getElementById('studentSubmissionsModal').classList.add('hidden')" class="text-slate-400 hover:text-white p-1 rounded-lg">
        <i class="ph ph-x text-lg"></i>
      </button>
    </div>
    <div class="p-8 text-center text-slate-400 text-xs">
      <i class="ph ph-spinner animate-spin text-2xl text-indigo-400 mb-2 block"></i>
      Öğrenci yazıları yükleniyor...
    </div>
  `;

  let subs = [];
  try {
    const res = await fetch(`/api/submissions?issueId=${encodeURIComponent(issueParam)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        subs = data.map(item => ({
          id: item.id,
          student: `${item.studentName || 'Anonim'} (${item.studentClass || ''})`,
          type: item.genre || 'Yazı',
          title: item.title || 'Başlıksız',
          preview: item.content || item.imageUrl || '',
          imageUrl: item.imageUrl || '',
          date: item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'Bugün',
          status: item.status || 'pending',
          isReal: true
        }));
      }
    }
  } catch (err) {
    console.warn('API submissions hatası:', err);
  }

  // Eğer gönderi yoksa örnekleri ekle
  if (subs.length === 0) {
    subs = window.STUDENT_SUBMISSIONS_SAMPLE.map(s => ({ ...s, isReal: false }));
  }

  window.currentSubmissionsList = subs;

  modal.innerHTML = `
    <div class="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow">
          <i class="ph ph-tray text-lg"></i>
        </div>
        <div>
          <h3 class="font-display font-bold text-sm text-white">Öğrenci Katkı Havuzu</h3>
          <p class="text-[10px] text-slate-400">Öğrencilerin gönderdiği şiir ve yazıları tek tıkla sayfaya aktarın.</p>
        </div>
      </div>
      <button onclick="document.getElementById('studentSubmissionsModal').classList.add('hidden')" class="text-slate-400 hover:text-white p-1 rounded-lg">
        <i class="ph ph-x text-lg"></i>
      </button>
    </div>

    <!-- Katkı Linki & QR Paylaşımı -->
    <div class="p-3 bg-slate-950/80 border-b border-slate-800 text-xs space-y-2">
      <div class="flex items-center justify-between text-slate-300">
        <span class="font-semibold flex items-center gap-1.5">
          <i class="ph ph-link-simple text-indigo-400"></i> Öğrenci Gönderim Formu:
        </span>
        <button onclick="navigator.clipboard.writeText('${portalUrl}'); showToast('📋 Gönderim bağlantısı kopyalandı! WhatsApp veya sınıfa gönderebilirsiniz.');" class="text-[10px] text-amber-400 hover:underline font-mono flex items-center gap-1">
          <i class="ph ph-copy"></i> Link Kopyala
        </button>
      </div>
      <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono select-all truncate">
        ${portalUrl}
      </div>
      <div class="text-[9.5px] text-slate-500 flex items-center justify-between">
        <span>Öğrenciler üye olmadan bu linkten yazı/resim gönderebilir.</span>
        <a href="${portalUrl}" target="_blank" class="text-indigo-400 hover:underline">Formu Aç ↗</a>
      </div>
    </div>

    <!-- Gelen Yazılar Listesi -->
    <div class="p-3 flex-1 overflow-y-auto space-y-2.5 text-xs">
      ${subs.map((s, idx) => `
        <div class="p-3 rounded-2xl bg-slate-950/90 border ${s.status === 'used' ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800 hover:border-indigo-500/50'} transition space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[9.5px] font-bold px-2 py-0.5 rounded-full ${s.status === 'used' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'}">
              ${escapeHtml(s.type)} ${s.status === 'used' ? '✓ Dergide Kullanıldı' : ''}
            </span>
            <span class="text-[10px] text-slate-500">${escapeHtml(s.date)}</span>
          </div>
          <div>
            <div class="font-bold text-white text-xs">${escapeHtml(s.title)}</div>
            <div class="text-[10px] text-slate-400 font-medium">${escapeHtml(s.student)}</div>
          </div>
          ${(s.imageUrl || s.type.includes('Çizim') || s.type.includes('Görsel')) ? `
            <img src="${escapeHtml(s.imageUrl || s.preview)}" class="w-full h-28 object-cover rounded-xl border border-slate-800" alt="Öğrenci Eseri">
          ` : ''}
          ${(!s.imageUrl && s.preview) ? `
            <p class="text-[10px] text-slate-300 bg-slate-900 p-2.5 rounded-xl italic leading-relaxed whitespace-pre-line border border-slate-800/80 max-h-32 overflow-y-auto">
              ${escapeHtml(s.preview)}
            </p>
          ` : ''}
          <div class="flex items-center gap-2 pt-1">
            <button onclick="insertStudentSubmissionToActive(${idx})" class="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10.5px] shadow flex items-center justify-center gap-1.5 transition">
              <i class="ph ph-arrow-down-left"></i> Sayfaya Yerleştir
            </button>
            ${s.isReal ? `
              <button onclick="deleteStudentSubmission('${s.id}', ${idx})" class="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-300 border border-slate-700 transition" title="Yazıyı Sil">
                <i class="ph ph-trash text-sm"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

window.deleteStudentSubmission = async function(id, idx) {
  if (!confirm('Bu öğrenci gönderisini silmek istediğinize emin misiniz?')) return;
  try {
    const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('🗑️ Öğrenci gönderisi silindi.');
      openStudentSubmissionsModal();
    }
  } catch (err) {
    showToast('Hata: Gönderi silinemedi.');
  }
};

window.insertStudentSubmissionToActive = async function(subIdx) {
  const sub = window.currentSubmissionsList[subIdx] || window.STUDENT_SUBMISSIONS_SAMPLE[subIdx];
  const fCanvas = getCurrentFabricCanvas();
  if (!sub || !fCanvas) return;

  const active = fCanvas.getActiveObject();
  pushFabricHistory(selectedEditIndex);

  const isImg = sub.imageUrl || sub.type.includes('Çizim') || sub.type.includes('Görsel');
  const imgUrl = sub.imageUrl || sub.preview;

  if (isImg && imgUrl) {
    if (active && (active.type === 'image' || active.isGridSlot)) {
      fitImageIntoGridSlot(active, imgUrl, fCanvas);
    } else {
      addFabImage(fCanvas, { url: imgUrl, name: sub.title + ' - ' + sub.student });
    }
  } else {
    const fullText = `${sub.title}\n\n${sub.preview}\n\n— ${sub.student}`;
    if (active && (active.type === 'textbox' || active.type === 'i-text')) {
      active.set('text', fullText);
      fCanvas.requestRenderAll();
      saveFabricPageState(selectedEditIndex);
    } else {
      const txt = new fabric.Textbox(fullText, {
        name: sub.title,
        left: 60,
        top: 180,
        width: 430,
        fontSize: 13,
        fontFamily: 'Playfair Display',
        fill: '#0f172a',
        lineHeight: 1.35
      });
      fCanvas.add(txt);
      fCanvas.setActiveObject(txt);
      fCanvas.requestRenderAll();
      saveFabricPageState(selectedEditIndex);
    }
  }

  // Backend'de status'u 'used' olarak işaretle
  if (sub.isReal && sub.id) {
    try {
      await fetch(`/api/submissions/${sub.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'used' })
      });
    } catch (e) {}
  }

  document.getElementById('studentSubmissionsModal')?.classList.add('hidden');
  showToast(`📬 ${sub.student} tarafından gönderilen "${sub.title}" sayfaya yerleştirildi!`);
};

// ============================================================================
// 14. KİNETİK TİPOGRAFİ & CANLI VİDEO DÖNGÜLERİ
// ============================================================================
window.applyTextAnimation = function(animType) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active || (active.type !== 'textbox' && active.type !== 'i-text')) {
    showToast('Lütfen önce sayfadaki bir metne tıklayın.');
    return;
  }

  active.set('textAnimation', animType);
  pushFabricHistory(selectedEditIndex);
  saveFabricPageState(selectedEditIndex);

  const labels = {
    typewriter: '⌨️ Daktilo (Harf harf yazılma)',
    fade_in: '🌊 Süzülerek Giriş (Fade & Slide)',
    shimmer: '✨ Işık Geçişi (Neon Parıltı)',
    pulse: '💓 Vurgu Nabzı (Hafif Büyüme)'
  };

  showToast(`${labels[animType] || 'Animasyon'} metne uygulandı! Okuyucu modunda canlı oynayacaktır.`);
};

window.convertActiveImageToLoop = function(loopType) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) {
    showToast('Lütfen önce canlı döngüye dönüştürmek istediğiniz resme tıklayın.');
    return;
  }

  const loopVideos = {
    flag: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Dalgalanan Türk Bayrağı (Canlı Döngü)'
    },
    nature: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: 'Canlı Akarsu / Doğa Döngüsü'
    }
  };

  const selected = loopVideos[loopType] || loopVideos.flag;
  active.set({
    name: selected.title,
    customType: 'interactive_video',
    videoUrl: selected.url,
    actionType: 'popup_video',
    actionValue: selected.url,
    isLoopVideo: true
  });

  fCanvas.requestRenderAll();
  pushFabricHistory(selectedEditIndex);
  saveFabricPageState(selectedEditIndex);
  showToast(`🎥 "${selected.title}" canlı döngü olarak kutuya bağlandı!`);
};

// ============================================================================
// 15. ÇOKLU OKUL / DERGİ & SAYI YÖNETİMİ
// ============================================================================
window.openMultiPublicationModal = function() {
  openModal('newMagazineModal');
};

