import { runCode } from './run-code.js';

import { n } from '../../../utils/n.js';

import { txt } from '../txt.js';

export const js = {
  ...txt,
  dangerZone: (s = { title: '', text: '' }) => [
    n('button', {}, 'run', () => runCode(s)),
    n('button', {}, 'debug', () => runCode(s, true)),
  ],
};
