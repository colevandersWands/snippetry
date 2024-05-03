const tin = () => ({ tin });
tin.tin = tin;

console.log(tin[tin.name]().tin.tin.tin()['tin'].name);
console.log(tin.tin()['tin']().tin().tin);

// tags: puzzle
