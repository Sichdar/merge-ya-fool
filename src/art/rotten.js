// Rotten art pack (R6): "drawn by Bobo". Loaded by index.html after the clean art files.
// Two looks, picked in the menu (S07): "original" (clean art) and "rotten" (every drawing looks drawn by Bobo).
// The look is kept on the phone (localStorage 'myf-look'); ?look=rotten or ?look=original in the address sets it.
// It doesn't redraw anything: in the rotten look it wraps every drawing the game asks for and makes it look badly drawn:
//  - the black lines wobble (an SVG filter defined once in index.html, #rotA / #rotB / #rotC)
//  - the colours are a second copy, shifted a few units, so they miss the lines like a hurried kid
//  - the ink is plain black biro instead of the clean purple ink (src/rotten.css, only under html.rotten)
// A.rot stays available in both looks, so Bobo's own things (the Book of Bobo) can be rotten in the original look too.
// Rules, levels and words are untouched, so both looks always play the same.
(function (window) {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  var A = MYF.Art;
  if (!A) return;
  var KEY = 'myf-look';

  // Small stable hash, so each drawing always gets the same wobble and the same colour slip
  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i += 7) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h;
  }

  // Wrap the inside of one <svg ...>...</svg> string. size = the drawing's box width (100, 120, 160)
  function rot(svg, size) {
    if (typeof svg !== 'string' || svg.indexOf('<svg') !== 0) return svg;
    var open = svg.indexOf('>') + 1, close = svg.lastIndexOf('</svg>');
    if (open <= 0 || close < open) return svg;
    var head = svg.slice(0, open), inner = svg.slice(open, close);
    var h = hash(inner), k = (size || 100) / 100;
    var dx = (((h & 7) - 3.5) * 1.1 + (h & 8 ? 3.2 : -3.2)) * k;
    var dy = ((((h >> 4) & 7) - 3.5) * 0.9 + (h & 128 ? 2.4 : -2.4)) * k;
    var f = ['rotA', 'rotB', 'rotC'][h % 3], f2 = ['rotB', 'rotC', 'rotA'][h % 3];
    return head +
      '<g class="ri" filter="url(#' + f + ')">' + inner + '</g>' +
      '<g class="rf" filter="url(#' + f2 + ')" transform="translate(' + dx.toFixed(1) + ' ' + dy.toFixed(1) + ')">' + inner + '</g>' +
      '</svg>';
  }

  // Which look: the address wins (and is remembered), then what the phone remembers, then original
  function readLook() {
    var m = /[?&]look=(rotten|original)/.exec((window.location && window.location.search) || '');
    var look = null;
    try {
      if (m) window.localStorage.setItem(KEY, m[1]);
      look = window.localStorage.getItem(KEY);
    } catch (e) { look = m ? m[1] : null; }
    if (m) {
      // tidy the address so a later switch in the menu isn't undone by it
      try { window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search.replace(/([?&])look=[a-z]+&?/, '$1').replace(/[?&]$/, '') + window.location.hash); } catch (e) { /* not important */ }
    }
    return look === 'rotten' ? 'rotten' : 'original';
  }

  var look = readLook();
  var on = look === 'rotten';

  if (on) {
    var wrap = function (name, size) {
      var orig = A[name];
      if (typeof orig !== 'function') return;
      A[name] = function () { return rot(orig.apply(A, arguments), size); };
    };
    wrap('itemSVG', 100);
    wrap('genSVG', 100);
    wrap('charSVG', 120);
    wrap('panelSVG', 160);
    wrap('brainSVG', 100);
    wrap('planSVG', 100);
    if (A.ICONS) Object.keys(A.ICONS).forEach(function (key) { A.ICONS[key] = rot(A.ICONS[key], 30); });
    var doc = window.document;
    if (doc && doc.documentElement) {
      doc.documentElement.classList.add('rotten');
      var tc = doc.querySelector && doc.querySelector('meta[name="theme-color"]');
      if (tc) tc.setAttribute('content', '#FFFDF5');
      doc.title = 'Merge ya Fool (drawn by Bobo)';
    }
  }

  // Switch look: remember it and reload, so every drawing on screen is drawn again in the new look.
  // The caller saves the game first; the reload carries on from the same move.
  function setLook(v) {
    v = v === 'rotten' ? 'rotten' : 'original';
    try { window.localStorage.setItem(KEY, v); } catch (e) { return false; }
    try { window.location.reload(); } catch (e) { /* tests */ }
    return true;
  }

  A.rotten = on;
  A.look = look;
  A.rot = rot;
  A.setLook = setLook;
})(window);
