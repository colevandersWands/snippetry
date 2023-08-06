const WIDTH = 30;
const STEP = 0.08;

const coordinate = (num, phase = 0) =>
  Math.round(Math.sin(num + phase) * WIDTH) + WIDTH;

let a = 0;
let b = WIDTH;
const drawBasePair = () => {
  const cA = coordinate((a += STEP));
  const cB = coordinate((b += STEP), WIDTH / 2);

  const leftPad = Array((cA < cB ? cA : cB) + 1).join(' ');
  const bases = Array(Math.abs(cB - cA)).join('=');

  console.log(`${leftPad}{|${bases}|}`);

  if (a / b > 0.3) clearInterval(strand);
};

const strand = setInterval(drawBasePair, 30);

// tags: sketch
