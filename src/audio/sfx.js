// Sound effects made in code (Web Audio). No sound files. Starts on the first tap (browsers require it).
(function () {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  var ctx = null, master = null, on = true;
  var SCALE = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5]; // C major, one step per tier

  function unlock() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.35; master.connect(ctx.destination);
      // iPhone: play one silent buffer inside the tap so later sounds are allowed
      var b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(master); s.start(0);
    } catch (e) { ctx = null; }
  }

  function tone(freq, start, dur, type, vol, slideTo) {
    if (!ctx || !on) return;
    var t = ctx.currentTime + (start || 0);
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.5, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  var S = {
    spawn: function () { tone(880, 0, 0.09, 'sine', 0.35, 1320); },
    pick: function () { tone(600, 0, 0.05, 'triangle', 0.18); },
    merge: function (tier) { var f = SCALE[Math.min(SCALE.length - 1, Math.max(0, (tier || 2) - 1))]; tone(f, 0, 0.16, 'triangle', 0.5); tone(f * 2, 0.04, 0.14, 'sine', 0.2); },
    combo: function () { [0, 2, 4, 7].forEach(function (s, i) { tone(SCALE[Math.min(7, s)] , i * 0.07, 0.22, 'triangle', 0.45); }); },
    move: function () { tone(320, 0, 0.08, 'sine', 0.2, 220); },
    swap: function () { tone(260, 0, 0.12, 'sawtooth', 0.08, 520); },
    boing: function () { tone(180, 0, 0.28, 'sine', 0.45, 90); },
    deliver: function () { tone(659, 0, 0.12, 'triangle', 0.4); tone(988, 0.08, 0.2, 'triangle', 0.4); },
    uhoh: function () { tone(440, 0, 0.16, 'triangle', 0.35); tone(330, 0.17, 0.25, 'triangle', 0.35); },
    page: function () { tone(1400, 0, 0.05, 'sine', 0.12, 700); },
    star: function (i) { tone(SCALE[4 + Math.min(i, 3)] || 1046, 0, 0.3, 'sine', 0.4); },
    win: function () { [0, 2, 4, 7, 4, 7].forEach(function (s, i) { tone(SCALE[s], i * 0.09, 0.25, 'triangle', 0.4); }); }
  };

  MYF.Sfx = {
    unlock: unlock,
    play: function (name, arg) { try { if (S[name]) S[name](arg); } catch (e) { /* sound is never worth a crash */ } },
    setOn: function (v) { on = !!v; },
    isOn: function () { return on; }
  };
})();
