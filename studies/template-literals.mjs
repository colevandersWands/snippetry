// import tracedLog from '../snippets/log.mjs';
import togglog from '../snippets/togglog.mjs';

// const log = togglog({ out: tracedLog });
const log = togglog();

// --------- seeded from from MDN docs ---------

{
  log.label = 'calling: ';
  log.off;

  log`hello`;

  log.bind(1, 2)`hello`;

  // new Function('console.log(arguments)')`hello`;

  const recursive = (strings, ...args) => (log(strings, args), recursive);
  recursive`hello``good bye`;

  const nonPrimitiveArgs = (strings, ...args) => log(strings, args);
  nonPrimitiveArgs`${[1, 2, 3]}${{ a: 1, b: 2 }}${() => {}}`;
}

commented_calls: {
  // refactored to /snippets/literize.mjs
}

{
  log.label = 'closuring: ';
  log.off;

  const template =
    (strings, ...keys) =>
    (...values) => {
      const dict = values[values.length - 1] || {};
      const result = [strings[0]];
      keys.forEach((key, i) => {
        const value = Number.isInteger(key) ? values[key] : dict[key];
        result.push(value, strings[i + 1]);
      });
      return result.join('');
    };

  const t1Closure = template`${0}${1}${0}!`;
  // const t1Closure = template(['', '', '', '!'], 0, 1, 0);
  log(t1Closure('y', 'a'));

  const t2Closure = template`${0}${'foo'}!`;
  // const t2Closure = template(['', '', '!'], 0, 'foo');
  t2Closure('hello', { foo: 'world' });

  const t3Closure = template`I'm ${'name'}. I'm almost ${'age'} years old.`;
  // const t3Closure = template(["I'm ", ". I'm almost ", ' years old.'],'name','age');
  t3Closure('foo', { name: 'MDN', age: 30 });
  t3Closure({ name: 'MDN', age: 30 });
}

{
  log.label = 'strings caching: ';
  log.off;

  const callHistory = [];

  const tag = (strings, thing) => (callHistory.push(strings), strings[0] + thing);
  const evaluateLiteral = (thing) => tag`Hello, ${thing}`;

  log(evaluateLiteral('world')), log(callHistory);
  log(evaluateLiteral('mars')), log(callHistory);

  log(callHistory[0] === callHistory[1]);
}

{
  log.label = 'thissing: ';
  log.off;

  (function ([string]) {
    log(this, string);
  }).bind('hello')`world`;
}

{
  log.label = 'raw: ';
  log.on;

  const argRaw = (strings) => log(strings.raw);
  argRaw(`asdf${1}fdsa${2}qwer`); // undefined
  argRaw`asdf${1}fdsa${2}qwer`; // ['asdf', 'fdsa', 'qwer']

  log(String.raw`asdf${1}fdsa${2}qwer`); // 'asdf1fdsa2qwer';
  log(String.raw(`asdf${1}fdsa${2}qwer`)); // TypeError: Cannot convert undefined or null to object
}
