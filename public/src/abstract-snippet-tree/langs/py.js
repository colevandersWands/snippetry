import { n } from '../../utils/n.js';

import { txt } from './txt.js';

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
  

  Sk.misceval
    .asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, snippet.text, true))
    .then(
      function allGood() {},
      function noGood(err) {
        console.error(err.toString());
      },
    );
};
