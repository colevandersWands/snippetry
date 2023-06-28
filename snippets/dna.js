const WIDTH = 30;
const STEP = 0.08;

const coordinate = (num, phase = 0) =>
  Math.round(Math.sin(num + phase) * WIDTH) + WIDTH;

let a = 0;
let b = WIDTH;

const strand = setInterval(() => {
  const aIndex = coordinate((a += STEP));
  const bIndex = coordinate((b += STEP), WIDTH / 2);
  console.log(
    `${''.padStart(aIndex < bIndex ? aIndex : bIndex)}{|${''.padStart(
      Math.abs(bIndex - aIndex),
      '=',
    )}|}`,
  );
  if (a / b > 0.3) {
    clearInterval(strand);
  }
}, 30);

// tags: sketch
