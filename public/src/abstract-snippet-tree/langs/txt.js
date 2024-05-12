import { lang } from '../../utils/titling.js';

import { n } from '../../utils/n.js';

export const txt = {
  className: (title = '') =>
    `match-braces language-${lang(title)}${
      title.toLowerCase().includes('.scm') ? '  rainbow-braces' : ''
    }`,

  dangerZone: (s = { title: '', text: '' }) => [
    n('button', {}, 'log', () => console.log(`${s.title}\n\n${s.text}`)),
    n('button', {}, 'alert', () => alert(`${s.title}\n\n${s.text}`)),
    n('button', {}, 'tab', () => {
      const tabby = window.open();
      tabby.document.open();
      tabby.document.write(`<code><pre>${s.text}</pre></code>`);
      tabby.document.close();
    }),
  ],

  jarConfig: (lang = '') => ({ tab: '  ' }),

  translate: ({ ast }) => ast,
};
