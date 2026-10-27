// Dergimiz Editör & Yönetim Masası (Advanced Studio Engine)
let currentUser = null;
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

document.addEventListener('DOMContentLoaded', async () => {
  initUserSession();
  if (window.innerWidth < 1100) spreadMode = false;
  updateSpreadButtonUI();

  await loadAllIssues();
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
// 2. SAYILARI YÜKLEME & SEÇİM
// ==========================================
async function loadAllIssues() {
  try {
    const res = await fetch('/api/issues?includeDrafts=true');
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

  wrapper.className = `magazine-page ${posClass} ${heightClass} bg-white text-slate-900 flex flex-col justify-between select-none animate-curl relative ${appMode === 'edit' ? ring + ' cursor-pointer' : ''}`;
  wrapper.dataset.pageIndex = pageIndex;

  wrapper.onclick = (e) => {
    if (appMode === 'edit' && !e.target.closest('.canvas-element') && !e.target.closest('.quiz-option-btn')) {
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
      elDom.innerHTML = `
        <img src="${escapeHtml(el.url)}" class="w-full h-full object-cover rounded-xl shadow-md pointer-events-none" alt="">
      `;
    }

    // Video Elemanı (MP4)
    if (el.type === 'video') {
      elDom.innerHTML = `
        <div class="magazine-video-container">
          <video controls preload="metadata" poster="${escapeHtml(el.poster || '')}">
            <source src="${escapeHtml(el.url)}" type="video/mp4">
          </video>
        </div>
      `;
    }

    // Metin Kutusu Elemanı
    if (el.type === 'text') {
      elDom.style.backgroundColor = el.bgColor || 'transparent';
      elDom.style.borderColor = el.borderColor || 'transparent';
      elDom.style.fontSize = `${el.fontSize || 13}px`;
      elDom.style.fontFamily = el.fontFamily || 'Inter';
      elDom.style.color = el.color || '#0f172a';
      elDom.style.textAlign = el.textAlign || 'left';
      elDom.className += ' p-2.5 rounded-xl border leading-relaxed overflow-hidden';
      elDom.innerHTML = el.content || 'Yazınızı buraya yazın...';

      if (isEditable) {
        // Çift Tıklama ile Yerinde Canlı Yazma (Inline WYSIWYG)
        elDom.ondblclick = (ev) => {
          ev.stopPropagation();
          elDom.contentEditable = "true";
          elDom.focus();
          showFloatingRichTextBar(elDom, el);
        };
        elDom.onblur = () => {
          elDom.contentEditable = "false";
          el.content = elDom.innerHTML;
          saveAllChangesToServer();
        };
      }
    }

    // Seçim ve Taşıma Olayları (Sadece Düzenleme Modunda)
    if (isEditable) {
      elDom.onmousedown = (ev) => {
        if (ev.target.closest('.resize-handle') || ev.target.closest('.rotate-handle')) return;
        if (elDom.contentEditable === "true") return;
        ev.stopPropagation();
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
function selectCanvasElement(id) {
  selectedElementId = id;
  renderAllElementsForCurrentPage();
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

// Zengin Tipografi Araç Çubuğu Kontrolleri
function showFloatingRichTextBar(elDom, el) {
  const bar = document.getElementById('floatingRichTextBar');
  if (!bar) return;

  const rect = elDom.getBoundingClientRect();
  bar.classList.remove('hidden');
  bar.style.top = `${Math.max(10, rect.top - 46)}px`;
  bar.style.left = `${Math.max(10, rect.left)}px`;

  document.getElementById('rtFontSize').value = el.fontSize || 13;
  document.getElementById('rtFontFamily').value = el.fontFamily || 'Inter';
  document.getElementById('rtColor').value = el.color || '#0f172a';
  document.getElementById('rtBgColor').value = el.bgColor || 'transparent';
}

function hideFloatingRichTextBar() {
  const bar = document.getElementById('floatingRichTextBar');
  if (bar) bar.classList.add('hidden');
}

function applyTextStyle(prop, val) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page.elements || []).find(x => x.id === selectedElementId);
  if (!el) return;

  el[prop] = val;
  const elDom = document.getElementById(`elDom_${el.id}`);
  if (elDom) {
    if (prop === 'fontSize') elDom.style.fontSize = `${val}px`;
    if (prop === 'fontFamily') elDom.style.fontFamily = val;
    if (prop === 'color') elDom.style.color = val;
    if (prop === 'bgColor') elDom.style.backgroundColor = val;
    if (prop === 'textAlign') elDom.style.textAlign = val;
  }
  saveAllChangesToServer();
}

function applyTextFormat(cmd) {
  document.execCommand(cmd, false, null);
  const elDom = document.getElementById(`elDom_${selectedElementId}`);
  const page = magazineData.pages[selectedEditIndex];
  const el = (page.elements || []).find(x => x.id === selectedElementId);
  if (el && elDom) {
    el.content = elDom.innerHTML;
    saveAllChangesToServer();
  }
}

function changeElementLayer(delta) {
  const page = magazineData.pages[selectedEditIndex];
  const el = (page.elements || []).find(x => x.id === selectedElementId);
  if (!el) return;
  el.zIndex = Math.max(1, (el.zIndex || 10) + delta * 5);
  const elDom = document.getElementById(`elDom_${el.id}`);
  if (elDom) elDom.style.zIndex = el.zIndex;
  saveAllChangesToServer();
  showToast(delta > 0 ? "Öne getirildi" : "Arkaya gönderildi");
}

function deleteSelectedCanvasElement() {
  const page = magazineData.pages[selectedEditIndex];
  if (!page || !selectedElementId) return;
  page.elements = (page.elements || []).filter(x => x.id !== selectedElementId);
  selectedElementId = null;
  hideFloatingRichTextBar();
  renderAllElementsForCurrentPage();
  saveAllChangesToServer();
  showToast("Eleman silindi.");
}

function toggleGridOverlay() {
  showGridGuide = !showGridGuide;
  const btn = document.getElementById('btnGridToggle');
  if (btn) {
    btn.className = showGridGuide 
      ? 'px-2.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold border border-indigo-500 shadow'
      : 'px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition flex items-center gap-1.5';
  }
  renderMagazineViewport();
  showToast(showGridGuide ? "Izgara kılavuzları açık (Mıknatıslı hizalama)" : "Izgara kapatıldı");
}

// Eleman Ekleme Butonları
function addCanvasElement(type, data = {}) {
  const page = magazineData.pages[selectedEditIndex];
  if (!page) return;
  if (!page.elements) page.elements = [];

  const newId = 'el-' + Date.now();
  let newEl = {
    id: newId,
    type,
    x: 25,
    y: 30,
    width: 40,
    height: 20,
    rotate: 0,
    zIndex: 15,
    ...data
  };

  if (type === 'text') {
    newEl = {
      ...newEl,
      content: "<strong>Yeni Başlık / Metin</strong><br>Çift tıklayarak doğrudan yazmaya başlayabilirsiniz.",
      fontSize: 14,
      fontFamily: "Inter",
      color: "#0f172a",
      bgColor: "#ffffff",
      borderColor: "#e2e8f0",
      textAlign: "left"
    };
  }

  page.elements.push(newEl);
  selectCanvasElement(newId);
  saveAllChangesToServer();
  showToast("Eleman sayfaya eklendi!");
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
// 6. ŞABLON RENDERLARI (K1, K2, K3, K4, Video vb.)
// ==========================================
function renderTemplateHTML(page, pageIndex) {
  const accent = page.accentColor || '#4f46e5';

  // 1. K1 • ÖN DIŞ KAPAK
  if (page.type === 'cover' || page.type === 'k1') {
    const highlights = (page.highlights || '').split('\n').filter(Boolean);
    return `
      <div class="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden bg-slate-950">
        <img src="${escapeHtml(page.coverImage)}" onerror="this.src='https://placehold.co/800x1100/1e1b4b/ffffff?text=Dergi+Kapagi'" class="absolute inset-0 w-full h-full object-cover opacity-65 scale-105 pointer-events-none" alt="Kapak">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none"></div>
        
        <div class="relative z-10 text-center border-b border-white/25 pb-3">
          <div class="text-[10px] tracking-[0.25em] uppercase font-semibold text-indigo-300 mb-1">${escapeHtml(page.issueTag || '')}</div>
          <h1 class="font-display font-extrabold text-4xl sm:text-5xl tracking-tighter uppercase text-white drop-shadow-lg">
            ${escapeHtml(page.magazineName || 'DERGİ')}
          </h1>
          <div class="text-[11px] font-medium text-slate-300 tracking-widest uppercase mt-0.5">${escapeHtml(magazineData.schoolName)}</div>
        </div>

        <div class="relative z-10 space-y-3.5 my-auto pt-8">
          <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow" style="background-color: ${accent}">
            AYIN DOSYASI
          </span>
          <h2 class="font-serif font-bold text-2xl sm:text-3xl leading-tight text-white drop-shadow">
            ${escapeHtml(page.mainHeadline || '')}
          </h2>
          <p class="text-xs sm:text-sm text-slate-200 line-clamp-3 font-light leading-relaxed">
            ${escapeHtml(page.subHeadline || '')}
          </p>
        </div>

        <div class="relative z-10 pt-3 border-t border-white/20 grid grid-cols-1 gap-1.5">
          ${highlights.map(h => `
            <div class="flex items-center gap-2 text-xs text-slate-200 font-medium">
              <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${accent}"></span>
              <span class="truncate">${escapeHtml(h)}</span>
            </div>
          `).join('')}
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
            <h2 class="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-wide">${escapeHtml(page.headerText || 'TÜRK GENÇLİĞİNE HİTABE')}</h2>
          </div>

          <div class="my-auto py-3 flex flex-col items-center text-center space-y-3">
            <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-600/40 p-1 bg-white">
              <img src="${escapeHtml(page.image)}" onerror="this.src='https://placehold.co/400x400/991b1b/ffffff?text=Ataturk'" class="w-full h-full object-cover rounded-xl" alt="Atatürk">
            </div>
            <p class="font-serif italic text-xs sm:text-[13px] text-slate-800 leading-relaxed px-4 max-w-md">
              "${escapeHtml(page.subText || 'Ey Türk Gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyeti\'ni, ilelebet muhafaza ve müdafaa etmektir.')}"
            </p>
            <div class="text-xs font-bold text-red-950 uppercase tracking-wider font-display">— ${escapeHtml(page.author || 'Gazi Mustafa Kemal Atatürk')}</div>
          </div>

          <div class="p-3 rounded-2xl bg-red-950 text-amber-200 text-center font-serif text-xs italic shadow-md">
            "${escapeHtml(page.quote || 'Bütün ümidim gençliktedir.')}"
          </div>
        </div>
      `;
    }

    if (subType === 'director') {
      return `
        <div class="p-6 sm:p-8 flex flex-col h-full justify-between overflow-y-auto bg-slate-50">
          <div>
            <span class="text-[10px] font-bold tracking-widest uppercase text-indigo-600 block mb-1">SUNUŞ / BAŞYAZI</span>
            <h2 class="font-serif font-bold text-2xl text-slate-900 mb-3">${escapeHtml(page.headerText || 'Sunuş')}</h2>
            <div class="flex items-center gap-3.5 mb-4 p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <img src="${escapeHtml(page.image)}" onerror="this.src='https://placehold.co/200x200/e2e8f0/475569?text=Mudur'" class="w-16 h-16 rounded-xl object-cover shrink-0" alt="Yazar">
              <div>
                <div class="font-bold text-sm text-slate-900">${escapeHtml(page.author || 'Okul Müdürü')}</div>
                <div class="text-[11px] text-slate-500 font-medium">Ufuk Anadolu Lisesi</div>
              </div>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line text-justify">
              ${escapeHtml(page.subText || '')}
            </p>
          </div>
          <div class="text-right pt-3 border-t border-slate-200 font-handwriting text-lg text-slate-800">
            ${escapeHtml(page.author || 'Okul Yönetimi')}
          </div>
        </div>
      `;
    }

    return `
      <div class="relative w-full h-full flex flex-col justify-end p-8 text-white overflow-hidden bg-slate-950">
        <img src="${escapeHtml(page.image)}" onerror="this.src='https://placehold.co/800x1100/1e1b4b/ffffff?text=Sanat'" class="absolute inset-0 w-full h-full object-cover opacity-80" alt="Vizyon">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div class="relative z-10 space-y-2">
          <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-300">VİZYONUMUZ</span>
          <h2 class="font-serif italic font-bold text-2xl leading-snug">${escapeHtml(page.headerText || '')}</h2>
          <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(page.subText || '')}</p>
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
            <span class="text-[11px] text-slate-400 font-medium">${escapeHtml(page.author || '')}</span>
          </div>

          <h2 class="font-serif font-bold text-xl md:text-2xl text-white leading-snug mb-1">
            ${escapeHtml(page.title || '')}
          </h2>
          <p class="text-xs text-slate-300 mb-3">${escapeHtml(page.subTitle || '')}</p>

          <div class="relative rounded-2xl overflow-hidden mb-3 bg-black border border-slate-800 shadow-2xl aspect-video">
            <video controls preload="metadata" poster="${escapeHtml(page.videoPoster || '')}" class="w-full h-full object-cover">
              <source src="${escapeHtml(page.videoUrl || '')}" type="video/mp4">
            </video>
          </div>

          ${page.caption ? `<div class="text-[11px] text-slate-400 italic mb-2">${escapeHtml(page.caption)}</div>` : ''}
        </div>

        ${page.notes ? `
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            ${escapeHtml(page.notes)}
          </div>
        ` : ''}
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
            <h2 class="font-serif font-bold text-lg text-white">${escapeHtml(page.boardTitle || 'UFUK E-DERGİ YAYIN KURULU')}</h2>
          </div>

          <div class="space-y-2 text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 mb-4">
            <div><strong>İmtiyaz Sahibi:</strong> ${escapeHtml(page.publisher || '')}</div>
            <div><strong>Genel Yayın Yönetmeni:</strong> ${escapeHtml(page.editorInChief || '')}</div>
            <div><strong>Yayın Danışmanı:</strong> ${escapeHtml(page.advisor || '')}</div>
            <div><strong>Yazı İşleri & Mizanpaj:</strong> ${escapeHtml(page.editorialTeam || '')}</div>
            <div class="pt-1 text-[11px] text-slate-400 border-t border-slate-800/80">${escapeHtml(page.contactInfo || '')}</div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 p-4 rounded-2xl border border-indigo-500/30">
          <div class="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
            <i class="ph ph-sparkle text-base"></i>
            <span>${escapeHtml(page.nextIssueTeaserTitle || 'GELECEK SAYIDA NELER VAR?')}</span>
          </div>
          <div class="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
            ${escapeHtml(page.nextIssueText || '')}
          </div>
        </div>
      </div>
    `;
  }

  // 5. K4 • ARKA DIŞ KAPAK
  if (page.type === 'k4') {
    return `
      <div class="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden bg-slate-950">
        <img src="${escapeHtml(page.coverImage)}" onerror="this.src='https://placehold.co/800x1100/0f172a/ffffff?text=Arka+Kapak'" class="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 pointer-events-none" alt="Arka Kapak">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/80 pointer-events-none"></div>

        <div class="relative z-10 text-center border-b border-white/20 pb-3">
          <h2 class="font-display font-extrabold text-2xl tracking-wider text-white uppercase">${escapeHtml(page.schoolName || magazineData.schoolName)}</h2>
          <div class="text-xs italic text-indigo-300 font-serif mt-1">${escapeHtml(page.motto || '')}</div>
        </div>

        <div class="relative z-10 my-auto py-4 flex flex-col items-center text-center space-y-3">
          <div class="w-28 h-28 bg-white p-2 rounded-2xl shadow-2xl">
            <img src="${escapeHtml(page.qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dergimiz.com.tr')}" alt="QR Kod" class="w-full h-full object-contain">
          </div>
          <div class="text-xs text-slate-300 font-medium max-w-xs">${escapeHtml(page.qrText || 'Dergimizi çevrim içi okumak için karekodu okutun')}</div>
        </div>

        <div class="relative z-10 pt-3 border-t border-white/20 text-center space-y-1">
          <div class="text-[11px] text-slate-400 font-mono">${escapeHtml(page.social || '')}</div>
          <div class="text-xs font-serif italic text-slate-300 font-semibold">${escapeHtml(page.closingQuote || '')}</div>
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

  // 7. İÇİNDEKİLER
  if (page.type === 'toc') {
    const tocItems = (magazineData.pages || []).map((p, idx) => ({
      num: idx + 1,
      title: p.navTitle || ('Sayfa ' + (idx + 1))
    }));

    return `
      <div class="p-6 md:p-7 flex flex-col h-full justify-between overflow-y-auto">
        <div>
          <div class="flex items-center justify-between border-b-2 pb-2 mb-3" style="border-color: ${accent}">
            <span class="text-xs font-bold tracking-widest uppercase" style="color: ${accent}">EDİTÖRÜN MASASI</span>
            <span class="text-[11px] text-slate-400 font-medium">BAŞYAZI & İÇİNDEKİLER</span>
          </div>

          <h2 class="font-serif font-bold text-xl text-slate-900 mb-2 leading-snug">
            ${escapeHtml(page.editorTitle || '')}
          </h2>

          <div class="flex gap-3 mb-3">
            <img src="${escapeHtml(page.editorImage)}" onerror="this.src='https://placehold.co/200x200/e2e8f0/475569?text=Editor'" class="w-14 h-14 rounded-xl object-cover shrink-0 shadow border border-slate-200" alt="Editör">
            <div class="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
              ${escapeHtml(page.editorText || '')}
            </div>
          </div>
          <div class="text-right text-xs font-semibold text-slate-800 mb-3">— ${escapeHtml(page.editorName || '')}</div>
        </div>

        <div class="bg-slate-50 rounded-xl p-3 border border-slate-200/80 my-auto">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <i class="ph ph-book-open text-sm" style="color: ${accent}"></i> Bu Sayıda Neler Var?
          </h3>
          <div class="space-y-1">
            ${tocItems.map(item => `
              <div onclick="goToPage(${item.num - 1})" class="flex items-center gap-2 text-xs py-1 px-2 rounded hover:bg-indigo-50 cursor-pointer transition">
                <span class="font-bold text-[10.5px] w-5 h-5 rounded flex items-center justify-center text-white shrink-0" style="background-color: ${accent}">${item.num}</span>
                <span class="font-medium text-slate-700 truncate">${escapeHtml(item.title)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 whitespace-pre-line leading-relaxed">
          <strong class="text-slate-700 uppercase block mb-0.5">Yayın Kurulu Künyesi:</strong>${escapeHtml(page.editorialBoard || '')}
        </div>
      </div>
    `;
  }

  // 8. HABER / MAKALE
  if (page.type === 'article') {
    return `
      <div class="p-6 md:p-7 flex flex-col h-full justify-between overflow-y-auto">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white" style="background-color: ${accent}">
              ${escapeHtml(page.category || 'HABER')}
            </span>
            <span class="text-[11px] text-slate-400 font-medium">${escapeHtml(page.author || '')}</span>
          </div>

          <h2 class="font-serif font-bold text-xl md:text-2xl text-slate-900 leading-snug mb-3">
            ${escapeHtml(page.title || '')}
          </h2>

          <div class="relative rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
            <img src="${escapeHtml(page.image)}" onerror="this.src='https://placehold.co/800x450/e2e8f0/475569?text=Haber'" class="w-full h-36 md:h-44 object-cover" alt="Haber">
            ${page.imageCaption ? `<div class="bg-slate-900/80 text-white text-[10px] px-3 py-1">${escapeHtml(page.imageCaption)}</div>` : ''}
          </div>

          <div class="text-[11.5px] text-slate-700 leading-relaxed columns-1 sm:columns-2 gap-4 whitespace-pre-line text-justify">
            ${escapeHtml(page.content || '')}
          </div>
        </div>

        ${page.pullQuote ? `
          <div class="mt-3 p-3 rounded-xl bg-slate-50 border-l-4 text-xs italic font-serif text-slate-800" style="border-color: ${accent}">
            "${escapeHtml(page.pullQuote)}"
          </div>
        ` : ''}
      </div>
    `;
  }

  // 9. RÖPORTAJ
  if (page.type === 'interview') {
    return `
      <div class="p-6 md:p-7 flex flex-col h-full justify-between overflow-y-auto">
        <div class="flex items-center gap-4 p-3.5 rounded-2xl text-white mb-3 shadow-md" style="background: linear-gradient(135deg, ${accent}, #1e1b4b)">
          <img src="${escapeHtml(page.photo)}" onerror="this.src='https://placehold.co/300x300/e2e8f0/475569?text=Konuk'" class="w-16 h-16 rounded-xl object-cover border-2 border-white/80 shrink-0 shadow" alt="Konuk">
          <div>
            <span class="text-[10px] uppercase tracking-widest font-bold text-white/80 block">${escapeHtml(page.rubric || 'AYIN SÖYLEŞİSİ')}</span>
            <h2 class="font-serif font-bold text-lg leading-tight">${escapeHtml(page.interviewee || '')}</h2>
            <div class="text-xs text-white/90 font-medium mb-1">${escapeHtml(page.role || '')}</div>
            <p class="text-[10.5px] text-white/80 leading-snug line-clamp-2">${escapeHtml(page.intro || '')}</p>
          </div>
        </div>

        <div class="space-y-2.5 flex-1">
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div class="text-xs font-bold text-slate-900 mb-1 flex items-start gap-1.5">
              <span class="px-1.5 rounded text-[10px] text-white shrink-0 mt-0.5" style="background-color: ${accent}">S1</span>
              <span>${escapeHtml(page.q1 || '')}</span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed pl-5">${escapeHtml(page.a1 || '')}</p>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div class="text-xs font-bold text-slate-900 mb-1 flex items-start gap-1.5">
              <span class="px-1.5 rounded text-[10px] text-white shrink-0 mt-0.5" style="background-color: ${accent}">S2</span>
              <span>${escapeHtml(page.q2 || '')}</span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed pl-5">${escapeHtml(page.a2 || '')}</p>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div class="text-xs font-bold text-slate-900 mb-1 flex items-start gap-1.5">
              <span class="px-1.5 rounded text-[10px] text-white shrink-0 mt-0.5" style="background-color: ${accent}">S3</span>
              <span>${escapeHtml(page.q3 || '')}</span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed pl-5">${escapeHtml(page.a3 || '')}</p>
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
          <span class="text-[10px] font-bold tracking-widest uppercase block mb-0.5" style="color: ${accent}">${escapeHtml(page.header || 'EDEBİYAT')}</span>
          <h2 class="font-serif italic font-bold text-2xl text-slate-900">${escapeHtml(page.title || '')}</h2>
          <div class="text-xs text-slate-500 font-medium mt-1">${escapeHtml(page.author || '')}</div>
        </div>

        <div class="my-auto py-2 flex flex-col items-center">
          <div class="w-full h-28 rounded-xl overflow-hidden mb-3 shadow-sm border border-slate-200">
            <img src="${escapeHtml(page.bgImage)}" onerror="this.src='https://placehold.co/800x300/e2e8f0/475569?text=Sanat'" class="w-full h-full object-cover" alt="Sanat">
          </div>
          <div class="font-serif italic text-xs md:text-sm text-slate-800 leading-loose text-center whitespace-pre-line px-4">
            ${escapeHtml(page.poemText || '')}
          </div>
        </div>

        <div class="p-2.5 rounded-xl bg-white border border-slate-200 text-[10px] text-slate-500 text-center">
          <i class="ph ph-feather mr-1" style="color: ${accent}"></i> ${escapeHtml(page.bottomNote || '')}
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
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white" style="background-color: ${accent}">
              ${escapeHtml(page.title || 'ETKİLEŞİMLİ KÖŞE')}
            </span>
          </div>

          <div class="bg-slate-900 text-white p-4 rounded-2xl shadow-lg mb-3">
            <h3 class="font-display font-bold text-base text-amber-400 mb-1.5 flex items-center gap-1.5">
              <i class="ph ph-lightbulb text-lg"></i> ${escapeHtml(page.questionTitle || '')}
            </h3>
            <p class="text-xs text-slate-200 leading-relaxed mb-3">${escapeHtml(page.questionText || '')}</p>

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
            <span class="truncate">${escapeHtml(page.bookRec || '')}</span>
          </div>
          <div class="text-xs text-slate-700 flex items-center gap-2">
            <span class="font-semibold text-rose-600 shrink-0">Film:</span>
            <span class="truncate">${escapeHtml(page.movieRec || '')}</span>
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
}

function updateQuizOption(optIdx, value) {
  if (!magazineData.pages[selectedEditIndex].options) {
    magazineData.pages[selectedEditIndex].options = ["", "", "", ""];
  }
  magazineData.pages[selectedEditIndex].options[optIdx] = value;
  renderMagazineViewport();
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

function addNewPage(templateType) {
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

  if (templateType === 'k2') {
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
  } else if (templateType === 'cover') {
    newPage = {
      ...newPage,
      navTitle: "K1 • Ön Dış Kapak",
      magazineName: "UFUK",
      issueTag: "ÖZEL SAYI",
      mainHeadline: "Yeni Kapak Başlığı",
      subHeadline: "Alt başlık ve dosya konusu açıklaması",
      coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
      highlights: "Öne Çıkan Başlık 1\nÖne Çıkan Başlık 2"
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
    const res = await fetch('/api/auth/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-code': currentUser.code
      },
      body: JSON.stringify({ code, name, title, role: 'editor' })
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
        title,
        schoolName: school,
        issueMonth: month,
        description: desc,
        pages: initialPages
      })
    });
    const data = await res.json();
    if (data.success) {
      closeModal('newIssueModal');
      await loadAllIssues();
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
