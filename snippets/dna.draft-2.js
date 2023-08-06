const WIDTH = 30;
const STEP = 0.08;

const coordinate = (num, phase = 0) =>
  Math.round(Math.sin(num + phase) * WIDTH) + WIDTH;

let a = 0;
let b = WIDTH;

const strand = setInterval(() => {
  if (a / b > 0.3) clearInterval(strand);

  const cA = coordinate((a += STEP));
  const cB = coordinate((b += STEP), WIDTH / 2);

  const leftPad = Array((cA < cB ? cA : cB) + 1).join(' ');
  // also randomly flip side of bases
  if (Math.random() > 0.5) {
    const bases = Array(Math.abs(cB - cA)).join('~');
    console.log(`${leftPad}{|${bases}|}`);
  } else {
    const bases = Array(Math.abs(cB - cA)).join('-');
    console.log(`${leftPad}(I${bases}I)`);
  }
}, 30);

// tags: sketch
