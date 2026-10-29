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

  // 2. SABİT BAĞLAMSAL ÜST ARAÇ ŞERİDİ (TOP CONTEXTUAL TOOLBAR)
  window.updateTopContextBar = function(fCanvas) {
    const bar = document.getElementById('topContextBar');
    if (!bar) return;

    const canvas = fCanvas || window.activeFabricCanvas;
    const activeObj = canvas ? canvas.getActiveObject() : null;

    // Şablon içi seçimler (studio.js)
    const studioEl = (typeof selectedElementId !== 'undefined' && selectedElementId && window.magazineData?.pages?.[selectedEditIndex])
      ? (window.magazineData.pages[selectedEditIndex].elements || []).find(x => x.id === selectedElementId)
      : null;

    const inlineKey = (typeof activeInlineFieldKey !== 'undefined') ? activeInlineFieldKey : null;
    const inlineType = (typeof activeInlineType !== 'undefined') ? activeInlineType : null;

    renderTopContextBarContent(bar, activeObj, studioEl, inlineKey, inlineType, canvas);
  };

  // Geriye dönük uyumluluk aliasları (fabric-engine.js çağrıları için)
  window.updateFloatingContextBar = function(fCanvas) {
    window.updateTopContextBar(fCanvas);
  };

  window.hideFloatingContextBar = function() {
    window.updateTopContextBar(null);
  };

  
  function getTopBarControlsPrefix() {
    const isHeaderCollapsed = Boolean(window.isTopToolbarCollapsed);
    const isReadMode = (window.appMode === 'read');

    return `
      <div class="flex items-center gap-1.5 shrink-0 mr-1.5">
        ${isHeaderCollapsed ? `
          <button onclick="toggleTopToolbarCollapse(false)" class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-2xs cursor-pointer" title="Üst Menüyü Göster">
            <i class="ph ph-caret-down font-bold text-xs"></i>
            <span>Üst Menü</span>
          </button>
        ` : `
          <button onclick="toggleTopToolbarCollapse(true)" class="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-xs transition shrink-0 cursor-pointer" title="Üst Menüyü Gizle">
            <i class="ph ph-caret-up text-xs"></i>
          </button>
        `}

        ${isReadMode ? `
          <button onclick="setAppMode('edit')" class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-2xs cursor-pointer" title="Düzenleme Moduna Dön">
            <i class="ph ph-pencil-simple text-xs"></i>
            <span>Düzenle</span>
          </button>
        ` : ''}

        <div class="h-4 w-px bg-slate-200"></div>
      </div>
    `;
  }

  function renderTopContextBarContent(bar, activeObj, studioEl, inlineKey, inlineType, fCanvas) {
    // 1. FABRIC.JS NESNESİ SEÇİLİYSE
    if (activeObj) {
      const type = activeObj.type;

      // 1A. GÖRSEL (IMAGE)
      if (type === 'image') {
        const curOpacity = Math.round((activeObj.opacity !== undefined ? activeObj.opacity : 1) * 100);
        bar.innerHTML = `
          <div class="flex items-center gap-2 min-w-0">
            ${getTopBarControlsPrefix()}
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 font-bold text-xs flex items-center gap-1.5 shrink-0 border border-blue-200">
              <i class="ph ph-image text-sm"></i>
              <span>Görsel</span>
            </span>

            <div class="h-4 w-px bg-slate-200"></div>

            <button onclick="triggerCropActiveImage()" class="px-2.5 py-1 rounded-md hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shrink-0" title="Kırp">
              <i class="ph ph-crop text-sm text-blue-600"></i>
              <span>Kırp</span>
            </button>

            <label class="px-2.5 py-1 rounded-md hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shrink-0" title="Görseli Değiştir">
              <i class="ph ph-arrows-clockwise text-sm text-emerald-600"></i>
              <span>Değiştir</span>
              <input type="file" accept="image/*" onchange="replaceActiveImageFile(event)" class="hidden">
            </label>

            <div class="h-4 w-px bg-slate-200"></div>

            <!-- Saydamlık Slider -->
            <div class="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-xs shrink-0" title="Saydamlık">
              <i class="ph ph-drop text-slate-400"></i>
              <span class="text-slate-500 text-[11px] font-medium hidden sm:inline">Saydamlık:</span>
              <input type="range" min="10" max="100" value="${curOpacity}" oninput="setFloatingImageOpacity(this.value)" class="w-16 sm:w-20 accent-blue-600 cursor-pointer">
              <span class="font-mono text-[11px] font-bold text-slate-800 w-8 text-right">${curOpacity}%</span>
            </div>

            <!-- Yatay / Dikey Çevir -->
            <button onclick="flipActiveImage('x')" class="p-1 rounded-md hover:bg-slate-100 text-slate-700 text-xs transition shrink-0" title="Yatay Çevir (Ayna)">
              <i class="ph ph-flip-horizontal text-base"></i>
            </button>
            <button onclick="flipActiveImage('y')" class="p-1 rounded-md hover:bg-slate-100 text-slate-700 text-xs transition shrink-0" title="Dikey Çevir">
              <i class="ph ph-flip-vertical text-base"></i>
            </button>

            <div class="h-4 w-px bg-slate-200"></div>

            <!-- Bağlantı / Eylem -->
            <button onclick="openFloatingLinkModal()" class="px-2 py-1 rounded-md ${activeObj.actionType ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' : 'hover:bg-slate-100 text-slate-700 font-medium'} flex items-center gap-1 text-xs transition shrink-0" title="Bağlantı & Etkileşim Ata">
              <i class="ph ph-link text-sm"></i>
              <span class="hidden sm:inline">${activeObj.actionType ? 'Eylem: ' + activeObj.actionType : 'Bağlantı'}</span>
            </button>

            <!-- Kilitle / Aç -->
            <button onclick="toggleLockActiveObject()" class="p-1 rounded-md hover:bg-slate-100 text-slate-700 text-xs transition shrink-0" title="${activeObj.lockMovementX ? 'Kilidi Aç' : 'Kilitle'}">
              <i class="ph ph-lock${activeObj.lockMovementX ? '-key text-amber-600' : ''} text-base"></i>
            </button>

            <!-- Sil -->
            <button onclick="deleteActiveFabricObject()" class="p-1 rounded-md hover:bg-rose-50 text-rose-600 text-xs transition shrink-0" title="Sil (Delete)">
              <i class="ph ph-trash text-base"></i>
            </button>
          </div>

          <div class="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
            <span>G: ${Math.round(activeObj.getScaledWidth())}px</span>
            <span>•</span>
            <span>Y: ${Math.round(activeObj.getScaledHeight())}px</span>
          </div>
        `;
        return;
      }

      // 1B. METİN (TEXTBOX / I-TEXT)
      if (type === 'textbox' || type === 'i-text') {
        const curFont = activeObj.fontFamily || 'Inter';
        const curSize = Math.round(activeObj.fontSize || 18);
        const curColor = (typeof activeObj.fill === 'string' && activeObj.fill.startsWith('#')) ? activeObj.fill : '#0f172a';
        const isBold = (activeObj.fontWeight === 'bold' || activeObj.fontWeight > 600);
        const isItalic = activeObj.fontStyle === 'italic';
        const isUnderline = !!activeObj.underline;
        const curAlign = activeObj.textAlign || 'left';

        bar.innerHTML = `
          <div class="flex items-center gap-2 min-w-0">
            ${getTopBarControlsPrefix()}
            <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center gap-1.5 shrink-0 border border-indigo-200">
              <i class="ph ph-textbox text-sm"></i>
              <span>Metin</span>
            </span>

            <div class="h-4 w-px bg-slate-200"></div>

            <!-- AI Asistanı -->
            <button onclick="triggerFloatingAiText()" class="px-2.5 py-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-2xs transition shrink-0" title="Yapay Zeka ile Metni Yeniden Yaz / Zenginleştir">
              <i class="ph ph-sparkle text-xs"></i>
              <span>AI</span>
            </button>

            <div class="h-4 w-px bg-slate-200"></div>

            <!-- Font Family -->
            <select onchange="applyFloatingTextStyle('fontFamily', this.value)" class="bg-white border border-slate-300 text-slate-800 rounded-md px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer max-w-[120px] shrink-0">
              <option value="Inter" ${curFont === 'Inter' ? 'selected' : ''}>Inter</option>
              <option value="'Playfair Display', serif" ${curFont.includes('Playfair') ? 'selected' : ''}>Playfair Display</option>
              <option value="'Cinzel', serif" ${curFont.includes('Cinzel') ? 'selected' : ''}>Cinzel</option>
              <option value="'Merriweather', serif" ${curFont.includes('Merriweather') ? 'selected' : ''}>Merriweather</option>
              <option value="'Plus Jakarta Sans', sans-serif" ${curFont.includes('Jakarta') ? 'selected' : ''}>Jakarta Sans</option>
              <option value="'Caveat', cursive" ${curFont.includes('Caveat') ? 'selected' : ''}>El Yazısı</option>
              <option value="'Montserrat', sans-serif" ${curFont.includes('Montserrat') ? 'selected' : ''}>Montserrat</option>
              <option value="'Roboto', sans-serif" ${curFont.includes('Roboto') ? 'selected' : ''}>Roboto</option>
            </select>

            <!-- Punto (- / +) -->
            <div class="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0">
              <button onclick="stepFloatingFontSize(-2)" class="w-5 h-5 rounded hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">-</button>
              <input type="number" min="8" max="144" value="${curSize}" onchange="applyFloatingTextStyle('fontSize', Number(this.value))" class="w-9 bg-transparent text-center font-bold text-xs text-slate-800 focus:outline-none">
              <button onclick="stepFloatingFontSize(2)" class="w-5 h-5 rounded hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">+</button>
            </div>

            <!-- Renk -->
            <div class="relative w-6 h-6 rounded-md border border-slate-300 overflow-hidden shrink-0 shadow-2xs cursor-pointer" title="Yazı Rengi">
              <input type="color" value="${curColor}" onchange="applyFloatingTextStyle('fill', this.value)" class="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0">
              <div class="w-full h-full" style="background-color: ${curColor}"></div>
            </div>

            <div class="h-4 w-px bg-slate-200"></div>

            <!-- B, I, U, Aa -->
            <button onclick="toggleFloatingTextBold()" class="w-7 h-7 rounded-md ${isBold ? 'bg-blue-600 text-white font-extrabold shadow-2xs' : 'hover:bg-slate-100 text-slate-700 font-bold'} flex items-center justify-center text-xs transition shrink-0" title="Kalın (B)">B</button>
            <button onclick="toggleFloatingTextItalic()" class="w-7 h-7 rounded-md ${isItalic ? 'bg-blue-600 text-white font-extrabold shadow-2xs italic' : 'hover:bg-slate-100 text-slate-700 italic font-serif'} flex items-center justify-center text-xs transition shrink-0" title="İtalik (I)">I</button>
            <button onclick="toggleFloatingTextUnderline()" class="w-7 h-7 rounded-md ${isUnderline ? 'bg-blue-600 text-white font-extrabold shadow-2xs underline' : 'hover:bg-slate-100 text-slate-700 underline'} flex items-center justify-center text-xs transition shrink-0" title="Altı Çizili (U)">U</button>
            <button onclick="toggleFloatingTextCase()" class="px-1.5 h-7 rounded-md hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center transition shrink-0" title="Büyük/Küçük Harf (Aa)">Aa</button>

            <!-- Hizalama -->
            <button onclick="cycleFloatingTextAlign()" class="w-7 h-7 rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-center text-sm transition shrink-0" title="Hizalamayı Değiştir">
              <i class="ph ph-text-align-${curAlign === 'justify' ? 'justify' : (curAlign === 'right' ? 'right' : (curAlign === 'center' ? 'center' : 'left'))}"></i>
            </button>

            <div class="h-4 w-px bg-slate-200"></div>

            <!-- Bağlantı -->
            <button onclick="openFloatingLinkModal()" class="w-7 h-7 rounded-md ${activeObj.actionType ? 'bg-amber-100 text-amber-800' : 'hover:bg-slate-100 text-slate-700'} flex items-center justify-center text-sm transition shrink-0" title="Bağlantı & Etkileşim">
              <i class="ph ph-link"></i>
            </button>

            <!-- Sil -->
            <button onclick="deleteActiveFabricObject()" class="w-7 h-7 rounded-md hover:bg-rose-50 text-rose-600 flex items-center justify-center text-sm transition shrink-0" title="Sil (Delete)">
              <i class="ph ph-trash"></i>
            </button>
          </div>

          <div class="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
            <span>${activeObj.text?.length || 0} karakter</span>
          </div>
        `;
        return;
      }

      // 1C. ŞEKİL VEYA DİĞER NESNELER
      const curFill = (typeof activeObj.fill === 'string' && activeObj.fill.startsWith('#')) ? activeObj.fill : '#0284c7';
      const curStroke = (typeof activeObj.stroke === 'string' && activeObj.stroke.startsWith('#')) ? activeObj.stroke : '#0369a1';
      const curWidth = activeObj.strokeWidth || 0;

      bar.innerHTML = `
        <div class="flex items-center gap-2 min-w-0">
          ${getTopBarControlsPrefix()}
          <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-xs flex items-center gap-1.5 shrink-0 border border-amber-200">
            <i class="ph ph-shapes text-sm"></i>
            <span>Şekil</span>
          </span>

          <div class="h-4 w-px bg-slate-200"></div>

          <!-- Dolgu Rengi -->
          <div class="flex items-center gap-1.5 shrink-0" title="Dolgu Rengi">
            <span class="text-[11px] text-slate-600 font-medium">Dolgu:</span>
            <div class="relative w-6 h-6 rounded-md border border-slate-300 overflow-hidden shadow-2xs cursor-pointer">
              <input type="color" value="${curFill}" onchange="applyFloatingShapeStyle('fill', this.value)" class="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0">
              <div class="w-full h-full" style="background-color: ${curFill}"></div>
            </div>
          </div>

          <!-- Çizgi / Kenarlık Rengi -->
          <div class="flex items-center gap-1.5 shrink-0" title="Kenarlık Rengi">
            <span class="text-[11px] text-slate-600 font-medium">Çizgi:</span>
            <div class="relative w-6 h-6 rounded-md border border-slate-300 overflow-hidden shadow-2xs cursor-pointer">
              <input type="color" value="${curStroke}" onchange="applyFloatingShapeStyle('stroke', this.value)" class="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0">
              <div class="w-full h-full" style="background-color: ${curStroke}"></div>
            </div>
          </div>

          <!-- Kenarlık Kalınlığı -->
          <div class="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 text-xs shrink-0">
            <span class="text-[11px] text-slate-500">Kalınlık:</span>
            <input type="number" min="0" max="20" value="${curWidth}" onchange="applyFloatingShapeStyle('strokeWidth', Number(this.value))" class="w-8 bg-transparent text-center font-bold text-xs">
          </div>

          <div class="h-4 w-px bg-slate-200"></div>

          <!-- Bağlantı -->
          <button onclick="openFloatingLinkModal()" class="w-7 h-7 rounded-md ${activeObj.actionType ? 'bg-amber-100 text-amber-800' : 'hover:bg-slate-100 text-slate-700'} flex items-center justify-center text-sm transition shrink-0" title="Bağlantı & Etkileşim">
            <i class="ph ph-link"></i>
          </button>

          <!-- Sil -->
          <button onclick="deleteActiveFabricObject()" class="w-7 h-7 rounded-md hover:bg-rose-50 text-rose-600 flex items-center justify-center text-sm transition shrink-0" title="Sil (Delete)">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      `;
      return;
    }

    // 2. ŞABLON İÇİ BİR METİN VEYA GÖRSEL SEÇİLİYSE (activeInlineFieldKey)
    if (inlineKey) {
      if (inlineType === 'image') {
        bar.innerHTML = `
          <div class="flex items-center gap-2 min-w-0">
            ${getTopBarControlsPrefix()}
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 font-bold text-xs flex items-center gap-1.5 shrink-0 border border-blue-200">
              <i class="ph ph-image text-sm"></i>
              <span>Şablon Fotoğrafı</span>
            </span>

            <div class="h-4 w-px bg-slate-200"></div>

            <label class="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shrink-0 shadow-2xs">
              <i class="ph ph-camera text-sm"></i>
              <span>Fotoğraf Yükle</span>
              <input type="file" accept="image/*" onchange="uploadTemplateImageInline(event, ${selectedEditIndex}, '${inlineKey}')" class="hidden">
            </label>

            <button onclick="resetInlineFieldTransform()" class="px-2.5 py-1 rounded-md hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition shrink-0" title="Varsayılan Boyut ve Konuma Sıfırla">
              <i class="ph ph-arrow-counter-clockwise"></i>
              <span>Sıfırla</span>
            </button>
          </div>
        `;
        return;
      }

      bar.innerHTML = `
        <div class="flex items-center gap-2 min-w-0">
          ${getTopBarControlsPrefix()}
          <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center gap-1.5 shrink-0 border border-indigo-200">
            <i class="ph ph-textbox text-sm"></i>
            <span>Şablon Metin Kutusu</span>
          </span>

          <div class="h-4 w-px bg-slate-200"></div>

          <span class="text-slate-500 text-[11px]">Metni düzenlemek için sağdaki <strong>Ayarlar</strong> panelini kullanabilirsiniz.</span>
          <button onclick="resetInlineFieldTransform()" class="px-2 py-0.5 rounded-md hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition shrink-0">
            <i class="ph ph-arrow-counter-clockwise"></i> Sıfırla
          </button>
        </div>
      `;
      return;
    }

    // 3. HİÇBİR NESNE SEÇİLİ DEĞİLSE -> SAYFA MODU & GENEL ARAÇLAR
    const curPIdx = (typeof selectedEditIndex !== 'undefined') ? selectedEditIndex : 0;
    const page = window.magazineData?.pages?.[curPIdx];
    const totalPages = window.magazineData?.pages?.length || 1;
    const curBg = page?.bgColor || '#ffffff';

    bar.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0">
        ${getTopBarControlsPrefix()}
        <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shrink-0 border border-slate-200">
          <i class="ph ph-file-text text-sm text-blue-600"></i>
          <span>Sayfa ${curPIdx + 1} / ${totalPages}</span>
        </span>

        <div class="h-4 w-px bg-slate-200"></div>

        <span class="text-slate-500 text-[11px] hidden sm:inline">Ebat:</span>
        <span class="font-mono text-slate-700 font-semibold text-xs shrink-0">${magazineData?.pageWidth || 794} × ${magazineData?.pageHeight || 1123} px</span>

        <div class="h-4 w-px bg-slate-200"></div>

        <!-- Arka Plan Rengi -->
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="text-slate-500 text-[11px] font-medium hidden md:inline">Arka Plan:</span>
          <div class="relative w-5 h-5 rounded-md border border-slate-300 overflow-hidden shadow-2xs cursor-pointer">
            <input type="color" value="${curBg}" onchange="updatePageField('bgColor', this.value)" class="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0">
            <div class="w-full h-full" style="background-color: ${curBg}"></div>
          </div>
          <button onclick="applyBackgroundToAllPages()" class="text-[10.5px] text-blue-600 hover:text-blue-800 font-semibold hover:underline hidden md:inline">Tümüne Uygula</button>
        </div>

        <div class="h-4 w-px bg-slate-200 hidden md:block"></div>

        <button onclick="openAllTemplatesModal()" class="px-2 py-1 rounded-md hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition shrink-0">
          <i class="ph ph-layout text-amber-600"></i>
          <span class="hidden lg:inline">Şablon Galerisi</span>
        </button>

        <button onclick="addBlankPage()" class="px-2 py-1 rounded-md hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition shrink-0">
          <i class="ph ph-plus text-blue-600"></i>
          <span class="hidden lg:inline">+ Boş Sayfa</span>
        </button>
      </div>

      <!-- Sağ Kısayollar -->
      <div class="flex items-center gap-1 shrink-0">
        <button onclick="undoAction()" class="p-1 rounded-md hover:bg-slate-100 text-slate-600 text-xs transition" title="Geri Al (Ctrl+Z)"><i class="ph ph-arrow-u-up-left text-base"></i></button>
        <button onclick="redoAction()" class="p-1 rounded-md hover:bg-slate-100 text-slate-600 text-xs transition" title="Yinele (Ctrl+Y)"><i class="ph ph-arrow-u-up-right text-base"></i></button>
        <button onclick="toggleGridOverlay()" class="p-1 rounded-md hover:bg-slate-100 text-slate-600 text-xs transition" title="Izgara & Kılavuzlar"><i class="ph ph-columns text-base"></i></button>
        <button onclick="toggleLayersPopover()" class="p-1 rounded-md hover:bg-slate-100 text-slate-600 text-xs transition" title="Katmanlar"><i class="ph ph-stack text-base"></i></button>
      </div>
    `;
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

  // 6. BAŞLIK DÜZENLEME (INLINE TITLE EDIT)
  window.editMagazineTitleInline = function() {
    const el = document.getElementById('magazineTitleDisplay');
    const currentTitle = (window.magazineData?.title || el?.textContent || '').trim();
    const newTitle = prompt('Dergi / Belge Başlığını Düzenleyin:', currentTitle);
    if (newTitle !== null && newTitle.trim() !== '') {
      if (window.magazineData) {
        window.magazineData.title = newTitle.trim();
      }
      if (el) el.textContent = newTitle.trim();
      if (typeof window.saveAllChangesToServer === 'function') {
        window.saveAllChangesToServer();
      }
      if (typeof window.showToast === 'function') {
        window.showToast('Belge başlığı güncellendi: ' + newTitle.trim());
      }
    }
  };

  console.log("✅ FlipHTML5 V2 UI Engine Modülleri Yüklendi!");

  // Görsel Çevirme (Flip X / Y)
  window.flipActiveImage = function(axis) {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    if (axis === 'x') active.set('flipX', !active.flipX);
    if (axis === 'y') active.set('flipY', !active.flipY);
    fCanvas.requestRenderAll();
    window.updateTopContextBar(fCanvas);
  };

  window.toggleFloatingTextItalic = function() {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    const isItalic = active.fontStyle === 'italic';
    active.set('fontStyle', isItalic ? 'normal' : 'italic');
    fCanvas.requestRenderAll();
    window.updateTopContextBar(fCanvas);
  };

  window.toggleFloatingTextUnderline = function() {
    const fCanvas = window.activeFabricCanvas;
    if (!fCanvas) return;
    const active = fCanvas.getActiveObject();
    if (!active) return;
    active.set('underline', !active.underline);
    fCanvas.requestRenderAll();
    window.updateTopContextBar(fCanvas);
  };

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (typeof window.updateTopContextBar === 'function') {
        window.updateTopContextBar();
      }
    }, 200);
  });

  
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key === '\\') || (e.key === 'Escape' && window.isTopToolbarCollapsed)) {
      if (typeof window.toggleTopToolbarCollapse === 'function') {
        window.toggleTopToolbarCollapse(false);
      }
    }
  });

  console.log('✅ FlipHTML5 V2 Top Context Bar Hazır!');
})();
