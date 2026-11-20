// Shared bits for the M0 phone tests: placeholder item drawings and small helpers.
// The real game art comes in M1; these are only stand-ins of a similar weight.
(function () {
  'use strict';
  var INK = '#3B2440';

  function face(cx, cy) {
    return '<circle cx="' + (cx - 8) + '" cy="' + cy + '" r="3.6" fill="' + INK + '"/>' +
      '<circle cx="' + (cx + 8) + '" cy="' + cy + '" r="3.6" fill="' + INK + '"/>' +
      '<path d="M' + (cx - 6) + ' ' + (cy + 9) + ' Q' + cx + ' ' + (cy + 15) + ' ' + (cx + 6) + ' ' + (cy + 9) +
      '" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
  }

  var BODY = {
    egg: '<ellipse cx="50" cy="54" rx="29" ry="36" fill="#FFF1CF" stroke="' + INK + '" stroke-width="5"/>' +
      '<ellipse cx="40" cy="36" rx="7" ry="10" fill="#fff" opacity=".85"/>' + face(50, 58),
    spoon: '<rect x="44" y="50" width="12" height="42" rx="6" fill="#8FB3DA" stroke="' + INK + '" stroke-width="5"/>' +
      '<ellipse cx="50" cy="34" rx="25" ry="26" fill="#B7D2EE" stroke="' + INK + '" stroke-width="5"/>' +
      '<ellipse cx="40" cy="24" rx="6" ry="8" fill="#fff" opacity=".85"/>' + face(50, 36),
    thread: '<rect x="27" y="24" width="46" height="52" rx="8" fill="#F38BB4" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M30 38 H70 M30 50 H70 M30 62 H70" stroke="#C9567F" stroke-width="3"/>' +
      '<rect x="17" y="12" width="66" height="15" rx="7" fill="#D9A877" stroke="' + INK + '" stroke-width="5"/>' +
      '<rect x="17" y="74" width="66" height="15" rx="7" fill="#D9A877" stroke="' + INK + '" stroke-width="5"/>' + face(50, 46)
  };
  var NAMES = { egg: ['Egg', 'Hatchling', 'Chick', 'Hen'], spoon: ['Spoon', 'Big Spoon', 'Ladle', 'Golden Ladle'], thread: ['Thread', 'Sock', 'Pair of Socks', 'Sweater'] };
  var SCALE = [0, 0.64, 0.74, 0.84, 0.94];

  function itemSVG(type, tier) {
    var s = SCALE[tier] || 0.9;
    var dots = '';
    for (var i = 0; i < tier; i++) {
      dots += '<circle cx="' + (90 - i * 11) + '" cy="10" r="4.5" fill="#FFC83D" stroke="' + INK + '" stroke-width="2"/>';
    }
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(50 54) scale(' + s + ') translate(-50 -54)">' +
      BODY[type] + '</g>' + dots + '</svg>';
  }

  function generatorSVG() {
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="M26 44 Q50 6 74 44" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M14 44 H86 L78 88 Q77 92 72 92 H28 Q23 92 22 88 Z" fill="#C98B55" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M22 60 H78 M25 75 H75" stroke="#9E6638" stroke-width="3"/>' +
      '<ellipse cx="38" cy="42" rx="9" ry="7" fill="#FFF1CF" stroke="' + INK + '" stroke-width="3"/>' +
      '<ellipse cx="60" cy="41" rx="9" ry="7" fill="#B7D2EE" stroke="' + INK + '" stroke-width="3"/>' +
      '</svg>';
  }

  // Little star-burst used for merges.
  function sparkle(x, y, layer) {
    for (var i = 0; i < 8; i++) {
      var s = document.createElement('span');
      s.className = 'spark';
      var a = (Math.PI * 2 * i) / 8;
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.round(Math.cos(a) * 46) + 'px');
      s.style.setProperty('--dy', Math.round(Math.sin(a) * 46) + 'px');
      (layer || document.body).appendChild(s);
      setTimeout(function (el) { el.remove(); }.bind(null, s), 520);
    }
  }

  function deviceLine() {
    var ua = navigator.userAgent;
    var os = /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'Mac' : 'Other';
    var br = /CriOS|Chrome/.test(ua) && !/Edg/.test(ua) ? 'Chrome' : /Edg/.test(ua) ? 'Edge' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /Safari/.test(ua) ? 'Safari' : 'Other';
    var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
    return os + ' · ' + br + ' · screen ' + screen.width + '×' + screen.height + ' @' + (window.devicePixelRatio || 1) + 'x · window ' +
      innerWidth + '×' + innerHeight + (standalone ? ' · installed' : '');
  }

  function copyText(text, btn) {
    function done(ok) {
      if (!btn) return;
      var old = btn.dataset.label || btn.textContent;
      btn.dataset.label = old;
      btn.textContent = ok ? 'Copied ✓' : 'Copy failed';
      setTimeout(function () { btn.textContent = old; }, 1600);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else {
      fallback();
    }
  }

  // Locks a game page: no scrolling, no pinch-zoom, no double-tap zoom.
  // iPhone Safari ignores user-scalable=no and overflow:hidden on body, so (v0.0.2, after Fabio's
  // iPhone test showed 6 scrolls and a zoom): pin the page with position:fixed (CSS class myf-locked),
  // cancel every touchmove (pointer events still arrive, so dragging keeps working),
  // cancel Safari's gesture events, and cancel the second tap of a fast double tap.
  function blockZoom() {
    document.documentElement.classList.add('myf-locked');
    var stop = function (e) { if (e.cancelable) e.preventDefault(); };
    ['gesturestart', 'gesturechange', 'gestureend', 'dblclick', 'contextmenu'].forEach(function (t) {
      document.addEventListener(t, stop, { passive: false });
    });
    document.addEventListener('touchmove', stop, { passive: false });
    document.addEventListener('touchstart', function (e) { if (e.touches && e.touches.length > 1) stop(e); }, { passive: false });
    var lastEnd = 0;
    document.addEventListener('touchend', function (e) {
      var now = Date.now();
      if (now - lastEnd < 350 && e.changedTouches && e.changedTouches.length === 1) stop(e);
      lastEnd = now;
    }, { passive: false });
    window.addEventListener('scroll', function () { if (window.scrollX || window.scrollY) window.scrollTo(0, 0); }, { passive: true });
  }

  window.MYF = {
    VERSION: '0.0.2',
    itemSVG: itemSVG, generatorSVG: generatorSVG, NAMES: NAMES,
    sparkle: sparkle, deviceLine: deviceLine, copyText: copyText, blockZoom: blockZoom
  };
})();
