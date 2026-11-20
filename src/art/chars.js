// Characters built from parts (body + 6 expressions) and story panels built from short descriptions.
(function () {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  var B = MYF.Art.bits, INK = B.INK, W = B.W, THIN = B.THIN, dot = B.dot;

  // ---- expressions: eyes at x1/x2,y; mouth centred at mx,my; k = size ----
  function face(expr, x1, x2, y, mx, my, k) {
    k = k || 1;
    var e = '', m = '';
    switch (expr) {
      case 'happy':
        e = B.happyEyes(x1, x2, y);
        m = '<path d="M' + (mx - 9 * k) + ' ' + my + ' Q' + mx + ' ' + (my + 14 * k) + ' ' + (mx + 9 * k) + ' ' + my + ' Z" fill="#fff" ' + THIN + '/>';
        break;
      case 'worried':
        e = dot(x1, y + 1, 3.6 * k) + dot(x2, y + 1, 3.6 * k) +
          '<path d="M' + (x1 - 6) + ' ' + (y - 6) + ' L' + (x1 + 4) + ' ' + (y - 10) + ' M' + (x2 + 6) + ' ' + (y - 6) + ' L' + (x2 - 4) + ' ' + (y - 10) + '" ' + THIN + '/>';
        m = '<path d="M' + (mx - 8 * k) + ' ' + (my + 3) + ' q4 -4 8 0 q4 4 8 0" fill="none" ' + THIN + '/>';
        break;
      case 'shocked':
        e = B.bigEyes(x1, x2, y, 7 * k);
        m = '<ellipse cx="' + mx + '" cy="' + (my + 4) + '" rx="' + (5 * k) + '" ry="' + (7 * k) + '" fill="' + INK + '"/>';
        break;
      case 'laughing':
        e = '<path d="M' + (x1 - 5) + ' ' + (y - 4) + ' L' + (x1 + 4) + ' ' + y + ' L' + (x1 - 5) + ' ' + (y + 4) + ' M' + (x2 + 5) + ' ' + (y - 4) + ' L' + (x2 - 4) + ' ' + y + ' L' + (x2 + 5) + ' ' + (y + 4) + '" fill="none" ' + THIN + '/>';
        m = '<path d="M' + (mx - 11 * k) + ' ' + my + ' Q' + mx + ' ' + (my + 20 * k) + ' ' + (mx + 11 * k) + ' ' + my + ' Z" fill="' + INK + '"/>' +
          '<path d="M' + (mx - 5 * k) + ' ' + (my + 9 * k) + ' q5 -5 10 0 q-5 5 -10 0" fill="#F26B8A"/>';
        break;
      case 'proud':
        e = dot(x1, y + 2, 3.4 * k) + dot(x2, y + 2, 3.4 * k) +
          '<path d="M' + (x1 - 6) + ' ' + (y - 1) + ' H' + (x1 + 6) + ' M' + (x2 - 6) + ' ' + (y - 1) + ' H' + (x2 + 6) + '" ' + THIN + '/>';
        m = '<path d="M' + (mx - 8 * k) + ' ' + (my + 1) + ' Q' + (mx + 2) + ' ' + (my + 9 * k) + ' ' + (mx + 10 * k) + ' ' + (my - 2) + '" fill="none" ' + THIN + '/>';
        break;
      case 'sleepy':
        e = '<path d="M' + (x1 - 5) + ' ' + (y + 1) + ' H' + (x1 + 5) + ' M' + (x2 - 5) + ' ' + (y + 1) + ' H' + (x2 + 5) + '" ' + THIN + '/>';
        m = '<circle cx="' + mx + '" cy="' + (my + 3) + '" r="' + (3 * k) + '" fill="none" ' + THIN + '/>' +
          '<text x="' + (x2 + 12) + '" y="' + (y - 10) + '" font-size="14" font-weight="800" fill="' + INK + '" font-family="system-ui,sans-serif">z</text>';
        break;
    }
    return e + m;
  }

  // ---- characters (each in a 120 x 120 box) ----
  var CHARS = {
    bobo: function (x) {
      return '<path d="M26 120 Q26 98 60 98 Q94 98 94 120 Z" fill="#9C6ADE" ' + W + '/>' +
        '<path d="M34 102 l8 8 l8 -8 l10 8 l10 -8 l8 8 l8 -8" fill="#FFC83D" ' + THIN + '/>' +
        '<path d="M30 50 Q22 18 6 22 Q24 30 34 44 Z" fill="#5CC9A7" ' + W + '/>' +
        '<path d="M90 50 Q98 18 114 22 Q96 30 86 44 Z" fill="#F38BB4" ' + W + '/>' +
        '<path d="M36 46 Q60 2 84 46 Z" fill="#FFC83D" ' + W + '/>' +
        '<circle cx="6" cy="22" r="6" fill="#FFC83D" ' + THIN + '/><circle cx="114" cy="22" r="6" fill="#FFC83D" ' + THIN + '/><circle cx="60" cy="8" r="6" fill="#5CC9A7" ' + THIN + '/>' +
        '<circle cx="60" cy="72" r="31" fill="#FBD7B8" ' + W + '/>' +
        '<circle cx="39" cy="80" r="5" fill="#F38BB4" opacity=".6"/><circle cx="81" cy="80" r="5" fill="#F38BB4" opacity=".6"/>' +
        '<path d="M30 46 H90" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="60" cy="74" r="4" fill="#F26B6B"/>' +
        face(x, 48, 72, 66, 60, 82, 1);
    },
    king: function (x) {
      return '<path d="M14 120 Q14 94 60 94 Q106 94 106 120 Z" fill="#D9405E" ' + W + '/>' +
        '<path d="M30 98 Q60 112 90 98 L92 106 Q60 120 28 106 Z" fill="#fff" ' + THIN + '/>' +
        '<circle cx="44" cy="104" r="1.8" fill="' + INK + '"/><circle cx="62" cy="108" r="1.8" fill="' + INK + '"/><circle cx="78" cy="104" r="1.8" fill="' + INK + '"/>' +
        '<circle cx="60" cy="64" r="32" fill="#FBD7B8" ' + W + '/>' +
        '<circle cx="38" cy="72" r="5" fill="#F38BB4" opacity=".6"/><circle cx="82" cy="72" r="5" fill="#F38BB4" opacity=".6"/>' +
        B.crown(60, 26, 2.1) +
        face(x, 48, 72, 58, 60, 84, 0.9) +
        '<path d="M34 76 Q46 66 60 74 Q74 66 86 76 Q74 84 60 78 Q46 84 34 76 Z" fill="#fff" ' + THIN + '/>' +
        '<circle cx="60" cy="70" r="6" fill="#F7B79A" ' + THIN + '/>';
    },
    sirChick: function (x) {
      return '<g transform="rotate(-20 96 60)"><rect x="92" y="34" width="8" height="58" rx="4" fill="#A9C6E6" ' + THIN + '/>' +
        '<path d="M82 30 Q96 18 110 30 Q108 42 96 42 Q84 42 82 30 Z" fill="#A9C6E6" ' + THIN + '/></g>' +
        B.chickBody(58, 74, 36) +
        '<path d="M26 56 Q58 44 90 56 L88 63 Q58 52 28 63 Z" fill="#F26B6B" ' + THIN + '/>' +
        face(x, 46, 70, 70, 58, 86, 0.9) + B.beak(58, 76);
    }
  };

  function charSVG(who, expr) {
    var f = CHARS[who];
    return '<svg viewBox="0 0 120 120" aria-hidden="true">' + (f ? f(expr || 'happy') : '') + '</svg>';
  }

  // ---- panels ----
  // Scene parts: bg, chars [[who, expr, x, y, size]], props [[itemId, x, y, size, rotate]], fx [[kind, x, y, size]]
  var POT = function (x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<path d="M-38 -10 H38 V20 Q38 34 24 34 H-24 Q-38 34 -38 20 Z" fill="#7C8798" ' + W + '/>' +
      '<rect x="-44" y="-16" width="88" height="10" rx="5" fill="#9AA3B5" ' + W + '/>' +
      '<ellipse cx="0" cy="-16" rx="40" ry="6" fill="#B5D86A" ' + THIN + '/>' +
      '<path d="M-14 -30 q4 -6 0 -12 M2 -32 q4 -6 0 -12 M18 -30 q4 -6 0 -12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/></g>';
  };
  var FX = {
    splash: function (x, y, s) {
      return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#B5D86A" stroke="' + INK + '" stroke-width="2">' +
        '<circle cx="-16" cy="-10" r="4"/><circle cx="14" cy="-14" r="5"/><circle cx="0" cy="-22" r="3.5"/><circle cx="24" cy="-4" r="3"/><circle cx="-26" cy="-2" r="3"/></g>';
    },
    sparkles: function (x, y, s) { return B.sparkle(x - 14 * s, y, s) + B.sparkle(x + 14 * s, y - 8 * s, s * 0.8) + B.sparkle(x, y + 12 * s, s * 0.6); },
    hearts: function (x, y, s) { return B.heart(x - 10 * s, y, s) + B.heart(x + 10 * s, y - 8 * s, s * 0.8); },
    motion: function (x, y, s) {
      return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M-20 -8 H-6 M-24 0 H-8 M-20 8 H-6" ' + THIN + '/>';
    },
    drips: function (x, y, s) {
      var d = function (dx, dy) { return '<path transform="translate(' + (x + dx * s) + ' ' + (y + dy * s) + ') scale(' + s + ')" d="M0 -5 Q4 1 0 4 Q-4 1 0 -5 Z" fill="#B5D86A" stroke="' + INK + '" stroke-width="1.6"/>'; };
      return d(-14, 0) + d(0, 6) + d(14, 0);
    },
    cold: function (x, y, s) {
      return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" stroke="#6BB7F2" stroke-width="3" stroke-linecap="round" fill="none">' +
        '<path d="M-10 -12 l-6 -2 M-12 0 h-7 M-10 12 l-6 2 M10 -12 l6 -2 M12 0 h7 M10 12 l6 2"/></g>';
    },
    steam: function (x, y, s) {
      return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M-10 0 q4 -6 0 -12 M0 -2 q4 -6 0 -12 M10 0 q4 -6 0 -12" fill="none" stroke="#F5A05A" stroke-width="3" stroke-linecap="round"/>';
    },
    tears: function (x, y, s) {
      return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M-14 0 q-4 8 0 10 q4 -2 0 -10 Z M14 0 q-4 8 0 10 q4 -2 0 -10 Z" fill="#9FD8F5" stroke="' + INK + '" stroke-width="1.6"/>';
    },
    question: function (x, y, s) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (22 * s) + '" font-weight="800" fill="' + INK + '" font-family="system-ui,sans-serif">?</text>';
    },
    clang: function (x, y, s) {
      return '<text x="' + x + '" y="' + y + '" font-size="' + (13 * s) + '" font-weight="800" fill="' + INK + '" font-family="system-ui,sans-serif" transform="rotate(-12 ' + x + ' ' + y + ')">CLANG!</text>';
    }
  };
  var BG = {
    kitchen: '<rect width="160" height="100" fill="#FFF0D4"/>' +
      '<path d="M0 0 H160 V62 H0 Z" fill="#FCE6C0"/><path d="M0 20 H160 M0 40 H160 M20 0 V62 M60 0 V62 M100 0 V62 M140 0 V62" stroke="#F2D7A6" stroke-width="1.5"/>' +
      '<rect x="0" y="62" width="160" height="38" fill="#E9C995"/><path d="M0 62 H160" stroke="' + INK + '" stroke-width="2.5"/>',
    nursery: '<rect width="160" height="100" fill="#E8F3FB"/><rect x="0" y="66" width="160" height="34" fill="#F3E3C3"/><path d="M0 66 H160" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<circle cx="24" cy="18" r="3" fill="#fff"/><circle cx="130" cy="12" r="3" fill="#fff"/><circle cx="96" cy="26" r="2" fill="#fff"/>'
  };

  var PANELS = {
    'c1-01-p1': { bg: 'kitchen', pot: [80, 78, 0.8], chars: [['bobo', 'laughing', 4, 26, 56], ['king', 'shocked', 104, 24, 56]], props: [['_crown', 62, 4, 0.36, 30]], fx: [['motion', 66, 24, 0.8], ['splash', 80, 64, 1]] },
    'c1-01-p2': { bg: 'kitchen', pot: [104, 78, 0.8], chars: [['bobo', 'proud', 6, 28, 56]], props: [['ladle', 92, 34, 0.42, -20], ['sock', 112, 6, 0.32, 10]], fx: [['question', 138, 22, 1]] },
    'c1-01-p3': { bg: 'kitchen', pot: [80, 80, 0.8], chars: [['bobo', 'shocked', 6, 32, 50]], props: [['braveChick', 76, 22, 0.5, 35]], fx: [['motion', 72, 40, 0.8], ['sparkles', 130, 30, 1]] },
    'c1-01-p4': { bg: 'kitchen', chars: [['king', 'happy', 44, 18, 76]], props: [['braveChick', 6, 52, 0.44, 0]], fx: [['drips', 82, 50, 1.2], ['sparkles', 140, 30, 1]] },
    'c1-01-p5': { bg: 'kitchen', chars: [['king', 'proud', 92, 16, 64], ['sirChick', 'proud', 40, 34, 56], ['bobo', 'laughing', 0, 40, 46]], fx: [['sparkles', 72, 22, 1.1]] },
    'c1-02-p1': { bg: 'nursery', chars: [['sirChick', 'worried', 8, 30, 60]], props: [['egg', 96, 40, 0.5, 0]], fx: [['cold', 120, 64, 1.4]] },
    'c1-02-p2': { bg: 'nursery', chars: [['bobo', 'proud', 10, 28, 58]], props: [['sock', 92, 34, 0.5, -10]], fx: [['question', 136, 30, 1.2]] },
    'c1-02-p3': { bg: 'nursery', chars: [['bobo', 'happy', 4, 34, 52]], props: [['socks', 74, 26, 0.6, 0]], fx: [['hearts', 136, 22, 1.2]] },
    'c1-02-p4': { bg: 'nursery', chars: [['sirChick', 'happy', 6, 32, 56]], props: [['cosyEgg', 86, 30, 0.56, 0]], fx: [['steam', 116, 26, 1.2]] },
    'c1-02-p5': { bg: 'nursery', chars: [['sirChick', 'laughing', 4, 34, 54]], props: [['hatchling', 70, 30, 0.5, 0], ['sock', 104, 50, 0.34, 0]], fx: [['hearts', 140, 24, 1]] },
    'c1-03-p1': { bg: 'kitchen', chars: [['bobo', 'shocked', 4, 34, 52]], props: [['_drawer', 82, 40, 0.5, 0], ['spoon', 70, 6, 0.26, -30], ['spoon', 100, 0, 0.26, 10], ['spoon', 126, 10, 0.26, 40]], fx: [['clang', 110, 44, 1]] },
    'c1-03-p2': { bg: 'kitchen', chars: [['king', 'laughing', 4, 22, 70]], props: [['goldenLadle', 90, 22, 0.56, 0]], fx: [['tears', 39, 66, 1], ['sparkles', 140, 20, 1]] },
    'c1-03-p3': { bg: 'kitchen', chars: [['sirChick', 'proud', 8, 32, 58]], props: [['chick', 86, 36, 0.52, 0]], fx: [['sparkles', 80, 26, 0.9]] },
    'c1-03-p4': { bg: 'kitchen', chars: [['king', 'worried', 98, 30, 58], ['bobo', 'sleepy', 2, 36, 52]], props: [['_drawer', 58, 46, 0.44, 0]], fx: [['clang', 64, 40, 0.9], ['motion', 60, 70, 0.8]] }
  };

  function prop(id, x, y, s, rot) {
    var inner;
    if (id === '_crown') inner = B.crown(50, 50, 3);
    else if (id === '_drawer') inner = MYF.Art.genInner('spoonDrawer');
    else inner = MYF.Art.itemInner(id);
    var size = 100 * s;
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ' ' + size / 2 + ' ' + size / 2 + ') scale(' + s + ')">' + inner + '</g>';
  }

  function panelSVG(id) {
    var p = PANELS[id];
    if (!p) return '';
    var out = BG[p.bg] || '';
    if (p.pot) out += POT(p.pot[0], p.pot[1], p.pot[2]);
    (p.chars || []).forEach(function (c) {
      out += '<svg x="' + c[2] + '" y="' + c[3] + '" width="' + c[4] + '" height="' + c[4] + '" viewBox="0 0 120 120">' + (CHARS[c[0]] ? CHARS[c[0]](c[1]) : '') + '</svg>';
    });
    (p.props || []).forEach(function (q) { out += prop(q[0], q[1], q[2], q[3], q[4]); });
    (p.fx || []).forEach(function (f) { out += FX[f[0]] ? FX[f[0]](f[1], f[2], f[3]) : ''; });
    return '<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + out + '</svg>';
  }

  MYF.Art.charSVG = charSVG;
  MYF.Art.panelSVG = panelSVG;
  MYF.Art.PANELS = PANELS;
})();
