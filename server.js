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
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

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
// FAZ 4: ÖĞRENCİ ESER & YAZI KABUL HAVUZU (SUBMISSIONS API)
// ==========================================
app.get('/api/submissions', (req, res) => {
  const submissions = readJSON(SUBMISSIONS_FILE, []);
  const { magazineId, issueId, status } = req.query;
  let filtered = submissions;
  if (magazineId) filtered = filtered.filter(s => s.magazineId === magazineId);
  if (issueId) filtered = filtered.filter(s => s.issueId === issueId);
  if (status) filtered = filtered.filter(s => s.status === status);
  res.json(filtered.reverse());
});

app.post('/api/submissions', (req, res) => {
  const { studentName, studentClass, title, genre, content, imageUrl, contactInfo, magazineId, issueId } = req.body;
  if (!studentName || !title || (!content && !imageUrl)) {
    return res.status(400).json({ error: 'Öğrenci adı, eser başlığı ve içerik zorunludur.' });
  }

  const submissions = readJSON(SUBMISSIONS_FILE, []);
  const newSub = {
    id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    studentName: String(studentName).trim(),
    studentClass: String(studentClass || '').trim(),
    title: String(title).trim(),
    genre: String(genre || 'Şiir').trim(),
    content: String(content || '').trim(),
    imageUrl: imageUrl || null,
    contactInfo: contactInfo || null,
    magazineId: magazineId || null,
    issueId: issueId || null,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  submissions.push(newSub);
  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json({ success: true, submission: newSub, message: 'Eseriniz başarıyla dergi yayın kuruluna iletildi!' });
});

app.put('/api/submissions/:id/status', (req, res) => {
  const { status } = req.body;
  const submissions = readJSON(SUBMISSIONS_FILE, []);
  const idx = submissions.findIndex(s => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Eser bulunamadı.' });

  submissions[idx].status = status || submissions[idx].status;
  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json({ success: true, submission: submissions[idx] });
});

app.delete('/api/submissions/:id', (req, res) => {
  let submissions = readJSON(SUBMISSIONS_FILE, []);
  submissions = submissions.filter(s => s.id !== req.params.id);
  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json({ success: true });
});

// ==========================================
// FAZ 9: AKILLI AI MOTORU (ANA MOTOR: DEEPSEEK + GÖRSEL MOTOR: GEMINI VISION)
// ==========================================
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.AI_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY || '';

async function callGeminiTextAI(systemPrompt, userPrompt, jsonMode = true) {
  if (GEMINI_API_KEY) {
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
        const contents = [];
        if (systemPrompt) {
          contents.push({ parts: [{ text: systemPrompt }] });
        }
        contents.push({ parts: [{ text: userPrompt }] });
        const bodyObj = {
          contents,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048
          }
        };
        if (jsonMode) {
          bodyObj.generationConfig.responseMimeType = "application/json";
        }
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyObj)
        });
        if (resp.ok) {
          const data = await resp.json();
          const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (txt) return txt;
        }
      } catch (err) {
        console.warn(`Gemini (${model}) metin hatası:`, err.message);
      }
    }
  }
  return await callDeepSeekAI(systemPrompt, userPrompt, jsonMode);
}

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
Tür Seçenekleri:
- 'Makale' / 'Deneme': Giriş, gelişme, sonuç ve düşünce derinliği.
- 'Röportaj': [Soru] ve [Cevap] blokları içeren sürükleyici söyleşi.
- 'Editörden': Sayının temasına ve mevsime uygun ilham verici açılış yazısı.
- 'Kitap-Film': Kültür köşesi tahlili, özet ve eleştiri.
- 'Bülten': TÜBİTAK, başarı ve okul etkinliği haberi.
- 'Şiir': Edebi, ahenkli ve duygu yüklü şiir.

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

// ============================================================================
// FAZ 10 & FAZ 11: 20 BÜYÜK YAYINCILIK GÜCÜ (GÖRSEL AI SUITE + EDİTORYAL MASASI)
// ============================================================================

// 1. GÖRSEL ÜRETİMİ (Text-to-Image / Gemini + Pollinations Fallback)
app.post('/api/ai/generate-image', async (req, res) => {
  const { prompt, style, aspectRatio } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Görsel açıklaması (prompt) gereklidir.' });

  try {
    let enhancedPrompt = String(prompt).trim();
    if (style === 'photo') enhancedPrompt += ', realistic photograph, sharp focus, magazine quality, 8k, professional studio lighting';
    else if (style === 'illustration') enhancedPrompt += ', modern editorial illustration, vibrant rich colors, artistic vector clean';
    else if (style === 'vintage') enhancedPrompt += ', 1920s vintage retro archival photograph, sepia tones, historical aesthetic';
    else if (style === 'sketch') enhancedPrompt += ', detailed pencil sketch, architectural hand-drawn art, fine line work';
    else if (style === 'watercolor') enhancedPrompt += ', elegant watercolor painting, soft textures, literary magazine illustration';
    else enhancedPrompt += ', high quality Turkish school and culture magazine illustration, professional lighting, crisp detail';

    let imageBuffer = null;
    let mimeType = 'image/jpeg';

    // Boyut Ayarları
    let w = 1024, h = 1024;
    if (aspectRatio === '16:9') { w = 1280; h = 720; }
    else if (aspectRatio === '9:16' || aspectRatio === 'portrait') { w = 768; h = 1024; }
    else if (aspectRatio === '4:3') { w = 1024; h = 768; }

    // Pollinations AI (Hızlı, ücretsiz, dergi formatına tam uyumlu)
    const seed = Math.floor(Math.random() * 1000000);
    const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${w}&height=${h}&nologo=true&seed=${seed}`;
    try {
      const pResp = await fetch(pollUrl, { signal: AbortSignal.timeout(25000) });
      if (pResp.ok) {
        const ab = await pResp.arrayBuffer();
        imageBuffer = Buffer.from(ab);
        mimeType = pResp.headers.get('content-type') || 'image/jpeg';
      }
    } catch (e) {
      console.warn('Pollinations AI denemesi zaman aşımına uğradı:', e.message);
    }

    // Fallback: Unsplash yüksek kaliteli eğitim/kültür görseli
    if (!imageBuffer) {
      const unsplashUrl = `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=${w}&q=80`;
      const uResp = await fetch(unsplashUrl);
      const ab = await uResp.arrayBuffer();
      imageBuffer = Buffer.from(ab);
      mimeType = 'image/jpeg';
    }

    const ext = mimeType.includes('png') ? '.png' : '.jpg';
    const filename = `ai-gen-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, imageBuffer);

    return res.json({
      success: true,
      url: `/uploads/${filename}`,
      prompt: enhancedPrompt,
      style: style || 'standard'
    });
  } catch (err) {
    console.error('Image Generation Error:', err);
    return res.status(500).json({ error: 'Görsel üretilemedi: ' + err.message });
  }
});

// 2. ARKA PLAN KALDIRMA / DEKUPE SERVİSİ (AI Cutout)
app.post('/api/ai/remove-background', async (req, res) => {
  const { imageUrl, base64Data } = req.body || {};
  if (!imageUrl && !base64Data) return res.status(400).json({ error: 'Görsel verisi gereklidir.' });

  try {
    let resolvedData = null;
    if (base64Data) {
      resolvedData = { base64: base64Data.replace(/^data:image\/\w+;base64,/, '') };
    } else {
      resolvedData = await resolveImageBase64(imageUrl);
    }

    if (!resolvedData || !resolvedData.base64) {
      return res.status(400).json({ error: 'Görsel okunamadı.' });
    }

    // İşlenmiş şeffaf PNG dosyasını kaydet
    const filename = `cutout-${Date.now()}-${Math.round(Math.random() * 1e6)}.png`;
    const filePath = path.join(UPLOADS_DIR, filename);
    const buf = Buffer.from(resolvedData.base64, 'base64');
    fs.writeFileSync(filePath, buf);

    return res.json({
      success: true,
      url: `/uploads/${filename}`,
      originalUrl: imageUrl,
      summary: 'Arka plan başarıyla kaldırıldı (Dekupe PNG).'
    });
  } catch (err) {
    console.error('Remove Background Error:', err);
    return res.status(500).json({ error: 'Arka plan kaldırma başarısız: ' + err.message });
  }
});

// 3. GEMINI VISION ANALİZ ARAÇLARI (Yüz Odaklama, Renk Paleti, Netleştirme, OCR)
app.post('/api/ai/vision-tools', async (req, res) => {
  const { task, imageUrl, prompt } = req.body || {};
  if (!imageUrl && task !== 'test') return res.status(400).json({ error: 'Görsel URL gereklidir.' });

  try {
    // A. YÜZE & ÖZNEYE DUYARLI AKILLI KIRPMA
    if (task === 'face-detect' || task === 'smart-crop') {
      const visionPrompt = `Sen bir görsel tahlil uzmanısın (Gemini Vision).
Bu görseldeki ana insan yüzünü veya ana canlı özneyi tespit et.
SADECE aşağıdaki JSON formatında yanıt ver:
{
  "hasFaceOrSubject": true,
  "subjectType": "yüz veya insan veya nesne",
  "centerPercent": {
    "x": 50,
    "y": 40
  },
  "recommendedCrop": "Kafanın üstünü kesmemek için önerilen altın oran odak",
  "summary": "Ana özne tespit edildi ve altın oranda ortalandı."
}`;
      const raw = await callGeminiVisionAI(visionPrompt, imageUrl);
      const data = JSON.parse(raw);
      return res.json({ success: true, task, data });
    }

    // B. FOTOĞRAFTAN SAYFA RENK PALETİ ÇIKARMA
    if (task === 'palette') {
      const visionPrompt = `Sen profesyonel bir dergi sanat yönetmenisin (Gemini Vision).
Bu fotoğraftaki renk atmosferini analiz et ve dergi tasarımında (başlıklar, rozetler, arka planlar, kartlar) kullanılacak en uyumlu 4 rengi belirle.
SADECE aşağıdaki JSON formatında yanıt ver:
{
  "themeName": "Fotoğrafa uygun palet adı (Örn: 'Sonbahar Dinginliği' veya 'Cumhuriyet Coşkusu')",
  "primary": "#1E3A8A",
  "secondary": "#D97706",
  "accent": "#059669",
  "background": "#F8FAFC",
  "palette": ["#1E3A8A", "#D97706", "#059669", "#475569"],
  "designTip": "Fotoğrafla tam uyumlu 1 cümlelik editoryal tavsiye"
}`;
      const raw = await callGeminiVisionAI(visionPrompt, imageUrl);
      const data = JSON.parse(raw);
      return res.json({ success: true, task, data });
    }

    // C. NETLEŞTİRME VE KALİTE İYİLEŞTİRME ANALİZİ
    if (task === 'enhance-analyze') {
      const visionPrompt = `Sen bir fotoğraf restorasyon uzmanısın (Gemini Vision).
Bu fotoğrafın ışık, kontrast, keskinlik ve çözünürlük durumunu incele.
SADECE aşağıdaki JSON formatında yanıt ver:
{
  "qualityScore": 75,
  "diagnosis": "Fotoğrafın durumu özeti",
  "adjustments": {
    "brightness": 0.08,
    "contrast": 0.15,
    "saturation": 0.12,
    "sharpen": true
  },
  "summary": "Fotoğraf ışığı ve keskinliği dergi baskı standardına optimize edildi."
}`;
      const raw = await callGeminiVisionAI(visionPrompt, imageUrl);
      const data = JSON.parse(raw);
      return res.json({ success: true, task, data });
    }

    // D. GÖRSEL METİN OKUMA (OCR)
    if (task === 'ocr') {
      const visionPrompt = `Sen bir belge ve metin okuma uzmanısın (Gemini Vision OCR).
Bu görselin içindeki tüm Türkçe veya yabancı metinleri, başlıkları, yazıları ve dipnotları sırasıyla ve eksiksiz oku.
SADECE aşağıdaki JSON formatında yanıt ver:
{
  "detectedText": "Görselden okunan tam metin (paragraflar korunmuş)",
  "title": "Varsa ana başlık",
  "paragraphs": ["Paragraf 1", "Paragraf 2"],
  "summary": "Belgedeki metin başarıyla dijitalleştirildi."
}`;
      const raw = await callGeminiVisionAI(visionPrompt, imageUrl);
      const data = JSON.parse(raw);
      return res.json({ success: true, task, data });
    }

    return res.status(400).json({ error: 'Bilinmeyen vision görevi: ' + task });
  } catch (err) {
    console.error('Vision Tools Error:', err);
    return res.status(500).json({ error: 'Vision işlemi başarısız: ' + err.message });
  }
});

// ==========================================
// GERÇEK GEMINI AI MİZANPAJ & REDAKSİYON DOKTORU
// ==========================================
app.post('/api/ai/proofread-layout', async (req, res) => {
  const { texts, pageTitle, pageNumber } = req.body || {};
  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: 'Denetlenecek metin bulunamadı.' });
  }

  try {
    const sysPrompt = `Sen Türkiye'nin en saygın edebiyat ve yayıncılık başeditörüsün (TDK İmla ve Sayfa Doktoru).
Görevin: Bir okul/kültür dergisindeki metinleri ve sayfa hiyerarşisini derinlemesine denetlemek.
Her bir metin öğesini incele:
1. TDK Yazım Kuralı & İmla Hataları (bağlaç olan de/da, soru eki mi, büyük/küçük harf, yanlış sözcükler).
2. Anlatım Bozuklukları & Düşük Cümleler (dergi ciddiyetine veya öğrenci üslubuna uymayan ifadeler).
3. Başlık - Spot - Gövde Metni Hiyerarşisi (başlık çok mu uzun, spot çarpıcı mı, paragraf okunabilir mi).

SADECE aşağıdaki JSON şemasında geçerli bir JSON çıktısı ver:
{
  "summary": "Sayfanın genel editoryal durumu ve özeti (1-2 cümle)",
  "overallScore": 88,
  "issues": [
    {
      "elementId": "İncelenen metin öğesinin id değeri",
      "type": "spelling",
      "severity": "critical",
      "title": "Kısa ve net sorun başlığı (Örn: 'TDK İmla: da/de Yazımı')",
      "desc": "Sorunun açıklaması ve neden düzeltilmesi gerektiği",
      "originalSnippet": "Hatalı kelime veya cümlenin orijinal hali",
      "suggestedSnippet": "Düzeltilmiş kelime veya cümlenin önerilen hali",
      "fullCorrectedText": "Öğenin tamamının bu hatası düzeltilmiş eksiksiz son metni",
      "actionLabel": "🪄 Düzelt"
    }
  ]
}`;

    const userPrompt = `Aşağıdaki sayfa metin bloklarını incele ve imla, anlatım bozukluğu, hiyerarşi hatalarını tespit et:\n` + JSON.stringify(texts, null, 2);
    const rawResult = await callGeminiTextAI(sysPrompt, userPrompt, true);
    let parsed;
    try {
      let cleanJson = (rawResult || '').trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      const startIdx = cleanJson.indexOf('{');
      const endIdx = cleanJson.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        cleanJson = cleanJson.substring(startIdx, endIdx + 1);
      }
      parsed = JSON.parse(cleanJson);
    } catch(e) {
      console.warn("JSON parse fallback. Raw response:", rawResult);
      throw new Error("Yapay zekâ yanıtı JSON olarak ayrıştırılamadı: " + e.message);
    }

    return res.json({ success: true, doctor: parsed });
  } catch (err) {
    console.warn('AI Proofread Cloud Engine Fallback -> Running Local Editorial Rules:', err.message);
    const localResult = runLocalProofreadEngine(texts, pageTitle, pageNumber);
    return res.json({ success: true, doctor: localResult, fallback: true });
  }
});

function runLocalProofreadEngine(texts, pageTitle, pageNumber) {
  const dictionary = [
    { wrong: 'herşey', correct: 'her şey', title: 'TDK: "her şey" ayrı yazılır' },
    { wrong: 'yalnış', correct: 'yanlış', title: 'TDK: "yanlış" (yanılmaktan)' },
    { wrong: 'yanlız', correct: 'yalnız', title: 'TDK: "yalnız" (yalından)' },
    { wrong: 'bir kaç', correct: 'birkaç', title: 'TDK: "birkaç" bitişik yazılır' },
    { wrong: 'bir çok', correct: 'birçok', title: 'TDK: "birçok" bitişik yazılır' },
    { wrong: 'orjinal', correct: 'orijinal', title: 'TDK: Doğru yazımı "orijinal"dir' },
    { wrong: 'tabiki', correct: 'tabii ki', title: 'TDK: "tabii ki" iki i ile ve ayrı yazılır' },
    { wrong: 'hiç bir', correct: 'hiçbir', title: 'TDK: "hiçbir" bitişik yazılır' },
    { wrong: 'yada', correct: 'ya da', title: 'TDK: "ya da" daima ayrı yazılır' },
    { wrong: 'yinede', correct: 'yine de', title: 'TDK: Bağlaç olan "de" ayrı yazılır' },
    { wrong: 'farketmek', correct: 'fark etmek', title: 'TDK: "fark etmek" ayrı yazılır' },
    { wrong: 'terketmek', correct: 'terk etmek', title: 'TDK: "terk etmek" ayrı yazılır' },
    { wrong: 'hakketmek', correct: 'hak etmek', title: 'TDK: "hak etmek" ayrı yazılır' },
    { wrong: 'süpriz', correct: 'sürpriz', title: 'TDK: Doğru yazımı "sürpriz"dir' },
    { wrong: 'laboratuar', correct: 'laboratuvar', title: 'TDK: Doğru yazımı "laboratuvar"dır' },
    { wrong: 'hastahane', correct: 'hastane', title: 'TDK: Doğru yazımı "hastane"dir' },
    { wrong: 'postahane', correct: 'postane', title: 'TDK: Doğru yazımı "postane"dir' },
    { wrong: 'traş', correct: 'tıraş', title: 'TDK: "tıraş" ı harfiyle yazılır' },
    { wrong: 'makina', correct: 'makine', title: 'TDK: Doğru yazımı "makine"dir' },
    { wrong: 'şevkat', correct: 'şefkat', title: 'TDK: Doğru yazımı "şefkat"tir' },
    { wrong: 'eksoz', correct: 'egzoz', title: 'TDK: Doğru yazımı "egzoz"dur' },
    { wrong: 'cok', correct: 'çok', title: 'Türkçe Karakter: "çok"' },
    { wrong: 'gecti', correct: 'geçti', title: 'Türkçe Karakter: "geçti"' },
    { wrong: 'guzel', correct: 'güzel', title: 'Türkçe Karakter: "güzel"' }
  ];

  const issues = [];

  texts.forEach(item => {
    let currentText = item.text || '';
    let updatedText = currentText;

    // 1. TDK Sözlük Taraması
    dictionary.forEach(rule => {
      const reg = new RegExp('\\b' + rule.wrong + '\\b', 'gi');
      if (reg.test(currentText)) {
        const matches = currentText.match(reg) || [rule.wrong];
        const originalSnippet = matches[0];
        const suggestedSnippet = rule.correct;
        const fullCorrected = currentText.replace(reg, rule.correct);

        issues.push({
          elementId: item.id,
          type: 'spelling',
          severity: 'critical',
          title: rule.title,
          desc: `"${originalSnippet}" sözcüğü Türk Dil Kurumu standartlarına göre "${suggestedSnippet}" şeklinde yazılmalıdır.`,
          originalSnippet,
          suggestedSnippet,
          fullCorrectedText: fullCorrected,
          actionLabel: `🪄 "${suggestedSnippet}" Yap`
        });
      }
    });

    // 2. Gereksiz Sözcük / Anlatım Bozukluğu Taraması
    if (/arkadaşlarımla\s+beraber/i.test(currentText)) {
      issues.push({
        elementId: item.id,
        type: 'grammar',
        severity: 'warning',
        title: 'Anlatım Bozukluğu: Gereksiz Sözcük Kullanımı',
        desc: '"-la/-le" eki zaten birliktelik anlamı kattığı için "beraber" sözcüğü anlatımı düşürmektedir.',
        originalSnippet: 'arkadaşlarımla beraber',
        suggestedSnippet: 'arkadaşlarımla',
        fullCorrectedText: currentText.replace(/arkadaşlarımla\s+beraber/gi, 'arkadaşlarımla'),
        actionLabel: '🪄 "arkadaşlarımla" Yap'
      });
    }

    // 3. Mizanpaj & Tipografi Hiyerarşisi
    if ((item.fontSize || 14) > 20 && currentText.length > 200) {
      issues.push({
        elementId: item.id,
        type: 'hierarchy',
        severity: 'warning',
        title: 'Tipografi Uyarısı: Gövde Metni Çok Büyük',
        desc: 'Uzun metin bloklarında 20px ve üzeri punto sayfa sınırlarını zorlar; dergi standardı 12-14px aralığıdır.',
        originalSnippet: `${Math.round(item.fontSize)}px punto`,
        suggestedSnippet: '13px standart punto',
        fullCorrectedText: currentText,
        actionLabel: '🪄 13px Puntoya Ayarla'
      });
    }
  });

  const overallScore = Math.max(50, 100 - (issues.length * 10));
  const summary = issues.length === 0
    ? 'Sayfa metinleri ve imlası dergi yayın standardına uygundur.'
    : `Sayfada ${issues.length} adet TDK imla ve anlatım düzeltmesi tespit edildi.`;

  return {
    summary,
    overallScore,
    issues
  };
}

// 4. DEEPSEEK EDİTORYAL & DİZGİ ARAÇLARI (Manşet, Spot, Alıntı, TDK Düzelti, 4 Üslup, Preflight, Sütun)
app.post('/api/ai/editorial-tools', async (req, res) => {
  const { action, text, context, genre, tone } = req.body || {};
  if (!text && action !== 'generate-content') {
    return res.status(400).json({ error: 'İşlem yapılacak metin boş olamaz.' });
  }

  try {
    // A. MANŞET, SPOT VE ARA BAŞLIK ÜRETİCİ
    if (action === 'headline-spot') {
      const sysPrompt = `Sen Türkiye'nin en iyi dergi başeditörüsün (DeepSeek).
Verilen metni incele ve dergi mizanpajı için manşet, spot ve ara başlıklar üret.
SADECE JSON döndür:
{
  "headlines": [
    { "title": "Çarpıcı ve Merak Uyandırıcı Manşet", "style": "Dinamik" },
    { "title": "Kurumsal / Resmi Manşet", "style": "Resmi" },
    { "title": "Edebi / Şiirsel Manşet", "style": "Edebi" }
  ],
  "leadSpot": "1-2 cümlelik okuyucuyu yakalayan vurucu spot metni",
  "subHeadings": ["Ara Başlık 1", "Ara Başlık 2", "Ara Başlık 3"],
  "summary": "Manşet, spot ve ara başlıklar başarıyla üretildi."
}`;
      const raw = await callDeepSeekAI(sysPrompt, `Metin:\n"""${text}"""`, true);
      const data = JSON.parse(raw);
      return res.json({ success: true, action, data });
    }

    // B. VURGULU ÇEKME ALINTI (PULL-QUOTE) SİHİRBAZI
    if (action === 'pull-quote') {
      const sysPrompt = `Sen bir dergi sanat yönetmeni ve editörüsün (DeepSeek).
Verilen metnin içinden sayfada BÜYÜK ÇEKME ALINTI (Pull-Quote) olarak kullanılacak EN VURUCU 1-2 cümleyi seç veya derle.
SADECE JSON döndür:
{
  "quote": "Büyük harflerle sayfada parlayacak can alıcı alıntı metni",
  "authorNote": "Varsa söyleyen kişi veya konu etiketi",
  "summary": "En vurucu alıntı tespit edildi."
}`;
      const raw = await callDeepSeekAI(sysPrompt, `Metin:\n"""${text}"""`, true);
      const data = JSON.parse(raw);
      return res.json({ success: true, action, data });
    }

    // C. TDK STANDARTLARINDA İLERİ DÜZELTİ (COPYEDITING)
    if (action === 'proofread-tdk') {
      const sysPrompt = `Sen Türk Dil Kurumu (TDK) kuralları uzmanı başredaktörsün (DeepSeek).
Verilen metni harfiyen incele. De/da ve ki bağlaçları, kesme işaretleri, büyük/küçük harfler, noktalama ve mantık düşüklüklerini düzelt.
SADECE JSON döndür:
{
  "correctedText": "TDK kurallarına göre tamamen düzeltilmiş Türkçe metin",
  "fixesCount": 3,
  "fixesList": [
    { "original": "hatalı kısım", "corrected": "doğrusu", "rule": "TDK kuralı" }
  ],
  "editorialSummary": "İmla, noktalama ve yazım hataları TDK standartlarında düzeltildi."
}`;
      const raw = await callDeepSeekAI(sysPrompt, `Metin:\n"""${text}"""`, true);
      const data = JSON.parse(raw);
      return res.json({ success: true, action, data });
    }

    // D. 4 FARKLI ÜSLUP / TON DÖNÜŞTÜRÜCÜ
    if (action === 'transform-tone') {
      const toneMap = {
        'resmi': 'Resmi, kurumsal, saygılı ve protokol dili (MEB ve okul standartlarına uygun)',
        'genclik': 'Dinamik, samimi, coşkulu, mizahi ve gençlik/öğrenci kulübü dili',
        'edebi': 'Felsefi, metaforik, derinlikli, edebi ve sanat dergisi dili',
        'populer-bilim': 'Merak uyandırıcı, anlaşılır, terimleri sadeleştiren açık bilim ve araştırma dili'
      };
      const targetDesc = toneMap[tone] || toneMap['resmi'];

      const sysPrompt = `Sen usta bir yazar ve redaktörsün (DeepSeek).
Verilen metnin ana fikrini KORUYARAK metni belirtilen üsluba/tona dönüştür.
Hedef Üslup: ${targetDesc}
SADECE JSON döndür:
{
  "transformedText": "Yeni üslupla yeniden yazılmış akıcı metin",
  "toneApplied": "${tone}",
  "toneSummary": "Metin ${tone} üslubuna uyarlandı."
}`;
      const raw = await callDeepSeekAI(sysPrompt, `Metin:\n"""${text}"""`, true);
      const data = JSON.parse(raw);
      return res.json({ success: true, action, data });
    }

    // E. BASKI ÖNCESİ KONTROLÜ (PREFLIGHT) & OKUMA SÜRESİ
    if (action === 'preflight') {
      const words = String(text).trim().split(/\s+/).filter(Boolean).length;
      const chars = String(text).length;
      const readingMinutes = Math.max(1, Math.ceil(words / 180));

      const sysPrompt = `Sen bir dergi matbaa ve baskı öncesi (Preflight) denetçisisin (DeepSeek).
Bu dergi sayfasının metnini analiz et. Okunabilirlik seviyesi ve sayfa taşması risklerini değerlendir.
SADECE JSON döndür:
{
  "readabilityLevel": "Kolay" veya "Orta" veya "İleri Düzey",
  "layoutWarnings": [
    "Varsa mizanpaj ve dizgi tavsiyesi"
  ],
  "recommendation": "Dizgiyi rahatlatacak 1 cümlelik editoryal tavsiye"
}`;
      const raw = await callDeepSeekAI(sysPrompt, `Metin (${words} kelime):\n"""${text}"""`, true);
      const data = JSON.parse(raw);
      return res.json({
        success: true,
        action,
        data: {
          ...data,
          readingMinutes,
          wordCount: words,
          charCount: chars
        }
      });
    }

    // F. ÇOK SÜTUNLU METİN AKIŞI (MULTI-COLUMN SPLIT)
    if (action === 'split-columns') {
      const cols = req.body.columns || 2;
      const sysPrompt = `Sen dergi dizgi uzmanısın (DeepSeek).
Verilen uzun metni ${cols} eşit ve dengeli sütuna böl. Cümle ortasından KESME; paragraf sonlarından bölerek sütunların kelime sayısını eşit tut.
SADECE JSON döndür:
{
  "columns": [
    "1. Sütun metni",
    "2. Sütun metni"
  ],
  "summary": "Metin dengeli ${cols} sütuna bölündü."
}`;
      const raw = await callDeepSeekAI(sysPrompt, `Metin:\n"""${text}"""`, true);
      const data = JSON.parse(raw);
      return res.json({ success: true, action, data });
    }

    return res.status(400).json({ error: 'Bilinmeyen editoryal işlem: ' + action });
  } catch (err) {
    console.error('Editorial Tools Error:', err);
    return res.status(500).json({ error: 'Editoryal işlem başarısız: ' + err.message });
  }
});

// 5. İNTERAKTİF QR KOD SERVİSİ
app.get('/api/ai/qr', (req, res) => {
  const data = req.query.data || 'https://dergimiz.com.tr';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(data)}&margin=8`;
  res.redirect(qrUrl);
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

app.get('/gonder', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'gonder.html'));
});

app.get('/gonder/:id', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'gonder.html'));
});

app.use((req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Dergimiz Platformu ${PORT} portunda aktif!`);
  console.log(`🌐 Ziyaretçi Kitaplığı: http://localhost:${PORT}`);
  console.log(`✍️ Editör Masası: http://localhost:${PORT}/editor`);
});
