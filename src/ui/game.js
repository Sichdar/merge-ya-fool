// The game screen: board drawing, drag and tap-tap input, orders, story strip, overlays, saving, playtest mode.
(function () {
  'use strict';
  var MYF = window.MYF, R = MYF.Rules, T = MYF.TEXT, A = MYF.Art, Sfx = MYF.Sfx, Store = MYF.Store;
  var VERSION = '0.1.0';
  MYF.VERSION = VERSION;
  var LEVELS = MYF.DATA.levels;
  function $(id) { return document.getElementById(id); }
  var el = {
    top: $('top'), dayTitle: $('dayTitle'), orders: $('orders'), strip: $('strip'), wrap: $('boardWrap'), board: $('board'),
    score: $('score'), undo: $('undoBtn'), hint: $('hintBtn'), menu: $('menuBtn'), finger: $('finger')
  };

  var save = Store.load();
  Sfx.setOn(save.sound !== false);
  var test = readTestFlag();
  var game = null, level = null, levelIdx = 0;
  var sel = -1, down = null, drag = null, layer = null, hintMark = null, hintTimer = 0, noRoomCount = 0;
  var whatIf = null, testBox = null;

  // ---------------- helpers ----------------
  function readTestFlag() {
    var m = /[?&]test=([01])/.exec(location.search);
    try {
      if (m) { if (m[1] === '1') localStorage.setItem('myf-test', '1'); else localStorage.removeItem('myf-test'); }
      return localStorage.getItem('myf-test') === '1';
    } catch (e) { return !!(m && m[1] === '1'); }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function cellEl(i) { return el.board.children[i]; }
  function center(node) { var r = node.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r }; }
  function restartAnim(node, cls) { if (!node) return; node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); node.addEventListener('animationend', function f() { node.classList.remove(cls); node.removeEventListener('animationend', f); }); }
  function starsHTML(n) { return '★★★'.slice(0, n) + '<span class="off">' + '★★★'.slice(0, 3 - n) + '</span>'; }
  function fmtTime(ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function itemName(id) { return (T.items[id] && T.items[id].name) || id; }

  function say(node, text, ms) {
    if (!node) return null;
    var c = center(node), b = document.createElement('div');
    b.className = 'say'; b.textContent = text;
    b.style.left = Math.max(70, Math.min(window.innerWidth - 70, c.x)) + 'px';
    b.style.top = (c.r.top - 4) + 'px';
    document.body.appendChild(b);
    if (ms !== 0) setTimeout(function () { b.remove(); }, ms || 1200);
    return b;
  }
  function sparks(node, n) {
    if (!node) return;
    var c = center(node);
    for (var k = 0; k < (n || 7); k++) {
      var s = document.createElement('div'), a = Math.random() * Math.PI * 2, d = 26 + Math.random() * 30;
      s.className = 'spark'; s.style.left = c.x + 'px'; s.style.top = c.y + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      document.body.appendChild(s);
      setTimeout(s.remove.bind(s), 520);
    }
  }
  function vibrate(ms) {
    try {
      var ua = navigator.userActivation;
      if (navigator.vibrate && (!ua || ua.hasBeenActive)) navigator.vibrate(ms);
    } catch (e) { /* not on iPhone */ }
  }

  // Pin the page: no scroll, no pinch zoom, no double-tap zoom (iPhone needs all of this; see M0 v0.0.2)
  function lockPage() {
    document.documentElement.classList.add('locked');
    var stop = function (e) { if (e.cancelable) e.preventDefault(); };
    ['gesturestart', 'gesturechange', 'gestureend', 'dblclick', 'contextmenu'].forEach(function (t) { document.addEventListener(t, stop, { passive: false }); });
    document.addEventListener('touchmove', stop, { passive: false });
    document.addEventListener('touchstart', function (e) { if (e.touches && e.touches.length > 1) stop(e); }, { passive: false });
    window.addEventListener('scroll', function () { if (window.scrollX || window.scrollY) window.scrollTo(0, 0); }, { passive: true });
  }

  function deviceLine() {
    var ua = navigator.userAgent;
    var os = /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'Mac' : 'Other';
    var br = /CriOS|Chrome/.test(ua) && !/Edg/.test(ua) ? 'Chrome' : /Edg/.test(ua) ? 'Edge' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /Safari/.test(ua) ? 'Safari' : 'Other';
    return os + ' · ' + br + ' · window ' + innerWidth + '×' + innerHeight;
  }
  function copyText(text, btn) {
    function done(ok) { if (btn) { var old = btn.textContent; btn.textContent = ok ? T.ui.copied : 'Copy failed'; setTimeout(function () { btn.textContent = old; }, 1600); } }
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; } ta.remove(); done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback); else fallback();
  }

  // ---------------- saving ----------------
  function persist() {
    if (game && !game.state.won) save.current = game.toJSON();
    Store.save(save);
  }

  // ---------------- layout and drawing ----------------
  function layout() {
    if (!level) return;
    var cols = level.board[0], rows = level.board[1], gap = 5;
    var w = el.wrap.clientWidth, h = el.wrap.clientHeight - 4;
    var c = Math.floor(Math.min((w - gap * (cols - 1)) / cols, (h - gap * (rows - 1)) / rows, 96));
    el.board.style.setProperty('--c', Math.max(30, c) + 'px');
    el.board.style.setProperty('--cols', cols);
  }

  var svgCache = {};
  function itemHTML(id) { return svgCache[id] || (svgCache[id] = A.itemSVG(id)); }
  function cellInner(c) {
    if (!c) return '';
    if (c.k === 'item') return '<div class="item">' + itemHTML(c.id) + '</div>';
    if (c.k === 'gen') return '<div class="gen' + (c.charges <= 0 ? ' empty' : '') + '">' + (svgCache['g:' + c.gen] || (svgCache['g:' + c.gen] = A.genSVG(c.gen))) + '<span class="count">×' + c.charges + '</span></div>';
    return '';
  }
  function render() {
    var html = '';
    game.state.cells.forEach(function (c, i) { html += '<div class="cell" data-i="' + i + '">' + cellInner(c) + '</div>'; });
    el.board.innerHTML = html;
    if (sel >= 0 && cellEl(sel)) cellEl(sel).classList.add('sel');
    markBubbles();
    applyMarks();
  }
  function renderOrders() {
    var st = game.state;
    el.orders.innerHTML = st.orders.map(function (o, k) {
      var mood = o.done || st.won ? 'happy' : 'worried';
      return '<div class="order' + (o.done ? ' done' : '') + '"><div class="who" title="' + esc(T.who[o.who] || '') + '">' + A.charSVG(o.who, mood) + '</div>' +
        '<div class="bub" data-order="' + k + '" aria-label="' + esc(T.who[o.who] + ' wants ' + itemName(o.wants)) + '">' + A.itemSVG(o.wants, { dots: false }) + '</div></div>';
    }).join('');
  }
  function renderScore(bump) {
    var m = game.moves(), p = level.par, s = R.starsFor(m, p);
    el.score.innerHTML = '<div class="mv">' + m + '</div><div class="par">' + T.ui.moves + ' · ' + T.ui.par + ' ' + p + ' <span class="st">' + starsHTML(s) + '</span></div>';
    if (bump) restartAnim(el.score, 'bump');
    el.undo.disabled = !game.history.length || game.state.won;
    updateTestBox();
  }
  function stripPanels() { return (level.story || []).filter(function (p) { return game.shown[p.panel]; }).map(function (p) { return p.panel; }); }
  function renderStrip(fresh) {
    var ps = stripPanels();
    if (!ps.length) { el.strip.innerHTML = ''; return; }
    var id = ps[ps.length - 1];
    el.strip.innerHTML = '<div class="art">' + A.panelSVG(id) + '</div><div class="cap"><div>' + esc(T.panels[id]) + '</div><div class="dots">' +
      ps.map(function (p, i) { return '<i class="' + (i === ps.length - 1 ? 'on' : '') + '"></i>'; }).join('') + '</div></div>';
    if (fresh) restartAnim(el.strip, 'fresh');
  }

  // Glows: the hint, and level 1's "What if…?" combo nudge
  function applyMarks() {
    if (hintMark) {
      (hintMark.cells || []).forEach(function (i) { if (cellEl(i)) cellEl(i).classList.add('hint'); });
    }
    var showWhatIf = false;
    if (level.comboGlow && !game.state.won) {
      var a = findItem(level.comboGlow[0]), b = findItem(level.comboGlow[1]);
      var result = R.mergeResult(level.comboGlow[0], level.comboGlow[1]);
      if (a >= 0 && b >= 0 && result && !game.state.made[result.id]) {
        cellEl(a).classList.add('glow'); cellEl(b).classList.add('glow');
        showWhatIf = true;
        if (whatIf) whatIf.remove();
        whatIf = null;
        requestAnimationFrame(function () { if (whatIf) whatIf.remove(); whatIf = say(cellEl(a), T.ui.whatIf, 0); });
      }
    }
    if (!showWhatIf && whatIf) { whatIf.remove(); whatIf = null; }
  }
  function findItem(id, not) {
    var cs = game.state.cells;
    for (var i = 0; i < cs.length; i++) if (i !== not && cs[i] && cs[i].k === 'item' && cs[i].id === id) return i;
    return -1;
  }
  function clearHint() {
    clearTimeout(hintTimer);
    if (hintMark) {
      document.querySelectorAll('.hint').forEach(function (n) { n.classList.remove('hint'); });
      if (hintMark.bub) hintMark.bub.classList.remove('hover');
      hintMark = null;
    }
  }

  // ---------------- level flow ----------------
  function startLevel(idx, resume) {
    closeLayer();
    clearHint();
    level = LEVELS[idx]; levelIdx = idx;
    game = new R.Game(level, resume && resume.level === level.id ? resume : null);
    sel = -1; noRoomCount = 0;
    el.dayTitle.textContent = T.ui.day + ' ' + (idx + 1) + ' · ' + T.levels[level.id];
    layout(); render(); renderOrders(); renderScore(); renderStrip();
    var ev = game.start();
    persist();
    if (ev.length) { renderStrip(); showIntro(ev[0].panel); } else updateGuide();
  }

  function doAction(a) {
    if (!game || game.state.won) return;
    var ev = game.act(a);
    var ok = !(ev.length && ev[0].t === 'reject');
    clearHint();
    sel = -1;
    render();
    if (ok) {
      ev.forEach(function (e) {
        if (e.t === 'spawned') save.guide = Object.assign(save.guide || {}, { tap: true });
        if (e.t === 'merged' || e.t === 'combo') save.guide = Object.assign(save.guide || {}, { drag: true });
        if (e.t === 'delivered') save.guide = Object.assign(save.guide || {}, { deliver: true });
      });
      renderOrders(); renderScore(true);
      if (game.state.won) save.current = null;
      persist();
    }
    animate(ev);
    // Already stuck and the tap did nothing: offer the Wobble again
    if (!ok && game.isStuck()) setTimeout(showStuck, 900);
    updateGuide();
  }

  function animate(events) {
    events.forEach(function (e) {
      switch (e.t) {
        case 'spawned': fly(e.at, e.from, 'anim-spawn'); restartAnim(cellEl(e.from) && cellEl(e.from).firstChild, 'anim-tap'); Sfx.play('spawn'); break;
        case 'merged': restartAnim(item(e.to), 'anim-pop'); sparks(cellEl(e.to), 6); Sfx.play('merge', e.tier); vibrate(12); break;
        case 'combo':
          restartAnim(item(e.to), 'anim-combo'); sparks(cellEl(e.to), 16); Sfx.play('combo'); vibrate([15, 40, 15]);
          say(cellEl(e.to), T.items[e.id].pun + '!', 1600); break;
        case 'moved': fly(e.to, e.from, 'anim-slide'); Sfx.play('move'); break;
        case 'swapped': fly(e.to, e.from, 'anim-slide'); fly(e.from, e.to, 'anim-slide'); Sfx.play('swap'); break;
        case 'delivered': {
          var b = el.orders.querySelector('[data-order="' + e.order + '"]');
          sparks(b, 14); restartAnim(b, 'anim-pop'); Sfx.play('deliver'); break;
        }
        case 'shaken': restartAnim(el.board, 'anim-nope'); Sfx.play('boing'); break;
        case 'panel': renderStrip(true); Sfx.play('page'); break;
        case 'won': setTimeout(onWon, 650); break;
        case 'stuck': setTimeout(showStuck, 350); break;
        case 'reject': onReject(e); break;
      }
    });
  }
  function item(i) { var c = cellEl(i); return c && c.firstChild; }
  function fly(i, fromIdx, cls) {
    var it = item(i), from = cellEl(fromIdx), to = cellEl(i);
    if (!it || !from || !to) return;
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    it.style.setProperty('--fx', (a.left - b.left) + 'px'); it.style.setProperty('--fy', (a.top - b.top) + 'px');
    restartAnim(it, cls);
  }
  function onReject(e) {
    var node = e.at != null ? cellEl(e.at) : null;
    switch (e.why) {
      case 'noRoom':
        noRoomCount++;
        restartAnim(node && node.firstChild, 'anim-nope'); Sfx.play('boing');
        say(node, noRoomCount === 2 ? T.ui.skillIssue : T.ui.noRoom); break;
      case 'noCharges': restartAnim(node && node.firstChild, 'anim-nope'); Sfx.play('boing'); say(node, T.ui.noCharges); break;
      case 'top': restartAnim(node && node.firstChild, 'anim-nope'); Sfx.play('boing'); say(node, (T.items[e.id] && T.items[e.id].top) || T.ui.topTier, 1600); break;
      case 'wrongOrder': {
        var b = el.orders.querySelector('[data-order="' + e.order + '"]');
        restartAnim(b, 'anim-nope'); Sfx.play('uhoh'); say(b, T.ui.wrongOrder); break;
      }
      case 'blocked': restartAnim(node && node.firstChild, 'anim-nope'); Sfx.play('boing'); break;
    }
  }

  function undo() {
    if (!game || !game.undo()) return;
    clearHint(); sel = -1;
    render(); renderOrders(); renderScore(true); persist();
    Sfx.play('move');
    updateGuide();
  }
  function hint() {
    if (!game || game.state.won) return;
    clearHint();
    game.stats.hints++;
    var h = MYF.Solver.hint(level, game.state);
    var a = h.action;
    if (!a) { say(el.hint, T.ui.hintNone, 2200); persist(); return; }
    hintMark = { cells: [] };
    if (a.t === 'spawn') hintMark.cells = [a.at];
    else if (a.t === 'drop') hintMark.cells = [a.from, a.to];
    else if (a.t === 'deliver') { hintMark.cells = [a.from]; hintMark.bub = el.orders.querySelector('[data-order="' + a.order + '"]'); if (hintMark.bub) hintMark.bub.classList.add('hover'); }
    applyMarks();
    Sfx.play('page');
    hintTimer = setTimeout(clearHint, 3500);
    persist();
  }
  function restart() {
    game.restart();
    clearHint(); sel = -1; noRoomCount = 0;
    render(); renderOrders(); renderScore(); renderStrip();
    persist();
    updateGuide();
  }

  // ---------------- level 1 guide: ghost finger for the first tap, drag and delivery ----------------
  function updateGuide() {
    var f = el.finger;
    f.className = '';
    if (!level || !level.guide || !game || game.state.won || layer) return;
    var g = save.guide || {};
    var cells = game.state.cells, i, a, b;
    if (!g.tap) {
      for (i = 0; i < cells.length; i++) if (cells[i] && cells[i].k === 'gen') break;
      if (i < cells.length) pointTap(cellEl(i));
      return;
    }
    if (!g.drag) {
      for (i = 0; i < cells.length; i++) {
        if (cells[i] && cells[i].k === 'item' && R.ITEMS[cells[i].id].next) {
          var j = findItem(cells[i].id, i);
          if (j >= 0) { pointDrag(cellEl(i), cellEl(j)); return; }
        }
      }
      return;
    }
    if (!g.deliver) {
      game.state.orders.forEach(function (o, k) {
        if (o.done || a) return;
        var at = findItem(o.wants);
        if (at >= 0) { a = cellEl(at); b = el.orders.querySelector('[data-order="' + k + '"]'); }
      });
      if (a && b) pointDrag(a, b);
    }
  }
  function pointTap(node) {
    var c = center(node);
    el.finger.style.setProperty('--x0', (c.x - 16) + 'px'); el.finger.style.setProperty('--y0', (c.y - 2) + 'px');
    el.finger.className = 'tap';
  }
  function pointDrag(n1, n2) {
    var a = center(n1), b = center(n2);
    el.finger.style.setProperty('--x0', (a.x - 16) + 'px'); el.finger.style.setProperty('--y0', (a.y - 2) + 'px');
    el.finger.style.setProperty('--x1', (b.x - 16) + 'px'); el.finger.style.setProperty('--y1', (b.y - 2) + 'px');
    el.finger.className = 'drag';
  }

  // ---------------- input: drag, tap-tap, long-press ----------------
  el.board.addEventListener('pointerdown', function (e) {
    Sfx.unlock();
    if (!game || game.state.won || layer || (e.button && e.button > 0)) return;
    var c = e.target.closest('.cell');
    if (!c) return;
    var i = +c.dataset.i, cell = game.state.cells[i];
    down = { i: i, x: e.clientX, y: e.clientY, id: e.pointerId, kind: cell ? cell.k : 'empty', moved: false, long: false };
    if (cell && (cell.k === 'item' || cell.k === 'gen')) {
      down.timer = setTimeout(function () { if (down && !down.moved) { down.long = true; showInfoCell(i); } }, 480);
    }
    e.preventDefault();
  });
  window.addEventListener('pointermove', function (e) {
    if (!down || e.pointerId !== down.id) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (!down.moved && dx * dx + dy * dy > 81) {
      down.moved = true; clearTimeout(down.timer);
      if (down.kind === 'item' && !down.long) startDrag(e);
    }
    if (drag) moveDrag(e);
  });
  function up(e) {
    if (!down || e.pointerId !== down.id) return;
    clearTimeout(down.timer);
    var d = down; down = null;
    if (d.long) return;
    if (drag) { endDrag(e, e.type === 'pointercancel'); return; }
    if (!d.moved) onTap(d.i);
  }
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);

  function onTap(i) {
    var c = game.state.cells[i];
    if (c && c.k === 'gen') { if (sel >= 0) { sel = -1; } doAction({ t: 'spawn', at: i }); return; }
    if (sel >= 0) {
      if (sel === i) { sel = -1; render(); return; }
      var from = sel;
      doAction({ t: 'drop', from: from, to: i });
      return;
    }
    if (c && c.k === 'item') { sel = i; render(); Sfx.play('pick'); restartAnim(item(i), 'anim-tap'); markBubbles(); }
  }
  function markBubbles() { el.orders.querySelectorAll('.bub').forEach(function (b) { b.classList.toggle('sel', sel >= 0); }); }

  // Taps on an order bubble: deliver the selected item, or show what the character wants.
  el.orders.addEventListener('pointerup', function (e) {
    if (drag || layer || !game) return;
    var b = e.target.closest('.bub');
    if (!b) return;
    var k = +b.dataset.order;
    if (sel >= 0) { var from = sel; doAction({ t: 'deliver', from: from, order: k }); return; }
    showInfo(game.state.orders[k].wants, true);
  });

  function startDrag(e) {
    var c = cellEl(down.i), it = c && c.querySelector('.item');
    if (!it) return;
    var r = it.getBoundingClientRect(), g = document.createElement('div');
    g.className = 'ghost'; g.style.width = r.width * 1.12 + 'px'; g.style.height = r.height * 1.12 + 'px';
    g.innerHTML = it.innerHTML;
    document.body.appendChild(g);
    it.classList.add('lifted');
    if (sel >= 0) { sel = -1; render(); c = cellEl(down.i); c.querySelector('.item').classList.add('lifted'); markBubbles(); }
    drag = { from: down.i, ghost: g, w: r.width * 1.12, h: r.height * 1.12, hover: null };
    el.finger.className = '';
    Sfx.play('pick');
  }
  function targetAt(x, y) {
    var n = document.elementFromPoint(x, y);
    if (!n) return null;
    var b = n.closest('.bub');
    if (b) return { node: b, order: +b.dataset.order };
    var c = n.closest('.cell');
    if (c && el.board.contains(c)) return { node: c, i: +c.dataset.i };
    return null;
  }
  function moveDrag(e) {
    drag.ghost.style.transform = 'translate(' + (e.clientX - drag.w / 2) + 'px,' + (e.clientY - drag.h * 0.8) + 'px)';
    var t = targetAt(e.clientX, e.clientY - drag.h * 0.3);
    var node = t && t.i !== drag.from ? t.node : null;
    if (drag.hover !== node) {
      if (drag.hover) drag.hover.classList.remove('hover', 'bad');
      if (node) {
        node.classList.add('hover');
        if (t.i != null) {
          var a = game.state.cells[drag.from], b = game.state.cells[t.i];
          if (b && (b.k !== 'item' || (a.id === b.id && !R.ITEMS[a.id].next))) node.classList.add('bad');
        }
      }
      drag.hover = node;
    }
  }
  function endDrag(e, cancelled) {
    var t = cancelled ? null : targetAt(e.clientX, e.clientY - drag.h * 0.3);
    drag.ghost.remove();
    if (drag.hover) drag.hover.classList.remove('hover', 'bad');
    var from = drag.from;
    drag = null;
    if (!t || t.i === from) { render(); updateGuide(); return; }
    if (t.order != null) doAction({ t: 'deliver', from: from, order: t.order });
    else doAction({ t: 'drop', from: from, to: t.i });
  }

  // ---------------- overlays ----------------
  function openLayer(html, opts) {
    closeLayer();
    opts = opts || {};
    var l = document.createElement('div');
    l.className = 'layer' + (opts.cls ? ' ' + opts.cls : '');
    l.innerHTML = html;
    document.body.appendChild(l);
    layer = l;
    el.finger.className = '';
    if (opts.tapClose) l.addEventListener('click', function () { closeLayer(); if (opts.onClose) opts.onClose(); });
    else if (opts.outsideClose) l.addEventListener('click', function (ev) { if (ev.target === l) { closeLayer(); if (opts.onClose) opts.onClose(); } });
    return l;
  }
  function closeLayer() {
    if (layer) { layer.remove(); layer = null; }
    if (game && !game.state.won) updateGuide();
  }
  function on(l, sel2, fn) { var n = l.querySelector(sel2); if (n) n.addEventListener('click', function (ev) { ev.stopPropagation(); Sfx.unlock(); fn(ev, n); }); }

  function showIntro(panel) {
    openLayer('<div class="card"><h2>' + esc(T.ui.day + ' ' + (levelIdx + 1) + ': ' + T.levels[level.id]) + '</h2>' +
      '<div class="bigPanel">' + A.panelSVG(panel) + '</div><div class="bigCap">' + esc(T.panels[panel]) + '</div>' +
      '<div class="tapNote">' + T.ui.tapToStart + '</div></div>', { tapClose: true, onClose: function () { Sfx.unlock(); } });
  }

  function showPanels(start) {
    var ps = stripPanels(), k = start;
    if (!ps.length) return;
    var l = openLayer('<div class="card"><div class="bigPanel"></div><div class="bigCap"></div>' +
      '<div class="pager"><button class="prev" aria-label="Previous">◀</button><span class="small n"></span><button class="next" aria-label="Next">▶</button></div>' +
      '<div class="tapNote">' + T.ui.close + ': tap outside</div></div>', { outsideClose: true });
    function draw() {
      l.querySelector('.bigPanel').innerHTML = A.panelSVG(ps[k]);
      l.querySelector('.bigCap').textContent = T.panels[ps[k]];
      l.querySelector('.n').textContent = (k + 1) + ' / ' + ps.length;
      l.querySelector('.prev').disabled = k === 0; l.querySelector('.next').disabled = k === ps.length - 1;
    }
    on(l, '.prev', function () { if (k > 0) { k--; draw(); Sfx.play('page'); } });
    on(l, '.next', function () { if (k < ps.length - 1) { k++; draw(); Sfx.play('page'); } });
    draw();
  }
  el.strip.addEventListener('click', function () { if (game && !layer) showPanels(stripPanels().length - 1); });

  function showInfoCell(i) {
    var c = game.state.cells[i];
    if (!c) return;
    if (drag) return;
    if (c.k === 'gen') {
      var g = T.gens[c.gen];
      openLayer('<div class="card"><div class="info"><div class="pic">' + A.genSVG(c.gen) + '</div><div><div class="pun">' + esc(g.pun) + '</div><div class="plain">' + esc(g.name) +
        '</div><p>' + esc(g.line) + '</p><div class="small">×' + c.charges + ' ' + T.ui.genInfo + '</div></div></div></div>', { tapClose: true });
      return;
    }
    showInfo(c.id);
  }
  function showInfo(id, fromOrder) {
    var t = T.items[id], info = R.ITEMS[id], made = game.state.made;
    var known = made[id] || !fromOrder;
    var next = '';
    if (info.next) {
      next = '<div class="next">' + T.ui.mergesInto + ': ' + (made[info.next] ? '<span class="mini">' + A.itemSVG(info.next, { dots: false }) + '</span> ' + esc(itemName(info.next)) : T.ui.unknown) + '</div>';
    } else if (!info.combo) next = '<div class="next">' + T.ui.topTier + '</div>';
    openLayer('<div class="card"><div class="info"><div class="pic">' + A.itemSVG(id) + '</div><div><div class="pun">' + esc(known ? t.pun : T.ui.unknown) + '</div><div class="plain">' + esc(t.name) +
      '</div><p>' + esc(known ? t.line : '') + '</p>' + next + '</div></div></div>', { tapClose: true });
  }

  function showStuck() {
    if (!game || game.state.won || layer || !game.isStuck()) return;
    Sfx.play('uhoh');
    var l = openLayer('<div class="card"><div class="stuckCard"><div class="who">' + A.charSVG('bobo', 'worried') + '</div><h2>' + T.ui.stuck + '</h2></div>' +
      '<div class="btns"><button class="primary shake">' + T.ui.stuckShake + '</button><div class="row"><button class="undo">' + T.ui.stuckUndo + '</button><button class="close">' + T.ui.close + '</button></div></div></div>', { outsideClose: true });
    on(l, '.shake', function () { closeLayer(); doAction({ t: 'shake' }); });
    on(l, '.undo', function () { closeLayer(); undo(); });
    on(l, '.close', closeLayer);
  }

  function showMenu() {
    var l = openLayer('<div class="card"><h2>' + esc(T.levels[level.id]) + '</h2><div class="btns">' +
      '<button class="primary resume">' + T.ui.resume + '</button><button class="restart">' + T.ui.restart + '</button>' +
      '<button class="list">' + T.ui.levels + '</button><button class="sound">Sound: ' + (Sfx.isOn() ? 'on' : 'off') + '</button></div>' +
      '<p class="small">v' + VERSION + (test ? ' · ' + T.ui.testOn : '') + '</p></div>', { outsideClose: true });
    on(l, '.resume', closeLayer);
    on(l, '.restart', function () {
      if (game.moves() >= 5 && !game.state.won) {
        var l2 = openLayer('<div class="card"><p><b>' + T.ui.sure + '</b></p><div class="btns"><button class="primary yes">' + T.ui.yes + '</button><button class="no">' + T.ui.no + '</button></div></div>', { outsideClose: true });
        on(l2, '.yes', function () { closeLayer(); restart(); });
        on(l2, '.no', closeLayer);
      } else { closeLayer(); restart(); }
    });
    on(l, '.list', function () { showList(); });
    on(l, '.sound', function (ev, n) { Sfx.setOn(!Sfx.isOn()); save.sound = Sfx.isOn(); persist(); n.textContent = 'Sound: ' + (Sfx.isOn() ? 'on' : 'off'); });
  }

  function onWon() {
    var p = save.levels[level.id] || {};
    var m = game.moves(), s = game.stars();
    save.levels[level.id] = { won: true, stars: Math.max(p.stars || 0, s), best: p.best ? Math.min(p.best, m) : m };
    save.current = null;
    Store.save(save);
    el.finger.className = '';
    Sfx.play('win');
    var ps = stripPanels(), last = ps[ps.length - 1];
    var lastPanel = (level.story || []).filter(function (x) { return x.on === 'won'; })[0];
    if (lastPanel && last === lastPanel.panel) {
      openLayer('<div class="card"><div class="bigPanel">' + A.panelSVG(last) + '</div><div class="bigCap">' + esc(T.panels[last]) + '</div><div class="tapNote">Tap to continue</div></div>',
        { tapClose: true, onClose: showResults });
    } else showResults();
  }

  function report() {
    var st = game.stats;
    return ['Merge ya Fool v' + VERSION + ' playtest report',
      'Day ' + (levelIdx + 1) + ': ' + T.levels[level.id],
      (game.state.won ? 'Won' : 'Not finished') + ' in ' + game.moves() + ' moves (par ' + level.par + ', best possible ' + level.best + ') ' + '★★★'.slice(0, game.stars()),
      'Time ' + fmtTime(st.ms) + ' · undos ' + st.undos + ' · restarts ' + st.restarts + ' · wobbles ' + st.shakes + ' · hints ' + st.hints,
      'Actions: ' + st.log.join(' '),
      '(S spawn, M merge+tier, C combo, V move, W swap, D deliver, K wobble, U undo, R restart)',
      deviceLine()].join('\n');
  }

  function showResults() {
    var s = game.stars(), m = game.moves(), rec = save.levels[level.id] || {};
    var hasNext = levelIdx + 1 < LEVELS.length;
    var l = openLayer('<div class="card"><h2>' + T.ui.wonTitle + '</h2><div class="small">' + esc(T.ui.day + ' ' + (levelIdx + 1) + ': ' + T.levels[level.id]) + '</div>' +
      '<div class="stars">' + [0, 1, 2].map(function (k) { return '<span class="' + (k < s ? '' : 'off') + '" style="animation-delay:' + (0.25 + k * 0.3) + 's">★</span>'; }).join('') + '</div>' +
      '<p><b>' + m + ' ' + T.ui.moves.toLowerCase() + '</b> · ' + T.ui.fromPar + ' ' + level.par + (rec.best && rec.best < m ? ' · ' + T.ui.best + ' ' + rec.best : '') + '</p>' +
      '<div class="btns">' + (hasNext ? '<button class="primary next">' + T.ui.nextDay + ' ▶</button>' : '<p>' + T.ui.more + '</p>') +
      '<div class="row"><button class="again">' + T.ui.replay + '</button><button class="list">' + T.ui.levels + '</button></div>' +
      (test ? '<button class="mint copy">' + T.ui.copyReport + '</button>' : '') + '</div></div>');
    for (var k = 0; k < s; k++) setTimeout(Sfx.play.bind(null, 'star', k), 250 + k * 300);
    on(l, '.next', function () { startLevel(levelIdx + 1); });
    on(l, '.again', function () { startLevel(levelIdx); });
    on(l, '.list', showList);
    on(l, '.copy', function (ev, n) { copyText(report(), n); });
  }

  function showList() {
    var html = '<div class="card list"><h1>' + T.ui.listTitle + '</h1><div class="small">' + T.ui.listSub + '</div><div class="days">';
    LEVELS.forEach(function (l, i) {
      var rec = save.levels[l.id] || {}, prev = i === 0 || (save.levels[LEVELS[i - 1].id] || {}).won;
      var cur = save.current && save.current.level === l.id;
      html += '<button class="day' + (prev ? '' : ' locked') + '" data-i="' + i + '"' + (prev ? '' : ' disabled') + '><span class="n">' + (i + 1) + '</span><span class="t">' + esc(T.levels[l.id]) +
        (cur ? '<br><span class="small">in progress</span>' : '') + '</span><span class="s">' + (rec.won ? starsHTML(rec.stars) : '') + '</span></button>';
    });
    html += '</div><p class="small">' + T.ui.more + '</p>' + (test && game && !game.state.won ? '<button class="mint copy">' + T.ui.copyReport + '</button>' : '') +
      '<div class="foot">v' + VERSION + ' · ' + T.ui.privacy + (test ? ' · ' + T.ui.testOn : '') + ' · <a href="phone-tests/">' + T.ui.phoneTests + '</a></div></div>';
    var l = openLayer(html, { cls: 'solid' });
    l.style.background = 'var(--bg)';
    l.querySelectorAll('.day').forEach(function (b) {
      b.addEventListener('click', function () {
        Sfx.unlock();
        var i = +b.dataset.i;
        var cur = save.current && save.current.level === LEVELS[i].id ? save.current : null;
        startLevel(i, cur);
      });
    });
    on(l, '.copy', function (ev, n) { copyText(report(), n); });
  }

  // ---------------- playtest corner ----------------
  function updateTestBox() {
    if (!test) return;
    if (!testBox) { testBox = document.createElement('div'); testBox.id = 'testBox'; document.body.appendChild(testBox); }
    testBox.textContent = game ? 'm ' + game.moves() + ' · ' + fmtTime(game.stats.ms) : '';
  }
  setInterval(function () {
    if (!game || game.state.won || document.visibilityState !== 'visible') return;
    game.stats.ms += 1000;
    if (test) updateTestBox();
    if (game.stats.ms % 10000 === 0) persist();
  }, 1000);

  // ---------------- buttons and system events ----------------
  el.undo.addEventListener('click', function () { Sfx.unlock(); if (!layer) undo(); });
  el.hint.addEventListener('click', function () { Sfx.unlock(); if (!layer) hint(); });
  el.menu.addEventListener('click', function () { Sfx.unlock(); if (!layer && game) showMenu(); });
  window.addEventListener('resize', function () { layout(); updateGuide(); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') persist(); });
  window.addEventListener('pagehide', persist);
  // The phone's Back button opens the menu instead of leaving the game
  try {
    history.pushState({ myf: 1 }, '');
    window.addEventListener('popstate', function () {
      history.pushState({ myf: 1 }, '');
      if (layer) closeLayer(); else if (game) showMenu();
    });
  } catch (e) { /* not important */ }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'z' || e.key === 'Z') undo();
    else if (e.key === 'h' || e.key === 'H') hint();
    else if (e.key === 'Escape') { if (layer) closeLayer(); else if (game) showMenu(); }
  });

  // ---------------- start ----------------
  lockPage();
  Store.askPersist();
  var cur = save.current, curIdx = -1;
  if (cur) LEVELS.forEach(function (l, i) { if (l.id === cur.level) curIdx = i; });
  var anyWon = LEVELS.some(function (l) { return (save.levels[l.id] || {}).won; });
  if (curIdx >= 0) startLevel(curIdx, cur);
  else if (!anyWon) startLevel(0);
  else { level = LEVELS[0]; showList(); }

  // For tests and the playtest report (read-only peek)
  MYF.UI = { get game() { return game; }, report: report, startLevel: startLevel, showList: showList, doAction: doAction, undo: undo, hint: hint };
})();
