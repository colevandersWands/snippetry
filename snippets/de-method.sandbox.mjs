import { deMethod } from './de-method.mjs';

// --- wrap the methods an array would have access too
const arrap1 = deMethod(Array);
console.log(arrap1.map([1, 2], (i) => i + 1));

// also wrap static methods
const arrap2 = deMethod(Array, { statics: true });
console.log(arrap2.from('asdf'));

// --- bulk-wrap constructors
const [$arr, $str] = deMethod([Array, String]);
console.log($arr.filter([1, 2, 3, 4], (i) => i % 2 === 0));
console.log($str.toLowerCase('ASDF'));

// --- only bundle static methods
const $console = deMethod(console, { statics: true, inherited: false });
$console.log('hoy');

// --- add custom prefix to methods
const _arr = deMethod(Array, { prefix: 'arr' });
console.log(_arr.arrMap([1, 2], (i) => i + 1));

// --- polyfill methods under a prefix deMethod
deMethod(Array, { target: globalThis, prefix: '$arr' });
console.log($arrMap([1, 2, 3], (i) => i + 1));
