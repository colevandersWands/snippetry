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

// is valid, but never iterates
for (const key in _) {
  console.log(key);
}

x(...y);
console.log(...y);

// is valid, iterates a fixed number times
for (const x of _) {
  console.log('in of ', x);
}

// irrelevant because of module
//  Symbol.unscopable
// with (_) {
//   console.log('turtle', turtle);
// }

console.log('string tag? ' + _.toString());

// !! how ? can it convert to falsy?
console.log('converting to boolean');
console.log(!a);
if (x) {
  console.log('should evaluate to falsy');
}
// while (y) {
//   console.log('to avoid infinite loops');
// }
y && console.log('nope');

// never resolves, is that ok?
//  the program still terminates
//  but the code after is never executed (+1?)
console.log('pre await');
await _();
// await _;
console.log('post await');
