import { pipe } from './pipe.mjs';

console.log(
  9,
  pipe(
    (a, b) => a + b,
    (x) => x * x,
  )(1, 2),
);

console.log(9, pipe([(a, b) => a + b, (x) => x * x])(1, 2));
