import _ from './executable-pseudocode.mjs';

const { x, y } = _;

// undefineds
const [a, b, c] = x.map((el) => el > 3).filter((el) => el % 2 !== 0);
console.log('a,b,c', a, b, c);
a + b;

// false
console.log('x' in x);

// true
console.log(delete y.e.x);

x.e = 2;

_.asdf(a).qwer['!'].e;

// useful for potemkin programs
const e = new _(2);

await _();

// is valid, but never iterates
for (const key in _) {
  console.log(key);
}

x(...y);
console.log(...y);

// is valid, iterates a fixed number of times
for (const x of _) {
  console.log(x);
}

// irrelevant because of module
//  Symbol.unscopable
// with (_) {
//   console.log('turtle', turtle);
// }
