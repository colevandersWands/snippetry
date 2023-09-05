import togglog from './togglog.mjs';

const log = togglog({ write: false });
console.log(log.is); // false

console.log(log(1)); // __ -> 1

console.log(log.on); // true

log(2); // 2

console.log(log(log.is)); // true -> true

console.log(log(3)); // 3 -> 3

console.log(log.off); // false
console.log(log.is); // false

console.log(log(4)); // __ -> 4

console.log(log.on); // true

console.log(log()); // __ -> []

console.log(log('y' + log('o' + log('m')))); // m -> om -> yom -> yom

console.log(log(1, 2, 3)); // 1 2 3 -> 1

for (let i = 0; i < 10; i++) {
  log.toggle;
  log(i);
}

// --- --- ---

togglog({ out: console.trace })('hi');

console.log(togglog({ unary: false })('hi', 'bye')); // 'hi' -> ['hi']
