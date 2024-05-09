import { curry } from './curry.mjs';

console.log(curry(() => 0)());
console.log(curry((a) => a)(1));
console.log(curry((a, b) => a + b)(1)(2));
console.log(curry((a, b, c) => a + b + c)(1)(2)(3));
