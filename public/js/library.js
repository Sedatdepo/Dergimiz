// Dergimiz Kitaplığı (Library & Showcase Script)
let allIssues = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchIssues();
});

async function fetchIssues() {
  try {
    const res = await fetch('/api/issues?includeDrafts=true');
    if (!res.ok) throw new Error('API yanıt vermedi');
    allIssues = await res.json();
  } catch (err) {
    console.warn('Backend API erişilemedi, yerel veri kullanılıyor:', err);
    // Fallback veri
    allIssues = [
      {
        id: "sayi-1",
        title: "Sayı #1 • Ekim 2026",
        schoolName: "UFUK ANADOLU LİSESİ E-DERGİSİ",
        issueNumber: 1,
        issueMonth: "Ekim 2026",
        status: "published",
        views: 1845,
        likes: 234,
        description: "Yapay zeka çağında lise öğrencisi olmak, SolarWing İHA projesi, Selin Hocamızla röportaj ve ödüllü zeka soruları.",
        coverThumb: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        pages: [{}, {}, {}, {}, {}, {}]
      }
    ];
  }

  renderHero();
  renderGrid(allIssues);
  updateStats();
}

function renderHero() {
  const container = document.getElementById('heroContent');
  if (!allIssues || allIssues.length === 0) {
    container.innerHTML = '<div class="col-span-12 text-center text-slate-400">Henüz yayınlanmış bir sayı bulunmuyor.</div>';
    return;
  }

  // En son çıkan yayınlanmış sayıyı bul, yoksa ilk sayıyı al
  const latest = allIssues.find(i => i.status === 'published') || allIssues[0];
  const pageCount = latest.pages ? latest.pages.length : 6;

  container.innerHTML = `
    <!-- Sol Bilgi Alanı -->
    <div class="lg:col-span-7 space-y-5">
      <div class="flex items-center gap-2.5">
        <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          SON ÇIKAN SAYI
        </span>
        <span class="text-xs text-slate-400 font-medium">
          <i class="ph ph-calendar-blank mr-1"></i>${escapeHtml(latest.issueMonth || 'Ekim 2026')}
        </span>
      </div>

      <h1 class="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
        ${escapeHtml(latest.title)}
      </h1>

      <p class="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 font-light">
        ${escapeHtml(latest.description || 'Okulumuzun en yeni bilim, edebiyat ve sanat çalışmaları dijital dergimizde sizlerle buluşuyor.')}
      </p>

      <!-- İstatistik ve Rozetler -->
      <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 py-1">
        <div class="flex items-center gap-1.5">
          <i class="ph ph-files text-indigo-400 text-base"></i>
          <span><strong>${pageCount}</strong> Sayfa</span>
        </div>
        <div class="h-3 w-px bg-slate-800"></div>
        <div class="flex items-center gap-1.5">
          <i class="ph ph-eye text-emerald-400 text-base"></i>
          <span><strong>${latest.views || 0}</strong> Okunma</span>
        </div>
        <div class="h-3 w-px bg-slate-800"></div>
        <div class="flex items-center gap-1.5">
          <i class="ph ph-heart text-rose-400 text-base"></i>
          <span id="heroLikesSpan"><strong>${latest.likes || 0}</strong> Beğeni</span>
        </div>
      </div>

      <!-- Aksiyon Butonları -->
      <div class="flex flex-wrap items-center gap-3 pt-2">
        <a href="/oku?id=${latest.id}" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 transition transform hover:-translate-y-0.5">
          <i class="ph ph-book-open text-xl"></i>
          <span>Hemen Oku (Flipbook)</span>
        </a>

        <button onclick="likeIssue('${latest.id}')" class="px-4 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-rose-400 border border-slate-700/80 text-sm font-semibold transition flex items-center gap-2">
          <i class="ph ph-heart text-lg"></i>
          <span>Beğen</span>
        </button>

        <a href="/editor?id=${latest.id}" class="px-4 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-sm font-medium transition flex items-center gap-1.5">
          <i class="ph ph-pencil-simple text-base text-indigo-400"></i>
          <span>Editör Masasında Aç</span>
        </a>
      </div>
    </div>

    <!-- Sağ 3D Dergi Kapağı Görünümü -->
    <div class="lg:col-span-5 flex justify-center lg:justify-end">
      <a href="/oku?id=${latest.id}" class="block group relative cursor-pointer" title="Dergiyi Aç">
        <div class="relative w-64 sm:w-72 aspect-[1/1.414] rounded-2xl overflow-hidden shadow-2xl border border-white/20 book-cover-card">
          <img src="${escapeHtml(latest.coverThumb)}" alt="Kapak" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80"></div>
          
          <div class="absolute bottom-5 left-5 right-5 text-white">
            <span class="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block mb-1">E-DERGİ OKUYUCU</span>
            <h3 class="font-serif font-bold text-lg text-white leading-tight drop-shadow">${escapeHtml(latest.title)}</h3>
            <div class="mt-3 flex items-center gap-1.5 text-xs text-indigo-300 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Sayfaları Çevir</span>
              <i class="ph ph-arrow-right"></i>
            </div>
          </div>

          <!-- Dergi Cilt Efekti -->
          <div class="absolute top-0 left-0 bottom-0 w-5 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>
      </a>
    </div>
  `;
}

function renderGrid(issues) {
  const grid = document.getElementById('issuesGrid');
  grid.innerHTML = '';

  if (!issues || issues.length === 0) {
    grid.innerHTML = '<div class="col-span-3 text-center py-10 text-slate-500">Aramanıza uygun dergi sayısı bulunamadı.</div>';
    return;
  }

  issues.forEach(issue => {
    const isPublished = issue.status === 'published';
    const pageCount = issue.pages ? issue.pages.length : 0;

    const card = document.createElement('div');
    card.className = "bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between group";

    card.innerHTML = `
      <div>
        <!-- Üst Kapak Görseli -->
        <div class="relative aspect-[16/10] overflow-hidden bg-slate-950">
          <img src="${escapeHtml(issue.coverThumb)}" onerror="this.src='https://placehold.co/600x400/1e1b4b/ffffff?text=Kapak'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Kapak">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          
          <!-- Durum Rozeti -->
          <div class="absolute top-3 left-3">
            ${isPublished 
              ? '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">Yayında</span>' 
              : '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">Taslak / Hazırlıkta</span>'
            }
          </div>

          <div class="absolute bottom-2.5 right-3 text-[11px] font-medium text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
            ${pageCount} Sayfa
          </div>
        </div>

        <!-- Kart Metinleri -->
        <div class="p-5 space-y-2.5">
          <div class="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            ${escapeHtml(issue.issueMonth || '2026')}
          </div>
          <h3 class="font-display font-bold text-lg text-white group-hover:text-indigo-300 transition leading-snug">
            ${escapeHtml(issue.title)}
          </h3>
          <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            ${escapeHtml(issue.description || 'Ufuk Anadolu Lisesi dijital e-dergi sayısı.')}
          </p>
        </div>
      </div>

      <!-- Alt Aksiyonlar -->
      <div class="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
        <div class="text-xs text-slate-500 flex items-center gap-2">
          <span><i class="ph ph-eye"></i> ${issue.views || 0}</span>
          <span><i class="ph ph-heart"></i> ${issue.likes || 0}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <a href="/oku?id=${issue.id}" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition flex items-center gap-1">
            <i class="ph ph-book-open"></i> Oku
          </a>
          <a href="/editor?id=${issue.id}" class="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition" title="Editör Masası">
            <i class="ph ph-pencil-simple text-sm"></i>
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function filterIssues() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const statusFilter = document.getElementById('filterStatus').value;

  const filtered = allIssues.filter(item => {
    const matchQuery = (item.title && item.title.toLowerCase().includes(query)) ||
                       (item.description && item.description.toLowerCase().includes(query)) ||
                       (item.issueMonth && item.issueMonth.toLowerCase().includes(query));

    const matchStatus = statusFilter === 'all' ? true : (item.status === statusFilter);
    return matchQuery && matchStatus;
  });

  renderGrid(filtered);
}

function updateStats() {
  let totalViews = 0;
  let totalLikes = 0;

  allIssues.forEach(i => {
    totalViews += (i.views || 0);
    totalLikes += (i.likes || 0);
  });

  const viewsEl = document.getElementById('statTotalViews');
  const likesEl = document.getElementById('statTotalLikes');
  const issuesEl = document.getElementById('statTotalIssues');

  if (viewsEl) viewsEl.textContent = `${totalViews.toLocaleString('tr-TR')}`;
  if (likesEl) likesEl.textContent = `${totalLikes.toLocaleString('tr-TR')}`;
  if (issuesEl) issuesEl.textContent = `${allIssues.length} Sayı`;
}

async function likeIssue(id) {
  try {
    const res = await fetch(`/api/issues/${id}/like`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      const heroLikes = document.getElementById('heroLikesSpan');
      if (heroLikes) heroLikes.innerHTML = `<strong>${data.likes}</strong> Beğeni`;
      
      const issue = allIssues.find(i => i.id === id);
      if (issue) issue.likes = data.likes;
      updateStats();
    }
  } catch (err) {
    console.error('Beğeni hatası:', err);
  }
}

// ==========================================
// GİRİŞ / AUTH YÖNETİMİ
// ==========================================
let activeLoginTab = 'admin';

function openLoginModal() {
  document.getElementById('loginModal').classList.remove('hidden');
  document.getElementById('loginError').classList.add('hidden');
  switchLoginTab('admin');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.add('hidden');
}

function switchLoginTab(tab) {
  activeLoginTab = tab;
  const adminForm = document.getElementById('adminLoginForm');
  const editorForm = document.getElementById('editorLoginForm');
  const btnAdmin = document.getElementById('tabBtnAdmin');
  const btnEditor = document.getElementById('tabBtnEditor');

  if (tab === 'admin') {
    adminForm.classList.remove('hidden');
    editorForm.classList.add('hidden');
    btnAdmin.className = "flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-indigo-600 text-white shadow";
    btnEditor.className = "flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white";
    document.getElementById('loginEmailInput').focus();
  } else {
    adminForm.classList.add('hidden');
    editorForm.classList.remove('hidden');
    btnEditor.className = "flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-indigo-600 text-white shadow";
    btnAdmin.className = "flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white";
    document.getElementById('loginCodeInput').focus();
  }
}

function fillAdmin(email, pass) {
  switchLoginTab('admin');
  document.getElementById('loginEmailInput').value = email;
  document.getElementById('loginPasswordInput').value = pass;
}

function fillCode(code) {
  switchLoginTab('editor');
  document.getElementById('loginCodeInput').value = code;
}

async function handleLogin(e) {
  e.preventDefault();
  const errorEl = document.getElementById('loginError');
  const errorText = document.getElementById('loginErrorText');
  const submitBtn = document.getElementById('btnLoginSubmit');

  errorEl.classList.add('hidden');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin text-lg"></i> Giriş yapılıyor...';

  let reqBody = {};
  if (activeLoginTab === 'admin') {
    const email = document.getElementById('loginEmailInput').value.trim();
    const password = document.getElementById('loginPasswordInput').value.trim();
    if (!email || !password) {
      errorEl.classList.remove('hidden');
      errorText.textContent = 'E-posta ve şifre zorunludur.';
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Masaya Giriş Yap</span><i class="ph ph-arrow-right text-base"></i>';
      return;
    }
    reqBody = { email, password };
  } else {
    const code = document.getElementById('loginCodeInput').value.trim();
    if (!code) {
      errorEl.classList.remove('hidden');
      errorText.textContent = 'Yetki kodu zorunludur.';
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Masaya Giriş Yap</span><i class="ph ph-arrow-right text-base"></i>';
      return;
    }
    reqBody = { code };
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Giriş yapılamadı.');

    // Başarılı giriş: kullanıcı bilgilerini kaydet
    localStorage.setItem('dergiUser', JSON.stringify(data.user));
    localStorage.setItem('dergiAccessCode', data.user.code || data.user.email);

    // Editör Masasına Yönlendir
    window.location.href = '/editor';
  } catch (err) {
    errorEl.classList.remove('hidden');
    errorText.textContent = err.message || 'Giriş bilgileri geçersiz.';
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Masaya Giriş Yap</span><i class="ph ph-arrow-right text-base"></i>';
  }
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
