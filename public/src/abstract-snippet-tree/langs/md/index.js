import { state } from '../../../state.js';

import { renderMarkdown } from './render-markdown.js';
import { lang } from '../../../utils/titling.js';
import { langs } from '../index.js';

import { revise } from '../../utils/revise.js';
import { lazyRender } from '../../utils/lazy-render.js';

import { txt } from '../txt.js';

export const md = {
  ...txt,
  dangerZone: (snippet = { title: '', text: '' }) => [
    ...(snippet.subtext
      ? langs[lang(snippet.subtext)].dangerZone(
          state.snippets.find((subppet) => subppet.title === snippet.subtext),
        )
      : []),
    ...txt.dangerZone(snippet),
  ],
  translate: ({ ast, snippet = { title: '', text: '' } }) =>
    revise(ast, (node) => {
      if (node?.attributes?.id?.endsWith('-text')) {
        const container = document.createElement('div');
        container.setAttribute('target', '_blank');

        return lazyRender(() => {
          container.innerHTML = `<div class='wrappable markdown-body' style="min-width: 30vw">${renderMarkdown(
            snippet.text,
          )}</div><br />`;

          for (const link of container.getElementsByTagName('a')) {
            if (window.location.host === link.host) {
              link.target = '_self';
            } else {
              link.target = '_blank';
            }
          }

          Prism.highlightAllUnder(container);

          return container;
        });
      }

      return node;
    }),
};
