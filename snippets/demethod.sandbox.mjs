import { demethod } from './demethod.mjs';

// --- wrap the methods an array would have access too
const arrap1 = demethod(Array);
console.log(arrap1.map([1, 2], (i) => i + 1));

// also wrap static methods
const arrap2 = demethod(Array, { statics: true });
console.log(arrap2.from('asdf'));

// --- bulk-wrap constructors
const [$arr, $str] = demethod([Array, String]);
console.log($arr.filter([1, 2, 3, 4], (i) => i % 2 === 0));
console.log($str.toLowerCase('ASDF'));

// --- only bundle static methods
const $console = demethod(console, { statics: true, inherited: false });
$console.log('hoy');

// --- add custom prefix to methods
const _arr = demethod(Array, { prefix: 'arr' });
console.log(_arr.arrMap([1, 2], (i) => i + 1));

// --- polyfill methods under a prefix demethod
demethod(Array, { target: globalThis, prefix: '$arr' });
console.log($arrMap([1, 2, 3], (i) => i + 1));
