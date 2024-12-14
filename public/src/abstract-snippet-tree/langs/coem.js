// adatped from https://editor.coem-lang.org/, https://github.com/coem-lang/coem-editor

import { coemMirror } from '../../../lib/coem-mirror/index.bundle.min.js';

import { n } from '../../utils/n.js';

import { revise } from '../utils/revise.js';
import { lazyRender } from '../utils/lazy-render.js';

import { txt } from './txt.js';

export const coem = {
  ...txt,

  dangerZone: (snippet) => [
    n('button', {}, 'echo', () => echo(snippet)),
    n('button', {}, 'suppress', () => suppress(snippet)),
  ],

  translate: ({ ast, snippet = { title: '', text: '' } }) =>
    revise(ast, (node) => {
      if (node?.attributes?.id?.endsWith('-text')) {
        return lazyRender(() => {
          const { view, container } = coemMirror(snippet);

          snippet._text = snippet.text;
          snippet._echos = [snippet.text];

          Object.defineProperty(snippet, 'text', {
            set(text) {
              if (typeof text !== 'string') return;

              const hack = text.startsWith(')}={(') ? ')}={(' : '';

              if (!hack) {
                view.dispatch({
                  changes: {
                    from: 0,
                    to: view.state.doc.length,
                    insert: text.replace(hack, ''),
                  },
                });
              }

              this._text = text.replace(hack, '');
            },
            get() {
              return this._text;
            },
          });

          return container;
        });
      }
    }),
};

// -------

let Environment, formatCoemError, run;

const echo = async (snippet) => {
  try {
    new Environment(), formatCoemError(), run();
  } catch (_) {
    const coemjs = await import('../../../lib/coem.js');

    Environment = coemjs.Environment;
    formatCoemError = coemjs.formatCoemError;
    run = coemjs.run;
  }

  const browserEnv = new Environment();
  try {
    const echo = await run(snippet.text, browserEnv);
    snippet.text = echo;
    snippet._echos.push(echo);
  } catch (e) {
    console.error(formatCoemError(e, snippet.text).oneLiner);
  }
};

const suppress = (snippet) => {
  // console.log(1, snippet._echos);

  if (snippet._echos.length > 1) {
    snippet.text = snippet._echos.pop();
  } else {
    snippet.text = snippet._echos[0];
  }

  // console.log(2, snippet._echos);
};
