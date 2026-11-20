// Save on the phone only (localStorage). One JSON record with a version number, upgraded step by step.
(function () {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  var KEY = 'myf-save';
  var VERSION = 1;

  function blank() { return { saveVersion: VERSION, levels: {}, current: null, sound: true, seenIntro: false }; }

  // One small function per old version, so old saves keep working after updates.
  var UPGRADES = {
    // 1: function (s) { ...; s.saveVersion = 2; return s; }
  };

  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') return blank();
    while (s.saveVersion < VERSION && UPGRADES[s.saveVersion]) s = UPGRADES[s.saveVersion](s);
    if (s.saveVersion !== VERSION) return blank();
    return Object.assign(blank(), s);
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
  }

  function askPersist() {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* optional */ }
  }

  MYF.Store = { load: load, save: save, askPersist: askPersist, KEY: KEY };
})();
