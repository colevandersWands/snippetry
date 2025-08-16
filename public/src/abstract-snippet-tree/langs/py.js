import { n } from '../../utils/n.js';

import { txt } from './txt.js';

import { compileDslDependencies } from '../utils/compile-dsl-dependencies.js';

export const py = {
  ...txt,
  dangerZone: (snippet) => [
    n('button', {}, 'run', () => run(snippet)),
    // n('button', {}, 'debug', () => tanspileAndRun(snippet.text, true)),
  ],
};

// ---------------------

const run = async (snippet = {}) => {
  try {
    Sk;
  } catch (_) {
    await import('../../../lib/skulpt.min.js');
    await import('../../../lib/skulpt-stdlib.js');

    Sk.configure({
      inputfun: async (message) => prompt(message) || '',
      inputfunTakesPrompt: true,
      output: async (message) => alert(message),
    });
  }

  console.log(`\n========== ${snippet.title} ==========\n`);

  const toExecute = `
${compileDslDependencies(snippet)}


# --- --- --- ---

${snippet.text}`;

  Sk.misceval
    .asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, toExecute, true))
    .then(
      function allGood() {},
      function noGood(err) {
        console.error(err.toString());
      },
    );
};
