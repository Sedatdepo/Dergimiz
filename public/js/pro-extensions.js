/**
 * ============================================================================
 * DERGİMİZ PROFESYONEL EDİTÖR UZANTILARI (FAZ 6 – FAZ 9)
 * ----------------------------------------------------------------------------
 * Faz 6: Canva Tarzı Fotoğraf/Video Izgaraları (16 Düzen) & Akıllı Çerçeveler (4 Kategori)
 * Faz 7: İçindekiler Penceresinden (#tocModal) Canlı Sayfa & Fihrist Yönetimi (Çift Yönlü)
 * Faz 8: Görsel Şemalı (Mini-Wireframe SVG) Kompakt Akıllı Mizanpaj Seçici
 * Faz 9: Seçili Öğe Odaklı Akıllı AI Mimarisi (Ana Motor: DeepSeek + Görsel: Gemini Vision)
 * ============================================================================
 */

// ============================================================================
// FAZ 6: CANVA YER TUTUCU DESENİ, 16 FOTOĞRAF IZGARASI VE 4 KATEGORİ ÇERÇEVE
// ============================================================================
const CANVA_LANDSCAPE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#skyGrad)"/>
  <circle cx="95" cy="78" r="26" fill="#fef08a" opacity="0.9"/>
  <g fill="#ffffff" opacity="0.95">
    <circle cx="255" cy="82" r="22"/>
    <circle cx="280" cy="74" r="28"/>
    <circle cx="308" cy="84" r="20"/>
    <rect x="250" y="82" width="62" height="22" rx="10"/>
  </g>
  <path d="M-20 300 Q110 170 250 260 T420 220 L420 300 Z" fill="#86efac"/>
  <path d="M120 300 Q275 165 420 245 L420 300 Z" fill="#22c55e" opacity="0.85"/>
</svg>`;

const CANVA_PLACEHOLDER_URL = 'data:image/svg+xml;utf8,' + encodeURIComponent(CANVA_LANDSCAPE_SVG);

window.CANVA_PHOTO_GRIDS = [
  {
    id: 'grid_1x1',
    name: 'Tam Kare (1×1)',
    cells: [{ x: 0, y: 0, w: 1, h: 1 }]
  },
  {
    id: 'grid_2col',
    name: 'Dikey İkili (50/50)',
    cells: [
      { x: 0, y: 0, w: 0.485, h: 1 },
      { x: 0.515, y: 0, w: 0.485, h: 1 }
    ]
  },
  {
    id: 'grid_2row',
    name: 'Yatay İkili (Üst/Alt)',
    cells: [
      { x: 0, y: 0, w: 1, h: 0.485 },
      { x: 0, y: 0.515, w: 1, h: 0.485 }
    ]
  },
  {
    id: 'grid_asym_70_30',
    name: 'Asimetrik İkili (70/30)',
    cells: [
      { x: 0, y: 0, w: 0.66, h: 1 },
      { x: 0.69, y: 0, w: 0.31, h: 1 }
    ]
  },
  {
    id: 'grid_1top_2bot',
    name: '1 Üst + 2 Alt',
    cells: [
      { x: 0, y: 0, w: 1, h: 0.54 },
      { x: 0, y: 0.57, w: 0.485, h: 0.43 },
      { x: 0.515, y: 0.57, w: 0.485, h: 0.43 }
    ]
  },
  {
    id: 'grid_2top_1bot',
    name: '2 Üst + 1 Alt',
    cells: [
      { x: 0, y: 0, w: 0.485, h: 0.43 },
      { x: 0.515, y: 0, w: 0.485, h: 0.43 },
      { x: 0, y: 0.46, w: 1, h: 0.54 }
    ]
  },
  {
    id: 'grid_1left_2right',
    name: '1 Sol + 2 Sağ',
    cells: [
      { x: 0, y: 0, w: 0.54, h: 1 },
      { x: 0.57, y: 0, w: 0.43, h: 0.485 },
      { x: 0.57, y: 0.515, w: 0.43, h: 0.485 }
    ]
  },
  {
    id: 'grid_2left_1right',
    name: '2 Sol + 1 Sağ',
    cells: [
      { x: 0, y: 0, w: 0.43, h: 0.485 },
      { x: 0, y: 0.515, w: 0.43, h: 0.485 },
      { x: 0.46, y: 0, w: 0.54, h: 1 }
    ]
  },
  {
    id: 'grid_3col',
    name: '3 Dikey Sütun',
    cells: [
      { x: 0, y: 0, w: 0.315, h: 1 },
      { x: 0.342, y: 0, w: 0.315, h: 1 },
      { x: 0.685, y: 0, w: 0.315, h: 1 }
    ]
  },
  {
    id: 'grid_3row',
    name: '3 Yatay Şerit',
    cells: [
      { x: 0, y: 0, w: 1, h: 0.315 },
      { x: 0, y: 0.342, w: 1, h: 0.315 },
      { x: 0, y: 0.685, w: 1, h: 0.315 }
    ]
  },
  {
    id: 'grid_2x2',
    name: '2×2 Dörtlü Kutu',
    cells: [
      { x: 0, y: 0, w: 0.485, h: 0.485 },
      { x: 0.515, y: 0, w: 0.485, h: 0.485 },
      { x: 0, y: 0.515, w: 0.485, h: 0.485 },
      { x: 0.515, y: 0.515, w: 0.485, h: 0.485 }
    ]
  },
  {
    id: 'grid_1left_3right',
    name: '1 Sol + 3 Sağ',
    cells: [
      { x: 0, y: 0, w: 0.58, h: 1 },
      { x: 0.61, y: 0, w: 0.39, h: 0.315 },
      { x: 0.61, y: 0.342, w: 0.39, h: 0.315 },
      { x: 0.61, y: 0.685, w: 0.39, h: 0.315 }
    ]
  },
  {
    id: 'grid_1top_3bot',
    name: '1 Üst + 3 Alt',
    cells: [
      { x: 0, y: 0, w: 1, h: 0.58 },
      { x: 0, y: 0.61, w: 0.315, h: 0.39 },
      { x: 0.342, y: 0.61, w: 0.315, h: 0.39 },
      { x: 0.685, y: 0.61, w: 0.315, h: 0.39 }
    ]
  },
  {
    id: 'grid_mosaic_5',
    name: '5\'li Mozaik Kolaj',
    cells: [
      { x: 0, y: 0, w: 0.58, h: 0.58 },
      { x: 0.61, y: 0, w: 0.39, h: 0.58 },
      { x: 0, y: 0.61, w: 0.315, h: 0.39 },
      { x: 0.342, y: 0.61, w: 0.315, h: 0.39 },
      { x: 0.685, y: 0.61, w: 0.315, h: 0.39 }
    ]
  },
  {
    id: 'grid_2x3',
    name: '2×3 Altılı Galeri',
    cells: [
      { x: 0, y: 0, w: 0.485, h: 0.315 },
      { x: 0.515, y: 0, w: 0.485, h: 0.315 },
      { x: 0, y: 0.342, w: 0.485, h: 0.315 },
      { x: 0.515, y: 0.342, w: 0.485, h: 0.315 },
      { x: 0, y: 0.685, w: 0.485, h: 0.315 },
      { x: 0.515, y: 0.685, w: 0.485, h: 0.315 }
    ]
  },
  {
    id: 'grid_3x3',
    name: '3×3 Dokuzlu Vitrin',
    cells: [
      { x: 0, y: 0, w: 0.315, h: 0.315 },
      { x: 0.342, y: 0, w: 0.315, h: 0.315 },
      { x: 0.685, y: 0, w: 0.315, h: 0.315 },
      { x: 0, y: 0.342, w: 0.315, h: 0.315 },
      { x: 0.342, y: 0.342, w: 0.315, h: 0.315 },
      { x: 0.685, y: 0.342, w: 0.315, h: 0.315 },
      { x: 0, y: 0.685, w: 0.315, h: 0.315 },
      { x: 0.342, y: 0.685, w: 0.315, h: 0.315 },
      { x: 0.685, y: 0.685, w: 0.315, h: 0.315 }
    ]
  }
];

function renderGridMiniSvg(cells) {
  const rects = cells.map(c => {
    const rx = Math.round(c.x * 56) + 2;
    const ry = Math.round(c.y * 56) + 2;
    const rw = Math.max(4, Math.round(c.w * 56));
    const rh = Math.max(4, Math.round(c.h * 56));
    return `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="2" fill="#38bdf8" fill-opacity="0.32" stroke="#7dd3fc" stroke-width="1"/>`;
  }).join('');
  return `<svg viewBox="0 0 60 60" class="w-11 h-11 mx-auto">${rects}</svg>`;
}

// Izgarayı Aktif Sayfaya Yerleştirme
window.insertCanvaPhotoGrid = function(gridId) {
  const fCanvas = getCurrentFabricCanvas();
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!fCanvas || !page) return;
  if (!canUserEditPage(page)) {
    showToast('Bu sayfada düzenleme yetkiniz yok.');
    return;
  }

  const gridDef = window.CANVA_PHOTO_GRIDS.find(g => g.id === gridId) || window.CANVA_PHOTO_GRIDS[0];
  const baseLeft = 42;
  const baseTop = 125;
  const totalW = 466;
  const totalH = 480;

  let remaining = gridDef.cells.length;
  let lastImg = null;

  gridDef.cells.forEach((cell, idx) => {
    const cx = Math.round(baseLeft + cell.x * totalW);
    const cy = Math.round(baseTop + cell.y * totalH);
    const cw = Math.round(cell.w * totalW);
    const ch = Math.round(cell.h * totalH);

    loadFabricImageIntoSlot(fCanvas, CANVA_PLACEHOLDER_URL, CANVA_PLACEHOLDER_URL, {
      name: `${gridDef.name} • Hücre ${idx + 1}`,
      left: cx,
      top: cy,
      width: cw,
      height: ch,
      radius: 10,
      stroke: '#bae6fd',
      strokeWidth: 1.5,
      shadow: true
    }, (imgObj) => {
      if (imgObj) {
        imgObj.isGridSlot = true;
        lastImg = imgObj;
      }
      remaining--;
      if (remaining <= 0) {
        if (lastImg) fCanvas.setActiveObject(lastImg);
        fCanvas.requestRenderAll();
        saveFabricPageState(selectedEditIndex);
        pushFabricHistory(selectedEditIndex);
        renderRightEditorPanel();
        showToast(`🖼️ "${gridDef.name}" eklendi! Hücreye tıklayıp fotoğraf yükleyebilirsiniz.`);
      }
    });
  });
};

// Kategorili Akıllı Çerçeve Ekleme (Temel Şekiller, Film/Polaroid, Cihazlar, Kağıt/Dekoratif)
window.insertCanvaSmartFrame = function(frameKind) {
  const fCanvas = getCurrentFabricCanvas();
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!fCanvas || !page) return;
  if (!canUserEditPage(page)) {
    showToast('Bu sayfada düzenleme yetkiniz yok.');
    return;
  }

  // 1. Temel Şekil Çerçeveleri (Doğrudan Maskeli Görsel Yuvası)
  const basicShapeMasks = {
    square: { name: 'Kare Çerçeve', mask: 'none', radius: 4, w: 230, h: 230 },
    rounded: { name: 'Yuvarlatılmış Çerçeve', mask: 'rounded', radius: 36, w: 230, h: 230 },
    circle: { name: 'Tam Daire Çerçeve', mask: 'circle', radius: 0, w: 230, h: 230 },
    arch: { name: 'Kemer (Arch) Çerçeve', mask: 'arch', radius: 0, w: 220, h: 270 },
    triangle: { name: 'Üçgen Çerçeve', mask: 'triangle', radius: 0, w: 240, h: 220 },
    diamond: { name: 'Elmas Çerçeve', mask: 'diamond', radius: 0, w: 230, h: 230 },
    hexagon: { name: 'Altıgen Çerçeve', mask: 'hexagon', radius: 0, w: 230, h: 230 },
    octagon: { name: 'Sekizgen Çerçeve', mask: 'octagon', radius: 0, w: 230, h: 230 },
    star: { name: 'Yıldız Çerçeve', mask: 'star', radius: 0, w: 240, h: 240 }
  };

  if (basicShapeMasks[frameKind]) {
    const cfg = basicShapeMasks[frameKind];
    loadFabricImageIntoSlot(fCanvas, CANVA_PLACEHOLDER_URL, CANVA_PLACEHOLDER_URL, {
      name: cfg.name,
      left: 160,
      top: 190,
      width: cfg.w,
      height: cfg.h,
      radius: cfg.radius,
      maskType: cfg.mask,
      shadow: true
    }, (img) => {
      if (img) {
        fCanvas.setActiveObject(img);
        fCanvas.requestRenderAll();
        saveFabricPageState(selectedEditIndex);
        pushFabricHistory(selectedEditIndex);
        renderRightEditorPanel();
        showToast(`✨ ${cfg.name} eklendi! Sağ panelden içine fotoğraf yükleyin.`);
      }
    });
    return;
  }

  // 2. Film ve Fotoğraf Çerçeveleri (Polaroid, Film Şeridi, Galeri)
  if (frameKind === 'polaroid') {
    addFabRect(fCanvas, {
      name: 'Polaroid Dış Kartı', left: 150, top: 165, width: 250, height: 310, rx: 10,
      fill: '#ffffff', stroke: '#cbd5e1', strokeWidth: 1.5, shadow: true
    });
    loadFabricImageIntoSlot(fCanvas, CANVA_PLACEHOLDER_URL, CANVA_PLACEHOLDER_URL, {
      name: 'Polaroid Fotoğraf Yuvası', left: 166, top: 181, width: 218, height: 228, radius: 4
    }, (img) => {
      addFabText(fCanvas, 'Anı Notu / Fotoğraf Açıklaması', {
        name: 'Polaroid Alt Yazısı', left: 166, top: 424, width: 218, fontSize: 13, fontFamily: 'Caveat', fontWeight: 'bold', textAlign: 'center', fill: '#334155'
      });
      if (img) fCanvas.setActiveObject(img);
      fCanvas.requestRenderAll();
      saveFabricPageState(selectedEditIndex);
      pushFabricHistory(selectedEditIndex);
      renderRightEditorPanel();
      showToast('📸 Polaroid Çerçevesi eklendi!');
    });
    return;
  }

  if (frameKind === 'filmstrip') {
    addFabRect(fCanvas, {
      name: 'Sinema Film Şeridi Gövdesi', left: 165, top: 110, width: 220, height: 520, rx: 8,
      fill: '#0f172a', stroke: '#334155', strokeWidth: 2, shadow: true
    });
    // Sol ve sağ film delikleri
    for (let i = 0; i < 12; i++) {
      const hy = 124 + i * 42;
      addFabRect(fCanvas, { name: 'Film Deliği Sol', left: 173, top: hy, width: 10, height: 18, rx: 2, fill: '#f8fafc' });
      addFabRect(fCanvas, { name: 'Film Deliği Sağ', left: 367, top: hy, width: 10, height: 18, rx: 2, fill: '#f8fafc' });
    }
    let rem = 3;
    for (let k = 0; k < 3; k++) {
      loadFabricImageIntoSlot(fCanvas, CANVA_PLACEHOLDER_URL, CANVA_PLACEHOLDER_URL, {
        name: `Film Karesi ${k + 1}`, left: 194, top: 126 + k * 164, width: 162, height: 146, radius: 4
      }, (img) => {
        rem--;
        if (rem <= 0) {
          if (img) fCanvas.setActiveObject(img);
          fCanvas.requestRenderAll();
          saveFabricPageState(selectedEditIndex);
          pushFabricHistory(selectedEditIndex);
          renderRightEditorPanel();
          showToast('🎞️ 3 Kareli Sinema Film Şeridi eklendi!');
        }
      });
    }
    return;
  }

  // 3. Cihaz Çerçeveleri (Telefon, Masaüstü Bilgisayar, Tablet, Laptop)
  if (frameKind === 'phone') {
    addFabRect(fCanvas, {
      name: 'Akıllı Telefon Gövdesi', left: 175, top: 140, width: 200, height: 400, rx: 32,
      fill: '#0f172a', stroke: '#475569', strokeWidth: 4, shadow: true
    });
    loadFabricImageIntoSlot(fCanvas, CANVA_PLACEHOLDER_URL, CANVA_PLACEHOLDER_URL, {
      name: 'Telefon Ekran Görseli', left: 187, top: 162, width: 176, height: 356, radius: 22
    }, (img) => {
      addFabRect(fCanvas, { name: 'Telefon Kamera Çentiği', left: 245, top: 148, width: 60, height: 8, rx: 4, fill: '#334155' });
      if (img) fCanvas.setActiveObject(img);
      fCanvas.requestRenderAll();
      saveFabricPageState(selectedEditIndex);
      pushFabricHistory(selectedEditIndex);
      renderRightEditorPanel();
      showToast('📱 Akıllı Telefon Çerçevesi eklendi!');
    });
    return;
  }

  if (frameKind === 'monitor' || frameKind === 'laptop') {
    const isLap = frameKind === 'laptop';
    addFabRect(fCanvas, {
      name: isLap ? 'Laptop Ekran Gövdesi' : 'Bilgisayar Monitör Gövdesi',
      left: 95, top: 190, width: 360, height: 240, rx: 14,
      fill: '#0f172a', stroke: '#475569', strokeWidth: 3, shadow: true
    });
    if (isLap) {
      addFabRect(fCanvas, { name: 'Laptop Alt Klavye Tabanı', left: 65, top: 430, width: 420, height: 16, rx: 6, fill: '#94a3b8' });
    } else {
      addFabRect(fCanvas, { name: 'Monitör Ayağı', left: 245, top: 430, width: 60, height: 42, fill: '#64748b' });
      addFabRect(fCanvas, { name: 'Monitör Tabanı', left: 205, top: 470, width: 140, height: 10, rx: 5, fill: '#475569' });
    }
    loadFabricImageIntoSlot(fCanvas, CANVA_PLACEHOLDER_URL, CANVA_PLACEHOLDER_URL, {
      name: isLap ? 'Laptop Ekran Görseli' : 'Monitör Ekran Görseli',
      left: 109, top: 204, width: 332, height: 206, radius: 6
    }, (img) => {
      if (img) fCanvas.setActiveObject(img);
      fCanvas.requestRenderAll();
      saveFabricPageState(selectedEditIndex);
      pushFabricHistory(selectedEditIndex);
      renderRightEditorPanel();
      showToast(`💻 ${isLap ? 'Dizüstü Bilgisayar' : 'Masaüstü Monitör'} Çerçevesi eklendi!`);
    });
    return;
  }

  if (frameKind === 'tablet') {
    addFabRect(fCanvas, {
      name: 'Tablet Gövdesi', left: 135, top: 165, width: 280, height: 370, rx: 24,
      fill: '#1e293b', stroke: '#64748b', strokeWidth: 3, shadow: true
    });
    loadFabricImageIntoSlot(fCanvas, CANVA_PLACEHOLDER_URL, CANVA_PLACEHOLDER_URL, {
      name: 'Tablet Ekran Görseli', left: 151, top: 185, width: 248, height: 330, radius: 12
    }, (img) => {
      if (img) fCanvas.setActiveObject(img);
      fCanvas.requestRenderAll();
      saveFabricPageState(selectedEditIndex);
      pushFabricHistory(selectedEditIndex);
      renderRightEditorPanel();
      showToast('📟 Tablet Çerçevesi eklendi!');
    });
    return;
  }

  // 4. Kağıt & Dekoratif Çerçeveler (Bantlı Kart, Altın Galeri)
  if (frameKind === 'taped' || frameKind === 'gold_frame') {
    const isGold = frameKind === 'gold_frame';
    addFabRect(fCanvas, {
      name: isGold ? 'Altın Varaklı Galeri Çerçevesi' : 'Kağıt Fotoğraf Kartı',
      left: 140, top: 175, width: 270, height: 310, rx: isGold ? 6 : 12,
      fill: isGold ? '#1c1917' : '#fefce8',
      stroke: isGold ? '#f59e0b' : '#fde047',
      strokeWidth: isGold ? 5 : 2,
      shadow: true
    });
    loadFabricImageIntoSlot(fCanvas, CANVA_PLACEHOLDER_URL, CANVA_PLACEHOLDER_URL, {
      name: 'Çerçeve İçi Fotoğraf', left: 158, top: 195, width: 234, height: 270, radius: 6
    }, (img) => {
      if (!isGold) {
        addFabRect(fCanvas, {
          name: 'Üst Yapışkan Bant', left: 225, top: 162, width: 100, height: 26, rx: 4,
          fill: 'rgba(253, 224, 71, 0.78)', angle: -3
        });
      }
      if (img) fCanvas.setActiveObject(img);
      fCanvas.requestRenderAll();
      saveFabricPageState(selectedEditIndex);
      pushFabricHistory(selectedEditIndex);
      renderRightEditorPanel();
      showToast('🖼️ Dekoratif Çerçeve eklendi!');
    });
  }
};

// Sol Panel "Öğeler" Çekmecesine Canva Izgaralar ve Çerçeveler Bölümünü Enjekte Et
function injectCanvaGridsAndFramesIntoDrawer() {
  const container = document.getElementById('elementsLibraryContainer');
  if (!container || document.getElementById('canvaGridsAndFramesSection')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'canvaGridsAndFramesSection';
  wrapper.className = 'space-y-4 pb-2 border-b border-slate-800';
  wrapper.innerHTML = `
    <!-- A. CANVA TARZI FOTOĞRAF & VİDEO IZGARALARI (16 DÜZEN) -->
    <div class="elem-group" data-keywords="ızgara grid kolaj fotoğraf çoklu bölünmüş canva">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold text-sky-400 flex items-center gap-1.5">
          <i class="ph ph-squares-four text-sm"></i> Fotoğraf Izgaraları (Grids)
        </span>
        <span class="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">16 Düzen</span>
      </div>
      <p class="text-[10.5px] text-slate-400 mb-2 leading-snug">Tıklayıp sayfaya ekleyin; her hücrenin içine kendi fotoğrafınızı yükleyin.</p>
      <div class="grid grid-cols-4 gap-1.5 max-h-56 overflow-y-auto pr-1">
        ${window.CANVA_PHOTO_GRIDS.map(g => `
          <button onclick="insertCanvaPhotoGrid('${g.id}')" class="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-400 flex flex-col items-center gap-1 transition group" title="${g.name}">
            ${renderGridMiniSvg(g.cells)}
            <span class="text-[9px] text-slate-300 group-hover:text-white truncate w-full text-center">${g.name}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- B. CANVA TARZI KATEGORİLİ AKILLI ÇERÇEVELER (FRAMES) -->
    <div class="elem-group space-y-2.5" data-keywords="çerçeve frame maske polaroid film telefon bilgisayar daire yıldız">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <i class="ph ph-frame-corners text-sm"></i> Akıllı Çerçeveler (Frames)
        </span>
        <span class="text-[10px] text-slate-400">4 Kategori</span>
      </div>

      <!-- Kategori 1: Temel Şekiller -->
      <div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">1. Temel Şekiller</span>
        <div class="grid grid-cols-3 gap-1.5">
          <button onclick="insertCanvaSmartFrame('circle')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1">
            <div class="w-8 h-8 rounded-full bg-gradient-to-b from-sky-300 to-emerald-400 border border-white/40"></div>
            <span class="text-[9.5px] text-slate-300">Tam Daire</span>
          </button>
          <button onclick="insertCanvaSmartFrame('rounded')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-b from-sky-300 to-emerald-400 border border-white/40"></div>
            <span class="text-[9.5px] text-slate-300">Yuvarlak Kare</span>
          </button>
          <button onclick="insertCanvaSmartFrame('arch')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1">
            <div class="w-7 h-8 rounded-t-full bg-gradient-to-b from-sky-300 to-emerald-400 border border-white/40"></div>
            <span class="text-[9.5px] text-slate-300">Kemer (Arch)</span>
          </button>
          <button onclick="insertCanvaSmartFrame('diamond')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1">
            <div class="w-7 h-7 rotate-45 bg-gradient-to-b from-sky-300 to-emerald-400 border border-white/40 my-0.5"></div>
            <span class="text-[9.5px] text-slate-300">Elmas</span>
          </button>
          <button onclick="insertCanvaSmartFrame('hexagon')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1">
            <div class="w-8 h-8 bg-gradient-to-b from-sky-300 to-emerald-400" style="clip-path:polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"></div>
            <span class="text-[9.5px] text-slate-300">Altıgen</span>
          </button>
          <button onclick="insertCanvaSmartFrame('star')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1">
            <div class="w-8 h-8 bg-gradient-to-b from-amber-300 to-emerald-400" style="clip-path:polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"></div>
            <span class="text-[9.5px] text-slate-300">Yıldız</span>
          </button>
        </div>
      </div>

      <!-- Kategori 2: Film & Fotoğraf -->
      <div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">2. Film ve Fotoğraf</span>
        <div class="grid grid-cols-3 gap-1.5">
          <button onclick="insertCanvaSmartFrame('polaroid')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1">
            <div class="w-7 h-8 bg-white p-0.5 pb-2 rounded-sm shadow"><div class="w-full h-full bg-sky-400"></div></div>
            <span class="text-[9.5px] text-slate-300">Polaroid</span>
          </button>
          <button onclick="insertCanvaSmartFrame('filmstrip')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1">
            <div class="w-7 h-8 bg-slate-900 border border-slate-500 p-0.5 flex flex-col gap-0.5"><div class="flex-1 bg-sky-400"></div><div class="flex-1 bg-emerald-400"></div></div>
            <span class="text-[9.5px] text-slate-300">Film Şeridi</span>
          </button>
          <button onclick="insertCanvaSmartFrame('taped')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1">
            <div class="w-7 h-8 bg-amber-100 p-0.5 rounded-sm relative"><div class="w-full h-full bg-sky-400"></div></div>
            <span class="text-[9.5px] text-slate-300">Bantlı Kart</span>
          </button>
        </div>
      </div>

      <!-- Kategori 3: Cihazlar (Telefon, Bilgisayar, Tablet, Laptop) -->
      <div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">3. Cihazlar (Mockup)</span>
        <div class="grid grid-cols-4 gap-1.5">
          <button onclick="insertCanvaSmartFrame('phone')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-400 flex flex-col items-center gap-1">
            <i class="ph ph-device-mobile text-xl text-sky-400"></i>
            <span class="text-[9px] text-slate-300">Telefon</span>
          </button>
          <button onclick="insertCanvaSmartFrame('monitor')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-400 flex flex-col items-center gap-1">
            <i class="ph ph-desktop text-xl text-indigo-400"></i>
            <span class="text-[9px] text-slate-300">Monitör</span>
          </button>
          <button onclick="insertCanvaSmartFrame('laptop')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-400 flex flex-col items-center gap-1">
            <i class="ph ph-laptop text-xl text-emerald-400"></i>
            <span class="text-[9px] text-slate-300">Laptop</span>
          </button>
          <button onclick="insertCanvaSmartFrame('tablet')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-400 flex flex-col items-center gap-1">
            <i class="ph ph-device-tablet text-xl text-amber-400"></i>
            <span class="text-[9px] text-slate-300">Tablet</span>
          </button>
        </div>
      </div>
    </div>
  `;

  container.insertBefore(wrapper, container.firstChild);
}

// ============================================================================
// FAZ 7: İÇİNDEKİLER PENCERESİNDEN (#tocModal) CANLI ÇİFT YÖNLÜ SAYFA YÖNETİMİ
// ============================================================================
function getPrimaryTitleFieldKeyForPage(page) {
  if (!page) return 'title';
  if (page.type === 'cover' || page.type === 'k1') return 'mainHeadline';
  if (page.type === 'k2') return 'headerText';
  if (page.type === 'toc') return 'editorTitle';
  if (page.type === 'interview') return 'interviewee';
  if (page.type === 'k3') return 'boardTitle';
  if (page.type === 'k4' || page.type === 'back') return 'schoolName';
  return 'title';
}

function getCleanDisplayTitleForPage(page, idx) {
  if (!page) return 'Sayfa ' + (idx + 1);
  const raw = page.navTitle || page.title || page.mainHeadline || page.headerText || page.editorTitle || page.boardTitle || ('Sayfa ' + (idx + 1));
  return String(raw).replace(/^\d+\s*[•\-|:]\s*/, '').trim();
}

function getCleanAuthorForPage(page) {
  if (!page) return '';
  return page.author || page.interviewee || page.editorName || '';
}

// Hedef sayfanın Fabric.js tuvalini veya kayıtlı JSON'unu ve Sayfa 4 (İçindekiler) fihristini anında güncelle
window.syncTocEntryToPageAndTocCanvas = function(pageIdx, fieldType, newValue) {
  const pages = window.magazineData?.pages;
  if (!pages || !pages[pageIdx]) return;
  const targetPage = pages[pageIdx];

  if (fieldType === 'title') {
    const numPrefix = String(pageIdx + 1).padStart(2, '0') + ' • ';
    targetPage.navTitle = numPrefix + newValue;
    const primaryKey = getPrimaryTitleFieldKeyForPage(targetPage);
    targetPage[primaryKey] = newValue;
    targetPage.title = newValue;

    // 1. Eğer hedef sayfanın Fabric.js tuvali bellekte açıksa içindeki başlık kutusunu anında güncelle
    const targetCanvas = window.fabricCanvases && window.fabricCanvases[pageIdx];
    if (targetCanvas) {
      targetCanvas.getObjects().forEach(obj => {
        if (obj.fieldKey === primaryKey || obj.fieldKey === 'title' || obj.fieldKey === 'mainHeadline' || obj.fieldKey === 'headerText') {
          obj.set('text', newValue);
        }
      });
      targetCanvas.requestRenderAll();
      saveFabricPageState(pageIdx);
    } else if (targetPage.fabricJSON && Array.isArray(targetPage.fabricJSON.objects)) {
      targetPage.fabricJSON.objects.forEach(o => {
        if (o.fieldKey === primaryKey || o.fieldKey === 'title' || o.fieldKey === 'mainHeadline' || o.fieldKey === 'headerText') {
          o.text = newValue;
        }
      });
    }
  } else if (fieldType === 'author') {
    targetPage.author = newValue;
    if (targetPage.type === 'interview') targetPage.interviewee = newValue;
    if (targetPage.type === 'toc') targetPage.editorName = newValue;

    const targetCanvas = window.fabricCanvases && window.fabricCanvases[pageIdx];
    if (targetCanvas) {
      targetCanvas.getObjects().forEach(obj => {
        if (obj.fieldKey === 'author' || obj.fieldKey === 'interviewee' || obj.fieldKey === 'editorName') {
          obj.set('text', newValue);
        }
      });
      targetCanvas.requestRenderAll();
      saveFabricPageState(pageIdx);
    } else if (targetPage.fabricJSON && Array.isArray(targetPage.fabricJSON.objects)) {
      targetPage.fabricJSON.objects.forEach(o => {
        if (o.fieldKey === 'author' || o.fieldKey === 'interviewee' || o.fieldKey === 'editorName') {
          o.text = newValue;
        }
      });
    }
  } else if (fieldType === 'type') {
    targetPage.type = newValue;
    const catList = window.SMART_LAYOUT_CATALOG && window.SMART_LAYOUT_CATALOG[newValue];
    if (catList && catList[0]) targetPage.layout = catList[0].id;
    delete targetPage.fabricJSON;
    const targetCanvas = window.fabricCanvases && window.fabricCanvases[pageIdx];
    if (targetCanvas && typeof buildFabricObjectsForTemplatePage === 'function') {
      buildFabricObjectsForTemplatePage(targetPage, pageIdx, targetCanvas, () => {
        targetCanvas.requestRenderAll();
        saveFabricPageState(pageIdx);
      });
    }
  }

  // 2. Sayfa 4 (veya type === 'toc' olan tüm İçindekiler sayfalarını) anında yeniden oluştur
  refreshAllTocPagesOnCanvas();
  if (typeof renderSidebarThumbs === 'function') renderSidebarThumbs();
  if (typeof debouncedSave === 'function') debouncedSave();
};

function refreshAllTocPagesOnCanvas() {
  const pages = window.magazineData?.pages || [];
  pages.forEach((p, idx) => {
    if (p.type === 'toc') {
      delete p.fabricJSON;
      const tocCanvas = window.fabricCanvases && window.fabricCanvases[idx];
      if (tocCanvas && typeof buildFabricObjectsForTemplatePage === 'function') {
        buildFabricObjectsForTemplatePage(p, idx, tocCanvas, () => {
          tocCanvas.requestRenderAll();
          saveFabricPageState(idx);
        });
      }
    }
  });
}

// İçindekiler Modalından Yeni Bölüm / Sayfa Ekleme (K3 Künye ve K4 Arka Kapak'tan hemen önceye)
window.addNewPageFromTocModal = function() {
  const titleInp = document.getElementById('tocNewPageTitle');
  const authorInp = document.getElementById('tocNewPageAuthor');
  const typeSel = document.getElementById('tocNewPageType');

  const rawTitle = (titleInp?.value || '').trim() || 'Yeni Dergi Bölümü';
  const rawAuthor = (authorInp?.value || '').trim() || 'Yayın Ekibi';
  const pageType = typeSel?.value || 'article';

  const pages = window.magazineData?.pages || [];
  const accent = pages[0]?.accentColor || '#4f46e5';
  const layouts = (window.SMART_LAYOUT_CATALOG && window.SMART_LAYOUT_CATALOG[pageType]) || [];
  const defaultLayout = layouts[0]?.id || 'art_classic';

  // K3 Künye veya K4 Arka Kapak'tan hemen öncesini bul
  let insertIdx = pages.length;
  const k3Idx = pages.findIndex(p => p.type === 'k3');
  const k4Idx = pages.findIndex(p => p.type === 'k4' || p.type === 'back');
  if (k3Idx >= 0) insertIdx = k3Idx;
  else if (k4Idx >= 0) insertIdx = k4Idx;

  const newPageObj = {
    id: 'p-toc-' + Date.now(),
    type: pageType,
    layout: defaultLayout,
    navTitle: `${String(insertIdx + 1).padStart(2, '0')} • ${rawTitle}`,
    accentColor: accent,
    status: 'approved',
    category: 'ÖZEL BÖLÜM',
    title: rawTitle,
    mainHeadline: rawTitle,
    headerText: rawTitle,
    interviewee: rawTitle,
    author: rawAuthor,
    spot: `${rawAuthor} tarafından hazırlanan özel içerik.`,
    content: `${rawTitle} başlıklı bölümümüz için hazırlanan metin alanı. Bu kutuya çift tıklayarak kendi yazınızı girebilir veya sağdaki DeepSeek AI asistanına metin yazdırabilirsiniz.`,
    poemText: `${rawTitle}\n\nKelimeler buluşur her yeni sayfada,\nGenç kalemler iz bırakır yarına.`,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    elements: []
  };

  pages.splice(insertIdx, 0, newPageObj);

  // Tüm sayfaların navTitle numaralarını güncelle
  pages.forEach((p, i) => {
    const clean = getCleanDisplayTitleForPage(p, i);
    p.navTitle = `${String(i + 1).padStart(2, '0')} • ${clean}`;
  });

  if (titleInp) titleInp.value = '';
  if (authorInp) authorInp.value = '';

  refreshAllTocPagesOnCanvas();
  if (typeof renderAll === 'function') renderAll();
  renderInteractiveTocModal();
  showToast(`✅ "${rawTitle}" başlıklı sayfa dergiye ve İçindekiler sayfasına eklendi!`);
};

window.movePageInTocModal = function(idx, dir) {
  const pages = window.magazineData?.pages || [];
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= pages.length) return;
  const temp = pages[idx];
  pages[idx] = pages[targetIdx];
  pages[targetIdx] = temp;

  pages.forEach((p, i) => {
    const clean = getCleanDisplayTitleForPage(p, i);
    p.navTitle = `${String(i + 1).padStart(2, '0')} • ${clean}`;
  });

  window.fabricCanvases = {};
  refreshAllTocPagesOnCanvas();
  if (typeof renderAll === 'function') renderAll();
  renderInteractiveTocModal();
  showToast('↕️ Sayfa sırası ve İçindekiler fihristi güncellendi!');
};

window.deletePageFromTocModal = function(idx) {
  const pages = window.magazineData?.pages || [];
  if (pages.length <= 2) {
    showToast('Dergide en az 2 sayfa bulunmalıdır.');
    return;
  }
  const p = pages[idx];
  if (p && p.isFixedBackbone) {
    showToast('🔒 Sabit omurga sayfaları (Kapak, Bayrak/Marş, Atatürk, İçindekiler, Künye) silinemez.');
    return;
  }
  pages.splice(idx, 1);
  pages.forEach((item, i) => {
    const clean = getCleanDisplayTitleForPage(item, i);
    item.navTitle = `${String(i + 1).padStart(2, '0')} • ${clean}`;
  });
  if (selectedEditIndex >= pages.length) selectedEditIndex = pages.length - 1;
  window.fabricCanvases = {};
  refreshAllTocPagesOnCanvas();
  if (typeof renderAll === 'function') renderAll();
  renderInteractiveTocModal();
  showToast('🗑️ Sayfa silindi ve İçindekiler güncellendi.');
};

window.renderInteractiveTocModal = function() {
  const listEl = document.getElementById('tocModalList');
  if (!listEl || !window.magazineData?.pages) return;

  // Modal genişliğini büyüt
  const modalBox = listEl.closest('.max-w-md');
  if (modalBox) {
    modalBox.classList.remove('max-w-md');
    modalBox.classList.add('max-w-3xl');
  }

  const pages = window.magazineData.pages;
  const sectionOptions = [
    { id: 'cover', label: 'K1 • Ön Kapak' },
    { id: 'k2', label: 'K2 • Kapak İçi (Bayrak/Atatürk/Sunuş)' },
    { id: 'toc', label: 'İçindekiler & Editörden' },
    { id: 'article', label: 'Makale & Özel Dosya' },
    { id: 'interview', label: 'Röportaj & Söyleşi' },
    { id: 'literature', label: 'Edebiyat & Şiir' },
    { id: 'catalog', label: 'Proje & Sergi Vitrini' },
    { id: 'k3', label: 'K3 • Yayın Künyesi' },
    { id: 'k4', label: 'K4 • Arka Kapak' }
  ];

  listEl.innerHTML = `
    <div class="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3 mb-3 text-xs text-indigo-200 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <i class="ph ph-arrows-left-right text-lg text-amber-400 shrink-0"></i>
        <span>Burada değiştirdiğiniz <strong>Başlık, Yazar ve Yeni Bölümler</strong> hem ilgili sayfanın tuvaline hem de <strong>Sayfa 4 (İçindekiler)</strong> fihristine anında aktarılır.</span>
      </div>
      <button onclick="refreshAllTocPagesOnCanvas(); showToast('✅ Sayfa 4 İçindekiler fihristi yenilendi!');" class="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shrink-0">
        🔄 Fihristi Yenile
      </button>
    </div>

    <div class="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
      ${pages.map((p, idx) => {
        const cleanTitle = getCleanDisplayTitleForPage(p, idx);
        const cleanAuthor = getCleanAuthorForPage(p);
        const isFixed = Boolean(p.isFixedBackbone);
        return `
          <div class="p-2.5 rounded-2xl bg-slate-950/90 border ${idx === selectedEditIndex ? 'border-amber-500/60' : 'border-slate-800'} flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs">
            <button onclick="goToPage(${idx}); closeModal('tocModal');" class="w-8 h-8 rounded-xl ${isFixed ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'} font-mono font-bold flex items-center justify-center shrink-0" title="Bu Sayfaya Git">
              ${String(idx + 1).padStart(2, '0')}
            </button>

            <div class="flex-1 min-w-[160px]">
              <label class="block text-[9.5px] text-slate-400 font-semibold">Sayfa / Bölüm Başlığı ${isFixed ? '<span class="text-amber-400">(Sabit Omurga)</span>' : ''}</label>
              <input type="text" value="${escapeAttr(cleanTitle)}" oninput="syncTocEntryToPageAndTocCanvas(${idx}, 'title', this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-semibold focus:border-amber-400 focus:outline-none">
            </div>

            <div class="w-36 sm:w-40">
              <label class="block text-[9.5px] text-slate-400 font-semibold">Yazar / Hazırlayan</label>
              <input type="text" value="${escapeAttr(cleanAuthor)}" placeholder="Yazar veya Kulüp..." oninput="syncTocEntryToPageAndTocCanvas(${idx}, 'author', this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:border-amber-400 focus:outline-none">
            </div>

            <div class="w-36">
              <label class="block text-[9.5px] text-slate-400 font-semibold">Sayfa Türü</label>
              <select onchange="syncTocEntryToPageAndTocCanvas(${idx}, 'type', this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white">
                ${sectionOptions.map(opt => `<option value="${opt.id}" ${p.type === opt.id ? 'selected' : ''}>${opt.label}</option>`).join('')}
              </select>
            </div>

            <div class="flex items-center gap-1 pt-3 sm:pt-4 shrink-0">
              <button onclick="movePageInTocModal(${idx}, -1)" class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300" title="Yukarı Taşı"><i class="ph ph-arrow-up"></i></button>
              <button onclick="movePageInTocModal(${idx}, 1)" class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300" title="Aşağı Taşı"><i class="ph ph-arrow-down"></i></button>
              <button onclick="goToPage(${idx}); closeModal('tocModal');" class="px-2 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[10.5px]" title="Sayfayı Aç">Aç</button>
              ${!isFixed ? `<button onclick="deletePageFromTocModal(${idx})" class="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white" title="Sayfayı Sil"><i class="ph ph-trash"></i></button>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- YENİ BÖLÜM / SAYFA EKLEME BARI -->
    <div class="mt-3 pt-3 border-t border-slate-800 bg-slate-950/80 p-3 rounded-2xl space-y-2">
      <div class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
        <i class="ph ph-plus-circle text-base"></i> Yeni Bölüm / Sayfa Ekle (Otomatik Sayfa Oluşturur ve İçindekilere Yazar)
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input id="tocNewPageTitle" type="text" placeholder="Bölüm Başlığı (Örn: Bilim Şenliği)" class="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none">
        <input id="tocNewPageAuthor" type="text" placeholder="Yazar / Kulüp (Örn: 10-A)" class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none">
        <select id="tocNewPageType" class="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white">
          <option value="article">📰 Makale / Dosya</option>
          <option value="interview">🎙️ Röportaj / Söyleşi</option>
          <option value="literature">🪶 Edebiyat & Şiir</option>
          <option value="catalog">🖼️ Proje & Sergi Vitrini</option>
        </select>
      </div>
      <div class="flex justify-end">
        <button onclick="addNewPageFromTocModal()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition">
          <i class="ph ph-plus-circle text-sm"></i> Sayfayı Dergiye ve İçindekilere Ekle
        </button>
      </div>
    </div>
  `;
};

const _origOpenModal = window.openModal;
if (typeof _origOpenModal === 'function') {
  window.openModal = function(id) {
    _origOpenModal(id);
    if (id === 'tocModal') {
      renderInteractiveTocModal();
    }
    if (id === 'aiHelperModal') {
      renderUpgradedAiModalContext();
    }
  };
}

// ============================================================================
// FAZ 8: GÖRSEL ŞEMALI (MINI-WIREFRAME SVG) KOMPAKT AKILLI MİZANPAJ SEÇİCİ
// ============================================================================
function buildLayoutWireframeSvg(layoutId, idx) {
  const id = String(layoutId || '').toLowerCase();
  if (id.includes('split') || id.includes('minimalist') || id.includes('vogue')) {
    return `<svg viewBox="0 0 60 80" class="w-full h-14 rounded bg-slate-900 border border-slate-700/80 p-1">
      <rect x="4" y="4" width="52" height="10" rx="2" fill="#f59e0b"/>
      <rect x="4" y="18" width="24" height="56" rx="3" fill="#334155"/>
      <rect x="32" y="18" width="24" height="56" rx="3" fill="#38bdf8" fill-opacity="0.45"/>
    </svg>`;
  }
  if (id.includes('fullscreen') || id.includes('manifesto') || id.includes('poster') || id.includes('cinema')) {
    return `<svg viewBox="0 0 60 80" class="w-full h-14 rounded bg-slate-900 border border-slate-700/80 p-1">
      <rect x="3" y="3" width="54" height="74" rx="4" fill="#0284c7" fill-opacity="0.35" stroke="#38bdf8" stroke-width="1"/>
      <rect x="8" y="48" width="44" height="8" rx="2" fill="#ffffff"/>
      <rect x="8" y="60" width="32" height="6" rx="2" fill="#94a3b8"/>
    </svg>`;
  }
  if (id.includes('collage') || id.includes('grid') || id.includes('showcase') || id.includes('2x2') || id.includes('cards')) {
    return `<svg viewBox="0 0 60 80" class="w-full h-14 rounded bg-slate-900 border border-slate-700/80 p-1">
      <rect x="4" y="4" width="52" height="8" rx="2" fill="#f59e0b"/>
      <rect x="4" y="16" width="24" height="27" rx="2" fill="#38bdf8" fill-opacity="0.45"/>
      <rect x="32" y="16" width="24" height="27" rx="2" fill="#38bdf8" fill-opacity="0.45"/>
      <rect x="4" y="47" width="24" height="27" rx="2" fill="#334155"/>
      <rect x="32" y="47" width="24" height="27" rx="2" fill="#334155"/>
    </svg>`;
  }
  if (id.includes('bayrak') || id.includes('ataturk')) {
    return `<svg viewBox="0 0 60 80" class="w-full h-14 rounded bg-slate-900 border border-amber-500/50 p-1">
      <rect x="4" y="4" width="52" height="72" rx="4" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
      <rect x="16" y="10" width="28" height="20" rx="3" fill="#ef4444" fill-opacity="0.7"/>
      <rect x="10" y="35" width="40" height="34" rx="3" fill="#1e293b"/>
    </svg>`;
  }
  // Varsayılan (Üst görsel + 2 sütun yazı veya alternatif dizilim)
  const alt = idx % 2 === 1;
  return `<svg viewBox="0 0 60 80" class="w-full h-14 rounded bg-slate-900 border border-slate-700/80 p-1">
    <rect x="4" y="4" width="52" height="9" rx="2" fill="#f59e0b"/>
    <rect x="4" y="${alt ? 42 : 16}" width="52" height="26" rx="3" fill="#38bdf8" fill-opacity="0.4"/>
    <rect x="4" y="${alt ? 16 : 46}" width="24" height="22" rx="2" fill="#475569"/>
    <rect x="32" y="${alt ? 16 : 46}" width="24" height="22" rx="2" fill="#475569"/>
  </svg>`;
}

// ============================================================================
// FAZ 9: SEÇİLİ ÖĞE ODAKLI AKILLI AI MİMARİSİ (ANA MOTOR: DEEPSEEK + GÖRSEL: GEMINI VISION)
// ============================================================================
function buildSelectedElementAiWidgetHtml(activeObj) {
  if (!activeObj) return '';

  const isImg = activeObj.type === 'image';
  const isTxt = activeObj.type === 'textbox' || activeObj.type === 'i-text';
  const objTitle = activeObj.name || (isImg ? 'Seçili Görsel' : (isTxt ? 'Seçili Metin Kutusu' : 'Seçili Şekil'));

  const quickChips = isImg
    ? [
        { label: '↻ Sağa 90° Çevir', cmd: 'sağa 90 derece çevir', vision: false },
        { label: '↺ Sola 90° Çevir', cmd: 'sola 90 derece çevir', vision: false },
        { label: '⚫ Siyah-Beyaz Yap', cmd: 'siyah beyaz yap', vision: false },
        { label: '🎞️ Vintage / Sepya', cmd: 'vintage sepya efekt yap', vision: false },
        { label: '↔️ Yatay Aynala', cmd: 'yatay aynala çevir', vision: false },
        { label: '⭕ Daire İçine Al', cmd: 'daire maske içine al', vision: false },
        { label: '▢ Köşeleri Yuvarlat', cmd: 'köşelerini yuvarlat', vision: false },
        { label: '☀️ Parlaklığı Artır', cmd: 'parlaklığı ve kontrastı artır', vision: false },
        { label: '🎯 Sayfada Ortala', cmd: 'sayfada yatay ortala', vision: false },
        { label: '👁️ Fotoğrafa Başlık & Altyazı Yaz (Gemini Vision)', cmd: 'Bu fotoğrafı analiz et ve altına uygun dergi açıklaması yaz', vision: true }
      ]
    : isTxt
    ? [
        { label: '✅ İmla Hatalarını Düzelt', cmd: 'İmla ve noktalama hatalarını düzelt', vision: false },
        { label: '🏛️ Resmi Dile Çevir', cmd: 'Bu metni resmi ve kurumsal dile çevir', vision: false },
        { label: '🪶 Edebi / Şiirsel Yaz', cmd: 'Bu metni daha edebi ve etkileyici bir dergi üslubuyla yeniden yaz', vision: false },
        { label: '✂️ Kısalt / Özetle', cmd: 'Anlamı bozmadan metni daha öz ve vurucu şekilde kısalt', vision: false },
        { label: '≡ Ortala', cmd: 'metni ortala', vision: false },
        { label: '☰ İki Yana Yasla', cmd: 'iki yana yasla', vision: false },
        { label: '↕️ Aralıkları Artır', cmd: 'satır ve harf aralıklarını artır', vision: false },
        { label: '⇥ Girinti Yap', cmd: 'paragraf başlarına girinti yap', vision: false },
        { label: '𝗔+ Büyüt & Kalın Yap', cmd: 'yazıyı büyüt ve kalın yap', vision: false }
      ]
    : [
        { label: '🎯 Sayfada Ortala', cmd: 'sayfada yatay ortala', vision: false },
        { label: '↻ Hafif Eğik Yap', cmd: 'sağa 5 derece eğik yap', vision: false },
        { label: '▢ Köşeleri Yuvarlat', cmd: 'köşelerini yuvarlat', vision: false }
      ];

  return `
    <div class="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-900 p-3 rounded-2xl border border-indigo-500/50 space-y-2.5 text-xs shadow-lg">
      <div class="flex items-center justify-between">
        <span class="font-bold text-indigo-300 flex items-center gap-1.5 truncate">
          <i class="ph ph-sparkle text-amber-400 text-base"></i>
          <span>AI Sihirli Komut (${escapeHtml(objTitle)})</span>
        </span>
        <span class="text-[9.5px] px-1.5 py-0.5 rounded bg-indigo-500/25 text-indigo-200 font-mono font-bold shrink-0">
          ${isImg ? 'DeepSeek + Gemini Vision' : 'DeepSeek AI'}
        </span>
      </div>

      <!-- Doğal Dil Komut Girişi -->
      <div class="flex gap-1.5">
        <input id="inlineAiMagicInput" type="text" onkeydown="if(event.key==='Enter'){runSmartElementAICommand(this.value);}" placeholder="${isImg ? 'Örn: sağa çevir, siyah beyaz yap, aynala...' : 'Örn: ortala, aralıkları artır, imla düzelt, resmi dile çevir...'}" class="flex-1 bg-slate-950 border border-indigo-500/40 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none">
        <button onclick="runSmartElementAICommand(document.getElementById('inlineAiMagicInput')?.value)" id="btnRunInlineAi" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 shrink-0 transition shadow">
          <i class="ph ph-magic-wand"></i> Uygula
        </button>
      </div>

      <!-- Tek Tık Hızlı AI Komut Çipleri -->
      <div class="flex flex-wrap gap-1 pt-0.5">
        ${quickChips.map(ch => `
          <button onclick="runSmartElementAICommand('${ch.cmd.replace(/'/g, "\\'")}', '${ch.vision ? 'vision' : 'deepseek'}')" class="px-2 py-1 rounded-lg text-[10px] font-semibold transition ${ch.vision ? 'bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-slate-950 border border-amber-500/40' : 'bg-slate-950/90 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800'}">
            ${ch.label}
          </button>
        `).join('')}
      </div>

      <div id="inlineAiStatusBox" class="hidden text-[10.5px] px-2.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-emerald-300"></div>
    </div>
  `;
}

// Hızlı Yerel (Anlık) Komut Çözümleyici + DeepSeek / Gemini Vision Hibrit Yürütücü
window.runSmartElementAICommand = async function(rawPrompt, forceMode = 'auto') {
  const prompt = String(rawPrompt || '').trim();
  if (!prompt) {
    showToast('Lütfen bir AI komutu yazın veya hazır komut butonlarından birine tıklayın.');
    return;
  }

  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) {
    showToast('Lütfen önce dergi sayfası üzerinde düzenlemek istediğiniz resme veya metne tıklayın.');
    return;
  }

  // Undo (Geri Al) için mevcut durumu kaydet
  pushFabricHistory(selectedEditIndex);

  const statusBox = document.getElementById('inlineAiStatusBox');
  const setStatus = (msg, isBusy = false) => {
    if (statusBox) {
      statusBox.classList.remove('hidden');
      statusBox.innerHTML = `<span class="flex items-center gap-1.5">${isBusy ? '<i class="ph ph-spinner animate-spin text-amber-400"></i>' : '<i class="ph ph-check-circle text-emerald-400"></i>'} ${msg}</span>`;
    }
  };

  const cmd = prompt.toLowerCase();
  let localApplied = [];

  // --------------------------------------------------------------------------
  // ADIM 1: ANLIK GEOMETRİ, FİLTRE VE BİÇİMLENDİRME KOMUTLARINI UYGULA (<10ms)
  // --------------------------------------------------------------------------
  if (active.type === 'image') {
    if (/(sağa çevir|sağa döndür|90 derece sağa|saat yönü)/i.test(cmd)) {
      active.set('angle', ((active.angle || 0) + 90) % 360);
      localApplied.push('Sağa 90° döndürüldü');
    } else if (/(sola çevir|sola döndür|90 derece sola)/i.test(cmd)) {
      active.set('angle', ((active.angle || 0) - 90 + 360) % 360);
      localApplied.push('Sola 90° döndürüldü');
    } else if (/(eğik|açı ver)/i.test(cmd)) {
      active.set('angle', (active.angle || 0) + 5);
      localApplied.push('+5° eğim verildi');
    } else if (/(düzelt|açıyı sıfırla|dik yap)/i.test(cmd)) {
      active.set('angle', 0);
      localApplied.push('Açısı sıfırlandı');
    }

    if (/(aynala|yatay çevir|ters çevir)/i.test(cmd) && !/dikey/i.test(cmd)) {
      active.set('flipX', !active.flipX);
      localApplied.push('Yatay aynalandı');
    }
    if (/dikey (aynala|çevir)/i.test(cmd)) {
      active.set('flipY', !active.flipY);
      localApplied.push('Dikey aynalandı');
    }

    if (/(siyah beyaz|gri ton|monokrom)/i.test(cmd)) {
      applyFabricImageFilter('preset', 'grayscale');
      localApplied.push('Siyah-Beyaz filtresi uygulandı');
    } else if (/(sepya|vintage|nostalji|eskitme)/i.test(cmd)) {
      applyFabricImageFilter('preset', 'sepia');
      localApplied.push('Sepya/Vintage filtresi uygulandı');
    } else if (/(normal renk|filtreyi kaldır|renkli yap)/i.test(cmd)) {
      applyFabricImageFilter('preset', 'none');
      localApplied.push('Filtreler sıfırlandı');
    }

    if (/(parlaklığı artır|aydınlat|parlak yap)/i.test(cmd)) {
      applyFabricImageFilter('filterBrightness', Math.min(80, (Number(active.filterBrightness) || 0) + 22));
      applyFabricImageFilter('filterContrast', Math.min(80, (Number(active.filterContrast) || 0) + 12));
      localApplied.push('Parlaklık ve kontrast artırıldı');
    }

    if (/(daire|yuvarlak maske)/i.test(cmd)) {
      applyImageCornerAndMask(active, 'circle', 0);
      localApplied.push('Daire çerçeveye alındı');
    } else if (/(kemer|arch)/i.test(cmd)) {
      applyImageCornerAndMask(active, 'arch', 0);
      localApplied.push('Kemer çerçeveye alındı');
    } else if (/(yıldız)/i.test(cmd)) {
      applyImageCornerAndMask(active, 'star', 0);
      localApplied.push('Yıldız çerçeveye alındı');
    } else if (/(köşe.*yuvarlat|ovalleştir)/i.test(cmd)) {
      applyImageCornerAndMask(active, 'none', 32);
      localApplied.push('Köşeleri yuvarlatıldı (32px)');
    }

    if (/ortala/i.test(cmd)) {
      alignSelectedElement('center');
      localApplied.push('Sayfada yatay ortalandı');
    }
  } else if (active.type === 'textbox' || active.type === 'i-text') {
    if (/(ortala|merkeze hizala)/i.test(cmd)) {
      active.set('textAlign', 'center');
      localApplied.push('Metin ortalandı');
    } else if (/(iki yana yasla|blokla|justify)/i.test(cmd)) {
      active.set('textAlign', 'justify');
      localApplied.push('Metin iki yana yaslandı');
    } else if (/sola (hizala|yasla)/i.test(cmd)) {
      active.set('textAlign', 'left');
      localApplied.push('Metin sola hizalandı');
    } else if (/sağa (hizala|yasla)/i.test(cmd)) {
      active.set('textAlign', 'right');
      localApplied.push('Metin sağa hizalandı');
    }

    if (/(aralık.*artır|satır.*aç|ferahlat)/i.test(cmd)) {
      active.set('lineHeight', Math.min(2.4, Number((Number(active.lineHeight || 1.25) + 0.25).toFixed(2))));
      active.set('charSpacing', Math.min(300, (Number(active.charSpacing) || 0) + 30));
      localApplied.push('Satır ve harf aralıkları artırıldı');
    } else if (/(aralık.*azalt|sıkıştır)/i.test(cmd)) {
      active.set('lineHeight', Math.max(0.95, Number((Number(active.lineHeight || 1.25) - 0.2).toFixed(2))));
      localApplied.push('Satır aralığı daraltıldı');
    }

    if (/(girinti yap|paragraf başı)/i.test(cmd)) {
      const curTxt = String(active.text || '');
      const indented = curTxt
        .split('\n')
        .map(line => (line.trim().length > 0 && !line.startsWith('    ') ? '    ' + line.trimStart() : line))
        .join('\n');
      active.set('text', indented);
      localApplied.push('Paragraf başlarına girinti eklendi');
    }

    if (/(büyüt|büyük yap)/i.test(cmd)) {
      active.set('fontSize', Math.min(120, Math.round((active.fontSize || 16) * 1.22)));
      localApplied.push('Yazı boyutu büyütüldü');
    }
    if (/(küçült|küçük yap)/i.test(cmd)) {
      active.set('fontSize', Math.max(9, Math.round((active.fontSize || 16) * 0.85)));
      localApplied.push('Yazı boyutu küçültüldü');
    }
    if (/(kalın yap|bold)/i.test(cmd)) {
      active.set('fontWeight', 'bold');
      localApplied.push('Yazı kalın (bold) yapıldı');
    }
  } else {
    if (/ortala/i.test(cmd)) {
      alignSelectedElement('center');
      localApplied.push('Sayfada ortalandı');
    }
    if (/(eğik|çevir)/i.test(cmd)) {
      active.set('angle', (active.angle || 0) + 5);
      localApplied.push('Açısı döndürüldü');
    }
    if (/köşe.*yuvarlat/i.test(cmd) && active.type === 'rect') {
      active.set({ rx: 28, ry: 28 });
      localApplied.push('Köşeleri yuvarlatıldı');
    }
  }

  active.setCoords();
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);

  // --------------------------------------------------------------------------
  // ADIM 2: METİN DÜZELTME / RESMİ DİL / ÜSLUP (DEEPSEEK) VEYA GÖRSEL ANALİZ (GEMINI VISION) GEREKİYOR MU?
  // --------------------------------------------------------------------------
  const needsDeepSeekOrVision =
    forceMode === 'vision' ||
    localApplied.length === 0 ||
    /(imla|noktalama|hatalarını düzelt|resmi dil|kurumsal|edebi|şiirsel|kısalt|özetle|uzat|başlık|yeniden yaz|analiz|açıklama yaz|ocr|ne var)/i.test(cmd);

  if (!needsDeepSeekOrVision) {
    renderRightEditorPanel();
    const summaryMsg = localApplied.join(' • ');
    setStatus(`✨ ${summaryMsg}`, false);
    showToast(`✨ ${summaryMsg}`);
    return;
  }

  const isVision =
    forceMode === 'vision' ||
    (active.type === 'image' && /(analiz|açıklama yaz|altyazı|başlık|ocr|görseldeki|ne var)/i.test(cmd));

  setStatus(
    isVision
      ? '👁️ Gemini Vision görseli analiz ediyor...'
      : '🧠 DeepSeek AI komutu işliyor...',
    true
  );

  try {
    const selectedPayload = {
      type: active.type,
      name: active.name || '',
      text: active.text || '',
      fontSize: active.fontSize,
      fontFamily: active.fontFamily,
      fontWeight: active.fontWeight,
      fontStyle: active.fontStyle,
      textAlign: active.textAlign,
      lineHeight: active.lineHeight,
      charSpacing: active.charSpacing,
      fill: active.fill,
      angle: active.angle || 0,
      flipX: Boolean(active.flipX),
      flipY: Boolean(active.flipY),
      maskType: active.maskType || 'none',
      cornerRadiusPx: active.cornerRadiusPx || 0,
      filterPreset: active.filterPreset || 'none',
      src: active.type === 'image' ? (active.getSrc ? active.getSrc() : active._element?.src) : undefined
    };

    const resp = await fetch('/api/ai/magic-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        selectedObject: selectedPayload,
        mode: isVision ? 'vision' : 'deepseek'
      })
    });

    const data = await resp.json();
    const resObj = data.result || {};
    const props = resObj.properties || {};

    // Gelen Fabric.js özelliklerini seçili öğeye uygula
    if (props.text !== undefined && (active.type === 'textbox' || active.type === 'i-text')) {
      active.set('text', String(props.text));
      if (active.fieldKey && magazineData.pages[selectedEditIndex]) {
        magazineData.pages[selectedEditIndex][active.fieldKey] = String(props.text);
      }
    }
    if (props.textAlign) active.set('textAlign', props.textAlign);
    if (props.lineHeight) active.set('lineHeight', Number(props.lineHeight));
    if (props.charSpacing !== undefined) active.set('charSpacing', Number(props.charSpacing));
    if (props.fontSize) active.set('fontSize', Number(props.fontSize));
    if (props.fontWeight) active.set('fontWeight', props.fontWeight);
    if (props.fontStyle) active.set('fontStyle', props.fontStyle);
    if (props.fill) active.set('fill', props.fill);
    if (props.backgroundColor !== undefined) active.set('backgroundColor', props.backgroundColor);

    if (props.angle !== undefined) active.set('angle', Number(props.angle));
    if (props.angleDelta !== undefined) active.set('angle', ((active.angle || 0) + Number(props.angleDelta)) % 360);
    if (props.flipX !== undefined) active.set('flipX', Boolean(props.flipX));
    if (props.flipY !== undefined) active.set('flipY', Boolean(props.flipY));
    if (props.opacity !== undefined) active.set('opacity', Number(props.opacity));

    if (active.type === 'image') {
      if (props.filterPreset) applyFabricImageFilter('preset', props.filterPreset);
      if (props.maskType !== undefined || props.cornerRadiusPx !== undefined) {
        applyImageCornerAndMask(active, props.maskType, props.cornerRadiusPx);
      }
      // Gemini Vision alt yazı / başlık ürettiyse görselin hemen altına şık bir açıklama kutusu ekle
      if (resObj.caption || resObj.headline) {
        const capText = resObj.caption || resObj.headline;
        const imgBottom = (active.top || 150) + active.getScaledHeight() + 10;
        addFabText(fCanvas, capText, {
          name: 'Gemini Vision Fotoğraf Açıklaması',
          left: active.left || 48,
          top: Math.min(710, imgBottom),
          width: Math.max(180, active.getScaledWidth()),
          fontSize: 12,
          fontFamily: 'Inter',
          fontStyle: 'italic',
          fill: '#1e293b',
          backgroundColor: '#f8fafc'
        });
      }
    }

    if (props.alignOnPage === 'center-h' || props.alignOnPage === 'center-both') {
      alignSelectedElement('center');
    }
    if (props.alignOnPage === 'center-v' || props.alignOnPage === 'center-both') {
      alignSelectedElement('middle');
    }

    active.setCoords();
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    renderRightEditorPanel();

    const finalMsg = resObj.summary || (localApplied.length ? localApplied.join(' • ') : 'AI komutu başarıyla uygulandı!');
    // Yeniden render edildikten sonra güncel statusBox DOM öğesini bul
    const newStatusBox = document.getElementById('inlineAiStatusBox');
    if (newStatusBox) {
      newStatusBox.classList.remove('hidden');
      newStatusBox.innerHTML = `<span class="flex items-center gap-1.5"><i class="ph ph-check-circle text-emerald-400"></i> ✨ [${data.engine || 'DeepSeek'}] ${finalMsg}</span>`;
    }
    showToast(`✨ ${finalMsg}`);
  } catch (err) {
    console.warn('AI Komut Hatası:', err);
    showToast('⚠️ AI komutu işlenirken hata oluştu.');
  }
};

// AI Modal (#aiHelperModal) İçini de Seçili Öğeye + DeepSeek Makale Üreticisine Bağla
window.renderUpgradedAiModalContext = function() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  const badge = document.getElementById('aiModalElementBadge');
  const chipsContainer = document.getElementById('aiModalQuickChips');
  const inp = document.getElementById('aiModalCustomCommand');
  const outBox = document.getElementById('aiOutputBox');

  if (active) {
    const isImg = active.type === 'image';
    const isTxt = active.type === 'textbox' || active.type === 'i-text';
    if (badge) {
      badge.textContent = isImg ? '🖼️ Seçili Görsel' : (isTxt ? '🔤 Seçili Metin' : '📦 Seçili Şekil');
      badge.className = isImg ? 'text-[10px] px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 font-bold' : 'text-[10px] px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 font-bold';
    }
    if (inp) {
      inp.placeholder = isImg ? 'Örn: sağa çevir, siyah beyaz yap, aynala, fotoğrafa altyazı yaz...' : 'Örn: ortala, aralıkları artır, imla hatalarını düzelt, resmi dile çevir...';
    }
    if (isTxt && outBox && !outBox.value) {
      outBox.value = active.text || '';
    }

    if (chipsContainer) {
      const chips = isImg ? [
        { l: '↻ Sağa 90° Çevir', c: 'sağa 90 derece çevir' },
        { l: '⚫ Siyah-Beyaz', c: 'siyah beyaz yap' },
        { l: '🎞️ Sepya', c: 'sepya yap' },
        { l: '↔️ Aynala', c: 'yatay aynala' },
        { l: '⭕ Daire Maske', c: 'daire içine al' },
        { l: '▢ Köşeleri Yuvarlat', c: 'köşelerini yuvarlat' },
        { l: '👁️ Fotoğrafa Altyazı Yaz (Gemini Vision)', c: 'Bu fotoğrafı analiz et ve altına uygun dergi açıklaması yaz', vision: true }
      ] : [
        { l: '✅ İmla Hatalarını Düzelt', c: 'İmla ve noktalama hatalarını düzelt' },
        { l: '🏛️ Resmi Dile Çevir', c: 'Bu metni resmi ve kurumsal dile çevir' },
        { l: '🪶 Edebi / Şiirsel Yaz', c: 'Bu metni daha edebi ve etkileyici bir dergi üslubuyla yeniden yaz' },
        { l: '✂️ Kısalt / Özetle', c: 'Metni daha öz ve vurucu şekilde kısalt' },
        { l: '≡ Ortala', c: 'metni ortala' },
        { l: '↕️ Aralıkları Aç', c: 'satır ve harf aralıklarını artır' },
        { l: '⇥ Paragraf Girintisi', c: 'paragraf başlarına girinti yap' }
      ];

      chipsContainer.innerHTML = chips.map(ch => `
        <button onclick="runSmartElementAICommand('${ch.c.replace(/'/g, "\\'")}', '${ch.vision ? 'vision' : 'deepseek'}'); closeModal('aiHelperModal');" class="px-2 py-1 rounded-lg text-[10px] font-semibold transition ${ch.vision ? 'bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-slate-950 border border-amber-500/40' : 'bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700'}">
          ${ch.l}
        </button>
      `).join('');
    }
  } else {
    if (badge) {
      badge.textContent = `Sayfa ${selectedEditIndex + 1} (Genel)`;
      badge.className = 'text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-bold';
    }
    if (chipsContainer) chipsContainer.innerHTML = '';
  }
};

window.runAiModalCommand = function() {
  const inp = document.getElementById('aiModalCustomCommand');
  const val = inp ? inp.value : '';
  if (!val) {
    showToast('Lütfen bir komut yazın.');
    return;
  }
  closeModal('aiHelperModal');
  runSmartElementAICommand(val);
};

const _origGenerateAiSnippet = window.generateAiSnippet;
window.generateAiSnippet = async function(kind) {
  const outBox = document.getElementById('aiOutputBox');
  if (outBox) outBox.value = '🧠 DeepSeek AI içerik üretiyor, lütfen bekleyin...';

  const school = window.magazineData?.schoolName || 'Okulumuz';
  const topicMap = {
    headline: { topic: `${school} dergisi için çarpıcı kapak manşeti ve spotu`, contentType: 'Kapak Manşeti' },
    editorial: { topic: `${school} yeni dergi sayısı için Editörden Başyazı ve Sunuş mektubu`, contentType: 'Editörden Sunuş' },
    interview: { topic: 'Bilim, sanat ve gençlik üzerine 3 etkileyici röportaj sorusu ve kısa yanıtları', contentType: 'Röportaj' },
    article: { topic: 'Geleceğin teknolojileri, kültür ve okul yaşamı üzerine dergi makalesi', contentType: 'Makale' }
  };
  const cfg = topicMap[kind] || topicMap.article;

  try {
    const resp = await fetch('/api/ai/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg)
    });
    const res = await resp.json();
    if (res.success && res.data && outBox) {
      const d = res.data;
      outBox.value = `${d.title ? d.title + '\n\n' : ''}${d.spot ? d.spot + '\n\n' : ''}${d.content || ''}`;
      showToast('✨ DeepSeek AI metni hazırladı!');
      return;
    }
  } catch (e) {
    console.warn('DeepSeek snippet fallback:', e);
  }
  if (typeof _origGenerateAiSnippet === 'function') {
    _origGenerateAiSnippet(kind);
  }
};

// ============================================================================
// SAĞ PANEL DENETÇİSİNİ FAZ 8 (KOMPAKT GÖRSEL ŞEMA) VE FAZ 9 (SEÇİLİ ÖĞE AI) İLE GÜNCELLE
// ============================================================================
const _baseRenderContextSettings = window._origRenderContextSettings || window.renderContextSettingsInspector;

window.renderContextSettingsInspector = function(page, isEditable, targetDom) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;

  // DURUM 1: TUVALDE BİR ÖĞE SEÇİLİYSE -> ÜSTTE AKILLI AI SİHİRLİ KOMUT KUTUSU + ALTINDA NESNE DENETÇİSİ
  if (active) {
    if (typeof _origRenderContextSettings === 'function') {
      _origRenderContextSettings(page, isEditable, targetDom);
    }
    const aiWidgetHtml = buildSelectedElementAiWidgetHtml(active);
    targetDom.innerHTML = aiWidgetHtml + targetDom.innerHTML;
    return;
  }

  // DURUM 2: HİÇBİR ÖĞE SEÇİLİ DEĞİLSE -> FAZ 8 GÖRSEL ŞEMALI (MINI-WIREFRAME) KOMPAKT MİZANPAJ SEÇİCİ
  const curSec = typeof normalizeSmartSectionType === 'function' ? normalizeSmartSectionType(page.type) : (page.type || 'article');
  const sections = window.SMART_PAGE_SECTIONS || [];
  const secMeta = sections.find(s => s.id === curSec) || sections[3] || { id: 'article', short: 'Makale', label: 'Makale', icon: 'ph-newspaper' };
  const layouts = (window.SMART_LAYOUT_CATALOG && window.SMART_LAYOUT_CATALOG[curSec]) || [];
  const curLayout = page.layout || layouts[0]?.id;
  const bgHex = (page.bgColor && page.bgColor.startsWith('#')) ? page.bgColor : '#ffffff';

  targetDom.innerHTML = `
    <!-- 1. FAZ 8: GÖRSEL ŞEMALI (MINI-WIREFRAME) KOMPAKT MİZANPAJ SEÇİCİ -->
    <div class="bg-slate-900 p-3.5 rounded-2xl border border-amber-500/40 space-y-3 text-xs shadow-lg">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="font-bold text-amber-400 flex items-center gap-1.5">
          <i class="ph ph-layout text-base"></i> Sayfa Şablonu & Görsel Dizilim
        </span>
        <button onclick="rebuildCurrentPageFromTemplate()" class="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-[10px] font-bold text-slate-300 hover:text-white transition" title="Sayfayı varsayılan şablon nesneleriyle sıfırla">
          ↺ Sıfırla
        </button>
      </div>

      <!-- Kompakt Bölüm Seçici Açılır Kutu -->
      <div>
        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Sayfa ${selectedEditIndex + 1} Bölümü
        </label>
        <select onchange="changeSmartPageSection(this.value)" class="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer">
          ${sections.map(sec => `
            <option value="${sec.id}" ${sec.id === curSec ? 'selected' : ''}>${sec.label}</option>
          `).join('')}
        </select>
      </div>

      <!-- 3 Sütunlu Görsel Şema (Wireframe) Izgarası -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[10.5px] font-bold text-slate-300">Görsel Şemaya Tıklayarak Uygula:</span>
          <span class="text-[10px] text-amber-400 font-bold">${layouts.length} Şema</span>
        </div>
        <div class="grid grid-cols-3 gap-2 max-h-[270px] overflow-y-auto pr-1">
          ${layouts.map((ly, idx) => {
            const isAct = (curLayout === ly.id) || (!page.layout && idx === 0);
            return `
              <button onclick="selectSmartPageLayout('${ly.id}')" class="p-1.5 rounded-xl border transition flex flex-col items-center gap-1 group ${isAct ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-slate-600'}" title="${ly.name} — ${ly.desc}">
                ${buildLayoutWireframeSvg(ly.id, idx)}
                <span class="text-[9.5px] font-bold truncate w-full text-center ${isAct ? 'text-amber-300' : 'text-slate-300 group-hover:text-white'}">${idx + 1}. ${ly.name.split(' ')[0]}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- 2. SAYFA BAŞLIĞI VE ARKA PLAN RENGİ -->
    <div class="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-3 text-xs">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="font-bold text-white flex items-center gap-1.5">
          <i class="ph ph-palette text-blue-400 text-base"></i> Sayfa Başlığı & Zemin Rengi
        </span>
        <button onclick="openModal('tocModal')" class="text-[10px] text-indigo-400 hover:underline font-bold">İçindekileri Yönet →</button>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-slate-400 mb-1">Sayfa Başlığı (İçindekiler ile Senkron)</label>
        <input type="text" value="${escapeAttr(getCleanDisplayTitleForPage(page, selectedEditIndex))}" oninput="syncTocEntryToPageAndTocCanvas(${selectedEditIndex}, 'title', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none">
      </div>

      <div class="flex items-center justify-between pt-1">
        <span class="text-slate-300 font-semibold">Sayfa Arka Plan Rengi</span>
        <div class="flex items-center gap-1.5">
          <input type="color" value="${bgHex}" oninput="setFabricPageBackgroundColor(this.value)" class="w-7 h-7 rounded cursor-pointer bg-transparent border border-slate-700">
          <input type="text" value="${bgHex}" onchange="setFabricPageBackgroundColor(this.value)" class="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-mono text-white text-center">
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1.5 pt-1">
        ${['#ffffff', '#f4f2ee', '#f8fafc', '#fffbeb', '#fef2f2', '#0f172a', '#1c1917'].map(col => `
          <button onclick="setFabricPageBackgroundColor('${col}')" class="h-6 rounded-lg border border-slate-700 transition transform hover:scale-105" style="background:${col};" title="${col}"></button>
        `).join('')}
      </div>
    </div>

    <!-- 3. KULLANIM İPUCU -->
    <div class="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-3 text-[11px] text-indigo-200 leading-relaxed space-y-1">
      <div class="font-bold text-amber-300 flex items-center gap-1.5">
        <i class="ph ph-sparkle text-sm"></i> Yapay Zeka İpucu (DeepSeek + Gemini Vision)
      </div>
      <p>Sayfadaki <strong>herhangi bir resme veya yazıya tıkladığınızda</strong> burada <strong>AI Sihirli Komut Çubuğu</strong> açılır. Doğal dille <em>"sağa çevir, siyah beyaz yap, ortala, imla hatalarını düzelt, resmi dile çevir"</em> yazarak anında düzenleyebilirsiniz.</p>
    </div>
  `;

  if (typeof renderSmartLeftDrawerTemplates === 'function') {
    renderSmartLeftDrawerTemplates();
  }
};

// Sol "Şablon" Çekmecesini de Görsel Şemalı (Wireframe) Hale Getir
window.renderSmartLeftDrawerTemplates = function() {
  const drawer = document.getElementById('drawerTemplatesList');
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!drawer || !page) return;

  const curSec = typeof normalizeSmartSectionType === 'function' ? normalizeSmartSectionType(page.type) : (page.type || 'article');
  const sections = window.SMART_PAGE_SECTIONS || [];
  const secMeta = sections.find(s => s.id === curSec) || sections[3] || { id: 'article', short: 'Makale', label: 'Makale' };
  const layouts = (window.SMART_LAYOUT_CATALOG && window.SMART_LAYOUT_CATALOG[curSec]) || [];
  const curLayout = page.layout || layouts[0]?.id;

  drawer.innerHTML = `
    <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 mb-2">
      <div class="text-[11px] font-bold text-amber-300 flex items-center justify-between">
        <span>Sayfa ${selectedEditIndex + 1}: ${secMeta.short}</span>
        <span class="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">${layouts.length} Şema</span>
      </div>
      <select onchange="changeSmartPageSection(this.value)" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] font-bold text-white">
        ${sections.map(sec => `
          <option value="${sec.id}" ${sec.id === curSec ? 'selected' : ''}>${sec.label}</option>
        `).join('')}
      </select>
    </div>
    <div class="grid grid-cols-2 gap-2">
      ${layouts.map((ly, idx) => {
        const isAct = (curLayout === ly.id) || (!page.layout && idx === 0);
        return `
          <button onclick="selectSmartPageLayout('${ly.id}')" class="text-left p-2 rounded-xl border transition flex flex-col gap-1.5 ${isAct ? 'bg-amber-600/25 border-amber-500 text-white' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'}">
            ${buildLayoutWireframeSvg(ly.id, idx)}
            <div class="font-bold text-[10.5px] truncate">${idx + 1}. ${ly.name}</div>
            <div class="text-[9.5px] text-slate-400 line-clamp-2 leading-tight">${ly.desc}</div>
          </button>
        `;
      }).join('')}
    </div>
  `;
};

// Sayfa yüklendiğinde Sol "Öğeler" Çekmecesine Canva Izgara & Çerçeveleri ekle ve Sayfa 4 (İçindekiler) eski 1- 2- kutusunu temizle
function initProExtensions() {
  injectCanvaGridsAndFramesIntoDrawer();
  // Eğer mevcut derginin Sayfa 4 (toc) sayfasında eski fabricJSON veya elements kalıntısı varsa temizle
  if (window.magazineData && Array.isArray(magazineData.pages)) {
    magazineData.pages.forEach((p, idx) => {
      if (p.type === 'toc') {
        p.elements = [];
        if (p.fabricJSON && JSON.stringify(p.fabricJSON).includes('1-')) {
          delete p.fabricJSON;
          const c = window.fabricCanvases && window.fabricCanvases[idx];
          if (c && typeof buildFabricObjectsForTemplatePage === 'function') {
            buildFabricObjectsForTemplatePage(p, idx, c, () => c.requestRenderAll());
          }
        }
      }
    });
  }
  if (typeof renderRightEditorPanel === 'function') {
    renderRightEditorPanel();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initProExtensions, 200));
} else {
  setTimeout(initProExtensions, 200);
}
