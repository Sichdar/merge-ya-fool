// Pure game rules. No drawing, no sound, no storage.
// Rules.apply(level, state, action) -> { ok, state, events }. The old state is never changed.
// Game wraps it with undo, restart, shake, story panels and play stats (used by the UI, solver and tests).
(function () {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  var D = MYF.DATA;

  // ---------- item table ----------
  var ITEMS = {};
  var COMBO = {};
  Object.keys(D.families).forEach(function (fam) {
    var list = D.families[fam];
    list.forEach(function (id, i) {
      ITEMS[id] = { id: id, family: fam, tier: i + 1, next: list[i + 1] || null, top: i === list.length - 1, combo: false };
    });
  });
  D.combos.forEach(function (c) {
    ITEMS[c.makes] = { id: c.makes, family: 'combo', tier: 0, next: null, top: true, combo: true, from: [c.a, c.b], kind: c.kind };
    COMBO[c.a + '|' + c.b] = c.makes;
    COMBO[c.b + '|' + c.a] = c.makes;
  });

  function mergeResult(a, b) {
    if (a === b) return ITEMS[a] && ITEMS[a].next ? { id: ITEMS[a].next, kind: 'merge' } : null;
    var c = COMBO[a + '|' + b];
    return c ? { id: c, kind: 'combo' } : null;
  }

  // ---------- state ----------
  // cell: null (empty) · {k:'item', id} · {k:'gen', gen, charges, n, src} · {k:'block'}
  function newState(level) {
    var cols = level.board[0], rows = level.board[1];
    var cells = [];
    for (var i = 0; i < cols * rows; i++) cells.push(null);
    var made = {};
    (level.blocked || []).forEach(function (at) { cells[at[1] * cols + at[0]] = { k: 'block' }; });
    level.start.forEach(function (s, si) {
      var idx = s.at[1] * cols + s.at[0];
      if (s.gen) cells[idx] = { k: 'gen', gen: s.gen, charges: s.charges, n: 0, src: si };
      else { cells[idx] = { k: 'item', id: s.item }; made[s.item] = true; }
    });
    return {
      level: level.id, cols: cols, rows: rows, cells: cells,
      orders: level.orders.map(function (o) { return { who: o.who, wants: o.wants, done: false }; }),
      moves: 0, made: made, won: false
    };
  }

  function clone(s) {
    return {
      level: s.level, cols: s.cols, rows: s.rows,
      cells: s.cells.map(function (c) { return c ? Object.assign({}, c) : null; }),
      orders: s.orders.map(function (o) { return Object.assign({}, o); }),
      moves: s.moves, made: Object.assign({}, s.made), won: s.won
    };
  }

  function rc(state, i) { return [i % state.cols, Math.floor(i / state.cols)]; }

  // Nearest empty cell to the generator; ties go to the top-left one (row first, then column).
  function nearestEmpty(state, from) {
    var p = rc(state, from), best = -1, bestD = Infinity;
    for (var i = 0; i < state.cells.length; i++) {
      if (state.cells[i] !== null) continue;
      var q = rc(state, i), d = (q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1]);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function reject(state, why, at, extra) {
    var e = { t: 'reject', why: why, at: at };
    if (extra) Object.assign(e, extra);
    return { ok: false, state: state, events: [e] };
  }

  function noteMade(s, id, events) {
    if (!s.made[id]) { s.made[id] = true; events.push({ t: 'made', id: id }); }
  }

  // ---------- the rules ----------
  function apply(level, state, a) {
    if (state.won) return reject(state, 'won');
    var cells = state.cells, s, events = [];

    if (a.t === 'spawn') {
      var g = cells[a.at];
      if (!g || g.k !== 'gen') return reject(state, 'notGen', a.at);
      if (g.charges <= 0) return reject(state, 'noCharges', a.at);
      var to = nearestEmpty(state, a.at);
      if (to < 0) return reject(state, 'noRoom', a.at);
      s = clone(state);
      var out = level.start[g.src].out;
      var id = out[g.n % out.length];
      s.cells[a.at].charges--; s.cells[a.at].n++;
      s.cells[to] = { k: 'item', id: id };
      s.moves++;
      events.push({ t: 'spawned', from: a.at, at: to, id: id });
      noteMade(s, id, events);
      return { ok: true, state: s, events: events };
    }

    if (a.t === 'drop') {
      var A = cells[a.from], B = cells[a.to];
      if (!A || A.k !== 'item') return reject(state, 'notItem', a.from);
      if (a.from === a.to) return reject(state, 'same', a.from);
      if (B && B.k !== 'item') return reject(state, 'blocked', a.to);
      s = clone(state);
      s.moves++;
      if (!B) {
        s.cells[a.to] = s.cells[a.from]; s.cells[a.from] = null;
        events.push({ t: 'moved', from: a.from, to: a.to, id: A.id });
        return { ok: true, state: s, events: events };
      }
      var r = mergeResult(A.id, B.id);
      if (r) {
        s.cells[a.from] = null;
        s.cells[a.to] = { k: 'item', id: r.id };
        events.push({ t: r.kind === 'combo' ? 'combo' : 'merged', from: a.from, to: a.to, id: r.id, tier: ITEMS[r.id].tier });
        noteMade(s, r.id, events);
        return { ok: true, state: s, events: events };
      }
      if (A.id === B.id) { s = null; return reject(state, 'top', a.to, { id: A.id }); }
      s.cells[a.to] = { k: 'item', id: A.id };
      s.cells[a.from] = { k: 'item', id: B.id };
      events.push({ t: 'swapped', from: a.from, to: a.to });
      return { ok: true, state: s, events: events };
    }

    if (a.t === 'deliver') {
      var it = cells[a.from], o = state.orders[a.order];
      if (!it || it.k !== 'item') return reject(state, 'notItem', a.from);
      if (!o || o.done) return reject(state, 'orderDone', a.from, { order: a.order });
      if (o.wants !== it.id) return reject(state, 'wrongOrder', a.from, { order: a.order, id: it.id });
      s = clone(state);
      s.cells[a.from] = null;
      s.orders[a.order].done = true;
      s.moves++;
      events.push({ t: 'delivered', from: a.from, order: a.order, id: it.id, who: o.who });
      if (s.orders.every(function (x) { return x.done; })) { s.won = true; events.push({ t: 'won' }); }
      return { ok: true, state: s, events: events };
    }

    if (a.t === 'shake') {
      s = clone(state);
      s.cells.forEach(function (c) { if (c && c.k === 'gen') c.charges += 5; });
      s.moves += 3;
      events.push({ t: 'shaken' });
      return { ok: true, state: s, events: events };
    }

    return reject(state, 'unknown');
  }

  // Stuck: nothing to merge, nothing to deliver, and no generator can spawn.
  function isStuck(state) {
    if (state.won) return false;
    var seen = {}, empty = false, canSpawn = false, i, c;
    for (i = 0; i < state.cells.length; i++) {
      c = state.cells[i];
      if (!c) { empty = true; continue; }
      if (c.k === 'gen' && c.charges > 0) canSpawn = true;
      if (c.k !== 'item') continue;
      if (seen[c.id] && ITEMS[c.id].next) return false;
      seen[c.id] = true;
    }
    if (empty && canSpawn) return false;
    var ids = Object.keys(seen);
    for (i = 0; i < ids.length; i++) {
      for (var j = i + 1; j < ids.length; j++) if (COMBO[ids[i] + '|' + ids[j]]) return false;
    }
    for (i = 0; i < state.orders.length; i++) if (!state.orders[i].done && seen[state.orders[i].wants]) return false;
    return true;
  }

  function starsFor(moves, par) {
    if (moves <= par) return 3;
    if (moves <= Math.floor(par * 1.4)) return 2;
    return 1;
  }

  // ---------- Game: undo, restart, panels, stats ----------
  var UNDO_KEEP = 50;

  function Game(level, saved) {
    this.level = level;
    if (saved) {
      this.state = saved.state; this.history = saved.history || []; this.undos = saved.undos || 0;
      this.stats = saved.stats; this.shown = saved.shown || {};
    } else {
      this.reset(true);
    }
  }
  Game.prototype.reset = function (first) {
    this.state = newState(this.level);
    this.history = [];
    this.undos = 0;
    if (first || !this.stats) this.stats = { restarts: 0, undos: 0, shakes: 0, hints: 0, ms: 0, log: [] };
    if (first || !this.shown) this.shown = {};
  };
  Game.prototype.moves = function () { return this.state.moves + this.undos; };
  Game.prototype.stars = function () { return starsFor(this.moves(), this.level.par); };
  Game.prototype.panelsFor = function (trigger) {
    var out = [], self = this;
    (this.level.story || []).forEach(function (p) {
      if (p.on === trigger && !self.shown[p.panel]) { self.shown[p.panel] = true; out.push({ t: 'panel', panel: p.panel }); }
    });
    return out;
  };
  Game.prototype.start = function () { return this.panelsFor('start'); };
  Game.prototype.act = function (action) {
    var r = apply(this.level, this.state, action);
    if (!r.ok) return r.events;
    this.history.push(this.state);
    if (this.history.length > UNDO_KEEP) this.history.shift();
    this.state = r.state;
    var events = r.events.slice(), self = this;
    r.events.forEach(function (e) {
      if (e.t === 'made') events = events.concat(self.panelsFor('made:' + e.id));
      if (e.t === 'delivered') events = events.concat(self.panelsFor('delivered:' + e.id));
      if (e.t === 'won') events = events.concat(self.panelsFor('won'));
    });
    if (action.t === 'shake') this.stats.shakes++;
    this.stats.log.push(logCode(this.state, action, r.events));
    if (isStuck(this.state)) events.push({ t: 'stuck' });
    return events;
  };
  Game.prototype.undo = function () {
    if (!this.history.length || this.state.won) return false;
    this.state = this.history.pop();
    this.undos++;
    this.stats.undos++;
    this.stats.log.push('U');
    return true;
  };
  // Restart: back to move 0. Story panels can show again; the intro counts as already seen.
  Game.prototype.restart = function () {
    this.stats.restarts++;
    this.stats.log.push('R');
    this.reset(false);
    this.shown = {};
    this.panelsFor('start');
  };
  Game.prototype.isStuck = function () { return isStuck(this.state); };
  Game.prototype.toJSON = function () {
    return { level: this.level.id, state: this.state, history: this.history, undos: this.undos, stats: this.stats, shown: this.shown };
  };

  // Short code per action for the playtest report: S=spawn M=merge C=combo V=move W=swap D=deliver K=shake
  function logCode(state, a, events) {
    var e = events[0] || {};
    if (e.t === 'spawned') return 'S';
    if (e.t === 'merged') return 'M' + e.tier;
    if (e.t === 'combo') return 'C';
    if (e.t === 'moved') return 'V';
    if (e.t === 'swapped') return 'W';
    if (e.t === 'delivered') return 'D';
    if (e.t === 'shaken') return 'K';
    return '?';
  }

  MYF.Rules = {
    ITEMS: ITEMS, mergeResult: mergeResult, newState: newState, clone: clone, apply: apply,
    isStuck: isStuck, starsFor: starsFor, nearestEmpty: nearestEmpty, Game: Game
  };
})();
