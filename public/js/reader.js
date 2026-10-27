// Dergimiz Flipbook Okuyucu Motoru (Reader Script)
let magazineData = null;
let currentIndex = 0;
let spreadMode = true;
let audioEnabled = true;
let audioCtx = null;

// URL'den sayı ID'sini al
const urlParams = new URLSearchParams(window.location.search);
const issueId = urlParams.get('id') || 'sayi-1';

function renderBarcodeSvg(color = '#000000') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="inline-block opacity-75"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.innerWidth < 1024) {
    spreadMode = false;
  }
  updateSpreadUI();
  await loadIssueData(issueId);

  // Editör Masası linkini güncelle
  const studioBtn = document.getElementById('btnGoToStudio');
  if (studioBtn) studioBtn.href = `/editor?id=${issueId}`;

  // Klavye Kontrolleri
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') nextPage();
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevPage();
    if (e.key === 'f' || e.key === 'F') toggleFullScreen();
  });
});

async function loadIssueData(id) {
  try {
    const res = await fetch(`/api/issues/${id}?view=1`);
    if (!res.ok) throw new Error('Sayı yüklenemedi');
    magazineData = await res.json();
  } catch (err) {
    console.warn('API verisi alınamadı, hafızadan yükleniyor:', err);
    magazineData = {
      title: "Sayı #1 • Ekim 2026",
      schoolName: "UFUK ANADOLU LİSESİ E-DERGİSİ",
      issueInfo: "Sayı #1 • Ekim 2026",
      pages: []
    };
  }

  document.getElementById('readerMagTitle').textContent = magazineData.schoolName || "UFUK ANADOLU LİSESİ";
  document.getElementById('readerIssueBadge').textContent = magazineData.title || "Sayı #1";
  renderMagazine();
}

function renderMagazine() {
  const viewport = document.getElementById('magazineViewport');
  viewport.innerHTML = '';

  if (!magazineData || !magazineData.pages || magazineData.pages.length === 0) {
    viewport.innerHTML = '<div class="text-slate-400 p-8">Bu sayıda henüz sayfa bulunmuyor.</div>';
    return;
  }

  const total = magazineData.pages.length;
  if (currentIndex >= total) currentIndex = total - 1;
  if (currentIndex < 0) currentIndex = 0;

  const heightClass = 'h-[72vh] sm:h-[78vh] md:h-[83vh]';

  // Kapak (0) veya son sayfa (total-1) tek gösterilebilir
  if (!spreadMode || currentIndex === 0 || currentIndex === total - 1) {
    // TEK SAYFA MODU
    const pageData = magazineData.pages[currentIndex];
    const pageEl = createPageDOM(pageData, currentIndex, 'single', heightClass);
    viewport.appendChild(pageEl);

    document.getElementById('pageIndicatorText').textContent = `Sayfa ${currentIndex + 1} / ${total}`;
  } else {
    // ÇİFT SAYFA (SPREAD) MODU
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

  // Buton aktiflik durumları
  document.getElementById('btnPrev').disabled = currentIndex === 0;
  const isAtEnd = (!spreadMode && currentIndex >= total - 1) || 
                  (spreadMode && currentIndex >= total - 1);
  document.getElementById('btnNext').disabled = isAtEnd;
}

function createPageDOM(page, pageIndex, position, heightClass) {
  const wrapper = document.createElement('div');
  const posClass = position === 'left' ? 'page-left' : (position === 'right' ? 'page-right' : 'page-single');

  wrapper.className = `magazine-page ${posClass} ${heightClass} bg-white text-slate-900 flex flex-col justify-between select-none animate-curl relative`;

  let spineHtml = '';
  if (position === 'left') spineHtml = '<div class="spine-shadow-left"></div>';
  if (position === 'right') spineHtml = '<div class="spine-shadow-right"></div>';

  // 3D Köşe Bükülme (Page-Curl)
  const curlCornerHtml = '<div class="page-curl-corner"></div>';

  const bodyHtml = renderTemplateHTML(page, pageIndex);

  // Sayfa üzerine eklenmiş serbest elemanlar (Metin, Resim, Video)
  let elementsHtml = '';
  if (page.elements && page.elements.length > 0) {
    elementsHtml = page.elements.map(el => renderReaderElement(el)).join('');
  }

  const isCoverSurface = page.type === 'cover' || page.type === 'k1' || page.type === 'k4';
  const footerHtml = isCoverSurface ? '' : `
    <div class="px-6 py-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-medium text-slate-400 bg-white/95 shrink-0 z-10">
      <span class="truncate max-w-[180px]">${escapeHtml(magazineData.schoolName)}</span>
      <span class="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">${pageIndex + 1}</span>
      <span>${escapeHtml(magazineData.issueMonth || magazineData.issueInfo || '')}</span>
    </div>
  `;

  wrapper.innerHTML = `
    ${spineHtml}
    ${curlCornerHtml}
    <div class="flex-1 overflow-hidden flex flex-col relative">
      ${bodyHtml}
      ${elementsHtml}
    </div>
    ${footerHtml}
  `;

  return wrapper;
}

function renderReaderElement(el) {
  const x = el.x || 10;
  const y = el.y || 10;
  const w = el.width || 30;
  const h = el.height || 20;
  const rot = el.rotate || 0;
  const z = el.zIndex || 10;

  const style = `left:${x}%; top:${y}%; width:${w}%; height:${h}%; transform:rotate(${rot}deg); z-index:${z};`;

  if (el.type === 'image') {
    return `
      <div class="canvas-element pointer-events-none" style="${style}">
        <img src="${escapeHtml(el.url)}" class="w-full h-full object-cover rounded-xl shadow-md" alt="">
      </div>
    `;
  }

  if (el.type === 'video') {
    return `
      <div class="canvas-element" style="${style}">
        <div class="magazine-video-container">
          <video controls preload="metadata" poster="${escapeHtml(el.poster || '')}">
            <source src="${escapeHtml(el.url)}" type="video/mp4">
          </video>
        </div>
      </div>
    `;
  }

  if (el.type === 'text') {
    return `
      <div class="canvas-element pointer-events-none p-2.5 rounded-xl border leading-relaxed overflow-hidden" style="${style} background-color:${el.bgColor || 'transparent'}; border-color:${el.borderColor || 'transparent'}; font-family:${el.fontFamily || 'inherit'}; font-size:${el.fontSize || 12}px; color:${el.color || '#0f172a'}; text-align:${el.textAlign || 'left'};">
        ${el.content || ''}
      </div>
    `;
  }

  return '';
}

// Şablon Render Fonksiyonu (K1, K2, K3, K4, Video ve Klasik Şablonlar)
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
            <span>${escapeHtml(page.issueTag || 'SAYI 01 | EKİM 2026')}</span>
            <span>${escapeHtml(page.price || 'OKUL E-DERGİSİ')}</span>
          </div>

          <div class="my-auto py-2">
            <h1 class="text-5xl sm:text-7xl font-serif font-black tracking-tight text-stone-900 uppercase my-3 leading-none">
              ${escapeHtml(page.magazineName || 'KAMER')}
            </h1>
            
            <div class="flex flex-col sm:flex-row gap-4 h-[380px] sm:h-[420px] mt-2">
              <!-- Sol Metin Bloğu -->
              <div class="w-full sm:w-1/2 bg-black text-white p-5 sm:p-6 rounded-2xl flex flex-col justify-between shadow-xl">
                <div>
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider mb-3" style="background-color: ${accent}">KAPAK DOSYASI</span>
                  <h2 class="text-2xl sm:text-3xl font-serif font-bold leading-tight mb-2 text-white">${escapeHtml(page.mainHeadline || 'Güçlü Lider')}</h2>
                  <p class="text-xs text-stone-300 font-sans leading-relaxed mb-3">${escapeHtml(page.subHeadline || '')}</p>
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
                <img src="${escapeHtml(page.coverImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80')}" onerror="this.src='https://placehold.co/800x1100/1e1b4b/ffffff?text=Kapak'" class="w-full h-full object-cover" alt="Kapak Görseli">
                <div class="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded shadow text-stone-800 flex items-center gap-1.5">
                  ${renderBarcodeSvg('#1c1917')}
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center pt-2 border-t border-stone-300 text-[10px] font-sans font-semibold text-stone-500 uppercase tracking-widest">
            <span>${escapeHtml(magazineData.schoolName || '')}</span>
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
            <span>${escapeHtml(page.issueTag || 'SAYI 04')}</span>
            <span>${escapeHtml(page.price || '2026')}</span>
          </div>

          <div class="relative my-auto flex flex-col items-center justify-center">
            <h1 class="text-6xl sm:text-8xl font-black uppercase tracking-tighter text-center leading-none text-white/90 mix-blend-overlay my-[-10px] select-none">
              ${escapeHtml(page.magazineName || 'RESİMLİK')}
            </h1>

            <div class="w-60 sm:w-72 h-64 sm:h-72 my-[-20px] sm:my-[-30px] z-10 transform -rotate-3 border-4 border-white shadow-2xl overflow-hidden rounded-xl bg-white/20 backdrop-blur">
              <img src="${escapeHtml(page.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80')}" onerror="this.src='https://placehold.co/800x1100/1e1b4b/ffffff?text=Kapak'" class="w-full h-full object-cover" alt="Kapak Görseli">
            </div>

            <div class="z-20 text-center mt-6 inline-block mx-auto px-6 py-2.5 transform rotate-2 bg-yellow-300 text-slate-950 font-black shadow-2xl rounded-lg">
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight uppercase">${escapeHtml(page.mainHeadline || 'YENİ GÖRÜNÜMLER')}</h2>
            </div>

            <p class="mt-3 font-bold text-xs uppercase tracking-widest text-center text-white/95 px-4">${escapeHtml(page.subHeadline || 'LİT POPÜLER KÜLTÜR VE GENÇLİK DOSYASI')}</p>
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
              <h1 class="text-4xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-none">${escapeHtml(page.magazineName || 'KONAK')}</h1>
              <div class="text-right text-xs uppercase font-bold text-slate-700">
                <div>${escapeHtml(page.price || 'EV & YAŞAM')}</div>
                <div class="text-slate-500 font-mono">${escapeHtml(page.issueTag || 'SAYI 01')}</div>
              </div>
            </div>

            <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 min-h-0">
              <div class="sm:col-span-2 border-2 border-slate-900 rounded-lg overflow-hidden relative bg-stone-200 min-h-[220px]">
                <img src="${escapeHtml(page.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80')}" onerror="this.src='https://placehold.co/800x1100/1e1b4b/ffffff?text=Kapak'" class="w-full h-full object-cover" alt="Kapak Görseli">
                <div class="absolute bottom-2 left-2 bg-white border border-slate-900 px-2 py-1 text-[10px] font-bold uppercase shadow">
                  <span>${escapeHtml(page.subHeadline || 'TASARIM ÖDÜLLERİ VE YAŞAM ALANLARI')}</span>
                </div>
              </div>

              <div class="sm:col-span-1 flex flex-col gap-2.5">
                <div class="border-2 border-slate-900 p-3 bg-slate-900 text-white rounded-lg flex flex-col justify-center">
                  <span class="text-[9px] uppercase font-bold tracking-widest text-amber-400 block mb-1">BAŞLIK</span>
                  <h2 class="text-lg sm:text-xl font-bold leading-tight">${escapeHtml(page.mainHeadline || 'TARZ DENEYİMLERİ')}</h2>
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
                  <span class="text-[9px] font-mono font-bold text-slate-700 truncate max-w-[100px]">${escapeHtml(magazineData.schoolName || '')}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center pt-2 border-t-2 border-slate-900 text-[10.5px] font-bold uppercase text-slate-600">
              <span>${escapeHtml(magazineData.schoolName || '')}</span>
              <span>Kültür & Sanat Serisi</span>
            </div>

          </div>
        </div>
      `;
    }

    // 1D. FULLSCREEN (Doğal Ekolü - Varsayılan)
    return `
      <div class="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden bg-slate-950 font-serif select-none">
        <div class="absolute inset-0 w-full h-full">
          <img src="${escapeHtml(page.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80')}" onerror="this.src='https://placehold.co/800x1100/1e1b4b/ffffff?text=Kapak'" class="w-full h-full object-cover opacity-75 scale-105" alt="Kapak">
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none"></div>
        
        <div class="relative z-10 text-center border-b border-white/25 pb-3">
          <div class="flex justify-between items-center text-[10px] tracking-[0.25em] uppercase font-semibold text-indigo-300 mb-1">
            <span>${escapeHtml(page.issueTag || 'SAYI #1 • EKİM 2026')}</span>
            <span>${escapeHtml(page.price || 'YAŞAM ALANLARI')}</span>
          </div>
          <h1 class="font-display font-extrabold text-4xl sm:text-6xl tracking-tighter uppercase text-white drop-shadow-lg">
            ${escapeHtml(page.magazineName || 'DOĞAL')}
          </h1>
          <div class="text-[11px] font-medium text-slate-300 tracking-widest uppercase mt-0.5">${escapeHtml(magazineData.schoolName || '')}</div>
        </div>

        <div class="relative z-10 space-y-3.5 my-auto pt-8">
          <span class="inline-block px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider text-white shadow" style="background-color: ${accent}">
            AYIN DOSYASI
          </span>
          <h2 class="font-serif font-bold text-2xl sm:text-4xl leading-tight text-white drop-shadow">
            ${escapeHtml(page.mainHeadline || 'VAHŞİ YAŞAMIN BÜYÜSÜ')}
          </h2>
          <p class="text-xs sm:text-sm text-slate-200 line-clamp-3 font-light leading-relaxed">
            ${escapeHtml(page.subHeadline || '')}
          </p>
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

  // 2. K2 • ÖN KAPAK İÇİ (3 Seçenek: Atatürk / Sunuş / Sanatsal Vizyon)
  if (page.type === 'k2') {
    const subType = page.subType || 'ataturk';

    // Seçenek A: Atatürk & Gençliğe Hitabe
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

    // Seçenek B: Sunuş / Hoş Geldiniz Mesajı
    if (subType === 'director') {
      return `
        <div class="p-6 sm:p-8 flex flex-col h-full justify-between overflow-y-auto bg-slate-50">
          <div>
            <span class="text-[10px] font-bold tracking-widest uppercase text-indigo-600 block mb-1">SUNUŞ / BAŞYAZI</span>
            <h2 class="font-serif font-bold text-2xl text-slate-900 mb-3">${escapeHtml(page.headerText || 'Yeni Bir Sayı, Yeni Bir Heyecan')}</h2>
            <div class="flex items-center gap-3.5 mb-4 p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <img src="${escapeHtml(page.image)}" onerror="this.src='https://placehold.co/200x200/e2e8f0/475569?text=Mudur'" class="w-16 h-16 rounded-xl object-cover shrink-0" alt="Yazar">
              <div>
                <div class="font-bold text-sm text-slate-900">${escapeHtml(page.author || 'Okul Müdürü')}</div>
                <div class="text-[11px] text-slate-500 font-medium">Ufuk Anadolu Lisesi</div>
              </div>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line text-justify">
              ${escapeHtml(page.subText || 'Sevgili öğrencilerimiz, saygıdeğer velilerimiz ve kıymetli öğretmenlerimiz;\n\nDergimizin bu sayısında emeği geçen herkesi kutluyorum...')}
            </p>
          </div>
          <div class="text-right pt-3 border-t border-slate-200 font-handwriting text-lg text-slate-800">
            ${escapeHtml(page.author || 'Okul Yönetimi')}
          </div>
        </div>
      `;
    }

    // Seçenek C: Tam Sayfa Sanatsal Vizyon
    return `
      <div class="relative w-full h-full flex flex-col justify-end p-8 text-white overflow-hidden bg-slate-950">
        <img src="${escapeHtml(page.image)}" onerror="this.src='https://placehold.co/800x1100/1e1b4b/ffffff?text=Sanat'" class="absolute inset-0 w-full h-full object-cover opacity-80" alt="Vizyon">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div class="relative z-10 space-y-2">
          <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-300">VİZYONUMUZ</span>
          <h2 class="font-serif italic font-bold text-2xl leading-snug">${escapeHtml(page.headerText || 'Sanat, Bilim ve Gençliğin Işığında')}</h2>
          <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(page.subText || '')}</p>
        </div>
      </div>
    `;
  }

  // 3. GÖMÜLÜ OKUL GÖSTERİSİ / ETKİNLİK VİDEOSU SAYFASI
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

          <!-- Sayfa İçi Canlı Video Oynatıcı -->
          <div class="relative rounded-2xl overflow-hidden mb-3 bg-black border border-slate-800 shadow-2xl aspect-video">
            <video controls preload="metadata" poster="${escapeHtml(page.videoPoster || '')}" class="w-full h-full object-cover">
              <source src="${escapeHtml(page.videoUrl || '')}" type="video/mp4">
              Tarayıcınız video oynatmayı desteklemiyor.
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

  // 4. K3 • ARKA KAPAK İÇİ (Detaylı Künye & Gelecek Sayı Fragmanı)
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

        <!-- Gelecek Sayıda Neler Var? (Teaser) -->
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
  if (page.type === 'k4' || page.type === 'back') {
    return `
      <div class="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden bg-neutral-950 font-sans select-none">
        <img src="${escapeHtml(page.coverImage || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80')}" onerror="this.src='https://placehold.co/800x1100/0f172a/ffffff?text=Arka+Kapak'" class="absolute inset-0 w-full h-full object-cover opacity-45 scale-105" alt="Arka Kapak">
        <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/80 pointer-events-none"></div>

        <div class="relative z-10 text-center border-b border-white/20 pb-3">
          <span class="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-0.5">RESMİ YAYIN KAPANIŞI</span>
          <h2 class="font-display font-extrabold text-2xl sm:text-3xl tracking-wider text-white uppercase">${escapeHtml(page.schoolName || magazineData.schoolName)}</h2>
          <div class="text-xs italic text-stone-300 font-serif mt-1">${escapeHtml(page.motto || 'Eğitimde Öncü, Sanatta ve Bilimde Işık')}</div>
        </div>

        <div class="relative z-10 my-auto py-4 flex flex-col items-center text-center space-y-4">
          <div class="w-32 h-32 rounded-full border-4 border-white/30 flex flex-col items-center justify-center bg-white/10 backdrop-blur shadow-2xl relative p-3">
            <img src="${escapeHtml(page.qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dergimiz.com.tr')}" alt="QR Kod" class="w-20 h-20 object-contain rounded-lg bg-white p-1 shadow">
          </div>

          <div class="max-w-sm space-y-1.5">
            <div class="text-sm sm:text-base font-serif italic text-amber-200">${escapeHtml(page.closingQuote || '\"Hayata ve geleceğe değer katan tasarımlar.\"')}</div>
            <div class="text-xs text-stone-300 font-light">${escapeHtml(page.qrText || 'Dergimizi çevrim içi okumak ve arşivimize ulaşmak için karekodu okutun.')}</div>
          </div>
        </div>

        <div class="relative z-10 pt-3 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div class="text-[11px] text-stone-400 font-mono">${escapeHtml(page.social || '@dergimiz • dergimiz.com.tr')}</div>
          <div class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest border border-white/30 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur">
            ${renderBarcodeSvg('#ffffff')}
            <span>DERGİMİZ.COM.TR</span>
          </div>
        </div>
      </div>
    `;
  }

  // 6. İÇİNDEKİLER & EDİTÖRDEN
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

          <h2 class="font-serif font-bold text-2xl text-slate-900 mb-3 leading-snug">
            ${escapeHtml(page.editorTitle || 'Bu Sayıya Dair')}
          </h2>

          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <img src="${escapeHtml(page.editorImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')}" onerror="this.src='https://placehold.co/200x200/e2e8f0/475569?text=Editor'" class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 shadow-md border-2 border-slate-200" alt="Editör">
            <div class="flex-1 space-y-2">
              <div class="p-2.5 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-xs italic font-serif text-slate-800">
                "${escapeHtml(page.editorQuote || 'Dergimizi hazırlarken ilhamımızı sokaklardan, sanattan ve teknolojiden alıyoruz.')}"
              </div>
              <div class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                ${escapeHtml(page.editorText || '')}
              </div>
              <div class="text-right text-xs font-bold text-slate-800 pt-1">— ${escapeHtml(page.editorName || 'Genel Yayın Yönetmeni')}</div>
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
          <div><strong class="text-slate-700">Yayın Masası:</strong> ${escapeHtml(page.editorialBoard || 'Dergimiz Okul Yayın Kurulu')}</div>
          <div>${renderBarcodeSvg('#64748b')}</div>
        </div>
      </div>
    `;
  }

  // 7. HABER & MAKALE
  if (page.type === 'article') {
    return `
      <div class="p-6 md:p-8 flex flex-col h-full justify-between overflow-y-auto bg-white text-slate-900 font-sans select-none">
        <div>
          <div class="flex items-center justify-between border-b pb-2 mb-3 border-slate-200">
            <div class="flex items-center gap-2">
              <span class="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm" style="background-color: ${accent}">
                ${escapeHtml(page.category || 'ÖZEL DOSYA')}
              </span>
              <span class="text-xs text-slate-400 font-medium">— ${escapeHtml(page.author || '')}</span>
            </div>
            <span class="text-[10.5px] uppercase font-mono font-semibold text-slate-400">${escapeHtml(magazineData.schoolName || '')}</span>
          </div>

          <div class="relative mb-4">
            <h2 class="font-serif font-black text-2xl md:text-3xl text-slate-900 leading-tight">
              ${escapeHtml(page.title || '')}
            </h2>
          </div>

          <div class="relative rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-200 shadow-md">
            <img src="${escapeHtml(page.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80')}" onerror="this.src='https://placehold.co/800x450/e2e8f0/475569?text=Haber'" class="w-full h-44 sm:h-52 object-cover" alt="Haber">
            <div class="bg-slate-900/90 backdrop-blur text-white text-[10px] px-3 py-1 flex justify-between items-center">
              <span>${escapeHtml(page.imageCaption || '')}</span>
              <span class="opacity-70">${renderBarcodeSvg('#ffffff')}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2 text-xs text-slate-700 leading-relaxed columns-1 sm:columns-2 gap-4 whitespace-pre-line text-justify font-serif">
              ${escapeHtml(page.content || '')}
            </div>

            <div class="sm:col-span-1 space-y-3">
              ${page.pullQuote ? `
                <div class="p-3.5 rounded-2xl bg-stone-50 border-l-4 text-xs italic font-serif text-slate-800 shadow-sm" style="border-color: ${accent}">
                  "${escapeHtml(page.pullQuote)}"
                </div>
              ` : ''}
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

  // 8. AYIN RÖPORTAJI
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

  // 9. EDEBİYAT & ŞİİR
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

  // 10. QUIZ & BİLMECE
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
                <button onclick="checkReaderQuiz(${pageIndex}, ${oIdx})" class="w-full text-left px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center justify-between transition active:scale-[0.99]">
                  <span><strong>${['A','B','C','D'][oIdx]})</strong> ${escapeHtml(opt)}</span>
                  <i class="ph ph-circle text-slate-500"></i>
                </button>
              `).join('')}
            </div>
            <div id="quizFeedback_${pageIndex}" class="hidden mt-2.5 p-2.5 rounded-xl text-xs font-medium"></div>
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

  // 11. BOŞ SAYFA (Freeform Canvas)
  return `
    <div class="p-6 md:p-8 flex flex-col h-full justify-center items-center text-center text-slate-400">
      <div class="font-serif italic text-sm text-slate-500">${escapeHtml(page.navTitle || 'Sayfa')}</div>
    </div>
  `;
}

// Etkileşimli Quiz Kontrolü
window.checkReaderQuiz = function(pageIndex, optIdx) {
  const page = magazineData.pages[pageIndex];
  const fb = document.getElementById(`quizFeedback_${pageIndex}`);
  if (!fb) return;

  fb.classList.remove('hidden', 'bg-emerald-500/20', 'text-emerald-300', 'bg-rose-500/20', 'text-rose-300');
  if (optIdx === Number(page.correctIndex)) {
    fb.classList.add('bg-emerald-500/20', 'text-emerald-300');
    fb.innerHTML = `<i class="ph ph-check-circle font-bold mr-1"></i> ${escapeHtml(page.explanation || 'Doğru cevap!')}`;
  } else {
    fb.classList.add('bg-rose-500/20', 'text-rose-300');
    fb.innerHTML = `<i class="ph ph-x-circle font-bold mr-1"></i> Yanlış cevap! Tekrar deneyin.`;
  }
};

// Navigasyon
function prevPage() {
  if (!spreadMode) {
    if (currentIndex > 0) currentIndex--;
  } else {
    if (currentIndex === 1) currentIndex = 0;
    else if (currentIndex > 1) currentIndex -= 2;
  }
  playPageTurnSound();
  renderMagazine();
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
  playPageTurnSound();
  renderMagazine();
}

function goToPage(idx) {
  closeTocModal();
  if (!spreadMode) {
    currentIndex = idx;
  } else {
    currentIndex = idx === 0 ? 0 : (idx % 2 === 1 ? idx : idx - 1);
  }
  playPageTurnSound();
  renderMagazine();
}

function toggleSpreadMode() {
  spreadMode = !spreadMode;
  updateSpreadUI();
  renderMagazine();
}

function updateSpreadUI() {
  const txt = document.getElementById('spreadToggleText');
  if (txt) txt.textContent = spreadMode ? "Çift Sayfa" : "Tek Sayfa";
}

// Kağıt Çevirme Sesi (Web Audio API)
function playPageTurnSound() {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const bufferSize = audioCtx.sampleRate * 0.18;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.17);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start();
  } catch (err) {
    // Ses desteği yoksa sessiz devam et
  }
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const icon = document.getElementById('audioIcon');
  if (audioEnabled) {
    icon.className = "ph ph-speaker-high text-lg";
    showToast("Sayfa çevirme sesi açık");
  } else {
    icon.className = "ph ph-speaker-slash text-lg";
    showToast("Ses kapatıldı");
  }
}

function toggleFullScreen() {
  const icon = document.getElementById('fsIcon');
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    if (icon) icon.className = "ph ph-corners-in text-lg";
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    if (icon) icon.className = "ph ph-corners-out text-lg";
  }
}

function shareMagazine() {
  if (navigator.share) {
    navigator.share({
      title: magazineData.title || 'Dergimiz',
      text: `${magazineData.schoolName} - ${magazineData.title} yayında!`,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast("Dergi bağlantısı panoya kopyalandı!");
  }
}

function openTocModal() {
  const list = document.getElementById('tocModalList');
  if (magazineData && magazineData.pages) {
    list.innerHTML = magazineData.pages.map((p, idx) => `
      <button onclick="goToPage(${idx})" class="w-full p-3 rounded-2xl bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/80 flex items-center justify-between text-left transition group">
        <div class="flex items-center gap-3 truncate">
          <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">${idx + 1}</span>
          <span class="text-sm font-semibold text-white group-hover:text-indigo-300 truncate">${escapeHtml(p.navTitle || 'Sayfa ' + (idx + 1))}</span>
        </div>
        <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded ml-2 shrink-0">${getTemplateLabel(p.type)}</span>
      </button>
    `).join('');
  }
  document.getElementById('tocModal').classList.remove('hidden');
}

function closeTocModal() {
  document.getElementById('tocModal').classList.add('hidden');
}

function getTemplateLabel(type) {
  const map = {
    cover: 'K1 Kapak',
    k1: 'K1 Kapak',
    k2: 'K2 Kapak İçi',
    k3: 'K3 Künye',
    k4: 'K4 Arka Kapak',
    toc: 'İçindekiler',
    article: 'Makale',
    interview: 'Röportaj',
    literature: 'Edebiyat',
    video: 'Video Köşesi',
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
  }, 3000);
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
