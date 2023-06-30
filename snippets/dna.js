const WIDTH = 30;
const STEP = 0.08;

const coordinate = (num, phase = 0) =>
  Math.round(Math.sin(num + phase) * WIDTH) + WIDTH;

let a = 0;
let b = WIDTH;

const strand = setInterval(() => {
  const cA = coordinate((a += STEP));
  const cB = coordinate((b += STEP), WIDTH / 2);
  console.log(
    `${Array((cA < cB ? cA : cB) + 1).join(' ')}{|${Array(
      Math.abs(cB - cA),
    ).join('=')}|}`,
  );
  if (a / b > 0.3) {
    clearInterval(strand);
  }
}, 30);

// tags: sketch
