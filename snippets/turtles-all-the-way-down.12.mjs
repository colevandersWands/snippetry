import projector from './projector.mjs';

const AETHER = 'color: yellow; background-color: black;';
const HORIZON = 13;

const body = (sparsity = 1) => (Math.random() < sparsity ? '*' : ' ');
const bodies = (sparsity = 1) =>
  Array(HORIZON).fill().map(() => body(sparsity)).join(' ');

const down = (frame = 0, turtle = ' 🐢 ') =>
  bodies(20 / frame) + turtle + bodies(20 / frame);

function* descending(config = {}) {
  const deeper = Array(42).fill(down(-1, '    '));
  deeper.push(down(-1, ' 🗺️ '), down(-1, ' 🐘 '), down(-1));

  while (descending) {
    // deeper.shift(),
    deeper.push(down(config.frame));
    yield [`%c${deeper.join('\n')}`, AETHER];
  }
}

projector(descending, { frameRate: 7 });
