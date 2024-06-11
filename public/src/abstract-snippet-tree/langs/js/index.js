import { n } from '../../../utils/n.js';

import { revise } from '../../utils/revise.js';

import { txt } from '../txt.js';

import { runCode } from './run-code.js';
import { dwitteroot } from './dwitteroot/index.js';

export const js = {
  ...txt,
  dangerZone: (s = { title: '', text: '' }) =>
    s.title.toLowerCase().endsWith('.dweet.js')
      ? txt.dangerZone(s)
      : [
          n('button', {}, 'run', () => runCode(s)),
          n('button', {}, 'debug', () => runCode(s, true)),
        ],
  translate: ({ ast, snippet }) =>
    snippet.title.toLowerCase().endsWith('.dweet.js')
      ? revise(ast, (node) =>
          node?.attributes?.id?.endsWith('-text') ? dwitteroot(snippet) : node,
        )
      : ast,
};
