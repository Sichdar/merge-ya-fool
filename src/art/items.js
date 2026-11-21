// P0 item and generator art, drawn in SVG code (sticker-book style, Phase 6).
// Every drawing uses a 100 x 100 box. Tier sets the size (65% -> 90%) and the gold dots.
(function () {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  var INK = '#3B2440', W = 'stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"';
  var THIN = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';

  function dot(x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3.4) + '" fill="' + INK + '"/>'; }
  function shine(x, y, rx, ry) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" opacity=".8"/>'; }
  function smile(x, y, w) { return '<path d="M' + (x - w) + ' ' + y + ' Q' + x + ' ' + (y + w * 0.9) + ' ' + (x + w) + ' ' + y + '" fill="none" ' + THIN + '/>'; }
  function frown(x, y, w) { return '<path d="M' + (x - w) + ' ' + (y + w * 0.6) + ' Q' + x + ' ' + (y - w * 0.3) + ' ' + (x + w) + ' ' + (y + w * 0.6) + '" fill="none" ' + THIN + '/>'; }
  function happyEyes(x1, x2, y) { return '<path d="M' + (x1 - 4) + ' ' + (y + 2) + ' Q' + x1 + ' ' + (y - 4) + ' ' + (x1 + 4) + ' ' + (y + 2) + ' M' + (x2 - 4) + ' ' + (y + 2) + ' Q' + x2 + ' ' + (y - 4) + ' ' + (x2 + 4) + ' ' + (y + 2) + '" fill="none" ' + THIN + '/>'; }
  function bigEyes(x1, x2, y, r) { r = r || 7; return '<circle cx="' + x1 + '" cy="' + y + '" r="' + r + '" fill="#fff" ' + THIN + '/><circle cx="' + x2 + '" cy="' + y + '" r="' + r + '" fill="#fff" ' + THIN + '/>' + dot(x1, y + 1, r * 0.38) + dot(x2, y + 1, r * 0.38); }
  function beak(x, y) { return '<path d="M' + (x - 5) + ' ' + y + ' L' + (x + 5) + ' ' + y + ' L' + x + ' ' + (y + 7) + ' Z" fill="#FF9A3C" ' + THIN + '/>'; }
  function crown(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M-12 6 L-13 -8 L-6 -2 L0 -11 L6 -2 L13 -8 L12 6 Z" fill="#FFC83D" ' + THIN + '/>' +
      '<circle cx="0" cy="1" r="2.4" fill="#F26B8A"/></g>';
  }
  function sparkle(x, y, s) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')" d="M0 -8 Q1.5 -1.5 8 0 Q1.5 1.5 0 8 Q-1.5 1.5 -8 0 Q-1.5 -1.5 0 -8 Z" fill="#FFC83D" stroke="' + INK + '" stroke-width="2"/>';
  }
  function heart(x, y, s, fill) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')" d="M0 6 C-10 -1 -7 -9 0 -4 C7 -9 10 -1 0 6 Z" fill="' + (fill || '#F26B8A') + '" stroke="' + INK + '" stroke-width="2.4"/>';
  }

  // --- Egg family ---
  function eggShape(fill) { return '<ellipse cx="50" cy="55" rx="28" ry="35" fill="' + (fill || '#FFF3D6') + '" ' + W + '/>' + shine(39, 38, 6, 9); }
  function chickBody(cx, cy, r) {
    return '<path d="M' + (cx - 8) + ' ' + (cy + r - 2) + ' l-3 7 M' + (cx + 8) + ' ' + (cy + r - 2) + ' l3 7" ' + THIN + ' fill="none"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#FFD95A" ' + W + '/>' +
      '<path d="M' + (cx - 3) + ' ' + (cy - r + 1) + ' q3 -9 7 -2" fill="#FFD95A" ' + THIN + '/>' +
      shine(cx - r * 0.45, cy - r * 0.45, 4, 6) +
      '<path d="M' + (cx + r - 9) + ' ' + (cy + 4) + ' q10 4 4 12 q-7 -2 -4 -12 Z" fill="#F5C030" ' + THIN + '/>';
  }
  var ART = {};
  ART.egg = function () {
    return eggShape() +
      '<path d="M36 50 l8 -2 M56 48 l8 2" ' + THIN + '/>' + dot(41, 55) + dot(59, 55) +
      '<path d="M37 70 Q43 62 50 67 Q57 62 63 70 Q57 73 50 69 Q43 73 37 70 Z" fill="' + INK + '"/>';
  };
  ART.hatchling = function () {
    return '<circle cx="50" cy="44" r="23" fill="#FFD95A" ' + W + '/>' + shine(41, 33, 4, 6) +
      bigEyes(41, 59, 40, 8) + beak(50, 50) +
      '<path d="M45 22 q4 -10 8 -1" fill="#FFD95A" ' + THIN + '/>' +
      '<path d="M20 56 L29 47 L37 57 L45 46 L54 57 L62 47 L71 57 L80 50 Q83 90 50 92 Q18 90 20 56 Z" fill="#FFF3D6" ' + W + '/>' +
      '<path d="M30 70 l6 4 l-3 6" fill="none" ' + THIN + '/>';
  };
  ART.chick = function () {
    return chickBody(46, 54, 30) +
      // 3D glasses
      '<path d="M22 44 H72" ' + THIN + '/>' +
      '<rect x="26" y="39" width="17" height="12" rx="3" fill="#F26B6B" ' + THIN + '/>' +
      '<rect x="48" y="39" width="17" height="12" rx="3" fill="#6BB7F2" ' + THIN + '/>' +
      beak(46, 55) + smile(46, 66, 5) +
      // popcorn
      '<path d="M66 70 L88 70 L84 94 L70 94 Z" fill="#fff" ' + THIN + '/>' +
      '<path d="M71 70 L73 94 M77 70 L77 94 M83 70 L81 94" stroke="#F26B6B" stroke-width="2.5"/>' +
      '<circle cx="70" cy="68" r="4.5" fill="#FFF7D6" ' + THIN + '/><circle cx="78" cy="65" r="5" fill="#FFF7D6" ' + THIN + '/><circle cx="85" cy="68" r="4.5" fill="#FFF7D6" ' + THIN + '/>';
  };
  function henBody(fill) {
    return '<path d="M74 40 L90 30 L86 46 L94 50 L80 56 Z" fill="' + fill + '" ' + W + '/>' +
      '<path d="M30 36 Q30 18 46 18 Q62 18 62 36 Q84 44 80 66 Q76 90 50 90 Q22 90 20 68 Q18 50 30 36 Z" fill="' + fill + '" ' + W + '/>' +
      '<path d="M36 19 q2 -12 9 -6 q4 -10 10 -1 q7 -6 7 6" fill="#F26B6B" ' + THIN + '/>' +
      '<path d="M50 62 q14 2 18 12 q-12 6 -20 -4" fill="#EDE3D3" ' + THIN + '/>' +
      shine(36, 30, 4, 7) + beak(28, 37) + '<path d="M28 44 q-4 6 1 9 q4 -3 -1 -9" fill="#F26B6B" ' + THIN + '/>' +
      '<path d="M40 90 l-3 6 M58 90 l3 6" ' + THIN + '/>';
  }
  ART.hen = function () {
    return henBody('#FFFFFF') +
      // pixel "deal with it" shades
      '<path d="M22 30 H64 V34 H60 V39 H54 V34 H46 V39 H40 V34 H32 V39 H26 V34 H22 Z" fill="' + INK + '"/>' +
      '<rect x="28" y="31" width="3" height="3" fill="#fff"/><rect x="48" y="31" width="3" height="3" fill="#fff"/>' +
      smile(36, 48, 4);
  };
  ART.queenHen = function () {
    return '<path d="M26 40 Q10 70 20 94 L82 94 Q92 70 76 40 Z" fill="#9C6ADE" ' + W + '/>' +
      '<path d="M22 92 H80" stroke="#fff" stroke-width="5"/>' +
      henBody('#FFFFFF') + crown(46, 12, 1.1) +
      happyEyes(34, 46, 30) + smile(38, 46, 3) +
      '<path d="M84 56 L84 90" stroke="#FFC83D" stroke-width="5" stroke-linecap="round"/><ellipse cx="84" cy="52" rx="6" ry="8" fill="#FFC83D" ' + THIN + '/>' +
      sparkle(14, 20, 0.9);
  };

  // --- Spoon family ---
  function spoon(x, y, s, face) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect x="-6" y="14" width="12" height="44" rx="6" fill="#8FB3DA" ' + W + '/>' +
      '<ellipse cx="0" cy="-6" rx="22" ry="25" fill="#C2DAF2" ' + W + '/>' + shine(-9, -16, 5, 8) +
      (face || '') + '</g>';
  }
  ART.spoon = function () {
    return '<rect x="56" y="52" width="34" height="26" rx="9" fill="#FFB6CE" ' + W + '/><path d="M62 60 h22 M62 68 h18" stroke="#F38BB4" stroke-width="3"/>' +
      spoon(44, 42, 1, happyEyes(-7, 7, -6) + smile(0, 3, 4)) +
      '<path d="M56 50 q8 6 6 14" fill="none" stroke="#8FB3DA" stroke-width="7" stroke-linecap="round"/><path d="M56 50 q8 6 6 14" fill="none" ' + THIN + '/>';
  };
  ART.bigSpoon = function () {
    return spoon(44, 38, 1.15, dot(-7, -8) + dot(7, -8) + smile(0, 2, 5)) +
      spoon(62, 62, 0.55, happyEyes(-7, 7, -6) + smile(0, 3, 4)) +
      '<path d="M30 58 q14 14 30 6" fill="none" stroke="#8FB3DA" stroke-width="8" stroke-linecap="round"/><path d="M30 58 q14 14 30 6" fill="none" ' + THIN + '/>' +
      heart(80, 28, 0.9);
  };
  function ladleShape(metal, inside, extra) {
    return '<path d="M58 54 Q62 30 72 16 Q76 10 82 14" fill="none" stroke="' + INK + '" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M58 54 Q62 30 72 16 Q76 10 82 14" fill="none" stroke="' + metal + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M18 52 H82 Q82 90 50 90 Q18 90 18 52 Z" fill="' + metal + '" ' + W + '/>' +
      '<ellipse cx="50" cy="52" rx="32" ry="9" fill="' + inside + '" ' + W + '/>' + (extra || '');
  }
  ART.ladle = function () {
    return ladleShape('#A9C6E6', '#2E3A78',
      '<path d="M40 50 q-2 -8 6 -8 q2 -5 8 -2 q7 -2 7 5 q4 4 -2 7 Z" fill="#FF9EC4" ' + THIN + '/>' +
      '<path d="M47 44 q2 3 0 6 M54 43 q-2 3 1 6" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
      sparkle(30, 52, 0.45) + sparkle(70, 51, 0.4) + '<circle cx="62" cy="55" r="1.6" fill="#fff"/><circle cx="36" cy="55" r="1.4" fill="#fff"/>' +
      '<circle cx="50" cy="44" r="16" fill="#FFE27A" opacity=".35"/>' +
      dot(40, 70) + dot(60, 70) + '<path d="M44 78 q6 5 12 0" fill="none" ' + THIN + '/>');
  };
  ART.goldenLadle = function () {
    return ladleShape('#FFC83D', '#FFE9A6',
      '<path d="M37 69 h8 M55 69 h8" ' + THIN + '/>' + dot(41, 72, 2.6) + dot(59, 72, 2.6) +
      '<path d="M44 80 q8 2 13 -4" fill="none" ' + THIN + '/>' + shine(28, 62, 3, 6) +
      // its shine is a little stonks arrow (R3)
      '<path d="M24 86 L30 79 L34 82 L40 74" fill="none" stroke="#2FA84F" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 74 H40 V78" fill="none" stroke="#2FA84F" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>') +
      crown(84, 8, 0.75) + sparkle(14, 30, 1) + sparkle(90, 44, 0.7);
  };

  // Meme gags (R3): extra bits shown on the big long-press card only, where there is room to read them
  function tag(x, y, w, text, rot) {
    return '<g transform="rotate(' + (rot || 0) + ' ' + x + ' ' + y + ')"><rect x="' + (x - w / 2) + '" y="' + (y - 7) + '" width="' + w + '" height="13" rx="4" fill="#fff" ' + THIN + '/>' +
      '<text x="' + x + '" y="' + (y + 3) + '" font-size="9" font-weight="900" fill="' + INK + '" text-anchor="middle" font-family="system-ui,sans-serif">' + text + '</text></g>';
  }
  function think(x, y, w, text) {
    return '<circle cx="' + (x - w / 2 + 2) + '" cy="' + (y + 12) + '" r="2" fill="#fff" ' + THIN + '/>' +
      '<rect x="' + (x - w / 2) + '" y="' + (y - 8) + '" width="' + w + '" height="15" rx="7" fill="#fff" ' + THIN + '/>' +
      '<text x="' + x + '" y="' + (y + 3) + '" font-size="9" font-weight="900" fill="' + INK + '" text-anchor="middle" font-family="system-ui,sans-serif">' + text + '</text>';
  }
  var GAG = {
    hatchling: function () { return tag(30, 82, 40, 'I’m baby', -8); },
    chick: function () { return think(26, 12, 46, 'plot twist?'); },
    sock: function () { return think(24, 10, 30, 'sus?'); }
  };

  // --- Thread family ---
  ART.thread = function () {
    return '<path d="M30 14 Q30 6 40 6 Q50 6 50 14" fill="none" stroke="#9AA3B5" stroke-width="7" stroke-linecap="round"/><path d="M30 14 Q30 6 40 6 Q50 6 50 14" fill="none" ' + THIN + '/>' +
      '<path d="M50 14 Q58 26 46 36 Q36 46 50 56" fill="none" stroke="#F38BB4" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="50" cy="72" r="20" fill="#F38BB4" ' + W + '/>' +
      '<path d="M34 66 Q50 58 66 70 M36 78 Q50 70 64 82" fill="none" stroke="#C9567F" stroke-width="3"/>' +
      dot(43, 70, 3) + dot(57, 70, 3) + '<path d="M43 80 q3.5 -3 7 0 q3.5 3 7 0" fill="none" ' + THIN + '/>' +
      '<path d="M72 54 q4 6 0 9 q-4 -3 0 -9 Z" fill="#9FD8F5" ' + THIN + '/>';
  };
  function sockPath(fill, flip) {
    var g = '<g' + (flip ? ' transform="translate(100 0) scale(-1 1)"' : '') + '>';
    return g + '<path d="M34 16 H62 V56 Q62 62 68 65 L80 70 Q92 76 86 87 Q81 94 68 91 L42 84 Q31 80 33 68 Z" fill="' + fill + '" ' + W + '/>' +
      '<path d="M34 28 H62" ' + THIN + '/><path d="M37 21 V27 M44 21 V27 M51 21 V27 M58 21 V27" stroke="' + INK + '" stroke-width="2"/></g>';
  }
  ART.sock = function () {
    return '<rect x="58" y="8" width="32" height="28" rx="3" fill="#CFE8F7" ' + THIN + '/><path d="M74 8 V36 M58 22 H90" ' + THIN + '/>' +
      sockPath('#F38BB4') + '<path d="M40 47 l6 2 M56 49 l6 -2" ' + THIN + '/>' + dot(43, 53) + dot(57, 53) + frown(50, 63, 5) +
      '<path d="M41 58 q-2 5 0 7 q2 -2 0 -7 Z" fill="#9FD8F5" stroke="' + INK + '" stroke-width="1.5"/>';
  };
  ART.socks = function () {
    return '<g transform="translate(-14 10) scale(.82)">' + sockPath('#F38BB4', true) + happyEyes(43, 57, 50) + smile(50, 58, 4) + '</g>' +
      '<g transform="translate(32 10) scale(.82)">' + sockPath('#C9567F') + happyEyes(43, 57, 50) + smile(50, 58, 4) + '</g>' +
      '<path d="M44 50 q6 -4 12 0" fill="none" stroke="#F38BB4" stroke-width="7" stroke-linecap="round"/><path d="M44 50 q6 -4 12 0" fill="none" ' + THIN + '/>' +
      heart(50, 18, 1.2) + heart(30, 10, 0.6) + heart(72, 10, 0.6);
  };
  ART.sweater = function () {
    return '<path d="M30 22 L18 32 L12 60 L24 62 L28 46 L28 86 H72 V46 L76 62 L88 60 L82 32 L70 22 Q50 32 30 22 Z" fill="#F38BB4" ' + W + '/>' +
      '<path d="M28 80 H72" stroke="#C9567F" stroke-width="4"/>' +
      '<path d="M18 60 Q50 76 82 60" fill="none" stroke="#F38BB4" stroke-width="9" stroke-linecap="round"/>' +
      '<circle cx="50" cy="68" r="7" fill="#F38BB4" ' + THIN + '/>' +
      dot(42, 42) + dot(58, 42) + '<path d="M44 52 h12" ' + THIN + '/>' +
      '<text x="70" y="20" font-size="22" font-weight="800" fill="' + INK + '" font-family="system-ui,sans-serif">?</text>';
  };
  ART.royalCape = function () {
    return '<path d="M38 18 Q20 50 14 92 Q50 84 90 94 Q74 52 62 18 Z" fill="#D9405E" ' + W + '/>' +
      '<path d="M30 40 Q40 60 34 88 M66 40 Q62 64 74 90" fill="none" stroke="#B02E4C" stroke-width="3"/>' +
      '<path d="M32 18 Q50 30 68 18 Q66 30 50 32 Q34 30 32 18 Z" fill="#fff" ' + THIN + '/>' +
      '<circle cx="42" cy="24" r="1.6" fill="' + INK + '"/><circle cx="56" cy="25" r="1.6" fill="' + INK + '"/>' +
      '<circle cx="50" cy="34" r="6" fill="#FFC83D" ' + THIN + '/>' +
      '<path d="M88 30 q-10 2 -14 8 M92 44 q-10 0 -14 5" fill="none" stroke="#9AA3B5" stroke-width="2.5" stroke-dasharray="3 4"/>' +
      sparkle(84, 16, 0.8);
  };

  // --- Combos ---
  ART.braveChick = function () {
    return '<g transform="rotate(-30 70 40)"><rect x="66" y="10" width="7" height="48" rx="3.5" fill="#A9C6E6" ' + THIN + '/>' +
      '<path d="M58 6 Q70 -4 82 6 Q80 16 70 16 Q60 16 58 6 Z" fill="#A9C6E6" ' + THIN + '/></g>' +
      crown(78, 4, 0.6) +
      chickBody(44, 60, 28) +
      '<path d="M26 46 Q44 38 62 46 L60 52 Q44 46 28 52 Z" fill="#F26B6B" ' + THIN + '/>' +
      '<path d="M33 54 l7 3 M55 54 l-7 3" ' + THIN + '/>' + dot(37, 59) + dot(51, 59) + beak(44, 63) +
      '<path d="M38 74 q6 4 12 0" fill="none" ' + THIN + '/>' +
      '<path d="M66 62 Q74 52 70 40" fill="none" stroke="#F5C030" stroke-width="8" stroke-linecap="round"/><path d="M66 62 Q74 52 70 40" fill="none" ' + THIN + '/>';
  };
  ART.cosyEgg = function () {
    return eggShape() +
      '<path d="M22 58 Q50 50 78 58 L78 66 Q78 90 50 90 Q22 90 22 66 Z" fill="#F38BB4" ' + W + '/>' +
      '<path d="M22 64 Q50 56 78 64" fill="none" stroke="#C9567F" stroke-width="3"/><path d="M30 74 h40 M34 82 h32" stroke="#C9567F" stroke-width="2.5" stroke-dasharray="4 4"/>' +
      happyEyes(41, 59, 42) + smile(50, 48, 4) +
      '<circle cx="34" cy="48" r="3.5" fill="#F38BB4" opacity=".7"/><circle cx="66" cy="48" r="3.5" fill="#F38BB4" opacity=".7"/>' +
      '<path d="M14 30 q4 -6 0 -12 M86 30 q4 -6 0 -12 M20 14 q3 -4 0 -8" fill="none" stroke="#F5A05A" stroke-width="3" stroke-linecap="round"/>';
  };

  // --- Generators (fill the whole cell) ---
  var GEN = {};
  GEN.spoonDrawer = function () {
    return '<g transform="rotate(-14 30 40)">' + spoon(30, 40, 0.5) + '</g>' + spoon(50, 34, 0.5) + '<g transform="rotate(16 70 40)">' + spoon(70, 40, 0.5) + '</g>' +
      '<rect x="10" y="48" width="80" height="42" rx="7" fill="#C98B55" ' + W + '/>' +
      '<rect x="18" y="56" width="64" height="26" rx="5" fill="#B07440" ' + THIN + '/>' +
      '<rect x="40" y="64" width="20" height="8" rx="4" fill="#FFC83D" ' + THIN + '/>' +
      '<path d="M8 30 l-6 -4 M8 40 h-7 M92 30 l6 -4 M92 40 h7" ' + THIN + '/>';
  };
  GEN.eggBasket = function () {
    function swirl(x, y) { return '<path d="M' + x + ' ' + y + ' m0 -1 a2 2 0 1 1 -2 2 a4 4 0 1 1 4 -4 a6 6 0 1 1 -6 6" fill="none" ' + THIN + '/>'; }
    return '<path d="M26 46 Q50 4 74 46" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linecap="round"/><path d="M26 46 Q50 4 74 46" fill="none" stroke="#D99A5E" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="38" cy="44" rx="10" ry="12" fill="#FFF3D6" ' + THIN + '/><ellipse cx="60" cy="42" rx="10" ry="12" fill="#FFF3D6" ' + THIN + '/>' +
      '<path d="M12 46 H88 L80 88 Q79 92 74 92 H26 Q21 92 20 88 Z" fill="#D99A5E" ' + W + '/>' +
      '<path d="M18 58 H82 M21 74 H79" stroke="#B07440" stroke-width="3"/>' +
      '<circle cx="38" cy="66" r="9" fill="#fff" ' + THIN + '/><circle cx="62" cy="66" r="9" fill="#fff" ' + THIN + '/>' + swirl(38, 66) + swirl(62, 66) +
      '<path d="M44 82 q6 -4 12 0" fill="none" ' + THIN + '/>';
  };
  GEN.threadSpool = function () {
    return '<rect x="20" y="30" width="44" height="52" rx="6" fill="#F38BB4" ' + W + '/>' +
      '<path d="M22 44 H62 M22 56 H62 M22 68 H62" stroke="#C9567F" stroke-width="3"/>' +
      '<rect x="12" y="22" width="60" height="12" rx="6" fill="#D9A877" ' + W + '/>' +
      '<rect x="12" y="78" width="60" height="12" rx="6" fill="#D9A877" ' + W + '/>' +
      dot(34, 50, 3) + dot(50, 50, 3) + '<path d="M36 60 q6 6 12 0" fill="none" ' + THIN + '/>' +
      '<path d="M62 6 H94 Q98 6 98 10 V24 Q98 28 94 28 H76 L68 36 L70 28 H62 Q58 28 58 24 V10 Q58 6 62 6 Z" fill="#fff" ' + THIN + '/>' +
      dot(68, 17, 2.4) + dot(78, 17, 2.4) + dot(88, 17, 2.4);
  };

  var SCALE = [0.9, 0.8, 0.86, 0.92, 0.96, 0.98];
  var TIERCOL = '#FFC83D';

  // itemSVG(id, opts): opts.dots (default true) shows tier dots; opts.raw gives just the inner drawing
  function itemSVG(id, opts) {
    opts = opts || {};
    var info = MYF.Rules.ITEMS[id], draw = ART[id];
    if (!info || !draw) return '';
    var tier = info.tier, s = info.combo ? 0.98 : (SCALE[tier] || 0.96);
    if (info.top && !info.combo) s = 1;
    var body = '<g transform="translate(50 52) scale(' + s + ') translate(-50 -52)">' + draw() + '</g>' + (opts.gag && GAG[id] ? GAG[id]() : '');
    if (opts.raw) return body;
    var dots = '';
    if (opts.dots !== false) {
      if (info.combo) dots = sparkle(90, 10, 0.9);
      else for (var i = 0; i < tier; i++) dots += '<circle cx="' + (91 - i * 9) + '" cy="9" r="4" fill="' + TIERCOL + '" stroke="' + INK + '" stroke-width="2"/>';
    }
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + body + dots + '</svg>';
  }
  function genSVG(gen) {
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(50 50) scale(.92) translate(-50 -50)">' + (GEN[gen] ? GEN[gen]() : '') + '</g></svg>';
  }

  MYF.Art = MYF.Art || {};
  MYF.Art.itemSVG = itemSVG;
  MYF.Art.genSVG = genSVG;
  MYF.Art.itemInner = function (id) { var d = ART[id]; return d ? d() : ''; };
  MYF.Art.genInner = function (g) { return GEN[g] ? GEN[g]() : ''; };
  MYF.Art.bits = { dot: dot, smile: smile, frown: frown, happyEyes: happyEyes, bigEyes: bigEyes, beak: beak, crown: crown, sparkle: sparkle, heart: heart, shine: shine, chickBody: chickBody, INK: INK, W: W, THIN: THIN };
})();
