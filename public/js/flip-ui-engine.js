/**
 * Dergimiz — FlipHTML5 V2 Editör Motoru & Arayüz Genişletmesi
 * FlipHTML5 Editor V2 Mimarisini 1-e-1 Karşılayan İnteraktif Bileşenler:
 * 1. Tuval Üstü Yüzen Hızlı Format Çubuğu (Floating Context Toolbar)
 * 2. 6 Sol Çekmece Sistemi (Sayfa, Şablon, Öğeler, Bağlantı, Daha Fazla, Yüklemeler)
 * 3. Sayfa Ekleme Alt Menüsü (+ Yeni İki Sayfa, + Yeni Tek Sayfa, PDF Ekle, Resim Ekle)
 * 4. Sağ Denetçi: Sayfa Boyutu (G/Y), 4 Renk Şeması, Arka Plan, Eylemler & Yanıp Sönen Hatırlatıcı
 * 5. Mıknatıslı Akıllı Kılavuzlar (Smart Snapping)
 */

(function initFlipUIEngine() {
  console.log("🚀 FlipHTML5 V2 UI & Etkileşim Motoru Başlatılıyor...");

  // 1. FLIP RENK ŞEMALARI (Gök mavisi, Fern Green, Sıcak Kahverengi, Gece yarısı)
  window.FLIP_V2_SCHEMES = [
    {
      id: 'sky',
      name: 'Gök mavisi',
      titleColor: '#0284c7',
      textColor: '#0f172a',
      bgColor: '#f0f9ff',
      palette: ['#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe']
    },
    {
      id: 'fern',
      name: 'Fern Green',
      titleColor: '#166534',
      textColor: '#0f172a',
      bgColor: '#f0fdf4',
      palette: ['#166534', '#22c55e', '#86efac', '#bbf7d0', '#dcfce7']
    },
    {
      id: 'warm_brown',
      name: 'Sıcak Kahverengi',
      titleColor: '#78350f',
      textColor: '#1c1917',
      bgColor: '#fffbeb',
      palette: ['#78350f', '#b45309', '#f59e0b', '#fde68a', '#fef3c7']
    },
    {
      id: 'midnight',
      name: 'Gece yarısı',
      titleColor: '#f8fafc',
      textColor: '#94a3b8',
      bgColor: '#0f172a',
      palette: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b']
    }
  ];

  // 2. YÜZEN HIZLI FORMAT ÇUBUĞU (FLOATING CONTEXT BAR)
  window.updateFloatingContextBar = function(fCanvas) {
    let bar = document.getElementById('floatingContextBar');
    if (!bar) {
      const ws = document.getElementById('mainCanvasWorkspace') || document.body;
      bar = document.createElement('div');
      bar.id = 'floatingContextBar';
      bar.className = 'fixed z-50 bg-white/98 text-slate-800 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-2xl px-2.5 py-1.5 flex items-center gap-1.5 transition-all duration-75 select-none hidden';
      ws.appendChild(bar);
    }

    if (!fCanvas) {
      bar.classList.add('hidden');
      return;
    }

    const activeObj = fCanvas.getActiveObject();
    if (!activeObj) {
      bar.classList.add('hidden');
      return;
    }

    const canvasEl = fCanvas.lowerCanvasEl;
    if (!canvasEl) {
      bar.classList.add('hidden');
      return;
    }

    const canvasRect = canvasEl.getBoundingClientRect();
    const objBound = activeObj.getBoundingRect(true, true);

    // Nesnenin hemen üstüne hizala
    let top = canvasRect.top + objBound.top - 48;
    let left = canvasRect.left + objBound.left + (objBound.width / 2);

    // Üst bara çarpmasın
    if (top < 62) {
      top = canvasRect.top + objBound.top + objBound.height + 12;
    }

    // Ekran sınırları
    left = Math.max(160, Math.min(window.innerWidth - 380, left));

    bar.style.top = `${Math.round(top)}px`;
    bar.style.left = `${Math.round(left)}px`;
    bar.style.transform = 'translateX(-50%)';
    bar.classList.remove('hidden');

    renderFloatingBarButtons(bar, activeObj, fCanvas);
  };

  window.hideFloatingContextBar = function() {
    const bar = document.getElementById('floatingContextBar');
    if (bar) bar.classList.add('hidden');
  };

  function renderFloatingBarButtons(bar, activeObj, fCanvas) {
    const type = activeObj.type;

    // METİN NESNESİ (textbox, i-text)
    if (type === 'textbox' || type === 'i-text') {
      const curFont = activeObj.fontFamily || 'Inter';
      const curSize = Math.round(activeObj.fontSize || 18);
      const curColor = (typeof activeObj.fill === 'string' && activeObj.fill.startsWith('#')) ? activeObj.fill : '#0f172a';
      const isBold = (activeObj.fontWeight === 'bold' || activeObj.fontWeight > 600);
      const curAlign = activeObj.textAlign || 'left';

      bar.innerHTML = `
        <!-- AI Asistanı Sihirli Değnek -->
        <button onclick="triggerFloatingAiText()" class="px-2 py-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm transition" title="Yapay Zeka ile Metni Yeniden Yaz / Zenginleştir">
          <i class="ph ph-sparkle text-xs"></i>
          <span>AI</span>
        </button>

        <div class="h-4 w-px bg-slate-200"></div>

        <!-- Yazı Tipi Dropdown -->
        <select onchange="applyFloatingTextStyle('fontFamily', this.value)" class="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer max-w-[110px]" title="Yazı Tipi">
          <option value="Inter" ${curFont === 'Inter' ? 'selected' : ''}>Inter</option>
          <option value="'Playfair Display', serif" ${curFont.includes('Playfair') ? 'selected' : ''}>Playfair</option>
          <option value="'Cinzel', serif" ${curFont.includes('Cinzel') ? 'selected' : ''}>Cinzel</option>
          <option value="'Merriweather', serif" ${curFont.includes('Merriweather') ? 'selected' : ''}>Merriweather</option>
          <option value="'Plus Jakarta Sans', sans-serif" ${curFont.includes('Jakarta') ? 'selected' : ''}>Jakarta</option>
          <option value="'Caveat', cursive" ${curFont.includes('Caveat') ? 'selected' : ''}>El Yazısı</option>
        </select>

        <!-- Punto (- / +) -->
        <div class="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
          <button onclick="stepFloatingFontSize(-2)" class="w-5 h-5 rounded hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">-</button>
          <input type="number" min="8" max="144" value="${curSize}" onchange="applyFloatingTextStyle('fontSize', Number(this.value))" class="w-9 bg-transparent text-center font-bold text-xs text-slate-800 focus:outline-none">
          <button onclick="stepFloatingFontSize(2)" class="w-5 h-5 rounded hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">+</button>
        </div>

        <!-- Renk Kutusu -->
        <div class="relative w-6 h-6 rounded-lg border border-slate-300 overflow-hidden shrink-0 shadow-sm cursor-pointer" title="Metin Rengi">
          <input type="color" value="${curColor}" onchange="applyFloatingTextStyle('fill', this.value)" class="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0">
          <div class="w-full h-full" style="background-color: ${curColor}"></div>
        </div>

        <div class="h-4 w-px bg-slate-200"></div>

        <!-- Kalın (B) -->
        <button onclick="toggleFloatingTextBold()" class="w-7 h-7 rounded-lg ${isBold ? 'bg-blue-600 text-white font-extrabold shadow' : 'hover:bg-slate-100 text-slate-700 font-bold'} flex items-center justify-center text-xs transition" title="Kalın (Ctrl+B)">
          B
        </button>

        <!-- Paragraf Hizalama -->
        <button onclick="cycleFloatingTextAlign()" class="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-center text-sm transition" title="Hizalamayı Değiştir">
          <i class="ph ph-text-align-${curAlign === 'justify' ? 'justify' : (curAlign === 'right' ? 'right' : (curAlign === 'center' ? 'center' : 'left'))}"></i>
        </button>

        <!-- Harf Büyüklüğü (Aa) -->
        <button onclick="toggleFloatingTextCase()" class="px-1.5 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center transition" title="Büyük/Küçük Harf (Aa)">
          Aa
        </button>

        <!-- Bağlantı / Eylem Ata -->
        <button onclick="openFloatingLinkModal()" class="w-7 h-7 rounded-lg ${activeObj.actionType ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-100 text-slate-700'} flex items-center justify-center text-sm transition" title="Bağlantı & Etkileşim Ekle">
          <i class="ph ph-link"></i>
        </button>

        <!-- Sil Butonu -->
        <button onclick="deleteActiveFabricObject()" class="w-7 h-7 rounded-lg hover:bg-rose-50 text-rose-500 flex items-center justify-center text-sm transition" title="Sil (Delete)">
          <i class="ph ph-trash"></i>
        </button>
      `;
    }
    // GÖRSEL NESNESİ (image)
    else if (type === 'image') {
      const curOpacity = Math.round((activeObj.opacity !== undefined ? activeObj.opacity : 1) * 100);
      bar.innerHTML = `
        <span class="text-[11px] font-bold text-slate-500 px-1 flex items-center gap-1"><i class="ph ph-image"></i> Görsel</span>
        <div class="h-4 w-px bg-slate-200"></div>

        <button onclick="triggerCropActiveImage()" class="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition" title="Kırp">
          <i class="ph ph-crop"></i> Kırp
        </button>

        <label class="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition" title="Görseli Değiştir">
          <i class="ph ph-arrows-clockwise"></i> Değiştir
          <input type="file" accept="image/*" onchange="replaceActiveImageFile(event)" class="hidden">
        </label>

        <div class="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-xs" title="Saydamlık">
          <i class="ph ph-drop text-slate-400"></i>
          <input type="range" min="10" max="100" value="${curOpacity}" oninput="setFloatingImageOpacity(this.value)" class="w-16 accent-blue-600 cursor-pointer">
          <span class="font-mono text-[10px] w-6 text-right">${curOpacity}%</span>
        </div>

        <button onclick="openFloatingLinkModal()" class="w-7 h-7 rounded-lg ${activeObj.actionType ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-100 text-slate-700'} flex items-center justify-center text-sm transition" title="Bağlantı & Etkileşim Ekle">
          <i class="ph ph-link"></i>
        </button>

        <button onclick="toggleLockActiveObject()" class="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-center text-sm transition" title="${activeObj.lockMovementX ? 'Kilidi Aç' : 'Kilitle'}">
          <i class="ph ph-lock${activeObj.lockMovementX ? '-key' : ''}"></i>
        </button>

        <button onclick="deleteActiveFabricObject()" class="w-7 h-7 rounded-lg hover:bg-rose-50 text-rose-500 flex items-center justify-center text-sm transition" title="Sil (Delete)">
          <i class="ph ph-trash"></i>
        </button>
      `;
    }
    // ŞEKİL VEYA DİĞER NESNELER (rect, circle, triangle, line, button, hotspot)
    else {
      const curFill = (typeof activeObj.fill === 'string' && activeObj.fill.startsWith('#')) ? activeObj.fill : '#3b82f6';
      const curStroke = (typeof activeObj.stroke === 'string' && activeObj.stroke.startsWith('#')) ? activeObj.stroke : '#1d4ed8';
      const curWidth = activeObj.strokeWidth || 0;

      bar.innerHTML = `
        <span class="text-[11px] font-bold text-slate-500 px-1 flex items-center gap-1"><i class="ph ph-shapes"></i> Şekil</span>
        <div class="h-4 w-px bg-slate-200"></div>

        <!-- Dolgu Rengi -->
        <div class="flex items-center gap-1.5" title="Dolgu Rengi">
          <span class="text-[10px] text-slate-500 font-semibold">Dolgu:</span>
          <div class="relative w-6 h-6 rounded-lg border border-slate-300 overflow-hidden shadow-sm cursor-pointer">
            <input type="color" value="${curFill}" onchange="applyFloatingShapeStyle('fill', this.value)" class="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0">
            <div class="w-full h-full" style="background-color: ${curFill}"></div>
          </div>
        </div>

        <!-- Çizgi / Kenarlık Rengi -->
        <div class="flex items-center gap-1.5" title="Kenarlık Rengi">
          <span class="text-[10px] text-slate-500 font-semibold">Çizgi:</span>
          <div class="relative w-6 h-6 rounded-lg border border-slate-300 overflow-hidden shadow-sm cursor-pointer">
            <input type="color" value="${curStroke}" onchange="applyFloatingShapeStyle('stroke', this.value)" class="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0">
            <div class="w-full h-full" style="background-color: ${curStroke}"></div>
          </div>
        </div>

        <!-- Kenarlık Kalınlığı -->
        <div class="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 text-xs">
          <span class="text-[10px] text-slate-400">Kalınlık:</span>
          <input type="number" min="0" max="20" value="${curWidth}" onchange="applyFloatingShapeStyle('strokeWidth', Number(this.value))" class="w-8 bg-transparent text-center font-bold text-xs">
        </div>

        <button onclick="openFloatingLinkModal()" class="w-7 h-7 rounded-lg ${activeObj.actionType ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-100 text-slate-700'} flex items-center justify-center text-sm transition" title="Bağlantı & Etkileşim Ekle">
          <i class="ph ph-link"></i>
        </button>

        <button onclick="deleteActiveFabricObject()" class="w-7 h-7 rounded-lg hover:bg-rose-50 text-rose-500 flex items-center justify-center text-sm transition" title="Sil (Delete)">
          <i class="ph ph-trash"></i>
        </button>
      `;
    }
  }

  // YÜZEN BAR YARDIMCI İŞLEVLERİ
  window.applyFloatingTextStyle = function(prop, val) {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    active.set(prop, val);
    fCanvas.requestRenderAll();
    window.updateFloatingContextBar(fCanvas);
    if (typeof window.renderRightEditorPanel === 'function') window.renderRightEditorPanel();
    if (typeof window.triggerAutoSaveDebounced === 'function') window.triggerAutoSaveDebounced();
  };

  window.stepFloatingFontSize = function(delta) {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    const newSize = Math.max(8, Math.min(144, (active.fontSize || 18) + delta));
    active.set('fontSize', newSize);
    fCanvas.requestRenderAll();
    window.updateFloatingContextBar(fCanvas);
    if (typeof window.renderRightEditorPanel === 'function') window.renderRightEditorPanel();
  };

  window.toggleFloatingTextBold = function() {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    const isBold = (active.fontWeight === 'bold' || active.fontWeight > 600);
    active.set('fontWeight', isBold ? 'normal' : 'bold');
    fCanvas.requestRenderAll();
    window.updateFloatingContextBar(fCanvas);
  };

  window.cycleFloatingTextAlign = function() {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    const aligns = ['left', 'center', 'right', 'justify'];
    const cur = active.textAlign || 'left';
    const next = aligns[(aligns.indexOf(cur) + 1) % aligns.length];
    active.set('textAlign', next);
    fCanvas.requestRenderAll();
    window.updateFloatingContextBar(fCanvas);
  };

  window.toggleFloatingTextCase = function() {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active || !active.text) return;
    const t = active.text;
    if (t === t.toUpperCase()) {
      active.set('text', t.toLowerCase());
    } else if (t === t.toLowerCase()) {
      active.set('text', t.replace(/\b\w/g, l => l.toUpperCase()));
    } else {
      active.set('text', t.toUpperCase());
    }
    fCanvas.requestRenderAll();
    window.updateFloatingContextBar(fCanvas);
  };

  window.applyFloatingShapeStyle = function(prop, val) {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    active.set(prop, val);
    fCanvas.requestRenderAll();
    window.updateFloatingContextBar(fCanvas);
  };

  window.setFloatingImageOpacity = function(val) {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    active.set('opacity', Number(val) / 100);
    fCanvas.requestRenderAll();
    window.updateFloatingContextBar(fCanvas);
  };

  window.deleteActiveFabricObject = function() {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    fCanvas.remove(active);
    fCanvas.discardActiveObject();
    fCanvas.requestRenderAll();
    window.hideFloatingContextBar();
    if (typeof window.showToast === 'function') window.showToast('Nesne silindi');
  };

  window.toggleLockActiveObject = function() {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    const locked = !active.lockMovementX;
    active.set({
      lockMovementX: locked,
      lockMovementY: locked,
      lockRotation: locked,
      lockScalingX: locked,
      lockScalingY: locked,
      hasControls: !locked
    });
    fCanvas.requestRenderAll();
    window.updateFloatingContextBar(fCanvas);
    if (typeof window.showToast === 'function') window.showToast(locked ? 'Nesne kilitlendi 🔒' : 'Kilit açıldı 🔓');
  };

  window.openFloatingLinkModal = function() {
    if (typeof window.switchRightInspectorTab === 'function') {
      window.switchRightInspectorTab('actions');
    }
    if (typeof window.showToast === 'function') {
      window.showToast("Sağdaki 'Eylemler' sekmesinden bağlantı veya animasyon ekleyebilirsiniz");
    }
  };

  window.triggerFloatingAiText = function() {
    if (typeof window.openAiHelperModal === 'function') {
      window.openAiHelperModal();
    } else {
      alert("AI Asistanı: Seçili metin için yeni içerik üretme paneli açılıyor.");
    }
  };

  // 3. FLIPHTML5 SAYFA EKLEME MENÜSÜ & SEÇENEKLERİ
  window.toggleAddPageMenu = function(event) {
    if (event) event.stopPropagation();
    let menu = document.getElementById('addPageDropdownMenu');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'addPageDropdownMenu';
      menu.className = 'absolute left-3 top-14 w-60 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 select-none text-xs';
      menu.innerHTML = `
        <div class="px-3 py-1.5 text-[10px] font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 flex items-center gap-1.5">
          <i class="ph ph-plus-circle"></i> Sayfa Ekle
        </div>
        <button onclick="addSpreadPages(); closeAddPageMenu();" class="w-full px-3.5 py-2 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2.5 transition">
          <i class="ph ph-book-open text-base text-blue-400"></i>
          <div>
            <div class="text-white font-bold">Yeni İki Sayfa (Spread)</div>
            <div class="text-[10px] text-slate-400">Kitap görünümü çift sayfa ekler</div>
          </div>
        </button>
        <button onclick="addBlankPage(); closeAddPageMenu();" class="w-full px-3.5 py-2 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2.5 transition">
          <i class="ph ph-file-plus text-base text-emerald-400"></i>
          <div>
            <div class="text-white font-bold">Yeni Tek Sayfa</div>
            <div class="text-[10px] text-slate-400">Boş tek sayfa tuvali ekler</div>
          </div>
        </button>
        <div class="h-px bg-slate-800 my-1"></div>
        <label class="w-full px-3.5 py-2 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-2.5 cursor-pointer transition">
          <i class="ph ph-file-pdf text-base text-rose-400"></i>
          <div>
            <div class="text-white font-semibold">PDF Ekle</div>
            <div class="text-[10px] text-slate-400">PDF sayfalarını içeri aktarır</div>
          </div>
          <input type="file" accept="application/pdf" onchange="handlePdfImport(event); closeAddPageMenu();" class="hidden">
        </label>
        <label class="w-full px-3.5 py-2 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-2.5 cursor-pointer transition">
          <i class="ph ph-image text-base text-sky-400"></i>
          <div>
            <div class="text-white font-semibold">Resim Ekle (Sayfa Olarak)</div>
            <div class="text-[10px] text-slate-400">Görseli tam sayfa ekler</div>
          </div>
          <input type="file" accept="image/*" onchange="handleImageAsPage(event); closeAddPageMenu();" class="hidden">
        </label>
      `;
      const container = document.getElementById('leftPanel_pages') || document.body;
      container.style.position = 'relative';
      container.appendChild(menu);
    } else {
      menu.classList.toggle('hidden');
    }
  };

  window.closeAddPageMenu = function() {
    const menu = document.getElementById('addPageDropdownMenu');
    if (menu) menu.classList.add('hidden');
  };

  document.addEventListener('click', (e) => {
    const menu = document.getElementById('addPageDropdownMenu');
    if (menu && !menu.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });

  // 4. FLIPHTML5 TEMA RENKLERİ UYGULAYICI
  window.applyFlipThemeScheme = function(schemeId) {
    const sc = window.FLIP_V2_SCHEMES.find(s => s.id === schemeId);
    if (!sc) return;
    const mag = window.magazineData;
    if (!mag || !mag.pages) return;
    const pIdx = window.selectedEditIndex !== undefined ? window.selectedEditIndex : 0;
    const page = mag.pages[pIdx];
    if (!page) return;

    page.bgColor = sc.bgColor;
    page.accentColor = sc.titleColor;

    // Sayfadaki mevcut metinleri temaya uyarla
    if (page.elements && Array.isArray(page.elements)) {
      page.elements.forEach(el => {
        if (el.type === 'text' || el.type === 'card' || el.type === 'qbox') {
          if (el.isTitle || (el.fontSize && el.fontSize > 22)) {
            el.color = sc.titleColor;
          } else {
            el.color = sc.textColor;
          }
        }
      });
    }

    if (typeof window.renderAll === 'function') window.renderAll();
    if (typeof window.showToast === 'function') window.showToast(`'${sc.name}' renk şeması uygulandı!`);
  };

  // 5. YANIP SÖNEN HATIRLATICI (HOTSPOT BLINK EFFECT)
  window.toggleHotspotBlinking = function(enabled) {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    active.set('isHotspotBlinking', !!enabled);
    fCanvas.requestRenderAll();
    if (typeof window.showToast === 'function') {
      window.showToast(enabled ? "Yanıp sönen dikkat halkası aktif! ✨" : "Hatırlatıcı kapatıldı");
    }
  };

  console.log("✅ FlipHTML5 V2 UI Engine Hazır!");
})();
