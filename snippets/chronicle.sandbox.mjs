import { chronicle } from './chronicle.mjs';

const add = chronicle((a, b) => a + b);
add(2, 3);
add(3, 2);
console.log(add._chronicle);
console.log(add._forget.concat(1, 2, 3));
console.log(add._chronicle);

const fib1 = chronicle((n) => (n <= 1 ? n : fib1(n - 1) + fib1(n - 2)));
fib1(4);
console.log(fib1._chronicle);

const fib2 = chronicle(function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
});
fib2(4);
console.log(fib2._chronicle);
