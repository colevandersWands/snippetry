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

// deprecated
// console.log(togglog({ unary: false })('hi', 'bye')); // 'hi' -> ['hi']

// --- --- ---

{
  const _ = togglog({ label: 'hi' });

  _.on.log(0, 1);
  _.off;
  _(2);
  _.on;
  _.log(3);
  _.label = null;
  _.on.log(4);
  console.log(_.is);
  _.off.log(5);
  _(_.is);
  _.out = (...things) => console.log('hoy', ...things);
  _.toggle.on.off.log.toggle.log(6);
  _(_.log(7, 8));

  _.label = null;
  _.out = console.log;
  _('a');
  _.log('b');
  _.toggle.log('c');
  _.toggle.log('d');
}
