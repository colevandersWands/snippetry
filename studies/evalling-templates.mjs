// import tracedLog from '../snippets/log.mjs';
import togglog from '../snippets/togglog.mjs';

// const log = togglog({ out: tracedLog });
const log = togglog();

// ---   ---   ---   ---   ---   ---   ---   ---

// where does .raw`` fit in here?
const compile = (strings, args) =>
  strings.map((chunk, i) => (i < args.length ? chunk + args[i] : chunk)).join('');

const run = (strings, ...args) => {
  const src = compile(strings, args);
  eval(src);
};
run`console.log(${1})`;

const debug = (strings, ...args) => {
  const src = compile(strings, args);
  eval(`debugger;

${src}

debugger;`);
};
debug`console.log(${2})`;
