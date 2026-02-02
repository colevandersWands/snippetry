const WIDTH = 30;
const STEP = 0.08;
const SPEED = 30;
const LENGTH = 30;

const coordinate = (num, phase = 0) =>
  Math.round(Math.sin(num + phase) * WIDTH) + WIDTH;

const drawBasePair = (a = 0, b = WIDTH) => {
  const cA = coordinate(a);
  const cB = coordinate(b, WIDTH / 2);

  const leftPad = Array((cA < cB ? cA : cB) + 1).join(' ');
  const bases = Array(Math.abs(cB - cA)).join('=');

  console.log(`${leftPad}{|${bases}|}`);

  if (a < LENGTH) setTimeout(drawBasePair, SPEED, a + STEP, b + STEP);
};

drawBasePair();

// tags: sketch
