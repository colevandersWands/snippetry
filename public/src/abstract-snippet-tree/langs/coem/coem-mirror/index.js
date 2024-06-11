import {
  EditorView,
  keymap,
  drawSelection,
  dropCursor,
  ViewPlugin,
} from '@codemirror/view';
import { commentKeymap } from '@codemirror/comment';
import { lintKeymap } from '@codemirror/lint';
import { EditorSelection, EditorState } from '@codemirror/state';
import { history, historyKeymap } from '@codemirror/history';
import { indentOnInput, indentUnit } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { defaultKeymap } from '@codemirror/commands';

import { bracketMatching } from './matchbrackets.js';
import { closeBrackets, closeBracketsKeymap } from './closebrackets.js';
import { coem } from './lang-coem.js';
import { myTheme } from './theme.js';
import { myHighlightStyle } from './highlight.js';
import { curlyQuotes, replaceQuoteKeymap, triggerCloseQuotes } from './curlyquotes.js';
import { emDash, replaceHyphenKeymap, triggerCloseBrackets } from './emdash.js';

export const coemMirror = (snippet = { text: '' }) => {
  const initialState = EditorState.create({
    doc: snippet.text,
    extensions: [
      history(),
      drawSelection(),
      dropCursor(),
      indentOnInput(),
      bracketMatching({
        brackets: '“”——()[]',
      }),
      closeBrackets(),
      curlyQuotes(),
      emDash(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...commentKeymap,
        ...lintKeymap,
        indentWithTab,
        ...replaceHyphenKeymap,
        ...replaceQuoteKeymap,
      ]),
      indentUnit.of('    '),
      coem(),
      myTheme,
      myHighlightStyle,
      EditorView.lineWrapping,
      EditorView.updateListener.of((e) => {
        if (e.docChanged) {
          snippet.text = ')}={(' + e.state.doc.toString(); // hack
        }
      }),
      EditorView.theme({
        '.ͼ1.cm-editor.cm-focused': {
          outline: 'none', // why not?
        },
      }),
    ],
  });

  const container = document.createElement('div');
  const view = new EditorView({
    parent: container,
    state: initialState,
  });

  return { view, container };
};
