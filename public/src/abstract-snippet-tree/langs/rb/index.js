import { n } from '../../../utils/n.js';
import { txt } from '../txt.js';
import { runCode } from './run-code.js';

export const rb = {
  ...txt,

  className: (title = '') =>
    `match-braces language-ruby${
      title.toLowerCase().includes('.meta') ? ' meta-ruby' : ''
    }`,

  dangerZone: (snippet = { title: '', text: '' }) => [
    n('button', {}, 'run', () => runCode(snippet)),
  ],

  // jarConfig: (lang = '') => ({
  //   tab: '  ',
  //   // Ruby syntax highlighting hints
  //   keywords: [
  //     'def', 'class', 'module', 'if', 'else', 'elsif', 'unless', 'case', 'when',
  //     'while', 'until', 'for', 'in', 'do', 'begin', 'end', 'rescue', 'ensure',
  //     'return', 'yield', 'break', 'next', 'redo', 'retry', 'self', 'super',
  //     'nil', 'true', 'false', 'and', 'or', 'not', 'require', 'require_relative'
  //   ]
  // }),

  translate: ({ ast }) => ast,
};
