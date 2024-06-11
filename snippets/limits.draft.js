callstack = 0;
try {
  (stack = () => stack(++callstack))();
} catch (_) {}
console.log(callstack);

parameters = 0;
try {
  i = 0;
  params = [];
  while (true) {
    params.push(`_${++parameters}`);
    const func = new Function(...params, '');
  }
} catch (_) {
  console.error(_);
}
console.log(parameters);

array = [];
try {
  while (true) {
    array.push(null);
  }
} catch (_) {
  console.log(array.length);
  console.error(_);
}
