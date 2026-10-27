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

const colorSwatches = [
  { name: "İndigo", hex: "#4f46e5" },
  { name: "Okyanus", hex: "#0284c7" },
  { name: "Zümrüt", hex: "#059669" },
  { name: "Kehribar", hex: "#d97706" },
  { name: "Yakut", hex: "#e11d48" },
  { name: "Mor", hex: "#7c3aed" },
  { name: "Koyu Gri", hex: "#1e293b" }
];

function renderBarcodeSvg(color = '#000000') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="inline-block opacity-75"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>`;
}

const MAGAZINE_PRESETS = [
  { id: 1, name: 'Kamer', category: 'Moda & Kültür', layout: 'minimalist', accent: '#d97706', title: 'KAMER', headline: 'Güçlü Kadın Lider', desc: 'Kapak hikayesi için destek metni buraya girilecektir.', subs: ['Moda Sektöründe', 'Renkleri Kendinize Uyarlayın', 'Sezonun En İyi Görünümleri'] },
  { id: 2, name: 'Yeni (Resimlik)', category: 'Popüler Kültür & Gençlik', layout: 'brutalist', accent: '#facc15', title: 'RESİMLİK', headline: 'YENİ GÖRÜNÜMLER', desc: 'LİT POPÜLER KÜLTÜR DOSYASI', subs: ['Mavi Sarı Kırmızı Trend', 'Brütalist Stilde Moda', 'Kapak Hikayesi Destek'] },
  { id: 3, name: 'Konak', category: 'Mimari & Mekan', layout: 'modular', accent: '#0f172a', title: 'KONAK', headline: 'TARZ DENEYİMLERİ', desc: 'TASARIM ÖDÜLLERİ VE YAŞAM ALANLARI', subs: ['Yeni Renkler', 'Çağdaş Stiller', 'Taze Perspektifler'] },
  { id: 4, name: 'Doğal', category: 'Doğa & Yaşam', layout: 'fullscreen', accent: '#10b981', title: 'DOĞAL', headline: 'VAHŞİ YAŞAMIN BÜYÜSÜ', desc: 'Gezegenin Paydaşları ve Korunan Alanlar', subs: ['Ormanın Derinlikleri', 'Nesli Tükenenler', 'Yaban Hayatı Korumak'] },
  { id: 5, name: 'Kapital', category: 'İş & Ekonomi', layout: 'modular', accent: '#1d4ed8', title: 'KAPİTAL', headline: 'KÜRESEL PİYASALAR', desc: 'Yatırımcılar ve geleceğin şirketleri için yeni vizyon.', subs: ['Borsa Analizleri', 'Geleceğin Şirketleri', 'Kripto Dünyası'] },
  { id: 6, name: 'Siber', category: 'Karanlık Teknoloji', layout: 'brutalist', accent: '#22c55e', title: 'SİBER_AĞ', headline: 'YAPAY ZEKA DEVRİMİ', desc: 'Makineler ne zaman hissedecek ve düşünecek?', subs: ['Kuantum İşlemciler', 'Siber Güvenlik', 'Web 3.0 & Yapay Zeka'] },
  { id: 7, name: 'Damak', category: 'Gastronomi & Gurme', layout: 'minimalist', accent: '#ea580c', title: 'DAMAK', headline: 'ÇİKOLATALI LEZZETLER', desc: 'Mutfak sanatında ustalaşın. Görsel bir ziyafet.', subs: ['Sokak Lezzetleri', 'Şefin Sırrı', 'Mevsim Yeşillikleri'] },
  { id: 8, name: 'Bilim', category: 'Modern Keşif', layout: 'fullscreen', accent: '#06b6d4', title: 'BİLİM', headline: 'EVRENİN DERİNLİKLERİ', desc: 'Laboratuvardan derin uzaya uzanan bilim serüveni.', subs: ['James Webb Teleskobu', 'Genom Projeleri', 'Füzyon Enerjisi'] },
  { id: 9, name: 'Sinema', category: 'Vintage Noir', layout: 'brutalist', accent: '#f43f5e', title: 'SİNEVİZYON', headline: 'BEYAZ PERDE BÜYÜSÜ', desc: 'Klasik yönetmenler ve modern bağımsız sinema.', subs: ['Yönetmenin Vizyonu', 'Festivaller & Ödüller', 'Film Müziği'] },
  { id: 10, name: 'Spor', category: 'Dinamik Enerji', layout: 'modular', accent: '#ef4444', title: 'DİNAMİK', headline: 'ŞAMPİYONLARIN İZİNDE', desc: 'Zirveye giden yol disiplin ve tutkudan geçer.', subs: ['Antrenman Günlüğü', 'Zihinsel Dayanıklılık', 'Genç Yetenekler'] },
  { id: 11, name: 'Gezgin', category: 'Macera & Rota', layout: 'fullscreen', accent: '#f97316', title: 'PUSULA', headline: 'BİLİNMEYEN ROTALAR', desc: 'Kültürleri keşfetmek ve sınırların ötesine yolculuk.', subs: ['Sırt Çantalılar', 'Tarihi Şehirler', 'Doğa Yürüyüşleri'] },
  { id: 12, name: 'Edebiyat', category: 'Klasik Kitap', layout: 'minimalist', accent: '#7c3aed', title: 'SATIR ARASI', headline: 'KELİMELERİN GÜCÜ', desc: 'Şiirin ve düzyazının büyülü evreninde bir yolculuk.', subs: ['Ayın Şairi', 'Unutulmayan Romanlar', 'Kitap İncelemeleri'] },
  { id: 13, name: 'Müzik', category: 'Neon Ritim', layout: 'brutalist', accent: '#ec4899', title: 'RİTİM', headline: 'SESİN FREKANSI', desc: 'Analog tınılardan elektronik dalgalara müzik tarihi.', subs: ['Plak Kültürü', 'Yeni Çıkan Albümler', 'Konser Notları'] },
  { id: 14, name: 'Oyun', category: 'Retro Pixel', layout: 'modular', accent: '#8b5cf6', title: 'PİKSEL', headline: 'DİJİTAL DÜNYALAR', desc: 'Oyun tasarımının evrimi ve bağımsız geliştiriciler.', subs: ['İndie Oyunlar', 'Oyun Mekanikleri', 'Espor Arenası'] },
  { id: 15, name: 'Sanat', category: 'Galeri Çağdaş', layout: 'minimalist', accent: '#6366f1', title: 'GALERİ', headline: 'BİÇİM VE RENK', desc: 'Görsel sanatların dönüştürücü gücü ve yeni sergiler.', subs: ['Atölye Ziyareti', 'Heykel Sanatı', 'Dijital İllüstrasyon'] },
  { id: 16, name: 'Tarih', category: 'Arşiv Antik', layout: 'modular', accent: '#b45309', title: 'ZAMAN TÜNELİ', headline: 'MEDENİYETİN KÖKLERİ', desc: 'Geçmişin tozlu sayfalarından günümüze ışık tutan belgeler.', subs: ['Antik Kentler', 'Kırılma Noktaları', 'Arşiv Belgeleri'] },
  { id: 17, name: 'Gençlik', category: 'Canlı Kampüs', layout: 'brutalist', accent: '#e11d48', title: 'KAMPÜS', headline: 'GENÇLİĞİN SESİ', desc: 'Kulüpler, projeler, yarışmalar ve öğrenci başarıları.', subs: ['Münazara Kulübü', 'TÜBİTAK Projeleri', 'Okul Festivali'] },
  { id: 18, name: 'Uzay', category: 'Derin Kozmos', layout: 'fullscreen', accent: '#38bdf8', title: 'KOZMOS', headline: 'YILDIZLARIN ÖTESİNDE', desc: 'Gezegenler, karadelikler ve geleceğin uzay kolonileri.', subs: ['Mars Görevleri', 'Ötegezegenler', 'Astrofizik Temelleri'] },
  { id: 19, name: 'Felsefe', category: 'Sade Düşünce', layout: 'minimalist', accent: '#475569', title: 'DÜŞÜNCE', headline: 'SORULARIN PEŞİNDE', desc: 'Varlık, bilgi ve ahlak üzerine derinlikli bir sorgulama.', subs: ['Sokratik Yöntem', 'Zihin Felsefesi', 'Etik Tartışmalar'] },
  { id: 20, name: 'Doğaüstü', category: 'Gizem & Fenomen', layout: 'fullscreen', accent: '#a855f7', title: 'BİLİNMEYEN', headline: 'GİZEMLİ DÜNYA', desc: 'Evrenin çözülememiş sırları ve bilimin araştırdığı fenomenler.', subs: ['Kriptoloji', 'Derin Deniz Canlıları', 'Tarihin Gizemleri'] }
];

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

  document.getElementById('userNameDisplay').textContent = currentUser.name || "Editör";
  document.getElementById('userRoleDisplay').textContent = currentUser.role === 'admin' ? "👑 Yönetici (Admin)" : "✍️ Sayfa Editörü";

  const adminActions = document.getElementById('adminActions');
  if (currentUser.role !== 'admin') {
    if (adminActions) adminActions.classList.add('hidden');
    const deleteBtn = document.getElementById('btnDeletePage');
    if (deleteBtn) deleteBtn.classList.add('hidden');
    const addPageBtn = document.getElementById('btnAddPageBtn');
    if (addPageBtn) addPageBtn.classList.add('hidden');
  }
}

function handleLogout() {
  localStorage.removeItem('dergiUser');
  localStorage.removeItem('dergiAccessCode');
  window.location.href = '/';
}

// ==========================================
// 2. OKUL & DERGİ (MAGAZINES) VE SAYI SEÇİMİ
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

  if (allMagazines.length === 0) {
    allMagazines = [{
      id: "mag-ufuk-al",
      name: "Ufuk E-Dergi",
      schoolName: "Ufuk Anadolu Lisesi",
      period: "Aylık",
      themeColor: "#4f46e5"
    }];
  }

  const magSelector = document.getElementById('magazineSelector');
  const btnNewMag = document.getElementById('btnNewMagModal');
  const keyMagSelect = document.getElementById('newKeyMagazine');

  if (magSelector) {
    magSelector.innerHTML = '';
    allMagazines.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.name} (${m.schoolName})`;
      magSelector.appendChild(opt);
    });
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

  // Yetkilendirme Kontrolü
  if (currentUser && currentUser.role !== 'admin' && currentUser.magazineId) {
    const targetMag = allMagazines.find(m => m.id === currentUser.magazineId) || allMagazines[0];
    currentMagazine = targetMag;
    if (magSelector) {
      magSelector.value = targetMag.id;
      magSelector.disabled = true;
    }
    if (btnNewMag) btnNewMag.classList.add('hidden');
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const targetMagId = urlParams.get('magId');
    currentMagazine = (targetMagId && allMagazines.find(m => m.id === targetMagId)) || allMagazines[0];
    if (magSelector) {
      magSelector.value = currentMagazine.id;
      magSelector.disabled = false;
    }
    if (btnNewMag) btnNewMag.classList.remove('hidden');
  }

  updateMagazineHeaderUI();
  renderRegisteredMagazinesList();
  await loadAllIssues(currentMagazine.id);
}

function updateMagazineHeaderUI() {
  if (!currentMagazine) return;
  const schoolText = document.getElementById('headerSchoolText');
  if (schoolText) schoolText.textContent = currentMagazine.schoolName;
}

function renderRegisteredMagazinesList() {
  const container = document.getElementById('registeredMagazinesList');
  if (!container) return;
  if (!allMagazines || allMagazines.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-500">Kayıtlı dergi bulunamadı.</div>`;
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

async function deleteCurrentMagazine() {
  if (!currentMagazine) return;
  await deleteMagazineById(currentMagazine.id);
}

async function deleteMagazineById(magId) {
  if (currentUser.role !== 'admin') {
    showToast("Yalnızca Yönetici (Admin) dergi silebilir!");
    return;
  }
  if (allMagazines.length <= 1) {
    showToast("Sistemde en az 1 dergi bulunmalıdır! Önce yeni derginizi ekleyin, sonra örneği silin.");
    return;
  }
  const target = allMagazines.find(m => m.id === magId);
  if (!target) return;

  if (!confirm(`"${target.name} (${target.schoolName})" dergisini ve bağlı tüm sayılarını kalıcı olarak silmek istediğinize emin misiniz?`)) {
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
      await loadAllMagazines();
      if (allMagazines.length > 0) {
        await onMagazineChange(allMagazines[0].id);
      }
    } else {
      showToast(data.error || "Silinemedi!");
    }
  } catch (err) {
    showToast("Sunucu bağlantı hatası!");
  }
}

async function deleteCurrentIssue() {
  if (currentUser.role !== 'admin') {
    showToast("Yalnızca Yönetici (Admin) sayı silebilir!");
    return;
  }
  if (!currentIssue) return;
  if (allIssues.length <= 1) {
    showToast("Bu dergide en az 1 sayı bulunmalıdır!");
    return;
  }
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
    } else {
      showToast(data.error || "Sayı silinemedi!");
    }
  } catch (err) {
    showToast("Sunucu hatası!");
  }
}

// ==========================================
// TÜM ŞABLONLAR & 20 KONSEPT GALERİSİ (OKUL FARK ETMEKSİZİN)
// ==========================================
const ALL_PAGE_TEMPLATES_CATALOG = [
  { type: 'cover', layout: 'minimalist', title: '🏛️ K1 • Minimalist Kapak', desc: 'Sol siyah özet bloğu, sağ dikey görsel ve barkod.', badge: 'Minimalist', color: '#d97706' },
  { type: 'cover', layout: 'brutalist', title: '⚡ K1 • Brütalist Kapak', desc: 'Devasa üst üste başlık, eğik görsel çerçevesi ve sarı rozet.', badge: 'Brütalist', color: '#eab308' },
  { type: 'cover', layout: 'modular', title: '📐 K1 • Modüler Kapak', desc: 'Net ızgara çerçeveleri, 2 sütun görsel, 1 sütun kutu yığını.', badge: 'Modüler', color: '#0284c7' },
  { type: 'cover', layout: 'fullscreen', title: '🌄 K1 • Fullscreen Kapak', desc: 'Tam sayfa görsel üzeri edebi manşet ve yatay spotlar.', badge: 'Fullscreen', color: '#10b981' },
  { type: 'k2', subType: 'ataturk', title: '🇹🇷 K2 • Atatürk & Hitabe', desc: 'Cumhuriyet köşesi, Atatürk portresi ve Gençliğe Hitabe.', badge: 'Kapak İçi A', color: '#dc2626' },
  { type: 'k2', subType: 'director', title: '✍️ K2 • Müdür / Sunuş Yazısı', desc: 'Okul müdürü veya genel yayın yönetmeni hoş geldiniz mesajı.', badge: 'Kapak İçi B', color: '#4f46e5' },
  { type: 'k2', subType: 'artistic', title: '🎨 K2 • Sanatsal Vizyon', desc: 'Tam sayfa sanatsal fotoğraf ve okul vizyon sözü.', badge: 'Kapak İçi C', color: '#8b5cf6' },
  { type: 'toc', title: '📑 İçindekiler & Başyazı', desc: 'Editörün masası, vurgu alıntısı ve tıklanabilir sayfa fihristi.', badge: 'Fihrist', color: '#6366f1' },
  { type: 'article', title: '📰 Özel Dosya & Makale', desc: 'Manşet fotoğrafı, iki sütunlu yazı ve vurgu alıntı kutusu.', badge: 'Makale', color: '#3b82f6' },
  { type: 'interview', title: '🎙️ Ayın Konuğu & Röportaj', desc: 'Renkli degrade konuk çerçevesi ve S1-S2-S3 soru-cevap kutuları.', badge: 'Renkli Çerçeveli', color: '#d97706' },
  { type: 'literature', title: '🪶 Edebiyat & Şiir Köşesi', desc: 'Sanatsal görsel, ortalı şiir/deneme tipografisi ve alt not.', badge: 'Sanat & Şiir', color: '#ec4899' },
  { type: 'video', title: '🎬 Etkinlik & Video (MP4)', desc: 'Sayfa içi gömülü MP4 video oynatıcı, başlık ve açıklama.', badge: 'Multimedya', color: '#f59e0b' },
  { type: 'quiz', title: '💡 Etkileşimli Köşe & Quiz', desc: 'Çoktan seçmeli ödüllü soru kutusu + Ayın Kitap & Film önerisi.', badge: 'İnteraktif', color: '#14b8a6' },
  { type: 'k3', title: '👥 K3 • Arka Kapak İçi (Künye)', desc: 'Resmi yayın kurulu künyesi ve Gelecek Sayıda Neler Var kutusu.', badge: 'Künye', color: '#64748b' },
  { type: 'k4', title: '🏁 K4 • Arka Dış Kapak', desc: 'Prestij halka rozeti, QR kod, okul mottosu ve barkod.', badge: 'Arka Kapak', color: '#4f46e5' },
  { type: 'freeform', title: '✨ Boş Tuval (Serbest Tasarım)', desc: 'Metin kutuları, renkli çerçeveler, resim ve videoları serbestçe dizin.', badge: 'Serbest', color: '#10b981' }
];

function openAllTemplatesModal() {
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
          <button onclick="convertCurrentPageToTemplate('${item.type}', '${item.layout || item.subType || ''}')" class="py-1.5 px-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-[10.5px] font-bold transition">
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
          <div class="p-2.5 rounded-xl mb-2.5 border border-slate-800/90" style="background: linear-gradient(135deg, ${p.accent}33, #0f172a)">
            <div class="text-[10px] font-mono text-slate-300 uppercase tracking-widest">${escapeHtml(p.name)}</div>
            <div class="font-serif font-black text-base text-white tracking-tight truncate">${escapeHtml(p.title)}</div>
            <div class="text-[11px] font-bold text-amber-300 truncate mt-0.5">${escapeHtml(p.headline)}</div>
          </div>
          <p class="text-[11px] text-slate-400 leading-snug mb-3 line-clamp-2">${escapeHtml(p.desc)}</p>
        </div>
        <div class="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80">
          <button onclick="applyConceptToCurrentPage(${p.id})" class="py-1.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[10.5px] font-bold transition shadow">
            ⚡ Sayfaya Uygula
          </button>
          <button onclick="addConceptAsNewPage(${p.id})" class="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-[10.5px] font-semibold transition">
            ➕ Yeni Kapak Ekle
          </button>
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
  if (!canUserEditPage(page)) {
    showToast("Bu sayfayı düzenleme yetkiniz yok!");
    return;
  }

  page.type = 'cover';
  page.layout = preset.layout;
  page.accentColor = preset.accent;
  page.magazineName = preset.title;
  page.issueTag = "SAYI 01 • 2026";
  page.price = preset.category.toUpperCase();
  page.mainHeadline = preset.headline;
  page.subHeadline = preset.desc;
  page.highlights = (preset.subs || []).join('\n');
  if (!page.coverImage) {
    page.coverImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80";
  }

  closeModal('allTemplatesModal');
  renderAll();
  saveAllChangesToServer();
  showToast(`🎨 "${preset.name}" konsepti mevcut sayfaya uygulandı!`);
}

function addConceptAsNewPage(presetId) {
  if (currentUser.role !== 'admin') {
    showToast("Yalnızca Admin yeni sayfa ekleyebilir!");
    return;
  }
  const preset = MAGAZINE_PRESETS.find(p => p.id === Number(presetId));
  if (!preset) return;

  const newPage = {
    id: 'p' + Date.now(),
    type: 'cover',
    layout: preset.layout,
    navTitle: `Kapak • ${preset.name}`,
    accentColor: preset.accent,
    assignedEditor: currentUser.code,
    status: 'draft',
    magazineName: preset.title,
    issueTag: "SAYI 01 • 2026",
    price: preset.category.toUpperCase(),
    mainHeadline: preset.headline,
    subHeadline: preset.desc,
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    highlights: (preset.subs || []).join('\n'),
    elements: []
  };

  magazineData.pages.push(newPage);
  closeModal('allTemplatesModal');
  selectPageForEdit(magazineData.pages.length - 1);
  saveAllChangesToServer();
  showToast(`➕ "${preset.name}" konseptli yeni sayfa eklendi!`);
}

function convertCurrentPageToTemplate(templateType, subOption = '') {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !canUserEditPage(page)) {
    showToast("Bu sayfayı düzenleme yetkiniz yok!");
    return;
  }

  page.type = templateType;
  if (templateType === 'cover') {
    page.layout = subOption || 'minimalist';
    page.magazineName = page.magazineName || (currentMagazine ? currentMagazine.name.toUpperCase() : 'DERGİ');
    page.issueTag = page.issueTag || 'SAYI 01 • 2026';
    page.price = page.price || 'OKUL E-DERGİSİ';
    page.mainHeadline = page.mainHeadline || 'Kapak Ana Manşet Başlığı';
    page.subHeadline = page.subHeadline || 'Alt başlık ve dosya açıklaması buraya girilir.';
    page.coverImage = page.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80';
    page.highlights = page.highlights || 'Özel Dosya\nAyın Röportajı\nEdebiyat Köşesi';
  } else if (templateType === 'k2') {
    page.subType = subOption || 'ataturk';
    page.headerText = page.headerText || (page.subType === 'ataturk' ? 'TÜRK GENÇLİĞİNE HİTABE' : 'SUNUŞ & BAŞYAZI');
    page.subText = page.subText || 'Ey Türk Gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyeti\'ni, ilelebet muhafaza ve müdafaa etmektir.';
    page.author = page.author || 'Gazi Mustafa Kemal Atatürk';
    page.image = page.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80';
    page.quote = page.quote || 'Bütün ümidim gençliktedir.';
  } else if (templateType === 'interview') {
    page.rubric = page.rubric || 'AYIN KONUĞU';
    page.interviewee = page.interviewee || 'Selin Arslan';
    page.role = page.role || 'Türk Dili ve Edebiyatı Öğretmeni';
    page.intro = page.intro || 'Okulumuzun sevilen öğretmenleriyle gerçekleştirdiğimiz keyifli söyleşi.';
    page.photo = page.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
    page.q1 = page.q1 || 'Lise yıllarınızda nasıl bir öğrenciydiniz? Edebiyata ilginiz o zaman mı başladı?';
    page.a1 = page.a1 || 'Çok meraklı ve kütüphaneden çıkmayan bir öğrenciydim. Okul dergisine yazdığım ilk öykü yayınlandığında yaşadığım heyecan bugün öğretmen olmamın en büyük sebebidir.';
    page.q2 = page.q2 || 'Dijital çağda lise öğrencilerine okuma alışkanlığı kazanmaları için ne önerirsiniz?';
    page.a2 = page.a2 || 'Klasikleri okumak harikadır ama önce kendi ilgi alanınızı keşfedin. Sizi büyüleyen o ilk kitabı bulduğunuzda gerisi gelecektir.';
    page.q3 = page.q3 || 'Dergimiz ekibine ve genç yazarlarımıza son mesajınız nedir?';
    page.a3 = page.a3 || 'Yazmaktan ve üretmekten asla vazgeçmeyin. Kaleminiz daima özgür ve özgün olsun.';
  } else if (templateType === 'article') {
    page.category = page.category || 'ÖZEL DOSYA';
    page.title = page.title || 'Geleceğin Dünyasında Bilim ve Sanat';
    page.author = page.author || 'Araştırma Kulübü';
    page.image = page.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
    page.imageCaption = page.imageCaption || 'Proje atölyesinden bir görünüm.';
    page.content = page.content || 'Makale metninizi doğrudan üzerine tıklayarak veya sağ panelden düzenleyebilirsiniz.';
    page.pullQuote = page.pullQuote || 'Yaratıcılık, sınırları zorlamakla başlar.';
  } else if (templateType === 'literature') {
    page.header = page.header || 'KALEMİMİZDEN • EDEBİYAT & SANAT';
    page.title = page.title || 'Ekim Rüzgarı ve Koridorlar';
    page.author = page.author || 'Elif Su Yıldız • 11-C';
    page.bgImage = page.bgImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    page.poemText = page.poemText || 'Sarı yapraklar düşerken okul bahçesine,\nBir zil sesi böler en derin hayalleri.\nTahta sıralarda kazılı eski isimler,\nAnlatır sessizce geçen tüm mevsimleri.';
    page.bottomNote = page.bottomNote || 'Siz de şiir ve denemelerinizi dergi ekibimize gönderebilirsiniz.';
  } else if (templateType === 'toc') {
    page.editorTitle = page.editorTitle || 'Bu Sayıya Dair';
    page.editorQuote = page.editorQuote || 'Dergimizi hazırlarken ilhamımızı sanattan ve bilimden alıyoruz.';
    page.editorText = page.editorText || 'Yeni sayımızda öğrencilerimizin ve öğretmenlerimizin ortak emeğiyle hazırlanan zengin içeriklerle karşınızdayız.';
    page.editorName = page.editorName || 'Genel Yayın Yönetmeni';
  }

  closeModal('allTemplatesModal');
  renderAll();
  saveAllChangesToServer();
  showToast(`⚡ Sayfa şablonu "${templateType.toUpperCase()}" olarak güncellendi!`);
}

async function onMagazineChange(newMagId) {
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
    showToast("Lütfen Okul Adı ve Dergi Adı alanlarını doldurun!");
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
      showToast(`🎉 "${name}" dergisi ve ${schoolName} masası oluşturuldu!`);
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
  const queryParam = effectiveMagId ? `&magazineId=${effectiveMagId}` : '';

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
  selector.innerHTML = '';
  allIssues.forEach(iss => {
    const opt = document.createElement('option');
    opt.value = iss.id;
    opt.textContent = `${iss.title} (${iss.status === 'published' ? 'Yayında' : 'Taslak'})`;
    selector.appendChild(opt);
  });

  const activeIssue = (targetId && allIssues.find(i => i.id === targetId)) || allIssues[0];
  if (activeIssue) {
    selector.value = activeIssue.id;
    setIssue(activeIssue);
  } else {
    currentIssue = null;
    magazineData = { schoolName: currentMagazine ? currentMagazine.schoolName : '', pages: [] };
    renderAll();
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
    magazineData.pages = [];
  }
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
// 3. SAYFA RENDER & GÖRÜNÜM
// ==========================================
function renderAll() {
  document.getElementById('totalPagesBadge').textContent = `${magazineData.pages.length} Sayfa`;
  renderPageListSidebar();
  renderMagazineViewport();
  renderRightEditorPanel();
  updateTopReviewBanner();
}

function setAppMode(mode) {
  appMode = mode;
  const leftBar = document.getElementById('leftSidebar');
  const rightBar = document.getElementById('rightSidebar');
  const topBanner = document.getElementById('canvasTopBanner');
  const actionBar = document.getElementById('canvasActionBar');
  const stickyNote = document.getElementById('adminStickyNoteBox');
  const btnEdit = document.getElementById('btnEditMode');
  const btnRead = document.getElementById('btnReadMode');
  const rtBar = document.getElementById('floatingRichTextBar');

  if (mode === 'read') {
    leftBar.classList.add('hidden');
    rightBar.classList.add('hidden');
    topBanner.classList.add('hidden');
    actionBar.classList.add('hidden');
    stickyNote.classList.add('hidden');
    if (rtBar) rtBar.classList.add('hidden');
    btnRead.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-indigo-600 text-white shadow";
    btnEdit.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all text-slate-400 hover:text-white";
  } else {
    leftBar.classList.remove('hidden');
    rightBar.classList.remove('hidden');
    topBanner.classList.remove('hidden');
    actionBar.classList.remove('hidden');
    btnEdit.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-indigo-600 text-white shadow";
    btnRead.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all text-slate-400 hover:text-white";
    updateTopReviewBanner();
  }
  renderMagazineViewport();
}

function toggleSpreadMode() {
  spreadMode = !spreadMode;
  updateSpreadButtonUI();
  renderMagazineViewport();
}

function updateSpreadButtonUI() {
  const el = document.getElementById('spreadToggleText');
  if (el) el.textContent = spreadMode ? "Çift Sayfa" : "Tek Sayfa";
}

function renderPageListSidebar() {
  const container = document.getElementById('pageListContainer');
  container.innerHTML = '';

  const statusIcons = {
    approved: 'ph-check-circle text-emerald-400',
    review: 'ph-clock text-sky-400',
    revision: 'ph-warning text-rose-400',
    draft: 'ph-pencil-line text-amber-400'
  };

  const statusTexts = {
    approved: 'Onaylandı',
    review: 'İncelemede',
    revision: 'Revize',
    draft: 'Taslak'
  };

  magazineData.pages.forEach((page, idx) => {
    const isSelected = idx === selectedEditIndex;
    const pageStatus = page.status || 'draft';
    const isAssignedToMe = canUserEditPage(page);

    const item = document.createElement('div');
    item.className = `p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
      isSelected 
        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow' 
        : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:bg-slate-800'
    }`;
    item.onclick = () => selectPageForEdit(idx);

    item.innerHTML = `
      <div class="flex items-center gap-2.5 overflow-hidden">
        <div class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 font-bold text-xs text-slate-300 border border-slate-700">
          ${idx + 1}
        </div>
        <div class="truncate">
          <div class="text-xs font-semibold truncate flex items-center gap-1.5">
            <span class="truncate">${escapeHtml(page.navTitle || 'Sayfa ' + (idx + 1))}</span>
            ${!isAssignedToMe ? '<i class="ph ph-lock text-slate-500 text-[11px]" title="Salt Okunur"></i>' : ''}
          </div>
          <div class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
            <i class="ph ${statusIcons[pageStatus]}"></i>
            <span class="uppercase">${statusTexts[pageStatus]}</span>
          </div>
        </div>
      </div>
      ${isSelected ? '<i class="ph ph-caret-right text-indigo-400 shrink-0"></i>' : ''}
    `;

    container.appendChild(item);
  });
}

function selectPageForEdit(index) {
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

  if (page.adminNote && page.adminNote.trim()) {
    stickyBox.classList.remove('hidden');
    stickyText.textContent = page.adminNote;
  } else {
    stickyBox.classList.add('hidden');
  }
}

function dismissAdminNote() {
  document.getElementById('adminStickyNoteBox').classList.add('hidden');
}

// ==========================================
// 4. TUVAL (CANVAS) RENDER & SERBEST ELEMANLAR
// ==========================================
function renderMagazineViewport() {
  const viewport = document.getElementById('magazineViewport');
  viewport.innerHTML = '';

  const total = magazineData.pages.length;
  if (currentIndex >= total) currentIndex = total - 1;
  if (currentIndex < 0) currentIndex = 0;

  const heightClass = appMode === 'read' ? 'h-[72vh] md:h-[80vh]' : 'h-[58vh] sm:h-[65vh] md:h-[70vh]';

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
    if (appMode === 'edit' && !e.target.closest('.canvas-element') && !e.target.closest('.quiz-option-btn') && !e.target.closest('.inline-editable-text') && !e.target.closest('.template-image-container')) {
      if (selectedEditIndex !== pageIndex) {
        selectPageForEdit(pageIndex);
      } else {
        // Eleman seçimini kaldır
        selectedElementId = null;
        hideFloatingRichTextBar();
        renderAllElementsForCurrentPage();
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
    <div class="flex-1 overflow-hidden flex flex-col relative page-content-root">
      ${bodyHtml}
      <div class="canvas-elements-layer absolute inset-0 pointer-events-none" id="elemLayer_${pageIndex}"></div>
    </div>
    ${footerHtml}
  `;

  // Elemanları DOM'a bağla
  setTimeout(() => renderElementsInPageDOM(page, pageIndex, wrapper), 0);

  return wrapper;
}

function renderElementsInPageDOM(page, pageIndex, pageWrapper) {
  const layer = pageWrapper.querySelector(`#elemLayer_${pageIndex}`);
  if (!layer) return;
  layer.innerHTML = '';

  const isEditable = (appMode === 'edit' && canUserEditPage(page) && pageIndex === selectedEditIndex);

  (page.elements || []).forEach(el => {
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

    // Resim Elemanı
    if (el.type === 'image') {
      elDom.className += ' canvas-media-element group relative';
      elDom.innerHTML = `
        <img src="${escapeHtml(el.url)}" class="w-full h-full object-cover rounded-xl shadow-md pointer-events-none" alt="">
        ${isEditable ? `
          <label class="img-change-badge" title="Görseli Değiştir">
            <i class="ph ph-camera text-xl"></i>
            <span>Değiştir</span>
            <input type="file" accept="image/*" onchange="uploadCanvasElementImage(event, '${el.id}')" class="hidden">
          </label>
        ` : ''}
      `;
    }

    // Video Elemanı (MP4)
    if (el.type === 'video') {
      elDom.className += ' canvas-media-element';
      elDom.innerHTML = `
        <div class="magazine-video-container">
          <video controls preload="metadata" poster="${escapeHtml(el.poster || '')}">
            <source src="${escapeHtml(el.url)}" type="video/mp4">
          </video>
        </div>
      `;
    }

    // Metin Kutusu / Renkli Çerçeve Elemanı
    if (el.type === 'text' || el.type === 'card' || el.type === 'qbox') {
      elDom.className += ' canvas-text-element p-3 rounded-2xl border leading-relaxed overflow-hidden shadow-md';
      if (el.bgColor && el.bgColor.startsWith('linear-gradient')) {
        elDom.style.background = el.bgColor;
        elDom.style.borderColor = el.borderColor || 'rgba(255,255,255,0.28)';
      } else {
        elDom.style.background = 'none';
        elDom.style.backgroundColor = el.bgColor || '#ffffff';
        elDom.style.borderColor = el.borderColor || '#cbd5e1';
      }
      elDom.style.fontSize = `${el.fontSize || 14}px`;
      elDom.style.fontFamily = el.fontFamily || 'Inter';
      elDom.style.color = el.color || '#0f172a';
      elDom.style.textAlign = el.textAlign || 'left';
      elDom.innerHTML = el.content || 'Yazınızı buraya yazın...';

      if (isEditable) {
        elDom.contentEditable = "true";
        elDom.onfocus = () => {
          activeInlineElement = null;
          activeInlineFieldKey = null;
          showFloatingRichTextBar(elDom, el);
        };
        elDom.oninput = () => {
          el.content = elDom.innerHTML;
          debouncedSave();
        };
        elDom.onblur = () => {
          el.content = elDom.innerHTML;
          saveAllChangesToServer();
        };
      }
    }

    // Seçim ve Taşıma Olayları (Sadece Düzenleme Modunda)
    if (isEditable) {
      elDom.onmousedown = (ev) => {
        if (ev.target.closest('.resize-handle') || ev.target.closest('.rotate-handle') || ev.target.closest('.img-change-badge')) return;
        ev.stopPropagation();

        if (el.type === 'text') {
          selectCanvasElement(el.id, false);
          showFloatingRichTextBar(elDom, el);
          // Kenara yakın tutulduysa sürüklemeyi başlat
          const rect = elDom.getBoundingClientRect();
          const borderThreshold = 8;
          const isNearEdge = (
            ev.clientX - rect.left < borderThreshold ||
            rect.right - ev.clientX < borderThreshold ||
            ev.clientY - rect.top < borderThreshold ||
            rect.bottom - ev.clientY < borderThreshold
          );
          if (isNearEdge) {
            startDraggingElement(ev, el, pageWrapper);
          }
          return;
        }

        selectCanvasElement(el.id);
        startDraggingElement(ev, el, pageWrapper);
      };

      // Eğer seçiliyse 8 kulakçık ve döndürme kolu ekle
      if (isSelected) {
        elDom.appendChild(createHandleDOM('handle-nw', 'nw'));
        elDom.appendChild(createHandleDOM('handle-ne', 'ne'));
        elDom.appendChild(createHandleDOM('handle-se', 'se'));
        elDom.appendChild(createHandleDOM('handle-sw', 'sw'));
        elDom.appendChild(createHandleDOM('handle-n', 'n'));
        elDom.appendChild(createHandleDOM('handle-s', 's'));
        elDom.appendChild(createHandleDOM('handle-e', 'e'));
        elDom.appendChild(createHandleDOM('handle-w', 'w'));
        elDom.appendChild(createRotateHandleDOM(el, pageWrapper));

        if (el.type === 'text') {
          showFloatingRichTextBar(elDom, el);
        } else {
          hideFloatingRichTextBar();
        }
      }
    }

    layer.appendChild(elDom);
  });
}

function createHandleDOM(className, handleType) {
  const h = document.createElement('div');
  h.className = `resize-handle ${className}`;
  h.dataset.handle = handleType;
  h.onmousedown = (e) => {
    e.stopPropagation();
    startResizingElement(e, handleType);
  };
  return h;
}

function createRotateHandleDOM(el, pageWrapper) {
  const rh = document.createElement('div');
  rh.className = 'rotate-handle';
  rh.title = 'Döndürmek için sürükleyin';
  rh.onmousedown = (e) => {
    e.stopPropagation();
    startRotatingElement(e, el, pageWrapper);
  };
  return rh;
}

// ==========================================
// 5. SERBEST ELEMAN SÜRÜKLEME, BOYUTLANDIRMA, DÖNDÜRME
// ==========================================
function selectCanvasElement(id, reRender = true) {
  selectedElementId = id;
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
          elNode.appendChild(createHandleDOM('handle-nw', 'nw'));
          elNode.appendChild(createHandleDOM('handle-ne', 'ne'));
          elNode.appendChild(createHandleDOM('handle-se', 'se'));
          elNode.appendChild(createHandleDOM('handle-sw', 'sw'));
          elNode.appendChild(createHandleDOM('handle-n', 'n'));
          elNode.appendChild(createHandleDOM('handle-s', 's'));
          elNode.appendChild(createHandleDOM('handle-e', 'e'));
          elNode.appendChild(createHandleDOM('handle-w', 'w'));
          const elData = (magazineData.pages[selectedEditIndex].elements || []).find(e => e.id === id);
          if (elData) elNode.appendChild(createRotateHandleDOM(elData, pageDom));
        }
      } else {
        elNode.classList.remove('element-selected');
        elNode.querySelectorAll('.resize-handle, .rotate-handle').forEach(h => h.remove());
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

    el.x = Math.max(-20, Math.min(100, Math.round(newX * 10) / 10));
    el.y = Math.max(-10, Math.min(100, Math.round(newY * 10) / 10));

    const elDom = document.getElementById(`elDom_${el.id}`);
    if (elDom) {
      elDom.style.left = `${el.x}%`;
      elDom.style.top = `${el.y}%`;
    }
  }

  function onMouseUp() {
    isDraggingElement = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
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

  const pageDom = document.querySelector(`.magazine-page[data-page-index="${selectedEditIndex}"]`);
  const pageRect = pageDom.getBoundingClientRect();

  function onMouseMove(ev) {
    if (!isResizingElement) return;
    const dx = (ev.clientX - dragStartX) / pageRect.width * 100;
    const dy = (ev.clientY - dragStartY) / pageRect.height * 100;

    if (handle.includes('e')) el.width = Math.max(8, initialElemW + dx);
    if (handle.includes('s')) el.height = Math.max(6, initialElemH + dy);
    if (handle.includes('w')) {
      const newW = Math.max(8, initialElemW - dx);
      el.x = initialElemX + (initialElemW - newW);
      el.width = newW;
    }
    if (handle.includes('n')) {
      const newH = Math.max(6, initialElemH - dy);
      el.y = initialElemY + (initialElemH - newH);
      el.height = newH;
    }

    el.width = Math.round(el.width * 10) / 10;
    el.height = Math.round(el.height * 10) / 10;
    el.x = Math.round(el.x * 10) / 10;
    el.y = Math.round(el.y * 10) / 10;

    const elDom = document.getElementById(`elDom_${el.id}`);
    if (elDom) {
      elDom.style.left = `${el.x}%`;
      elDom.style.top = `${el.y}%`;
      elDom.style.width = `${el.width}%`;
      elDom.style.height = `${el.height}%`;
    }
  }

  function onMouseUp() {
    isResizingElement = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
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
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    saveAllChangesToServer();
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

// Zengin Tipografi & Renkli Çerçeve Araç Çubuğu Kontrolleri (Sabit Üst Bar ile Entegre)
let activeInlineElement = null;
let activeInlineFieldKey = null;

function showFloatingRichTextBar(elDom, el) {
  const badge = document.getElementById('activeSelectionBadge');
  if (badge) {
    badge.textContent = "Seçili: Serbest Kutu";
    badge.className = "text-[10px] text-emerald-400 font-mono font-bold mr-1";
  }

  const fsEl = document.getElementById('rtFontSize');
  const ffEl = document.getElementById('rtFontFamily');
  const colEl = document.getElementById('rtColor');
  const bgEl = document.getElementById('rtBgColor');

  if (fsEl) fsEl.value = el.fontSize || 14;
  if (ffEl) ffEl.value = el.fontFamily || 'Inter';
  if (colEl) colEl.value = (el.color && el.color.startsWith('#')) ? el.color : '#ffffff';
  if (bgEl) bgEl.value = el.bgColor || 'transparent';
}

function hideFloatingRichTextBar() {
  // Sabit üst bar her zaman görünür kalır
}

function handleInlineTextFocus(pageIndex, key, domEl) {
  activeInlineElement = domEl;
  activeInlineFieldKey = key;
  selectedElementId = null;

  const badge = document.getElementById('activeSelectionBadge');
  if (badge) {
    badge.textContent = `Seçili: ${key}`;
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
}

function applyTextStyle(prop, val) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;

  // 1. Durum: Serbest eklenen kutu veya renkli çerçeve seçiliyse
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
    showToast("Katman sırasını değiştirmek için serbest eklenen bir kutu seçin.");
    return;
  }
  el.zIndex = Math.max(1, (el.zIndex || 10) + delta * 5);
  const elDom = document.getElementById(`elDom_${el.id}`);
  if (elDom) elDom.style.zIndex = el.zIndex;
  saveAllChangesToServer();
  showToast(delta > 0 ? "Öne getirildi" : "Arkaya gönderildi");
}

function deleteSelectedCanvasElement() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !selectedElementId) {
    showToast("Silmek için sonradan eklenen bir kutu veya görsel seçin.");
    return;
  }
  page.elements = (page.elements || []).filter(x => x.id !== selectedElementId);
  selectedElementId = null;
  renderAllElementsForCurrentPage();
  saveAllChangesToServer();
  showToast("Kutu silindi.");
}

function toggleGridOverlay() {
  showGridGuide = !showGridGuide;
  const btn = document.getElementById('btnGridToggle');
  if (btn) {
    btn.className = showGridGuide 
      ? 'px-2 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold border border-indigo-500 shadow'
      : 'px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 transition flex items-center gap-1';
  }
  renderMagazineViewport();
  showToast(showGridGuide ? "Izgara kılavuzları açık" : "Izgara kapatıldı");
}

// Eleman Ekleme Butonları (Metin Kutusu, Renkli Çerçeve, Soru Kutusu, Resim, Video)
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
    x: 15,
    y: 20,
    width: 55,
    height: 22,
    rotate: 0,
    zIndex: 25,
    ...data
  };

  if (type === 'text') {
    newEl = {
      ...newEl,
      content: "<strong>Yeni Başlık / Metin Kutusu</strong><br>Tıklayarak doğrudan yazınızı yazabilir, üst çubuktan yazı tipini ve çerçeve rengini değiştirebilirsiniz.",
      fontSize: 14,
      fontFamily: "Inter",
      color: "#0f172a",
      bgColor: "#ffffff",
      borderColor: "#cbd5e1",
      textAlign: "left"
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
      textAlign: "left"
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
      textAlign: "left"
    };
  }

  page.elements.push(newEl);
  selectedElementId = newId;
  activeInlineElement = null;
  activeInlineFieldKey = null;
  renderMagazineViewport();
  setTimeout(() => {
    selectCanvasElement(newId);
  }, 40);
  saveAllChangesToServer();
  showToast("Kutu sayfaya eklendi! Kenarından tutup taşıyabilir veya içine tıklayıp yazabilirsiniz.");
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
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) return;
      if (selectedElementId) {
        deleteSelectedCanvasElement();
      }
    }
    if (e.key === 'Escape') {
      selectedElementId = null;
      hideFloatingRichTextBar();
      renderAllElementsForCurrentPage();
    }
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

  // Kullanıcı tarafından şablon metnine uygulanmış özel tipografi ve çerçeve stillerini oku
  const fs = page?.fieldStyles?.[key] || {};
  let customStyle = style ? `${style};` : '';
  if (fs.fontSize) customStyle += ` font-size:${fs.fontSize}px !important;`;
  if (fs.fontFamily) customStyle += ` font-family:${fs.fontFamily} !important;`;
  if (fs.color) customStyle += ` color:${fs.color} !important;`;
  if (fs.textAlign) customStyle += ` text-align:${fs.textAlign} !important;`;
  if (fs.fontWeight) customStyle += ` font-weight:${fs.fontWeight} !important;`;
  if (fs.fontStyle) customStyle += ` font-style:${fs.fontStyle} !important;`;
  if (fs.textDecoration) customStyle += ` text-decoration:${fs.textDecoration} !important;`;
  if (fs.bgColor && fs.bgColor !== 'transparent') {
    if (fs.bgColor.startsWith('linear-gradient')) {
      customStyle += ` background:${fs.bgColor} !important; padding:8px 12px !important; border-radius:12px !important; box-shadow:0 4px 12px rgba(0,0,0,0.12) !important;`;
    } else {
      customStyle += ` background-color:${fs.bgColor} !important; padding:6px 10px !important; border-radius:10px !important;`;
    }
  }

  const styleAttr = customStyle.trim() ? `style="${customStyle.trim()}"` : '';

  if (!isEditable) {
    return `<${tag} class="${className}" ${styleAttr}>${safeText}</${tag}>`;
  }

  return `
    <${tag} 
      class="${className} inline-editable-text" 
      ${styleAttr}
      contenteditable="true" 
      data-field-key="${key}"
      title="Tıklayarak metni ve üst araç çubuğundan yazı karakterini/çerçevesini düzenleyin"
      onfocus="handleInlineTextFocus(${pageIndex}, '${key}', this)"
      onclick="handleInlineTextFocus(${pageIndex}, '${key}', this)"
      onblur="handleInlineTextChange(${pageIndex}, '${key}', this)"
    >${safeText}</${tag}>
  `;
}

function makeInlineImage(pageIndex, key, currentUrl, fallbackUrl, imgClass = '', containerClass = '', alt = '') {
  const isEditable = (appMode === 'edit' && pageIndex === selectedEditIndex && canUserEditPage(magazineData.pages[pageIndex]));
  const safeUrl = escapeHtml(currentUrl || fallbackUrl);
  const safeFallback = escapeHtml(fallbackUrl);

  if (!isEditable) {
    return `
      <div class="${containerClass}">
        <img src="${safeUrl}" onerror="this.src='${safeFallback}'" class="${imgClass}" alt="${alt}">
      </div>
    `;
  }

  return `
    <div class="template-image-container ${containerClass}">
      <img src="${safeUrl}" onerror="this.src='${safeFallback}'" class="${imgClass}" alt="${alt}">
      <label class="img-change-badge" title="Fotoğrafı Değiştir">
        <i class="ph ph-camera text-xl mb-0.5"></i>
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

  return `<div class="p-6">Sayfa</div>`;
}

// ==========================================
// 7. SAĞ PANEL (CANLI FORM VE İÇERİK EDİTÖRÜ)
// ==========================================
function renderRightEditorPanel() {
  const container = document.getElementById('editorFormContainer');
  const badge = document.getElementById('editingPageBadge');
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;

  const isEditable = canUserEditPage(page);
  const lockBanner = document.getElementById('pageLockBanner');
  const pageActions = document.getElementById('pageActionFooter');

  badge.textContent = `Sayfa ${selectedEditIndex + 1} (${getTemplateLabel(page.type)})`;

  if (!isEditable) {
    lockBanner.classList.remove('hidden');
    if (pageActions) pageActions.classList.add('hidden');
  } else {
    lockBanner.classList.add('hidden');
    if (pageActions) pageActions.classList.remove('hidden');
  }

  renderStatusControl(page);

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

  container.innerHTML = fieldsHtml;
}

function changePageLayout(layout) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !canUserEditPage(page)) return;
  page.layout = layout;
  if (!page.subHeadline) page.subHeadline = 'Kapak konusu ve özel dosya detayları.';
  if (!page.highlights) page.highlights = 'Özel Dosya\nAyın Röportajı\nGeleceğin Trendleri';
  renderCanvas();
  renderRightEditorPanel();
  triggerAutoSave();
  showToast(`Mizanpaj ekolü "${layout.toUpperCase()}" olarak güncellendi`, 'success');
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
      schoolName: magazineData.schoolName || "UFUK ANADOLU LİSESİ",
      motto: "\"Fikri hür, vicdanı hür nesiller için...\"",
      coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
      qrText: "Dergiyi çevrim içi okumak için karekodu okutun",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dergimiz.com.tr",
      social: "@ufukanadolulisesi",
      closingQuote: "Geleceğin aydınlık Türkiye'sini birlikte kuruyoruz."
    };
  } else if (templateType === 'freeform') {
    newPage = {
      ...newPage,
      navTitle: "Serbest Mizanpaj",
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
async function saveAllChangesToServer() {
  if (!currentIssue || !magazineData) return;
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
      showToast("💾 Değişiklikler sunucuya kaydedildi!");
    }
  } catch (err) {
    console.warn("Sunucuya kaydedilemedi:", err);
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
    const magId = magSelect ? magSelect.value : (currentMagazine ? currentMagazine.id : 'mag-ufuk-al');
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

  // 4 Kapaklı tam dergi şablonu otomatik hazırla
  const school = magazineData.schoolName || "UFUK ANADOLU LİSESİ E-DERGİSİ";
  const num = allIssues.length + 1;

  const initialPages = [
    {
      id: "p1",
      type: "cover",
      navTitle: "K1 • Ön Dış Kapak",
      accentColor: "#4f46e5",
      assignedEditor: currentUser.code,
      status: "draft",
      magazineName: "UFUK",
      issueTag: `SAYI 0${num} • ${month.toUpperCase()} • AYLIK DİJİTAL DERGİ`,
      mainHeadline: "Yeni Sayı Dosya Konusu",
      subHeadline: "Geleceğin dünyasını bugünden inşa eden liselilerin başarı hikayeleri.",
      coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
      highlights: "Ayın Dosyası\nÖzel Söyleşi\nOkuldan Kareler & Video",
      elements: []
    },
    {
      id: "p2",
      type: "k2",
      subType: "ataturk",
      navTitle: "K2 • Ön Kapak İçi",
      accentColor: "#b91c1c",
      assignedEditor: currentUser.code,
      status: "approved",
      headerText: "TÜRK GENÇLİĞİNE HİTABE",
      subText: "Ey Türk Gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyeti'ni, ilelebet muhafaza ve müdafaa etmektir.",
      author: "Gazi Mustafa Kemal Atatürk",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      quote: "Bütün ümidim gençliktedir.",
      elements: []
    },
    {
      id: "p3",
      type: "toc",
      navTitle: "Editörden & İçindekiler",
      accentColor: "#4f46e5",
      assignedEditor: currentUser.code,
      status: "draft",
      editorTitle: `${title} ile Yeniden Sizlerleyiz`,
      editorName: currentUser.name || "Sedat İleri (Genel Yayın Yönetmeni)",
      editorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      editorText: "Dergimizin yeni sayısında emeği geçen tüm öğretmenlerimizi ve öğrencilerimizi kutluyoruz.",
      editorialBoard: `Yayın Kurulu Başkanı: Sedat İleri\nEdebiyat Danışmanı: Nazmiye Hoca\nUfuk Anadolu Lisesi`,
      elements: []
    },
    {
      id: "p4",
      type: "article",
      navTitle: "Dosya Konusu",
      accentColor: "#0284c7",
      assignedEditor: currentUser.code,
      status: "draft",
      category: "ARAŞTIRMA & GÜNCEL",
      title: "Ayın Ana Makalesi",
      author: "Yayın Kurulu",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      imageCaption: "Konu ile ilgili görsel.",
      content: "Yazınızı buraya ekleyebilirsiniz.",
      pullQuote: "Eğitim ve kültür, bir milletin geleceğidir.",
      elements: []
    },
    {
      id: "p5",
      type: "video",
      navTitle: "Etkinlik & Video",
      accentColor: "#d97706",
      assignedEditor: currentUser.code,
      status: "draft",
      title: "Okul Etkinlikleri Video Kaydı",
      subTitle: "Bu ay okulumuzda gerçekleşen en özel gösteri ve törenler.",
      author: "Basın & Yayın Kulübü",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      videoPoster: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80",
      caption: "Etkinlikten canlı kare.",
      notes: "Tüm katılımcılara teşekkür ederiz.",
      elements: []
    },
    {
      id: "p6",
      type: "k3",
      navTitle: "K3 • Arka Kapak İçi",
      accentColor: "#4f46e5",
      assignedEditor: currentUser.code,
      status: "draft",
      boardTitle: "YAYIN KURULU KÜNYESİ",
      publisher: "Ufuk Anadolu Lisesi",
      editorInChief: "Sedat İleri",
      advisor: "Nazmiye Hoca",
      editorialTeam: "Öğrenci Yazı İşleri",
      contactInfo: "dergi@ufuklisesi.edu.tr",
      nextIssueTeaserTitle: "GELECEK SAYIDA NELER VAR?",
      nextIssueText: "• Yeni Dosya Konusu ve Sürpriz Röportajlar",
      elements: []
    },
    {
      id: "p7",
      type: "k4",
      navTitle: "K4 • Arka Dış Kapak",
      accentColor: "#1e1b4b",
      assignedEditor: currentUser.code,
      status: "draft",
      schoolName: school,
      motto: "\"Fikri hür, irfanı hür nesiller için...\"",
      coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
      qrText: "Dergiyi çevrim içi okumak için karekodu okutun",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dergimiz.com.tr",
      social: "@ufukanadolulisesi",
      closingQuote: "Geleceği birlikte kuruyoruz.",
      elements: []
    }
  ];

  try {
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-code': currentUser.code
      },
      body: JSON.stringify({
        magazineId: currentMagazine ? currentMagazine.id : 'mag-ufuk-al',
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
  magazineData.schoolName = document.getElementById('inputSchoolName').value || "UFUK ANADOLU LİSESİ E-DERGİ";
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


