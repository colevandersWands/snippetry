import { n } from '../../utils/n.js';

import { txt } from './txt.js';

export const json = {
  ...txt,
  dangerZone: (s = { title: '', text: '' }) => [
    s.title.endsWith('.scm.json')
      ? n('button', {}, 'run', () => runSchemeJson(JSON.parse(s.text)))
      : null,
    n('button', {}, 'inspect', (snippet) => {
      try {
        console.log(JSON.parse(s.text));
      } catch (parseError) {
        console.error(parseError);
      }
    }),
    ...txt.dangerZone(s),
  ],
};

// -------------------------------

let evaluate = null;

const runSchemeJson = async (program = []) => {
  if (typeof evaluate !== 'function') {
    evaluate = (await import('../../../lib/scheme-dot-json/index.js')).evaluate;
  }

  evaluate(program);
};
