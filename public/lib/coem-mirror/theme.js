import { EditorView } from '@codemirror/basic-setup';

export const myTheme = EditorView.baseTheme({
  '.cm-content': {
    fontFamily: 'serif',
  },
  '&': {
    // backgroundColor: "#f9f9f9",
    padding: '1em',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
  '.cm-selectionMatch': {
    backgroundColor: '#e9e8f2 !important',
  },
});
