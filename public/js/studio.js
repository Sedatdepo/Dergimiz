// Dergimiz Editör & Yönetim Masası (Advanced Studio Engine)
let currentUser = null;
let allMagazines = [];
let currentMagazine = null;
let allIssues = [];
let currentIssue = null;
let magazineData = null;
let selectedEditIndex = 0;
let currentIndex = 0;
let spreadMode = true;
let appMode = 'edit';
let editorKeys = [];
let adminUsers = [];

// Serbest Eleman Yönetimi (Canvas Drag/Resize/Rotate)
let selectedElementId = null;
let isDraggingElement = false;
let isResizingElement = false;
let isRotatingElement = false;
let activeResizeHandle = null;
let dragStartX = 0, dragStartY = 0;
let initialElemX = 0, initialElemY = 0, initialElemW = 0, initialElemH = 0;
let initialAngle = 0;
let showGridGuide = false;

// FlipHTML5 v2 Studio Pro Durum Değişkenleri (Undo/Redo, Zoom, Pan, Sol/Sağ Sekmeler)
let historyStack = [];
let redoStack = [];
let isRestoringHistory = false;
let canvasZoom = 100;
let isPanMode = false;
let isPanningWorkspace = false;
let panStartX = 0, panStartY = 0, panScrollLeft = 0, panScrollTop = 0;
let activeLeftTab = 'pages';
let isLeftDrawerCollapsed = false;
let activeRightTab = 'settings';

// Görsel 1'deki Hazır Renk Şemaları (Tema Paletleri)
const FLIP_COLOR_SCHEMES = [
  { id: 'sky', name: 'Gök mavisi', bg: '#f8fafc', text: '#0f172a', accent: '#2563eb', cardBg: '#ffffff', palette: ['#2563eb', '#3b82f6', '#06b6d4', '#10b981', '#6ee7b7'] },
  { id: 'fern', name: 'Fern Green', bg: '#f7fee7', text: '#14532d', accent: '#16a34a', cardBg: '#ffffff', palette: ['#84cc16', '#22c55e', '#10b981', '#059669', '#a7f3d0'] },
  { id: 'warm', name: 'Sıcak Kahverengi', bg: '#f5f2eb', text: '#292524', accent: '#9a3412', cardBg: '#faf8f5', palette: ['#b45309', '#a16207', '#78350f', '#1e3a8a', '#172554'] },
  { id: 'midnight', name: 'Gece yarısı', bg: '#0f172a', text: '#f8fafc', accent: '#ea580c', cardBg: '#1e293b', palette: ['#ea580c', '#f97316', '#64748b', '#94a3b8', '#fdba74'] },
  { id: 'royal', name: 'Kraliyet Moru', bg: '#faf5ff', text: '#1e1b4b', accent: '#7c3aed', cardBg: '#ffffff', palette: ['#7c3aed', '#6366f1', '#ec4899', '#a855f7', '#ddd6fe'] },
  { id: 'crimson', name: 'Katalog Bordo', bg: '#faf7f5', text: '#1c1917', accent: '#881337', cardBg: '#ffffff', palette: ['#881337', '#be123c', '#e11d48', '#fb7185', '#ffe4e6'] }
];

const colorSwatches = [
  { name: "İndigo", hex: "#4f46e5" },
  { name: "Okyanus", hex: "#0284c7" },
  { name: "Zümrüt", hex: "#059669" },
  { name: "Kehribar", hex: "#d97706" },
  { name: "Yakut", hex: "#e11d48" },
  { name: "Bordo", hex: "#881337" },
  { name: "Mor", hex: "#7c3aed" },
  { name: "Koyu Gri", hex: "#1e293b" }
];

function renderBarcodeSvg(color = '#000000') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="inline-block opacity-75"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>`;
}

let isRightSidebarCollapsed = false;
let isTopToolbarCollapsed = false;
let isZenMode = false;
let activeTemplatePresetId = 1;

const MAGAZINE_PRESETS = [
  {
    id: 1, name: 'Kamer (Minimal Moda)', category: 'Moda & Kültür', layout: 'minimalist', accent: '#d97706',
    title: 'KAMER', issueTag: 'AY YIL | SAYI 01', price: 'MODA & KÜLTÜR DERGİSİ',
    headline: 'Güçlü Kadın Lider', desc: 'Kapak hikayesi için destek metni buraya girilecektir.',
    subs: ['Moda Sektöründe', 'Renkleri Kendinize Uyarlayın', 'Sezonun En İyi Görünümleri'],
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    editorTitle: 'Editörden Mektup',
    editorQuote: 'TANITIM ALINTISI, MAKALEDEN ALINAN ETKİLEYİCİ BİR ALINTIDIR. VURGULAMAK İSTEDİĞİNİZ ALINTIYI BURAYA YERLEŞTİREBİLİRSİNİZ.',
    editorText: 'Editörün mektubu, samimi veya resmi olabilen, çeşitli nedenler için yazılmış bir mesajdır. Okuyucunun belirli bir konunun içeriğini ve kreatif yönünü anlamasına yardımcı olabilir.',
    editorName: 'Ceyhan Fidancı',
    articleTitle: 'GÜÇLÜ KADIN LİDER',
    articleAuthor: 'Yazan: Meryem Pars'
  },
  {
    id: 2, name: 'Yeni (Brütalist Trend)', category: 'Popüler Kültür', layout: 'brutalist', accent: '#facc15',
    title: 'RESİMLİK', issueTag: 'SAYI 04', price: '2026 TREND',
    headline: 'YENİ GÖRÜNÜMLER', desc: 'LİT POPÜLER KÜLTÜR DOSYASI',
    subs: ['Mavi Sarı Kırmızı Trend', 'Brütalist Stilde Moda', 'Kapak Hikayesi Destek'],
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    editorTitle: 'MERHABA YENİ ÇAĞ',
    editorQuote: 'Kuralları yıkmak için önce onları çok iyi bilmek gerekir. Biz bu sayıda her şeyi yeniden tanımlıyoruz.',
    editorText: 'Bu ay sınırları zorluyoruz. Renklerin çatışmasından doğan uyumu, sokak modasının asi ruhunu sayfalarımıza taşıdık. Hazırsanız başlıyoruz.',
    editorName: 'Asi Ruh',
    articleTitle: 'YENİ NESİL KURALLAR',
    articleAuthor: 'Yazan: Trend Ekibi'
  },
  {
    id: 3, name: 'Konak (Modüler Mimari)', category: 'Ev & Mimari', layout: 'modular', accent: '#0f172a',
    title: 'KONAK', issueTag: 'SAYI 01', price: 'EV VE İÇ MEKANLAR',
    headline: 'TARZ DENEYİMLERİ', desc: 'TASARIM ÖDÜLLERİ 2030',
    subs: ['Yeni Renkler', 'Çağdaş Stiller', 'Taze Perspektifler'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    editorTitle: 'MEKANI HİSSETMEK',
    editorQuote: 'İçinde yaşadığımız duvarlar sadece bizi korumaz, aynı zamanda kim olduğumuzu anlatır.',
    editorText: 'Mimari sadece beton ve camdan ibaret değildir. Işığın süzülüşü, ahşabın dokusu ve boşlukların dilidir. Bu sayımızda minimalist iç mekanları ve fonksiyonel yaşam alanlarını inceliyoruz.',
    editorName: 'Mimar Sinem',
    articleTitle: 'MİNİMALİZM VE IŞIK',
    articleAuthor: 'Yazan: İç Mimar Kaan'
  },
  {
    id: 4, name: 'Doğal (Tam Ekran Doğa)', category: 'Doğa & Yaşam', layout: 'fullscreen', accent: '#10b981',
    title: 'DOĞAL', issueTag: 'BAHAR 2026', price: 'YAŞAM ALANLARI',
    headline: 'VAHŞİ YAŞAMIN BÜYÜSÜ', desc: 'Gezegenin Paydaşları ve Korunan Alanlar',
    subs: ['Ormanın Derinlikleri', 'Nesli Tükenenler', 'Yaban Hayatı Korumak'],
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    editorTitle: 'DOĞANIN ÇAĞRISI',
    editorQuote: 'Biz doğanın efendisi değil, sadece onun milyonlarca çocuğundan biriyiz.',
    editorText: 'Her yaprak bir hikaye anlatır, her rüzgar bir şarkı fısıldar. Doğanın hızına yavaşlayıp, onun ritmine ayak uydurmanın zamanı geldi. Bu ay rotamızı vahşi yaşama çevirdik.',
    editorName: 'Doğa Rehberi',
    articleTitle: 'ORMANIN GİZLİ DİLİ',
    articleAuthor: 'Yazan: Yeşil İzler'
  },
  {
    id: 5, name: 'Kapital (Kurumsal)', category: 'İş & Ekonomi', layout: 'modular', accent: '#1d4ed8',
    title: 'KAPİTAL', issueTag: 'SAYI 145', price: 'EKONOMİ',
    headline: 'KÜRESEL PİYASALAR', desc: 'Yatırımcılar için yeni yol haritası.',
    subs: ['Borsa Analizleri', 'Geleceğin Şirketleri', 'Kripto Dünyası'],
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    editorTitle: 'PİYASANIN NABZI',
    editorQuote: 'Risk, ne yaptığınızı bilmemekten kaynaklanır.',
    editorText: 'Dalgalı piyasalarda güvenli liman arayışı sürüyor. Merkez bankalarının kararları ve teknoloji devlerinin yeni hamleleri doğrultusunda yatırım stratejilerini masaya yatırdık.',
    editorName: 'Ekonomi Masası',
    articleTitle: 'YATIRIMIN GELECEĞİ',
    articleAuthor: 'Yazan: Analist Vefa'
  },
  {
    id: 6, name: 'Siber (Karanlık Teknoloji)', category: 'Teknoloji', layout: 'brutalist', accent: '#22c55e',
    title: 'SİBER_AĞ', issueTag: 'v2.0.26', price: 'TECH',
    headline: 'YAPAY ZEKA DEVRİMİ', desc: 'Makineler ne zaman hissedecek?',
    subs: ['Kuantum İşlemciler', 'Siber Güvenlik', 'Web 3.0 & Yapay Zeka'],
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    editorTitle: 'SİSTEME GİRİŞ',
    editorQuote: 'Gelecek çoktan geldi, sadece eşit dağıtılmadı.',
    editorText: 'Kod satırlarının arasında yeni bir dünya inşa ediliyor. Yapay zeka artık bir asistan değil, bir yaratıcı. Bu sayımızda algoritmaların ötesine geçiyoruz.',
    editorName: 'Root Admin',
    articleTitle: 'KODLARIN İÇİNDE',
    articleAuthor: 'Yazan: AI.Gen'
  },
  {
    id: 7, name: 'Damak (Pastel Gurme)', category: 'Yemek Kültürü', layout: 'minimalist', accent: '#ea580c',
    title: 'DAMAK', issueTag: 'GÜZ SAYISI', price: 'GASTRONOMİ',
    headline: 'ÇİKOLATALI PASTA', desc: 'Sanatında ustalaşın. Sürreal ziyafet.',
    subs: ['Sokak Lezzetleri', 'Şefin Sırrı', 'Mevsim Yeşillikleri'],
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
    editorTitle: 'TADIM NOTLARI',
    editorQuote: 'İyi yemek, iyi yaşamın temelidir.',
    editorText: 'Mutfak sadece yemek yapılan yer değil, anıların ve kültürlerin harmanlandığı bir laboratuvardır. Bu sayımızda damağınızda iz bırakacak lezzetlerin peşine düştük.',
    editorName: 'Şef Leman',
    articleTitle: 'TATLI SANATI',
    articleAuthor: 'Yazan: Gurme Gezgin'
  },
  {
    id: 8, name: 'Bilim (Modern Keşif)', category: 'Modern Keşif', layout: 'fullscreen', accent: '#06b6d4',
    title: 'BİLİM', headline: 'EVRENİN DERİNLİKLERİ', desc: 'Laboratuvardan derin uzaya uzanan bilim serüveni.',
    subs: ['James Webb Teleskobu', 'Genom Projeleri', 'Füzyon Enerjisi'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80'
  },
  { id: 9, name: 'Sinema', category: 'Vintage Noir', layout: 'brutalist', accent: '#f43f5e', title: 'SİNEVİZYON', headline: 'BEYAZ PERDE BÜYÜSÜ', desc: 'Klasik yönetmenler ve modern bağımsız sinema.', subs: ['Yönetmenin Vizyonu', 'Festivaller & Ödüller', 'Film Müziği'], coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80' },
  { id: 10, name: 'Spor', category: 'Dinamik Enerji', layout: 'modular', accent: '#ef4444', title: 'DİNAMİK', headline: 'ŞAMPİYONLARIN İZİNDE', desc: 'Zirveye giden yol disiplin ve tutkudan geçer.', subs: ['Antrenman Günlüğü', 'Zihinsel Dayanıklılık', 'Genç Yetenekler'], coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80' },
  { id: 11, name: 'Gezgin', category: 'Macera & Rota', layout: 'fullscreen', accent: '#f97316', title: 'PUSULA', headline: 'BİLİNMEYEN ROTALAR', desc: 'Kültürleri keşfetmek ve sınırların ötesine yolculuk.', subs: ['Sırt Çantalılar', 'Tarihi Şehirler', 'Doğa Yürüyüşleri'], coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80' },
  { id: 12, name: 'Edebiyat', category: 'Klasik Kitap', layout: 'minimalist', accent: '#7c3aed', title: 'SATIR ARASI', headline: 'KELİMELERİN GÜCÜ', desc: 'Şiirin ve düzyazının büyülü evreninde bir yolculuk.', subs: ['Ayın Şairi', 'Unutulmayan Romanlar', 'Kitap İncelemeleri'], coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80' },
  { id: 13, name: 'Müzik', category: 'Neon Ritim', layout: 'brutalist', accent: '#ec4899', title: 'RİTİM', headline: 'SESİN FREKANSI', desc: 'Analog tınılardan elektronik dalgalara müzik tarihi.', subs: ['Plak Kültürü', 'Yeni Çıkan Albümler', 'Konser Notları'], coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80' },
  { id: 14, name: 'Oyun', category: 'Retro Pixel', layout: 'modular', accent: '#8b5cf6', title: 'PİKSEL', headline: 'DİJİTAL DÜNYALAR', desc: 'Oyun tasarımının evrimi ve bağımsız geliştiriciler.', subs: ['İndie Oyunlar', 'Oyun Mekanikleri', 'Espor Arenası'], coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80' },
  { id: 15, name: 'Sanat', category: 'Galeri Çağdaş', layout: 'minimalist', accent: '#6366f1', title: 'GALERİ', headline: 'BİÇİM VE RENK', desc: 'Görsel sanatların dönüştürücü gücü ve yeni sergiler.', subs: ['Atölye Ziyareti', 'Heykel Sanatı', 'Dijital İllüstrasyon'], coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80' },
  { id: 16, name: 'Tarih', category: 'Arşiv Antik', layout: 'modular', accent: '#b45309', title: 'ZAMAN TÜNELİ', headline: 'MEDENİYETİN KÖKLERİ', desc: 'Geçmişin tozlu sayfalarından günümüze ışık tutan belgeler.', subs: ['Antik Kentler', 'Kırılma Noktaları', 'Arşiv Belgeleri'], coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=900&q=80' },
  { id: 17, name: 'Gençlik', category: 'Canlı Kampüs', layout: 'brutalist', accent: '#e11d48', title: 'KAMPÜS', headline: 'GENÇLİĞİN SESİ', desc: 'Kulüpler, projeler, yarışmalar ve öğrenci başarıları.', subs: ['Münazara Kulübü', 'TÜBİTAK Projeleri', 'Okul Festivali'], coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80' },
  { id: 18, name: 'Kozmos (Uzay)', category: 'Bilim & Uzay', layout: 'fullscreen', accent: '#38bdf8', title: 'KOZMOS', headline: 'YILDIZLARIN ÖTESİNDE', desc: 'Gezegenler, karadelikler ve geleceğin uzay kolonileri.', subs: ['Mars Görevleri', 'Ötegezegenler', 'Astrofizik Temelleri'], coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80' },
  { id: 19, name: 'Felsefe', category: 'Sade Düşünce', layout: 'minimalist', accent: '#475569', title: 'DÜŞÜNCE', headline: 'SORULARIN PEŞİNDE', desc: 'Varlık, bilgi ve ahlak üzerine derinlikli bir sorgulama.', subs: ['Sokratik Yöntem', 'Zihin Felsefesi', 'Etik Tartışmalar'], coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80' },
  { id: 20, name: 'Doğaüstü', category: 'Gizem & Fenomen', layout: 'fullscreen', accent: '#a855f7', title: 'BİLİNMEYEN', headline: 'GİZEMLİ DÜNYA', desc: 'Evrenin çözülememiş sırları ve bilimin araştırdığı fenomenler.', subs: ['Kriptoloji', 'Derin Deniz Canlıları', 'Tarihin Gizemleri'], coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80' }
];

// Seçilen Konsept Şablonunun Tüm Sayfa Örneklerini (10 Sayfalık Resmi Omurga Sıralamasıyla) Üretir
function buildSamplePagesForPreset(presetId) {
  const p = MAGAZINE_PRESETS.find(x => x.id === Number(presetId)) || MAGAZINE_PRESETS[0];
  const img = p.coverImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80';
  return [
    {
      id: 'p1',
      type: 'cover',
      layout: p.layout || 'minimalist',
      isFixedBackbone: true,
      navTitle: `01 • K1 ${p.title} Ön Kapak`,
      accentColor: p.accent,
      status: 'approved',
      adminNote: '',
      magazineName: p.title,
      issueTag: p.issueTag || 'SAYI 01 | 2026',
      price: p.price || p.category.toUpperCase(),
      mainHeadline: p.headline,
      subHeadline: p.desc,
      coverImage: img,
      highlights: (p.subs || []).join('\n'),
      elements: []
    },
    {
      id: 'p2',
      type: 'k2',
      layout: 'k2_bayrak_mars',
      isFixedBackbone: true,
      navTitle: '02 • K2 Türk Bayrağı & İstiklal Marşı',
      accentColor: '#dc2626',
      status: 'approved',
      adminNote: '',
      headerText: 'İSTİKLAL MARŞI',
      subText: "Korkma, sönmez bu şafaklarda yüzen al sancak;\nSönmeden yurdumun üstünde tüten en son ocak.\nO benim milletimin yıldızıdır, parlayacak;\nO benimdir, o benim milletimindir ancak.\n\nÇatma, kurban olayım, çehreni ey nazlı hilâl!\nKahraman ırkıma bir gül! Ne bu şiddet, bu celâl?\nSana olmaz dökülen kanlarımız sonra helâl...\nHakkıdır, Hakk'a tapan, milletimin istiklâl!",
      author: 'Mehmet Akif ERSOY',
      image: '/img/turk-bayragi.svg',
      elements: []
    },
    {
      id: 'p3',
      type: 'k2',
      layout: 'k2_ataturk',
      isFixedBackbone: true,
      navTitle: '03 • Atatürk & Gençliğe Hitabe',
      accentColor: '#d97706',
      status: 'approved',
      adminNote: '',
      headerText: '"Hayatta en hakiki mürşit ilimdir, fendir."',
      subText: "Ey Türk Gençliği!\n\nBirinci vazifen; Türk istiklâlini, Türk Cumhuriyetini, ilelebet muhafaza ve müdafaa etmektir. Mevcudiyetinin ve istikbalinin yegâne temeli budur. Bu temel, senin en kıymetli hazinendir.",
      author: 'Gazi Mustafa Kemal ATATÜRK',
      image: '/img/ataturk.jpg',
      elements: []
    },
    {
      id: 'p4',
      type: 'toc',
      layout: 'toc_classic',
      isFixedBackbone: true,
      navTitle: `04 • Editörden & İçindekiler`,
      accentColor: p.accent,
      status: 'approved',
      adminNote: '',
      editorTitle: p.editorTitle || 'Editörden Mektup',
      editorQuote: p.editorQuote || 'Her dergi sayfası, bilimin ve sanatın ışığında yarına bırakılan kalıcı bir izdir.',
      editorText: p.editorText || 'Editörün mektubu okuyucuya bu sayının kreatif yönünü ve hazırlık sürecini anlatır.',
      editorName: p.editorName || 'Genel Yayın Yönetmeni',
      editorImage: img,
      editorialBoard: `${p.title} Yayın ve Tasarım Ekibi`,
      elements: []
    },
    {
      id: 'p5',
      type: 'article',
      layout: 'art_classic',
      navTitle: `05 • ${p.articleTitle || p.headline}`,
      accentColor: p.accent,
      status: 'approved',
      adminNote: '',
      category: p.category.toUpperCase(),
      title: p.articleTitle || p.headline,
      author: p.articleAuthor || 'Yazan: Editör Ekibi',
      image: img,
      imageCaption: `${p.title} özel dosya fotoğrafı.`,
      content: `${p.desc}\n\n${p.editorText || 'Bu sayımızda konunun tüm boyutlarını uzman görüşleri, görsel analizler ve saha araştırmalarıyla ele alıyoruz.'}`,
      pullQuote: p.editorQuote || 'Yaratıcılık ve vizyon, geleceği şekillendiren en güçlü araçtır.',
      elements: []
    },
    {
      id: 'p6',
      type: 'interview',
      layout: 'int_classic',
      navTitle: '06 • Ayın Söyleşisi',
      accentColor: p.accent,
      status: 'approved',
      adminNote: '',
      rubric: `${p.category.toUpperCase()} SÖYLEŞİSİ`,
      interviewee: p.editorName || 'Konuk Uzman',
      role: `${p.title} Özel Konuğu`,
      intro: `${p.headline} dosyamız kapsamında gerçekleştirdiğimiz özel röportaj.`,
      photo: img,
      q1: `${p.subs?.[0] || 'Bu alandaki'} yeni yaklaşımlar hakkında ne düşünüyorsunuz?`,
      a1: 'Değişen dünyada geleneksel kalıpların dışına çıkmak ve özgün bir dil oluşturmak artık her zamankinden daha değerli.',
      q2: `${p.subs?.[1] || 'Tasarım sürecinde'} ilhamınızı nereden alıyorsunuz?`,
      a2: 'Doğadan, mimariden ve günlük yaşamın ritminden besleniyoruz. Her detay yeni bir hikayenin başlangıcı oluyor.',
      q3: 'Okuyucularımıza ve genç tasarımcılara son mesajınız nedir?',
      a3: 'Merak etmekten ve denemekten asla vazgeçmeyin. Kendi tarzınızı ancak cesur adımlarla bulabilirsiniz.',
      elements: []
    },
    {
      id: 'p7',
      type: 'literature',
      layout: 'lit_classic',
      navTitle: '07 • Edebiyat & Şiir Köşesi',
      accentColor: p.accent,
      status: 'approved',
      adminNote: '',
      header: 'EDEBİYAT & SANAT SEÇKİSİ',
      title: 'Geceye Düşen Mısralar',
      author: 'Kaleme Alan: Edebiyat Kulübü',
      bgImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      poemText: 'Kelimeler akar zamanın içinden,\nBir yaprak düşer sonbahar dalından.\nUmut yeşerir her yeni dizelerde,\nSanatla büyür yarının düşleri.',
      bottomNote: `${p.title} Kültür & Edebiyat Seçkisi`,
      elements: []
    },
    {
      id: 'p8',
      type: 'catalog',
      layout: 'cat_classic',
      navTitle: '08 • Katalog & Proje Vitrini',
      accentColor: p.accent,
      status: 'approved',
      adminNote: '',
      catTag: `${p.category.toUpperCase()} DOSYASI`,
      title: 'Proje & Tasarım Koleksiyonu',
      content: 'Seçili konseptin temel bileşenleri, sergi seçkisi ve teknik inceleme tablosu aşağıda yer almaktadır.',
      image: img,
      spec1: `${p.name} (${p.layout.toUpperCase()})`,
      spec2: p.category,
      spec3: (p.subs || []).join(' • '),
      author: `${p.title} Tasarım Atölyesi`,
      elements: []
    },
    {
      id: 'p9',
      type: 'k3',
      layout: 'k3_classic',
      isFixedBackbone: true,
      navTitle: '09 • K3 Arka Kapak İçi (Künye)',
      accentColor: p.accent,
      status: 'approved',
      adminNote: '',
      boardTitle: `${p.title.toUpperCase()} YAYIN KÜNYESİ`,
      publisher: `${p.title} Yayın Grubu / Okul Müdürlüğü`,
      editorInChief: p.editorName || 'Genel Yayın Yönetmeni',
      advisor: 'Kültür, Sanat & Edebiyat Zümresi',
      editorialTeam: 'Öğrenci Yayın ve Mizanpaj Kurulu',
      contactInfo: 'dergimiz.com.tr',
      nextIssueTeaserTitle: 'GELECEK SAYIDA NELER VAR?',
      nextIssueText: '• Yeni Teknoloji ve Bilim Dosyası\n• Yılın Kültür ve Sanat Röportajları\n• Ödüllü Tasarım ve Fotoğraf Seçkisi',
      elements: []
    },
    {
      id: 'p10',
      type: 'k4',
      layout: 'k4_classic',
      isFixedBackbone: true,
      navTitle: '10 • K4 Arka Dış Kapak',
      accentColor: p.accent,
      status: 'approved',
      adminNote: '',
      schoolName: p.title,
      motto: `"${p.desc}"`,
      coverImage: img,
      qrText: 'Dergimizi dijital ortamda incelemek için karekodu okutun.',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dergimiz.com.tr',
      social: `@${p.title.toLowerCase().replace(/\s+/g, '')} • dergimiz.com.tr`,
      closingQuote: p.editorQuote || 'Gelecek sayıda buluşmak dileğiyle.',
      elements: []
    }
  ];
}

function startPureBlankMagazine(silent = false) {
  currentMagazine = null;
  currentIssue = null;

  window.magazineData = {
    id: 'blank-' + Date.now(),
    title: 'Yeni Dergi',
    schoolName: 'Okul E-Dergimiz',
    issueMonth: 'Sayı 01',
    issueInfo: 'Sayı 01 • ' + new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
    status: 'draft',
    pages: [
      {
        id: 'p_1_' + Date.now(),
        type: 'blank',
        navTitle: 'Sayfa 1 (Bembeyaz Boş)',
        bgColor: '#ffffff',
        isCustomized: true,
        fabricJSON: { version: '5.3.0', objects: [] },
        showMasterPage: false
      }
    ]
  };

  selectedEditIndex = 0;
  currentIndex = 0;
  selectedElementId = null;

  const magSel = document.getElementById('magazineSelector');
  if (magSel) magSel.value = 'blank-new';

  const issueSelector = document.getElementById('issueSelector');
  if (issueSelector) {
    issueSelector.innerHTML = '<option value="sayi1">Sayı 01 (Boş)</option>';
  }

  // Aktif Fabric tuvalini temizle
  if (window.fabricCanvases) {
    Object.keys(window.fabricCanvases).forEach(k => {
      try { window.fabricCanvases[k].dispose(); } catch(e){}
    });
    window.fabricCanvases = {};
  }
  window.activeFabricCanvas = null;

  renderAll();
  saveAllChangesToServer(true);

  if (!silent) {
    showToast('📄 Bomboş bembeyaz sayfa açıldı! Sıfırdan dilediğiniz gibi kutularınızı çizebilirsiniz.');
  }
}
window.startPureBlankMagazine = startPureBlankMagazine;

function loadFullTemplatePreset(presetId, silent = false) {
  const preset = MAGAZINE_PRESETS.find(p => p.id === Number(presetId)) || MAGAZINE_PRESETS[0];
  activeTemplatePresetId = preset.id;

  magazineData = {
    id: currentIssue ? currentIssue.id : ('tpl-' + preset.id),
    title: `${preset.title} • ${preset.issueTag || 'Sayı 01'}`,
    schoolName: `${preset.title} — ${preset.category}`,
    issueMonth: preset.issueTag || 'Sayı 01',
    issueInfo: preset.price || preset.category,
    status: currentIssue ? currentIssue.status : 'draft',
    pages: buildSamplePagesForPreset(preset.id)
  };

  selectedEditIndex = 0;
  currentIndex = 0;
  selectedElementId = null;

  const magSel = document.getElementById('magazineSelector');
  if (magSel && (!allMagazines || allMagazines.length === 0)) {
    magSel.value = `preset-${preset.id}`;
  }

  closeModal('allTemplatesModal');
  renderAll();
  if (currentIssue) {
    saveAllChangesToServer(true);
  }
  if (!silent) {
    showToast(`🎨 "${preset.name}" şablonunun tüm örnek sayfaları yüklendi!`);
  }
}

function applyMagPreset(presetId) {
  const preset = MAGAZINE_PRESETS.find(p => p.id === Number(presetId));
  if (!preset) return;
  const nameInput = document.getElementById('newMagName');
  const colorInput = document.getElementById('newMagColor');
  const descInput = document.getElementById('newMagDesc');
  if (nameInput) nameInput.value = preset.title;
  if (colorInput) colorInput.value = preset.accent;
  if (descInput) descInput.value = `${preset.category} — ${preset.desc}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  initUserSession();
  if (window.innerWidth < 1100) spreadMode = false;
  updateSpreadButtonUI();

  await loadAllMagazines();
  await loadEditorKeys();
  initGlobalCanvasEvents();
});

// ==========================================
// 1. KULLANICI OTURUMU & YETKİLENDİRME
// ==========================================
function initUserSession() {
  const userJson = localStorage.getItem('dergiUser');
  if (userJson) {
    try {
      currentUser = JSON.parse(userJson);
    } catch (e) {
      currentUser = null;
    }
  }

  if (!currentUser) {
    currentUser = {
      code: "ADMIN-SEDAT",
      name: "Sedat İleri",
      role: "admin",
      title: "Süper Yönetici / Kurucu",
      assignedPages: []
    };
    localStorage.setItem('dergiUser', JSON.stringify(currentUser));
    localStorage.setItem('dergiAccessCode', currentUser.code);
  }

  const nameEl = document.getElementById('userNameDisplay');
  const roleEl = document.getElementById('userRoleDisplay');
  if (nameEl) nameEl.textContent = currentUser.name || "Editör";
  if (roleEl) roleEl.textContent = currentUser.role === 'admin' ? "👑 Yönetici (Admin)" : "✍️ Sayfa Editörü";
}

function handleLogout() {
  localStorage.removeItem('dergiUser');
  localStorage.removeItem('dergiAccessCode');
  window.location.href = '/';
}

// ==========================================
// 2. ŞABLON MASASI & KAYITLI DERGİ YÖNETİMİ
// ==========================================
async function loadAllMagazines() {
  try {
    const res = await fetch('/api/magazines');
    if (res.ok) {
      allMagazines = await res.json();
    }
  } catch (err) {
    console.warn("Dergiler alınamadı:", err);
    allMagazines = [];
  }

  const magSelector = document.getElementById('magazineSelector');
  const issueSelector = document.getElementById('issueSelector');
  const keyMagSelect = document.getElementById('newKeyMagazine');

  if (magSelector) {
    magSelector.innerHTML = '';

    // 0. EN ÜSTTE VE VARSAYILAN: BOMBOŞ BEYAZ SAYFA İLE SIFIRDAN BAŞLA
    const blankOpt = document.createElement('option');
    blankOpt.value = 'blank-new';
    blankOpt.textContent = '⬜ Bomboş Dergi (Sıfırdan Tasarla)';
    magSelector.appendChild(blankOpt);

    // 1. Eğer kullanıcı dergi kaydettiyse Kayıtlı Dergiler Grubu
    if (allMagazines.length > 0) {
      const savedGroup = document.createElement('optgroup');
      savedGroup.label = '📁 Kayıtlı Dergileriniz';
      allMagazines.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.name} (${m.schoolName})`;
        savedGroup.appendChild(opt);
      });
      magSelector.appendChild(savedGroup);
    }

    // 2. Hazır Dergi Şablon Örnekleri Grubu (Opsiyonel İlham İçin)
    const tplGroup = document.createElement('optgroup');
    tplGroup.label = '🎨 Hazır Şablon Örnekleri (İlham & Kopya)';
    MAGAZINE_PRESETS.forEach(p => {
      const opt = document.createElement('option');
      opt.value = `preset-${p.id}`;
      opt.textContent = `Şablon ${p.id}: ${p.name}`;
      tplGroup.appendChild(opt);
    });
    magSelector.appendChild(tplGroup);
  }

  if (keyMagSelect) {
    keyMagSelect.innerHTML = '';
    allMagazines.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.name} (${m.schoolName})`;
      keyMagSelect.appendChild(opt);
    });
  }

  renderRegisteredMagazinesList();

  // Eğer kayıtlı dergi varsa ve URL'de istenmişse onu aç, yoksa DOĞRUDAN BOMBOŞ SAYFA AÇ!
  const urlParams = new URLSearchParams(window.location.search);
  const targetMagId = urlParams.get('magId');

  if (targetMagId && allMagazines.find(m => m.id === targetMagId)) {
    currentMagazine = allMagazines.find(m => m.id === targetMagId);
    if (magSelector) magSelector.value = currentMagazine.id;
    updateMagazineHeaderUI();
    await loadAllIssues(currentMagazine.id);
  } else if (allMagazines.length > 0) {
    currentMagazine = allMagazines[0];
    if (magSelector) magSelector.value = currentMagazine.id;
    updateMagazineHeaderUI();
    await loadAllIssues(currentMagazine.id);
  } else {
    // Kayıtlı dergi yok: DOĞRUDAN BOMBOŞ BEYAZ SAYFA İLE SIFIRDAN BAŞLA! (ASLA HAZIR ŞABLON AÇMAZ)
    currentMagazine = null;
    currentIssue = null;
    if (magSelector) magSelector.value = 'blank-new';
    if (issueSelector) {
      issueSelector.innerHTML = '<option value="sayi1">Sayı 01 (Boş)</option>';
      issueSelector.disabled = false;
    }
    startPureBlankMagazine(true);
  }
}

function updateMagazineHeaderUI() {
  const schoolText = document.getElementById('headerSchoolText');
  if (schoolText) {
    schoolText.textContent = currentMagazine ? currentMagazine.schoolName : 'Şablon Tasarım Masası';
  }
}

function renderRegisteredMagazinesList() {
  const container = document.getElementById('registeredMagazinesList');
  if (!container) return;
  if (!allMagazines || allMagazines.length === 0) {
    container.innerHTML = `<div class="text-xs text-emerald-400">✨ Sistemde kayıtlı örnek dergi yok. Doğrudan şablonlar üzerinden özgürce çalışabilirsiniz.</div>`;
    return;
  }
  container.innerHTML = allMagazines.map(m => `
    <div class="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
      <div class="truncate pr-2">
        <strong class="text-white">${escapeHtml(m.name)}</strong>
        <span class="text-slate-400 ml-1">(${escapeHtml(m.schoolName)})</span>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button onclick="onMagazineChange('${m.id}'); closeModal('newMagazineModal');" class="px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10.5px] font-semibold">Aç</button>
        <button onclick="deleteMagazineById('${m.id}')" class="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[10.5px] font-bold flex items-center gap-1 transition">
          <i class="ph ph-trash"></i> Sil
        </button>
      </div>
    </div>
  `).join('');
}

async function clearAllSavedMagazines() {
  if (allMagazines.length === 0) {
    startPureBlankMagazine();
    showToast("📄 Bembeyaz boş sayfa açıldı!");
    return;
  }
  if (!confirm("Sistemde kayıtlı dergileri silip bembeyaz boş çalışma masasına geçmek istiyor musunuz?")) {
    return;
  }
  try {
    await fetch('/api/magazines-all', {
      method: 'DELETE',
      headers: { 'x-access-code': currentUser.code }
    });
    allMagazines = [];
    allIssues = [];
    currentMagazine = null;
    currentIssue = null;
    window.history.pushState({}, '', '/editor');
    startPureBlankMagazine();
    showToast("🗑️ Tüm dergiler silindi, tertemiz boş sayfa açıldı!");
  } catch (err) {
    showToast("Sunucu hatası!");
  }
}

async function deleteCurrentMagazine() {
  if (!currentMagazine) {
    await clearAllSavedMagazines();
    return;
  }
  await deleteMagazineById(currentMagazine.id);
}

async function deleteMagazineById(magId) {
  const target = allMagazines.find(m => m.id === magId);
  if (!target) return;

  if (!confirm(`"${target.name} (${target.schoolName})" dergisini kalıcı olarak silmek istediğinize emin misiniz?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/magazines/${magId}`, {
      method: 'DELETE',
      headers: { 'x-access-code': currentUser.code }
    });
    const data = await res.json();
    if (data.success) {
      showToast(`🗑️ "${target.name}" dergisi silindi!`);
      window.history.pushState({}, '', '/editor');
      await loadAllMagazines();
    } else {
      showToast(data.error || "Silinemedi!");
    }
  } catch (err) {
    showToast("Sunucu bağlantı hatası!");
  }
}

async function deleteCurrentIssue() {
  if (!currentIssue) return;
  if (!confirm(`"${currentIssue.title}" sayısını kalıcı olarak silmek istediğinize emin misiniz?`)) {
    return;
  }
  try {
    const res = await fetch(`/api/issues/${currentIssue.id}`, {
      method: 'DELETE',
      headers: { 'x-access-code': currentUser.code }
    });
    const data = await res.json();
    if (data.success) {
      showToast(`🗑️ "${currentIssue.title}" sayısı silindi!`);
      await loadAllIssues(currentMagazine ? currentMagazine.id : null);
    }
  } catch (err) {
    showToast("Sunucu hatası!");
  }
}

// ==========================================
// TÜM ŞABLONLAR & 20 KONSEPT GALERİSİ (OKUL FARK ETMEKSİZİN)
// ==========================================
const ALL_PAGE_TEMPLATES_CATALOG = [
  { type: 'cover', layout: 'minimalist', title: '🏛️ K1 • Minimalist Kapak (Kamer)', desc: 'Sol siyah özet bloğu, sağ dikey görsel ve barkod.', badge: 'Minimalist', color: '#d97706' },
  { type: 'cover', layout: 'brutalist', title: '⚡ K1 • Brütalist Kapak (Resimlik)', desc: 'Devasa üst üste başlık, eğik görsel çerçevesi ve sarı rozet.', badge: 'Brütalist', color: '#eab308' },
  { type: 'cover', layout: 'modular', title: '📐 K1 • Modüler Kapak (Konak)', desc: 'Net ızgara çerçeveleri, 2 sütun görsel, 1 sütun kutu yığını.', badge: 'Modüler', color: '#0284c7' },
  { type: 'cover', layout: 'fullscreen', title: '🌄 K1 • Fullscreen Kapak (Doğal)', desc: 'Tam sayfa görsel üzeri edebi manşet ve yatay spotlar.', badge: 'Fullscreen', color: '#10b981' },
  { type: 'k2', subType: 'ataturk', title: '🇹🇷 K2 • Atatürk & Hitabe', desc: 'Cumhuriyet köşesi, Atatürk portresi ve Gençliğe Hitabe.', badge: 'Kapak İçi A', color: '#dc2626' },
  { type: 'k2', subType: 'director', title: '✍️ K2 • Başyazı / Sunuş Yazısı', desc: 'Yayın yönetmeni veya kurum başkanı hoş geldiniz mesajı.', badge: 'Kapak İçi B', color: '#4f46e5' },
  { type: 'k2', subType: 'artistic', title: '🎨 K2 • Sanatsal Vizyon', desc: 'Tam sayfa sanatsal fotoğraf ve vizyon sözü.', badge: 'Kapak İçi C', color: '#8b5cf6' },
  { type: 'toc', title: '📑 İçindekiler & Editörden Mektup', desc: 'Editörün masası, vurgu alıntısı ve tıklanabilir sayfa fihristi.', badge: 'Fihrist', color: '#6366f1' },
  { type: 'article', title: '📰 Özel Dosya & Makale', desc: 'Manşet fotoğrafı, iki sütunlu yazı ve vurgu alıntı kutusu.', badge: 'Makale', color: '#3b82f6' },
  { type: 'interview', title: '🎙️ Ayın Konuğu & Röportaj', desc: 'Renkli degrade konuk çerçevesi ve S1-S2-S3 soru-cevap kutuları.', badge: 'Renkli Çerçeveli', color: '#d97706' },
  { type: 'catalog', title: '🛍️ Katalog & Ürün / Proje Özeti', desc: 'Görsel vitrin, açıklama ve düzenlenebilir teknik veri tablosu.', badge: 'Katalog & Tablo', color: '#881337' },
  { type: 'literature', title: '🪶 Edebiyat & Şiir Köşesi', desc: 'Sanatsal görsel, ortalı şiir/deneme tipografisi ve alt not.', badge: 'Sanat & Şiir', color: '#ec4899' },
  { type: 'video', title: '🎬 Etkinlik & Video (MP4)', desc: 'Sayfa içi gömülü MP4 video oynatıcı, başlık ve açıklama.', badge: 'Multimedya', color: '#f59e0b' },
  { type: 'quiz', title: '💡 Etkileşimli Köşe & Quiz', desc: 'Çoktan seçmeli ödüllü soru kutusu + Kitap & Film önerisi.', badge: 'İnteraktif', color: '#14b8a6' },
  { type: 'k3', title: '👥 K3 • Arka Kapak İçi (Künye)', desc: 'Yayın kurulu künyesi ve Gelecek Sayıda Neler Var kutusu.', badge: 'Künye', color: '#64748b' },
  { type: 'k4', title: '🏁 K4 • Arka Dış Kapak', desc: 'Prestij halka rozeti, QR kod, motto ve barkod.', badge: 'Arka Kapak', color: '#4f46e5' },
  { type: 'freeform', title: '✨ Boş Tuval (Serbest Tasarım)', desc: 'Metin kutuları, renkli çerçeveler, resim ve tabloları serbestçe dizin.', badge: 'Serbest', color: '#10b981' }
];

function openAllTemplatesModal() {
  if (typeof renderWireframesModalGrid === 'function') {
    renderWireframesModalGrid();
  }
  const pageGrid = document.getElementById('allPageTypesGrid');
  const presetGrid = document.getElementById('allPresetsGrid');

  if (pageGrid) {
    pageGrid.innerHTML = ALL_PAGE_TEMPLATES_CATALOG.map((item, idx) => `
      <div class="bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-3.5 flex flex-col justify-between transition group">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase text-white" style="background-color: ${item.color}">${escapeHtml(item.badge)}</span>
            <span class="text-[10px] text-slate-500 font-mono">#${idx + 1}</span>
          </div>
          <h5 class="font-bold text-white text-xs mb-1">${escapeHtml(item.title)}</h5>
          <p class="text-[11px] text-slate-400 leading-snug mb-3">${escapeHtml(item.desc)}</p>
        </div>
        <div class="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80">
          <button onclick="convertCurrentPageToTemplate('${item.type}', '${item.layout || item.subType || ''}')" class="py-1.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[10.5px] font-bold transition">
            ⚡ Bu Sayfaya Uygula
          </button>
          <button onclick="addNewPage('${item.type}', '${item.layout || item.subType || ''}'); closeModal('allTemplatesModal');" class="py-1.5 px-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[10.5px] font-bold transition">
            ➕ Yeni Sayfa Ekle
          </button>
        </div>
      </div>
    `).join('');
  }

  if (presetGrid) {
    presetGrid.innerHTML = MAGAZINE_PRESETS.map(p => `
      <div class="bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-3.5 flex flex-col justify-between transition">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase text-white shadow" style="background-color: ${p.accent}">${escapeHtml(p.category)}</span>
            <span class="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">${escapeHtml(p.layout)}</span>
          </div>
          <div onclick="loadFullTemplatePreset(${p.id})" class="p-2.5 rounded-xl mb-2.5 border border-slate-800/90 cursor-pointer hover:brightness-110 transition" style="background: linear-gradient(135deg, ${p.accent}33, #0f172a)">
            <div class="text-[10px] font-mono text-slate-300 uppercase tracking-widest">${escapeHtml(p.name)}</div>
            <div class="font-serif font-black text-base text-white tracking-tight truncate">${escapeHtml(p.title)}</div>
            <div class="text-[11px] font-bold text-amber-300 truncate mt-0.5">${escapeHtml(p.headline)}</div>
          </div>
          <p class="text-[11px] text-slate-400 leading-snug mb-3 line-clamp-2">${escapeHtml(p.desc)}</p>
        </div>
        <div class="space-y-1.5 pt-2 border-t border-slate-800/80">
          <button onclick="loadFullTemplatePreset(${p.id})" class="w-full py-1.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10.5px] font-extrabold transition shadow">
            🔥 Tüm Şablon Örneğini Yükle (6 Sayfa)
          </button>
          <div class="grid grid-cols-2 gap-1.5">
            <button onclick="applyConceptToCurrentPage(${p.id})" class="py-1 px-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-[10px] font-semibold transition">
              Bu Sayfaya Uygula
            </button>
            <button onclick="addConceptAsNewPage(${p.id})" class="py-1 px-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-[10px] font-semibold transition">
              + Kapak Ekle
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  openModal('allTemplatesModal');
}

function applyConceptToCurrentPage(presetId) {
  const preset = MAGAZINE_PRESETS.find(p => p.id === Number(presetId));
  const page = magazineData.pages[selectedEditIndex];
  if (!preset || !page) return;

  page.type = 'cover';
  page.layout = preset.layout;
  page.accentColor = preset.accent;
  page.navTitle = `Kapak • ${preset.title}`;
  page.magazineName = preset.title;
  page.issueTag = preset.issueTag || "SAYI 01 • 2026";
  page.price = preset.price || preset.category.toUpperCase();
  page.mainHeadline = preset.headline;
  page.subHeadline = preset.desc;
  page.highlights = (preset.subs || []).join('\n');
  page.coverImage = preset.coverImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80";

  closeModal('allTemplatesModal');
  renderAll();
  if (currentIssue) saveAllChangesToServer(true);
  showToast(`🎨 "${preset.name}" örneği mevcut sayfaya yüklendi!`);
}

function addConceptAsNewPage(presetId) {
  const preset = MAGAZINE_PRESETS.find(p => p.id === Number(presetId));
  if (!preset) return;

  const newPage = {
    id: 'p' + Date.now(),
    type: 'cover',
    layout: preset.layout,
    navTitle: `Kapak • ${preset.name}`,
    accentColor: preset.accent,
    assignedEditor: currentUser.code,
    status: 'approved',
    adminNote: '',
    magazineName: preset.title,
    issueTag: preset.issueTag || "SAYI 01 • 2026",
    price: preset.price || preset.category.toUpperCase(),
    mainHeadline: preset.headline,
    subHeadline: preset.desc,
    coverImage: preset.coverImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    highlights: (preset.subs || []).join('\n'),
    elements: []
  };

  magazineData.pages.push(newPage);
  closeModal('allTemplatesModal');
  selectPageForEdit(magazineData.pages.length - 1);
  if (currentIssue) saveAllChangesToServer(true);
  showToast(`➕ "${preset.name}" konseptli yeni sayfa eklendi!`);
}

function convertCurrentPageToTemplate(templateType, subOption = '') {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;

  page.type = templateType;
  page.adminNote = '';

  if (templateType === 'cover') {
    const arch = subOption || 'minimalist';
    page.layout = arch;
    if (arch === 'brutalist') {
      page.navTitle = 'K1 • Brütalist Kapak';
      page.accentColor = '#facc15';
      page.magazineName = 'RESİMLİK';
      page.issueTag = 'SAYI 04';
      page.price = '2026 TREND';
      page.mainHeadline = 'YENİ GÖRÜNÜMLER';
      page.subHeadline = 'LİT POPÜLER KÜLTÜR DOSYASI';
      page.coverImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80';
      page.highlights = 'Mavi Sarı Kırmızı Trend\nBrütalist Stilde Moda\nKapak Hikayesi Destek';
    } else if (arch === 'modular') {
      page.navTitle = 'K1 • Modüler Kapak';
      page.accentColor = '#0f172a';
      page.magazineName = 'KONAK';
      page.issueTag = 'SAYI 01';
      page.price = 'EV VE İÇ MEKANLAR';
      page.mainHeadline = 'TARZ DENEYİMLERİ';
      page.subHeadline = 'TASARIM ÖDÜLLERİ 2030';
      page.coverImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80';
      page.highlights = 'Yeni Renkler\nÇağdaş Stiller\nTaze Perspektifler';
    } else if (arch === 'fullscreen') {
      page.navTitle = 'K1 • Fullscreen Kapak';
      page.accentColor = '#10b981';
      page.magazineName = 'DOĞAL';
      page.issueTag = 'BAHAR 2026';
      page.price = 'YAŞAM ALANLARI';
      page.mainHeadline = 'VAHŞİ YAŞAMIN BÜYÜSÜ';
      page.subHeadline = 'Gezegenin Paydaşları ve Korunan Alanlar';
      page.coverImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80';
      page.highlights = 'Ormanın Derinlikleri\nNesli Tükenenler\nYaban Hayatı Korumak';
    } else {
      page.navTitle = 'K1 • Minimalist Kapak';
      page.accentColor = '#d97706';
      page.magazineName = 'KAMER';
      page.issueTag = 'AY YIL | SAYI NO';
      page.price = 'DERGİ';
      page.mainHeadline = 'Güçlü Kadın Lider';
      page.subHeadline = 'Kapak hikayesi için destek metni buraya girilecektir.';
      page.coverImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80';
      page.highlights = 'Moda Sektöründe\nRenkleri Kendinize Uyarlayın\nSezonun En İyi Görünümleri';
    }
  } else if (templateType === 'k2') {
    page.subType = subOption || 'ataturk';
    page.navTitle = page.subType === 'ataturk' ? 'K2 • Atatürk & Hitabe' : (page.subType === 'director' ? 'K2 • Sunuş Yazısı' : 'K2 • Sanatsal Vizyon');
    page.headerText = page.subType === 'ataturk' ? 'TÜRK GENÇLİĞİNE HİTABE' : 'YENİ SAYIMIZA HOŞ GELDİNİZ';
    page.subText = page.subType === 'ataturk'
      ? 'Ey Türk Gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyeti\'ni, ilelebet muhafaza ve müdafaa etmektir.'
      : 'Dergimizin bu yeni sayısında kültür, sanat, bilim ve tasarım dünyasından ilham verici dosyalarla karşınızdayız.';
    page.author = page.subType === 'ataturk' ? 'Gazi Mustafa Kemal Atatürk' : 'Genel Yayın Yönetmeni';
    page.image = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80';
    page.quote = 'Bütün ümidim gençliktedir.';
  } else if (templateType === 'interview') {
    page.navTitle = 'Ayın Konuğu & Röportaj';
    page.accentColor = '#d97706';
    page.rubric = 'AYIN KONUĞU';
    page.interviewee = 'Ceyhan Fidancı';
    page.role = 'Tasarım & Kültür Direktörü';
    page.intro = 'Yaratıcı endüstriler, modern dergicilik ve geleceğin tasarım trendleri üzerine gerçekleştirdiğimiz özel söyleşi.';
    page.photo = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
    page.q1 = 'Tasarım yolculuğunuz nasıl başladı? İlk ilham kaynağınız neydi?';
    page.a1 = 'Görsel hikaye anlatıcılığına duyduğum merakla başladı. Renklerin ve tipografinin insan duyguları üzerindeki etkisini keşfetmek her şeyi değiştirdi.';
    page.q2 = 'Dijital yayıncılıkta okuyucuyu yakalamanın sırrı nedir?';
    page.a2 = 'Sade bir mizanpaj, güçlü fotoğraflar ve etkileşimli öğeler. Okuyucu artık sadece okumak değil, sayfayla etkileşime geçmek istiyor.';
    page.q3 = 'Genç içerik üreticilerine ve tasarımcılara ne önerirsiniz?';
    page.a3 = 'Kendi özgün sesinizi bulmaktan korkmayın ve her projede yeni bir şeyler deneyin.';
  } else if (templateType === 'article') {
    page.navTitle = 'Özel Dosya & Makale';
    page.category = 'ÖZEL DOSYA';
    page.title = 'GÜÇLÜ KADIN LİDER';
    page.author = 'Yazan: Meryem Pars';
    page.image = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
    page.imageCaption = 'Özel dosya çalışmasından bir kare.';
    page.content = 'Makale metninizi doğrudan üzerine tıklayarak veya sağ panelden düzenleyebilirsiniz. İki sütunlu modern dergi mizanpajı sayesinde uzun metinleriniz bile ferah ve estetik görünür.';
    page.pullQuote = 'Yaratıcılık, sınırları zorlamak ve yeni ufuklar açmakla başlar.';
  } else if (templateType === 'literature') {
    page.navTitle = 'Edebiyat & Şiir Köşesi';
    page.header = 'EDEBİYAT & SANAT SEÇKİSİ';
    page.title = 'Güz Rüzgarı ve Satırlar';
    page.author = 'Yazan: Edebiyat Masası';
    page.bgImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    page.poemText = 'Sarı yapraklar düşerken şehrin taşlarına,\nBir melodi böler en derin hayalleri.\nSayfalarda saklı kalan eski cümleler,\nAnlatır sessizce geçen tüm mevsimleri.';
    page.bottomNote = 'Edebiyat ve sanat köşemiz için seçilen özel eser.';
  } else if (templateType === 'toc') {
    page.navTitle = 'Editörden Mektup & İçindekiler';
    page.editorTitle = 'Editörden Mektup';
    page.editorQuote = 'TANITIM ALINTISI, MAKALEDEN ALINAN ETKİLEYİCİ BİR ALINTIDIR. VURGULAMAK İSTEDİĞİNİZ ALINTIYI BURAYA YERLEŞTİREBİLİRSİNİZ.';
    page.editorText = 'Editörün mektubu, samimi veya resmi olabilen, çeşitli nedenler için yazılmış bir mesajdır. Okuyucunun belirli bir konunun içeriğini ve kreatif yönünü anlamasına yardımcı olabilir...';
    page.editorName = 'Ceyhan Fidancı';
    page.editorImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  } else if (templateType === 'catalog') {
    page.navTitle = 'Katalog & Teknik Tablo';
    page.accentColor = '#68181f';
    page.catTag = 'PROJE & ÜRÜN TANITIMI';
    page.title = 'ÜRÜN VE PROJE GENEL BAKIŞ';
    page.desc = 'Projemiz en güncel bilimsel yöntemler ve estetik tasarım ilkeleriyle geliştirilmiştir. Sağ panelden veya tablodan tüm teknik detayları inceleyebilirsiniz.';
    page.image = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80';
    page.specTitle = 'TEKNİK ÖZELLİKLER TABLOSU';
  } else if (templateType === 'k3') {
    page.navTitle = 'K3 • Künye';
    page.boardTitle = 'YAYIN KURULU KÜNYESİ';
    page.publisher = 'Yayın Grubu';
    page.editorInChief = 'Genel Yayın Yönetmeni';
    page.advisor = 'Tasarım & İçerik Danışmanı';
    page.editorialTeam = 'Yaratıcı Tasarım Ekibi';
    page.contactInfo = 'iletisim@dergimiz.com.tr';
    page.nextIssueTeaserTitle = 'GELECEK SAYIDA NELER VAR?';
    page.nextIssueText = '• Yeni Dosya Konusu\n• Özel Röportajlar ve İncelemeler';
  } else if (templateType === 'k4') {
    page.navTitle = 'K4 • Arka Kapak';
    page.schoolName = magazineData.schoolName || 'DERGİ TASARIM STÜDYOSU';
    page.motto = '"İlham veren içerikler, modern tasarım..."';
    page.coverImage = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80';
    page.qrText = 'Dergiyi çevrim içi okumak için karekodu okutun';
    page.qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dergimiz.com.tr';
    page.social = '@dergimiz';
    page.closingQuote = 'Gelecek sayıda buluşmak dileğiyle.';
  } else if (templateType === 'freeform') {
    page.navTitle = 'Serbest Tasarım Sayfası';
  }

  closeModal('allTemplatesModal');
  renderAll();
  if (currentIssue) saveAllChangesToServer(true);
  showToast(`⚡ "${templateType.toUpperCase()}" şablon örneği sayfaya yüklendi!`);
}

async function onMagazineChange(newMagId) {
  if (newMagId === 'blank-new') {
    startPureBlankMagazine();
    return;
  }

  if (String(newMagId).startsWith('preset-')) {
    const pId = Number(String(newMagId).replace('preset-', '')) || 1;
    currentMagazine = null;
    currentIssue = null;
    const issueSelector = document.getElementById('issueSelector');
    if (issueSelector) {
      issueSelector.innerHTML = `<option value="tpl">Şablon #${pId} Örneği (6 Sayfa)</option>`;
    }
    loadFullTemplatePreset(pId);
    return;
  }

  const selected = allMagazines.find(m => m.id === newMagId);
  if (!selected) return;
  currentMagazine = selected;
  updateMagazineHeaderUI();

  const url = new URL(window.location);
  url.searchParams.set('magId', selected.id);
  url.searchParams.delete('id');
  window.history.pushState({}, '', url);

  await loadAllIssues(selected.id);
}

async function createNewMagazineSubmit() {
  const schoolName = document.getElementById('newMagSchoolName').value.trim();
  const name = document.getElementById('newMagName').value.trim();
  const period = document.getElementById('newMagPeriod').value;
  const themeColor = document.getElementById('newMagColor').value;
  const description = document.getElementById('newMagDesc').value.trim();
  const createFirstIssue = document.getElementById('newMagFirstIssueCheck').checked;
  const presetSelect = document.getElementById('newMagPreset');
  const presetId = presetSelect ? Number(presetSelect.value) : 1;
  const preset = MAGAZINE_PRESETS.find(p => p.id === presetId);
  const layout = preset ? preset.layout : 'minimalist';

  if (!schoolName || !name) {
    showToast("Lütfen Kurum/Okul Adı ve Dergi Adı alanlarını doldurun!");
    return;
  }

  try {
    const res = await fetch('/api/magazines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-code': currentUser.code
      },
      body: JSON.stringify({
        schoolName,
        name,
        period,
        themeColor,
        description,
        createFirstIssue,
        layout
      })
    });

    const data = await res.json();
    if (data.success && data.magazine) {
      closeModal('newMagazineModal');
      showToast(`🎉 "${name}" dergisi oluşturuldu!`);
      document.getElementById('newMagSchoolName').value = '';
      document.getElementById('newMagName').value = '';
      document.getElementById('newMagDesc').value = '';

      await loadAllMagazines();
      await onMagazineChange(data.magazine.id);
    } else {
      showToast(data.error || "Oluşturulamadı!");
    }
  } catch (err) {
    showToast("Bağlantı hatası!");
  }
}

async function loadAllIssues(magId = null) {
  const effectiveMagId = magId || (currentMagazine ? currentMagazine.id : null);
  if (!effectiveMagId) {
    loadFullTemplatePreset(activeTemplatePresetId || 1, true);
    return;
  }
  const queryParam = `&magazineId=${effectiveMagId}`;

  try {
    const res = await fetch(`/api/issues?includeDrafts=true${queryParam}`);
    if (!res.ok) throw new Error('Sayılar alınamadı');
    allIssues = await res.json();
  } catch (err) {
    console.warn('API verisi alınamadı:', err);
    allIssues = [];
  }

  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id');

  const selector = document.getElementById('issueSelector');
  if (selector) {
    selector.innerHTML = '';
    allIssues.forEach(iss => {
      const opt = document.createElement('option');
      opt.value = iss.id;
      opt.textContent = `${iss.title} (${iss.status === 'published' ? 'Yayında' : 'Taslak'})`;
      selector.appendChild(opt);
    });
  }

  const activeIssue = (targetId && allIssues.find(i => i.id === targetId)) || allIssues[0];
  if (activeIssue) {
    if (selector) selector.value = activeIssue.id;
    setIssue(activeIssue);
  } else {
    currentIssue = null;
    loadFullTemplatePreset(activeTemplatePresetId || 1, true);
  }
}

function onIssueChange(newId) {
  const selected = allIssues.find(i => i.id === newId);
  if (selected) {
    const url = new URL(window.location);
    url.searchParams.set('id', selected.id);
    window.history.pushState({}, '', url);
    setIssue(selected);
  }
}

function setIssue(issue) {
  currentIssue = issue;
  magazineData = JSON.parse(JSON.stringify(issue));
  if (!magazineData.pages || magazineData.pages.length === 0) {
    magazineData.pages = buildSamplePagesForPreset(1);
  }
  // Eski sayfalardaki can sıkıcı adminNote uyarılarını temizle
  (magazineData.pages || []).forEach(p => {
    p.adminNote = '';
  });
  selectedEditIndex = 0;
  currentIndex = 0;
  selectedElementId = null;

  updateIssueHeaderUI();
  renderAll();
}

function updateIssueHeaderUI() {
  if (!currentIssue) return;
  const isPub = currentIssue.status === 'published';
  const badge = document.getElementById('issueStatusBadge');
  const pubBtnText = document.getElementById('btnPublishText');
  const pubBtn = document.getElementById('btnPublishToggle');

  if (badge) {
    badge.textContent = isPub ? 'Yayında' : 'Taslak';
    badge.className = isPub 
      ? 'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      : 'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30';
  }

  if (pubBtnText) pubBtnText.textContent = isPub ? 'Taslağa Çek' : 'Canlıya Al';
  if (pubBtn) {
    pubBtn.className = isPub
      ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg transition'
      : 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition';
  }

  document.getElementById('headerSchoolText').textContent = magazineData.schoolName || "UFUK ANADOLU LİSESİ E-DERGİ";
}

async function togglePublishCurrentIssue() {
  if (currentUser.role !== 'admin') {
    showToast("Yalnızca Admin yayına alabilir!");
    return;
  }
  try {
    const res = await fetch(`/api/issues/${currentIssue.id}/publish`, {
      method: 'POST',
      headers: { 'x-access-code': currentUser.code }
    });
    const data = await res.json();
    if (data.success) {
      currentIssue.status = data.status;
      magazineData.status = data.status;
      updateIssueHeaderUI();
      showToast(data.status === 'published' ? "🎉 Dergi canlıya alındı!" : "Dergi taslak moduna çekildi.");
    }
  } catch (err) {
    showToast("İşlem başarısız!");
  }
}

// ==========================================
// 3. SAYFA RENDER, UNDO/REDO, SOL RAY & MİNYATÜR GÖRÜNÜM (FAZ 1)
// ==========================================
function pushHistoryState() {
  if (isRestoringHistory || !magazineData || !magazineData.pages) return;
  const snapshot = JSON.stringify({
    pages: magazineData.pages,
    selectedEditIndex
  });
  if (historyStack.length > 0 && historyStack[historyStack.length - 1] === snapshot) return;
  historyStack.push(snapshot);
  if (historyStack.length > 50) historyStack.shift();
  redoStack = [];
  updateUndoRedoButtons();
}

function undoAction() {
  if (historyStack.length <= 1) {
    showToast("Geri alınacak başka işlem yok");
    return;
  }
  isRestoringHistory = true;
  const currentSnap = historyStack.pop();
  redoStack.push(currentSnap);
  const prevSnap = JSON.parse(historyStack[historyStack.length - 1]);
  magazineData.pages = prevSnap.pages;
  selectedEditIndex = Math.min(prevSnap.selectedEditIndex || 0, magazineData.pages.length - 1);
  selectedElementId = null;
  renderAll();
  saveAllChangesToServer(true);
  isRestoringHistory = false;
  updateUndoRedoButtons();
  showToast("↶ İşlem geri alındı");
}

function redoAction() {
  if (redoStack.length === 0) {
    showToast("İleri alınacak işlem yok");
    return;
  }
  isRestoringHistory = true;
  const nextSnapRaw = redoStack.pop();
  historyStack.push(nextSnapRaw);
  const nextSnap = JSON.parse(nextSnapRaw);
  magazineData.pages = nextSnap.pages;
  selectedEditIndex = Math.min(nextSnap.selectedEditIndex || 0, magazineData.pages.length - 1);
  selectedElementId = null;
  renderAll();
  saveAllChangesToServer(true);
  isRestoringHistory = false;
  updateUndoRedoButtons();
  showToast("↷ İşlem ileri alındı");
}

function updateUndoRedoButtons() {
  const btnU = document.getElementById('btnUndo');
  const btnR = document.getElementById('btnRedo');
  if (btnU) btnU.disabled = historyStack.length <= 1;
  if (btnR) btnR.disabled = redoStack.length === 0;
}

function switchLeftTab(tabName) {
  const sidebar = document.getElementById('leftSidebar');
  // Aynı sekmeye tekrar tıklandıysa ve çekmece açıksa kapat (FlipHTML5 v2 davranışı)
  if (activeLeftTab === tabName && sidebar && !isLeftDrawerCollapsed) {
    toggleLeftDrawerCollapse();
    return;
  }

  activeLeftTab = tabName;
  const tabs = ['pages', 'templates', 'elements', 'links', 'uploads'];
  tabs.forEach(t => {
    const btn = document.getElementById(`railBtn_${t}`);
    const panel = document.getElementById(`leftPanel_${t}`);
    if (btn) {
      if (t === tabName) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    if (panel) {
      if (t === tabName) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    }
  });

  // Eğer çekmece daraltılmışsa aç
  if (sidebar && isLeftDrawerCollapsed) {
    toggleLeftDrawerCollapse();
  }

  if (tabName === 'templates') {
    if (typeof renderSmartLeftDrawerTemplates === 'function') {
      renderSmartLeftDrawerTemplates();
    } else {
      renderDrawerTemplatesList();
    }
  }
  closeMorePopupMenu();
}

function toggleLeftDrawerCollapse() {
  const sidebar = document.getElementById('leftSidebar');
  const icon = document.getElementById('leftDrawerToggleIcon');
  const txt = document.getElementById('txtToggleLeft');
  if (!sidebar) return;
  isLeftDrawerCollapsed = !isLeftDrawerCollapsed;
  if (isLeftDrawerCollapsed) {
    sidebar.classList.add('hidden');
    if (icon) icon.className = 'ph ph-caret-double-right text-base';
    if (txt) txt.textContent = 'Sol Paneli Aç';
  } else {
    sidebar.classList.remove('hidden');
    if (icon) icon.className = 'ph ph-caret-double-left text-base';
    if (txt) txt.textContent = 'Sol Paneli Kapat';
  }
}

function toggleRightSidebarCollapse() {
  const rightBar = document.getElementById('rightSidebar');
  const icon = document.getElementById('rightDrawerToggleIcon');
  const txt = document.getElementById('txtToggleRight');
  if (!rightBar) return;
  isRightSidebarCollapsed = !isRightSidebarCollapsed;
  if (isRightSidebarCollapsed) {
    rightBar.classList.add('hidden');
    if (icon) icon.className = 'ph ph-caret-double-left text-base';
    if (txt) txt.textContent = 'Sağ Paneli Aç';
  } else {
    rightBar.classList.remove('hidden');
    if (icon) icon.className = 'ph ph-caret-double-right text-base';
    if (txt) txt.textContent = 'Sağ Paneli Kapat';
  }
}

function toggleCanvasActionBar() {
  const bar = document.getElementById('canvasActionBar');
  const txt = document.getElementById('txtToggleTopBar');
  if (!bar) return;
  const isHidden = bar.classList.toggle('hidden');
  if (txt) {
    txt.textContent = isHidden ? 'Aç ▾' : 'Daralt ▴';
  }
}

function toggleTopToolbarCollapse() {
  const header = document.getElementById('topToolbar');
  const restoreBtn = document.getElementById('btnRestoreHeader');
  if (!header) return;
  isTopToolbarCollapsed = !isTopToolbarCollapsed;
  if (isTopToolbarCollapsed) {
    header.classList.add('hidden');
    if (restoreBtn) restoreBtn.classList.remove('hidden');
  } else {
    header.classList.remove('hidden');
    if (restoreBtn) restoreBtn.classList.add('hidden');
  }
}

function toggleZenCanvasMode() {
  isZenMode = !isZenMode;
  const leftBar = document.getElementById('leftSidebar');
  const rightBar = document.getElementById('rightSidebar');
  const topBar = document.getElementById('topToolbar');
  const actionBar = document.getElementById('canvasActionBar');
  const restoreBtn = document.getElementById('btnRestoreHeader');
  const txtZen = document.getElementById('txtZenMode');
  const txtLeft = document.getElementById('txtToggleLeft');
  const txtRight = document.getElementById('txtToggleRight');

  if (isZenMode) {
    isLeftDrawerCollapsed = true;
    isRightSidebarCollapsed = true;
    isTopToolbarCollapsed = true;
    if (leftBar) leftBar.classList.add('hidden');
    if (rightBar) rightBar.classList.add('hidden');
    if (topBar) topBar.classList.add('hidden');
    if (actionBar) actionBar.classList.add('hidden');
    if (restoreBtn) restoreBtn.classList.remove('hidden');
    if (txtZen) txtZen.textContent = 'Panelleri Göster';
    if (txtLeft) txtLeft.textContent = 'Sol Paneli Aç';
    if (txtRight) txtRight.textContent = 'Sağ Paneli Aç';
    showToast("⛶ Tam Tuval Modu: Tüm paneller gizlendi!");
  } else {
    isLeftDrawerCollapsed = false;
    isRightSidebarCollapsed = false;
    isTopToolbarCollapsed = false;
    if (leftBar) leftBar.classList.remove('hidden');
    if (rightBar) rightBar.classList.remove('hidden');
    if (topBar) topBar.classList.remove('hidden');
    if (restoreBtn) restoreBtn.classList.add('hidden');
    if (txtZen) txtZen.textContent = 'Panelleri Gizle';
    if (txtLeft) txtLeft.textContent = 'Sol Paneli Kapat';
    if (txtRight) txtRight.textContent = 'Sağ Paneli Kapat';
    showToast("Paneller tekrar açıldı");
  }
  renderMagazineViewport();
}

function toggleMorePopupMenu(ev) {
  if (ev) ev.stopPropagation();
  const menu = document.getElementById('morePopupMenu');
  if (!menu) return;
  menu.classList.toggle('hidden');
}

function closeMorePopupMenu() {
  const menu = document.getElementById('morePopupMenu');
  if (menu) menu.classList.add('hidden');
}

function renderDrawerTemplatesList() {
  const container = document.getElementById('drawerTemplatesList');
  if (!container) return;
  container.innerHTML = `
    <div class="text-[10.5px] font-bold uppercase tracking-wider text-indigo-400 mb-1">20 Hazır Dergi Konsepti (Örnekleriyle)</div>
    <div class="space-y-2 mb-4">
      ${MAGAZINE_PRESETS.map(p => `
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 transition">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-white">${p.id}. ${escapeHtml(p.name)}</span>
            <span class="text-[9.5px] px-1.5 py-0.5 rounded text-white font-bold" style="background:${p.accent}">${escapeHtml(p.layout)}</span>
          </div>
          <div class="text-[10.5px] text-amber-300 font-semibold truncate mb-1.5">${escapeHtml(p.title)} — ${escapeHtml(p.headline)}</div>
          <button onclick="loadFullTemplatePreset(${p.id})" class="w-full py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold mb-1 shadow">
            🔥 Tüm Şablon Örneğini Yükle
          </button>
          <div class="grid grid-cols-2 gap-1.5">
            <button onclick="applyConceptToCurrentPage(${p.id})" class="py-1 px-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-[10px] font-semibold">Bu Sayfaya</button>
            <button onclick="addConceptAsNewPage(${p.id})" class="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold">+ Yeni Sayfa</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="text-[10.5px] font-bold uppercase tracking-wider text-amber-400 mb-1 pt-2 border-t border-slate-800">Tekil Sayfa Mizanpajları</div>
    <div class="space-y-2">
      ${ALL_PAGE_TEMPLATES_CATALOG.map(item => `
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 transition">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-white">${escapeHtml(item.title)}</span>
            <span class="text-[9.5px] px-1.5 py-0.5 rounded text-white font-bold" style="background:${item.color}">${escapeHtml(item.badge)}</span>
          </div>
          <p class="text-[10.5px] text-slate-400 mb-2 leading-snug">${escapeHtml(item.desc)}</p>
          <div class="grid grid-cols-2 gap-1.5">
            <button onclick="convertCurrentPageToTemplate('${item.type}', '${item.layout || item.subType || ''}')" class="py-1 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold">Örneği Yükle</button>
            <button onclick="addNewPage('${item.type}', '${item.layout || item.subType || ''}')" class="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold">+ Yeni Ekle</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function setCanvasZoom(zoomVal) {
  canvasZoom = Math.max(40, Math.min(200, zoomVal));
  const wrapper = document.getElementById('magazineZoomWrapper');
  const sel = document.getElementById('zoomSelector');
  if (wrapper) {
    wrapper.style.transform = `scale(${canvasZoom / 100})`;
  }
  if (sel) {
    const existing = Array.from(sel.options).find(o => Number(o.value) === canvasZoom);
    if (existing) sel.value = String(canvasZoom);
  }
}

function stepCanvasZoom(delta) {
  setCanvasZoom(canvasZoom + delta);
}

function togglePanMode() {
  isPanMode = !isPanMode;
  const btn = document.getElementById('btnPanMode');
  const mainWs = document.getElementById('mainCanvasWorkspace');
  if (btn) {
    btn.className = isPanMode
      ? 'p-2 rounded-xl bg-blue-600 text-white border border-blue-500 text-xs transition flex items-center gap-1 shadow'
      : 'p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition flex items-center gap-1';
  }
  if (mainWs) {
    if (isPanMode) mainWs.classList.add('canvas-pan-mode');
    else mainWs.classList.remove('canvas-pan-mode');
  }
  showToast(isPanMode ? "✋ El ile kaydırma modu aktif" : "İmleç seçim modu aktif");
}

function switchRightInspectorTab(tabName) {
  activeRightTab = tabName;
  const tabs = ['settings', 'actions', 'content'];
  tabs.forEach(t => {
    const btn = document.getElementById(`rightTabBtn_${t}`);
    const panel = document.getElementById(`rightInspector_${t}`);
    if (btn) {
      btn.className = (t === tabName)
        ? 'flex-1 pb-2 text-xs font-bold border-b-2 border-blue-500 text-blue-400 transition text-center'
        : 'flex-1 pb-2 text-xs font-semibold border-b-2 border-transparent text-slate-400 hover:text-white transition text-center';
    }
    if (panel) {
      if (t === tabName) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    }
  });
  renderRightEditorPanel();
}

function renderAll() {
  if (!magazineData || !magazineData.pages) return;
  pushHistoryState();
  const total = magazineData.pages.length;
  const badge = document.getElementById('totalPagesBadge');
  if (badge) {
    if (spreadMode && selectedEditIndex > 0 && selectedEditIndex < total - 1) {
      const leftIdx = selectedEditIndex % 2 === 1 ? selectedEditIndex : selectedEditIndex - 1;
      const rightIdx = Math.min(leftIdx + 1, total - 1);
      badge.textContent = leftIdx === rightIdx ? `${leftIdx + 1}/${total}` : `${leftIdx + 1}-${rightIdx + 1}/${total}`;
    } else {
      badge.textContent = `${selectedEditIndex + 1}/${total}`;
    }
  }
  renderPageListSidebar();
  renderMagazineViewport();
  renderRightEditorPanel();
  updateTopReviewBanner();
  if (!document.getElementById('layersPopover')?.classList.contains('hidden')) {
    renderLayersPopover();
  }
}

function setAppMode(mode) {
  appMode = mode;
  const leftRail = document.getElementById('leftIconRail');
  const leftBar = document.getElementById('leftSidebar');
  const rightBar = document.getElementById('rightSidebar');
  const centerStrip = document.getElementById('centerRightStrip');
  const actionBar = document.getElementById('canvasActionBar');
  const stickyNote = document.getElementById('adminStickyNoteBox');
  const btnEdit = document.getElementById('btnEditMode');
  const btnRead = document.getElementById('btnReadMode');
  const floatBar = document.getElementById('floatingContextToolbar');

  if (mode === 'read') {
    if (leftRail) leftRail.classList.add('hidden');
    if (leftBar) leftBar.classList.add('hidden');
    if (rightBar) rightBar.classList.add('hidden');
    if (centerStrip) centerStrip.classList.add('hidden');
    if (actionBar) actionBar.classList.add('hidden');
    if (stickyNote) stickyNote.classList.add('hidden');
    if (floatBar) floatBar.classList.add('hidden');
    btnRead.className = "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-blue-600 text-white shadow";
    btnEdit.className = "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-slate-300 hover:text-white";
  } else {
    if (leftRail) leftRail.classList.remove('hidden');
    if (leftBar && !isLeftDrawerCollapsed) leftBar.classList.remove('hidden');
    if (rightBar) rightBar.classList.remove('hidden');
    if (centerStrip) centerStrip.classList.remove('hidden');
    if (actionBar) actionBar.classList.remove('hidden');
    btnEdit.className = "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-blue-600 text-white shadow";
    btnRead.className = "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-slate-300 hover:text-white";
    updateTopReviewBanner();
  }
  renderMagazineViewport();
}

function toggleSpreadMode() {
  spreadMode = !spreadMode;
  updateSpreadButtonUI();
  renderAll();
}

function updateSpreadButtonUI() {
  const el = document.getElementById('spreadToggleText');
  if (el) el.textContent = spreadMode ? "Çift Sayfa" : "Tek Sayfa";
}

function getMiniThumbPreviewHTML(page, idx) {
  if (!page) return '';
  const accent = page.accentColor || '#4f46e5';
  const bg = page.bgColor || (page.type === 'cover' && page.layout === 'brutalist' ? accent : '#ffffff');
  const imgUrl = page.coverImage || page.image || page.photo || page.bgImage || page.videoPoster || (page.elements && page.elements.find(e => e.type === 'image')?.url) || '';
  const headline = page.magazineName || page.mainHeadline || page.title || page.headerText || page.interviewee || page.navTitle || `Sayfa ${idx + 1}`;

  return `
    <div class="w-full h-full rounded overflow-hidden relative flex flex-col justify-between p-1.5 text-[7px] select-none border border-slate-300/60 shadow-inner" style="background:${bg}; color:${bg === '#0f172a' ? '#fff' : '#0f172a'};">
      <div class="font-bold truncate leading-tight" style="color:${accent}">${escapeHtml(headline)}</div>
      ${imgUrl ? `<img src="${escapeHtml(imgUrl)}" class="w-full h-12 object-cover rounded-sm my-0.5 pointer-events-none" onerror="this.style.display='none'">` : `<div class="w-full h-10 rounded-sm my-0.5 flex items-center justify-center opacity-20" style="background:${accent}"><i class="ph ph-article text-sm"></i></div>`}
      <div class="flex items-center justify-between text-[6px] opacity-60">
        <span class="truncate">${escapeHtml(getTemplateLabel(page.type))}</span>
        <span class="font-bold">${idx + 1}</span>
      </div>
    </div>
  `;
}

function renderPageListSidebar() {
  const container = document.getElementById('pageListContainer');
  if (!container || !magazineData || !magazineData.pages) return;
  container.innerHTML = '';

  const pages = magazineData.pages;
  const total = pages.length;

  // FlipHTML5 v2 Görsel 1 & 10: Kapak (01) tek, iç sayfalar çift (02-03, 04-05...) veya tek modda kartlar
  let i = 0;
  while (i < total) {
    const isSingleCard = (!spreadMode || i === 0 || i === total - 1);

    if (isSingleCard) {
      const idx = i;
      const page = pages[idx];
      const isSelected = (idx === selectedEditIndex);
      const numStr = String(idx + 1).padStart(2, '0');

      const card = document.createElement('div');
      card.className = `page-thumb-card ${isSelected ? 'active' : ''}`;
      card.onclick = () => selectPageForEdit(idx);

      card.innerHTML = `
        <!-- Hover 4 Hızlı İkon (Görsel 10: Sol üst Şablon Değiştir, Sağ üst Kopyala, Ekle, Sil) -->
        <div class="page-thumb-actions absolute top-2 left-2 right-2 flex items-center justify-between z-20">
          <button onclick="openQuickTemplateForPage(${idx}, event)" class="thumb-action-btn" title="Sayfa Şablonunu Değiştir">
            <i class="ph ph-arrows-Clockwise"></i>
          </button>
          <div class="flex items-center gap-1">
            <button onclick="duplicatePage(${idx}, event)" class="thumb-action-btn" title="Sayfayı Kopyala (Çoğalt)">
              <i class="ph ph-copy"></i>
            </button>
            <button onclick="insertPageAfter(${idx}, event)" class="thumb-action-btn" title="Sonrasına Yeni Sayfa Ekle">
              <i class="ph ph-file-plus"></i>
            </button>
            <button onclick="deletePageAtIndex(${idx}, event)" class="thumb-action-btn danger" title="Sayfayı Sil">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>

        <div class="flex justify-center py-1">
          <div class="w-24 h-32 rounded shadow-md overflow-hidden bg-white">
            ${getMiniThumbPreviewHTML(page, idx)}
          </div>
        </div>

        <div class="flex items-center justify-between mt-1.5 px-1">
          <span class="text-[10.5px] font-medium text-slate-300 truncate max-w-[140px]">${escapeHtml(page.navTitle || 'Sayfa ' + (idx + 1))}</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">${numStr}</span>
        </div>
      `;

      container.appendChild(card);
      i += 1;
    } else {
      // Çift Sayfa (Spread) Kartı: örn. 02 - 03
      const leftIdx = i;
      const rightIdx = i + 1;
      const leftPage = pages[leftIdx];
      const rightPage = pages[rightIdx];
      const isSelected = (selectedEditIndex === leftIdx || selectedEditIndex === rightIdx);
      const leftNum = String(leftIdx + 1).padStart(2, '0');
      const rightNum = String(rightIdx + 1).padStart(2, '0');

      const card = document.createElement('div');
      card.className = `page-thumb-card ${isSelected ? 'active' : ''}`;

      card.innerHTML = `
        <!-- Hover 4 Hızlı İkon (Görsel 10) -->
        <div class="page-thumb-actions absolute top-2 left-2 right-2 flex items-center justify-between z-20">
          <button onclick="openQuickTemplateForPage(${selectedEditIndex === rightIdx ? rightIdx : leftIdx}, event)" class="thumb-action-btn" title="Şablon Değiştir">
            <i class="ph ph-arrows-clockwise"></i>
          </button>
          <div class="flex items-center gap-1">
            <button onclick="duplicatePage(${selectedEditIndex === rightIdx ? rightIdx : leftIdx}, event)" class="thumb-action-btn" title="Seçili Sayfayı Kopyala">
              <i class="ph ph-copy"></i>
            </button>
            <button onclick="insertPageAfter(${rightIdx}, event)" class="thumb-action-btn" title="Sonrasına Sayfa Ekle">
              <i class="ph ph-file-plus"></i>
            </button>
            <button onclick="deletePageAtIndex(${selectedEditIndex === rightIdx ? rightIdx : leftIdx}, event)" class="thumb-action-btn danger" title="Sayfayı Sil">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-1 py-1 px-1">
          <div onclick="event.stopPropagation(); selectPageForEdit(${leftIdx});" class="h-28 rounded-l shadow overflow-hidden bg-white ${selectedEditIndex === leftIdx ? 'ring-2 ring-blue-500' : ' opacity-90 hover:opacity-100'}">
            ${getMiniThumbPreviewHTML(leftPage, leftIdx)}
          </div>
          <div onclick="event.stopPropagation(); selectPageForEdit(${rightIdx});" class="h-28 rounded-r shadow overflow-hidden bg-white ${selectedEditIndex === rightIdx ? 'ring-2 ring-blue-500' : 'opacity-90 hover:opacity-100'}">
            ${getMiniThumbPreviewHTML(rightPage, rightIdx)}
          </div>
        </div>

        <div class="flex items-center justify-between mt-1.5 px-1">
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">${leftNum}</span>
          <span class="text-[10px] text-slate-400 truncate px-1">${escapeHtml(leftPage.navTitle || '')} • ${escapeHtml(rightPage.navTitle || '')}</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">${rightNum}</span>
        </div>
      `;

      card.onclick = () => selectPageForEdit(leftIdx);
      container.appendChild(card);
      i += 2;
    }
  }
}

function openQuickTemplateForPage(idx, ev) {
  if (ev) ev.stopPropagation();
  selectPageForEdit(idx);
  openAllTemplatesModal();
}

function duplicatePage(idx, ev) {
  if (ev) ev.stopPropagation();
  if (!magazineData || !magazineData.pages[idx]) return;
  const orig = magazineData.pages[idx];
  const copy = JSON.parse(JSON.stringify(orig));
  copy.id = 'p' + Date.now();
  copy.navTitle = (orig.navTitle || 'Sayfa') + ' (Kopya)';
  if (copy.elements) {
    copy.elements = copy.elements.map((el, i) => ({ ...el, id: 'el-' + Date.now() + '-' + i }));
  }
  magazineData.pages.splice(idx + 1, 0, copy);
  selectPageForEdit(idx + 1);
  saveAllChangesToServer();
  showToast("📋 Sayfa kopyalandı!");
}

function insertPageAfter(idx, ev) {
  if (ev) ev.stopPropagation();
  const newPage = {
    id: 'p' + Date.now(),
    type: 'article',
    layout: 'minimalist',
    navTitle: `Yeni Sayfa ${idx + 2}`,
    accentColor: currentMagazine?.themeColor || '#2563eb',
    assignedEditor: currentUser.code,
    status: 'draft',
    category: 'ÖZEL DOSYA',
    title: 'Yeni Sayfa Başlığı',
    author: currentUser.name || 'Editör Ekibi',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Fotoğraf açıklaması',
    content: 'Sayfa metninizi doğrudan üzerine tıklayarak düzenleyebilir veya sol menüden Öğeler ekleyebilirsiniz.',
    pullQuote: 'Öne çıkan vurgu cümlesi buraya yazılır.',
    elements: []
  };
  magazineData.pages.splice(idx + 1, 0, newPage);
  selectPageForEdit(idx + 1);
  saveAllChangesToServer();
  showToast("➕ Yeni sayfa araya eklendi!");
}

function addSpreadPages() {
  const insertPos = magazineData.pages.length > 1 ? magazineData.pages.length - 1 : magazineData.pages.length;
  const accent = currentMagazine?.themeColor || '#2563eb';
  const leftPage = {
    id: 'p' + Date.now() + 'L',
    type: 'article',
    layout: 'minimalist',
    navTitle: 'Sol Sayfa • Dosya',
    accentColor: accent,
    assignedEditor: currentUser.code,
    status: 'draft',
    category: 'BÖLÜM 01',
    title: 'Çift Sayfa Sol Başlık',
    author: 'Yayın Ekibi',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Etkinlik karesi',
    content: 'Sol sayfa içeriğini buraya yazabilirsiniz. Sol menüdeki Öğeler sekmesinden tablo, buton veya şekil ekleyebilirsiniz.',
    pullQuote: 'Her yeni sayfa yeni bir keşiftir.',
    elements: []
  };
  const rightPage = {
    id: 'p' + Date.now() + 'R',
    type: 'interview',
    layout: 'minimalist',
    navTitle: 'Sağ Sayfa • Söyleşi',
    accentColor: accent,
    assignedEditor: currentUser.code,
    status: 'draft',
    rubric: 'ÖZEL KÖŞE',
    interviewee: 'Konuk & Detaylar',
    role: 'Okul Dergisi Özel Dosyası',
    intro: 'Sağ sayfa röportaj veya katalog alanı.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    q1: 'Birinci alt başlık veya soru?',
    a1: 'Cevap ve detay metni buraya girilir.',
    q2: 'İkinci alt başlık veya soru?',
    a2: 'İkinci açıklama metni buraya girilir.',
    q3: 'Üçüncü alt başlık veya soru?',
    a3: 'Üçüncü açıklama metni buraya girilir.',
    elements: []
  };
  magazineData.pages.splice(insertPos, 0, leftPage, rightPage);
  selectPageForEdit(insertPos);
  saveAllChangesToServer();
  showToast("➕ Yeni İki Sayfa (Çift Sayfa Spread) eklendi!");
}

function deletePageAtIndex(idx, ev) {
  if (ev) ev.stopPropagation();
  if (magazineData.pages.length <= 1) {
    showToast("Dergide en az 1 sayfa bulunmalıdır!");
    return;
  }
  magazineData.pages.splice(idx, 1);
  if (selectedEditIndex >= magazineData.pages.length) {
    selectedEditIndex = magazineData.pages.length - 1;
  }
  selectPageForEdit(selectedEditIndex);
  saveAllChangesToServer();
  showToast("🗑️ Sayfa silindi");
}

function goToLastPage() {
  if (!magazineData || !magazineData.pages.length) return;
  selectPageForEdit(magazineData.pages.length - 1);
}

function selectPageForEdit(index) {
  flushActiveFabricCanvases();
  selectedEditIndex = index;
  selectedElementId = null;
  hideFloatingRichTextBar();

  if (!spreadMode) {
    currentIndex = index;
  } else {
    currentIndex = index === 0 ? 0 : (index % 2 === 1 ? index : index - 1);
  }
  renderAll();
}

function canUserEditPage(page) {
  if (!page) return false;
  if (currentUser.role === 'admin') return true;
  if (page.assignedEditor === currentUser.code) return true;
  if (currentUser.assignedPages && currentUser.assignedPages.includes(page.id)) return true;
  return false;
}

function updateTopReviewBanner() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;

  const reviewBadge = document.getElementById('pageReviewBadge');
  const ownershipText = document.getElementById('pageOwnershipText');
  const stickyBox = document.getElementById('adminStickyNoteBox');
  const stickyText = document.getElementById('adminStickyNoteText');

  const statusMap = {
    approved: { text: "Onaylandı", class: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    review: { text: "İncelemede", class: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
    revision: { text: "Revize İsteniyor", class: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
    draft: { text: "Taslakta", class: "bg-amber-500/20 text-amber-300 border-amber-500/30" }
  };

  const st = statusMap[page.status || 'draft'] || statusMap.draft;
  reviewBadge.textContent = st.text;
  reviewBadge.className = `px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${st.class}`;

  let editorName = "Yayın Kurulu";
  const matchedKey = editorKeys.find(k => k.code === page.assignedEditor);
  if (matchedKey) editorName = matchedKey.name;
  else if (page.assignedEditor === 'ADMIN-2026' || page.assignedEditor === 'ADMIN-SEDAT') editorName = 'Sedat İleri (Admin)';
  else if (page.assignedEditor === 'ADMIN-NAZMIYE') editorName = 'Nazmiye Hoca (Admin)';
  ownershipText.innerHTML = `Sorumlu: <strong>${escapeHtml(editorName)}</strong>`;

  // Can sıkıcı sarı "Yayın Kurulu Düzeltme Notu" kutusunu tuval üstünde asla gösterme!
  if (stickyBox) stickyBox.classList.add('hidden');
}

function dismissAdminNote() {
  const stickyBox = document.getElementById('adminStickyNoteBox');
  if (stickyBox) stickyBox.classList.add('hidden');
}

// ==========================================
// 4. TUVAL (CANVAS) RENDER & SERBEST ELEMANLAR
// ==========================================
function flushActiveFabricCanvases() {
  if (window.fabricCanvases && window.magazineData && Array.isArray(window.magazineData.pages)) {
    Object.keys(window.fabricCanvases).forEach(pIdx => {
      const pNum = Number(pIdx);
      const fCanvas = window.fabricCanvases[pNum];
      const page = window.magazineData.pages[pNum];
      if (fCanvas && page && typeof saveFabricPageState === 'function') {
        saveFabricPageState(pNum, true);
      }
    });
  }
}

function renderMagazineViewport() {
  flushActiveFabricCanvases();
  const viewport = document.getElementById('magazineViewport');
  viewport.innerHTML = '';

  const total = magazineData.pages.length;
  if (currentIndex >= total) currentIndex = total - 1;
  if (currentIndex < 0) currentIndex = 0;

  const heightClass = (appMode === 'read' || isZenMode)
    ? 'h-[76vh] md:h-[84vh]'
    : 'h-[66vh] sm:h-[72vh] md:h-[77vh]';

  if (!spreadMode || currentIndex === 0 || currentIndex === total - 1) {
    const pageData = magazineData.pages[currentIndex];
    const pageEl = createPageDOM(pageData, currentIndex, 'single', heightClass);
    viewport.appendChild(pageEl);
    document.getElementById('pageIndicatorText').textContent = `Sayfa ${currentIndex + 1} / ${total}`;
  } else {
    const leftIndex = currentIndex % 2 === 1 ? currentIndex : currentIndex - 1;
    const rightIndex = leftIndex + 1;

    const leftPageData = magazineData.pages[leftIndex];
    const leftEl = createPageDOM(leftPageData, leftIndex, 'left', heightClass);
    viewport.appendChild(leftEl);

    if (rightIndex < total) {
      const rightPageData = magazineData.pages[rightIndex];
      const rightEl = createPageDOM(rightPageData, rightIndex, 'right', heightClass);
      viewport.appendChild(rightEl);
      document.getElementById('pageIndicatorText').textContent = `Sayfa ${leftIndex + 1}-${rightIndex + 1} / ${total}`;
    } else {
      document.getElementById('pageIndicatorText').textContent = `Sayfa ${leftIndex + 1} / ${total}`;
    }
  }

  document.getElementById('btnPrev').disabled = currentIndex === 0;
  const isAtEnd = (!spreadMode && currentIndex >= total - 1) || (spreadMode && currentIndex >= total - 1);
  document.getElementById('btnNext').disabled = isAtEnd;
}

function createPageDOM(page, pageIndex, position, heightClass) {
  const wrapper = document.createElement('div');
  const posClass = position === 'left' ? 'page-left' : (position === 'right' ? 'page-right' : 'page-single');
  const isSelected = (appMode === 'edit' && pageIndex === selectedEditIndex);
  const ring = isSelected ? 'ring-4 ring-indigo-500 z-10' : 'hover:ring-2 hover:ring-indigo-400/50';

  wrapper.className = `magazine-page ${posClass} ${heightClass} bg-white text-slate-900 flex flex-col justify-between animate-curl relative ${appMode === 'edit' ? ring + ' cursor-pointer' : ''}`;
  wrapper.dataset.pageIndex = pageIndex;

  wrapper.onclick = (e) => {
    if (justTransformedInline) return;
    if (appMode === 'edit' && !e.target.closest('.canvas-element') && !e.target.closest('#inlineTransformGizmo') && !e.target.closest('.quiz-option-btn') && !e.target.closest('.inline-editable-text') && !e.target.closest('.template-image-container')) {
      if (selectedEditIndex !== pageIndex) {
        selectPageForEdit(pageIndex);
      } else {
        // Eleman ve şablon içi seçimi kaldır
        selectedElementId = null;
        activeInlineElement = null;
        activeInlineFieldKey = null;
        activeInlineType = null;
        document.querySelectorAll('.inline-selected').forEach(n => n.classList.remove('inline-selected'));
        hideFloatingRichTextBar();
        renderAllElementsForCurrentPage();
        renderRightEditorPanel();
      }
    }
  };

  let spineHtml = '';
  if (position === 'left') spineHtml = '<div class="spine-shadow-left"></div>';
  if (position === 'right') spineHtml = '<div class="spine-shadow-right"></div>';

  // 3D Köşe Bükülme (Page-Curl)
  const curlCornerHtml = '<div class="page-curl-corner"></div>';

  // Grid / Izgara Kılavuzu (Editör modunda açıkken görünür)
  const gridHtml = (showGridGuide && appMode === 'edit') ? '<div class="page-grid-overlay"></div>' : '';

  const bodyHtml = renderTemplateHTML(page, pageIndex);

  const isCoverSurface = page.type === 'cover' || page.type === 'k1' || page.type === 'k4';
  const footerHtml = isCoverSurface ? '' : `
    <div class="px-6 py-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-medium text-slate-400 bg-white/95 shrink-0 z-10">
      <span class="truncate max-w-[180px]">${escapeHtml(magazineData.schoolName)}</span>
      <span class="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">${pageIndex + 1}</span>
      <span>${escapeHtml(magazineData.issueMonth || magazineData.issueInfo || '')}</span>
    </div>
  `;

  // Serbest Elemanlar Konteyneri
  wrapper.innerHTML = `
    ${spineHtml}
    ${curlCornerHtml}
    ${gridHtml}
    <div class="flex-1 ${appMode === 'edit' ? 'overflow-visible' : 'overflow-hidden'} flex flex-col relative page-content-root">
      ${bodyHtml}
      <div class="canvas-elements-layer absolute inset-0 pointer-events-none" id="elemLayer_${pageIndex}"></div>
    </div>
    ${footerHtml}
  `;

  // Elemanları ve kayıtlı şablon içi boyut/konumları DOM'a bağla
  renderElementsInPageDOM(page, pageIndex, wrapper);
  setTimeout(() => renderElementsInPageDOM(page, pageIndex, wrapper), 0);

  return wrapper;
}

function getClipPathForMask(maskType) {
  const masks = {
    none: 'none',
    circle: 'circle(50% at 50% 50%)',
    ellipse: 'ellipse(48% 38% at 50% 50%)',
    triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
  };
  return masks[maskType] || 'none';
}

function renderElementsInPageDOM(page, pageIndex, pageWrapper) {
  const layer = pageWrapper.querySelector(`#elemLayer_${pageIndex}`);
  if (!layer) return;
  layer.innerHTML = '';

  // Şablon içi görsel ve metinlerin kaydedilmiş boyut, pozisyon ve açılarını uygula
  if (page && page.fieldStyles) {
    Object.keys(page.fieldStyles).forEach(fKey => {
      const fNode = pageWrapper.querySelector(`[data-field-key="${fKey}"]`);
      if (fNode) {
        applyInlineTransformToDOM(fNode, page.fieldStyles[fKey]);
      }
    });
  }

  const isEditable = (appMode === 'edit' && canUserEditPage(page) && pageIndex === selectedEditIndex);

  (page.elements || []).forEach(el => {
    if (el.hidden && appMode === 'read') return;
    const isSelected = (el.id === selectedElementId && isEditable);
    const elDom = document.createElement('div');
    elDom.className = `canvas-element ${isSelected ? 'element-selected' : ''} pointer-events-auto`;
    elDom.id = `elDom_${el.id}`;
    elDom.dataset.elementId = el.id;

    elDom.style.left = `${el.x}%`;
    elDom.style.top = `${el.y}%`;
    elDom.style.width = `${el.width}%`;
    elDom.style.height = `${el.height}%`;
    elDom.style.transform = `rotate(${el.rotate || 0}deg)`;
    elDom.style.zIndex = el.zIndex || 10;
    elDom.style.opacity = (el.opacity !== undefined ? el.opacity : 100) / 100;

    if (el.hasShadow) {
      elDom.style.filter = 'drop-shadow(0 12px 20px rgba(15, 23, 42, 0.32))';
    }

    const radiusPx = el.borderRadius !== undefined ? `${el.borderRadius}px` : '12px';

    // 1. RESİM ELEMANI (Görsel 5 & 6: Yarıçap, Katman Maskesi, Saydamlık, Gölge, Değiştir)
    if (el.type === 'image') {
      elDom.className += ' canvas-media-element group relative';
      const clipStyle = el.mask && el.mask !== 'none' ? `clip-path:${getClipPathForMask(el.mask)};` : '';
      const fitMode = el.objectFit || 'cover';
      elDom.innerHTML = `
        <img src="${escapeHtml(el.url)}" class="w-full h-full pointer-events-none" style="object-fit:${fitMode}; border-radius:${radiusPx}; ${clipStyle}" alt="">
        ${isEditable ? `
          <label class="img-change-badge" onclick="event.stopPropagation()" title="Görseli Değiştir">
            <i class="ph ph-camera text-sm"></i>
            <span>Değiştir</span>
            <input type="file" accept="image/*" onchange="uploadCanvasElementImage(event, '${el.id}')" class="hidden">
          </label>
        ` : ''}
      `;
    }

    // 2. VİDEO ELEMANI (MP4)
    if (el.type === 'video') {
      elDom.className += ' canvas-media-element';
      elDom.innerHTML = `
        <div class="magazine-video-container" style="border-radius:${radiusPx};">
          <video controls preload="metadata" poster="${escapeHtml(el.poster || '')}">
            <source src="${escapeHtml(el.url)}" type="video/mp4">
          </video>
        </div>
      `;
    }

    // 3. METİN KUTUSU / RENKLİ ÇERÇEVE / SORU KUTUSU (Boyutlandırma, Taşıma ve Döndürme Kulakçıkları Görünür)
    if (el.type === 'text' || el.type === 'card' || el.type === 'qbox') {
      elDom.className += ' canvas-text-element border leading-relaxed';
      elDom.style.borderRadius = radiusPx;
      elDom.style.overflow = 'visible';

      if (el.bgColor && el.bgColor.startsWith('linear-gradient')) {
        elDom.style.background = el.bgColor;
        elDom.style.borderColor = el.borderColor || 'rgba(255,255,255,0.28)';
      } else {
        elDom.style.background = 'none';
        elDom.style.backgroundColor = el.bgColor || 'transparent';
        elDom.style.borderColor = el.hasStroke ? (el.strokeColor || '#0f172a') : (el.borderColor || 'transparent');
      }
      if (el.hasStroke) {
        elDom.style.borderWidth = `${el.strokeWidth || 2}px`;
      }
      elDom.style.fontSize = `${el.fontSize || 14}px`;
      elDom.style.fontFamily = el.fontFamily || 'Inter';
      elDom.style.color = el.color || '#0f172a';
      elDom.style.textAlign = el.textAlign || 'left';
      elDom.style.letterSpacing = el.letterSpacing ? `${el.letterSpacing}px` : 'normal';
      elDom.style.lineHeight = el.lineHeight || '1.35';

      const innerDiv = document.createElement('div');
      innerDiv.className = 'canvas-text-inner w-full h-full p-3 outline-none';
      innerDiv.style.borderRadius = radiusPx;
      innerDiv.style.overflowY = el.scrollable ? 'auto' : 'hidden';
      innerDiv.style.overflowX = 'hidden';
      if (el.columns && Number(el.columns) > 1) {
        innerDiv.style.columnCount = String(el.columns);
        innerDiv.style.columnGap = '14px';
      } else {
        innerDiv.style.columnCount = '1';
      }
      innerDiv.innerHTML = el.content || 'Yazınızı buraya yazın...';

      if (isEditable) {
        innerDiv.contentEditable = "true";
        innerDiv.onfocus = () => {
          activeInlineElement = null;
          activeInlineFieldKey = null;
          activeInlineType = null;
          selectCanvasElement(el.id, false);
          showFloatingRichTextBar(elDom, el);
          renderRightEditorPanel();
        };
        innerDiv.oninput = () => {
          el.content = innerDiv.innerHTML;
          debouncedSave();
        };
        innerDiv.onblur = () => {
          el.content = innerDiv.innerHTML;
          saveAllChangesToServer();
        };
      }
      elDom.appendChild(innerDiv);
    }

    // 4. TABLO WIDGET'I (Görsel 1 & 7: Product Information / Sewing Techniques Tablosu)
    if (el.type === 'table') {
      elDom.className += ' canvas-media-element bg-white/95 rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col';
      const headerBg = el.headerBg || page.accentColor || '#7f1d1d';
      const rows = el.rows || [
        ['ITEM', 'SPECIFICATION'],
        ['Product Name', 'Silk Satin Midi Dress'],
        ['Category', 'Women\'s Dress'],
        ['Season', 'Spring / Summer'],
        ['Silhouette', 'Bias-cut Silhouette']
      ];
      elDom.innerHTML = `
        <table class="w-full h-full border-collapse text-[10px]">
          <thead>
            <tr style="background:${headerBg}; color:#ffffff;">
              <th contenteditable="${isEditable}" onblur="updateTableCell('${el.id}', 0, 0, this.innerText)" class="py-1.5 px-2.5 text-left font-bold uppercase tracking-wider">${escapeHtml(rows[0]?.[0] || 'BAŞLIK 1')}</th>
              <th contenteditable="${isEditable}" onblur="updateTableCell('${el.id}', 0, 1, this.innerText)" class="py-1.5 px-2.5 text-left font-bold uppercase tracking-wider">${escapeHtml(rows[0]?.[1] || 'BAŞLIK 2')}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.slice(1).map((r, rIdx) => `
              <tr class="border-b border-slate-200/80 ${rIdx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}">
                <td contenteditable="${isEditable}" onblur="updateTableCell('${el.id}', ${rIdx + 1}, 0, this.innerText)" class="py-1.5 px-2.5 font-semibold text-slate-800">${escapeHtml(r[0] || '')}</td>
                <td contenteditable="${isEditable}" onblur="updateTableCell('${el.id}', ${rIdx + 1}, 1, this.innerText)" class="py-1.5 px-2.5 text-slate-600">${escapeHtml(r[1] || '')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // 5. ŞEKİLLER (Kare, Daire, Üçgen, Çizgi - Görsel 9)
    if (el.type === 'shape') {
      elDom.className += ' canvas-media-element';
      const fill = el.bgColor || '#881337';
      const stType = el.shapeType || 'rect';
      if (stType === 'circle') {
        elDom.innerHTML = `<div class="w-full h-full rounded-full shadow" style="background:${fill}; border:${el.hasStroke ? (el.strokeWidth || 2) + 'px solid ' + (el.strokeColor || '#0f172a') : 'none'};"></div>`;
      } else if (stType === 'triangle') {
        elDom.innerHTML = `<div class="w-full h-full" style="background:${fill}; clip-path:polygon(50% 0%, 0% 100%, 100% 100%);"></div>`;
      } else if (stType === 'line') {
        elDom.innerHTML = `<div class="w-full h-full flex items-center"><div class="w-full" style="height:${Math.max(2, el.strokeWidth || 3)}px; background:${fill}; border-radius:99px;"></div></div>`;
      } else {
        elDom.innerHTML = `<div class="w-full h-full shadow" style="background:${fill}; border-radius:${radiusPx}; border:${el.hasStroke ? (el.strokeWidth || 2) + 'px solid ' + (el.strokeColor || '#0f172a') : 'none'};"></div>`;
      }
    }

    // 6. DÜĞMELER / BUTONLAR (Görsel 7 & 9: VIEW MORE, Ayarlar, Kaydol)
    if (el.type === 'button') {
      elDom.className += ' canvas-media-element';
      const bg = el.bgColor || '#7f1d1d';
      const col = el.color || '#ffffff';
      elDom.innerHTML = `
        <div class="w-full h-full flex items-center justify-center font-bold tracking-wider uppercase shadow-md transition hover:brightness-110 px-3 text-center" style="background:${bg}; color:${col}; border-radius:${el.borderRadius !== undefined ? el.borderRadius + 'px' : '999px'}; font-size:${el.fontSize || 11}px;">
          <span contenteditable="${isEditable}" onblur="updateElementPropById('${el.id}', 'label', this.innerText)" class="outline-none">${escapeHtml(el.label || 'İNCELE / TIKLA')}</span>
        </div>
      `;
    }

    // 7. SICAK NOKTALAR (HOTSPOTS - Görsel 1 & 9)
    if (el.type === 'hotspot') {
      elDom.className += ' canvas-media-element flex items-center justify-center';
      const bg = el.bgColor || '#e11d48';
      elDom.innerHTML = `
        <div class="w-7 h-7 rounded-full border-2 border-white hotspot-pulse flex items-center justify-center text-white font-bold text-xs shadow-lg cursor-pointer" style="background:${bg};" title="${escapeAttr(el.popupTitle || 'Detay için tıklayın')}">
          <i class="ph ph-plus-bold text-xs"></i>
        </div>
      `;
    }

    // 8. SES OYNATICI (Görsel 8)
    if (el.type === 'audio') {
      elDom.className += ' canvas-media-element bg-slate-900 text-white p-2.5 rounded-2xl shadow-lg border border-slate-700 flex flex-col justify-center gap-1';
      elDom.innerHTML = `
        <div class="flex items-center gap-2 text-[11px] font-bold text-emerald-400">
          <i class="ph ph-music-notes-simple text-base"></i>
          <span class="truncate">${escapeHtml(el.title || 'Ses Kaydı / Podcast')}</span>
        </div>
        <audio controls class="w-full h-7" src="${escapeHtml(el.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')}"></audio>
      `;
    }

    // 9. SLAYT GÖSTERİSİ (KARUSEL - Görsel 8)
    if (el.type === 'slideshow') {
      elDom.className += ' canvas-media-element rounded-2xl overflow-hidden shadow-lg relative group bg-slate-900';
      const slides = el.slides || [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
      ];
      const activeSlide = Number(el.activeSlide || 0) % slides.length;
      elDom.innerHTML = `
        <img src="${escapeHtml(slides[activeSlide])}" class="w-full h-full object-cover pointer-events-none" alt="">
        <button onclick="event.stopPropagation(); stepElementSlideshow('${el.id}', -1)" class="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black"><i class="ph ph-caret-left"></i></button>
        <button onclick="event.stopPropagation(); stepElementSlideshow('${el.id}', 1)" class="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black"><i class="ph ph-caret-right"></i></button>
        <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-black/60 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">${activeSlide + 1} / ${slides.length}</div>
      `;
    }

    // 10. HARİTA WIDGET'I (Görsel 9)
    if (el.type === 'map') {
      elDom.className += ' canvas-media-element rounded-2xl overflow-hidden shadow-md border border-slate-300 bg-slate-100 relative flex flex-col justify-between p-3';
      elDom.style.backgroundImage = "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80')";
      elDom.style.backgroundSize = "cover";
      elDom.innerHTML = `
        <div class="bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-xl shadow flex items-center gap-1.5 text-xs font-bold text-slate-800 w-fit">
          <i class="ph ph-map-pin-fill text-rose-600 text-base"></i>
          <span contenteditable="${isEditable}" onblur="updateElementPropById('${el.id}', 'locationTitle', this.innerText)">${escapeHtml(el.locationTitle || (magazineData.schoolName || 'Okul Kampüsü'))}</span>
        </div>
        <div class="bg-slate-900/85 text-white text-[10px] px-2.5 py-1 rounded-lg self-end font-semibold">Konum Haritası</div>
      `;
    }

    // Eylem (Action) Rozeti (Eğer öğeye tıklama eylemi atanmışsa sağ üstte küçük yıldırım/link rozeti göster)
    if (el.actionType && el.actionType !== 'none') {
      const badge = document.createElement('div');
      badge.className = 'absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shadow z-30 pointer-events-none';
      badge.innerHTML = '<i class="ph ph-lightning-fill"></i>';
      elDom.appendChild(badge);
    }

    // Okuyucu / Önizleme Modunda Tıklama Eylemini Çalıştır
    if (appMode === 'read' && (el.actionType || el.type === 'hotspot' || el.type === 'button')) {
      elDom.style.cursor = 'pointer';
      elDom.onclick = (ev) => {
        ev.stopPropagation();
        triggerElementAction(el);
      };
    }

    // Seçim ve Taşıma Olayları (Düzenleme Modunda)
    if (isEditable) {
      elDom.onmousedown = (ev) => {
        if (ev.target.closest('.resize-handle') || ev.target.closest('.rotate-handle') || ev.target.closest('.move-handle') || ev.target.closest('.img-change-badge') || ev.target.tagName === 'AUDIO' || ev.target.tagName === 'VIDEO') return;
        ev.stopPropagation();

        activeInlineElement = null;
        activeInlineFieldKey = null;
        activeInlineType = null;

        if (el.type === 'text' || el.type === 'card' || el.type === 'qbox' || el.type === 'table') {
          selectCanvasElement(el.id, false);
          showFloatingRichTextBar(elDom, el);
          renderRightEditorPanel();
          const rect = elDom.getBoundingClientRect();
          const borderThreshold = 14;
          const isNearEdge = (
            ev.clientX - rect.left < borderThreshold ||
            rect.right - ev.clientX < borderThreshold ||
            ev.clientY - rect.top < borderThreshold ||
            rect.bottom - ev.clientY < borderThreshold
          );
          if (isNearEdge) {
            ev.preventDefault();
            startDraggingElement(ev, el, pageWrapper);
            return;
          }
          // Metin kutusunun ortasından da fare > 5px sürüklenirse kutuyu taşı, sabit tıklanırsa yazı yaz
          const startX = ev.clientX;
          const startY = ev.clientY;
          let dragStarted = false;
          function onThresholdMove(moveEv) {
            if (!dragStarted && Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY) > 5) {
              dragStarted = true;
              window.removeEventListener('mousemove', onThresholdMove);
              window.removeEventListener('mouseup', onThresholdUp);
              if (window.getSelection) window.getSelection().removeAllRanges();
              if (document.activeElement && elDom.contains(document.activeElement)) {
                document.activeElement.blur();
              }
              startDraggingElement(ev, el, pageWrapper);
            }
          }
          function onThresholdUp() {
            window.removeEventListener('mousemove', onThresholdMove);
            window.removeEventListener('mouseup', onThresholdUp);
          }
          window.addEventListener('mousemove', onThresholdMove);
          window.addEventListener('mouseup', onThresholdUp);
          return;
        }

        ev.preventDefault();
        selectCanvasElement(el.id);
        renderRightEditorPanel();
        startDraggingElement(ev, el, pageWrapper);
      };

      // Seçiliyse 8 Boyutlandırma Kulakçığı, Taşıma Kulakçığı ve Döndürme İkonu Ekle
      if (isSelected) {
        elDom.appendChild(createMoveHandleDOM(el, pageWrapper));
        elDom.appendChild(createHandleDOM('handle-nw', 'nw'));
        elDom.appendChild(createHandleDOM('handle-ne', 'ne'));
        elDom.appendChild(createHandleDOM('handle-se', 'se'));
        elDom.appendChild(createHandleDOM('handle-sw', 'sw'));
        elDom.appendChild(createHandleDOM('handle-n', 'n'));
        elDom.appendChild(createHandleDOM('handle-s', 's'));
        elDom.appendChild(createHandleDOM('handle-e', 'e'));
        elDom.appendChild(createHandleDOM('handle-w', 'w'));
        elDom.appendChild(createRotateHandleDOM(el, pageWrapper));
        showFloatingRichTextBar(elDom, el);
      }
    }

    layer.appendChild(elDom);
  });

  // Şablon içi bir görsel veya metin kutusu seçiliyse onun etrafına da 8 Boyutlandırma + Taşıma + Döndürme Gizmosu çiz
  if (isEditable && activeInlineFieldKey) {
    renderInlineTransformGizmo(page, pageIndex, pageWrapper);
  }
}

function createMoveHandleDOM(el, pageWrapper) {
  const mh = document.createElement('div');
  mh.className = 'move-handle';
  mh.innerHTML = '<i class="ph ph-arrows-out-cardinal"></i><span>Taşı</span>';
  mh.title = 'Konumunu değiştirmek için sürükleyin';
  mh.onmousedown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    startDraggingElement(e, el, pageWrapper);
  };
  return mh;
}

function createHandleDOM(className, handleType) {
  const h = document.createElement('div');
  h.className = `resize-handle ${className}`;
  h.dataset.handle = handleType;
  h.onmousedown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    startResizingElement(e, handleType);
  };
  return h;
}

function createRotateHandleDOM(el, pageWrapper) {
  const rh = document.createElement('div');
  rh.className = 'rotate-handle';
  rh.innerHTML = '<i class="ph ph-arrows-clockwise"></i>';
  rh.title = 'Açısını döndürmek için sürükleyin';
  rh.onmousedown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    startRotatingElement(e, el, pageWrapper);
  };
  return rh;
}

// ==========================================
// 5. SERBEST ELEMAN SÜRÜKLEME, BOYUTLANDIRMA, DÖNDÜRME
// ==========================================
function selectCanvasElement(id, reRender = true) {
  selectedElementId = id;
  if (id) {
    activeInlineElement = null;
    activeInlineFieldKey = null;
    activeInlineType = null;
    document.querySelectorAll('.inline-selected').forEach(n => n.classList.remove('inline-selected'));
    const oldGizmo = document.getElementById('inlineTransformGizmo');
    if (oldGizmo) oldGizmo.remove();
  }
  if (reRender) {
    renderAllElementsForCurrentPage();
  } else {
    const pageDom = document.querySelector(`.magazine-page[data-page-index="${selectedEditIndex}"]`);
    if (!pageDom) return;
    const elements = pageDom.querySelectorAll('.canvas-element');
    elements.forEach(elNode => {
      if (elNode.dataset.elementId === id) {
        elNode.classList.add('element-selected');
        if (!elNode.querySelector('.resize-handle')) {
          const elData = (magazineData.pages[selectedEditIndex].elements || []).find(e => e.id === id);
          if (elData) elNode.appendChild(createMoveHandleDOM(elData, pageDom));
          elNode.appendChild(createHandleDOM('handle-nw', 'nw'));
          elNode.appendChild(createHandleDOM('handle-ne', 'ne'));
          elNode.appendChild(createHandleDOM('handle-se', 'se'));
          elNode.appendChild(createHandleDOM('handle-sw', 'sw'));
          elNode.appendChild(createHandleDOM('handle-n', 'n'));
          elNode.appendChild(createHandleDOM('handle-s', 's'));
          elNode.appendChild(createHandleDOM('handle-e', 'e'));
          elNode.appendChild(createHandleDOM('handle-w', 'w'));
          if (elData) elNode.appendChild(createRotateHandleDOM(elData, pageDom));
        }
      } else {
        elNode.classList.remove('element-selected');
        elNode.querySelectorAll('.resize-handle, .rotate-handle, .move-handle').forEach(h => h.remove());
      }
    });
  }
}

function renderAllElementsForCurrentPage() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;
  const pageDom = document.querySelector(`.magazine-page[data-page-index="${selectedEditIndex}"]`);
  if (pageDom) renderElementsInPageDOM(page, selectedEditIndex, pageDom);
}

function startDraggingElement(e, el, pageWrapper) {
  isDraggingElement = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialElemX = el.x;
  initialElemY = el.y;

  const pageRect = pageWrapper.getBoundingClientRect();

  function onMouseMove(ev) {
    if (!isDraggingElement) return;
    const dx = ev.clientX - dragStartX;
    const dy = ev.clientY - dragStartY;

    let newX = initialElemX + (dx / pageRect.width) * 100;
    let newY = initialElemY + (dy / pageRect.height) * 100;

    // Grid Snapping (Izgara açıkken 2.5% adımlarla hizala)
    if (showGridGuide) {
      newX = Math.round(newX / 2.5) * 2.5;
      newY = Math.round(newY / 2.5) * 2.5;
    }

    el.x = Math.max(-40, Math.min(100, Math.round(newX * 10) / 10));
    el.y = Math.max(-40, Math.min(100, Math.round(newY * 10) / 10));

    const elDom = document.getElementById(`elDom_${el.id}`);
    if (elDom) {
      elDom.style.left = `${el.x}%`;
      elDom.style.top = `${el.y}%`;
    }
  }

  function onMouseUp() {
    isDraggingElement = false;
    justTransformedInline = true;
    setTimeout(() => { justTransformedInline = false; }, 140);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    renderRightEditorPanel();
    saveAllChangesToServer();
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

function startResizingElement(e, handle) {
  isResizingElement = true;
  activeResizeHandle = handle;
  dragStartX = e.clientX;
  dragStartY = e.clientY;

  const page = magazineData.pages[selectedEditIndex];
  const el = (page.elements || []).find(x => x.id === selectedElementId);
  if (!el) return;

  initialElemX = el.x;
  initialElemY = el.y;
  initialElemW = el.width;
  initialElemH = el.height;
  const initFontSize = Number(el.fontSize) || 14;
  const isCorner = ['nw', 'ne', 'se', 'sw'].includes(handle);

  const pageDom = document.querySelector(`.magazine-page[data-page-index="${selectedEditIndex}"]`);
  const pageRect = pageDom.getBoundingClientRect();

  function onMouseMove(ev) {
    if (!isResizingElement) return;
    const dx = (ev.clientX - dragStartX) / pageRect.width * 100;
    const dy = (ev.clientY - dragStartY) / pageRect.height * 100;

    if (handle.includes('e')) el.width = Math.max(5, initialElemW + dx);
    if (handle.includes('s')) el.height = Math.max(4, initialElemH + dy);
    if (handle.includes('w')) {
      const newW = Math.max(5, initialElemW - dx);
      el.x = initialElemX + (initialElemW - newW);
      el.width = newW;
    }
    if (handle.includes('n')) {
      const newH = Math.max(4, initialElemH - dy);
      el.y = initialElemY + (initialElemH - newH);
      el.height = newH;
    }

    el.width = Math.round(el.width * 10) / 10;
    el.height = Math.round(el.height * 10) / 10;
    el.x = Math.round(el.x * 10) / 10;
    el.y = Math.round(el.y * 10) / 10;

    if (isCorner && (el.type === 'text' || el.type === 'card' || el.type === 'qbox')) {
      const ratio = el.width / Math.max(1, initialElemW);
      el.fontSize = Math.max(8, Math.min(140, Math.round(initFontSize * ratio)));
    }

    const elDom = document.getElementById(`elDom_${el.id}`);
    if (elDom) {
      elDom.style.left = `${el.x}%`;
      elDom.style.top = `${el.y}%`;
      elDom.style.width = `${el.width}%`;
      elDom.style.height = `${el.height}%`;
      if (el.fontSize) elDom.style.fontSize = `${el.fontSize}px`;
    }
  }

  function onMouseUp() {
    isResizingElement = false;
    justTransformedInline = true;
    setTimeout(() => { justTransformedInline = false; }, 140);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    renderRightEditorPanel();
    saveAllChangesToServer();
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

function startRotatingElement(e, el, pageWrapper) {
  isRotatingElement = true;
  const elDom = document.getElementById(`elDom_${el.id}`);
  const rect = elDom.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  function onMouseMove(ev) {
    if (!isRotatingElement) return;
    const rad = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
    let deg = Math.round(rad * (180 / Math.PI)) - 90;
    if (deg < 0) deg += 360;

    // 15 Derecelik adımlarla mıknatıslama (Shift basılıyken veya 0/90/180/270'de)
    if (Math.abs(deg % 45) < 4) deg = Math.round(deg / 45) * 45;

    el.rotate = deg;
    elDom.style.transform = `rotate(${deg}deg)`;
  }

  function onMouseUp() {
    isRotatingElement = false;
    justTransformedInline = true;
    setTimeout(() => { justTransformedInline = false; }, 140);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    renderRightEditorPanel();
    saveAllChangesToServer();
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

// Zengin Tipografi, Şablon İçi Görsel/Metin Taşıma-Boyutlandırma-Döndürme Motoru
let activeInlineElement = null;
let activeInlineFieldKey = null;
let activeInlineType = null; // 'text' | 'image'
let justTransformedInline = false;

function ensureFieldStyles(page, key) {
  if (!page.fieldStyles) page.fieldStyles = {};
  if (!page.fieldStyles[key]) page.fieldStyles[key] = {};
  return page.fieldStyles[key];
}

// Şablon görseli bir çerçeve div'i içindeyse (örn. Kamer sağ görsel kartı), doğrudan dış çerçeve kartını hedef al
function getVisualTargetForInline(domEl) {
  if (!domEl) return null;
  if (domEl.classList && domEl.classList.contains('template-image-container')) {
    const parent = domEl.parentElement;
    if (
      parent &&
      !parent.classList.contains('page-content-root') &&
      !parent.classList.contains('magazine-page') &&
      parent.querySelectorAll('.template-image-container').length === 1
    ) {
      return parent;
    }
  }
  return domEl;
}

function applyInlineTransformToDOM(domEl, fs) {
  if (!domEl || !fs) return;
  const targetBox = getVisualTargetForInline(domEl);
  if (!targetBox) return;

  const tx = Number(fs.tx) || 0;
  const ty = Number(fs.ty) || 0;
  const rot = Number(fs.rotate) || 0;
  const hasTransform = (tx !== 0 || ty !== 0 || rot !== 0);
  const hasSize = Boolean(fs.width || fs.height);

  // Eğer hedef kutu dış çerçeveyse içteki .template-image-container'ı %100 dolu ve sıfır transformda tut
  if (targetBox !== domEl) {
    domEl.style.transform = '';
    domEl.style.setProperty('width', '100%', 'important');
    domEl.style.setProperty('height', '100%', 'important');
    domEl.style.setProperty('max-width', 'none', 'important');
    domEl.style.setProperty('max-height', 'none', 'important');
  } else {
    // Span gibi inline metinlerin boyutlandırılabilmesi ve taşınabilmesi için inline-block yap
    if ((hasTransform || hasSize) && getComputedStyle(targetBox).display === 'inline') {
      targetBox.style.setProperty('display', 'inline-block', 'important');
    }
  }

  if (hasTransform) {
    targetBox.style.setProperty('transform', `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, 'important');
    if (getComputedStyle(targetBox).position === 'static') {
      targetBox.style.position = 'relative';
    }
    targetBox.style.zIndex = '35';
    // Üst kapsayıcılardaki overflow:hidden kırpmalarını kaldır ki kutu sayfa içinde serbestçe taşınabilsin
    let anc = targetBox.parentElement;
    while (anc && !anc.classList.contains('magazine-page')) {
      if (getComputedStyle(anc).overflow === 'hidden') {
        anc.style.overflow = 'visible';
      }
      anc = anc.parentElement;
    }
  } else {
    targetBox.style.removeProperty('transform');
  }

  if (fs.width) {
    targetBox.style.setProperty('width', `${fs.width}px`, 'important');
    targetBox.style.setProperty('min-width', '0px', 'important');
    targetBox.style.setProperty('max-width', 'none', 'important');
    targetBox.style.setProperty('flex', 'none', 'important');
  }
  if (fs.height) {
    targetBox.style.setProperty('height', `${fs.height}px`, 'important');
    targetBox.style.setProperty('min-height', '0px', 'important');
    targetBox.style.setProperty('max-height', 'none', 'important');
    targetBox.style.setProperty('flex', 'none', 'important');
  }
  if (fs.fontSize && !domEl.classList.contains('template-image-container')) {
    domEl.style.setProperty('font-size', `${fs.fontSize}px`, 'important');
    domEl.style.setProperty('line-height', '1.15', 'important');
  }
  if (fs.borderRadius !== undefined) {
    targetBox.style.borderRadius = `${fs.borderRadius}px`;
    domEl.style.borderRadius = `${fs.borderRadius}px`;
    const innerImg = domEl.querySelector('img');
    if (innerImg) innerImg.style.borderRadius = `${fs.borderRadius}px`;
  }
  if (fs.opacity !== undefined) {
    targetBox.style.opacity = String(Number(fs.opacity) / 100);
  }
  if (fs.hasShadow !== undefined) {
    targetBox.style.filter = fs.hasShadow ? 'drop-shadow(0 12px 20px rgba(15, 23, 42, 0.35))' : '';
  }
  const innerImg = domEl.querySelector('img');
  if (innerImg) {
    if (fs.objectFit) innerImg.style.objectFit = fs.objectFit;
    if (fs.mask) innerImg.style.clipPath = fs.mask !== 'none' ? getClipPathForMask(fs.mask) : 'none';
  }
}

function updateInlineGizmoBox(domEl, fs, pageWrapper) {
  if (!pageWrapper) {
    pageWrapper = document.querySelector(`.magazine-page[data-page-index="${selectedEditIndex}"]`);
  }
  if (!pageWrapper || !domEl) return;
  const gizmo = pageWrapper.querySelector('#inlineTransformGizmo');
  if (!gizmo) return;
  const layer = gizmo.parentElement;
  if (!layer) return;

  const targetBox = getVisualTargetForInline(domEl);
  const layerRect = layer.getBoundingClientRect();
  const elRect = targetBox.getBoundingClientRect();
  const scale = (layerRect.width && layer.offsetWidth)
    ? (layerRect.width / layer.offsetWidth)
    : ((canvasZoomPercent || 100) / 100);

  const w = targetBox.offsetWidth || (elRect.width / scale) || 120;
  const h = targetBox.offsetHeight || (elRect.height / scale) || 50;
  const centerX = ((elRect.left + elRect.width / 2) - layerRect.left) / scale;
  const centerY = ((elRect.top + elRect.height / 2) - layerRect.top) / scale;
  const leftPx = centerX - w / 2;
  const topPx = centerY - h / 2;

  gizmo.style.left = `${leftPx}px`;
  gizmo.style.top = `${topPx}px`;
  gizmo.style.width = `${w}px`;
  gizmo.style.height = `${h}px`;
  gizmo.style.transform = `rotate(${fs?.rotate || 0}deg)`;
}

function renderInlineTransformGizmo(page, pageIndex, pageWrapper) {
  if (!pageWrapper) {
    pageWrapper = document.querySelector(`.magazine-page[data-page-index="${pageIndex}"]`);
  }
  if (!pageWrapper) return;
  const layer = pageWrapper.querySelector(`#elemLayer_${pageIndex}`);
  if (!layer) return;

  const oldGizmo = layer.querySelector('#inlineTransformGizmo');
  if (oldGizmo) oldGizmo.remove();

  if (!activeInlineFieldKey) return;
  let domEl = activeInlineElement;
  if (!domEl || !pageWrapper.contains(domEl)) {
    domEl = pageWrapper.querySelector(`[data-field-key="${activeInlineFieldKey}"]`);
    activeInlineElement = domEl;
  }
  if (!domEl) return;

  const fs = ensureFieldStyles(page, activeInlineFieldKey);
  applyInlineTransformToDOM(domEl, fs);

  const targetBox = getVisualTargetForInline(domEl);
  const layerRect = layer.getBoundingClientRect();
  const elRect = targetBox.getBoundingClientRect();
  const scale = (layerRect.width && layer.offsetWidth)
    ? (layerRect.width / layer.offsetWidth)
    : ((canvasZoomPercent || 100) / 100);

  const w = targetBox.offsetWidth || (elRect.width / scale) || 120;
  const h = targetBox.offsetHeight || (elRect.height / scale) || 50;
  const centerX = ((elRect.left + elRect.width / 2) - layerRect.left) / scale;
  const centerY = ((elRect.top + elRect.height / 2) - layerRect.top) / scale;
  const leftPx = centerX - w / 2;
  const topPx = centerY - h / 2;

  const gizmo = document.createElement('div');
  gizmo.id = 'inlineTransformGizmo';
  gizmo.className = 'pointer-events-none';
  gizmo.style.position = 'absolute';
  gizmo.style.left = `${leftPx}px`;
  gizmo.style.top = `${topPx}px`;
  gizmo.style.width = `${w}px`;
  gizmo.style.height = `${h}px`;
  gizmo.style.transform = `rotate(${fs.rotate || 0}deg)`;
  gizmo.style.outline = '2px solid #2563eb';
  gizmo.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.22)';
  gizmo.style.borderRadius = targetBox.style.borderRadius || '6px';
  gizmo.style.zIndex = '60';

  // 1. Taşıma Kulakçığı (✢ Taşı)
  const mh = document.createElement('div');
  mh.className = 'move-handle pointer-events-auto';
  mh.innerHTML = '<i class="ph ph-arrows-out-cardinal"></i><span>Taşı</span>';
  mh.title = 'Konumunu (Pozisyonunu) değiştirmek için sürükleyin';
  mh.onmousedown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    startDraggingInlineItem(e, pageIndex, activeInlineFieldKey, domEl, pageWrapper);
  };
  gizmo.appendChild(mh);

  // 2. 8 Noktalı Boyutlandırma Kulakçıkları (Ebat Değiştirme)
  ['nw', 'ne', 'se', 'sw', 'n', 's', 'e', 'w'].forEach(dir => {
    const rh = document.createElement('div');
    rh.className = `resize-handle handle-${dir} pointer-events-auto`;
    rh.title = 'Ebatını (Genişlik / Yükseklik) küçültmek veya büyütmek için sürükleyin';
    rh.onmousedown = (e) => {
      e.stopPropagation();
      e.preventDefault();
      startResizingInlineItem(e, dir, pageIndex, activeInlineFieldKey, domEl, pageWrapper);
    };
    gizmo.appendChild(rh);
  });

  // 3. Döndürme Kulakçığı (↻ Açı Değiştirme)
  const rotH = document.createElement('div');
  rotH.className = 'rotate-handle pointer-events-auto';
  rotH.innerHTML = '<i class="ph ph-arrows-clockwise"></i>';
  rotH.title = 'Açısını döndürmek için sürükleyin';
  rotH.onmousedown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    startRotatingInlineItem(e, pageIndex, activeInlineFieldKey, domEl, pageWrapper);
  };
  gizmo.appendChild(rotH);

  layer.appendChild(gizmo);
}

function startDraggingInlineItem(e, pageIndex, key, domEl, pageWrapper) {
  const page = magazineData.pages[pageIndex];
  if (!page || !domEl) return;
  const fs = ensureFieldStyles(page, key);

  const startX = e.clientX;
  const startY = e.clientY;
  const initTx = Number(fs.tx) || 0;
  const initTy = Number(fs.ty) || 0;
  const prevUserSelect = document.body.style.userSelect;
  document.body.style.userSelect = 'none';

  function onMove(ev) {
    const scaleFactor = (canvasZoomPercent || 100) / 100;
    const dx = (ev.clientX - startX) / scaleFactor;
    const dy = (ev.clientY - startY) / scaleFactor;
    fs.tx = Math.round(initTx + dx);
    fs.ty = Math.round(initTy + dy);
    applyInlineTransformToDOM(domEl, fs);
    updateInlineGizmoBox(domEl, fs, pageWrapper);
    syncInlineInspectorLiveInputs(fs, domEl);
  }

  function onUp() {
    document.body.style.userSelect = prevUserSelect;
    justTransformedInline = true;
    setTimeout(() => { justTransformedInline = false; }, 140);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    renderInlineTransformGizmo(page, pageIndex, pageWrapper);
    renderRightEditorPanel();
    saveAllChangesToServer();
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

function startResizingInlineItem(e, handle, pageIndex, key, domEl, pageWrapper) {
  const page = magazineData.pages[pageIndex];
  if (!page || !domEl) return;
  const fs = ensureFieldStyles(page, key);
  const targetBox = getVisualTargetForInline(domEl);

  const startX = e.clientX;
  const startY = e.clientY;
  const initW = Number(fs.width) || targetBox.offsetWidth || domEl.offsetWidth || 160;
  const initH = Number(fs.height) || targetBox.offsetHeight || domEl.offsetHeight || 80;
  const initTx = Number(fs.tx) || 0;
  const initTy = Number(fs.ty) || 0;
  const initFontSize = Number(fs.fontSize) || parseFloat(getComputedStyle(domEl).fontSize) || 16;
  const isTextItem = !domEl.classList.contains('template-image-container');
  const isCorner = ['nw', 'ne', 'se', 'sw'].includes(handle);
  const prevUserSelect = document.body.style.userSelect;
  document.body.style.userSelect = 'none';

  function onMove(ev) {
    const scaleFactor = (canvasZoomPercent || 100) / 100;
    const dx = (ev.clientX - startX) / scaleFactor;
    const dy = (ev.clientY - startY) / scaleFactor;

    let newW = initW;
    let newH = initH;
    let newTx = initTx;
    let newTy = initTy;

    const minW = isTextItem ? 28 : 36;
    const minH = isTextItem ? 18 : 28;

    if (handle.includes('e')) newW = Math.max(minW, initW + dx);
    if (handle.includes('s')) newH = Math.max(minH, initH + dy);
    if (handle.includes('w')) {
      newW = Math.max(minW, initW - dx);
      newTx = initTx + (initW - newW);
    }
    if (handle.includes('n')) {
      newH = Math.max(minH, initH - dy);
      newTy = initTy + (initH - newH);
    }

    fs.width = Math.round(newW);
    fs.height = Math.round(newH);
    fs.tx = Math.round(newTx);
    fs.ty = Math.round(newTy);

    // Metin kutularını köşelerden küçültürken/büyütürken yazı puntosunu da orantılı küçült/büyüt
    if (isTextItem) {
      if (isCorner) {
        const scaleRatio = newW / Math.max(1, initW);
        fs.fontSize = Math.max(8, Math.min(160, Math.round(initFontSize * scaleRatio)));
      } else if ((handle === 'n' || handle === 's') && newH < initH) {
        const hRatio = newH / Math.max(1, initH);
        fs.fontSize = Math.max(8, Math.min(160, Math.round(initFontSize * hRatio)));
      }
      const rtFs = document.getElementById('rtFontSize');
      if (rtFs && fs.fontSize) rtFs.value = fs.fontSize;
    }

    applyInlineTransformToDOM(domEl, fs);
    updateInlineGizmoBox(domEl, fs, pageWrapper);
    syncInlineInspectorLiveInputs(fs, domEl);
  }

  function onUp() {
    document.body.style.userSelect = prevUserSelect;
    justTransformedInline = true;
    setTimeout(() => { justTransformedInline = false; }, 140);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    renderInlineTransformGizmo(page, pageIndex, pageWrapper);
    renderRightEditorPanel();
    saveAllChangesToServer();
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

function startRotatingInlineItem(e, pageIndex, key, domEl, pageWrapper) {
  const page = magazineData.pages[pageIndex];
  if (!page || !domEl) return;
  const fs = ensureFieldStyles(page, key);
  const targetBox = getVisualTargetForInline(domEl);

  const rect = targetBox.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const prevUserSelect = document.body.style.userSelect;
  document.body.style.userSelect = 'none';

  function onMove(ev) {
    const rad = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
    let deg = Math.round(rad * (180 / Math.PI)) - 90;
    if (deg < 0) deg += 360;
    if (Math.abs(deg % 45) < 4) deg = Math.round(deg / 45) * 45;
    fs.rotate = deg;
    applyInlineTransformToDOM(domEl, fs);
    updateInlineGizmoBox(domEl, fs, pageWrapper);
    syncInlineInspectorLiveInputs(fs, domEl);
  }

  function onUp() {
    document.body.style.userSelect = prevUserSelect;
    justTransformedInline = true;
    setTimeout(() => { justTransformedInline = false; }, 140);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    renderInlineTransformGizmo(page, pageIndex, pageWrapper);
    renderRightEditorPanel();
    saveAllChangesToServer();
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

function syncInlineInspectorLiveInputs(fs, domEl) {
  const targetBox = getVisualTargetForInline(domEl);
  const inpX = document.getElementById('inlineInpX');
  const inpY = document.getElementById('inlineInpY');
  const inpW = document.getElementById('inlineInpW');
  const inpH = document.getElementById('inlineInpH');
  const inpRot = document.getElementById('inlineInpRotate');
  const lblRot = document.getElementById('inlineLblRotate');
  if (inpX) inpX.value = Math.round(fs.tx || 0);
  if (inpY) inpY.value = Math.round(fs.ty || 0);
  if (inpW) inpW.value = Math.round(fs.width || targetBox?.offsetWidth || domEl?.offsetWidth || 100);
  if (inpH) inpH.value = Math.round(fs.height || targetBox?.offsetHeight || domEl?.offsetHeight || 50);
  if (inpRot) inpRot.value = Math.round(fs.rotate || 0);
  if (lblRot) lblRot.textContent = `${Math.round(fs.rotate || 0)}°`;
}

function updateInlineFieldTransform(prop, val) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !activeInlineFieldKey) return;
  const fs = ensureFieldStyles(page, activeInlineFieldKey);
  fs[prop] = val;

  const pageWrapper = document.querySelector(`.magazine-page[data-page-index="${selectedEditIndex}"]`);
  if (!activeInlineElement && pageWrapper) {
    activeInlineElement = pageWrapper.querySelector(`[data-field-key="${activeInlineFieldKey}"]`);
  }
  if (activeInlineElement) {
    applyInlineTransformToDOM(activeInlineElement, fs);
    updateInlineGizmoBox(activeInlineElement, fs, pageWrapper);
  }
  const lblRot = document.getElementById('inlineLblRotate');
  if (prop === 'rotate' && lblRot) lblRot.textContent = `${val}°`;
  const lblRad = document.getElementById('inlineLblRadius');
  if (prop === 'borderRadius' && lblRad) lblRad.textContent = `${val}px`;
  const lblOp = document.getElementById('inlineLblOpacity');
  if (prop === 'opacity' && lblOp) lblOp.textContent = `${val}%`;
  debouncedSave();
}

function resetInlineFieldTransform() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !activeInlineFieldKey) return;
  const fs = ensureFieldStyles(page, activeInlineFieldKey);
  delete fs.tx;
  delete fs.ty;
  delete fs.width;
  delete fs.height;
  delete fs.rotate;
  delete fs.fontSize;
  renderMagazineViewport();
  setTimeout(() => {
    const pageWrapper = document.querySelector(`.magazine-page[data-page-index="${selectedEditIndex}"]`);
    if (pageWrapper) {
      activeInlineElement = pageWrapper.querySelector(`[data-field-key="${activeInlineFieldKey}"]`);
      renderInlineTransformGizmo(page, selectedEditIndex, pageWrapper);
    }
    renderRightEditorPanel();
  }, 20);
  saveAllChangesToServer();
  showToast("↺ Öğenin ebat, konum ve açısı sıfırlandı.");
}

function handleInlineImageMouseDown(event, pageIndex, key, domEl) {
  if (event.target.closest('.img-change-badge')) return;
  event.stopPropagation();
  event.preventDefault();

  if (selectedEditIndex !== pageIndex) {
    selectPageForEdit(pageIndex);
  }

  activeInlineElement = domEl;
  activeInlineFieldKey = key;
  activeInlineType = 'image';
  selectedElementId = null;

  document.querySelectorAll('.inline-selected').forEach(n => n.classList.remove('inline-selected'));
  domEl.classList.add('inline-selected');

  const badge = document.getElementById('activeSelectionBadge');
  if (badge) {
    badge.textContent = `Görsel: ${key}`;
    badge.className = "text-[10px] text-sky-400 font-mono font-bold mr-1";
  }

  const page = magazineData.pages[pageIndex];
  const pageWrapper = domEl.closest('.magazine-page');
  renderAllElementsForCurrentPage();
  renderInlineTransformGizmo(page, pageIndex, pageWrapper);
  renderRightEditorPanel();

  // Doğrudan görsel üzerinden sürükleyerek taşıma başlat
  startDraggingInlineItem(event, pageIndex, key, domEl, pageWrapper);
}

function handleInlineTextMouseDown(event, pageIndex, key, domEl) {
  event.stopPropagation();

  if (selectedEditIndex !== pageIndex) {
    selectPageForEdit(pageIndex);
  }

  // Seçimi ve gizmo çerçevesini aktif et
  handleInlineTextFocus(pageIndex, key, domEl);

  const pageWrapper = domEl.closest('.magazine-page');
  const startX = event.clientX;
  const startY = event.clientY;
  let dragStarted = false;

  // Kullanıcı fareyi basılı tutup > 4px sürüklerse metin seçmek yerine kutuyu taşısın; sabit tıklarsa yazıyı düzenlesin
  function onThresholdMove(moveEv) {
    if (!dragStarted && Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY) > 4) {
      dragStarted = true;
      window.removeEventListener('mousemove', onThresholdMove);
      window.removeEventListener('mouseup', onThresholdUp);
      if (window.getSelection) window.getSelection().removeAllRanges();
      domEl.blur();
      startDraggingInlineItem(event, pageIndex, key, domEl, pageWrapper);
    }
  }

  function onThresholdUp() {
    window.removeEventListener('mousemove', onThresholdMove);
    window.removeEventListener('mouseup', onThresholdUp);
  }

  window.addEventListener('mousemove', onThresholdMove);
  window.addEventListener('mouseup', onThresholdUp);
}

function showFloatingRichTextBar(elDom, el) {
  const badge = document.getElementById('activeSelectionBadge');
  if (badge) {
    badge.textContent = `Seçili: ${(el?.type || 'öğe').toUpperCase()}`;
    badge.className = "text-[10px] text-emerald-400 font-mono font-bold mr-1";
  }

  const fsEl = document.getElementById('rtFontSize');
  const ffEl = document.getElementById('rtFontFamily');
  const colEl = document.getElementById('rtColor');
  const bgEl = document.getElementById('rtBgColor');

  if (el) {
    if (fsEl) fsEl.value = el.fontSize || 14;
    if (ffEl) ffEl.value = el.fontFamily || 'Inter';
    if (colEl) colEl.value = (el.color && el.color.startsWith('#')) ? el.color : '#0f172a';
    if (bgEl) bgEl.value = el.bgColor || 'transparent';
  }

  const floatBar = document.getElementById('floatingContextToolbar');
  if (floatBar) floatBar.classList.add('hidden');
}

function hideFloatingRichTextBar() {
  const floatBar = document.getElementById('floatingContextToolbar');
  if (floatBar) floatBar.classList.add('hidden');
}

function handleInlineTextFocus(pageIndex, key, domEl) {
  activeInlineElement = domEl;
  activeInlineFieldKey = key;
  activeInlineType = 'text';
  selectedElementId = null;

  document.querySelectorAll('.inline-selected').forEach(n => n.classList.remove('inline-selected'));
  domEl.classList.add('inline-selected');

  const badge = document.getElementById('activeSelectionBadge');
  if (badge) {
    badge.textContent = `Metin: ${key}`;
    badge.className = "text-[10px] text-amber-400 font-mono font-bold mr-1";
  }

  const page = magazineData.pages[pageIndex];
  const fs = (page && page.fieldStyles && page.fieldStyles[key]) ? page.fieldStyles[key] : {};

  const fsEl = document.getElementById('rtFontSize');
  const ffEl = document.getElementById('rtFontFamily');
  const colEl = document.getElementById('rtColor');
  const bgEl = document.getElementById('rtBgColor');

  if (fsEl && fs.fontSize) fsEl.value = fs.fontSize;
  if (ffEl && fs.fontFamily) ffEl.value = fs.fontFamily;
  if (colEl && fs.color && fs.color.startsWith('#')) colEl.value = fs.color;
  if (bgEl) bgEl.value = fs.bgColor || 'transparent';

  const floatBar = document.getElementById('floatingContextToolbar');
  if (floatBar) floatBar.classList.add('hidden');

  const pageWrapper = domEl.closest('.magazine-page');
  renderAllElementsForCurrentPage();
  renderInlineTransformGizmo(page, pageIndex, pageWrapper);
  renderRightEditorPanel();
}

function cycleTextAlign() {
  const aligns = ['left', 'center', 'right', 'justify'];
  const page = magazineData.pages[selectedEditIndex];
  let curr = 'left';
  if (selectedElementId) {
    const el = (page.elements || []).find(x => x.id === selectedElementId);
    if (el) curr = el.textAlign || 'left';
  } else if (activeInlineFieldKey && page.fieldStyles?.[activeInlineFieldKey]) {
    curr = page.fieldStyles[activeInlineFieldKey].textAlign || 'left';
  }
  const next = aligns[(aligns.indexOf(curr) + 1) % aligns.length];
  applyTextStyle('textAlign', next);
}

function cycleTextCase() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;
  if (selectedElementId) {
    const el = (page.elements || []).find(x => x.id === selectedElementId);
    const elDom = document.getElementById(`elDom_${selectedElementId}`);
    if (el && elDom) {
      const modes = ['none', 'uppercase', 'lowercase', 'capitalize'];
      const next = modes[(modes.indexOf(el.textTransform || 'none') + 1) % modes.length];
      el.textTransform = next;
      elDom.style.textTransform = next;
      saveAllChangesToServer();
    }
  } else if (activeInlineElement) {
    const curr = activeInlineElement.style.textTransform || 'none';
    const modes = ['none', 'uppercase', 'lowercase', 'capitalize'];
    const next = modes[(modes.indexOf(curr) + 1) % modes.length];
    activeInlineElement.style.textTransform = next;
    saveAllChangesToServer();
  }
}

function duplicateSelectedCanvasElement() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !selectedElementId) {
    showToast("Çoğaltmak için önce bir öğe seçin.");
    return;
  }
  const orig = (page.elements || []).find(x => x.id === selectedElementId);
  if (!orig) return;
  const copy = JSON.parse(JSON.stringify(orig));
  copy.id = 'el-' + Date.now();
  copy.x = Math.min(85, (orig.x || 10) + 4);
  copy.y = Math.min(85, (orig.y || 10) + 4);
  page.elements.push(copy);
  selectedElementId = copy.id;
  renderAll();
  saveAllChangesToServer();
  showToast("📋 Öğe çoğaltıldı!");
}

function applyTextStyle(prop, val) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;

  // 1. Durum: Serbest eklenen kutu veya öğe seçiliyse
  if (selectedElementId) {
    const el = (page.elements || []).find(x => x.id === selectedElementId);
    if (!el) return;

    el[prop] = val;
    const elDom = document.getElementById(`elDom_${el.id}`);
    if (elDom) {
      if (prop === 'fontSize') elDom.style.fontSize = `${val}px`;
      if (prop === 'fontFamily') elDom.style.fontFamily = val;
      if (prop === 'color') elDom.style.color = val;
      if (prop === 'bgColor') {
        if (val && val.startsWith('linear-gradient')) {
          elDom.style.background = val;
          elDom.style.borderColor = 'rgba(255,255,255,0.28)';
          if (!el.color || el.color === '#0f172a') {
            el.color = '#ffffff';
            elDom.style.color = '#ffffff';
          }
        } else {
          elDom.style.background = 'none';
          elDom.style.backgroundColor = val;
          elDom.style.borderColor = val === 'transparent' ? 'transparent' : '#cbd5e1';
        }
      }
      if (prop === 'textAlign') elDom.style.textAlign = val;
    }
    pushHistoryState();
    saveAllChangesToServer();
    return;
  }

  // 2. Durum: Şablon içindeki herhangi bir metin seçiliyse (Inline Editable Text)
  if (activeInlineFieldKey && activeInlineElement) {
    if (!page.fieldStyles) page.fieldStyles = {};
    if (!page.fieldStyles[activeInlineFieldKey]) page.fieldStyles[activeInlineFieldKey] = {};
    page.fieldStyles[activeInlineFieldKey][prop] = val;

    if (prop === 'fontSize') activeInlineElement.style.fontSize = `${val}px`;
    if (prop === 'fontFamily') activeInlineElement.style.fontFamily = val;
    if (prop === 'color') activeInlineElement.style.color = val;
    if (prop === 'textAlign') activeInlineElement.style.textAlign = val;
    if (prop === 'bgColor') {
      if (val === 'transparent') {
        activeInlineElement.style.background = 'none';
        activeInlineElement.style.backgroundColor = 'transparent';
        activeInlineElement.style.padding = '';
        activeInlineElement.style.borderRadius = '';
        activeInlineElement.style.border = '';
      } else if (val.startsWith('linear-gradient')) {
        activeInlineElement.style.background = val;
        activeInlineElement.style.padding = '10px 14px';
        activeInlineElement.style.borderRadius = '14px';
        activeInlineElement.style.border = '1px solid rgba(255,255,255,0.25)';
        activeInlineElement.style.color = '#ffffff';
        page.fieldStyles[activeInlineFieldKey].color = '#ffffff';
      } else {
        activeInlineElement.style.background = 'none';
        activeInlineElement.style.backgroundColor = val;
        activeInlineElement.style.padding = '6px 12px';
        activeInlineElement.style.borderRadius = '10px';
        activeInlineElement.style.border = '1px solid rgba(148,163,184,0.35)';
      }
    }

    pushHistoryState();
    saveAllChangesToServer();
    showToast("Yazı ve çerçeve stili uygulandı!");
    return;
  }

  showToast("Lütfen önce sayfa üzerindeki bir yazıya veya kutuya tıklayın.");
}

function applyTextFormat(cmd) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;

  if (selectedElementId) {
    document.execCommand(cmd, false, null);
    const elDom = document.getElementById(`elDom_${selectedElementId}`);
    const el = (page.elements || []).find(x => x.id === selectedElementId);
    if (el && elDom) {
      el.content = elDom.innerHTML;
      saveAllChangesToServer();
    }
    return;
  }

  if (activeInlineFieldKey && activeInlineElement) {
    if (!page.fieldStyles) page.fieldStyles = {};
    if (!page.fieldStyles[activeInlineFieldKey]) page.fieldStyles[activeInlineFieldKey] = {};
    const fs = page.fieldStyles[activeInlineFieldKey];

    if (cmd === 'bold') {
      fs.fontWeight = fs.fontWeight === 'bold' ? 'normal' : 'bold';
      activeInlineElement.style.fontWeight = fs.fontWeight;
    } else if (cmd === 'italic') {
      fs.fontStyle = fs.fontStyle === 'italic' ? 'normal' : 'italic';
      activeInlineElement.style.fontStyle = fs.fontStyle;
    } else if (cmd === 'underline') {
      fs.textDecoration = fs.textDecoration === 'underline' ? 'none' : 'underline';
      activeInlineElement.style.textDecoration = fs.textDecoration;
    } else if (cmd === 'strikethrough') {
      fs.textDecoration = fs.textDecoration === 'line-through' ? 'none' : 'line-through';
      activeInlineElement.style.textDecoration = fs.textDecoration;
    }
    saveAllChangesToServer();
    return;
  }

  showToast("Lütfen önce sayfa üzerindeki bir yazıya tıklayın.");
}

function changeElementLayer(delta) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page.elements || []).find(x => x.id === selectedElementId);
  if (!el) {
    showToast("Katman sırasını değiştirmek için bir öğe seçin.");
    return;
  }
  el.zIndex = Math.max(1, (el.zIndex || 10) + delta * 5);
  const elDom = document.getElementById(`elDom_${el.id}`);
  if (elDom) elDom.style.zIndex = el.zIndex;
  renderLayersPopover();
  saveAllChangesToServer();
  showToast(delta > 0 ? "Öne getirildi" : "Arkaya gönderildi");
}

function deleteSelectedCanvasElement() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !selectedElementId) {
    showToast("Silmek için bir öğe seçin.");
    return;
  }
  page.elements = (page.elements || []).filter(x => x.id !== selectedElementId);
  selectedElementId = null;
  hideFloatingRichTextBar();
  renderAll();
  saveAllChangesToServer();
  showToast("🗑️ Öğe silindi.");
}

function toggleGridOverlay() {
  showGridGuide = !showGridGuide;
  const btn = document.getElementById('btnGridToggle');
  if (btn) {
    btn.className = showGridGuide 
      ? 'w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center transition shadow'
      : 'w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-center transition';
  }
  renderMagazineViewport();
  showToast(showGridGuide ? "⊞ Izgara kılavuzları açık" : "Izgara kapatıldı");
}

function toggleLayersPopover() {
  const pop = document.getElementById('layersPopover');
  if (!pop) return;
  pop.classList.toggle('hidden');
  if (!pop.classList.contains('hidden')) {
    renderLayersPopover();
  }
}

function renderLayersPopover() {
  const container = document.getElementById('layersListContainer');
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!container || !page) return;
  const elems = [...(page.elements || [])].sort((a, b) => (b.zIndex || 10) - (a.zIndex || 10));
  if (elems.length === 0) {
    container.innerHTML = `<div class="text-slate-400 text-[11px] py-3 text-center">Bu sayfada henüz serbest katman yok.<br><button onclick="convertTemplateToFreeformObjects()" class="mt-2 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold">Şablonu Katmanlara Ayrıştır</button></div>`;
    return;
  }
  container.innerHTML = elems.map(el => `
    <div onclick="selectCanvasElement('${el.id}'); renderRightEditorPanel();" class="flex items-center justify-between p-2 rounded-xl border cursor-pointer transition ${el.id === selectedElementId ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'}">
      <div class="truncate pr-2 flex items-center gap-1.5">
        <i class="ph ${el.type === 'image' ? 'ph-image text-sky-400' : el.type === 'table' ? 'ph-table text-amber-400' : el.type === 'button' ? 'ph-cursor-click text-rose-400' : el.type === 'shape' ? 'ph-shapes text-purple-400' : 'ph-text-t text-indigo-400'}"></i>
        <span class="truncate text-[11px] font-semibold">${escapeHtml(el.label || (el.content ? el.content.replace(/<[^>]*>/g, '').slice(0, 18) : el.type.toUpperCase()))}</span>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <button onclick="event.stopPropagation(); selectedElementId='${el.id}'; changeElementLayer(1);" class="p-1 rounded hover:bg-slate-700" title="Üste"><i class="ph ph-caret-up"></i></button>
        <button onclick="event.stopPropagation(); selectedElementId='${el.id}'; changeElementLayer(-1);" class="p-1 rounded hover:bg-slate-700" title="Alta"><i class="ph ph-caret-down"></i></button>
      </div>
    </div>
  `).join('');
}

function filterElementsDrawer(query) {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('#elementsLibraryContainer .elem-group').forEach(g => {
    const kw = (g.dataset.keywords || '') + ' ' + g.innerText.toLowerCase();
    g.style.display = (!q || kw.includes(q)) ? '' : 'none';
  });
}

// Şablondaki mevcut başlık, yazı ve resimleri tek tıkla taşınabilir/boyutlandırılabilir serbest nesnelere dönüştürür (Görsel 2 & 5)
function convertTemplateToFreeformObjects() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !canUserEditPage(page)) return;
  if (!page.elements) page.elements = [];

  const accent = page.accentColor || '#2563eb';
  const imgUrl = page.coverImage || page.image || page.photo || page.bgImage;
  const mainTitle = page.magazineName || page.mainHeadline || page.title || page.headerText || page.interviewee || 'Sayfa Başlığı';
  const subBody = page.subHeadline || page.content || page.subText || page.poemText || page.editorText || page.a1 || 'İçerik metninizi doğrudan düzenleyebilir veya istediğiniz yere sürükleyebilirsiniz.';

  if (imgUrl) {
    page.elements.push({
      id: 'el-' + Date.now() + '-img',
      type: 'image',
      url: imgUrl,
      x: 8,
      y: 24,
      width: 42,
      height: 56,
      rotate: 0,
      zIndex: 15,
      opacity: 100,
      borderRadius: 12
    });
  }

  page.elements.push({
    id: 'el-' + Date.now() + '-title',
    type: 'text',
    x: 8,
    y: 8,
    width: 84,
    height: 13,
    rotate: 0,
    zIndex: 20,
    content: `<strong>${escapeHtml(mainTitle)}</strong>`,
    fontSize: 24,
    fontFamily: "'Playfair Display', serif",
    color: '#0f172a',
    bgColor: 'transparent',
    borderColor: 'transparent',
    textAlign: 'left'
  });

  page.elements.push({
    id: 'el-' + Date.now() + '-body',
    type: 'text',
    x: imgUrl ? 53 : 8,
    y: 24,
    width: imgUrl ? 39 : 84,
    height: 45,
    rotate: 0,
    zIndex: 20,
    content: escapeHtml(subBody),
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#334155',
    bgColor: '#f8fafc',
    borderColor: '#cbd5e1',
    textAlign: 'left'
  });

  page.type = 'freeform';
  selectedElementId = page.elements[page.elements.length - 1].id;
  renderAll();
  saveAllChangesToServer();
  showToast("✨ Şablon öğeleri bağımsız taşınabilir nesnelere dönüştürüldü!");
}

// Eleman Ekleme Motoru (Metin, Renkli Çerçeve, Soru Kutusu, Resim, Video, Tablo, Şekil, Buton, Sıcak Nokta, Ses, Slayt, Harita)
function addCanvasElement(type, data = {}) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) {
    showToast("Lütfen önce düzenlenecek sayfayı seçin!");
    return;
  }
  if (!page.elements) page.elements = [];
  const accent = page.accentColor || '#d97706';

  const newId = 'el-' + Date.now();
  let newEl = {
    id: newId,
    type,
    x: 14,
    y: 18,
    width: 55,
    height: 22,
    rotate: 0,
    zIndex: 25,
    opacity: 100,
    borderRadius: 12,
    letterSpacing: 0,
    lineHeight: 1.32,
    paragraphSpacing: 0,
    actionTrigger: 'click',
    actionType: 'none',
    actionValue: '',
    ...data
  };

  if (type === 'text') {
    newEl = {
      ...newEl,
      content: "<strong>Yeni Başlık / Metin Kutusu</strong><br>Tıklayarak doğrudan yazınızı yazabilir, sağdaki Ayarlar panelinden satır aralığı, gölge ve çerçeve rengini ayarlayabilirsiniz.",
      fontSize: 14,
      fontFamily: "Inter",
      color: "#0f172a",
      bgColor: "#ffffff",
      borderColor: "#cbd5e1",
      textAlign: "left",
      ...data
    };
  } else if (type === 'card') {
    newEl = {
      ...newEl,
      type: 'text',
      x: 8,
      y: 12,
      width: 84,
      height: 24,
      content: `<span style="font-size:10px; letter-spacing:0.15em; text-transform:uppercase; opacity:0.85; font-weight:700;">AYIN KONUĞU / ÖZEL ÇERÇEVE</span><br><strong style="font-size:19px; font-family:'Playfair Display', serif;">Konuk Adı veya Başlık</strong><br><span style="font-size:11.5px; opacity:0.9;">Türk Dili ve Edebiyatı Öğretmeni • Okulumuzun sevilen öğretmenleriyle söyleşi...</span>`,
      fontSize: 13,
      fontFamily: "Inter",
      color: "#ffffff",
      bgColor: `linear-gradient(135deg, ${accent}, #1e1b4b)`,
      borderColor: "rgba(255,255,255,0.28)",
      textAlign: "left",
      ...data
    };
  } else if (type === 'qbox') {
    newEl = {
      ...newEl,
      type: 'text',
      x: 8,
      y: 42,
      width: 84,
      height: 20,
      content: `<span style="background:${accent}; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700; margin-right:6px;">S1</span><strong>Lise yıllarınızda nasıl bir öğrenciydiniz?</strong><br><span style="color:#475569; font-size:11px;">Çok meraklı ve kütüphaneden çıkmayan bir öğrenciydim. Buraya tıklayarak cevabı düzenleyin.</span>`,
      fontSize: 12,
      fontFamily: "Inter",
      color: "#0f172a",
      bgColor: "#f8fafc",
      borderColor: "#cbd5e1",
      textAlign: "left",
      ...data
    };
  } else if (type === 'table') {
    newEl = {
      ...newEl,
      x: 8,
      y: 52,
      width: 84,
      height: 32,
      headerBg: accent || '#7f1d1d',
      rows: [
        ['ÖZELLİK / KONU', 'AÇIKLAMA & DETAY'],
        ['Proje Adı', 'Okul Kültür & Bilim Dosyası'],
        ['Kategori', 'Edebiyat ve Sanat'],
        ['Dönem', '2026 - 2027 Eğitim Yılı'],
        ['Katılımcılar', 'Tüm Sınıflar & Yayın Kulübü']
      ],
      ...data
    };
  } else if (type === 'shape') {
    newEl = {
      ...newEl,
      x: 25,
      y: 25,
      width: data.shapeType === 'line' ? 60 : 28,
      height: data.shapeType === 'line' ? 4 : 20,
      shapeType: data.shapeType || 'rect',
      bgColor: data.bgColor || accent || '#881337',
      borderRadius: data.shapeType === 'circle' ? 999 : 8,
      ...data
    };
  } else if (type === 'button') {
    newEl = {
      ...newEl,
      x: 30,
      y: 78,
      width: 40,
      height: 8,
      label: data.label || 'DETAYLARI İNCELE',
      bgColor: data.bgColor || accent || '#7f1d1d',
      color: data.color || '#ffffff',
      fontSize: 11,
      borderRadius: 999,
      actionType: data.actionType || 'popup',
      popupTitle: 'Detaylı Bilgi',
      popupText: 'Bu butona tıklandığında açılan bilgilendirme penceresi.',
      ...data
    };
  } else if (type === 'hotspot') {
    newEl = {
      ...newEl,
      x: 45,
      y: 45,
      width: 9,
      height: 7,
      bgColor: data.bgColor || '#e11d48',
      actionType: 'popup',
      popupTitle: data.popupTitle || 'Önemli Detay Noktası',
      popupText: data.popupText || 'Okuyucu bu sıcak noktaya tıkladığında bu açıklama penceresi açılır.',
      ...data
    };
  } else if (type === 'audio') {
    newEl = {
      ...newEl,
      x: 12,
      y: 72,
      width: 76,
      height: 15,
      title: 'Okul Radyosu / Şiir Dinletisi',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      ...data
    };
  } else if (type === 'slideshow') {
    newEl = {
      ...newEl,
      x: 12,
      y: 20,
      width: 76,
      height: 44,
      activeSlide: 0,
      slides: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
      ],
      ...data
    };
  } else if (type === 'map') {
    newEl = {
      ...newEl,
      x: 15,
      y: 30,
      width: 70,
      height: 36,
      locationTitle: magazineData.schoolName || 'Okul Kampüsü Konumu',
      ...data
    };
  }

  page.elements.push(newEl);
  selectedElementId = newId;
  activeInlineElement = null;
  activeInlineFieldKey = null;
  renderAll();
  setTimeout(() => {
    selectCanvasElement(newId);
    renderRightEditorPanel();
  }, 40);
  saveAllChangesToServer();
  showToast("✨ Öğe sayfaya eklendi! Sağ panelden Ayarlar ve Eylemlerini düzenleyebilirsiniz.");
}

function updateTableCell(elId, rIdx, cIdx, val) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === elId);
  if (!el || !el.rows || !el.rows[rIdx]) return;
  el.rows[rIdx][cIdx] = val;
  saveAllChangesToServer();
}

function addTableRow(elId) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === elId);
  if (!el) return;
  if (!el.rows) el.rows = [['BAŞLIK 1', 'BAŞLIK 2']];
  el.rows.push(['Yeni Madde', 'Detay Bilgisi']);
  renderAllElementsForCurrentPage();
  saveAllChangesToServer();
}

function removeTableRow(elId) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === elId);
  if (!el || !el.rows || el.rows.length <= 2) return;
  el.rows.pop();
  renderAllElementsForCurrentPage();
  saveAllChangesToServer();
}

function stepElementSlideshow(elId, dir) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === elId);
  if (!el || !el.slides || !el.slides.length) return;
  el.activeSlide = ((el.activeSlide || 0) + dir + el.slides.length) % el.slides.length;
  renderAllElementsForCurrentPage();
}

function updateElementPropById(elId, prop, val) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === elId);
  if (!el) return;
  el[prop] = val;
  saveAllChangesToServer();
}

async function handleCanvasImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      addCanvasElement('image', { url: data.url, width: 45, height: 32 });
      return;
    }
  } catch (err) {
    console.warn("Upload hatası:", err);
  }

  // Fallback: FileReader
  const reader = new FileReader();
  reader.onload = (e) => {
    addCanvasElement('image', { url: e.target.result, width: 45, height: 32 });
  };
  reader.readAsDataURL(file);
}

async function handleCanvasVideoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  showToast("Video yükleniyor, lütfen bekleyin...");
  const formData = new FormData();
  formData.append('video', file);

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      addCanvasElement('video', { url: data.url, width: 55, height: 35 });
      showToast("Video başarıyla eklendi!");
      return;
    }
  } catch (err) {
    showToast("Video yüklenemedi!");
  }
}

function initGlobalCanvasEvents() {
  window.addEventListener('click', (ev) => {
    if (!ev.target.closest('#morePopupMenu') && !ev.target.closest('#railBtn_more')) {
      closeMorePopupMenu();
    }
  });

  // El Aracı (Pan Modu) ile Tuvali Sürükleme
  const ws = document.getElementById('mainCanvasWorkspace');
  if (ws) {
    ws.addEventListener('mousedown', (e) => {
      if (!isPanMode) return;
      isPanningWorkspace = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      panScrollLeft = ws.scrollLeft;
      panScrollTop = ws.scrollTop;
    });
    window.addEventListener('mousemove', (e) => {
      if (!isPanningWorkspace || !ws) return;
      ws.scrollLeft = panScrollLeft - (e.clientX - panStartX);
      ws.scrollTop = panScrollTop - (e.clientY - panStartY);
    });
    window.addEventListener('mouseup', () => {
      isPanningWorkspace = false;
    });
  }

  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

    // Ctrl+Z (Geri Al) & Ctrl+Y (İleri Al)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !isTyping) {
      e.preventDefault();
      undoAction();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y' && !isTyping) {
      e.preventDefault();
      redoAction();
      return;
    }
    // Ctrl+D (Çoğalt)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && !isTyping && selectedElementId) {
      e.preventDefault();
      duplicateSelectedCanvasElement();
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (isTyping) return;
      if (selectedElementId) {
        deleteSelectedCanvasElement();
      }
    }
    if (e.key === 'Escape') {
      selectedElementId = null;
      activeInlineElement = null;
      activeInlineFieldKey = null;
      hideFloatingRichTextBar();
      renderAllElementsForCurrentPage();
      renderRightEditorPanel();
    }

    // Seçili öğeyi yön tuşlarıyla hassas kaydırma
    if (!isTyping && selectedElementId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const page = magazineData.pages[selectedEditIndex];
      const el = (page?.elements || []).find(x => x.id === selectedElementId);
      if (el) {
        const step = e.shiftKey ? 2.5 : 0.5;
        if (e.key === 'ArrowLeft') el.x = Math.round((el.x - step) * 10) / 10;
        if (e.key === 'ArrowRight') el.x = Math.round((el.x + step) * 10) / 10;
        if (e.key === 'ArrowUp') el.y = Math.round((el.y - step) * 10) / 10;
        if (e.key === 'ArrowDown') el.y = Math.round((el.y + step) * 10) / 10;
        renderAllElementsForCurrentPage();
        renderRightEditorPanel();
        debouncedSave();
      }
    }
  });
}

function showKeyboardShortcutsToast() {
  showToast("⌨️ Kısayollar: Ctrl+Z (Geri Al), Ctrl+Y (İleri Al), Ctrl+D (Çoğalt), Delete (Sil), Yön Tuşları (Hassas Taşı)");
}

function openAiHelperModal() {
  openModal('aiHelperModal');
}

function generateAiSnippet(kind) {
  const box = document.getElementById('aiOutputBox');
  if (!box) return;
  const school = magazineData?.schoolName || 'Okulumuz';
  const snippets = {
    headline: `GELECEĞİ TASARLAYAN NESİL: ${school.toUpperCase()} BİLİM VE SANAT DOSYASI\nMerak eden, araştıran ve üreten gençlerin gözünden yeni yüzyılın trendleri.`,
    editorial: `Sevgili Okurlarımız,\n${school} ailesi olarak bu sayımızda edebiyattan bilime, sanattan spora uzanan çok sesli bir yolculuğa çıkıyoruz. Her sayfasında öğrencilerimizin emeği ve heyecanı bulunan dergimizin keyifle okunmasını dileriz.`,
    interview: `S1: Öğrencilik yıllarınızda hayatınıza yön veren en önemli dönüm noktası neydi?\nS2: Gençlerin okuma, yazma ve üretme tutkusunu canlı tutmak için neler önerirsiniz?\nS3: Dergimiz okurlarına ve geleceğin yazarlarına son mesajınız nedir?`,
    article: `Dijitalleşen dünyada sanat ve bilimin kesişim noktası her geçen gün genişliyor. ${school} proje atölyelerinde yürütülen çalışmalar, disiplinlerarası düşüncenin yaratıcılığı nasıl beslediğini çarpıcı örneklerle ortaya koyuyor.`
  };
  box.value = snippets[kind] || snippets.article;
}

function insertAiOutputToCanvas() {
  const box = document.getElementById('aiOutputBox');
  const text = box ? box.value.trim() : '';
  if (!text) {
    showToast("Lütfen önce bir metin oluşturun.");
    return;
  }
  closeModal('aiHelperModal');
  if (selectedElementId) {
    const page = magazineData.pages[selectedEditIndex];
    const el = (page?.elements || []).find(x => x.id === selectedElementId);
    if (el && (el.type === 'text' || el.type === 'card' || el.type === 'qbox')) {
      el.content = text.replace(/\n/g, '<br>');
      renderAll();
      saveAllChangesToServer();
      showToast("✨ AI metni seçili kutuya aktarıldı!");
      return;
    }
  }
  addCanvasElement('text', {
    content: text.replace(/\n/g, '<br>'),
    width: 72,
    height: 26
  });
}

// ==========================================
// 6. ŞABLON İÇİ DOĞRUDAN DÜZENLEME & RENDERLAR
// ==========================================
let saveTimeout = null;
function debouncedSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveAllChangesToServer();
  }, 600);
}

function handleInlineTextChange(pageIndex, key, domEl) {
  const page = magazineData.pages[pageIndex];
  if (!page) return;
  page[key] = domEl.innerText;
  
  // Sağ paneldeki ilgili alanı güncelle
  const formEl = document.querySelector(`#editorFormContainer input[oninput*="'${key}'"], #editorFormContainer textarea[oninput*="'${key}'"]`);
  if (formEl) {
    formEl.value = page[key];
  }
  debouncedSave();
}

async function uploadTemplateImageInline(event, pageIndex, key) {
  const file = event.target.files[0];
  if (!file) return;

  showToast("Görsel yükleniyor...");
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      magazineData.pages[pageIndex][key] = data.url;
      renderMagazineViewport();
      renderRightEditorPanel();
      saveAllChangesToServer();
      showToast("Fotoğraf başarıyla güncellendi!");
      return;
    }
  } catch (err) {
    console.warn("Upload hatası:", err);
  }

  // Fallback: FileReader
  const reader = new FileReader();
  reader.onload = (e) => {
    magazineData.pages[pageIndex][key] = e.target.result;
    renderMagazineViewport();
    renderRightEditorPanel();
    saveAllChangesToServer();
    showToast("Fotoğraf güncellendi!");
  };
  reader.readAsDataURL(file);
}

async function uploadCanvasElementImage(event, elementId) {
  const file = event.target.files[0];
  if (!file) return;

  const page = magazineData.pages[selectedEditIndex];
  if (!page || !page.elements) return;
  const el = page.elements.find(e => e.id === elementId);
  if (!el) return;

  showToast("Görsel yükleniyor...");
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      el.url = data.url;
      renderAllElementsForCurrentPage();
      saveAllChangesToServer();
      showToast("Görsel güncellendi!");
      return;
    }
  } catch (err) {
    console.warn("Upload hatası:", err);
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    el.url = e.target.result;
    renderAllElementsForCurrentPage();
    saveAllChangesToServer();
    showToast("Görsel güncellendi!");
  };
  reader.readAsDataURL(file);
}

function makeInlineEditable(pageIndex, key, text, tag = 'div', className = '', style = '') {
  const page = magazineData?.pages?.[pageIndex];
  const isEditable = (appMode === 'edit' && pageIndex === selectedEditIndex && canUserEditPage(page));
  const safeText = escapeHtml(text || '');

  // Kullanıcı tarafından şablon metnine uygulanmış özel tipografi, çerçeve ve boyut/konum/açı stillerini oku
  const fs = page?.fieldStyles?.[key] || {};
  let customStyle = style ? `${style};` : '';
  if (fs.fontSize) customStyle += ` font-size:${fs.fontSize}px !important;`;
  if (fs.fontFamily) customStyle += ` font-family:${fs.fontFamily} !important;`;
  if (fs.color) customStyle += ` color:${fs.color} !important;`;
  if (fs.textAlign) customStyle += ` text-align:${fs.textAlign} !important;`;
  if (fs.fontWeight) customStyle += ` font-weight:${fs.fontWeight} !important;`;
  if (fs.fontStyle) customStyle += ` font-style:${fs.fontStyle} !important;`;
  if (fs.textDecoration) customStyle += ` text-decoration:${fs.textDecoration} !important;`;
  if (fs.letterSpacing !== undefined) customStyle += ` letter-spacing:${fs.letterSpacing}px !important;`;
  if (fs.lineHeight !== undefined) customStyle += ` line-height:${fs.lineHeight} !important;`;
  if (fs.bgColor && fs.bgColor !== 'transparent') {
    if (fs.bgColor.startsWith('linear-gradient')) {
      customStyle += ` background:${fs.bgColor} !important; padding:8px 12px !important; border-radius:${fs.borderRadius !== undefined ? fs.borderRadius : 12}px !important; box-shadow:0 4px 12px rgba(0,0,0,0.12) !important;`;
    } else {
      customStyle += ` background-color:${fs.bgColor} !important; padding:6px 10px !important; border-radius:${fs.borderRadius !== undefined ? fs.borderRadius : 10}px !important;`;
    }
  } else if (fs.borderRadius !== undefined) {
    customStyle += ` border-radius:${fs.borderRadius}px !important;`;
  }
  if (fs.width) customStyle += ` width:${fs.width}px !important; max-width:none !important; display:block !important;`;
  if (fs.height) customStyle += ` height:${fs.height}px !important; max-height:none !important; display:block !important;`;
  if (fs.tx || fs.ty || fs.rotate) {
    customStyle += ` transform:translate(${Number(fs.tx)||0}px, ${Number(fs.ty)||0}px) rotate(${Number(fs.rotate)||0}deg) !important; position:relative !important; z-index:32 !important; display:block !important;`;
  }
  if (fs.opacity !== undefined) customStyle += ` opacity:${Number(fs.opacity)/100} !important;`;
  if (fs.hasShadow) customStyle += ` filter:drop-shadow(0 12px 20px rgba(15, 23, 42, 0.32)) !important;`;

  const styleAttr = customStyle.trim() ? `style="${customStyle.trim()}"` : '';
  const isSelectedClass = (isEditable && activeInlineFieldKey === key) ? 'inline-selected' : '';

  if (!isEditable) {
    return `<${tag} class="${className}" data-field-key="${key}" data-field-type="text" ${styleAttr}>${safeText}</${tag}>`;
  }

  return `
    <${tag} 
      class="${className} inline-editable-text ${isSelectedClass}" 
      ${styleAttr}
      contenteditable="true" 
      data-field-key="${key}"
      data-field-type="text"
      title="Sürükleyerek taşıyın, köşelerinden küçültüp büyütün veya tıklayarak yazıyı düzenleyin"
      onmousedown="handleInlineTextMouseDown(event, ${pageIndex}, '${key}', this)"
      onfocus="handleInlineTextFocus(${pageIndex}, '${key}', this)"
      onclick="handleInlineTextFocus(${pageIndex}, '${key}', this)"
      onblur="handleInlineTextChange(${pageIndex}, '${key}', this)"
    >${safeText}</${tag}>
  `;
}

function makeInlineImage(pageIndex, key, currentUrl, fallbackUrl, imgClass = '', containerClass = '', alt = '') {
  const page = magazineData?.pages?.[pageIndex];
  const isEditable = (appMode === 'edit' && pageIndex === selectedEditIndex && canUserEditPage(page));
  const safeUrl = escapeHtml(currentUrl || fallbackUrl);
  const safeFallback = escapeHtml(fallbackUrl);

  const fs = page?.fieldStyles?.[key] || {};
  let contStyle = '';
  let imgStyle = '';
  if (fs.borderRadius !== undefined) {
    contStyle += `border-radius:${fs.borderRadius}px; `;
    imgStyle += `border-radius:${fs.borderRadius}px; `;
  }
  if (fs.opacity !== undefined) contStyle += `opacity:${Number(fs.opacity)/100}; `;
  if (fs.hasShadow) contStyle += `filter:drop-shadow(0 12px 20px rgba(15, 23, 42, 0.35)); `;
  if (fs.objectFit) imgStyle += `object-fit:${fs.objectFit}; `;
  if (fs.mask && fs.mask !== 'none') imgStyle += `clip-path:${getClipPathForMask(fs.mask)}; `;

  const contStyleAttr = contStyle ? `style="${contStyle.trim()}"` : '';
  const imgStyleAttr = imgStyle ? `style="${imgStyle.trim()}"` : '';
  const isSelectedClass = (isEditable && activeInlineFieldKey === key) ? 'inline-selected' : '';

  if (!isEditable) {
    return `
      <div class="template-image-container ${containerClass}" data-field-key="${key}" data-field-type="image" ${contStyleAttr}>
        <img src="${safeUrl}" onerror="this.src='${safeFallback}'" class="${imgClass}" ${imgStyleAttr} alt="${alt}">
      </div>
    `;
  }

  return `
    <div 
      class="template-image-container ${containerClass} ${isSelectedClass}" 
      ${contStyleAttr}
      data-field-key="${key}"
      data-field-type="image"
      title="Sürükleyerek taşıyın, köşelerinden küçültüp büyütün, döndürün veya sağ üstten fotoğrafı değiştirin"
      onmousedown="handleInlineImageMouseDown(event, ${pageIndex}, '${key}', this)"
    >
      <img src="${safeUrl}" onerror="this.src='${safeFallback}'" class="${imgClass} pointer-events-none" ${imgStyleAttr} alt="${alt}">
      <label class="img-change-badge" onclick="event.stopPropagation()" title="Yeni Fotoğraf Yükle / Değiştir">
        <i class="ph ph-camera text-sm"></i>
        <span>Görseli Değiştir</span>
        <input type="file" accept="image/*" onchange="uploadTemplateImageInline(event, ${pageIndex}, '${key}')" class="hidden">
      </label>
    </div>
  `;
}

function renderTemplateHTML(page, pageIndex) {
  const accent = page.accentColor || '#4f46e5';

  // 1. K1 • ÖN DIŞ KAPAK (4 Mizanpaj Ekolü)
  if (page.type === 'cover' || page.type === 'k1') {
    const layout = page.layout || 'minimalist';
    let highlights = (page.highlights || '').split('\n').filter(Boolean);
    if (highlights.length === 0) highlights = ['Özel Dosya', 'Ayın Konusu', 'Geleceğin Trendleri'];

    // 1A. MINIMALIST (Kamer Ekolü)
    if (layout === 'minimalist') {
      return `
        <div class="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-[#f4f2ee] text-stone-900 font-serif select-none overflow-hidden">
          <div class="flex justify-between items-center pb-2 border-b border-stone-300 text-[11px] tracking-widest uppercase font-semibold text-stone-600">
            ${makeInlineEditable(pageIndex, 'issueTag', page.issueTag || 'SAYI 01 | EKİM 2026', 'span')}
            ${makeInlineEditable(pageIndex, 'price', page.price || 'OKUL E-DERGİSİ', 'span')}
          </div>

          <div class="my-auto py-2">
            ${makeInlineEditable(pageIndex, 'magazineName', page.magazineName || 'KAMER', 'h1', 'text-5xl sm:text-7xl font-serif font-black tracking-tight text-stone-900 uppercase my-3 leading-none')}
            
            <div class="flex flex-col sm:flex-row gap-4 h-[380px] sm:h-[420px] mt-2">
              <!-- Sol Metin Bloğu (Vurgulu Kutu) -->
              <div class="w-full sm:w-1/2 bg-black text-white p-5 sm:p-6 rounded-2xl flex flex-col justify-between shadow-xl">
                <div>
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider mb-3" style="background-color: ${accent}">KAPAK DOSYASI</span>
                  ${makeInlineEditable(pageIndex, 'mainHeadline', page.mainHeadline || 'Güçlü Lider', 'h2', 'text-2xl sm:text-3xl font-serif font-bold leading-tight mb-2 text-white')}
                  ${makeInlineEditable(pageIndex, 'subHeadline', page.subHeadline || 'Kapak hikayesi için destek ve tanıtım metni buraya girilecektir.', 'p', 'text-xs text-stone-300 font-sans leading-relaxed mb-3')}
                </div>
                <div class="border-t border-stone-700 pt-3 space-y-1.5 font-sans">
                  ${highlights.map(h => `
                    <div class="text-xs text-stone-300 flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background-color: ${accent}"></span>
                      <span class="truncate">${escapeHtml(h)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Sağ Görsel Bloğu -->
              <div class="w-full sm:w-1/2 h-full relative rounded-2xl overflow-hidden shadow-lg border-2 border-stone-300/80 bg-stone-200">
                ${makeInlineImage(pageIndex, 'coverImage', page.coverImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'w-full h-full object-cover', 'w-full h-full', 'Kapak Görseli')}
                <div class="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded shadow text-stone-800 flex items-center gap-1.5">
                  ${renderBarcodeSvg('#1c1917')}
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center pt-2 border-t border-stone-300 text-[10px] font-sans font-semibold text-stone-500 uppercase tracking-widest">
            <span>${escapeHtml(magazineData.schoolName)}</span>
            <span>Öğrenci & Yayın Masası</span>
          </div>
        </div>
      `;
    }

    // 1B. BRUTALIST (Resimlik Ekolü)
    if (layout === 'brutalist') {
      return `
        <div class="relative w-full h-full flex flex-col justify-between p-6 sm:p-7 text-white font-sans overflow-hidden select-none" style="background-color: ${accent || '#2563eb'}">
          <div class="flex justify-between items-center text-xs font-black uppercase tracking-wider text-white/90 border-b-2 border-white/30 pb-2 z-10">
            ${makeInlineEditable(pageIndex, 'issueTag', page.issueTag || 'SAYI 04', 'span')}
            ${makeInlineEditable(pageIndex, 'price', page.price || '2026', 'span')}
          </div>

          <!-- Arka Plan Büyük Tipografi -->
          <div class="relative my-auto flex flex-col items-center justify-center">
            ${makeInlineEditable(pageIndex, 'magazineName', page.magazineName || 'RESİMLİK', 'h1', 'text-6xl sm:text-8xl font-black uppercase tracking-tighter text-center leading-none text-white/90 mix-blend-overlay my-[-10px] select-none')}

            <!-- Eğik Görsel Kartı -->
            <div class="w-60 sm:w-72 h-64 sm:h-72 my-[-20px] sm:my-[-30px] z-10 transform -rotate-3 border-4 border-white shadow-2xl overflow-hidden rounded-xl bg-white/20 backdrop-blur">
              ${makeInlineImage(pageIndex, 'coverImage', page.coverImage, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', 'w-full h-full object-cover', 'w-full h-full', 'Kapak Görseli')}
            </div>

            <!-- Eğik Başlık Rozeti -->
            <div class="z-20 text-center mt-6 inline-block mx-auto px-6 py-2.5 transform rotate-2 bg-yellow-300 text-slate-950 font-black shadow-2xl rounded-lg">
              ${makeInlineEditable(pageIndex, 'mainHeadline', page.mainHeadline || 'YENİ GÖRÜNÜMLER', 'h2', 'text-2xl sm:text-3xl font-black tracking-tight uppercase')}
            </div>

            ${makeInlineEditable(pageIndex, 'subHeadline', page.subHeadline || 'LİT POPÜLER KÜLTÜR VE GENÇLİK DOSYASI', 'p', 'mt-3 font-bold text-xs uppercase tracking-widest text-center text-white/95 px-4')}
          </div>

          <div class="flex justify-between items-center pt-3 border-t-2 border-white/30 text-xs font-bold text-white z-10">
            <span class="truncate max-w-[200px]">${escapeHtml(highlights[0] || 'Özel Dosya')}</span>
            <div class="flex items-center gap-2 bg-white/20 px-2 py-0.5 rounded backdrop-blur">
              ${renderBarcodeSvg('#ffffff')}
            </div>
          </div>
        </div>
      `;
    }

    // 1C. MODULAR (Konak Ekolü)
    if (layout === 'modular') {
      return `
        <div class="w-full h-full p-4 sm:p-5 bg-stone-100 text-slate-800 font-sans select-none overflow-hidden">
          <div class="w-full h-full border-2 border-slate-900 p-4 sm:p-5 flex flex-col justify-between rounded-lg">
            
            <div class="flex justify-between items-end border-b-2 border-slate-900 pb-2 mb-3">
              ${makeInlineEditable(pageIndex, 'magazineName', page.magazineName || 'KONAK', 'h1', 'text-4xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-none')}
              <div class="text-right text-xs uppercase font-bold text-slate-700">
                ${makeInlineEditable(pageIndex, 'price', page.price || 'EV & YAŞAM', 'div')}
                ${makeInlineEditable(pageIndex, 'issueTag', page.issueTag || 'SAYI 01', 'div', 'text-slate-500 font-mono')}
              </div>
            </div>

            <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 min-h-0">
              <!-- Sol 2 Kolon: Ana Görsel -->
              <div class="sm:col-span-2 border-2 border-slate-900 rounded-lg overflow-hidden relative bg-stone-200 min-h-[220px]">
                ${makeInlineImage(pageIndex, 'coverImage', page.coverImage, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'w-full h-full object-cover', 'w-full h-full', 'Kapak Görseli')}
                <div class="absolute bottom-2 left-2 bg-white border border-slate-900 px-2 py-1 text-[10px] font-bold uppercase shadow">
                  ${makeInlineEditable(pageIndex, 'subHeadline', page.subHeadline || 'TASARIM ÖDÜLLERİ VE YAŞAM ALANLARI', 'span')}
                </div>
              </div>

              <!-- Sağ 1 Kolon: Kutu Yığını -->
              <div class="sm:col-span-1 flex flex-col gap-2.5">
                <div class="border-2 border-slate-900 p-3 bg-slate-900 text-white rounded-lg flex flex-col justify-center">
                  <span class="text-[9px] uppercase font-bold tracking-widest text-amber-400 block mb-1">BAŞLIK</span>
                  ${makeInlineEditable(pageIndex, 'mainHeadline', page.mainHeadline || 'TARZ DENEYİMLERİ', 'h2', 'text-lg sm:text-xl font-bold leading-tight')}
                </div>

                <div class="border-2 border-slate-900 p-3 bg-white rounded-lg flex-1 flex flex-col justify-around">
                  ${highlights.map(h => `
                    <div class="text-[11px] font-bold text-slate-700 pb-1 border-b border-slate-200 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full" style="background-color: ${accent}"></span>
                      <span class="truncate">${escapeHtml(h)}</span>
                    </div>
                  `).join('')}
                </div>

                <div class="border-2 border-slate-900 p-2 bg-stone-200 rounded-lg flex items-center justify-between">
                  ${renderBarcodeSvg('#0f172a')}
                  <span class="text-[9px] font-mono font-bold text-slate-700 truncate max-w-[100px]">${escapeHtml(magazineData.schoolName)}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center pt-2 border-t-2 border-slate-900 text-[10.5px] font-bold uppercase text-slate-600">
              <span>${escapeHtml(magazineData.schoolName)}</span>
              <span>Kültür & Sanat Serisi</span>
            </div>

          </div>
        </div>
      `;
    }

    // 1D. FULLSCREEN (Doğal Ekolü - Varsayılan / Tam Ekran)
    return `
      <div class="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden bg-slate-950 font-serif select-none">
        <div class="absolute inset-0 w-full h-full">
          ${makeInlineImage(pageIndex, 'coverImage', page.coverImage, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 'w-full h-full object-cover opacity-75 scale-105', 'w-full h-full', 'Kapak')}
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none"></div>
        
        <div class="relative z-10 text-center border-b border-white/25 pb-3">
          <div class="flex justify-between items-center text-[10px] tracking-[0.25em] uppercase font-semibold text-indigo-300 mb-1">
            ${makeInlineEditable(pageIndex, 'issueTag', page.issueTag || 'SAYI #1 • EKİM 2026', 'span')}
            ${makeInlineEditable(pageIndex, 'price', page.price || 'YAŞAM ALANLARI', 'span')}
          </div>
          ${makeInlineEditable(pageIndex, 'magazineName', page.magazineName || 'DOĞAL', 'h1', 'font-display font-extrabold text-4xl sm:text-6xl tracking-tighter uppercase text-white drop-shadow-lg')}
          <div class="text-[11px] font-medium text-slate-300 tracking-widest uppercase mt-0.5">${escapeHtml(magazineData.schoolName)}</div>
        </div>

        <div class="relative z-10 space-y-3.5 my-auto pt-8">
          <span class="inline-block px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider text-white shadow" style="background-color: ${accent}">
            AYIN DOSYASI
          </span>
          ${makeInlineEditable(pageIndex, 'mainHeadline', page.mainHeadline || 'VAHŞİ YAŞAMIN BÜYÜSÜ', 'h2', 'font-serif font-bold text-2xl sm:text-4xl leading-tight text-white drop-shadow')}
          ${makeInlineEditable(pageIndex, 'subHeadline', page.subHeadline || 'Gezegenin Paydaşları ve Korunan Alanlar...', 'p', 'text-xs sm:text-sm text-slate-200 line-clamp-3 font-light leading-relaxed')}
        </div>

        <div class="relative z-10 pt-3 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
            ${highlights.map(h => `
              <div class="flex items-center gap-2 text-xs text-slate-200 font-medium">
                <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${accent}"></span>
                <span class="truncate">${escapeHtml(h)}</span>
              </div>
            `).join('')}
          </div>
          <div class="shrink-0 bg-black/40 px-2 py-1 rounded backdrop-blur border border-white/20">
            ${renderBarcodeSvg('#ffffff')}
          </div>
        </div>
      </div>
    `;
  }

  // 2. K2 • ÖN KAPAK İÇİ (Atatürk / Sunuş / Sanatsal)
  if (page.type === 'k2') {
    const subType = page.subType || 'ataturk';

    if (subType === 'ataturk') {
      return `
        <div class="p-6 sm:p-8 flex flex-col h-full justify-between overflow-y-auto bg-stone-50 border-r border-stone-200">
          <div class="text-center border-b border-red-900/20 pb-3">
            <span class="text-[10px] tracking-[0.25em] font-bold uppercase text-red-800 block mb-1">CUMHURİYET VE GELECEK</span>
            ${makeInlineEditable(pageIndex, 'headerText', page.headerText || 'TÜRK GENÇLİĞİNE HİTABE', 'h2', 'font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-wide')}
          </div>

          <div class="my-auto py-3 flex flex-col items-center text-center space-y-3">
            <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-600/40 p-1 bg-white">
              ${makeInlineImage(pageIndex, 'image', page.image, 'https://placehold.co/400x400/991b1b/ffffff?text=Ataturk', 'w-full h-full object-cover rounded-xl', 'w-full h-full', 'Atatürk')}
            </div>
            ${makeInlineEditable(pageIndex, 'subText', page.subText || 'Ey Türk Gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyeti\'ni, ilelebet muhafaza ve müdafaa etmektir.', 'p', 'font-serif italic text-xs sm:text-[13px] text-slate-800 leading-relaxed px-4 max-w-md')}
            ${makeInlineEditable(pageIndex, 'author', page.author || 'Gazi Mustafa Kemal Atatürk', 'div', 'text-xs font-bold text-red-950 uppercase tracking-wider font-display')}
          </div>

          <div class="p-3 rounded-2xl bg-red-950 text-amber-200 text-center font-serif text-xs italic shadow-md">
            ${makeInlineEditable(pageIndex, 'quote', page.quote || 'Bütün ümidim gençliktedir.', 'div', 'text-amber-200')}
          </div>
        </div>
      `;
    }

    if (subType === 'director') {
      return `
        <div class="p-6 sm:p-8 flex flex-col h-full justify-between overflow-y-auto bg-slate-50">
          <div>
            <span class="text-[10px] font-bold tracking-widest uppercase text-indigo-600 block mb-1">SUNUŞ / BAŞYAZI</span>
            ${makeInlineEditable(pageIndex, 'headerText', page.headerText || 'Sunuş', 'h2', 'font-serif font-bold text-2xl text-slate-900 mb-3')}
            <div class="flex items-center gap-3.5 mb-4 p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                ${makeInlineImage(pageIndex, 'image', page.image, 'https://placehold.co/200x200/e2e8f0/475569?text=Mudur', 'w-full h-full object-cover', 'w-full h-full', 'Yazar')}
              </div>
              <div>
                ${makeInlineEditable(pageIndex, 'author', page.author || 'Okul Müdürü', 'div', 'font-bold text-sm text-slate-900')}
                <div class="text-[11px] text-slate-500 font-medium">${escapeHtml(magazineData.schoolName)}</div>
              </div>
            </div>
            ${makeInlineEditable(pageIndex, 'subText', page.subText, 'p', 'text-xs text-slate-700 leading-relaxed whitespace-pre-line text-justify')}
          </div>
          ${makeInlineEditable(pageIndex, 'author', page.author || 'Okul Yönetimi', 'div', 'text-right pt-3 border-t border-slate-200 font-handwriting text-lg text-slate-800')}
        </div>
      `;
    }

    return `
      <div class="relative w-full h-full flex flex-col justify-end p-8 text-white overflow-hidden bg-slate-950">
        <div class="absolute inset-0 w-full h-full">
          ${makeInlineImage(pageIndex, 'image', page.image, 'https://placehold.co/800x1100/1e1b4b/ffffff?text=Sanat', 'w-full h-full object-cover opacity-80', 'w-full h-full', 'Vizyon')}
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
        <div class="relative z-10 space-y-2">
          <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-300">VİZYONUMUZ</span>
          ${makeInlineEditable(pageIndex, 'headerText', page.headerText, 'h2', 'font-serif italic font-bold text-2xl leading-snug')}
          ${makeInlineEditable(pageIndex, 'subText', page.subText, 'p', 'text-xs text-slate-300 leading-relaxed')}
        </div>
      </div>
    `;
  }

  // 3. GÖMÜLÜ VİDEO SAYFASI
  if (page.type === 'video') {
    return `
      <div class="p-6 md:p-7 flex flex-col h-full justify-between overflow-y-auto bg-slate-950 text-white">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              VİDEO KÖŞESİ
            </span>
            ${makeInlineEditable(pageIndex, 'author', page.author, 'span', 'text-[11px] text-slate-400 font-medium')}
          </div>

          ${makeInlineEditable(pageIndex, 'title', page.title, 'h2', 'font-serif font-bold text-xl md:text-2xl text-white leading-snug mb-1')}
          ${makeInlineEditable(pageIndex, 'subTitle', page.subTitle, 'p', 'text-xs text-slate-300 mb-3')}

          <div class="relative rounded-2xl overflow-hidden mb-3 bg-black border border-slate-800 shadow-2xl aspect-video group">
            <video controls preload="metadata" poster="${escapeHtml(page.videoPoster || '')}" class="w-full h-full object-cover">
              <source src="${escapeHtml(page.videoUrl || '')}" type="video/mp4">
            </video>
            ${(appMode === 'edit' && pageIndex === selectedEditIndex) ? `
              <label class="absolute top-2 right-2 px-2.5 py-1.5 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white text-[11px] font-bold cursor-pointer shadow-lg flex items-center gap-1.5 transition opacity-90 hover:opacity-100" title="Videoyu Değiştir">
                <i class="ph ph-video-camera text-sm"></i>
                <span>Videoyu Değiştir (MP4)</span>
                <input type="file" accept="video/mp4,video/*" onchange="uploadPageVideo(event)" class="hidden">
              </label>
            ` : ''}
          </div>

          ${makeInlineEditable(pageIndex, 'caption', page.caption, 'div', 'text-[11px] text-slate-400 italic mb-2')}
        </div>

        ${makeInlineEditable(pageIndex, 'notes', page.notes, 'div', 'p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed')}
      </div>
    `;
  }

  // 4. K3 • ARKA KAPAK İÇİ (Künye & Gelecek Sayı)
  if (page.type === 'k3') {
    return `
      <div class="p-6 sm:p-7 flex flex-col h-full justify-between overflow-y-auto bg-slate-900 text-white">
        <div>
          <div class="border-b border-slate-800 pb-2.5 mb-3">
            <span class="text-[10px] font-bold tracking-widest uppercase text-indigo-400 block mb-0.5">RESMİ YAYIN KÜNYESİ</span>
            ${makeInlineEditable(pageIndex, 'boardTitle', page.boardTitle || 'UFUK E-DERGİ YAYIN KURULU', 'h2', 'font-serif font-bold text-lg text-white')}
          </div>

          <div class="space-y-2 text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 mb-4">
            <div><strong>İmtiyaz Sahibi:</strong> ${makeInlineEditable(pageIndex, 'publisher', page.publisher, 'span', 'text-white')}</div>
            <div><strong>Genel Yayın Yönetmeni:</strong> ${makeInlineEditable(pageIndex, 'editorInChief', page.editorInChief, 'span', 'text-white')}</div>
            <div><strong>Yayın Danışmanı:</strong> ${makeInlineEditable(pageIndex, 'advisor', page.advisor, 'span', 'text-white')}</div>
            <div><strong>Yazı İşleri & Mizanpaj:</strong> ${makeInlineEditable(pageIndex, 'editorialTeam', page.editorialTeam, 'span', 'text-white')}</div>
            <div class="pt-1 text-[11px] text-slate-400 border-t border-slate-800/80">${makeInlineEditable(pageIndex, 'contactInfo', page.contactInfo, 'div')}</div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 p-4 rounded-2xl border border-indigo-500/30">
          <div class="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
            <i class="ph ph-sparkle text-base"></i>
            ${makeInlineEditable(pageIndex, 'nextIssueTeaserTitle', page.nextIssueTeaserTitle || 'GELECEK SAYIDA NELER VAR?', 'span')}
          </div>
          ${makeInlineEditable(pageIndex, 'nextIssueText', page.nextIssueText, 'div', 'text-xs text-slate-200 whitespace-pre-line leading-relaxed')}
        </div>
      </div>
    `;
  }

  // 5. K4 • ARKA DIŞ KAPAK
  if (page.type === 'k4' || page.type === 'back') {
    return `
      <div class="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden bg-neutral-950 font-sans select-none">
        <div class="absolute inset-0 w-full h-full">
          ${makeInlineImage(pageIndex, 'coverImage', page.coverImage, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 'w-full h-full object-cover opacity-45 scale-105', 'w-full h-full', 'Arka Kapak')}
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/80 pointer-events-none"></div>

        <div class="relative z-10 text-center border-b border-white/20 pb-3">
          <span class="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-0.5">RESMİ YAYIN KAPANIŞI</span>
          ${makeInlineEditable(pageIndex, 'schoolName', page.schoolName || magazineData.schoolName, 'h2', 'font-display font-extrabold text-2xl sm:text-3xl tracking-wider text-white uppercase')}
          ${makeInlineEditable(pageIndex, 'motto', page.motto || 'Eğitimde Öncü, Sanatta ve Bilimde Işık', 'div', 'text-xs italic text-stone-300 font-serif mt-1')}
        </div>

        <div class="relative z-10 my-auto py-4 flex flex-col items-center text-center space-y-4">
          <!-- Prestij Halka Rozeti -->
          <div class="w-32 h-32 rounded-full border-4 border-white/30 flex flex-col items-center justify-center bg-white/10 backdrop-blur shadow-2xl relative p-3">
            <img src="${escapeHtml(page.qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dergimiz.com.tr')}" alt="QR Kod" class="w-20 h-20 object-contain rounded-lg bg-white p-1 shadow">
          </div>

          <div class="max-w-sm space-y-1.5">
            ${makeInlineEditable(pageIndex, 'closingQuote', page.closingQuote || '\"Hayata ve geleceğe değer katan tasarımlar.\"', 'div', 'text-sm sm:text-base font-serif italic text-amber-200')}
            ${makeInlineEditable(pageIndex, 'qrText', page.qrText || 'Dergimizi çevrim içi okumak ve arşivimize ulaşmak için karekodu okutun.', 'div', 'text-xs text-stone-300 font-light')}
          </div>
        </div>

        <div class="relative z-10 pt-3 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-2">
          ${makeInlineEditable(pageIndex, 'social', page.social || '@dergimiz • dergimiz.com.tr', 'div', 'text-[11px] text-stone-400 font-mono')}
          <div class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest border border-white/30 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur hover:bg-white hover:text-black transition cursor-pointer">
            ${renderBarcodeSvg('#ffffff')}
            <span>DERGİMİZ.COM.TR</span>
          </div>
        </div>
      </div>
    `;
  }

  // 6. BOŞ TUVAL (Freeform Canvas)
  if (page.type === 'freeform') {
    return `
      <div class="p-6 md:p-8 flex flex-col h-full justify-center items-center text-center">
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-500 mb-3 shadow-sm">
          <i class="ph ph-bounding-box text-3xl"></i>
        </div>
        <h3 class="font-serif font-bold text-lg text-slate-800 mb-1">Serbest Mizanpaj Tuvali</h3>
        <p class="text-xs text-slate-500 max-w-xs mb-4">Üstteki araç çubuğundan metin kutuları, resimler veya videolar ekleyip istediğiniz yere sürükleyin.</p>
        <div class="flex gap-2">
          <button onclick="addCanvasElement('text')" class="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-500 transition">+ Metin Ekle</button>
        </div>
      </div>
    `;
  }

  // 7. İÇİNDEKİLER & BAŞYAZI
  if (page.type === 'toc') {
    const tocItems = (magazineData.pages || []).map((p, idx) => ({
      num: idx + 1,
      title: p.navTitle || ('Sayfa ' + (idx + 1))
    }));

    return `
      <div class="p-6 md:p-8 flex flex-col h-full justify-between overflow-y-auto bg-stone-50 text-slate-900 font-sans select-none">
        <div>
          <div class="flex items-center justify-between border-b-2 pb-2 mb-4" style="border-color: ${accent}">
            <span class="text-xs font-bold tracking-widest uppercase" style="color: ${accent}">EDİTÖRÜN MASASI</span>
            <span class="text-[11px] text-slate-400 font-medium">İÇİNDEKİLER & BAŞYAZI</span>
          </div>

          ${makeInlineEditable(pageIndex, 'editorTitle', page.editorTitle || 'Bu Sayıya Dair', 'h2', 'font-serif font-bold text-2xl text-slate-900 mb-3 leading-snug')}

          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shrink-0 shadow-md border-2 border-slate-200 overflow-hidden bg-white">
              ${makeInlineImage(pageIndex, 'editorImage', page.editorImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'w-full h-full object-cover', 'w-full h-full', 'Editör')}
            </div>
            <div class="flex-1 space-y-2">
              <div class="p-2.5 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-xs italic font-serif text-slate-800">
                "${makeInlineEditable(pageIndex, 'editorQuote', page.editorQuote || 'Dergimizi hazırlarken ilhamımızı sokaklardan, sanattan ve teknolojiden alıyoruz.', 'span')}"
              </div>
              ${makeInlineEditable(pageIndex, 'editorText', page.editorText || 'Editörün mektubu, samimi veya resmi olabilen, çeşitli nedenler için yazılmış bir mesajdır. Okuyucunun belirli bir konunun içeriğini ve kreatif yönünü anlamasına yardımcı olabilir...', 'div', 'text-xs text-slate-600 leading-relaxed whitespace-pre-line')}
              <div class="text-right text-xs font-bold text-slate-800 pt-1">— ${makeInlineEditable(pageIndex, 'editorName', page.editorName || 'Genel Yayın Yönetmeni', 'span')}</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm my-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
            <i class="ph ph-book-open text-base" style="color: ${accent}"></i> Bu Sayıda Neler Var? (İçindekiler)
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            ${tocItems.map(item => `
              <div onclick="goToPage(${item.num - 1})" class="flex items-center gap-2.5 text-xs py-1.5 px-2.5 rounded-xl hover:bg-indigo-50 border border-slate-100 cursor-pointer transition">
                <span class="font-bold text-[11px] w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm" style="background-color: ${accent}">${item.num}</span>
                <span class="font-medium text-slate-700 truncate">${escapeHtml(item.title)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
          <div><strong class="text-slate-700">Yayın Masası:</strong> ${makeInlineEditable(pageIndex, 'editorialBoard', page.editorialBoard || 'Dergimiz Okul Yayın Kurulu', 'span')}</div>
          <div>${renderBarcodeSvg('#64748b')}</div>
        </div>
      </div>
    `;
  }

  // 8. HABER / MAKALE
  if (page.type === 'article') {
    return `
      <div class="p-6 md:p-8 flex flex-col h-full justify-between overflow-y-auto bg-white text-slate-900 font-sans select-none">
        <div>
          <!-- Üst Banner & Kategori -->
          <div class="flex items-center justify-between border-b pb-2 mb-3 border-slate-200">
            <div class="flex items-center gap-2">
              ${makeInlineEditable(pageIndex, 'category', page.category || 'ÖZEL DOSYA', 'span', 'px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm', `background-color: ${accent}`)}
              <span class="text-xs text-slate-400 font-medium">— ${makeInlineEditable(pageIndex, 'author', page.author || 'Yazan: Araştırma Kulübü', 'span')}</span>
            </div>
            <span class="text-[10.5px] uppercase font-mono font-semibold text-slate-400">${escapeHtml(magazineData.schoolName)}</span>
          </div>

          <!-- Başlık Alanı -->
          <div class="relative mb-4">
            ${makeInlineEditable(pageIndex, 'title', page.title || 'GELECEĞİN YENİ KURALLARI', 'h2', 'font-serif font-black text-2xl md:text-3xl text-slate-900 leading-tight')}
          </div>

          <!-- Geniş Manşet Görseli -->
          <div class="relative rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-200 shadow-md">
            ${makeInlineImage(pageIndex, 'image', page.image, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80', 'w-full h-44 sm:h-52 object-cover', 'w-full h-44 sm:h-52', 'Haber')}
            <div class="bg-slate-900/90 backdrop-blur text-white text-[10px] px-3 py-1 flex justify-between items-center">
              <span>${makeInlineEditable(pageIndex, 'imageCaption', page.imageCaption || 'Görsel: Okul kulüplerinin proje atölye çalışmasından bir kare.', 'span')}</span>
              <span class="opacity-70">${renderBarcodeSvg('#ffffff')}</span>
            </div>
          </div>

          <!-- İki Sütunlu Metin & Vurgu Alıntısı -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2 text-xs text-slate-700 leading-relaxed columns-1 sm:columns-2 gap-4 whitespace-pre-line text-justify font-serif">
              ${makeInlineEditable(pageIndex, 'content', page.content || 'Tasarım ve edebiyat dünyasındaki yenilikler üzerine derinlemesine bir analiz. Metinler rahat okunması adına kolonlara bölünür ve zenginleştirilir.\n\nÖğrencilerimizin hazırladığı bu özel dosyada güncel gelişmeleri ele aldık.', 'div')}
            </div>

            <div class="sm:col-span-1 space-y-3">
              <div class="p-3.5 rounded-2xl bg-stone-50 border-l-4 text-xs italic font-serif text-slate-800 shadow-sm" style="border-color: ${accent}">
                "${makeInlineEditable(pageIndex, 'pullQuote', page.pullQuote || 'Yaratıcılık, sınırları zorlamakla başlar.', 'span')}"
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10.5px] text-slate-500 font-sans">
                <strong>Yazar Notu:</strong> Bu çalışma dergimiz yayın kurulu tarafından hazırlanmıştır.
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
          <span>Sayfa Özel Dosyası</span>
          <span>${renderBarcodeSvg('#94a3b8')}</span>
        </div>
      </div>
    `;
  }

  // 9. RÖPORTAJ
  if (page.type === 'interview') {
    return `
      <div class="p-6 md:p-7 flex flex-col h-full justify-between overflow-y-auto">
        <div class="flex items-center gap-4 p-3.5 rounded-2xl text-white mb-3 shadow-md" style="background: linear-gradient(135deg, ${accent}, #1e1b4b)">
          <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow border-2 border-white/80">
            ${makeInlineImage(pageIndex, 'photo', page.photo, 'https://placehold.co/300x300/e2e8f0/475569?text=Konuk', 'w-full h-full object-cover', 'w-full h-full', 'Konuk')}
          </div>
          <div>
            ${makeInlineEditable(pageIndex, 'rubric', page.rubric || 'AYIN SÖYLEŞİSİ', 'span', 'text-[10px] uppercase tracking-widest font-bold text-white/80 block')}
            ${makeInlineEditable(pageIndex, 'interviewee', page.interviewee, 'h2', 'font-serif font-bold text-lg leading-tight')}
            ${makeInlineEditable(pageIndex, 'role', page.role, 'div', 'text-xs text-white/90 font-medium mb-1')}
            ${makeInlineEditable(pageIndex, 'intro', page.intro, 'p', 'text-[10.5px] text-white/80 leading-snug line-clamp-2')}
          </div>
        </div>

        <div class="space-y-2.5 flex-1">
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div class="text-xs font-bold text-slate-900 mb-1 flex items-start gap-1.5">
              <span class="px-1.5 rounded text-[10px] text-white shrink-0 mt-0.5" style="background-color: ${accent}">S1</span>
              ${makeInlineEditable(pageIndex, 'q1', page.q1, 'span', 'font-bold')}
            </div>
            ${makeInlineEditable(pageIndex, 'a1', page.a1, 'p', 'text-[11px] text-slate-600 leading-relaxed pl-5')}
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div class="text-xs font-bold text-slate-900 mb-1 flex items-start gap-1.5">
              <span class="px-1.5 rounded text-[10px] text-white shrink-0 mt-0.5" style="background-color: ${accent}">S2</span>
              ${makeInlineEditable(pageIndex, 'q2', page.q2, 'span', 'font-bold')}
            </div>
            ${makeInlineEditable(pageIndex, 'a2', page.a2, 'p', 'text-[11px] text-slate-600 leading-relaxed pl-5')}
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div class="text-xs font-bold text-slate-900 mb-1 flex items-start gap-1.5">
              <span class="px-1.5 rounded text-[10px] text-white shrink-0 mt-0.5" style="background-color: ${accent}">S3</span>
              ${makeInlineEditable(pageIndex, 'q3', page.q3, 'span', 'font-bold')}
            </div>
            ${makeInlineEditable(pageIndex, 'a3', page.a3, 'p', 'text-[11px] text-slate-600 leading-relaxed pl-5')}
          </div>
        </div>
      </div>
    `;
  }

  // 10. EDEBİYAT & ŞİİR
  if (page.type === 'literature') {
    return `
      <div class="p-6 md:p-7 flex flex-col h-full justify-between overflow-y-auto bg-amber-50/30">
        <div class="text-center border-b border-slate-200 pb-2.5">
          ${makeInlineEditable(pageIndex, 'header', page.header || 'EDEBİYAT', 'span', 'text-[10px] font-bold tracking-widest uppercase block mb-0.5', `color: ${accent}`)}
          ${makeInlineEditable(pageIndex, 'title', page.title, 'h2', 'font-serif italic font-bold text-2xl text-slate-900')}
          ${makeInlineEditable(pageIndex, 'author', page.author, 'div', 'text-xs text-slate-500 font-medium mt-1')}
        </div>

        <div class="my-auto py-2 flex flex-col items-center">
          <div class="w-full h-28 rounded-xl overflow-hidden mb-3 shadow-sm border border-slate-200">
            ${makeInlineImage(pageIndex, 'bgImage', page.bgImage, 'https://placehold.co/800x300/e2e8f0/475569?text=Sanat', 'w-full h-full object-cover', 'w-full h-full', 'Sanat')}
          </div>
          ${makeInlineEditable(pageIndex, 'poemText', page.poemText, 'div', 'font-serif italic text-xs md:text-sm text-slate-800 leading-loose text-center whitespace-pre-line px-4')}
        </div>

        <div class="p-2.5 rounded-xl bg-white border border-slate-200 text-[10px] text-slate-500 text-center">
          <i class="ph ph-feather mr-1" style="color: ${accent}"></i>
          ${makeInlineEditable(pageIndex, 'bottomNote', page.bottomNote, 'span')}
        </div>
      </div>
    `;
  }

  // 11. QUIZ
  if (page.type === 'quiz') {
    const opts = page.options || ["", "", "", ""];
    return `
      <div class="p-6 md:p-7 flex flex-col h-full justify-between overflow-y-auto">
        <div>
          <div class="flex items-center gap-2 mb-2">
            ${makeInlineEditable(pageIndex, 'title', page.title || 'ETKİLEŞİMLİ KÖŞE', 'span', 'px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white', `background-color: ${accent}`)}
          </div>

          <div class="bg-slate-900 text-white p-4 rounded-2xl shadow-lg mb-3">
            <h3 class="font-display font-bold text-base text-amber-400 mb-1.5 flex items-center gap-1.5">
              <i class="ph ph-lightbulb text-lg"></i>
              ${makeInlineEditable(pageIndex, 'questionTitle', page.questionTitle, 'span')}
            </h3>
            ${makeInlineEditable(pageIndex, 'questionText', page.questionText, 'p', 'text-xs text-slate-200 leading-relaxed mb-3')}

            <div class="space-y-1.5">
              ${opts.map((opt, oIdx) => `
                <div class="w-full text-left px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span><strong>${['A','B','C','D'][oIdx]})</strong> ${escapeHtml(opt)}</span>
                  <i class="ph ph-circle text-slate-500"></i>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <i class="ph ph-star text-amber-500"></i> Bu Ay Ne Okumalı & Ne İzlemeli?
          </h4>
          <div class="text-xs text-slate-700 flex items-center gap-2">
            <span class="font-semibold text-indigo-600 shrink-0">Kitap:</span>
            ${makeInlineEditable(pageIndex, 'bookRec', page.bookRec, 'span', 'truncate')}
          </div>
          <div class="text-xs text-slate-700 flex items-center gap-2">
            <span class="font-semibold text-rose-600 shrink-0">Film:</span>
            ${makeInlineEditable(pageIndex, 'movieRec', page.movieRec, 'span', 'truncate')}
          </div>
        </div>
      </div>
    `;
  }

  // 12. KATALOG & PROJE / ÜRÜN ÖZETİ (FlipHTML5 Görsel 1 & 7 Birebir)
  if (page.type === 'catalog') {
    const pageBg = page.bgColor || '#f7f4f0';
    return `
      <div class="p-6 flex flex-col justify-between h-full overflow-hidden select-none" style="background:${pageBg}; color:#1c1917;">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            ${makeInlineEditable(pageIndex, 'title', page.title || 'Project & Product Overview', 'h2', 'font-serif font-bold text-xl tracking-tight text-stone-900')}
            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase text-white" style="background:${accent}">SPEC SHEET</span>
          </div>
          ${makeInlineEditable(pageIndex, 'content', page.content || 'Modern tasarım ilkeleri ve zarif detaylarla hazırlanan bu özel dosya; estetik, işlevsellik ve yenilikçi malzeme kullanımını bir araya getiriyor.', 'p', 'text-[10.5px] text-stone-600 leading-relaxed mb-3')}

          <!-- 3'lü Dikey Görsel Vitrini (Görsel 1 Sağ Üst) -->
          <div class="grid grid-cols-3 gap-2.5 h-44 mb-3">
            ${makeInlineImage(pageIndex, 'image', page.image, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80', 'w-full h-full object-cover', 'rounded-xl overflow-hidden shadow border border-stone-200 h-full', 'Görsel 1')}
            ${makeInlineImage(pageIndex, 'image2', page.image2, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80', 'w-full h-full object-cover', 'rounded-xl overflow-hidden shadow border border-stone-200 h-full', 'Görsel 2')}
            ${makeInlineImage(pageIndex, 'image3', page.image3, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80', 'w-full h-full object-cover', 'rounded-xl overflow-hidden shadow border border-stone-200 h-full', 'Görsel 3')}
          </div>
        </div>

        <!-- Alt Bilgi Tablosu (Görsel 1: Product Information ITEM | SPECIFICATION) -->
        <div class="bg-white/90 rounded-xl border border-stone-200 overflow-hidden shadow-sm">
          <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white flex justify-between" style="background:${accent || '#7f1d1d'}">
            <span>BAŞLIK / ÖZELLİK</span>
            <span>DETAY & SPESİFİKASYON</span>
          </div>
          <div class="divide-y divide-stone-200 text-[10.5px]">
            <div class="px-3 py-1.5 flex justify-between">
              <strong class="text-stone-700">Proje / Eser Adı</strong>
              ${makeInlineEditable(pageIndex, 'spec1', page.spec1 || 'Özel Tasarım Koleksiyonu', 'span', 'text-stone-600')}
            </div>
            <div class="px-3 py-1.5 flex justify-between bg-stone-50/60">
              <strong class="text-stone-700">Kategori & Alan</strong>
              ${makeInlineEditable(pageIndex, 'spec2', page.spec2 || 'Görsel Sanatlar & Tasarım', 'span', 'text-stone-600')}
            </div>
            <div class="px-3 py-1.5 flex justify-between">
              <strong class="text-stone-700">Dönem / Sezon</strong>
              ${makeInlineEditable(pageIndex, 'spec3', page.spec3 || '2026 - 2027 Bahar Dönemi', 'span', 'text-stone-600')}
            </div>
            <div class="px-3 py-1.5 flex justify-between bg-stone-50/60">
              <strong class="text-stone-700">Hazırlayan Ekip</strong>
              ${makeInlineEditable(pageIndex, 'author', page.author || 'Tasarım & Kültür Atölyesi', 'span', 'text-stone-600')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (page.type === 'blank' || page.type === 'freeform' || (page.type && page.type.startsWith('wireframe_'))) {
    const bg = page.bgColor || '#ffffff';
    return `
      <div class="relative w-full h-full flex flex-col justify-between p-6 select-none overflow-hidden" style="background-color: ${bg};">
        ${(!page.elements || page.elements.length === 0) ? `
          <div class="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300/60 rounded-2xl p-6 text-center text-slate-400 space-y-2 pointer-events-none">
            <i class="ph ph-bounding-box text-4xl text-amber-500/70"></i>
            <span class="font-bold text-sm text-slate-700">Bembeyaz Boş Sayfa (Özgür Mizanpaj)</span>
            <span class="text-xs text-slate-400 max-w-xs">Sol menüden Metin Kutusu, Resim Çerçevesi veya Şekil ekleyerek kendi mizanpajınızı oluşturun.</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  return `<div class="p-6">Sayfa</div>`;
}

// ==========================================
// 7. BAĞLAMA DUYARLI AKILLI SAĞ PANEL: AYARLAR | EYLEMLER | SAYFA METİNLERİ (FAZ 4 & FAZ 5)
// ==========================================
function renderRightEditorPanel() {
  const container = document.getElementById('editorFormContainer');
  const settingsContainer = document.getElementById('rightInspector_settings');
  const actionsContainer = document.getElementById('rightInspector_actions');
  const badge = document.getElementById('editingPageBadge');
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!page) return;

  const isEditable = canUserEditPage(page);
  const lockBanner = document.getElementById('pageLockBanner');
  const pageActions = document.getElementById('pageActionFooter');

  if (badge) badge.textContent = `Sayfa ${selectedEditIndex + 1} • ${getTemplateLabel(page.type)}`;

  if (!isEditable) {
    if (lockBanner) lockBanner.classList.remove('hidden');
    if (pageActions) pageActions.classList.add('hidden');
  } else {
    if (lockBanner) lockBanner.classList.add('hidden');
    if (pageActions) pageActions.classList.remove('hidden');
  }

  renderStatusControl(page);

  // 1. BAĞLAMA DUYARLI "AYARLAR" SEKMESİNİ RENDER ET (Görsel 1, 2, 3, 5, 6)
  if (settingsContainer) {
    renderContextSettingsInspector(page, isEditable, settingsContainer);
  }

  // 2. "EYLEMLER (ACTIONS)" SEKMESİNİ RENDER ET (Görsel 4 & 7)
  if (actionsContainer) {
    renderContextActionsInspector(page, isEditable, actionsContainer);
  }

  const assignWrapper = document.getElementById('assignEditorWrapper');
  const selectEditor = document.getElementById('selectAssignedEditor');
  if (currentUser.role === 'admin') {
    assignWrapper.classList.remove('hidden');
    selectEditor.innerHTML = `
      <option value="ADMIN-SEDAT">Sedat İleri (Admin)</option>
      <option value="ADMIN-NAZMIYE">Nazmiye Hoca (Admin)</option>
      ${editorKeys.map(k => `
        <option value="${k.code}" ${page.assignedEditor === k.code ? 'selected' : ''}>${k.name} (${k.code})</option>
      `).join('')}
    `;
  } else {
    assignWrapper.classList.add('hidden');
  }

  const adminNoteWrapper = document.getElementById('adminNoteInputWrapper');
  const inputNote = document.getElementById('inputAdminNote');
  if (currentUser.role === 'admin') {
    adminNoteWrapper.classList.remove('hidden');
    inputNote.value = page.adminNote || '';
  } else {
    adminNoteWrapper.classList.add('hidden');
  }

  let fieldsHtml = `
    <!-- Mizanpaj Ekolü (Archetype Seçici) -->
    <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
      <div class="flex items-center justify-between">
        <label class="block text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
          <i class="ph ph-layout text-sm"></i> Mizanpaj Ekolü
        </label>
        <span class="text-[10px] text-amber-300 font-mono uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">${page.layout || 'minimalist'}</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button onclick="${isEditable ? `changePageLayout('minimalist')` : ''}" ${!isEditable ? 'disabled' : ''} class="px-2.5 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${(page.layout === 'minimalist' || !page.layout) ? 'bg-amber-600 text-white border-amber-500 shadow-lg' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}">
          <span>🏛️ Minimalist</span>
        </button>
        <button onclick="${isEditable ? `changePageLayout('brutalist')` : ''}" ${!isEditable ? 'disabled' : ''} class="px-2.5 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${page.layout === 'brutalist' ? 'bg-amber-600 text-white border-amber-500 shadow-lg' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}">
          <span>⚡ Brütalist</span>
        </button>
        <button onclick="${isEditable ? `changePageLayout('modular')` : ''}" ${!isEditable ? 'disabled' : ''} class="px-2.5 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${page.layout === 'modular' ? 'bg-amber-600 text-white border-amber-500 shadow-lg' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}">
          <span>📐 Modüler</span>
        </button>
        <button onclick="${isEditable ? `changePageLayout('fullscreen')` : ''}" ${!isEditable ? 'disabled' : ''} class="px-2.5 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${page.layout === 'fullscreen' ? 'bg-amber-600 text-white border-amber-500 shadow-lg' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}">
          <span>🌄 Fullscreen</span>
        </button>
      </div>
    </div>

    <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-3">
      <div>
        <label class="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Menü / İçindekiler Başlığı</label>
        <input type="text" value="${escapeAttr(page.navTitle)}" ${!isEditable ? 'disabled' : ''} oninput="updatePageField('navTitle', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none disabled:opacity-40">
      </div>
      <div>
        <label class="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Sayfa Vurgu Rengi</label>
        <div class="flex items-center gap-2">
          ${colorSwatches.map(c => `
            <button onclick="${isEditable ? `updatePageField('accentColor', '${c.hex}')` : ''}" class="w-6 h-6 rounded-full border-2 transition transform hover:scale-110 ${page.accentColor === c.hex ? 'border-white scale-110' : 'border-transparent'}" style="background-color: ${c.hex}" title="${c.name}"></button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // ŞABLON ÖZEL FORMLARI
  if (page.type === 'cover' || page.type === 'k1') {
    fieldsHtml += `
      ${createInputField('Dergi Adı (Masthead Logo)', 'magazineName', page.magazineName, isEditable)}
      ${createInputField('Üst Sayı Etiketi', 'issueTag', page.issueTag, isEditable)}
      ${createInputField('Üst Kategori / Fiyat / Etiket', 'price', page.price, isEditable)}
      ${createInputField('Ana Manşet Başlığı', 'mainHeadline', page.mainHeadline, isEditable)}
      ${createTextareaField('Alt Manşet Açıklaması', 'subHeadline', page.subHeadline, 2, isEditable)}
      ${createImageField('Kapak Tam Boy Görseli', 'coverImage', page.coverImage, isEditable)}
      ${createTextareaField('Kapak Alt Spotları (Her satıra bir konu)', 'highlights', page.highlights, 3, isEditable)}
    `;
  } else if (page.type === 'k2') {
    fieldsHtml += `
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
        <label class="block text-xs font-semibold text-amber-400 uppercase">K2 Sayfa Tipi Seçimi</label>
        <select onchange="updatePageField('subType', this.value)" ${!isEditable ? 'disabled' : ''} class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
          <option value="ataturk" ${page.subType === 'ataturk' ? 'selected' : ''}>🇹🇷 Seçenek A: Atatürk & Gençliğe Hitabe</option>
          <option value="director" ${page.subType === 'director' ? 'selected' : ''}>✍️ Seçenek B: Müdür / Sunuş Başyazısı</option>
          <option value="artistic" ${page.subType === 'artistic' ? 'selected' : ''}>🎨 Seçenek C: Tam Sayfa Sanatsal Vizyon</option>
        </select>
      </div>
      ${createInputField('Başlık', 'headerText', page.headerText, isEditable)}
      ${createTextareaField('Metin / Hitabe / Mesaj', 'subText', page.subText, 4, isEditable)}
      ${createInputField('İmza / Yazar', 'author', page.author, isEditable)}
      ${createImageField('Portre / Fotoğraf', 'image', page.image, isEditable)}
      ${createInputField('Vurgu Sözü (Aforizma)', 'quote', page.quote, isEditable)}
    `;
  } else if (page.type === 'video') {
    fieldsHtml += `
      ${createInputField('Etkinlik / Video Başlığı', 'title', page.title, isEditable)}
      ${createInputField('Alt Başlık', 'subTitle', page.subTitle, isEditable)}
      ${createInputField('Kulüp / Hazırlayan', 'author', page.author, isEditable)}
      <div class="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2">
        <label class="block text-xs font-semibold text-amber-400">Okul Gösterisi Video Dosyası (MP4)</label>
        <div class="flex gap-2">
          <input type="text" value="${escapeAttr(page.videoUrl || '')}" ${!isEditable ? 'disabled' : ''} placeholder="Video URL veya dosya..." oninput="updatePageField('videoUrl', this.value)" class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white">
          <label class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
            <i class="ph ph-upload-simple"></i> MP4 Yükle
            <input type="file" accept="video/mp4,video/*" onchange="uploadPageVideo(event)" class="hidden">
          </label>
        </div>
      </div>
      ${createImageField('Video Önizleme Kapağı (Poster)', 'videoPoster', page.videoPoster, isEditable)}
      ${createInputField('Görsel Alt Yazısı', 'caption', page.caption, isEditable)}
      ${createTextareaField('Detaylı Açıklama & Notlar', 'notes', page.notes, 3, isEditable)}
    `;
  } else if (page.type === 'k3') {
    fieldsHtml += `
      ${createInputField('Künye Başlığı', 'boardTitle', page.boardTitle, isEditable)}
      ${createInputField('İmtiyaz Sahibi', 'publisher', page.publisher, isEditable)}
      ${createInputField('Genel Yayın Yönetmeni', 'editorInChief', page.editorInChief, isEditable)}
      ${createInputField('Yayın Danışmanı', 'advisor', page.advisor, isEditable)}
      ${createTextareaField('Yazı İşleri ve Mizanpaj', 'editorialTeam', page.editorialTeam, 2, isEditable)}
      ${createInputField('İletişim & Web', 'contactInfo', page.contactInfo, isEditable)}
      ${createInputField('Gelecek Sayı Fragman Başlığı', 'nextIssueTeaserTitle', page.nextIssueTeaserTitle, isEditable)}
      ${createTextareaField('Gelecek Sayı Konuları', 'nextIssueText', page.nextIssueText, 4, isEditable)}
    `;
  } else if (page.type === 'k4') {
    fieldsHtml += `
      ${createInputField('Okul Adı', 'schoolName', page.schoolName, isEditable)}
      ${createInputField('Okul Sloganı / Motto', 'motto', page.motto, isEditable)}
      ${createImageField('Arka Kapak Tam Sayfa Görseli', 'coverImage', page.coverImage, isEditable)}
      ${createInputField('QR Kod Açıklaması', 'qrText', page.qrText, isEditable)}
      ${createInputField('Sosyal Medya Hesapları', 'social', page.social, isEditable)}
      ${createInputField('Kapanış Aforizması', 'closingQuote', page.closingQuote, isEditable)}
    `;
  } else if (page.type === 'article') {
    fieldsHtml += `
      ${createInputField('Kategori Etiketi', 'category', page.category, isEditable)}
      ${createInputField('Makale / Haber Başlığı', 'title', page.title, isEditable)}
      ${createInputField('Yazar (Öğrenci / Kulüp)', 'author', page.author, isEditable)}
      ${createImageField('Haber Görseli', 'image', page.image, isEditable)}
      ${createInputField('Görsel Alt Yazısı', 'imageCaption', page.imageCaption, isEditable)}
      ${createTextareaField('Makale Ana Metni', 'content', page.content, 6, isEditable)}
      ${createTextareaField('Vurgu Sözü (Pull Quote)', 'pullQuote', page.pullQuote, 2, isEditable)}
    `;
  } else if (page.type === 'interview') {
    fieldsHtml += `
      ${createInputField('Köşe Başlığı', 'rubric', page.rubric, isEditable)}
      ${createInputField('Röportaj Yapılan Kişi', 'interviewee', page.interviewee, isEditable)}
      ${createInputField('Branşı / Görevi', 'role', page.role, isEditable)}
      ${createImageField('Konuk Fotoğrafı', 'photo', page.photo, isEditable)}
      ${createTextareaField('Kısa Tanıtım', 'intro', page.intro, 2, isEditable)}
      ${createInputField('1. Soru', 'q1', page.q1, isEditable)}
      ${createTextareaField('1. Cevap', 'a1', page.a1, 2, isEditable)}
      ${createInputField('2. Soru', 'q2', page.q2, isEditable)}
      ${createTextareaField('2. Cevap', 'a2', page.a2, 2, isEditable)}
      ${createInputField('3. Soru', 'q3', page.q3, isEditable)}
      ${createTextareaField('3. Cevap', 'a3', page.a3, 2, isEditable)}
    `;
  } else if (page.type === 'literature') {
    fieldsHtml += `
      ${createInputField('Üst Köşe Başlığı', 'header', page.header, isEditable)}
      ${createInputField('Şiir / Deneme Başlığı', 'title', page.title, isEditable)}
      ${createInputField('Öğrenci Adı & Sınıfı', 'author', page.author, isEditable)}
      ${createImageField('Sanat Teması Görseli', 'bgImage', page.bgImage, isEditable)}
      ${createTextareaField('Şiir veya Edebi Metin', 'poemText', page.poemText, 6, isEditable)}
      ${createInputField('Alt Bilgi Notu', 'bottomNote', page.bottomNote, isEditable)}
    `;
  } else if (page.type === 'catalog') {
    fieldsHtml += `
      ${createInputField('Katalog / Proje Başlığı', 'title', page.title, isEditable)}
      ${createTextareaField('Üst Tanıtım Özeti', 'content', page.content, 3, isEditable)}
      ${createImageField('1. Dikey Vitrin Görseli', 'image', page.image, isEditable)}
      ${createImageField('2. Dikey Vitrin Görseli', 'image2', page.image2, isEditable)}
      ${createImageField('3. Dikey Vitrin Görseli', 'image3', page.image3, isEditable)}
      ${createInputField('Tablo Satır 1 (Proje Adı)', 'spec1', page.spec1, isEditable)}
      ${createInputField('Tablo Satır 2 (Kategori)', 'spec2', page.spec2, isEditable)}
      ${createInputField('Tablo Satır 3 (Dönem)', 'spec3', page.spec3, isEditable)}
      ${createInputField('Tablo Satır 4 (Ekip)', 'author', page.author, isEditable)}
    `;
  } else if (page.type === 'quiz') {
    const opts = page.options || ["", "", "", ""];
    fieldsHtml += `
      ${createInputField('Sayfa Üst Başlığı', 'title', page.title, isEditable)}
      ${createInputField('Soru Başlığı', 'questionTitle', page.questionTitle, isEditable)}
      ${createTextareaField('Soru Metni', 'questionText', page.questionText, 3, isEditable)}
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
        <label class="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Şıklar ve Doğru Cevap</label>
        ${opts.map((opt, i) => `
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-400 w-4">${['A','B','C','D'][i]}</span>
            <input type="text" value="${escapeAttr(opt)}" ${!isEditable ? 'disabled' : ''} oninput="updateQuizOption(${i}, this.value)" class="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white disabled:opacity-40">
          </div>
        `).join('')}
        <div class="pt-2">
          <label class="block text-[11px] text-slate-400 mb-1">Doğru Şık Hangisi?</label>
          <select onchange="updatePageField('correctIndex', Number(this.value))" ${!isEditable ? 'disabled' : ''} class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white disabled:opacity-40">
            <option value="0" ${Number(page.correctIndex) === 0 ? 'selected' : ''}>A Şıkkı</option>
            <option value="1" ${Number(page.correctIndex) === 1 ? 'selected' : ''}>B Şıkkı</option>
            <option value="2" ${Number(page.correctIndex) === 2 ? 'selected' : ''}>C Şıkkı</option>
            <option value="3" ${Number(page.correctIndex) === 3 ? 'selected' : ''}>D Şıkkı</option>
          </select>
        </div>
      </div>
      ${createTextareaField('Doğru Cevap Açıklaması', 'explanation', page.explanation, 2, isEditable)}
      ${createInputField('Ayın Kitap Önerisi', 'bookRec', page.bookRec, isEditable)}
      ${createInputField('Ayın Film Önerisi', 'movieRec', page.movieRec, isEditable)}
    `;
  }

  if (container) container.innerHTML = fieldsHtml;
}

// ==========================================
// FAZ 4: BAĞLAMA DUYARLI "AYARLAR" PANELİ (Görsel 1, 2, 3, 5, 6 Birebir)
// ==========================================
function renderContextSettingsInspector(page, isEditable, targetDom) {
  const el = selectedElementId ? (page.elements || []).find(x => x.id === selectedElementId) : null;

  // DURUM 0: ŞABLON İÇİ BİR GÖRSEL VEYA METİN KUTUSU SEÇİLİYSE (Ebat, Pozisyon, Açı & Görsel/Metin Stili)
  if (!el && activeInlineFieldKey) {
    const fs = ensureFieldStyles(page, activeInlineFieldKey);
    const targetBox = getVisualTargetForInline(activeInlineElement);
    const curW = Math.round(fs.width || targetBox?.offsetWidth || activeInlineElement?.offsetWidth || 200);
    const curH = Math.round(fs.height || targetBox?.offsetHeight || activeInlineElement?.offsetHeight || 120);
    const curX = Math.round(fs.tx || 0);
    const curY = Math.round(fs.ty || 0);
    const curRot = Math.round(fs.rotate || 0);

    const inlinePosBox = `
      <div class="bg-slate-900 p-3 rounded-2xl border border-blue-500/40 space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white flex items-center gap-1.5">
            <i class="ph ${activeInlineType === 'image' ? 'ph-image text-sky-400' : 'ph-textbox text-amber-400'}"></i>
            <span>Ebat, Pozisyon & Açı</span>
          </span>
          <button onclick="resetInlineFieldTransform()" class="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-[10px] font-bold text-slate-300 hover:text-rose-300 transition" title="Varsayılan Konum ve Boyuta Sıfırla">
            ↺ Sıfırla
          </button>
        </div>

        <!-- Pozisyon (X, Y) & Ebat (G, Y) Kutuları -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between" title="Yatay Pozisyon (Sol/Sağ Kaydırma)">
            <span class="text-slate-400 font-semibold">Konum X</span>
            <input id="inlineInpX" type="number" value="${curX}" oninput="updateInlineFieldTransform('tx', Number(this.value))" class="w-16 bg-transparent text-right text-white font-mono focus:outline-none">
          </div>
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between" title="Dikey Pozisyon (Yukarı/Aşağı Kaydırma)">
            <span class="text-slate-400 font-semibold">Konum Y</span>
            <input id="inlineInpY" type="number" value="${curY}" oninput="updateInlineFieldTransform('ty', Number(this.value))" class="w-16 bg-transparent text-right text-white font-mono focus:outline-none">
          </div>
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between" title="Genişlik (Piksel)">
            <span class="text-slate-400 font-semibold">Ebat G</span>
            <input id="inlineInpW" type="number" value="${curW}" oninput="updateInlineFieldTransform('width', Math.max(30, Number(this.value)))" class="w-16 bg-transparent text-right text-white font-mono focus:outline-none">
          </div>
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between" title="Yükseklik (Piksel)">
            <span class="text-slate-400 font-semibold">Ebat Y</span>
            <input id="inlineInpH" type="number" value="${curH}" oninput="updateInlineFieldTransform('height', Math.max(20, Number(this.value)))" class="w-16 bg-transparent text-right text-white font-mono focus:outline-none">
          </div>
        </div>

        <!-- Dönme Açısı (0° - 360°) Slider & Hızlı Açı Butonları -->
        <div class="pt-1 border-t border-slate-800 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-300 font-semibold">Dönme (Açı)</span>
            <span id="inlineLblRotate" class="font-mono font-bold text-blue-400">${curRot}°</span>
          </div>
          <input id="inlineInpRotate" type="range" min="-180" max="180" value="${curRot > 180 ? curRot - 360 : curRot}" oninput="updateInlineFieldTransform('rotate', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
          <div class="grid grid-cols-5 gap-1 pt-0.5">
            <button onclick="updateInlineFieldTransform('rotate', -15); renderRightEditorPanel();" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">-15°</button>
            <button onclick="updateInlineFieldTransform('rotate', -5); renderRightEditorPanel();" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">-5°</button>
            <button onclick="updateInlineFieldTransform('rotate', 0); renderRightEditorPanel();" class="py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-[10px] text-blue-300 hover:text-white font-bold">0°</button>
            <button onclick="updateInlineFieldTransform('rotate', 5); renderRightEditorPanel();" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">+5°</button>
            <button onclick="updateInlineFieldTransform('rotate', 15); renderRightEditorPanel();" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">+15°</button>
          </div>
        </div>
      </div>
    `;

    if (activeInlineType === 'image') {
      targetDom.innerHTML = inlinePosBox + `
        <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
          <span class="font-bold text-white block">Görsel İşlemleri</span>
          <label class="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow transition">
            <i class="ph ph-camera text-base"></i> Görseli Değiştir / Yükle
            <input type="file" accept="image/*" onchange="uploadTemplateImageInline(event, ${selectedEditIndex}, '${activeInlineFieldKey}')" class="hidden">
          </label>
          <button onclick="updateInlineFieldTransform('objectFit', '${fs.objectFit === 'contain' ? 'cover' : 'contain'}'); renderRightEditorPanel();" class="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 font-semibold text-slate-200 flex items-center justify-center gap-2 transition">
            <i class="ph ph-crop"></i> Sığdırma Modu (${fs.objectFit === 'contain' ? 'Tam Sığdır' : 'Kutuyu Doldur'})
          </button>
        </div>

        <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <div class="space-y-1">
            <div class="flex justify-between text-slate-300">
              <span>Köşe Yuvarlatma (Yarıçap)</span>
              <span id="inlineLblRadius" class="font-mono text-white">${fs.borderRadius !== undefined ? fs.borderRadius : 12}px</span>
            </div>
            <input type="range" min="0" max="120" value="${fs.borderRadius !== undefined ? fs.borderRadius : 12}" oninput="updateInlineFieldTransform('borderRadius', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-300">Katman Maskesi</span>
            <select onchange="updateInlineFieldTransform('mask', this.value)" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white">
              <option value="none" ${(!fs.mask || fs.mask === 'none') ? 'selected' : ''}>Yok (Normal)</option>
              <option value="circle" ${fs.mask === 'circle' ? 'selected' : ''}>⬤ Daire Maske</option>
              <option value="ellipse" ${fs.mask === 'ellipse' ? 'selected' : ''}>⬭ Elips Maske</option>
              <option value="triangle" ${fs.mask === 'triangle' ? 'selected' : ''}>▲ Üçgen Maske</option>
              <option value="diamond" ${fs.mask === 'diamond' ? 'selected' : ''}>◆ Elmas Maske</option>
              <option value="hexagon" ${fs.mask === 'hexagon' ? 'selected' : ''}>⬡ Altıgen Maske</option>
            </select>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-slate-300">
              <span>Saydamlık (Opacity)</span>
              <span id="inlineLblOpacity" class="font-mono text-white">${fs.opacity !== undefined ? fs.opacity : 100}%</span>
            </div>
            <input type="range" min="10" max="100" value="${fs.opacity !== undefined ? fs.opacity : 100}" oninput="updateInlineFieldTransform('opacity', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="text-slate-200">Gölge (Drop Shadow)</span>
            <label class="studio-switch">
              <input type="checkbox" ${fs.hasShadow ? 'checked' : ''} onchange="updateInlineFieldTransform('hasShadow', this.checked)">
              <span class="studio-switch-slider"></span>
            </label>
          </div>
        </div>
      `;
      return;
    }

    // Şablon içi METİN KUTUSU seçiliyse:
    targetDom.innerHTML = inlinePosBox + `
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
        <span class="font-bold text-white block">Metin Kutusu Tipografisi</span>
        <select onchange="applyTextStyle('fontFamily', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
          <option value="Inter" ${fs.fontFamily === 'Inter' ? 'selected' : ''}>Inter-Regular</option>
          <option value="'Playfair Display', serif" ${fs.fontFamily?.includes('Playfair') ? 'selected' : ''}>Playfair Display</option>
          <option value="'Cinzel', serif" ${fs.fontFamily?.includes('Cinzel') ? 'selected' : ''}>Cinzel Decorative</option>
          <option value="'Merriweather', serif" ${fs.fontFamily?.includes('Merriweather') ? 'selected' : ''}>Merriweather Serif</option>
          <option value="'Plus Jakarta Sans', sans-serif" ${fs.fontFamily?.includes('Jakarta') ? 'selected' : ''}>Plus Jakarta Sans</option>
          <option value="'Caveat', cursive" ${fs.fontFamily?.includes('Caveat') ? 'selected' : ''}>Caveat Handwriting</option>
          <option value="monospace" ${fs.fontFamily === 'monospace' ? 'selected' : ''}>Monospace Code</option>
        </select>

        <div class="flex items-center gap-2">
          <input type="color" value="${(fs.color && fs.color.startsWith('#')) ? fs.color : '#0f172a'}" onchange="applyTextStyle('color', this.value)" class="w-9 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent shrink-0">
          <input type="number" value="${fs.fontSize || 16}" oninput="applyTextStyle('fontSize', Number(this.value))" class="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono text-center">
          <button onclick="applyTextStyle('fontSize', Math.max(8, (Number(fs.fontSize)||16) - 2)); renderRightEditorPanel();" class="flex-1 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs">−</button>
          <button onclick="applyTextStyle('fontSize', Math.min(96, (Number(fs.fontSize)||16) + 2)); renderRightEditorPanel();" class="flex-1 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs">+</button>
        </div>

        <div class="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-slate-300">
          <button onclick="applyTextStyle('textAlign', 'left')" class="py-1.5 rounded hover:bg-slate-800 flex justify-center"><i class="ph ph-text-align-left"></i></button>
          <button onclick="applyTextStyle('textAlign', 'center')" class="py-1.5 rounded hover:bg-slate-800 flex justify-center"><i class="ph ph-text-align-center"></i></button>
          <button onclick="applyTextStyle('textAlign', 'right')" class="py-1.5 rounded hover:bg-slate-800 flex justify-center"><i class="ph ph-text-align-right"></i></button>
          <button onclick="applyTextStyle('textAlign', 'justify')" class="py-1.5 rounded hover:bg-slate-800 flex justify-center"><i class="ph ph-text-align-justify"></i></button>
        </div>

        <div class="space-y-1.5 pt-1 border-t border-slate-800">
          <span class="text-slate-300 font-semibold block">Arka Plan & Renkli Çerçeve</span>
          <select onchange="applyTextStyle('bgColor', this.value)" class="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-xs text-amber-200 font-semibold">
            <option value="transparent" ${(!fs.bgColor || fs.bgColor === 'transparent') ? 'selected' : ''}>Şeffaf (Çerçevesiz)</option>
            <option value="linear-gradient(135deg, #d97706, #1e1b4b)">🟠 Ayın Konuğu Degrade</option>
            <option value="linear-gradient(135deg, #4f46e5, #1e1b4b)">🟣 İndigo-Gece Degrade</option>
            <option value="linear-gradient(135deg, #059669, #064e3b)">🟢 Zümrüt Degrade</option>
            <option value="linear-gradient(135deg, #e11d48, #4c0519)">🔴 Yakut-Bordo Degrade</option>
            <option value="#ffffff">⬜ Beyaz Kart</option>
            <option value="#f8fafc">⚪ Gri Soru Kutusu</option>
            <option value="#0f172a">⬛ Koyu Lacivert Kutu</option>
          </select>
        </div>

        <div class="space-y-1 pt-1">
          <div class="flex justify-between text-slate-300">
            <span>Köşe Yuvarlatma (Yarıçap)</span>
            <span id="inlineLblRadius" class="font-mono text-white">${fs.borderRadius !== undefined ? fs.borderRadius : 8}px</span>
          </div>
          <input type="range" min="0" max="60" value="${fs.borderRadius !== undefined ? fs.borderRadius : 8}" oninput="updateInlineFieldTransform('borderRadius', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
        </div>
      </div>
    `;
    return;
  }

  // DURUM 1: HİÇBİR ÖĞE SEÇİLİ DEĞİLSE -> SAYFA BOYUTU, RENK ŞEMALARI & ARKA PLAN (Görsel 1 Birebir)
  if (!el) {
    targetDom.innerHTML = `
      <!-- Sayfa Boyutu (Görsel 1: G 794, Y 1123) -->
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white flex items-center gap-1">Sayfa Boyutu <i class="ph ph-info text-slate-400"></i></span>
          <span class="text-[10px] text-slate-400">A4 Dergi</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
            <span class="text-slate-400 font-semibold">G</span>
            <span class="text-white font-mono">794</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
            <span class="text-slate-400 font-semibold">Y</span>
            <span class="text-white font-mono">1123</span>
          </div>
        </div>
      </div>

      <!-- Renk Şemaları / Tema Paletleri (Görsel 1 Birebir: Gök mavisi, Fern Green, Sıcak Kahverengi, Gece yarısı) -->
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white flex items-center gap-1">Renk şemaları <i class="ph ph-info text-slate-400"></i></span>
        </div>
        <div class="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5">
          <i class="ph ph-check-circle-fill text-emerald-400"></i>
          <span>Tema renkleri algılandı</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          ${FLIP_COLOR_SCHEMES.map(sc => `
            <button onclick="applyColorSchemeToPage('${sc.id}')" class="p-2.5 rounded-xl border text-left transition hover:scale-[1.02] ${page.accentColor === sc.accent ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-700/80'}" style="background:${sc.bg}; color:${sc.text};">
              <div class="font-bold text-xs leading-tight" style="color:${sc.accent}">Başlık</div>
              <div class="text-[10px] opacity-80 mb-1.5">Metin</div>
              <div class="flex items-center gap-0.5 h-2.5 rounded overflow-hidden">
                ${sc.palette.map(hex => `<span class="flex-1 h-full" style="background:${hex}"></span>`).join('')}
              </div>
              <div class="text-[10px] font-semibold mt-1.5 truncate opacity-90">${escapeHtml(sc.name)}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Arka Plan (Görsel 1: Görüntü | Renk) -->
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5">
        <span class="text-xs font-bold text-white block">Arka Plan</span>
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-300">Bir Renk Seçin</span>
          <input type="color" value="${page.bgColor || '#ffffff'}" onchange="updatePageField('bgColor', this.value)" class="w-8 h-7 rounded cursor-pointer border border-slate-700 bg-transparent">
        </div>
        <div class="pt-1 border-t border-slate-800 flex items-center justify-between gap-2">
          <button onclick="switchRightInspectorTab('content')" class="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition">
            <i class="ph ph-textbox"></i> Şablon Metinleri
          </button>
          <button onclick="convertTemplateToFreeformObjects()" class="flex-1 py-2 px-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition" title="Şablondaki tüm başlık ve fotoğrafları serbest taşınabilir nesnelere dönüştür">
            <i class="ph ph-bounding-box"></i> Serbestleştir
          </button>
        </div>
      </div>
    `;
    return;
  }

  // ORTAK ÜST KISIM: BOYUT, KONUM & AÇI (Hizalama İkonları + X, Y, G, Y Kutuları + Dönme Açısı)
  const posBoxHtml = `
    <div class="bg-slate-900 p-3 rounded-2xl border border-blue-500/40 space-y-2.5">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-white">Ebat, Pozisyon & Açı</span>
        <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">${escapeHtml(el.type)}</span>
      </div>
      <!-- 6'lı Hizalama Barı -->
      <div class="grid grid-cols-6 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-slate-300">
        <button onclick="alignSelectedElement('left')" class="p-1.5 rounded hover:bg-slate-800 hover:text-white flex justify-center" title="Sola Hizala"><i class="ph ph-align-left text-sm"></i></button>
        <button onclick="alignSelectedElement('center-x')" class="p-1.5 rounded hover:bg-slate-800 hover:text-white flex justify-center" title="Yatay Ortala"><i class="ph ph-align-center-horizontal text-sm"></i></button>
        <button onclick="alignSelectedElement('right')" class="p-1.5 rounded hover:bg-slate-800 hover:text-white flex justify-center" title="Sağa Hizala"><i class="ph ph-align-right text-sm"></i></button>
        <button onclick="alignSelectedElement('top')" class="p-1.5 rounded hover:bg-slate-800 hover:text-white flex justify-center" title="Üste Hizala"><i class="ph ph-align-top text-sm"></i></button>
        <button onclick="alignSelectedElement('center-y')" class="p-1.5 rounded hover:bg-slate-800 hover:text-white flex justify-center" title="Dikey Ortala"><i class="ph ph-align-center-vertical text-sm"></i></button>
        <button onclick="alignSelectedElement('bottom')" class="p-1.5 rounded hover:bg-slate-800 hover:text-white flex justify-center" title="Alta Hizala"><i class="ph ph-align-bottom text-sm"></i></button>
      </div>
      <!-- X, Y (Pozisyon) ve G, Y (Ebat) Kutuları -->
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between" title="Yatay Pozisyon (%)">
          <span class="text-slate-400 font-semibold">Konum X</span>
          <input type="number" value="${Math.round(el.x || 0)}" oninput="updateSelectedElementNumeric('x', this.value)" class="w-14 bg-transparent text-right text-white font-mono focus:outline-none">
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between" title="Dikey Pozisyon (%)">
          <span class="text-slate-400 font-semibold">Konum Y</span>
          <input type="number" value="${Math.round(el.y || 0)}" oninput="updateSelectedElementNumeric('y', this.value)" class="w-14 bg-transparent text-right text-white font-mono focus:outline-none">
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between" title="Genişlik (%)">
          <span class="text-slate-400 font-semibold">Ebat G</span>
          <input type="number" value="${Math.round(el.width || 30)}" oninput="updateSelectedElementNumeric('width', this.value)" class="w-14 bg-transparent text-right text-white font-mono focus:outline-none">
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between" title="Yükseklik (%)">
          <span class="text-slate-400 font-semibold">Ebat Y</span>
          <input type="number" value="${Math.round(el.height || 20)}" oninput="updateSelectedElementNumeric('height', this.value)" class="w-14 bg-transparent text-right text-white font-mono focus:outline-none">
        </div>
      </div>
      <!-- Dönme Açısı (0° - 360°) -->
      <div class="pt-1 border-t border-slate-800 space-y-1.5 text-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-300 font-semibold">Dönme (Açı)</span>
          <span class="font-mono font-bold text-blue-400">${el.rotate || 0}°</span>
        </div>
        <input type="range" min="0" max="360" value="${el.rotate || 0}" oninput="updateSelectedElementStyleLive('rotate', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
        <div class="grid grid-cols-5 gap-1 pt-0.5">
          <button onclick="updateSelectedElementStyleLive('rotate', 345); renderRightEditorPanel();" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">-15°</button>
          <button onclick="updateSelectedElementStyleLive('rotate', 355); renderRightEditorPanel();" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">-5°</button>
          <button onclick="updateSelectedElementStyleLive('rotate', 0); renderRightEditorPanel();" class="py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-[10px] text-blue-300 hover:text-white font-bold">0°</button>
          <button onclick="updateSelectedElementStyleLive('rotate', 5); renderRightEditorPanel();" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">+5°</button>
          <button onclick="updateSelectedElementStyleLive('rotate', 15); renderRightEditorPanel();" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">+15°</button>
        </div>
      </div>
    </div>
  `;

  // DURUM 2: METİN / KART / SORU KUTUSU SEÇİLİYSE (Görsel 2 & 3 Birebir)
  if (el.type === 'text' || el.type === 'card' || el.type === 'qbox') {
    targetDom.innerHTML = posBoxHtml + `
      <!-- Metin Tipografi Kutusu (Görsel 2) -->
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5">
        <span class="text-xs font-bold text-white block">Metin</span>
        <select onchange="applyTextStyle('fontFamily', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
          <option value="Inter" ${el.fontFamily === 'Inter' ? 'selected' : ''}>Inter-Regular</option>
          <option value="'Playfair Display', serif" ${el.fontFamily?.includes('Playfair') ? 'selected' : ''}>Playfair Display</option>
          <option value="'Cinzel', serif" ${el.fontFamily?.includes('Cinzel') ? 'selected' : ''}>Cinzel Decorative</option>
          <option value="'Merriweather', serif" ${el.fontFamily?.includes('Merriweather') ? 'selected' : ''}>Merriweather Serif</option>
          <option value="'Plus Jakarta Sans', sans-serif" ${el.fontFamily?.includes('Jakarta') ? 'selected' : ''}>Plus Jakarta Sans</option>
          <option value="'Caveat', cursive" ${el.fontFamily?.includes('Caveat') ? 'selected' : ''}>Caveat Handwriting</option>
          <option value="monospace" ${el.fontFamily === 'monospace' ? 'selected' : ''}>Monospace Code</option>
        </select>

        <!-- Renk + Punto + (- / +) Butonları (Görsel 2) -->
        <div class="flex items-center gap-2">
          <input type="color" value="${(el.color && el.color.startsWith('#')) ? el.color : '#0f172a'}" onchange="applyTextStyle('color', this.value)" class="w-9 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent shrink-0">
          <input type="number" value="${el.fontSize || 14}" oninput="applyTextStyle('fontSize', Number(this.value))" class="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono text-center">
          <button onclick="applyTextStyle('fontSize', Math.max(8, (Number(el.fontSize)||14) - 2)); renderRightEditorPanel();" class="flex-1 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs">−</button>
          <button onclick="applyTextStyle('fontSize', Math.min(96, (Number(el.fontSize)||14) + 2)); renderRightEditorPanel();" class="flex-1 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs">+</button>
        </div>

        <!-- B, I, U, S, Aa, AA, aa (Görsel 2) -->
        <div class="grid grid-cols-7 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs text-slate-200">
          <button onclick="applyTextFormat('bold')" class="py-1.5 rounded hover:bg-slate-800 font-bold">B</button>
          <button onclick="applyTextFormat('italic')" class="py-1.5 rounded hover:bg-slate-800 italic font-serif">I</button>
          <button onclick="applyTextFormat('underline')" class="py-1.5 rounded hover:bg-slate-800 underline">U</button>
          <button onclick="applyTextFormat('strikeThrough')" class="py-1.5 rounded hover:bg-slate-800 line-through">S</button>
          <button onclick="setSelectedTextTransform('capitalize')" class="py-1.5 rounded hover:bg-slate-800 font-semibold">Aa</button>
          <button onclick="setSelectedTextTransform('uppercase')" class="py-1.5 rounded hover:bg-slate-800 font-semibold">AA</button>
          <button onclick="setSelectedTextTransform('lowercase')" class="py-1.5 rounded hover:bg-slate-800 font-semibold">aa</button>
        </div>

        <!-- Paragraf Hizalama (Sol, Orta, Sağ, İki Yana) -->
        <div class="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-slate-300">
          <button onclick="applyTextStyle('textAlign', 'left')" class="py-1.5 rounded hover:bg-slate-800 flex justify-center"><i class="ph ph-text-align-left"></i></button>
          <button onclick="applyTextStyle('textAlign', 'center')" class="py-1.5 rounded hover:bg-slate-800 flex justify-center"><i class="ph ph-text-align-center"></i></button>
          <button onclick="applyTextStyle('textAlign', 'right')" class="py-1.5 rounded hover:bg-slate-800 flex justify-center"><i class="ph ph-text-align-right"></i></button>
          <button onclick="applyTextStyle('textAlign', 'justify')" class="py-1.5 rounded hover:bg-slate-800 flex justify-center"><i class="ph ph-text-align-justify"></i></button>
        </div>

        <button onclick="applyBulkFontToPage(el?.fontFamily || 'Inter')" class="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition">
          Toplu Yazı Tipi Ayarı (Tüm Sayfaya Uygula)
        </button>
      </div>

      <!-- Aralık Slider'ları: Harf Aralığı, Satır Aralığı, Paragraf Aralığı (Görsel 3 Birebir) -->
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-3 text-xs">
        <span class="font-bold text-white block">Aralık</span>
        <div class="space-y-1">
          <div class="flex justify-between text-[11px] text-slate-300">
            <span>Harf Aralığı</span>
            <span class="font-mono text-white">${el.letterSpacing || 0}px</span>
          </div>
          <input type="range" min="-2" max="15" step="0.5" value="${el.letterSpacing || 0}" oninput="updateSelectedElementStyleLive('letterSpacing', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
        </div>
        <div class="space-y-1">
          <div class="flex justify-between text-[11px] text-slate-300">
            <span>Satır Aralığı</span>
            <span class="font-mono text-white">${el.lineHeight || 1.32}</span>
          </div>
          <input type="range" min="0.9" max="2.6" step="0.05" value="${el.lineHeight || 1.32}" oninput="updateSelectedElementStyleLive('lineHeight', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
        </div>
      </div>

      <!-- Aç/Kapat Anahtarları: Arka Plan, Sütun Düzeni, Kaydırma Çubuğu, Gölge, Kontur (Görsel 3 Birebir) -->
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
        <div class="space-y-2 pb-2 border-b border-slate-800">
          <span class="text-slate-200 font-semibold block">Arka Plan & Renkli Çerçeve</span>
          <select onchange="applyTextStyle('bgColor', this.value)" class="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-xs text-amber-200 font-semibold">
            <option value="transparent" ${(!el.bgColor || el.bgColor === 'transparent') ? 'selected' : ''}>Şeffaf (Çerçevesiz)</option>
            <option value="linear-gradient(135deg, #d97706, #1e1b4b)">🟠 Ayın Konuğu Degrade</option>
            <option value="linear-gradient(135deg, #4f46e5, #1e1b4b)">🟣 İndigo-Gece Degrade</option>
            <option value="linear-gradient(135deg, #059669, #064e3b)">🟢 Zümrüt Degrade</option>
            <option value="linear-gradient(135deg, #e11d48, #4c0519)">🔴 Yakut-Bordo Degrade</option>
            <option value="#ffffff">⬜ Beyaz Kart</option>
            <option value="#f8fafc">⚪ Gri Soru Kutusu</option>
            <option value="#0f172a">⬛ Koyu Lacivert Kutu</option>
          </select>
        </div>

        <div class="flex items-center justify-between py-1">
          <span class="text-slate-200">2 Sütunlu Gazete Düzeni</span>
          <label class="studio-switch">
            <input type="checkbox" ${Number(el.columns) > 1 ? 'checked' : ''} onchange="updateSelectedElementStyleLive('columns', this.checked ? 2 : 1)">
            <span class="studio-switch-slider"></span>
          </label>
        </div>

        <div class="flex items-center justify-between py-1">
          <span class="text-slate-200">Kaydırma Çubuğu</span>
          <label class="studio-switch">
            <input type="checkbox" ${el.scrollable ? 'checked' : ''} onchange="updateSelectedElementStyleLive('scrollable', this.checked)">
            <span class="studio-switch-slider"></span>
          </label>
        </div>

        <div class="flex items-center justify-between py-1">
          <span class="text-slate-200">Gölge</span>
          <label class="studio-switch">
            <input type="checkbox" ${el.hasShadow ? 'checked' : ''} onchange="updateSelectedElementStyleLive('hasShadow', this.checked)">
            <span class="studio-switch-slider"></span>
          </label>
        </div>

        <div class="flex items-center justify-between py-1">
          <span class="text-slate-200">Kontur (Kenar Çizgisi)</span>
          <label class="studio-switch">
            <input type="checkbox" ${el.hasStroke ? 'checked' : ''} onchange="updateSelectedElementStyleLive('hasStroke', this.checked)">
            <span class="studio-switch-slider"></span>
          </label>
        </div>
      </div>
    `;
    return;
  }

  // DURUM 3: GÖRÜNTÜ / ŞEKİL / TABLO / BUTON SEÇİLİYSE (Görsel 5 & 6 Birebir)
  targetDom.innerHTML = posBoxHtml + `
    ${el.type === 'image' ? `
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
        <label class="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition">
          <i class="ph ph-arrows-left-right"></i> Değiştir / Resim Yükle
          <input type="file" accept="image/*" onchange="uploadCanvasElementImage(event, '${el.id}')" class="hidden">
        </label>
        <button onclick="toggleImageFitMode('${el.id}')" class="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition">
          <i class="ph ph-crop"></i> Kırp / Sığdırma Modu (${el.objectFit === 'contain' ? 'Tam Sığdır' : 'Kutuyu Doldur'})
        </button>
        <button onclick="setElementImageAsPageBg('${el.id}')" class="w-full py-2 px-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-blue-300 flex items-center justify-center gap-2 transition">
          <i class="ph ph-frame-corners"></i> Arka Plan Olarak Ayarla
        </button>
      </div>
    ` : ''}

    ${el.type === 'table' ? `
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
        <span class="font-bold text-white block">Tablo Ayarları</span>
        <div class="flex items-center justify-between">
          <span class="text-slate-300">Başlık Çubuğu Rengi</span>
          <input type="color" value="${el.headerBg || '#7f1d1d'}" onchange="updateSelectedElementStyleLive('headerBg', this.value)" class="w-8 h-7 rounded cursor-pointer border-0 bg-transparent">
        </div>
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="addTableRow('${el.id}')" class="py-1.5 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold">+ Satır Ekle</button>
          <button onclick="removeTableRow('${el.id}')" class="py-1.5 px-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold">− Satır Sil</button>
        </div>
      </div>
    ` : ''}

    ${(el.type === 'shape' || el.type === 'button' || el.type === 'hotspot') ? `
      <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
        <span class="font-bold text-white block">Renk & Etiket</span>
        <div class="flex items-center justify-between">
          <span class="text-slate-300">Dolgu Rengi</span>
          <input type="color" value="${(el.bgColor && el.bgColor.startsWith('#')) ? el.bgColor : '#881337'}" onchange="updateSelectedElementStyleLive('bgColor', this.value)" class="w-8 h-7 rounded cursor-pointer border-0 bg-transparent">
        </div>
        ${el.type === 'button' ? `
          <div>
            <span class="text-slate-300 block mb-1">Düğme Metni</span>
            <input type="text" value="${escapeAttr(el.label || 'İNCELE')}" oninput="updateSelectedElementStyleLive('label', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white">
          </div>
        ` : ''}
      </div>
    ` : ''}

    <!-- Görsel 6: Yarıçap, Katman Maskesi, Saydamlık, Dönme, Gölge -->
    <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-3 text-xs">
      <div class="space-y-1">
        <div class="flex justify-between text-slate-300">
          <span>Yarıçap (Köşe Yuvarlatma)</span>
          <span class="font-mono text-white">${el.borderRadius !== undefined ? el.borderRadius : 12}px</span>
        </div>
        <input type="range" min="0" max="120" value="${el.borderRadius !== undefined ? el.borderRadius : 12}" oninput="updateSelectedElementStyleLive('borderRadius', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
      </div>

      ${el.type === 'image' ? `
        <div class="flex items-center justify-between">
          <span class="text-slate-300">Katman Maskesi</span>
          <select onchange="updateSelectedElementStyleLive('mask', this.value)" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white">
            <option value="none" ${(!el.mask || el.mask === 'none') ? 'selected' : ''}>Yok (Normal)</option>
            <option value="circle" ${el.mask === 'circle' ? 'selected' : ''}>⬤ Daire Maske</option>
            <option value="ellipse" ${el.mask === 'ellipse' ? 'selected' : ''}>⬭ Elips Maske</option>
            <option value="triangle" ${el.mask === 'triangle' ? 'selected' : ''}>▲ Üçgen Maske</option>
            <option value="diamond" ${el.mask === 'diamond' ? 'selected' : ''}>◆ Elmas Maske</option>
            <option value="hexagon" ${el.mask === 'hexagon' ? 'selected' : ''}>⬡ Altıgen Maske</option>
          </select>
        </div>
      ` : ''}

      <div class="space-y-1">
        <div class="flex justify-between text-slate-300">
          <span>Saydamlık (Opacity)</span>
          <span class="font-mono text-white">${el.opacity !== undefined ? el.opacity : 100}%</span>
        </div>
        <input type="range" min="10" max="100" value="${el.opacity !== undefined ? el.opacity : 100}" oninput="updateSelectedElementStyleLive('opacity', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
      </div>

      <div class="space-y-1">
        <div class="flex justify-between text-slate-300">
          <span>Dönme (Açı)</span>
          <span class="font-mono text-white">${el.rotate || 0}°</span>
        </div>
        <input type="range" min="0" max="360" value="${el.rotate || 0}" oninput="updateSelectedElementStyleLive('rotate', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
      </div>

      <div class="flex items-center justify-between pt-1">
        <span class="text-slate-200">Gölge (Drop Shadow)</span>
        <label class="studio-switch">
          <input type="checkbox" ${el.hasShadow ? 'checked' : ''} onchange="updateSelectedElementStyleLive('hasShadow', this.checked)">
          <span class="studio-switch-slider"></span>
        </label>
      </div>

      <button onclick="syncElementAcrossAllPages('${el.id}')" class="w-full py-1.5 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 transition">
        Çoklu Sayfa Senkronizasyonu (Tüm Sayfalara Kopyala)
      </button>
    </div>
  `;
}

// ==========================================
// FAZ 5: "EYLEMLER (ACTIONS)" ETKİLEŞİM PANELİ & MOTORU (Görsel 4 & 7 Birebir)
// ==========================================
const STUDIO_ACTION_TYPES = [
  { id: 'link', name: 'Bağlantıyı Aç', icon: 'ph-link' },
  { id: 'gotoPage', name: 'Sayfaya Git', icon: 'ph-arrow-square-in' },
  { id: 'call', name: 'Ara', icon: 'ph-phone-call' },
  { id: 'effect', name: 'Oynatma Efektleri', icon: 'ph-sparkle' },
  { id: 'popup', name: 'Açılır Pencere', icon: 'ph-app-window' },
  { id: 'lightbox', name: 'Açılır Resim', icon: 'ph-image-square' },
  { id: 'message', name: 'Açılır Mesaj', icon: 'ph-envelope-open' },
  { id: 'toggleTarget', name: 'Göster/Gizle', icon: 'ph-eye' },
  { id: 'video', name: 'Video Aç', icon: 'ph-play-circle' }
];

function renderContextActionsInspector(page, isEditable, targetDom) {
  const el = selectedElementId ? (page.elements || []).find(x => x.id === selectedElementId) : null;

  if (!el) {
    targetDom.innerHTML = `
      <div class="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center space-y-2.5">
        <i class="ph ph-cursor-click text-3xl text-blue-400"></i>
        <div class="text-xs font-bold text-white">Etkileşim Atamak İçin Bir Öğe Seçin</div>
        <p class="text-[11px] text-slate-400 leading-relaxed">Sayfa üzerindeki bir metin kutusuna, resme, düğmeye veya sıcak noktaya tıklayarak ona <strong>Bağlantı Aç, Sayfaya Git, Açılır Pencere, Açılır Resim</strong> veya <strong>Video Aç</strong> eylemi verebilirsiniz.</p>
        <div class="pt-1 flex gap-2 justify-center">
          <button onclick="addCanvasElement('button')" class="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold">+ Düğme Ekle</button>
          <button onclick="addCanvasElement('hotspot')" class="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold">+ Sıcak Nokta</button>
        </div>
      </div>
    `;
    return;
  }

  const currentAct = el.actionType || 'none';

  targetDom.innerHTML = `
    <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-white">Bir Eylem Seçin</span>
        ${currentAct !== 'none' ? `<button onclick="setElementActionType('none')" class="text-[10.5px] text-rose-400 hover:underline flex items-center gap-1"><i class="ph ph-trash"></i> Temizle</button>` : ''}
      </div>

      <!-- Tetikleyici Türü (Görsel 4: Tıklandığında Tetikle) -->
      <select onchange="updateSelectedElementStyleLive('actionTrigger', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold">
        <option value="click" ${(!el.actionTrigger || el.actionTrigger === 'click') ? 'selected' : ''}>Tıklandığında Tetikle</option>
        <option value="hover" ${el.actionTrigger === 'hover' ? 'selected' : ''}>Üzerine Gelindiğinde Tetikle</option>
      </select>

      <!-- 9 Eylem Kartı Grid (Görsel 4 & 7 Birebir) -->
      <div class="grid grid-cols-2 gap-2">
        ${STUDIO_ACTION_TYPES.map(act => `
          <button onclick="setElementActionType('${act.id}')" class="p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition relative ${currentAct === act.id ? 'bg-blue-600/25 border-blue-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'}">
            <span class="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[8px]">♛</span>
            <i class="ph ${act.icon} text-xl ${currentAct === act.id ? 'text-blue-400' : 'text-slate-300'}"></i>
            <span class="text-[11px] font-semibold text-center leading-tight">${escapeHtml(act.name)}</span>
          </button>
        `).join('')}
      </div>

      <!-- Seçilen Eylemin Detay Ayar Kutusu -->
      ${renderActionDetailConfigHTML(el)}
    </div>
  `;
}

function renderActionDetailConfigHTML(el) {
  const act = el.actionType || 'none';
  if (act === 'none') {
    return `<div class="text-[11px] text-slate-400 text-center py-2">Yukarıdaki 9 eylemden birine tıklayarak etkileşimi aktif edin.</div>`;
  }

  let configFields = '';
  if (act === 'link') {
    configFields = `
      <label class="block text-[11px] font-semibold text-slate-300 mb-1">Hedef Web Adresi (URL)</label>
      <input type="text" value="${escapeAttr(el.actionValue || 'https://')}" placeholder="https://..." oninput="updateSelectedElementStyleLive('actionValue', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
    `;
  } else if (act === 'gotoPage') {
    configFields = `
      <label class="block text-[11px] font-semibold text-slate-300 mb-1">Gidilecek Sayfa Numarası</label>
      <select onchange="updateSelectedElementStyleLive('actionValue', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
        ${(magazineData.pages || []).map((p, idx) => `
          <option value="${idx + 1}" ${Number(el.actionValue || 1) === idx + 1 ? 'selected' : ''}>Sayfa ${idx + 1} — ${escapeHtml(p.navTitle || '')}</option>
        `).join('')}
      </select>
    `;
  } else if (act === 'call') {
    configFields = `
      <label class="block text-[11px] font-semibold text-slate-300 mb-1">Telefon veya E-Posta</label>
      <input type="text" value="${escapeAttr(el.actionValue || '0212 000 00 00')}" oninput="updateSelectedElementStyleLive('actionValue', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
    `;
  } else if (act === 'popup' || act === 'message') {
    configFields = `
      <label class="block text-[11px] font-semibold text-slate-300 mb-1">Açılır Pencere Başlığı</label>
      <input type="text" value="${escapeAttr(el.popupTitle || 'Detaylı Bilgi')}" oninput="updateSelectedElementStyleLive('popupTitle', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white mb-2">
      <label class="block text-[11px] font-semibold text-slate-300 mb-1">Açılır Mesaj / İçerik Metni</label>
      <textarea rows="3" oninput="updateSelectedElementStyleLive('popupText', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">${escapeHtml(el.popupText || 'Okuyucu tıkladığında gösterilecek detaylı bilgi metni.')}</textarea>
    `;
  } else if (act === 'lightbox') {
    configFields = `
      <label class="block text-[11px] font-semibold text-slate-300 mb-1">Büyütülecek Görsel URL</label>
      <input type="text" value="${escapeAttr(el.actionValue || el.url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80')}" oninput="updateSelectedElementStyleLive('actionValue', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
    `;
  } else if (act === 'video') {
    configFields = `
      <label class="block text-[11px] font-semibold text-slate-300 mb-1">Açılacak Video (MP4 URL)</label>
      <input type="text" value="${escapeAttr(el.actionValue || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}" oninput="updateSelectedElementStyleLive('actionValue', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
    `;
  } else if (act === 'effect') {
    configFields = `
      <label class="block text-[11px] font-semibold text-slate-300 mb-1">Oynatma / Vurgu Animasyonu</label>
      <select onchange="updateSelectedElementStyleLive('actionValue', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
        <option value="pulse" ${el.actionValue === 'pulse' ? 'selected' : ''}>Nabız Vurgusu (Pulse)</option>
        <option value="bounce" ${el.actionValue === 'bounce' ? 'selected' : ''}>Zıplama (Bounce)</option>
        <option value="zoom" ${el.actionValue === 'zoom' ? 'selected' : ''}>Yakınlaşma (Zoom)</option>
      </select>
    `;
  } else if (act === 'toggleTarget') {
    configFields = `
      <label class="block text-[11px] font-semibold text-slate-300 mb-1">Açıklama</label>
      <div class="text-[11px] text-slate-400">Tıklandığında bilgi kutusunu gösterir/gizler.</div>
    `;
  }

  return `
    <div class="pt-3 border-t border-slate-800 space-y-2.5">
      ${configFields}
      <button onclick="triggerElementActionById('${el.id}')" class="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition">
        <i class="ph ph-play-fill"></i> + Eylemi Şimdi Test Et
      </button>
    </div>
  `;
}

function setElementActionType(actType) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === selectedElementId);
  if (!el) return;
  el.actionType = actType;
  if (actType === 'gotoPage' && !el.actionValue) el.actionValue = '2';
  if (actType === 'link' && !el.actionValue) el.actionValue = 'https://meb.gov.tr';
  renderAllElementsForCurrentPage();
  renderRightEditorPanel();
  saveAllChangesToServer();
  showToast(actType === 'none' ? "Eylem kaldırıldı" : "⚡ Eylem atandı!");
}

function triggerElementActionById(elId) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === elId);
  if (el) triggerElementAction(el);
}

function triggerElementAction(el) {
  if (!el) return;
  const act = el.actionType || (el.type === 'hotspot' ? 'popup' : 'none');
  if (act === 'link') {
    const url = el.actionValue || 'https://dergimiz.com.tr';
    window.open(url, '_blank');
  } else if (act === 'gotoPage') {
    const targetIdx = Math.max(0, Math.min(magazineData.pages.length - 1, (Number(el.actionValue) || 1) - 1));
    selectPageForEdit(targetIdx);
    showToast(`📄 Sayfa ${targetIdx + 1}'e gidildi`);
  } else if (act === 'call') {
    showToast(`📞 İletişim: ${el.actionValue || ''}`);
  } else if (act === 'popup' || act === 'message' || act === 'toggleTarget') {
    const titleEl = document.getElementById('actionPopupTitle');
    const bodyEl = document.getElementById('actionPopupBody');
    if (titleEl) titleEl.textContent = el.popupTitle || el.label || 'Detaylı Bilgi';
    if (bodyEl) bodyEl.innerHTML = `<p class="text-sm text-slate-200 leading-relaxed whitespace-pre-line">${escapeHtml(el.popupText || 'Detay açıklaması.')}</p>`;
    openModal('actionPopupModal');
  } else if (act === 'lightbox') {
    const imgUrl = el.actionValue || el.url || '';
    const titleEl = document.getElementById('actionPopupTitle');
    const bodyEl = document.getElementById('actionPopupBody');
    if (titleEl) titleEl.textContent = 'Görsel İnceleme';
    if (bodyEl) bodyEl.innerHTML = `<img src="${escapeHtml(imgUrl)}" class="w-full max-h-[65vh] object-contain rounded-2xl shadow-xl mx-auto">`;
    openModal('actionPopupModal');
  } else if (act === 'video' || act === 'popup_video') {
    const vidUrl = el.actionValue || el.videoUrl || el.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const titleEl = document.getElementById('actionPopupTitle');
    const bodyEl = document.getElementById('actionPopupBody');
    if (titleEl) titleEl.textContent = el.title || el.popupTitle || 'Video Oynatıcı';
    const ytMatch = vidUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      if (bodyEl) bodyEl.innerHTML = `<div class="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    } else {
      if (bodyEl) bodyEl.innerHTML = `<video controls autoplay class="w-full rounded-2xl shadow-xl bg-black"><source src="${escapeHtml(vidUrl)}" type="video/mp4"></video>`;
    }
    openModal('actionPopupModal');
  } else if (act === 'audio' || act === 'popup_audio') {
    const audUrl = el.actionValue || el.audioUrl || el.url || '';
    const titleEl = document.getElementById('actionPopupTitle');
    const bodyEl = document.getElementById('actionPopupBody');
    if (titleEl) titleEl.textContent = el.title || el.popupTitle || 'Ses Oynatıcı';
    if (bodyEl) bodyEl.innerHTML = `
      <div class="p-6 text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl">
          <i class="ph ph-headphones"></i>
        </div>
        <h4 class="text-white font-bold text-base">${escapeHtml(el.title || el.name || 'Ses Kaydı')}</h4>
        <audio controls autoplay class="w-full" src="${escapeHtml(audUrl)}"></audio>
      </div>`;
    openModal('actionPopupModal');
  } else if (act === 'effect') {
    const dom = document.getElementById(`elDom_${el.id}`);
    if (dom) {
      dom.classList.add('animate-bounce');
      setTimeout(() => dom.classList.remove('animate-bounce'), 1400);
    }
  }
}

// Sağ Panel Yardımcı Güncelleme Fonksiyonları
function applyColorSchemeToPage(schemeId) {
  const sc = FLIP_COLOR_SCHEMES.find(s => s.id === schemeId);
  const page = magazineData.pages[selectedEditIndex];
  if (!sc || !page || !canUserEditPage(page)) return;
  page.accentColor = sc.accent;
  page.bgColor = sc.bg;
  // Sayfadaki mevcut serbest kutuların/tabloların da vurgu renklerini uyumlu hale getir
  (page.elements || []).forEach(el => {
    if (el.type === 'table') el.headerBg = sc.accent;
    if (el.type === 'button') el.bgColor = sc.accent;
  });
  renderAll();
  saveAllChangesToServer();
  showToast(`🎨 "${sc.name}" renk şeması sayfaya uygulandı!`);
}

function alignSelectedElement(dir) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === selectedElementId);
  if (!el) return;
  if (dir === 'left') el.x = 5;
  if (dir === 'center-x') el.x = Math.round((100 - (el.width || 30)) / 2);
  if (dir === 'right') el.x = Math.round(95 - (el.width || 30));
  if (dir === 'top') el.y = 5;
  if (dir === 'center-y') el.y = Math.round((100 - (el.height || 20)) / 2);
  if (dir === 'bottom') el.y = Math.round(95 - (el.height || 20));
  renderAllElementsForCurrentPage();
  renderRightEditorPanel();
  saveAllChangesToServer();
}

function updateSelectedElementNumeric(prop, val) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === selectedElementId);
  if (!el) return;
  el[prop] = Number(val) || 0;
  renderAllElementsForCurrentPage();
  debouncedSave();
}

function updateSelectedElementStyleLive(prop, val) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === selectedElementId);
  if (!el) return;
  el[prop] = val;
  renderAllElementsForCurrentPage();
  renderRightEditorPanel();
  debouncedSave();
}

function setSelectedTextTransform(mode) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === selectedElementId);
  const elDom = document.getElementById(`elDom_${selectedElementId}`);
  if (el && elDom) {
    el.textTransform = mode;
    elDom.style.textTransform = mode;
    saveAllChangesToServer();
  }
}

function applyBulkFontToPage(fontFam) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;
  (page.elements || []).forEach(el => {
    if (el.type === 'text' || el.type === 'card' || el.type === 'qbox') {
      el.fontFamily = fontFam;
    }
  });
  if (!page.fieldStyles) page.fieldStyles = {};
  ['magazineName', 'mainHeadline', 'subHeadline', 'title', 'content', 'headerText', 'subText', 'interviewee', 'q1', 'a1', 'q2', 'a2', 'q3', 'a3', 'poemText'].forEach(k => {
    if (!page.fieldStyles[k]) page.fieldStyles[k] = {};
    page.fieldStyles[k].fontFamily = fontFam;
  });
  renderAll();
  saveAllChangesToServer();
  showToast("🔤 Seçili yazı tipi sayfadaki tüm metinlere uygulandı!");
}

function toggleImageFitMode(elId) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === elId);
  if (!el) return;
  el.objectFit = el.objectFit === 'contain' ? 'cover' : 'contain';
  renderAllElementsForCurrentPage();
  renderRightEditorPanel();
  saveAllChangesToServer();
}

function setElementImageAsPageBg(elId) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === elId);
  if (!el || !el.url) return;
  el.x = 0;
  el.y = 0;
  el.width = 100;
  el.height = 100;
  el.zIndex = 1;
  el.borderRadius = 0;
  renderAllElementsForCurrentPage();
  renderRightEditorPanel();
  saveAllChangesToServer();
  showToast("🖼️ Görsel tam sayfa arka plan olarak ayarlandı!");
}

function syncElementAcrossAllPages(elId) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page?.elements || []).find(x => x.id === elId);
  if (!el) return;
  magazineData.pages.forEach((p, idx) => {
    if (idx === selectedEditIndex) return;
    if (!p.elements) p.elements = [];
    const copy = JSON.parse(JSON.stringify(el));
    copy.id = 'el-sync-' + Date.now() + '-' + idx;
    p.elements.push(copy);
  });
  saveAllChangesToServer();
  showToast("🔁 Bu öğe dergideki tüm sayfalara senkronize edildi!");
}

function changePageLayout(layout) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !canUserEditPage(page)) return;
  page.layout = layout;
  if (!page.subHeadline) page.subHeadline = 'Kapak konusu ve özel dosya detayları.';
  if (!page.highlights) page.highlights = 'Özel Dosya\nAyın Röportajı\nGeleceğin Trendleri';
  renderMagazineViewport();
  renderRightEditorPanel();
  debouncedSave();
  showToast(`Mizanpaj ekolü "${layout.toUpperCase()}" olarak güncellendi`);
}

function renderStatusControl(page) {
  const container = document.getElementById('statusControlContainer');
  if (currentUser.role === 'admin') {
    container.innerHTML = `
      <select onchange="setPageStatus(this.value)" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500">
        <option value="draft" ${page.status === 'draft' ? 'selected' : ''}>🟡 Taslakta</option>
        <option value="review" ${page.status === 'review' ? 'selected' : ''}>🔵 İncelemede</option>
        <option value="revision" ${page.status === 'revision' ? 'selected' : ''}>🔴 Revize İsteniyor</option>
        <option value="approved" ${page.status === 'approved' ? 'selected' : ''}>🟢 Onaylandı</option>
      </select>
    `;
  } else {
    if (page.status === 'approved') {
      container.innerHTML = `<span class="text-xs text-emerald-400 font-bold flex items-center gap-1"><i class="ph ph-check"></i> Onaylandı</span>`;
    } else if (page.status === 'review') {
      container.innerHTML = `<span class="text-xs text-sky-400 font-semibold flex items-center gap-1"><i class="ph ph-clock"></i> İncelemede</span>`;
    } else {
      container.innerHTML = `
        <button onclick="setPageStatus('review')" class="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition flex items-center gap-1">
          <i class="ph ph-paper-plane-tilt"></i> Onaya Gönder
        </button>
      `;
    }
  }
}

function setPageStatus(newStatus) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;
  page.status = newStatus;
  updateTopReviewBanner();
  renderPageListSidebar();
  renderRightEditorPanel();
  saveAllChangesToServer();
  showToast(newStatus === 'approved' ? 'Sayfa onaylandı!' : 'Durum güncellendi.');
}

function saveAdminNote() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;
  const note = document.getElementById('inputAdminNote').value.trim();
  page.adminNote = note;
  if (note) page.status = 'revision';
  updateTopReviewBanner();
  renderPageListSidebar();
  renderRightEditorPanel();
  saveAllChangesToServer();
  showToast('Düzeltme notu kaydedildi!');
}

function changePageEditor(code) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;
  page.assignedEditor = code;
  updateTopReviewBanner();
  renderPageListSidebar();
  saveAllChangesToServer();
  showToast('Sorumlu editör atandı!');
}

function createInputField(label, key, val, editable = true) {
  return `
    <div>
      <label class="block text-xs font-semibold text-slate-300 mb-1">${label}</label>
      <input type="text" value="${escapeAttr(val || '')}" ${!editable ? 'disabled' : ''} oninput="updatePageField('${key}', this.value)" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none disabled:opacity-40">
    </div>
  `;
}

function createTextareaField(label, key, val, rows = 3, editable = true) {
  return `
    <div>
      <label class="block text-xs font-semibold text-slate-300 mb-1">${label}</label>
      <textarea rows="${rows}" ${!editable ? 'disabled' : ''} oninput="updatePageField('${key}', this.value)" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed disabled:opacity-40">${escapeHtml(val || '')}</textarea>
    </div>
  `;
}

function createImageField(label, key, val, editable = true) {
  return `
    <div class="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
      <label class="block text-xs font-semibold text-slate-300 mb-1">${label}</label>
      <div class="flex gap-2">
        <input type="text" value="${escapeAttr(val || '')}" ${!editable ? 'disabled' : ''} placeholder="Görsel URL..." oninput="updatePageField('${key}', this.value)" class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none disabled:opacity-40">
        ${editable ? `
          <label class="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0 transition" title="Fotoğraf Yükle">
            <i class="ph ph-upload-simple"></i> Yükle
            <input type="file" accept="image/*" onchange="uploadImageToServer(event, '${key}')" class="hidden">
          </label>
        ` : ''}
      </div>
    </div>
  `;
}

function updatePageField(key, value) {
  magazineData.pages[selectedEditIndex][key] = value;
  renderMagazineViewport();
  if (key === 'navTitle' || key === 'accentColor') {
    renderPageListSidebar();
  }
  debouncedSave();
}

function updateQuizOption(optIdx, value) {
  if (!magazineData.pages[selectedEditIndex].options) {
    magazineData.pages[selectedEditIndex].options = ["", "", "", ""];
  }
  magazineData.pages[selectedEditIndex].options[optIdx] = value;
  renderMagazineViewport();
  debouncedSave();
}

async function uploadImageToServer(event, key) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      magazineData.pages[selectedEditIndex][key] = data.url;
      renderMagazineViewport();
      renderRightEditorPanel();
      saveAllChangesToServer();
      showToast("Fotoğraf yüklendi!");
      return;
    }
  } catch (err) {
    console.warn("Upload hatası:", err);
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    magazineData.pages[selectedEditIndex][key] = e.target.result;
    renderMagazineViewport();
    renderRightEditorPanel();
    showToast("Fotoğraf eklendi!");
  };
  reader.readAsDataURL(file);
}

async function uploadPageVideo(event) {
  const file = event.target.files[0];
  if (!file) return;

  showToast("Video sunucuya yükleniyor...");
  const formData = new FormData();
  formData.append('video', file);

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      magazineData.pages[selectedEditIndex].videoUrl = data.url;
      renderMagazineViewport();
      renderRightEditorPanel();
      saveAllChangesToServer();
      showToast("Video başarıyla yüklendi!");
      return;
    }
  } catch (err) {
    showToast("Video yüklenemedi!");
  }
}

// ==========================================
// 8. SAYFA İŞLEMLERİ & NAVİGASYON
// ==========================================
function prevPage() {
  flushActiveFabricCanvases();
  if (!spreadMode) {
    if (currentIndex > 0) currentIndex--;
  } else {
    if (currentIndex === 1) currentIndex = 0;
    else if (currentIndex > 1) currentIndex -= 2;
  }
  selectedEditIndex = currentIndex;
  renderAll();
}

function nextPage() {
  flushActiveFabricCanvases();
  const total = magazineData.pages.length;
  if (!spreadMode) {
    if (currentIndex < total - 1) currentIndex++;
  } else {
    if (currentIndex === 0 && total > 1) currentIndex = 1;
    else if (currentIndex + 2 < total) currentIndex += 2;
    else if (currentIndex + 1 < total) currentIndex += 1;
  }
  selectedEditIndex = currentIndex;
  renderAll();
}

function goToPage(index) {
  closeModal('tocModal');
  selectPageForEdit(index);
}

function addNewPage(templateType, layout) {
  if (currentUser.role !== 'admin') {
    showToast("Yalnızca Admin yeni sayfa ekleyebilir!");
    return;
  }

  const newId = 'p' + Date.now();
  let newPage = {
    id: newId,
    type: templateType,
    accentColor: "#4f46e5",
    assignedEditor: currentUser.code,
    status: "draft",
    adminNote: "",
    elements: []
  };

  if (templateType === 'cover') {
    const arch = layout || 'minimalist';
    newPage.layout = arch;

    if (arch === 'brutalist') {
      newPage = {
        ...newPage,
        navTitle: "K1 • Brütalist Kapak",
        accentColor: "#facc15",
        magazineName: "RESİMLİK",
        issueTag: "SAYI 04",
        price: "2026",
        mainHeadline: "YENİ GÖRÜNÜMLER",
        subHeadline: "POPÜLER KÜLTÜR VE GENÇLİK DOSYASI",
        coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        highlights: "Mavi Sarı Kırmızı Trend\nBrütalist Stilde Moda\nSokak Kültürü"
      };
    } else if (arch === 'modular') {
      newPage = {
        ...newPage,
        navTitle: "K1 • Modüler Kapak",
        accentColor: "#0f172a",
        magazineName: "KONAK",
        issueTag: "SAYI 01",
        price: "MİMARİ & YAŞAM",
        mainHeadline: "TARZ DENEYİMLERİ",
        subHeadline: "TASARIM ÖDÜLLERİ VE YAŞAM ALANLARI",
        coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        highlights: "Yeni Renkler\nÇağdaş Stiller\nTaze Perspektifler"
      };
    } else if (arch === 'fullscreen') {
      newPage = {
        ...newPage,
        navTitle: "K1 • Fullscreen Kapak",
        accentColor: "#10b981",
        magazineName: "DOĞAL",
        issueTag: "BAHAR 2026",
        price: "YAŞAM ALANLARI",
        mainHeadline: "VAHŞİ YAŞAMIN BÜYÜSÜ",
        subHeadline: "Gezegenin Paydaşları ve Doğanın Ritmi",
        coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        highlights: "Ormanın Derinlikleri\nNesli Tükenenler\nYaban Hayatı Korumak"
      };
    } else {
      newPage = {
        ...newPage,
        layout: 'minimalist',
        navTitle: "K1 • Minimalist Kapak",
        accentColor: "#d97706",
        magazineName: "KAMER",
        issueTag: "SAYI 01 | EKİM 2026",
        price: "OKUL DERGİSİ",
        mainHeadline: "GÜÇLÜ KADIN LİDER",
        subHeadline: "Kapak hikayesi için destek ve tanıtım metni buraya girilecektir.",
        coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        highlights: "Moda & Kültür Sektöründe\nRenkleri Kendinize Uyarlayın\nSezonun En İyi Görünümleri"
      };
    }
  } else if (templateType === 'toc') {
    newPage = {
      ...newPage,
      navTitle: "İçindekiler & Başyazı",
      accentColor: "#4f46e5",
      editorTitle: "Bu Sayıya Dair",
      editorQuote: "Dergimizi hazırlarken ilhamımızı sokaklardan, sanattan ve teknolojiden alıyoruz.",
      editorText: "Editörün mektubu, samimi veya resmi olabilen, çeşitli nedenler için yazılmış bir mesajdır. Okuyucunun belirli bir konunun içeriğini ve kreatif yönünü anlamasına yardımcı olabilir...",
      editorName: "Genel Yayın Yönetmeni",
      editorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      editorialBoard: `${magazineData.schoolName || 'Okul'} Yayın Kurulu`
    };
  } else if (templateType === 'k2') {
    newPage = {
      ...newPage,
      subType: 'ataturk',
      navTitle: "K2 • Ön Kapak İçi",
      accentColor: "#b91c1c",
      headerText: "TÜRK GENÇLİĞİNE HİTABE",
      subText: "Ey Türk Gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyeti'ni, ilelebet muhafaza ve müdafaa etmektir.",
      author: "Gazi Mustafa Kemal Atatürk",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      quote: "Bütün ümidim gençliktedir."
    };
  } else if (templateType === 'video') {
    newPage = {
      ...newPage,
      accentColor: "#d97706",
      navTitle: "Etkinlik Video Köşesi",
      title: "Okul Tiyatro ve Gösteri Kaydı",
      subTitle: "Öğrencilerimizin hazırladığı özel gösteriden canlı video kaydı.",
      author: "Kültür & Sanat Kulübü",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      videoPoster: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80",
      caption: "Konferans salonundaki gösteriden bir kare.",
      notes: "Tüm veli ve öğrencilerimize teşekkür ederiz."
    };
  } else if (templateType === 'k3') {
    newPage = {
      ...newPage,
      navTitle: "K3 • Arka Kapak İçi",
      boardTitle: "YAYIN KURULU KÜNYESİ",
      publisher: "Okul Müdürü",
      editorInChief: "Sedat İleri",
      advisor: "Nazmiye Hoca",
      editorialTeam: "Öğrenci Yazı İşleri Ekibi",
      contactInfo: "dergi@ufuklisesi.edu.tr",
      nextIssueTeaserTitle: "GELECEK SAYIDA NELER VAR?",
      nextIssueText: "• Yeni Dosya Konusu\n• Öğrenci Şiirleri ve Denemeleri"
    };
  } else if (templateType === 'k4') {
    newPage = {
      ...newPage,
      navTitle: "K4 • Arka Dış Kapak",
      schoolName: magazineData.schoolName || "DİJİTAL DERGİ TASARIM STÜDYOSU",
      motto: "\"Fikri hür, vicdanı hür nesiller için...\"",
      coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
      qrText: "Dergiyi çevrim içi okumak için karekodu okutun",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dergimiz.com.tr",
      social: "@dergimiz",
      closingQuote: "Geleceğin aydınlık Türkiye'sini birlikte kuruyoruz."
    };
  } else if (templateType === 'freeform') {
    newPage = {
      ...newPage,
      navTitle: "Serbest Mizanpaj",
      elements: []
    };
  } else if (templateType === 'catalog') {
    newPage = {
      ...newPage,
      navTitle: "Ürün / Proje Kataloğu",
      accentColor: "#68181f",
      catTag: "PROJE & ÜRÜN TANITIMI",
      title: "PROJE GENEL BAKIŞ",
      desc: "Projemiz en güncel bilimsel yöntemler ve estetik tasarım ilkeleriyle geliştirilmiştir. Sağ panelden veya tablodan tüm teknik detayları inceleyebilirsiniz.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
      specTitle: "TEKNİK ÖZELLİKLER TABLOSU",
      elements: []
    };
  } else if (templateType === 'article') {
    newPage = {
      ...newPage,
      navTitle: "Yeni Makale / Haber",
      category: "BİLİM & TEKNOLOJİ",
      title: "Yeni Proje veya Etkinlik Başlığı",
      author: "Öğrenci Adı • 10/A",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
      imageCaption: "Laboratuvar çalışmalarından bir kare.",
      content: "Makale metninizi sağ panelden buraya yazabilirsiniz.",
      pullQuote: "Gelecek, merak edenlerin ellerinde şekillenir."
    };
  }

  magazineData.pages.push(newPage);
  closeModal('addPageModal');
  selectPageForEdit(magazineData.pages.length - 1);
  saveAllChangesToServer();
  showToast("Yeni sayfa dergiye eklendi!");
}

function moveCurrentPage(dir) {
  const target = selectedEditIndex + dir;
  if (target < 0 || target >= magazineData.pages.length) return;
  const temp = magazineData.pages[selectedEditIndex];
  magazineData.pages[selectedEditIndex] = magazineData.pages[target];
  magazineData.pages[target] = temp;
  selectPageForEdit(target);
  saveAllChangesToServer();
  showToast("Sayfa sırası güncellendi");
}

function deleteCurrentPage() {
  if (magazineData.pages.length <= 1) {
    showToast("Dergide en az 1 sayfa bulunmalıdır!");
    return;
  }
  magazineData.pages.splice(selectedEditIndex, 1);
  if (selectedEditIndex >= magazineData.pages.length) {
    selectedEditIndex = magazineData.pages.length - 1;
  }
  selectPageForEdit(selectedEditIndex);
  saveAllChangesToServer();
  showToast("Sayfa silindi");
}

// ==========================================
// 9. SUNUCUYA KAYIT
// ==========================================
async function saveAllChangesToServer(silent = false) {
  if (!magazineData) return;
  const ind = document.getElementById('saveStatusIndicator');
  if (ind) {
    ind.innerHTML = `<i class="ph ph-spinner animate-spin text-amber-400"></i><span>Kaydediliyor...</span>`;
  }

  // Eğer kullanıcı doğrudan Şablon Masasında çalışıyorsa ve "Kaydet" butonuna bastıysa otomatik sunucuya kaydet
  if (!currentIssue) {
    if (silent) {
      if (ind) ind.innerHTML = `<i class="ph ph-check-circle text-emerald-400"></i><span>Şablon aktif</span>`;
      return;
    }
    try {
      const preset = MAGAZINE_PRESETS.find(p => p.id === activeTemplatePresetId) || MAGAZINE_PRESETS[0];
      const createRes = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-code': currentUser.code
        },
        body: JSON.stringify({
          title: magazineData.title || `${preset.title} • Sayı 01`,
          schoolName: magazineData.schoolName || preset.title,
          issueMonth: magazineData.issueMonth || '2026',
          pages: magazineData.pages
        })
      });
      const createData = await createRes.json();
      if (createData.success && createData.issue) {
        currentIssue = createData.issue;
        if (ind) ind.innerHTML = `<i class="ph ph-check-circle text-emerald-400"></i><span>Kaydedildi</span>`;
        showToast("💾 Çalışmanız sunucuya kaydedildi!");
      }
    } catch (e) {
      console.warn("Kayıt hatası:", e);
    }
    return;
  }

  try {
    const res = await fetch(`/api/issues/${currentIssue.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-access-code': currentUser.code 
      },
      body: JSON.stringify({
        schoolName: magazineData.schoolName,
        issueInfo: magazineData.issueInfo,
        pages: magazineData.pages
      })
    });
    if (res.ok) {
      if (ind) {
        ind.innerHTML = `<i class="ph ph-check-circle text-emerald-400"></i><span>Değişiklikler kaydedildi</span>`;
      }
      if (!silent) {
        showToast("💾 Değişiklikler sunucuya kaydedildi!");
      }
    }
  } catch (err) {
    console.warn("Sunucuya kaydedilemedi:", err);
    if (ind) {
      ind.innerHTML = `<i class="ph ph-warning-circle text-rose-400"></i><span>Kayıt hatası</span>`;
    }
  }
}

// ==========================================
// 10. EDİTÖR YETKİ KODLARI YÖNETİMİ (ADMİN)
// ==========================================
async function loadEditorKeys() {
  if (currentUser.role !== 'admin') return;
  try {
    const res = await fetch('/api/auth/keys', {
      headers: { 'x-access-code': currentUser.code }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        editorKeys = data;
      } else {
        editorKeys = data.keys || [];
        adminUsers = data.admins || [];
      }
      renderEditorKeysModal();
    }
  } catch (err) {
    console.error('Anahtarlar yüklenemedi:', err);
  }
}

function renderEditorKeysModal() {
  const list = document.getElementById('editorKeysList');
  if (!list) return;

  let html = '';

  if (adminUsers.length > 0) {
    html += `
      <div class="mb-3">
        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5">👑 Süper Yöneticiler (Admin):</span>
        <div class="space-y-1.5">
          ${adminUsers.map(a => `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs">
              <div>
                <div class="font-bold text-white flex items-center gap-1.5">
                  <span>${escapeHtml(a.name)}</span>
                  <span class="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">Admin</span>
                </div>
                <div class="text-[11px] text-slate-400 font-mono mt-0.5">${escapeHtml(a.email)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  html += `
    <div>
      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">✍️ Sayfa Editörleri & Kodları:</span>
      <div class="space-y-1.5">
        ${editorKeys.map(k => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <div class="font-bold text-white flex items-center gap-2">
                <span>${escapeHtml(k.name)}</span>
                <span class="font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-semibold">${escapeHtml(k.code)}</span>
              </div>
              <div class="text-[11px] text-slate-400 mt-0.5">${escapeHtml(k.title || 'Editör')}</div>
            </div>
            ${k.role !== 'admin' ? `
              <button onclick="deleteEditorKey('${k.code}')" class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition" title="Kodu Sil">
                <i class="ph ph-trash text-sm"></i>
              </button>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  list.innerHTML = html;
}

async function addNewEditorKey() {
  const code = document.getElementById('newKeyCode').value.trim();
  const name = document.getElementById('newKeyName').value.trim();
  const title = document.getElementById('newKeyTitle').value.trim();

  if (!code || !name) {
    showToast("Kod ve isim zorunludur!");
    return;
  }

  try {
    const magSelect = document.getElementById('newKeyMagazine');
    const magId = magSelect ? magSelect.value : (currentMagazine ? currentMagazine.id : 'mag-default');
    const res = await fetch('/api/auth/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-code': currentUser.code
      },
      body: JSON.stringify({ code, name, title, magazineId: magId, role: 'editor' })
    });
    if (res.ok) {
      document.getElementById('newKeyCode').value = '';
      document.getElementById('newKeyName').value = '';
      document.getElementById('newKeyTitle').value = '';
      await loadEditorKeys();
      renderRightEditorPanel();
      showToast("Yeni editör kodu oluşturuldu!");
    }
  } catch (err) {
    showToast("Hata oluştu!");
  }
}

async function deleteEditorKey(code) {
  if (!confirm(`'${code}' kodunu silmek istediğinize emin misiniz?`)) return;
  try {
    const res = await fetch(`/api/auth/keys/${code}`, {
      method: 'DELETE',
      headers: { 'x-access-code': currentUser.code }
    });
    if (res.ok) {
      await loadEditorKeys();
      renderRightEditorPanel();
      showToast("Editör kodu silindi.");
    }
  } catch (err) {
    showToast("Silinemedi!");
  }
}

// ==========================================
// 11. YENİ SAYI BAŞLATMA (KURUMSAL ŞABLONDAN OTOMATİK TÜRETME)
// ==========================================
async function createNewIssueSubmit() {
  const title = document.getElementById('newIssueTitle').value.trim();
  const month = document.getElementById('newIssueMonth').value.trim();
  const desc = document.getElementById('newIssueDesc').value.trim();

  if (!title) {
    showToast("Sayı başlığı gerekli!");
    return;
  }

  // Seçili şablondan tam örnek sayfaları otomatik hazırla
  const preset = MAGAZINE_PRESETS.find(p => p.id === activeTemplatePresetId) || MAGAZINE_PRESETS[0];
  const school = magazineData.schoolName || preset.title;
  const initialPages = buildSamplePagesForPreset(preset.id);

  try {
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-code': currentUser.code
      },
      body: JSON.stringify({
        magazineId: currentMagazine ? currentMagazine.id : null,
        title,
        schoolName: currentMagazine ? currentMagazine.schoolName : school,
        issueMonth: month,
        description: desc,
        pages: initialPages
      })
    });
    const data = await res.json();
    if (data.success) {
      closeModal('newIssueModal');
      await loadAllIssues(currentMagazine ? currentMagazine.id : null);
      onIssueChange(data.issue.id);
      showToast("🎉 4 kapaklı yeni sayı otomatik oluşturuldu!");
    }
  } catch (err) {
    showToast("Sayı oluşturulamadı!");
  }
}

// ==========================================
// 12. MODAL & DIŞA AKTARMA (JSON & E-DERGİ)
// ==========================================
function openModal(id) {
  if (id === 'magSettingsModal') {
    document.getElementById('inputSchoolName').value = magazineData.schoolName || '';
    document.getElementById('inputIssueInfo').value = magazineData.issueMonth || magazineData.issueInfo || '';
  }
  if (id === 'tocModal') {
    const list = document.getElementById('tocModalList');
    list.innerHTML = magazineData.pages.map((p, idx) => `
      <button onclick="goToPage(${idx})" class="w-full p-3 rounded-2xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 flex items-center justify-between text-left transition">
        <div class="flex items-center gap-3 truncate">
          <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">${idx + 1}</span>
          <span class="text-xs font-semibold text-white truncate">${escapeHtml(p.navTitle)}</span>
        </div>
        <span class="text-[10px] text-slate-400 uppercase font-bold shrink-0 ml-2">${getTemplateLabel(p.type)}</span>
      </button>
    `).join('');
  }
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function saveMagSettings() {
  magazineData.schoolName = document.getElementById('inputSchoolName').value || "DİJİTAL DERGİ";
  magazineData.issueMonth = document.getElementById('inputIssueInfo').value || "Sayı #1";
  closeModal('magSettingsModal');
  renderAll();
  saveAllChangesToServer();
  showToast("Dergi bilgileri güncellendi!");
}

function downloadProjectJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(magazineData, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `${(magazineData.title || 'dergi_projesi').replace(/\s+/g, '_')}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  closeModal('projectModal');
  showToast("Proje yedeği (.json) indirildi!");
}

function uploadProjectJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed && Array.isArray(parsed.pages)) {
        magazineData = parsed;
        currentIndex = 0;
        selectedEditIndex = 0;
        renderAll();
        closeModal('projectModal');
        saveAllChangesToServer();
        showToast("Dergi projesi yüklendi!");
      }
    } catch (err) {
      showToast("Geçersiz proje dosyası!");
    }
  };
  reader.readAsText(file);
}

function exportStandaloneMagazine() {
  const standaloneHtml = generateStandaloneHTML(magazineData);
  const blob = new Blob([standaloneHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(magazineData.title || 'e_dergi').toLowerCase().replace(/\s+/g, '_')}_edergi.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  closeModal('projectModal');
  showToast("Tek dosyalık E-Dergi indirildi!");
}

function generateStandaloneHTML(mag) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(mag.title || 'E-Dergi')}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,400&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
  <style>
    .magazine-page { aspect-ratio: 1 / 1.414; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); border-radius: 12px; position: relative; overflow: hidden; background: #fff; }
    .spine-shadow-left { position: absolute; top:0; right:0; bottom:0; width:35px; background: linear-gradient(to right, transparent, rgba(0,0,0,0.08)); pointer-events:none; }
    .spine-shadow-right { position: absolute; top:0; left:0; bottom:0; width:35px; background: linear-gradient(to left, transparent, rgba(0,0,0,0.08)); pointer-events:none; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 h-screen flex flex-col overflow-hidden">
  <header class="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
    <div class="font-bold text-white text-sm">${escapeHtml(mag.schoolName || 'E-DERGİ')}</div>
    <div class="text-xs text-slate-400 font-semibold" id="pageIndicator">Sayfa 1 / ${mag.pages.length}</div>
  </header>
  <main class="flex-1 flex items-center justify-center p-4">
    <button onclick="prev()" class="p-3 bg-slate-800 hover:bg-indigo-600 rounded-full text-white mr-4 shadow-xl"><i class="ph ph-caret-left text-2xl"></i></button>
    <div id="viewport" class="flex items-center justify-center"></div>
    <button onclick="next()" class="p-3 bg-slate-800 hover:bg-indigo-600 rounded-full text-white ml-4 shadow-xl"><i class="ph ph-caret-right text-2xl"></i></button>
  </main>
  <script>
    const data = ${JSON.stringify(mag)};
    let idx = 0;
    function render() {
      const page = data.pages[idx];
      document.getElementById('pageIndicator').textContent = "Sayfa " + (idx + 1) + " / " + data.pages.length;
      document.getElementById('viewport').innerHTML = '<div class="magazine-page h-[80vh] w-auto max-w-full text-slate-900 p-6 flex flex-col justify-between">' +
        '<div class="font-bold text-lg text-indigo-700">' + (page.navTitle || '') + '</div>' +
        '<div class="text-xs text-slate-700 my-auto whitespace-pre-line">' + (page.content || page.poemText || page.subHeadline || page.editorText || page.subText || '') + '</div>' +
        '<div class="text-[10px] text-slate-400 text-right">' + (idx + 1) + '</div></div>';
    }
    function prev() { if (idx > 0) { idx--; render(); } }
    function next() { if (idx < data.pages.length - 1) { idx++; render(); } }
    render();
  </script>
</body>
</html>`;
}

function getTemplateLabel(type) {
  const map = {
    cover: 'K1 Kapak',
    k1: 'K1 Kapak',
    k2: 'K2 Kapak İçi',
    k3: 'K3 Künye',
    k4: 'K4 Arka Kapak',
    freeform: 'Serbest Tuval',
    blank: 'Boş Sayfa',
    wireframe_blank: '📐 Bembeyaz Sayfa',
    wireframe_article_2col: '📐 Boş 2 Sütun Makale',
    wireframe_interview_3img: '📐 Boş 3 Fotoğraflı Röportaj',
    wireframe_gallery_4grid: '📐 Boş 4\'lü Kolaj',
    wireframe_poetry_author: '📐 Boş Şiir & Portre',
    catalog: 'Katalog',
    video: 'Video Köşesi',
    toc: 'İçindekiler',
    article: 'Makale',
    interview: 'Röportaj',
    literature: 'Edebiyat',
    gallery: 'Galeri',
    quiz: 'Quiz'
  };
  return map[type] || 'Sayfa';
}

function showToast(msg) {
  const box = document.getElementById('toastBox');
  document.getElementById('toastMessage').textContent = msg;
  box.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    box.classList.add('translate-y-20', 'opacity-0');
  }, 3200);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str);
}

// ==========================================
// GLOBAL WINDOW BINDINGS (Inline HTML eventleri için)
// ==========================================
window.addCanvasElement = addCanvasElement;
window.handleCanvasImageUpload = handleCanvasImageUpload;
window.handleCanvasVideoUpload = handleCanvasVideoUpload;
window.toggleGridOverlay = toggleGridOverlay;
window.applyTextStyle = applyTextStyle;
window.applyTextFormat = applyTextFormat;
window.changeElementLayer = changeElementLayer;
window.deleteSelectedCanvasElement = deleteSelectedCanvasElement;
window.toggleSpreadMode = toggleSpreadMode;
window.selectPageForEdit = selectPageForEdit;
window.setAppMode = setAppMode;
window.onIssueChange = onIssueChange;
window.onMagazineChange = onMagazineChange;
window.createNewMagazineSubmit = createNewMagazineSubmit;
window.handleLogout = handleLogout;
window.openModal = openModal;
window.closeModal = closeModal;
window.saveAllChangesToServer = saveAllChangesToServer;
window.addNewPage = addNewPage;
window.deleteCurrentPage = deleteCurrentPage;
window.moveCurrentPage = moveCurrentPage;
window.prevPage = prevPage;
window.nextPage = nextPage;
window.goToPage = goToPage;
window.togglePublishCurrentIssue = togglePublishCurrentIssue;
window.createNewIssueSubmit = createNewIssueSubmit;
window.saveMagSettings = saveMagSettings;
window.addNewEditorKey = addNewEditorKey;
window.changePageEditor = changePageEditor;
window.saveAdminNote = saveAdminNote;
window.dismissAdminNote = dismissAdminNote;
window.downloadProjectJSON = downloadProjectJSON;
window.uploadProjectJSON = uploadProjectJSON;
window.exportStandaloneMagazine = exportStandaloneMagazine;
window.updatePageField = updatePageField;
window.uploadImageToServer = uploadImageToServer;
window.uploadPageVideo = uploadPageVideo;
window.updateQuizOption = updateQuizOption;
window.setPageStatus = setPageStatus;
window.uploadTemplateImageInline = uploadTemplateImageInline;
window.uploadCanvasElementImage = uploadCanvasElementImage;
window.handleInlineTextChange = handleInlineTextChange;
window.debouncedSave = debouncedSave;
window.makeInlineEditable = makeInlineEditable;
window.makeInlineImage = makeInlineImage;
window.changePageLayout = changePageLayout;
window.applyMagPreset = applyMagPreset;
window.renderBarcodeSvg = renderBarcodeSvg;
window.showToast = showToast;
window.deleteCurrentMagazine = deleteCurrentMagazine;
window.deleteMagazineById = deleteMagazineById;
window.deleteCurrentIssue = deleteCurrentIssue;
window.openAllTemplatesModal = openAllTemplatesModal;
window.applyConceptToCurrentPage = applyConceptToCurrentPage;
window.addConceptAsNewPage = addConceptAsNewPage;
window.convertCurrentPageToTemplate = convertCurrentPageToTemplate;
window.handleInlineTextFocus = handleInlineTextFocus;
// FlipHTML5 v2 Faz 1-5 Yeni Global Fonksiyonlar
window.switchLeftTab = switchLeftTab;
window.toggleLeftDrawerCollapse = toggleLeftDrawerCollapse;
window.toggleMorePopupMenu = toggleMorePopupMenu;
window.closeMorePopupMenu = closeMorePopupMenu;
window.setCanvasZoom = setCanvasZoom;
window.stepCanvasZoom = stepCanvasZoom;
window.togglePanMode = togglePanMode;
window.switchRightInspectorTab = switchRightInspectorTab;
window.toggleLayersPopover = toggleLayersPopover;
window.renderLayersPopover = renderLayersPopover;
window.addAiGeneratedBlock = addAiGeneratedBlock;
window.undoAction = undoAction;
window.redoAction = redoAction;
window.openQuickTemplateForPage = openQuickTemplateForPage;
window.duplicatePage = duplicatePage;
window.insertPageAfter = insertPageAfter;
window.addSpreadPages = addSpreadPages;
window.deletePageAtIndex = deletePageAtIndex;
window.goToLastPage = goToLastPage;
window.convertTemplateToFreeformObjects = convertTemplateToFreeformObjects;
window.updateTableCellLive = updateTableCellLive;
window.addTableRow = addTableRow;
window.removeTableRow = removeTableRow;
window.stepSlide = stepSlide;
window.addSlideshowImagePrompt = addSlideshowImagePrompt;
window.triggerElementActionById = triggerElementActionById;
window.triggerElementAction = triggerElementAction;
window.setElementActionType = setElementActionType;
window.applyColorSchemeToPage = applyColorSchemeToPage;
window.alignSelectedElement = alignSelectedElement;
window.updateSelectedElementNumeric = updateSelectedElementNumeric;
window.updateSelectedElementStyleLive = updateSelectedElementStyleLive;
window.setSelectedTextTransform = setSelectedTextTransform;
window.applyBulkFontToPage = applyBulkFontToPage;
window.toggleImageFitMode = toggleImageFitMode;
window.setElementImageAsPageBg = setElementImageAsPageBg;
window.syncElementAcrossAllPages = syncElementAcrossAllPages;
window.stepSelectedFontSize = stepSelectedFontSize;
window.toggleSelectedStyleFormat = toggleSelectedStyleFormat;
window.setSelectedTextAlign = setSelectedTextAlign;
window.applyFloatingColor = applyFloatingColor;
window.applyFloatingBgColor = applyFloatingBgColor;
window.duplicateSelectedCanvasElement = duplicateSelectedCanvasElement;
window.selectCanvasElement = selectCanvasElement;
window.deselectAllElements = deselectAllElements;
window.loadFullTemplatePreset = loadFullTemplatePreset;
window.clearAllSavedMagazines = clearAllSavedMagazines;
window.toggleRightSidebarCollapse = toggleRightSidebarCollapse;
window.toggleCanvasActionBar = toggleCanvasActionBar;
window.toggleTopToolbarCollapse = toggleTopToolbarCollapse;
window.toggleZenCanvasMode = toggleZenCanvasMode;
window.cycleTextAlign = cycleTextAlign;
window.cycleTextCase = cycleTextCase;
window.handleInlineImageMouseDown = handleInlineImageMouseDown;
window.handleInlineTextMouseDown = handleInlineTextMouseDown;
window.updateInlineFieldTransform = updateInlineFieldTransform;
window.resetInlineFieldTransform = resetInlineFieldTransform;




