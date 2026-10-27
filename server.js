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

// Statik Dosyalar
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(PUBLIC_DIR));

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

  const { code, name, role, title, assignedPages } = req.body;
  if (!code || !name) return res.status(400).json({ error: 'Kod ve isim zorunludur.' });

  const normCode = String(code).trim().toUpperCase();
  const existingIdx = authData.keys.findIndex(k => k.code.toUpperCase() === normCode);

  const newKey = {
    code: normCode,
    name: String(name).trim(),
    role: role === 'admin' ? 'admin' : 'editor',
    title: title || '',
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
// API: DERGİ SAYILARI (ISSUES)
// ==========================================
app.get('/api/issues', (req, res) => {
  const issues = readJSON(ISSUES_FILE, []);
  const includeDrafts = req.query.includeDrafts === 'true';

  if (includeDrafts) {
    return res.json(issues);
  }
  // Ziyaretçi sadece yayınlananları görür
  const published = issues.filter(i => i.status === 'published');
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
  const newNumber = issues.length + 1;
  const newId = 'sayi-' + Date.now();

  const newIssue = {
    id: newId,
    title: req.body.title || `Sayı #${newNumber}`,
    schoolName: req.body.schoolName || "UFUK ANADOLU LİSESİ E-DERGİSİ",
    issueNumber: newNumber,
    issueMonth: req.body.issueMonth || "Yeni Sayı",
    releaseDate: new Date().toISOString().split('T')[0],
    status: "draft",
    views: 0,
    likes: 0,
    description: req.body.description || "Yeni sayı hazırlık aşamasında.",
    coverThumb: req.body.coverThumb || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    pages: req.body.pages || [
      {
        id: "p1",
        type: "cover",
        navTitle: "Kapak",
        accentColor: "#4f46e5",
        assignedEditor: authData.adminKey,
        status: "approved",
        adminNote: "",
        magazineName: "UFUK",
        issueTag: `SAYI 0${newNumber} • YENİ SAYI`,
        mainHeadline: "Yeni Sayı Başlığı",
        subHeadline: "Alt başlık ve dosya konusu açıklaması",
        coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        highlights: "Öne Çıkan Başlık 1\nÖne Çıkan Başlık 2"
      }
    ]
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
// SAYFA YÖNLENDİRMELERİ (SPA & ROUTING)
// ==========================================
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
