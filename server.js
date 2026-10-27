require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Klasörleri garantiye al
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const MAGAZINES_FILE = path.join(DATA_DIR, 'magazines.json');

// Yardımcı JSON okuma/yazma fonksiyonları
function readJSON(file, defaultVal = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2), 'utf8');
      return defaultVal;
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`JSON okuma hatası (${file}):`, err);
    return defaultVal;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`JSON yazma hatası (${file}):`, err);
    return false;
  }
}

// Multer Medya (Fotoğraf, Video MP4, Ses MP3) Yükleme Ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let prefix = 'med-';
    if (file.mimetype.startsWith('video/')) prefix = 'vid-';
    else if (file.mimetype.startsWith('audio/')) prefix = 'aud-';
    else if (file.mimetype.startsWith('image/')) prefix = 'img-';
    cb(null, prefix + unique + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB (Video ve yüksek çözünürlüklü medya için)
});

// Statik Dosyalar (Tarayıcı önbellek kilitlenmesini önlemek için no-cache başlıkları)
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(PUBLIC_DIR, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

function isAdmin(authHeader, authData) {
  if (!authHeader) return false;
  const token = String(authHeader).trim().toUpperCase();
  if (authData.adminKey && token === authData.adminKey.toUpperCase()) return true;
  const adminList = authData.admins || [];
  for (const adm of adminList) {
    if (adm.code && token === adm.code.toUpperCase()) return true;
    if (adm.email && token === adm.email.toUpperCase()) return true;
  }
  return false;
}

// ==========================================
// API: KİMLİK & YETKİLENDİRME (AUTH)
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { email, password, code } = req.body;
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });

  // 1. E-posta + Şifre ile Giriş (Admin)
  if (email && password) {
    const normEmail = String(email).trim().toLowerCase();
    const admin = (authData.admins || []).find(a => a.email.toLowerCase() === normEmail);
    if (!admin || admin.password !== String(password).trim()) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre!' });
    }
    return res.json({
      success: true,
      user: {
        code: admin.code || admin.email,
        email: admin.email,
        name: admin.name,
        role: 'admin',
        title: admin.title || 'Yönetici',
        assignedPages: []
      }
    });
  }

  // 2. Kod ile Giriş
  if (code) {
    const normalized = String(code).trim().toUpperCase();

    // Admin mi?
    const adminMatch = (authData.admins || []).find(a => 
      (a.code && a.code.toUpperCase() === normalized) || 
      (a.email && a.email.toUpperCase() === normalized)
    );
    if (adminMatch) {
      if (password && adminMatch.password !== String(password).trim()) {
        return res.status(401).json({ error: 'Şifre hatalı!' });
      }
      return res.json({
        success: true,
        user: {
          code: adminMatch.code || adminMatch.email,
          email: adminMatch.email,
          name: adminMatch.name,
          role: 'admin',
          title: adminMatch.title,
          assignedPages: []
        }
      });
    }

    // Master Admin Anahtarı mı?
    if (authData.adminKey && normalized === authData.adminKey.toUpperCase()) {
      return res.json({
        success: true,
        user: {
          code: authData.adminKey,
          name: "Genel Yayın Yönetmeni (Master)",
          role: "admin",
          title: "Kurul Başkanı",
          assignedPages: []
        }
      });
    }

    // Editör anahtarlarından biri mi?
    const user = (authData.keys || []).find(k => k.code.toUpperCase() === normalized);
    if (user) {
      return res.json({
        success: true,
        user: {
          code: user.code,
          name: user.name,
          role: user.role || 'editor',
          title: user.title,
          magazineId: user.magazineId || '',
          assignedPages: user.assignedPages || []
        }
      });
    }

    return res.status(401).json({ error: 'Geçersiz veya yetkisiz giriş kodu.' });
  }

  return res.status(400).json({ error: 'E-posta ve şifre ya da giriş kodu gereklidir.' });
});

app.get('/api/auth/keys', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) {
    return res.status(403).json({ error: 'Yalnızca Admin bu listeyi görebilir.' });
  }
  res.json({
    admins: (authData.admins || []).map(a => ({ email: a.email, name: a.name, role: a.role, title: a.title, code: a.code })),
    keys: authData.keys || []
  });
});

app.post('/api/auth/keys', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) {
    return res.status(403).json({ error: 'Yetkisiz işlem.' });
  }

  const { code, name, role, title, magazineId, assignedPages } = req.body;
  if (!code || !name) return res.status(400).json({ error: 'Kod ve isim zorunludur.' });

  const normCode = String(code).trim().toUpperCase();
  const existingIdx = authData.keys.findIndex(k => k.code.toUpperCase() === normCode);

  const newKey = {
    code: normCode,
    name: String(name).trim(),
    role: role === 'admin' ? 'admin' : 'editor',
    title: title || '',
    magazineId: magazineId || '',
    assignedPages: Array.isArray(assignedPages) ? assignedPages : []
  };

  if (existingIdx >= 0) {
    authData.keys[existingIdx] = newKey;
  } else {
    authData.keys.push(newKey);
  }

  writeJSON(AUTH_FILE, authData);
  res.json({ success: true, key: newKey });
});

app.delete('/api/auth/keys/:code', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) {
    return res.status(403).json({ error: 'Yetkisiz işlem.' });
  }

  const normCode = String(req.params.code).trim().toUpperCase();
  if (normCode === authData.adminKey.toUpperCase()) {
    return res.status(400).json({ error: 'Ana yönetici anahtarı silinemez.' });
  }

  authData.keys = authData.keys.filter(k => k.code.toUpperCase() !== normCode);
  writeJSON(AUTH_FILE, authData);
  res.json({ success: true });
});

// ==========================================
// YARDIMCI: YENİ OKUL İÇİN 10 SAYFALIK STANDART RESMİ OMURGA ŞABLONU
// ==========================================
function createDefault10Pages(mag) {
  const name = mag.name || 'DERGİ';
  const school = mag.schoolName || 'Okul Adı';
  const accent = mag.themeColor || '#4f46e5';
  const layout = mag.layout || 'minimalist';

  return [
    {
      id: "p1",
      type: "cover",
      layout: layout,
      isFixedBackbone: true,
      navTitle: "01 • K1 Ön Dış Kapak",
      accentColor: accent,
      assignedEditor: "ADMIN-2026",
      status: "approved",
      magazineName: name.toUpperCase(),
      issueTag: "SAYI 01 • İLK SAYI • E-DERGİ",
      price: "OKUL E-DERGİSİ",
      mainHeadline: `${school} Dijital Yayın Hayatına Başlıyor!`,
      subHeadline: "Öğrencilerimizin, öğretmenlerimizin ve kulüplerimizin ortak emeğiyle hazırlanan ilk sayımız.",
      coverImage: mag.coverThumb || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      highlights: "Türk Bayrağı ve İstiklal Marşı\nAtatürk Köşesi ve Gençliğe Hitabe\nEditörden ve İçindekiler\nÖzel Dosya, Söyleşi ve Edebiyat",
      elements: []
    },
    {
      id: "p2",
      type: "k2",
      layout: "k2_bayrak_mars",
      isFixedBackbone: true,
      navTitle: "02 • K2 Türk Bayrağı & İstiklal Marşı",
      accentColor: "#dc2626",
      assignedEditor: "ADMIN-2026",
      status: "approved",
      headerText: "İSTİKLAL MARŞI",
      subText: "Korkma, sönmez bu şafaklarda yüzen al sancak;\nSönmeden yurdumun üstünde tüten en son ocak.\nO benim milletimin yıldızıdır, parlayacak;\nO benimdir, o benim milletimindir ancak.\n\nÇatma, kurban olayım, çehreni ey nazlı hilâl!\nKahraman ırkıma bir gül! Ne bu şiddet, bu celâl?\nSana olmaz dökülen kanlarımız sonra helâl...\nHakkıdır, Hakk'a tapan, milletimin istiklâl!",
      author: "Mehmet Akif ERSOY",
      image: "/img/turk-bayragi.svg",
      elements: []
    },
    {
      id: "p3",
      type: "k2",
      layout: "k2_ataturk",
      isFixedBackbone: true,
      navTitle: "03 • Atatürk & Gençliğe Hitabe",
      accentColor: "#d97706",
      assignedEditor: "ADMIN-2026",
      status: "approved",
      headerText: "\"Hayatta en hakiki mürşit ilimdir, fendir.\"",
      subText: "Ey Türk Gençliği!\n\nBirinci vazifen; Türk istiklâlini, Türk Cumhuriyetini, ilelebet muhafaza ve müdafaa etmektir. Mevcudiyetinin ve istikbalinin yegâne temeli budur. Bu temel, senin en kıymetli hazinendir.",
      author: "Gazi Mustafa Kemal ATATÜRK",
      image: "/img/ataturk.jpg",
      quote: "Bütün ümidim gençliktedir.",
      elements: []
    },
    {
      id: "p4",
      type: "toc",
      layout: "toc_classic",
      isFixedBackbone: true,
      navTitle: "04 • Editörden & İçindekiler",
      accentColor: accent,
      assignedEditor: "ADMIN-2026",
      status: "approved",
      editorTitle: `Yeni Bir Soluk: ${name}`,
      editorName: "Yayın Kurulu Başkanı",
      editorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      editorQuote: "Her dergi sayfası, bilimin ve sanatın ışığında yarına bırakılan kalıcı bir izdir.",
      editorText: "Büyük bir heyecanla hazırladığımız sayımızla karşınızdayız. Dergimiz okulumuzun tüm seslerini, projelerini ve edebi yeteneklerini bir araya getiriyor.",
      editorialBoard: `${school} Kültür ve Edebiyat Kulübü Tarafından Hazırlanmıştır.`,
      elements: []
    },
    {
      id: "p5",
      type: "article",
      layout: "art_classic",
      navTitle: "05 • Özel Dosya & Makale",
      accentColor: accent,
      assignedEditor: "ADMIN-2026",
      status: "approved",
      category: "BİLİM & KÜLTÜR DOSYASI",
      author: "Araştırma & Proje Ekibi",
      title: "Geleceğin Teknolojileri ve Okulumuz",
      spot: "Öğrencilerimizin geliştirdiği projeler ve kulüp çalışmaları.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
      imageCaption: "Laboratuvar ve proje atölyesi çalışmaları",
      content: "Okulumuzda yürütülen bilimsel çalışmalar, kültür-sanat etkinlikleri ve proje yarışmaları hız kesmeden devam ediyor. Gençlerimiz bilim yolunda üretmeye ve araştırmaya devam ediyor.",
      pullQuote: "Bilim ve akıl, geleceğe açılan en aydınlık kapımızdır.",
      elements: []
    },
    {
      id: "p6",
      type: "interview",
      layout: "int_classic",
      navTitle: "06 • Ayın Söyleşisi",
      accentColor: accent,
      assignedEditor: "ADMIN-2026",
      status: "approved",
      rubric: "AYIN RÖPORTAJI",
      interviewee: "Danışman Öğretmenimiz",
      role: "Edebiyat Zümre Başkanı",
      intro: "Okuma sevgisi, dergicilik kültürü ve geleceğe dair hedefler üzerine özel bir röportaj.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      q1: "Dergimizin çıkış süreci hakkında ne düşünüyorsunuz?",
      a1: "Öğrencilerimizin böyle bir yayını hayata geçirmesi okulumuz adına büyük bir gururdur.",
      q2: "Gençlere yazarlık konusunda tavsiyeniz nedir?",
      a2: "Sürekli okumak, dünyayı gözlemlemek ve hayal gücünü özgür bırakmak.",
      q3: "Gelecek sayılarda neler göreceğiz?",
      a3: "Daha fazla öğrenci eseri ve sürpriz içeriklerle yayına devam edeceğiz.",
      elements: []
    },
    {
      id: "p7",
      type: "literature",
      layout: "lit_classic",
      navTitle: "07 • Edebiyat & Şiir",
      accentColor: accent,
      assignedEditor: "ADMIN-2026",
      status: "approved",
      header: "GENÇ KALEMLER & ŞİİR",
      title: "Bir Umut Masalı",
      author: "Okul Şiir Topluluğu",
      bgImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
      poemText: "Rüzgâr fısıldar eski bir şarkıyı yapraklara,\nUmut yeşerir kalplerde usulca.\nKalem kâğıtla buluştuğu anda,\nBir dünya doğar yeniden burada.",
      bottomNote: "Öğrencilerimizin serbest kürsü edebi çalışmaları.",
      elements: []
    },
    {
      id: "p8",
      type: "catalog",
      layout: "cat_classic",
      navTitle: "08 • Proje & Sergi Vitrini",
      accentColor: accent,
      assignedEditor: "ADMIN-2026",
      status: "approved",
      title: "Proje & Tasarım Koleksiyonu",
      content: "Dönem boyunca atölyelerimizde ve kulüplerimizde geliştirilen öne çıkan öğrenci çalışmaları ve sergi seçkisi.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      spec1: "Bilim ve Teknoloji Projeleri",
      spec2: "Görsel Sanatlar ve Resim Sergisi",
      spec3: "2026 - 2027 Eğitim Dönemi",
      author: `${school} Proje Masası`,
      elements: []
    },
    {
      id: "p9",
      type: "k3",
      layout: "k3_classic",
      isFixedBackbone: true,
      navTitle: "09 • K3 Arka Kapak İçi (Künye)",
      accentColor: accent,
      assignedEditor: "ADMIN-2026",
      status: "approved",
      boardTitle: `${name.toUpperCase()} YAYIN KÜNYESİ`,
      publisher: `${school} Müdürlüğü`,
      editorInChief: "Genel Yayın Yönetmeni",
      advisor: "Kültür & Edebiyat Danışmanı",
      editorialTeam: "Öğrenci Yayın ve Mizanpaj Kurulu",
      contactInfo: `İletişim: iletisim@dergimiz.com.tr • ${school}`,
      nextIssueTeaserTitle: "GELECEK SAYIDA NELER VAR?",
      nextIssueText: "• Özel Bilim ve Teknoloji Söyleşileri\n• Yılın Resim ve Fotoğraf Sergisi\n• Ödüllü Okul Yarışması Sonuçları",
      elements: []
    },
    {
      id: "p10",
      type: "k4",
      layout: "k4_classic",
      isFixedBackbone: true,
      navTitle: "10 • K4 Arka Dış Kapak",
      accentColor: accent,
      assignedEditor: "ADMIN-2026",
      status: "approved",
      schoolName: school,
      motto: "Bilgi, Sanat ve Gelecek Işığında",
      coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dergimiz.com.tr",
      qrText: "Dergimizi çevrim içi okumak ve yeni sayıları takip etmek için karekodu okutun.",
      social: "@dergimiz • dergimiz.com.tr",
      closingQuote: "\"Hayata ve geleceğe değer katan genç kalemler.\"",
      elements: []
    }
  ];
}

// ==========================================
// API: ÇOKLU OKUL & DERGİ YÖNETİMİ (MAGAZINES)
// ==========================================
app.get('/api/magazines', (req, res) => {
  const magazines = readJSON(MAGAZINES_FILE, []);
  const issues = readJSON(ISSUES_FILE, []);
  
  const list = magazines.map(m => {
    const magIssues = issues.filter(i => i.magazineId === m.id);
    return {
      ...m,
      issueCount: magIssues.length,
      latestIssue: magIssues[magIssues.length - 1] || null
    };
  });

  res.json(list);
});

app.delete('/api/magazines-all', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) {
    return res.status(403).json({ error: 'Yetkisiz işlem.' });
  }
  writeJSON(MAGAZINES_FILE, []);
  writeJSON(ISSUES_FILE, []);
  res.json({ success: true });
});

app.post('/api/magazines', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) {
    return res.status(403).json({ error: 'Yalnızca Süper Yönetici yeni okul ve dergi ekleyebilir.' });
  }

  const { name, schoolName, period, themeColor, description, coverThumb, createFirstIssue } = req.body;
  if (!name || !schoolName) {
    return res.status(400).json({ error: 'Dergi adı ve Okul adı zorunludur.' });
  }

  const magazines = readJSON(MAGAZINES_FILE, []);
  const slug = 'mag-' + Date.now();
  
  const newMag = {
    id: slug,
    name: String(name).trim(),
    schoolName: String(schoolName).trim(),
    period: period || 'Aylık',
    themeColor: themeColor || '#4f46e5',
    description: description || `${schoolName} resmi e-dergisi.`,
    layout: req.body.layout || 'minimalist',
    logo: '',
    coverThumb: coverThumb || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    createdAt: new Date().toISOString().split('T')[0]
  };

  magazines.push(newMag);
  writeJSON(MAGAZINES_FILE, magazines);

  // Otomatik İlk Sayı
  if (createFirstIssue !== false) {
    const issues = readJSON(ISSUES_FILE, []);
    const issueId = 'sayi-' + Date.now();
    const firstIssue = {
      id: issueId,
      magazineId: newMag.id,
      title: `${newMag.name} • Sayı #1`,
      schoolName: newMag.schoolName,
      issueNumber: 1,
      issueMonth: "1. Sayı",
      releaseDate: new Date().toISOString().split('T')[0],
      status: "draft",
      views: 0,
      likes: 0,
      description: `${newMag.schoolName} ilk sayısı yayına hazırlanıyor.`,
      coverThumb: newMag.coverThumb,
      pages: createDefault10Pages(newMag)
    };
    issues.push(firstIssue);
    writeJSON(ISSUES_FILE, issues);
  }

  res.json({ success: true, magazine: newMag });
});

app.put('/api/magazines/:id', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) {
    return res.status(403).json({ error: 'Yetkisiz işlem.' });
  }

  const magazines = readJSON(MAGAZINES_FILE, []);
  const idx = magazines.findIndex(m => m.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Dergi bulunamadı.' });

  magazines[idx] = { ...magazines[idx], ...req.body, id: magazines[idx].id };
  writeJSON(MAGAZINES_FILE, magazines);
  res.json({ success: true, magazine: magazines[idx] });
});

app.delete('/api/magazines/:id', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) {
    return res.status(403).json({ error: 'Yetkisiz işlem.' });
  }

  let magazines = readJSON(MAGAZINES_FILE, []);
  magazines = magazines.filter(m => m.id !== req.params.id);
  writeJSON(MAGAZINES_FILE, magazines);

  let issues = readJSON(ISSUES_FILE, []);
  issues = issues.filter(i => i.magazineId !== req.params.id);
  writeJSON(ISSUES_FILE, issues);

  res.json({ success: true });
});

// ==========================================
// API: DERGİ SAYILARI (ISSUES)
// ==========================================
app.get('/api/issues', (req, res) => {
  const issues = readJSON(ISSUES_FILE, []);
  const includeDrafts = req.query.includeDrafts === 'true';
  const magId = req.query.magazineId;

  let filtered = issues;
  if (magId) {
    filtered = filtered.filter(i => i.magazineId === magId);
  }

  if (includeDrafts) {
    return res.json(filtered);
  }
  const published = filtered.filter(i => i.status === 'published');
  res.json(published);
});

app.get('/api/issues/:id', (req, res) => {
  const issues = readJSON(ISSUES_FILE, []);
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Sayı bulunamadı.' });

  // Okunma sayacını artır (eğer editör parametresi yoksa)
  if (req.query.view === '1') {
    issue.views = (issue.views || 0) + 1;
    writeJSON(ISSUES_FILE, issues);
  }

  res.json(issue);
});

app.post('/api/issues', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) return res.status(403).json({ error: 'Yalnızca Admin yeni sayı oluşturabilir.' });

  const issues = readJSON(ISSUES_FILE, []);
  const magazines = readJSON(MAGAZINES_FILE, []);
  const magId = req.body.magazineId || '';
  const targetMag = magazines.find(m => m.id === magId) || {
    name: req.body.magazineName || 'DERGİMİZ',
    schoolName: req.body.schoolName || 'E-DERGİ TASARIM STÜDYOSU',
    themeColor: '#4f46e5',
    layout: 'minimalist'
  };

  const magIssues = issues.filter(i => i.magazineId === magId);
  const newNumber = magIssues.length + 1;
  const newId = 'sayi-' + Date.now();

  let defaultPages = createDefault10Pages(targetMag);
  defaultPages[0].issueTag = `SAYI 0${newNumber} • ${(req.body.issueMonth || 'YENİ SAYI').toUpperCase()}`;

  // Eğer bu derginin önceki bir sayısı varsa Sabit Omurga sayfalarını (Bayrak/Marş, Atatürk, Editör/İçindekiler, K3 Künye, K4 Arka Kapak) koru
  const prevIssue = magIssues[magIssues.length - 1];
  if (prevIssue && Array.isArray(prevIssue.pages)) {
    const prevK3 = prevIssue.pages.find(p => p.type === 'k3');
    const prevK4 = prevIssue.pages.find(p => p.type === 'k4' || p.type === 'back');
    const prevToc = prevIssue.pages.find(p => p.type === 'toc');
    if (prevK3) defaultPages[8] = { ...JSON.parse(JSON.stringify(prevK3)), id: 'p9' };
    if (prevK4) defaultPages[9] = { ...JSON.parse(JSON.stringify(prevK4)), id: 'p10' };
    if (prevToc) {
      defaultPages[3].editorName = prevToc.editorName || defaultPages[3].editorName;
      defaultPages[3].editorImage = prevToc.editorImage || defaultPages[3].editorImage;
      defaultPages[3].editorialBoard = prevToc.editorialBoard || defaultPages[3].editorialBoard;
      defaultPages[3].layout = prevToc.layout || defaultPages[3].layout;
    }
  }

  const newIssue = {
    id: newId,
    title: req.body.title || `${targetMag.name} • Sayı #${newNumber}`,
    magazineId: magId,
    schoolName: targetMag.schoolName || req.body.schoolName || "E-DERGİ TASARIM STÜDYOSU",
    issueNumber: newNumber,
    issueMonth: req.body.issueMonth || `${newNumber}. Sayı`,
    releaseDate: new Date().toISOString().split('T')[0],
    status: "draft",
    views: 0,
    likes: 0,
    description: req.body.description || "Yeni sayı hazırlık aşamasında.",
    coverThumb: req.body.coverThumb || targetMag.coverThumb || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    pages: req.body.pages || defaultPages
  };

  issues.push(newIssue);
  writeJSON(ISSUES_FILE, issues);
  res.json({ success: true, issue: newIssue });
});

app.put('/api/issues/:id', (req, res) => {
  const issues = readJSON(ISSUES_FILE, []);
  const idx = issues.findIndex(i => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Sayı bulunamadı.' });

  // Güncelle
  issues[idx] = { ...issues[idx], ...req.body, id: issues[idx].id };
  writeJSON(ISSUES_FILE, issues);
  res.json({ success: true, issue: issues[idx] });
});

app.delete('/api/issues/:id', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) {
    return res.status(403).json({ error: 'Yalnızca Admin sayı silebilir.' });
  }

  let issues = readJSON(ISSUES_FILE, []);
  issues = issues.filter(i => i.id !== req.params.id);
  writeJSON(ISSUES_FILE, issues);
  res.json({ success: true });
});

// Yayınlama Kilidi / Açma
app.post('/api/issues/:id/publish', (req, res) => {
  const authHeader = req.headers['x-access-code'];
  const authData = readJSON(AUTH_FILE, { adminKey: 'ADMIN-2026', admins: [], keys: [] });
  if (!isAdmin(authHeader, authData)) {
    return res.status(403).json({ error: 'Yalnızca Admin yayına alabilir veya kaldırabilir.' });
  }

  const issues = readJSON(ISSUES_FILE, []);
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Sayı bulunamadı.' });

  issue.status = issue.status === 'published' ? 'draft' : 'published';
  writeJSON(ISSUES_FILE, issues);
  res.json({ success: true, status: issue.status });
});

// Sayfa Durumu & Admin Notu Güncelleme (Workflow)
app.post('/api/issues/:id/page-status', (req, res) => {
  const { pageId, status, adminNote, assignedEditor } = req.body;
  const issues = readJSON(ISSUES_FILE, []);
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Sayı bulunamadı.' });

  const page = (issue.pages || []).find(p => p.id === pageId);
  if (!page) return res.status(404).json({ error: 'Sayfa bulunamadı.' });

  if (status) page.status = status;
  if (adminNote !== undefined) page.adminNote = adminNote;
  if (assignedEditor !== undefined) page.assignedEditor = assignedEditor;

  writeJSON(ISSUES_FILE, issues);
  res.json({ success: true, page });
});

// Beğeni Artırma
app.post('/api/issues/:id/like', (req, res) => {
  const issues = readJSON(ISSUES_FILE, []);
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Sayı bulunamadı.' });

  issue.likes = (issue.likes || 0) + 1;
  writeJSON(ISSUES_FILE, issues);
  res.json({ success: true, likes: issue.likes });
});

// Medya (Fotoğraf / Video / Ses) Yükleme Endpoint
app.post('/api/upload', (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Yükleme hatası.' });
    const file = req.files && req.files[0];
    if (!file) return res.status(400).json({ error: 'Yüklenecek dosya bulunamadı.' });
    res.json({
      success: true,
      url: `/uploads/${file.filename}`,
      name: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });
  });
});

// ==========================================
// FAZ 9: AKILLI AI MOTORU (ANA MOTOR: DEEPSEEK + GÖRSEL MOTOR: GEMINI VISION)
// ==========================================
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.AI_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY || '';

async function callDeepSeekAI(systemPrompt, userPrompt, jsonMode = true) {
  if (!DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY tanımlı değil.');
  const body = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.35,
    max_tokens: 1800
  };
  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }
  const resp = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`DeepSeek API Hatası (${resp.status}): ${errText}`);
  }
  const data = await resp.json();
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  return content || '';
}

async function resolveImageBase64(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('data:image/')) {
    const parts = imageUrl.split(',');
    const mimeMatch = parts[0].match(/data:(image\/[a-zA-Z0-9+.-]+);base64/);
    return { mimeType: mimeMatch ? mimeMatch[1] : 'image/jpeg', base64: parts[1] };
  }
  if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/img/')) {
    const localPath = imageUrl.startsWith('/uploads/')
      ? path.join(UPLOADS_DIR, imageUrl.replace('/uploads/', ''))
      : path.join(PUBLIC_DIR, imageUrl);
    if (fs.existsSync(localPath)) {
      const ext = path.extname(localPath).toLowerCase();
      if (ext === '.svg') return null;
      const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      const buf = fs.readFileSync(localPath);
      return { mimeType, base64: buf.toString('base64') };
    }
  }
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    const resp = await fetch(imageUrl);
    if (!resp.ok) return null;
    const contentType = resp.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await resp.arrayBuffer();
    return {
      mimeType: contentType.split(';')[0],
      base64: Buffer.from(arrayBuffer).toString('base64')
    };
  }
  return null;
}

async function callGeminiVisionAI(promptText, imageUrl) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY tanımlı değil.');
  const imgData = await resolveImageBase64(imageUrl);
  const parts = [{ text: promptText }];
  if (imgData && imgData.base64) {
    parts.push({
      inline_data: {
        mime_type: imgData.mimeType,
        data: imgData.base64
      }
    });
  }
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError = null;
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json'
          }
        })
      });
      if (!resp.ok) {
        lastError = await resp.text();
        continue;
      }
      const data = await resp.json();
      const text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      if (text) return text;
    } catch (e) {
      lastError = e.message;
    }
  }
  throw new Error(lastError || 'Gemini Vision yanıt vermedi.');
}

// Seçili Öğe Odaklı Akıllı AI Komut Endpoint'i
app.post('/api/ai/magic-command', async (req, res) => {
  const { prompt, selectedObject, mode } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Komut boş olamaz.' });

  const obj = selectedObject || { type: 'none' };
  const cmdLower = String(prompt).toLowerCase();

  // Sadece Görsel (Gemini Vision) gerektiren durum kontrolü:
  const isVisionRequest =
    mode === 'vision' ||
    (obj.type === 'image' && /(analiz|ne var|betimle|açıklama yaz|altyazı|caption|manşet öner|başlık öner|ocr|görseldeki yazı|fotoğraftaki yazı)/i.test(cmdLower));

  if (isVisionRequest && obj.src) {
    try {
      const visionPrompt = `Sen bir okul ve kültür dergisi Görsel Sanat Yönetmenisin (Gemini Vision).
Seçili görseli incele ve kullanıcının şu isteğini yerine getir: "${prompt}".
Lütfen SADECE aşağıdaki JSON formatında yanıt ver:
{
  "engine": "gemini-2.5-flash-vision",
  "summary": "Yapılan görsel analizin özeti",
  "headline": "Fotoğrafa uygun çarpıcı dergi başlığı",
  "caption": "Fotoğrafın altına eklenecek edebi/haberci alt yazı",
  "ocrText": "Görselin içinde okunan metin (varsa)",
  "addCaptionToCanvas": true,
  "properties": {}
}`;
      const rawVision = await callGeminiVisionAI(visionPrompt, obj.src);
      const parsedVision = JSON.parse(rawVision);
      return res.json({ success: true, engine: 'Gemini 2.5 Flash (Vision)', result: parsedVision });
    } catch (visionErr) {
      console.warn('Gemini Vision fallback -> DeepSeek:', visionErr.message);
    }
  }

  // ANA MOTOR: DeepSeek (Tüm Metin, İmla/Noktalama, Resmi/Edebi Dil, İçerik ve Doğal Dil Tasarım Komutları)
  try {
    const sysPrompt = `Sen Dergimiz Profesyonel E-Dergi Stüdyosu'nun ANA YAPAY ZEKA MOTORUSUN (DeepSeek).
Kullanıcı dergi tuvalinde (Fabric.js) bir öğe seçti ve Türkçe bir komut verdi.
Seçili öğenin mevcut durumu:
${JSON.stringify(obj, null, 2)}

GÖREVİN:
Kullanıcının komutunu analiz et ve seçili öğeye uygulanacak değişiklikleri SADECE geçerli bir JSON nesnesi olarak döndür:
{
  "engine": "deepseek-chat",
  "summary": "Kullanıcıya gösterilecek kısa Türkçe işlem özeti (Örn: 'Metin imla hataları düzeltildi ve resmi dile çevrildi' veya 'Görsel siyah-beyaz yapıldı ve sağa döndürüldü')",
  "properties": {
    // Sadece değişmesi gereken Fabric.js / özel özellikleri yaz:
    // Metin (textbox) için:
    // "text": "Yeni veya düzeltilmiş metin (girinti istendiyse paragraf başlarına '    ' ekle)",
    // "textAlign": "left" | "center" | "right" | "justify",
    // "lineHeight": 1.15 - 2.4 arası sayı,
    // "charSpacing": -50 ile 400 arası sayı (100 = 0.1em),
    // "fontSize": sayı,
    // "fontWeight": "normal" | "bold" | "800",
    // "fontStyle": "normal" | "italic",
    // "fill": "#hexRenk",
    // "backgroundColor": "#hexRenk",
    // Görsel (image) veya Şekil için:
    // "angle": açı (0-360),
    // "angleDelta": mevcut açıya eklenecek derece (örn: 90, -90, 15, -15),
    // "flipX": true | false (yatay aynala),
    // "flipY": true | false (dikey aynala),
    // "filterPreset": "none" | "grayscale" | "sepia" | "vintage" | "kodachrome" | "technicolor" | "polaroid" | "highcontrast",
    // "filterBrightness": -0.5 ile 0.5 arası sayı,
    // "filterContrast": -0.5 ile 0.5 arası sayı,
    // "filterSaturation": -1 ile 1 arası sayı,
    // "maskType": "none" | "circle" | "rounded" | "arch" | "diamond" | "hexagon" | "star" | "polaroid" | "phone" | "monitor" | "tablet",
    // "cornerRadiusPx": 0 - 120 arası sayı,
    // "opacity": 0.1 - 1.0 arası sayı,
    // "alignOnPage": "center-h" | "center-v" | "center-both" | "left" | "right"
  },
  "suggestedHeadlines": []
}`;

    const rawDeepSeek = await callDeepSeekAI(sysPrompt, `Kullanıcı Komutu: "${prompt}"`, true);
    const parsed = JSON.parse(rawDeepSeek);
    return res.json({
      success: true,
      engine: 'DeepSeek (deepseek-chat)',
      result: parsed
    });
  } catch (err) {
    console.error('DeepSeek AI Hatası:', err.message);
    return res.json({
      success: true,
      engine: 'DeepSeek Yerel Akıllı Motor',
      fallback: true,
      errorInfo: err.message
    });
  }
});

// DeepSeek ile Tam Dergi İçeriği / Makale / Röportaj / Şiir Üretimi
app.post('/api/ai/generate-content', async (req, res) => {
  const { topic, contentType, tone } = req.body || {};
  if (!topic) return res.status(400).json({ error: 'Konu başlığı gerekli.' });

  try {
    const sysPrompt = `Sen Türkiye'deki okul ve kültür dergileri için içerik üreten başeditörsün (DeepSeek Ana Motor).
Verilen konuya ve türe göre zengin, akıcı, imla kurallarına tam uygun Türkçe dergi içeriği üret.
SADECE aşağıdaki JSON yapısında yanıt ver:
{
  "title": "Çarpıcı Ana Başlık",
  "spot": "1-2 cümlelik etkileyici alt başlık / spot metni",
  "author": "Önerilen Yazar / Kulüp Adı",
  "content": "En az 2-3 paragraflık zengin dergi metni (veya şiir/röportaj metni)",
  "pullQuote": "Sayfa ortasında büyük tırnak içinde vurgulanacak vurucu alıntı cümlesi",
  "headlines": ["Alternatif Başlık 1", "Alternatif Başlık 2", "Alternatif Başlık 3"]
}`;
    const userMsg = `Konu: "${topic}" | Tür: "${contentType || 'Makale'}" | Üslup: "${tone || 'Edebi ve Akıcı'}"`;
    const raw = await callDeepSeekAI(sysPrompt, userMsg, true);
    const data = JSON.parse(raw);
    return res.json({ success: true, engine: 'DeepSeek (deepseek-chat)', data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


app.get('/oku/:id', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'oku.html'));
});

app.get('/oku', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'oku.html'));
});

app.get('/editor', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'editor.html'));
});

app.get('/editor/:id', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'editor.html'));
});

app.use((req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Dergimiz Platformu ${PORT} portunda aktif!`);
  console.log(`🌐 Ziyaretçi Kitaplığı: http://localhost:${PORT}`);
  console.log(`✍️ Editör Masası: http://localhost:${PORT}/editor`);
});
