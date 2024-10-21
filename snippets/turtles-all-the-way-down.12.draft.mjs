import projector from './projector.mjs';

const speckle = (sparsity = 0.1) => (Math.random() < sparsity ? '*' : ' ');
const speckles = (length = 13, sparsity = 0.1) => Array(length).fill().map(() => speckle(sparsity))
//                0     1    2    3     4    5     6     7    8    9    10    11
//                1          2               3                      2  
const turtles = ['🐢', ' ', '🐢', '🐢', ' ', '🐢', '🐢', '🐢', ' ', '🐢', '🐢', ' '];
const down = (frame = 0) => turtles.at((frame % (turtles.length * 2)) - turtles.length);
const row = (frame = 0) => [...speckles(13), down(frame), ...speckles(13)];

function* descending(config = {}) {
  let deeper = [];
  while (descending) {
    deeper.push(row(config.frame));
    if (deeper.length > 31) deeper.shift();
    yield [[`%c${deeper.flatMap((r) => r.join(' ')).join('\n')}`, 'color: yellow; background-color: black;']];
  }
}

projector(descending);

// see: rainstorm.mjs
