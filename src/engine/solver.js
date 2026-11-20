// Simple solver: finds the fewest moves to win from any state (breadth-first search).
// Item positions don't change what's possible (any item can be dropped on any other),
// so a state is just: how many of each item, free cells, generator charges and positions in their
// output lists, and which orders are done. Moves and swaps never help, so they're left out.
// Shake is left out too: par and "best" assume no Shake.
(function () {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  var R = MYF.Rules, ITEMS = R.ITEMS;
  var IDS = Object.keys(ITEMS);
  var IDX = {};
  IDS.forEach(function (id, i) { IDX[id] = i; });
  var MERGEABLE = IDS.filter(function (id) { return ITEMS[id].next; }).map(function (id) { return [IDX[id], IDX[ITEMS[id].next]]; });
  var COMBOS = MYF.DATA.combos.map(function (c) { return [IDX[c.a], IDX[c.b], IDX[c.makes], c.makes]; });

  // node layout: [free, counts..., charges per gen..., n per gen..., done per order...]
  function abstract(level, state) {
    var gens = [], counts = IDS.map(function () { return 0; }), free = 0;
    state.cells.forEach(function (c, i) {
      if (!c) free++;
      else if (c.k === 'item') counts[IDX[c.id]]++;
      else if (c.k === 'gen') gens.push({ at: i, charges: c.charges, n: c.n, out: level.start[c.src].out.map(function (id) { return IDX[id]; }) });
    });
    var node = [free].concat(counts, gens.map(function (g) { return g.charges; }), gens.map(function (g) { return g.n; }),
      state.orders.map(function (o) { return o.done ? 1 : 0; }));
    return { node: node, gens: gens, wants: state.orders.map(function (o) { return IDX[o.wants]; }) };
  }

  // solve(level, state, opts) -> { best, path: [abstract actions], states, ms } or { best: null } if not winnable
  function solve(level, state, opts) {
    opts = opts || {};
    var cap = opts.cap || 400000;
    var t0 = Date.now();
    var A = abstract(level, state);
    var G = A.gens.length, N = IDS.length, O = A.wants.length;
    var oC = 1, oCh = 1 + N, oN = 1 + N + G, oD = 1 + N + 2 * G;
    function won(n) { for (var k = 0; k < O; k++) if (!n[oD + k]) return false; return true; }
    var startKey = A.node.join(',');
    if (won(A.node)) return { best: 0, path: [], states: 1, ms: 0 };
    var parent = new Map();
    parent.set(startKey, null);
    var frontier = [A.node], depth = 0, count = 1;

    function push(next, key, act, from, fromKey) {
      if (parent.has(key)) return false;
      parent.set(key, { prev: fromKey, act: act });
      next.push(from);
      count++;
      return true;
    }

    while (frontier.length) {
      depth++;
      var next = [];
      for (var f = 0; f < frontier.length; f++) {
        var n = frontier[f], nk = n.join(','), m, k, key;
        // deliver
        for (k = 0; k < O; k++) {
          if (!n[oD + k] && n[oC + A.wants[k]] > 0) {
            m = n.slice(); m[oC + A.wants[k]]--; m[0]++; m[oD + k] = 1;
            key = m.join(',');
            if (push(next, key, { t: 'deliver', order: k, id: IDS[A.wants[k]] }, m, nk) && won(m)) return finish(key);
          }
        }
        // combos
        for (k = 0; k < COMBOS.length; k++) {
          var c = COMBOS[k];
          if (n[oC + c[0]] > 0 && n[oC + c[1]] > 0) {
            m = n.slice(); m[oC + c[0]]--; m[oC + c[1]]--; m[oC + c[2]]++; m[0]++;
            push(next, m.join(','), { t: 'combo', a: IDS[c[0]], b: IDS[c[1]], id: c[3] }, m, nk);
          }
        }
        // same merges
        for (k = 0; k < MERGEABLE.length; k++) {
          var mg = MERGEABLE[k];
          if (n[oC + mg[0]] >= 2) {
            m = n.slice(); m[oC + mg[0]] -= 2; m[oC + mg[1]]++; m[0]++;
            push(next, m.join(','), { t: 'merge', a: IDS[mg[0]], id: IDS[mg[1]] }, m, nk);
          }
        }
        // spawns
        if (n[0] > 0) {
          for (k = 0; k < G; k++) {
            if (n[oCh + k] > 0) {
              var g = A.gens[k], it = g.out[n[oN + k] % g.out.length];
              m = n.slice(); m[oCh + k]--; m[oN + k]++; m[oC + it]++; m[0]--;
              push(next, m.join(','), { t: 'spawn', gen: k, at: g.at, id: IDS[it] }, m, nk);
            }
          }
        }
        if (count > cap) return { best: null, capped: true, states: count, ms: Date.now() - t0 };
      }
      frontier = next;
    }
    return { best: null, states: count, ms: Date.now() - t0 };

    function finish(key) {
      var path = [], p = parent.get(key);
      while (p) { path.unshift(p.act); p = parent.get(p.prev); }
      return { best: path.length, path: path, states: count, ms: Date.now() - t0 };
    }
  }

  // Turns the solver's first step into a concrete action on the real board (for the Hint button).
  function concrete(state, act) {
    var cells = state.cells, i, j;
    function find(id, not) { for (var x = 0; x < cells.length; x++) if (x !== not && cells[x] && cells[x].k === 'item' && cells[x].id === id) return x; return -1; }
    if (act.t === 'spawn') return { t: 'spawn', at: act.at };
    if (act.t === 'deliver') { i = find(act.id); return i < 0 ? null : { t: 'deliver', from: i, order: act.order }; }
    if (act.t === 'merge') { i = find(act.a); j = find(act.a, i); return i < 0 || j < 0 ? null : { t: 'drop', from: i, to: j }; }
    if (act.t === 'combo') { i = find(act.a); j = find(act.b); return i < 0 || j < 0 ? null : { t: 'drop', from: i, to: j }; }
    return null;
  }

  function hint(level, state, opts) {
    var r = solve(level, state, opts || { cap: 150000 });
    if (!r.best) return { action: null, result: r };
    return { action: concrete(state, r.path[0]), result: r };
  }

  MYF.Solver = { solve: solve, hint: hint, concrete: concrete };
})();
