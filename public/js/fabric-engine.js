// ============================================================================
// DERGİMİZ PROFESYONEL FABRIC.JS TUVAL, ŞABLON VE BAĞLAMA DUYARLI DENETÇİ MOTORU
// ============================================================================

const FABRIC_W = 550;
const FABRIC_H = 778;

const FABRIC_CUSTOM_PROPS = [
  'id',
  'name',
  'customType',
  'fieldKey',
  'actionType',
  'actionValue',
  'popupTitle',
  'popupText',
  'maskType',
  'cornerRadiusPx',
  'filterBrightness',
  'filterContrast',
  'filterSaturation',
  'filterBlur',
  'filterPreset',
  'lockUniScaling',
  'textAnimation',
  'isLoopVideo',
  'videoUrl',
  'audioUrl',
  'isGridSlot',
  'isMasterPageObject'
];

// Sayfa bazlı aktif Fabric.Canvas örnekleri
window.fabricCanvases = {};
window.activeFabricCanvas = null;
window.activeFabricPageIndex = 0;

// Undo / Redo geçmişi (Sayfa bazlı JSON yığını)
const fabricHistoryMap = {};
let isRestoringFabricState = false;

// Fabric.js Varsayılan Seçim Çerçevesi ve 8 Kulakçık Görünümü (Canva / FlipHTML5 Stili)
if (window.fabric) {
  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#ffffff',
    cornerStrokeColor: '#2563eb',
    borderColor: '#2563eb',
    cornerSize: 10,
    cornerStyle: 'circle',
    borderScaleFactor: 2,
    padding: 4,
    rotatingPointOffset: 26
  });

  // Textbox üzerinde 8 kulakçığın tamamını aktif et
  if (fabric.Textbox && fabric.Textbox.prototype.controls) {
    fabric.Textbox.prototype.setControlsVisibility({
      mt: true,
      mb: true,
      ml: true,
      mr: true,
      tl: true,
      tr: true,
      bl: true,
      br: true,
      mtr: true
    });
  }
}

// ============================================================================
// 1. SAYFA TUVALİ OLUŞTURMA VE DUYARLI (RESPONSIVE) ÖLÇEKLEME
// ============================================================================
function createPageDOM(page, pageIndex, position, heightClass) {
  const wrapper = document.createElement('div');
  const posClass = position === 'left' ? 'page-left' : (position === 'right' ? 'page-right' : 'page-single');
  const isSelected = (appMode === 'edit' && pageIndex === selectedEditIndex);
  const ring = isSelected ? 'ring-4 ring-blue-500 z-10' : 'hover:ring-2 hover:ring-blue-400/50';

  wrapper.className = `magazine-page ${posClass} ${heightClass} bg-white text-slate-900 flex flex-col justify-between animate-curl relative select-none ${appMode === 'edit' ? ring : ''}`;
  wrapper.dataset.pageIndex = pageIndex;

  let spineHtml = '';
  if (position === 'left') spineHtml = '<div class="spine-shadow-left"></div>';
  if (position === 'right') spineHtml = '<div class="spine-shadow-right"></div>';

  const curlCornerHtml = '<div class="page-curl-corner"></div>';
  const gridHtml = (showGridGuide && appMode === 'edit') ? '<div class="page-grid-overlay"></div>' : '';

  wrapper.innerHTML = `
    ${spineHtml}
    ${curlCornerHtml}
    ${gridHtml}
    <div class="flex-1 w-full h-full relative overflow-hidden page-content-root flex items-center justify-center" id="fabricHost_${pageIndex}">
      <canvas id="fabricCanvas_${pageIndex}"></canvas>
      <div class="canvas-elements-layer absolute inset-0 pointer-events-none" id="elemLayer_${pageIndex}"></div>
    </div>
  `;

  wrapper.addEventListener('mousedown', () => {
    if (appMode === 'edit' && selectedEditIndex !== pageIndex) {
      selectedEditIndex = pageIndex;
      window.activeFabricPageIndex = pageIndex;
      window.activeFabricCanvas = window.fabricCanvases[pageIndex] || null;
      document.querySelectorAll('.magazine-page').forEach(p => {
        const idx = Number(p.dataset.pageIndex);
        if (idx === selectedEditIndex) {
          p.classList.add('ring-4', 'ring-blue-500', 'z-10');
        } else {
          p.classList.remove('ring-4', 'ring-blue-500', 'z-10');
        }
      });
      renderSidebarThumbs();
      renderRightEditorPanel();
    }
  });

  setTimeout(() => initFabricForPageDOM(page, pageIndex, wrapper), 0);
  return wrapper;
}

function syncFabricCanvasScale(pageIndex, wrapper) {
  const fCanvas = window.fabricCanvases[pageIndex];
  if (!fCanvas) return;
  const host = wrapper || document.getElementById(`fabricHost_${pageIndex}`)?.closest('.magazine-page');
  if (!host) return;

  const zoomWrapper = document.getElementById('magazineZoomWrapper');
  if (zoomWrapper) {
    zoomWrapper.style.transform = 'none';
  }

  const zoomPct = Number(window.canvasZoom || window.canvasZoomPercent || 100);
  const vhRatio = (window.appMode === 'read' || window.isZenMode) ? 0.82 : 0.75;
  const baseH = Math.max(440, Math.min(860, Math.round(window.innerHeight * vhRatio)));
  const baseW = Math.round(baseH * (FABRIC_W / FABRIC_H));

  const displayW = Math.round(baseW * (zoomPct / 100));
  const displayH = Math.round(baseH * (zoomPct / 100));
  const scale = displayW / FABRIC_W;

  host.style.width = `${displayW}px`;
  host.style.height = `${displayH}px`;

  fCanvas.setDimensions({ width: displayW, height: displayH });
  fCanvas.setZoom(scale);
  fCanvas.calcOffset();
  fCanvas.requestRenderAll();
}

window.addEventListener('resize', () => {
  Object.keys(window.fabricCanvases).forEach(idx => {
    syncFabricCanvasScale(Number(idx));
  });
});

function initFabricForPageDOM(page, pageIndex, wrapper) {
  if (!window.fabric || !page) return;
  const canvasEl = wrapper.querySelector(`#fabricCanvas_${pageIndex}`);
  if (!canvasEl) return;

  if (window.fabricCanvases[pageIndex]) {
    try { window.fabricCanvases[pageIndex].dispose(); } catch (e) {}
  }

  const isEditable = (appMode === 'edit' && canUserEditPage(page));

  const fCanvas = new fabric.Canvas(canvasEl, {
    width: FABRIC_W,
    height: FABRIC_H,
    backgroundColor: page.bgColor || '#ffffff',
    preserveObjectStacking: true,
    selection: isEditable,
    stopContextMenu: true
  });

  window.fabricCanvases[pageIndex] = fCanvas;
  if (pageIndex === selectedEditIndex) {
    window.activeFabricCanvas = fCanvas;
    window.activeFabricPageIndex = pageIndex;
  }

  syncFabricCanvasScale(pageIndex, wrapper);
  attachSmartAlignmentGuides(fCanvas);
  attachFabricCanvasEvents(fCanvas, page, pageIndex);

  // KULLANICI BU SAYFADA BİR ŞEY SİLMİŞ, DEĞİŞTİRMİŞ VEYA BOŞ BIRAKMIŞSA (isCustomized VEYA fabricJSON VARSA)
  // ASLA buildFabricObjectsForTemplatePage ÇAĞRILMAZ! SİLİNEN ÖĞELER GERİ GELMEZ!
  const hasSavedState = Boolean(page.isCustomized || (page.fabricJSON && Array.isArray(page.fabricJSON.objects)));

  if (hasSavedState) {
    isRestoringFabricState = true;
    const jsonToLoad = page.fabricJSON || { version: "5.3.0", objects: [] };
    fCanvas.loadFromJSON(jsonToLoad, () => {
      applyReadOrEditModeToCanvas(fCanvas, isEditable);
      fCanvas.requestRenderAll();
      isRestoringFabricState = false;
      pushFabricHistory(pageIndex);
      if (pageIndex === selectedEditIndex) {
        renderRightEditorPanel();
        if (typeof renderLayersPopover === 'function') renderLayersPopover();
      }
    });
  } else {
    buildFabricObjectsForTemplatePage(page, pageIndex, fCanvas, () => {
      page.isCustomized = true; // İlk kez oluştuktan sonra artık özelleştirildi olarak mühürlenir
      applyReadOrEditModeToCanvas(fCanvas, isEditable);
      fCanvas.requestRenderAll();
      saveFabricPageState(pageIndex, true);
      pushFabricHistory(pageIndex);
      if (pageIndex === selectedEditIndex) {
        renderRightEditorPanel();
        if (typeof renderLayersPopover === 'function') renderLayersPopover();
      }
    });
  }
}

function applyReadOrEditModeToCanvas(fCanvas, isEditable) {
  fCanvas.selection = isEditable;
  fCanvas.forEachObject(obj => {
    if (obj.controls && obj.type === 'textbox') {
      obj.setControlsVisibility({
        mt: true, mb: true, ml: true, mr: true, tl: true, tr: true, bl: true, br: true, mtr: true
      });
    }
    const isLocked = Boolean(obj.lockedByUser);
    obj.selectable = isEditable && !isLocked;
    obj.evented = isEditable ? !isLocked : Boolean(obj.actionType && obj.actionType !== 'none');
    if (!isEditable && obj.actionType && obj.actionType !== 'none') {
      obj.hoverCursor = 'pointer';
    } else {
      obj.hoverCursor = isLocked ? 'not-allowed' : 'move';
    }
  });
}

// ============================================================================
// 2. AKILLI HİZALAMA KILAVUZ ÇİZGİLERİ (MIKNATISLI SNAP REHBERİ) & OLAYLAR
// ============================================================================
function attachSmartAlignmentGuides(fCanvas) {
  let vLine = null;
  let hLine = null;
  const SNAP_DIST = 6;

  function clearGuideLines() {
    if (vLine) { fCanvas.remove(vLine); vLine = null; }
    if (hLine) { fCanvas.remove(hLine); hLine = null; }
  }

  fCanvas.on('object:moving', (e) => {
    const activeObj = e.target;
    if (!activeObj) return;
    clearGuideLines();

    const center = activeObj.getCenterPoint();
    let snappedX = false;
    let snappedY = false;

    // Sayfa Yatay & Dikey Merkezine Mıknatıslama
    if (Math.abs(center.x - FABRIC_W / 2) < SNAP_DIST) {
      activeObj.setPositionByOrigin(new fabric.Point(FABRIC_W / 2, center.y), 'center', 'center');
      snappedX = FABRIC_W / 2;
    }
    const updatedCenter = activeObj.getCenterPoint();
    if (Math.abs(updatedCenter.y - FABRIC_H / 2) < SNAP_DIST) {
      activeObj.setPositionByOrigin(new fabric.Point(updatedCenter.x, FABRIC_H / 2), 'center', 'center');
      snappedY = FABRIC_H / 2;
    }

    // Diğer Nesnelerin Merkezlerine Mıknatıslama
    fCanvas.getObjects().forEach(other => {
      if (other === activeObj || other.isGuideLine || !other.visible) return;
      const oc = other.getCenterPoint();
      const cNow = activeObj.getCenterPoint();
      if (!snappedX && Math.abs(cNow.x - oc.x) < SNAP_DIST) {
        activeObj.setPositionByOrigin(new fabric.Point(oc.x, cNow.y), 'center', 'center');
        snappedX = oc.x;
      }
      const cNow2 = activeObj.getCenterPoint();
      if (!snappedY && Math.abs(cNow2.y - oc.y) < SNAP_DIST) {
        activeObj.setPositionByOrigin(new fabric.Point(cNow2.x, oc.y), 'center', 'center');
        snappedY = oc.y;
      }
    });

    if (snappedX !== false) {
      vLine = new fabric.Line([snappedX, 0, snappedX, FABRIC_H], {
        stroke: '#ec4899',
        strokeWidth: 1.2,
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
        excludeFromExport: true,
        isGuideLine: true
      });
      fCanvas.add(vLine);
    }
    if (snappedY !== false) {
      hLine = new fabric.Line([0, snappedY, FABRIC_W, snappedY], {
        stroke: '#ec4899',
        strokeWidth: 1.2,
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
        excludeFromExport: true,
        isGuideLine: true
      });
      fCanvas.add(hLine);
    }
    activeObj.setCoords();
  });

  fCanvas.on('mouse:up', () => {
    clearGuideLines();
    fCanvas.requestRenderAll();
  });
}

function attachFabricCanvasEvents(fCanvas, page, pageIndex) {
  // Metin kutularını (Textbox / IText) köşelerinden veya alt/üstten küçültürken/büyütürken yazı puntosunu da orantılı ölçekle
  fCanvas.on('object:scaling', (e) => {
    const obj = e.target;
    if (!obj) return;
    if (obj.type === 'textbox' || obj.type === 'i-text') {
      const corner = e.transform?.corner || '';
      if (['tl', 'tr', 'bl', 'br'].includes(corner)) {
        // Köşeden çekildiğinde hem kutu genişliği hem fontSize orantılı büyür/küçülür
        const scale = obj.scaleX || 1;
        const newFontSize = Math.max(8, Math.min(180, Math.round((obj.fontSize || 16) * scale)));
        const newWidth = Math.max(30, Math.round((obj.width || 120) * scale));
        obj.set({
          fontSize: newFontSize,
          width: newWidth,
          scaleX: 1,
          scaleY: 1
        });
      } else if (corner === 'ml' || corner === 'mr') {
        // Yan kulakçıklardan çekildiğinde sadece sütun genişliği değişir
        const newWidth = Math.max(30, Math.round((obj.width || 120) * (obj.scaleX || 1)));
        obj.set({
          width: newWidth,
          scaleX: 1,
          scaleY: 1
        });
      } else if (corner === 'mt' || corner === 'mb') {
        const scaleY = obj.scaleY || 1;
        const newFontSize = Math.max(8, Math.min(180, Math.round((obj.fontSize || 16) * scaleY)));
        obj.set({
          fontSize: newFontSize,
          scaleX: 1,
          scaleY: 1
        });
      }
    }
    syncLiveGeometryInputs(obj);
  });

  fCanvas.on('object:moving', (e) => {
    if (e.target) {
      syncLiveGeometryInputs(e.target);
      // Metin Akıtma (Text Wrap / Runaround): Engel sürüklendikçe etrafındaki metinleri otomatik akıt
      if (e.target.isTextWrap && typeof applyTextWrapEngine === 'function') {
        applyTextWrapEngine(fCanvas, e.target);
      }
      // Drop Cap (Büyük Baş Harf) Senkronize Taşıma
      if (e.target._dropCapObj) {
        const dc = e.target._dropCapObj;
        const dcW = dc.getScaledWidth() || 40;
        dc.set({ left: e.target.left - dcW - 8, top: e.target.top - 2 });
        dc.setCoords();
      } else if (e.target._parentTextObj) {
        const pTxt = e.target._parentTextObj;
        const dcW = e.target.getScaledWidth() || 40;
        pTxt.set({ left: e.target.left + dcW + 8, top: e.target.top + 2 });
        pTxt.setCoords();
      }
    }
  });

  fCanvas.on('mouse:dblclick', (e) => {
    if (e.target && (e.target.isGridSlot || e.target.customType === 'photo_slot')) {
      fCanvas.setActiveObject(e.target);
      document.getElementById('gridSlotFileInput')?.click();
    }
  });

  fCanvas.on('object:rotating', (e) => {
    if (e.target) syncLiveGeometryInputs(e.target);
  });

  fCanvas.on('selection:created', () => {
    selectedEditIndex = pageIndex;
    window.activeFabricCanvas = fCanvas;
    window.activeFabricPageIndex = pageIndex;
    // Diğer açık tuvallerdeki aktif seçimleri temizle (Çift sayfa modunda çakışmayı önle)
    Object.keys(window.fabricCanvases).forEach(pIdx => {
      if (Number(pIdx) !== pageIndex && window.fabricCanvases[pIdx]) {
        try { window.fabricCanvases[pIdx].discardActiveObject(); window.fabricCanvases[pIdx].requestRenderAll(); } catch(e){}
      }
    });
    updateActiveSelectionBadge(fCanvas);
    renderRightEditorPanel();
    if (typeof renderLayersPopover === 'function') renderLayersPopover();
  });

  fCanvas.on('selection:updated', () => {
    selectedEditIndex = pageIndex;
    window.activeFabricCanvas = fCanvas;
    window.activeFabricPageIndex = pageIndex;
    Object.keys(window.fabricCanvases).forEach(pIdx => {
      if (Number(pIdx) !== pageIndex && window.fabricCanvases[pIdx]) {
        try { window.fabricCanvases[pIdx].discardActiveObject(); window.fabricCanvases[pIdx].requestRenderAll(); } catch(e){}
      }
    });
    updateActiveSelectionBadge(fCanvas);
    renderRightEditorPanel();
    if (typeof renderLayersPopover === 'function') renderLayersPopover();
  });

  fCanvas.on('selection:cleared', () => {
    updateActiveSelectionBadge(fCanvas);
    renderRightEditorPanel();
    if (typeof renderLayersPopover === 'function') renderLayersPopover();
  });

  fCanvas.on('object:modified', (e) => {
    if (isRestoringFabricState) return;
    if (e && e.target && e.target.isTextWrap && typeof applyTextWrapEngine === 'function') {
      applyTextWrapEngine(fCanvas, e.target);
    }
    saveFabricPageState(pageIndex);
    pushFabricHistory(pageIndex);
    renderRightEditorPanel();
  });

  fCanvas.on('text:changed', (e) => {
    if (isRestoringFabricState) return;
    const obj = e.target;
    if (obj && obj.fieldKey && magazineData.pages[pageIndex]) {
      magazineData.pages[pageIndex][obj.fieldKey] = obj.text;
    }
    saveFabricPageState(pageIndex);
  });

  // Sağ Tık (Context Menu) Dinleyicisi
  if (fCanvas.upperCanvasEl) {
    fCanvas.upperCanvasEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openFabricContextMenu(e, fCanvas, pageIndex);
    });
  }

  // Okuma modunda tıklama eylemlerini çalıştır + Sağ tık yakalama
  fCanvas.on('mouse:down', (opt) => {
    if (opt.e && (opt.e.button === 2 || opt.e.which === 3)) {
      opt.e.preventDefault();
      opt.e.stopPropagation();
      openFabricContextMenu(opt.e, fCanvas, pageIndex);
      return;
    }
    if (appMode === 'read' && opt.target && opt.target.actionType && opt.target.actionType !== 'none') {
      triggerElementAction(opt.target);
    }
  });
}

function updateActiveSelectionBadge(fCanvas) {
  const badge = document.getElementById('activeSelectionBadge');
  if (!badge) return;
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) {
    badge.textContent = 'Sayfa Seçili';
    badge.className = 'text-[10px] text-slate-400 font-mono font-bold truncate max-w-[130px]';
    return;
  }
  if (active.type === 'activeSelection') {
    badge.textContent = `Çoklu Seçim (${active.getObjects().length})`;
    badge.className = 'text-[10px] text-purple-400 font-mono font-bold truncate max-w-[130px]';
  } else if (active.type === 'group') {
    badge.textContent = 'Grup Nesnesi';
    badge.className = 'text-[10px] text-indigo-400 font-mono font-bold truncate max-w-[130px]';
  } else if (active.type === 'image') {
    badge.textContent = `Görsel • ${active.name || 'Fotoğraf'}`;
    badge.className = 'text-[10px] text-sky-400 font-mono font-bold truncate max-w-[130px]';
  } else if (active.type === 'textbox' || active.type === 'i-text') {
    badge.textContent = `Metin • ${(active.text || '').substring(0, 12)}`;
    badge.className = 'text-[10px] text-amber-400 font-mono font-bold truncate max-w-[130px]';
  } else {
    badge.textContent = `Şekil • ${active.name || active.type}`;
    badge.className = 'text-[10px] text-emerald-400 font-mono font-bold truncate max-w-[130px]';
  }
}

function syncLiveGeometryInputs(obj) {
  if (!obj) return;
  const inpX = document.getElementById('fabInpX');
  const inpY = document.getElementById('fabInpY');
  const inpW = document.getElementById('fabInpW');
  const inpH = document.getElementById('fabInpH');
  const inpAngle = document.getElementById('fabInpAngle');
  const lblAngle = document.getElementById('fabLblAngle');
  const inpFs = document.getElementById('fabInpFontSize');

  if (inpX) inpX.value = Math.round(obj.left || 0);
  if (inpY) inpY.value = Math.round(obj.top || 0);
  if (inpW) inpW.value = Math.round(obj.getScaledWidth());
  if (inpH) inpH.value = Math.round(obj.getScaledHeight());
  const ang = Math.round(obj.angle || 0);
  if (inpAngle) inpAngle.value = ang > 180 ? ang - 360 : ang;
  if (lblAngle) lblAngle.textContent = `${ang}°`;
  if (inpFs && obj.fontSize) inpFs.value = Math.round(obj.fontSize);
}

// ============================================================================
// 3. KAYDETME VE UNDO / REDO MOTORU
// ============================================================================
function saveFabricPageState(pageIndex, skipServer = false) {
  const fCanvas = window.fabricCanvases[pageIndex];
  const page = magazineData?.pages?.[pageIndex];
  if (!fCanvas || !page) return;

  page.isCustomized = true; // Sayfa üzerinde herhangi bir değişiklik veya silme yapıldığında kalıcı mühürlenir
  // Rehber çizgilerini hariç tutarak JSON kaydet
  const json = fCanvas.toJSON(FABRIC_CUSTOM_PROPS);
  json.objects = (json.objects || []).filter(o => !o.isGuideLine);
  page.fabricJSON = json;

  if (!skipServer && typeof debouncedSave === 'function') {
    debouncedSave();
  }
}

function pushFabricHistory(pageIndex) {
  const fCanvas = window.fabricCanvases[pageIndex];
  if (!fCanvas || isRestoringFabricState) return;
  if (!fabricHistoryMap[pageIndex]) {
    fabricHistoryMap[pageIndex] = { stack: [], index: -1 };
  }
  const h = fabricHistoryMap[pageIndex];
  const jsonObj = fCanvas.toJSON(FABRIC_CUSTOM_PROPS);
  jsonObj.objects = (jsonObj.objects || []).filter(o => !o.isGuideLine);
  const serialized = JSON.stringify(jsonObj);

  if (h.index >= 0 && h.stack[h.index] === serialized) return;
  h.stack = h.stack.slice(0, h.index + 1);
  h.stack.push(serialized);
  if (h.stack.length > 35) h.stack.shift();
  h.index = h.stack.length - 1;
}

function undoAction() {
  const pageIndex = selectedEditIndex;
  const fCanvas = window.fabricCanvases[pageIndex];
  const h = fabricHistoryMap[pageIndex];
  if (!fCanvas || !h || h.index <= 0) {
    showToast('Geri alınacak başka adım yok.');
    return;
  }
  h.index--;
  isRestoringFabricState = true;
  fCanvas.loadFromJSON(JSON.parse(h.stack[h.index]), () => {
    fCanvas.requestRenderAll();
    isRestoringFabricState = false;
    saveFabricPageState(pageIndex);
    renderRightEditorPanel();
  });
}

function redoAction() {
  const pageIndex = selectedEditIndex;
  const fCanvas = window.fabricCanvases[pageIndex];
  const h = fabricHistoryMap[pageIndex];
  if (!fCanvas || !h || h.index >= h.stack.length - 1) {
    showToast('İleri alınacak adım yok.');
    return;
  }
  h.index++;
  isRestoringFabricState = true;
  fCanvas.loadFromJSON(JSON.parse(h.stack[h.index]), () => {
    fCanvas.requestRenderAll();
    isRestoringFabricState = false;
    saveFabricPageState(pageIndex);
    renderRightEditorPanel();
  });
}

// ============================================================================
// 4. GÜVENLİ GÖRSEL YÜKLEYİCİ, MASKELEME, KIRPMA VE FİLTRE MOTORU
// ============================================================================
function createMaskClipPathForObject(obj, maskType, radiusPx) {
  const w = obj.width || 200;
  const h = obj.height || 200;
  const r = Math.min(w, h) / 2;

  if (maskType === 'circle') {
    return new fabric.Circle({
      radius: r,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }
  if (maskType === 'ellipse') {
    return new fabric.Ellipse({
      rx: w * 0.48,
      ry: h * 0.46,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }
  if (maskType === 'triangle') {
    return new fabric.Triangle({
      width: w,
      height: h,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }
  if (maskType === 'diamond') {
    return new fabric.Polygon([
      { x: 0, y: -h / 2 },
      { x: w / 2, y: 0 },
      { x: 0, y: h / 2 },
      { x: -w / 2, y: 0 }
    ], {
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }
  if (maskType === 'hexagon') {
    return new fabric.Polygon([
      { x: -w * 0.25, y: -h / 2 },
      { x: w * 0.25, y: -h / 2 },
      { x: w / 2, y: 0 },
      { x: w * 0.25, y: h / 2 },
      { x: -w * 0.25, y: h / 2 },
      { x: -w / 2, y: 0 }
    ], {
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }
  if (maskType === 'octagon') {
    return new fabric.Polygon([
      { x: -w * 0.22, y: -h / 2 },
      { x: w * 0.22, y: -h / 2 },
      { x: w / 2, y: -h * 0.22 },
      { x: w / 2, y: h * 0.22 },
      { x: w * 0.22, y: h / 2 },
      { x: -w * 0.22, y: h / 2 },
      { x: -w / 2, y: h * 0.22 },
      { x: -w / 2, y: -h * 0.22 }
    ], {
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }
  if (maskType === 'star') {
    const pts = [];
    const outerR = r;
    const innerR = r * 0.45;
    for (let i = 0; i < 10; i++) {
      const ang = (Math.PI / 5) * i - Math.PI / 2;
      const radUse = i % 2 === 0 ? outerR : innerR;
      pts.push({ x: Math.cos(ang) * radUse, y: Math.sin(ang) * radUse });
    }
    return new fabric.Polygon(pts, {
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }
  if (maskType === 'arch') {
    const pts = [];
    for (let i = 0; i <= 18; i++) {
      const ang = Math.PI + (Math.PI * i) / 18;
      pts.push({
        x: Math.cos(ang) * (w / 2),
        y: -h * 0.05 + Math.sin(ang) * (h * 0.45)
      });
    }
    pts.push({ x: w / 2, y: h / 2 });
    pts.push({ x: -w / 2, y: h / 2 });
    return new fabric.Polygon(pts, {
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }
  if (maskType === 'rounded') {
    const scaleX = obj.scaleX || 1;
    const scaleY = obj.scaleY || 1;
    return new fabric.Rect({
      width: w,
      height: h,
      rx: 36 / scaleX,
      ry: 36 / scaleY,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }

  // Normal dikdörtgen + köşe yuvarlatma (cornerRadiusPx)
  const rad = Number(radiusPx) || 0;
  if (rad > 0) {
    const scaleX = obj.scaleX || 1;
    const scaleY = obj.scaleY || 1;
    return new fabric.Rect({
      width: w,
      height: h,
      rx: rad / scaleX,
      ry: rad / scaleY,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });
  }
  return null;
}

function applyImageCornerAndMask(imgObj, maskType, radiusPx) {
  if (!imgObj) return;
  imgObj.maskType = maskType !== undefined ? maskType : (imgObj.maskType || 'none');
  imgObj.cornerRadiusPx = radiusPx !== undefined ? Number(radiusPx) : (imgObj.cornerRadiusPx || 0);
  imgObj.clipPath = createMaskClipPathForObject(imgObj, imgObj.maskType, imgObj.cornerRadiusPx);
  imgObj.dirty = true;
}

function loadFabricImageIntoSlot(fCanvas, url, fallbackUrl, opts, onDone) {
  const targetUrl = url || fallbackUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const boxX = opts.left || 40;
  const boxY = opts.top || 40;
  const boxW = opts.width || 220;
  const boxH = opts.height || 260;

  function placeImg(img) {
    if (!img || !img.width) {
      if (onDone) onDone(null);
      return;
    }
    // Object-fit: cover etkisi için merkezden en-boy oranına göre kırp
    const natW = img.width;
    const natH = img.height;
    const targetRatio = boxW / boxH;
    const natRatio = natW / natH;

    let cropX = 0;
    let cropY = 0;
    let cropW = natW;
    let cropH = natH;

    if (natRatio > targetRatio) {
      cropW = Math.round(natH * targetRatio);
      cropX = Math.round((natW - cropW) / 2);
    } else {
      cropH = Math.round(natW / targetRatio);
      cropY = Math.round((natH - cropH) / 2);
    }

    img.set({
      id: opts.id || ('img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)),
      name: opts.name || 'Görsel',
      fieldKey: opts.fieldKey || null,
      customType: 'image',
      left: boxX,
      top: boxY,
      cropX: cropX,
      cropY: cropY,
      width: cropW,
      height: cropH,
      scaleX: boxW / cropW,
      scaleY: boxH / cropH,
      angle: opts.angle || 0,
      opacity: opts.opacity !== undefined ? opts.opacity : 1,
      stroke: opts.stroke || null,
      strokeWidth: opts.strokeWidth || 0,
      cornerRadiusPx: opts.radius !== undefined ? opts.radius : 12,
      maskType: opts.maskType || 'none'
    });

    if (opts.shadow) {
      img.set('shadow', new fabric.Shadow({
        color: 'rgba(15, 23, 42, 0.28)',
        blur: 18,
        offsetX: 0,
        offsetY: 8
      }));
    }

    applyImageCornerAndMask(img, img.maskType, img.cornerRadiusPx);
    if (opts.sendToBack) {
      fCanvas.insertAt(img, 0, false);
    } else {
      fCanvas.add(img);
    }
    if (onDone) onDone(img);
  }

  fabric.Image.fromURL(targetUrl, (img, isError) => {
    if (!isError && img && img.width) {
      placeImg(img);
    } else if (fallbackUrl && fallbackUrl !== targetUrl) {
      fabric.Image.fromURL(fallbackUrl, (img2) => placeImg(img2), { crossOrigin: 'anonymous' });
    } else {
      if (onDone) onDone(null);
    }
  }, { crossOrigin: 'anonymous' });
}

// ============================================================================
// 4B. CANVA IZGARALARI & ÇERÇEVELERİ (7 HAZIR MODEL & FIT TO SLOT)
// ============================================================================
function createGridSlotFabricObject(opts) {
  const isCircle = opts.maskType === 'circle';
  const isArch = opts.maskType === 'arch';
  const w = opts.width || 200;
  const h = opts.height || 200;

  let bgShape;
  if (isCircle) {
    bgShape = new fabric.Circle({
      radius: w / 2,
      fill: '#f8fafc',
      stroke: '#94a3b8',
      strokeWidth: 2,
      strokeDashArray: [6, 4],
      originX: 'center',
      originY: 'center'
    });
  } else if (isArch) {
    bgShape = new fabric.Rect({
      width: w,
      height: h,
      rx: w / 2,
      ry: w / 2,
      fill: '#f8fafc',
      stroke: '#94a3b8',
      strokeWidth: 2,
      strokeDashArray: [6, 4],
      originX: 'center',
      originY: 'center'
    });
  } else {
    bgShape = new fabric.Rect({
      width: w,
      height: h,
      rx: opts.cornerRadiusPx !== undefined ? opts.cornerRadiusPx : 12,
      ry: opts.cornerRadiusPx !== undefined ? opts.cornerRadiusPx : 12,
      fill: '#f8fafc',
      stroke: '#94a3b8',
      strokeWidth: 2,
      strokeDashArray: [6, 4],
      originX: 'center',
      originY: 'center'
    });
  }

  const labelText = isCircle ? '⭕\nPortre Bırakın\n(Dairesel)' : (isArch ? '🏛️\nFotoğraf Bırakın\n(Kemerli)' : '🖼️\nFotoğraf Bırakın\n(Canva Cover)');
  const label = new fabric.Textbox(labelText, {
    width: Math.max(80, w - 24),
    fontSize: Math.min(12, Math.max(9, Math.round(w / 15))),
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fill: '#64748b',
    textAlign: 'center',
    originX: 'center',
    originY: 'center'
  });

  const grp = new fabric.Group([bgShape, label], {
    left: opts.left,
    top: opts.top,
    name: opts.name || 'Izgara Çerçevesi',
    isGridSlot: true,
    customType: 'photo_slot',
    maskType: opts.maskType || 'none',
    cornerRadiusPx: opts.cornerRadiusPx !== undefined ? opts.cornerRadiusPx : 12
  });

  return grp;
}

function addCanvaGrid(gridType) {
  const fCanvas = getCurrentFabricCanvas();
  if (!fCanvas) return;
  pushFabricHistory(selectedEditIndex);

  const page = magazineData?.pages?.[selectedEditIndex];
  if (page) page.isCustomized = true;

  const canvasW = fCanvas.width || 550;
  const padX = 35;
  const topY = 120;
  const availW = canvasW - (padX * 2); // 480
  const availH = 500; // leaves header & footer room

  let slots = [];

  if (gridType === 'split_2_col') {
    // 1. 2'li Yan Yana Dikey Izgara
    const gap = 16;
    const slotW = (availW - gap) / 2; // 232
    slots.push(
      createGridSlotFabricObject({ left: padX, top: topY, width: slotW, height: availH, name: 'Sol Fotoğraf Alanı' }),
      createGridSlotFabricObject({ left: padX + slotW + gap, top: topY, width: slotW, height: availH, name: 'Sağ Fotoğraf Alanı' })
    );
    showToast('🖼️ 2\'li Yan Yana Dikey Izgara eklendi.');

  } else if (gridType === 'stack_2_row') {
    // 2. 2'li Alt Alta Yatay Izgara
    const gap = 16;
    const slotH = (availH - gap) / 2; // 242
    slots.push(
      createGridSlotFabricObject({ left: padX, top: topY, width: availW, height: slotH, name: 'Üst Yatay Fotoğraf' }),
      createGridSlotFabricObject({ left: padX, top: topY + slotH + gap, width: availW, height: slotH, name: 'Alt Yatay Fotoğraf' })
    );
    showToast('🖼️ 2\'li Alt Alta Yatay Izgara eklendi.');

  } else if (gridType === 't_grid_3') {
    // 3. 3'lü T-Izgara (Sol 1 büyük, sağ 2 küçük)
    const gap = 16;
    const colW = (availW - gap) / 2; // 232
    const subH = (availH - gap) / 2; // 242
    slots.push(
      createGridSlotFabricObject({ left: padX, top: topY, width: colW, height: availH, name: 'Sol Büyük Fotoğraf' }),
      createGridSlotFabricObject({ left: padX + colW + gap, top: topY, width: colW, height: subH, name: 'Sağ Üst Fotoğraf' }),
      createGridSlotFabricObject({ left: padX + colW + gap, top: topY + subH + gap, width: colW, height: subH, name: 'Sağ Alt Fotoğraf' })
    );
    showToast('🖼️ 3\'lü T-Izgara eklendi.');

  } else if (gridType === 'cols_3') {
    // 4. 3'lü Eşit Dikey Sütun Izgarası
    const gap = 14;
    const colW = Math.round((availW - (gap * 2)) / 3); // ~150
    slots.push(
      createGridSlotFabricObject({ left: padX, top: topY, width: colW, height: availH, name: '1. Sütun Fotoğrafı' }),
      createGridSlotFabricObject({ left: padX + colW + gap, top: topY, width: colW, height: availH, name: '2. Sütun Fotoğrafı' }),
      createGridSlotFabricObject({ left: padX + (colW + gap) * 2, top: topY, width: colW, height: availH, name: '3. Sütun Fotoğrafı' })
    );
    showToast('🖼️ 3\'lü Eşit Sütun Izgarası eklendi.');

  } else if (gridType === 'matrix_4') {
    // 5. 4'lü 2x2 Kolaj Izgarası
    const gap = 16;
    const cellW = (availW - gap) / 2; // 232
    const cellH = (availH - gap) / 2; // 242
    slots.push(
      createGridSlotFabricObject({ left: padX, top: topY, width: cellW, height: cellH, name: 'Sol Üst Fotoğraf' }),
      createGridSlotFabricObject({ left: padX + cellW + gap, top: topY, width: cellW, height: cellH, name: 'Sağ Üst Fotoğraf' }),
      createGridSlotFabricObject({ left: padX, top: topY + cellH + gap, width: cellW, height: cellH, name: 'Sol Alt Fotoğraf' }),
      createGridSlotFabricObject({ left: padX + cellW + gap, top: topY + cellH + gap, width: cellW, height: cellH, name: 'Sağ Alt Fotoğraf' })
    );
    showToast('🖼️ 4\'lü Kolaj Izgarası eklendi.');

  } else if (gridType === 'frame_circle') {
    // 6. Yuvarlak Dairesel Portre Çerçevesi
    const diam = 220;
    slots.push(
      createGridSlotFabricObject({
        left: Math.round((canvasW - diam) / 2),
        top: topY + 40,
        width: diam,
        height: diam,
        maskType: 'circle',
        cornerRadiusPx: diam / 2,
        name: 'Dairesel Portre Çerçevesi'
      })
    );
    showToast('⭕ Yuvarlak Dairesel Portre Çerçevesi eklendi.');

  } else if (gridType === 'frame_arch') {
    // 7. Kemerli Mimari Çerçeve (Arch Frame)
    const archW = 270;
    const archH = 380;
    slots.push(
      createGridSlotFabricObject({
        left: Math.round((canvasW - archW) / 2),
        top: topY + 20,
        width: archW,
        height: archH,
        maskType: 'arch',
        name: 'Kemerli Mimari Çerçeve'
      })
    );
    showToast('🏛️ Kemerli Mimari Çerçeve eklendi.');
  }

  slots.forEach(slot => fCanvas.add(slot));
  if (slots.length > 0) {
    fCanvas.setActiveObject(slots[0]);
  }
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  renderRightEditorPanel();
}

function fitImageIntoGridSlot(slot, imgSrc, fCanvas = null) {
  if (!fCanvas) fCanvas = getCurrentFabricCanvas();
  if (!fCanvas || !slot) return;

  pushFabricHistory(selectedEditIndex);
  showToast('🖼️ Fotoğraf ızgara hücresine tam oturtuluyor (Cover)...');

  fabric.Image.fromURL(imgSrc, (newImg) => {
    if (!newImg || !newImg.width) return;
    const targetW = slot.getScaledWidth() || slot.width || 200;
    const targetH = slot.getScaledHeight() || slot.height || 200;

    const natW = newImg.width;
    const natH = newImg.height;
    const targetRatio = targetW / targetH;
    const natRatio = natW / natH;

    let cropX = 0, cropY = 0, cropW = natW, cropH = natH;

    if (natRatio > targetRatio) {
      cropW = Math.round(natH * targetRatio);
      cropX = Math.round((natW - cropW) / 2);
    } else {
      cropH = Math.round(natW / targetRatio);
      cropY = Math.round((natH - cropH) / 2);
    }

    newImg.set({
      id: 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      left: slot.left,
      top: slot.top,
      cropX: cropX,
      cropY: cropY,
      width: cropW,
      height: cropH,
      scaleX: targetW / cropW,
      scaleY: targetH / cropH,
      originX: 'left',
      originY: 'top',
      angle: slot.angle || 0,
      opacity: slot.opacity !== undefined ? slot.opacity : 1,
      isGridSlot: true,
      name: slot.name || 'Izgara Fotoğrafı',
      cornerRadiusPx: slot.cornerRadiusPx !== undefined ? slot.cornerRadiusPx : 12,
      maskType: slot.maskType || 'none',
      isTextWrap: slot.isTextWrap || false,
      textWrapMargin: slot.textWrapMargin || 16
    });

    if (typeof applyImageCornerAndMask === 'function') {
      applyImageCornerAndMask(newImg, newImg.maskType, newImg.cornerRadiusPx);
    }

    fCanvas.remove(slot);
    fCanvas.add(newImg);
    fCanvas.setActiveObject(newImg);
    if (newImg.isTextWrap && typeof applyTextWrapEngine === 'function') {
      applyTextWrapEngine(fCanvas, newImg);
    }
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    renderRightEditorPanel();
    showToast('✨ Fotoğraf ızgara hücresine kusursuz sığdırıldı!');
  }, { crossOrigin: 'anonymous' });
}

// ============================================================================
// 4C. METİN AKITMA (TEXT WRAP / RUNAROUND) MOTORU (INDESIGN / QUARKXPRESS)
// ============================================================================
function toggleTextWrapOnActiveObject() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!fCanvas || !active) {
    showToast('⚠️ Lütfen önce etrafından metin akıtmak istediğiniz görsel veya kutuyu seçin.');
    return;
  }
  pushFabricHistory(selectedEditIndex);

  active.isTextWrap = !active.isTextWrap;
  if (active.isTextWrap && !active.textWrapMargin) {
    active.textWrapMargin = 16;
  }

  if (active.isTextWrap) {
    applyTextWrapEngine(fCanvas, active);
    showToast('🌊 Metin Akıtma (Text Wrap) AKTİF: Metin kutuları nesnenin etrafından akacak.');
  } else {
    restoreTextWrapEngine(fCanvas, active);
    showToast('Metin Akıtma kapatıldı.');
  }

  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  renderRightEditorPanel();
}

function updateActiveTextWrapMargin(val) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;
  active.textWrapMargin = Number(val) || 16;
  if (active.isTextWrap) {
    applyTextWrapEngine(fCanvas, active);
  }
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
}

function applyTextWrapEngine(fCanvas, obstacle) {
  if (!fCanvas || !obstacle || !obstacle.isTextWrap) return;
  const margin = Number(obstacle.textWrapMargin) || 16;

  const oLeft = obstacle.left - margin;
  const oTop = obstacle.top - margin;
  const oWidth = obstacle.getScaledWidth() + (margin * 2);
  const oHeight = obstacle.getScaledHeight() + (margin * 2);
  const oRight = oLeft + oWidth;
  const oBottom = oTop + oHeight;
  const oCenterX = obstacle.left + (obstacle.getScaledWidth() / 2);

  const canvasWidth = fCanvas.width || 550;
  const allObjects = fCanvas.getObjects();

  allObjects.forEach(obj => {
    if (obj === obstacle || obj.type !== 'textbox' || obj.isDropCap || obj.isGuideLine) return;

    const tLeft = obj.left;
    const tTop = obj.top;
    const tWidth = obj.getScaledWidth();
    const tHeight = obj.getScaledHeight();
    const tRight = tLeft + tWidth;
    const tBottom = tTop + tHeight;

    const verticalOverlap = (tTop < oBottom && tBottom > oTop);
    const horizontalOverlap = (tLeft < oRight && tRight > oLeft);

    if (verticalOverlap && horizontalOverlap) {
      if (!obj._origWrapGeometry) {
        obj._origWrapGeometry = {
          left: obj.left,
          top: obj.top,
          width: obj.width
        };
      }

      const origR = obj._origWrapGeometry.left + obj._origWrapGeometry.width;

      if (oCenterX < canvasWidth * 0.45 || oLeft <= obj.left + 50) {
        const newLeft = oRight;
        const availableW = Math.max(120, origR - newLeft);
        obj.set({
          left: newLeft,
          width: availableW
        });
      } else if (oCenterX > canvasWidth * 0.55 || oRight >= tRight - 50) {
        const availableW = Math.max(120, oLeft - obj._origWrapGeometry.left);
        obj.set({
          left: obj._origWrapGeometry.left,
          width: availableW
        });
      } else {
        obj.set({
          top: oBottom + 10
        });
      }
      obj.setCoords();
    }
  });

  fCanvas.requestRenderAll();
}

function restoreTextWrapEngine(fCanvas, obstacle) {
  if (!fCanvas) return;
  const allObjects = fCanvas.getObjects();
  allObjects.forEach(obj => {
    if (obj._origWrapGeometry) {
      obj.set({
        left: obj._origWrapGeometry.left,
        top: obj._origWrapGeometry.top,
        width: obj._origWrapGeometry.width
      });
      obj.setCoords();
      delete obj._origWrapGeometry;
    }
  });
  fCanvas.requestRenderAll();
}

function addQuarkRunaroundLayout() {
  const fCanvas = getCurrentFabricCanvas();
  if (!fCanvas) return;
  pushFabricHistory(selectedEditIndex);

  const page = magazineData?.pages?.[selectedEditIndex];
  if (page) page.isCustomized = true;

  const title = new fabric.Textbox('EDEBİYAT & İNSAN RUHUNUN DERİNLİKLERİ', {
    left: 45,
    top: 90,
    width: 460,
    fontSize: 22,
    fontFamily: 'Playfair Display',
    fontWeight: 'bold',
    fill: '#0f172a',
    lineHeight: 1.2,
    name: 'Manşet Başlık'
  });

  const spot = new fabric.Textbox('Sanatın ve edebiyatın insan bilincini aydınlatan gücü üzerine düşünceler...', {
    left: 45,
    top: 145,
    width: 460,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
    fontStyle: 'italic',
    fill: '#475569',
    lineHeight: 1.3,
    name: 'Spot Yazısı'
  });

  const portraitSlot = createGridSlotFabricObject({
    left: 45,
    top: 200,
    width: 170,
    height: 170,
    maskType: 'circle',
    cornerRadiusPx: 85,
    name: 'Yazar Portresi (Metin Akıtma)'
  });
  portraitSlot.isTextWrap = true;
  portraitSlot.textWrapMargin = 16;

  const bodyText = new fabric.Textbox('Bir dergi sayfasının kalbi, düşüncelerin kelimelerle buluştuğu bu satırlarda atar. Edebiyat, yalnızca geçmişi değil, bugünü ve geleceği de aydınlatan bir meşaledir. İnsan ruhunun en mahrem köşelerine uzanan her kelime, okuyucunun zihninde yeni ufuklar açar.\n\nZamanın hızla aktığı bu çağda, bir kitabın sayfaları arasında kaybolmak ya da bir edebiyat dergisinin kokusunu içine çekmek, insanın kendisine verebileceği en kıymetli moladır. Bu sayfalarda paylaşılan her düşünce, geleceğe bırakılmış bir izdir.', {
    left: 235,
    top: 200,
    width: 270,
    fontSize: 13.5,
    fontFamily: 'Plus Jakarta Sans',
    fill: '#1e293b',
    lineHeight: 1.45,
    name: 'Akan Gövde Metni',
    _origWrapGeometry: { left: 45, top: 200, width: 460 }
  });

  fCanvas.add(title, spot, portraitSlot, bodyText);
  fCanvas.setActiveObject(portraitSlot);
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  renderRightEditorPanel();
  showToast('🌊 Portre + Metin Akıtma (Runaround) mizanpajı eklendi!');
}

// ============================================================================
// 4D. DROP CAP (BÜYÜK İNİSİYAL BAŞ HARF) DESTEĞİ
// ============================================================================
function toggleDropCapForActiveText() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!fCanvas || !active) {
    showToast('⚠️ Lütfen önce bir metin kutusu seçin.');
    return;
  }
  pushFabricHistory(selectedEditIndex);

  if (active.isDropCap && active._parentTextObj) {
    removeDropCap(fCanvas, active._parentTextObj, active);
    return;
  }

  if (active.type !== 'textbox' && active.type !== 'i-text') {
    showToast('⚠️ Drop Cap sadece metin kutularına uygulanabilir.');
    return;
  }

  if (active._dropCapObj) {
    removeDropCap(fCanvas, active, active._dropCapObj);
    return;
  }

  const textContent = (active.text || '').trimStart();
  if (!textContent || textContent.length < 2) {
    showToast('⚠️ Metin kutusunda yeterli metin bulunmuyor.');
    return;
  }

  const firstChar = textContent.charAt(0);
  const remainingText = textContent.slice(1).trimStart();

  const dropCapSize = Math.max(48, Math.round((active.fontSize || 16) * 3.2));
  const dropCapWidth = Math.round(dropCapSize * 0.82);

  const dropCap = new fabric.Textbox(firstChar, {
    left: active.left,
    top: active.top - 2,
    width: dropCapWidth,
    fontSize: dropCapSize,
    fontFamily: (active.fontFamily && ['Playfair Display', 'Cinzel'].includes(active.fontFamily)) ? active.fontFamily : 'Cinzel',
    fontWeight: 'bold',
    fill: '#d97706',
    textAlign: 'center',
    isDropCap: true,
    name: `Drop Cap (${firstChar})`,
    selectable: true
  });

  const originalLeft = active.left;
  const originalWidth = active.width;
  active.set({
    left: originalLeft + dropCapWidth + 8,
    width: Math.max(100, originalWidth - dropCapWidth - 8),
    text: remainingText
  });
  active.setCoords();

  active._dropCapObj = dropCap;
  active._origDropCapState = {
    firstChar: firstChar,
    left: originalLeft,
    width: originalWidth
  };
  dropCap._parentTextObj = active;
  dropCap._originalLetter = firstChar;

  const page = magazineData?.pages?.[selectedEditIndex];
  if (page) page.isCustomized = true;

  fCanvas.add(dropCap);
  fCanvas.setActiveObject(dropCap);
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  renderRightEditorPanel();
  showToast(`🔠 "${firstChar}" harfi için Drop Cap (Büyük Baş Harf) oluşturuldu!`);
}

function removeDropCap(fCanvas, textObj, dropCapObj) {
  if (textObj._origDropCapState) {
    textObj.set({
      left: textObj._origDropCapState.left,
      width: textObj._origDropCapState.width,
      text: textObj._origDropCapState.firstChar + textObj.text
    });
    delete textObj._origDropCapState;
  }
  delete textObj._dropCapObj;

  fCanvas.remove(dropCapObj);
  fCanvas.setActiveObject(textObj);
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  renderRightEditorPanel();
  showToast('Drop Cap kaldırıldı, metin birleştirildi.');
}

// ============================================================================
// 5. ŞABLONLARI 100% BAĞIMSIZ FABRIC.JS NESNELERİNE DÖNÜŞTÜREN MOTOR
// ============================================================================
function addFabRect(fCanvas, opts) {
  const r = new fabric.Rect({
    id: opts.id || ('rect-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)),
    name: opts.name || 'Kutu / Şekil',
    customType: opts.customType || 'shape',
    left: opts.left || 0,
    top: opts.top || 0,
    width: opts.width || 100,
    height: opts.height || 100,
    fill: opts.fill || '#0f172a',
    rx: opts.rx || 0,
    ry: opts.ry !== undefined ? opts.ry : (opts.rx || 0),
    stroke: opts.stroke || null,
    strokeWidth: opts.strokeWidth || 0,
    angle: opts.angle || 0,
    opacity: opts.opacity !== undefined ? opts.opacity : 1,
    actionType: opts.actionType || 'none',
    actionValue: opts.actionValue || ''
  });
  if (opts.shadow) {
    r.set('shadow', new fabric.Shadow({ color: 'rgba(15,23,42,0.22)', blur: 16, offsetX: 0, offsetY: 6 }));
  }
  fCanvas.add(r);
  return r;
}

function addFabText(fCanvas, text, opts) {
  const tb = new fabric.Textbox(String(text || ''), {
    id: opts.id || ('txt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)),
    name: opts.name || 'Metin Kutusu',
    customType: 'text',
    fieldKey: opts.fieldKey || null,
    left: opts.left || 32,
    top: opts.top || 32,
    width: opts.width || 240,
    fontSize: opts.fontSize || 16,
    fontFamily: opts.fontFamily || 'Inter',
    fontWeight: opts.fontWeight || 'normal',
    fontStyle: opts.fontStyle || 'normal',
    fill: opts.fill || '#0f172a',
    backgroundColor: opts.backgroundColor || '',
    textAlign: opts.textAlign || 'left',
    lineHeight: opts.lineHeight || 1.25,
    charSpacing: opts.charSpacing || 0,
    angle: opts.angle || 0,
    opacity: opts.opacity !== undefined ? opts.opacity : 1,
    actionType: opts.actionType || 'none',
    actionValue: opts.actionValue || ''
  });
  if (opts.shadow) {
    tb.set('shadow', new fabric.Shadow({ color: 'rgba(0,0,0,0.45)', blur: 10, offsetX: 0, offsetY: 3 }));
  }
  fCanvas.add(tb);
  return tb;
}

function addFabBarcode(fCanvas, left, top, color = '#1c1917') {
  addFabRect(fCanvas, {
    name: 'Barkod Kutusu',
    left: left,
    top: top,
    width: 86,
    height: 30,
    rx: 6,
    fill: color === '#ffffff' ? 'rgba(15,23,42,0.65)' : '#ffffff',
    stroke: '#cbd5e1',
    strokeWidth: 1
  });
  addFabText(fCanvas, '||| || |||| ||| | ||', {
    name: 'Barkod Çizgileri',
    left: left + 6,
    top: top + 6,
    width: 74,
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'center',
    fill: color === '#ffffff' ? '#ffffff' : '#0f172a'
  });
}

function addStandardPageFooter(fCanvas, page, pageIndex) {
  const school = (window.magazineData && magazineData.schoolName) ? magazineData.schoolName : 'Dergimiz Stüdyo';
  const issue = (window.magazineData && (magazineData.issueMonth || magazineData.issueInfo)) ? (magazineData.issueMonth || magazineData.issueInfo) : '2026';

  addFabRect(fCanvas, {
    name: 'Alt Bilgi Çizgisi',
    left: 32,
    top: 734,
    width: 486,
    height: 1,
    fill: '#e2e8f0'
  });
  addFabText(fCanvas, school, {
    name: 'Okul Adı (Alt Bilgi)',
    left: 32,
    top: 744,
    width: 220,
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: '600',
    fill: '#64748b'
  });
  addFabText(fCanvas, `${pageIndex + 1}`, {
    name: 'Sayfa Numarası',
    left: 255,
    top: 743,
    width: 40,
    fontSize: 11,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    fill: '#0f172a'
  });
  addFabText(fCanvas, issue, {
    name: 'Sayı Tarihi',
    left: 340,
    top: 744,
    width: 178,
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: '600',
    textAlign: 'right',
    fill: '#64748b'
  });
}

function buildFabricObjectsForTemplatePage(page, pageIndex, fCanvas, onComplete) {
  fCanvas.clear();
  const accent = page.accentColor || '#4f46e5';
  const school = (window.magazineData && magazineData.schoolName) ? magazineData.schoolName : 'Kültür & Sanat Dergisi';
  let pendingImages = 0;
  let finished = false;

  function checkDone() {
    if (pendingImages <= 0 && !finished) {
      finished = true;
      // Ayrıca varsa eski serbest page.elements dizisindeki öğeleri de ekle (İçindekiler sayfasındaki eski 1- 2- yer tutucularını hariç tut)
      if (page.type !== 'toc' && Array.isArray(page.elements) && page.elements.length > 0 && !page._elementsMigrated) {
        page._elementsMigrated = true;
        page.elements.forEach(el => {
          const cleanTxt = (el.content || '').replace(/<[^>]+>/g, '');
          if (cleanTxt.includes('1-') && cleanTxt.includes('2-')) return;
          if (el.type === 'text' || el.type === 'card' || el.type === 'qbox') {
            const lx = Math.round((Number(el.x) || 10) / 100 * FABRIC_W);
            const ly = Math.round((Number(el.y) || 10) / 100 * FABRIC_H);
            const lw = Math.round((Number(el.width) || 40) / 100 * FABRIC_W);
            const lh = Math.round((Number(el.height) || 12) / 100 * FABRIC_H);
            if (el.bgColor && el.bgColor !== 'transparent') {
              addFabRect(fCanvas, {
                name: 'Arka Plan Kartı',
                left: lx,
                top: ly,
                width: lw,
                height: lh,
                rx: 12,
                fill: el.bgColor.startsWith('linear') ? '#1e1b4b' : el.bgColor,
                shadow: true
              });
            }
            addFabText(fCanvas, (el.content || '').replace(/<[^>]+>/g, ''), {
              name: 'Serbest Metin',
              left: lx + 8,
              top: ly + 8,
              width: Math.max(40, lw - 16),
              fontSize: Number(el.fontSize) || 14,
              fontFamily: el.fontFamily || 'Inter',
              fill: el.color || '#0f172a'
            });
          }
        });
      }
      fCanvas.requestRenderAll();
      if (onComplete) onComplete();
    }
  }

  function queueImg(url, fallback, opts) {
    pendingImages++;
    loadFabricImageIntoSlot(fCanvas, url, fallback, opts, () => {
      pendingImages--;
      checkDone();
    });
  }

  // -------------------------------------------------------------------------
  // 1. KAPAK (K1 / COVER) — 4 MİZANPAJ EKOLÜ
  // -------------------------------------------------------------------------
  if (page.type === 'cover' || page.type === 'k1') {
    const layout = page.layout || 'minimalist';
    let highlights = (page.highlights || '').split('\n').filter(Boolean);
    if (highlights.length === 0) highlights = ['Özel Dosya', 'Ayın Konusu', 'Geleceğin Trendleri'];

    if (layout === 'minimalist') {
      fCanvas.setBackgroundColor(page.bgColor || '#f4f2ee', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, page.issueTag || 'SAYI 01 | EKİM 2026', {
        name: 'Sayı Etiketi', fieldKey: 'issueTag',
        left: 32, top: 26, width: 240, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: '#57534e'
      });
      addFabText(fCanvas, page.price || 'OKUL E-DERGİSİ', {
        name: 'Üst Sağ Etiket', fieldKey: 'price',
        left: 290, top: 26, width: 228, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#57534e'
      });
      addFabRect(fCanvas, { name: 'Üst Çizgi', left: 32, top: 46, width: 486, height: 1.5, fill: '#d6d3d1' });

      addFabText(fCanvas, page.magazineName || 'KAMER', {
        name: 'Dergi Logosu (Masthead)', fieldKey: 'magazineName',
        left: 32, top: 58, width: 486, fontSize: 72, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#1c1917', lineHeight: 1.0
      });

      // Sol Siyah Vurgu Kartı (Bağımsız Şekil!)
      addFabRect(fCanvas, {
        name: 'Sol Siyah Vurgu Kartı',
        left: 32, top: 158, width: 236, height: 545, rx: 18, fill: '#0c0a09', shadow: true
      });
      addFabRect(fCanvas, {
        name: 'Kategori Rozet Kutusu',
        left: 50, top: 182, width: 115, height: 22, rx: 11, fill: accent
      });
      addFabText(fCanvas, 'KAPAK DOSYASI', {
        name: 'Kategori Rozet Yazısı',
        left: 54, top: 187, width: 107, fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      addFabText(fCanvas, page.mainHeadline || 'Güçlü Lider', {
        name: 'Ana Manşet Başlığı', fieldKey: 'mainHeadline',
        left: 50, top: 220, width: 200, fontSize: 30, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#ffffff', lineHeight: 1.15
      });
      addFabText(fCanvas, page.subHeadline || 'Kapak hikayesi için destek ve tanıtım metni buraya girilecektir.', {
        name: 'Alt Manşet Açıklaması', fieldKey: 'subHeadline',
        left: 50, top: 320, width: 200, fontSize: 13, fontFamily: 'Inter', fill: '#d6d3d1', lineHeight: 1.45
      });
      addFabRect(fCanvas, {
        name: 'Kart İçi Ayırıcı Çizgi',
        left: 50, top: 550, width: 200, height: 1, fill: '#44403c'
      });
      addFabText(fCanvas, highlights.map(h => '• ' + h).join('\n'), {
        name: 'Kapak Alt Spotları', fieldKey: 'highlights',
        left: 50, top: 566, width: 200, fontSize: 12, fontFamily: 'Inter', fill: '#e7e5e4', lineHeight: 1.65
      });

      // Sağ Kapak Görseli
      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', {
        name: 'Kapak Görseli', fieldKey: 'coverImage',
        left: 282, top: 158, width: 236, height: 545, radius: 18, shadow: true, stroke: '#d6d3d1', strokeWidth: 2
      });

      addFabBarcode(fCanvas, 420, 662, '#1c1917');
      addFabRect(fCanvas, { name: 'Alt Çizgi', left: 32, top: 724, width: 486, height: 1.5, fill: '#d6d3d1' });
      addFabText(fCanvas, school.toUpperCase(), {
        name: 'Okul Adı', left: 32, top: 736, width: 260, fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold', fill: '#78716c'
      });
      addFabText(fCanvas, 'ÖĞRENCİ & YAYIN MASASI', {
        name: 'Alt Sağ Bilgi', left: 310, top: 736, width: 208, fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#78716c'
      });
      checkDone();
      return;
    }

    if (layout === 'brutalist') {
      fCanvas.setBackgroundColor(accent || '#2563eb', fCanvas.renderAll.bind(fCanvas));
      addFabText(fCanvas, page.issueTag || 'SAYI 04', {
        name: 'Sayı Etiketi', fieldKey: 'issueTag',
        left: 32, top: 28, width: 200, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff'
      });
      addFabText(fCanvas, page.price || '2026', {
        name: 'Yıl / Etiket', fieldKey: 'price',
        left: 318, top: 28, width: 200, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#ffffff'
      });
      addFabRect(fCanvas, { name: 'Üst Çizgi', left: 32, top: 50, width: 486, height: 2, fill: 'rgba(255,255,255,0.35)' });

      addFabText(fCanvas, page.magazineName || 'RESİMLİK', {
        name: 'Dergi Logosu', fieldKey: 'magazineName',
        left: 24, top: 74, width: 502, fontSize: 78, fontFamily: 'Space Grotesk', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });

      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', {
        name: 'Kapak Görseli', fieldKey: 'coverImage',
        left: 125, top: 185, width: 300, height: 320, radius: 16, angle: -3, shadow: true, stroke: '#ffffff', strokeWidth: 4
      });

      addFabRect(fCanvas, {
        name: 'Sarı Manşet Kutusu',
        left: 85, top: 530, width: 380, height: 58, rx: 12, fill: '#fde047', angle: 2, shadow: true
      });
      addFabText(fCanvas, page.mainHeadline || 'YENİ GÖRÜNÜMLER', {
        name: 'Ana Manşet', fieldKey: 'mainHeadline',
        left: 95, top: 544, width: 360, fontSize: 28, fontFamily: 'Space Grotesk', fontWeight: 'bold', textAlign: 'center', fill: '#0f172a', angle: 2
      });
      addFabText(fCanvas, page.subHeadline || 'POPÜLER KÜLTÜR VE GENÇLİK DOSYASI', {
        name: 'Alt Manşet', fieldKey: 'subHeadline',
        left: 50, top: 618, width: 450, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      addFabBarcode(fCanvas, 430, 718, '#ffffff');
      checkDone();
      return;
    }

    if (layout === 'modular') {
      fCanvas.setBackgroundColor('#f5f5f4', fCanvas.renderAll.bind(fCanvas));
      addFabRect(fCanvas, {
        name: 'Dış Çerçeve', left: 22, top: 22, width: 506, height: 734, rx: 10, fill: 'transparent', stroke: '#0f172a', strokeWidth: 2.5
      });
      addFabText(fCanvas, page.magazineName || 'KONAK', {
        name: 'Dergi Logosu', fieldKey: 'magazineName',
        left: 38, top: 38, width: 320, fontSize: 58, fontFamily: 'Space Grotesk', fontWeight: 'bold', fill: '#0f172a'
      });
      addFabText(fCanvas, (page.price || 'EV & YAŞAM') + '\n' + (page.issueTag || 'SAYI 01'), {
        name: 'Sayı Bilgisi', fieldKey: 'issueTag',
        left: 360, top: 48, width: 150, fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#334155'
      });
      addFabRect(fCanvas, { name: 'Başlık Altı Çizgi', left: 38, top: 112, width: 474, height: 2, fill: '#0f172a' });

      queueImg(page.coverImage, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', {
        name: 'Kapak Görseli', fieldKey: 'coverImage',
        left: 38, top: 130, width: 305, height: 560, radius: 10, stroke: '#0f172a', strokeWidth: 2
      });

      addFabRect(fCanvas, {
        name: 'Sağ Üst Koyu Kutu', left: 356, top: 130, width: 156, height: 160, rx: 10, fill: '#0f172a'
      });
      addFabText(fCanvas, page.mainHeadline || 'TARZ DENEYİMLERİ', {
        name: 'Ana Manşet', fieldKey: 'mainHeadline',
        left: 368, top: 165, width: 132, fontSize: 22, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#ffffff'
      });

      addFabRect(fCanvas, {
        name: 'Sağ Orta Beyaz Kutu', left: 356, top: 304, width: 156, height: 290, rx: 10, fill: '#ffffff', stroke: '#0f172a', strokeWidth: 2
      });
      addFabText(fCanvas, highlights.map(h => '▪ ' + h).join('\n\n'), {
        name: 'Kapak Konuları', fieldKey: 'highlights',
        left: 368, top: 324, width: 132, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', fill: '#1e293b', lineHeight: 1.4
      });

      addFabBarcode(fCanvas, 390, 625, '#0f172a');
      checkDone();
      return;
    }

    // 1D. FULLSCREEN (Doğal / Vogue Tam Ekran Kapak)
    fCanvas.setBackgroundColor('#0f172a', fCanvas.renderAll.bind(fCanvas));
    queueImg(page.coverImage, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', {
      name: 'Tam Sayfa Arka Plan Görseli', fieldKey: 'coverImage',
      left: 0, top: 0, width: FABRIC_W, height: FABRIC_H, radius: 0, sendToBack: true
    });
    addFabRect(fCanvas, {
      name: 'Karartma Katmanı', left: 0, top: 420, width: FABRIC_W, height: 358, fill: 'rgba(2, 6, 23, 0.68)'
    });
    addFabText(fCanvas, page.issueTag || 'SAYI #1 • EKİM 2026', {
      name: 'Sayı Etiketi', fieldKey: 'issueTag',
      left: 36, top: 28, width: 230, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: '#e2e8f0', shadow: true
    });
    addFabText(fCanvas, page.price || 'ÖZEL SAYI', {
      name: 'Üst Sağ Etiket', fieldKey: 'price',
      left: 284, top: 28, width: 230, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#e2e8f0', shadow: true
    });
    addFabText(fCanvas, page.magazineName || 'DOĞAL', {
      name: 'Dergi Logosu (Masthead)', fieldKey: 'magazineName',
      left: 36, top: 52, width: 478, fontSize: 68, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff', shadow: true
    });
    addFabRect(fCanvas, {
      name: 'Dosya Rozeti', left: 36, top: 455, width: 115, height: 24, rx: 12, fill: accent
    });
    addFabText(fCanvas, 'AYIN DOSYASI', {
      name: 'Dosya Rozet Yazısı', left: 40, top: 461, width: 107, fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
    });
    addFabText(fCanvas, page.mainHeadline || 'VAHŞİ YAŞAMIN BÜYÜSÜ', {
      name: 'Ana Manşet', fieldKey: 'mainHeadline',
      left: 36, top: 492, width: 478, fontSize: 38, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#ffffff', shadow: true
    });
    addFabText(fCanvas, page.subHeadline || 'Gezegenin Paydaşları ve Korunan Alanlar üzerine özel dosya.', {
      name: 'Alt Manşet', fieldKey: 'subHeadline',
      left: 36, top: 595, width: 460, fontSize: 14, fontFamily: 'Inter', fill: '#e2e8f0', shadow: true
    });
    addFabBarcode(fCanvas, 428, 712, '#ffffff');
    checkDone();
    return;
  }

  // -------------------------------------------------------------------------
  // 2. İÇİNDEKİLER & EDİTÖRÜN MASASI (TOC)
  // -------------------------------------------------------------------------
  if (page.type === 'toc') {
    fCanvas.setBackgroundColor(page.bgColor || '#fafaf9', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, 'EDİTÖRÜN MASASI & İÇİNDEKİLER', {
      name: 'Üst Başlık', left: 32, top: 28, width: 486, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: accent
    });
    addFabRect(fCanvas, { name: 'Üst Vurgu Çizgisi', left: 32, top: 46, width: 486, height: 2, fill: accent });

    addFabText(fCanvas, page.editorTitle || 'Bu Sayıya Dair', {
      name: 'Editör Başlığı', fieldKey: 'editorTitle',
      left: 32, top: 62, width: 486, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
    });

    queueImg(page.editorImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', {
      name: 'Editör Fotoğrafı', fieldKey: 'editorImage',
      left: 32, top: 110, width: 125, height: 145, radius: 14, shadow: true
    });

    addFabRect(fCanvas, {
      name: 'Alıntı Kutusu', left: 172, top: 110, width: 346, height: 54, rx: 10, fill: '#fef3c7'
    });
    addFabText(fCanvas, '"' + (page.editorQuote || 'Dergimizi hazırlarken ilhamımızı sanattan, bilimden ve gençlikten alıyoruz.') + '"', {
      name: 'Editör Alıntısı', fieldKey: 'editorQuote',
      left: 184, top: 120, width: 322, fontSize: 12, fontFamily: 'Playfair Display', fontStyle: 'italic', fill: '#78350f'
    });

    addFabText(fCanvas, page.editorText || 'Editörün mektubu okuyucuya bu sayının kreatif yönünü ve hazırlık sürecini anlatır. Tüm başlıkları ve görselleri dilediğiniz gibi taşıyabilir ve boyutlandırabilirsiniz.', {
      name: 'Editör Metni', fieldKey: 'editorText',
      left: 172, top: 174, width: 346, fontSize: 12.5, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.45
    });

    addFabText(fCanvas, '— ' + (page.editorName || 'Genel Yayın Yönetmeni'), {
      name: 'Editör İmza', fieldKey: 'editorName',
      left: 280, top: 268, width: 238, fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'right', fill: '#0f172a'
    });

    // İçindekiler Kartı
    addFabRect(fCanvas, {
      name: 'İçindekiler Çerçevesi', left: 32, top: 298, width: 486, height: 422, rx: 16, fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1.5, shadow: true
    });
    addFabText(fCanvas, 'BU SAYIDA NELER VAR? (İÇİNDEKİLER)', {
      name: 'İçindekiler Başlığı', left: 50, top: 314, width: 446, fontSize: 12.5, fontFamily: 'Inter', fontWeight: 'bold', fill: accent
    });

    const pagesList = (window.magazineData && magazineData.pages) ? magazineData.pages : [];
    const maxItems = Math.min(pagesList.length, 12);
    const totalRows = Math.max(1, Math.ceil(maxItems / 2));
    const cardH = totalRows > 5 ? 54 : 64;
    const rowStep = totalRows > 5 ? 61 : 72;

    pagesList.slice(0, maxItems).forEach((pItem, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 48 + col * 230;
      const by = 342 + row * rowStep;
      const rawTitle = pItem.navTitle || pItem.title || pItem.mainHeadline || pItem.headerText || ('Sayfa ' + (idx + 1));
      const cleanTitle = String(rawTitle).replace(/^\d+\s*[•\-|:]\s*/, '').trim();
      const subAuthor = pItem.author || pItem.interviewee || pItem.editorName || (pItem.isFixedBackbone ? 'Resmi Bölüm' : 'Özel İçerik');

      addFabRect(fCanvas, {
        name: `Sayfa ${idx + 1} Kutu`, left: bx, top: by, width: 220, height: cardH, rx: 10, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 1,
        actionType: 'gotoPage', actionValue: String(idx + 1)
      });
      addFabRect(fCanvas, {
        name: `Numara Rozeti ${idx + 1}`, left: bx + 8, top: by + Math.round((cardH - 30) / 2), width: 30, height: 30, rx: 8, fill: accent
      });
      addFabText(fCanvas, String(idx + 1).padStart(2, '0'), {
        name: `Sayfa No ${idx + 1}`, left: bx + 8, top: by + Math.round((cardH - 30) / 2) + 8, width: 30, fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
      });
      addFabText(fCanvas, cleanTitle, {
        name: `Bölüm Başlığı ${idx + 1}`, left: bx + 46, top: by + 10, width: 164, fontSize: 11.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#0f172a', lineHeight: 1.15
      });
      addFabText(fCanvas, String(subAuthor), {
        name: `Bölüm Yazarı ${idx + 1}`, left: bx + 46, top: by + cardH - 18, width: 164, fontSize: 9.5, fontFamily: 'Inter', fill: '#64748b'
      });
    });

    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // -------------------------------------------------------------------------
  // 3. HABER / MAKALE (ARTICLE)
  // -------------------------------------------------------------------------
  if (page.type === 'article') {
    fCanvas.setBackgroundColor(page.bgColor || '#ffffff', fCanvas.renderAll.bind(fCanvas));
    addFabRect(fCanvas, {
      name: 'Kategori Etiket Kutusu', left: 32, top: 28, width: 120, height: 24, rx: 12, fill: accent
    });
    addFabText(fCanvas, page.category || 'ÖZEL DOSYA', {
      name: 'Kategori Etiketi', fieldKey: 'category',
      left: 36, top: 34, width: 112, fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
    });
    addFabText(fCanvas, page.author || 'Yazan: Araştırma Kulübü', {
      name: 'Yazar Bilgisi', fieldKey: 'author',
      left: 164, top: 33, width: 354, fontSize: 11.5, fontFamily: 'Inter', fontWeight: '600', fill: '#64748b'
    });

    addFabText(fCanvas, page.title || 'GELECEĞİN YENİ KURALLARI', {
      name: 'Makale Başlığı', fieldKey: 'title',
      left: 32, top: 64, width: 486, fontSize: 32, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a', lineHeight: 1.15
    });

    queueImg(page.image, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80', {
      name: 'Makale Ana Görseli', fieldKey: 'image',
      left: 32, top: 148, width: 486, height: 230, radius: 14, shadow: true
    });

    addFabRect(fCanvas, {
      name: 'Görsel Alt Yazı Şeridi', left: 32, top: 352, width: 486, height: 26, rx: 6, fill: 'rgba(15,23,42,0.88)'
    });
    addFabText(fCanvas, page.imageCaption || 'Görsel: Proje atölyesi çalışmalarından bir kare.', {
      name: 'Görsel Alt Yazısı', fieldKey: 'imageCaption',
      left: 42, top: 359, width: 466, fontSize: 10.5, fontFamily: 'Inter', fill: '#f8fafc'
    });

    // Sol Ana Metin Sütunu
    addFabText(fCanvas, page.content || 'Tasarım, bilim ve edebiyat dünyasındaki yenilikler üzerine derinlemesine bir analiz. Dergimiz sayfalarındaki her görseli, başlığı ve metin kutusunu serbestçe sürükleyebilir, köşelerinden küçültüp büyütebilirsiniz.\n\nÖğrencilerimizin hazırladığı bu özel dosyada güncel gelişmeleri ve geleceğin trendlerini ele aldık.', {
      name: 'Makale Ana Metni', fieldKey: 'content',
      left: 32, top: 396, width: 310, fontSize: 13, fontFamily: 'Merriweather', fill: '#334155', lineHeight: 1.55
    });

    // Sağ Vurgu Sütunu (Pull Quote Kartı)
    addFabRect(fCanvas, {
      name: 'Vurgu Sözü Kartı', left: 358, top: 396, width: 160, height: 195, rx: 14, fill: '#f8fafc', stroke: accent, strokeWidth: 2, shadow: true
    });
    addFabText(fCanvas, '"' + (page.pullQuote || 'Yaratıcılık, sınırları zorlamakla ve yeni sorular sormakla başlar.') + '"', {
      name: 'Vurgu Sözü (Pull Quote)', fieldKey: 'pullQuote',
      left: 370, top: 416, width: 136, fontSize: 14, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', fill: '#0f172a', lineHeight: 1.4
    });

    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // -------------------------------------------------------------------------
  // 4. RÖPORTAJ / SÖYLEŞİ (INTERVIEW)
  // -------------------------------------------------------------------------
  if (page.type === 'interview') {
    fCanvas.setBackgroundColor(page.bgColor || '#ffffff', fCanvas.renderAll.bind(fCanvas));
    addFabRect(fCanvas, {
      name: 'Röportaj Üst Карtı', left: 32, top: 28, width: 486, height: 142, rx: 18, fill: accent, shadow: true
    });
    queueImg(page.photo, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', {
      name: 'Konuk Fotoğrafı', fieldKey: 'photo',
      left: 48, top: 44, width: 110, height: 110, radius: 14, stroke: '#ffffff', strokeWidth: 3
    });
    addFabText(fCanvas, page.rubric || 'AYIN SÖYLEŞİSİ', {
      name: 'Söyleşi Üst Başlık', fieldKey: 'rubric',
      left: 174, top: 44, width: 326, fontSize: 10.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#e0e7ff'
    });
    addFabText(fCanvas, page.interviewee || 'Prof. Dr. İlber Ortaylı', {
      name: 'Konuk Adı', fieldKey: 'interviewee',
      left: 174, top: 64, width: 326, fontSize: 23, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#ffffff'
    });
    addFabText(fCanvas, page.role || 'Akademisyen & Yazar', {
      name: 'Konuk Unvanı', fieldKey: 'role',
      left: 174, top: 96, width: 326, fontSize: 12.5, fontFamily: 'Inter', fontWeight: '600', fill: '#fef08a'
    });
    addFabText(fCanvas, page.intro || 'Bilim, kültür ve gençliğin geleceği üzerine gerçekleştirdiğimiz özel söyleşi.', {
      name: 'Söyleşi Giriş Spotu', fieldKey: 'intro',
      left: 174, top: 118, width: 326, fontSize: 11.5, fontFamily: 'Inter', fill: '#f1f5f9'
    });

    const qaList = [
      { qKey: 'q1', aKey: 'a1', qDef: page.q1 || 'Soru 1: Çalışmalarınızda gençlere en önemli tavsiyeniz nedir?', aDef: page.a1 || 'Merak duygusunu asla kaybetmemek, çok okumak ve farklı disiplinleri bir arada düşünmek en büyük anahtardır.' },
      { qKey: 'q2', aKey: 'a2', qDef: page.q2 || 'Soru 2: Geleceğin dünyasında hangi beceriler öne çıkacak?', aDef: page.a2 || 'Analitik düşünme, estetik bakış açısı ve kendi kültürünü iyi tanıyarak dünyayla iletişim kurabilme yeteneği.' },
      { qKey: 'q3', aKey: 'a3', qDef: page.q3 || 'Soru 3: Okul dergimiz okurlarına son mesajınız nedir?', aDef: page.a3 || 'Üretmekten, yazmaktan ve birlikte güzel işler ortaya koymaktan vazgeçmeyin.' }
    ];

    qaList.forEach((item, idx) => {
      const topY = 190 + idx * 172;
      addFabRect(fCanvas, {
        name: `Soru Kutusu ${idx + 1}`, left: 32, top: topY, width: 486, height: 154, rx: 14, fill: '#f8fafc', stroke: '#e2e8f0', strokeWidth: 1.5
      });
      addFabText(fCanvas, item.qDef, {
        name: `Soru ${idx + 1}`, fieldKey: item.qKey,
        left: 48, top: topY + 14, width: 454, fontSize: 13.5, fontFamily: 'Inter', fontWeight: 'bold', fill: accent
      });
      addFabText(fCanvas, item.aDef, {
        name: `Cevap ${idx + 1}`, fieldKey: item.aKey,
        left: 48, top: topY + 56, width: 454, fontSize: 12.5, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.45
      });
    });

    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // -------------------------------------------------------------------------
  // 5. EDEBİYAT & ŞİİR / SANAT (LITERATURE)
  // -------------------------------------------------------------------------
  if (page.type === 'literature') {
    fCanvas.setBackgroundColor(page.bgColor || '#fffbeb', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, page.header || 'EDEBİYAT & SANAT KÖŞESİ', {
      name: 'Üst Köşe Başlığı', fieldKey: 'header',
      left: 32, top: 28, width: 486, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: accent
    });
    addFabText(fCanvas, page.title || 'Geceye Düşen Mısralar', {
      name: 'Eser Başlığı', fieldKey: 'title',
      left: 32, top: 48, width: 486, fontSize: 30, fontFamily: 'Playfair Display', fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', fill: '#0f172a'
    });
    addFabText(fCanvas, page.author || 'Kaleme Alan: Edebiyat Kulübü', {
      name: 'Yazar / Şair', fieldKey: 'author',
      left: 32, top: 90, width: 486, fontSize: 12.5, fontFamily: 'Inter', fontWeight: '600', textAlign: 'center', fill: '#64748b'
    });

    queueImg(page.bgImage, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', {
      name: 'Sanat Görseli', fieldKey: 'bgImage',
      left: 46, top: 122, width: 458, height: 185, radius: 16, shadow: true
    });

    addFabRect(fCanvas, {
      name: 'Şiir / Metin Parşömen Kartı', left: 46, top: 324, width: 458, height: 335, rx: 16, fill: '#ffffff', stroke: '#fde68a', strokeWidth: 2, shadow: true
    });
    addFabText(fCanvas, page.poemText || 'Kelimeler akar zamanın içinden,\nBir yaprak düşer sonbahar dalından.\nUmut yeşerir her yeni dizelerde,\nSanatla büyür yarının düşleri.', {
      name: 'Edebi Metin / Şiir', fieldKey: 'poemText',
      left: 72, top: 352, width: 406, fontSize: 15, fontFamily: 'Playfair Display', fontStyle: 'italic', textAlign: 'center', fill: '#1e293b', lineHeight: 1.75
    });

    addFabText(fCanvas, page.bottomNote || 'Dergimiz Kültür & Edebiyat Seçkisi', {
      name: 'Alt Bilgi Notu', fieldKey: 'bottomNote',
      left: 46, top: 680, width: 458, fontSize: 11, fontFamily: 'Inter', textAlign: 'center', fill: '#64748b'
    });

    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // -------------------------------------------------------------------------
  // 6. KATALOG & PROJE VİTRİNİ (CATALOG)
  // -------------------------------------------------------------------------
  if (page.type === 'catalog') {
    fCanvas.setBackgroundColor(page.bgColor || '#f7f4f0', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, page.title || 'Proje & Tasarım Koleksiyonu', {
      name: 'Katalog Başlığı', fieldKey: 'title',
      left: 32, top: 28, width: 380, fontSize: 25, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#1c1917'
    });
    addFabRect(fCanvas, {
      name: 'Katalog Rozeti', left: 422, top: 32, width: 96, height: 22, rx: 11, fill: accent
    });
    addFabText(fCanvas, 'KOLEKSİYON', {
      name: 'Rozet Yazısı', left: 424, top: 37, width: 92, fontSize: 9.5, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff'
    });
    addFabText(fCanvas, page.content || 'Modern tasarım ilkeleri ve zarif detaylarla hazırlanan bu özel dosya; estetik, işlevsellik ve yenilikçi malzeme kullanımını bir araya getiriyor.', {
      name: 'Katalog Açıklaması', fieldKey: 'content',
      left: 32, top: 68, width: 486, fontSize: 12, fontFamily: 'Inter', fill: '#57534e', lineHeight: 1.45
    });

    // 3'lü Dikey Görsel Vitrini
    queueImg(page.image, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80', {
      name: 'Vitrin Görseli 1', fieldKey: 'image',
      left: 32, top: 128, width: 152, height: 250, radius: 14, shadow: true
    });
    queueImg(page.image2, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80', {
      name: 'Vitrin Görseli 2', fieldKey: 'image2',
      left: 199, top: 128, width: 152, height: 250, radius: 14, shadow: true
    });
    queueImg(page.image3, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80', {
      name: 'Vitrin Görseli 3', fieldKey: 'image3',
      left: 366, top: 128, width: 152, height: 250, radius: 14, shadow: true
    });

    // Alt Spesifikasyon Tablosu
    addFabRect(fCanvas, {
      name: 'Tablo Başlık Şeridi', left: 32, top: 405, width: 486, height: 36, rx: 10, fill: accent
    });
    addFabText(fCanvas, 'ÖZELLİK / KATEGORİ                              DETAY & SPESİFİKASYON', {
      name: 'Tablo Sütun Başlığı', left: 46, top: 417, width: 458, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff'
    });

    const specRows = [
      ['Proje / Eser Adı', page.spec1 || 'Özel Tasarım Koleksiyonu', 'spec1'],
      ['Kategori & Alan', page.spec2 || 'Görsel Sanatlar & Tasarım', 'spec2'],
      ['Dönem / Sezon', page.spec3 || '2026 - 2027 Dönemi', 'spec3'],
      ['Hazırlayan Ekip', page.author || 'Tasarım & Kültür Atölyesi', 'author']
    ];
    specRows.forEach((r, idx) => {
      const ry = 448 + idx * 62;
      addFabRect(fCanvas, {
        name: `Tablo Satırı ${idx + 1}`, left: 32, top: ry, width: 486, height: 54, rx: 8, fill: idx % 2 === 0 ? '#ffffff' : '#fafaf9', stroke: '#e7e5e4', strokeWidth: 1
      });
      addFabText(fCanvas, r[0], {
        name: `Özellik Adı ${idx + 1}`, left: 48, top: ry + 18, width: 190, fontSize: 12.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#1c1917'
      });
      addFabText(fCanvas, r[1], {
        name: `Özellik Değeri ${idx + 1}`, fieldKey: r[2], left: 250, top: ry + 18, width: 250, fontSize: 12.5, fontFamily: 'Inter', textAlign: 'right', fill: '#57534e'
      });
    });

    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  // -------------------------------------------------------------------------
  // 7. K2 (ÖN KAPAK İÇİ), K3 (KÜNYE), K4 (ARKA KAPAK), QUIZ & DİĞERLERİ
  // -------------------------------------------------------------------------
  if (page.type === 'k2') {
    fCanvas.setBackgroundColor('#fafaf9', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, page.headerText || 'SUNUŞ & VİZYONUMUZ', {
      name: 'K2 Başlığı', fieldKey: 'headerText',
      left: 36, top: 44, width: 478, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#0f172a'
    });
    queueImg(page.image, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', {
      name: 'Portre Görseli', fieldKey: 'image',
      left: 185, top: 105, width: 180, height: 180, radius: 24, shadow: true
    });
    addFabText(fCanvas, page.subText || 'Geleceği inşa eden gençlerimizin bilim, sanat ve edebiyat yolculuğuna ışık tutan dergimizin yeni sayısıyla karşınızdayız.', {
      name: 'Sunuş Metni', fieldKey: 'subText',
      left: 48, top: 315, width: 454, fontSize: 14, fontFamily: 'Merriweather', fontStyle: 'italic', textAlign: 'center', fill: '#334155', lineHeight: 1.65
    });
    addFabText(fCanvas, page.author || 'Yayın Kurulu', {
      name: 'İmza', fieldKey: 'author',
      left: 48, top: 530, width: 454, fontSize: 15, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: accent
    });
    addStandardPageFooter(fCanvas, page, pageIndex);
    checkDone();
    return;
  }

  if (page.type === 'k3') {
    fCanvas.setBackgroundColor('#0f172a', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, page.boardTitle || 'YAYIN KÜNYESİ & GELECEK SAYI', {
      name: 'Künye Başlığı', fieldKey: 'boardTitle',
      left: 36, top: 38, width: 478, fontSize: 24, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#ffffff'
    });
    addFabRect(fCanvas, {
      name: 'Künye Kartı', left: 36, top: 88, width: 478, height: 320, rx: 16, fill: '#1e293b', stroke: '#334155', strokeWidth: 1.5
    });
    const kunyeText = [
      `İmtiyaz Sahibi: ${page.publisher || school}`,
      `Genel Yayın Yönetmeni: ${page.editorInChief || 'Yayın Masası'}`,
      `Yayın Danışmanı: ${page.advisor || 'Edebiyat & Sanat Zümresi'}`,
      `Yazı İşleri & Tasarım: ${page.editorialTeam || 'Öğrenci Yayın Kurulu'}`,
      `İletişim: ${page.contactInfo || 'dergimiz.com.tr'}`
    ].join('\n\n');
    addFabText(fCanvas, kunyeText, {
      name: 'Künye Bilgileri', fieldKey: 'editorialTeam',
      left: 56, top: 112, width: 438, fontSize: 13.5, fontFamily: 'Inter', fill: '#e2e8f0', lineHeight: 1.5
    });
    addFabRect(fCanvas, {
      name: 'Gelecek Sayı Kartı', left: 36, top: 435, width: 478, height: 260, rx: 16, fill: '#312e81', stroke: '#6366f1', strokeWidth: 1.5
    });
    addFabText(fCanvas, page.nextIssueTeaserTitle || 'GELECEK SAYIDA NELER VAR?', {
      name: 'Gelecek Sayı Başlığı', fieldKey: 'nextIssueTeaserTitle',
      left: 56, top: 458, width: 438, fontSize: 15, fontFamily: 'Inter', fontWeight: 'bold', fill: '#fbbf24'
    });
    addFabText(fCanvas, page.nextIssueText || '• Yeni Teknoloji ve Yapay Zekâ Dosyası\n• Yılın Kültür ve Sanat Röportajları\n• Ödüllü Tasarım ve Fotoğraf Seçkisi', {
      name: 'Gelecek Sayı İçeriği', fieldKey: 'nextIssueText',
      left: 56, top: 492, width: 438, fontSize: 13.5, fontFamily: 'Inter', fill: '#e0e7ff', lineHeight: 1.65
    });
    checkDone();
    return;
  }

  if (page.type === 'k4' || page.type === 'back') {
    fCanvas.setBackgroundColor('#090d16', fCanvas.renderAll.bind(fCanvas));
    queueImg(page.coverImage, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', {
      name: 'Arka Kapak Görseli', fieldKey: 'coverImage',
      left: 0, top: 0, width: FABRIC_W, height: FABRIC_H, radius: 0, opacity: 0.45, sendToBack: true
    });
    addFabText(fCanvas, page.schoolName || school, {
      name: 'Kurum / Dergi Adı', fieldKey: 'schoolName',
      left: 36, top: 58, width: 478, fontSize: 32, fontFamily: 'Space Grotesk', fontWeight: 'bold', textAlign: 'center', fill: '#ffffff', shadow: true
    });
    addFabText(fCanvas, page.motto || 'Eğitimde Öncü, Sanatta ve Bilimde Işık', {
      name: 'Slogan / Motto', fieldKey: 'motto',
      left: 36, top: 108, width: 478, fontSize: 14, fontFamily: 'Playfair Display', fontStyle: 'italic', textAlign: 'center', fill: '#fde68a', shadow: true
    });
    addFabRect(fCanvas, {
      name: 'Kapanış Kartı', left: 75, top: 470, width: 400, height: 150, rx: 20, fill: 'rgba(15, 23, 42, 0.85)', stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1.5
    });
    addFabText(fCanvas, page.closingQuote || '"Hayata ve geleceğe değer katan tasarımlar."', {
      name: 'Kapanış Sözü', fieldKey: 'closingQuote',
      left: 95, top: 495, width: 360, fontSize: 17, fontFamily: 'Playfair Display', fontStyle: 'italic', textAlign: 'center', fill: '#fef08a'
    });
    addFabText(fCanvas, page.social || '@dergimiz • dergimiz.com.tr', {
      name: 'Sosyal Medya & Web', fieldKey: 'social',
      left: 95, top: 565, width: 360, fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#cbd5e1'
    });
    addFabBarcode(fCanvas, 232, 695, '#ffffff');
    checkDone();
    return;
  }

  // 10. BEMBEYAZ BOŞ SAYFA (SIFIRDAN TASARLA - HİÇBİR ZORUNLU METİN/GÖRSEL EKLENMEZ)
  if (page.type === 'blank' || page.type === 'wireframe_blank') {
    fCanvas.setBackgroundColor(page.bgColor || '#ffffff', fCanvas.renderAll.bind(fCanvas));
    if (page.showMasterPage !== false && typeof renderMasterPageOverlay === 'function') {
      renderMasterPageOverlay(fCanvas, pageIndex);
    }
    checkDone();
    return;
  }

  // 11. BOŞ 2 SÜTUNLU MAKALE İSKELETİ
  if (page.type === 'wireframe_article_2col') {
    fCanvas.setBackgroundColor(page.bgColor || '#ffffff', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, '+ Makale Başlığını Buraya Yazın', {
      name: 'Makale Başlığı', left: 36, top: 45, width: 478, fontSize: 26, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
    });
    addFabText(fCanvas, '+ Buraya konuyu özetleyen çarpıcı bir manşet spotu yazın...', {
      name: 'Manşet Spotu', left: 36, top: 88, width: 478, fontSize: 13, fontFamily: 'Inter', fontStyle: 'italic', fill: '#475569'
    });
    addFabRect(fCanvas, {
      name: 'Yatay Ayırıcı', left: 36, top: 125, width: 478, height: 1.5, fill: '#cbd5e1'
    });
    addFabText(fCanvas, '1. Sütun metninizi buraya yapıştırın veya yazın.\n\nQuark ve InDesign standartlarında profesyonel dergi mizanpajı için iki eşit genişlikte sütun hazırlanmıştır.', {
      name: '1. Metin Sütunu', left: 36, top: 145, width: 230, fontSize: 12.5, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.6
    });
    addFabText(fCanvas, '2. Sütun metninizi buraya yapıştırın veya yazın.\n\nYazılarınızı istediğiniz punto ve renkte düzenleyebilir, araya çekme alıntılar veya fotoğraflar ekleyebilirsiniz.', {
      name: '2. Metin Sütunu', left: 284, top: 145, width: 230, fontSize: 12.5, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.6
    });
    if (page.showMasterPage !== false && typeof renderMasterPageOverlay === 'function') {
      renderMasterPageOverlay(fCanvas, pageIndex);
    }
    checkDone();
    return;
  }

  // 12. BOŞ 3 FOTOĞRAFLI RÖPORTAJ İSKELETİ
  if (page.type === 'wireframe_interview_3img') {
    fCanvas.setBackgroundColor(page.bgColor || '#ffffff', fCanvas.renderAll.bind(fCanvas));
    addFabRect(fCanvas, {
      name: 'Büyük Fotoğraf Kutusu', isGridSlot: true, left: 36, top: 45, width: 230, height: 380, rx: 12, ry: 12, fill: '#f1f5f9', stroke: '#cbd5e1', strokeWidth: 1.5, strokeDashArray: [6, 4]
    });
    addFabText(fCanvas, '📷 Fotoğraf Yükle', {
      name: 'İpucu', left: 85, top: 220, fontSize: 13, fontFamily: 'Inter', fontWeight: 'bold', fill: '#64748b'
    });
    addFabRect(fCanvas, {
      name: 'Küçük Fotoğraf 1', isGridSlot: true, left: 36, top: 440, width: 110, height: 150, rx: 8, ry: 8, fill: '#f8fafc', stroke: '#cbd5e1', strokeWidth: 1.5, strokeDashArray: [4, 4]
    });
    addFabRect(fCanvas, {
      name: 'Küçük Fotoğraf 2', isGridSlot: true, left: 156, top: 440, width: 110, height: 150, rx: 8, ry: 8, fill: '#f8fafc', stroke: '#cbd5e1', strokeWidth: 1.5, strokeDashArray: [4, 4]
    });
    addFabText(fCanvas, 'AYIN RÖPORTAJI', {
      name: 'Üst Başlık', left: 284, top: 45, width: 230, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: '#6366f1'
    });
    addFabText(fCanvas, '+ Konuk Adı & Başlık', {
      name: 'Röportaj Başlığı', left: 284, top: 65, width: 230, fontSize: 22, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
    });
    addFabText(fCanvas, 'Soru 1: Kendinizi ve okul projenizi kısaca tanıtır mısınız?\n\nCevap: [Cevabınızı buraya yazın veya öğrenci havuzundan aktarın]\n\nSoru 2: Bu çalışmada sizi en çok ne motive etti?\n\nCevap: [Cevabınızı buraya yazın]', {
      name: 'Soru-Cevap Bloğu', left: 284, top: 125, width: 230, fontSize: 12, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.6
    });
    if (page.showMasterPage !== false && typeof renderMasterPageOverlay === 'function') {
      renderMasterPageOverlay(fCanvas, pageIndex);
    }
    checkDone();
    return;
  }

  // 13. BOŞ 4\'LÜ FOTOĞRAF KOLAJI (CANVA IZGARASI)
  if (page.type === 'wireframe_gallery_4grid') {
    fCanvas.setBackgroundColor(page.bgColor || '#ffffff', fCanvas.renderAll.bind(fCanvas));
    addFabText(fCanvas, '+ Etkinlik & Fotoğraf Galerisi', {
      name: 'Galeri Başlığı', left: 36, top: 40, width: 478, fontSize: 24, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
    });
    const boxW = 230, boxH = 260;
    const gridCoords = [
      { left: 36, top: 90 },
      { left: 284, top: 90 },
      { left: 36, top: 370 },
      { left: 284, top: 370 }
    ];
    gridCoords.forEach((coord, i) => {
      addFabRect(fCanvas, {
        name: `Fotoğraf Kutusu ${i + 1}`, isGridSlot: true, left: coord.left, top: coord.top, width: boxW, height: boxH, rx: 12, ry: 12, fill: '#f8fafc', stroke: '#cbd5e1', strokeWidth: 1.5, strokeDashArray: [6, 4]
      });
      addFabText(fCanvas, `📷 Görsel Seç ${i + 1}`, {
        name: `Etiket ${i + 1}`, left: coord.left + 65, top: coord.top + 120, fontSize: 12, fontFamily: 'Inter', fontWeight: 'bold', fill: '#94a3b8'
      });
    });
    addFabText(fCanvas, '+ Fotoğraflar hakkında ortak açıklama veya dipnotunuzu buraya yazın...', {
      name: 'Galeri Açıklaması', left: 36, top: 655, width: 478, fontSize: 12, fontFamily: 'Inter', fontStyle: 'italic', fill: '#64748b'
    });
    if (page.showMasterPage !== false && typeof renderMasterPageOverlay === 'function') {
      renderMasterPageOverlay(fCanvas, pageIndex);
    }
    checkDone();
    return;
  }

  // 14. BOŞ ŞİİR & YAZAR PORTRESİ İSKELETİ
  if (page.type === 'wireframe_poetry_author') {
    fCanvas.setBackgroundColor(page.bgColor || '#fdfbf7', fCanvas.renderAll.bind(fCanvas));
    addFabCircle(fCanvas, {
      name: 'Yazar Portresi', isGridSlot: true, left: 220, top: 45, radius: 55, fill: '#f1f5f9', stroke: '#cbd5e1', strokeWidth: 2, strokeDashArray: [5, 4]
    });
    addFabText(fCanvas, '📷 Portre', {
      name: 'Etiket', left: 247, top: 92, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: '#94a3b8'
    });
    addFabText(fCanvas, '+ ŞAİR / YAZAR ADI', {
      name: 'Yazar Adı', left: 36, top: 175, width: 478, fontSize: 14, fontFamily: 'Inter', fontWeight: 'bold', textAlign: 'center', fill: '#475569'
    });
    addFabText(fCanvas, '+ Şiir / Deneme Başlığı', {
      name: 'Şiir Başlığı', left: 36, top: 205, width: 478, fontSize: 24, fontFamily: 'Playfair Display', fontWeight: 'bold', textAlign: 'center', fill: '#0f172a'
    });
    addFabText(fCanvas, 'Bir bahar akşamı süzülür içime,\nAkşamın serinliği, gölgelerin dansı.\nKalemden dökülen her hecede,\nSaklıdır gençliğin o eşsiz rüyası.\n\n[Dilediğiniz dizeleri veya denemenizi buraya yazın]', {
      name: 'Şiir Dörtlükleri', left: 75, top: 265, width: 400, fontSize: 13.5, fontFamily: 'Playfair Display', fontStyle: 'italic', textAlign: 'center', fill: '#334155', lineHeight: 1.8
    });
    if (page.showMasterPage !== false && typeof renderMasterPageOverlay === 'function') {
      renderMasterPageOverlay(fCanvas, pageIndex);
    }
    checkDone();
    return;
  }

  // Varsayılan / Quiz / Video / Serbest Sayfa
  fCanvas.setBackgroundColor(page.bgColor || '#ffffff', fCanvas.renderAll.bind(fCanvas));
  addFabText(fCanvas, page.title || page.questionTitle || page.navTitle || 'DERGİ SAYFASI', {
    name: 'Sayfa Başlığı', fieldKey: 'title',
    left: 36, top: 38, width: 478, fontSize: 30, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#0f172a'
  });
  addFabText(fCanvas, page.content || page.questionText || page.subTitle || 'Sol panelden metin, görsel, şekil veya hazır bileşen ekleyerek ya da bu kutuları sürükleyip boyutlandırarak sayfanızı tasarlayın.', {
    name: 'Sayfa Açıklama Metni', fieldKey: 'content',
    left: 36, top: 96, width: 478, fontSize: 14, fontFamily: 'Inter', fill: '#334155', lineHeight: 1.55
  });
  if (page.image || page.videoPoster) {
    queueImg(page.image || page.videoPoster, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', {
      name: 'Sayfa Görseli', fieldKey: 'image',
      left: 36, top: 185, width: 478, height: 310, radius: 16, shadow: true
    });
  }
  addStandardPageFooter(fCanvas, page, pageIndex);
  checkDone();
}

// ============================================================================
// 6. SOL PANELDEN YENİ ÖĞE EKLEME, KATMAN, HİZALAMA, GRUPLAMA, KIRPMA & FİLTRELER
// ============================================================================
function getCurrentFabricCanvas() {
  if (window.activeFabricCanvas && window.activeFabricCanvas.getActiveObject()) {
    return window.activeFabricCanvas;
  }
  return window.fabricCanvases[selectedEditIndex] || window.activeFabricCanvas || null;
}

function addCanvasElement(type, preset = {}) {
  const fCanvas = getCurrentFabricCanvas();
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!fCanvas || !page) return;
  if (!canUserEditPage(page)) {
    showToast('Bu sayfada düzenleme yetkiniz yok.');
    return;
  }

  let createdObj = null;

  if (type === 'text') {
    createdObj = addFabText(fCanvas, preset.content || 'Yeni Metin Başlığı', {
      name: preset.name || 'Metin Kutusu',
      left: 110,
      top: 180,
      width: 320,
      fontSize: Number(preset.fontSize) || 24,
      fontFamily: preset.fontFamily || 'Playfair Display',
      fontWeight: preset.fontWeight || 'bold',
      fill: preset.color || '#0f172a',
      textAlign: preset.textAlign || 'left'
    });
  } else if (type === 'card' || type === 'qbox') {
    const bg = preset.bgColor && !preset.bgColor.startsWith('linear') ? preset.bgColor : (type === 'qbox' ? '#065f46' : '#1e1b4b');
    const cardRect = new fabric.Rect({
      width: 300,
      height: 150,
      rx: 16,
      ry: 16,
      fill: bg,
      originX: 'center',
      originY: 'center'
    });
    const cardText = new fabric.Textbox(type === 'qbox' ? 'Günün Sorusu: Bu konu hakkında ne düşünüyorsunuz?' : (preset.content || 'Özel Vurgu Çerçevesi\nAlt açıklama metni buraya yazılır.'), {
      width: 268,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });
    createdObj = new fabric.Group([cardRect, cardText], {
      id: 'grp-' + Date.now(),
      name: type === 'qbox' ? 'Soru Kartı' : 'Renkli Çerçeve Kartı',
      customType: 'group',
      left: 125,
      top: 220,
      shadow: new fabric.Shadow({ color: 'rgba(15,23,42,0.28)', blur: 18, offsetX: 0, offsetY: 6 })
    });
    fCanvas.add(createdObj);
  } else if (type === 'shape') {
    const st = preset.shapeType || 'rect';
    const fill = preset.bgColor || '#4f46e5';
    if (st === 'circle') {
      createdObj = new fabric.Circle({
        id: 'shp-' + Date.now(),
        name: 'Daire Şekli',
        customType: 'shape',
        left: 195,
        top: 240,
        radius: 75,
        fill: fill,
        shadow: new fabric.Shadow({ color: 'rgba(15,23,42,0.2)', blur: 14, offsetX: 0, offsetY: 5 })
      });
      fCanvas.add(createdObj);
    } else if (st === 'triangle') {
      createdObj = new fabric.Triangle({
        id: 'shp-' + Date.now(),
        name: 'Üçgen Şekli',
        customType: 'shape',
        left: 195,
        top: 240,
        width: 150,
        height: 140,
        fill: fill
      });
      fCanvas.add(createdObj);
    } else if (st === 'line') {
      createdObj = addFabRect(fCanvas, {
        name: 'Ayırıcı Çizgi',
        left: 95,
        top: 320,
        width: 360,
        height: 4,
        rx: 2,
        fill: fill
      });
    } else {
      createdObj = addFabRect(fCanvas, {
        name: 'Dikdörtgen Kutu',
        left: 155,
        top: 230,
        width: 240,
        height: 150,
        rx: Number(preset.borderRadius) || 14,
        fill: fill,
        shadow: true
      });
    }
  } else if (type === 'button' || type === 'hotspot') {
    const bg = preset.bgColor || (type === 'hotspot' ? '#e11d48' : '#2563eb');
    const lbl = preset.label || (type === 'hotspot' ? '+ DETAY' : 'İNCELE / TIKLA →');
    const btnRect = new fabric.Rect({
      width: type === 'hotspot' ? 120 : 185,
      height: 42,
      rx: 21,
      ry: 21,
      fill: bg,
      originX: 'center',
      originY: 'center'
    });
    const btnTxt = new fabric.Textbox(lbl, {
      width: type === 'hotspot' ? 104 : 165,
      fontSize: 12,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });
    createdObj = new fabric.Group([btnRect, btnTxt], {
      id: 'btn-' + Date.now(),
      name: type === 'hotspot' ? 'Etkileşim Noktası' : 'Etkileşimli Buton',
      customType: type,
      left: 180,
      top: 320,
      actionType: preset.actionType || (type === 'hotspot' ? 'popup' : 'link'),
      actionValue: preset.actionValue || 'https://dergimiz.com.tr',
      popupTitle: preset.popupTitle || 'Detaylı Bilgi',
      popupText: preset.popupText || 'Açılır pencere açıklamasını sağdaki Eylemler sekmesinden düzenleyebilirsiniz.',
      shadow: new fabric.Shadow({ color: 'rgba(15,23,42,0.28)', blur: 14, offsetX: 0, offsetY: 5 })
    });
    fCanvas.add(createdObj);
  } else if (type === 'table') {
    const hdr = addFabRect(fCanvas, {
      name: 'Tablo Başlık Kutusu', left: 65, top: 240, width: 420, height: 34, rx: 8, fill: page.accentColor || '#1e293b'
    });
    addFabText(fCanvas, 'BAŞLIK 1                                              BAŞLIK 2', {
      name: 'Tablo Başlık Yazısı', left: 80, top: 251, width: 390, fontSize: 11, fontFamily: 'Inter', fontWeight: 'bold', fill: '#ffffff'
    });
    for (let i = 0; i < 3; i++) {
      const ry = 280 + i * 44;
      addFabRect(fCanvas, {
        name: `Tablo Satır ${i + 1}`, left: 65, top: ry, width: 420, height: 38, rx: 6, fill: i % 2 === 0 ? '#ffffff' : '#f8fafc', stroke: '#cbd5e1', strokeWidth: 1
      });
      addFabText(fCanvas, `Kategori ${i + 1}                                       Açıklama Detayı`, {
        name: `Tablo Hücre ${i + 1}`, left: 80, top: ry + 11, width: 390, fontSize: 12, fontFamily: 'Inter', fill: '#334155'
      });
    }
    createdObj = hdr;
  } else if (type === 'image' || type === 'slideshow' || type === 'map' || type === 'audio' || type === 'video') {
    const defaultImg = preset.url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80';
    loadFabricImageIntoSlot(fCanvas, defaultImg, defaultImg, {
      name: 'Görsel',
      left: 135,
      top: 190,
      width: 280,
      height: 260,
      radius: 14,
      shadow: true
    }, (img) => {
      if (img) {
        fCanvas.setActiveObject(img);
        fCanvas.requestRenderAll();
        saveFabricPageState(selectedEditIndex);
        pushFabricHistory(selectedEditIndex);
        renderRightEditorPanel();
      }
    });
    return;
  }

  if (createdObj) {
    fCanvas.setActiveObject(createdObj);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    pushFabricHistory(selectedEditIndex);
    renderRightEditorPanel();
    showToast('✨ Öğe tuvale eklendi!');
  }
}

// Bilgisayardan Yeni Görsel Yükleme veya Seçili Görseli Değiştirme
function handleCanvasImageUpload(event, replaceActive = false) {
  const file = event.target.files?.[0];
  if (!file) return;
  const fCanvas = getCurrentFabricCanvas();
  if (!fCanvas) return;

  const formData = new FormData();
  formData.append('image', file);
  showToast('📸 Fotoğraf yükleniyor...');

  fetch('/api/upload', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      const url = data.url || URL.createObjectURL(file);
      applyUploadedImageToFabric(fCanvas, url, replaceActive);
    })
    .catch(() => {
      const localUrl = URL.createObjectURL(file);
      applyUploadedImageToFabric(fCanvas, localUrl, replaceActive);
    });
  event.target.value = '';
}

function applyUploadedImageToFabric(fCanvas, url, replaceActive) {
  const active = fCanvas.getActiveObject();
  if (active && (active.isGridSlot || active.customType === 'photo_slot')) {
    if (typeof fitImageIntoGridSlot === 'function') {
      fitImageIntoGridSlot(active, url, fCanvas);
      return;
    }
  }
  if (replaceActive && active && active.type === 'image') {
    const oldW = active.getScaledWidth();
    const oldH = active.getScaledHeight();
    const oldLeft = active.left;
    const oldTop = active.top;
    const oldAngle = active.angle || 0;
    const oldRad = active.cornerRadiusPx || 0;
    const oldMask = active.maskType || 'none';
    const oldKey = active.fieldKey || null;

    fCanvas.remove(active);
    loadFabricImageIntoSlot(fCanvas, url, url, {
      name: active.name || 'Görsel',
      fieldKey: oldKey,
      left: oldLeft,
      top: oldTop,
      width: oldW,
      height: oldH,
      angle: oldAngle,
      radius: oldRad,
      maskType: oldMask,
      shadow: true
    }, (newImg) => {
      if (newImg) {
        if (oldKey && magazineData.pages[selectedEditIndex]) {
          magazineData.pages[selectedEditIndex][oldKey] = url;
        }
        fCanvas.setActiveObject(newImg);
        fCanvas.requestRenderAll();
        saveFabricPageState(selectedEditIndex);
        pushFabricHistory(selectedEditIndex);
        renderRightEditorPanel();
        showToast('✅ Görsel değiştirildi!');
      }
    });
  } else {
    loadFabricImageIntoSlot(fCanvas, url, url, {
      name: 'Yüklenen Görsel',
      left: 125,
      top: 180,
      width: 300,
      height: 280,
      radius: 14,
      shadow: true
    }, (newImg) => {
      if (newImg) {
        fCanvas.setActiveObject(newImg);
        fCanvas.requestRenderAll();
        saveFabricPageState(selectedEditIndex);
        pushFabricHistory(selectedEditIndex);
        renderRightEditorPanel();
        showToast('✅ Görsel sayfaya eklendi!');
      }
    });
  }
}

// Katman Sırası (En Öne, Bir Öne, Bir Arkaya, En Arkaya)
function changeFabricLayerOrder(direction) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;

  if (direction === 'front') fCanvas.bringToFront(active);
  else if (direction === 'forward') fCanvas.bringForward(active);
  else if (direction === 'backward') fCanvas.sendBackwards(active);
  else if (direction === 'back') fCanvas.sendToBack(active);

  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  pushFabricHistory(selectedEditIndex);
  if (typeof renderLayersPopover === 'function') renderLayersPopover();
}

// 6 Yönlü Sayfa Hizalama (Sol, Yatay Orta, Sağ, Üst, Dikey Orta, Alt)
function alignSelectedElement(mode) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;

  const boundW = active.getScaledWidth();
  const boundH = active.getScaledHeight();
  const margin = 28;

  if (mode === 'left') active.set('left', margin);
  else if (mode === 'center') active.set('left', Math.round((FABRIC_W - boundW) / 2));
  else if (mode === 'right') active.set('left', Math.round(FABRIC_W - boundW - margin));
  else if (mode === 'top') active.set('top', margin);
  else if (mode === 'middle') active.set('top', Math.round((FABRIC_H - boundH) / 2));
  else if (mode === 'bottom') active.set('top', Math.round(FABRIC_H - boundH - margin));

  active.setCoords();
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  pushFabricHistory(selectedEditIndex);
  syncLiveGeometryInputs(active);
}

// Çoklu Seçim Gruplama (Group) ve Grubu Çözme (Ungroup)
function groupSelectedFabricObjects() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active || active.type !== 'activeSelection') {
    showToast('Gruplamak için Shift ile veya fareyle tarayarak birden fazla öğe seçin.');
    return;
  }
  const grp = active.toGroup();
  grp.set({
    id: 'grp-' + Date.now(),
    name: 'Gruplanmış Öğeler',
    customType: 'group'
  });
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  pushFabricHistory(selectedEditIndex);
  renderRightEditorPanel();
  showToast('🔗 Seçili öğeler gruplandı!');
}

function ungroupSelectedFabricObjects() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active || active.type !== 'group') return;
  active.toActiveSelection();
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  pushFabricHistory(selectedEditIndex);
  renderRightEditorPanel();
  showToast('🔓 Grup çözüldü, öğeler ayrıldı!');
}

// Öğeyi Kilitle / Kilidi Aç
function toggleLockSelectedFabricObject() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;

  const newLock = !active.lockMovementX;
  active.set({
    lockMovementX: newLock,
    lockMovementY: newLock,
    lockScalingX: newLock,
    lockScalingY: newLock,
    lockRotation: newLock,
    hasControls: !newLock
  });
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  renderRightEditorPanel();
  showToast(newLock ? '🔒 Öğe kilitlendi.' : '🔓 Öğe kilidi açıldı.');
}

// Seçili Öğeyi Çoğalt (Duplicate)
function duplicateSelectedCanvasElement() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) {
    showToast('Çoğaltmak için önce bir öğe seçin.');
    return;
  }
  active.clone((cloned) => {
    fCanvas.discardActiveObject();
    cloned.set({
      id: 'clone-' + Date.now(),
      left: (active.left || 40) + 22,
      top: (active.top || 40) + 22,
      evented: true
    });
    if (cloned.type === 'activeSelection') {
      cloned.canvas = fCanvas;
      cloned.forEachObject((obj) => fCanvas.add(obj));
      cloned.setCoords();
    } else {
      fCanvas.add(cloned);
    }
    fCanvas.setActiveObject(cloned);
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    pushFabricHistory(selectedEditIndex);
    renderRightEditorPanel();
    showToast('📋 Öğe çoğaltıldı!');
  }, FABRIC_CUSTOM_PROPS);
}

// Seçili Öğeyi Sil (Delete)
function deleteSelectedCanvasElement() {
  const fCanvas = getCurrentFabricCanvas();
  const page = magazineData?.pages?.[selectedEditIndex];
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;

  // Drop Cap veya Text Wrap temizliği
  if (active._dropCapObj) {
    fCanvas.remove(active._dropCapObj);
  } else if (active._parentTextObj) {
    active._parentTextObj._dropCapObj = null;
  }
  if (active.isTextWrap && typeof restoreTextWrapEngine === 'function') {
    restoreTextWrapEngine(fCanvas, active);
  }

  if (active.type === 'activeSelection') {
    active.getObjects().forEach(obj => {
      if (obj._dropCapObj) fCanvas.remove(obj._dropCapObj);
      if (obj.isTextWrap && typeof restoreTextWrapEngine === 'function') restoreTextWrapEngine(fCanvas, obj);
      fCanvas.remove(obj);
    });
  } else {
    fCanvas.remove(active);
  }
  fCanvas.discardActiveObject();
  fCanvas.requestRenderAll();
  if (page) page.isCustomized = true;
  saveFabricPageState(selectedEditIndex);
  pushFabricHistory(selectedEditIndex);
  renderRightEditorPanel();
  if (typeof renderLayersPopover === 'function') renderLayersPopover();
  showToast('🗑️ Seçili öğe silindi.');
}

// ============================================================================
// BAĞLAMSAL SAĞ TIK MENÜSÜ & PANO (CLIPBOARD) MOTORU
// ============================================================================
window.fabricClipboard = null;
window.fabricContextMenuPointer = null;

function copyActiveCanvasElement() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active || active.isMasterPageObject) {
    showToast('Kopyalamak için önce bir öğe seçin.');
    return;
  }
  active.clone((cloned) => {
    window.fabricClipboard = cloned;
    showToast('📋 Öğe panoya kopyalandı (Ctrl+C)');
  }, FABRIC_CUSTOM_PROPS);
}

function pasteCanvasElement(targetPointer = null) {
  if (!window.fabricClipboard) {
    showToast('Panoda kopyalanmış bir öğe yok. Önce bir öğeyi kopyalayın.');
    return;
  }
  const fCanvas = getCurrentFabricCanvas();
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!fCanvas || !page) return;

  window.fabricClipboard.clone((clonedObj) => {
    fCanvas.discardActiveObject();
    const posX = targetPointer ? targetPointer.x : (clonedObj.left || 50) + 24;
    const posY = targetPointer ? targetPointer.y : (clonedObj.top || 50) + 24;
    clonedObj.set({
      id: 'copy_' + Date.now(),
      left: Math.max(10, Math.min(520, posX)),
      top: Math.max(10, Math.min(740, posY)),
      evented: true
    });
    if (clonedObj.type === 'activeSelection') {
      clonedObj.canvas = fCanvas;
      clonedObj.forEachObject(obj => fCanvas.add(obj));
      clonedObj.setCoords();
    } else {
      fCanvas.add(clonedObj);
    }
    fCanvas.setActiveObject(clonedObj);
    fCanvas.requestRenderAll();
    page.isCustomized = true;
    saveFabricPageState(selectedEditIndex);
    pushFabricHistory(selectedEditIndex);
    renderRightEditorPanel();
    showToast('📋 Öğe sayfaya yapıştırıldı (Ctrl+V)');
  }, FABRIC_CUSTOM_PROPS);
}

function centerObjectHorizontally() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;
  active.centerH();
  active.setCoords();
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  showToast('📐 Öğe sayfada yatay ortalandı.');
}

function toggleLockActiveObject() {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;
  const isLocked = Boolean(active.lockedByUser || active.lockMovementX);
  const newLock = !isLocked;
  active.set({
    lockedByUser: newLock,
    lockMovementX: newLock,
    lockMovementY: newLock,
    lockScalingX: newLock,
    lockScalingY: newLock,
    lockRotation: newLock,
    hasControls: !newLock
  });
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  renderRightEditorPanel();
  showToast(newLock ? '🔒 Öğe kilitlendi.' : '🔓 Öğe kilidi açıldı.');
}

function clearCurrentPageObjects() {
  const fCanvas = getCurrentFabricCanvas();
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!fCanvas || !page) return;
  if (!confirm('Bu sayfadaki tüm öğeleri silip bembeyaz boşaltmak istediğinize emin misiniz?')) return;
  fCanvas.clear();
  fCanvas.setBackgroundColor(page.bgColor || '#ffffff', fCanvas.renderAll.bind(fCanvas));
  page.isCustomized = true;
  page.fabricJSON = { version: '5.3.0', objects: [] };
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  pushFabricHistory(selectedEditIndex);
  renderRightEditorPanel();
  showToast('📄 Sayfa bembeyaz boşaltıldı.');
}

function moveFabricObjectLayer(direction) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;
  if (direction === 'front') active.bringToFront();
  else if (direction === 'forward') active.bringForward();
  else if (direction === 'backward') active.sendBackwards();
  else if (direction === 'back') active.sendToBack();
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  pushFabricHistory(selectedEditIndex);
  if (typeof renderLayersPopover === 'function') renderLayersPopover();
}

function closeFabricContextMenu() {
  const menu = document.getElementById('fabricContextMenu');
  if (menu) menu.classList.add('hidden');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('#fabricContextMenu')) {
    closeFabricContextMenu();
  }
});

document.addEventListener('scroll', closeFabricContextMenu, true);

function openFabricContextMenu(e, fCanvas, pageIndex) {
  const menu = document.getElementById('fabricContextMenu');
  if (!menu || !fCanvas) return;

  const target = fCanvas.findTarget(e, false);
  if (target && !target.isMasterPageObject) {
    fCanvas.setActiveObject(target);
    fCanvas.requestRenderAll();
    renderRightEditorPanel();
  } else if (!target) {
    fCanvas.discardActiveObject();
    fCanvas.requestRenderAll();
    renderRightEditorPanel();
  }

  const active = fCanvas.getActiveObject();
  const pointer = fCanvas.getPointer(e);
  window.fabricContextMenuPointer = pointer;

  let itemsHtml = '';

  if (active && !active.isMasterPageObject) {
    const isText = active.type === 'textbox' || active.type === 'i-text';
    const isImage = active.type === 'image' || active.isGridSlot;
    const isLocked = Boolean(active.lockedByUser || active.lockMovementX);

    itemsHtml += `
      <div class="px-2.5 py-1.5 mb-1 text-[10.5px] font-bold text-slate-400 border-b border-slate-800 flex items-center justify-between">
        <span class="truncate max-w-[140px] text-white">${escapeHtml(active.name || (isText ? 'Metin Kutusu' : isImage ? 'Görsel Kutusu' : 'Şekil'))}</span>
        <span class="text-[9.5px] text-indigo-400 font-mono font-bold">${isText ? 'METİN' : isImage ? 'GÖRSEL' : 'NESNE'}</span>
      </div>

      <button onclick="copyActiveCanvasElement(); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-copy text-sm text-slate-300"></i><span>Kopyala</span></div>
        <kbd class="ctx-kbd">Ctrl+C</kbd>
      </button>
      <button onclick="pasteCanvasElement(window.fabricContextMenuPointer); closeFabricContextMenu();" class="ctx-item ${!window.fabricClipboard ? 'opacity-40 pointer-events-none' : ''}">
        <div class="flex items-center gap-2"><i class="ph ph-clipboard text-sm text-slate-300"></i><span>Yapıştır</span></div>
        <kbd class="ctx-kbd">Ctrl+V</kbd>
      </button>
      <button onclick="duplicateSelectedCanvasElement(); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-copy-simple text-sm text-amber-400"></i><span>Çoğalt</span></div>
        <kbd class="ctx-kbd">Ctrl+D</kbd>
      </button>
      <button onclick="deleteSelectedCanvasElement(); closeFabricContextMenu();" class="ctx-item text-rose-400 hover:text-rose-300 hover:bg-rose-500/20">
        <div class="flex items-center gap-2"><i class="ph ph-trash text-sm"></i><span>Sil</span></div>
        <kbd class="ctx-kbd">Del</kbd>
      </button>

      <div class="my-1 border-t border-slate-800"></div>

      <button onclick="moveFabricObjectLayer('front'); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-arrow-fat-line-up text-sm text-indigo-400"></i><span>En Öne Getir</span></div>
        <kbd class="ctx-kbd">Ctrl+]</kbd>
      </button>
      <button onclick="moveFabricObjectLayer('back'); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-arrow-fat-line-down text-sm text-indigo-400"></i><span>En Arkaya Gönder</span></div>
        <kbd class="ctx-kbd">Ctrl+[</kbd>
      </button>
      <button onclick="toggleLockActiveObject(); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ${isLocked ? 'ph-lock-open text-emerald-400' : 'ph-lock text-amber-400'} text-sm"></i><span>${isLocked ? 'Kilidi Aç' : 'Kilitle'}</span></div>
      </button>
      <button onclick="centerObjectHorizontally(); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-align-center-horizontal text-sm text-slate-300"></i><span>Sayfada Ortala (Yatay)</span></div>
      </button>
      <button onclick="toggleTextWrapOnActiveObject(); closeFabricContextMenu();" class="ctx-item ${active.isTextWrap ? 'text-sky-300 bg-sky-500/10' : ''}">
        <div class="flex items-center gap-2"><i class="ph ph-waves text-sm text-sky-400"></i><span>Metin Akıt (Text Wrap) ${active.isTextWrap ? '✓' : ''}</span></div>
      </button>
    `;

    if (isText) {
      itemsHtml += `
        <div class="my-1 border-t border-slate-800"></div>
        <div class="px-2 py-1 text-[9.5px] font-bold text-amber-400 uppercase tracking-wider">Hızlı Metin Araçları</div>
        <button onclick="toggleDropCapForActiveText(); closeFabricContextMenu();" class="ctx-item text-amber-300 hover:bg-amber-500/20">
          <div class="flex items-center gap-2"><i class="ph ph-text-aa text-sm"></i><span>Drop Cap (Büyük Baş Harf)</span></div>
        </button>
        <button onclick="runSmartElementAICommand('tdk imla düzelt'); closeFabricContextMenu();" class="ctx-item text-teal-300 hover:bg-teal-500/20">
          <div class="flex items-center gap-2"><i class="ph ph-spell-check text-sm"></i><span>TDK İmla Düzelt</span></div>
          <span class="text-[9px] bg-teal-500/20 px-1.5 py-0.5 rounded text-teal-300">AI</span>
        </button>
        <button onclick="runSmartElementAICommand('2 sütuna böl'); closeFabricContextMenu();" class="ctx-item">
          <div class="flex items-center gap-2"><i class="ph ph-columns text-sm text-indigo-400"></i><span>2 Sütuna Böl</span></div>
        </button>
        <button onclick="runSmartElementAICommand('çekme alıntı yap'); closeFabricContextMenu();" class="ctx-item">
          <div class="flex items-center gap-2"><i class="ph ph-quotes text-sm text-amber-400"></i><span>Çekme Alıntı Yap</span></div>
        </button>
      `;
    }

    if (isImage) {
      itemsHtml += `
        <div class="my-1 border-t border-slate-800"></div>
        <div class="px-2 py-1 text-[9.5px] font-bold text-sky-400 uppercase tracking-wider">Görsel Araçları</div>
        <button onclick="document.getElementById('gridSlotFileInput')?.click(); closeFabricContextMenu();" class="ctx-item text-sky-300 hover:bg-sky-500/20">
          <div class="flex items-center gap-2"><i class="ph ph-upload-simple text-sm"></i><span>Fotoğraf Yükle / Değiştir</span></div>
        </button>
        <button onclick="flipSelectedFabricImage('X'); closeFabricContextMenu();" class="ctx-item">
          <div class="flex items-center gap-2"><i class="ph ph-arrows-left-right text-sm text-slate-300"></i><span>Yatay Aynala (Flip X)</span></div>
        </button>
        <button onclick="flipSelectedFabricImage('Y'); closeFabricContextMenu();" class="ctx-item">
          <div class="flex items-center gap-2"><i class="ph ph-arrows-down-up text-sm text-slate-300"></i><span>Dikey Aynala (Flip Y)</span></div>
        </button>
        <button onclick="convertActiveImageToLoop(); closeFabricContextMenu();" class="ctx-item text-rose-300 hover:bg-rose-500/20">
          <div class="flex items-center gap-2"><i class="ph ph-video text-sm text-rose-400"></i><span>Canlı Bayrak / Video Yap</span></div>
          <span class="text-[9px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-300">Canlı</span>
        </button>
      `;
    }

  } else {
    itemsHtml += `
      <div class="px-2.5 py-1.5 mb-1 text-[10.5px] font-bold text-slate-400 border-b border-slate-800 flex items-center justify-between">
        <span>Sayfa ${pageIndex + 1} İşlemleri</span>
        <span class="text-[9.5px] text-emerald-400 font-mono font-bold">TUVAL</span>
      </div>

      <button onclick="pasteCanvasElement(window.fabricContextMenuPointer); closeFabricContextMenu();" class="ctx-item ${!window.fabricClipboard ? 'opacity-40 pointer-events-none' : ''}">
        <div class="flex items-center gap-2"><i class="ph ph-clipboard text-sm text-slate-300"></i><span>Buraya Yapıştır</span></div>
        <kbd class="ctx-kbd">Ctrl+V</kbd>
      </button>

      <div class="my-1 border-t border-slate-800"></div>

      <button onclick="addCanvaGrid('split_2_col'); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-grid-four text-sm text-sky-400"></i><span>2'li Dikey Izgara Ekle</span></div>
      </button>
      <button onclick="addQuarkRunaroundLayout(); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-layout text-sm text-indigo-400"></i><span>Portre + Metin Akıtma Düzeni</span></div>
      </button>

      <div class="my-1 border-t border-slate-800"></div>

      <button onclick="addQuarkFrame('text'); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-textbox text-sm text-indigo-400"></i><span>Boş Metin Kutusu Çiz</span></div>
      </button>
      <button onclick="addQuarkFrame('image'); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-image-square text-sm text-sky-400"></i><span>Boş Resim Kutusu Çiz</span></div>
      </button>
      <button onclick="addQuarkFrame('divider'); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-minus text-sm text-slate-400"></i><span>Yatay Çizgi Ekle</span></div>
      </button>

      <div class="my-1 border-t border-slate-800"></div>

      <button onclick="runLayoutDoctor(); closeFabricContextMenu();" class="ctx-item text-teal-300 hover:bg-teal-500/20">
        <div class="flex items-center gap-2"><i class="ph ph-first-aid text-sm text-teal-400"></i><span>AI Doktoru ile İncele</span></div>
      </button>
      <button onclick="toggleMasterPageForCurrentPage(); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-copy-simple text-sm text-amber-400"></i><span>Kalıp Sayfa (Master Page) Aç/Kapa</span></div>
      </button>
      <button onclick="saveCurrentPageAsUserTemplate(); closeFabricContextMenu();" class="ctx-item">
        <div class="flex items-center gap-2"><i class="ph ph-star text-sm text-amber-400"></i><span>Bu Sayfayı Şablon Kaydet</span></div>
      </button>

      <div class="my-1 border-t border-slate-800"></div>

      <button onclick="clearCurrentPageObjects(); closeFabricContextMenu();" class="ctx-item text-rose-400 hover:text-rose-300 hover:bg-rose-500/20">
        <div class="flex items-center gap-2"><i class="ph ph-trash text-sm"></i><span>Sayfayı Bembeyaz Boşalt</span></div>
      </button>
    `;
  }

  menu.innerHTML = itemsHtml;
  menu.classList.remove('hidden');

  const menuW = 240;
  const menuH = 320;
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  let left = e.clientX;
  let top = e.clientY;

  if (left + menuW > screenW - 10) left = screenW - menuW - 10;
  if (top + menuH > screenH - 10) top = screenH - menuH - 10;
  if (left < 10) left = 10;
  if (top < 10) top = 10;

  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

// Görsel Aynalama (Flip X / Flip Y)
function flipSelectedFabricImage(axis) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;
  if (axis === 'X') active.set('flipX', !active.flipX);
  if (axis === 'Y') active.set('flipY', !active.flipY);
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  pushFabricHistory(selectedEditIndex);
}

// Görsel Oranlı Kırpma (1:1 Kare, 3:4 Dikey, 4:3 Yatay, 16:9 Sinema, Sıfırla)
function cropSelectedFabricImageByRatio(ratioKey) {
  const fCanvas = getCurrentFabricCanvas();
  const img = fCanvas ? fCanvas.getActiveObject() : null;
  if (!img || img.type !== 'image' || !img._originalElement) return;

  const natW = img._originalElement.naturalWidth || img._originalElement.width || img.width;
  const natH = img._originalElement.naturalHeight || img._originalElement.height || img.height;
  const curDisplayW = img.getScaledWidth();

  if (ratioKey === 'reset') {
    img.set({
      cropX: 0,
      cropY: 0,
      width: natW,
      height: natH,
      scaleX: curDisplayW / natW,
      scaleY: curDisplayW / natW
    });
  } else {
    const ratioMap = { '1:1': 1, '3:4': 3 / 4, '4:3': 4 / 3, '16:9': 16 / 9 };
    const targetRatio = ratioMap[ratioKey] || 1;
    const natRatio = natW / natH;
    let cropW = natW;
    let cropH = natH;
    if (natRatio > targetRatio) {
      cropW = Math.round(natH * targetRatio);
    } else {
      cropH = Math.round(natW / targetRatio);
    }
    const cropX = Math.round((natW - cropW) / 2);
    const cropY = Math.round((natH - cropH) / 2);
    const newDisplayH = Math.round(curDisplayW / targetRatio);

    img.set({
      cropX: cropX,
      cropY: cropY,
      width: cropW,
      height: cropH,
      scaleX: curDisplayW / cropW,
      scaleY: newDisplayH / cropH
    });
  }

  applyImageCornerAndMask(img, img.maskType, img.cornerRadiusPx);
  img.setCoords();
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  pushFabricHistory(selectedEditIndex);
  renderRightEditorPanel();
  showToast('✂️ Görsel kırpma oranı uygulandı!');
}

// Görsel Filtre Motoru (Parlaklık, Kontrast, Doygunluk, Bulanıklık & Hazır Efektler)
function applyFabricImageFilter(prop, value) {
  const fCanvas = getCurrentFabricCanvas();
  const img = fCanvas ? fCanvas.getActiveObject() : null;
  if (!img || img.type !== 'image' || !fabric.Image.filters) return;

  if (prop === 'preset') {
    img.filterPreset = value;
    if (value === 'none') {
      img.filterBrightness = 0;
      img.filterContrast = 0;
      img.filterSaturation = 0;
      img.filterBlur = 0;
    }
  } else {
    img[prop] = Number(value) || 0;
  }

  const filters = [];
  const bVal = (Number(img.filterBrightness) || 0) / 100;
  const cVal = (Number(img.filterContrast) || 0) / 100;
  const sVal = (Number(img.filterSaturation) || 0) / 100;
  const blurVal = (Number(img.filterBlur) || 0) / 100;

  if (bVal !== 0) filters.push(new fabric.Image.filters.Brightness({ brightness: bVal }));
  if (cVal !== 0) filters.push(new fabric.Image.filters.Contrast({ contrast: cVal }));
  if (sVal !== 0) filters.push(new fabric.Image.filters.Saturation({ saturation: sVal }));
  if (blurVal > 0 && fabric.Image.filters.Blur) filters.push(new fabric.Image.filters.Blur({ blur: blurVal }));

  if (img.filterPreset === 'grayscale') {
    filters.push(new fabric.Image.filters.Grayscale());
  } else if (img.filterPreset === 'sepia') {
    filters.push(new fabric.Image.filters.Sepia());
  } else if (img.filterPreset === 'vintage' && fabric.Image.filters.Vintage) {
    filters.push(new fabric.Image.filters.Vintage());
  }

  img.filters = filters;
  img.applyFilters();
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  if (prop === 'preset') renderRightEditorPanel();
}

// ============================================================================
// 7. TAM BAĞLAMA DUYARLI (CONTEXT-AWARE) SAĞ PANEL DENETÇİSİ (AYARLAR & EYLEMLER)
// ============================================================================
function renderRightEditorPanel() {
  const settingsContainer = document.getElementById('rightInspector_settings');
  const actionsContainer = document.getElementById('rightInspector_actions');
  const badge = document.getElementById('editingPageBadge');
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!page) return;

  const isEditable = canUserEditPage(page);
  const lockBanner = document.getElementById('pageLockBanner');
  const pageActions = document.getElementById('pageActionFooter');

  if (badge && typeof getTemplateLabel === 'function') {
    badge.textContent = `Sayfa ${selectedEditIndex + 1} • ${getTemplateLabel(page.type)}`;
  }

  if (!isEditable) {
    if (lockBanner) lockBanner.classList.remove('hidden');
    if (pageActions) pageActions.classList.add('hidden');
  } else {
    if (lockBanner) lockBanner.classList.add('hidden');
    if (pageActions) pageActions.classList.remove('hidden');
  }

  if (typeof renderStatusControl === 'function') {
    renderStatusControl(page);
  }

  if (settingsContainer) {
    renderContextSettingsInspector(page, isEditable, settingsContainer);
  }
  if (actionsContainer) {
    renderContextActionsInspector(page, isEditable, actionsContainer);
  }
}

function renderContextSettingsInspector(page, isEditable, targetDom) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;

  // -------------------------------------------------------------------------
  // DURUM A: HİÇBİR NESNE SEÇİLİ DEĞİLSE ➔ SAYFA & MİZANPAJ AYARLARI
  // -------------------------------------------------------------------------
  if (!active) {
    const bgHex = (page.bgColor && page.bgColor.startsWith('#')) ? page.bgColor : '#ffffff';
    targetDom.innerHTML = `
      <div class="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-3 text-xs">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="font-bold text-white flex items-center gap-1.5">
            <i class="ph ph-files text-blue-400 text-base"></i> Sayfa & Mizanpaj Ayarları
          </span>
          <span class="text-[10px] text-slate-400 font-mono">550 × 778 px</span>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-slate-400 mb-1">Sayfa Başlığı (İçindekiler)</label>
          <input type="text" value="${escapeAttr(page.navTitle || '')}" oninput="updatePageField('navTitle', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none">
        </div>

        <div class="flex items-center justify-between pt-1">
          <span class="text-slate-300 font-semibold">Sayfa Arka Plan Rengi</span>
          <div class="flex items-center gap-1.5">
            <input type="color" value="${bgHex}" oninput="setFabricPageBackgroundColor(this.value)" class="w-7 h-7 rounded cursor-pointer bg-transparent border border-slate-700">
            <input type="text" value="${bgHex}" onchange="setFabricPageBackgroundColor(this.value)" class="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-mono text-white text-center">
          </div>
        </div>

        <!-- Hazır Sayfa Arka Plan Renk Paleti -->
        <div class="grid grid-cols-7 gap-1.5 pt-1">
          ${['#ffffff', '#f4f2ee', '#f8fafc', '#fffbeb', '#fef2f2', '#0f172a', '#1c1917'].map(col => `
            <button onclick="setFabricPageBackgroundColor('${col}')" class="h-6 rounded-lg border border-slate-700 transition transform hover:scale-105" style="background:${col};" title="${col}"></button>
          `).join('')}
        </div>

        <!-- Kalıp Sayfa (Master Page) & Şablon Kaydetme Aksiyonları -->
        <div class="pt-2 border-t border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-slate-300 font-semibold flex items-center gap-1.5">
              <i class="ph ph-copy-simple text-amber-400"></i> Kalıp Sayfa (Master Page)
            </span>
            <button onclick="toggleMasterPageForCurrentPage()" class="px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition ${page.showMasterPage !== false ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}">
              ${page.showMasterPage !== false ? '✓ Aktif' : 'Gizli'}
            </button>
          </div>
          <div class="grid grid-cols-2 gap-1.5 pt-1">
            <button onclick="promptSaveUserTemplate()" class="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-bold text-[10.5px] flex items-center justify-center gap-1 transition shadow">
              <i class="ph ph-star"></i> Şablon Kaydet
            </button>
            <button onclick="addBlankPage()" class="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[10.5px] flex items-center justify-center gap-1 transition">
              <i class="ph ph-file-plus"></i> + Boş Sayfa
            </button>
          </div>
        </div>
      </div>

      <!-- Mizanpaj Ekolü / Şablon Düzeni Değiştirici -->
      <div class="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-bold text-amber-400 flex items-center gap-1.5">
            <i class="ph ph-layout text-base"></i> Kapak / Sayfa Mizanpajı
          </span>
          <button onclick="rebuildCurrentPageFromTemplate()" class="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-[10px] font-bold text-slate-300 hover:text-white transition" title="Sayfayı varsayılan şablon nesneleriyle sıfırla">
            ↺ Şablonu Sıfırla
          </button>
        </div>
        <div class="grid grid-cols-2 gap-1.5">
          <button onclick="changePageLayout('minimalist')" class="px-2.5 py-2 rounded-xl text-[11px] font-bold border transition ${(page.layout === 'minimalist' || !page.layout) ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}">🏛️ Minimalist</button>
          <button onclick="changePageLayout('brutalist')" class="px-2.5 py-2 rounded-xl text-[11px] font-bold border transition ${page.layout === 'brutalist' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}">⚡ Brütalist</button>
          <button onclick="changePageLayout('modular')" class="px-2.5 py-2 rounded-xl text-[11px] font-bold border transition ${page.layout === 'modular' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}">📐 Modüler</button>
          <button onclick="changePageLayout('fullscreen')" class="px-2.5 py-2 rounded-xl text-[11px] font-bold border transition ${page.layout === 'fullscreen' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'}">🌄 Tam Ekran</button>
        </div>
      </div>

      <!-- Kullanım İpucu Kartı -->
      <div class="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-3 text-[11px] text-blue-200 leading-relaxed space-y-1.5">
        <div class="font-bold text-blue-300 flex items-center gap-1.5">
          <i class="ph ph-cursor-click text-sm"></i> Profesyonel Tuval İpuçları
        </div>
        <p>• Sayfadaki <strong>herhangi bir görsele, başlığa, siyah kutuya veya çizgiye</strong> tıklayarak seçebilirsiniz.</p>
        <p>• Fareyle basılı tutup tarayarak <strong>birden fazla öğeyi aynı anda seçebilir</strong> ve gruplayabilirsiniz.</p>
        <p>• Yazıyı değiştirmek için metin kutusuna <strong>çift tıklayın</strong>.</p>
      </div>
    `;
    return;
  }

  // -------------------------------------------------------------------------
  // DURUM B: EN AZ BİR NESNE SEÇİLİYSE ➔ ORTAK KONUM, EBAT, AÇI, HİZALAMA & KATMAN KUTUSU
  // -------------------------------------------------------------------------
  const curX = Math.round(active.left || 0);
  const curY = Math.round(active.top || 0);
  const curW = Math.round(active.getScaledWidth());
  const curH = Math.round(active.getScaledHeight());
  const curAngle = Math.round(active.angle || 0);
  const curOpacity = Math.round((active.opacity !== undefined ? active.opacity : 1) * 100);
  const isLocked = Boolean(active.lockMovementX);
  const isMulti = active.type === 'activeSelection';
  const isGroup = active.type === 'group';

  let html = `
    <!-- 1. HIZLI İŞLEM, GRUPLAMA, KATMAN VE 6 YÖNLÜ HİZALAMA KUTUSU -->
    <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
      <div class="flex items-center justify-between">
        <span class="font-bold text-white flex items-center gap-1.5 truncate">
          <i class="ph ph-Sliders text-blue-400"></i>
          <span>${escapeHtml(active.name || (isMulti ? 'Çoklu Seçim' : active.type.toUpperCase()))}</span>
        </span>
        <div class="flex items-center gap-1">
          <button onclick="toggleLockSelectedFabricObject()" class="p-1.5 rounded-lg ${isLocked ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'} transition" title="${isLocked ? 'Kilidi Aç' : 'Öğeyi Kilitle'}">
            <i class="ph ${isLocked ? 'ph-lock-key-fill' : 'ph-lock-simple-open'} text-xs"></i>
          </button>
          <button onclick="duplicateSelectedCanvasElement()" class="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition" title="Çoğalt (Ctrl+D)">
            <i class="ph ph-copy text-xs"></i>
          </button>
          <button onclick="deleteSelectedCanvasElement()" class="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white transition" title="Sil (Delete)">
            <i class="ph ph-trash text-xs"></i>
          </button>
        </div>
      </div>

      ${isMulti ? `
        <button onclick="groupSelectedFabricObjects()" class="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 shadow transition">
          <i class="ph ph-selection-plus text-sm"></i> Seçili Öğeleri Grupla (${active.getObjects().length} Öğe)
        </button>
      ` : ''}

      ${isGroup ? `
        <button onclick="ungroupSelectedFabricObjects()" class="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-1.5 shadow transition">
          <i class="ph ph-selection-slash text-sm"></i> Grubu Çöz (Öğeleri Ayır)
        </button>
      ` : ''}

      <!-- 6 Yönlü Sayfa Hizalama (Sol, Orta, Sağ, Üst, Merkez, Alt) -->
      <div>
        <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Sayfaya Göre Hizala</span>
        <div class="grid grid-cols-6 gap-1">
          <button onclick="alignSelectedElement('left')" class="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center" title="Sola Hizala"><i class="ph ph-align-left text-sm"></i></button>
          <button onclick="alignSelectedElement('center')" class="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center" title="Yatay Ortala"><i class="ph ph-align-center-horizontal text-sm"></i></button>
          <button onclick="alignSelectedElement('right')" class="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center" title="Sağa Hizala"><i class="ph ph-align-right text-sm"></i></button>
          <button onclick="alignSelectedElement('top')" class="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center" title="Üste Hizala"><i class="ph ph-align-top text-sm"></i></button>
          <button onclick="alignSelectedElement('middle')" class="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center" title="Dikey Ortala"><i class="ph ph-align-center-vertical text-sm"></i></button>
          <button onclick="alignSelectedElement('bottom')" class="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center" title="Alta Hizala"><i class="ph ph-align-bottom text-sm"></i></button>
        </div>
      </div>

      <!-- 4 Yönlü Katman Sırası (En Öne, Bir Öne, Bir Arkaya, En Arkaya) -->
      <div>
        <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Katman Sırası</span>
        <div class="grid grid-cols-4 gap-1 text-[10px] font-semibold">
          <button onclick="changeFabricLayerOrder('front')" class="py-1.5 px-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300" title="En Öne Getir">En Öne</button>
          <button onclick="changeFabricLayerOrder('forward')" class="py-1.5 px-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300" title="Bir Öne Getir">Bir Öne</button>
          <button onclick="changeFabricLayerOrder('backward')" class="py-1.5 px-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300" title="Bir Arkaya Gönder">Bir Arkaya</button>
          <button onclick="changeFabricLayerOrder('back')" class="py-1.5 px-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300" title="En Arkaya Gönder">En Arkaya</button>
        </div>
      </div>
    </div>

    <!-- 2. KONUM (X, Y), EBAT (G, Y) VE DÖNME AÇISI (°) KUTUSU -->
    <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
      <span class="font-bold text-white block">Ebat, Pozisyon & Açı</span>
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
          <span class="text-slate-400 font-semibold">Konum X</span>
          <input id="fabInpX" type="number" value="${curX}" oninput="updateFabricGeometryInput('left', Number(this.value))" class="w-16 bg-transparent text-right text-white font-mono focus:outline-none">
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
          <span class="text-slate-400 font-semibold">Konum Y</span>
          <input id="fabInpY" type="number" value="${curY}" oninput="updateFabricGeometryInput('top', Number(this.value))" class="w-16 bg-transparent text-right text-white font-mono focus:outline-none">
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
          <span class="text-slate-400 font-semibold">Genişlik</span>
          <input id="fabInpW" type="number" value="${curW}" oninput="updateFabricGeometryInput('width', Math.max(12, Number(this.value)))" class="w-16 bg-transparent text-right text-white font-mono focus:outline-none">
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
          <span class="text-slate-400 font-semibold">Yükseklik</span>
          <input id="fabInpH" type="number" value="${curH}" oninput="updateFabricGeometryInput('height', Math.max(12, Number(this.value)))" class="w-16 bg-transparent text-right text-white font-mono focus:outline-none">
        </div>
      </div>

      <div class="pt-1 space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-slate-300 font-semibold">Dönme Açısı</span>
          <span id="fabLblAngle" class="font-mono font-bold text-blue-400">${curAngle}°</span>
        </div>
        <input id="fabInpAngle" type="range" min="-180" max="180" value="${curAngle > 180 ? curAngle - 360 : curAngle}" oninput="updateFabricGeometryInput('angle', Number(this.value))" class="w-full accent-blue-500 cursor-pointer">
        <div class="grid grid-cols-5 gap-1 pt-0.5">
          <button onclick="updateFabricGeometryInput('angle', -15)" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">-15°</button>
          <button onclick="updateFabricGeometryInput('angle', -5)" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">-5°</button>
          <button onclick="updateFabricGeometryInput('angle', 0)" class="py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-[10px] text-blue-300 hover:text-white font-bold">0°</button>
          <button onclick="updateFabricGeometryInput('angle', 5)" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">+5°</button>
          <button onclick="updateFabricGeometryInput('angle', 15)" class="py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 font-mono">+15°</button>
        </div>
      </div>
    </div>

    <!-- 2B. METİN AKITMA (TEXT WRAP / RUNAROUND) KUTUSU (INDESIGN / QUARKXPRESS) -->
    <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
      <div class="flex items-center justify-between">
        <span class="font-bold text-white flex items-center gap-1.5">
          <i class="ph ph-waves text-sky-400"></i> Metin Akıtma (Text Wrap)
        </span>
        <button onclick="toggleTextWrapOnActiveObject()" class="px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition ${active.isTextWrap ? 'bg-sky-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}">
          ${active.isTextWrap ? '✓ Aktif' : 'Kapalı'}
        </button>
      </div>
      <p class="text-[10px] text-slate-400 leading-tight">Bu nesne hareket ettirildikçe metin kutuları etrafından otomatik dolanır.</p>
      ${active.isTextWrap ? `
        <div class="pt-1.5 border-t border-slate-800 flex items-center justify-between">
          <span class="text-slate-300 font-semibold text-[11px]">Kenar Boşluğu:</span>
          <div class="flex items-center gap-1.5">
            <input type="range" min="4" max="48" value="${active.textWrapMargin || 16}" oninput="updateActiveTextWrapMargin(this.value); const l = document.getElementById('lblWrapMargin'); if (l) l.textContent = this.value + ' px';" class="w-20 accent-sky-500 cursor-pointer">
            <span id="lblWrapMargin" class="font-mono text-white text-[11px] w-10 text-right">${active.textWrapMargin || 16} px</span>
          </div>
        </div>
      ` : ''}
    </div>

    ${(active.isGridSlot && active.customType === 'photo_slot') ? `
      <div class="bg-slate-900 p-3 rounded-2xl border border-sky-500/40 space-y-2 text-xs">
        <span class="font-bold text-sky-300 flex items-center gap-1.5">
          <i class="ph ph-image-square text-base"></i> Boş Izgara / Resim Çerçevesi
        </span>
        <p class="text-[10px] text-slate-400">İçine fotoğraf bırakabilir veya aşağıdaki butondan doğrudan resim seçebilirsiniz.</p>
        <button onclick="document.getElementById('gridSlotFileInput')?.click()" class="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center justify-center gap-1.5 shadow transition">
          <i class="ph ph-upload-simple text-sm"></i> Fotoğraf Yükle ve Sığdır (Cover)
        </button>
      </div>
    ` : ''}
  `;

  // -------------------------------------------------------------------------
  // DURUM C: METİN KUTUSU SEÇİLİYSE (TEXTBOX / I-TEXT)
  // -------------------------------------------------------------------------
  if (active.type === 'textbox' || active.type === 'i-text') {
    const fillHex = (active.fill && String(active.fill).startsWith('#')) ? active.fill : '#0f172a';
    const bgHex = (active.backgroundColor && String(active.backgroundColor).startsWith('#')) ? active.backgroundColor : '#ffffff';
    const hasBg = Boolean(active.backgroundColor);

    html += `
      <div class="bg-slate-900 p-3 rounded-2xl border border-amber-500/30 space-y-3 text-xs">
        <span class="font-bold text-amber-400 flex items-center gap-1.5">
          <i class="ph ph-text-t text-base"></i> Metin & Tipografi Ayarları
        </span>

        <!-- Hızlı Metin İçeriği Düzenleme -->
        <div>
          <label class="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Metin İçeriği</label>
          <textarea rows="2" oninput="updateFabricActiveProp('text', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none">${escapeHtml(active.text || '')}</textarea>
        </div>

        <!-- Yazı Tipi & Punto -->
        <div class="flex items-center gap-1.5">
          <select onchange="updateFabricActiveProp('fontFamily', this.value)" class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white">
            ${['Inter', 'Playfair Display', 'Space Grotesk', 'Cinzel', 'Merriweather', 'Caveat', 'monospace', 'Georgia', 'Impact'].map(ff => `
              <option value="${ff}" ${(active.fontFamily || '').includes(ff) ? 'selected' : ''}>${ff}</option>
            `).join('')}
          </select>
          <input id="fabInpFontSize" type="number" min="8" max="180" value="${Math.round(active.fontSize || 16)}" oninput="updateFabricActiveProp('fontSize', Math.max(8, Number(this.value)))" class="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white font-mono text-center" title="Yazı Boyutu (px)">
        </div>

        <!-- Stil Butonları: Kalın, İtalik, Altı Çizili, Hizalama -->
        <div class="grid grid-cols-7 gap-1">
          <button onclick="updateFabricActiveProp('fontWeight', activeFabricCanvas.getActiveObject()?.fontWeight === 'bold' ? 'normal' : 'bold'); renderRightEditorPanel();" class="p-1.5 rounded-lg border ${active.fontWeight === 'bold' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-950 text-slate-300 border-slate-800'} font-bold" title="Kalın">B</button>
          <button onclick="updateFabricActiveProp('fontStyle', activeFabricCanvas.getActiveObject()?.fontStyle === 'italic' ? 'normal' : 'italic'); renderRightEditorPanel();" class="p-1.5 rounded-lg border ${active.fontStyle === 'italic' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-950 text-slate-300 border-slate-800'} italic font-serif" title="İtalik">I</button>
          <button onclick="updateFabricActiveProp('underline', !activeFabricCanvas.getActiveObject()?.underline); renderRightEditorPanel();" class="p-1.5 rounded-lg border ${active.underline ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-950 text-slate-300 border-slate-800'} underline" title="Altı Çizili">U</button>
          <button onclick="updateFabricActiveProp('textAlign', 'left'); renderRightEditorPanel();" class="p-1.5 rounded-lg border ${active.textAlign === 'left' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-300 border-slate-800'} flex items-center justify-center"><i class="ph ph-text-align-left"></i></button>
          <button onclick="updateFabricActiveProp('textAlign', 'center'); renderRightEditorPanel();" class="p-1.5 rounded-lg border ${active.textAlign === 'center' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-300 border-slate-800'} flex items-center justify-center"><i class="ph ph-text-align-center"></i></button>
          <button onclick="updateFabricActiveProp('textAlign', 'right'); renderRightEditorPanel();" class="p-1.5 rounded-lg border ${active.textAlign === 'right' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-300 border-slate-800'} flex items-center justify-center"><i class="ph ph-text-align-right"></i></button>
          <button onclick="updateFabricActiveProp('textAlign', 'justify'); renderRightEditorPanel();" class="p-1.5 rounded-lg border ${active.textAlign === 'justify' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-300 border-slate-800'} flex items-center justify-center"><i class="ph ph-text-align-justify"></i></button>
        </div>

        <!-- Yazı Rengi & Vurgu Rengi -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
            <span class="text-slate-300">Yazı Rengi</span>
            <input type="color" value="${fillHex}" oninput="updateFabricActiveProp('fill', this.value)" class="w-6 h-6 rounded cursor-pointer bg-transparent border-0">
          </div>
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
            <span class="text-slate-300">Zemin</span>
            <div class="flex items-center gap-1">
              <input type="color" value="${bgHex}" oninput="updateFabricActiveProp('backgroundColor', this.value)" class="w-6 h-6 rounded cursor-pointer bg-transparent border-0">
              ${hasBg ? `<button onclick="updateFabricActiveProp('backgroundColor', ''); renderRightEditorPanel();" class="text-[10px] text-rose-400 px-1" title="Zemini Kaldır">✕</button>` : ''}
            </div>
          </div>
        </div>

        <!-- Satır Yüksekliği & Harf Aralığı -->
        <div class="space-y-2 pt-1">
          <div>
            <div class="flex justify-between text-[11px] text-slate-400">
              <span>Satır Aralığı</span>
              <span class="font-mono text-white">${Number(active.lineHeight || 1.25).toFixed(2)}</span>
            </div>
            <input type="range" min="0.85" max="2.5" step="0.05" value="${active.lineHeight || 1.25}" oninput="updateFabricActiveProp('lineHeight', Number(this.value))" class="w-full accent-amber-500 cursor-pointer">
          </div>
          <div>
            <div class="flex justify-between text-[11px] text-slate-400">
              <span>Harf Aralığı</span>
              <span class="font-mono text-white">${active.charSpacing || 0}</span>
            </div>
            <input type="range" min="-50" max="400" step="10" value="${active.charSpacing || 0}" oninput="updateFabricActiveProp('charSpacing', Number(this.value))" class="w-full accent-amber-500 cursor-pointer">
          </div>
        </div>

        <!-- Hızlı AI Eylemleri & Kinetik Animasyon Seçici -->
        <div class="pt-2 border-t border-slate-800 space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-bold text-amber-300">
            <span>✨ Hızlı AI Dönüşümleri</span>
            <button onclick="openAiPromptLibraryModal('text')" class="text-amber-400 hover:underline">Tümünü Gör (100) →</button>
          </div>
          <div class="grid grid-cols-2 gap-1 text-[10px] font-bold">
            <button onclick="runSmartElementAICommand('tdk imla düzelt')" class="py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200">🔍 TDK İmla</button>
            <button onclick="runSmartElementAICommand('manşet ve spot yap')" class="py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200">✨ Manşet & Spot</button>
            <button onclick="runSmartElementAICommand('çekme alıntı yap')" class="py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200">💬 Çekme Alıntı</button>
            <button onclick="runSmartElementAICommand('2 sütuna böl')" class="py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200">📰 2 Sütun Yap</button>
          </div>
          <button onclick="toggleDropCapForActiveText()" class="w-full py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-300 font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition shadow">
            <i class="ph ph-text-aa text-sm"></i>
            <span>${active._dropCapObj ? 'Drop Cap\'i Kaldır (Birleştir)' : '🔠 Drop Cap (Büyük Baş Harf)'}</span>
          </button>
          <div class="pt-1 flex items-center justify-between">
            <span class="text-slate-400 text-[10px]">Animasyon:</span>
            <select onchange="applyTextAnimation(this.value)" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-[10px] text-amber-300 font-semibold">
              <option value="">Yok (Sabit)</option>
              <option value="typewriter" ${active.textAnimation === 'typewriter' ? 'selected' : ''}>⌨️ Daktilo</option>
              <option value="fade_in" ${active.textAnimation === 'fade_in' ? 'selected' : ''}>🌊 Süzülme</option>
              <option value="shimmer" ${active.textAnimation === 'shimmer' ? 'selected' : ''}>✨ Işık / Neon</option>
              <option value="pulse" ${active.textAnimation === 'pulse' ? 'selected' : ''}>💓 Vurgu Nabzı</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // DURUM D: GÖRSEL SEÇİLİYSE (IMAGE — DEĞİŞTİR, KIRP, AYNALA, MASKE, FİLTRE)
  // -------------------------------------------------------------------------
  if (active.type === 'image') {
    const curRadius = Number(active.cornerRadiusPx) || 0;
    const curMask = active.maskType || 'none';
    const bVal = Number(active.filterBrightness) || 0;
    const cVal = Number(active.filterContrast) || 0;
    const sVal = Number(active.filterSaturation) || 0;
    const blurVal = Number(active.filterBlur) || 0;

    html += `
      <div class="bg-slate-900 p-3 rounded-2xl border border-sky-500/30 space-y-3 text-xs">
        <span class="font-bold text-sky-400 flex items-center gap-1.5">
          <i class="ph ph-image text-base"></i> Görsel Düzenleme & Kırpma
        </span>

        <!-- Görseli Değiştir -->
        <label class="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow transition">
          <i class="ph ph-camera text-base"></i> Görseli Değiştir / Yeni Yükle
          <input type="file" accept="image/*" onchange="handleCanvasImageUpload(event, true)" class="hidden">
        </label>

        <!-- Yatay & Dikey Aynalama (Flip X / Flip Y) -->
        <div class="grid grid-cols-2 gap-1.5">
          <button onclick="flipSelectedFabricImage('X')" class="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-1.5">
            <i class="ph ph-arrows-left-right"></i> Yatay Çevir
          </button>
          <button onclick="flipSelectedFabricImage('Y')" class="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-1.5">
            <i class="ph ph-arrows-down-up"></i> Dikey Çevir
          </button>
        </div>

        <!-- Oranlı Kırpma (Crop) -->
        <div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Görseli Kırp (En-Boy Oranı)</span>
          <div class="grid grid-cols-5 gap-1 text-[10px] font-bold">
            <button onclick="cropSelectedFabricImageByRatio('1:1')" class="py-1.5 rounded-lg bg-slate-950 hover:bg-sky-600 text-slate-300 hover:text-white border border-slate-800">1:1</button>
            <button onclick="cropSelectedFabricImageByRatio('3:4')" class="py-1.5 rounded-lg bg-slate-950 hover:bg-sky-600 text-slate-300 hover:text-white border border-slate-800">3:4</button>
            <button onclick="cropSelectedFabricImageByRatio('4:3')" class="py-1.5 rounded-lg bg-slate-950 hover:bg-sky-600 text-slate-300 hover:text-white border border-slate-800">4:3</button>
            <button onclick="cropSelectedFabricImageByRatio('16:9')" class="py-1.5 rounded-lg bg-slate-950 hover:bg-sky-600 text-slate-300 hover:text-white border border-slate-800">16:9</button>
            <button onclick="cropSelectedFabricImageByRatio('reset')" class="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white" title="Kırpmayı Sıfırla">Tam</button>
          </div>
        </div>

        <!-- Köşe Yuvarlatma & Maske Şekli -->
        <div class="space-y-2 pt-1 border-t border-slate-800">
          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>Köşe Yuvarlatma</span>
              <span class="font-mono text-white">${curRadius}px</span>
            </div>
            <input type="range" min="0" max="140" value="${curRadius}" oninput="updateSelectedImageMaskAndRadius(undefined, Number(this.value))" class="w-full accent-sky-500 cursor-pointer">
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-300">Çerçeve Maskesi</span>
            <select onchange="updateSelectedImageMaskAndRadius(this.value, undefined)" class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-white">
              <option value="none" ${curMask === 'none' ? 'selected' : ''}>Normal Dikdörtgen</option>
              <option value="circle" ${curMask === 'circle' ? 'selected' : ''}>⬤ Daire Maske</option>
              <option value="ellipse" ${curMask === 'ellipse' ? 'selected' : ''}>⬭ Elips Maske</option>
              <option value="diamond" ${curMask === 'diamond' ? 'selected' : ''}>◆ Elmas Maske</option>
              <option value="hexagon" ${curMask === 'hexagon' ? 'selected' : ''}>⬢ Altıgen Maske</option>
              <option value="triangle" ${curMask === 'triangle' ? 'selected' : ''}>▲ Üçgen Maske</option>
            </select>
          </div>
        </div>

        <!-- Görüntü Filtreleri (Parlaklık, Kontrast, Doygunluk, Bulanıklık & Efektler) -->
        <div class="space-y-2 pt-2 border-t border-slate-800">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-sky-400 block">Görüntü Filtreleri & Efektler</span>
          <div class="grid grid-cols-4 gap-1 text-[10px] font-bold">
            <button onclick="applyFabricImageFilter('preset', 'none')" class="py-1.5 rounded-lg ${(!active.filterPreset || active.filterPreset === 'none') ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'}">Normal</button>
            <button onclick="applyFabricImageFilter('preset', 'grayscale')" class="py-1.5 rounded-lg ${active.filterPreset === 'grayscale' ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'}">S/B</button>
            <button onclick="applyFabricImageFilter('preset', 'sepia')" class="py-1.5 rounded-lg ${active.filterPreset === 'sepia' ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'}">Sepya</button>
            <button onclick="applyFabricImageFilter('preset', 'vintage')" class="py-1.5 rounded-lg ${active.filterPreset === 'vintage' ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'}">Vintage</button>
          </div>

          <div>
            <div class="flex justify-between text-[11px] text-slate-400"><span>Parlaklık</span><span class="font-mono text-white">${bVal}</span></div>
            <input type="range" min="-80" max="80" value="${bVal}" oninput="applyFabricImageFilter('filterBrightness', this.value)" class="w-full accent-sky-500 cursor-pointer">
          </div>
          <div>
            <div class="flex justify-between text-[11px] text-slate-400"><span>Kontrast</span><span class="font-mono text-white">${cVal}</span></div>
            <input type="range" min="-80" max="80" value="${cVal}" oninput="applyFabricImageFilter('filterContrast', this.value)" class="w-full accent-sky-500 cursor-pointer">
          </div>
          <div>
            <div class="flex justify-between text-[11px] text-slate-400"><span>Doygunluk</span><span class="font-mono text-white">${sVal}</span></div>
            <input type="range" min="-100" max="100" value="${sVal}" oninput="applyFabricImageFilter('filterSaturation', this.value)" class="w-full accent-sky-500 cursor-pointer">
          </div>
          <div>
            <div class="flex justify-between text-[11px] text-slate-400"><span>Bulanıklık (Blur)</span><span class="font-mono text-white">${blurVal}</span></div>
            <input type="range" min="0" max="60" value="${blurVal}" oninput="applyFabricImageFilter('filterBlur', this.value)" class="w-full accent-sky-500 cursor-pointer">
          </div>
        </div>

        <!-- Hızlı Görsel AI & Canlı Döngü -->
        <div class="pt-2 border-t border-slate-800 space-y-1.5">
          <div class="flex items-center justify-between text-[10px] font-bold text-sky-300">
            <span>🎨 Hızlı Filtre & Canlı Görsel</span>
            <button onclick="openAiPromptLibraryModal('image')" class="text-sky-400 hover:underline">Tümünü Gör (100) →</button>
          </div>
          <div class="grid grid-cols-2 gap-1 text-[10px] font-bold">
            <button onclick="runSmartElementAICommand('sepya eskitme')" class="py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200">🎨 Sepya Eskitme</button>
            <button onclick="runSmartElementAICommand('siyah beyaz')" class="py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200">🖤 Siyah Beyaz</button>
            <button onclick="convertActiveImageToLoop('flag')" class="py-1 px-2 rounded-lg bg-slate-950 hover:bg-sky-600/30 border border-sky-500/30 text-sky-200">🇹🇷 Canlı Bayrak</button>
            <button onclick="convertActiveImageToLoop('nature')" class="py-1 px-2 rounded-lg bg-slate-950 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-200">🌊 Canlı Doğa</button>
          </div>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // DURUM E: ŞEKİL / KUTU / ÇERÇEVE SEÇİLİYSE (RECT / CIRCLE / TRIANGLE / GROUP)
  // -------------------------------------------------------------------------
  if (active.type === 'rect' || active.type === 'circle' || active.type === 'triangle' || active.type === 'polygon') {
    const fillHex = (active.fill && String(active.fill).startsWith('#')) ? active.fill : '#0f172a';
    const strokeHex = (active.stroke && String(active.stroke).startsWith('#')) ? active.stroke : '#0f172a';
    const rxVal = Math.round(active.rx || 0);

    html += `
      <div class="bg-slate-900 p-3 rounded-2xl border border-emerald-500/30 space-y-3 text-xs">
        <span class="font-bold text-emerald-400 flex items-center gap-1.5">
          <i class="ph ph-shapes text-base"></i> Kutu & Şekil Görünümü
        </span>

        <div class="grid grid-cols-2 gap-2">
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
            <span class="text-slate-300">Dolgu Rengi</span>
            <input type="color" value="${fillHex}" oninput="updateFabricActiveProp('fill', this.value)" class="w-6 h-6 rounded cursor-pointer bg-transparent border-0">
          </div>
          <div class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
            <span class="text-slate-300">Kenarlık</span>
            <input type="color" value="${strokeHex}" oninput="updateFabricActiveProp('stroke', this.value)" class="w-6 h-6 rounded cursor-pointer bg-transparent border-0">
          </div>
        </div>

        ${active.type === 'rect' ? `
          <div>
            <div class="flex justify-between text-slate-300 mb-1">
              <span>Köşe Yuvarlatma</span>
              <span class="font-mono text-white">${rxVal}px</span>
            </div>
            <input type="range" min="0" max="120" value="${rxVal}" oninput="updateFabricActiveProp('rx', Number(this.value)); updateFabricActiveProp('ry', Number(this.value));" class="w-full accent-emerald-500 cursor-pointer">
          </div>
        ` : ''}

        <div>
          <div class="flex justify-between text-slate-300 mb-1">
            <span>Kenarlık Kalınlığı</span>
            <span class="font-mono text-white">${active.strokeWidth || 0}px</span>
          </div>
          <input type="range" min="0" max="16" value="${active.strokeWidth || 0}" oninput="updateFabricActiveProp('strokeWidth', Number(this.value))" class="w-full accent-emerald-500 cursor-pointer">
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // ORTAK ALT KUTU: SAYDAMLIK (OPACITY) VE GÖLGE (DROP SHADOW)
  // -------------------------------------------------------------------------
  html += `
    <div class="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
      <div>
        <div class="flex justify-between text-slate-300 mb-1">
          <span>Saydamlık (Opaklık)</span>
          <span class="font-mono text-white">${curOpacity}%</span>
        </div>
        <input type="range" min="10" max="100" value="${curOpacity}" oninput="updateFabricActiveProp('opacity', Number(this.value) / 100)" class="w-full accent-blue-500 cursor-pointer">
      </div>
      <div class="flex items-center justify-between pt-1 border-t border-slate-800">
        <span class="text-slate-300">Derinlik Gölgesi (Drop Shadow)</span>
        <input type="checkbox" ${active.shadow ? 'checked' : ''} onchange="toggleFabricActiveShadow(this.checked)" class="w-4 h-4 accent-blue-500 rounded cursor-pointer">
      </div>
    </div>
  `;

  targetDom.innerHTML = html;
}

function renderContextActionsInspector(page, isEditable, targetDom) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;

  if (!active) {
    targetDom.innerHTML = `
      <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-center space-y-2">
        <i class="ph ph-lightning text-2xl text-amber-400 block"></i>
        <p>Tıklama eylemi (Web Linki, Sayfaya Git veya Açılır Pencere) atamak için tuval üzerinden bir öğe seçin.</p>
      </div>
    `;
    return;
  }

  const curAct = active.actionType || 'none';
  const curVal = active.actionValue || '';
  const popTitle = active.popupTitle || '';
  const popText = active.popupText || '';

  targetDom.innerHTML = `
    <div class="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-3 text-xs">
      <span class="font-bold text-white flex items-center gap-1.5">
        <i class="ph ph-lightning text-amber-400 text-base"></i> Tıklama Eylemi (Okuma Modunda)
      </span>

      <select onchange="updateFabricActiveProp('actionType', this.value); renderRightEditorPanel();" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white">
        <option value="none" ${curAct === 'none' ? 'selected' : ''}>Eylem Yok</option>
        <option value="link" ${curAct === 'link' ? 'selected' : ''}>🌐 Web Bağlantısı Aç (URL)</option>
        <option value="gotoPage" ${curAct === 'gotoPage' ? 'selected' : ''}>📖 Dergide Sayfaya Git</option>
        <option value="popup" ${curAct === 'popup' ? 'selected' : ''}>💬 Açılır Bilgi Penceresi (Popup)</option>
      </select>

      ${curAct === 'link' ? `
        <div>
          <label class="block text-[11px] text-slate-400 mb-1">Hedef Web Adresi (URL)</label>
          <input type="text" value="${escapeAttr(curVal)}" placeholder="https://..." oninput="updateFabricActiveProp('actionValue', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white">
        </div>
      ` : ''}

      ${curAct === 'gotoPage' ? `
        <div>
          <label class="block text-[11px] text-slate-400 mb-1">Gidilecek Sayfa Numarası</label>
          <input type="number" min="1" max="${magazineData.pages.length}" value="${escapeAttr(curVal || '1')}" oninput="updateFabricActiveProp('actionValue', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white">
        </div>
      ` : ''}

      ${curAct === 'popup' ? `
        <div class="space-y-2">
          <div>
            <label class="block text-[11px] text-slate-400 mb-1">Açılır Pencere Başlığı</label>
            <input type="text" value="${escapeAttr(popTitle)}" oninput="updateFabricActiveProp('popupTitle', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white">
          </div>
          <div>
            <label class="block text-[11px] text-slate-400 mb-1">Açılır Pencere Metni</label>
            <textarea rows="3" oninput="updateFabricActiveProp('popupText', this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white">${escapeHtml(popText)}</textarea>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// 8. DENETÇİ YARDIMCILARI, KATMANLAR POPOVER VE KLAVYE KISAYOLLARI
// ============================================================================
function updateFabricGeometryInput(prop, val) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active || isNaN(val)) return;

  if (prop === 'width') {
    if (active.type === 'textbox') {
      active.set({ width: val, scaleX: 1 });
    } else {
      active.scaleToWidth(val);
    }
  } else if (prop === 'height') {
    active.scaleToHeight(val);
  } else {
    active.set(prop, val);
  }
  active.setCoords();
  fCanvas.requestRenderAll();
  syncLiveGeometryInputs(active);
  saveFabricPageState(selectedEditIndex);
}

function updateFabricActiveProp(prop, val) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;

  active.set(prop, val);
  if (prop === 'text' && active.fieldKey && magazineData.pages[selectedEditIndex]) {
    magazineData.pages[selectedEditIndex][active.fieldKey] = val;
  }
  active.setCoords();
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
}

function updateSelectedImageMaskAndRadius(maskType, radiusPx) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active || active.type !== 'image') return;

  applyImageCornerAndMask(active, maskType, radiusPx);
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
  renderRightEditorPanel();
}

function toggleFabricActiveShadow(enabled) {
  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (!active) return;

  if (enabled) {
    active.set('shadow', new fabric.Shadow({ color: 'rgba(15, 23, 42, 0.32)', blur: 18, offsetX: 0, offsetY: 7 }));
  } else {
    active.set('shadow', null);
  }
  fCanvas.requestRenderAll();
  saveFabricPageState(selectedEditIndex);
}

function setFabricPageBackgroundColor(color) {
  const fCanvas = getCurrentFabricCanvas();
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!fCanvas || !page) return;
  page.bgColor = color;
  fCanvas.setBackgroundColor(color, fCanvas.renderAll.bind(fCanvas));
  saveFabricPageState(selectedEditIndex);
  renderRightEditorPanel();
}

function rebuildCurrentPageFromTemplate() {
  const fCanvas = getCurrentFabricCanvas();
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!fCanvas || !page) return;
  delete page.fabricJSON;
  buildFabricObjectsForTemplatePage(page, selectedEditIndex, fCanvas, () => {
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    pushFabricHistory(selectedEditIndex);
    renderRightEditorPanel();
    showToast('✨ Sayfa şablon nesneleri yeniden oluşturuldu.');
  });
}

function changePageLayout(newLayout) {
  const page = magazineData?.pages?.[selectedEditIndex];
  if (!page) return;
  page.layout = newLayout;
  rebuildCurrentPageFromTemplate();
}

// Katmanlar (Layers) Açılır Penceresini Fabric.js Nesneleriyle Doldur
function renderLayersPopover() {
  const container = document.getElementById('layersListContainer');
  if (!container) return;
  const fCanvas = getCurrentFabricCanvas();
  if (!fCanvas) {
    container.innerHTML = '<div class="text-slate-500 text-center py-3">Aktif sayfa yok</div>';
    return;
  }

  const objects = fCanvas.getObjects().filter(o => !o.isGuideLine);
  const active = fCanvas.getActiveObject();

  if (objects.length === 0) {
    container.innerHTML = '<div class="text-slate-500 text-center py-3">Bu sayfada henüz katman yok</div>';
    return;
  }

  container.innerHTML = objects.slice().reverse().map((obj, revIdx) => {
    const realIdx = objects.length - 1 - revIdx;
    const isSel = (active === obj);
    const label = obj.name || (obj.type === 'textbox' ? (obj.text || 'Metin').substring(0, 18) : obj.type);
    const icon = obj.type === 'image' ? 'ph-image text-sky-400' : (obj.type === 'textbox' ? 'ph-text-t text-amber-400' : 'ph-shapes text-emerald-400');

    return `
      <div onclick="selectFabricObjectByIndex(${realIdx})" class="flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition ${isSel ? 'bg-blue-600/30 border border-blue-500 text-white' : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'}">
        <div class="flex items-center gap-2 truncate">
          <i class="ph ${icon}"></i>
          <span class="truncate text-[11px] font-medium">${escapeHtml(label)}</span>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button onclick="event.stopPropagation(); toggleFabricObjectVisibility(${realIdx})" class="p-1 text-slate-400 hover:text-white" title="Gizle/Göster">
            <i class="ph ${obj.visible === false ? 'ph-eye-slash text-rose-400' : 'ph-eye'}"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function selectFabricObjectByIndex(idx) {
  const fCanvas = getCurrentFabricCanvas();
  if (!fCanvas) return;
  const objs = fCanvas.getObjects().filter(o => !o.isGuideLine);
  if (objs[idx]) {
    fCanvas.setActiveObject(objs[idx]);
    fCanvas.requestRenderAll();
    renderRightEditorPanel();
    renderLayersPopover();
  }
}

function toggleFabricObjectVisibility(idx) {
  const fCanvas = getCurrentFabricCanvas();
  if (!fCanvas) return;
  const objs = fCanvas.getObjects().filter(o => !o.isGuideLine);
  if (objs[idx]) {
    objs[idx].set('visible', !objs[idx].visible);
    if (!objs[idx].visible) fCanvas.discardActiveObject();
    fCanvas.requestRenderAll();
    saveFabricPageState(selectedEditIndex);
    renderLayersPopover();
  }
}

// Klavye Kısayolları (Delete, Ctrl+D, Ctrl+Z, Ctrl+Y, Yön Tuşları ile Hassas Kaydırma)
window.addEventListener('keydown', (e) => {
  if (appMode !== 'edit') return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement?.isContentEditable) return;

  const fCanvas = getCurrentFabricCanvas();
  const active = fCanvas ? fCanvas.getActiveObject() : null;
  if (active && active.isEditing) return; // Fabric Textbox içinde yazı yazılıyorsa kısayolları çalıştırma

  if (e.key === 'Escape') {
    closeFabricContextMenu();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && active) {
    e.preventDefault();
    copyActiveCanvasElement();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
    e.preventDefault();
    pasteCanvasElement();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    undoAction();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    e.preventDefault();
    redoAction();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && active) {
    e.preventDefault();
    duplicateSelectedCanvasElement();
    return;
  }
  if ((e.key === 'Delete' || e.key === 'Backspace') && active) {
    e.preventDefault();
    deleteSelectedCanvasElement();
    return;
  }
  if (active && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') active.set('left', (active.left || 0) - step);
    if (e.key === 'ArrowRight') active.set('left', (active.left || 0) + step);
    if (e.key === 'ArrowUp') active.set('top', (active.top || 0) - step);
    if (e.key === 'ArrowDown') active.set('top', (active.top || 0) + step);
    active.setCoords();
    fCanvas.requestRenderAll();
    syncLiveGeometryInputs(active);
    saveFabricPageState(selectedEditIndex);
  }
});

// Zoom ve Şablon Değiştirme Kancaları
const _origApplyConcept = window.applyConceptToCurrentPage;
if (typeof _origApplyConcept === 'function') {
  window.applyConceptToCurrentPage = function(presetId) {
    const page = magazineData?.pages?.[selectedEditIndex];
    if (page) delete page.fabricJSON;
    return _origApplyConcept(presetId);
  };
}

const _origConvertTemplate = window.convertCurrentPageToTemplate;
if (typeof _origConvertTemplate === 'function') {
  window.convertCurrentPageToTemplate = function(templateType, subOption = '') {
    const page = magazineData?.pages?.[selectedEditIndex];
    if (page) delete page.fabricJSON;
    return _origConvertTemplate(templateType, subOption);
  };
}

function setFabricCanvasZoom(zoomVal) {
  window.canvasZoom = Math.max(50, Math.min(180, Number(zoomVal) || 100));
  window.canvasZoomPercent = window.canvasZoom;
  const sel = document.getElementById('zoomSelector');
  if (sel) {
    const existing = Array.from(sel.options).find(o => Number(o.value) === window.canvasZoom);
    if (existing) sel.value = String(window.canvasZoom);
  }
  Object.keys(window.fabricCanvases).forEach(idx => {
    syncFabricCanvasScale(Number(idx));
  });
}

function stepFabricCanvasZoom(delta) {
  setFabricCanvasZoom((window.canvasZoom || 100) + delta);
}

// Tüm Fonksiyonları Global Window Nesnesine Bağla
window.createPageDOM = createPageDOM;
window.syncFabricCanvasScale = syncFabricCanvasScale;
window.setCanvasZoom = setFabricCanvasZoom;
window.stepCanvasZoom = stepFabricCanvasZoom;
window.renderRightEditorPanel = renderRightEditorPanel;
window.renderContextSettingsInspector = renderContextSettingsInspector;
window.renderContextActionsInspector = renderContextActionsInspector;
window.addCanvasElement = addCanvasElement;
window.handleCanvasImageUpload = handleCanvasImageUpload;
window.changeFabricLayerOrder = changeFabricLayerOrder;
window.alignSelectedElement = alignSelectedElement;
window.groupSelectedFabricObjects = groupSelectedFabricObjects;
window.ungroupSelectedFabricObjects = ungroupSelectedFabricObjects;
window.toggleLockSelectedFabricObject = toggleLockSelectedFabricObject;
window.duplicateSelectedCanvasElement = duplicateSelectedCanvasElement;
window.deleteSelectedCanvasElement = deleteSelectedCanvasElement;
window.flipSelectedFabricImage = flipSelectedFabricImage;
window.cropSelectedFabricImageByRatio = cropSelectedFabricImageByRatio;
window.applyFabricImageFilter = applyFabricImageFilter;
window.updateFabricGeometryInput = updateFabricGeometryInput;
window.updateFabricActiveProp = updateFabricActiveProp;
window.updateSelectedImageMaskAndRadius = updateSelectedImageMaskAndRadius;
window.toggleFabricActiveShadow = toggleFabricActiveShadow;
window.setFabricPageBackgroundColor = setFabricPageBackgroundColor;
window.rebuildCurrentPageFromTemplate = rebuildCurrentPageFromTemplate;
window.changePageLayout = changePageLayout;
window.renderLayersPopover = renderLayersPopover;
window.selectFabricObjectByIndex = selectFabricObjectByIndex;
window.toggleFabricObjectVisibility = toggleFabricObjectVisibility;
window.undoAction = undoAction;
window.redoAction = redoAction;
window.openFabricContextMenu = openFabricContextMenu;
window.closeFabricContextMenu = closeFabricContextMenu;
window.copyActiveCanvasElement = copyActiveCanvasElement;
window.pasteCanvasElement = pasteCanvasElement;
window.centerObjectHorizontally = centerObjectHorizontally;
window.toggleLockActiveObject = toggleLockActiveObject;
window.clearCurrentPageObjects = clearCurrentPageObjects;
window.moveFabricObjectLayer = moveFabricObjectLayer;
window.createGridSlotFabricObject = createGridSlotFabricObject;
window.addCanvaGrid = addCanvaGrid;
window.fitImageIntoGridSlot = fitImageIntoGridSlot;
window.toggleTextWrapOnActiveObject = toggleTextWrapOnActiveObject;
window.updateActiveTextWrapMargin = updateActiveTextWrapMargin;
window.applyTextWrapEngine = applyTextWrapEngine;
window.restoreTextWrapEngine = restoreTextWrapEngine;
window.addQuarkRunaroundLayout = addQuarkRunaroundLayout;
window.toggleDropCapForActiveText = toggleDropCapForActiveText;
