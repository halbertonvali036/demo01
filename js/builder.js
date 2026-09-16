(function () {
  'use strict';

  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  }
  window.builderIcon = icon;

  var page = document.getElementById('page');
  var stage = document.getElementById('canvasStage');
  var undoBtn = document.getElementById('undoBtn');
  var redoBtn = document.getElementById('redoBtn');
  var zoomLabel = document.getElementById('zoomLabel');
  var propsPanel = document.getElementById('propsPanel');
  var propsScroller = document.getElementById('propsScroller');
  var propsEmpty = document.getElementById('propsEmpty');
  var propActive = document.getElementById('propActive');
  var propsTabs = document.querySelectorAll('#propsTabs .ptab');
  var panes = document.querySelectorAll('.props-pane');

  var TYPES = {
    heading: { label: 'Heading', icon: 'heading', editable: true },
    text: { label: 'Text', icon: 'text', editable: true },
    button: { label: 'Button', icon: 'button', editable: true },
    input: { label: 'Input', icon: 'text-input' },
    textarea: { label: 'Text area', icon: 'textarea' },
    select: { label: 'Select', icon: 'select' },
    form: { label: 'Form', icon: 'form', cdrop: true },
    image: { label: 'Image', icon: 'image' },
    icon: { label: 'Icon', icon: 'icon' },
    video: { label: 'Video', icon: 'video' },
    container: { label: 'Container', icon: 'container', cdrop: true },
    row: { label: 'Row', icon: 'row', cdrop: true },
    column: { label: 'Column', icon: 'column', cdrop: true },
    card: { label: 'Card', icon: 'card', cdrop: true },
    navbar: { label: 'Navbar', icon: 'navbar' },
    footer: { label: 'Footer', icon: 'footer' },
    spacer: { label: 'Spacer', icon: 'spacer' },
    divider: { label: 'Divider', icon: 'divider' },
    table: { label: 'Table', icon: 'table' },
    list: { label: 'List', icon: 'list' },
    link: { label: 'Link', icon: 'link' },
    nav: { label: 'Navbar' },
    hero: { label: 'Hero Section' },
    features: { label: 'Features' },
    cta: { label: 'CTA Band' },
    footblock: { label: 'Footer' }
  };

  var BLANK = {
    heading: '<h2 data-editable class="e-heading">A fresh heading draws the eye</h2>',
    text: '<div data-editable class="e-text">Add a short paragraph explaining the value you deliver. Keep it clear, friendly, and to the point.</div>',
    button: '<button data-editable class="e-btn">Get started</button>',
    input: '<div class="e-field">Short answer…</div>',
    textarea: '<div class="e-field" style="min-height:76px"></div>',
    select: '<div class="e-field" style="display:flex;align-items:center;gap:8px"><span style="background:#b9bdcf;width:42%;height:6px;border-radius:3px"></span><span style="margin-left:auto;color:#a7abc0">&#9662;</span></div>',
    form: '<form class="e-form"><div class="e-field" style="margin:0">Name</div><div class="e-field" style="margin:0">Email</div><span class="e-btn" style="align-self:flex-start">Submit</span></form>',
    image: '<div class="e-image">' + icon('image') + '<span>Drop image or paste URL</span></div>',
    icon: '<div class="e-icon">' + icon('sparkle') + '</div>',
    video: '<div class="e-video">' + icon('video') + '<span>Video placeholder</span></div>',
    container: '<section class="e-container"><span class="e-hint">Container — drop components inside</span></section>',
    row: '<div class="e-row"><div class="e-col"><span class="e-hint">Column</span></div><div class="e-col"><span class="e-hint">Column</span></div></div>',
    column: '<div class="e-col"></div>',
    card: '<div class="e-card"><div style="width:34px;height:34px;border-radius:9px;background:var(--primary-soft);color:var(--primary-strong);display:flex;align-items:center;justify-content:center">' + icon('sparkle') + '</div><div style="width:60%;height:9px;border-radius:4px;background:#e4e6ef;margin:12px 0 6px"></div><div style="width:88%;height:6px;border-radius:3px;background:#eef0f5"></div></div>',
    navbar: '<nav class="e-navbar"><div style="width:22px;height:22px;border-radius:7px;background:var(--gradient)"></div><div style="display:flex;gap:14px"><span class="nb-bar" style="width:34px"></span><span class="nb-bar" style="width:48px"></span><span class="nb-bar" style="width:30px"></span></div><span style="margin-left:auto;background:var(--primary);color:#fff;border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600">Button</span></nav>',
    footer: '<footer class="e-footer"><div style="width:30%;height:7px;border-radius:4px;background:rgba(255,255,255,0.2);margin-bottom:12px"></div><div style="display:flex;gap:8px"><span style="width:22%;height:6px;border-radius:3px;background:rgba(255,255,255,0.14)"></span><span style="width:22%;height:6px;border-radius:3px;background:rgba(255,255,255,0.14)"></span></div></footer>',
    spacer: '<div class="e-spacer"></div>',
    divider: '<div class="e-divider"></div>',
    table: '<div class="e-table"><div class="et-row et-head"><span>Name</span><span>Role</span><span>Status</span></div><div class="et-row"><span>Maya Chen</span><span>Designer</span><span>United</span></div><div class="et-row"><span>Leo Park</span><span>Engineer</span><span>United</span></div></div>',
    list: '<ul class="e-list"><li style="display:flex;align-items:center;gap:9px"><i style="width:7px;height:7px;border-radius:50%;background:var(--primary);flex-shrink:0"></i><span style="width:55%;height:6px;border-radius:3px;background:#e4e6ef"></span></li><li style="display:flex;align-items:center;gap:9px"><i style="width:7px;height:7px;border-radius:50%;background:var(--primary);flex-shrink:0"></i><span style="width:45%;height:6px;border-radius:3px;background:#e4e6ef"></span></li><li style="display:flex;align-items:center;gap:9px"><i style="width:7px;height:7px;border-radius:50%;background:var(--primary);flex-shrink:0"></i><span style="width:62%;height:6px;border-radius:3px;background:#e4e6ef"></span></li></ul>',
    link: '<a data-editable class="e-link">Learn more →</a>'
  };

  /* ---------- history ---------- */
  var past = [];
  var future = [];

  function snapshot() {
    past.push(page.innerHTML);
    if (past.length > 60) past.shift();
    future = [];
    syncHistory();
  }

  function syncHistory() {
    undoBtn.disabled = past.length === 0;
    redoBtn.disabled = future.length === 0;
  }

  function restore(html) {
    page.innerHTML = html;
    blessPage();
    select(null);
  }

  function undo() {
    if (!past.length) return;
    future.push(page.innerHTML);
    restore(past.pop());
    syncHistory();
    window.toast('Undid last change', 'info', { duration: 1400 });
  }
  function redo() {
    if (!future.length) return;
    past.push(page.innerHTML);
    restore(future.pop());
    syncHistory();
    window.toast('Redid change', 'info', { duration: 1400 });
  }

  /* ---------- element plumbing ---------- */
  function bless(el) {
    if (!el || el.getAttribute('data-blessed')) return;
    el.setAttribute('data-blessed', '1');
    var label = (TYPES[el.getAttribute('data-etype')] || {}).label || 'Element';
    el.insertAdjacentHTML('beforeend',
      '<span class="e-tag">' + label + '</span>' +
      '<span class="e-h eh-nw"></span><span class="e-h eh-n"></span><span class="e-h eh-ne"></span>' +
      '<span class="e-h eh-e"></span><span class="e-h eh-se"></span><span class="e-h eh-s"></span>' +
      '<span class="e-h eh-sw"></span><span class="e-h eh-w"></span>'
    );
  }
  function blessPage() {
    page.querySelectorAll('.elem').forEach(bless);
    page.querySelectorAll('.elem').forEach(function (e) {
      e.addEventListener('dragstart', function (ev) { ev.preventDefault(); });
    });
  }

  /* ---------- selection ---------- */
  var floating = document.getElementById('selFloating');
  var floatingLabel = document.getElementById('selFloatingLabel');
  var selected = null;

  function makeElem(type) {
    var el = document.createElement('div');
    el.className = 'elem';
    el.setAttribute('data-etype', type);
    if (TYPES[type] && TYPES[type].cdrop) el.classList.add('cdrop');
    el.innerHTML = BLANK[type] || '';
    el.setAttribute('draggable', 'true');
    bless(el);
    return el;
  }

  function positionFloating() {
    if (!selected) return;
    var pr = page.getBoundingClientRect();
    var sr = stage.getBoundingClientRect();
    var r = selected.getBoundingClientRect();
    floating.style.display = 'flex';
    floating.classList.add('show');
    floatingLabel.textContent = (TYPES[selected.getAttribute('data-etype')] || {}).label || 'Element';
    var top = r.top - sr.top - 40;
    if (top < 8) top = Math.min(r.bottom - sr.top + 8, sr.height - 44);
    floating.style.top = top + 'px';
    var left = r.left - sr.left;
    var fw = floating.offsetWidth || 120;
    left = Math.max(6, Math.min(left, sr.width - fw - 6));
    floating.style.left = left + 'px';
  }

  function select(el) {
    if (selected) {
      selected.classList.remove('selected');
    }
    selected = el;
    if (el) {
      el.classList.add('selected');
      renderProps(el);
      positionFloating();
      propsPanel.classList.remove('empty');
    } else {
      floating.classList.remove('show');
      propsPanel.classList.add('empty');
      showEmptyProps();
    }
  }

  function showEmptyProps() {
    propsEmpty.style.display = 'flex';
    propActive.style.display = 'none';
    propsTabs.forEach(function (t) { t.style.display = 'none'; });
    panes.forEach(function (p) { p.classList.remove('active'); });
  }

  function addByDrag(type, clientX, clientY) {
    snapshot();
    var el = makeElem(type);
    var target = document.elementFromPoint(clientX, clientY);
    var zone = target && target.closest && target.closest('.cdrop');
    if (zone && zone !== el) {
      zone.appendChild(el);
    } else {
      insertByPosition(el, clientY);
    }
    select(el);
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    syncHistory();
  }

  function insertByPosition(el, clientY) {
    var children = Array.prototype.slice.call(page.children).filter(function (c) {
      return c.classList.contains('elem');
    });
    var before = null;
    for (var i = 0; i < children.length; i++) {
      var r = children[i].getBoundingClientRect();
      if (clientY < r.top + r.height / 2) { before = children[i]; break; }
    }
    page.insertBefore(el, before);
  }

  /* ---------- canvas events ---------- */
  page.addEventListener('click', function (e) {
    if (e.target.closest('.e-h')) return;
    var el = e.target.closest('.elem');
    if (el) {
      select(el);
    } else {
      select(null);
    }
  });

  page.addEventListener('dragover', function (e) {
    if (!e.dataTransfer.types || e.dataTransfer.types.indexOf('application/x-nimbus') === -1) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  page.addEventListener('dragenter', function (e) { e.preventDefault(); });
  page.addEventListener('dragleave', function (e) { if (e.target === page) page.classList.remove('drop-hint'); });

  page.addEventListener('drop', function (e) {
    e.preventDefault();
    page.classList.remove('drop-hint');
    var raw = e.dataTransfer.getData('application/x-nimbus');
    if (!raw) return;
    var type = raw;
    if (TYPES[type]) addByDrag(type, e.clientX, e.clientY);
  });

  window.addEventListener('resize', function () {
    if (selected) positionFloating();
  });

  /* ---------- floating actions ---------- */
  document.getElementById('dupBtn').addEventListener('click', function () {
    if (!selected) return;
    snapshot();
    var clone = selected.cloneNode(true);
    var tag = clone.querySelector('.e-tag');
    var handles = clone.querySelectorAll('.e-h');
    (tag ? [tag] : []).concat(Array.prototype.slice.call(handles)).forEach(function (h) { h.remove(); });
    clone.removeAttribute('data-blessed');
    bless(clone);
    selected.after(clone);
    select(clone);
    syncHistory();
    window.toast('Element duplicated', 'success', { duration: 1400 });
  });

  document.getElementById('delBtn').addEventListener('click', removeSelected);
  document.getElementById('flDel').addEventListener('click', removeSelected);

  function removeSelected() {
    if (!selected) return;
    var el = selected;
    select(null);
    snapshot();
    el.remove();
    syncHistory();
    window.toast('Element deleted', 'info', { duration: 1400 });
  }

  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) ||
      document.activeElement.getAttribute && document.activeElement.getAttribute('contenteditable') === 'true';
    var mod = e.ctrlKey || e.metaKey;

    if (mod && e.key.toLowerCase() === 'z' && !typing) {
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
      return;
    }
    if (mod && e.key.toLowerCase() === 'y' && !typing) {
      e.preventDefault(); redo(); return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && !typing && selected) {
      e.preventDefault();
      removeSelected();
      return;
    }
    if ((e.key === 'Escape')) {
      if (previewOverlay.classList.contains('open')) closePreview();
      else if (publishModal.classList.contains('open')) closePublish();
      else select(null);
    }
  });

  /* ---------- palette ---------- */
  var paletteItems = document.querySelectorAll('.component[data-type]');
  paletteItems.forEach(function (item) {
    item.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('application/x-nimbus', item.getAttribute('data-type'));
      e.dataTransfer.effectAllowed = 'copy';
      item.classList.add('dragging');
      setTimeout(function () { item.classList.remove('dragging'); }, 600);
    });
    item.addEventListener('click', function () {
      var type = item.getAttribute('data-type');
      var el = makeElem(type);
      snapshot();
      insertByPosition(el, page.getBoundingClientRect().top + 200);
      syncHistory();
      select(el);
      positionFloating();
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      window.toast(TYPES[type].label + ' added to canvas', 'success', { duration: 1400 });
    });
  });

  var paletteSearch = document.getElementById('paletteSearch');
  if (paletteSearch) {
    paletteSearch.addEventListener('input', function () {
      var q = paletteSearch.value.trim().toLowerCase();
      document.querySelectorAll('.component[data-type]').forEach(function (c) {
        var label = (TYPES[c.getAttribute('data-type')].label).toLowerCase();
        c.style.display = label.indexOf(q) > -1 ? '' : 'none';
      });
    });
  }

  /* ---------- device toggle ---------- */
  document.querySelectorAll('.device-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.device-toggle button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var device = btn.getAttribute('data-device');
      page.setAttribute('data-device', device);
      var map = { desktop: '1440 × 900', tablet: '768 × 1024', mobile: '375 × 812' };
      document.getElementById('sbSize').textContent = map[device];
      if (selected) positionFloating();
      if (device !== 'desktop') {
        window.toast('Now previewing ' + device + ' layout', 'info', { duration: 1600 });
      }
    });
  });

  /* ---------- zoom ---------- */
  var zoom = 100;
  function setZoom(v) {
    zoom = Math.max(50, Math.min(160, v));
    page.style.setProperty('--zoom', zoom / 100);
    zoomLabel.textContent = zoom + '%';
    if (selected) positionFloating();
  }
  document.querySelectorAll('[data-zoom]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setZoom(zoom + (btn.getAttribute('data-zoom') === '+' ? 10 : -10));
    });
  });
  setZoom(100);

  /* ---------- props panel ---------- */
  var uiFields = {
    bg: document.getElementById('ipBg'),
    bgHex: document.getElementById('ipBgHex'),
    tx: document.getElementById('ipText'),
    txHex: document.getElementById('ipTextHex'),
    size: document.getElementById('ipSize'),
    sizeV: document.getElementById('ipSizeVal'),
    radius: document.getElementById('ipRadius'),
    radiusV: document.getElementById('ipRadiusVal'),
    pad: document.getElementById('ipPad'),
    padV: document.getElementById('ipPadVal'),
    align: 'ipAlign',
    shadow: document.getElementById('ipShadow'),
    visible: document.getElementById('ipVisible'),
    gap: document.getElementById('ipGap'),
    gapV: document.getElementById('ipGapVal'),
    textarea: document.getElementById('ccText'),
    imgSrc: document.getElementById('ccImgSrc'),
    imgAlt: document.getElementById('ccImgAlt'),
    imgBody: document.getElementById('imgBody')
  };

  var designInputs = document.querySelectorAll('[data-design]');
  var layoutInputs = document.querySelectorAll('[data-layout]');

  function editableNode(el) {
    return el.querySelector('[data-editable]');
  }

  function px(v, unit) { return v == null ? null : v + (unit == null ? 'px' : unit); }

  function renderProps(el) {
    propsEmpty.style.display = 'none';
    propActive.style.display = 'flex';
    propsTabs.forEach(function (t) { t.style.display = ''; });

    var type = el.getAttribute('data-etype');
    var info = TYPES[type] || { label: 'Element' };
    propActive.querySelector('.pa-name').textContent = info.label;
    propActive.querySelector('.pa-type').textContent = type + ' · id: ' + (type + '_' + (el.dataset.uid || 'new'));

    var activeTab = document.querySelector('#propsTabs .ptab.active');
    var paneId = activeTab ? activeTab.getAttribute('data-pane') : 'paneDesign';
    panes.forEach(function (p) { p.classList.toggle('active', p.id === paneId); });

    var edit = editableNode(el);
    var textBody = document.getElementById('textBody');
    var showText = !!edit;
    textBody.style.display = showText ? 'flex' : 'none';
    if (showText) {
      uiFields.textarea.value = edit.textContent.trim();
    }

    var isImage = type === 'image' || type === 'video';
    uiFields.imgBody.style.display = isImage ? 'flex' : 'none';
    if (textBody) textBody.style.display = isImage ? 'none' : (showText ? 'flex' : 'none');

    if (type === 'image') {
      uiFields.imgAlt.placeholder = 'Alt text…';
    }

    var cs = window.getComputedStyle(el);
    var fontEl = edit && edit.tagName === 'BUTTON' ? edit : el;
    var fc = cs.color;
    var bg = cs.backgroundColor;
    if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') bg = '#ffffff';

    uiFields.bg.value = toHex(bg);
    uiFields.bgHex.value = toHex(bg);
    uiFields.tx.value = toHex(fc);
    uiFields.txHex.value = toHex(fc);

    var fs = parseFloat(cs.fontSize) || 14;
    var br = parseFloat(cs.borderRadius) || 0;
    var pd = parseFloat(cs.paddingTop) || 0;
    uiFields.size.value = fs; uiFields.sizeV.textContent = fs + 'px';
    uiFields.radius.value = br; uiFields.radiusV.textContent = br + 'px';
    uiFields.pad.value = pd; uiFields.padV.textContent = pd + 'px';

    var gap = parseFloat(cs.columnGap) || parseFloat(cs.gap) || 0;
    if (!isFinite(gap)) gap = 0;
    uiFields.gap.value = gap; uiFields.gapV.textContent = gap + 'px';

    var align = cs.textAlign && cs.textAlign !== 'start' ? cs.textAlign : 'left';
    document.querySelectorAll('#ipAlign button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-v') === align);
    });

    uiFields.shadow.classList.toggle('on', el.classList.contains('has-shadow'));
    uiFields.visible.classList.toggle('on', el.style.opacity !== '0');
  }

  function toHex(c) {
    if (!c || c.indexOf('#') === 0) return c;
    var m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return '#ffffff';
    var parts = m[1].split(',').map(function (x) { return parseInt(x, 10); });
    var r = parts[0], g = parts[1], b = parts[2];
    if (isNaN(r)) return '#ffffff';
    return '#' + [r, g, b].map(function (v) {
      return ('0' + Math.max(0, Math.min(255, v)).toString(16)).slice(-2);
    }).join('');
  }

  function liveOnFocus() {
    uiFields.textarea.addEventListener('focus', snapshot, { once: true });
  }

  document.querySelectorAll('[data-design], [data-layout]').forEach(function (input) {
    var syncHex = input.getAttribute('data-sync');
    input.addEventListener('input', function () {
      if (!selected) return;
      var prop = input.getAttribute('data-design') || input.getAttribute('data-layout');
      var key = input.getAttribute('data-key');
      var el = selected;
      var val = input.value;

      if (syncHex) {
        uiFields[syncHex].value = val;
      }

      if (prop === 'color' && key === 'bg') {
        el.style.backgroundColor = val;
      } else if (prop === 'color' && key === 'text') {
        applyTextColor(el, val);
      } else if (prop === 'size') {
        applyFontSize(el, val);
        uiFields.sizeV.textContent = val + 'px';
      } else if (prop === 'radius') {
        el.style.borderRadius = val + 'px';
        uiFields.radiusV.textContent = val + 'px';
      } else if (prop === 'pad') {
        el.style.padding = val + 'px';
        uiFields.padV.textContent = val + 'px';
      } else if (prop === 'gap') {
        el.style.gap = val + 'px';
        uiFields.gapV.textContent = val + 'px';
      } else if (prop === 'align') {
        el.style.textAlign = input.getAttribute('data-v');
        document.querySelectorAll('#ipAlign button').forEach(function (b) {
          b.classList.toggle('active', b === input);
        });
      } else if (prop === 'display') {
        var dv = input.getAttribute('data-v');
        el.style.display = dv === 'flex' ? 'flex' : 'block';
        document.querySelectorAll('#ipDisplay button').forEach(function (b) {
          b.classList.toggle('active', b === input);
        });
      }
    });
  });

  function applyTextColor(el, color) {
    el.style.color = color;
    el.querySelectorAll('*').forEach(function (n) { n.style.color = color; });
  }
  function applyFontSize(el, size) {
    el.style.fontSize = size + 'px';
    el.querySelectorAll('*').forEach(function (n) { if (n.style) n.style.fontSize = size + 'px'; });
  }

  uiFields.shadow.addEventListener('click', function () {
    if (!selected) return;
    snapshot();
    selected.classList.toggle('has-shadow');
    uiFields.shadow.classList.toggle('on');
    if (selected.classList.contains('has-shadow')) {
      selected.style.boxShadow = '0 16px 30px -12px rgba(22,25,38,0.22)';
    } else {
      selected.style.boxShadow = '';
    }
  });

  uiFields.visible.addEventListener('click', function () {
    if (!selected) return;
    snapshot();
    var on = uiFields.visible.classList.toggle('on');
    selected.style.opacity = on ? '1' : '0.35';
  });

  uiFields.textarea.addEventListener('focus', function () {
    snapshot();
  });
  uiFields.textarea.addEventListener('input', function () {
    if (!selected) return;
    var edit = editableNode(selected);
    if (edit) edit.textContent = uiFields.textarea.value;
  });

  propsTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      propsTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      panes.forEach(function (p) { p.classList.toggle('active', p.id === tab.getAttribute('data-pane')); });
    });
  });

  document.getElementById('flushBtn').addEventListener('click', function () {
    if (!selected) return;
    var type = selected.getAttribute('data-etype');
    snapshot();
    var fresh = makeElem(type);
    selected.replaceWith(fresh);
    select(fresh);
    window.toast('Element reset to defaults', 'success', { duration: 1400 });
  });

  /* ---------- toolbar actions ---------- */
  var previewOverlay = document.getElementById('previewOverlay');
  var publishModal = document.getElementById('publishModal');

  document.getElementById('saveBtn').addEventListener('click', function () {
    var now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sbSaved').textContent = 'Saved ' + now;
    window.toast('Project saved successfully', 'success');
  });

  document.getElementById('previewBtn').addEventListener('click', openPreview);
  document.getElementById('previewClose').addEventListener('click', closePreview);
  document.getElementById('previewOpenNew').addEventListener('click', function () {
    closePreview();
    window.toast('Falling back to desktop tab', 'info', { duration: 1600 });
  });

  function openPreview() {
    var frame = document.getElementById('previewFrameBody');
    var clone = page.cloneNode(true);
    clone.id = 'previewPage';
    clone.style.transform = '';
    clone.classList.remove('modal-open');
    clone.style.setProperty('--zoom', '1');
    clone.querySelectorAll('.elem').forEach(function (el) {
      el.classList.remove('selected');
      el.querySelectorAll('.e-tag, .e-h').forEach(function (h) { h.remove(); });
    });
    frame.innerHTML = '';
    frame.appendChild(clone);
    previewOverlay.classList.add('open');
  }
  function closePreview() {
    previewOverlay.classList.remove('open');
  }

  document.getElementById('publishBtn').addEventListener('click', function () {
    publishModal.classList.add('open');
    var fill = publishModal.querySelector('.progress-fill');
    var status = publishModal.querySelector('.progress-status');
    var success = publishModal.querySelector('.pub-success');
    var main = publishModal.querySelector('.pub-main');
    fill.style.width = '0%';
    status.textContent = 'Building production bundle…';
    success.classList.remove('show');
    main.style.display = 'block';
    setTimeout(function () {
      fill.style.width = '45%';
      status.textContent = 'Optimizing assets…';
      setTimeout(function () {
        fill.style.width = '82%';
        status.textContent = 'Redeploying to global edge…';
        setTimeout(function () {
          fill.style.width = '100%';
          status.textContent = 'Done';
          setTimeout(function () {
            main.style.display = 'none';
            success.classList.add('show');
            window.toast('Your app is live at nimbus.app/demo', 'success');
          }, 480);
        }, 700);
      }, 800);
    }, 600);
  });
  function closePublish() {
    publishModal.classList.remove('open');
  }
  document.getElementById('pubDone').addEventListener('click', function () {
    closePublish();
    window.toast('Publish flow is a prototype for now.', 'info', { duration: 2000 });
  });

  document.getElementById('addSection').addEventListener('click', function () {
    window.toast('Sections let you structure your page — coming soon.', 'info');
  });

  document.getElementById('pageTab1').addEventListener('click', function () {
    window.toast('Only one page in this prototype — more coming soon.', 'info');
  });
  var pageTab2 = document.getElementById('pageTab2');
  if (pageTab2) {
    pageTab2.addEventListener('click', function () {
      window.toast('Multiple pages arrive in a future milestone.', 'info');
    });
  }

  var strechBtn = document.getElementById('ipStrech');
  if (strechBtn) {
    strechBtn.addEventListener('click', function () {
      if (!selected) return;
      snapshot();
      strechBtn.classList.toggle('on');
      if (strechBtn.classList.contains('on')) selected.style.width = '100%';
      else selected.style.width = '';
    });
  }

  /* ---------- breadcrumb + project name ---------- */
  var crumbProject = document.getElementById('crumbProject');
  if (crumbProject) {
    crumbProject.addEventListener('click', function () {
      window.toast('Back to your app dashboard', 'info', { duration: 1400 });
      setTimeout(function () { window.location.href = 'dashboard.html'; }, 700);
    });
  }

  var params = new URLSearchParams(window.location.search);
  var projName = document.getElementById('projectName');
  if (params.get('project')) {
    var pn = params.get('project');
    if (projName) {
      projName.setAttribute('contenteditable', 'false');
      projName.innerHTML = '<span class="p-name">' + escapeHtml(pn) + '</span><span class="p-badge">Draft</span>';
    }
  } else if (params.get('template')) {
    if (projName) {
      projName.innerHTML = '<span class="p-name">' + escapeHtml(params.get('template')) + '</span><span class="p-badge">Draft</span>';
    }
  }
  if (projName && projName.getAttribute('contenteditable') === 'false') {
    /* keep non-editable */
  }
  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  var compCount = document.getElementById('compCount');
  if (compCount) {
    var n = page.querySelectorAll('.elem').length;
    compCount.textContent = n + ' elements';
  }

  /* ---------- mobile palette/props toggles ---------- */
  var mpToggle = document.getElementById('mpToggle');
  var paletteEl = document.getElementById('palette');
  var propsToggle = document.getElementById('propsToggle');
  var propsEl = document.getElementById('propsPanel');

  if (mpToggle) mpToggle.addEventListener('click', function () { paletteEl.classList.toggle('open'); });
  if (propsToggle) propsToggle.addEventListener('click', function () { propsEl.classList.toggle('open'); });

  /* ---------- init ---------- */
  blessPage();
  setZoom(100);
  page.setAttribute('data-device', 'desktop');
  select(null);
  updateDocTitle();
  if (window.toast) {
    setTimeout(function () {
      window.toast('Tip: drag components onto the canvas', 'info', { duration: 2600 });
    }, 700);
  }

  function updateDocTitle() {
    var p = params.get('project') || params.get('template');
    if (p) document.title = p + ' · Nimbus Builder';
  }

  window.nimbusUndo = undo;
  window.nimbusRedo = redo;
})();