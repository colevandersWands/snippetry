import { chronicle } from './chronicle.mjs';

const tin = chronicle(() => ({ tin }));
tin.tin = tin;

tin['tin']().tin.tin.tin().tin;
console.log(tin._chronicle);

tin._forget;

tin.tin()['tin']().tin().tin;
console.log(tin._chronicle);

// tags: puzzle
