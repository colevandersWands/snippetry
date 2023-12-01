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
    // console.log(parameters);
    params.push(`_${++parameters}`);
    // console.log(params);
    const func = new Function(...params, '');
    // console.log(func.toString());
    console.log(parameters);
  }
} catch (_) {
  console.error(_);
}
console.log(parameters);
