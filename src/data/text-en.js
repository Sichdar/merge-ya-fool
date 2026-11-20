// Every word on screen, in English. Portuguese later = a copy of this file.
(function () {
  'use strict';
  var MYF = window.MYF = window.MYF || {};
  MYF.TEXT = {
    // name = plain gameplay name · pun = pun title (R2) · line = book / info card joke (max 10 words) · top = joke when merging a top tier
    items: {
      egg: { name: 'Egg', pun: 'Eggward', line: 'Very serious. Has a moustache. Nobody knows why.' },
      hatchling: { name: 'Hatchling', pun: 'Shell Shocked', line: 'Just found out about the outside.' },
      chick: { name: 'Chick', pun: 'Chick Flick', line: 'Brought snacks. Watching everything in 3D.' },
      hen: { name: 'Hen', pun: 'Hensome', line: 'Deal with it.' },
      queenHen: { name: 'Queen Hen', pun: 'Her Eggs-cellency', line: 'Rules the roost. Literally.', top: "She's already the Queen!" },
      spoon: { name: 'Spoon', pun: 'Little Spoon', line: 'Needs a cuddle. Always.' },
      bigSpoon: { name: 'Big Spoon', pun: 'Big Spoon', line: 'Gives the cuddle. Always.' },
      ladle: { name: 'Ladle', pun: 'Galaxy Brain Ladle', line: 'Holds soup and the secrets of the universe.' },
      goldenLadle: { name: 'Golden Ladle', pun: 'The Soup-reme Ladle', line: 'Too good for soup, frankly.', top: "It can't get any more golden!" },
      thread: { name: 'Thread', pun: 'Hanging by a Thread', line: 'Nervous. Very, very nervous.' },
      sock: { name: 'Sock', pun: 'Lone Sock', line: 'Waiting by the window for its other half.' },
      socks: { name: 'Pair of Socks', pun: 'Sole Mates', line: 'Finally, together.' },
      sweater: { name: 'Sweater', pun: 'Knit-Wit', line: 'Tied itself in a knot. Again.' },
      royalCape: { name: 'Royal Cape', pun: 'Cape Expectations', line: 'Flows dramatically. There is no wind.', top: 'Peak cape. No more cape possible.' },
      braveChick: { name: 'Brave Chick', pun: 'Sir Ladle-lot', line: 'Fears nothing. Except maybe soup.', top: 'Only one hero per soup!' },
      cosyEgg: { name: 'Cosy Egg', pun: 'Toe-tally Toasty', line: 'Wrapped in socks. Snug as a bug.', top: 'Any cosier and it would melt!' }
    },
    gens: {
      spoonDrawer: { name: 'Spoon Drawer', pun: 'Drawer of Infinite Clatter', line: 'Tap it for spoons. Lots of spoons.' },
      eggBasket: { name: 'Egg Basket', pun: 'Basket Case', line: 'Tap it for eggs. It is a bit wobbly.' },
      threadSpool: { name: 'Thread Spool', pun: 'Yarn-a-Lot', line: 'Tap it for thread. It never stops talking.' }
    },
    who: { king: 'King Bumbleton', sirChick: 'Sir Chick', bobo: 'Bobo' },
    levels: {
      'c1-01': 'The Crown in the Soup',
      'c1-02': "The Egg That Wouldn't Hatch",
      'c1-03': 'Too Many Spoons'
    },
    // Panel captions: max 12 words each.
    panels: {
      'c1-01-p1': 'Bobo juggles for the King. The crown flies into the soup!',
      'c1-01-p2': 'Bobo fishes with the ladle… and pulls out a sock.',
      'c1-01-p3': 'A chick with a ladle! It dives in bravely.',
      'c1-01-p4': 'The crown is back! Still dripping soup.',
      'c1-01-p5': '"Arise, Sir Chick!" Soup Day is now a national holiday.',
      'c1-02-p1': "Sir Chick's little brother won't hatch. \"He's too cold!\"",
      'c1-02-p2': 'One sock? Bobo says socks come in PAIRS.',
      'c1-02-p3': 'Sole mates! Now, what needs warm feet?',
      'c1-02-p4': 'Toasty! The egg gives a happy little wobble.',
      'c1-02-p5': 'It hatches! He refuses to take the socks off. Ever.',
      'c1-03-p1': 'Bobo asked for ONE spoon. The drawer heard "ALL spoons".',
      'c1-03-p2': 'The Soup-reme Ladle! The King weeps with joy.',
      'c1-03-p3': 'Sir Chick gets a squire. The squire gets popcorn.',
      'c1-03-p4': 'The drawer is still clattering. Nobody opens it again.'
    },
    ui: {
      moves: 'Moves', par: 'par', undo: 'Oops', hint: 'Big Brain', menu: 'Menu', shake: 'Wobble',
      tapToStart: 'Tap to start', resume: 'Back to the mess', restart: 'Start again', levels: 'All days',
      sure: 'Start again? Your moves go back to 0.', yes: 'Yes, start again', no: 'No',
      noRoom: 'No room!', noCharges: 'All out!', wrongOrder: 'Not that!', blocked: 'Nope!',
      stuck: 'Oopsie! Want a Wobble?', stuckShake: 'Wobble the room (+3 moves)', stuckUndo: 'Oops (undo)', close: 'Close',
      whatIf: 'What if…?', hintNone: 'Hmm… try Oops or Start again.', skillIssue: 'Skill issue?',
      wonTitle: 'Day done!', nextDay: 'Next day', replay: 'Play again', best: 'best',
      copyReport: 'Copy my report', copied: 'Copied ✓',
      day: 'Day', mergesInto: 'Merges into', unknown: '???', topTier: 'Top of the family!',
      genInfo: 'charges left', listTitle: 'Merge ya Fool', listSub: 'Chapter 1 · The Royal Kitchen',
      more: 'More days coming soon!', testOn: 'Playtest mode is on', phoneTests: 'Phone tests',
      privacy: 'Nothing leaves your phone.', fromPar: 'Par', comingUp: 'locked'
    }
  };
})();
