// Item families, combos and generators (data only, no drawing, no words).
// Words live in src/data/text-en.js; drawings in src/art/items.js.
(function () {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  MYF.DATA = MYF.DATA || {};

  // Each family is a chain of tiers, lowest first. The last one is the top tier.
  MYF.DATA.families = {
    egg: ['egg', 'hatchling', 'chick', 'hen', 'queenHen'],
    spoon: ['spoon', 'bigSpoon', 'ladle', 'goldenLadle'],
    thread: ['thread', 'sock', 'socks', 'sweater', 'royalCape']
  };

  // Odd-pair merges. Order of a and b doesn't matter.
  MYF.DATA.combos = [
    { a: 'chick', b: 'ladle', makes: 'braveChick', kind: 'story' },
    { a: 'egg', b: 'socks', makes: 'cosyEgg', kind: 'story' }
  ];

  // Generators: which family they belong to (for drawing and the info card).
  MYF.DATA.generators = {
    spoonDrawer: { family: 'spoon' },
    eggBasket: { family: 'egg' },
    threadSpool: { family: 'thread' }
  };
})();
