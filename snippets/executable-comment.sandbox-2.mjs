import _ from './executable-comment.draft.mjs';

const { x, y } = _;

// undefineds
const [a, b, c] = _;
a + b;

// false
console.log('x' in x);

// true
console.log(delete y.e.x);

_.asdf(a).qwer['!'].e;

for (const key in _) {
  // never happens
  console.log(key);
}

x(...y);
console.log(...y);

for (const x of _) {
  // never happens
  console.log(x);
}

// is there a good enough reason for this?
//	overthink, don't have it till its helpful
// const e = new _(2);
