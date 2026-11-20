// Levels: data only. Words (titles, panel captions) are in src/data/text-en.js under the same ids.
// at: [column, row], counted from the top-left, starting at 0.
// Generator "out" is played in order and loops; one item means "always this one".
// best = fewest moves found by the solver (tools/solver.html), par = about best x 1.5 in Chapter 1.
(function () {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  MYF.DATA = MYF.DATA || {};

  MYF.DATA.levels = [
    {
      id: 'c1-01', board: [4, 4],
      start: [
        { at: [0, 0], gen: 'spoonDrawer', charges: 7, out: ['spoon'] },
        { at: [3, 3], gen: 'eggBasket', charges: 7, out: ['egg'] }
      ],
      orders: [{ who: 'king', wants: 'braveChick' }],
      guide: true, comboGlow: ['chick', 'ladle'],
      story: [
        { on: 'start', panel: 'c1-01-p1' },
        { on: 'made:ladle', panel: 'c1-01-p2' },
        { on: 'made:braveChick', panel: 'c1-01-p3' },
        { on: 'delivered:braveChick', panel: 'c1-01-p4' },
        { on: 'won', panel: 'c1-01-p5' }
      ],
      best: 16, par: 24
    },
    {
      id: 'c1-02', board: [4, 5],
      start: [
        { at: [0, 0], gen: 'eggBasket', charges: 3, out: ['egg'] },
        { at: [3, 4], gen: 'threadSpool', charges: 7, out: ['thread'] }
      ],
      orders: [{ who: 'sirChick', wants: 'cosyEgg' }],
      story: [
        { on: 'start', panel: 'c1-02-p1' },
        { on: 'made:sock', panel: 'c1-02-p2' },
        { on: 'made:socks', panel: 'c1-02-p3' },
        { on: 'made:cosyEgg', panel: 'c1-02-p4' },
        { on: 'won', panel: 'c1-02-p5' }
      ],
      best: 10, par: 15
    },
    {
      id: 'c1-03', board: [5, 5],
      start: [
        { at: [0, 0], gen: 'spoonDrawer', charges: 10, out: ['spoon'] },
        { at: [4, 4], gen: 'eggBasket', charges: 6, out: ['egg'] },
        { at: [2, 0], item: 'spoon' }, { at: [4, 0], item: 'spoon' }, { at: [1, 1], item: 'spoon' },
        { at: [3, 1], item: 'spoon' }, { at: [0, 2], item: 'spoon' }, { at: [2, 2], item: 'spoon' },
        { at: [4, 2], item: 'spoon' }, { at: [1, 3], item: 'spoon' }, { at: [3, 3], item: 'spoon' },
        { at: [1, 0], item: 'thread' }, { at: [0, 4], item: 'sock' }, { at: [4, 1], item: 'thread' },
        { at: [2, 4], item: 'sock' }
      ],
      orders: [{ who: 'king', wants: 'goldenLadle' }, { who: 'sirChick', wants: 'chick' }],
      story: [
        { on: 'start', panel: 'c1-03-p1' },
        { on: 'made:goldenLadle', panel: 'c1-03-p2' },
        { on: 'delivered:chick', panel: 'c1-03-p3' },
        { on: 'won', panel: 'c1-03-p4' }
      ],
      best: 16, par: 24
    }
  ];
})();
