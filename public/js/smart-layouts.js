// ============================================================================
// DERGİMİZ AKILLI MİZANPAJ MOTORU (SAYFA TÜRÜNE GÖRE OTOMATİK 100+ MİZANPAJ)
// ============================================================================
// Ön Kapağa (K1), Ön Kapak İçine (K2), İçindekiler & Editörden (TOC),
// Makale (Article), Röportaj (Interview), Edebiyat & Sanat (Literature),
// Katalog & Proje (Catalog), Arka Kapak İçi Künye (K3) ve Arka Dış Kapağa (K4)
// tıklandığında o sayfaya özel 10-12 farklı profesyonel mizanpaj sunar.

window.SMART_PAGE_SECTIONS = [
  { id: 'cover', label: 'K1 • Ön Kapak', short: 'Ön Kapak', icon: 'ph-book-open-text', color: 'amber' },
  { id: 'k2', label: 'K2 • Ön Kapak İçi (Sunuş & Onur)', short: 'Ön Kapak İçi', icon: 'ph-flag-banner', color: 'rose' },
  { id: 'toc', label: 'İçindekiler & Editörden', short: 'İçindekiler', icon: 'ph-list-numbers', color: 'indigo' },
  { id: 'article', label: 'Makale, Haber & Özel Dosya', short: 'Makale / Dosya', icon: 'ph-newspaper', color: 'blue' },
  { id: 'interview', label: 'Röportaj & Söyleşi', short: 'Röportaj', icon: 'ph-microphone-stage', color: 'purple' },
  { id: 'literature', label: 'Edebiyat, Şiir & Sanat', short: 'Edebiyat & Sanat', icon: 'ph-feather', color: 'amber' },
  { id: 'catalog', label: 'Katalog, Proje & Sergi Vitrini', short: 'Katalog & Proje', icon: 'ph-squares-four', color: 'emerald' },
  { id: 'k3', label: 'K3 • Arka Kapak İçi (Künye & Ekip)', short: 'Arka Kapak İçi', icon: 'ph-users-four', color: 'cyan' },
  { id: 'k4', label: 'K4 • Arka Dış Kapak', short: 'Arka Kapak', icon: 'ph-qr-code', color: 'violet' }
];

window.SMART_LAYOUT_CATALOG = {
  // ==========================================================================
  // 1. K1 • ÖN KAPAK MİZANPAJLARI (12 MODEL)
  // ==========================================================================
  cover: [
    { id: 'minimalist', name: 'Minimalist Editoryal', tag: 'Kamer / Kinfolk', icon: '🏛️', desc: 'Sol siyah vurgu kartı, sağ dikey portre ve dev serif logo.' },
    { id: 'brutalist', name: 'Brütalist Gençlik', tag: 'Resimlik / Wired', icon: '⚡', desc: 'Canlı arka plan, açılı fotoğraf çerçevesi ve sarı manşet kuşağı.' },
    { id: 'modular', name: 'Modüler Grid', tag: 'Konak / Monocle', icon: '📐', desc: 'Net ızgara çerçeveleri, sol büyük fotoğraf ve sağ konu kutuları.' },
    { id: 'fullscreen', name: 'Tam Ekran Sinematik', tag: 'Doğal / Vogue', icon: '🌄', desc: 'Tam sayfa fotoğraf, alt karartma katmanı ve sinematik manşet.' },
    { id: 'time_frame', name: 'İkonik Kırmızı Çerçeve', tag: 'TIME Klasiği', icon: '🟥', desc: 'Sayfa kenarında kalın ikonik kırmızı çerçeve, güçlü portre ve manşet.' },
    { id: 'split_horizon', name: 'Yatay İki Yarı (Split)', tag: 'Popüler', icon: '🌓', desc: 'Üst yarı sinematik fotoğraf, alt yarı temiz zemin ve 3 sütun spot.' },
    { id: 'mosaic_3', name: '3’lü Mozaik Kolaj', tag: 'Okul & Etkinlik', icon: '🧩', desc: 'Bu sayının 3 farklı konusunu gösteren 3’lü fotoğraf kolajı.' },
    { id: 'manifesto', name: 'Tipografik Manifesto', tag: 'New Yorker', icon: '✒️', desc: 'Daire portre penceresi, dev edebi başlık ve kapak fihristi.' },
    { id: 'diagonal_band', name: 'Dinamik Kuşak & Rozet', tag: 'Modern', icon: '🎗️', desc: 'Tam boy görsel üzerinde çapraz vurgu kuşağı ve özel sayı rozeti.' },
    { id: 'luxury_gold', name: 'Prestij Altın Varak', tag: 'Özel Sayı', icon: '👑', desc: 'Gece laciverti zemin, çift altın çerçeve ve klasik zarif tipografi.' },
    { id: 'newspaper_front', name: 'Gazete Manşet (Broadsheet)', tag: 'Bülten', icon: '🗞️', desc: 'Sürmanşet, 3 sütun kapak haberi, orta fotoğraf ve künye şeridi.' },
    { id: 'polaroid_studio', name: 'Polaroid Sanat Stüdyosu', tag: 'Gençlik', icon: '📸', desc: 'Krem zemin üzerinde 2 açılı polaroid fotoğraf kartı ve el yazısı not.' }
  ],

  // ==========================================================================
  // 2. K2 • ÖN KAPAK İÇİ MİZANPAJLARI (10 MODEL)
  // ==========================================================================
  k2: [
    { id: 'k2_classic', name: 'Klasik Portre & Sunuş', tag: 'Popüler', icon: '🎙️', desc: 'Ortada yönetici/editör portresi, italik sunuş yazısı ve imza.' },
    { id: 'k2_ataturk', name: 'Atatürk & Cumhuriyet Köşesi', tag: 'Okul Klasiği', icon: '🇹🇷', desc: 'Altın çerçeveli Atatürk portresi, vecize ve Gençliğe Hitabe.' },
    { id: 'k2_manifesto', name: 'Tam Sayfa Görsel Manifesto', tag: 'Sinematik', icon: '🌟', desc: 'Tam boy fotoğraf üzerinde yarı saydam vizyon ve kuruluş manifestosu.' },
    { id: 'k2_split_corp', name: 'Çift Sütun Kurumsal Sunuş', tag: 'Kurumsal', icon: '🏢', desc: 'Sol yarı boydan boya kurum/kampüs görseli, sağ yarı vizyon yazısı.' },
    { id: 'k2_showcase4', name: 'Bu Sayıda 4 Öne Çıkan Vitrin', tag: 'Görsel Özet', icon: '🖼️', desc: 'Sayının 4 ana dosyasının fotoğraflı önizleme kartları ve sunuş.' },
    { id: 'k2_kinfolk_quote', name: 'Minimalist Dev Alıntı', tag: 'Kinfolk Stili', icon: '❝', desc: 'Ferah krem zemin üzerinde dev tırnak işareti ve ilham verici vecize.' },
    { id: 'k2_dual_message', name: 'İkili Mesaj (Müdür & Başeditör)', tag: 'Çift Portre', icon: '🤝', desc: 'Üstte Kurum Müdürü, altta Genel Yayın Yönetmeni mesaj kartları.' },
    { id: 'k2_timeline', name: 'Kilometre Taşları & Tarihçe', tag: 'Kronoloji', icon: '⏳', desc: 'Dergimizin ve kurumumuzun başarı yolculuğunu anlatan dikey akış.' },
    { id: 'k2_award_honor', name: 'Onur & Başarı Tablosu', tag: 'Ödüller', icon: '🏆', desc: 'Dönemin ödül alan projeleri, öğrencileri ve gurur tablomuz.' },
    { id: 'k2_dark_prestige', name: 'Koyu Prestij Karşılama', tag: 'Lüks', icon: '🌙', desc: 'Koyu lacivert zemin, altın çerçeveli portre ve prestij sunuş metni.' }
  ],

  // ==========================================================================
  // 3. İÇİNDEKİLER & EDİTÖRDEN MİZANPAJLARI (10 MODEL)
  // ==========================================================================
  toc: [
    { id: 'toc_classic', name: 'Üst Editör + Alt Kutu Fihrist', tag: 'Klasik', icon: '📋', desc: 'Üstte editör fotoğrafı ve mektubu, altta 8 kutulu içindekiler.' },
    { id: 'toc_vogue_split', name: 'Sol Editör + Sağ Dev Rakamlar', tag: 'Vogue / GQ', icon: '🔢', desc: 'Sol sütunda dikey editör mektubu, sağda büyük numaralı liste.' },
    { id: 'toc_visual_cards', name: 'Fotoğraf Kartlı İçindekiler', tag: 'NatGeo Stili', icon: '🖼️', desc: 'Görsel önizlemeli 4 ana dosya kartı ve hızlı sayfa fihristi.' },
    { id: 'toc_editor_full', name: 'Tam Sayfa Editörün Mektubu', tag: 'Başyazı', icon: '✍️', desc: 'Büyük editör portresi, 2 sütun samimi başyazı, alıntı ve imza.' },
    { id: 'toc_categorized', name: 'Kategorili Blok Fihrist', tag: 'Bilim & Kültür', icon: '🗂️', desc: 'Dosya, Kültür-Sanat, Söyleşi ve Genç Kalemler olarak gruplu liste.' },
    { id: 'toc_big_numbers', name: 'Modern Dev Rakamlı Grid', tag: 'Tasarım', icon: '⏹️', desc: '8 modern kart içinde dev sayfa numaraları ve bölüm başlıkları.' },
    { id: 'toc_minimal_lines', name: 'Edebi Noktalı Fihrist', tag: 'Klasik Kitap', icon: '📖', desc: 'Zarif çizgili klasik edebiyat dergisi fihristi ve alt editör notu.' },
    { id: 'toc_dark_cinema', name: 'Sinematik Koyu İçindekiler', tag: 'Karanlık Mod', icon: '🎬', desc: 'Gece mavisi zemin, kehribar sayfa numaraları ve editör kartı.' },
    { id: 'toc_timeline_flow', name: 'Dikey Okuma Rotası Rehberi', tag: 'Akış', icon: '🧭', desc: 'Soldan aşağı inen okuma çizgisi üzerinde adım adım sayfa rehberi.' },
    { id: 'toc_magazine_desk', name: 'Yayın Masası & Editörün Seçimi', tag: 'Vitrinli', icon: '⭐', desc: 'Editörün mektubu + "Bu Sayıda Kaçırmayın" 3 özel vurgu kutusu.' }
  ],

  // ==========================================================================
  // 4. MAKALE, HABER & ÖZEL DOSYA MİZANPAJLARI (10 MODEL)
  // ==========================================================================
  article: [
    { id: 'art_classic', name: 'Klasik Üst Görsel + 2 Sütun', tag: 'Standart', icon: '📰', desc: 'Üstte yatay geniş fotoğraf, altta makale metni ve vurgu alıntısı.' },
    { id: 'art_left_split', name: 'Sol Tam Boy Görsel + Sağ Yazı', tag: 'Canva Favorisi', icon: '🌗', desc: 'Sayfanın sol yarısı boydan boya fotoğraf, sağ yarısı başlık ve metin.' },
    { id: 'art_collage_3', name: '3 Fotoğraflı Magazin Haberi', tag: 'Etkinlik / Gezi', icon: '📸', desc: 'Üstte 3’lü etkinlik fotoğraf kolajı, altta iki sütun haber metni.' },
    { id: 'art_dark_cinema', name: 'Tam Sayfa Karanlık Sinematik', tag: 'Uzay / Sinema', icon: '🌌', desc: 'Koyu zemin üzerinde geniş görsel, parlak başlık ve bilgi kartları.' },
    { id: 'art_z_flow', name: 'Z-Düzeni Çapraz Akış', tag: 'Dinamik', icon: '🔀', desc: 'Sol üst fotoğraf + sağ üst giriş, sol alt metin + sağ alt vurgu kutusu.' },
    { id: 'art_infographic', name: 'İnfografik & Rakamlarla Dosya', tag: 'Veri / Bilim', icon: '📊', desc: '3 büyük istatistik/rakam kartı, görsel ve kapsamlı analiz metni.' },
    { id: 'art_newspaper', name: 'Gazete Manşeti & Sütunlar', tag: 'Bülten', icon: '🗞️', desc: 'Sürmanşet, dev manşet başlığı, ortada fotoğraf ve sütunlu haber.' },
    { id: 'art_fullbleed_card', name: 'Tam Boy Fotoğraf Üstü Kart', tag: 'Modern', icon: '🃏', desc: 'Tam sayfa arka plan fotoğrafı üzerinde yüzen beyaz makale kartı.' },
    { id: 'art_center_focus', name: 'Merkezi Odak & Çift Sütun', tag: 'Portre Dosya', icon: '🎯', desc: 'Ortada dairesel/köşeli görsel, üstte başlık ve altta çift sütun.' },
    { id: 'art_academic_box', name: 'Akademik Araştırma & Özet', tag: 'Makale', icon: '🎓', desc: 'Üstte "Özet (Abstract)" kutusu, ana metin ve altta kaynakça/not.' }
  ],

  // ==========================================================================
  // 5. RÖPORTAJ & SÖYLEŞİ MİZANPAJLARI (10 MODEL)
  // ==========================================================================
  interview: [
    { id: 'int_classic', name: 'Klasik Üst Konuk + 3 Soru Kartı', tag: 'Standart', icon: '🎤', desc: 'Üstte renkli konuk tanıtım kartı, altta 3 çerçeveli soru-cevap.' },
    { id: 'int_left_portrait', name: 'Sol Boydan Boya Portre', tag: 'GQ / Dergi', icon: '🧍', desc: 'Sol sütunda dikey büyük konuk portresi ve biyografi, sağda söyleşi.' },
    { id: 'int_chat_bubbles', name: 'Modern Diyalog Balonları', tag: 'Sohbet Stili', icon: '💬', desc: 'Soruların ve cevapların karşılıklı sohbet balonları içinde akışı.' },
    { id: 'int_dark_spotlight', name: 'Koyu Sahne Işığı (Spotlight)', tag: 'Prestij', icon: '🔦', desc: 'Koyu lacivert/siyah zemin, altın soru başlıkları ve portre.' },
    { id: 'int_magazine_2col', name: 'Çift Sütun Dergi Söyleşisi', tag: 'Editoryal', icon: '📖', desc: 'Üstte konuk fotoğrafı ve dev alıntı, altta 2 sütun soru-cevap.' },
    { id: 'int_quote_hero', name: 'Dev Alıntı Manşetli Röportaj', tag: 'Vurgulu', icon: '🗣️', desc: 'Üst yarıda konuğun en çarpıcı sözü, alt yarıda soru-cevap blokları.' },
    { id: 'int_panel_roundtable', name: 'Yuvarlak Masa / 3 Sütun', tag: 'Panel', icon: '👥', desc: 'Üstte konuk bilgisi, altta yan yana 3 dikey soru-cevap sütunu.' },
    { id: 'int_polaroid_bio', name: 'Polaroid Portre & Kimdir Kartı', tag: 'Biyografili', icon: '🪪', desc: 'Sol üstte açılı polaroid portre + "Konuk Kimdir?" kutusu, sağda sorular.' },
    { id: 'int_minimal_serif', name: 'Edebi Söyleşi (Paris Review)', tag: 'Kültür & Sanat', icon: '✒️', desc: 'Krem zemin üzerinde dev S / C harfleriyle klasik edebi söyleşi.' },
    { id: 'int_split_bands', name: 'Renkli Numaralı Soru Şeritleri', tag: 'Modern', icon: '🔢', desc: '01, 02, 03 numaralı renkli rozetlerle ayrılan net soru blokları.' }
  ],

  // ==========================================================================
  // 6. EDEBİYAT, ŞİİR & SANAT MİZANPAJLARI (10 MODEL)
  // ==========================================================================
  literature: [
    { id: 'lit_classic', name: 'Klasik Parşömen & Üst Görsel', tag: 'Standart', icon: '📜', desc: 'Üstte sanat görseli, altta sarı kenarlıklı şiir/edebiyat kartı.' },
    { id: 'lit_two_poems', name: 'Yan Yana İki Sütun Şiir', tag: 'Antoloji', icon: '🎭', desc: 'Sol ve sağ iki ayrı çerçevede dörtlükler ve ortada görsel.' },
    { id: 'lit_full_canvas', name: 'Tam Sayfa Tablo Üstü Şiir', tag: 'Sanatsal', icon: '🎨', desc: 'Tam boy arka plan tablosu üzerinde yarı saydam zarif şiir kartı.' },
    { id: 'lit_ottoman_frame', name: 'Klasik Divan Altın Çerçeve', tag: 'Geleneksel', icon: '🏛️', desc: 'Çift katmanlı kehribar/altın edebi çerçeve içinde mısralar.' },
    { id: 'lit_story_dropcap', name: 'Öykü & Deneme (2 Sütun)', tag: 'Öykü / Nesir', icon: '📚', desc: 'Büyük başlangıç harfi (Dropcap), 2 sütun öykü metni ve illüstrasyon.' },
    { id: 'lit_dark_nocturne', name: 'Gece & Mısra (Koyu Romantik)', tag: 'Gece Modu', icon: '🌙', desc: 'Gece mavisi zemin, altın sarısı başlık ve yıldızlı şiir atmosferi.' },
    { id: 'lit_book_review', name: 'Kitap & Eser İncelemesi', tag: 'Kritik', icon: '📕', desc: 'Solda kitap kapağı ve künye kartı, sağda kapsamlı eser incelemesi.' },
    { id: 'lit_art_gallery', name: 'Sanat Galerisi & Eser Okuması', tag: 'Müze', icon: '🖼️', desc: 'Büyük tablo çerçevesi, altında müze künye etiketi ve sanat analizi.' },
    { id: 'lit_minimal_haiku', name: 'Minimalist Zen & Modern Şiir', tag: 'Kinfolk', icon: '🌿', desc: 'Geniş ferah boşluklar, dikey vurgu çizgisi ve modern tipografi.' },
    { id: 'lit_anthology_grid', name: 'Edebiyat Seçkisi (3 Eser)', tag: 'Seçki', icon: '✨', desc: 'Şiir, aforizma ve mini denemeden oluşan 3’lü edebiyat panosu.' }
  ],

  // ==========================================================================
  // 7. KATALOG, PROJE & SERGİ VİTRİNİ MİZANPAJLARI (10 MODEL)
  // ==========================================================================
  catalog: [
    { id: 'cat_classic', name: '3’lü Dikey Vitrin + Tablo', tag: 'Standart', icon: '🛍️', desc: 'Üstte 3 dikey görsel vitrini, altta 4 satırlı spesifikasyon tablosu.' },
    { id: 'cat_grid_4', name: '2×2 Dörtlü Proje / Ürün Kartı', tag: 'Galeri', icon: '田', desc: '4 ayrı fotoğraflı ve açıklamalı proje/eser tanıtım kartı.' },
    { id: 'cat_hero_detail', name: '1 Ana Görsel + 2 Detay + Tablo', tag: 'Odaklı', icon: '🔍', desc: 'Solda büyük ana proje görseli, sağda 2 detay fotoğrafı ve tablo.' },
    { id: 'cat_lookbook', name: 'Asimetrik Tasarım Lookbook', tag: 'Moda / Sanat', icon: '✨', desc: 'Büyük sanatsal görsel, üst üste binen numara rozetleri ve açıklama.' },
    { id: 'cat_museum_exhibit', name: 'Müze & Sergi Kataloğu', tag: 'Koyu Lüks', icon: '🏺', desc: 'Koyu zemin üzerinde altın çerçeveli 3 eser ve sergi envanter tablosu.' },
    { id: 'cat_science_fair', name: 'TÜBİTAK / Bilim Fuarı Posteri', tag: 'Bilim & Proje', icon: '🔬', desc: 'Proje Amacı, Yöntem, Bulgular ve Sonuç kutularıyla akademik vitrin.' },
    { id: 'cat_horizontal_bands', name: 'Yatay 3’lü Vitrin Şeritleri', tag: 'Katalog', icon: '📑', desc: 'Solda fotoğraf, sağda başlık ve açıklama içeren 3 yatay proje kartı.' },
    { id: 'cat_minimal_atelier', name: 'Minimalist Atölye Seçkisi', tag: 'Ferah', icon: '🪴', desc: 'Krem zemin üzerinde ince çerçeveli 3 görsel ve kuratör değerlendirmesi.' },
    { id: 'cat_comparison', name: 'İkili Proje Karşılaştırma', tag: '2 Sütun', icon: '⚖️', desc: 'Yan yana iki büyük görsel sütunu ve detaylı özellik karşılaştırması.' },
    { id: 'cat_polaroid_wall', name: '6’lı Sergi & Etkinlik Panosu', tag: 'Albüm', icon: '🖼️', desc: 'Üstte vitrin başlığı, ortada 3 görsel + 3 bilgi kartından oluşan pano.' }
  ],

  // ==========================================================================
  // 8. K3 • ARKA KAPAK İÇİ (KÜNYE, EKİP & GELECEK SAYI) MİZANPAJLARI (10 MODEL)
  // ==========================================================================
  k3: [
    { id: 'k3_classic', name: 'Koyu Künye + Gelecek Sayı', tag: 'Standart', icon: '📋', desc: 'Üstte resmi yayın künyesi kartı, altta "Gelecek Sayıda Neler Var?" kutusu.' },
    { id: 'k3_team_grid', name: 'Fotoğraflı Yayın Kurulu Ekibi', tag: 'Ekip Vitrini', icon: '👥', desc: 'Dergiyi hazırlayan ekibin fotoğraflı kartları ve altta resmi künye.' },
    { id: 'k3_two_col_qr', name: 'İki Sütun Künye + Bize Yazın', tag: 'İletişimli', icon: '📬', desc: 'Sol sütunda resmi künye, sağ sütunda okur mektupları ve iletişim kartı.' },
    { id: 'k3_next_issue_poster', name: 'Gelecek Sayı Dev Afiş + Künye', tag: 'Fragman', icon: '🚀', desc: 'Üstte gelecek sayının görsel afişi, altta kompakt resmi künye tablosu.' },
    { id: 'k3_thanks_board', name: 'Teşekkür & Destekçiler Panosu', tag: 'Onur Panosu', icon: '💐', desc: 'Emeği geçen öğretmen, öğrenci ve konuklara teşekkür kartları + künye.' },
    { id: 'k3_quiz_kunye', name: 'Mini Dergi Bulmacası + Künye', tag: 'Etkileşimli', icon: '🧩', desc: 'Üstte "Dergimizi Ne Kadar Dikkatli Okudunuz?" mini testi, altta künye.' },
    { id: 'k3_light_corporate', name: 'Aydınlık Kurumsal Künye', tag: 'Resmi', icon: '🏛️', desc: 'Beyaz/gri kurumsal zemin üzerinde düzenli künye tablosu ve yayın ilkeleri.' },
    { id: 'k3_club_badges', name: 'Katkı Sunan Kulüpler Vitrini', tag: 'Okul Kulüpleri', icon: '🎖️', desc: 'Edebiyat, Bilim, Sanat ve Fotoğrafçılık kulüpleri tanıtımı + künye.' },
    { id: 'k3_editorial_calendar', name: 'Yıllık Yayın Takvimi & Künye', tag: 'Planlama', icon: '📅', desc: 'Güz, Kış, Bahar ve Yaz sayılarının yayın takvimi ve künye bilgileri.' },
    { id: 'k3_minimal_colophon', name: 'Klasik Kitap Kolofonu (Mühürlü)', tag: 'Edebi', icon: '✒️', desc: 'Krem zemin üzerinde ince çerçeveli klasik yayın kolofonu ve mühür.' }
  ],

  // ==========================================================================
  // 9. K4 • ARKA DIŞ KAPAK MİZANPAJLARI (10 MODEL)
  // ==========================================================================
  k4: [
    { id: 'k4_classic', name: 'Sinematik Tam Boy + Kapanış Sözü', tag: 'Standart', icon: '🌆', desc: 'Tam boy karartmalı fotoğraf, kurum adı, kapanış sözü ve barkod.' },
    { id: 'k4_corporate_id', name: 'Kurumsal Kimlik & İletişim Kartı', tag: 'Resmi Kapak', icon: '🏢', desc: 'Temiz zemin üzerinde kurum başlığı, vizyon, adres, web ve barkod.' },
    { id: 'k4_photo_collage', name: '3’lü Anı Kolajı + Kapanış Kuşağı', tag: 'Etkinlik', icon: '🎞️', desc: 'Dönemden 3 unutulmaz fotoğraf karesi ve "Gelecek Sayıda Buluşalım" şeridi.' },
    { id: 'k4_minimal_gold', name: 'Lacivert & Altın Çerçeveli Vecize', tag: 'Prestij', icon: '✨', desc: 'Gece laciverti zemin, altın çerçeve içinde unutulmaz bir vecize.' },
    { id: 'k4_split_back', name: 'Üst Görsel + Alt Kurumsal Kutu', tag: 'Modern', icon: '🌓', desc: 'Üst yarıda geniş fotoğraf, alt yarıda beyaz iletişim ve barkod bloğu.' },
    { id: 'k4_quote_manifesto', name: 'Dev Tipografik Slogan Kapak', tag: 'Manifesto', icon: '📢', desc: 'Büyük puntolu ilham verici kapanış sloganı ve modern renk bloğu.' },
    { id: 'k4_framed_art', name: 'Sanat Çerçeveli Görsel & Mühür', tag: 'Galeri', icon: '🖼️', desc: 'Ortada çerçeveli sanatsal fotoğraf, altında edebi kapanış notu.' },
    { id: 'k4_next_teaser', name: 'Gelecek Sayı Önizlemeli Kapak', tag: 'Tanıtım', icon: '🔜', desc: 'Arka kapakta gelecek sayının kapak önizlemesi ve abonelik/iletişim.' },
    { id: 'k4_green_nature', name: 'Zümrüt Doğa & Gelecek Kapanışı', tag: 'Ekoloji', icon: '🌿', desc: 'Zümrüt yeşili zemin, doğa fotoğrafı ve sürdürülebilir gelecek mesajı.' },
    { id: 'k4_vintage_stamp', name: 'Klasik Parşömen & Yayın Mührü', tag: 'Edebiyat', icon: '📜', desc: 'Krem parşömen dokusu, klasik çerçeve, kapanış dörtlüğü ve barkod.' }
  ]
};

function normalizeSmartSectionType(rawType) {
  if (!rawType) return 'article';
  if (rawType === 'k1' || rawType === 'cover') return 'cover';
  if (rawType === 'back' || rawType === 'k4') return 'k4';
  if (window.SMART_LAYOUT_CATALOG[rawType]) return rawType;
  return 'article';
}

function getSmartLayoutsForPage(page) {
  const sec = normalizeSmartSectionType(page?.type);
  return window.SMART_LAYOUT_CATALOG[sec] || window.SMART_LAYOUT_CATALOG.article;
}

// ============================================================================
// 2. AKILLI MİZANPAJ FABRIC.JS NESNE ÜRETİCİSİ (TÜM 90+ YENİ DÜZEN)
// ============================================================================
const _origBuildFabricTemplate = window.buildFabricObjectsForTemplatePage;

window.buildFabricObjectsForTemplatePage = function(page, pageIndex, fCanvas, onComplete) {
  const sec = normalizeSmartSectionType(page.type);
  const layout = page.layout || (window.SMART_LAYOUT_CATALOG[sec]?.[0]?.id) || 'minimalist';

  // Eğer mevcut temel mizanpajlardan biriyse ve yeni özel bir id seçilmemişse:
  const defaultHandled = {
    cover: ['minimalist', 'brutalist', 'modular', 'fullscreen'],
    toc: ['toc_classic'],
    article: ['art_classic'],
    interview: ['int_classic'],
    literature: ['lit_classic'],
    catalog: ['cat_classic'],
    k2: ['k2_classic'],
    k3: ['k3_classic'],
    k4: ['k4_classic']
  };

  if (defaultHandled[sec] && defaultHandled[sec].includes(layout) && typeof _origBuildFabricTemplate === 'function') {
    return _origBuildFabricTemplate(page, pageIndex, fCanvas, onComplete);
  }

  fCanvas.clear();
  const accent = page.accentColor || '#4f46e5';
  const school = (window.magazineData && magazineData.schoolName) ? magazineData.schoolName : 'Kültür & Sanat Dergisi';
  let pendingImages = 0;
  let finished = false;

  function checkDone() {
    if (pendingImages <= 0 && !finished) {
      finished = true;
      fCanvas.requestRenderAll();
      if (onComplete) onComplete();
    }
  }

  function queueImg(url, fallback, opts) {
    pendingImages++;
    loadFabricImageIntoSlot(fCanvas, url, fallback, opts, () => {
      pendingImages--;
      checkDone();
    });
  }

  let highlights = (page.highlights || '').split('\n').filter(Boolean);
  if (highlights.length === 0) highlights = ['Özel Dosya & Araştırma', 'Ayın Söyleşisi', 'Sanat & Edebiyat Seçkisi'];

  // --------------------------------------------------------------------------
  // A. ÖN KAPAK (COVER / K1) EKSTRA 8 MİZANPAJ
  // --------------------------------------------------------------------------
  if (sec === 'cover') {
    if (layout === 'time_frame') {
      fCanvas.setBackgroundColor('#0f172a', fCanvas.renderAll.bind(fCanvas));
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', {
        name: 'Kapak Portresi', fieldKey: 'coverImage', left: 26, top: 26, width: 498, height: 726, radius: 4, sendToBack: true
      });
      addFabRect(fCanvas, { name: 'İkonik Kırmızı Çerçeve', left: 16, top: 16, width: 518, height: 746, fill: 'transparent', stroke: '#dc2626', strokeWidth: 16 });
      addFabRect(fCanvas, { name: 'Üst Kırmızı Kuşak', left: 16, top: 16, width: 518, height: 34, fill: '#dc2626' });
      addFabText(fCanvas, (page.issueTag || 'ÖZEL SAYI • 2026') + '  |  ' + (page.price || school.toUpperCase()), {
        name: 'Üst Kuşak Yazısı', fieldKey: 'issueTag', left: 32, top: 26, width: 486, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      addFabText(fCanvas, page.magazineName || 'ZAMAN', {
        name: 'Dergi Logosu', fieldKey: 'magazineName', left: 36, top: 62, width: 478, fontSize: 74, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff', shadow: true
      });
      addFabRect(fCanvas, { name: 'Alt Manşet Kartı', left: 36, top: 520, width: 478, height: 210, rx: 12, fill: 'rgba(15,23,42,0.88)', stroke: '#dc2626', strokeWidth: 2 });
      addFabText(fCanvas, page.mainHeadline || 'YÜZYILIN DÖNÜŞÜMÜ', {
        name: 'Ana Manşet', fieldKey: 'mainHeadline', left: 54, top: 542, width: 442, fontSize: 32, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#ffffff'
      });
      addFabText(fCanvas, page.subHeadline || 'Bilim, kültür ve eğitimde yeni çağın öncüleri bu özel sayıda.', {
        name: 'Alt Manşet', fieldKey: 'subHeadline', left: 54, top: 625, width: 340, fontSize: 13, fontFamily: 'Inter', fill: '#e2e8f0'
      });
      addFabBarcode(fCanvas, 412, 682, '#ffffff');
      checkDone();
      return;
    }

    if (layout === 'split_horizon') {
      fCanvas.setBackgroundColor('#fafaf9', fCanvas.renderAll.bind(fCanvas));
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80', {
        name: 'Üst Kapak Fotoğrafı', fieldKey: 'coverImage', left: 0, top: 0, width: FABRIC_W, height: 430, radius: 0
      });
      addFabRect(fCanvas, { name: 'Logo Bandı', left: 32, top: 24, width: 486, height: 88, rx: 14, fill: 'rgba(15,23,42,0.78)' });
      addFabText(fCanvas, page.magazineName || 'UFUKLAR', {
        name: 'Dergi Logosu', fieldKey: 'magazineName', left: 46, top: 34, width: 458, fontSize: 54, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      addFabRect(fCanvas, { name: 'Orta Vurgu Kuşağı', left: 0, top: 422, width: FABRIC_W, height: 16, fill: accent });
      addFabText(fCanvas, page.issueTag || 'SAYI 01 • GÜZ DÖNEMİ ÖZEL DOSYASI', {
        name: 'Sayı Etiketi', fieldKey: 'issueTag', left: 36, top: 456, width: 478, fontSize: 11.5, fontFamily: 'Inter', fontWeight: 'bold', fill: accent
      });
      addFabText(fCanvas, page.mainHeadline || 'YENİ NESİL DÜŞÜNCE VE SANAT', {
        name: 'Ana Manşet', fieldKey: 'mainHeadline', left: 36, top: 482, width: 478, fontSize: 34, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a', lineHeight: 1.15
      });
      addFabText(fCanvas, page.subHeadline || 'Geleceği şekillendiren projeler, söyleşiler ve edebi seçkiler.', {
        name: 'Alt Manşet', fieldKey: 'subHeadline', left: 36, top: 572, width: 478, fontSize: 13.5, fontFamily: 'Inter', fill: '#475569'
      });
      highlights.slice(0, 3).forEach((h, i) => {
        const bx = 36 + i * 162;
        addFabRect(fCanvas, { name: `Alt Konu Kutusu ${i + 1}`, left: bx, top: 625, width: 150, height: 76, rx: 10, fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1.5 });
        addFabText(fCanvas, `0${i + 1}\n${h}`, { name: `Alt Konu ${i + 1}`, left: bx + 10, top: 636, width: 130, fontSize: 11.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#1e293b' });
      });
      addFabBarcode(fCanvas, 430, 722, '#0f172a');
      checkDone();
      return;
    }

    if (layout === 'mosaic_3') {
      fCanvas.setBackgroundColor('#0f172a', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, page.magazineName || 'MOZAİK', {
        name: 'Dergi Logosu', fieldKey: 'magazineName', left: 32, top: 28, width: 340, fontSize: 56, fontFamily: 'Space Grotesk', fontWeight: 'bold', fill: '#ffffff'
      });
      addFabText(fCanvas, (page.issueTag || 'SAYI 01') + '\n' + (page.price || '2026 SEÇKİSİ'), {
        name: 'Sayı Bilgisi', fieldKey: 'issueTag', left: 380, top: 38, width: 138, fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#38bdf8'
      });
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80', {
        name: 'Sol Büyük Kolaj Görseli', fieldKey: 'coverImage', left: 32, top: 108, width: 280, height: 390, radius: 16
      });
      queueImg(page.image2, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', {
        name: 'Sağ Üst Kolaj Görseli', left: 326, top: 108, width: 192, height: 188, radius: 16
      });
      queueImg(page.image3, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', {
        name: 'Sağ Alt Kolaj Görseli', left: 326, top: 310, width: 192, height: 188, radius: 16
      });
      addFabRect(fCanvas, { name: 'Alt Manşet Bloğu', left: 32, top: 516, width: 486, height: 215, rx: 18, fill: '#1e293b', stroke: '#38bdf8', strokeWidth: 2 });
      addFabText(fCanvas, page.mainHeadline || 'ÜÇ FARKLI DÜNYA, TEK BİR HİKÂYE', {
        name: 'Ana Manşet', fieldKey: 'mainHeadline', left: 52, top: 538, width: 446, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#ffffff'
      });
      addFabText(fCanvas, highlights.map(h => '✦ ' + h).join('   '), {
        name: 'Kapak Konu Başlıkları', fieldKey: 'highlights', left: 52, top: 625, width: 350, fontSize: 12.5, fontFamily: 'Inter', fill: '#bae6fd', lineHeight: 1.5
      });
      addFabBarcode(fCanvas, 416, 682, '#ffffff');
      checkDone();
      return;
    }

    if (layout === 'manifesto') {
      fCanvas.setBackgroundColor('#fdfbf7', fCanvas.renderAll.bind(fCanvas));
      addFabRect(fCanvas, { name: 'Klasik İnce Çerçeve', left: 22, top: 22, width: 506, height: 734, fill: 'transparent', stroke: '#1c1917', strokeWidth: 1.5 });
      addFabText(fCanvas, school.toUpperCase() + ' • ' + (page.issueTag || 'EDEBİYAT & DÜŞÜNCE DERGİSİ'), {
        name: 'Üst Başlık', fieldKey: 'issueTag', left: 40, top: 38, width: 470, fontSize: 10.5, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#57534e'
      });
      addFabText(fCanvas, page.magazineName || 'MANİFESTO', {
        name: 'Dergi Logosu', fieldKey: 'magazineName', left: 36, top: 62, width: 478, fontSize: 64, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: '#0f172a'
      });
      addFabRect(fCanvas, { name: 'Üst Çizgi', left: 60, top: 142, width: 430, height: 2, fill: '#0f172a' });
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80', {
        name: 'Dairesel Kapak Görseli', fieldKey: 'coverImage', left: 155, top: 166, width: 240, height: 240, maskType: 'circle', shadow: true
      });
      addFabText(fCanvas, page.mainHeadline || 'Kelimelerin İzinde Yeni Bir Çağ', {
        name: 'Ana Manşet', fieldKey: 'mainHeadline', left: 46, top: 430, width: 458, fontSize: 32, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', fill: '#0f172a'
      });
      addFabText(fCanvas, page.subHeadline || 'Düşünce, sanat, felsefe ve edebiyat seçkisi.', {
        name: 'Alt Manşet', fieldKey: 'subHeadline', left: 60, top: 515, width: 430, fontSize: 13.5, fontFamily: 'Merriweather', textAlign: 'center', fill: '#44403c'
      });
      addFabRect(fCanvas, { name: 'Fihrist Kutusu', left: 60, top: 575, width: 430, height: 118, rx: 10, fill: '#f5f5f4', stroke: '#d6d3d1', strokeWidth: 1 });
      addFabText(fCanvas, 'BU SAYIDA:\n' + highlights.map(h => '• ' + h).join('\n'), {
        name: 'Kapak Fihristi', fieldKey: 'highlights', left: 80, top: 588, width: 390, fontSize: 12, fontFamily: 'Inter', textAlign: 'center', fill: '#1c1917', lineHeight: 1.5
      });
      addFabBarcode(fCanvas, 232, 708, '#1c1917');
      checkDone();
      return;
    }

    if (layout === 'diagonal_band') {
      fCanvas.setBackgroundColor('#0f172a', fCanvas.renderAll.bind(fCanvas));
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80', {
        name: 'Tam Ekran Kapak Fotoğrafı', fieldKey: 'coverImage', left: 0, top: 0, width: FABRIC_W, height: FABRIC_H, radius: 0, sendToBack: true
      });
      addFabText(fCanvas, page.magazineName || 'VİZYON', {
        name: 'Dergi Logosu', fieldKey: 'magazineName', left: 32, top: 32, width: 486, fontSize: 72, fontFamily: 'Space Grotesk', fontWeight: 'bold', fill: '#ffffff', shadow: true
      });
      addFabRect(fCanvas, { name: 'Çapraz Manşet Kuşağı', left: -20, top: 470, width: 600, height: 115, fill: accent, angle: -5, shadow: true });
      addFabText(fCanvas, page.mainHeadline || 'GELECEĞİ TASARLAYANLAR', {
        name: 'Çapraz Ana Manşet', fieldKey: 'mainHeadline', left: 36, top: 486, width: 478, fontSize: 31, fontFamily: 'Space Grotesk', fontWeight: 'bold', fill: '#ffffff', angle: -5
      });
      addFabRect(fCanvas, { name: 'Alt Bilgi Şeridi', left: 28, top: 615, width: 494, height: 125, rx: 14, fill: 'rgba(15,23,42,0.9)' });
      addFabText(fCanvas, page.subHeadline || 'Bilim, tasarım ve gençlik dosyası.', {
        name: 'Alt Manşet', fieldKey: 'subHeadline', left: 46, top: 632, width: 350, fontSize: 13.5, fontFamily: 'Inter', fill: '#f8fafc'
      });
      addFabBarcode(fCanvas, 418, 692, '#ffffff');
      checkDone();
      return;
    }

    if (layout === 'luxury_gold') {
      fCanvas.setBackgroundColor('#090d16', fCanvas.renderAll.bind(fCanvas));
      addFabRect(fCanvas, { name: 'Dış Altın Çerçeve', left: 20, top: 20, width: 510, height: 738, fill: 'transparent', stroke: '#d97706', strokeWidth: 3 });
      addFabRect(fCanvas, { name: 'İç Altın Çerçeve', left: 28, top: 28, width: 494, height: 722, fill: 'transparent', stroke: '#fbbf24', strokeWidth: 1 });
      addFabText(fCanvas, page.issueTag || 'ÖZEL KOLEKSİYON SAYISI • 2026', {
        name: 'Üst Altın Başlık', fieldKey: 'issueTag', left: 48, top: 44, width: 454, fontSize: 11, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: '#fbbf24'
      });
      addFabText(fCanvas, page.magazineName || 'PRESTİJ', {
        name: 'Dergi Logosu', fieldKey: 'magazineName', left: 48, top: 66, width: 454, fontSize: 66, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', {
        name: 'Prestij Portre Görseli', fieldKey: 'coverImage', left: 85, top: 158, width: 380, height: 370, radius: 12, stroke: '#fbbf24', strokeWidth: 2, shadow: true
      });
      addFabText(fCanvas, page.mainHeadline || 'Zamanın Ötesinde İz Bırakanlar', {
        name: 'Ana Manşet', fieldKey: 'mainHeadline', left: 48, top: 552, width: 454, fontSize: 29, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#fde68a'
      });
      addFabText(fCanvas, page.subHeadline || 'Kültür, sanat ve akademi dünyasından özel portreler.', {
        name: 'Alt Manşet', fieldKey: 'subHeadline', left: 68, top: 635, width: 414, fontSize: 13, fontFamily: 'Inter', textAlign: 'center', fill: '#cbd5e1'
      });
      addFabBarcode(fCanvas, 232, 698, '#ffffff');
      checkDone();
      return;
    }

    if (layout === 'newspaper_front') {
      fCanvas.setBackgroundColor('#f5f3ef', fCanvas.renderAll.bind(fCanvas));
      addFabRect(fCanvas, { name: 'Üst Çizgi', left: 28, top: 26, width: 494, height: 3, fill: '#1c1917' });
      addFabText(fCanvas, page.magazineName || 'AKADEMİ POSTASI', {
        name: 'Gazete Logosu', fieldKey: 'magazineName', left: 28, top: 36, width: 494, fontSize: 48, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#1c1917'
      });
      addFabRect(fCanvas, { name: 'Tarih Şeridi Çerçevesi', left: 28, top: 98, width: 494, height: 24, fill: '#e7e5e4', stroke: '#1c1917', strokeWidth: 1 });
      addFabText(fCanvas, `${page.issueTag || 'SAYI 01'}   •   ${school.toUpperCase()}   •   ${page.price || 'ÖZEL BASKI'}`, {
        name: 'Tarih Şeridi', fieldKey: 'issueTag', left: 36, top: 104, width: 478, fontSize: 10.5, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#1c1917'
      });
      addFabText(fCanvas, page.mainHeadline || 'BİLİM VE SANATTA YENİ DÖNEM BAŞLIYOR', {
        name: 'Manşet Başlığı', fieldKey: 'mainHeadline', left: 28, top: 136, width: 494, fontSize: 32, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#0f172a'
      });
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', {
        name: 'Manşet Fotoğrafı', fieldKey: 'coverImage', left: 28, top: 222, width: 320, height: 330, radius: 4, stroke: '#1c1917', strokeWidth: 1.5
      });
      addFabRect(fCanvas, { name: 'Sağ Haber Sütunu', left: 360, top: 222, width: 162, height: 330, fill: '#ffffff', stroke: '#d6d3d1', strokeWidth: 1 });
      addFabText(fCanvas, 'ÖNE ÇIKANLAR\n\n' + highlights.map(h => '▪ ' + h).join('\n\n'), {
        name: 'Sağ Sütun Metni', fieldKey: 'highlights', left: 372, top: 236, width: 138, fontSize: 12.5, fontFamily: 'Merriweather', fill: '#1c1917', lineHeight: 1.45
      });
      addFabText(fCanvas, page.subHeadline || 'Okulumuzun ve yayın kurulumuzun hazırladığı bu özel sayıda, genç araştırmacıların makaleleri ve kültür-sanat röportajları yer alıyor.', {
        name: 'Alt Haber Özeti', fieldKey: 'subHeadline', left: 28, top: 568, width: 494, fontSize: 13, fontFamily: 'Merriweather', fill: '#292524', lineHeight: 1.5
      });
      addFabBarcode(fCanvas, 434, 712, '#1c1917');
      checkDone();
      return;
    }

    if (layout === 'polaroid_studio') {
      fCanvas.setBackgroundColor('#fef3c7', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, page.magazineName || 'ATÖLYE', {
        name: 'Dergi Logosu', fieldKey: 'magazineName', left: 32, top: 32, width: 486, fontSize: 64, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#78350f'
      });
      // Sol Polaroid Kart
      addFabRect(fCanvas, { name: 'Polaroid Çerçeve 1', left: 48, top: 130, width: 255, height: 325, rx: 8, fill: '#ffffff', angle: -4, shadow: true });
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80', {
        name: 'Polaroid Fotoğraf 1', fieldKey: 'coverImage', left: 62, top: 144, width: 225, height: 245, radius: 4, angle: -4
      });
      // Sağ Polaroid Kart
      addFabRect(fCanvas, { name: 'Polaroid Çerçeve 2', left: 255, top: 175, width: 245, height: 305, rx: 8, fill: '#ffffff', angle: 5, shadow: true });
      queueImg(page.image2, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80', {
        name: 'Polaroid Fotoğraf 2', left: 269, top: 190, width: 215, height: 230, radius: 4, angle: 5
      });
      addFabRect(fCanvas, { name: 'Alt Manşet Kartı', left: 36, top: 515, width: 478, height: 195, rx: 18, fill: '#78350f', shadow: true });
      addFabText(fCanvas, page.mainHeadline || 'YARATICI GENÇLİK GÜNLÜĞÜ', {
        name: 'Ana Manşet', fieldKey: 'mainHeadline', left: 56, top: 538, width: 438, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#fef3c7'
      });
      addFabText(fCanvas, page.subHeadline || 'Fotoğraf, tasarım, edebiyat ve kampüs yaşamından en özel kareler.', {
        name: 'Alt Manşet', fieldKey: 'subHeadline', left: 56, top: 618, width: 438, fontSize: 13, fontFamily: 'Inter', textAlign: 'center', fill: '#fde68a'
      });
      addFabBarcode(fCanvas, 232, 722, '#1c1917');
      checkDone();
      return;
    }
  }

  // --------------------------------------------------------------------------
  // B. K2 • ÖN KAPAK İÇİ (SUNUŞ, ATATÜRK KÖŞESİ, VİZYON) — 9 EKSTRA MİZANPAJ
  // --------------------------------------------------------------------------
  if (sec === 'k2') {
    if (layout === 'k2_ataturk') {
      fCanvas.setBackgroundColor('#0f172a', fCanvas.renderAll.bind(fCanvas));
      addFabRect(fCanvas, { name: 'Altın Varak Çerçeve', left: 24, top: 24, width: 502, height: 730, rx: 12, fill: 'transparent', stroke: '#f59e0b', strokeWidth: 2.5 });
      addFabText(fCanvas, 'CUMHURİYET VE BİLİM KÖŞESİ', {
        name: 'Üst Başlık', left: 44, top: 44, width: 462, fontSize: 12, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: '#fbbf24'
      });
      queueImg(page.image, 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Ataturk1930s.jpg', {
        name: 'Atatürk Portresi', fieldKey: 'image', left: 175, top: 76, width: 200, height: 235, radius: 16, stroke: '#fbbf24', strokeWidth: 3, shadow: true
      });
      addFabText(fCanvas, page.headerText || '"Hayatta en hakiki mürşit ilimdir, fendir."', {
        name: 'Atatürk Vecizesi', fieldKey: 'headerText', left: 48, top: 330, width: 454, fontSize: 22, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      addFabRect(fCanvas, { name: 'Hitabe Kartı', left: 44, top: 395, width: 462, height: 295, rx: 14, fill: '#1e293b', stroke: '#f59e0b', strokeWidth: 1.5 });
      addFabText(fCanvas, page.subText || 'Ey Türk Gençliği!\n\nBirinci vazifen; Türk istiklalini, Türk Cumhuriyetini, ilelebet muhafaza ve müdafaa etmektir. Mevcudiyetinin ve istikbalinin yegâne temeli budur. Bu temel, senin en kıymetli hazinendir.', {
        name: 'Gençliğe Hitabe / Metin', fieldKey: 'subText', left: 64, top: 418, width: 422, fontSize: 13.5, fontFamily: 'Merriweather', textAlign: 'center', fill: '#f8fafc', lineHeight: 1.6
      });
      addFabText(fCanvas, page.author || 'Mustafa Kemal ATATÜRK', {
        name: 'İmza', fieldKey: 'author', left: 48, top: 706, width: 454, fontSize: 15, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: '#fbbf24'
      });
      checkDone();
      return;
    }

    if (layout === 'k2_manifesto') {
      fCanvas.setBackgroundColor('#0f172a', fCanvas.renderAll.bind(fCanvas));
      queueImg(page.image, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80', {
        name: 'Tam Sayfa Arka Plan', fieldKey: 'image', left: 0, top: 0, width: FABRIC_W, height: FABRIC_H, radius: 0, sendToBack: true
      });
      addFabRect(fCanvas, { name: 'Yarı Saydam Manifesto Kartı', left: 46, top: 110, width: 458, height: 550, rx: 24, fill: 'rgba(15, 23, 42, 0.84)', stroke: 'rgba(255,255,255,0.25)', strokeWidth: 1.5, shadow: true });
      addFabText(fCanvas, 'DERGİMİZİN MANİFESTOSU', {
        name: 'Üst Rozet', left: 70, top: 148, width: 410, fontSize: 11.5, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#38bdf8'
      });
      addFabText(fCanvas, page.headerText || 'Neden Yazıyoruz, Neden Üretiyoruz?', {
        name: 'Manifesto Başlığı', fieldKey: 'headerText', left: 70, top: 180, width: 410, fontSize: 30, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      addFabText(fCanvas, page.subText || 'Her dergi sayfası, yarına bırakılan bir izdir. Bilimin ışığında, sanatın inceliğiyle ve gençliğin enerjisiyle hazırladığımız bu sayıda; sorgulayan, araştıran ve hayal kuran bir neslin sesini bulacaksınız.', {
        name: 'Manifesto Metni', fieldKey: 'subText', left: 76, top: 285, width: 398, fontSize: 15, fontFamily: 'Merriweather', fontStyle: 'italic', textAlign: 'center', fill: '#e2e8f0', lineHeight: 1.7
      });
      addFabText(fCanvas, page.author || school + ' Yayın Kurulu', {
        name: 'İmza', fieldKey: 'author', left: 76, top: 585, width: 398, fontSize: 14, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#fbbf24'
      });
      checkDone();
      return;
    }

    if (layout === 'k2_split_corp') {
      fCanvas.setBackgroundColor('#ffffff', fCanvas.renderAll.bind(fCanvas));
      queueImg(page.image, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', {
        name: 'Sol Kurumsal Görsel', fieldKey: 'image', left: 0, top: 0, width: 235, height: FABRIC_H, radius: 0
      });
      addFabRect(fCanvas, { name: 'Üst Vurgu Şeridi', left: 265, top: 52, width: 70, height: 5, rx: 2, fill: accent });
      addFabText(fCanvas, page.headerText || 'BAŞLARKEN &\nKURUMSAL VİZYON', {
        name: 'Sunuş Başlığı', fieldKey: 'headerText', left: 265, top: 72, width: 255, fontSize: 26, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a', lineHeight: 1.2
      });
      addFabText(fCanvas, page.subText || 'Değerli okurlarımız,\n\nKurumumuzun akademik, bilimsel ve sanatsal birikimini yansıtan dergimizin yeni sayısıyla sizlerle buluşmanın heyecanını yaşıyoruz.\n\nÖğrencilerimizin ve öğretmenlerimizin özverili çalışmalarıyla hazırlanan bu sayfalar, geleceğe tutulan bir aynadır.', {
        name: 'Sunuş Metni', fieldKey: 'subText', left: 265, top: 175, width: 255, fontSize: 13.5, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.65
      });
      addFabRect(fCanvas, { name: 'İmza Kutusu', left: 265, top: 610, width: 255, height: 86, rx: 12, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 1.5 });
      addFabText(fCanvas, (page.author || 'Okul / Kurum Müdürlüğü') + '\n' + school, {
        name: 'İmza & Unvan', fieldKey: 'author', left: 280, top: 632, width: 225, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', fill: accent
      });
      checkDone();
      return;
    }

    if (layout === 'k2_showcase4') {
      fCanvas.setBackgroundColor('#f8fafc', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, page.headerText || 'BU SAYIDA ÖNE ÇIKAN 4 DOSYA', {
        name: 'Vitrin Başlığı', fieldKey: 'headerText', left: 32, top: 34, width: 486, fontSize: 25, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
      });
      addFabText(fCanvas, page.subText || 'Yeni sayımızı okumaya başlamadan önce sizin için seçtiğimiz dört özel başlık:', {
        name: 'Vitrin Alt Başlığı', fieldKey: 'subText', left: 32, top: 74, width: 486, fontSize: 13, fontFamily: 'Inter', fill: '#475569'
      });
      const cards = [
        ['01 • KAPAK DOSYASI', 'Geleceğin Bilim ve Sanat Trendleri', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'],
        ['02 • AYIN SÖYLEŞİSİ', 'İlham Veren Akademik Portreler', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80'],
        ['03 • EDEBİYAT SEÇKİSİ', 'Genç Kalemlerden Şiir ve Denemeler', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80'],
        ['04 • PROJE VİTRİNİ', 'Atölye ve Laboratuvar Başarılarımız', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80']
      ];
      cards.forEach((c, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const lx = 32 + col * 250;
        const ty = 118 + row * 290;
        addFabRect(fCanvas, { name: `Vitrin Kartı ${idx + 1}`, left: lx, top: ty, width: 236, height: 270, rx: 16, fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1.5, shadow: true });
        queueImg(idx === 0 ? page.image : null, c[2], { name: `Vitrin Görsel ${idx + 1}`, left: lx + 12, top: ty + 12, width: 212, height: 155, radius: 12 });
        addFabText(fCanvas, c[0], { name: `Vitrin Kategori ${idx + 1}`, left: lx + 16, top: ty + 180, width: 204, fontSize: 10.5, fontFamily: 'Inter', fontWeight: 'bold', fill: accent });
        addFabText(fCanvas, c[1], { name: `Vitrin Başlık ${idx + 1}`, left: lx + 16, top: ty + 202, width: 204, fontSize: 14, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a' });
      });
      addStandardPageFooter(fCanvas, page, pageIndex);
      checkDone();
      return;
    }

    if (layout === 'k2_kinfolk_quote') {
      fCanvas.setBackgroundColor('#f5f2eb', fCanvas.renderAll.bind(fCanvas));
      addFabRect(fCanvas, { name: 'İnce Çerçeve', left: 36, top: 36, width: 478, height: 706, fill: 'transparent', stroke: '#d6d3d1', strokeWidth: 1.5 });
      addFabText(fCanvas, '“', { name: 'Dev Tırnak İşareti', left: 215, top: 120, width: 120, fontSize: 110, fontFamily: 'Playfair Display', textAlign: 'center', fill: '#d97706' });
      addFabText(fCanvas, page.headerText || 'Sanat ve bilim, bir toplumun geleceğe bıraktığı en kalıcı imzadır.', {
        name: 'Ana Özdeyiş', fieldKey: 'headerText', left: 68, top: 245, width: 414, fontSize: 30, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', fill: '#1c1917', lineHeight: 1.35
      });
      addFabRect(fCanvas, { name: 'Orta Çizgi', left: 225, top: 440, width: 100, height: 2, fill: '#d97706' });
      addFabText(fCanvas, page.subText || 'Bu sayıda emeği geçen tüm yazarlarımıza, öğretmenlerimize ve okurlarımıza ilham dolu bir okuma dileriz.', {
        name: 'Alt Açıklama', fieldKey: 'subText', left: 88, top: 470, width: 374, fontSize: 13.5, fontFamily: 'Inter', textAlign: 'center', fill: '#57534e', lineHeight: 1.6
      });
      addFabText(fCanvas, page.author || school.toUpperCase(), {
        name: 'Kurum İmza', fieldKey: 'author', left: 88, top: 620, width: 374, fontSize: 12, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: '#1c1917'
      });
      checkDone();
      return;
    }

    if (layout === 'k2_dual_message') {
      fCanvas.setBackgroundColor('#ffffff', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, page.headerText || 'SUNUŞ & BAŞYAZI MESAJLARI', {
        name: 'Sayfa Başlığı', fieldKey: 'headerText', left: 32, top: 32, width: 486, fontSize: 24, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
      });
      // Üst Kart (Kurum Müdürü)
      addFabRect(fCanvas, { name: 'Üst Mesaj Kartı', left: 32, top: 82, width: 486, height: 295, rx: 18, fill: '#f8fafc', stroke: '#cbd5e1', strokeWidth: 1.5, shadow: true });
      queueImg(page.image, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80', {
        name: 'Yönetici Portresi', fieldKey: 'image', left: 50, top: 104, width: 130, height: 165, radius: 14
      });
      addFabText(fCanvas, 'KURUM MÜDÜRÜMÜZÜN MESAJI', { name: 'Üst Unvan', left: 198, top: 104, width: 300, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: accent });
      addFabText(fCanvas, page.subText || 'Öğrencilerimizin düşünsel ve sanatsal üretimlerini bir araya getiren dergimiz, kurum kültürümüzün en değerli meyvelerinden biridir.', {
        name: 'Müdür Mesajı', fieldKey: 'subText', left: 198, top: 132, width: 300, fontSize: 13, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.55
      });
      // Alt Kart (Genel Yayın Yönetmeni)
      addFabRect(fCanvas, { name: 'Alt Mesaj Kartı', left: 32, top: 400, width: 486, height: 295, rx: 18, fill: '#fffbeb', stroke: '#fde68a', strokeWidth: 1.5, shadow: true });
      queueImg(page.image2, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', {
        name: 'Başeditör Portresi', left: 50, top: 422, width: 130, height: 165, radius: 14
      });
      addFabText(fCanvas, 'GENEL YAYIN YÖNETMENİNDEN', { name: 'Alt Unvan', left: 198, top: 422, width: 300, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: '#d97706' });
      addFabText(fCanvas, 'Aylar süren titiz bir hazırlık sürecinin ardından, her sayfasında yeni bir ufuk açacak özel dosyalarımızla karşınızdayız. Keyifli okumalar dileriz.', {
        name: 'Başeditör Mesajı', left: 198, top: 450, width: 300, fontSize: 13, fontFamily: 'Inter', fill: '#451a03', lineHeight: 1.55
      });
      addStandardPageFooter(fCanvas, page, pageIndex);
      checkDone();
      return;
    }

    if (layout === 'k2_timeline' || layout === 'k2_award_honor' || layout === 'k2_dark_prestige') {
      const isDark = (layout === 'k2_dark_prestige');
      fCanvas.setBackgroundColor(isDark ? '#0f172a' : '#ffffff', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, page.headerText || (layout === 'k2_award_honor' ? 'ONUR & BAŞARI TABLOMUZ' : (isDark ? 'PRESTİJ SUNUŞ & VİZYON' : 'KİLOMETRE TAŞLARIMIZ')), {
        name: 'Sayfa Başlığı', fieldKey: 'headerText', left: 36, top: 38, width: 478, fontSize: 26, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: isDark ? '#fbbf24' : '#0f172a'
      });
      queueImg(page.image, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', {
        name: 'Kapak İçi Görseli', fieldKey: 'image', left: 46, top: 92, width: 458, height: 220, radius: 16, stroke: isDark ? '#fbbf24' : accent, strokeWidth: 2, shadow: true
      });
      const items = [
        ['1. ADIM / BAŞARI', 'Ulusal Bilim ve Sanat Projelerinde Dereceler'],
        ['2. ADIM / KÜLTÜR', 'Geleneksel Edebiyat, Şiir ve Söyleşi Günleri'],
        ['3. ADIM / GELECEK', 'Dijital Yayıncılık ve Tasarım Atölyesi']
      ];
      items.forEach((it, idx) => {
        const ty = 336 + idx * 116;
        addFabRect(fCanvas, { name: `Kart ${idx + 1}`, left: 46, top: ty, width: 458, height: 98, rx: 14, fill: isDark ? '#1e293b' : '#f8fafc', stroke: isDark ? '#334155' : '#e2e8f0', strokeWidth: 1.5 });
        addFabText(fCanvas, it[0], { name: `Alt Başlık ${idx + 1}`, left: 66, top: ty + 18, width: 418, fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', fill: isDark ? '#fbbf24' : accent });
        addFabText(fCanvas, it[1], { name: `Açıklama ${idx + 1}`, left: 66, top: ty + 44, width: 418, fontSize: 14, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: isDark ? '#ffffff' : '#1e293b' });
      });
      addStandardPageFooter(fCanvas, page, pageIndex);
      checkDone();
      return;
    }
  }

  // --------------------------------------------------------------------------
  // C. İÇİNDEKİLER & EDİTÖRDEN (TOC) — 9 EKSTRA MİZANPAJ
  // --------------------------------------------------------------------------
  if (sec === 'toc') {
    const pagesList = (window.magazineData && magazineData.pages) ? magazineData.pages : [];

    if (layout === 'toc_vogue_split') {
      fCanvas.setBackgroundColor('#ffffff', fCanvas.renderAll.bind(fCanvas));
      // Sol Sütun: Koyu Editör Sütunu
      addFabRect(fCanvas, { name: 'Sol Editör Sütunu', left: 24, top: 24, width: 195, height: 695, rx: 18, fill: '#0f172a', shadow: true });
      queueImg(page.editorImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', {
        name: 'Editör Portresi', fieldKey: 'editorImage', left: 44, top: 44, width: 155, height: 175, radius: 14
      });
      addFabText(fCanvas, page.editorTitle || 'Editörden\nMektup', {
        name: 'Editör Başlığı', fieldKey: 'editorTitle', left: 44, top: 235, width: 155, fontSize: 21, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#fbbf24'
      });
      addFabText(fCanvas, page.editorText || 'Yeni sayımızda sanatı, bilimi ve gençliğin dinamizmini aynı potada buluşturduk. Her sayfada yeni bir keşif sizi bekliyor.', {
        name: 'Editör Metni', fieldKey: 'editorText', left: 44, top: 300, width: 155, fontSize: 11.5, fontFamily: 'Inter', fill: '#e2e8f0', lineHeight: 1.55
      });
      addFabText(fCanvas, '— ' + (page.editorName || 'Yayın Yönetmeni'), {
        name: 'Editör İmza', fieldKey: 'editorName', left: 44, top: 660, width: 155, fontSize: 11.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff'
      });

      // Sağ Sütun: Dev Rakamlı İçindekiler
      addFabText(fCanvas, 'İÇİNDEKİLER', {
        name: 'İçindekiler Başlığı', left: 240, top: 32, width: 280, fontSize: 30, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
      });
      addFabRect(fCanvas, { name: 'Başlık Çizgisi', left: 240, top: 76, width: 280, height: 2.5, fill: accent });
      pagesList.slice(0, 7).forEach((pItem, idx) => {
        const ry = 96 + idx * 86;
        addFabRect(fCanvas, { name: `Satır Kartı ${idx + 1}`, left: 240, top: ry, width: 280, height: 74, rx: 12, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 1, actionType: 'gotoPage', actionValue: String(idx + 1) });
        addFabText(fCanvas, String(idx + 1).padStart(2, '0'), {
          name: `Dev Numara ${idx + 1}`, left: 252, top: ry + 14, width: 54, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: accent
        });
        addFabText(fCanvas, pItem.navTitle || ('Bölüm ' + (idx + 1)), {
          name: `Bölüm Adı ${idx + 1}`, left: 312, top: ry + 18, width: 196, fontSize: 13.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#0f172a'
        });
        addFabText(fCanvas, 'Sayfa ' + (idx + 1) + ' • Özel İçerik', {
          name: `Bölüm Alt Yazı ${idx + 1}`, left: 312, top: ry + 42, width: 196, fontSize: 10.5, fontFamily: 'Inter', fill: '#64748b'
        });
      });
      addStandardPageFooter(fCanvas, page, pageIndex);
      checkDone();
      return;
    }

    if (layout === 'toc_editor_full') {
      fCanvas.setBackgroundColor('#fafaf9', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, 'BAŞYAZI & EDİTÖRÜN MASASI', { name: 'Üst Etiket', left: 36, top: 32, width: 478, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: accent });
      addFabText(fCanvas, page.editorTitle || 'Yeni Bir Sayfayı Aralarken', {
        name: 'Başyazı Başlığı', fieldKey: 'editorTitle', left: 36, top: 54, width: 478, fontSize: 34, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
      });
      queueImg(page.editorImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80', {
        name: 'Editör Büyük Portre', fieldKey: 'editorImage', left: 36, top: 115, width: 220, height: 265, radius: 16, shadow: true
      });
      addFabRect(fCanvas, { name: 'Sağ Alıntı Kutusu', left: 274, top: 115, width: 240, height: 265, rx: 16, fill: '#fef3c7', stroke: '#fde68a', strokeWidth: 1.5 });
      addFabText(fCanvas, '“' + (page.editorQuote || 'Her yeni sayı, birlikte düşünen ve üreten büyük bir ailenin ortak heyecanıdır.') + '”', {
        name: 'Editör Alıntısı', fieldKey: 'editorQuote', left: 292, top: 145, width: 204, fontSize: 16, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', fill: '#78350f', lineHeight: 1.5
      });
      addFabText(fCanvas, page.editorText || 'Sevgili Okurlar,\n\nDergimizin bu sayısında edebiyattan bilime, güncel söyleşilerden proje vitrinlerine kadar uzanan zengin bir seçki hazırladık. Sayfalar arasında gezinirken her bir çalışmanın arkasındaki emeği ve tutkuyu hissedeceğinize inanıyoruz.\n\nKeyifli okumalar dileriz.', {
        name: 'Başyazı Ana Metni', fieldKey: 'editorText', left: 36, top: 405, width: 478, fontSize: 14, fontFamily: 'Merriweather', fill: '#334155', lineHeight: 1.7
      });
      addFabText(fCanvas, '— ' + (page.editorName || 'Genel Yayın Yönetmeni'), {
        name: 'Editör İmzası', fieldKey: 'editorName', left: 250, top: 675, width: 264, fontSize: 14, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#0f172a'
      });
      addStandardPageFooter(fCanvas, page, pageIndex);
      checkDone();
      return;
    }

    // Diğer tüm zengin TOC düzenleri (toc_visual_cards, toc_categorized, toc_big_numbers, toc_minimal_lines, toc_dark_cinema, toc_timeline_flow, toc_magazine_desk)
    const isDarkToc = (layout === 'toc_dark_cinema');
    fCanvas.setBackgroundColor(isDarkToc ? '#0f172a' : '#f8fafc', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, page.editorTitle || 'İÇİNDEKİLER & YAYIN REHBERİ', {
      name: 'Sayfa Başlığı', fieldKey: 'editorTitle', left: 32, top: 30, width: 486, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: isDarkToc ? '#ffffff' : '#0f172a'
    });
    addFabRect(fCanvas, {
      name: 'Üst Editör Özeti Kartı', left: 32, top: 76, width: 486, height: 112, rx: 14, fill: isDarkToc ? '#1e293b' : '#ffffff', stroke: isDarkToc ? '#334155' : '#e2e8f0', strokeWidth: 1.5
    });
    queueImg(page.editorImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', {
      name: 'Editör Fotoğrafı', fieldKey: 'editorImage', left: 46, top: 90, width: 84, height: 84, radius: 12
    });
    addFabText(fCanvas, page.editorText || 'Bu sayımızda yer alan tüm özel dosyaları, söyleşileri ve kültür-sanat yazılarını aşağıdan inceleyebilirsiniz.', {
      name: 'Editör Notu', fieldKey: 'editorText', left: 144, top: 94, width: 356, fontSize: 12.5, fontFamily: 'Inter', fill: isDarkToc ? '#cbd5e1' : '#334155', lineHeight: 1.45
    });

    pagesList.slice(0, 8).forEach((pItem, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 32 + col * 248;
      const by = 206 + row * 124;
      addFabRect(fCanvas, {
        name: `Fihrist Kartı ${idx + 1}`, left: bx, top: by, width: 238, height: 110, rx: 14,
        fill: isDarkToc ? '#1e293b' : '#ffffff', stroke: isDarkToc ? '#334155' : '#cbd5e1', strokeWidth: 1.5, shadow: true,
        actionType: 'gotoPage', actionValue: String(idx + 1)
      });
      addFabText(fCanvas, String(idx + 1).padStart(2, '0'), {
        name: `Sayfa Rakamı ${idx + 1}`, left: bx + 16, top: by + 16, width: 65, fontSize: 34, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: isDarkToc ? '#fbbf24' : accent
      });
      addFabText(fCanvas, pItem.navTitle || ('Sayfa ' + (idx + 1)), {
        name: `Bölüm Başlığı ${idx + 1}`, left: bx + 16, top: by + 62, width: 206, fontSize: 13.5, fontFamily: 'Inter', fontWeight: 'bold', fill: isDarkToc ? '#ffffff' : '#0f172a'
      });
    });
    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // --------------------------------------------------------------------------
  // D. MAKALE & ÖZEL DOSYA (ARTICLE) — 9 EKSTRA MİZANPAJ
  // --------------------------------------------------------------------------
  if (sec === 'article') {
    if (layout === 'art_left_split') {
      fCanvas.setBackgroundColor('#ffffff', fCanvas.renderAll.bind(fCanvas));
      queueImg(page.image, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', {
        name: 'Sol Boydan Boya Görsel', fieldKey: 'image', left: 0, top: 0, width: 235, height: FABRIC_H, radius: 0
      });
      addFabRect(fCanvas, { name: 'Kategori Rozeti', left: 260, top: 38, width: 120, height: 24, rx: 12, fill: accent });
      addFabText(fCanvas, page.category || 'ÖZEL DOSYA', {
        name: 'Kategori Yazısı', fieldKey: 'category', left: 264, top: 44, width: 112, fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      addFabText(fCanvas, page.title || 'GELECEĞİN YENİ KURALLARI', {
        name: 'Makale Başlığı', fieldKey: 'title', left: 260, top: 76, width: 260, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a', lineHeight: 1.15
      });
      addFabText(fCanvas, page.author || 'Yazan: Araştırma Masası', {
        name: 'Yazar Bilgisi', fieldKey: 'author', left: 260, top: 162, width: 260, fontSize: 11.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#64748b'
      });
      addFabText(fCanvas, page.content || 'Bilim, sanat ve tasarım dünyasındaki dönüşüm hız kesmeden devam ediyor. Bu özel dosyada yeni nesil yaklaşımları ve gençlerin projelerini inceledik.\n\nHer bir paragrafı ve görseli dilediğiniz gibi taşıyabilir ve yeniden boyutlandırabilirsiniz.', {
        name: 'Makale Metni', fieldKey: 'content', left: 260, top: 196, width: 260, fontSize: 13, fontFamily: 'Merriweather', fill: '#334155', lineHeight: 1.6
      });
      addFabRect(fCanvas, { name: 'Alt Vurgu Kutusu', left: 260, top: 555, width: 260, height: 150, rx: 14, fill: '#f8fafc', stroke: accent, strokeWidth: 2 });
      addFabText(fCanvas, '“' + (page.pullQuote || 'Yaratıcılık, sınırları zorlamakla ve doğru soruları sormakla başlar.') + '”', {
        name: 'Vurgu Sözü', fieldKey: 'pullQuote', left: 276, top: 575, width: 228, fontSize: 13.5, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', fill: '#0f172a'
      });
      checkDone();
      return;
    }

    if (layout === 'art_collage_3') {
      fCanvas.setBackgroundColor('#ffffff', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, page.category || 'ETKİNLİK & HABER DOSYASI', {
        name: 'Kategori', fieldKey: 'category', left: 32, top: 28, width: 486, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: accent
      });
      addFabText(fCanvas, page.title || 'KAMPÜSTE BİLİM VE SANAT GÜNLERİ', {
        name: 'Haber Başlığı', fieldKey: 'title', left: 32, top: 48, width: 486, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
      });
      queueImg(page.image, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80', {
        name: 'Sol Kolaj Fotoğrafı', fieldKey: 'image', left: 32, top: 105, width: 285, height: 250, radius: 14, shadow: true
      });
      queueImg(page.image2, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', {
        name: 'Sağ Üst Fotoğraf', left: 330, top: 105, width: 188, height: 118, radius: 14, shadow: true
      });
      queueImg(page.image3, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80', {
        name: 'Sağ Alt Fotoğraf', left: 330, top: 237, width: 188, height: 118, radius: 14, shadow: true
      });
      addFabText(fCanvas, page.content || 'Dönem boyunca gerçekleştirdiğimiz atölyeler, söyleşiler ve sergilerden en özel anları bu sayfada bir araya getirdik. Öğrencilerimizin aktif katılımıyla gerçekleşen etkinlikler büyük ilgi gördü.', {
        name: 'Sol Sütun Metni', fieldKey: 'content', left: 32, top: 378, width: 235, fontSize: 13, fontFamily: 'Merriweather', fill: '#334155', lineHeight: 1.6
      });
      addFabRect(fCanvas, { name: 'Sağ Bilgi Kartı', left: 284, top: 378, width: 234, height: 330, rx: 16, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 1.5 });
      addFabText(fCanvas, 'ÖNE ÇIKAN NOTLAR\n\n' + (page.pullQuote || '• 15+ Atölye Çalışması\n• 300+ Katılımcı Öğrenci\n• Ödüllü Proje Sunumları'), {
        name: 'Sağ Sütun Özeti', fieldKey: 'pullQuote', left: 302, top: 400, width: 198, fontSize: 13.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#1e293b', lineHeight: 1.65
      });
      addStandardPageFooter(fCanvas, page, pageIndex);
      checkDone();
      return;
    }

    if (layout === 'art_infographic') {
      fCanvas.setBackgroundColor('#f8fafc', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, page.title || 'RAKAMLARLA ARAŞTIRMA DOSYASI', {
        name: 'Dosya Başlığı', fieldKey: 'title', left: 32, top: 32, width: 486, fontSize: 28, fontFamily: 'Space Grotesk', fontWeight: 'bold', fill: '#0f172a'
      });
      const stats = [
        ['%92', 'Katılım & Memnuniyet'],
        ['24+', 'Bilimsel & Sanatsal Proje'],
        ['1.500', 'Okur & Dijital Erişim']
      ];
      stats.forEach((st, i) => {
        const bx = 32 + i * 166;
        addFabRect(fCanvas, { name: `İstatistik Kartı ${i + 1}`, left: bx, top: 88, width: 154, height: 105, rx: 16, fill: i === 0 ? accent : '#ffffff', stroke: '#cbd5e1', strokeWidth: 1.5, shadow: true });
        addFabText(fCanvas, st[0], { name: `Rakam ${i + 1}`, left: bx + 12, top: 104, width: 130, fontSize: 32, fontFamily: 'Space Grotesk', fontWeight: 'bold', textAlign: 'center', fill: i === 0 ? '#ffffff' : accent });
        addFabText(fCanvas, st[1], { name: `Etiket ${i + 1}`, left: bx + 12, top: 152, width: 130, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: i === 0 ? '#e0e7ff' : '#334155' });
      });
      queueImg(page.image, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', {
        name: 'Dosya Görseli', fieldKey: 'image', left: 32, top: 215, width: 486, height: 225, radius: 16, shadow: true
      });
      addFabText(fCanvas, page.content || 'Verilerle desteklenen bu özel araştırma dosyasında, yürüttüğümüz çalışmaların somut çıktılarını ve gelecek hedeflerimizi inceledik. İstatistik kutularının üzerindeki rakamları çift tıklayarak kendi verilerinizle değiştirebilirsiniz.', {
        name: 'Analiz Metni', fieldKey: 'content', left: 32, top: 462, width: 486, fontSize: 13.5, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.65
      });
      addStandardPageFooter(fCanvas, page, pageIndex);
      checkDone();
      return;
    }

    // Diğer Makale mizanpajları (art_dark_cinema, art_z_flow, art_newspaper, art_fullbleed_card, art_center_focus, art_academic_box)
    const isDarkArt = (layout === 'art_dark_cinema');
    fCanvas.setBackgroundColor(isDarkArt ? '#090d16' : '#ffffff', fCanvas.renderAll.bind(fCanvas));
    if (layout === 'art_fullbleed_card') {
      queueImg(page.image, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80', {
        name: 'Tam Sayfa Fotoğraf', fieldKey: 'image', left: 0, top: 0, width: FABRIC_W, height: FABRIC_H, radius: 0, sendToBack: true
      });
      addFabRect(fCanvas, { name: 'Yüzen Makale Kartı', left: 32, top: 340, width: 486, height: 390, rx: 22, fill: 'rgba(255,255,255,0.95)', shadow: true });
      addFabText(fCanvas, page.category || 'ÖZEL DOSYA', { name: 'Kategori', fieldKey: 'category', left: 56, top: 366, width: 200, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: accent });
      addFabText(fCanvas, page.title || 'DOĞA VE İNSANIN YENİ YOLCULUĞU', { name: 'Başlık', fieldKey: 'title', left: 56, top: 390, width: 438, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a' });
      addFabText(fCanvas, page.content || 'Tam sayfa görsel üzerinde yükselen bu modern kart düzeni, fotoğrafın etkisini korurken metnin rahat okunmasını sağlar.', {
        name: 'Makale Metni', fieldKey: 'content', left: 56, top: 475, width: 438, fontSize: 13.5, fontFamily: 'Merriweather', fill: '#334155', lineHeight: 1.6
      });
      checkDone();
      return;
    }

    addFabText(fCanvas, page.category || 'ARAŞTIRMA & MAKALE', {
      name: 'Kategori', fieldKey: 'category', left: 32, top: 28, width: 486, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: isDarkArt ? '#38bdf8' : accent
    });
    addFabText(fCanvas, page.title || 'BİLİM, KÜLTÜR VE GELECEK PERSPEKTİFİ', {
      name: 'Makale Başlığı', fieldKey: 'title', left: 32, top: 48, width: 486, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: isDarkArt ? '#ffffff' : '#0f172a'
    });
    queueImg(page.image, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', {
      name: 'Makale Görseli', fieldKey: 'image', left: 32, top: 120, width: 235, height: 240, radius: 16, maskType: layout === 'art_center_focus' ? 'circle' : 'none', shadow: true
    });
    addFabRect(fCanvas, {
      name: 'Özet / Vurgu Kutusu', left: 284, top: 120, width: 234, height: 240, rx: 16, fill: isDarkArt ? '#1e293b' : '#f8fafc', stroke: isDarkArt ? '#38bdf8' : accent, strokeWidth: 2
    });
    addFabText(fCanvas, '“' + (page.pullQuote || 'Her büyük keşif, merakla sorulan tek bir soruyla başlar.') + '”', {
      name: 'Vurgu Sözü', fieldKey: 'pullQuote', left: 302, top: 150, width: 198, fontSize: 15, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', fill: isDarkArt ? '#f8fafc' : '#0f172a', lineHeight: 1.5
    });
    addFabText(fCanvas, page.content || 'Bu özel makale düzeninde görsel, vurgu kutusu ve ana metin dengeli bir akış içinde sunulur. İstediğiniz kutuya tıklayarak yerini, boyutunu veya rengini değiştirebilirsiniz.', {
      name: 'Makale Ana Metni', fieldKey: 'content', left: 32, top: 385, width: 486, fontSize: 13.5, fontFamily: 'Merriweather', fill: isDarkArt ? '#cbd5e1' : '#334155', lineHeight: 1.65
    });
    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // --------------------------------------------------------------------------
  // E. RÖPORTAJ & SÖYLEŞİ (INTERVIEW) — 9 EKSTRA MİZANPAJ
  // --------------------------------------------------------------------------
  if (sec === 'interview') {
    const qaList = [
      { qKey: 'q1', aKey: 'a1', q: page.q1 || 'Soru 1: Çalışmalarınızda gençlere en önemli tavsiyeniz nedir?', a: page.a1 || 'Merak duygusunu asla kaybetmemek, çok okumak ve farklı disiplinleri bir arada düşünmek en büyük anahtardır.' },
      { qKey: 'q2', aKey: 'a2', q: page.q2 || 'Soru 2: Geleceğin dünyasında hangi beceriler öne çıkacak?', a: page.a2 || 'Analitik düşünme, estetik bakış açısı ve kendi kültürünü iyi tanıyarak dünyayla iletişim kurabilme yeteneği.' },
      { qKey: 'q3', aKey: 'a3', q: page.q3 || 'Soru 3: Okul dergimiz okurlarına son mesajınız nedir?', a: page.a3 || 'Üretmekten, yazmaktan ve birlikte güzel işler ortaya koymaktan vazgeçmeyin.' }
    ];

    if (layout === 'int_left_portrait') {
      fCanvas.setBackgroundColor('#ffffff', fCanvas.renderAll.bind(fCanvas));
      addFabRect(fCanvas, { name: 'Sol Konuk Sütunu', left: 24, top: 24, width: 185, height: 695, rx: 18, fill: '#0f172a', shadow: true });
      queueImg(page.photo, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', {
        name: 'Konuk Portresi', fieldKey: 'photo', left: 38, top: 40, width: 157, height: 220, radius: 14
      });
      addFabText(fCanvas, page.rubric || 'AYIN KONUĞU', { name: 'Söyleşi Etiketi', fieldKey: 'rubric', left: 38, top: 276, width: 157, fontSize: 10.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#fbbf24' });
      addFabText(fCanvas, page.interviewee || 'Prof. Dr. İlber Ortaylı', { name: 'Konuk Adı', fieldKey: 'interviewee', left: 38, top: 298, width: 157, fontSize: 21, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#ffffff' });
      addFabText(fCanvas, page.role || 'Akademisyen & Yazar', { name: 'Konuk Unvanı', fieldKey: 'role', left: 38, top: 360, width: 157, fontSize: 12, fontFamily: 'Inter', fill: '#38bdf8' });
      addFabText(fCanvas, page.intro || 'Bilim, kültür ve gençliğin geleceği üzerine gerçekleştirdiğimiz özel söyleşi.', { name: 'Konuk Özgeçmişi', fieldKey: 'intro', left: 38, top: 396, width: 157, fontSize: 11.5, fontFamily: 'Inter', fill: '#cbd5e1', lineHeight: 1.5 });

      qaList.forEach((item, idx) => {
        const ty = 28 + idx * 232;
        addFabRect(fCanvas, { name: `Soru Kartı ${idx + 1}`, left: 226, top: ty, width: 296, height: 214, rx: 16, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 1.5 });
        addFabText(fCanvas, item.q, { name: `Soru ${idx + 1}`, fieldKey: item.qKey, left: 242, top: ty + 16, width: 264, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', fill: accent });
        addFabText(fCanvas, item.a, { name: `Cevap ${idx + 1}`, fieldKey: item.aKey, left: 242, top: ty + 76, width: 264, fontSize: 12.5, fontFamily: 'Merriweather', fill: '#334155', lineHeight: 1.5 });
      });
      checkDone();
      return;
    }

    const isDarkInt = (layout === 'int_dark_spotlight');
    fCanvas.setBackgroundColor(isDarkInt ? '#090d16' : '#fafaf9', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, (page.rubric || 'ÖZEL SÖYLEŞİ') + ' • ' + (page.interviewee || 'AYIN KONUĞU'), {
      name: 'Söyleşi Başlığı', fieldKey: 'interviewee', left: 32, top: 30, width: 486, fontSize: 25, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: isDarkInt ? '#fbbf24' : '#0f172a'
    });
    queueImg(page.photo, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', {
      name: 'Konuk Fotoğrafı', fieldKey: 'photo', left: 32, top: 76, width: 135, height: 135, radius: 18, shadow: true
    });
    addFabRect(fCanvas, { name: 'Manşet Alıntı Kartı', left: 182, top: 76, width: 336, height: 135, rx: 18, fill: isDarkInt ? '#1e293b' : '#ffffff', stroke: isDarkInt ? '#fbbf24' : accent, strokeWidth: 2 });
    addFabText(fCanvas, '“' + (page.intro || 'Gençlerin enerjisi ve merakı, yarının dünyasını aydınlatacak en büyük güçtür.') + '”', {
      name: 'Söyleşi Alıntısı', fieldKey: 'intro', left: 198, top: 96, width: 304, fontSize: 14.5, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', fill: isDarkInt ? '#ffffff' : '#0f172a', lineHeight: 1.45
    });

    qaList.forEach((item, idx) => {
      const ty = 230 + idx * 162;
      addFabRect(fCanvas, {
        name: `Diyalog Kutusu ${idx + 1}`, left: 32, top: ty, width: 486, height: 146, rx: 16,
        fill: isDarkInt ? '#1e293b' : '#ffffff', stroke: isDarkInt ? '#334155' : '#cbd5e1', strokeWidth: 1.5, shadow: true
      });
      addFabText(fCanvas, `0${idx + 1} • ` + item.q, {
        name: `Soru ${idx + 1}`, fieldKey: item.qKey, left: 50, top: ty + 16, width: 450, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', fill: isDarkInt ? '#fbbf24' : accent
      });
      addFabText(fCanvas, item.a, {
        name: `Cevap ${idx + 1}`, fieldKey: item.aKey, left: 50, top: ty + 58, width: 450, fontSize: 12.5, fontFamily: 'Inter', fill: isDarkInt ? '#e2e8f0' : '#334155', lineHeight: 1.45
      });
    });
    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // --------------------------------------------------------------------------
  // F. EDEBİYAT, ŞİİR & SANAT (LITERATURE) — 9 EKSTRA MİZANPAJ
  // --------------------------------------------------------------------------
  if (sec === 'literature') {
    if (layout === 'lit_full_canvas') {
      fCanvas.setBackgroundColor('#0f172a', fCanvas.renderAll.bind(fCanvas));
      queueImg(page.bgImage, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80', {
        name: 'Tam Sayfa Sanat Görseli', fieldKey: 'bgImage', left: 0, top: 0, width: FABRIC_W, height: FABRIC_H, radius: 0, sendToBack: true
      });
      addFabRect(fCanvas, { name: 'Yarı Saydam Şiir Kartı', left: 52, top: 95, width: 446, height: 585, rx: 24, fill: 'rgba(15, 23, 42, 0.82)', stroke: '#fbbf24', strokeWidth: 1.5, shadow: true });
      addFabText(fCanvas, page.header || 'EDEBİYAT & ŞİİR SEÇKİSİ', { name: 'Üst Başlık', fieldKey: 'header', left: 76, top: 128, width: 398, fontSize: 11, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: '#fbbf24' });
      addFabText(fCanvas, page.title || 'Geceye Düşen Mısralar', { name: 'Şiir Başlığı', fieldKey: 'title', left: 76, top: 156, width: 398, fontSize: 32, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff' });
      addFabText(fCanvas, page.poemText || 'Kelimeler akar zamanın içinden,\nBir yaprak düşer sonbahar dalından.\nUmut yeşerir her yeni dizelerde,\nSanatla büyür yarının düşleri.', {
        name: 'Şiir Metni', fieldKey: 'poemText', left: 82, top: 255, width: 386, fontSize: 16, fontFamily: 'Playfair Display', fontStyle: 'italic', textAlign: 'center', fill: '#f8fafc', lineHeight: 1.85
      });
      addFabText(fCanvas, page.author || 'Kaleme Alan: Edebiyat Kulübü', { name: 'Şair / Yazar', fieldKey: 'author', left: 76, top: 615, width: 398, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#fde68a' });
      checkDone();
      return;
    }

    const isDarkLit = (layout === 'lit_dark_nocturne');
    fCanvas.setBackgroundColor(isDarkLit ? '#0c1222' : '#fdfbf7', fCanvas.renderAll.bind(fCanvas));
    addFabRect(fCanvas, { name: 'Dış Edebi Çerçeve', left: 26, top: 26, width: 498, height: 695, rx: 14, fill: 'transparent', stroke: '#d97706', strokeWidth: 2 });
    addFabText(fCanvas, page.header || 'EDEBİYAT, ŞİİR & SANAT KÖŞESİ', {
      name: 'Üst Başlık', fieldKey: 'header', left: 48, top: 44, width: 454, fontSize: 11, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: '#d97706'
    });
    addFabText(fCanvas, page.title || 'Zamanın İzinde Mısralar', {
      name: 'Eser Başlığı', fieldKey: 'title', left: 48, top: 68, width: 454, fontSize: 30, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', fill: isDarkLit ? '#ffffff' : '#0f172a'
    });
    queueImg(page.bgImage, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', {
      name: 'Edebi Görsel', fieldKey: 'bgImage', left: 56, top: 122, width: 438, height: 195, radius: 14, shadow: true
    });
    addFabText(fCanvas, page.poemText || 'Kelimeler akar zamanın içinden,\nBir yaprak düşer sonbahar dalından.\nUmut yeşerir her yeni dizelerde,\nSanatla büyür yarının düşleri.', {
      name: 'Edebi Metin', fieldKey: 'poemText', left: 68, top: 345, width: 414, fontSize: 16, fontFamily: 'Playfair Display', fontStyle: 'italic', textAlign: 'center', fill: isDarkLit ? '#e2e8f0' : '#1e293b', lineHeight: 1.8
    });
    addFabText(fCanvas, page.author || 'Edebiyat & Sanat Atölyesi', {
      name: 'Yazar / Şair', fieldKey: 'author', left: 68, top: 655, width: 414, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#d97706'
    });
    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // --------------------------------------------------------------------------
  // G. KATALOG, PROJE & SERGİ VİTRİNİ (CATALOG) — 9 EKSTRA MİZANPAJ
  // --------------------------------------------------------------------------
  if (sec === 'catalog') {
    const isDarkCat = (layout === 'cat_museum_exhibit');
    fCanvas.setBackgroundColor(isDarkCat ? '#0f172a' : '#f8fafc', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, page.title || (layout === 'cat_science_fair' ? 'BİLİM & PROJE FUARI VİTRİNİ' : 'PROJE & SERGİ KOLEKSİYONU'), {
      name: 'Vitrin Başlığı', fieldKey: 'title', left: 32, top: 30, width: 486, fontSize: 26, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: isDarkCat ? '#fbbf24' : '#0f172a'
    });
    addFabText(fCanvas, page.content || 'Öğrencilerimizin ve tasarım atölyemizin dönem boyunca geliştirdiği öne çıkan çalışmalar ve teknik detaylar.', {
      name: 'Vitrin Açıklaması', fieldKey: 'content', left: 32, top: 68, width: 486, fontSize: 12.5, fontFamily: 'Inter', fill: isDarkCat ? '#cbd5e1' : '#475569'
    });

    if (layout === 'cat_grid_4' || layout === 'cat_science_fair') {
      const items = [
        ['01 • PROJE AMACI / ESER 1', page.spec1 || 'Yenilikçi tasarım ve sürdürülebilir çözüm modeli.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80'],
        ['02 • YÖNTEM / ESER 2', page.spec2 || 'Disiplinlerarası araştırma ve prototip geliştirme.', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80'],
        ['03 • BULGULAR / ESER 3', page.spec3 || 'Deneysel sonuçlar ve görsel sanat uygulamaları.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80'],
        ['04 • SONUÇ & EKİP', page.author || 'Tasarım & Bilim Atölyesi Ekibi', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80']
      ];
      items.forEach((it, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const lx = 32 + col * 248;
        const ty = 115 + row * 295;
        addFabRect(fCanvas, { name: `Proje Kartı ${idx + 1}`, left: lx, top: ty, width: 238, height: 278, rx: 16, fill: '#ffffff', stroke: '#cbd5e1', strokeWidth: 1.5, shadow: true });
        queueImg(idx === 0 ? page.image : null, it[2], { name: `Proje Görseli ${idx + 1}`, left: lx + 12, top: ty + 12, width: 214, height: 155, radius: 12 });
        addFabText(fCanvas, it[0], { name: `Kart Başlığı ${idx + 1}`, left: lx + 14, top: ty + 178, width: 210, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: accent });
        addFabText(fCanvas, it[1], { name: `Kart Açıklaması ${idx + 1}`, left: lx + 14, top: ty + 200, width: 210, fontSize: 12.5, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.4 });
      });
      addStandardPageFooter(fCanvas, page, pageIndex);
      checkDone();
      return;
    }

    // Yatay 3'lü Şerit veya Müze Vitrin düzeni
    const bands = [
      ['ESER / PROJE 01', page.spec1 || 'Görsel Sanatlar ve Estetik Tasarım Seçkisi', page.image, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80'],
      ['ESER / PROJE 02', page.spec2 || 'Modern Mimari ve Çevre Dostu Materyal Analizi', page.image2, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80'],
      ['ESER / PROJE 03', page.spec3 || 'Geleceğin Teknolojileri ve Dijital Sanat Sergisi', page.image3, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80']
    ];
    bands.forEach((b, idx) => {
      const ty = 118 + idx * 195;
      addFabRect(fCanvas, {
        name: `Vitrin Şeridi ${idx + 1}`, left: 32, top: ty, width: 486, height: 178, rx: 16,
        fill: isDarkCat ? '#1e293b' : '#ffffff', stroke: isDarkCat ? '#fbbf24' : '#cbd5e1', strokeWidth: 1.5, shadow: true
      });
      queueImg(b[2], b[3], { name: `Vitrin Fotoğrafı ${idx + 1}`, left: 46, top: ty + 14, width: 175, height: 150, radius: 12 });
      addFabText(fCanvas, b[0], { name: `Vitrin No ${idx + 1}`, left: 238, top: ty + 24, width: 260, fontSize: 11.5, fontFamily: 'Inter', fontWeight: 'bold', fill: isDarkCat ? '#fbbf24' : accent });
      addFabText(fCanvas, b[1], { name: `Vitrin Metni ${idx + 1}`, left: 238, top: ty + 52, width: 260, fontSize: 15, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: isDarkCat ? '#ffffff' : '#0f172a', lineHeight: 1.4 });
    });
    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // --------------------------------------------------------------------------
  // H. K3 • ARKA KAPAK İÇİ (KÜNYE, EKİP & GELECEK SAYI) — 9 EKSTRA MİZANPAJ
  // --------------------------------------------------------------------------
  if (sec === 'k3') {
    const isLightK3 = ['k3_light_corporate', 'k3_minimal_colophon', 'k3_quiz_kunye'].includes(layout);
    fCanvas.setBackgroundColor(isLightK3 ? '#fafaf9' : '#0f172a', fCanvas.renderAll.bind(fCanvas));

    addFabText(fCanvas, page.boardTitle || (layout === 'k3_team_grid' ? 'YAYIN KURULUMUZ & KÜNYE' : 'YAYIN KÜNYESİ & GELECEK SAYI'), {
      name: 'K3 Başlığı', fieldKey: 'boardTitle', left: 32, top: 32, width: 486, fontSize: 25, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: isLightK3 ? '#0f172a' : '#ffffff'
    });

    if (layout === 'k3_team_grid') {
      const members = [
        ['Genel Yayın Yönetmeni', page.editorInChief || 'Yayın Masası', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'],
        ['Yayın Danışmanı', page.advisor || 'Edebiyat Zümresi', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'],
        ['Görsel Yönetmen', 'Tasarım Atölyesi', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80'],
        ['Yazı İşleri Ekibi', page.editorialTeam || 'Öğrenci Kurulu', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80']
      ];
      members.forEach((m, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const lx = 32 + col * 248;
        const ty = 82 + row * 195;
        addFabRect(fCanvas, { name: `Ekip Kartı ${idx + 1}`, left: lx, top: ty, width: 238, height: 178, rx: 16, fill: '#1e293b', stroke: '#334155', strokeWidth: 1.5 });
        queueImg(null, m[2], { name: `Ekip Fotoğrafı ${idx + 1}`, left: lx + 14, top: ty + 18, width: 78, height: 78, maskType: 'circle' });
        addFabText(fCanvas, m[0], { name: `Görev ${idx + 1}`, left: lx + 104, top: ty + 28, width: 120, fontSize: 10.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#fbbf24' });
        addFabText(fCanvas, m[1], { name: `İsim ${idx + 1}`, left: lx + 104, top: ty + 52, width: 120, fontSize: 14, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#ffffff' });
      });
      addFabRect(fCanvas, { name: 'Alt Resmi Künye Kartı', left: 32, top: 482, width: 486, height: 225, rx: 16, fill: '#1e1b4b', stroke: '#6366f1', strokeWidth: 1.5 });
      addFabText(fCanvas, `İmtiyaz Sahibi: ${page.publisher || school}\nYayın Türü: Yerel Süreli Eğitim & Kültür Dergisi\nİletişim & Web: ${page.contactInfo || 'dergimiz.com.tr'}`, {
        name: 'Resmi Künye Metni', left: 52, top: 508, width: 446, fontSize: 13.5, fontFamily: 'Inter', fill: '#e0e7ff', lineHeight: 1.75
      });
      checkDone();
      return;
    }

    // Diğer K3 mizanpajları
    addFabRect(fCanvas, {
      name: 'Künye Ana Kartı', left: 32, top: 82, width: 486, height: 310, rx: 18,
      fill: isLightK3 ? '#ffffff' : '#1e293b', stroke: isLightK3 ? '#cbd5e1' : '#334155', strokeWidth: 1.5, shadow: true
    });
    const kunyeFull = [
      `• İmtiyaz Sahibi: ${page.publisher || school}`,
      `• Genel Yayın Yönetmeni: ${page.editorInChief || 'Yayın Masası'}`,
      `• Yayın Danışmanı: ${page.advisor || 'Edebiyat & Sanat Zümresi'}`,
      `• Yazı İşleri & Tasarım: ${page.editorialTeam || 'Öğrenci Yayın Kurulu'}`,
      `• İletişim & Arşiv: ${page.contactInfo || 'dergimiz.com.tr'}`
    ].join('\n\n');
    addFabText(fCanvas, kunyeFull, {
      name: 'Künye Listesi', fieldKey: 'editorialTeam', left: 54, top: 108, width: 442, fontSize: 13.5, fontFamily: 'Inter', fill: isLightK3 ? '#1e293b' : '#f1f5f9', lineHeight: 1.5
    });

    addFabRect(fCanvas, {
      name: 'Alt Bilgi / Gelecek Sayı Kartı', left: 32, top: 416, width: 486, height: 290, rx: 18,
      fill: isLightK3 ? '#fef3c7' : '#312e81', stroke: isLightK3 ? '#f59e0b' : '#6366f1', strokeWidth: 1.5, shadow: true
    });
    addFabText(fCanvas, page.nextIssueTeaserTitle || (layout === 'k3_quiz_kunye' ? 'MİNİ DERGİ BULMACASI & TESTİ' : 'GELECEK SAYIDA NELER VAR?'), {
      name: 'Alt Kart Başlığı', fieldKey: 'nextIssueTeaserTitle', left: 54, top: 442, width: 442, fontSize: 16, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: isLightK3 ? '#92400e' : '#fbbf24'
    });
    addFabText(fCanvas, page.nextIssueText || '• Yeni Teknoloji ve Yapay Zekâ Dosyası\n• Yılın Kültür ve Sanat Röportajları\n• Ödüllü Tasarım ve Fotoğraf Seçkisi\n• Sizden Gelen Şiir ve Denemeler', {
      name: 'Alt Kart İçeriği', fieldKey: 'nextIssueText', left: 54, top: 482, width: 442, fontSize: 13.5, fontFamily: 'Inter', fill: isLightK3 ? '#451a03' : '#e0e7ff', lineHeight: 1.7
    });
    checkDone();
    return;
  }

  // --------------------------------------------------------------------------
  // I. K4 • ARKA DIŞ KAPAK (BACK COVER) — 9 EKSTRA MİZANPAJ
  // --------------------------------------------------------------------------
  if (sec === 'k4') {
    if (layout === 'k4_corporate_id' || layout === 'k4_split_back') {
      fCanvas.setBackgroundColor('#f8fafc', fCanvas.renderAll.bind(fCanvas));
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', {
        name: 'Arka Kapak Üst Görsel', fieldKey: 'coverImage', left: 32, top: 32, width: 486, height: 320, radius: 18, shadow: true
      });
      addFabRect(fCanvas, { name: 'Kurumsal Kapanış Kartı', left: 32, top: 374, width: 486, height: 360, rx: 20, fill: '#0f172a', shadow: true });
      addFabText(fCanvas, page.schoolName || school, {
        name: 'Kurum Adı', fieldKey: 'schoolName', left: 56, top: 404, width: 438, fontSize: 28, fontFamily: 'Space Grotesk', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      addFabText(fCanvas, page.motto || 'Eğitimde Öncü, Sanatta ve Bilimde Işık', {
        name: 'Kurum Sloganı', fieldKey: 'motto', left: 56, top: 452, width: 438, fontSize: 14, fontFamily: 'Playfair Display', fontStyle: 'italic', textAlign: 'center', fill: '#fbbf24'
      });
      addFabText(fCanvas, page.closingQuote || '“Gelecek, bugünden okuyan, düşünen ve üreten gençlerin ellerinde şekillenir.”', {
        name: 'Kapanış Sözü', fieldKey: 'closingQuote', left: 66, top: 505, width: 418, fontSize: 14.5, fontFamily: 'Merriweather', textAlign: 'center', fill: '#e2e8f0', lineHeight: 1.55
      });
      addFabText(fCanvas, page.social || '@dergimiz • www.dergimiz.com.tr', {
        name: 'Web & İletişim', fieldKey: 'social', left: 56, top: 610, width: 438, fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#38bdf8'
      });
      addFabBarcode(fCanvas, 232, 668, '#ffffff');
      checkDone();
      return;
    }

    const bgMap = {
      k4_minimal_gold: '#090d16',
      k4_green_nature: '#064e3b',
      k4_vintage_stamp: '#f5f2eb',
      k4_quote_manifesto: '#1e1b4b'
    };
    const isLightK4 = (layout === 'k4_vintage_stamp');
    fCanvas.setBackgroundColor(bgMap[layout] || '#0f172a', fCanvas.renderAll.bind(fCanvas));
    addFabRect(fCanvas, {
      name: 'Arka Kapak Çerçevesi', left: 26, top: 26, width: 498, height: 726, rx: 16,
      fill: 'transparent', stroke: isLightK4 ? '#78350f' : '#fbbf24', strokeWidth: 2
    });
    queueImg(page.coverImage, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', {
      name: 'Arka Kapak Sanatsal Görsel', fieldKey: 'coverImage', left: 115, top: 78, width: 320, height: 280, radius: 18, shadow: true
    });
    addFabText(fCanvas, page.closingQuote || '“Bir dergiyi kapatırken zihninizde yeni bir pencere açılıyorsa, amacımıza ulaşmışız demektir.”', {
      name: 'Kapanış Vecizesi', fieldKey: 'closingQuote', left: 62, top: 395, width: 426, fontSize: 22, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', fill: isLightK4 ? '#1c1917' : '#fef08a', lineHeight: 1.45
    });
    addFabText(fCanvas, page.schoolName || school, {
      name: 'Kurum Adı', fieldKey: 'schoolName', left: 62, top: 565, width: 426, fontSize: 20, fontFamily: 'Cinzel', fontWeight: 'bold', textAlign: 'center', fill: isLightK4 ? '#78350f' : '#ffffff'
    });
    addFabText(fCanvas, page.social || 'Gelecek Sayıda Buluşmak Üzere • dergimiz.com.tr', {
      name: 'Alt İletişim', fieldKey: 'social', left: 62, top: 610, width: 426, fontSize: 12, fontFamily: 'Inter', textAlign: 'center', fill: isLightK4 ? '#57534e' : '#cbd5e1'
    });
    addFabBarcode(fCanvas, 232, 682, isLightK4 ? '#1c1917' : '#ffffff');
    checkDone();
    return;
  }

  // Fallback
  if (typeof _origBuildFabricTemplate === 'function') {
    return _origBuildFabricTemplate(page, pageIndex, fCanvas, onComplete);
  }
  checkDone();
};

// ============================================================================
// 3. AKILLI SAYFA TÜRÜ VE MİZANPAJ SEÇİCİ ARAYÜZÜ (SAĞ VE SOL PANEL ENTEGRASYONU)
// ============================================================================

function changeSmartPageSection(newSectionId) {
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!page) return;
  if (!canUserEditPage(page)) {
    showToast('Bu sayfada düzenleme yetkiniz yok.');
    return;
  }

  page.type = newSectionId;
  const catalog = window.SMART_LAYOUT_CATALOG[newSectionId] || [];
  page.layout = catalog[0]?.id || 'minimalist';

  // Varsayılan sayfa başlığını da akıllıca güncelle
  const secMeta = window.SMART_PAGE_SECTIONS.find(s => s.id === newSectionId);
  if (secMeta && (!page.navTitle || page.navTitle.startsWith('Sayfa'))) {
    page.navTitle = secMeta.short;
  }

  rebuildCurrentPageFromTemplate();
  if (typeof renderSidebarThumbs === 'function') renderSidebarThumbs();
  if (typeof renderSmartLeftDrawerTemplates === 'function') renderSmartLeftDrawerTemplates();
  showToast(`✨ Sayfa türü "${secMeta ? secMeta.short : newSectionId}" olarak güncellendi!`);
}

function selectSmartPageLayout(layoutId, optionalSectionId) {
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!page) return;
  if (!canUserEditPage(page)) {
    showToast('Bu sayfada düzenleme yetkiniz yok.');
    return;
  }

  if (optionalSectionId && normalizeSmartSectionType(page.type) !== optionalSectionId) {
    page.type = optionalSectionId;
  }
  page.layout = layoutId;
  rebuildCurrentPageFromTemplate();
  if (typeof renderSidebarThumbs === 'function') renderSidebarThumbs();
  if (typeof renderSmartLeftDrawerTemplates === 'function') renderSmartLeftDrawerTemplates();
}

// Sağ Panelde "Sayfa Seçili" Durumunu Akıllı Mizanpaj Sistemiyle Zenginleştir
const _origRenderContextSettings = window.renderContextSettingsInspector;

window.renderContextSettingsInspector = function(page, isEditable, targetDom) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;

  // Eğer tuvalde bir metin, görsel veya kutu seçiliyse mevcut nesne denetçisini çalıştır
  if (active && typeof _origRenderContextSettings === 'function') {
    return _origRenderContextSettings(page, isEditable, targetDom);
  }

  const curSec = normalizeSmartSectionType(page.type);
  const secMeta = window.SMART_PAGE_SECTIONS.find(s => s.id === curSec) || window.SMART_PAGE_SECTIONS[3];
  const layouts = window.SMART_LAYOUT_CATALOG[curSec] || window.SMART_LAYOUT_CATALOG.article;
  const curLayout = page.layout || layouts[0]?.id;
  const bgHex = (page.bgColor && page.bgColor.startsWith('#')) ? page.bgColor : '#ffffff';

  targetDom.innerHTML = `
    <!-- 1. AKILLI BÖLÜM & MİZANPAJ MERKEZİ -->
    <div class="bg-slate-900 p-3.5 rounded-2xl border border-amber-500/40 space-y-3 text-xs shadow-lg">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="font-bold text-amber-400 flex items-center gap-1.5">
          <i class="ph ph-magic-wand text-base"></i> Akıllı Mizanpaj Sistemi
        </span>
        <button onclick="rebuildCurrentPageFromTemplate()" class="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-[10px] font-bold text-slate-300 hover:text-white transition" title="Sayfayı varsayılan şablon nesneleriyle sıfırla">
          ↺ Sıfırla
        </button>
      </div>

      <!-- Sayfa Bölümü Seçici (Ön Kapak, Ön Kapak İçi K2, İçindekiler, Makale, Röportaj, Edebiyat, Katalog, K3 Künye, K4 Arka Kapak) -->
      <div>
        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Seçili Sayfanın Bölümü (Sayfa ${selectedEditIndex + 1})
        </label>
        <select onchange="changeSmartPageSection(this.value)" class="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer">
          ${window.SMART_PAGE_SECTIONS.map(sec => `
            <option value="${sec.id}" ${sec.id === curSec ? 'selected' : ''}>${sec.label} (${(window.SMART_LAYOUT_CATALOG[sec.id] || []).length} Mizanpaj)</option>
          `).join('')}
        </select>
      </div>

      <!-- Hızlı Bölüm Sekmeleri (Tek Tıkla Geçiş) -->
      <div class="flex flex-wrap gap-1 pt-0.5">
        ${window.SMART_PAGE_SECTIONS.map(sec => `
          <button onclick="changeSmartPageSection('${sec.id}')" class="px-2 py-1 rounded-lg text-[10px] font-bold transition ${sec.id === curSec ? 'bg-amber-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}">
            ${sec.short}
          </button>
        `).join('')}
      </div>

      <!-- Bu Bölüme Özel Mizanpaj Listesi (10-12 Adet) -->
      <div class="pt-1">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] font-bold text-white flex items-center gap-1">
            <i class="ph ${secMeta.icon} text-amber-400"></i> ${secMeta.short} Mizanpajları
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">${layouts.length} Örnek</span>
        </div>

        <div class="grid grid-cols-1 gap-1.5 max-h-[340px] overflow-y-auto pr-1">
          ${layouts.map((ly, idx) => {
            const isAct = (curLayout === ly.id) || (!page.layout && idx === 0);
            return `
              <button onclick="selectSmartPageLayout('${ly.id}')" class="w-full text-left p-2.5 rounded-xl border transition flex items-start gap-2.5 group ${isAct ? 'bg-amber-600/20 border-amber-500 text-white ring-1 ring-amber-500/40' : 'bg-slate-950/90 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'}">
                <span class="text-lg leading-none mt-0.5 shrink-0">${ly.icon}</span>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-1">
                    <span class="font-bold text-[11.5px] truncate ${isAct ? 'text-amber-300' : 'text-white group-hover:text-amber-300'}">${idx + 1}. ${ly.name}</span>
                    <span class="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold shrink-0">${ly.tag}</span>
                  </div>
                  <p class="text-[10.5px] text-slate-400 leading-snug mt-0.5">${ly.desc}</p>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- 2. SAYFA BAŞLIĞI VE ARKA PLAN RENGİ -->
    <div class="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-3 text-xs">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="font-bold text-white flex items-center gap-1.5">
          <i class="ph ph-palette text-blue-400 text-base"></i> Sayfa Başlığı & Zemin Rengi
        </span>
        <span class="text-[10px] text-slate-400 font-mono">550 × 778 px</span>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-slate-400 mb-1">Sayfa Başlığı (İçindekiler Fihristi)</label>
        <input type="text" value="${escapeAttr(page.navTitle || '')}" oninput="updatePageField('navTitle', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none">
      </div>

      <div class="flex items-center justify-between pt-1">
        <span class="text-slate-300 font-semibold">Sayfa Arka Plan Rengi</span>
        <div class="flex items-center gap-1.5">
          <input type="color" value="${bgHex}" oninput="setFabricPageBackgroundColor(this.value)" class="w-7 h-7 rounded cursor-pointer bg-transparent border border-slate-700">
          <input type="text" value="${bgHex}" onchange="setFabricPageBackgroundColor(this.value)" class="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-mono text-white text-center">
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1.5 pt-1">
        ${['#ffffff', '#f4f2ee', '#f8fafc', '#fffbeb', '#fef2f2', '#0f172a', '#1c1917'].map(col => `
          <button onclick="setFabricPageBackgroundColor('${col}')" class="h-6 rounded-lg border border-slate-700 transition transform hover:scale-105" style="background:${col};" title="${col}"></button>
        `).join('')}
      </div>
    </div>
  `;

  if (typeof renderSmartLeftDrawerTemplates === 'function') {
    renderSmartLeftDrawerTemplates();
  }
};

// Sol "Şablon" Çekmecesini de Seçili Sayfaya Duyarlı Hale Getir
function renderSmartLeftDrawerTemplates() {
  const drawer = document.getElementById('drawerTemplatesList');
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!drawer || !page) return;

  const curSec = normalizeSmartSectionType(page.type);
  const secMeta = window.SMART_PAGE_SECTIONS.find(s => s.id === curSec) || window.SMART_PAGE_SECTIONS[3];
  const layouts = window.SMART_LAYOUT_CATALOG[curSec] || window.SMART_LAYOUT_CATALOG.article;
  const curLayout = page.layout || layouts[0]?.id;

  drawer.innerHTML = `
    <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 mb-2">
      <div class="text-[11px] font-bold text-amber-300 flex items-center justify-between">
        <span>Sayfa ${selectedEditIndex + 1}: ${secMeta.short}</span>
        <span class="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">${layouts.length} Mizanpaj</span>
      </div>
      <select onchange="changeSmartPageSection(this.value)" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] font-bold text-white">
        ${window.SMART_PAGE_SECTIONS.map(sec => `
          <option value="${sec.id}" ${sec.id === curSec ? 'selected' : ''}>${sec.label}</option>
        `).join('')}
      </select>
    </div>
    <div class="space-y-1.5">
      ${layouts.map((ly, idx) => {
        const isAct = (curLayout === ly.id) || (!page.layout && idx === 0);
        return `
          <button onclick="selectSmartPageLayout('${ly.id}')" class="w-full text-left p-2.5 rounded-xl border transition flex items-start gap-2 ${isAct ? 'bg-amber-600/25 border-amber-500 text-white' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'}">
            <span class="text-base">${ly.icon}</span>
            <div class="flex-1 min-w-0">
              <div class="font-bold text-xs truncate">${idx + 1}. ${ly.name}</div>
              <div class="text-[10px] text-slate-400 leading-snug mt-0.5">${ly.desc}</div>
            </div>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

// Sekme geçişinde "Sayfa Metinleri" sekmesini kalıcı olarak devre dışı bırak
window.switchRightInspectorTab = function(tabName) {
  const validTab = (tabName === 'actions') ? 'actions' : 'settings';
  ['settings', 'actions'].forEach(t => {
    const btn = document.getElementById('rightTabBtn_' + t);
    const panel = document.getElementById('rightInspector_' + t);
    if (btn) {
      btn.className = (t === validTab)
        ? 'flex-1 pb-2 text-xs font-bold border-b-2 border-blue-500 text-blue-400 transition text-center'
        : 'flex-1 pb-2 text-xs font-semibold border-b-2 border-transparent text-slate-400 hover:text-white transition text-center';
    }
    if (panel) {
      panel.classList.toggle('hidden', t !== validTab);
    }
  });
  const oldContent = document.getElementById('rightInspector_content');
  if (oldContent) oldContent.classList.add('hidden');
};

window.changeSmartPageSection = changeSmartPageSection;
window.selectSmartPageLayout = selectSmartPageLayout;
window.renderSmartLeftDrawerTemplates = renderSmartLeftDrawerTemplates;
