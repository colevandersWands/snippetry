import { n } from '../../utils/n.js';

import { revise } from '../utils/revise.js';
import { lazyRender } from '../utils/lazy-render.js';

import { txt } from './txt.js';

export const svg = {
  ...txt,
  dangerZone: (snippet) => [
    n('button', {}, 'tab', newTab(snippet)),
    n('button', {}, 'set background', setBackground(snippet)),
    n('button', {}, 'set icon', setIcon(snippet)),
  ],
  translate: ({ ast, snippet = { title: '', text: '' } }) =>
    snippet.title.toLowerCase().endsWith('.txt.svg') && !(snippet.title === '.svg')
      ? ast
      : revise(ast, (node) => {
          if (node?.attributes?.id?.endsWith('-text')) {
            const container = document.createElement('div');
            return lazyRender(() => {
              container.innerHTML = snippet.text;
              return container;
            });
          }

          return node;
        }),
};

// ---------------------------

const setBackground = (snippet = {}, isBackground = false) => {
  return function updateBackground(e) {
    console.log(
      `\n========== ${snippet.title}: ${
        isBackground ? 'remove' : 'set'
      } background ==========\n`,
    );
    if (isBackground) {
      document.body.style.backgroundImage = '';
      isBackground = false;
    }

    if (e.target.innerText.includes('set')) {
      document.body.style.backgroundImage = `url("data:image/svg+xml,${encodeURI(
        snippet.text,
      )}")`;
      e.target.innerText = 'remove background';
      isBackground = true;
    } else {
      e.target.innerText = 'set background';
    }
  };
};

const setIcon = (snippet = {}, isIcon = false) => {
  const iconEl = document.getElementById('icon');
  return function updateIcon(e) {
    console.log(
      `\n========== ${snippet.title}: ${isIcon ? 'remove' : 'set'} icon ==========\n`,
    );

    if (isIcon) {
      iconEl.href = './public/favicon.ico';
      isIcon = false;
    }

    if (e.target.innerText.includes('set')) {
      iconEl.href = `data:image/svg+xml,${encodeURI(snippet.text)}`;
      e.target.innerText = 'remove icon';
      isIcon = true;
    } else {
      e.target.innerText = 'set icon';
    }
  };
};

const newTab = (snippet = {}) => {
  return function openTab() {
    console.log(`\n========== ${snippet.title}: new tab ==========\n`);
    const x = window.open();
    x.document.open();
    x.document.write(snippet.text);
    x.document.close();
  };
};
