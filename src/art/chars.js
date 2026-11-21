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
      // ---- meme pass 2 (R3): new faces ----
      case 'confused': // visible confusion: one eyebrow up
        e = dot(x1, y + 1, 3.4 * k) + dot(x2, y + 1, 3.4 * k) +
          '<path d="M' + (x1 - 6) + ' ' + (y - 6) + ' H' + (x1 + 5) + ' M' + (x2 - 6) + ' ' + (y - 9) + ' Q' + x2 + ' ' + (y - 16) + ' ' + (x2 + 6) + ' ' + (y - 10) + '" fill="none" ' + THIN + '/>';
        m = '<path d="M' + (mx - 7 * k) + ' ' + (my + 4) + ' q4 -3 7 0 q4 3 7 -1" fill="none" ' + THIN + '/>';
        break;
      case 'internal': // calm outside (the screaming is in the thought bubble)
        e = '<path d="M' + (x1 - 5) + ' ' + y + ' Q' + x1 + ' ' + (y + 3) + ' ' + (x1 + 5) + ' ' + y + ' M' + (x2 - 5) + ' ' + y + ' Q' + x2 + ' ' + (y + 3) + ' ' + (x2 + 5) + ' ' + y + '" fill="none" ' + THIN + '/>';
        m = '<path d="M' + (mx - 6 * k) + ' ' + (my + 3) + ' H' + (mx + 6 * k) + '" ' + THIN + '/>';
        break;
      case 'sideEye':
        e = '<ellipse cx="' + x1 + '" cy="' + (y + 1) + '" rx="' + 6 * k + '" ry="' + 4.5 * k + '" fill="#fff" ' + THIN + '/><ellipse cx="' + x2 + '" cy="' + (y + 1) + '" rx="' + 6 * k + '" ry="' + 4.5 * k + '" fill="#fff" ' + THIN + '/>' +
          dot(x1 + 3.5 * k, y + 1.5, 2.6 * k) + dot(x2 + 3.5 * k, y + 1.5, 2.6 * k) +
          '<path d="M' + (x1 - 7) + ' ' + (y - 2) + ' H' + (x1 + 7) + ' M' + (x2 - 7) + ' ' + (y - 2) + ' H' + (x2 + 7) + '" ' + THIN + '/>';
        m = '<path d="M' + (mx - 6 * k) + ' ' + (my + 3) + ' H' + (mx + 4 * k) + '" ' + THIN + '/>';
        break;
      case 'mindBlown':
        e = B.bigEyes(x1, x2, y, 7.5 * k);
        m = '<ellipse cx="' + mx + '" cy="' + (my + 4) + '" rx="' + (6 * k) + '" ry="' + (8 * k) + '" fill="' + INK + '"/>';
        break;
      case 'loading':
        e = '<path d="M' + (x1 - 5) + ' ' + (y + 1) + ' H' + (x1 + 5) + ' M' + (x2 - 5) + ' ' + (y + 1) + ' H' + (x2 + 5) + '" ' + THIN + '/>';
        m = '<path d="M' + (mx - 5 * k) + ' ' + (my + 3) + ' H' + (mx + 5 * k) + '" ' + THIN + '/>';
        break;
      case 'smug': // eyes closed, sipping soup
        e = '<path d="M' + (x1 - 5) + ' ' + (y - 1) + ' Q' + x1 + ' ' + (y + 4) + ' ' + (x1 + 5) + ' ' + (y - 1) + ' M' + (x2 - 5) + ' ' + (y - 1) + ' Q' + x2 + ' ' + (y + 4) + ' ' + (x2 + 5) + ' ' + (y - 1) + '" fill="none" ' + THIN + '/>';
        m = '<path d="M' + (mx - 12) + ' ' + (my - 1) + ' H' + (mx + 12) + ' Q' + (mx + 12) + ' ' + (my + 14) + ' ' + mx + ' ' + (my + 14) + ' Q' + (mx - 12) + ' ' + (my + 14) + ' ' + (mx - 12) + ' ' + (my - 1) + ' Z" fill="#fff" ' + THIN + '/>' +
          '<ellipse cx="' + mx + '" cy="' + (my - 1) + '" rx="12" ry="3" fill="#B5D86A" ' + THIN + '/>' +
          '<path d="M' + (mx - 4) + ' ' + (my - 8) + ' q3 -4 0 -8 M' + (mx + 4) + ' ' + (my - 8) + ' q3 -4 0 -8" fill="none" stroke="#9AA3B5" stroke-width="2" stroke-linecap="round"/>';
        break;
    }
    return e + m;
  }

  // Extras drawn above the head for some faces (in the 120 x 120 box, top right is free on every character)
  function overlay(expr) {
    switch (expr) {
      case 'confused':
        return '<text x="92" y="30" font-size="22" font-weight="900" fill="' + INK + '" font-family="system-ui,sans-serif">?</text>' +
          '<text x="104" y="20" font-size="15" font-weight="900" fill="' + INK + '" font-family="system-ui,sans-serif" transform="rotate(14 108 16)">?</text>';
      case 'internal': // a tiny screaming face in a thought bubble
        return '<circle cx="84" cy="40" r="2.5" fill="#fff" ' + THIN + '/><circle cx="90" cy="31" r="3.5" fill="#fff" ' + THIN + '/>' +
          '<ellipse cx="104" cy="16" rx="15" ry="13" fill="#fff" ' + THIN + '/>' +
          '<circle cx="99" cy="12" r="2.6" fill="#fff" stroke="' + INK + '" stroke-width="1.8"/><circle cx="109" cy="12" r="2.6" fill="#fff" stroke="' + INK + '" stroke-width="1.8"/>' +
          '<ellipse cx="104" cy="21" rx="3" ry="4.5" fill="' + INK + '"/>' +
          '<path d="M90 8 l-3 -3 M118 8 l3 -3" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"/>';
      case 'mindBlown':
        return '<g stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"><path d="M60 4 V-6 M40 8 L32 0 M80 8 L88 0 M24 20 L14 16 M96 20 L106 16"/></g>' +
          '<rect x="30" y="2" width="6" height="6" fill="#5CC9A7" stroke="' + INK + '" stroke-width="1.5" transform="rotate(20 33 5)"/>' +
          '<rect x="84" y="6" width="6" height="6" fill="#F38BB4" stroke="' + INK + '" stroke-width="1.5" transform="rotate(-25 87 9)"/>' +
          '<rect x="58" y="-2" width="6" height="6" fill="#FFC83D" stroke="' + INK + '" stroke-width="1.5" transform="rotate(40 61 1)"/>' +
          '<circle cx="18" cy="8" r="3" fill="#6BB7F2" stroke="' + INK + '" stroke-width="1.5"/><circle cx="104" cy="6" r="3" fill="#FFC83D" stroke="' + INK + '" stroke-width="1.5"/>';
      case 'loading': { // spinner: 8 dashes, fading
        var s = '<circle cx="104" cy="16" r="15" fill="#fff" ' + THIN + '/>';
        for (var i = 0; i < 8; i++) {
          var a = i * Math.PI / 4, x1 = 104 + Math.cos(a) * 5, y1 = 16 + Math.sin(a) * 5, x2 = 104 + Math.cos(a) * 10, y2 = 16 + Math.sin(a) * 10;
          s += '<path d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round" opacity="' + (0.2 + i * 0.1).toFixed(1) + '"/>';
        }
        return s;
      }
    }
    return '';
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
    return '<svg viewBox="0 0 120 120" overflow="visible" aria-hidden="true">' + (f ? f(expr || 'happy') + overlay(expr) : '') + '</svg>';
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
    'c1-03-p4': { bg: 'kitchen', chars: [['king', 'worried', 98, 30, 58], ['bobo', 'sleepy', 2, 36, 52]], props: [['_drawer', 58, 46, 0.44, 0]], fx: [['clang', 64, 40, 0.9], ['motion', 60, 70, 0.8]] },
    // ---- meme-format panels, one per day (R3) ----
    'c1-01-meme': { raw: povPanel },
    'c1-02-meme': { raw: starterPackPanel },
    'c1-03-meme': { raw: tierListPanel }
  };

  function txt(x, y, size, s, color) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" font-weight="900" fill="' + (color || INK) + '" font-family="system-ui,sans-serif" text-anchor="middle">' + s + '</text>';
  }
  function mini(who, expr, x, y, size) { return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" viewBox="0 0 120 120" overflow="visible">' + CHARS[who](expr) + overlay(expr) + '</svg>'; }

  // POV: you are the crown, looking up out of the soup
  function povPanel() {
    return '<rect width="160" height="100" fill="#7C8798"/>' +
      '<ellipse cx="80" cy="56" rx="74" ry="52" fill="#B5D86A" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="40" cy="74" r="4" fill="#9CC456"/><circle cx="122" cy="80" r="5" fill="#9CC456"/><circle cx="108" cy="40" r="3" fill="#9CC456"/><circle cx="56" cy="36" r="3" fill="#9CC456"/>' +
      mini('king', 'shocked', 22, -10, 58) + mini('bobo', 'laughing', 84, -12, 56) +
      '<g transform="translate(80 70) rotate(-10)">' + B.crown(0, 0, 1.6) + '</g>' +
      '<path d="M62 64 q-3 4 0 6 q3 -2 0 -6 Z M98 62 q-3 4 0 6 q3 -2 0 -6 Z" fill="#9FD8F5" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<path d="M58 92 q4 -6 0 -12 M80 96 q4 -6 0 -12 M102 92 q4 -6 0 -12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="4" y="80" width="38" height="16" rx="5" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>' + txt(23, 92, 11, 'POV:');
  }
  // Starter pack: title, then 4 sad things in a row
  function starterPackPanel() {
    function slot(x, inner, label) {
      return '<rect x="' + x + '" y="20" width="36" height="52" rx="5" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' + inner + txt(x + 18, 68, 6.5, label);
    }
    var wind = '<g stroke="#6BB7F2" stroke-width="2.5" stroke-linecap="round" fill="none"><path d="M88 32 q10 -4 18 0 M86 42 q12 -4 22 0 M90 52 q8 -3 14 0"/></g>';
    var scarf = '<path d="M124 32 h28 v8 h-28 Z M144 40 v18 h-7 v-18" fill="#F26B6B" stroke="' + INK + '" stroke-width="2"/><path d="M128 32 v8 M134 32 v8 M140 32 v8" stroke="#fff" stroke-width="1.5"/>' +
      txt(138, 30, 5, 'tiny');
    return '<rect width="160" height="100" fill="#E8F3FB"/>' + txt(80, 13, 10.5, 'COLD EGG STARTER PACK') +
      slot(4, prop('sock', 6, 24, 0.32, 0), 'one sock') +
      slot(42, prop('egg', 44, 24, 0.32, 0), 'sad face') +
      slot(80, wind, 'a draught') +
      slot(118, scarf, 'tiny scarf') +
      '<path d="M0 82 H160" stroke="' + INK + '" stroke-width="2"/><rect x="0" y="82" width="160" height="18" fill="#F3E3C3"/>' + txt(80, 94, 7, 'collect them all (please don’t)');
  }
  // Tier list: every spoon is S tier; the golden ladle gets its own row above S
  function tierListPanel() {
    var rows = [['S+', '#FFC83D'], ['S', '#F38BB4'], ['A', '#FFB36B'], ['B', '#FFE27A'], ['F', '#9AA3B5']], out = '<rect width="160" height="100" fill="#3B2440"/>';
    rows.forEach(function (r, i) {
      var y = 3 + i * 19;
      out += '<rect x="3" y="' + y + '" width="22" height="17" fill="' + r[1] + '" stroke="' + INK + '" stroke-width="1.5"/>' + txt(14, y + 12.5, 10, r[0]) +
        '<rect x="26" y="' + y + '" width="131" height="17" fill="#4A3352"/>';
    });
    out += prop('goldenLadle', 28, 3, 0.17, 0) + txt(80, 15, 7, 'too good for this list', '#FFE27A');
    for (var k = 0; k < 7; k++) out += prop('spoon', 28 + k * 17, 22, 0.17, 0);
    out += mini('bobo', 'proud', 112, 52, 44) + txt(84, 75, 7, 'no notes', '#fff');
    return out;
  }

  // ---- small meme pictures for the results and stuck screens (R3) ----
  // Brain ladder: 1 = small brain, 2 = glowing brain, 3 = galaxy brain; lit = earned
  function brainSVG(n, lit) {
    var brain = function (fill, line) {
      return '<path d="M26 58 Q14 54 18 42 Q12 30 26 26 Q28 14 42 16 Q50 8 60 16 Q74 12 78 26 Q90 28 86 42 Q92 54 80 60 Q78 72 64 70 Q56 78 46 70 Q30 74 26 58 Z" fill="' + fill + '" ' + W + '/>' +
        '<path d="M50 20 Q46 34 54 44 Q48 54 52 66 M30 40 Q38 38 42 46 M72 36 Q64 40 66 50" fill="none" stroke="' + line + '" stroke-width="3" stroke-linecap="round"/>';
    };
    var s = '';
    if (n === 1) s = '<g transform="translate(50 50) scale(.62) translate(-52 -44)">' + brain('#FFB6CE', '#F38BB4') + '</g>';
    if (n === 2) s = '<circle cx="50" cy="46" r="40" fill="#FFE27A" opacity=".55"/>' + '<g transform="translate(50 50) scale(.8) translate(-52 -44)">' + brain('#FF9EC4', '#E26D9E') + '</g>' +
      B.sparkle(84, 16, 0.9) + B.sparkle(14, 74, 0.7);
    if (n === 3) s = '<circle cx="50" cy="48" r="46" fill="#2E3A78" ' + THIN + '/>' + '<g transform="translate(50 50) scale(.92) translate(-52 -44)">' + brain('#B9A2F2', '#7F6AD6') + '</g>' +
      '<circle cx="50" cy="46" r="30" fill="#FFE27A" opacity=".25"/>' + B.sparkle(18, 22, 0.8) + B.sparkle(84, 20, 1) + B.sparkle(80, 80, 0.7) +
      '<circle cx="24" cy="78" r="1.8" fill="#fff"/><circle cx="68" cy="12" r="1.6" fill="#fff"/><circle cx="92" cy="56" r="1.6" fill="#fff"/>';
    return '<svg viewBox="0 0 100 100" overflow="visible" aria-hidden="true"' + (lit ? '' : ' style="filter:grayscale(1);opacity:.28"') + '>' + s + '</svg>';
  }
  // Expectation vs reality: a tidy board, then the real one
  function planSVG(real) {
    var out = '<rect x="2" y="2" width="96" height="96" rx="10" fill="#F3E3C3" stroke="' + INK + '" stroke-width="3"/>';
    if (!real) {
      for (var i = 0; i < 3; i++) out += prop('spoon', 8 + i * 29, 10, 0.26, 0) + prop('egg', 8 + i * 29, 60, 0.26, 0);
      out += B.sparkle(50, 50, 0.9);
    } else {
      var spots = [[6, 6, -40], [40, 2, 20], [66, 14, 70], [14, 34, 110], [50, 30, -10], [70, 50, 150], [4, 64, 30], [36, 62, -80], [60, 72, 200]];
      spots.forEach(function (p) { out += prop('spoon', p[0], p[1], 0.26, p[2]); });
      out += FX.clang(18, 56, 1.2);
    }
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + out + '</svg>';
  }
  // Little icons used inside pop-up bubbles
  var ICONS = {
    stonks: '<svg viewBox="0 0 30 24" aria-hidden="true"><path d="M2 20 L10 12 L15 16 L26 4" fill="none" stroke="#2FA84F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 3 H27 V11" fill="none" stroke="#2FA84F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cap: '<svg viewBox="0 0 30 24" aria-hidden="true"><path d="M4 16 Q4 4 15 4 Q26 4 26 16 Z" fill="#6BB7F2" stroke="' + INK + '" stroke-width="2.5"/><path d="M16 16 H29" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><circle cx="15" cy="4" r="2" fill="' + INK + '"/></svg>',
    brain: '<svg viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(50 50) scale(.9) translate(-52 -44)"><path d="M26 58 Q14 54 18 42 Q12 30 26 26 Q28 14 42 16 Q50 8 60 16 Q74 12 78 26 Q90 28 86 42 Q92 54 80 60 Q78 72 64 70 Q56 78 46 70 Q30 74 26 58 Z" fill="#FF9EC4" ' + W + '/></g></svg>'
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
    if (p.raw) return '<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + p.raw() + '</svg>';
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
  MYF.Art.brainSVG = brainSVG;
  MYF.Art.planSVG = planSVG;
  MYF.Art.ICONS = ICONS;
})();
