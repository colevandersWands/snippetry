function projector(reel, fr = 500) {
  if (typeof fr === 'number') {
    setInterval(() => (console.clear(), console.log(...reel())), fr);
  } else if (typeof fr === 'function') {
    (function loop() {
      console.clear();
      console.log(...reel());
      setTimeout(loop, log(fr()));
    })();
  }
}

const BOARD_SIZE = 31;

let board = Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(' '));

const pedestrian = () => (Math.random() < 0.25 ? '*' : ' ');

let tick = 0;

projector(
  () => {
    board = [
      ...board.slice(1),
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => (Math.random() < 0.25 ? '*' : ' ')),
    ];
    return [
      '%c' + board.flatMap((row) => row.join(' ')).join('\n'),
      `color: ${++tick % 3 === 0 ? 'red' : tick % 2 === 0 ? 'blue' : 'black'}`,
    ];
  },
  100,
  // { fr: () => 300 * Math.sin(10 * tick++) + 1000 },
);
